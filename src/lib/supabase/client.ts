import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client. Uses the public key, so every request is limited by Row Level Security.
// Returns null when Supabase env vars are missing, so local builds without a database still work.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "kc-auth" },
    });
  }
  return browserClient;
}

export const isSupabaseConfigured = () => Boolean(url && key);
