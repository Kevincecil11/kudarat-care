import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER ONLY. Uses the service role key, which bypasses Row Level Security.
// Import this only from route handlers and server code, never from client components.
export function getSupabaseAdmin(): SupabaseClient | null {
  if (typeof window !== "undefined") throw new Error("getSupabaseAdmin must only run on the server");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
