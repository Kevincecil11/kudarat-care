"use client";
import { useEffect, useState } from "react";
import type { SectionProps } from "./shared";

type Counts = { products: number; low: { name: string; stock: number }[]; pendingReviews: number; ordersToday: number; toShip: number; newEnquiries: number };

export function Overview({ db, go }: SectionProps & { go: (s: string) => void }) {
  const [c, setC] = useState<Counts | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const head = { count: "exact" as const, head: true };
      const [p, low, rv, ot, ship, cr, be, cm] = await Promise.all([
        db.from("products").select("id", head),
        db.from("products").select("name, stock").lt("stock", 10).eq("is_active", true).order("stock"),
        db.from("reviews").select("id", head).eq("status", "pending"),
        db.from("orders").select("id", head).not("status", "in", "(pending,failed)").gte("created_at", today.toISOString()),
        db.from("orders").select("id", head).in("status", ["paid", "packed"]),
        db.from("consult_requests").select("id", head).eq("status", "new"),
        db.from("bulk_enquiries").select("id", head).eq("status", "new"),
        db.from("contact_messages").select("id", head).eq("status", "new"),
      ]);
      if (!alive) return;
      setC({
        products: p.count ?? 0,
        low: (low.data ?? []) as { name: string; stock: number }[],
        pendingReviews: rv.count ?? 0,
        ordersToday: ot.count ?? 0,
        toShip: ship.count ?? 0,
        newEnquiries: (cr.count ?? 0) + (be.count ?? 0) + (cm.count ?? 0),
      });
    })();
    return () => {
      alive = false;
    };
  }, [db]);

  if (!c) return <div className="empty" aria-busy="true">Loading…</div>;
  return (
    <>
      <h1>Good day.</h1>
      <div className="stats">
        <button type="button" className="stat" onClick={() => go("orders")}>
          <span>Orders to pack or ship</span>
          <b>{c.toShip}</b>
        </button>
        <button type="button" className="stat" onClick={() => go("orders")}>
          <span>Orders today</span>
          <b>{c.ordersToday}</b>
        </button>
        <button type="button" className="stat" onClick={() => go("reviews")}>
          <span>Reviews to approve</span>
          <b>{c.pendingReviews}</b>
        </button>
        <button type="button" className="stat" onClick={() => go("enquiries")}>
          <span>New enquiries</span>
          <b>{c.newEnquiries}</b>
        </button>
      </div>
      <div className="card">
        <h2>Low or out of stock</h2>
        {c.low.length ? (
          <ul className="plain-list">
            {c.low.map((r) => (
              <li key={r.name}>
                {r.name} <span className={r.stock === 0 ? "tag tag--rejected" : "tag tag--pending"}>{r.stock === 0 ? "Out of stock" : `${r.stock} left`}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Everything is well stocked.</p>
        )}
        <p className="muted">{c.products} products in the catalogue.</p>
      </div>
    </>
  );
}
