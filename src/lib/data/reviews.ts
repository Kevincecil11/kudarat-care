import type { Review } from "../types";

// SAMPLE REVIEWS to show the layout. Replaced by KudaratCare's existing reviews (with permission) in Phase 2.
export const reviews: Review[] = [
  {
    id: "r1",
    productSlug: "kesar-glow-face-serum",
    name: "Sample customer",
    date: "2026-10-12",
    rating: 5,
    title: "Sample review layout",
    body: "This is where a genuine customer review will appear once KudaratCare shares existing reviews.",
    sample: true,
  },
  {
    id: "r2",
    productSlug: "bhringraj-nourishing-hair-oil",
    name: "Sample customer",
    date: "2026-10-09",
    rating: 4,
    title: "Photo review example",
    body: "Photo and video reviews will show here after approval from the admin.",
    mediaType: "photo",
    sample: true,
  },
  {
    id: "r3",
    productSlug: "gentle-herbal-face-cleanser",
    name: "Sample customer",
    date: "2026-10-03",
    rating: 5,
    title: "Sample review layout",
    body: "Reviews show the customer's name and date, and can be filtered by product.",
    sample: true,
  },
];
