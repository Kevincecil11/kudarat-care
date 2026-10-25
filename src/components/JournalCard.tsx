import Link from "next/link";
import type { JournalPost } from "@/lib/types";
import { Photo } from "./Photo";
import { Icon } from "./Icon";

export function JournalCard({ post, headingLevel = 3 }: { post: JournalPost; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="jcard">
      <Link href={`/journal/${post.slug}`} className="jcard__media" tabIndex={-1} aria-hidden="true">
        <Photo k={post.image} alt="" sizes="(max-width: 760px) 92vw, 30vw" />
      </Link>
      <p className="jcard__meta">
        {post.category} · {post.readMinutes} min read
      </p>
      <H className="jcard__title">
        <Link href={`/journal/${post.slug}`}>{post.title}</Link>
      </H>
      <p className="jcard__excerpt">{post.excerpt}</p>
      <Link href={`/journal/${post.slug}`} className="link" aria-label={`Read ${post.title}`}>
        Read more <Icon name="arrow" size={16} />
      </Link>
    </article>
  );
}
