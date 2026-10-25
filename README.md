# KudaratCare

Storefront for KudaratCare: natural, herbal skin and hair care with doctor consultations, the Kudarat Care Journal and KC Circle rewards.

**Stack:** Next.js 15 (App Router, TypeScript) · Supabase · Razorpay · Vercel

See [`docs/PLAN.md`](docs/PLAN.md) for the full build plan, scope mapping and timeline.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in values as they become available
npm run dev                  # http://localhost:3000
```

## Project layout

```
src/app/            Routes (pages, SEO metadata, sitemap, robots, API routes)
src/components/     UI components (cart, forms, account, admin)
src/lib/            Data access (repository.ts), settings, formatting, Razorpay and Supabase helpers
src/lib/data/       Sample seed data used until Supabase is connected
supabase/           Database schema and Row Level Security policies
css/logo.css        Brand monogram and wordmark
.github/workflows/  Private preview build
```

All pages read data through `src/lib/repository.ts`, so connecting Supabase only changes that file.

## Private preview

Every push to `fullstack` builds a static copy and publishes it to a hidden, unlisted, `noindex` folder on the `main` GitHub Pages site. The client-facing prototype is not changed. API routes (payments) are excluded from the static preview and run on Vercel in production.
