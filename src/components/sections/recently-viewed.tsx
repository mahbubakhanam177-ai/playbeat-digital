"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

/**
 * "Recently Viewed" rail — auto-populated whenever a user opens Quick View
 * (from a product card, search results, etc.). Persists across reloads.
 * Renders only when the user has at least one recently viewed product.
 */
export function RecentlyViewed() {
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const clearRecentlyViewed = useStore((s) => s.clearRecentlyViewed);
  const railRef = React.useRef<HTMLDivElement>(null);

  if (recentlyViewed.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="relative scroll-mt-24 py-14 md:py-20">
      <SectionHeading
        eyebrow="Pick up where you left off"
        title={
          <>
            Recently <span className="text-gradient-gold">Viewed</span>
          </>
        }
        description="Your browsing history, saved on this device."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-xs text-muted-foreground hover:text-white"
            >
              Clear
            </Button>
            <div className="hidden gap-1.5 md:flex">
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-white/[0.06] bg-white/[0.03] hover:bg-gold hover:text-black"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll left"
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-full border-white/[0.06] bg-white/[0.03] hover:bg-gold hover:text-black"
                onClick={() => scrollBy(1)}
                aria-label="Scroll right"
              >
                ›
              </Button>
            </div>
          </div>
        }
      />

      <div
        ref={railRef}
        className="no-scrollbar mask-fade-r flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6"
      >
        {recentlyViewed.map((p, i) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-[260px] sm:w-[280px]"
          >
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>

      {/* subtle history hint when only 1-2 items */}
      {recentlyViewed.length <= 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <History className="size-3.5" />
          Tip: click <span className="text-gold">Quick View</span> on any product to build your history.
        </motion.p>
      )}
    </section>
  );
}
