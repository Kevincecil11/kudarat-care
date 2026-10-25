import type { Metadata } from "next";
import Link from "next/link";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Icon } from "@/components/Icon";
import { JournalCard } from "@/components/JournalCard";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { ReviewCard } from "@/components/ReviewCard";
import { getPosts, getProducts, getReviews } from "@/lib/repository";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "KudaratCare | Natural Herbal Skin & Hair Care" },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, posts, reviews] = await Promise.all([getProducts(), getPosts(), getReviews()]);
  const tabs = [
    { id: "best", label: "Bestsellers", products: products.filter((p) => p.featured) },
    { id: "skin", label: "Skin", products: products.filter((p) => p.category === "skin-care") },
    { id: "hair", label: "Hair", products: products.filter((p) => p.category === "hair-care") },
  ];
  const r = site.rewards;

  return (
    <>
      <section className="hero">
        <Photo k="hero" priority className="hero__media" sizes="(max-width: 760px) 100vw, 62vw" alt="A smiling woman resting at a sunlit table" />
        <div className="wrap">
          <div className="hero__copy">
            <h1>
              Good care
              <br />
              starts with you.
            </h1>
            <p>Skin, hair and a little guidance.</p>
            <div className="hero__cta">
              <Link href="/shop" className="btn btn-primary">
                Shop the range
              </Link>
              <Link href="/consult" className="link">
                Consult a doctor <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="values" aria-label="What makes KudaratCare different">
        <div className="wrap values__in">
          {site.values.map((v) => (
            <div key={v.title} className="value">
              <Icon name="leaf" size={18} />
              <span>{v.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Your everyday essentials</h2>
            <Link href="/shop" className="link">
              Visit the shop <Icon name="arrow" size={16} />
            </Link>
          </div>
          <CategoryTabs tabs={tabs} />
        </div>
      </section>

      <section className="split split--sage">
        <Photo k="consult" className="split__media" sizes="(max-width: 760px) 100vw, 50vw" alt="A doctor in conversation with a patient" />
        <div className="split__copy">
          <p className="eyebrow">Consult a Doctor</p>
          <h2>A little guidance goes a long way.</h2>
          <p>Share a few details about your skin or hair, and {site.clinic.name} will get in touch on WhatsApp.</p>
          <Link href="/consult" className="btn btn-primary">
            Request a consultation <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head section__head--center">
            <p className="eyebrow">{r.name}</p>
            <h2>Rewards that come back to you.</h2>
          </div>
          <ol className="steps">
            {[
              { t: "Purchase", d: "Shop your favourites as usual.", i: "bag" as const },
              { t: "Earn points", d: `${r.pointsPer100} points for every ₹100 you spend.`, i: "gift" as const },
              { t: "Redeem", d: `Use points on your next order from ${r.minRedeem} points.`, i: "check" as const },
              { t: "Repeat", d: "Bonus points for approved photo and video reviews.", i: "star" as const },
            ].map((s, i) => (
              <li key={s.t} className="step">
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <Icon name={s.i} size={22} />
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="center">
            <Link href="/rewards" className="link">
              How {r.name} works <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="wrap">
          <div className="section__head">
            <h2>Kind words</h2>
            <Link href="/reviews" className="link">
              All reviews <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="grid-3">
            {reviews.slice(0, 3).map((rv) => (
              <ReviewCard key={rv.id} review={rv} productName={products.find((p) => p.slug === rv.productSlug)?.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <h2>Kudarat Care Journal</h2>
            <Link href="/journal" className="link">
              Read the Journal <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="grid-journal">
            {posts.slice(0, 3).map((p) => (
              <JournalCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="social">
        <div className="wrap social__in">
          <div>
            <h2>Follow along</h2>
            <p>Rituals, routines and new launches on Instagram and YouTube.</p>
          </div>
          <div className="social__links">
            {[
              { label: "Instagram", href: site.social.instagram, icon: "instagram" as const },
              { label: "YouTube", href: site.social.youtube, icon: "youtube" as const },
              { label: "Google Reviews", href: site.social.googleReviews, icon: "google" as const },
            ].map((s) =>
              s.href ? (
                <a key={s.label} href={s.href} className="btn btn-light" target="_blank" rel="noopener noreferrer">
                  <Icon name={s.icon} size={18} /> {s.label}
                </a>
              ) : (
                <span key={s.label} className="btn btn-light is-pending" title="Link pending">
                  <Icon name={s.icon} size={18} /> {s.label}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <div>
              <p className="eyebrow">For consultants, retailers and bulk buyers</p>
              <h2>Bring KudaratCare to your customers.</h2>
            </div>
            <Link href="/bulk-orders" className="btn btn-primary">
              Enquire about bulk pricing
            </Link>
          </div>
        </div>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url }} />
    </>
  );
}
