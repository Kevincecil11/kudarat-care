"use client";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./client";

export type Profile = { id: string; email: string | null; full_name: string | null; phone: string | null; role: "customer" | "admin" };

// Current signed-in user plus their profile row. `ready` turns true once the session check is done.
export function useAuth() {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(!supabase);

  const loadProfile = useCallback(
    async (s: Session | null) => {
      if (!supabase || !s) {
        setProfile(null);
        return;
      }
      const { data } = await supabase.from("profiles").select("id, email, full_name, phone, role").eq("id", s.user.id).maybeSingle();
      setProfile((data as Profile | null) ?? null);
    },
    [supabase],
  );

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      setSession(data.session);
      await loadProfile(data.session);
      if (alive) setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Defer so we never call Supabase inside the auth callback itself.
      window.setTimeout(() => void loadProfile(s), 0);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setProfile(null);
  }, [supabase]);

  return {
    supabase,
    session,
    user: session?.user ?? null,
    profile,
    isAdmin: profile?.role === "admin",
    ready,
    signOut,
    reloadProfile: () => loadProfile(session),
  };
}
