import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ShopBrowser } from "@/components/ShopBrowser";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/repository";
import { absoluteUrl } from "@/lib/format";

type Params = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const c = await getCategory(category);
  if (!c) return {};
  return {
    title: `Natural ${c.name}`,
    description: `${c.description} Shop KudaratCare ${c.name.toLowerCase()}: vegan, herbal and paraben-free.`,
    alternates: { canonical: `/shop/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const [c, products, categories] = await Promise.all([getCategory(category), getProductsByCategory(category), getCategories()]);
  if (!c) notFound();
  return (
    <>
      <PageHero crumbs={[{ href: "/shop", label: "Shop" }, { label: c.name }]} title={c.name} lead={c.description} />
      <section className="section section--tight">
        <div className="wrap">
          <ShopBrowser products={products} categories={categories} activeCategory={c.slug} />
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.name,
          itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/products/${p.slug}`), name: p.name })),
        }}
      />
    </>
  );
}
