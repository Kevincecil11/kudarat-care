// Central business settings. Values marked `pending` are awaiting KudaratCare's confirmation.
// Phase 2: these move to the `site_settings` table and become editable in the admin.

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const site = {
  name: "KudaratCare",
  legalName: "Kudarat Care",
  tagline: "Skin, hair and a little guidance.",
  description:
    "Natural, herbal skin and hair care from KudaratCare. 100% vegan, paraben-free and cruelty-free, with doctor consultations, the Kudarat Care Journal and KC Circle rewards.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  isPreview: process.env.NEXT_PUBLIC_PREVIEW === "1",
  contact: {
    phone: null as string | null,
    whatsapp: env(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP),
    email: null as string | null,
    address: null as string | null,
  },
  clinic: {
    name: "Dr. Aditya Doshi's clinic",
    whatsapp: env(process.env.NEXT_PUBLIC_CLINIC_WHATSAPP),
  },
  social: {
    instagram: null as string | null,
    youtube: null as string | null,
    googleReviews: null as string | null,
  },
  shipping: {
    flatFee: 79,
    freeAbove: 999,
    deliveryEstimate: "3 to 7 business days",
    pending: true,
  },
  rewards: {
    name: "KC Circle",
    pointsPer100: 5,
    pointValueInr: 1,
    minRedeem: 100,
    photoReviewBonus: 50,
    videoReviewBonus: 100,
    expiryMonths: 12,
    pending: true,
  },
  values: [
    { title: "100% Vegan", text: "No animal-derived ingredients." },
    { title: "Natural & Herbal", text: "Rooted in botanicals." },
    { title: "Paraben-Free", text: "Formulated without parabens." },
    { title: "Cruelty-Free", text: "Ahimsa, always." },
    { title: "No Harmful Chemicals", text: "Thoughtfully formulated." },
  ],
};

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/consult", label: "Consult a Doctor" },
  { href: "/journal", label: "Journal" },
  { href: "/rewards", label: "KC Circle" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const pending = "To be confirmed by KudaratCare";
