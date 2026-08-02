"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Star,
  ShoppingCart,
  Eye,
  ShieldCheck,
  Clock,
  Flame,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatPrice, discountPct } from "@/lib/format";
import { PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

/* Pick the best "deal of the day": highest discount % among flash deals. */
const DEAL =
  PRODUCTS.filter((p) => p.flashDeal && p.oldPrice).sort(
    (a, b) => discountPct(b.oldPrice!, b.price) - discountPct(a.oldPrice!, a.price)
  )[0] ?? PRODUCTS[0];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function useDealCountdown() {
  // Target: 23h from mount (so the deal "resets daily").
  const target = React.useMemo(() => Date.now() + 23 * 3600 * 1000 + 59 * 60 * 1000, []);
  const [now, setNow] = React.useState(() => Date.now());
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { h, m, s, mounted };
}

const FEATURES = [
  "Instant digital delivery",
  "100% authentic & verified",
  "Lifetime activation guarantee",
  "24/7 customer support",
];

export function DealOfTheDay() {
  const { currency, addToCart, openCart, openQuickView } = useStore();
  const { toast } = useToast();
  const { h, m, s, mounted } = useDealCountdown();

  const discount = DEAL.oldPrice ? discountPct(DEAL.oldPrice, DEAL.price) : 0;

  const handleAdd = () => {
    addToCart({
      id: DEAL.id,
      name: DEAL.name,
      price: DEAL.price,
      image: DEAL.emoji,
      category: DEAL.category,
    });
    toast({ title: "Added to cart", description: DEAL.name });
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: DEAL.id,
        name: DEAL.name,
        price: DEAL.price,
        image: DEAL.emoji,
        category: DEAL.category,
      },
      1
    );
    openCart();
  };

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#161208] via-[#0d0d0d] to-[#0a0a0a]"
        >
          {/* gold top hairline */}
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div className="grid items-stretch gap-0 md:grid-cols-2">
            {/* LEFT: visual */}
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-8 md:min-h-[440px] md:p-12">
              {/* gradient backdrop */}
              <div
                className="absolute inset-0"
                style={{ background: DEAL.gradient }}
              />
              <div className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* floating emoji */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-[8rem] drop-shadow-[0_16px_40px_rgba(0,0,0,0.6)] md:text-[10rem]"
              >
                {DEAL.emoji}
              </motion.div>

              {/* discount ribbon */}
              <div className="absolute right-5 top-5 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  whileInView={{ scale: 1, rotate: -8 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
                  className="grid size-20 place-items-center rounded-full bg-danger text-white shadow-[0_8px_30px_-4px_rgba(255,77,77,0.6)] md:size-24"
                >
                  <div className="text-center leading-none">
                    <span className="block text-2xl font-extrabold md:text-3xl">-{discount}%</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider">OFF</span>
                  </div>
                </motion.div>
              </div>

              {/* flash badge */}
              <div className="absolute bottom-5 left-5">
                <Badge className="bg-gold text-black shadow-lg">
                  <Flame className="size-3 fill-black" /> Deal of the Day
                </Badge>
              </div>
            </div>

            {/* RIGHT: details */}
            <div className="flex flex-col justify-center gap-5 p-6 md:p-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                  <span className="size-1.5 rounded-full bg-gold animate-pulse" />
                  Limited time
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-white md:text-4xl">
                  {DEAL.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  {DEAL.description}
                </p>
              </div>

              {/* rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(DEAL.rating)
                          ? "size-4 fill-gold text-gold"
                          : "size-4 fill-white/10 text-white/10"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {DEAL.rating.toFixed(1)} · {DEAL.reviews.toLocaleString()} reviews
                </span>
              </div>

              {/* countdown */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock className="size-4 text-gold" /> Ends in
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { v: h, l: "HRS" },
                    { v: m, l: "MIN" },
                    { v: s, l: "SEC" },
                  ].map((unit, i) => (
                    <React.Fragment key={unit.l}>
                      <div className="flex min-w-[3rem] flex-col items-center rounded-lg border border-white/[0.08] bg-black/40 px-2 py-1.5 backdrop-blur">
                        <span className="font-mono text-xl font-bold tabular-nums text-white md:text-2xl">
                          {mounted ? pad(unit.v) : "--"}
                        </span>
                        <span className="text-[9px] font-semibold tracking-wider text-muted-foreground">
                          {unit.l}
                        </span>
                      </div>
                      {i < 2 && <span className="text-lg font-bold text-gold">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* features */}
              <ul className="grid grid-cols-2 gap-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="grid size-4 place-items-center rounded-full bg-success/20">
                      <Check className="size-3 text-success" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* price + actions */}
              <div className="flex flex-wrap items-end justify-between gap-4 pt-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-white md:text-4xl">
                    {formatPrice(DEAL.price, currency)}
                  </span>
                  {DEAL.oldPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(DEAL.oldPrice, currency)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-success">
                  <ShieldCheck className="size-4" /> Secure checkout
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAdd}
                  variant="outline"
                  className="flex-1 border-white/[0.08] bg-white/[0.03] py-3 text-white hover:bg-white/[0.06] hover:text-white"
                >
                  <ShoppingCart className="size-4" /> Add to cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gold py-3 font-semibold text-black hover:bg-gold/90"
                >
                  <Zap className="size-4 fill-black" /> Buy now
                </Button>
                <Button
                  onClick={() => openQuickView(DEAL)}
                  variant="outline"
                  size="icon"
                  className="size-12 border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
                  aria-label="Quick view"
                >
                  <Eye className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
