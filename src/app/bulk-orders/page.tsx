import type { Metadata } from "next";
import { BulkForm } from "@/components/forms/BulkForm";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { getProducts } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Become a Consultant | Bulk Pricing",
  description: "Become a KudaratCare consultant or request bulk pricing for retail, resale, corporate and event orders.",
  alternates: { canonical: "/bulk-orders" },
};

export default async function BulkPage() {
  const products = await getProducts();
  return (
    <>
      <PageHero crumbs={[{ label: "Bulk & consultants" }]} title="Become a consultant or buy in bulk." lead="For consultants, retailers, resellers and bulk buyers. Share what you need and we will come back with pricing." />
      <section className="section">
        <div className="wrap consult">
          <div className="consult__aside">
            <ul className="mini-steps">
              <li>
                <Icon name="user" size={22} />
                <div>
                  <b>Consultants</b>
                  <p>Recommend KudaratCare and grow with us.</p>
                </div>
              </li>
              <li>
                <Icon name="box" size={22} />
                <div>
                  <b>Retailers & resellers</b>
                  <p>Stock our range at trade pricing.</p>
                </div>
              </li>
              <li>
                <Icon name="gift" size={22} />
                <div>
                  <b>Bulk buyers</b>
                  <p>Corporate gifting, events and large orders.</p>
                </div>
              </li>
            </ul>
          </div>
          <BulkForm productNames={products.map((p) => p.name)} />
        </div>
      </section>
    </>
  );
}
