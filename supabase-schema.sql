-- ============================================================
-- Playbeat Digital — Supabase Database Schema
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  loyalty_points integer default 0,
  tier text default 'Bronze',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CATEGORIES
create table if not exists public.categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  emoji text,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 3. PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_slug text references public.categories(slug),
  description text,
  price numeric(10,2) not null default 0,
  old_price numeric(10,2),
  rating numeric(2,1) default 5.0,
  reviews_count integer default 0,
  emoji text,
  gradient text,
  tags text[],
  delivery text default 'instant',
  is_featured boolean default false,
  is_trending boolean default false,
  is_best_seller boolean default false,
  is_flash_deal boolean default false,
  is_free boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_number text unique not null,
  email text not null,
  total numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  payment_method text,
  status text default 'completed',
  created_at timestamptz default now()
);

-- 5. ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  price numeric(10,2) not null,
  quantity integer not null default 1,
  delivery_code text
);

-- 6. WISHLIST
create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 7. CART (server-side cart for logged-in users)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- 8. LOYALTY POINTS HISTORY
create table if not exists public.points_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz default now()
);

-- 9. REDEEMED REWARDS
create table if not exists public.redeemed_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  reward_id text not null,
  discount_amount numeric(10,2) not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- 10. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  emoji text,
  read boolean default false,
  created_at timestamptz default now()
);

-- 11. BLOG POSTS
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  category text,
  author text,
  emoji text,
  gradient text,
  published boolean default false,
  created_at timestamptz default now()
);

-- 12. TESTIMONIALS
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  country text,
  flag text,
  rating integer default 5,
  text text not null,
  initials text,
  gradient text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Profiles: users can read/update their own profile
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Categories: public read
alter table public.categories enable row level security;
create policy "Categories are public" on public.categories for select using (true);

-- Products: public read
alter table public.products enable row level security;
create policy "Products are public" on public.products for select using (is_active = true);

-- Orders: users see only their own orders
alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Order items: users see items for their own orders
alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items for select using (
  exists(select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Users can create own order items" on public.order_items for insert with check (
  exists(select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Wishlist: users manage their own
alter table public.wishlist enable row level security;
create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can add to own wishlist" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete from own wishlist" on public.wishlist for delete using (auth.uid() = user_id);

-- Cart: users manage their own
alter table public.cart_items enable row level security;
create policy "Users can view own cart" on public.cart_items for select using (auth.uid() = user_id);
create policy "Users can add to own cart" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update own cart" on public.cart_items for update using (auth.uid() = user_id);
create policy "Users can delete from own cart" on public.cart_items for delete using (auth.uid() = user_id);

-- Points history: users view their own
alter table public.points_history enable row level security;
create policy "Users can view own points history" on public.points_history for select using (auth.uid() = user_id);
create policy "Users can add own points history" on public.points_history for insert with check (auth.uid() = user_id);

-- Redeemed rewards: users manage their own
alter table public.redeemed_rewards enable row level security;
create policy "Users can view own rewards" on public.redeemed_rewards for select using (auth.uid() = user_id);
create policy "Users can create own rewards" on public.redeemed_rewards for insert with check (auth.uid() = user_id);

-- Notifications: users manage their own
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can insert own notifications" on public.notifications for insert with check (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications" on public.notifications for delete using (auth.uid() = user_id);

-- Blog posts: public read
alter table public.blog_posts enable row level security;
create policy "Blog posts are public" on public.blog_posts for select using (published = true);

-- Testimonials: public read
alter table public.testimonials enable row level security;
create policy "Testimonials are public" on public.testimonials for select using (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SEED DATA: CATEGORIES
-- ============================================================
insert into public.categories (slug, name, emoji, description, sort_order) values
  ('games', 'Games', '🎮', 'Steam keys, Epic codes, in-game currency & season passes', 1),
  ('software', 'Software', '💿', 'Lifetime licenses for Windows, Mac & productivity suites', 2),
  ('ai-tools', 'AI Tools', '🤖', 'ChatGPT Plus, Midjourney, Claude Pro & API credits', 3),
  ('subscriptions', 'Subscriptions', '📺', 'Netflix, Spotify, YouTube Premium & 200+ streaming apps', 4),
  ('gift-cards', 'Gift Cards', '🎁', 'Apple, Google Play, Amazon, Steam & PlayStation cards', 5),
  ('free-tools', 'Free Tools', '🧰', 'Free converters, calculators & developer utilities', 6),
  ('bundles', 'Bundles', '📦', 'Curated mega bundles at up to 80% off retail value', 7)
on conflict (slug) do nothing;

