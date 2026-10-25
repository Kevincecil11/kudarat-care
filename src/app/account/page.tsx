import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: true } };

export default function AccountPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Account" }]} title="Your everyday care space." lead="Orders, KC Circle points and your details, all in one place." />
      <section className="section section--tight">
        <div className="wrap">
          <AccountView />
        </div>
      </section>
    </>
  );
}
