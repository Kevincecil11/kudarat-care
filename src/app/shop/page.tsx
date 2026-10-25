import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ShopBrowser } from "@/components/ShopBrowser";
import { getCategories, getProducts } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Shop Herbal Skin & Hair Care",
  description: "Shop KudaratCare's natural, vegan, paraben-free skin and hair care: cleansers, serums, moisturisers, face packs, hair oils, shampoos and masks.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <>
      <PageHero crumbs={[{ label: "Shop" }]} title={<>Everyday care, thoughtfully chosen.</>} lead="Natural and herbal skin and hair care, 100% vegan and free from parabens." />
      <section className="section section--tight">
        <div className="wrap">
          <ShopBrowser products={products} categories={categories} />
        </div>
      </section>
    </>
  );
}
