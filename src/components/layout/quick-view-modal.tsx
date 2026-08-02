"use client";

import * as React from "react";
import {
  Heart,
  Star,
  Zap,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Share2,
  Facebook,
  Twitter,
  Link as LinkIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { formatPrice, discountPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/data";

/**
 * QuickViewModal — premium two-column quick view controlled by the store's
 * `quickViewProduct`. Uses shadcn `Dialog` (`open`/`onOpenChange` mapped to
 * `quickViewProduct` / `closeQuickView`). Left column = gallery (gradient
 * cover + emoji + dots overlay + sale/wishlist/delivery badges + decorative
 * thumbnail dots). Right column = info (category/rating, name, description,
 * features list, price block, quantity stepper, Add-to-Cart + Buy-Now
 * buttons, trust row, share row).
 *
 * The last shown product is held in a ref so the body persists visually
 * during Radix's close animation (which fires after `quickViewProduct`
 * becomes null).
 */
export default function QuickViewModal() {
  const quickViewProduct = useStore((s) => s.quickViewProduct);
  const closeQuickView = useStore((s) => s.closeQuickView);
  const currency = useStore((s) => s.currency);
  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const isWishlisted = useStore((s) => s.isWishlisted);
  const { toast } = useToast();

  const [qty, setQty] = React.useState(1);

  // Persist the last shown product across the close animation. When the
  // store clears `quickViewProduct` (close), Radix still plays the exit
  // animation — `displayedProduct` keeps the body populated so the modal
  // doesn't flash empty during that window.
  const [displayedProduct, setDisplayedProduct] =
    React.useState<Product | null>(null);
  React.useEffect(() => {
    if (quickViewProduct) setDisplayedProduct(quickViewProduct);
  }, [quickViewProduct]);
  const product = quickViewProduct ?? displayedProduct;

  // Reset qty whenever a new product is opened.
  React.useEffect(() => {
    if (quickViewProduct) setQty(1);
  }, [quickViewProduct]);

  const wished = product ? isWishlisted(product.id) : false;
  const discount =
    product?.oldPrice && !product.isFree
      ? discountPct(product.oldPrice, product.price)
      : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.isFree) {
      toast({
        title: "Added to your tools",
        description: `${product.name} is ready to use — free forever.`,
      });
      return;
    }
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.emoji,
        category: product.category,
      },
      qty
    );
    toast({
      title: "Added to cart",
      description: `${qty} × ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!product.isFree) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.emoji,
          category: product.category,
        },
        qty
      );
    }
    closeQuickView();
    openCart();
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id);
    toast({
      title: wished ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    });
  };

  const handleCopyLink = () => {
    if (!product) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/product/${product.id}`;
    try {
      void navigator.clipboard?.writeText(url);
    } catch {
      /* clipboard unavailable — toast still fires */
    }
    toast({
      title: "Copied!",
      description: "Product link copied to clipboard.",
    });
  };

  return (
    <Dialog
      open={!!quickViewProduct}
      onOpenChange={(o) => {
        if (!o) closeQuickView();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="glass-strong grid max-h-[92vh] grid-cols-1 gap-0 overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-3xl md:grid-cols-2"
      >
        {product && (
          <>
            {/* Accessible title / description (rendered visually below too,
                these are duplicated as sr-only so Radix stays happy without
                disrupting layout). */}
            <DialogTitle className="sr-only">{product.name}</DialogTitle>
            <DialogDescription className="sr-only">
              {product.description}
            </DialogDescription>

            {/* Custom close button — top-right of modal, above everything */}
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="absolute right-3 top-3 z-30 grid size-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <X className="size-4" />
            </button>

            {/* ---------------- LEFT — Gallery ---------------- */}
            <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[420px]">
              {/* Gradient cover */}
              <div
                className="absolute inset-0"
                style={{ background: product.gradient }}
                aria-hidden="true"
              />
              {/* Dots overlay */}
              <div
                className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay"
                aria-hidden="true"
              />
              {/* Bottom-up darkening for legibility of badges */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
                aria-hidden="true"
              />

              {/* Big emoji */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="select-none text-[6.5rem] drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)] sm:text-[8rem] md:text-[9rem]"
                  aria-hidden="true"
                >
                  {product.emoji}
                </span>
              </div>

              {/* Top-left badges: discount + flash / best-seller / free */}
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {discount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-danger px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                    <Zap className="size-3 fill-white" /> -{discount}%
                  </span>
                )}
                {product.flashDeal && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-black shadow-lg">
                    <Zap className="size-3 fill-black" /> Flash Deal
                  </span>
                )}
                {product.bestSeller && !product.flashDeal && (
                  <span className="inline-flex items-center rounded-full border border-gold/40 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-gold backdrop-blur">
                    Best Seller
                  </span>
                )}
                {product.isFree && (
                  <span className="inline-flex items-center rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
                    FREE
                  </span>
                )}
              </div>

              {/* Top-right: wishlist heart (offset on mobile so it never
                  overlaps the modal close button). */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "absolute top-3 z-20 grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all",
                  "right-14 md:right-3",
                  wished
                    ? "border-danger bg-danger/90 text-white"
                    : "border-white/15 bg-black/40 text-white hover:bg-black/60"
                )}
              >
                <Heart className={cn("size-4", wished && "fill-white")} />
              </button>

              {/* Bottom-left: Instant Delivery pill */}
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Zap className="size-3 text-gold fill-gold" />
                Instant Delivery
              </span>

              {/* Bottom-center: decorative thumbnail dots (suggest a gallery) */}
              <div
                className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5"
                aria-hidden="true"
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-2.5 rounded-full ring-1 ring-white/40 transition-all",
                      i === 0 ? "scale-125 ring-gold" : "opacity-60"
                    )}
                    style={{ background: product.gradient }}
                  />
                ))}
              </div>
            </div>

            {/* ---------------- RIGHT — Info ---------------- */}
            <div className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto p-5 md:max-h-[92vh] md:p-7">
              {/* Category + rating row */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 font-medium capitalize text-gold">
                  {product.category.replace("-", " ")}
                </span>
                <span
                  className="size-1 rounded-full bg-white/20"
                  aria-hidden="true"
                />
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3.5 fill-gold text-gold" />
                  <span className="font-semibold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground/70">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </span>
              </div>

              {/* Product name */}
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
                {product.name}
              </h2>

              {/* Short description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2">
                {FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-white/90"
                  >
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Price block */}
              <div className="flex flex-wrap items-end gap-3 pt-1">
                <span className="text-3xl font-bold text-white">
                  {product.isFree ? "Free" : formatPrice(product.price, currency)}
                </span>
                {product.oldPrice && !product.isFree && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.oldPrice, currency)}
                    </span>
                    {discount > 0 && (
                      <span className="inline-flex items-center rounded-full bg-danger/15 px-2 py-0.5 text-xs font-bold text-danger">
                        Save {discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Quantity stepper (hidden for free items) */}
              {!product.isFree && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Qty
                  </span>
                  <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                      className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/[0.06] disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span
                      className="min-w-[2rem] text-center text-sm font-semibold text-white"
                      aria-live="polite"
                    >
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      aria-label="Increase quantity"
                      className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/[0.06]"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddToCart}
                  className="h-11 border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
                >
                  <ShoppingBag className="size-4" />
                  {product.isFree ? "Get Free" : "Add to Cart"}
                </Button>
                <Button
                  type="button"
                  onClick={handleBuyNow}
                  className="h-11 bg-gold font-semibold text-black shadow-[0_8px_30px_-8px_rgba(255,213,79,0.5)] hover:bg-gold/90"
                >
                  <Zap className="size-4 fill-black" />
                  Buy Now
                </Button>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {TRUST_ITEMS.map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-2.5 text-center"
                  >
                    <t.icon className="size-4 text-gold" />
                    <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                      {t.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Share row */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Share
                </span>
                <div className="flex items-center gap-1.5">
                  {SHARE_BUTTONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      aria-label={`Share on ${s.label}`}
                      className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-gold hover:bg-gold hover:text-black"
                    >
                      <s.icon className="size-4" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy product link"
                    className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:border-gold hover:bg-gold hover:text-black"
                  >
                    <LinkIcon className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------- Constants ------------------------------- */

const FEATURES: string[] = [
  "Instant digital delivery — code in 60 seconds",
  "100% authentic & verified source",
  "Region-free, works globally",
  "Secure payment & money-back guarantee",
];

const TRUST_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Zap, label: "Instant delivery" },
  { icon: RefreshCw, label: "Easy refunds" },
];

const SHARE_BUTTONS: { icon: LucideIcon; label: string }[] = [
  { icon: Share2, label: "Share" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
];
