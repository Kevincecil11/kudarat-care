import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "KC Circle Rewards",
  description: "Join KC Circle, the KudaratCare rewards programme. Purchase, earn points, redeem and repeat.",
  alternates: { canonical: "/rewards" },
};

export default function RewardsPage() {
  const r = site.rewards;
  const faqs = [
    { q: "How do I join?", a: "Create a free account. Every order you place while signed in earns points automatically." },
    { q: "When are points added?", a: "Points are added once your order is delivered, so returns and cancellations stay simple." },
    { q: "How do I redeem?", a: `Once you have ${r.minRedeem} points, apply them at checkout. Each point is worth ₹${r.pointValueInr}.` },
    { q: "Do points expire?", a: `Points are valid for ${r.expiryMonths} months from the date they are earned.` },
    { q: "How do review points work?", a: `Approved photo reviews earn ${r.photoReviewBonus} points and video reviews ${r.videoReviewBonus} points, whatever your rating.` },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: r.name }]} title={<>{r.name}. Rewards that come back to you.</>} lead="Purchase, earn points, redeem and repeat. Simple to understand, easy to use." />
      <section className="section">
        <div className="wrap">
          <ol className="steps">
            {[
              { t: "Purchase", d: "Shop while signed in to your account.", i: "bag" as const },
              { t: "Earn", d: `${r.pointsPer100} points for every ₹100 spent.`, i: "gift" as const },
              { t: "Redeem", d: `Use points at checkout from ${r.minRedeem} points.`, i: "check" as const },
              { t: "Repeat", d: "Earn bonus points for photo and video reviews.", i: "star" as const },
            ].map((s, i) => (
              <li key={s.t} className="step">
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <Icon name={s.i} size={22} />
                <h2>{s.t}</h2>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          {r.pending ? <p className="notice center">Proposed rules shown for the preview. Final values are set by KudaratCare in the admin.</p> : null}
        </div>
      </section>
      <section className="section section--ivory">
        <div className="wrap wrap--narrow">
          <h2>Questions</h2>
          <div className="details">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="form__actions">
            <Link href="/account" className="btn btn-primary">
              Join {r.name}
            </Link>
            <Link href="/shop" className="btn btn-ghost">
              Start shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
