import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { JournalCard } from "@/components/JournalCard";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { getPost, getPosts } from "@/lib/repository";
import { absoluteUrl, formatDate } from "@/lib/format";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, images: [{ url: media[post.image].large }] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const more = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="section">
        <div className="wrap article">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/journal">Journal</Link>
              </li>
              <li>
                <span aria-current="page">{post.title}</span>
              </li>
            </ol>
          </nav>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="article__meta">
            {post.author} · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readMinutes} min read
          </p>
          <Photo k={post.image} priority className="article__img" sizes="(max-width: 860px) 92vw, 820px" />
          <p className="article__lead">{post.excerpt}</p>
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </section>
          ))}
          <p className="notice">
            {post.sample ? "Sample article for the preview. " : ""}Journal content is educational and not a substitute for personal medical advice.
          </p>
          <Link href="/consult" className="btn btn-primary">
            Consult a doctor <Icon name="arrow" size={16} />
          </Link>
        </div>
      </article>
      {more.length ? (
        <section className="section section--ivory">
          <div className="wrap">
            <div className="section__head">
              <h2>Keep reading</h2>
            </div>
            <div className="grid-journal">
              {more.map((p) => (
                <JournalCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: [media[post.image].large],
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: site.legalName },
          mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
        }}
      />
    </>
  );
}
