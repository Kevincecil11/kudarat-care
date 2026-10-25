import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  // Phase 2: on success mark the Supabase order as `paid`, decrement stock and queue reward points.
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
