"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Lock,
  CreditCard,
  Wallet,
  Bitcoin,
  Building2,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  PartyPopper,
  Mail,
  Loader2,
  Tag,
  Gift,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { POINT_REWARDS, getCodeDiscount } from "@/lib/loyalty";

/* ----------------------------- Types ----------------------------- */
type Step = 0 | 1 | 2 | 3; // details, payment, processing, success
type PaymentMethod = "card" | "paypal" | "crypto" | "bkash";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
}[] = [
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "paypal", label: "PayPal", desc: "Pay with your PayPal balance", icon: Wallet, badge: "Popular" },
  { id: "crypto", label: "Cryptocurrency", desc: "BTC, ETH, USDT — 5% off", icon: Bitcoin, badge: "−5%" },
  { id: "bkash", label: "bKash / Easypaisa", desc: "Local mobile wallets", icon: Building2 },
];

const STEPS = ["Details", "Payment", "Confirmation"];

/* ----------------------------- Component ----------------------------- */
export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    cart,
    currency,
    clearCart,
    addPoints,
    addNotification,
    redeemedRewards,
  } = useStore();
  const { toast } = useToast();

  const [step, setStep] = React.useState<Step>(0);
  const [method, setMethod] = React.useState<PaymentMethod>("card");
  const [coupon, setCoupon] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");

  // Reset to first step whenever the modal opens.
  React.useEffect(() => {
    if (isCheckoutOpen) {
      setStep(0);
      setMethod("card");
      setCouponApplied(false);
      setCoupon("");
    }
  }, [isCheckoutOpen]);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cryptoDiscount = method === "crypto" ? subtotal * 0.05 : 0;
  // Redeemed codes give a flat USD discount; manual "PLAYBEAT10" gives 10%.
  const isRedeemedCode = couponApplied && /^PB-/.test(coupon);
  const couponDiscount = couponApplied
    ? isRedeemedCode
      ? getCodeDiscount(coupon)
      : subtotal * 0.1
    : 0;
  const total = Math.max(0, subtotal - cryptoDiscount - couponDiscount);

  const handleApplyCoupon = () => {
    if (!coupon.trim()) return;
    setCouponApplied(true);
    toast({ title: "Coupon applied", description: "10% discount added to your order." });
  };

  const applyRedeemedCode = (code: string) => {
    const discount = getCodeDiscount(code);
    setCoupon(code);
    setCouponApplied(true);
    toast({
      title: "Reward code applied",
      description: `${code} — ${formatPrice(discount, currency)} off your order.`,
    });
  };

  const handlePay = () => {
    const orderTotal = total;
    const orderCount = itemCount;
    setStep(2); // processing
    setTimeout(() => {
      setStep(3); // success
      addPoints(POINT_REWARDS.checkout, "checkout");
      addNotification({
        type: "order",
        title: "Order confirmed! 🎉",
        message: `${orderCount} item${orderCount === 1 ? "" : "s"} · ${formatPrice(orderTotal, currency)} — instant delivery activated. +${POINT_REWARDS.checkout} pts earned.`,
        emoji: "📦",
      });
      toast({
        title: `+${POINT_REWARDS.checkout} loyalty points earned!`,
        description: "Thanks for your order — points added to your account.",
      });
    }, 2200);
  };

  const handleClose = () => {
    closeCheckout();
    // If we just completed an order, clear the cart after the close animation.
    if (step === 3) {
      setTimeout(() => {
        clearCart();
        setStep(0);
      }, 200);
    }
  };

  const canProceedDetails = email.includes("@") && name.trim().length > 1;
  const canPay =
    method === "card"
      ? cardNumber.replace(/\s/g, "").length >= 12 && expiry.length >= 4 && cvc.length >= 3
      : true;

  return (
    <Dialog
      open={isCheckoutOpen}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="glass-strong max-h-[92vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border-white/[0.08] p-0 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete your purchase securely.
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/25">
              <Lock className="size-4.5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Secure Checkout</h2>
              <p className="text-xs text-muted-foreground">
                {step < 3 ? `${itemCount} item${itemCount === 1 ? "" : "s"} · ${formatPrice(total, currency)}` : "Order complete"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Stepper (hidden on success) */}
        {step < 3 && (
          <div className="flex items-center gap-1.5 px-5 py-3">
            {STEPS.map((label, i) => {
              const active = step === i;
              const done = step > i;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full text-xs font-bold transition-all",
                        done && "bg-success text-white",
                        active && "bg-gold text-black",
                        !done && !active && "bg-white/[0.06] text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : i + 1}
                    </span>
                    <span className={cn("text-xs font-medium", active ? "text-white" : "text-muted-foreground")}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className={cn("h-px flex-1", step > i ? "bg-success/40" : "bg-white/[0.08]")} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div className="max-h-[calc(92vh-180px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* STEP 0: Details */}
            {step === 0 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 p-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="co-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email (delivery address)
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="co-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Your codes arrive instantly at this email.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full name
                  </Label>
                  <Input
                    id="co-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="border-white/[0.08] bg-white/[0.03] text-white placeholder:text-muted-foreground"
                  />
                </div>

                {/* Coupon */}
                <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Tag className="size-3.5 text-gold" /> Have a coupon code?
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="PLAYBEAT10"
                      disabled={couponApplied}
                      className="border-white/[0.08] bg-white/[0.03] text-sm uppercase text-white placeholder:text-muted-foreground"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !coupon.trim()}
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      {couponApplied ? <Check className="size-4" /> : "Apply"}
                    </Button>
                  </div>
                  {/* Redeemed reward codes */}
                  {redeemedRewards.length > 0 && !couponApplied && (
                    <div className="space-y-1.5 pt-1">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                        <Gift className="size-3 text-gold" /> Your redeemed codes (tap to apply):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {redeemedRewards.slice(0, 5).map((code) => (
                          <button
                            key={code}
                            onClick={() => applyRedeemedCode(code)}
                            className="rounded-full border border-gold/25 bg-gold/[0.06] px-2.5 py-1 font-mono text-[10px] font-semibold text-gold transition-all hover:bg-gold hover:text-black"
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs text-success">
                      <Check className="size-3.5" />
                      {isRedeemedCode
                        ? `Reward code applied — ${formatPrice(couponDiscount, currency)} off`
                        : "Coupon applied — 10% discount active"}
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { icon: ShieldCheck, label: "256-bit SSL" },
                    { icon: Zap, label: "Instant delivery" },
                    { icon: Lock, label: "Secure payment" },
                  ].map((t) => (
                    <div key={t.label} className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5 text-center">
                      <t.icon className="size-4 text-gold" />
                      <span className="text-[10px] font-medium text-muted-foreground">{t.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 p-5"
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment method
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((pm) => {
                      const active = method === pm.id;
                      return (
                        <button
                          key={pm.id}
                          onClick={() => setMethod(pm.id)}
                          className={cn(
                            "relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
                            active
                              ? "border-gold/40 bg-gold/10"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                          )}
                        >
                          <div className="flex w-full items-center justify-between">
                            <pm.icon className={cn("size-5", active ? "text-gold" : "text-muted-foreground")} />
                            {pm.badge && (
                              <Badge className="bg-gold/15 text-[9px] text-gold">{pm.badge}</Badge>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-white">{pm.label}</span>
                          <span className="text-[10px] text-muted-foreground">{pm.desc}</span>
                          {active && (
                            <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-gold text-black">
                              <Check className="size-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card fields (only for card method) */}
                <AnimatePresence>
                  {method === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Card number
                        </Label>
                        <Input
                          value={cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                            setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                          }}
                          placeholder="4242 4242 4242 4242"
                          className="border-white/[0.08] bg-white/[0.03] font-mono text-white placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Expiry
                          </Label>
                          <Input
                            value={expiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                              setExpiry(v.length >= 2 ? v.slice(0, 2) + "/" + v.slice(2) : v);
                            }}
                            placeholder="MM/YY"
                            className="border-white/[0.08] bg-white/[0.03] font-mono text-white placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            CVC
                          </Label>
                          <Input
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="123"
                            className="border-white/[0.08] bg-white/[0.03] font-mono text-white placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {method !== "card" && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to{" "}
                      <span className="font-semibold text-white">
                        {PAYMENT_METHODS.find((p) => p.id === method)?.label}
                      </span>{" "}
                      to complete your payment securely.
                    </p>
                  </div>
                )}

                {method === "crypto" && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
                    <Check className="size-3.5" /> 5% crypto discount applied — you save {formatPrice(cryptoDiscount, currency)}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: Processing */}
            {step === 2 && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-16"
              >
                <Loader2 className="size-10 animate-spin text-gold" />
                <div className="text-center">
                  <p className="text-base font-semibold text-white">Processing your payment…</p>
                  <p className="text-sm text-muted-foreground">Don't close this window.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 3 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  className="relative"
                >
                  <span className="absolute inset-0 -z-10 rounded-full bg-success/30 blur-xl" />
                  <span className="grid size-20 place-items-center rounded-full bg-success text-white shadow-[0_8px_40px_-6px_rgba(76,175,80,0.6)]">
                    <PartyPopper className="size-9" />
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1.5"
                >
                  <h3 className="text-2xl font-bold text-white">Order confirmed!</h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Your digital codes are on their way to{" "}
                    <span className="font-semibold text-white">{email || "your email"}</span>. Delivery typically takes under 60 seconds.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 w-full max-w-sm rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order summary</span>
                    <span className="text-xs font-mono text-muted-foreground">#PB-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                    <span className="font-bold text-white">{formatPrice(total, currency)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-success">
                    <Zap className="size-3.5" /> Instant delivery activated
                  </div>
                </motion.div>
                <Button onClick={handleClose} className="mt-2 bg-gold text-black hover:bg-gold/90">
                  Continue shopping <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer: order total + nav (hidden on processing/success) */}
        {step < 2 && (
          <div className="border-t border-white/[0.06] bg-[#0a0a0a] px-5 py-4">
            <div className="mb-3 space-y-1">
              {couponApplied && (
                <div className="flex items-center justify-between text-xs text-success">
                  <span>{isRedeemedCode ? "Reward code" : "Coupon (10%)"}</span>
                  <span>−{formatPrice(couponDiscount, currency)}</span>
                </div>
              )}
              {method === "crypto" && (
                <div className="flex items-center justify-between text-xs text-success">
                  <span>Crypto discount (5%)</span>
                  <span>−{formatPrice(cryptoDiscount, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-white">{formatPrice(total, currency)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
                  className="border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
              )}
              {step === 0 ? (
                <Button
                  onClick={() => setStep(1)}
                  disabled={!canProceedDetails}
                  className="flex-1 bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-40"
                >
                  Continue to payment <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePay}
                  disabled={!canPay}
                  className="flex-1 bg-gold py-3 text-sm font-semibold text-black hover:bg-gold/90 disabled:opacity-40"
                >
                  <Lock className="size-4" /> Pay {formatPrice(total, currency)}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
