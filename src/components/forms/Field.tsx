import type { ReactNode } from "react";

export function Field({ label, htmlFor, hint, children, full = false }: { label: string; htmlFor: string; hint?: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "field field--full" : "field"}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}
