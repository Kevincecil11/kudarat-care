import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { href?: string; label: string };

export function PageHero({ crumbs, title, lead, children }: { crumbs: Crumb[]; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section className="phero">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
