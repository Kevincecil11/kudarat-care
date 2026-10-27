export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string; // media key or image URL
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
  images: string[]; // media keys or image URLs, first one is the main photo
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
  media?: string[]; // private storage paths, shown via short-lived signed links
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
  image: string; // media key or image URL
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
  status: "preview" | "pending" | "paid" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded" | "failed";
};
