"use client";
import { useState } from "react";
import type { JournalPost } from "@/lib/types";
import { JournalCard } from "./JournalCard";

export function JournalBrowser({ posts }: { posts: JournalPost[] }) {
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const visible = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  return (
    <>
      <div className="chips" role="group" aria-label="Filter articles">
        {cats.map((c) => (
          <button key={c} type="button" className={c === cat ? "chip is-active" : "chip"} aria-pressed={c === cat} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid-journal">
        {visible.map((p) => (
          <JournalCard key={p.slug} post={p} headingLevel={2} />
        ))}
      </div>
    </>
  );
}
