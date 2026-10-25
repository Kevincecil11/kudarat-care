"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/format";
import { Field } from "./Field";
import { Icon } from "../Icon";

export function BulkForm({ productNames }: { productNames: string[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const text = [
      "Bulk / consultant enquiry from the KudaratCare website",
      `Enquiry type: ${get("type")}`,
      `Name: ${get("name")}`,
      `Business name: ${get("business")}`,
      `WhatsApp: ${get("phone")}`,
      `Email: ${get("email")}`,
      `Product of interest: ${get("product")}`,
      `Quantity required: ${get("quantity")}`,
      `Expected budget: ${get("budget")}`,
      `Delivery address: ${get("address")}`,
      `Required delivery date: ${get("date")}`,
    ].join("\n");
    setSummary(text);
    // Phase 2: saved to `bulk_enquiries` and shown in the admin; team notified by email/WhatsApp.
  };

  if (summary) {
    return (
      <div className="card form-done" role="status">
        <Icon name="check" size={28} />
        <h3>Thank you, we have your enquiry.</h3>
        <p>The KudaratCare team will get back to you with pricing and availability.</p>
        {site.isPreview ? <p className="notice">Preview: enquiries are stored and shown in the admin once Supabase is connected.</p> : null}
        <pre className="message-preview">{summary}</pre>
        <div className="form__actions">
          {site.contact.whatsapp ? (
            <a className="btn btn-primary" href={whatsappLink(site.contact.whatsapp, summary)} target="_blank" rel="noopener noreferrer">
              Also send on WhatsApp
            </a>
          ) : null}
          <button type="button" className="btn btn-ghost" onClick={() => setSummary(null)}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={submit}>
      <fieldset className="radio-row">
        <legend>I am a</legend>
        {["Consultant", "Retailer", "Reseller", "Bulk buyer"].map((t, i) => (
          <label key={t} className="radio-pill">
            <input type="radio" name="type" value={t} defaultChecked={i === 0} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <div className="form__grid">
        <Field label="Name" htmlFor="b-name">
          <input id="b-name" name="name" className="input" required autoComplete="name" />
        </Field>
        <Field label="Business name" htmlFor="b-business">
          <input id="b-business" name="business" className="input" required autoComplete="organization" />
        </Field>
        <Field label="WhatsApp number" htmlFor="b-phone">
          <input id="b-phone" name="phone" type="tel" className="input" required autoComplete="tel" pattern="[0-9+ ]{10,15}" />
        </Field>
        <Field label="Email" htmlFor="b-email">
          <input id="b-email" name="email" type="email" className="input" required autoComplete="email" />
        </Field>
        <Field label="Product of interest" htmlFor="b-product">
          <select id="b-product" name="product" className="input" required defaultValue="">
            <option value="" disabled>
              Choose a product
            </option>
            {productNames.map((n) => (
              <option key={n}>{n}</option>
            ))}
            <option>Multiple products</option>
          </select>
        </Field>
        <Field label="Quantity required" htmlFor="b-qty">
          <input id="b-qty" name="quantity" className="input" required inputMode="numeric" placeholder="e.g. 100 units" />
        </Field>
        <Field label="Expected budget" htmlFor="b-budget">
          <input id="b-budget" name="budget" className="input" required placeholder="e.g. ₹25,000" />
        </Field>
        <Field label="Required delivery date" htmlFor="b-date">
          <input id="b-date" name="date" type="date" className="input" required min={today} />
        </Field>
        <Field label="Delivery address" htmlFor="b-address" full>
          <textarea id="b-address" name="address" className="input" rows={3} required autoComplete="street-address" />
        </Field>
      </div>
      <button className="btn btn-primary" type="submit">
        Send enquiry
      </button>
    </form>
  );
}
