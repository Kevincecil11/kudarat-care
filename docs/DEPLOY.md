# Deploying KudaratCare

Hosting: Vercel project `kudarat-care` (branch `fullstack`). Database: Supabase project `Kudarat Care` (Mumbai).

## Vercel environment variables

| Key | Where it comes from | Type |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | Plain |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase > Project Settings > API Keys > Legacy API keys > anon | Plain |
| SUPABASE_SERVICE_ROLE_KEY | Supabase > Project Settings > API Keys > Legacy API keys > service_role | Sensitive |
| NEXT_PUBLIC_SITE_URL | Live address, e.g. https://kudarat-care.vercel.app | Plain |
| NEXT_PUBLIC_NOINDEX | `1` until launch, then delete | Plain |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay > Account & Settings > API Keys | Plain |
| RAZORPAY_KEY_SECRET | Razorpay API Keys (shown once) | Sensitive |
| RAZORPAY_WEBHOOK_SECRET | Razorpay > Webhooks, URL `/api/razorpay/webhook` | Sensitive |
| VERCEL_DEPLOY_HOOK_URL | Vercel > Settings > Git > Deploy Hooks (branch fullstack) | Sensitive |

After changing variables, redeploy.

## Supabase Auth URLs

Authentication > URL Configuration

- Site URL: the live address
- Redirect URLs: `https://<live-address>/**` and the private preview `https://kevincecil11.github.io/kudarat-care/studio-erepzt658c/**`

## Launch checklist

1. Point the client's domain at Vercel and update NEXT_PUBLIC_SITE_URL and the Supabase URLs.
2. Delete NEXT_PUBLIC_NOINDEX and redeploy.
3. Swap Razorpay test keys for live keys.
4. Replace every [TO CONFIRM] in Admin > Policies.
5. Hide sample products and journal posts.
