"use client";
import { useCart } from "./cart/CartProvider";
import { Icon } from "./Icon";

export function QuickAdd({ slug, name, disabled }: { slug: string; name: string; disabled?: boolean }) {
  const { add } = useCart();
  return (
    <button type="button" className="quick-add" onClick={() => add(slug, 1)} disabled={disabled} aria-label={disabled ? `${name} is sold out` : `Add ${name} to bag`}>
      <Icon name="plus" size={18} />
    </button>
  );
}
