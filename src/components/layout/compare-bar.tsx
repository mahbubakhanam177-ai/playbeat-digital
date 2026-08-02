"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompareArrows, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/data";

/**
 * Floating bar that appears at the bottom of the viewport (above the mobile
 * nav) when the user has added at least 1 product to the compare list.
 * Shows product thumbnails + a "Compare now" button that opens the drawer.
 */
export default function CompareBar() {
  const { compareList, openCompare, toggleCompare } = useStore();

  const items = React.useMemo(
    () =>
      compareList
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [compareList]
  );

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 lg:bottom-6"
        >
          <div className="glass-strong flex items-center gap-3 rounded-2xl border border-azure/25 p-3 shadow-premium">
            {/* icon + count */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="grid size-9 place-items-center rounded-xl bg-azure/15 text-azure ring-1 ring-azure/25">
                <GitCompareArrows className="size-5" />
              </span>
              <div className="hidden flex-col sm:flex">
                <span className="text-xs font-bold text-white">
                  {items.length}/3 selected
                </span>
                <span className="text-[10px] text-muted-foreground">for comparison</span>
              </div>
            </div>

            {/* thumbnails */}
            <div className="flex flex-1 items-center gap-1.5 overflow-x-auto no-scrollbar">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="group relative shrink-0"
                >
                  <div
                    className="grid size-10 place-items-center rounded-lg text-lg ring-1 ring-white/[0.08]"
                    style={{ background: p.gradient }}
                  >
                    {p.emoji}
                  </div>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-danger text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
              {/* empty slots */}
              {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-dashed border-white/[0.1] text-muted-foreground/30"
                >
                  <GitCompareArrows className="size-4" />
                </div>
              ))}
            </div>

            {/* compare button */}
            <Button
              onClick={openCompare}
              size="sm"
              className="shrink-0 bg-azure text-white hover:bg-azure/90"
            >
              Compare
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
