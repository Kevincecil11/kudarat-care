"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export function ShopBrowser({ products, categories, activeCategory }: { products: Product[]; categories: Category[]; activeCategory?: string }) {
  const [query, setQuery] = useState("");
  const [sub, setSub] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const subCategories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.subCategory)))], [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (sub === "All" || p.subCategory === sub) &&
        (!inStockOnly || p.stock > 0) &&
        (!q || [p.name, p.shortDescription, p.subCategory, ...p.keyIngredients].join(" ").toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return sorted;
  }, [products, query, sub, sort, inStockOnly]);

  return (
    <div className="shop">
      <nav className="cat-tabs" aria-label="Product categories">
        <Link href="/shop" className={!activeCategory ? "is-active" : undefined} aria-current={!activeCategory ? "page" : undefined}>
          All products
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`} className={activeCategory === c.slug ? "is-active" : undefined} aria-current={activeCategory === c.slug ? "page" : undefined}>
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search products</span>
          <input id="shop-search" type="search" className="input" placeholder="Search by product or ingredient" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <label className="select-wrap">
          <span className="sr-only">Sort products</span>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
        <label className="check check--inline">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
          <span>In stock only</span>
        </label>
      </div>

      <div className="chips" role="group" aria-label="Filter by type">
        {subCategories.map((s) => (
          <button key={s} type="button" className={sub === s ? "chip is-active" : "chip"} aria-pressed={sub === s} onClick={() => setSub(s)}>
            {s}
          </button>
        ))}
      </div>

      <p className="result-count" aria-live="polite">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      {visible.length ? (
        <div className="grid-products">
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>No products match your search.</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setQuery("");
              setSub("All");
              setInStockOnly(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
