"use client";

// Shown instead of a blank page if anything in the admin breaks, with enough detail to fix it.
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section section--tight">
      <div className="wrap">
        <div className="card">
          <h2>Something went wrong in the admin</h2>
          <p className="muted">Please try again. If it keeps happening, send this message to MTRX Digital.</p>
          <pre id="admin-error" style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>
            {error.message}
            {"\n"}
            {(error.stack ?? "").split("\n").slice(0, 8).join("\n")}
          </pre>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
