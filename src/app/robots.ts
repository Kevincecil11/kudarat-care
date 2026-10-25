import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/format";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (site.isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/cart", "/checkout", "/order-confirmation", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
