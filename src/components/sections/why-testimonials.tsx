"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  BadgePercent,
  Globe2,
  Headphones,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  LayoutDashboard,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS, type Testimonial } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ============================================================
 * WhyChooseUs
 * ==========================================================*/

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  { icon: Zap, title: "Instant Delivery", desc: "Codes in your inbox in under 60 seconds, 24/7." },
  { icon: ShieldCheck, title: "Buyer Protection", desc: "Every purchase covered by our guarantee." },
  { icon: BadgePercent, title: "Best Prices", desc: "We match any legitimate competitor price." },
  { icon: Globe2, title: "Global Payments", desc: "USD, PKR, BDT + 40 local methods." },
  { icon: Headphones, title: "Human Support", desc: "Real people, every hour, in 5 languages." },
  { icon: Star, title: "Curated Quality", desc: "Every product verified before listing." },
];

const WHY_STATS = [
  { value: 1.8, suffix: "M+", decimals: 1, label: "Products delivered" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "Avg rating" },
  { value: 60, suffix: "s", decimals: 0, label: "Avg delivery time" },
  { value: 190, suffix: "+", decimals: 0, label: "Countries served" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          align="center"
          eyebrow="Why Playbeat"
          title={
            <>
              Why creators <span className="text-gradient-gold">choose us</span>
            </>
          }
          description="Built for speed, trust and value — the way a modern digital marketplace should be."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-10">
          {/* Feature list */}
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {FEATURES.map((f) => (
              <motion.li
                key={f.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                className="group relative flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-white/[0.04] hover:shadow-premium"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/20 transition-all duration-300 group-hover:bg-gold/20 group-hover:ring-gold/40">
                  <f.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-gold/10 blur-3xl"
            />
            <div className="glass shadow-premium relative h-full overflow-hidden rounded-2xl p-6 md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gold/15 blur-3xl"
              />

              {/* Header */}
              <div className="relative flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold ring-1 ring-gold/30">
                  <TrendingUp className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Trusted at scale</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Live metrics
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="relative mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.06]">
                {WHY_STATS.map((s) => (
                  <div key={s.label} className="bg-[#0c0c0c]/80 p-5">
                    <div className="text-3xl font-bold text-white md:text-4xl">
                      <AnimatedCounter
                        value={s.value}
                        suffix={s.suffix}
                        decimals={s.decimals}
                      />
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social proof row */}
              <div className="relative mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex -space-x-2">
                  {["#FF1E1E", "#E50914", "#4CAF50", "#B388FF"].map((c) => (
                    <span
                      key={c}
                      className="size-7 rounded-full ring-2 ring-[#0c0c0c]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-white">320,000+</span> creators trust
                  Playbeat worldwide.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * Testimonials
 * ==========================================================*/

function usePageSize() {
  const [size, setSize] = React.useState(1);
  React.useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setSize(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return size;
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="glass shadow-premium relative flex h-full flex-col overflow-hidden rounded-2xl p-6 md:p-7">
      <Quote
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 size-14 text-gold/15"
      />
      <div className="relative flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white/10"
          style={{ background: t.gradient }}
        >
          {t.initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
            <span aria-hidden>{t.flag}</span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {t.role} · {t.country}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < t.rating ? "fill-gold text-gold" : "fill-none text-white/15"
            )}
          />
        ))}
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">
        “{t.text}”
      </p>
    </article>
  );
}

export function Testimonials() {
  const pageSize = usePageSize();
  const [page, setPage] = React.useState(0);
  const pageCount = Math.max(1, Math.ceil(TESTIMONIALS.length / pageSize));

  // Keep page in range when page size changes
  React.useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);

  // Auto-advance every 5s
  React.useEffect(() => {
    if (pageCount <= 1) return;
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, 5000);
    return () => window.clearInterval(id);
  }, [pageCount]);

  const start = page * pageSize;
  const visible = TESTIMONIALS.slice(start, start + pageSize);

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          align="center"
          eyebrow="Loved worldwide"
          title={
            <>
              What our <span className="text-gradient-gold">customers</span> say
            </>
          }
        />

        <div className="relative mt-12 md:mt-16">
          {/* Prev / Next arrows (md+) */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonials"
            className="glass absolute -left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all hover:border-gold/40 hover:text-gold md:flex lg:-left-6"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonials"
            className="glass absolute -right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-all hover:border-gold/40 hover:text-gold md:flex lg:-right-6"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={cn(
                  "grid gap-5",
                  pageSize === 1 && "grid-cols-1",
                  pageSize === 2 && "grid-cols-2",
                  pageSize === 3 && "grid-cols-3"
                )}
              >
                {visible.map((t) => (
                  <TestimonialCard key={t.id} t={t} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setPage(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === page ? "w-8 bg-gold" : "w-2 bg-white/15 hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * AffiliateCTA
 * ==========================================================*/

const EARNINGS_BARS = [
  { d: "Mon", v: 32 },
  { d: "Tue", v: 48 },
  { d: "Wed", v: 41 },
  { d: "Thu", v: 67 },
  { d: "Fri", v: 58 },
  { d: "Sat", v: 84 },
  { d: "Sun", v: 73 },
];

export function AffiliateCTA() {
  return (
    <section id="affiliate" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d0d]">
          {/* Gold top hairline */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />
          {/* Radial gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-gold/20 blur-[120px] animate-pulse-glow"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-gold/10 blur-[100px]"
          />
          {/* Grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid opacity-25"
          />

          <div className="relative grid grid-cols-1 gap-10 p-8 md:p-12 lg:grid-cols-2 lg:gap-12 lg:p-16">
            {/* Left — copy + CTAs */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                <span aria-hidden>💰</span> Affiliate Program
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Earn up to <span className="text-gradient-gold">15%</span> on every referral
              </h2>

              <p className="mt-4 max-w-lg text-sm text-muted-foreground md:text-base">
                Join 12,000+ partners earning passive income with Playbeat Digital. Get
                your link, share it, and cash out anytime.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-full bg-gold px-6 text-black hover:bg-gold/90 hover:shadow-[0_8px_40px_-8px_rgba(255,213,79,0.6)]"
                >
                  <a href="#affiliate">
                    Become an Affiliate
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="h-11 rounded-full border border-white/15 bg-white/[0.03] px-6 text-white hover:bg-white/10"
                >
                  <a href="#affiliate">
                    <LayoutDashboard className="size-4" />
                    View dashboard
                  </a>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <TrendingUp className="size-3.5 text-gold" /> Real-time tracking
                </span>
                <span className="flex items-center gap-2">
                  <MousePointerClick className="size-3.5 text-gold" /> 30-day cookies
                </span>
                <span className="flex items-center gap-2">
                  <ShoppingCart className="size-3.5 text-gold" /> Cash out anytime
                </span>
              </div>
            </div>

            {/* Right — earnings preview dashboard widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative"
            >
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-3xl bg-gold/10 blur-3xl"
              />
              <div className="glass shadow-premium rounded-2xl p-5 md:p-6">
                {/* Widget header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Earnings preview
                    </p>
                    <p className="text-sm font-semibold text-white">This month</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-[11px] font-semibold text-success ring-1 ring-success/20">
                    <TrendingUp className="size-3" /> +24.6%
                  </span>
                </div>

                {/* Commission headline */}
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">
                    $
                    <AnimatedCounter value={1248.5} decimals={2} />
                  </span>
                  <span className="pb-1 text-xs text-muted-foreground">commission</span>
                </div>

                {/* Clicks + Sales tiles */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MousePointerClick className="size-3.5 text-gold" /> Clicks
                    </div>
                    <p className="mt-1 text-xl font-bold text-white">
                      <AnimatedCounter value={3420} />
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ShoppingCart className="size-3.5 text-gold" /> Sales
                    </div>
                    <p className="mt-1 text-xl font-bold text-white">
                      <AnimatedCounter value={86} />
                    </p>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-5">
                  <div className="flex h-24 items-end justify-between gap-2">
                    {EARNINGS_BARS.map((b, i) => {
                      const isPeak = b.v === Math.max(...EARNINGS_BARS.map((x) => x.v));
                      return (
                        <div
                          key={b.d}
                          className="flex flex-1 flex-col items-center gap-1.5"
                        >
                          <div className="flex h-20 w-full items-end">
                            <motion.div
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{
                                duration: 0.6,
                                delay: i * 0.05,
                                ease: EASE,
                              }}
                              style={{ height: `${b.v}%`, transformOrigin: "bottom" }}
                              className={cn(
                                "w-full rounded-t-md",
                                isPeak
                                  ? "bg-gradient-to-t from-gold/40 to-gold"
                                  : "bg-gradient-to-t from-white/10 to-white/25"
                              )}
                            />
                          </div>
                          <span className="text-[9px] uppercase text-muted-foreground">
                            {b.d}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer row */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] text-muted-foreground">
                  <span>
                    Next payout in <span className="font-semibold text-white">7 days</span>
                  </span>
                  <span className="font-semibold text-gold">Auto-cashout on</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
