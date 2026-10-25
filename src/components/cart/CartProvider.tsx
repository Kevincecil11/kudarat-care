"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CartLine, Product } from "@/lib/types";

type DetailedLine = { product: Product; qty: number; lineTotal: number };

type CartContextValue = {
  products: Product[];
  lines: CartLine[];
  detailed: DetailedLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  notify: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kc_cart_v1";

export function CartProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setLines(
          parsed.filter(
            (l): l is CartLine =>
              typeof l?.slug === "string" && typeof l?.qty === "number" && l.qty > 0 && products.some((p) => p.slug === l.slug),
          ),
        );
      }
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, [products]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines, ready]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  const add = useCallback(
    (slug: string, qty = 1, opts?: { silent?: boolean }) => {
      const product = products.find((p) => p.slug === slug);
      if (!product || product.stock <= 0) return;
      setLines((prev) => {
        const existing = prev.find((l) => l.slug === slug);
        if (existing) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(product.stock, l.qty + qty) } : l));
        return [...prev, { slug, qty: Math.min(product.stock, qty) }];
      });
      if (!opts?.silent) notify(`${product.name} added to your bag`);
    },
    [products, notify],
  );

  const setQty = useCallback(
    (slug: string, qty: number) => {
      const product = products.find((p) => p.slug === slug);
      if (!product) return;
      setLines((prev) =>
        qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(product.stock, qty) } : l)),
      );
    },
    [products],
  );

  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const detailed = lines
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        return product ? { product, qty: l.qty, lineTotal: product.price * l.qty } : null;
      })
      .filter((x): x is DetailedLine => x !== null);
    return {
      products,
      lines,
      detailed,
      count: detailed.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((n, l) => n + l.lineTotal, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
      notify,
    };
  }, [lines, products, ready, add, setQty, remove, clear, notify]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={toast ? "toast is-on" : "toast"} role="status" aria-live="polite">
        {toast}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
