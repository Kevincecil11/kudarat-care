import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// SERVER read client for pages (build time and ISR). Public key only, no user session.
// Responses are cached for 60 seconds on Vercel so admin edits show up within a minute.
let serverClient: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!serverClient) {
    serverClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } } as RequestInit),
      },
    });
  }
  return serverClient;
}
