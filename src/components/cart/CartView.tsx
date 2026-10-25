"use client";
import Link from "next/link";
import { site } from "@/lib/site";
import { formatINR, pointsFor, shippingFor } from "@/lib/format";
import { useCart } from "./CartProvider";
import { Photo } from "../Photo";
import { Icon } from "../Icon";

export function CartView() {
  const { detailed, subtotal, setQty, remove, ready } = useCart();
  const shipping = shippingFor(subtotal);
  const toFree = Math.max(0, site.shipping.freeAbove - subtotal);

  if (!ready) return <div className="empty" aria-busy="true">Loading your bag…</div>;

  if (!detailed.length) {
    return (
      <div className="empty">
        <Icon name="bag" size={34} />
        <h2>Your bag is empty</h2>
        <p>Explore herbal skin and hair care made with kind ingredients.</p>
        <Link href="/shop" className="btn btn-primary">
          Shop the range
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section aria-labelledby="bag-items">
        <h2 id="bag-items" className="sr-only">
          Items in your bag
        </h2>
        <div className="ship-meter" role="status">
          {toFree > 0 ? (
            <p>
              Add <b>{formatINR(toFree)}</b> more for free shipping.
            </p>
          ) : (
            <p>
              <Icon name="check" size={16} /> You have free shipping.
            </p>
          )}
          <span className="ship-meter__bar">
            <span style={{ width: `${Math.min(100, (subtotal / site.shipping.freeAbove) * 100)}%` }} />
          </span>
        </div>
        <ul className="cart-lines">
          {detailed.map(({ product, qty, lineTotal }) => (
            <li key={product.slug} className="cart-line">
              <Link href={`/products/${product.slug}`} className="cart-line__img" tabIndex={-1} aria-hidden="true">
                <Photo k={product.images[0]} alt="" sizes="120px" />
              </Link>
              <div className="cart-line__info">
                <Link href={`/products/${product.slug}`} className="cart-line__name">
                  {product.name}
                </Link>
                <span className="muted">
                  {product.size} · {formatINR(product.price)}
                </span>
                <div className="cart-line__actions">
                  <div className="qty qty--sm" role="group" aria-label={`Quantity for ${product.name}`}>
                    <button type="button" onClick={() => setQty(product.slug, qty - 1)} aria-label="Decrease quantity">
                      <Icon name="minus" size={14} />
                    </button>
                    <output>{qty}</output>
                    <button type="button" onClick={() => setQty(product.slug, qty + 1)} aria-label="Increase quantity" disabled={qty >= product.stock}>
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                  <button type="button" className="text-btn" onClick={() => remove(product.slug)}>
                    Remove
                  </button>
                </div>
              </div>
              <b className="cart-line__total">{formatINR(lineTotal)}</b>
            </li>
          ))}
        </ul>
      </section>
      <aside className="summary card" aria-label="Order summary">
        <h2>Order summary</h2>
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatINR(subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{shipping ? formatINR(shipping) : "Free"}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd>{formatINR(subtotal + shipping)}</dd>
          </div>
        </dl>
        <p className="summary__points">
          <Icon name="gift" size={18} /> Earn <b>{pointsFor(subtotal)}</b> {site.rewards.name} points with this order
        </p>
        <Link href="/checkout" className="btn btn-primary btn-block">
          Checkout securely
        </Link>
        <p className="summary__note">
          <Icon name="shield" size={16} /> Payments via Razorpay: UPI, PhonePe, cards and net banking.
        </p>
      </aside>
    </div>
  );
}
