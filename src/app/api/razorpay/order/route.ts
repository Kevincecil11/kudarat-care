import { NextResponse } from "next/server";
import { createRazorpayOrder, razorpayConfigured } from "@/lib/razorpay";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { priceCartFromDb } from "@/lib/checkout";
import type { CartLine } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  lines?: CartLine[];
  customer?: Record<string, string>;
  address?: Record<string, string>;
  redeemPoints?: boolean;
};

const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  const db = getSupabaseAdmin();
  if (!razorpayConfigured() || !db) return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Signed-in customers send their session token so the order and points attach to their account.
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const userId = token ? (await db.auth.getUser(token)).data.user?.id ?? null : null;

  const customer = { name: s(body.customer?.name, 80), email: s(body.customer?.email, 160).toLowerCase(), phone: s(body.customer?.phone, 20) };
  const address = { line1: s(body.address?.line1, 300), city: s(body.address?.city, 80), state: s(body.address?.state, 60), pincode: s(body.address?.pincode, 6) };
  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || customer.phone.length < 10 || !/^[1-9][0-9]{5}$/.test(address.pincode) || !address.line1) {
    return NextResponse.json({ error: "Please check your contact and address details" }, { status: 400 });
  }

  const { count: pinCount } = await db.from("serviceable_pincodes").select("pincode", { count: "exact", head: true });
  if (pinCount) {
    const { data: pin } = await db.from("serviceable_pincodes").select("pincode").eq("pincode", address.pincode).maybeSingle();
    if (!pin) return NextResponse.json({ error: `Sorry, we do not deliver to ${address.pincode} yet` }, { status: 409 });
  }

  const priced = await priceCartFromDb(db, Array.isArray(body.lines) ? body.lines : [], { userId, redeemPoints: Boolean(body.redeemPoints) });
  if ("error" in priced) return NextResponse.json({ error: priced.error }, { status: 409 });
  if (priced.total < 1) return NextResponse.json({ error: "Order total is too low for online payment" }, { status: 409 });

  // 1. Save a pending order, 2. create the Razorpay order, 3. link them.
  const { data: order, error } = await db
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: address,
      subtotal: priced.subtotal,
      shipping_fee: priced.shipping,
      points_redeemed: priced.pointsRedeemed,
      discount: priced.discount,
      total: priced.total,
    })
    .select("id, order_number")
    .single();
  if (error || !order) return NextResponse.json({ error: "Could not save the order" }, { status: 500 });
  const saved = order as { id: string; order_number: string };

  const items = await db.from("order_items").insert(
    priced.items.map((i) => ({ order_id: saved.id, product_id: i.productId, product_slug: i.slug, product_name: i.name, unit_price: i.price, quantity: i.qty })),
  );
  if (items.error) return NextResponse.json({ error: "Could not save the order" }, { status: 500 });

  try {
    const rp = await createRazorpayOrder(priced.total * 100, saved.order_number, { order_number: saved.order_number, email: customer.email });
    await db.from("orders").update({ razorpay_order_id: rp.id }).eq("id", saved.id);
    return NextResponse.json({ orderId: rp.id, amount: rp.amount, currency: rp.currency, receipt: saved.order_number });
  } catch {
    await db.from("orders").update({ status: "failed" }).eq("id", saved.id);
    return NextResponse.json({ error: "Could not start the payment" }, { status: 502 });
  }
}
