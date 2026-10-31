import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// "Publish changes" in the admin: rebuilds the live site so new products, articles and settings appear.
// Needs VERCEL_DEPLOY_HOOK_URL (Vercel > Project > Settings > Git > Deploy Hooks).
export async function POST(request: Request) {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  const db = getSupabaseAdmin();
  if (!hook || !db) return NextResponse.json({ error: "Publishing is not configured yet" }, { status: 503 });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
  const { data } = await db.auth.getUser(token);
  const userId = data.user?.id;
  if (!userId) return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
  const { data: profile } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
  if ((profile as { role?: string } | null)?.role !== "admin") return NextResponse.json({ error: "Admins only" }, { status: 403 });

  const res = await fetch(hook, { method: "POST", cache: "no-store" });
  if (!res.ok) return NextResponse.json({ error: "Could not start publishing" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
