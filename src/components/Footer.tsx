import Link from "next/link";
import { site } from "@/lib/site";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop/skin-care", label: "Skin care" },
      { href: "/shop/hair-care", label: "Hair care" },
      { href: "/bulk-orders", label: "Bulk & consultants" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "/consult", label: "Consult a doctor" },
      { href: "/journal", label: "Kudarat Care Journal" },
      { href: "/rewards", label: "KC Circle rewards" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/policies/shipping-policy", label: "Shipping" },
      { href: "/policies/refund-policy", label: "Returns & refunds" },
    ],
  },
];

const socials = [
  { key: "instagram", label: "Instagram", href: site.social.instagram, icon: "instagram" as const },
  { key: "youtube", label: "YouTube", href: site.social.youtube, icon: "youtube" as const },
  { key: "google", label: "Google Reviews", href: site.social.googleReviews, icon: "google" as const },
];

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__grid">
          <div className="ft__brand">
            <Link href="/" aria-label="KudaratCare home">
              <Brand />
            </Link>
            <p>
              {site.tagline}
              <br />
              Natural, herbal and kind by design.
            </p>
            <div className="socials">
              {socials.map((s) =>
                s.href ? (
                  <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <Icon name={s.icon} />
                  </a>
                ) : (
                  <span key={s.key} className="is-pending" title={`${s.label} link pending`} aria-label={`${s.label} link pending`}>
                    <Icon name={s.icon} />
                  </span>
                ),
              )}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="ft__title">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ft__bottom">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <span className="ft__legal">
            <Link href="/policies/privacy-policy">Privacy</Link>
            <Link href="/policies/terms-and-conditions">Terms</Link>
          </span>
        </div>
        {site.isPreview ? (
          <p className="ft__note">Private build preview. Products, prices, imagery and reviews are samples until KudaratCare's content is imported.</p>
        ) : null}
      </div>
    </footer>
  );
}
