import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Event = {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
    refund?: { entity?: { payment_id?: string } };
  };
};

// Source of truth for payment status, even if the customer closes the browser before verification.
// Razorpay dashboard: Webhooks > <site>/api/razorpay/webhook with payment.captured, order.paid, payment.failed, refund.processed.
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return NextResponse.json({ ok: false }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });

  const event = JSON.parse(raw) as Event;
  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id ?? event.payload?.order?.entity?.id;

  switch (event.event) {
    case "payment.captured":
    case "order.paid":
      if (orderId && payment?.id) await db.rpc("finalize_order", { p_razorpay_order_id: orderId, p_payment_id: payment.id });
      break;
    case "payment.failed":
      if (orderId) await db.rpc("mark_order_failed", { p_razorpay_order_id: orderId });
      break;
    case "refund.processed": {
      const paymentId = event.payload?.refund?.entity?.payment_id ?? payment?.id;
      if (paymentId) {
        const { data } = await db.from("orders").select("razorpay_order_id").eq("razorpay_payment_id", paymentId).maybeSingle();
        const rid = (data as { razorpay_order_id: string | null } | null)?.razorpay_order_id;
        if (rid) await db.rpc("mark_order_refunded", { p_razorpay_order_id: rid });
      }
      break;
    }
  }
  return NextResponse.json({ ok: true });
}
