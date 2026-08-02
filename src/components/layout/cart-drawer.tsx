"use client";

import * as React from "react";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Zap,
  Tag,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ProductRow } from "@/components/shared/product-card";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { PRODUCTS } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* Spend $50 USD to unlock a 10% discount on the order. */
const DISCOUNT_THRESHOLD = 50; // USD
const DISCOUNT_PCT = 10;

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQty,
    clearCart,
    currency,
  } = useStore();
  const { toast } = useToast();

  const [couponInput, setCouponInput] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);

  /* Derived cart totals (USD base). */
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalUSD = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const remaining = Math.max(0, DISCOUNT_THRESHOLD - subtotalUSD);
  const progressPct = Math.min(100, (subtotalUSD / DISCOUNT_THRESHOLD) * 100);
  const unlocked = subtotalUSD >= DISCOUNT_THRESHOLD;
  const discountUSD = couponApplied ? subtotalUSD * (DISCOUNT_PCT / 100) : 0;
  const totalUSD = Math.max(0, subtotalUSD - discountUSD);

  /* Cross-sell: trending/featured products that aren't already in the cart. */
  const crossSell = React.useMemo(() => {
    const ids = new Set(cart.map((i) => i.id));
    return PRODUCTS.filter(
      (p) => !ids.has(p.id) && (p.trending || p.featured || p.bestSeller)
    ).slice(0, 3);
  }, [cart]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponApplied(true);
    toast({
      title: "Coupon applied — 10% off",
      description: `Code "${code.toUpperCase()}" activated on this order.`,
    });
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponInput("");
    toast({ title: "Coupon removed" });
  };

  const handleCheckout = () => {
    toast({
      title: "Redirecting to secure checkout…",
      description: "Encrypting your order with 256-bit SSL.",
    });
  };

  const handleClear = () => {
    clearCart();
    setCouponApplied(false);
    setCouponInput("");
    toast({ title: "Cart cleared" });
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-white/[0.06] bg-[#0d0d0d] p-0 sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="gap-0 border-b border-white/[0.06] p-5 pb-4">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="flex flex-col gap-1.5">
              <SheetTitle className="text-xl font-bold tracking-tight text-white">
                Your Cart
                <span className="ml-2 text-sm font-medium text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Review your cart items, apply a coupon, and proceed to checkout.
              </SheetDescription>
              <Badge className="mt-0.5 w-fit gap-1 border-0 bg-gold/10 text-gold ring-1 ring-gold/20">
                <Zap className="size-3 fill-gold" /> Instant delivery
              </Badge>
            </div>
          </div>

          {/* Free-shipping / discount progress */}
          {cart.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                {unlocked ? (
                  <span className="flex items-center gap-1.5 font-medium text-success">
                    <Sparkles className="size-3.5" /> You unlocked 10% off!
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    Add{" "}
                    <span className="font-semibold text-gold">
                      {formatPrice(remaining, currency)}
                    </span>{" "}
                    more to unlock 10% off
                  </span>
                )}
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatPrice(subtotalUSD, currency)} /{" "}
                  {formatPrice(DISCOUNT_THRESHOLD, currency)}
                </span>
              </div>
              <Progress
                value={progressPct}
                className="mt-2 h-1.5 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-gold/70 [&>[data-slot=progress-indicator]]:to-gold"
              />
            </div>
          )}
        </SheetHeader>

        {/* Body: items + cross-sell + coupon */}
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-24 place-items-center rounded-full bg-white/[0.04] ring-1 ring-white/[0.06]">
              <ShoppingBag className="size-10 text-muted-foreground/60" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                Your cart is empty
              </p>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Discover AI tools, games, gift cards and more — delivered
                instantly to your inbox.
              </p>
            </div>
            <Button
              onClick={closeCart}
              className="bg-gold text-black hover:bg-gold/90"
            >
              Browse products <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Cart items */}
            <ul className="divide-y divide-white/[0.04]">
              {cart.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.id);
                const gradient =
                  product?.gradient ??
                  "linear-gradient(135deg, #475569 0%, #1E293B 100%)";
                return (
                  <li key={item.id} className="p-4">
                    <div className="flex gap-3">
                      <div
                        className="grid size-14 shrink-0 place-items-center rounded-lg text-2xl ring-1 ring-white/[0.06]"
                        style={{ background: gradient }}
                        aria-hidden
                      >
                        {item.image}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {item.name}
                            </p>
                            <p className="text-xs capitalize text-muted-foreground">
                              {item.category.replace("-", " ")}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name} from cart`}
                            onClick={() => removeFromCart(item.id)}
                            className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          {/* Quantity stepper */}
                          <div className="flex items-center rounded-md border border-white/[0.08] bg-white/[0.02]">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() =>
                                updateQty(item.id, item.quantity - 1)
                              }
                              className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-gold"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span
                              className="w-8 text-center text-sm font-semibold tabular-nums text-white"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() =>
                                updateQty(item.id, item.quantity + 1)
                              }
                              className="grid size-7 place-items-center text-muted-foreground transition-colors hover:text-gold"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-white">
                              {formatPrice(item.price * item.quantity, currency)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[11px] text-muted-foreground">
                                {formatPrice(item.price, currency)} each
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Cross-sell */}
            {crossSell.length > 0 && (
              <div className="border-t border-white/[0.06] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="size-4 text-gold" />
                  <h3 className="text-sm font-semibold text-white">
                    You might also like
                  </h3>
                </div>
                <div className="space-y-2">
                  {crossSell.map((p) => (
                    <ProductRow key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Coupon */}
            <div className="border-t border-white/[0.06] p-4">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="size-3.5" /> Have a coupon code?
              </div>
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="PLAYBEAT10"
                  disabled={couponApplied}
                  aria-label="Coupon code"
                  className="h-9 border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-muted-foreground/60"
                />
                <Button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || !couponInput.trim()}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 border-white/10 bg-white/[0.03] px-3 text-xs",
                    couponApplied &&
                      "border-success/30 bg-success/10 text-success hover:bg-success/10"
                  )}
                >
                  {couponApplied ? (
                    <>
                      <Check className="size-3.5" /> Applied
                    </>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponApplied && (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="mt-2 text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-danger hover:underline"
                >
                  Remove coupon
                </button>
              )}
            </div>

            {/* Clear cart */}
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-danger hover:underline"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}

        {/* Sticky footer: totals + checkout */}
        {cart.length > 0 && (
          <div className="border-t border-white/[0.06] bg-[#0a0a0a]/80 p-4 backdrop-blur-md">
            <dl className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-medium text-white">
                  {formatPrice(subtotalUSD, currency)}
                </dd>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-success">
                    <Tag className="size-3.5" /> Discount ({DISCOUNT_PCT}%)
                  </dt>
                  <dd className="font-medium text-success">
                    −{formatPrice(discountUSD, currency)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="flex items-center gap-1 font-medium text-success">
                  <Check className="size-3.5" /> Instant — Free
                </dd>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2.5">
                <dt className="text-base font-semibold text-white">Total</dt>
                <dd className="text-right">
                  <span className="block text-lg font-bold text-gold">
                    {formatPrice(totalUSD, currency)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Incl. taxes · {currency}
                  </span>
                </dd>
              </div>
            </dl>
            <Button
              type="button"
              onClick={handleCheckout}
              className="mt-3 h-11 w-full bg-gold text-base font-bold text-black transition-all hover:bg-gold/90 hover:shadow-[0_8px_40px_-8px_rgba(255,213,79,0.6)]"
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </Button>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 w-full text-center text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-gold hover:underline"
            >
              Continue shopping
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
