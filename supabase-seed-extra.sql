-- Seed testimonials + blog posts
-- Run this in the Supabase SQL Editor after the product seed

-- Testimonials
insert into public.testimonials (name, role, country, flag, rating, text, initials, gradient) values
  (
  'Adeel Khan', 'Indie Developer', 'Pakistan', '🇵🇰',
  5, 'Got my ChatGPT Plus code in under 30 seconds. The PKR pricing and Easypaisa checkout made it frictionless.', 'AK', 'linear-gradient(135deg, #FF6B6B 0%, #FF1E1E 50%, #8A0F0F 100%)'
),
  (
  'Sarah Mitchell', 'Content Creator', 'United States', '🇺🇸',
  5, 'The AI Mega Bundle is insane value. Midjourney + Claude + 8 tools for the price of one subscription. Referral earnings are a sweet bonus.', 'SM', 'linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)'
),
  (
  'Rafiq Hossain', 'Student', 'Bangladesh', '🇧🇩',
  5, 'BDT checkout with bKash worked perfectly. Office 365 license activated instantly — saved me a fortune vs retail.', 'RH', 'linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)'
),
  (
  'Lina Petrova', 'Designer', 'Germany', '🇩🇪',
  5, 'Cleanest digital marketplace I''ve used. The dark UI is gorgeous and product pages actually tell you what you''re buying.', 'LP', 'linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)'
),
  (
  'Marcus Lee', 'Gamer', 'Singapore', '🇸🇬',
  5, 'Steam wallet top-ups at a discount and instant delivery every single time. This is my go-to store now.', 'ML', 'linear-gradient(135deg, #A5F3FC 0%, #06B6D4 50%, #0E3A45 100%)'
),
  (
  'Fatima Al-Sayed', 'Marketing Lead', 'UAE', '🇦🇪',
  5, 'Bought the Streaming Bundle for the whole team. Support resolved a question in minutes. Premium experience end to end.', 'FA', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)'
);

-- Blog posts
insert into public.blog_posts (slug, title, excerpt, category, author, emoji, gradient, published) values
  (
  'b1', '10 AI Tools That Will Define 2026', 'From GPT-5 rumors to autonomous agents — here are the AI tools every creator should have on their radar this year.', 'AI Tools',
  'Playbeat Team', '🤖', 'linear-gradient(135deg, #FF6B6B 0%, #FF1E1E 50%, #8A0F0F 100%)', true
),
  (
  'b2', 'How to Save 70% on Streaming Every Month', 'A practical breakdown of bundled streaming deals, regional pricing and family plans that actually work.', 'Subscriptions',
  'Sarah Mitchell', '📺', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)', true
),
  (
  'b3', 'The Ultimate PC Gaming Setup Under $800', 'We benchmarked budget GPUs, SSDs and indie game bundles to build the best value gaming rig of the year.', 'Games',
  'Marcus Lee', '🎮', 'linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)', true
),
  (
  'b4', 'Earn $500/Month with the Playbeat Affiliate Program', 'Real numbers from three affiliates who turned referrals into a steady side income. Strategy & assets inside.', 'Affiliate',
  'Playbeat Team', '💰', 'linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)', true
);

-- Verify counts
select 'products' as table_name, count(*) as total from public.products
union all
select 'testimonials', count(*) from public.testimonials
union all
select 'blog_posts', count(*) from public.blog_posts
union all
select 'categories', count(*) from public.categories;
