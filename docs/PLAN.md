# KudaratCare full-stack build plan

**Client:** Kudarat Care (Maulika Doshi Shah) · **Studio:** MTRX Digital · **Fee:** ₹20,000 · **Target:** 10 to 12 working days after advance, content and access.

## Stack and why

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15 (App Router) + TypeScript** | Server-rendered HTML for every product, collection and article, per-page metadata, sitemap, robots and JSON-LD. Best SEO option for a React store. |
| Database, auth, storage | **Supabase** (Postgres + Row Level Security, email login links, Storage) | One managed backend for products, orders, reviews, rewards, Journal and enquiries. No server to maintain. |
| Payments | **Razorpay** (existing account) | UPI (including PhonePe and Google Pay apps), cards, net banking. Server-side order creation, signature verification and webhooks. |
| Hosting | **Vercel** (production) | Native Next.js hosting with incremental static regeneration, preview URLs and a global CDN. |
| Private preview | **GitHub Pages hidden folder** | Static export of this branch for internal review only. Not linked anywhere and marked `noindex`. |
| Analytics and SEO | GA4, Google Search Console, sitemap.xml, structured data | As listed in the client scope. |

## Branches and environments

- `main`: client-facing prototype. Untouched, except the workflow publishes the private preview into one hidden folder.
- `fullstack`: this Next.js source. All development happens here.
- Private preview: `https://kevincecil11.github.io/kudarat-care/studio-erepzt658c/` (rebuilt on every push to `fullstack`).
- Production: Vercel project connected to `main` after the switch-over.

## Scope mapped to the client's requirements

| # | Requirement | Where it lives | Status |
| --- | --- | --- | --- |
| 1 | About Us, vision, founder's note, advisory panel, differentiators | `/about`, `site_settings`, `advisors` | Built, content pending |
| 2 | Products from the Excel sheet | `/shop`, `/shop/[category]`, `/products/[slug]`, `products`, `product_images` | Built with sample data; import in Phase 2 |
| 3 | Shipping charges, free threshold, PIN codes, delivery time, returns | Cart, checkout, PIN checker, `site_settings`, `serviceable_pincodes`, `/policies/*` | Built, values pending |
| 4 | Razorpay, GST invoicing, PhonePe | `/api/razorpay/*`, `orders.gstin`, `invoice_number` | Routes built; keys in Phase 2 |
| 5 | Contact and legal pages | `/contact`, `/policies/[slug]` | Built, content pending |
| 6 | Reviews, customer submissions, photo/video reviews for points | `/reviews`, product pages, `reviews`, `review-media` bucket | Built (UI); storage in Phase 2 |
| 7 | Instagram, YouTube, Google Reviews | Home social band, footer, reviews page | Built, links pending |
| 8 | Kudarat Care Journal | `/journal`, `/journal/[slug]`, `journal_posts` | Built with sample articles |
| 9 | KC Circle: purchase, earn, redeem, repeat | `/rewards`, account, cart, `reward_rules`, `reward_ledger` | Built (UI); ledger in Phase 2 |
| 10 | Consult a Doctor form to the clinic's WhatsApp | `/consult`, `consult_requests` | Built; clinic number pending |
| 11 | Become a Consultant / Bulk Pricing form | `/bulk-orders`, `bulk_enquiries` | Built with all requested fields |
| 12 | GA, Search Console, SEO, backup, security, speed | Layout, `sitemap.ts`, `robots.ts`, JSON-LD, Supabase backups, RLS | SEO built; GA/GSC at launch |
| 13 | Simple non-technical backend | `/admin` (products, prices, stock, Journal, reviews, rewards, settings) | UI built; Supabase wiring in Phase 2 |

## Phases

| Phase | Days | Work |
| --- | --- | --- |
| 1. Frontend foundation | 1 to 3 | **Done today.** All pages, components, design system, cart, checkout UI, admin UI, SEO, schema, private preview pipeline. |
| 2. Supabase backend | 4 to 6 | Create project, run `supabase/migrations`, storage buckets, swap `src/lib/repository.ts` to Supabase, email login, admin role, product Excel import, reviews and enquiries saving. |
| 3. Payments and rewards | 7 to 8 | Razorpay keys, order creation and webhook persistence, stock decrement, points ledger, redemption at checkout, order emails. |
| 4. Content and client review | 9 to 10 | Real copy, products, policies and photos. Review round with the client. |
| 5. Launch and handover | 11 to 12 | Merge to `main`, deploy to Vercel, domain, GA4, Search Console, sitemap submission, speed and security checks, admin walkthrough. |

## Open items from the client

- Product Excel sheet and product photographs.
- About, vision, founder's note and photo, advisory panel.
- Shipping charges, free-shipping threshold, PIN codes, delivery time.
- Policies: privacy, terms, shipping, returns and refunds.
- Contact details, WhatsApp numbers (business and clinic), social links.
- Existing reviews with permission to publish.
- KC Circle rule confirmation (proposed defaults are in `src/lib/site.ts`).
- Domain and hosting access, Razorpay keys, GST details.

## Decisions to confirm

- Gifting is not in the client's final scope, so wedding and corporate gifting pages from the prototype were dropped. Bulk and corporate orders go through `/bulk-orders`.
- Consult a Doctor opens WhatsApp with the details prefilled and logs the request. Fully automatic forwarding would need the WhatsApp Business API, a separate paid service.
- Points are added after delivery and reversed on refunds. Review points never depend on the rating.
