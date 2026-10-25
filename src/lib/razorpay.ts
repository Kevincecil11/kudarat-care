// SERVER ONLY helpers for Razorpay. Never import from client components.
import { createHmac, timingSafeEqual } from "node:crypto";
import { getProducts } from "./repository";
import { shippingFor } from "./format";
import type { CartLine } from "./types";

export function razorpayConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

// Prices are always recalculated on the server from the catalogue, never trusted from the browser.
export async function priceCart(lines: CartLine[]) {
  const products = await getProducts();
  const priced = lines
    .filter((l) => Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 50)
    .map((l) => {
      const p = products.find((x) => x.slug === l.slug);
      if (!p || p.stock < l.qty) return null;
      return { slug: p.slug, name: p.name, qty: l.qty, price: p.price };
    });
  if (!priced.length || priced.some((x) => x === null)) return null;
  const items = priced.filter((x): x is NonNullable<typeof x> => x !== null);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);
  return { items, subtotal, shipping, total: subtotal + shipping };
}

export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const auth = Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Razorpay order failed: ${res.status}`);
  return (await res.json()) as { id: string; amount: number; currency: string; receipt: string };
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
