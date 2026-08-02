"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompareArrows,
  X,
  Star,
  Zap,
  ShoppingCart,
  Trash2,
  Check,
  Minus,
  Sparkles,
  Tag,
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
import { formatPrice, discountPct } from "@/lib/format";
import { PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* Rows displayed in the comparison table. */
const ROWS: { key: string; label: string; icon?: React.ElementType }[] = [
  { key: "price", label: "Price", icon: Tag },
  { key: "discount", label: "Discount", icon: Sparkles },
  { key: "rating", label: "Rating", icon: Star },
  { key: "reviews", label: "Reviews" },
  { key: "category", label: "Category" },
  { key: "delivery", label: "Delivery", icon: Zap },
  { key: "tags", label: "Tags" },
];

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td
      className={cn(
        "border-t border-white/[0.04] px-3 py-3 text-center text-sm",
        highlight ? "text-gold" : "text-white/80"
      )}
    >
      {children}
    </td>
  );
}

export default function CompareDrawer() {
  const {
    compareList,
    isCompareOpen,
    closeCompare,
    toggleCompare,
    clearCompare,
    addToCart,
    openCart,
    openQuickView,
    currency,
  } = useStore();
  const { toast } = useToast();

  const items = React.useMemo(
    () =>
      compareList
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [compareList]
  );

  const handleAddAll = () => {
    const paid = items.filter((i) => !i.isFree);
    if (paid.length === 0) {
      toast({ title: "Nothing to add", description: "Only free tools selected." });
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
    toast({
      title: `${paid.length} item${paid.length > 1 ? "s" : ""} added to cart`,
    });
    closeCompare();
    setTimeout(() => openCart(), 250);
  };

  return (
    <Sheet open={isCompareOpen} onOpenChange={(o) => !o && closeCompare()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-white/[0.08] bg-[#0d0d0d] p-0 sm:max-w-3xl"
      >
        {/* Header */}
        <SheetHeader className="flex-row items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-azure/15 text-azure ring-1 ring-azure/25">
              <GitCompareArrows className="size-4.5" />
            </span>
            <div>
              <SheetTitle className="text-base font-bold text-white">
                Compare{" "}
                <span className="text-muted-foreground">
                  ({items.length}/3)
                </span>
              </SheetTitle>
              <SheetDescription className="text-xs">
                Side-by-side comparison of your selected products.
              </SheetDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCompare}
            className="size-8 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white"
            aria-label="Close compare"
          >
            <X className="size-4" />
          </Button>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid size-20 place-items-center rounded-full bg-white/[0.03] ring-1 ring-white/[0.06]">
              <GitCompareArrows className="size-9 text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">Nothing to compare yet</h3>
              <p className="max-w-[300px] text-sm text-muted-foreground">
                Tap the{" "}
                <GitCompareArrows className="inline size-3.5 align-text-bottom text-azure" />{" "}
                compare icon on any product to add it here. You can compare up to 3 at once.
              </p>
            </div>
            <Button
              onClick={() => {
                closeCompare();
                document
                  .getElementById("featured")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="mt-2 bg-gold text-black hover:bg-gold/90"
            >
              Browse products
            </Button>
          </div>
        ) : (
          <>
            {/* Comparison table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                {/* Product header row */}
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 w-32 bg-[#0d0d0d] p-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Product
                    </th>
                    {items.map((p) => {
                      const discount = p.oldPrice ? discountPct(p.oldPrice, p.price) : 0;
                      return (
                        <th key={p.id} className="min-w-[180px] p-3 align-top">
                          <div className="relative flex flex-col items-center gap-2">
                            <button
                              onClick={() => {
                                closeCompare();
                                setTimeout(() => openQuickView(p), 200);
                              }}
                              className="relative size-20 overflow-hidden rounded-xl"
                              style={{ background: p.gradient }}
                              aria-label={`Quick view ${p.name}`}
                            >
                              <span className="absolute inset-0 grid place-items-center text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                                {p.emoji}
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                closeCompare();
                                setTimeout(() => openQuickView(p), 200);
                              }}
                              className="text-center text-xs font-semibold leading-snug text-white line-clamp-2 hover:text-gold"
                            >
                              {p.name}
                            </button>
                            <button
                              onClick={() => toggleCompare(p.id)}
                              aria-label={`Remove ${p.name} from compare`}
                              className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-danger text-white shadow-lg transition-transform hover:scale-110"
                            >
                              <X className="size-3" />
                            </button>
                            {discount > 0 && (
                              <Badge className="bg-danger text-[9px] text-white">-{discount}%</Badge>
                            )}
                          </div>
                        </th>
                      );
                    })}
                    {/* Placeholder for empty slots */}
                    {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
                      <th key={`empty-${i}`} className="min-w-[180px] p-3 align-top">
                        <div className="flex size-20 mx-auto items-center justify-center rounded-xl border border-dashed border-white/[0.1] text-muted-foreground/40">
                          <GitCompareArrows className="size-7" />
                        </div>
                        <p className="mt-2 text-center text-[10px] text-muted-foreground/60">
                          Add another
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      <Tag className="mr-1.5 inline size-3.5 text-gold" />
                      Price
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id} highlight>
                        <div className="flex flex-col items-center">
                          <span className="text-base font-bold">
                            {p.isFree ? "Free" : formatPrice(p.price, currency)}
                          </span>
                          {p.oldPrice && (
                            <span className="text-[11px] text-muted-foreground line-through">
                              {formatPrice(p.oldPrice, currency)}
                            </span>
                          )}
                        </div>
                      </Cell>
                    ))}
                  </tr>
                  {/* Discount */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      <Sparkles className="mr-1.5 inline size-3.5 text-gold" />
                      Discount
                    </td>
                    {items.map((p) => {
                      const d = p.oldPrice ? discountPct(p.oldPrice, p.price) : 0;
                      return (
                        <Cell key={p.id}>
                          {d > 0 ? (
                            <span className="font-semibold text-danger">-{d}%</span>
                          ) : (
                            <Minus className="mx-auto size-3.5 text-muted-foreground/40" />
                          )}
                        </Cell>
                      );
                    })}
                  </tr>
                  {/* Rating */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      <Star className="mr-1.5 inline size-3.5 text-gold" />
                      Rating
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id}>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "size-3",
                                  i < Math.round(p.rating)
                                    ? "fill-gold text-gold"
                                    : "fill-white/10 text-white/10"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-white">{p.rating.toFixed(1)}</span>
                        </div>
                      </Cell>
                    ))}
                  </tr>
                  {/* Reviews */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Reviews
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id}>
                        {p.reviews.toLocaleString()}
                      </Cell>
                    ))}
                  </tr>
                  {/* Category */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Category
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id}>
                        <span className="capitalize">{p.category.replace("-", " ")}</span>
                      </Cell>
                    ))}
                  </tr>
                  {/* Delivery */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      <Zap className="mr-1.5 inline size-3.5 text-gold" />
                      Delivery
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id}>
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <Check className="size-3" /> Instant
                        </span>
                      </Cell>
                    ))}
                  </tr>
                  {/* Tags */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                      Tags
                    </td>
                    {items.map((p) => (
                      <Cell key={p.id}>
                        <div className="flex flex-wrap justify-center gap-1">
                          {p.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/70"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </Cell>
                    ))}
                  </tr>
                  {/* Buy row */}
                  <tr>
                    <td className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-4" />
                    {items.map((p) => (
                      <td key={p.id} className="border-t border-white/[0.04] px-3 py-4">
                        <div className="flex flex-col gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!p.isFree) {
                                addToCart({
                                  id: p.id,
                                  name: p.name,
                                  price: p.price,
                                  image: p.emoji,
                                  category: p.category,
                                });
                                toast({ title: "Added to cart", description: p.name });
                              } else {
                                toast({ title: "Free tool", description: `${p.name} is free to use.` });
                              }
                            }}
                            className="w-full bg-gold text-xs font-semibold text-black hover:bg-gold/90"
                          >
                            <ShoppingCart className="size-3.5" />
                            {p.isFree ? "Get free" : "Add to cart"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleCompare(p.id)}
                            className="w-full border-white/[0.08] text-xs text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/30"
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </Button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-white/[0.06] bg-[#0a0a0a] px-5 py-4">
              <Button
                onClick={handleAddAll}
                disabled={items.length === 0}
                className="flex-1 bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-40"
              >
                <ShoppingCart className="size-4" />
                Add all to cart ({items.filter((i) => !i.isFree).length})
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  clearCompare();
                  toast({ title: "Compare cleared" });
                }}
                className="border-white/[0.08] bg-white/[0.03] py-3 text-sm text-muted-foreground hover:bg-danger/10 hover:text-danger hover:border-danger/30"
              >
                Clear all
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
