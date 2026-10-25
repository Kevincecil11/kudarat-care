import type { MetadataRoute } from "next";
import { getCategories, getPolicies, getPosts, getProducts } from "@/lib/repository";
import { absoluteUrl } from "@/lib/format";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts, policies] = await Promise.all([getProducts(), getCategories(), getPosts(), getPolicies()]);
  const now = new Date();
  const pages = ["/", "/shop", "/consult", "/journal", "/rewards", "/reviews", "/bulk-orders", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: absoluteUrl(`/shop/${c.slug}`), lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), lastModified: now, priority: 0.9 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/journal/${p.slug}`), lastModified: new Date(p.date), priority: 0.6 })),
    ...policies.map((p) => ({ url: absoluteUrl(`/policies/${p.slug}`), lastModified: now, priority: 0.3 })),
  ];
}
