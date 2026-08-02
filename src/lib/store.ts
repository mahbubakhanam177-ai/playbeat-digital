"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";
import { getTier, LOYALTY_TIERS } from "@/lib/loyalty";

/* ----------------------------- Types ----------------------------- */
export type CurrencyCode = "USD" | "PKR" | "BDT";

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Multiplier from base USD price */
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", label: "USD", rate: 1 },
  PKR: { code: "PKR", symbol: "₨", label: "PKR", rate: 278.5 },
  BDT: { code: "BDT", symbol: "৳", label: "BDT", rate: 117.4 },
};

export interface CartItem {
  id: string;
  name: string;
  price: number; // base USD
  image: string;
  category: string;
  quantity: number;
}

export interface AppNotification {
  id: string;
  type: "order" | "deal" | "points" | "system" | "wishlist";
  title: string;
  message: string;
  ts: number;
  read: boolean;
  emoji?: string;
}

interface StoreState {
  /* Currency */
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;

  /* Cart */
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  /* Checkout */
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  /* Wishlist */
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  clearWishlist: () => void;

  /* Search */
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  /* Quick View */
  quickViewProduct: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;

  /* Mobile nav */
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;

  /* Recently viewed (auto-tracked on quick view) */
  recentlyViewed: Product[];
  addRecentlyViewed: (p: Product) => void;
  clearRecentlyViewed: () => void;

  /* Promo bar */
  promoDismissed: boolean;
  dismissPromo: () => void;

  /* Compare */
  compareList: string[];
  toggleCompare: (id: string) => "added" | "removed" | "full";
  isComparing: (id: string) => boolean;
  clearCompare: () => void;
  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;

  /* Loyalty / rewards */
  loyaltyPoints: number;
  addPoints: (n: number, reason?: string) => void;
  spendPoints: (n: number) => boolean;
  resetPoints: () => void;
  redeemedRewards: string[];
  addRedeemedReward: (code: string) => void;
  isRewardsOpen: boolean;
  openRewards: () => void;
  closeRewards: () => void;
  pointsHistory: { id: string; amount: number; reason: string; ts: number }[];
  clearHistory: () => void;
  isHistoryOpen: boolean;
  openHistory: () => void;
  closeHistory: () => void;

  /* Cookie consent */
  cookieConsent: "accepted" | "essential" | null;
  setCookieConsent: (v: "accepted" | "essential") => void;

  /* Notifications */
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "ts" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  isNotifOpen: boolean;
  openNotif: () => void;
  closeNotif: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currency: "USD",
      setCurrency: (c) => set({ currency: c }),

      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      addToCart: (item, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((c) => c.id === item.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.id === item.id ? { ...c, quantity: c.quantity + qty } : c
              ),
            };
          }
          return { cart: [...s.cart, { ...item, quantity: qty }] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: s.cart
            .map((c) => (c.id === id ? { ...c, quantity: Math.max(1, qty) } : c))
            .filter((c) => c.quantity > 0),
        })),
      clearCart: () => set({ cart: [] }),

      isCheckoutOpen: false,
      openCheckout: () => set({ isCartOpen: false, isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      wishlist: [],
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      isWishlisted: (id) => get().wishlist.includes(id),
      isWishlistOpen: false,
      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),
      clearWishlist: () => set({ wishlist: [] }),

      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      quickViewProduct: null,
      openQuickView: (p) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((x) => x.id !== p.id);
          return {
            quickViewProduct: p,
            recentlyViewed: [p, ...filtered].slice(0, 8),
          };
        }),
      closeQuickView: () => set({ quickViewProduct: null }),

      isMobileNavOpen: false,
      openMobileNav: () => set({ isMobileNavOpen: true }),
      closeMobileNav: () => set({ isMobileNavOpen: false }),

      recentlyViewed: [],
      addRecentlyViewed: (p) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((x) => x.id !== p.id);
          return { recentlyViewed: [p, ...filtered].slice(0, 8) };
        }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      promoDismissed: false,
      dismissPromo: () => set({ promoDismissed: true }),

      compareList: [],
      toggleCompare: (id) => {
        let result: "added" | "removed" | "full" = "added";
        set((s) => {
          if (s.compareList.includes(id)) {
            result = "removed";
            return { compareList: s.compareList.filter((c) => c !== id) };
          }
          if (s.compareList.length >= 3) {
            result = "full";
            return s; // max 3 — ignore silently, caller handles toast
          }
          result = "added";
          return { compareList: [...s.compareList, id] };
        });
        return result;
      },
      isComparing: (id) => get().compareList.includes(id),
      clearCompare: () => set({ compareList: [] }),
      isCompareOpen: false,
      openCompare: () => set({ isCompareOpen: true }),
      closeCompare: () => set({ isCompareOpen: false }),

      loyaltyPoints: 0,
      addPoints: (n, reason = "activity") => {
        const before = get().loyaltyPoints;
        const after = before + n;
        const tierBefore = getTier(before);
        const tierAfter = getTier(after);
        set((s) => ({
          loyaltyPoints: s.loyaltyPoints + n,
          pointsHistory: [
            { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount: n, reason, ts: Date.now() },
            ...s.pointsHistory,
          ].slice(0, 50),
        }));
        // Tier upgrade — fire a celebratory notification (skip on initial 0→Bronze).
        if (tierAfter.min > 0 && tierAfter.name !== tierBefore.name) {
          get().addNotification({
            type: "points",
            title: `Tier upgraded to ${tierAfter.name}! ${tierAfter.emoji}`,
            message: `You've unlocked ${tierAfter.perk}. Enjoy your new ${tierAfter.name} perks.`,
            emoji: tierAfter.emoji,
          });
        }
      },
      spendPoints: (n) => {
        const current = get().loyaltyPoints;
        if (current < n) return false;
        set((s) => ({
          loyaltyPoints: s.loyaltyPoints - n,
          pointsHistory: [
            { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount: -n, reason: "redeemed reward", ts: Date.now() },
            ...s.pointsHistory,
          ].slice(0, 50),
        }));
        return true;
      },
      resetPoints: () => set({ loyaltyPoints: 0, pointsHistory: [] }),
      redeemedRewards: [],
      addRedeemedReward: (code) =>
        set((s) => ({ redeemedRewards: [code, ...s.redeemedRewards].slice(0, 20) })),
      isRewardsOpen: false,
      openRewards: () => set({ isRewardsOpen: true }),
      closeRewards: () => set({ isRewardsOpen: false }),
      pointsHistory: [],
      clearHistory: () => set({ pointsHistory: [] }),
      isHistoryOpen: false,
      openHistory: () => set({ isHistoryOpen: true }),
      closeHistory: () => set({ isHistoryOpen: false }),

      cookieConsent: null,
      setCookieConsent: (v) => set({ cookieConsent: v }),

      notifications: [
        {
          id: "welcome-1",
          type: "system",
          title: "Welcome to Playbeat Digital!",
          message: "Explore 4,000+ digital products with instant delivery.",
          ts: Date.now(),
          read: false,
          emoji: "👋",
        },
        {
          id: "deal-1",
          type: "deal",
          title: "Flash Sale Live Now",
          message: "Up to 60% off AI Tools & Bundles — ends today!",
          ts: Date.now() - 600000,
          read: false,
          emoji: "⚡",
        },
      ],
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ts: Date.now(), read: false },
            ...s.notifications,
          ].slice(0, 30),
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      clearNotifications: () => set({ notifications: [] }),
      isNotifOpen: false,
      openNotif: () => set({ isNotifOpen: true }),
      closeNotif: () => set({ isNotifOpen: false }),
    }),
    {
      name: "playbeat-store",
      partialize: (s) => ({
        currency: s.currency,
        cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        promoDismissed: s.promoDismissed,
        compareList: s.compareList,
        loyaltyPoints: s.loyaltyPoints,
        redeemedRewards: s.redeemedRewards,
        pointsHistory: s.pointsHistory,
        cookieConsent: s.cookieConsent,
        notifications: s.notifications,
      }),
    }
  )
);
