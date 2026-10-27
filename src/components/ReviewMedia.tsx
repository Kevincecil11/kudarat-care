"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Item = { path: string; url: string };

// Approved review photos and videos live in a private bucket; we fetch short-lived links in the browser.
export function ReviewMedia({ paths, type }: { paths: string[]; type?: "photo" | "video" }) {
  const [items, setItems] = useState<Item[]>([]);
  const key = paths.join("|");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const list = key ? key.split("|") : [];
    if (!supabase || !list.length) return;
    let alive = true;
    supabase.storage
      .from("review-media")
      .createSignedUrls(list, 60 * 60)
      .then(({ data }) => {
        if (!alive || !data) return;
        const next: Item[] = [];
        data.forEach((d, i) => {
          if (d.signedUrl) next.push({ path: d.path ?? list[i] ?? "", url: d.signedUrl });
        });
        setItems(next);
      });
    return () => {
      alive = false;
    };
  }, [key]);

  if (!items.length) return null;
  return (
    <div className="rcard__media">
      {items.map((m) =>
        type === "video" && /\.(mp4|mov|webm)$/i.test(m.path) ? (
          <video key={m.url} src={m.url} controls preload="metadata" playsInline />
        ) : (
          <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer">
            <img src={m.url} alt="Customer review photo" loading="lazy" decoding="async" />
          </a>
        ),
      )}
    </div>
  );
}
