"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  BadgePercent,
  Headphones,
  RefreshCw,
  Globe2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, TRUST_BADGES } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";

/* ------------------------------------------------------------------ *
 * Icon mapping — TRUST_BADGES stores the icon name as a string,
 * resolve it to the actual Lucide component here.
 * ------------------------------------------------------------------ */
const TRUST_ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  BadgePercent,
  Headphones,
  RefreshCw,
  Globe2,
};

/* ------------------------------------------------------------------ *
 * Shared motion variants
 * ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const categoryItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ================================================================== *
 * TrustBadges — premium trust strip below the hero
 * ================================================================== */
export function TrustBadges() {
  return (
    <section aria-label="Why shop with Playbeat" className="relative py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6"
        >
          {TRUST_BADGES.map((badge) => {
            const Icon = TRUST_ICON_MAP[badge.icon] ?? Zap;
            return (
              <motion.div
                key={badge.title}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={cn(
                  "glass group flex flex-col items-start gap-3 rounded-2xl p-4 md:p-5",
                  "border border-white/[0.06] transition-colors duration-300",
                  "hover:border-gold/30"
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/15 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">{badge.title}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== *
 * Categories — bento grid of popular categories
 * ================================================================== */
export function Categories() {
  return (
    <section id="categories" className="relative py-16 md:py-24">
      {/* Subtle ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Browse"
          title={
            <>
              Popular <span className="text-gradient-gold">Categories</span>
            </>
          }
          description="Everything digital, organized. From AI tools to game keys — find what you need in seconds."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[180px]"
        >
          {CATEGORIES.map((category, index) => {
            const isFeatured = index === 0;
            return (
              <motion.a
                key={category.slug}
                href={`#${category.slug}`}
                variants={categoryItemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
                  "border border-white/[0.06] bg-[#141414] p-5 md:p-6",
                  "min-h-[160px] transition-colors duration-300 hover:border-gold/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
                  isFeatured && "lg:col-span-2 lg:row-span-2"
                )}
              >
                {/* Gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-[0.35]"
                  style={{ background: category.gradient }}
                />
                {/* Top sheen */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                {/* Bottom fade for legibility */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent"
                />

                {/* Top row: emoji + count pill */}
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <span
                    className="text-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 md:text-5xl"
                    aria-hidden
                  >
                    {category.emoji}
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
                    {category.count.toLocaleString()}+ products
                  </span>
                </div>

                {/* Bottom row: name + description + Browse arrow */}
                <div className="relative z-10 mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={cn(
                        "font-bold text-white",
                        isFeatured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
                      )}
                    >
                      {category.name}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex translate-x-2 items-center gap-1 text-xs font-semibold text-gold",
                        "opacity-0 transition-all duration-300",
                        "group-hover:translate-x-0 group-hover:opacity-100"
                      )}
                    >
                      Browse
                      <ArrowRight className="size-3.5" strokeWidth={2.5} />
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-muted-foreground",
                      isFeatured
                        ? "text-sm md:text-base max-w-md"
                        : "text-xs md:text-sm line-clamp-2"
                    )}
                  >
                    {category.description}
                  </p>

                  {/* Featured card extra hint */}
                  {isFeatured && (
                    <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold ring-1 ring-gold/20">
                      Most popular
                    </span>
                  )}
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
