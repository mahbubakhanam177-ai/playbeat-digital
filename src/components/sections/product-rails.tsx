"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCTS, type Product } from "@/lib/data";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FilterSortBar } from "@/components/shared/filter-sort-bar";

/* ------------------------------------------------------------------
 * Product rails — horizontally-scrollable rows of <ProductCard />.
 * Internal <ProductRail /> helper powers all 7 named exports.
 * ------------------------------------------------------------------ */

/* --------------------- CountdownTimer (Flash Deals) --------------------- */

function CountdownTimer() {
  const [remaining, setRemaining] = React.useState<number>(0);
  const [mounted, setMounted] = React.useState(false);

  // Target = end of current day; if < 1h remains, roll to next day so the
  // timer never reads 00:00:00 for long. Computed inside the effect to avoid
  // SSR/CSR hydration mismatch (Date.now() differs between server & client).
  React.useEffect(() => {
    setMounted(true);
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    if (end.getTime() - now.getTime() < 60 * 60 * 1000) {
      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);
    }
    const target = end.getTime();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((remaining / (1000 * 60)) % 60);
  const secs = Math.floor((remaining / 1000) % 60);

  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: mins },
    { label: "Secs", value: secs },
  ];

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label="Time remaining for flash deals"
    >
      {items.map((it) => (
        <div
          key={it.label}
          className="flex min-w-[44px] flex-col items-center rounded-lg border border-danger/30 bg-danger/10 px-2 py-1"
        >
          <span className="text-sm font-bold tabular-nums leading-none text-white">
            {mounted ? String(it.value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-wider text-white/60">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- ProductRail ----------------------------- */

interface ProductRailProps {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  products: Product[];
  actionLabel?: string;
  actionHref?: string;
  /** Extra node rendered in the heading action row (e.g. countdown). */
  extraAction?: React.ReactNode;
  /** Subtle radial glow behind the rail. */
  glow?: "gold" | "azure" | "danger" | null;
  className?: string;
}

function ProductRail({
  id,
  eyebrow,
  title,
  description,
  products,
  actionLabel,
  actionHref = "#",
  extraAction,
  glow = null,
  className,
}: ProductRailProps) {
  const railRef = React.useRef<HTMLDivElement>(null);

  const scrollByDir = React.useCallback((dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Step = first child width + 16px gap (gap-4). Falls back to 296px
    // (280px card + 16px gap) if the rail is empty.
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : 296;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const glowBg =
    glow === "gold"
      ? "radial-gradient(60% 50% at 50% 0%, rgba(255,213,79,0.10), transparent 70%)"
      : glow === "azure"
        ? "radial-gradient(60% 50% at 50% 0%, rgba(77,141,255,0.10), transparent 70%)"
        : glow === "danger"
          ? "radial-gradient(60% 50% at 50% 0%, rgba(255,77,77,0.10), transparent 70%)"
          : null;

  const action = (
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
      {extraAction}
      {actionLabel && (
        <a
          href={actionHref}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      )}
      <div className="hidden items-center gap-2 md:flex">
        <button
          type="button"
          aria-label="Scroll rail left"
          onClick={() => scrollByDir(-1)}
          className="grid size-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.04] text-white transition-all hover:border-gold hover:bg-gold hover:text-black"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Scroll rail right"
          onClick={() => scrollByDir(1)}
          className="grid size-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.04] text-white transition-all hover:border-gold hover:bg-gold hover:text-black"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative scroll-mt-20 py-14 md:scroll-mt-24 md:py-20",
        className,
      )}
    >
      {glowBg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glowBg }}
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={action}
        />

        {products.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center text-sm text-muted-foreground">
            No products available right now — check back soon.
          </div>
        ) : (
          <div
            ref={railRef}
            className="no-scrollbar mask-fade-r flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2"
          >
            {products.map((p, i) => (
              <div
                key={p.id}
                className="w-[260px] shrink-0 snap-start sm:w-[280px]"
              >
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* ------------------------------- Sections ------------------------------- */

export function FeaturedProducts() {
  const baseProducts = React.useMemo(() => PRODUCTS.filter((p) => p.featured), []);
  const [filtered, setFiltered] = React.useState<Product[]>(baseProducts);
  const railRef = React.useRef<HTMLDivElement>(null);

  const scrollByDir = React.useCallback((dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 16 : 296;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const handleFilterChange = React.useCallback((next: Product[]) => {
    setFiltered(next);
  }, []);

  return (
    <motion.section
      id="featured"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-20 py-14 md:scroll-mt-24 md:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Handpicked"
          title={
            <>
              Featured <span className="text-gradient-gold">Products</span>
            </>
          }
          description="The best of Playbeat — sort, filter and find your next favorite."
          action={
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                aria-label="Scroll rail left"
                onClick={() => scrollByDir(-1)}
                className="grid size-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.04] text-white transition-all hover:border-gold hover:bg-gold hover:text-black"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Scroll rail right"
                onClick={() => scrollByDir(1)}
                className="grid size-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.04] text-white transition-all hover:border-gold hover:bg-gold hover:text-black"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          }
        />

        <FilterSortBar products={baseProducts} onFilterChange={handleFilterChange} />

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center text-sm text-muted-foreground">
            No products match your filters. Try widening the price range or clearing categories.
          </div>
        ) : (
          <div
            ref={railRef}
            className="no-scrollbar mask-fade-r flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pt-2"
          >
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="w-[260px] shrink-0 snap-start sm:w-[280px]"
              >
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export function TrendingProducts() {
  const products = PRODUCTS.filter((p) => p.trending);
  return (
    <ProductRail
      eyebrow="Hot right now"
      title={
        <>
          Trending <span className="text-gradient-azure">Now</span>
        </>
      }
      products={products}
    />
  );
}

export function FlashDeals() {
  const products = PRODUCTS.filter((p) => p.flashDeal);
  return (
    <ProductRail
      eyebrow="Limited time"
      title={
        <>
          {"⚡ "}
          Flash <span className="text-gradient-gold">Deals</span>
        </>
      }
      description="Up to 60% off — ends soon!"
      products={products}
      extraAction={<CountdownTimer />}
    />
  );
}

export function BestSellers() {
  const products = PRODUCTS.filter((p) => p.bestSeller);
  return (
    <ProductRail
      eyebrow="Top rated"
      title={
        <>
          Best <span className="text-gradient-gold">Sellers</span>
        </>
      }
      products={products}
    />
  );
}

export function AiTools() {
  const products = PRODUCTS.filter((p) => p.category === "ai-tools");
  return (
    <ProductRail
      id="ai-tools"
      eyebrow="Powered by AI"
      title="AI Tools"
      description="ChatGPT, Midjourney, Claude & more — instant activation."
      products={products}
      glow="gold"
    />
  );
}

export function FreeTools() {
  const products = PRODUCTS.filter((p) => p.category === "free-tools");
  return (
    <ProductRail
      id="free-tools"
      eyebrow="No cost"
      title={
        <>
          Free <span className="text-azure">Tools</span>
        </>
      }
      description="Useful utilities, free forever — no signup required."
      products={products}
    />
  );
}

export function Bundles() {
  const products = PRODUCTS.filter((p) => p.category === "bundles");
  return (
    <ProductRail
      id="bundles"
      eyebrow="Best value"
      title={
        <>
          Premium <span className="text-gradient-gold">Bundles</span>
        </>
      }
      description="Curated packs at up to 80% off retail."
      products={products}
    />
  );
}
