import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { getProducts, getReviews } from "@/lib/repository";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read reviews from KudaratCare customers and share your own photo or video review to earn KC Circle points.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const [reviews, products] = await Promise.all([getReviews(), getProducts()]);
  return (
    <>
      <PageHero crumbs={[{ label: "Reviews" }]} title="Kind words from our community." lead={`Share a photo or video review and earn ${site.rewards.name} points once it is approved.`}>
        {site.social.googleReviews ? (
          <a className="link" href={site.social.googleReviews} target="_blank" rel="noopener noreferrer">
            <Icon name="google" size={18} /> Read our Google reviews
          </a>
        ) : null}
      </PageHero>
      <section className="section">
        <div className="wrap reviews-layout">
          <div className="grid-2">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} productName={products.find((p) => p.slug === r.productSlug)?.name} />
            ))}
          </div>
          <ReviewForm products={products.map((p) => ({ slug: p.slug, name: p.name }))} />
        </div>
      </section>
    </>
  );
}
