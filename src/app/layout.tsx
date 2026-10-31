import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "../../css/logo.css";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { getProducts } from "@/lib/repository";
import { site } from "@/lib/site";

const heading = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-head", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "KudaratCare | Natural Herbal Skin & Hair Care", template: "%s | KudaratCare" },
  description: site.description,
  applicationName: site.name,
  keywords: ["herbal skin care", "natural hair care", "vegan skin care India", "paraben-free", "cruelty-free", "KudaratCare"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title: "KudaratCare | Natural Herbal Skin & Hair Care",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: site.noindex
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F1",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const products = await getProducts();
  const address = site.contact.address;
  return (
    <html lang="en-IN" className={`${heading.variable} ${body.variable}`}>
      <body>
        <SiteShell products={products}>{children}</SiteShell>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.legalName,
            url: site.url,
            description: site.description,
            ...(site.contact.email ? { email: site.contact.email } : {}),
            ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
            ...(address ? { address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "IN" } } : {}),
            sameAs: [site.social.instagram, site.social.youtube].filter(Boolean),
          }}
        />
        {gaId && !site.noindex ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
