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

export default nextConfig;
