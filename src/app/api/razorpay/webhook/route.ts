import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

// Source of truth for payment status, even if the customer closes the browser before verification.
export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature)) return NextResponse.json({ ok: false }, { status: 401 });
  const event = JSON.parse(raw) as { event?: string };
  switch (event.event) {
    case "payment.captured":
    case "order.paid":
      // Phase 2: idempotently mark the order paid in Supabase.
      break;
    case "payment.failed":
      // Phase 2: mark the order failed and release reserved stock.
      break;
    case "refund.processed":
      // Phase 2: mark refunded and reverse any reward points.
      break;
  }
  return NextResponse.json({ ok: true });
}
