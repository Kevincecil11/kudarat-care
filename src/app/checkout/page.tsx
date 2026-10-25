import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <>
      <PageHero crumbs={[{ href: "/cart", label: "Bag" }, { label: "Checkout" }]} title="Checkout" />
      <section className="section section--tight">
        <div className="wrap">
          <CheckoutView />
        </div>
      </section>
    </>
  );
}
