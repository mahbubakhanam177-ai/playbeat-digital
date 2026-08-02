"use client";

import * as React from "react";
import {
  Search,
  TrendingUp,
  Clock,
  ArrowRight,
  CornerDownLeft,
  X,
  Sparkles,
  PackageSearch,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import {
  PRODUCTS,
  TRENDING_SEARCHES,
  RECENT_SEARCHES,
  CATEGORIES,
  type Product,
  type CategorySlug,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export default function SearchModal() {
  const { isSearchOpen, closeSearch, openQuickView, currency } = useStore();
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<
    CategorySlug | "all"
  >("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  /* Reset filters a moment after the modal closes (avoids a visible flash). */
  React.useEffect(() => {
    if (!isSearchOpen) {
      const t = setTimeout(() => {
        setQuery("");
        setActiveCategory("all");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  /* Filter products by query (name/category/tags/description) + active category. */
  const results = React.useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => {
      const matchesQuery =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q);
      const matchesCat =
        activeCategory === "all" || p.category === activeCategory;
      return matchesQuery && matchesCat;
    }).slice(0, 6);
  }, [query, activeCategory]);

  const hasQuery = query.trim().length > 0;
  const hasResults = results.length > 0;

  const handleSelect = (p: Product) => {
    openQuickView(p);
    closeSearch();
  };

  const handleChipClick = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const handleCategoryClick = (slug: CategorySlug | "all", label?: string) => {
    setActiveCategory(slug);
    if (label && !query.trim()) setQuery(label);
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setQuery("");
    setActiveCategory("all");
    inputRef.current?.focus();
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={(o) => !o && closeSearch()}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => {
          /* Let our own input grab focus instead of the dialog root. */
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className="glass-strong flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Playbeat Digital</DialogTitle>
          <DialogDescription>
            Search for products, categories, and AI tools.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative border-b border-white/[0.06]">
          <Search
            className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/70"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results.length > 0) {
                e.preventDefault();
                handleSelect(results[0]);
              }
            }}
            placeholder="Search for products, categories, AI tools…"
            className="h-16 w-full bg-transparent pl-14 pr-24 text-base text-white outline-none placeholder:text-muted-foreground/60"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search products"
          />
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            <kbd className="hidden rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {!hasQuery ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Left: recent + trending searches */}
              <div className="space-y-5">
                <section>
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Clock className="size-3.5" /> Recent searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleChipClick(s)}
                        className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <TrendingUp className="size-3.5 text-gold" /> Trending
                    searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleChipClick(s)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-white transition-colors hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                      >
                        <TrendingUp className="size-3 text-gold/70" />
                        {s}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: popular categories */}
              <div>
                <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="size-3.5 text-gold" /> Popular categories
                </h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(c.slug, c.name)}
                        className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.04]"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/[0.04] text-lg ring-1 ring-white/[0.06]">
                          {c.emoji}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-white">
                            {c.name}
                          </span>
                          <span className="block line-clamp-1 text-[11px] text-muted-foreground">
                            {c.description}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                          {c.count.toLocaleString()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              {/* Category filter chips */}
              <div className="mb-4 flex flex-wrap items-center gap-1.5">
                <Chip
                  active={activeCategory === "all"}
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </Chip>
                {CATEGORIES.map((c) => (
                  <Chip
                    key={c.slug}
                    active={activeCategory === c.slug}
                    onClick={() => setActiveCategory(c.slug)}
                  >
                    <span className="mr-1">{c.emoji}</span>
                    {c.name}
                  </Chip>
                ))}
              </div>

              {hasResults ? (
                <>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {results.length}{" "}
                    {results.length === 1 ? "result" : "results"} for{" "}
                    <span className="font-medium text-white">
                      &ldquo;{query}&rdquo;
                    </span>
                  </p>
                  <ul className="space-y-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(p)}
                          className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-white/[0.04]"
                        >
                          <span
                            className="grid size-11 shrink-0 place-items-center rounded-lg text-xl ring-1 ring-white/[0.06]"
                            style={{ background: p.gradient }}
                            aria-hidden
                          >
                            {p.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-white">
                              {p.name}
                            </span>
                            <span className="block text-xs capitalize text-muted-foreground">
                              {p.category.replace("-", " ")}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-bold text-white">
                            {p.isFree ? "Free" : formatPrice(p.price, currency)}
                          </span>
                          <span className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors group-hover:bg-gold group-hover:text-black">
                            <ArrowRight className="size-4" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
                    <PackageSearch className="size-7 text-muted-foreground/60" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try a different keyword or browse all categories.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/20"
                  >
                    Browse all categories <ArrowRight className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 text-[10px]">
                /
              </kbd>
              to search
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1 text-[10px]">
                Esc
              </kbd>
              to close
            </span>
          </div>
          <span className="hidden items-center gap-1 sm:inline-flex">
            <CornerDownLeft className="size-3" /> to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-gold bg-gold text-black"
          : "border-white/[0.08] bg-white/[0.02] text-muted-foreground hover:border-gold/30 hover:text-gold"
      )}
    >
      {children}
    </button>
  );
}
