"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { slugify } from "@/lib/admin/sheet";
import { errText, uploadPublic, type SectionProps } from "./shared";

type Section = { heading: string; body: string[] };
type Post = { id: string; slug: string; title: string; category: string; is_published: boolean; is_sample: boolean; published_at: string | null; excerpt: string; sections: Section[]; cover: string };

// Article text: lines starting with "## " become section headings, blank lines split paragraphs.
function parseArticle(text: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: "", body: [] };
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    const lines = block.trim().split("\n");
    if (!lines[0]) continue;
    if (lines[0].startsWith("## ")) {
      if (current.heading || current.body.length) sections.push(current);
      current = { heading: lines[0].slice(3).trim(), body: [] };
      const rest = lines.slice(1).join(" ").trim();
      if (rest) current.body.push(rest);
    } else current.body.push(lines.join(" ").trim());
  }
  if (current.heading || current.body.length) sections.push(current);
  return sections;
}

const toText = (sections: Section[]) =>
  sections
    .map((s) => [s.heading ? `## ${s.heading}` : "", ...s.body].filter(Boolean).join("\n\n"))
    .join("\n\n");

export function Journal({ db, flash }: SectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await db
      .from("journal_posts")
      .select("id, slug, title, category, is_published, is_sample, published_at, excerpt, sections, cover")
      .order("published_at", { ascending: false, nullsFirst: true });
    setPosts((data ?? []) as Post[]);
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (p: Post) => {
    const { error } = await db
      .from("journal_posts")
      .update({ is_published: !p.is_published, published_at: p.published_at ?? new Date().toISOString().slice(0, 10) })
      .eq("id", p.id);
    if (error) return flash(errText(error));
    flash(p.is_published ? "Moved to drafts" : "Published");
    await load();
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    const { error } = await db.from("journal_posts").delete().eq("id", p.id);
    if (error) return flash(errText(error));
    flash("Article deleted");
    await load();
  };

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const sections = parseArticle(get("body"));
    if (!sections.length) return flash("Please write the article first");
    setBusy(true);
    try {
      const title = get("title");
      const slug = editing?.slug ?? slugify(title);
      const file = f.get("cover");
      const cover = file && typeof file !== "string" && file.size ? await uploadPublic(db, "site-media", `journal/${slug}`, file) : editing?.cover ?? "botanical";
      const words = sections
        .flatMap((s) => s.body)
        .join(" ")
        .split(/\s+/).length;
      const publish = f.get("publish") === "on";
      const row = {
        slug,
        title,
        category: get("category"),
        excerpt: get("excerpt"),
        sections,
        cover,
        read_minutes: Math.max(1, Math.round(words / 200)),
        is_published: publish,
        is_sample: false,
        published_at: publish ? editing?.published_at ?? new Date().toISOString().slice(0, 10) : editing?.published_at ?? null,
      };
      const { error } = editing ? await db.from("journal_posts").update(row).eq("id", editing.id) : await db.from("journal_posts").insert(row);
      if (error) throw error;
      form.reset();
      setEditing(null);
      flash(publish ? "Article published" : "Draft saved");
      await load();
    } catch (err) {
      flash(errText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1>Journal</h1>
      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <th scope="row">
                  {p.title}
                  {p.is_sample ? <small>sample</small> : null}
                </th>
                <td>{p.category}</td>
                <td>{p.published_at ?? "Draft"}</td>
                <td>
                  <button type="button" className="text-btn" onClick={() => void toggle(p)}>
                    <span className={p.is_published ? "tag tag--approved" : "tag tag--pending"}>{p.is_published ? "Published" : "Draft"}</span>
                  </button>
                </td>
                <td>
                  <span className="admin-row-actions">
                    <button type="button" className="text-btn" onClick={() => setEditing(p)}>
                      Edit
                    </button>
                    <button type="button" className="text-btn" onClick={() => void remove(p)}>
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form key={editing?.id ?? "new"} className="card form" onSubmit={save}>
        <h2 className="form__title">{editing ? `Edit: ${editing.title}` : "New article"}</h2>
        <div className="form__grid">
          <div className="field field--full">
            <label htmlFor="jp-title">Title</label>
            <input id="jp-title" name="title" className="input" required defaultValue={editing?.title} />
          </div>
          <div className="field">
            <label htmlFor="jp-cat">Category</label>
            <select id="jp-cat" name="category" className="input" defaultValue={editing?.category ?? "Skin"}>
              {["Skin", "Hair", "Ingredients", "Wellness"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="jp-cover">Cover image{editing ? " (leave empty to keep)" : ""}</label>
            <input id="jp-cover" name="cover" type="file" accept="image/*" className="input" />
          </div>
          <div className="field field--full">
            <label htmlFor="jp-excerpt">Short summary (shown on Google, max 160 characters)</label>
            <input id="jp-excerpt" name="excerpt" className="input" maxLength={160} required defaultValue={editing?.excerpt} />
          </div>
          <div className="field field--full">
            <label htmlFor="jp-body">Article</label>
            <textarea id="jp-body" name="body" rows={12} className="input" required defaultValue={editing ? toText(editing.sections) : ""} placeholder={"## A section heading\n\nA paragraph of text.\n\nAnother paragraph."} />
            <small>Start a line with ## for a heading. Leave an empty line between paragraphs.</small>
          </div>
        </div>
        <label className="check">
          <input type="checkbox" name="publish" defaultChecked={editing?.is_published ?? false} />
          <span>Publish on the website</span>
        </label>
        <div className="admin-row-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save article"}
          </button>
          {editing ? (
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </>
  );
}
