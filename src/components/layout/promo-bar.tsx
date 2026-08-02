"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

/**
 * Dismissible promo / announcement bar fixed at the very top of the page.
 * Sits above the header (z-[60]); the header shifts down via `top-9` while
 * this is visible and returns to `top-0` once dismissed.
 */
function useCountdown(target: number) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function PromoBar() {
  const dismissed = useStore((s) => s.promoDismissed);
  const dismissPromo = useStore((s) => s.dismissPromo);
  const openSearch = useStore((s) => s.openSearch);

  // Countdown target: end of today (rolls forward if already passed).
  const target = React.useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  }, []);
  const { h, m, s } = useCountdown(target);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-x-0 top-0 z-[60] overflow-hidden"
        >
          <div className="relative flex h-9 items-center justify-center gap-3 bg-gradient-to-r from-[#1a1407] via-[#0f0f0f] to-[#0a1422] px-4 text-center">
            {/* gold hairlines top & bottom */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />

            <div className="flex items-center gap-2 text-[13px] font-medium leading-none">
              <Zap className="size-3.5 fill-gold text-gold" />
              <span className="text-white/90">
                <span className="font-bold text-gold">FLASH SALE</span>
                <span className="mx-1.5 text-white/30">·</span>
                Up to 60% off AI Tools &amp; Bundles
              </span>
              <span className="mx-1.5 hidden text-white/20 sm:inline">·</span>
              {/* countdown */}
              <span className="hidden items-center gap-1 sm:inline-flex">
                <span className="text-muted-foreground">Ends in</span>
                <span className="font-mono font-semibold tabular-nums text-white">
                  {pad(h)}:{pad(m)}:{pad(s)}
                </span>
              </span>
              <button
                onClick={() => {
                  const el = document.getElementById("featured");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30 transition-colors hover:bg-gold hover:text-black"
              >
                Shop Deals <ArrowRight className="size-3" />
              </button>
            </div>

            <button
              onClick={dismissPromo}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
