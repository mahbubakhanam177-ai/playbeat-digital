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
