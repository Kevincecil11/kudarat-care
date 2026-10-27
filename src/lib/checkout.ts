// SERVER ONLY. Prices, shipping and points are always worked out here from the database.
import type { SupabaseClient } from "@supabase/supabase-js";
import { site } from "./site";
import type { CartLine } from "./types";

export type PricedCart = {
  items: { productId: string; slug: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  pointsRedeemed: number;
  discount: number;
  total: number;
};

type DbProduct = { id: string; slug: string; name: string; price: number; stock: number; is_active: boolean };

export async function priceCartFromDb(db: SupabaseClient, lines: CartLine[], opts: { userId?: string | null; redeemPoints?: boolean }): Promise<PricedCart | { error: string }> {
  const valid = lines.filter((l) => typeof l.slug === "string" && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 50).slice(0, 30);
  if (!valid.length) return { error: "Your bag is empty" };
  const [productsRes, settingsRes, rulesRes] = await Promise.all([
    db.from("products").select("id, slug, name, price, stock, is_active").in("slug", valid.map((l) => l.slug)),
    db.from("site_settings").select("shipping_fee, free_shipping_above").eq("id", 1).single(),
    db.from("reward_rules").select("point_value_inr, min_redeem").eq("id", 1).single(),
  ]);
  const products = (productsRes.data ?? []) as DbProduct[];
  const settings = settingsRes.data as { shipping_fee: number; free_shipping_above: number } | null;
  const rules = rulesRes.data as { point_value_inr: number; min_redeem: number } | null;

  const items: PricedCart["items"] = [];
  for (const l of valid) {
    const p = products.find((x) => x.slug === l.slug);
    if (!p || !p.is_active) return { error: "Some items are no longer available" };
    if (p.stock < l.qty) return { error: `Only ${p.stock} left of ${p.name}` };
    items.push({ productId: p.id, slug: p.slug, name: p.name, qty: l.qty, price: p.price });
  }
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const fee = settings?.shipping_fee ?? site.shipping.flatFee;
  const freeAbove = settings?.free_shipping_above ?? site.shipping.freeAbove;
  const shipping = subtotal >= freeAbove ? 0 : fee;

  let pointsRedeemed = 0;
  let discount = 0;
  if (opts.redeemPoints && opts.userId) {
    const { data: bal } = await db.from("reward_balances").select("balance").eq("user_id", opts.userId).maybeSingle();
    const balance = (bal as { balance: number } | null)?.balance ?? 0;
    const value = Number(rules?.point_value_inr ?? 1);
    if (balance >= (rules?.min_redeem ?? 100) && value > 0) {
      // Points can pay for up to the item subtotal (not shipping).
      pointsRedeemed = Math.min(balance, Math.floor(subtotal / value));
      discount = Math.floor(pointsRedeemed * value);
    }
  }
  return { items, subtotal, shipping, pointsRedeemed, discount, total: Math.max(0, subtotal + shipping - discount) };
}
