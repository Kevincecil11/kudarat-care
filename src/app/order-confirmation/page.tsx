import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/cart/OrderConfirmation";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false, follow: false } };

export default function OrderConfirmationPage() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <OrderConfirmation />
      </div>
    </section>
  );
}
