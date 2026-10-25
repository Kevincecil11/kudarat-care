"use client";
import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { Field } from "./Field";
import { Icon } from "../Icon";

export function ReviewForm({ products }: { products: { slug: string; name: string }[] }) {
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const r = site.rewards;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    setError(null);
    // Phase 2: upload media to Supabase Storage and insert into `reviews` with status = 'pending'.
    setDone(true);
  };

  if (done) {
    return (
      <div className="card form-done" role="status">
        <Icon name="check" size={28} />
        <h3>Thank you for your review.</h3>
        <p>
          Reviews are published after a quick check by our team.
          {files.length ? ` Approved photo and video reviews earn ${r.name} points.` : ""}
        </p>
        {site.isPreview ? <p className="notice">Preview: reviews are saved and moderated in the admin once Supabase is connected.</p> : null}
      </div>
    );
  }

  return (
    <form id="write" className="card form" onSubmit={submit}>
      <h2 className="form__title">Write a review</h2>
      <fieldset className="rating-input">
        <legend>Your rating</legend>
        <div>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={n <= rating ? "is-on" : undefined}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
              <Icon name="star" size={26} />
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {error ? (
        <p className="form__error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form__grid">
        <Field label="Your name" htmlFor="r-name" hint="Shown with your review">
          <input id="r-name" name="name" className="input" required autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="r-email" hint="Never shown publicly">
          <input id="r-email" name="email" type="email" className="input" required autoComplete="email" />
        </Field>
        <Field label="Product" htmlFor="r-product" full>
          <select id="r-product" name="product" className="input" required defaultValue="">
            <option value="" disabled>
              Choose a product
            </option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Review title" htmlFor="r-title" full>
          <input id="r-title" name="title" className="input" required maxLength={80} />
        </Field>
        <Field label="Your review" htmlFor="r-body" full>
          <textarea id="r-body" name="body" className="input" rows={5} required minLength={20} maxLength={1500} />
        </Field>
        <Field label="Add photos or a video (optional)" htmlFor="r-media" full hint={`Approved photo reviews earn ${r.photoReviewBonus} points, video reviews ${r.videoReviewBonus} points.`}>
          <label className="upload" htmlFor="r-media">
            <Icon name="upload" />
            <span>{files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Choose files"}</span>
          </label>
          <input
            id="r-media"
            name="media"
            type="file"
            className="sr-only"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 4))}
          />
        </Field>
      </div>
      <label className="check">
        <input type="checkbox" required />
        <span>This review reflects my genuine experience, and I allow KudaratCare to publish it with my name.</span>
      </label>
      <button className="btn btn-primary" type="submit">
        Submit review
      </button>
      <p className="form__note">Points are awarded for approved photo and video reviews, whatever your rating.</p>
    </form>
  );
}
