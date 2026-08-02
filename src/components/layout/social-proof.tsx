"use client";

import * as React from "react";
import { toast } from "sonner";
import { ShoppingBag, MapPin } from "lucide-react";
import { PRODUCTS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";

/**
 * Periodically surfaces a small "social proof" toast —
 * "Adeel from 🇵🇰 purchased ChatGPT Plus — just now".
 *
 * Boosts conversion trust without being intrusive: first toast after ~9s,
 * then every 16–26s, capped at 4 per session. Pauses when a dialog
 * (cart / search / quick view) is open so it never competes for attention.
 */

const BUYERS = [
  { name: "Adeel", country: "Pakistan", flag: "🇵🇰" },
  { name: "Sarah", country: "United States", flag: "🇺🇸" },
  { name: "Rafiq", country: "Bangladesh", flag: "🇧🇩" },
  { name: "Lina", country: "Germany", flag: "🇩🇪" },
  { name: "Marcus", country: "Singapore", flag: "🇸🇬" },
  { name: "Fatima", country: "UAE", flag: "🇦🇪" },
  { name: "Diego", country: "Brazil", flag: "🇧🇷" },
  { name: "Yuki", country: "Japan", flag: "🇯🇵" },
  { name: "Omar", country: "Egypt", flag: "🇪🇬" },
  { name: "Priya", country: "India", flag: "🇮🇳" },
  { name: "Liam", country: "Australia", flag: "🇦🇺" },
  { name: "Sofia", country: "Spain", flag: "🇪🇸" },
];

const MIN_AGO = ["just now", "1 min ago", "2 min ago", "3 min ago", "5 min ago"];

export default function SocialProofToast() {
  const shownRef = React.useRef(0);
  const currency = useStore((s) => s.currency);
  // Pause when any overlay is open.
  const isCartOpen = useStore((s) => s.isCartOpen);
  const isSearchOpen = useStore((s) => s.isSearchOpen);
  const quickView = useStore((s) => s.quickViewProduct);
  const openQuickView = useStore((s) => s.openQuickView);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Stop after 4 notifications per session.
      if (shownRef.current >= 4) return;
      const delay = shownRef.current === 0 ? 9000 : 16000 + Math.random() * 10000;
      timer = setTimeout(fire, delay);
    };

    const fire = () => {
      // Don't show while a modal/drawer is open.
      if (isCartOpen || isSearchOpen || quickView) {
        schedule();
        return;
      }
      const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const ago = MIN_AGO[Math.floor(Math.random() * MIN_AGO.length)];
      shownRef.current += 1;

      toast.custom(
        () => (
          <button
            onClick={() => openQuickView(product)}
            className="pointer-events-auto flex w-[330px] max-w-[88vw] items-center gap-3 rounded-xl border border-white/[0.08] bg-[#141414]/95 p-3 text-left shadow-premium backdrop-blur-xl"
          >
            <span
              className="grid size-11 shrink-0 place-items-center rounded-lg text-xl"
              style={{ background: product.gradient }}
            >
              {product.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 text-gold" />
                {buyer.flag} {buyer.name} from {buyer.country}
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium text-white">
                purchased {product.name}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-success">
                <ShoppingBag className="size-3" />
                {formatPrice(product.price, currency)} · {ago}
              </span>
            </span>
          </button>
        ),
        { duration: 5000, position: "bottom-left" }
      );

      schedule();
    };

    schedule();
    return () => clearTimeout(timer);
  }, [currency, isCartOpen, isSearchOpen, quickView, openQuickView]);

  return null;
}
