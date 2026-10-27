"use client";
import { useCallback, useEffect, useState } from "react";
import { formatINR } from "@/lib/format";
import { errText, Filters, StatusSelect, when, type SectionProps } from "./shared";

type Order = {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: { line1?: string; city?: string; state?: string; pincode?: string };
  subtotal: number;
  shipping_fee: number;
  points_redeemed: number;
  discount: number;
  total: number;
  tracking_url: string | null;
  created_at: string;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
};

const FLOW = ["paid", "packed", "shipped", "delivered", "cancelled", "refunded"];

export function Orders({ db, flash }: SectionProps) {
  const [filter, setFilter] = useState("open");
  const [orders, setOrders] = useState<Order[] | null>(null);

  const load = useCallback(async () => {
    let q = db
      .from("orders")
      .select("id, order_number, status, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_fee, points_redeemed, discount, total, tracking_url, created_at, order_items(product_name, quantity, unit_price)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (filter === "open") q = q.in("status", ["paid", "packed", "shipped"]);
    else if (filter === "done") q = q.in("status", ["delivered", "cancelled", "refunded"]);
    else if (filter === "unpaid") q = q.in("status", ["pending", "failed"]);
    const { data } = await q;
    setOrders((data ?? []) as Order[]);
  }, [db, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const update = async (o: Order, patch: { status?: string; tracking_url?: string | null }) => {
    const { error } = await db.from("orders").update(patch).eq("id", o.id);
    if (error) return flash(errText(error));
    flash(`Order ${o.order_number} updated`);
    await load();
  };

  return (
    <>
      <h1>Orders</h1>
      <Filters
        value={filter}
        onChange={setFilter}
        options={[
          { id: "open", label: "To fulfil" },
          { id: "done", label: "Completed" },
          { id: "unpaid", label: "Unpaid / failed" },
          { id: "all", label: "All" },
        ]}
      />
      {!orders ? (
        <div className="empty" aria-busy="true">
          Loading…
        </div>
      ) : orders.length ? (
        <div className="admin-list">
          {orders.map((o) => (
            <article key={o.id} className="card">
              <div className="rcard__top">
                <b>
                  {o.order_number} · {formatINR(o.total)}
                </b>
                <span className={`tag tag--${o.status}`}>{o.status}</span>
              </div>
              <p className="muted">{o.order_items.map((i) => `${i.product_name} × ${i.quantity}`).join(", ")}</p>
              <dl>
                <dt>Placed</dt>
                <dd>{when(o.created_at)}</dd>
                <dt>Customer</dt>
                <dd>
                  {o.customer_name} · <a href={`tel:${o.customer_phone}`}>{o.customer_phone}</a> · <a href={`mailto:${o.customer_email}`}>{o.customer_email}</a>
                </dd>
                <dt>Deliver to</dt>
                <dd>{[o.shipping_address?.line1, o.shipping_address?.city, o.shipping_address?.state, o.shipping_address?.pincode].filter(Boolean).join(", ")}</dd>
                <dt>Breakdown</dt>
                <dd>
                  Items {formatINR(o.subtotal)} · Shipping {o.shipping_fee ? formatINR(o.shipping_fee) : "free"}
                  {o.points_redeemed ? ` · ${o.points_redeemed} points used (−${formatINR(o.discount)})` : ""}
                </dd>
              </dl>
              {o.status !== "pending" && o.status !== "failed" ? (
                <div className="admin-row-actions" style={{ marginTop: 12 }}>
                  <StatusSelect label={`Status for ${o.order_number}`} value={o.status} options={FLOW} onChange={(v) => void update(o, { status: v })} />
                  <input
                    className="input input--sm"
                    placeholder="Tracking link"
                    defaultValue={o.tracking_url ?? ""}
                    aria-label={`Tracking link for ${o.order_number}`}
                    onBlur={(e) => {
                      const v = e.target.value.trim() || null;
                      if (v !== o.tracking_url) void update(o, { tracking_url: v });
                    }}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="card empty">
          <p>No orders here yet. Paid Razorpay orders show up automatically.</p>
        </div>
      )}
    </>
  );
}
