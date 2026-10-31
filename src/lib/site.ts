// Central business settings. Values come from the admin (Site settings + KC Circle rules),
// read at build time by next.config.mjs. Defaults below are used until the admin fills them in.

const env = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

type Live = { settings?: Record<string, unknown> | null; rewards?: Record<string, unknown> | null };
const live: Live = (() => {
  try {
    return JSON.parse(process.env.NEXT_PUBLIC_SITE_SETTINGS || "{}") as Live;
  } catch {
    return {};
  }
})();
const s = live.settings ?? {};
const r = live.rewards ?? {};
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const num = (v: unknown, d: number) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : d;
};

const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

export const site = {
  name: "KudaratCare",
  legalName: text(s.legal_name) ?? "Kudarat Care",
  gstin: text(s.gstin),
  tagline: "Skin, hair and a little guidance.",
  description:
    "Natural, herbal skin and hair care from KudaratCare. 100% vegan, paraben-free and cruelty-free, with doctor consultations, the Kudarat Care Journal and KC Circle rewards.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  isPreview,
  // Keeps search engines away from the preview and from staging (e.g. the vercel.app address before launch).
  noindex: isPreview || process.env.NEXT_PUBLIC_NOINDEX === "1",
  contact: {
    phone: text(s.contact_phone),
    whatsapp: text(s.whatsapp) ?? env(process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP),
    email: text(s.email),
    address: text(s.business_address),
  },
  grievance: {
    name: text(s.grievance_officer_name),
    email: text(s.grievance_officer_email),
    phone: text(s.grievance_officer_phone),
  },
  clinic: {
    name: "Dr. Aditya Doshi's clinic",
    whatsapp: text(s.clinic_whatsapp) ?? env(process.env.NEXT_PUBLIC_CLINIC_WHATSAPP),
  },
  social: {
    instagram: text(s.instagram_url),
    youtube: text(s.youtube_url),
    googleReviews: text(s.google_reviews_url),
  },
  shipping: {
    flatFee: num(s.shipping_fee, 79),
    freeAbove: num(s.free_shipping_above, 999),
    deliveryEstimate: text(s.delivery_estimate) ?? "3 to 7 business days",
    cod: Boolean(s.cod_enabled),
    pending: !live.settings,
  },
  rewards: {
    name: "KC Circle",
    pointsPer100: num(r.points_per_100, 5),
    pointValueInr: num(r.point_value_inr, 1),
    minRedeem: num(r.min_redeem, 100),
    photoReviewBonus: num(r.photo_review_bonus, 50),
    videoReviewBonus: num(r.video_review_bonus, 100),
    expiryMonths: num(r.expiry_months, 12),
    pending: !live.rewards,
  },
  about: {
    text: text(s.about_text),
    vision: text(s.vision_text),
    founderNote: text(s.founder_note),
    founderPhoto: text(s.founder_photo),
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

// Split admin text into paragraphs (blank line = new paragraph).
export const paragraphs = (value: string | null) => (value ? value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : []);
