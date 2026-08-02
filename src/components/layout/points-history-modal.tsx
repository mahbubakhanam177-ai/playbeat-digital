"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  X,
  TrendingUp,
  TrendingDown,
  Coins,
  Trash2,
  Gift,
  ShoppingCart,
  Heart,
  Zap,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { getTier } from "@/lib/loyalty";
import { cn } from "@/lib/utils";

/* Map reason strings to icons + labels */
const REASON_META: Record<string, { icon: React.ElementType; label: string }> = {
  "add to cart": { icon: ShoppingCart, label: "Added to cart" },
  wishlist: { icon: Heart, label: "Saved to wishlist" },
  compare: { icon: Zap, label: "Compared products" },
  "quick view": { icon: Zap, label: "Quick view" },
  checkout: { icon: Check, label: "Order completed" },
  "cookie consent": { icon: Check, label: "Cookie consent" },
  newsletter: { icon: Gift, label: "Newsletter signup" },
  "redeemed reward": { icon: Gift, label: "Redeemed reward" },
  activity: { icon: Coins, label: "Activity" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PointsHistoryModal() {
  const {
    isHistoryOpen,
    closeHistory,
    pointsHistory,
    clearHistory,
    loyaltyPoints,
  } = useStore();

  const tier = getTier(loyaltyPoints);
  const totalEarned = pointsHistory.filter((h) => h.amount > 0).reduce((s, h) => s + h.amount, 0);
  const totalSpent = pointsHistory.filter((h) => h.amount < 0).reduce((s, h) => s + Math.abs(h.amount), 0);

  return (
    <Dialog
      open={isHistoryOpen}
      onOpenChange={(o) => {
        if (!o) closeHistory();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="glass-strong max-h-[92vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-md"
      >
        <DialogTitle className="sr-only">Points History</DialogTitle>
        <DialogDescription className="sr-only">
          Your loyalty points earning and spending activity.
        </DialogDescription>

        {/* Header */}
        <div className={cn("relative overflow-hidden p-5", tier.bg)}>
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-gold/20 text-gold ring-1 ring-gold/30">
                <History className="size-5.5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Points History</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className={cn("font-semibold", tier.color)}>{tier.name}</span>
                  <span className="text-white/20">·</span>
                  <Coins className="size-3.5 text-gold" />
                  <span className="font-bold text-white tabular-nums">{loyaltyPoints.toLocaleString()}</span>
                  <span className="text-xs">pts</span>
                </p>
              </div>
            </div>
            <button
              onClick={closeHistory}
              aria-label="Close history"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Earned / spent stats */}
          <div className="relative mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-success/20 bg-success/10 p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-success">
                <TrendingUp className="size-3" /> Earned
              </div>
              <span className="text-lg font-bold text-white tabular-nums">
                +{totalEarned.toLocaleString()}
              </span>
            </div>
            <div className="rounded-xl border border-danger/20 bg-danger/10 p-2.5">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-danger">
                <TrendingDown className="size-3" /> Spent
              </div>
              <span className="text-lg font-bold text-white tabular-nums">
                −{totalSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* History list */}
        <div className="max-h-[calc(92vh-260px)] overflow-y-auto p-4">
          {pointsHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="grid size-16 place-items-center rounded-full bg-white/[0.03] ring-1 ring-white/[0.06]">
                <History className="size-7 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No activity yet</h3>
                <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                  Earn points by adding products to your cart, wishlisting items, or completing a checkout.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent activity ({pointsHistory.length})
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-danger"
                >
                  <Trash2 className="size-3" /> Clear
                </button>
              </div>
              <div className="relative">
                {/* timeline line */}
                <span className="absolute left-[18px] top-2 bottom-2 w-px bg-white/[0.06]" aria-hidden />
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {pointsHistory.map((entry) => {
                      const meta = REASON_META[entry.reason] || REASON_META.activity;
                      const positive = entry.amount > 0;
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.02]"
                        >
                          {/* icon node on timeline */}
                          <span
                            className={cn(
                              "relative z-10 grid size-9 shrink-0 place-items-center rounded-full ring-2 ring-[#0d0d0d]",
                              positive
                                ? "bg-success/20 text-success"
                                : "bg-danger/20 text-danger"
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          {/* content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-medium text-white">
                                {meta.label}
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 text-sm font-bold tabular-nums",
                                  positive ? "text-success" : "text-danger"
                                )}
                              >
                                {positive ? "+" : "−"}{Math.abs(entry.amount)}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              {timeAgo(entry.ts)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
