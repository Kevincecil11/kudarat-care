// Production (Vercel): full Next.js server with API routes, SSR and ISR.
// Private preview (GitHub Pages): STATIC_EXPORT=1 builds a static copy under a hidden base path.
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  ...(basePath ? { basePath } : {}),
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
};

// Business settings and KC Circle rules edited in the admin are read once per build and baked in,
// so every page and component (server and browser) uses the same values. "Publish changes" rebuilds.
async function loadLiveSettings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return {};
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  const get = async (path) => {
    const res = await fetch(`${url}/rest/v1/${path}`, { headers });
    if (!res.ok) throw new Error(`${path}: ${res.status}`);
    const rows = await res.json();
    return Array.isArray(rows) ? rows[0] ?? null : null;
  };
  try {
    const [settings, rewards] = await Promise.all([get("site_settings?id=eq.1&select=*"), get("reward_rules?id=eq.1&select=*")]);
    return { settings, rewards };
  } catch (e) {
    console.warn("[next.config] could not load live settings, using defaults:", e?.message ?? e);
    return {};
  }
}

export default async function config() {
  const live = await loadLiveSettings();
  return { ...nextConfig, env: { NEXT_PUBLIC_SITE_SETTINGS: JSON.stringify(live) } };
}
