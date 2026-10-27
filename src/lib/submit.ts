"use client";
import { getSupabaseBrowser } from "./supabase/client";

type Result = { ok: true; saved: boolean } | { ok: false; saved: false; message: string };

// Save a public form submission. Visitors can insert but never read these tables back.
export async function saveSubmission(table: "consult_requests" | "bulk_enquiries" | "contact_messages", row: Record<string, unknown>): Promise<Result> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { ok: true, saved: false };
  const { error } = await supabase.from(table).insert(row);
  if (error) {
    console.error(`[${table}]`, error);
    return { ok: false, saved: false, message: "We could not send this right now. Please try again in a moment." };
  }
  return { ok: true, saved: true };
}

export const clean = (value: string, max: number) => value.trim().slice(0, max);
export const orNull = (value: string) => (value.trim() ? value.trim() : null);
