import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getPolicies, getPolicy } from "@/lib/repository";
import { paragraphs } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPolicies()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPolicy(slug);
  return p ? { title: p.title, description: p.summary, alternates: { canonical: `/policies/${p.slug}` } } : {};
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  const [policy, all] = await Promise.all([getPolicy(slug), getPolicies()]);
  if (!policy) notFound();
  return (
    <>
      <PageHero crumbs={[{ label: policy.title }]} title={policy.title} lead={policy.summary} />
      <section className="section">
        <div className="wrap policy">
          <nav className="policy__nav" aria-label="Policies">
            {all.map((p) => (
              <Link key={p.slug} href={`/policies/${p.slug}`} aria-current={p.slug === slug ? "page" : undefined}>
                {p.title}
              </Link>
            ))}
          </nav>
          <div className="article article--policy">
            {policy.sections.map((s, i) => (
              <section key={`${i}-${s.heading}`}>
                {s.heading ? <h2>{s.heading}</h2> : null}
                {paragraphs(s.body).map((p, j) => (
                  <p key={j} style={{ whiteSpace: "pre-line" }}>
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
