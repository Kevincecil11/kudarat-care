import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Stars } from "./Stars";
import { ReviewMedia } from "./ReviewMedia";
import "./backend.css";

export function ReviewCard({ review, productName }: { review: Review; productName?: string }) {
  return (
    <article className="rcard">
      <div className="rcard__top">
        <Stars value={review.rating} />
        {review.sample ? <span className="tag">Sample</span> : null}
      </div>
      <h3>{review.title}</h3>
      <p>{review.body}</p>
      {review.media?.length ? <ReviewMedia paths={review.media} type={review.mediaType} /> : null}
      <p className="rcard__meta">
        {review.name} · <time dateTime={review.date}>{formatDate(review.date)}</time>
        {productName ? <> · {productName}</> : null}
        {review.mediaType ? <> · {review.mediaType === "photo" ? "Photo review" : "Video review"}</> : null}
      </p>
    </article>
  );
}
