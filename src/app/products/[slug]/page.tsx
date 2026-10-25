import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/AddToBag";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { PincodeCheck } from "@/components/PincodeCheck";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { getCategory, getProduct, getProducts, getRelatedProducts, getReviews } from "@/lib/repository";
import { absoluteUrl, formatINR, pointsFor } from "@/lib/format";
import { media } from "@/lib/media";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};
  const description = `${p.shortDescription} ${p.size}. Made with ${p.keyIngredients.slice(0, 3).join(", ")}. ${formatINR(p.price)}.`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description, images: [{ url: media[p.images[0]].large }] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const [category, related, reviews] = await Promise.all([getCategory(product.category), getRelatedProducts(slug), getReviews(slug)]);
  const r = site.rewards;

  return (
    <>
      <section className="section section--tight">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              {category ? (
                <li>
                  <Link href={`/shop/${category.slug}`}>{category.name}</Link>
                </li>
              ) : null}
              <li>
                <span aria-current="page">{product.name}</span>
              </li>
            </ol>
          </nav>
          <div className="pd">
            <div className="pd__gallery">
              {product.images.map((img, i) => (
                <Photo key={img + i} k={img} priority={i === 0} sizes="(max-width: 760px) 92vw, 50vw" alt={i === 0 ? product.name : `${product.name}, view ${i + 1}`} className={i === 0 ? "pd__main" : "pd__thumb"} />
              ))}
            </div>
            <div className="pd__info">
              <p className="eyebrow">{product.subCategory}</p>
              <h1>{product.name}</h1>
              <p className="pd__size">{product.size}</p>
              <Price price={product.price} mrp={product.mrp} large />
              <p className="pd__tax">MRP inclusive of all taxes</p>
              <p className="pd__lead">{product.shortDescription}</p>
              <ul className="pd__values">
                {site.values.slice(0, 4).map((v) => (
                  <li key={v.title}>
                    <Icon name="leaf" size={16} /> {v.title}
                  </li>
                ))}
              </ul>
              <AddToBag slug={product.slug} stock={product.stock} />
              <p className="summary__points">
                <Icon name="gift" size={18} /> Earn {pointsFor(product.price)} {r.name} points
              </p>
              <PincodeCheck />
              <div className="details">
                <details open>
                  <summary>Description</summary>
                  <p>{product.description}</p>
                </details>
                <details>
                  <summary>Key ingredients</summary>
                  <ul>
                    {product.keyIngredients.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </details>
                <details>
                  <summary>How to use</summary>
                  <ol>
                    {product.howToUse.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ol>
                </details>
                <details>
                  <summary>Shipping & returns</summary>
                  <p>
                    Free shipping on orders above {formatINR(site.shipping.freeAbove)}. Delivery in {site.shipping.deliveryEstimate}. See our{" "}
                    <Link href="/policies/refund-policy">return & refund policy</Link>.
                  </p>
                </details>
              </div>
              {product.sample ? <p className="notice">Sample product for the preview. Final details come from the product sheet.</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ivory" aria-labelledby="reviews-title">
        <div className="wrap">
          <div className="section__head">
            <h2 id="reviews-title">Reviews</h2>
            <Link href="/reviews#write" className="link">
              Write a review <Icon name="arrow" size={16} />
            </Link>
          </div>
          {reviews.length ? (
            <div className="grid-3">
              {reviews.map((rv) => (
                <ReviewCard key={rv.id} review={rv} />
              ))}
            </div>
          ) : (
            <p className="muted">No reviews yet. Be the first to share your experience.</p>
          )}
        </div>
      </section>

      {related.length ? (
        <section className="section">
          <div className="wrap">
            <div className="section__head">
              <h2>You may also like</h2>
            </div>
            <div className="grid-products">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((k) => media[k].large),
            sku: product.slug,
            brand: { "@type": "Brand", name: site.name },
            category: category?.name,
            offers: {
              "@type": "Offer",
              url: absoluteUrl(`/products/${product.slug}`),
              priceCurrency: "INR",
              price: product.price,
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
              ...(category ? [{ "@type": "ListItem", position: 3, name: category.name, item: absoluteUrl(`/shop/${category.slug}`) }] : []),
              { "@type": "ListItem", position: category ? 4 : 3, name: product.name },
            ],
          },
        ]}
      />
    </>
  );
}
