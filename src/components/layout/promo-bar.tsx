"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ShieldCheck, Headphones, BadgePercent } from "lucide-react";
import { useStore } from "@/lib/store";

const ITEMS = [
  { icon: Zap, text: "Instant Digital Delivery" },
  { icon: ShieldCheck, text: "Secure Payments" },
  { icon: Headphones, text: "24/7 Customer Support" },
  { icon: BadgePercent, text: "Premium Accounts at Best Prices" },
];

/**
 * Announcement / trust bar fixed at the very top of the page.
 * Shows the 4 trust items separated by dots. Dismissible (persists).
 */
export default function PromoBar() {
  const dismissed = useStore((s) => s.promoDismissed);
  const dismissPromo = useStore((s) => s.dismissPromo);

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
          <div className="relative flex h-9 items-center justify-center bg-gradient-to-r from-[#1a1407] via-[#0f0f0f] to-[#0a1422] px-10 text-center">
            {/* gold hairlines top & bottom */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" />

            <div className="flex items-center gap-1.5 text-[12px] font-medium leading-none sm:gap-3">
              {ITEMS.map((item, i) => (
                <React.Fragment key={item.text}>
                  <span className="flex items-center gap-1.5 text-white/85">
                    <item.icon className="size-3.5 text-gold" />
                    <span className="hidden sm:inline">{item.text}</span>
                    <span className="sm:hidden">{item.text.split(" ")[0]}</span>
                  </span>
                  {i < ITEMS.length - 1 && (
                    <span className="text-gold/40">•</span>
                  )}
                </React.Fragment>
              ))}
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
