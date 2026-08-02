"use client";

/* ------------------------------------------------------------------
 * Playbeat Digital — SiteHeader
 * Sticky top header. Transparent over the hero at the top of the page,
 * switches to .glass-strong + border after scrolling past ~24px.
 * Gold-accented, dark-theme only. z-50, ~72px tall on desktop.
 * ------------------------------------------------------------------ */

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Coins,
  DollarSign,
  Gift,
  Heart,
  LayoutDashboard,
  LogIn,
  Menu,
  Music2,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Star,
  ArrowRight,
  User,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { CURRENCIES, useStore, type CurrencyCode } from "@/lib/store";
import { NAV_LINKS, CATEGORIES, PRODUCTS } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import type { CategorySlug } from "@/lib/data";
import { Button } from "@/components/ui/button";
import LoyaltyBadge from "@/components/layout/loyalty-badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ----------------------------- Types ----------------------------- */
type NavLinkItem = {
  label: string;
  href: string;
  highlight?: boolean;
};

/* Normalize NAV_LINKS (readonly tuple of varying shapes) into a uniform type. */
const NAV_ITEMS: NavLinkItem[] = NAV_LINKS.map((l) => ({
  label: l.label,
  href: l.href,
  highlight: "highlight" in l ? Boolean(l.highlight) : false,
}));

const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

const ACCOUNT_MENU: { label: string; icon: React.ElementType }[] = [
  { label: "Sign In", icon: LogIn },
  { label: "My Orders", icon: Package },
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Rewards & Points", icon: Gift },
  { label: "Points History", icon: History },
  { label: "Affiliate Earnings", icon: DollarSign },
  { label: "Settings", icon: Settings },
];

/* --------------------------- Logo --------------------------- */
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Playbeat Digital — scroll to top"
      className="group flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gold text-black shadow-[0_4px_20px_-6px_rgba(255,213,79,0.6)] transition-transform duration-300 group-hover:scale-105">
        <Music2 className="size-5" strokeWidth={2.5} />
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
      </span>
      <span className="hidden text-[17px] font-extrabold tracking-tight sm:block">
        <span className="text-gradient-gold">Playbeat</span>
        <span className="text-white">.digital</span>
      </span>
    </button>
  );
}

/* --------------------------- Search Pill --------------------------- */
const SearchPill = React.forwardRef<
  HTMLButtonElement,
  { className?: string; onClick?: () => void; label?: string }
>(function SearchPill({ className, onClick, label = "Search products" }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "group flex h-10 w-full items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-left text-sm text-muted-foreground transition-all duration-300 hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        className
      )}
    >
      <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-gold" />
      <span className="flex-1 truncate">Search 4,000+ digital products…</span>
      <kbd className="hidden items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
        <span className="text-gold/80">⌘</span>
        <span>K</span>
      </kbd>
    </button>
  );
});

/* --------------------------- Count Badge --------------------------- */
function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold leading-[18px] text-black shadow-[0_0_0_2px_#070707]"
      aria-hidden
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

/* --------------------------- Icon Button --------------------------- */
function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        className
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------- Currency Switcher --------------------------- */
function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const current = CURRENCIES[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Switch currency, current ${current.label}`}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
            compact && "w-full justify-between px-3 py-2.5"
          )}
        >
          <Coins className="size-4 text-gold" />
          <span className="font-bold text-gold">{current.symbol}</span>
          <span className="text-white/80">{current.code}</span>
          {!compact && <ChevronDown className="ml-0.5 size-3 text-muted-foreground" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-44 border-white/[0.08] bg-popover/95 text-white backdrop-blur-xl"
      >
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Currency
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        {CURRENCY_CODES.map((code) => {
          const info = CURRENCIES[code];
          const active = code === currency;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setCurrency(code)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm outline-none focus:bg-white/[0.06] data-[highlighted]:bg-white/[0.06]",
                active ? "text-gold" : "text-white/80"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-bold text-gold">{info.symbol}</span>
                <span>{info.code}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {info.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* --------------------------- Account Menu --------------------------- */
function AccountMenu() {
  const openRewards = useStore((s) => s.openRewards);
  const openHistory = useStore((s) => s.openHistory);
  const loyaltyPoints = useStore((s) => s.loyaltyPoints);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex size-10 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        >
          <User className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-60 border-white/[0.08] bg-popover/95 text-white backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-gold/25 to-azure/20 ring-1 ring-inset ring-white/[0.08]">
            <User className="size-4 text-white/70" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Welcome to Playbeat</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Coins className="size-3 text-gold" />
              <span className="font-semibold text-gold">{loyaltyPoints.toLocaleString()}</span> loyalty points
            </span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        {ACCOUNT_MENU.map((item, idx) => (
          <React.Fragment key={item.label}>
            {(idx === 1 || idx === 5) && (
              <DropdownMenuSeparator className="bg-white/[0.06]" />
            )}
            <DropdownMenuItem
              onSelect={() => {
                if (item.label === "Rewards & Points") openRewards();
                if (item.label === "Points History") openHistory();
              }}
              className="cursor-pointer rounded-md px-2.5 py-2 text-sm text-white/80 outline-none focus:bg-white/[0.06] focus:text-white data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-white"
            >
              <item.icon className={cn("size-4", (item.label === "Rewards & Points" || item.label === "Points History") ? "text-gold" : "text-muted-foreground")} />
              <span>{item.label}</span>
              {item.label === "Rewards & Points" && (
                <span className="ml-auto text-[10px] font-bold text-gold">{loyaltyPoints.toLocaleString()} pts</span>
              )}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* --------------------------- Desktop Nav Link --------------------------- */
function NavLink({
  href,
  label,
  highlight,
  onClick,
}: {
  href: string;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  if (highlight) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="group relative inline-flex shrink-0 items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-all duration-300 hover:bg-gold/20 hover:shadow-[0_0_24px_-6px_rgba(255,213,79,0.55)]"
      >
        {label}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative inline-flex shrink-0 items-center text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
    >
      <span>{label}</span>
      <span className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-gold via-gold/70 to-transparent transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

/* --------------------------- Mega Menu --------------------------- */
/* Maps a nav label to a category slug so we know which links trigger a mega-menu. */
const MEGA_MAP: Record<string, CategorySlug> = {
  Games: "games",
  Software: "software",
  "AI Tools": "ai-tools",
  Subscriptions: "subscriptions",
  "Gift Cards": "gift-cards",
  "Free Tools": "free-tools",
  Bundles: "bundles",
};

/* Per-category sub-category / filter rows shown in the mega-menu left column. */
const MEGA_SUBS: Record<CategorySlug, { label: string }[]> = {
  games: [
    { label: "PC / Steam" },
    { label: "PlayStation" },
    { label: "Xbox" },
    { label: "Nintendo" },
    { label: "In-Game Currency" },
    { label: "Season Passes" },
  ],
  software: [
    { label: "Office & Productivity" },
    { label: "Antivirus & Security" },
    { label: "VPN" },
    { label: "Design & Creative" },
    { label: "Development" },
    { label: "Utilities" },
  ],
  "ai-tools": [
    { label: "ChatGPT & OpenAI" },
    { label: "Midjourney" },
    { label: "Claude & Anthropic" },
    { label: "Image Generation" },
    { label: "Code Assistants" },
    { label: "API Credits" },
  ],
  subscriptions: [
    { label: "Streaming" },
    { label: "Music" },
    { label: "Social" },
    { label: "Productivity" },
    { label: "Cloud Storage" },
    { label: "Gaming" },
  ],
  "gift-cards": [
    { label: "Apple" },
    { label: "Google Play" },
    { label: "Amazon" },
    { label: "Steam" },
    { label: "PlayStation" },
    { label: "Netflix" },
  ],
  "free-tools": [
    { label: "Image Converters" },
    { label: "PDF Tools" },
    { label: "Developer Tools" },
    { label: "Calculators" },
    { label: "Text Utilities" },
    { label: "Color Tools" },
  ],
  bundles: [
    { label: "AI Mega Bundles" },
    { label: "Streaming Bundles" },
    { label: "Software Bundles" },
    { label: "Game Bundles" },
    { label: "Creator Packs" },
    { label: "Business Packs" },
  ],
};

function MegaMenuPanel({ slug }: { slug: CategorySlug }) {
  const currency = useStore((s) => s.currency);
  const openQuickView = useStore((s) => s.openQuickView);
  const category = CATEGORIES.find((c) => c.slug === slug)!;
  const subs = MEGA_SUBS[slug];
  const featured = PRODUCTS.filter((p) => p.category === slug)
    .sort(
      (a, b) =>
        Number(b.featured) -
        Number(a.featured) +
        Number(b.bestSeller ?? false) -
        Number(a.bestSeller ?? false)
    )
    .slice(0, 3);

  return (
    <div className="flex w-[760px] max-w-[92vw] gap-5 p-5">
      {/* Left: sub-categories */}
      <div className="flex w-[56%] flex-col">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="grid size-10 place-items-center rounded-xl text-xl"
            style={{ background: category.gradient }}
          >
            {category.emoji}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{category.name}</span>
            <span className="text-[11px] text-muted-foreground">
              {category.count.toLocaleString()}+ products
            </span>
          </div>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          {category.description}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {subs.map((sub) => (
            <button
              key={sub.label}
              onClick={() => {
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-white/75 transition-colors hover:bg-white/[0.06] hover:text-gold"
            >
              <span className="size-1 rounded-full bg-gold/50" />
              {sub.label}
            </button>
          ))}
        </div>
        <Link
          href="#categories"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:gap-2.5 transition-all"
        >
          View all {category.name} <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Right: featured products */}
      <div className="flex w-[44%] flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <span className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Featured in {category.name}
        </span>
        <div className="flex flex-col gap-1.5">
          {featured.map((p) => (
            <button
              key={p.id}
              onClick={() => openQuickView(p)}
              className="group flex items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/[0.05]"
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-md text-lg"
                style={{ background: p.gradient }}
              >
                {p.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-white group-hover:text-gold">
                  {p.name}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Star className="size-2.5 fill-gold text-gold" />
                  {p.rating.toFixed(1)}
                  <span className="text-white/20">·</span>
                  <span className="font-semibold text-white/80">
                    {p.isFree ? "Free" : formatPrice(p.price, currency)}
                  </span>
                </span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-gold" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* A nav link wrapper that triggers the mega-menu on hover/focus. */
function MegaNavRegion({
  label,
  href,
  slug,
}: {
  label: string;
  href: string;
  slug: CategorySlug;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => cancelClose(), []);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        cancelClose();
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Link
        href={href}
        className="group relative inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-gold"
          )}
        />
        <span className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-0 bg-gradient-to-r from-gold via-gold/70 to-transparent transition-all duration-300 group-hover:w-full" />
      </Link>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2"
          >
            {/* gold top accent */}
            <span className="absolute -top-px left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="glass-strong overflow-hidden rounded-2xl border border-white/[0.08] shadow-premium">
              <MegaMenuPanel slug={slug} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================ Site Header ============================ */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const openCart = useStore((s) => s.openCart);
  const openSearch = useStore((s) => s.openSearch);
  const openWishlist = useStore((s) => s.openWishlist);
  const currency = useStore((s) => s.currency);
  const promoDismissed = useStore((s) => s.promoDismissed);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* Toggle glass background after scrolling past threshold. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); /* sync on mount (e.g. refresh mid-page) */
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Global "/" or "⌘K" / "Ctrl+K" opens search (when not typing). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        Boolean(target?.isContentEditable);
      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();
        openSearch();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-50 transition-all duration-300",
        promoDismissed ? "top-0" : "top-9",
        scrolled
          ? "glass-strong border-b border-white/[0.06]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex w-[86%] max-w-sm flex-col gap-0 border-r border-white/[0.06] bg-background/95 p-0 backdrop-blur-xl"
          >
            {/* Mobile sheet header */}
            <SheetHeader className="flex flex-row items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <SheetTitle className="flex items-center gap-2.5 text-base font-extrabold">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gold text-black">
                  <Music2 className="size-4" strokeWidth={2.5} />
                </span>
                <span>
                  <span className="text-gradient-gold">Playbeat</span>
                  <span className="text-white">.digital</span>
                </span>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile search */}
            <div className="px-5 py-4">
              <SearchPill
                onClick={() => {
                  closeMobile();
                  openSearch();
                }}
              />
            </div>

            {/* Mobile nav */}
            <nav className="flex flex-col gap-1 px-3 pb-2">
              {NAV_ITEMS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    link.highlight
                      ? "border border-gold/30 bg-gold/10 text-gold"
                      : "text-white/80 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile footer: currency + quick actions */}
            <div className="mt-auto space-y-3 border-t border-white/[0.06] px-5 py-4">
              <CurrencySwitcher compact />
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
                  onClick={() => {
                    closeMobile();
                    openWishlist();
                  }}
                >
                  <Heart className="size-4" /> Wishlist
                </Button>
                <Button
                  type="button"
                  className="h-10 bg-gold text-black hover:bg-gold/90"
                  onClick={closeMobile}
                >
                  <LogIn className="size-4" /> Sign In
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Logo onClick={scrollToTop} />

        {/* Desktop nav (lg+) */}
        <nav
          aria-label="Primary"
          className="ml-1 hidden items-center gap-2 text-sm lg:flex xl:gap-3"
        >
          {NAV_ITEMS.map((link) => {
            const megaSlug = MEGA_MAP[link.label];
            if (megaSlug) {
              return (
                <MegaNavRegion
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  slug={megaSlug}
                />
              );
            }
            return (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                highlight={link.highlight}
              />
            );
          })}
        </nav>

        {/* Desktop search bar (xl+) — centered between nav and right icons */}
        <div className="hidden flex-1 justify-center xl:flex">
          <SearchPill
            onClick={openSearch}
            className="max-w-[220px] 2xl:max-w-sm"
          />
        </div>

        {/* Spacer pushes right actions to the edge below xl */}
        <div className="flex-1 xl:hidden" aria-hidden />

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1 lg:gap-1.5">
          {/* Search icon (below xl) */}
          <IconButton
            label="Search products"
            onClick={openSearch}
            className="xl:hidden"
          >
            <Search className="size-5" />
          </IconButton>

          {/* Currency switcher (md+) */}
          <div className="hidden md:block">
            <CurrencySwitcher />
          </div>

          {/* Loyalty badge (md+) */}
          <div className="hidden md:block">
            <LoyaltyBadge />
          </div>

          {/* Wishlist */}
          <IconButton
            label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
            onClick={openWishlist}
            className="hidden sm:flex"
          >
            <Heart className="size-5" />
            <CountBadge count={wishlistCount} />
          </IconButton>

          {/* Cart + live total chip */}
          <div className="flex items-center">
            <IconButton
              label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              onClick={openCart}
            >
              <ShoppingBag className="size-5" />
              <CountBadge count={cartCount} />
            </IconButton>
            {cartTotal > 0 && (
              <span className="ml-0.5 hidden whitespace-nowrap rounded-full bg-gold/10 px-2 py-1 text-[11px] font-bold text-gold ring-1 ring-gold/20 sm:inline-block">
                {formatPrice(cartTotal, currency)}
              </span>
            )}
          </div>

          {/* Account (sm+) */}
          <div className="hidden sm:block">
            <AccountMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
