"use client";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";
import { errText, Filters, when, type Db, type SectionProps } from "./shared";

type Review = {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  title: string;
  body: string;
  media_paths: string[];
  media_type: "photo" | "video" | null;
  status: string;
  user_id: string | null;
  is_sample: boolean;
  created_at: string;
  products: { name: string } | null;
};

function Media({ db, paths }: { db: Db; paths: string[] }) {
  const [urls, setUrls] = useState<{ path: string; url: string }[]>([]);
  const key = paths.join("|");
  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (!list.length) return;
    db.storage
      .from("review-media")
      .createSignedUrls(list, 3600)
      .then(({ data }) => setUrls((data ?? []).filter((d) => d.signedUrl).map((d, i) => ({ path: d.path ?? list[i] ?? "", url: d.signedUrl }))));
  }, [db, key]);
  if (!urls.length) return null;
  return (
    <div className="admin-media">
      {urls.map((u) =>
        /\.(mp4|mov|webm)$/i.test(u.path) ? (
          <video key={u.url} src={u.url} controls preload="metadata" />
        ) : (
          <a key={u.url} href={u.url} target="_blank" rel="noopener noreferrer">
            <img src={u.url} alt="Review upload" />
          </a>
        ),
      )}
    </div>
  );
}

export function Reviews({ db, flash }: SectionProps) {
  const [filter, setFilter] = useState("pending");
  const [list, setList] = useState<Review[] | null>(null);

  const load = useCallback(async () => {
    const { data } = await db
      .from("reviews")
      .select("id, name, email, rating, title, body, media_paths, media_type, status, user_id, is_sample, created_at, products(name)")
      .eq("status", filter)
      .order("created_at", { ascending: false })
      .limit(100);
    setList((data ?? []) as unknown as Review[]);
  }, [db, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const bonusFor = (r: Review) => (r.media_type === "video" ? site.rewards.videoReviewBonus : site.rewards.photoReviewBonus);

  const setStatus = async (r: Review, status: "approved" | "rejected") => {
    const { error } = await db.from("reviews").update({ status }).eq("id", r.id);
    if (error) return flash(errText(error));
    flash(status === "approved" ? (r.user_id && r.media_paths.length ? `Approved, bonus points added to the customer` : "Review approved") : "Review hidden");
    await load();
  };

  const remove = async (r: Review) => {
    if (!window.confirm("Delete this review permanently?")) return;
    if (r.media_paths.length) await db.storage.from("review-media").remove(r.media_paths);
    const { error } = await db.from("reviews").delete().eq("id", r.id);
    if (error) return flash(errText(error));
    flash("Review deleted");
    await load();
  };

  return (
    <>
      <h1>Reviews</h1>
      <Filters
        value={filter}
        onChange={setFilter}
        options={[
          { id: "pending", label: "To approve" },
          { id: "approved", label: "Published" },
          { id: "rejected", label: "Rejected" },
        ]}
      />
      {!list ? (
        <div className="empty" aria-busy="true">
          Loading…
        </div>
      ) : list.length ? (
        <div className="review-queue">
          {list.map((r) => (
            <article key={r.id} className="card">
              <div className="rcard__top">
                <b>{r.title || "Untitled review"}</b>
                <span className={`tag tag--${r.status}`}>{r.is_sample ? "sample" : r.status}</span>
              </div>
              <p>{r.body}</p>
              <Media db={db} paths={r.media_paths} />
              <p className="muted">
                {r.name} · {r.products?.name ?? "General"} · {r.rating}/5 · {when(r.created_at)}
                {r.media_type ? ` · ${r.media_type}` : ""}
                {r.user_id ? " · signed-in customer" : " · guest (no points)"}
              </p>
              <div className="form__actions">
                {r.status !== "approved" ? (
                  <button type="button" className="btn btn-primary" onClick={() => void setStatus(r, "approved")}>
                    Approve{r.user_id && r.media_paths.length ? ` and add ${bonusFor(r)} points` : ""}
                  </button>
                ) : null}
                {r.status !== "rejected" ? (
                  <button type="button" className="btn btn-ghost" onClick={() => void setStatus(r, "rejected")}>
                    {r.status === "approved" ? "Unpublish" : "Reject"}
                  </button>
                ) : null}
                <button type="button" className="text-btn" onClick={() => void remove(r)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card empty">
          <p>Nothing here right now.</p>
        </div>
      )}
    </>
  );
}
