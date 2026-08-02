"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, Clock } from "lucide-react";

/**
 * Live activity ticker — a horizontal marquee of "recent purchases" that
 * scrolls continuously below the trust badges. Pure decoration / social proof;
 * pauses on hover.
 */

const ACTIVITIES = [
  { name: "ChatGPT Plus", emoji: "🤖", buyer: "Adeel", country: "🇵🇰 Pakistan", ago: "2 min ago" },
  { name: "Steam Wallet $50", emoji: "💸", buyer: "Sarah", country: "🇺🇸 USA", ago: "just now" },
  { name: "Netflix Premium", emoji: "🍿", buyer: "Rafiq", country: "🇧🇩 Bangladesh", ago: "5 min ago" },
  { name: "Midjourney Pro", emoji: "🎨", buyer: "Lina", country: "🇩🇪 Germany", ago: "1 min ago" },
  { name: "Office 365", emoji: "📄", buyer: "Marcus", country: "🇸🇬 Singapore", ago: "3 min ago" },
  { name: "Spotify Premium", emoji: "🎧", buyer: "Fatima", country: "🇦🇪 UAE", ago: "4 min ago" },
  { name: "NordVPN 2yr", emoji: "🛡️", buyer: "Diego", country: "🇧🇷 Brazil", ago: "6 min ago" },
  { name: "EA Sports FC 25", emoji: "⚽", buyer: "Yuki", country: "🇯🇵 Japan", ago: "7 min ago" },
  { name: "Apple Gift Card", emoji: "🍎", buyer: "Priya", country: "🇮🇳 India", ago: "8 min ago" },
  { name: "Discord Nitro", emoji: "💬", buyer: "Liam", country: "🇦🇺 Australia", ago: "9 min ago" },
];

function ActivityItem({ a }: { a: (typeof ACTIVITIES)[number] }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.02] py-1.5 pl-1.5 pr-4">
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full text-base ring-1 ring-white/[0.08]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,213,79,0.25), rgba(77,141,255,0.25))",
        }}
      >
        {a.emoji}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="flex items-center gap-1 text-xs font-medium text-white">
          <ShoppingBag className="size-3 text-gold" />
          {a.buyer} bought {a.name}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="size-2.5" />
          {a.country}
          <span className="text-white/20">·</span>
          <Clock className="size-2.5" />
          {a.ago}
        </span>
      </div>
    </div>
  );
}

export default function LiveActivityTicker() {
  // Duplicate the list so the marquee loops seamlessly.
  const doubled = [...ACTIVITIES, ...ACTIVITIES];

  return (
    <section
      aria-label="Live purchase activity"
      className="relative overflow-hidden border-y border-white/[0.04] bg-white/[0.01] py-3"
    >
      {/* fade masks on both edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

      {/* left label */}
      <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 md:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-success">Live</span>
      </div>

      <motion.div
        className="flex w-max gap-3 pl-4 md:pl-32"
        animate={{ x: [0, "-50%"] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {doubled.map((a, i) => (
          <ActivityItem key={`${a.name}-${i}`} a={a} />
        ))}
      </motion.div>
    </section>
  );
}
