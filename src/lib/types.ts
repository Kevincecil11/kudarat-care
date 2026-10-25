import type { MediaKey } from "./media";

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: MediaKey;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  shortDescription: string;
  description: string;
  keyIngredients: string[];
  howToUse: string[];
  size: string;
  mrp: number;
  price: number;
  stock: number;
  images: MediaKey[];
  featured?: boolean;
  sample: boolean;
};

export type Review = {
  id: string;
  productSlug: string | null;
  name: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  mediaType?: "photo" | "video";
  sample: boolean;
};

export type JournalCategory = "Skin" | "Hair" | "Ingredients" | "Wellness";

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  date: string;
  readMinutes: number;
  image: MediaKey;
  author: string;
  sections: { heading: string; body: string[] }[];
  sample: boolean;
};

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
};

export type CartLine = { slug: string; qty: number };

export type OrderLine = { slug: string; name: string; qty: number; price: number };

export type Order = {
  id: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  pointsEarned: number;
  customer: { name: string; email: string; phone: string; city: string; pincode: string };
  status: "preview" | "pending" | "paid" | "shipped" | "delivered" | "cancelled";
};
