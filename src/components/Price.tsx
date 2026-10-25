import { discountPct, formatINR } from "@/lib/format";

export function Price({ price, mrp, large = false }: { price: number; mrp: number; large?: boolean }) {
  const off = discountPct(mrp, price);
  return (
    <span className={large ? "price price--lg" : "price"}>
      <span className="price__now">{formatINR(price)}</span>
      {off > 0 ? (
        <>
          <s className="price__mrp" aria-label={`MRP ${formatINR(mrp)}`}>
            {formatINR(mrp)}
          </s>
          {large ? <span className="price__off">{off}% off</span> : null}
        </>
      ) : null}
    </span>
  );
}
