import { CURRENCIES, type CurrencyCode } from "@/lib/store";

/** Format a base USD price into the selected currency. */
export function formatPrice(usd: number, currency: CurrencyCode = "USD"): string {
  const info = CURRENCIES[currency];
  const converted = usd * info.rate;
  if (currency === "USD") {
    return `${info.symbol}${converted.toFixed(2)}`;
  }
  // Local currencies: round to whole units, group with commas.
  return `${info.symbol}${Math.round(converted).toLocaleString("en-US")}`;
}

/** Percentage discount between old and new price. */
export function discountPct(oldPrice: number, price: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
