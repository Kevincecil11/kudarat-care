"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { formatINR, pointsFor, shippingFor } from "@/lib/format";
import { newOrderId, saveOrder } from "@/lib/orders";
import { useAuth } from "@/lib/supabase/useAuth";
import type { Order } from "@/lib/types";
import { useCart } from "./CartProvider";
import { Field } from "../forms/Field";
import { Icon } from "../Icon";
import "../backend.css";

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const livePayments = Boolean(RAZORPAY_KEY) && !site.isPreview;

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutView() {
  const { detailed, subtotal, clear, ready, lines } = useCart();
  const router = useRouter();
  const { supabase, session, profile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const r = site.rewards;
  const shipping = shippingFor(subtotal);
  const canRedeem = livePayments && balance >= r.minRedeem;
  const redeem = canRedeem && usePoints ? Math.min(balance, Math.floor(subtotal / r.pointValueInr)) : 0;
  const discount = Math.floor(redeem * r.pointValueInr);
  const total = subtotal + shipping - discount;

  useEffect(() => {
    if (!supabase || !session) return;
    supabase
      .from("reward_balances")
      .select("balance")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setBalance((data as { balance: number } | null)?.balance ?? 0));
  }, [supabase, session]);

  if (!ready) return <div className="empty" aria-busy="true">Loading checkout…</div>;
  if (!detailed.length) {
    return (
      <div className="empty">
        <h2>Your bag is empty</h2>
        <Link href="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  const complete = (customer: Order["customer"], id: string, status: Order["status"], paid?: { total: number; pointsEarned: number }) => {
    const order: Order = {
      id,
      date: new Date().toISOString(),
      lines: detailed.map((l) => ({ slug: l.product.slug, name: l.product.name, qty: l.qty, price: l.product.price })),
      subtotal,
      shipping,
      total: paid?.total ?? total,
      pointsEarned: paid?.pointsEarned ?? pointsFor(total),
      customer,
      status,
    };
    saveOrder(order);
    clear();
    router.push(`/order-confirmation?id=${encodeURIComponent(order.id)}`);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const customer = { name: get("name"), email: get("email"), phone: get("phone"), city: get("city"), pincode: get("pincode") };
    const address = { line1: get("address"), city: get("city"), state: get("state"), pincode: get("pincode") };
    setBusy(true);

    if (!livePayments) {
      // Preview: no payment is taken. The full Razorpay flow below runs once keys are configured.
      setTimeout(() => complete(customer, newOrderId(), "preview"), 600);
      return;
    }

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ lines, customer, address, redeemPoints: redeem > 0 }),
      });
      if (!res.ok) {
        const msg = ((await res.json().catch(() => ({}))) as { error?: string }).error;
        setError(msg ?? "Something went wrong starting the payment. Please try again.");
        setBusy(false);
        return;
      }
      const data: { orderId: string; amount: number; currency: string; receipt: string } = await res.json();
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Payment window failed to load");
      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: site.name,
        description: "Order " + data.receipt,
        order_id: data.orderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: "#0D4A4A" },
        handler: async (response: Record<string, string>) => {
          const verify = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verify.ok) {
            const v = (await verify.json()) as { orderNumber: string; pointsEarned: number; total: number };
            complete(customer, v.orderNumber, "paid", { total: v.total, pointsEarned: v.pointsEarned });
          } else {
            setError("We could not confirm your payment. If money was deducted, it will be refunded automatically.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch {
      setError("Something went wrong starting the payment. Please try again.");
      setBusy(false);
    }
  };

  return (
    <form className="checkout" onSubmit={submit}>
      <div className="checkout__main">
        <section className="card form">
          <h2 className="form__title">Contact</h2>
          <div className="form__grid">
            <Field label="Full name" htmlFor="o-name">
              <input id="o-name" name="name" className="input" required autoComplete="name" defaultValue={profile?.full_name ?? ""} key={`n-${profile?.id ?? ""}`} />
            </Field>
            <Field label="Mobile number" htmlFor="o-phone">
              <input id="o-phone" name="phone" className="input" required type="tel" autoComplete="tel" pattern="[0-9+ ]{10,15}" defaultValue={profile?.phone ?? ""} key={`p-${profile?.id ?? ""}`} />
            </Field>
            <Field label="Email" htmlFor="o-email" full>
              <input id="o-email" name="email" className="input" required type="email" autoComplete="email" defaultValue={session?.user.email ?? ""} key={`e-${profile?.id ?? ""}`} />
            </Field>
          </div>
        </section>
        <section className="card form">
          <h2 className="form__title">Delivery address</h2>
          <div className="form__grid">
            <Field label="Address" htmlFor="o-address" full>
              <textarea id="o-address" name="address" className="input" rows={3} required autoComplete="street-address" />
            </Field>
            <Field label="City" htmlFor="o-city">
              <input id="o-city" name="city" className="input" required autoComplete="address-level2" />
            </Field>
            <Field label="State" htmlFor="o-state">
              <select id="o-state" name="state" className="input" required defaultValue="Gujarat" autoComplete="address-level1">
                {STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="PIN code" htmlFor="o-pin">
              <input id="o-pin" name="pincode" className="input" required inputMode="numeric" pattern="[1-9][0-9]{5}" maxLength={6} autoComplete="postal-code" />
            </Field>
          </div>
        </section>
      </div>
      <aside className="summary card" aria-label="Order summary">
        <h2>Your order</h2>
        <ul className="summary__lines">
          {detailed.map((l) => (
            <li key={l.product.slug}>
              <span>
                {l.product.name} <span className="muted">× {l.qty}</span>
              </span>
              <span>{formatINR(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatINR(subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{shipping ? formatINR(shipping) : "Free"}</dd>
          </div>
          {discount ? (
            <div>
              <dt>
                {r.name} points ({redeem})
              </dt>
              <dd>−{formatINR(discount)}</dd>
            </div>
          ) : null}
          <div className="summary__total">
            <dt>Total</dt>
            <dd>{formatINR(total)}</dd>
          </div>
        </dl>
        {canRedeem ? (
          <label className="points-toggle">
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
            <span>
              Use my {r.name} points ({balance} available, worth {formatINR(Math.floor(balance * r.pointValueInr))})
            </span>
          </label>
        ) : null}
        {!session && livePayments ? (
          <p className="summary__note">
            <Link href="/account">Sign in</Link> to earn {r.name} points on this order.
          </p>
        ) : null}
        {error ? (
          <p className="form__error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Processing…" : livePayments ? `Pay ${formatINR(total)}` : "Place preview order"}
        </button>
        <p className="summary__note">
          <Icon name="shield" size={16} /> {livePayments ? "Secure payment by Razorpay. Prices include applicable taxes." : "Preview: no payment is taken. Razorpay connects at launch."}
        </p>
      </aside>
    </form>
  );
}
