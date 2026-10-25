"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readOrders } from "@/lib/orders";
import { formatINR } from "@/lib/format";
import { site } from "@/lib/site";
import type { Order } from "@/lib/types";
import { Icon } from "../Icon";

export function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    const orders = readOrders();
    setOrder((id ? orders.find((o) => o.id === id) : orders[0]) ?? null);
  }, []);

  if (order === undefined) return <div className="empty" aria-busy="true">Loading…</div>;
  if (!order) {
    return (
      <div className="empty">
        <h2>We could not find that order</h2>
        <Link href="/account" className="btn btn-primary">
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="confirm card">
      <Icon name="check" size={34} />
      <h2>Thank you, {order.customer.name.split(" ")[0]}.</h2>
      <p>
        Order <b>{order.id}</b> {order.status === "preview" ? "was placed as a preview (no payment taken)." : "is confirmed."} A confirmation will be sent to {order.customer.email}.
      </p>
      <ul className="summary__lines">
        {order.lines.map((l) => (
          <li key={l.slug}>
            <span>
              {l.name} <span className="muted">× {l.qty}</span>
            </span>
            <span>{formatINR(l.price * l.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="confirm__total">
        Total paid <b>{formatINR(order.total)}</b>
      </p>
      <p className="summary__points">
        <Icon name="gift" size={18} /> {order.pointsEarned} {site.rewards.name} points will be added after delivery.
      </p>
      <div className="form__actions">
        <Link href="/account" className="btn btn-primary">
          Go to my account
        </Link>
        <Link href="/shop" className="btn btn-ghost">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
