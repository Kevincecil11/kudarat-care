import { NextResponse } from "next/server";
import { createRazorpayOrder, priceCart, razorpayConfigured } from "@/lib/razorpay";
import type { CartLine } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!razorpayConfigured()) return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
  let body: { lines?: CartLine[]; customer?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const priced = await priceCart(Array.isArray(body.lines) ? body.lines : []);
  if (!priced) return NextResponse.json({ error: "Some items are unavailable" }, { status: 409 });

  const receipt = "KC" + Date.now().toString(36).toUpperCase();
  try {
    const order = await createRazorpayOrder(priced.total * 100, receipt, {
      email: String(body.customer?.email ?? "").slice(0, 120),
      phone: String(body.customer?.phone ?? "").slice(0, 20),
    });
    // Phase 2: insert a `pending` order and its items into Supabase here, keyed by order.id.
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, receipt });
  } catch {
    return NextResponse.json({ error: "Could not create payment" }, { status: 502 });
  }
}
