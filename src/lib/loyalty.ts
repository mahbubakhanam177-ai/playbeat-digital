/**
 * Loyalty program tiers + helpers.
 * Points are earned by engaging with the marketplace (adding to cart,
 * wishlisting, completing checkout) and unlock tiers with perks.
 */

export interface LoyaltyTier {
  name: string;
  min: number;
  color: string; // tailwind text color class
  bg: string; // tailwind bg class for the badge
  ring: string; // ring color
  perk: string;
  emoji: string;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "Bronze", min: 0, color: "text-amber-300", bg: "bg-amber-500/15", ring: "ring-amber-500/30", perk: "Standard delivery", emoji: "🥉" },
  { name: "Silver", min: 500, color: "text-slate-200", bg: "bg-slate-400/15", ring: "ring-slate-400/30", perk: "5% bonus points", emoji: "🥈" },
  { name: "Gold", min: 1500, color: "text-gold", bg: "bg-gold/15", ring: "ring-gold/30", perk: "Priority support", emoji: "🥇" },
  { name: "Platinum", min: 4000, color: "text-cyan-300", bg: "bg-cyan-400/15", ring: "ring-cyan-400/30", perk: "Exclusive deals + 10% off", emoji: "💎" },
];

export function getTier(points: number): LoyaltyTier {
  let tier = LOYALTY_TIERS[0];
  for (const t of LOYALTY_TIERS) {
    if (points >= t.min) tier = t;
  }
  return tier;
}

export function getNextTier(points: number): LoyaltyTier | null {
  for (const t of LOYALTY_TIERS) {
    if (points < t.min) return t;
  }
  return null; // max tier reached
}

export function getTierProgress(points: number): { pct: number; toNext: number } {
  const current = getTier(points);
  const next = getNextTier(points);
  if (!next) return { pct: 100, toNext: 0 };
  const range = next.min - current.min;
  const done = points - current.min;
  return { pct: Math.min(100, Math.round((done / range) * 100)), toNext: next.min - points };
}

/* Points awarded for various actions */
export const POINT_REWARDS = {
  addToCart: 5,
  wishlist: 3,
  compare: 2,
  quickView: 1,
  checkout: 50,
  newsletter: 25,
} as const;

/* Rewards that can be redeemed with points */
export interface Reward {
  id: string;
  name: string;
  cost: number;
  discount: string; // human-readable discount
  desc: string;
  emoji: string;
  gradient: string;
}

export const REWARDS: Reward[] = [
  {
    id: "r5",
    name: "$5 Off Coupon",
    cost: 100,
    discount: "$5 OFF",
    desc: "Flat $5 off your next order",
    emoji: "🎫",
    gradient: "linear-gradient(135deg, #4CAF50 0%, #143A18 100%)",
  },
  {
    id: "r15",
    name: "$15 Off Coupon",
    cost: 250,
    discount: "$15 OFF",
    desc: "Flat $15 off orders over $20",
    emoji: "💰",
    gradient: "linear-gradient(135deg, #FFD54F 0%, #8A6300 100%)",
  },
  {
    id: "r40",
    name: "$40 Off Coupon",
    cost: 500,
    discount: "$40 OFF",
    desc: "Flat $40 off orders over $50",
    emoji: "💎",
    gradient: "linear-gradient(135deg, #4D8DFF 0%, #0E2A66 100%)",
  },
  {
    id: "rfree",
    name: "Free Product",
    cost: 800,
    discount: "FREE",
    desc: "Any product up to $30 value",
    emoji: "🎁",
    gradient: "linear-gradient(135deg, #B388FF 0%, #3B1A78 100%)",
  },
];
