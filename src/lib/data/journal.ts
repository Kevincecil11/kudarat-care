import type { JournalPost } from "../types";

// SAMPLE EDITORIAL for layout only. Final articles, authorship and review come from KudaratCare.
export const posts: JournalPost[] = [
  {
    slug: "understanding-your-skin-barrier",
    title: "Understanding your skin barrier",
    excerpt: "A gentler starting point for everyday skin care.",
    category: "Skin",
    date: "2026-10-20",
    readMinutes: 4,
    image: "botanical",
    author: "KudaratCare Journal",
    sample: true,
    sections: [
      {
        heading: "What the barrier does",
        body: [
          "Your skin's outer layer helps hold moisture in and keep everyday irritants out. When it is comfortable, skin tends to feel calm and soft.",
          "Harsh cleansing, very hot water and over-exfoliation can leave skin feeling tight or sensitive.",
        ],
      },
      {
        heading: "Keep the routine simple",
        body: [
          "A mild cleanser, a moisturiser you enjoy using and daily sun protection are a reliable foundation.",
          "Introduce one new product at a time so you can notice how your skin responds.",
        ],
      },
    ],
  },
  {
    slug: "a-simpler-hair-routine",
    title: "A simpler hair routine",
    excerpt: "Getting to know your hair without overcomplicating it.",
    category: "Hair",
    date: "2026-10-14",
    readMinutes: 5,
    image: "hair",
    author: "KudaratCare Journal",
    sample: true,
    sections: [
      {
        heading: "Start with the scalp",
        body: [
          "A clean, comfortable scalp is the base of any hair routine. Wash as often as your scalp needs, not on a fixed rule.",
        ],
      },
      {
        heading: "Oiling, the gentle way",
        body: [
          "A short, relaxed massage with a herbal oil before washing is a ritual many people enjoy. Use a small amount and wash it out thoroughly.",
        ],
      },
    ],
  },
  {
    slug: "getting-to-know-your-ingredients",
    title: "Getting to know your ingredients",
    excerpt: "A thoughtful look at the label behind the bottle.",
    category: "Ingredients",
    date: "2026-10-08",
    readMinutes: 6,
    image: "serum",
    author: "KudaratCare Journal",
    sample: true,
    sections: [
      {
        heading: "Reading a label",
        body: [
          "Ingredients are usually listed from the highest to the lowest concentration. The first few tell you the most about a formula.",
        ],
      },
      {
        heading: "Botanicals we love",
        body: ["Neem, tulsi, saffron and aloe vera have a long history in Indian self-care rituals."],
      },
    ],
  },
  {
    slug: "the-weekly-ubtan-ritual",
    title: "The weekly ubtan ritual",
    excerpt: "Bringing a traditional ritual into a modern week.",
    category: "Wellness",
    date: "2026-10-02",
    readMinutes: 3,
    image: "cleanser",
    author: "KudaratCare Journal",
    sample: true,
    sections: [
      {
        heading: "Make it a pause",
        body: ["Ten quiet minutes once a week can turn skin care into something you look forward to."],
      },
    ],
  },
];
