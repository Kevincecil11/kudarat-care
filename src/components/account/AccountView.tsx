"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { readOrders } from "@/lib/orders";
import { formatINR, formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { useAuth } from "@/lib/supabase/useAuth";
import type { Order } from "@/lib/types";
import { Field } from "../forms/Field";
import { Icon } from "../Icon";
import { SignInForm } from "./SignInForm";
import "../backend.css";

type DbOrder = {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  points_earned: number;
  order_items: { product_name: string; quantity: number }[];
};
type Ledger = { id: string; points: number; reason: string; note: string | null; created_at: string; expires_at: string | null };

const reasonLabel: Record<string, string> = {
  purchase: "Purchase",
  review_photo: "Photo review",
  review_video: "Video review",
  redeem: "Redeemed",
  reversal: "Refund adjustment",
  adjustment: "Adjustment",
  expiry: "Expired",
};

export function AccountView() {
  const { supabase, user, profile, ready, signOut, reloadProfile } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ledger, setLedger] = useState<Ledger[]>([]);
  const [balance, setBalance] = useState(0);
  const [guestOrders, setGuestOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGuestOrders(readOrders().filter((o) => o.status === "preview"));
  }, []);

  useEffect(() => {
    if (!supabase || !user) return;
    let alive = true;
    (async () => {
      const [o, l, b] = await Promise.all([
        supabase.from("orders").select("id, order_number, status, total, created_at, points_earned, order_items(product_name, quantity)").order("created_at", { ascending: false }).limit(50),
        supabase.from("reward_ledger").select("id, points, reason, note, created_at, expires_at").order("created_at", { ascending: false }).limit(50),
        supabase.from("reward_balances").select("balance").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!alive) return;
      setOrders(((o.data ?? []) as DbOrder[]).filter((x) => x.status !== "pending" && x.status !== "failed"));
      setLedger((l.data ?? []) as Ledger[]);
      setBalance((b.data as { balance: number } | null)?.balance ?? 0);
    })();
    return () => {
      alive = false;
    };
  }, [supabase, user]);

  const saveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !user) return;
    const f = new FormData(e.currentTarget);
    await supabase
      .from("profiles")
      .update({ full_name: String(f.get("full_name") ?? "").trim().slice(0, 120) || null, phone: String(f.get("phone") ?? "").trim().slice(0, 20) || null })
      .eq("id", user.id);
    await reloadProfile();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  if (!ready) return <div className="empty" aria-busy="true">Loading…</div>;

  if (!user) {
    return (
      <div className="auth">
        <SignInForm />
        <div className="auth__perks">
          <h2>Why create an account</h2>
          <ul>
            <li>
              <Icon name="gift" /> Earn and redeem {site.rewards.name} points
            </li>
            <li>
              <Icon name="box" /> Track orders and reorder favourites
            </li>
            <li>
              <Icon name="star" /> Share reviews and earn bonus points
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="account">
      <div className="account__grid">
        <section className="card points-card">
          <p className="eyebrow">{site.rewards.name}</p>
          <p className="points-card__value">{balance}</p>
          <p>points available (worth {formatINR(balance * site.rewards.pointValueInr)})</p>
          {ledger.length ? (
            <ul className="points-history">
              {ledger.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <span>
                    {reasonLabel[l.reason] ?? l.reason} <span className="muted">· {formatDate(l.created_at.slice(0, 10))}</span>
                  </span>
                  <b>{l.points > 0 ? `+${l.points}` : l.points}</b>
                </li>
              ))}
            </ul>
          ) : null}
          <Link href="/rewards" className="link">
            How points work <Icon name="arrow" size={16} />
          </Link>
        </section>
        <section className="card">
          <h2>Profile</h2>
          <p className="muted">{user.email}</p>
          <form className="form" onSubmit={saveProfile}>
            <Field label="Full name" htmlFor="p-name">
              <input id="p-name" name="full_name" className="input" defaultValue={profile?.full_name ?? ""} key={`n-${profile?.full_name ?? ""}`} autoComplete="name" />
            </Field>
            <Field label="Mobile number" htmlFor="p-phone">
              <input id="p-phone" name="phone" className="input" type="tel" defaultValue={profile?.phone ?? ""} key={`p-${profile?.phone ?? ""}`} autoComplete="tel" />
            </Field>
            <div className="form__actions">
              <button type="submit" className="btn btn-ghost">
                {saved ? "Saved" : "Save details"}
              </button>
              <button type="button" className="text-btn" onClick={signOut}>
                <Icon name="out" size={16} /> Sign out
              </button>
            </div>
          </form>
          {profile?.role === "admin" ? (
            <Link href="/admin" className="link">
              Open admin <Icon name="arrow" size={16} />
            </Link>
          ) : null}
        </section>
      </div>
      <section className="card">
        <h2>Your orders</h2>
        {orders.length || guestOrders.length ? (
          <ul className="order-list">
            {orders.map((o) => (
              <li key={o.id}>
                <div>
                  <b>{o.order_number}</b>
                  <span className="muted"> · {formatDate(o.created_at.slice(0, 10))}</span>
                </div>
                <span className="muted">{o.order_items.map((l) => `${l.product_name} × ${l.quantity}`).join(", ")}</span>
                <span>
                  {formatINR(o.total)} · <span className={`tag tag--${o.status}`}>{o.status}</span>
                </span>
              </li>
            ))}
            {guestOrders.map((o) => (
              <li key={o.id}>
                <div>
                  <b>{o.id}</b>
                  <span className="muted"> · {formatDate(o.date.slice(0, 10))}</span>
                </div>
                <span className="muted">{o.lines.map((l) => `${l.name} × ${l.qty}`).join(", ")}</span>
                <span>
                  {formatINR(o.total)} · <span className="tag">Preview</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            No orders yet. <Link href="/shop">Start shopping</Link>
          </p>
        )}
      </section>
    </div>
  );
}
