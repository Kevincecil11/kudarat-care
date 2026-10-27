"use client";
import { useState, type FormEvent } from "react";
import { clean, orNull, saveSubmission } from "@/lib/submit";
import { Field } from "./Field";
import { Icon } from "../Icon";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    setBusy(true);
    const res = await saveSubmission("contact_messages", {
      name: clean(get("name"), 80),
      email: clean(get("email"), 160),
      phone: orNull(get("phone")),
      message: clean(get("message"), 2000),
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card form-done" role="status">
        <Icon name="check" size={28} />
        <h3>Thank you, we will be in touch soon.</h3>
      </div>
    );
  }
  return (
    <form className="card form" onSubmit={submit}>
      <div className="form__grid">
        <Field label="Name" htmlFor="m-name">
          <input id="m-name" name="name" className="input" required autoComplete="name" maxLength={80} />
        </Field>
        <Field label="Phone or WhatsApp" htmlFor="m-phone">
          <input id="m-phone" name="phone" className="input" type="tel" autoComplete="tel" maxLength={20} />
        </Field>
        <Field label="Email" htmlFor="m-email" full>
          <input id="m-email" name="email" className="input" type="email" required autoComplete="email" />
        </Field>
        <Field label="How can we help?" htmlFor="m-message" full>
          <textarea id="m-message" name="message" className="input" rows={5} required maxLength={1500} />
        </Field>
      </div>
      {error ? (
        <p className="form__error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
