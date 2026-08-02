-- Seed products into Supabase
-- Run this in the Supabase SQL Editor

insert into public.products (
  slug, name, category_slug, description,
  price, old_price, rating, reviews_count,
  emoji, gradient, tags, delivery,
  is_featured, is_trending, is_best_seller, is_flash_deal, is_free, is_active
) values
  (
  'p1', 'ChatGPT Plus — 1 Month', 'ai-tools', 'GPT-4o access, DALL·E, code interpreter & priority speed.',
  14.99, 24.99, 4.9, 3120,
  '🤖', 'linear-gradient(135deg, #FF6B6B 0%, #FF1E1E 50%, #8A0F0F 100%)',
  ARRAY['AI','OpenAI','GPT-4o']::text[],
  'instant',
  true, true, true,
  false, false, true
),
  (
  'p2', 'Midjourney Pro — 1 Month', 'ai-tools', 'Unlimited relaxed + 30 fast hours, commercial license.',
  19.99, 30, 4.8, 1840,
  '🎨', 'linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)',
  ARRAY['AI Art','Midjourney']::text[],
  'instant',
  true, true, false,
  false, false, true
),
  (
  'p3', 'Claude Pro — 1 Month', 'ai-tools', 'Claude 3.5 Sonnet, 5x more usage, priority access.',
  17.99, 20, 4.85, 980,
  '🧠', 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #5C3A06 100%)',
  ARRAY['Anthropic','Claude']::text[],
  'instant',
  false, true, true,
  false, false, true
),
  (
  'p4', 'Netflix Premium — 1 Month', 'subscriptions', '4K UHD on 4 devices, ad-free, downloads included.',
  9.49, 15.99, 4.7, 5210,
  '🍿', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)',
  ARRAY['Streaming','4K']::text[],
  'instant',
  true, false, true,
  false, false, true
),
  (
  'p5', 'Spotify Premium — 3 Months', 'subscriptions', 'Ad-free music, offline downloads, unlimited skips.',
  11.99, 32.97, 4.8, 4380,
  '🎧', 'linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)',
  ARRAY['Music','Streaming']::text[],
  'instant',
  false, true, false,
  true, false, true
),
  (
  'p6', 'YouTube Premium — 1 Month', 'subscriptions', 'Ad-free YouTube + YT Music + background play.',
  6.99, 13.99, 4.6, 2980,
  '▶️', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)',
  ARRAY['Video','Music']::text[],
  'instant',
  false, false, false,
  true, false, true
),
  (
  'p7', 'Steam Wallet $50', 'gift-cards', 'Top up your Steam wallet — works in all regions.',
  47.5, 50, 4.9, 8120,
  '💸', 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
  ARRAY['Gift Card','Steam']::text[],
  'instant',
  true, false, true,
  false, false, true
),
  (
  'p8', 'Apple Gift Card $100', 'gift-cards', 'Spend on App Store, iTunes, iCloud & Apple hardware.',
  95, 100, 4.95, 6400,
  '🍎', 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
  ARRAY['Gift Card','Apple']::text[],
  'instant',
  false, true, false,
  false, false, true
),
  (
  'p9', 'EA Sports FC 25 — PC', 'games', 'Latest football sim, Steam key, global activation.',
  29.99, 59.99, 4.5, 2210,
  '⚽', 'linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)',
  ARRAY['PC','Steam','Sports']::text[],
  'instant',
  true, false, false,
  true, false, true
),
  (
  'p10', 'Cyberpunk 2077 — PC', 'games', 'Phantom Liberty included, GOG key, global activation.',
  24.99, 49.99, 4.7, 5320,
  '🌆', 'linear-gradient(135deg, #A5F3FC 0%, #06B6D4 50%, #0E3A45 100%)',
  ARRAY['PC','RPG','Open World']::text[],
  'instant',
  false, true, true,
  false, false, true
),
  (
  'p11', 'Microsoft Office 365 — 1 Year', 'software', 'Word, Excel, PowerPoint + 1TB OneDrive for 5 devices.',
  39.99, 69.99, 4.8, 7100,
  '📄', 'linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)',
  ARRAY['Office','Productivity']::text[],
  'instant',
  true, false, true,
  false, false, true
),
  (
  'p12', 'Adobe Creative Cloud — 1 Year', 'software', 'Photoshop, Illustrator, Premiere Pro & 20+ apps.',
  129, 239.88, 4.6, 3120,
  '🎨', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)',
  ARRAY['Design','Creative']::text[],
  'instant',
  false, true, false,
  false, false, true
),
  (
  'p13', 'NordVPN — 2 Year Plan', 'software', 'Military-grade encryption, 5400+ servers, 6 devices.',
  49.99, 286, 4.7, 9800,
  '🛡️', 'linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)',
  ARRAY['VPN','Security']::text[],
  'instant',
  false, false, true,
  true, false, true
),
  (
  'p14', 'Discord Nitro — 1 Month', 'subscriptions', '2 server boosts, HD streaming, custom emoji & uploads.',
  4.99, 9.99, 4.7, 4500,
  '💬', 'linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)',
  ARRAY['Social','Boost']::text[],
  'instant',
  false, true, false,
  false, false, true
),
  (
  'p15', 'PlayStation Plus — 12 Months', 'subscriptions', 'Essential tier — online multiplayer + 3 monthly games.',
  39.99, 59.99, 4.6, 3890,
  '🎮', 'linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)',
  ARRAY['Console','PS5','PS4']::text[],
  'instant',
  false, false, true,
  false, false, true
),
  (
  'p16', 'AI Mega Bundle', 'bundles', 'ChatGPT + Midjourney + Claude Pro + 8 AI tools, 1 month each.',
  49.99, 119.94, 4.9, 1240,
  '📦', 'linear-gradient(135deg, #FF6B6B 0%, #FF1E1E 50%, #8A0F0F 100%)',
  ARRAY['Bundle','AI','Best Value']::text[],
  'instant',
  true, false, true,
  true, false, true
),
  (
  'p17', 'Streaming Bundle', 'bundles', 'Netflix + Spotify + YouTube Premium — 1 month each.',
  19.99, 39.48, 4.7, 980,
  '🎬', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)',
  ARRAY['Bundle','Streaming']::text[],
  'instant',
  false, true, false,
  false, false, true
),
  (
  'p18', 'Google Play Gift Card $25', 'gift-cards', 'Redeem for apps, games, movies & in-app purchases.',
  23.5, 25, 4.85, 5210,
  '▶️', 'linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)',
  ARRAY['Gift Card','Android']::text[],
  'instant',
  false, false, false,
  false, false, true
),
  (
  'p19', 'Free Image Converter', 'free-tools', 'Batch convert PNG, JPG, WebP & AVIF — 100% private.',
  0, NULL, 4.6, 870,
  '🖼️', 'linear-gradient(135deg, #A5F3FC 0%, #06B6D4 50%, #0E3A45 100%)',
  ARRAY['Free','Image']::text[],
  'instant',
  false, false, false,
  false, true, true
),
  (
  'p20', 'Free PDF Toolkit', 'free-tools', 'Merge, split, compress & sign PDFs right in your browser.',
  0, NULL, 4.7, 1320,
  '📑', 'linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)',
  ARRAY['Free','PDF']::text[],
  'instant',
  false, false, false,
  false, true, true
),
  (
  'p21', 'Free JSON Formatter', 'free-tools', 'Beautify, minify & validate JSON with live tree view.',
  0, NULL, 4.5, 540,
  '🧩', 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
  ARRAY['Free','Developer']::text[],
  'instant',
  false, false, false,
  false, true, true
),
  (
  'p22', 'AutoCAD 2025 — 1 Year License', 'software', 'Industry-standard CAD for architecture & engineering.',
  199, 399, 4.6, 760,
  '📐', 'linear-gradient(135deg, #A5F3FC 0%, #06B6D4 50%, #0E3A45 100%)',
  ARRAY['CAD','Design']::text[],
  'instant',
  true, false, false,
  false, false, true
),
  (
  'p23', 'Counter-Strike 2 Prime', 'games', 'Prime status upgrade — matchmaking, drops & XP.',
  11.99, 14.99, 4.7, 4200,
  '🔫', 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
  ARRAY['PC','FPS']::text[],
  'instant',
  false, true, false,
  false, false, true
),
  (
  'p24', 'Amazon Gift Card $50', 'gift-cards', 'Redeem across Amazon for millions of products.',
  48, 50, 4.9, 7300,
  '📦', 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #5C3A06 100%)',
  ARRAY['Gift Card','Amazon']::text[],
  'instant',
  false, false, true,
  false, false, true
)
on conflict (slug) do nothing;

-- Verify
select count(*) as total_products from public.products;
