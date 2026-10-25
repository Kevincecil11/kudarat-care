// Single data-access layer. Pages only call these functions.
// Phase 2 swaps the seed imports for Supabase queries without touching page code.
import { categories, products } from "./data/products";
import { posts } from "./data/journal";
import { reviews } from "./data/reviews";
import { policies } from "./data/policies";

export async function getProducts() {
  return products;
}

export async function getProduct(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export async function getRelatedProducts(slug: string, limit = 4) {
  const current = products.find((p) => p.slug === slug);
  if (!current) return [];
  return products.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}

export async function getCategories() {
  return categories;
}

export async function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export async function getPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getReviews(productSlug?: string) {
  return productSlug ? reviews.filter((r) => r.productSlug === productSlug) : reviews;
}

export async function getPolicies() {
  return policies;
}

export async function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug) ?? null;
}
