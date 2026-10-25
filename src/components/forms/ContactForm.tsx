"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Field } from "./Field";
import { Icon } from "../Icon";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Phase 2: saved to `contact_messages` and emailed to the team.
    setSent(true);
  };
  if (sent) {
    return (
      <div className="card form-done" role="status">
        <Icon name="check" size={28} />
        <h3>Thank you, we will be in touch soon.</h3>
        {site.isPreview ? <p className="notice">Preview: messages are delivered once the backend is connected.</p> : null}
      </div>
    );
  }
  return (
    <form className="card form" onSubmit={submit}>
      <div className="form__grid">
        <Field label="Name" htmlFor="m-name">
          <input id="m-name" name="name" className="input" required autoComplete="name" />
        </Field>
        <Field label="Phone or WhatsApp" htmlFor="m-phone">
          <input id="m-phone" name="phone" className="input" type="tel" autoComplete="tel" />
        </Field>
        <Field label="Email" htmlFor="m-email" full>
          <input id="m-email" name="email" className="input" type="email" required autoComplete="email" />
        </Field>
        <Field label="How can we help?" htmlFor="m-message" full>
          <textarea id="m-message" name="message" className="input" rows={5} required maxLength={1500} />
        </Field>
      </div>
      <button type="submit" className="btn btn-primary">
        Send message
      </button>
    </form>
  );
}
