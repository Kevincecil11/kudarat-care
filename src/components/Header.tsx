"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { useCart } from "./cart/CartProvider";
import { Brand } from "./Brand";
import { Icon } from "./Icon";

export function Header() {
  const pathname = usePathname() || "/";
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/") || (href === "/shop" && pathname.startsWith("/products"));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const menuButton = menuRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <header className={scrolled ? "hdr is-scrolled" : "hdr"}>
      <div className="wrap hdr__in">
        <button
          ref={menuRef}
          type="button"
          className="icon-btn hdr__menu"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={22} />
        </button>
        <Link href="/" className="hdr__brand" aria-label="KudaratCare home">
          <Brand />
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hdr__actions">
          <Link href="/shop" className="icon-btn hdr__search" aria-label="Search products">
            <Icon name="search" />
          </Link>
          <Link href="/account" className="icon-btn" aria-label="Your account">
            <Icon name="user" />
          </Link>
          <Link href="/cart" className="icon-btn" aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}>
            <Icon name="bag" />
            {count > 0 ? <span className="badge">{count}</span> : null}
          </Link>
        </div>
      </div>

      <div className={open ? "scrim is-on" : "scrim"} onClick={() => setOpen(false)} aria-hidden="true" />
      <div id="mobile-menu" className={open ? "drawer is-on" : "drawer"} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <div className="drawer__hd">
          <Brand compact />
          <button ref={closeRef} type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav className="drawer__nav" aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/reviews", label: "Reviews" }, { href: "/bulk-orders", label: "Bulk & consultants" }].map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
              <Icon name="arrow" size={18} />
            </Link>
          ))}
        </nav>
        <div className="drawer__ft">
          <Link href="/account" className="btn btn-primary btn-block">
            My account
          </Link>
        </div>
      </div>
    </header>
  );
}
