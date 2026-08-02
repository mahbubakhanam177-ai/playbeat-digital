"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Star,
  TrendingUp,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Tag,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product, CategorySlug } from "@/lib/data";
import { CATEGORIES } from "@/lib/data";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

interface FilterSortBarProps {
  products: Product[];
  onFilterChange: (filtered: Product[]) => void;
  /** Max price for the slider (USD). Defaults to 250. */
  maxPriceDefault?: number;
  className?: string;
}

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ElementType }[] = [
  { key: "featured", label: "Featured", icon: Star },
  { key: "price-asc", label: "Price: Low to High", icon: ArrowUpWideNarrow },
  { key: "price-desc", label: "Price: High to Low", icon: ArrowDownWideNarrow },
  { key: "rating", label: "Top Rated", icon: TrendingUp },
  { key: "discount", label: "Biggest Discount", icon: Tag },
];

export function FilterSortBar({
  products,
  onFilterChange,
  maxPriceDefault = 250,
  className,
}: FilterSortBarProps) {
  const [sort, setSort] = React.useState<SortKey>("featured");
  const [priceRange, setPriceRange] = React.useState<number[]>([0, maxPriceDefault]);
  const [activeCats, setActiveCats] = React.useState<Set<CategorySlug>>(new Set());
  const [showFilters, setShowFilters] = React.useState(false);

  const maxPrice = React.useMemo(
    () => Math.max(maxPriceDefault, ...products.map((p) => p.price)),
    [products, maxPriceDefault]
  );

  // Apply filter + sort whenever inputs change.
  React.useEffect(() => {
    let result = [...products];

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Category filter
    if (activeCats.size > 0) {
      result = result.filter((p) => activeCats.has(p.category));
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        result.sort((a, b) => {
          const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
          const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
          return db - da;
        });
        break;
      case "featured":
      default:
        result.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) +
            Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false)
        );
        break;
    }

    onFilterChange(result);
  }, [products, sort, priceRange, activeCats, onFilterChange]);

  const toggleCat = (slug: CategorySlug) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const resetAll = () => {
    setSort("featured");
    setPriceRange([0, maxPrice]);
    setActiveCats(new Set());
  };

  const activeFilterCount =
    (sort !== "featured" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== maxPrice ? 1 : 0) +
    activeCats.size;

  return (
    <div className={cn("mb-6", className)}>
      {/* Sort row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSort(opt.key)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "border-gold/40 bg-gold/15 text-gold"
                    : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:text-white"
                )}
              >
                <opt.icon className="size-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-danger"
            >
              <X className="size-3" /> Reset ({activeFilterCount})
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "h-8 gap-1.5 border-white/[0.06] bg-white/[0.02] px-3 text-xs text-white hover:bg-white/[0.06]",
              showFilters && "border-gold/30 bg-gold/10 text-gold"
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            Filters
            {activeCats.size > 0 && (
              <Badge className="ml-0.5 bg-gold px-1 text-[9px] text-black">{activeCats.size}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:grid-cols-2">
              {/* Price range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Price range
                  </span>
                  <span className="text-xs font-bold text-white">
                    ${priceRange[0]} – ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={maxPrice}
                  step={5}
                  className="py-2"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>$0</span>
                  <span>${maxPrice}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => {
                    const active = activeCats.has(c.slug);
                    return (
                      <button
                        key={c.slug}
                        onClick={() => toggleCat(c.slug)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                          active
                            ? "border-gold/40 bg-gold/15 text-gold"
                            : "border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:border-white/[0.12] hover:text-white"
                        )}
                      >
                        {active && <Check className="size-3" />}
                        <span>{c.emoji}</span>
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
