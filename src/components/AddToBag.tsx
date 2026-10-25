"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart/CartProvider";
import { Icon } from "./Icon";

export function AddToBag({ slug, stock }: { slug: string; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const soldOut = stock <= 0;
  const max = Math.max(1, Math.min(stock, 10));

  if (soldOut) {
    return (
      <div className="buy">
        <p className="stock stock--out">Currently sold out</p>
        <a className="btn btn-ghost btn-block" href="#notify" aria-disabled="true">
          Notify me when available
        </a>
      </div>
    );
  }

  return (
    <div className="buy">
      <p className={stock < 10 ? "stock stock--low" : "stock"}>
        <Icon name="check" size={16} /> {stock < 10 ? `Only ${stock} left in stock` : "In stock"}
      </p>
      <div className="buy__row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
            <Icon name="minus" size={16} />
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="Increase quantity" disabled={qty >= max}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <button type="button" className="btn btn-primary btn-grow" onClick={() => add(slug, qty)}>
          Add to bag
        </button>
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-block"
        onClick={() => {
          add(slug, qty, { silent: true });
          router.push("/checkout");
        }}
      >
        Buy now
      </button>
    </div>
  );
}
