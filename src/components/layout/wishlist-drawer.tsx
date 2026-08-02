"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingCart,
  X,
  Sparkles,
  ArrowRight,
  Share2,
  ShoppingBag,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * Wishlist slide-out drawer (left side). Opened by the header wishlist button.
 * Shows wishlisted products with move-to-cart, remove, and quick-view actions.
 */
export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    closeWishlist,
    clearWishlist,
    toggleWishlist,
    addToCart,
    openCart,
    openQuickView,
    currency,
  } = useStore();
  const { toast } = useToast();

  // Resolve wishlisted IDs to full product objects.
  const items = React.useMemo(
    () =>
      wishlist
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [wishlist]
  );

  const totalValue = items.reduce((sum, p) => sum + p.price, 0);
  const potentialSavings = items.reduce(
    (sum, p) => sum + (p.oldPrice ? p.oldPrice - p.price : 0),
    0
  );

  const handleMoveToCart = (productId: string) => {
    const p = items.find((i) => i.id === productId);
    if (!p) return;
    if (p.isFree) {
      toast({ title: "Free tool", description: `${p.name} is free — no cart needed.` });
      return;
    }
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.emoji,
      category: p.category,
    });
    toggleWishlist(productId);
    toast({
      title: "Moved to cart",
      description: p.name,
    });
  };

  const handleRemove = (productId: string) => {
    const p = items.find((i) => i.id === productId);
    toggleWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: p?.name,
    });
  };

  const handleMoveAll = () => {
    const paid = items.filter((i) => !i.isFree);
    if (paid.length === 0) {
      toast({ title: "Nothing to move", description: "Your wishlist only has free tools." });
      return;
    }
    paid.forEach((p) =>
      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.emoji,
        category: p.category,
      })
    );
    clearWishlist();
    toast({
      title: `${paid.length} item${paid.length > 1 ? "s" : ""} moved to cart`,
      description: "Review your cart to checkout.",
    });
    closeWishlist();
    setTimeout(() => openCart(), 250);
  };

  const handleShare = async () => {
    if (items.length === 0) return;
    try {
      await navigator.clipboard?.writeText(
        `My Playbeat Digital wishlist: ${items.map((p) => p.name).join(", ")}`
      );
      toast({ title: "Wishlist copied", description: "Share it with anyone!" });
    } catch {
      toast({ title: "Couldn't copy", description: "Try again." });
    }
  };

  return (
    <Sheet open={isWishlistOpen} onOpenChange={(o) => !o && closeWishlist()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 border-white/[0.08] bg-[#0d0d0d] p-0 sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/25">
              <Heart className="size-4.5 fill-rose-400" />
            </span>
            <div>
              <SheetTitle className="text-base font-bold text-white">
                Wishlist{" "}
                <span className="text-muted-foreground">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </SheetTitle>
              <SheetDescription className="text-xs">
                Your saved favorites, ready to buy.
              </SheetDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeWishlist}
            className="size-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white"
            aria-label="Close wishlist"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="relative">
              <div className="grid size-20 place-items-center rounded-full bg-white/[0.03] ring-1 ring-white/[0.06]">
                <Heart className="size-9 text-muted-foreground/50" />
              </div>
              <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30">
                <X className="size-3.5" />
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Your wishlist is empty</h3>
              <p className="max-w-[280px] text-sm text-muted-foreground">
                Tap the{" "}
                <Heart className="inline size-3.5 align-text-bottom text-rose-400" /> on any
                product to save it here for later.
              </p>
            </div>
            <Button
              onClick={() => {
                closeWishlist();
                document
                  .getElementById("featured")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-2 bg-gold text-black hover:bg-gold/90"
            >
              <ShoppingBag className="size-4" /> Browse products
            </Button>
          </div>
        ) : (
          <>
            {/* Summary strip */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total value</span>
                <span className="text-lg font-bold text-white">
                  {formatPrice(totalValue, currency)}
                </span>
              </div>
              {potentialSavings > 0 && (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">You save</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-success">
                    <Sparkles className="size-3.5" />
                    {formatPrice(potentialSavings, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {items.map((p) => {
                  const discount = p.oldPrice
                    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                    : 0;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group mb-3 flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-rose-500/20"
                    >
                      {/* Swatch */}
                      <button
                        onClick={() => {
                          closeWishlist();
                          setTimeout(() => openQuickView(p), 200);
                        }}
                        className="relative size-16 shrink-0 overflow-hidden rounded-lg"
                        style={{ background: p.gradient }}
                        aria-label={`Quick view ${p.name}`}
                      >
                        <span className="absolute inset-0 grid place-items-center text-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                          {p.emoji}
                        </span>
                        {discount > 0 && (
                          <Badge className="absolute left-1 top-1 bg-danger px-1 text-[9px] leading-none text-white">
                            -{discount}%
                          </Badge>
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => {
                              closeWishlist();
                              setTimeout(() => openQuickView(p), 200);
                            }}
                            className="text-left text-sm font-semibold leading-snug text-white line-clamp-2 hover:text-gold"
                          >
                            {p.name}
                          </button>
                          <button
                            onClick={() => handleRemove(p.id)}
                            aria-label={`Remove ${p.name}`}
                            className="shrink-0 text-muted-foreground transition-colors hover:text-danger"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <span className="mt-0.5 text-xs capitalize text-muted-foreground">
                          {p.category.replace("-", " ")}
                        </span>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-white">
                              {p.isFree ? "Free" : formatPrice(p.price, currency)}
                            </span>
                            {p.oldPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(p.oldPrice, currency)}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleMoveToCart(p.id)}
                            className="h-8 gap-1.5 bg-gold px-3 text-xs font-semibold text-black hover:bg-gold/90"
                          >
                            <ShoppingCart className="size-3.5" />
                            {p.isFree ? "Get" : "Move to cart"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="space-y-2.5 border-t border-white/[0.06] bg-[#0a0a0a] px-5 py-4">
              <Button
                onClick={handleMoveAll}
                className="w-full bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90"
              >
                <ShoppingCart className="size-4" />
                Move all to cart
                <ArrowRight className="size-4" />
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex-1 border-white/[0.08] bg-white/[0.03] py-2.5 text-xs text-white hover:bg-white/[0.06]"
                >
                  <Share2 className="size-3.5" /> Share list
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearWishlist();
                    toast({ title: "Wishlist cleared" });
                  }}
                  className="flex-1 border-white/[0.08] bg-white/[0.03] py-2.5 text-xs text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/30"
                >
                  <Trash2 className="size-3.5" /> Clear all
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
