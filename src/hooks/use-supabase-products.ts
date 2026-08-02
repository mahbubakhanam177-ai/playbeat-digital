"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { Product, CategorySlug } from "@/lib/data";

/**
 * Fetches products from Supabase with optional filters.
 * Falls back to local PRODUCTS data if Supabase is empty/unreachable.
 */
export interface SupabaseProduct extends Omit<Product, "oldPrice" | "featured" | "trending" | "bestSeller" | "flashDeal" | "isFree"> {
  oldPrice?: number | null;
  featured?: boolean | null;
  trending?: boolean | null;
  bestSeller?: boolean | null;
  flashDeal?: boolean | null;
  isFree?: boolean | null;
}

function normalizeRow(row: Record<string, unknown>): Product {
  return {
    id: row.slug as string,
    name: row.name as string,
    category: row.category_slug as CategorySlug,
    description: (row.description as string) ?? "",
    price: Number(row.price) || 0,
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    rating: Number(row.rating) || 5,
    reviews: Number(row.reviews_count) || 0,
    emoji: (row.emoji as string) ?? "📦",
    gradient: (row.gradient as string) ?? "linear-gradient(135deg, #2B2B2B, #111111)",
    tags: (row.tags as string[]) ?? [],
    delivery: ((row.delivery as string) ?? "instant") as Product["delivery"],
    featured: Boolean(row.is_featured),
    trending: Boolean(row.is_trending),
    bestSeller: Boolean(row.is_best_seller),
    flashDeal: Boolean(row.is_flash_deal),
    isFree: Boolean(row.is_free),
  };
}

export function useSupabaseProducts(filter?: (p: Product) => boolean) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (cancelled) return;
        const normalized = (data ?? []).map(normalizeRow);
        setProducts(filter ? normalized.filter(filter) : normalized);
      } catch {
        // Fallback handled by caller using local data
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}

/** Fetch a single product by slug from Supabase. */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (error || !data) return null;
    return normalizeRow(data);
  } catch {
    return null;
  }
}
