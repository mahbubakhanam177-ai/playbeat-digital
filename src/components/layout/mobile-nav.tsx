"use client";

import * as React from "react";
import {
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  User,
  Heart,
  LayoutDashboard,
  Settings,
  Wallet,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * MobileNav — sticky bottom navigation bar (mobile only, `lg:hidden`).
 *
 * Five evenly-spaced icon buttons: Home, Categories, Search (elevated gold
 * circle), Cart (with quantity badge) and Account (opens a bottom Sheet).
 * Cart drawer & search modal are owned by the store and render above this
 * bar via their own Radix portals (also z-50 but appended later in DOM
 * order, so they correctly stack above the nav).
 */
export default function MobileNav() {
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const openCart = useStore((s) => s.openCart);
  const openSearch = useStore((s) => s.openSearch);

  const [accountOpen, setAccountOpen] = React.useState(false);

  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToCategories = () => {
    if (typeof document === "undefined") return;
    document
      .getElementById("categories")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav
        aria-label="Mobile primary"
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      >
        <div className="glass-strong border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)]">
          <div className="relative mx-auto flex max-w-md items-end justify-around px-2 pt-2">
            <NavButton
              label="Home"
              icon={Home}
              onClick={scrollToTop}
            />
            <NavButton
              label="Categories"
              icon={LayoutGrid}
              onClick={scrollToCategories}
            />

            {/* Center search — elevated gold circle */}
            <div className="flex flex-1 flex-col items-center gap-1">
              <button
                type="button"
                aria-label="Search products"
                onClick={openSearch}
                className="relative -mt-7 grid size-12 place-items-center rounded-full bg-gold text-black shadow-[0_10px_30px_-8px_rgba(255,213,79,0.65)] ring-2 ring-gold/40 transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <Search className="size-5" strokeWidth={2.5} />
                {/* subtle glow */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-gold/30 blur-lg"
                />
              </button>
              <span className="text-[10px] font-medium text-muted-foreground">
                Search
              </span>
            </div>

            <NavButton
              label="Cart"
              icon={ShoppingBag}
              onClick={openCart}
              badge={cartQty}
            />
            <NavButton
              label="Account"
              icon={User}
              onClick={() => setAccountOpen(true)}
            />
          </div>
        </div>
      </nav>

      {/* Account bottom Sheet */}
      <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-white/[0.08] bg-[#0c0c0c] p-0"
        >
          <SheetHeader className="px-5 pb-2 pt-6">
            <SheetTitle className="text-lg font-semibold text-white">
              Account
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Sign in to access your orders, wishlist & affiliate earnings.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-1 px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
            <AccountItem
              icon={LogIn}
              label="Sign In"
              highlight
              onClick={() => setAccountOpen(false)}
            />
            <AccountItem
              icon={LayoutDashboard}
              label="Dashboard"
              onClick={() => setAccountOpen(false)}
            />
            <AccountItem
              icon={Heart}
              label={`Wishlist (${wishlistCount})`}
              onClick={() => setAccountOpen(false)}
            />
            <AccountItem
              icon={Wallet}
              label="Affiliate"
              onClick={() => setAccountOpen(false)}
            />
            <AccountItem
              icon={Settings}
              label="Settings"
              onClick={() => setAccountOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ----------------------------- Sub-components ----------------------------- */

interface NavButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  badge?: number;
}

function NavButton({ label, icon: Icon, onClick, badge }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative flex flex-1 flex-col items-center gap-1 py-1.5"
    >
      <span className="relative">
        <Icon
          className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-gold group-active:text-gold"
          strokeWidth={2}
        />
        {badge && badge > 0 ? (
          <span
            aria-label={`${badge} items in cart`}
            className="absolute -right-2 -top-2 grid min-w-[1.1rem] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold leading-[1.1] text-black ring-2 ring-[#0a0a0a]"
          >
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
      </span>
      <span className="text-[10px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-gold group-active:text-gold">
        {label}
      </span>
    </button>
  );
}

interface AccountItemProps {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
}

function AccountItem({ icon: Icon, label, highlight, onClick }: AccountItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
        highlight
          ? "bg-gold font-semibold text-black hover:bg-gold/90"
          : "text-white hover:bg-white/[0.04]"
      )}
    >
      <Icon className="size-5 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
