import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Called by the browser right after payment. The webhook is the backup if the browser closes first.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return NextResponse.json({ ok: false }, { status: 400 });
  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) return NextResponse.json({ ok: false }, { status: 400 });

  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });
  const { data, error } = await db.rpc("finalize_order", { p_razorpay_order_id: razorpay_order_id, p_payment_id: razorpay_payment_id });
  if (error || !data) return NextResponse.json({ ok: false }, { status: 500 });
  const order = data as { order_number: string; points_earned: number; total: number };
  return NextResponse.json({ ok: true, orderNumber: order.order_number, pointsEarned: order.points_earned, total: order.total });
}
