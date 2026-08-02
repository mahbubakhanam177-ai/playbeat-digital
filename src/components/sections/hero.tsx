"use client";

/* ------------------------------------------------------------------
 * Playbeat Digital — Hero section
 * Inspired by playbeat.digital — left-aligned, "gateway to digital
 * heaven" headline, stat row, featured drops preview.
 * Theme: black + red + white.
 * ------------------------------------------------------------------ */

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe2, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/data";
import { formatPrice } from "@/lib/format";

/* Staggered entrance */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* Stats matching the original playbeat.digital */
const HERO_STATS = [
  { value: "500+", label: "Subscriptions", icon: Zap },
  { value: "50+", label: "Platforms", icon: Globe2 },
  { value: "Global", label: "Access", icon: Shield },
  { value: "<60s", label: "Delivery", icon: Clock },
];

/* Featured drops — pick top 4 featured/trending products */
const FEATURED_DROPS = PRODUCTS.filter((p) => p.featured || p.trending).slice(0, 4);

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-background pt-36 pb-16 md:pt-44 md:pb-24"
    >
      {/* ---- Background: deep black with red aurora glow ---- */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" aria-hidden />
      {/* Red glow — left side */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-gold/15 blur-[130px] animate-pulse-glow"
        aria-hidden
      />
      {/* Red glow — right side */}
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[130px] animate-pulse-glow [animation-delay:1.5s]"
        aria-hidden
      />
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden
      />
      {/* Top fade for header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        {/* ---- Left-aligned hero content ---- */}
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          {/* Eyebrow label */}
          <motion.div variants={item} className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Worldwide Digital Subscriptions
            </span>
          </motion.div>

          {/* Main headline — "The gateway to digital heaven." */}
          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            The gateway to
            <br />
            <span className="text-gradient-gold">digital heaven.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Every streaming service, gaming pass, AI tool &amp; cloud plan — from every
            platform, for every region. One store. Every service. No borders. Verified,
            region-unlocked, and live in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-xl bg-gold px-7 text-sm font-bold uppercase tracking-wider text-black hover:bg-gold/90 hover:shadow-[0_8px_40px_-8px_rgba(255,30,30,0.6)]"
            >
              <a href="#featured">
                Explore Subscriptions
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="group h-12 rounded-xl border border-white/[0.12] bg-white/[0.02] px-7 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/[0.06]"
            >
              <a href="#categories">
                Browse All Plans
              </a>
            </Button>
          </motion.div>

          {/* Trust micro-line */}
          <motion.div variants={item} className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-gold" /> Secure checkout
            </span>
            <span className="text-white/15">•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-gold" /> Instant delivery
            </span>
            <span className="text-white/15">•</span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="size-3.5 text-gold" /> 190+ countries
            </span>
          </motion.div>
        </motion.div>

        {/* ---- Stats row ---- */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-10 md:mt-20 md:grid-cols-4 md:gap-10"
        >
          {HERO_STATS.map((stat) => (
            <motion.div key={stat.label} variants={item} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <stat.icon className="size-4 text-gold" />
                <span className="text-3xl font-extrabold text-white md:text-4xl">
                  {stat.value}
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ---- Featured drops preview ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          {/* Section header */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-white md:text-2xl">Featured drops</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Hand-picked products, live right now.
              </p>
            </div>
            <a
              href="#featured"
              className="group flex items-center gap-1 text-xs font-semibold text-gold hover:gap-2 transition-all"
            >
              View all
              <ArrowRight className="size-3.5" />
            </a>
          </div>

          {/* Product cards row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {FEATURED_DROPS.map((p, i) => (
              <motion.a
                key={p.id}
                href="#featured"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-4 transition-all hover:border-gold/30 hover:-translate-y-1"
              >
                {/* Gradient cover */}
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ background: p.gradient }}
                  />
                  <div className="absolute inset-0 bg-dots opacity-30 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110">
                      {p.emoji}
                    </span>
                  </div>
                  {/* Category badge */}
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {p.category.replace("-", " ")}
                  </span>
                </div>

                {/* Info */}
                <h3 className="truncate text-sm font-semibold text-white">{p.name}</h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Star className="size-3 fill-gold text-gold" />
                    {p.rating.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {p.isFree ? "Free" : formatPrice(p.price, "USD")}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
