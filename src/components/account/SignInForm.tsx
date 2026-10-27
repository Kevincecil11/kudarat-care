"use client";
import { useState, type FormEvent } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Field } from "../forms/Field";

// Passwordless sign-in: Supabase emails a secure one-time link that brings the user back to this page.
export function SignInForm({ title = "Sign in or create an account", lead = "We will email you a secure login link. No password needed." }: { title?: string; lead?: string }) {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim().toLowerCase();
    if (!supabase) {
      setError("Sign-in is not connected on this build.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href.split("#")[0], shouldCreateUser: true },
    });
    setBusy(false);
    if (err) {
      setError(err.status === 429 ? "Too many login emails were sent. Please wait a few minutes and try again." : "We could not send the login link. Please check the email and try again.");
      return;
    }
    setSentTo(email);
  };

  if (sentTo) {
    return (
      <div className="card form" role="status">
        <h2 className="form__title">Check your inbox</h2>
        <p>
          We sent a login link to <b>{sentTo}</b>. Open it on this device to sign in. It may take a minute, and it can land in spam.
        </p>
        <button type="button" className="text-btn" onClick={() => setSentTo(null)}>
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2 className="form__title">{title}</h2>
      <p className="muted">{lead}</p>
      <Field label="Email" htmlFor="a-email">
        <input id="a-email" name="email" type="email" className="input" required autoComplete="email" />
      </Field>
      {error ? (
        <p className="form__error" role="alert">
          {error}
        </p>
      ) : null}
      <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
        {busy ? "Sending link…" : "Email me a login link"}
      </button>
    </form>
  );
}
