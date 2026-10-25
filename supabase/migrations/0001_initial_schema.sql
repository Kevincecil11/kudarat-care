-- KudaratCare initial schema (Phase 2). Run in the Supabase SQL editor or via `supabase db push`.
-- Every table has Row Level Security. Public visitors can only read published content;
-- customers can only see their own data; admins (profiles.role = 'admin') manage everything.

create extension if not exists "pgcrypto";

-- Profiles ---------------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Catalogue --------------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  sort_order int not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_id uuid references public.categories (id) on delete set null,
  sub_category text,
  short_description text,
  description text,
  key_ingredients text[] not null default '{}',
  how_to_use text[] not null default '{}',
  size text,
  mrp integer not null check (mrp >= 0),
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  gst_rate numeric(4, 2) not null default 18.00,
  hsn_code text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0
);

-- Orders -----------------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  subtotal integer not null,
  shipping_fee integer not null default 0,
  points_redeemed integer not null default 0,
  discount integer not null default 0,
  total integer not null,
  razorpay_order_id text unique,
  razorpay_payment_id text,
  invoice_number text,
  gstin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

-- Reviews ----------------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  media_urls text[] not null default '{}',
  media_type text check (media_type in ('photo', 'video')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_imported boolean not null default false,
  review_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- KC Circle rewards ------------------------------------------------------------------------
create table public.reward_rules (
  id smallint primary key default 1 check (id = 1),
  points_per_100 integer not null default 5,
  point_value_inr numeric(6, 2) not null default 1,
  min_redeem integer not null default 100,
  expiry_months integer not null default 12,
  photo_review_bonus integer not null default 50,
  video_review_bonus integer not null default 100,
  updated_at timestamptz not null default now()
);
insert into public.reward_rules (id) values (1);

create table public.reward_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  points integer not null,
  reason text not null check (reason in ('purchase', 'review_photo', 'review_video', 'redeem', 'reversal', 'adjustment', 'expiry')),
  order_id uuid references public.orders (id) on delete set null,
  review_id uuid references public.reviews (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create view public.reward_balances with (security_invoker = true) as
  select user_id, coalesce(sum(points), 0)::int as balance
  from public.reward_ledger
  where expires_at is null or expires_at > now()
  group by user_id;

-- Journal ----------------------------------------------------------------------------------
create table public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  category text not null default 'Skin',
  cover_url text,
  body text not null default '',
  author text not null default 'KudaratCare Journal',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enquiries --------------------------------------------------------------------------------
create table public.consult_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age smallint,
  phone text not null,
  email text,
  concern text not null,
  details text not null,
  preferred_time text,
  consent boolean not null check (consent),
  created_at timestamptz not null default now()
);

create table public.bulk_enquiries (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null check (enquiry_type in ('Consultant', 'Retailer', 'Reseller', 'Bulk buyer')),
  name text not null,
  business_name text not null,
  phone text not null,
  email text not null,
  product_of_interest text not null,
  quantity text not null,
  expected_budget text,
  delivery_address text not null,
  required_by date,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'closed')),
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Settings ---------------------------------------------------------------------------------
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_address text,
  contact_phone text,
  whatsapp text,
  email text,
  clinic_whatsapp text,
  instagram_url text,
  youtube_url text,
  google_reviews_url text,
  gstin text,
  shipping_fee integer not null default 79,
  free_shipping_above integer not null default 999,
  delivery_estimate text not null default '3 to 7 business days',
  about_text text,
  vision_text text,
  founder_note text,
  founder_photo_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1);

create table public.serviceable_pincodes (
  pincode char(6) primary key,
  city text,
  state text,
  cod_available boolean not null default false
);

create table public.advisors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  photo_url text,
  sort_order int not null default 0
);

create table public.policies (
  slug text primary key,
  title text not null,
  body text not null default '',
  updated_at timestamptz not null default now()
);

-- Row Level Security -----------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.reward_rules enable row level security;
alter table public.reward_ledger enable row level security;
alter table public.journal_posts enable row level security;
alter table public.consult_requests enable row level security;
alter table public.bulk_enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.serviceable_pincodes enable row level security;
alter table public.advisors enable row level security;
alter table public.policies enable row level security;

-- Public read
create policy "read categories" on public.categories for select using (true);
create policy "read active products" on public.products for select using (is_active or public.is_admin());
create policy "read product images" on public.product_images for select using (true);
create policy "read approved reviews" on public.reviews for select using (status = 'approved' or public.is_admin());
create policy "read published posts" on public.journal_posts for select using (is_published or public.is_admin());
create policy "read reward rules" on public.reward_rules for select using (true);
create policy "read settings" on public.site_settings for select using (true);
create policy "read pincodes" on public.serviceable_pincodes for select using (true);
create policy "read advisors" on public.advisors for select using (true);
create policy "read policies" on public.policies for select using (true);

-- Public submissions (insert only; nobody but admins can read them back)
create policy "submit review" on public.reviews for insert with check (status = 'pending' and not is_imported);
create policy "submit consult" on public.consult_requests for insert with check (consent);
create policy "submit bulk" on public.bulk_enquiries for insert with check (status = 'new');
create policy "submit contact" on public.contact_messages for insert with check (true);

-- Customer-owned data
create policy "own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "own orders" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "own points" on public.reward_ledger for select using (user_id = auth.uid() or public.is_admin());

-- Admin manage (orders and points are written by the server with the service role)
create policy "admin categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "admin reviews" on public.reviews for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete reviews" on public.reviews for delete using (public.is_admin());
create policy "admin posts" on public.journal_posts for all using (public.is_admin()) with check (public.is_admin());
create policy "admin reward rules" on public.reward_rules for update using (public.is_admin()) with check (public.is_admin());
create policy "admin orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "admin consults" on public.consult_requests for select using (public.is_admin());
create policy "admin bulk" on public.bulk_enquiries for select using (public.is_admin());
create policy "admin bulk update" on public.bulk_enquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admin contact" on public.contact_messages for select using (public.is_admin());
create policy "admin settings" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
create policy "admin pincodes" on public.serviceable_pincodes for all using (public.is_admin()) with check (public.is_admin());
create policy "admin advisors" on public.advisors for all using (public.is_admin()) with check (public.is_admin());
create policy "admin policies" on public.policies for all using (public.is_admin()) with check (public.is_admin());
create policy "admin points" on public.reward_ledger for insert with check (public.is_admin());

-- Helpful indexes
create index on public.products (category_id) where is_active;
create index on public.reviews (product_id) where status = 'approved';
create index on public.orders (user_id, created_at desc);
create index on public.reward_ledger (user_id);
create index on public.journal_posts (published_at desc) where is_published;

-- Storage: create public buckets `product-images`, `journal`, `brand` and a private bucket `review-media`
-- from the Supabase dashboard; review media is shown publicly only after approval via signed URLs.
