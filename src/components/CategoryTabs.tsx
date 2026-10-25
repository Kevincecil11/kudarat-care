"use client";
import { useState, type KeyboardEvent } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Tab = { id: string; label: string; products: Product[] };

export function CategoryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(tabs[next].id);
    document.getElementById(`tab-${tabs[next].id}`)?.focus();
  };

  if (!current) return null;
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Product categories">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={t.id === current.id}
            aria-controls="tabpanel-products"
            tabIndex={t.id === current.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="tabpanel-products" role="tabpanel" aria-labelledby={`tab-${current.id}`} className="grid-products">
        {current.products.slice(0, 4).map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
