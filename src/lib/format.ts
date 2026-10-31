import { site } from "./site";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatINR = (value: number) => inr.format(value);

export const discountPct = (mrp: number, price: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);

export const shippingFor = (subtotal: number) => (subtotal <= 0 || subtotal >= site.shipping.freeAbove ? 0 : site.shipping.flatFee);

export const pointsFor = (subtotal: number) => Math.floor(subtotal / 100) * site.rewards.pointsPer100;

export const formatDate = (iso: string) =>
  new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const absoluteUrl = (path = "/") => site.url.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);

// wa.me needs the country code; Indian 10-digit mobile numbers get 91 added.
export const whatsappLink = (number: string, text: string) => {
  let digits = number.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) digits = "91" + digits;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};
