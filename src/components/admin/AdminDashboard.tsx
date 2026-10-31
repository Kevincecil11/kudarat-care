"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { useAuth } from "@/lib/supabase/useAuth";
import { Icon, type IconName } from "../Icon";
import { SignInForm } from "../account/SignInForm";
import { Enquiries } from "./Enquiries";
import { Journal } from "./Journal";
import { Orders } from "./Orders";
import { Overview } from "./Overview";
import { Policies } from "./Policies";
import { Products } from "./Products";
import { Reviews } from "./Reviews";
import { Rewards } from "./Rewards";
import { Settings } from "./Settings";
import "../backend.css";

type Section = "overview" | "products" | "orders" | "reviews" | "journal" | "rewards" | "enquiries" | "policies" | "settings";

const sections: { id: Section; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "orders", label: "Orders", icon: "bag" },
  { id: "products", label: "Products & stock", icon: "box" },
  { id: "reviews", label: "Reviews", icon: "star" },
  { id: "enquiries", label: "Enquiries", icon: "inbox" },
  { id: "journal", label: "Journal", icon: "book" },
  { id: "rewards", label: "KC Circle", icon: "gift" },
  { id: "policies", label: "Policies", icon: "shield" },
  { id: "settings", label: "Site settings", icon: "settings" },
];

export function AdminDashboard() {
  const { supabase, session, user, isAdmin, profile, ready, signOut } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [saved, setSaved] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "");
    const match = sections.find((s) => s.id === fromHash);
    if (match) setSection(match.id);
  }, []);

  const go = (s: string) => {
    const match = sections.find((x) => x.id === s);
    if (!match) return;
    setSection(match.id);
    window.history.replaceState(null, "", `#${match.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const flash = (msg: string) => {
    setSaved(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setSaved(null), 3600);
  };

  // Rebuilds the live site so new products, articles, policies and settings appear (about a minute).
  const publish = async () => {
    if (site.isPreview) {
      flash("On the preview, run the Private preview workflow on GitHub to refresh the pages.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/publish", { method: "POST", headers: session ? { Authorization: `Bearer ${session.access_token}` } : {} });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      flash(res.ok ? "Publishing started. The website updates in about a minute." : body.error ?? "Could not publish right now");
    } finally {
      setPublishing(false);
    }
  };

  if (!supabase) return <div className="card empty">The admin needs the database connection. Add the Supabase keys to this build.</div>;
  if (!ready || (user && !profile)) return <div className="empty" aria-busy="true">Loading…</div>;
  if (!user) {
    return (
      <div className="auth">
        <SignInForm title="KudaratCare admin" lead="Sign in with your admin email. We will send you a secure login link." />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="card empty">
        <h2>No admin access</h2>
        <p className="muted">{user.email} is signed in but is not an admin. Ask the site owner to add this email under Site settings.</p>
        <button type="button" className="btn btn-ghost" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  const props = { db: supabase, flash };
  return (
    <div className="admin">
      <aside className="admin__side" aria-label="Admin sections">
        <p className="admin__brand">KudaratCare Admin</p>
        <nav>
          {sections.map((s) => (
            <button key={s.id} type="button" className={section === s.id ? "is-active" : undefined} aria-current={section === s.id ? "page" : undefined} onClick={() => go(s.id)}>
              <Icon name={s.icon} size={18} />
              <span>{s.label}</span>
            </button>
          ))}
          <button type="button" onClick={() => void publish()} disabled={publishing}>
            <Icon name="arrow" size={18} />
            <span>{publishing ? "Publishing…" : "Publish changes"}</span>
          </button>
          <button type="button" onClick={signOut}>
            <Icon name="out" size={18} />
            <span>Sign out</span>
          </button>
        </nav>
      </aside>

      <div className="admin__main">
        {section === "overview" ? <Overview {...props} go={go} /> : null}
        {section === "products" ? <Products {...props} /> : null}
        {section === "orders" ? <Orders {...props} /> : null}
        {section === "reviews" ? <Reviews {...props} /> : null}
        {section === "journal" ? <Journal {...props} /> : null}
        {section === "rewards" ? <Rewards {...props} /> : null}
        {section === "enquiries" ? <Enquiries {...props} /> : null}
        {section === "policies" ? <Policies {...props} /> : null}
        {section === "settings" ? <Settings {...props} /> : null}
      </div>
      <div className={saved ? "toast is-on" : "toast"} role="status" aria-live="polite">
        {saved}
      </div>
    </div>
  );
}
