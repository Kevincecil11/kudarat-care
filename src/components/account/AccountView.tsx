"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { readOrders } from "@/lib/orders";
import { formatINR, formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import type { Order } from "@/lib/types";
import { Field } from "../forms/Field";
import { Icon } from "../Icon";

const USER_KEY = "kc_preview_user";

export function AccountView() {
  const [email, setEmail] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setEmail(window.localStorage.getItem(USER_KEY));
    } catch {
      /* storage unavailable */
    }
    setOrders(readOrders());
    setReady(true);
  }, []);

  const signIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    // Phase 2: supabase.auth.signInWithOtp({ email }) sends a secure login link.
    setSent(true);
    setTimeout(() => {
      try {
        window.localStorage.setItem(USER_KEY, value);
      } catch {
        /* storage unavailable */
      }
      setEmail(value);
    }, 700);
  };

  const signOut = () => {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable */
    }
    setEmail(null);
    setSent(false);
  };

  if (!ready) return <div className="empty" aria-busy="true">Loading…</div>;

  if (!email) {
    return (
      <div className="auth">
        <form className="card form" onSubmit={signIn}>
          <h2 className="form__title">Sign in or create an account</h2>
          <p className="muted">We will email you a secure login link. No password needed.</p>
          <Field label="Email" htmlFor="a-email">
            <input id="a-email" name="email" type="email" className="input" required autoComplete="email" />
          </Field>
          <button className="btn btn-primary btn-block" type="submit" disabled={sent}>
            {sent ? "Sending link…" : "Email me a login link"}
          </button>
          {site.isPreview ? <p className="notice">Preview: you are signed in instantly. Real email login connects with Supabase Auth.</p> : null}
        </form>
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

  const points = orders.reduce((n, o) => n + o.pointsEarned, 0);

  return (
    <div className="account">
      <div className="account__grid">
        <section className="card points-card">
          <p className="eyebrow">{site.rewards.name}</p>
          <p className="points-card__value">{points}</p>
          <p>points available (worth {formatINR(points * site.rewards.pointValueInr)})</p>
          <Link href="/rewards" className="link">
            How points work <Icon name="arrow" size={16} />
          </Link>
        </section>
        <section className="card">
          <h2>Profile</h2>
          <p className="muted">{email}</p>
          <button type="button" className="text-btn" onClick={signOut}>
            <Icon name="out" size={16} /> Sign out
          </button>
        </section>
      </div>
      <section className="card">
        <h2>Your orders</h2>
        {orders.length ? (
          <ul className="order-list">
            {orders.map((o) => (
              <li key={o.id}>
                <div>
                  <b>{o.id}</b>
                  <span className="muted"> · {formatDate(o.date.slice(0, 10))}</span>
                </div>
                <span className="muted">{o.lines.map((l) => `${l.name} × ${l.qty}`).join(", ")}</span>
                <span>
                  {formatINR(o.total)} · <span className="tag">{o.status === "preview" ? "Preview" : o.status}</span>
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
