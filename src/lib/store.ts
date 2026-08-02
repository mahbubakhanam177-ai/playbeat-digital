"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

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

  /* Wishlist */
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;

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

      wishlist: [],
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      isWishlisted: (id) => get().wishlist.includes(id),

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
    }),
    {
      name: "playbeat-store",
      partialize: (s) => ({
        currency: s.currency,
        cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        promoDismissed: s.promoDismissed,
      }),
    }
  )
);
