import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false, follow: true } };

export default function CartPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Bag" }]} title="Your bag" />
      <section className="section section--tight">
        <div className="wrap">
          <CartView />
        </div>
      </section>
    </>
  );
}
