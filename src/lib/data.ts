/* ------------------------------------------------------------------
 * Playbeat Digital — central content catalog (frontend-only data)
 * Product "covers" are deterministic gradients so nothing ever breaks
 * and the dark premium aesthetic stays consistent.
 * ------------------------------------------------------------------ */

export type CategorySlug =
  | "games"
  | "software"
  | "ai-tools"
  | "subscriptions"
  | "gift-cards"
  | "free-tools"
  | "bundles";

export interface Category {
  slug: CategorySlug;
  name: string;
  emoji: string;
  count: number;
  description: string;
  gradient: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  emoji: string;
  gradient: string;
  tags: string[];
  delivery: "instant" | "manual";
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  flashDeal?: boolean;
  isFree?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  flag: string;
  rating: number;
  text: string;
  initials: string;
  gradient: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  emoji: string;
  gradient: string;
}

/* ---------------------------- Categories ---------------------------- */
export const CATEGORIES: Category[] = [
  {
    slug: "games",
    name: "Games",
    emoji: "🎮",
    count: 1240,
    description: "Steam keys, Epic codes, in-game currency & season passes",
    gradient: "linear-gradient(135deg, #6C2BD9 0%, #2B0F5A 100%)",
  },
  {
    slug: "software",
    name: "Software",
    emoji: "💿",
    count: 860,
    description: "Lifetime licenses for Windows, Mac & productivity suites",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #0B3A66 100%)",
  },
  {
    slug: "ai-tools",
    name: "AI Tools",
    emoji: "🤖",
    count: 312,
    description: "ChatGPT Plus, Midjourney, Claude Pro & API credits",
    gradient: "linear-gradient(135deg, #FF1E1E 0%, #8A0F0F 100%)",
  },
  {
    slug: "subscriptions",
    name: "Subscriptions",
    emoji: "📺",
    count: 540,
    description: "Netflix, Spotify, YouTube Premium & 200+ streaming apps",
    gradient: "linear-gradient(135deg, #FF4D6D 0%, #5A0E22 100%)",
  },
  {
    slug: "gift-cards",
    name: "Gift Cards",
    emoji: "🎁",
    count: 980,
    description: "Apple, Google Play, Amazon, Steam & PlayStation cards",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #143A18 100%)",
  },
  {
    slug: "free-tools",
    name: "Free Tools",
    emoji: "🧰",
    count: 74,
    description: "Free converters, calculators & developer utilities",
    gradient: "linear-gradient(135deg, #4D8DFF 0%, #0E2A66 100%)",
  },
  {
    slug: "bundles",
    name: "Bundles",
    emoji: "📦",
    count: 56,
    description: "Curated mega bundles at up to 80% off retail value",
    gradient: "linear-gradient(135deg, #B388FF 0%, #3B1A78 100%)",
  },
];

/* ----------------------------- Products ----------------------------- */
const G = {
  gold: "linear-gradient(135deg, #FF6B6B 0%, #FF1E1E 50%, #8A0F0F 100%)",
  azure: "linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)",
  violet: "linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)",
  rose: "linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)",
  emerald: "linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)",
  cyan: "linear-gradient(135deg, #A5F3FC 0%, #06B6D4 50%, #0E3A45 100%)",
  amber: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #5C3A06 100%)",
  slate: "linear-gradient(135deg, #475569 0%, #1E293B 100%)",
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "ChatGPT Plus — 1 Month",
    category: "ai-tools",
    description: "GPT-4o access, DALL·E, code interpreter & priority speed.",
    price: 14.99,
    oldPrice: 24.99,
    rating: 4.9,
    reviews: 3120,
    emoji: "🤖",
    gradient: G.gold,
    tags: ["AI", "OpenAI", "GPT-4o"],
    delivery: "instant",
    featured: true,
    trending: true,
    bestSeller: true,
  },
  {
    id: "p2",
    name: "Midjourney Pro — 1 Month",
    category: "ai-tools",
    description: "Unlimited relaxed + 30 fast hours, commercial license.",
    price: 19.99,
    oldPrice: 30.0,
    rating: 4.8,
    reviews: 1840,
    emoji: "🎨",
    gradient: G.violet,
    tags: ["AI Art", "Midjourney"],
    delivery: "instant",
    featured: true,
    trending: true,
  },
  {
    id: "p3",
    name: "Claude Pro — 1 Month",
    category: "ai-tools",
    description: "Claude 3.5 Sonnet, 5x more usage, priority access.",
    price: 17.99,
    oldPrice: 20.0,
    rating: 4.85,
    reviews: 980,
    emoji: "🧠",
    gradient: G.amber,
    tags: ["Anthropic", "Claude"],
    delivery: "instant",
    trending: true,
    bestSeller: true,
  },
  {
    id: "p4",
    name: "Netflix Premium — 1 Month",
    category: "subscriptions",
    description: "4K UHD on 4 devices, ad-free, downloads included.",
    price: 9.49,
    oldPrice: 15.99,
    rating: 4.7,
    reviews: 5210,
    emoji: "🍿",
    gradient: G.rose,
    tags: ["Streaming", "4K"],
    delivery: "instant",
    featured: true,
    bestSeller: true,
  },
  {
    id: "p5",
    name: "Spotify Premium — 3 Months",
    category: "subscriptions",
    description: "Ad-free music, offline downloads, unlimited skips.",
    price: 11.99,
    oldPrice: 32.97,
    rating: 4.8,
    reviews: 4380,
    emoji: "🎧",
    gradient: G.emerald,
    tags: ["Music", "Streaming"],
    delivery: "instant",
    trending: true,
    flashDeal: true,
  },
  {
    id: "p6",
    name: "YouTube Premium — 1 Month",
    category: "subscriptions",
    description: "Ad-free YouTube + YT Music + background play.",
    price: 6.99,
    oldPrice: 13.99,
    rating: 4.6,
    reviews: 2980,
    emoji: "▶️",
    gradient: G.rose,
    tags: ["Video", "Music"],
    delivery: "instant",
    flashDeal: true,
  },
  {
    id: "p7",
    name: "Steam Wallet $50",
    category: "gift-cards",
    description: "Top up your Steam wallet — works in all regions.",
    price: 47.5,
    oldPrice: 50.0,
    rating: 4.9,
    reviews: 8120,
    emoji: "💸",
    gradient: G.slate,
    tags: ["Gift Card", "Steam"],
    delivery: "instant",
    featured: true,
    bestSeller: true,
  },
  {
    id: "p8",
    name: "Apple Gift Card $100",
    category: "gift-cards",
    description: "Spend on App Store, iTunes, iCloud & Apple hardware.",
    price: 95.0,
    oldPrice: 100.0,
    rating: 4.95,
    reviews: 6400,
    emoji: "🍎",
    gradient: G.slate,
    tags: ["Gift Card", "Apple"],
    delivery: "instant",
    trending: true,
  },
  {
    id: "p9",
    name: "EA Sports FC 25 — PC",
    category: "games",
    description: "Latest football sim, Steam key, global activation.",
    price: 29.99,
    oldPrice: 59.99,
    rating: 4.5,
    reviews: 2210,
    emoji: "⚽",
    gradient: G.violet,
    tags: ["PC", "Steam", "Sports"],
    delivery: "instant",
    featured: true,
    flashDeal: true,
  },
  {
    id: "p10",
    name: "Cyberpunk 2077 — PC",
    category: "games",
    description: "Phantom Liberty included, GOG key, global activation.",
    price: 24.99,
    oldPrice: 49.99,
    rating: 4.7,
    reviews: 5320,
    emoji: "🌆",
    gradient: G.cyan,
    tags: ["PC", "RPG", "Open World"],
    delivery: "instant",
    trending: true,
    bestSeller: true,
  },
  {
    id: "p11",
    name: "Microsoft Office 365 — 1 Year",
    category: "software",
    description: "Word, Excel, PowerPoint + 1TB OneDrive for 5 devices.",
    price: 39.99,
    oldPrice: 69.99,
    rating: 4.8,
    reviews: 7100,
    emoji: "📄",
    gradient: G.azure,
    tags: ["Office", "Productivity"],
    delivery: "instant",
    featured: true,
    bestSeller: true,
  },
  {
    id: "p12",
    name: "Adobe Creative Cloud — 1 Year",
    category: "software",
    description: "Photoshop, Illustrator, Premiere Pro & 20+ apps.",
    price: 129.0,
    oldPrice: 239.88,
    rating: 4.6,
    reviews: 3120,
    emoji: "🎨",
    gradient: G.rose,
    tags: ["Design", "Creative"],
    delivery: "instant",
    trending: true,
  },
  {
    id: "p13",
    name: "NordVPN — 2 Year Plan",
    category: "software",
    description: "Military-grade encryption, 5400+ servers, 6 devices.",
    price: 49.99,
    oldPrice: 286.0,
    rating: 4.7,
    reviews: 9800,
    emoji: "🛡️",
    gradient: G.azure,
    tags: ["VPN", "Security"],
    delivery: "instant",
    flashDeal: true,
    bestSeller: true,
  },
  {
    id: "p14",
    name: "Discord Nitro — 1 Month",
    category: "subscriptions",
    description: "2 server boosts, HD streaming, custom emoji & uploads.",
    price: 4.99,
    oldPrice: 9.99,
    rating: 4.7,
    reviews: 4500,
    emoji: "💬",
    gradient: G.violet,
    tags: ["Social", "Boost"],
    delivery: "instant",
    trending: true,
  },
  {
    id: "p15",
    name: "PlayStation Plus — 12 Months",
    category: "subscriptions",
    description: "Essential tier — online multiplayer + 3 monthly games.",
    price: 39.99,
    oldPrice: 59.99,
    rating: 4.6,
    reviews: 3890,
    emoji: "🎮",
    gradient: G.azure,
    tags: ["Console", "PS5", "PS4"],
    delivery: "instant",
    bestSeller: true,
  },
  {
    id: "p16",
    name: "AI Mega Bundle",
    category: "bundles",
    description: "ChatGPT + Midjourney + Claude Pro + 8 AI tools, 1 month each.",
    price: 49.99,
    oldPrice: 119.94,
    rating: 4.9,
    reviews: 1240,
    emoji: "📦",
    gradient: G.gold,
    tags: ["Bundle", "AI", "Best Value"],
    delivery: "instant",
    featured: true,
    flashDeal: true,
    bestSeller: true,
  },
  {
    id: "p17",
    name: "Streaming Bundle",
    category: "bundles",
    description: "Netflix + Spotify + YouTube Premium — 1 month each.",
    price: 19.99,
    oldPrice: 39.48,
    rating: 4.7,
    reviews: 980,
    emoji: "🎬",
    gradient: G.rose,
    tags: ["Bundle", "Streaming"],
    delivery: "instant",
    trending: true,
  },
  {
    id: "p18",
    name: "Google Play Gift Card $25",
    category: "gift-cards",
    description: "Redeem for apps, games, movies & in-app purchases.",
    price: 23.5,
    oldPrice: 25.0,
    rating: 4.85,
    reviews: 5210,
    emoji: "▶️",
    gradient: G.emerald,
    tags: ["Gift Card", "Android"],
    delivery: "instant",
  },
  {
    id: "p19",
    name: "Free Image Converter",
    category: "free-tools",
    description: "Batch convert PNG, JPG, WebP & AVIF — 100% private.",
    price: 0,
    rating: 4.6,
    reviews: 870,
    emoji: "🖼️",
    gradient: G.cyan,
    tags: ["Free", "Image"],
    delivery: "instant",
    isFree: true,
  },
  {
    id: "p20",
    name: "Free PDF Toolkit",
    category: "free-tools",
    description: "Merge, split, compress & sign PDFs right in your browser.",
    price: 0,
    rating: 4.7,
    reviews: 1320,
    emoji: "📑",
    gradient: G.rose,
    tags: ["Free", "PDF"],
    delivery: "instant",
    isFree: true,
  },
  {
    id: "p21",
    name: "Free JSON Formatter",
    category: "free-tools",
    description: "Beautify, minify & validate JSON with live tree view.",
    price: 0,
    rating: 4.5,
    reviews: 540,
    emoji: "🧩",
    gradient: G.slate,
    tags: ["Free", "Developer"],
    delivery: "instant",
    isFree: true,
  },
  {
    id: "p22",
    name: "AutoCAD 2025 — 1 Year License",
    category: "software",
    description: "Industry-standard CAD for architecture & engineering.",
    price: 199.0,
    oldPrice: 399.0,
    rating: 4.6,
    reviews: 760,
    emoji: "📐",
    gradient: G.cyan,
    tags: ["CAD", "Design"],
    delivery: "instant",
    featured: true,
  },
  {
    id: "p23",
    name: "Counter-Strike 2 Prime",
    category: "games",
    description: "Prime status upgrade — matchmaking, drops & XP.",
    price: 11.99,
    oldPrice: 14.99,
    rating: 4.7,
    reviews: 4200,
    emoji: "🔫",
    gradient: G.slate,
    tags: ["PC", "FPS"],
    delivery: "instant",
    trending: true,
  },
  {
    id: "p24",
    name: "Amazon Gift Card $50",
    category: "gift-cards",
    description: "Redeem across Amazon for millions of products.",
    price: 48.0,
    oldPrice: 50.0,
    rating: 4.9,
    reviews: 7300,
    emoji: "📦",
    gradient: G.amber,
    tags: ["Gift Card", "Amazon"],
    delivery: "instant",
    bestSeller: true,
  },
];

/* --------------------------- Testimonials --------------------------- */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Adeel Khan",
    role: "Indie Developer",
    country: "Pakistan",
    flag: "🇵🇰",
    rating: 5,
    text: "Got my ChatGPT Plus code in under 30 seconds. The PKR pricing and Easypaisa checkout made it frictionless.",
    initials: "AK",
    gradient: G.gold,
  },
  {
    id: "t2",
    name: "Sarah Mitchell",
    role: "Content Creator",
    country: "United States",
    flag: "🇺🇸",
    rating: 5,
    text: "The AI Mega Bundle is insane value. Midjourney + Claude + 8 tools for the price of one subscription. Referral earnings are a sweet bonus.",
    initials: "SM",
    gradient: G.azure,
  },
  {
    id: "t3",
    name: "Rafiq Hossain",
    role: "Student",
    country: "Bangladesh",
    flag: "🇧🇩",
    rating: 5,
    text: "BDT checkout with bKash worked perfectly. Office 365 license activated instantly — saved me a fortune vs retail.",
    initials: "RH",
    gradient: G.emerald,
  },
  {
    id: "t4",
    name: "Lina Petrova",
    role: "Designer",
    country: "Germany",
    flag: "🇩🇪",
    rating: 5,
    text: "Cleanest digital marketplace I've used. The dark UI is gorgeous and product pages actually tell you what you're buying.",
    initials: "LP",
    gradient: G.violet,
  },
  {
    id: "t5",
    name: "Marcus Lee",
    role: "Gamer",
    country: "Singapore",
    flag: "🇸🇬",
    rating: 5,
    text: "Steam wallet top-ups at a discount and instant delivery every single time. This is my go-to store now.",
    initials: "ML",
    gradient: G.cyan,
  },
  {
    id: "t6",
    name: "Fatima Al-Sayed",
    role: "Marketing Lead",
    country: "UAE",
    flag: "🇦🇪",
    rating: 5,
    text: "Bought the Streaming Bundle for the whole team. Support resolved a question in minutes. Premium experience end to end.",
    initials: "FA",
    gradient: G.rose,
  },
];

/* ----------------------------- Blog ----------------------------- */
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "b1",
    title: "10 AI Tools That Will Define 2026",
    excerpt:
      "From GPT-5 rumors to autonomous agents — here are the AI tools every creator should have on their radar this year.",
    category: "AI Tools",
    author: "Playbeat Team",
    date: "Jan 12, 2026",
    readingTime: "7 min read",
    emoji: "🤖",
    gradient: G.gold,
  },
  {
    id: "b2",
    title: "How to Save 70% on Streaming Every Month",
    excerpt:
      "A practical breakdown of bundled streaming deals, regional pricing and family plans that actually work.",
    category: "Subscriptions",
    author: "Sarah Mitchell",
    date: "Jan 9, 2026",
    readingTime: "5 min read",
    emoji: "📺",
    gradient: G.rose,
  },
  {
    id: "b3",
    title: "The Ultimate PC Gaming Setup Under $800",
    excerpt:
      "We benchmarked budget GPUs, SSDs and indie game bundles to build the best value gaming rig of the year.",
    category: "Games",
    author: "Marcus Lee",
    date: "Jan 5, 2026",
    readingTime: "9 min read",
    emoji: "🎮",
    gradient: G.violet,
  },
  {
    id: "b4",
    title: "Earn $500/Month with the Playbeat Affiliate Program",
    excerpt:
      "Real numbers from three affiliates who turned referrals into a steady side income. Strategy & assets inside.",
    category: "Affiliate",
    author: "Playbeat Team",
    date: "Dec 28, 2025",
    readingTime: "6 min read",
    emoji: "💰",
    gradient: G.emerald,
  },
];

/* --------------------------- Trust badges --------------------------- */
export const TRUST_BADGES = [
  {
    icon: "Zap",
    title: "Instant Delivery",
    desc: "Codes land in your inbox in under 60 seconds.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Checkout",
    desc: "256-bit SSL + verified payment gateways.",
  },
  {
    icon: "BadgePercent",
    title: "Best Price Guarantee",
    desc: "Found it cheaper? We'll match it, guaranteed.",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    desc: "Real humans, every hour, in 5 languages.",
  },
  {
    icon: "RefreshCw",
    title: "Instant Refunds",
    desc: "Faulty code? Replacement or refund in minutes.",
  },
  {
    icon: "Globe2",
    title: "190+ Countries",
    desc: "Local currencies & payment methods worldwide.",
  },
];

/* ------------------------------ Stats ------------------------------ */
export const STATS = [
  { label: "Products Sold", value: 1840000, suffix: "+", icon: "Package" },
  { label: "Happy Customers", value: 320000, suffix: "+", icon: "Users" },
  { label: "Countries Served", value: 190, suffix: "+", icon: "Globe2" },
  { label: "Instant Delivery", value: 99.8, suffix: "%", icon: "Zap" },
];

/* --------------------------- Quick links --------------------------- */
export const NAV_LINKS = [
  { label: "Games", href: "#categories" },
  { label: "Software", href: "#categories" },
  { label: "AI Tools", href: "#ai-tools" },
  { label: "Subscriptions", href: "#categories" },
  { label: "Gift Cards", href: "#categories" },
  { label: "Free Tools", href: "#free-tools" },
  { label: "Bundles", href: "#bundles" },
  { label: "Blog", href: "#blog" },
  { label: "💰 Earn with Affiliates", href: "#affiliate", highlight: true },
] as const;

export const TRENDING_SEARCHES = [
  "ChatGPT Plus",
  "Netflix 1 month",
  "Steam Wallet $50",
  "Midjourney Pro",
  "Office 365",
  "NordVPN",
];

export const RECENT_SEARCHES = [
  "Spotify Premium",
  "EA Sports FC 25",
  "Apple Gift Card",
  "Discord Nitro",
];
