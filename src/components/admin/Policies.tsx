"use client";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { slugify } from "@/lib/admin/sheet";
import { errText, type SectionProps } from "./shared";

type Section = { heading: string; body: string };
type Policy = { slug: string; title: string; summary: string; sections: Section[]; updated_at: string };

// Same writing format as the Journal: "## Heading" lines start a section, blank lines split paragraphs.
function parse(text: string): Section[] {
  const out: Section[] = [];
  let current: Section | null = null;
  for (const block of text.replace(/\r/g, "").split(/\n\s*\n/)) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      if (current) out.push(current);
      const [first, ...rest] = trimmed.split("\n");
      current = { heading: first.slice(3).trim(), body: rest.join("\n").trim() };
    } else {
      if (!current) current = { heading: "", body: "" };
      current.body = current.body ? `${current.body}\n\n${trimmed}` : trimmed;
    }
  }
  if (current) out.push(current);
  return out;
}

const toText = (sections: Section[]) => sections.map((s) => [s.heading ? `## ${s.heading}` : "", s.body].filter(Boolean).join("\n\n")).join("\n\n");

export function Policies({ db, flash }: SectionProps) {
  const [list, setList] = useState<Policy[]>([]);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await db.from("policies").select("slug, title, summary, sections, updated_at").order("title");
    const rows = (data ?? []) as Policy[];
    setList(rows);
    setEditing((cur) => (cur ? rows.find((r) => r.slug === cur.slug) ?? null : rows[0] ?? null));
  }, [db]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const sections = parse(get("body"));
    if (!sections.length) return flash("Please add the policy text");
    setBusy(true);
    try {
      const row = { title: get("title"), summary: get("summary"), sections };
      const { error } = editing
        ? await db.from("policies").update(row).eq("slug", editing.slug)
        : await db.from("policies").insert({ ...row, slug: slugify(row.title) });
      if (error) throw error;
      flash("Policy saved. Publish changes to update the website.");
      await load();
    } catch (err) {
      flash(errText(err));
    } finally {
      setBusy(false);
    }
  };

  const todo = editing ? (toText(editing.sections).match(/\[TO CONFIRM[^\]]*\]/g) ?? []).length : 0;

  return (
    <>
      <h1>Policies</h1>
      <div className="admin-filters" role="group">
        {list.map((p) => (
          <button key={p.slug} type="button" className={editing?.slug === p.slug ? "chip is-on" : "chip"} onClick={() => setEditing(p)}>
            {p.title}
          </button>
        ))}
        <button type="button" className={!editing ? "chip is-on" : "chip"} onClick={() => setEditing(null)}>
          + New page
        </button>
      </div>
      <form key={editing?.slug ?? "new"} className="card form" onSubmit={save}>
        {editing && todo ? <p className="notice">{todo} item{todo === 1 ? "" : "s"} marked [TO CONFIRM] still need the business details.</p> : null}
        <div className="form__grid">
          <div className="field field--full">
            <label htmlFor="pl-title">Page title</label>
            <input id="pl-title" name="title" className="input" required defaultValue={editing?.title} />
          </div>
          <div className="field field--full">
            <label htmlFor="pl-summary">Short summary (shown under the title and on Google)</label>
            <input id="pl-summary" name="summary" className="input" maxLength={200} defaultValue={editing?.summary} />
          </div>
          <div className="field field--full">
            <label htmlFor="pl-body">Policy text</label>
            <textarea id="pl-body" name="body" rows={22} className="input" required defaultValue={editing ? toText(editing.sections) : ""} placeholder={"## Section heading\n\nParagraph text."} />
            <small>Start a line with ## for a heading. Leave an empty line between paragraphs.</small>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save policy"}
        </button>
      </form>
    </>
  );
}
