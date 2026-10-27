"use client";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Db = SupabaseClient;
export type Flash = (msg: string) => void;
export type SectionProps = { db: Db; flash: Flash };

export async function uploadPublic(db: Db, bucket: "product-images" | "site-media", folder: string, file: File) {
  if (file.size > 5 * 1024 * 1024) throw new Error(`${file.name} is larger than 5 MB`);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export function StatusSelect({ value, options, onChange, label }: { value: string; options: string[]; onChange: (v: string) => void; label: string }) {
  return (
    <select className="input input--sm select-inline" aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Filters({ value, options, onChange }: { value: string; options: { id: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="admin-filters" role="group">
      {options.map((o) => (
        <button key={o.id} type="button" className={value === o.id ? "chip is-on" : "chip"} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const errText = (e: unknown) => (e && typeof e === "object" && "message" in e ? String((e as { message: unknown }).message) : "Something went wrong");
