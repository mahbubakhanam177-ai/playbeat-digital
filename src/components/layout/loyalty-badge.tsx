"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronRight, Gift, Trophy, History } from "lucide-react";
import { useStore } from "@/lib/store";
import { CURRENCIES } from "@/lib/store";
import {
  getTier,
  getNextTier,
  getTierProgress,
  LOYALTY_TIERS,
} from "@/lib/loyalty";
import { cn } from "@/lib/utils";

/**
 * Compact loyalty badge for the header. Shows current tier emoji + points.
 * On hover/focus, expands a premium popover with the tier ladder, progress
 * bar to the next tier, and perk details.
 */
export default function LoyaltyBadge() {
  const points = useStore((s) => s.loyaltyPoints);
  const openRewards = useStore((s) => s.openRewards);
  const openHistory = useStore((s) => s.openHistory);
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const tier = getTier(points);
  const next = getNextTier(points);
  const progress = getTierProgress(points);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };
  React.useEffect(() => () => cancelClose(), []);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        cancelClose();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={`Loyalty: ${tier.name} tier, ${points} points`}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
          tier.bg,
          tier.ring,
          "ring-1",
          tier.color,
          "hover:brightness-125"
        )}
      >
        <span className="text-sm leading-none">{tier.emoji}</span>
        <span className="tabular-nums">{mounted ? points.toLocaleString() : "0"}</span>
        <span className="hidden text-[10px] uppercase tracking-wider opacity-70 sm:inline">
          pts
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass-strong absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/[0.08] shadow-premium"
          >
            {/* gold top accent */}
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            {/* Header */}
            <div className={cn("flex items-center gap-3 p-4", tier.bg)}>
              <span className="text-2xl">{tier.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-sm font-bold", tier.color)}>{tier.name} Member</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {points.toLocaleString()} loyalty points
                </p>
              </div>
              <Trophy className={cn("size-5", tier.color)} />
            </div>

            {/* Progress to next tier */}
            {next ? (
              <div className="border-t border-white/[0.06] p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Sparkles className="size-3 text-gold" />
                    Progress to {next.emoji} {next.name}
                  </span>
                  <span className="font-semibold text-white">
                    {progress.toNext.toLocaleString()} pts to go
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Unlock: <span className="font-medium text-white">{next.perk}</span>
                </p>
              </div>
            ) : (
              <div className="border-t border-white/[0.06] p-4 text-center">
                <Gift className="mx-auto mb-1 size-5 text-gold" />
                <p className="text-xs font-semibold text-white">
                  Top tier reached! 🎉
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Enjoy all {tier.name} perks.
                </p>
              </div>
            )}

            {/* Tier ladder */}
            <div className="border-t border-white/[0.06] p-3">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                All tiers
              </p>
              <div className="space-y-1">
                {LOYALTY_TIERS.map((t) => {
                  const reached = points >= t.min;
                  const isCurrent = t.name === tier.name;
                  return (
                    <div
                      key={t.name}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
                        isCurrent && t.bg
                      )}
                    >
                      <span className="text-sm">{t.emoji}</span>
                      <span className={cn("font-semibold", reached ? t.color : "text-muted-foreground")}>
                        {t.name}
                      </span>
                      <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
                        {t.min.toLocaleString()} pts
                      </span>
                      {isCurrent && (
                        <span className={cn("size-1.5 rounded-full", t.bg.replace("/15", ""))} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer: redeem + history + hint */}
            <div className="border-t border-white/[0.06] bg-white/[0.02] p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    openRewards();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-gold py-2 text-xs font-semibold text-black transition-all hover:bg-gold/90"
                >
                  <Gift className="size-3.5" /> Redeem
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    openHistory();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-semibold text-white transition-all hover:bg-white/[0.06]"
                >
                  <History className="size-3.5" /> History
                </button>
              </div>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ChevronRight className="size-3 text-gold" />
                Earn points: cart (+5), wishlist (+3), checkout (+50)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
