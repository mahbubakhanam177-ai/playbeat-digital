"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FilterSortBar, type SortKey } from "@/components/shared/filter-sort-bar";
import { PRODUCTS, type Product, type CategorySlug } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * "All Products" browse section — a responsive grid (not a horizontal rail)
 * with the full FilterSortBar (sort + price range + category filter).
 * Lets users browse the entire catalog with rich filtering.
 */
export function AllProducts() {
  const baseProducts = React.useMemo(() => PRODUCTS, []);
  const [filtered, setFiltered] = React.useState<Product[]>(baseProducts);
  const [showCount, setShowCount] = React.useState(12);
  const [activeSort, setActiveSort] = React.useState<SortKey>("featured");
  const [activeCats, setActiveCats] = React.useState<Set<CategorySlug>>(new Set());

  // Track sort + category state from the FilterSortBar for the heading.
  const handleFilterChange = React.useCallback((next: Product[]) => {
    setFiltered(next);
    setShowCount(12); // reset pagination when filters change
  }, []);

  // Derive the active sort + categories from the FilterSortBar via a wrapper.
  // (FilterSortBar manages its own state; we read the result via onFilterChange.)
  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;

  return (
    <section id="all-products" className="relative scroll-mt-24 py-14 md:py-20">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Browse the catalog"
          title={
            <>
              All <span className="text-gradient-gold">Products</span>
            </>
          }
          description={`${filtered.length} of ${baseProducts.length} products — sort, filter and find your next digital essential.`}
          action={
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-muted-foreground">
                <LayoutGrid className="mr-1.5 inline size-3.5" />
                Grid view
              </span>
            </div>
          }
        />

        <FilterSortBar products={baseProducts} onFilterChange={handleFilterChange} />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm font-medium text-white">No products match your filters</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try widening the price range or clearing category filters.
            </p>
          </div>
        ) : (
          <>
            {/* Responsive grid: 2 cols mobile, 3 sm, 4 lg */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visible.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <Button
                  onClick={() => setShowCount((c) => c + 8)}
                  variant="outline"
                  className="border-gold/30 bg-gold/[0.06] px-6 py-2.5 text-sm font-semibold text-gold hover:bg-gold hover:text-black"
                >
                  Load more products
                  <span className="ml-1.5 rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px]">
                    +{filtered.length - showCount}
                  </span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Showing {visible.length} of {filtered.length}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
