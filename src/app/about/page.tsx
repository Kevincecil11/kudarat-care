import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { getAdvisors } from "@/lib/repository";
import { paragraphs, pending, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story, vision and values behind KudaratCare: natural, herbal, vegan and cruelty-free skin and hair care.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const advisors = await getAdvisors();
  const a = site.about;
  const story = paragraphs(a.text);
  const vision = paragraphs(a.vision);
  const note = paragraphs(a.founderNote);

  return (
    <>
      <PageHero crumbs={[{ label: "About" }]} title={<>Care that feels human.</>} lead="Natural, herbal skin and hair care made with kindness to people, animals and the planet." />

      <section className="section">
        <div className="wrap about-intro">
          <div>
            <p className="eyebrow">Our story & vision</p>
            <h2>Rooted in nature. Made for everyday life.</h2>
            {story.length ? (
              story.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className="lead">KudaratCare&apos;s About Us text will appear here, in the brand&apos;s own words.</p>
                <p className="muted">{pending}.</p>
              </>
            )}
            {vision.length ? (
              <>
                <h3>Our vision</h3>
                {vision.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </>
            ) : null}
          </div>
          <Photo k="botanical" className="about-intro__img" sizes="(max-width: 760px) 92vw, 44vw" />
        </div>
      </section>

      <section className="section section--sage">
        <div className="wrap">
          <div className="section__head section__head--center">
            <p className="eyebrow">What makes us different</p>
            <h2>Kind by design.</h2>
          </div>
          <ul className="values-grid">
            {site.values.map((v) => (
              <li key={v.title}>
                <Icon name="leaf" size={22} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap founder">
          {a.founderPhoto ? (
            <Photo k={a.founderPhoto} alt="KudaratCare founder" className="founder__photo" sizes="(max-width: 760px) 92vw, 40vw" />
          ) : (
            <div className="founder__photo" aria-label="Founder photograph to be provided">
              <Icon name="user" size={40} />
              <span>Founder photograph</span>
            </div>
          )}
          <div>
            <p className="eyebrow">Founder&apos;s note</p>
            <h2>A personal note from our founder.</h2>
            {note.length ? (
              note.map((p, i) => (
                <p key={i} className={i === 0 ? "lead" : undefined}>
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className="lead">The founder&apos;s note and photograph will be added here.</p>
                <p className="muted">{pending}.</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="wrap">
          <div className="section__head">
            <h2>Advisory panel</h2>
          </div>
          <div className="grid-3">
            {advisors.length
              ? advisors.map((ad) => (
                  <article key={ad.name} className="card advisor">
                    {ad.photo ? (
                      <Photo k={ad.photo} alt={ad.name} className="advisor__avatar" sizes="120px" />
                    ) : (
                      <div className="advisor__avatar" aria-hidden="true">
                        <Icon name="user" size={28} />
                      </div>
                    )}
                    <h3>{ad.name}</h3>
                    {ad.title ? <p className="eyebrow">{ad.title}</p> : null}
                    {ad.bio ? <p className="muted">{ad.bio}</p> : null}
                  </article>
                ))
              : [1, 2, 3].map((i) => (
                  <article key={i} className="card advisor">
                    <div className="advisor__avatar" aria-hidden="true">
                      <Icon name="user" size={28} />
                    </div>
                    <h3>Advisor {i}</h3>
                    <p className="muted">Name, qualifications and role {pending.toLowerCase()}.</p>
                  </article>
                ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band">
            <h2>Find what your skin and hair need.</h2>
            <div className="form__actions">
              <Link href="/shop" className="btn btn-primary">
                Shop the range
              </Link>
              <Link href="/consult" className="btn btn-ghost">
                Consult a doctor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
