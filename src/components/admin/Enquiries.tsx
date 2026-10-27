"use client";
import { useCallback, useEffect, useState } from "react";
import { whatsappLink } from "@/lib/format";
import { errText, Filters, StatusSelect, when, type SectionProps } from "./shared";

type Kind = "consult" | "bulk" | "contact";
const TABLE: Record<Kind, string> = { consult: "consult_requests", bulk: "bulk_enquiries", contact: "contact_messages" };
const STATUSES: Record<Kind, string[]> = { consult: ["new", "contacted", "closed"], bulk: ["new", "contacted", "quoted", "won", "closed"], contact: ["new", "replied", "closed"] };

type Item = { id: string; status: string; created_at: string; name: string; phone?: string | null; email?: string | null; [key: string]: unknown };

const LABELS: Record<string, string> = {
  age: "Age",
  phone: "Phone",
  email: "Email",
  concern: "Concern",
  details: "Details",
  preferred_time: "Preferred time",
  enquiry_type: "Type",
  business_name: "Business",
  product_of_interest: "Product",
  quantity: "Quantity",
  expected_budget: "Budget",
  delivery_address: "Deliver to",
  required_by: "Needed by",
  notes: "Notes",
  message: "Message",
};

export function Enquiries({ db, flash }: SectionProps) {
  const [kind, setKind] = useState<Kind>("consult");
  const [items, setItems] = useState<Item[] | null>(null);

  const load = useCallback(async () => {
    setItems(null);
    const { data } = await db.from(TABLE[kind]).select("*").order("created_at", { ascending: false }).limit(200);
    setItems((data ?? []) as Item[]);
  }, [db, kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (it: Item, status: string) => {
    const { error } = await db.from(TABLE[kind]).update({ status }).eq("id", it.id);
    if (error) return flash(errText(error));
    flash("Updated");
    await load();
  };

  return (
    <>
      <h1>Enquiries</h1>
      <Filters
        value={kind}
        onChange={(v) => setKind(v as Kind)}
        options={[
          { id: "consult", label: "Consult a Doctor" },
          { id: "bulk", label: "Bulk & consultants" },
          { id: "contact", label: "Contact messages" },
        ]}
      />
      {!items ? (
        <div className="empty" aria-busy="true">
          Loading…
        </div>
      ) : items.length ? (
        <div className="admin-list">
          {items.map((it) => (
            <article key={it.id} className="card">
              <div className="rcard__top">
                <b>{it.name}</b>
                <span className={`tag tag--${it.status}`}>{it.status}</span>
              </div>
              <dl>
                <dt>Received</dt>
                <dd>{when(it.created_at)}</dd>
                {Object.entries(LABELS).map(([k, label]) =>
                  it[k] !== undefined && it[k] !== null && it[k] !== "" ? (
                    <div key={k} style={{ display: "contents" }}>
                      <dt>{label}</dt>
                      <dd>{String(it[k])}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              <div className="admin-row-actions" style={{ marginTop: 12 }}>
                <StatusSelect label={`Status for ${it.name}`} value={it.status} options={STATUSES[kind]} onChange={(v) => void setStatus(it, v)} />
                {it.phone ? (
                  <a className="btn btn-ghost" href={whatsappLink(String(it.phone), `Hello ${it.name}, this is KudaratCare.`)} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                ) : null}
                {it.email ? (
                  <a className="btn btn-ghost" href={`mailto:${String(it.email)}`}>
                    Email
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card empty">
          <p>No enquiries yet.</p>
        </div>
      )}
    </>
  );
}
