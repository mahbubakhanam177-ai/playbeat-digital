"use client";

/* ------------------------------------------------------------------
 * Playbeat Digital — Hero section
 * Full-width dark premium hero with layered background, animated
 * headline, dual CTAs, floating product glass cards and a stats row.
 * ------------------------------------------------------------------ */

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ShoppingBag,
  Compass,
  Zap,
  Package,
  Users,
  Globe2,
  Star,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { PRODUCTS, STATS, type Product } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/* Map data.ts icon string -> Lucide component */
const STAT_ICONS: Record<string, LucideIcon> = {
  Package,
  Users,
  Globe2,
  Zap,
};

/* Floating product cards: ChatGPT Plus (p1), Steam Wallet (p7), Netflix (p4) */
const FLOATING_PRODUCTS: Product[] = [
  PRODUCTS[0], // ChatGPT Plus — 1 Month
  PRODUCTS[6], // Steam Wallet $50
  PRODUCTS[3], // Netflix Premium — 1 Month
];

/* Framer Motion variants — staggered fade + slide-up */
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const statsContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.75 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ------------------------- Floating product card ------------------------- */
function FloatingCard({
  product,
  className,
  animation,
}: {
  product: Product;
  className?: string;
  animation: string;
}) {
  return (
    <div
      className={cn(
        "glass absolute w-[230px] rounded-2xl p-3 shadow-premium",
        animation,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-inner ring-1 ring-white/10"
          style={{ background: product.gradient }}
          aria-hidden
        >
          <span>{product.emoji}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{product.name}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold ring-1 ring-gold/20">
            <Zap className="h-2.5 w-2.5 fill-gold" />
            Instant delivery
          </span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="h-3 w-3 fill-gold text-gold" />
          {product.rating.toFixed(1)}
        </span>
        <span className="text-sm font-bold text-white">
          {formatPrice(product.price, "USD")}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------- Hero ------------------------------- */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background pt-36 pb-20 md:pt-44 md:pb-28"
    >
      {/* ---- Layered futuristic background ---- */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
        aria-hidden
      />
      {/* Gold glow blob — top left */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold/20 blur-[120px] animate-pulse-glow"
        aria-hidden
      />
      {/* Azure glow blob — bottom right */}
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-azure/20 blur-[120px] animate-pulse-glow [animation-delay:1.6s]"
        aria-hidden
      />
      {/* Top edge fade so transparent sticky header blends */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent"
        aria-hidden
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8"
        >
          {/* ---------------- Left content column ---------------- */}
          <div className="relative lg:col-span-7">
            {/* Eyebrow / live status pill */}
            <motion.div variants={item}>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                <span className="font-medium text-white/90">1,840,000+ orders delivered</span>
                <span className="text-white/25">•</span>
                <span>60-second delivery</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="text-gradient-gold">Premium</span> Digital
              <br className="hidden sm:block" /> Marketplace
            </motion.h1>

            {/* Sub-heading */}
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
            >
              Software, AI Tools, Streaming Services, Gift Cards, Games &amp; Digital Bundles with
              Instant Delivery.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-xl bg-gold px-7 text-base font-semibold text-black hover:bg-gold/90 hover:shadow-[0_8px_40px_-8px_rgba(255,213,79,0.6)]"
              >
                <a href="#featured">
                  <ShoppingBag className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  Shop Now
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="group h-12 rounded-xl border border-white/15 bg-white/[0.03] px-7 text-base font-medium text-white hover:bg-white/10"
              >
                <a href="#categories">
                  <Compass className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Explore Categories
                </a>
              </Button>
            </motion.div>

            {/* Trust micro-line */}
            <motion.div
              variants={item}
              className="mt-7 flex items-center gap-3 text-xs text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {["#FFD54F", "#4D8DFF", "#4CAF50", "#B388FF"].map((c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>
                <span className="font-semibold text-white">320k+ customers</span> across 190+
                countries
              </span>
            </motion.div>
          </div>

          {/* ---------------- Right floating cards (desktop only) ---------------- */}
          <div className="relative hidden h-[480px] lg:col-span-5 lg:block">
            {/* Central connector glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
              aria-hidden
            />
            {/* Faint connector line */}
            <div
              className="pointer-events-none absolute left-1/4 top-1/4 h-px w-1/2 -rotate-12 bg-gradient-to-r from-transparent via-gold/30 to-transparent"
              aria-hidden
            />

            <FloatingCard
              product={FLOATING_PRODUCTS[0]}
              animation="animate-float-slow"
              className="right-2 top-4 rotate-3"
            />
            <FloatingCard
              product={FLOATING_PRODUCTS[1]}
              animation="animate-float-slow-rev"
              className="left-0 top-44 -rotate-2"
            />
            <FloatingCard
              product={FLOATING_PRODUCTS[2]}
              animation="animate-float-slow [animation-delay:1.2s]"
              className="bottom-6 right-0 rotate-2"
            />
          </div>
        </motion.div>

        {/* ---------------- Animated stats row ---------------- */}
        <motion.div
          variants={statsContainer}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:mt-20 md:grid-cols-4"
        >
          {STATS.map((stat) => {
            const Icon = STAT_ICONS[stat.icon] ?? Package;
            const decimals = Number.isInteger(stat.value) ? 0 : 1;
            return (
              <motion.div
                key={stat.label}
                variants={item}
                className="group flex flex-col gap-3 bg-background/60 p-5 backdrop-blur-sm transition-colors hover:bg-background/40 md:flex-row md:items-center md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-3xl font-bold text-white md:text-4xl">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={decimals}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
