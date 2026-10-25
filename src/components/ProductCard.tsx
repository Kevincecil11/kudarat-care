import Link from "next/link";
import type { Product } from "@/lib/types";
import { discountPct } from "@/lib/format";
import { Photo } from "./Photo";
import { Price } from "./Price";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const off = discountPct(product.mrp, product.price);
  const soldOut = product.stock <= 0;
  return (
    <article className="pcard">
      <Link href={`/products/${product.slug}`} className="pcard__media" tabIndex={-1} aria-hidden="true">
        <Photo k={product.images[0]} alt="" sizes="(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 22vw" priority={priority} />
        {soldOut ? <span className="pcard__tag pcard__tag--muted">Sold out</span> : off > 0 ? <span className="pcard__tag">{off}% off</span> : null}
      </Link>
      <div className="pcard__body">
        <p className="pcard__cat">{product.subCategory}</p>
        <h3 className="pcard__title">
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="pcard__size">{product.size}</p>
        <div className="pcard__row">
          <Price price={product.price} mrp={product.mrp} />
          <QuickAdd slug={product.slug} name={product.name} disabled={soldOut} />
        </div>
      </div>
    </article>
  );
}
