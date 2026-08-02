"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  X,
  Sparkles,
  Check,
  Lock,
  Copy,
  Trophy,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import {
  REWARDS,
  getTier,
  getTierProgress,
  getNextTier,
} from "@/lib/loyalty";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Rewards redemption modal. Lets users spend loyalty points on discount
 * coupons. Generates a unique code on redemption and tracks redeemed rewards.
 */
export default function RewardsModal() {
  const {
    isRewardsOpen,
    closeRewards,
    loyaltyPoints,
    spendPoints,
    redeemedRewards,
    addRedeemedReward,
  } = useStore();
  const { toast } = useToast();
  const [redeemed, setRedeemed] = React.useState<string | null>(null);

  const tier = getTier(loyaltyPoints);
  const progress = getTierProgress(loyaltyPoints);
  const next = getNextTier(loyaltyPoints);

  const handleRedeem = (rewardId: string, cost: number, name: string) => {
    const success = spendPoints(cost);
    if (!success) {
      toast({
        title: "Not enough points",
        description: `You need ${cost - loyaltyPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }
    // Generate a unique-looking code
    const code = `PB-${rewardId.toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    setRedeemed(code);
    addRedeemedReward(code);
    toast({
      title: "Reward redeemed!",
      description: `${name} — code copied to clipboard.`,
    });
    // Auto-clear the "just redeemed" highlight after 4s
    setTimeout(() => setRedeemed(null), 4000);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard?.writeText(code);
      toast({ title: "Code copied", description: code });
    } catch {
      toast({ title: "Couldn't copy", description: code });
    }
  };

  return (
    <Dialog
      open={isRewardsOpen}
      onOpenChange={(o) => {
        if (!o) {
          setRedeemed(null);
          closeRewards();
        }
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="glass-strong max-h-[92vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Rewards Center</DialogTitle>
        <DialogDescription className="sr-only">
          Redeem your loyalty points for discount coupons.
        </DialogDescription>

        {/* Header */}
        <div className={cn("relative overflow-hidden p-5", tier.bg)}>
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-gold/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-2xl ring-1 ring-gold/30">
                {tier.emoji}
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Rewards Center</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className={cn("font-semibold", tier.color)}>{tier.name} Member</span>
                  <span className="text-white/20">·</span>
                  <Coins className="size-3.5 text-gold" />
                  <span className="font-bold text-white tabular-nums">{loyaltyPoints.toLocaleString()}</span>
                  <span className="text-xs">pts</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setRedeemed(null);
                closeRewards();
              }}
              aria-label="Close rewards"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Progress to next tier */}
          {next && (
            <div className="relative mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {progress.toNext.toLocaleString()} pts to {next.emoji} {next.name}
                </span>
                <span className="font-semibold text-white">{progress.pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.pct}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-gold to-amber-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Rewards list */}
        <div className="max-h-[calc(92vh-220px)] overflow-y-auto p-4">
          <div className="mb-3 flex items-center gap-1.5">
            <Gift className="size-4 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available rewards
            </span>
          </div>

          <div className="space-y-2.5">
            {REWARDS.map((reward) => {
              const canAfford = loyaltyPoints >= reward.cost;
              const justRedeemed = redeemed?.includes(reward.id.toUpperCase());
              return (
                <motion.div
                  key={reward.id}
                  layout
                  className={cn(
                    "relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-all",
                    justRedeemed
                      ? "border-success/40 bg-success/10"
                      : canAfford
                        ? "border-white/[0.08] bg-white/[0.02] hover:border-gold/30"
                        : "border-white/[0.04] bg-white/[0.01] opacity-60"
                  )}
                >
                  {/* Reward swatch */}
                  <div
                    className="grid size-12 shrink-0 place-items-center rounded-xl text-2xl ring-1 ring-white/[0.08]"
                    style={{ background: reward.gradient }}
                  >
                    {reward.emoji}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">
                        {reward.name}
                      </span>
                      <Badge className="bg-gold/15 text-[9px] text-gold">
                        {reward.discount}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{reward.desc}</p>
                  </div>

                  {/* Cost + button */}
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="flex items-center gap-1 text-xs font-bold text-white">
                      <Coins className="size-3 text-gold" />
                      {reward.cost}
                    </span>
                    {justRedeemed ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                        <Check className="size-3" /> Redeemed
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => handleRedeem(reward.id, reward.cost, reward.name)}
                        className={cn(
                          "h-7 gap-1 px-2.5 text-xs",
                          canAfford
                            ? "bg-gold text-black hover:bg-gold/90"
                            : "bg-white/[0.04] text-muted-foreground"
                        )}
                      >
                        {canAfford ? (
                          <>
                            <Sparkles className="size-3" /> Redeem
                          </>
                        ) : (
                          <>
                            <Lock className="size-3" /> Locked
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Redeemed codes section */}
          {redeemedRewards.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 flex items-center gap-1.5">
                <Trophy className="size-3.5 text-gold" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your codes ({redeemedRewards.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {redeemedRewards.slice(0, 5).map((code, i) => (
                  <div
                    key={code}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {code}
                      </span>
                      {i === 0 && redeemed && (
                        <Badge className="bg-success/15 text-[9px] text-success">NEW</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => copyCode(code)}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-gold"
                    >
                      <Copy className="size-3" /> Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earn more hint */}
          <div className="mt-4 rounded-lg border border-gold/15 bg-gold/[0.04] p-3">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-gold" />
              Earn more: add to cart (+5), wishlist (+3), checkout (+50 pts)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
