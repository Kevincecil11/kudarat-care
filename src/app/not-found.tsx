import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow empty">
        <p className="eyebrow">404</p>
        <h1>We could not find that page.</h1>
        <p>It may have moved. Try the shop or head back home.</p>
        <div className="form__actions">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/shop" className="btn btn-ghost">
            Visit the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
