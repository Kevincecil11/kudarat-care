import type { Metadata } from "next";
import { JournalBrowser } from "@/components/JournalBrowser";
import { PageHero } from "@/components/PageHero";
import { getPosts } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Kudarat Care Journal",
  description: "Educational notes on herbal skin care, hair care, ingredients and everyday wellness from KudaratCare.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero crumbs={[{ label: "Journal" }]} title={<>A little knowledge. A little better care.</>} lead="Herbal, skin care, hair care and wellness notes from KudaratCare." />
      <section className="section section--tight">
        <div className="wrap">
          <JournalBrowser posts={posts} />
        </div>
      </section>
    </>
  );
}
