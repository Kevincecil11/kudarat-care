// Single data-access layer. Pages only call these functions.
// Reads come from Supabase when it is configured; the bundled sample data is the fallback
// (local development without a database, or if the database is unreachable during a build).
import { getSupabaseServer } from "./supabase/server";
import { categories as seedCategories, products as seedProducts } from "./data/products";
import { posts as seedPosts } from "./data/journal";
import { reviews as seedReviews } from "./data/reviews";
import { policies as seedPolicies } from "./data/policies";
import type { Category, JournalPost, Policy, Product, Review } from "./types";

type Row = Record<string, unknown>;
type Db = NonNullable<ReturnType<typeof getSupabaseServer>>;
export type Advisor = { name: string; title: string | null; bio: string | null; photo: string | null };

const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const num = (v: unknown, d = 0) => (typeof v === "number" ? v : Number(v ?? d) || d);
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
const opt = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);

const toCategory = (r: Row): Category => ({ slug: str(r.slug), name: str(r.name), description: str(r.description), image: str(r.image, "botanical") });

const toProduct = (r: Row): Product => ({
  slug: str(r.slug),
  name: str(r.name),
  category: str((r.categories as Row | null)?.slug),
  subCategory: str(r.sub_category),
  shortDescription: str(r.short_description),
  description: str(r.description),
  keyIngredients: arr(r.key_ingredients),
  howToUse: arr(r.how_to_use),
  size: str(r.size),
  mrp: num(r.mrp),
  price: num(r.price),
  stock: num(r.stock),
  images: arr(r.images).length ? arr(r.images) : ["botanical"],
  featured: Boolean(r.is_featured),
  sample: Boolean(r.is_sample),
});

const toPost = (r: Row): JournalPost => ({
  slug: str(r.slug),
  title: str(r.title),
  excerpt: str(r.excerpt),
  category: str(r.category, "Skin") as JournalPost["category"],
  date: str(r.published_at) || str(r.created_at).slice(0, 10),
  readMinutes: num(r.read_minutes, 4),
  image: str(r.cover, "botanical"),
  author: str(r.author, "KudaratCare Journal"),
  sections: Array.isArray(r.sections) ? (r.sections as JournalPost["sections"]) : [],
  sample: Boolean(r.is_sample),
});

const toReview = (r: Row): Review => ({
  id: str(r.id),
  productSlug: str((r.products as Row | null)?.slug) || null,
  name: str(r.name),
  date: str(r.review_date),
  rating: num(r.rating, 5),
  title: str(r.title),
  body: str(r.body),
  mediaType: (r.media_type as Review["mediaType"]) ?? undefined,
  media: arr(r.media_paths),
  sample: Boolean(r.is_sample),
});

const toPolicy = (r: Row): Policy => ({
  slug: str(r.slug),
  title: str(r.title),
  summary: str(r.summary),
  sections: Array.isArray(r.sections) ? (r.sections as Policy["sections"]) : [],
});

const toAdvisor = (r: Row): Advisor => ({ name: str(r.name), title: opt(r.title), bio: opt(r.bio), photo: opt(r.photo) });

// Run a query, fall back to sample data if Supabase is missing or the query fails.
async function load<T>(label: string, query: (db: Db) => PromiseLike<{ data: unknown; error: unknown }>, map: (r: Row) => T, fallback: T[]): Promise<T[]> {
  const db = getSupabaseServer();
  if (!db) return fallback;
  try {
    const { data, error } = await query(db);
    if (error || !Array.isArray(data)) throw error ?? new Error("no data");
    return (data as Row[]).map(map);
  } catch (e) {
    console.warn(`[repository] ${label}: using sample data`, e);
    return fallback;
  }
}

const PRODUCT_COLUMNS =
  "slug, name, sub_category, short_description, description, key_ingredients, how_to_use, size, mrp, price, stock, images, is_featured, is_sample, categories(slug)";

export function getProducts(): Promise<Product[]> {
  return load("products", (db) => db.from("products").select(PRODUCT_COLUMNS).eq("is_active", true).order("sort_order").order("name"), toProduct, seedProducts);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts() {
  return (await getProducts()).filter((p) => p.featured);
}

export async function getRelatedProducts(slug: string, limit = 4) {
  const all = await getProducts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  return all.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}

export function getCategories() {
  return load("categories", (db) => db.from("categories").select("slug, name, description, image").order("sort_order"), toCategory, seedCategories);
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string) {
  return (await getProducts()).filter((p) => p.category === slug);
}

export async function getPosts() {
  const posts = await load(
    "journal",
    (db) => db.from("journal_posts").select("slug, title, excerpt, category, cover, sections, read_minutes, author, is_sample, published_at, created_at").eq("is_published", true),
    toPost,
    seedPosts,
  );
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export async function getReviews(productSlug?: string) {
  const all = await load(
    "reviews",
    (db) =>
      db
        .from("reviews")
        .select("id, name, rating, title, body, media_type, media_paths, is_sample, review_date, products(slug)")
        .eq("status", "approved")
        .order("review_date", { ascending: false }),
    toReview,
    seedReviews,
  );
  return productSlug ? all.filter((r) => r.productSlug === productSlug) : all;
}

const POLICY_ORDER = ["terms-and-conditions", "privacy-policy", "shipping-policy", "refund-policy"];

export async function getPolicies() {
  const list = await load("policies", (db) => db.from("policies").select("slug, title, summary, sections"), toPolicy, seedPolicies);
  const rank = (slug: string) => (POLICY_ORDER.indexOf(slug) === -1 ? 99 : POLICY_ORDER.indexOf(slug));
  return [...list].sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title));
}

export async function getPolicy(slug: string) {
  return (await getPolicies()).find((p) => p.slug === slug) ?? null;
}

export function getAdvisors() {
  return load("advisors", (db) => db.from("advisors").select("name, title, bio, photo").order("sort_order"), toAdvisor, [] as Advisor[]);
}
