"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/format";
import { Field } from "./Field";
import { Icon } from "../Icon";

export function ConsultForm() {
  const [message, setMessage] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const text = [
      "Consultation request from the KudaratCare website",
      `Name: ${get("name")}`,
      `Age: ${get("age")}`,
      `WhatsApp: ${get("phone")}`,
      `Email: ${get("email") || "Not provided"}`,
      `Concern: ${get("concern")}`,
      `Details: ${get("details")}`,
      `Preferred time: ${get("time")}`,
    ].join("\n");
    setMessage(text);
    // Phase 2: also save to the `consult_requests` table before handing over to WhatsApp.
    if (site.clinic.whatsapp) window.open(whatsappLink(site.clinic.whatsapp, text), "_blank", "noopener,noreferrer");
  };

  if (message) {
    return (
      <div className="card form-done" role="status">
        <Icon name="check" size={28} />
        <h3>Thank you, your details are ready.</h3>
        {site.clinic.whatsapp ? (
          <p>WhatsApp has opened with your details for {site.clinic.name}. Please press send to share them.</p>
        ) : (
          <p className="notice">Preview: the clinic WhatsApp number will be connected before launch. This is the message that will be sent to {site.clinic.name}.</p>
        )}
        <pre className="message-preview">{message}</pre>
        <button type="button" className="btn btn-ghost" onClick={() => setMessage(null)}>
          Edit details
        </button>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={submit}>
      <div className="form__grid">
        <Field label="Full name" htmlFor="c-name">
          <input id="c-name" name="name" className="input" required autoComplete="name" />
        </Field>
        <Field label="Age" htmlFor="c-age">
          <input id="c-age" name="age" className="input" required inputMode="numeric" pattern="[0-9]{1,3}" maxLength={3} />
        </Field>
        <Field label="WhatsApp number" htmlFor="c-phone">
          <input id="c-phone" name="phone" className="input" required type="tel" autoComplete="tel" pattern="[0-9+ ]{10,15}" />
        </Field>
        <Field label="Email (optional)" htmlFor="c-email">
          <input id="c-email" name="email" className="input" type="email" autoComplete="email" />
        </Field>
        <Field label="Area of concern" htmlFor="c-concern">
          <select id="c-concern" name="concern" className="input" required defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            <option>Skin</option>
            <option>Hair and scalp</option>
            <option>Product guidance</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Preferred time to be contacted" htmlFor="c-time">
          <select id="c-time" name="time" className="input" required defaultValue="">
            <option value="" disabled>
              Choose a time
            </option>
            <option>Morning (10 am to 1 pm)</option>
            <option>Afternoon (1 pm to 5 pm)</option>
            <option>Evening (5 pm to 8 pm)</option>
          </select>
        </Field>
        <Field label="Tell us a little about your concern" htmlFor="c-details" full>
          <textarea id="c-details" name="details" className="input" rows={5} required maxLength={1000} />
        </Field>
      </div>
      <label className="check">
        <input type="checkbox" required name="consent" />
        <span>I agree to share these details with {site.clinic.name} so they can contact me about this consultation.</span>
      </label>
      <button className="btn btn-primary" type="submit">
        <Icon name="chat" size={18} /> Send to the clinic on WhatsApp
      </button>
      <p className="form__note">This form is for consultation requests, not medical emergencies.</p>
    </form>
  );
}
