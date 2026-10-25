import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { CartProvider } from "./cart/CartProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ products, children }: { products: Product[]; children: ReactNode }) {
  return (
    <CartProvider products={products}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
