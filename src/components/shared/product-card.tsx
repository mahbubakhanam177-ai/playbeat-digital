"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Star,
  Zap,
  ShoppingCart,
  Check,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { formatPrice, discountPct } from "@/lib/format";
import type { Product } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { currency, addToCart, openCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const { toast } = useToast();
  const wished = isWishlisted(product.id);
  const [added, setAdded] = React.useState(false);
  const discount = product.oldPrice ? discountPct(product.oldPrice, product.price) : 0;

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
    else openQuickView(product);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isFree) {
      toast({ title: "Added to your tools", description: `${product.name} is ready to use — free forever.` });
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.emoji,
      category: product.category,
    });
    setAdded(true);
    toast({ title: "Added to cart", description: product.name });
    setTimeout(() => setAdded(false), 1400);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isFree) {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.emoji,
          category: product.category,
        },
        1
      );
    }
    openCart();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414] shadow-premium transition-all duration-300 hover:border-gold/30 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: product.gradient }}
        />
        {/* subtle pattern */}
        <div className="absolute inset-0 bg-dots opacity-40 mix-blend-overlay" />
        {/* glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl md:text-7xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
            {product.emoji}
          </span>
        </div>

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="bg-danger text-white border-0 shadow-lg">
              -{discount}%
            </Badge>
          )}
          {product.flashDeal && (
            <Badge className="bg-gold text-black border-0 shadow-lg">
              <Zap className="size-3 mr-0.5 fill-black" /> Flash
            </Badge>
          )}
          {product.bestSeller && !product.flashDeal && (
            <Badge variant="outline" className="bg-black/50 text-gold border-gold/40 backdrop-blur">
              Best Seller
            </Badge>
          )}
          {product.isFree && (
            <Badge className="bg-success text-white border-0 shadow-lg">FREE</Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            toast({
              title: wished ? "Removed from wishlist" : "Saved to wishlist",
              description: product.name,
            });
          }}
          className={cn(
            "absolute right-3 top-3 grid size-9 place-items-center rounded-full border backdrop-blur-md transition-all",
            wished
              ? "bg-danger/90 border-danger text-white"
              : "bg-black/40 border-white/15 text-white hover:bg-black/60"
          )}
        >
          <Heart className={cn("size-4", wished && "fill-white")} />
        </button>

        {/* Quick view */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white backdrop-blur-md border border-white/15 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white/20"
        >
          <Eye className="size-4" /> Quick View
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{product.category.replace("-", " ")}</span>
          <span className="size-1 rounded-full bg-white/20" />
          <span className="inline-flex items-center gap-1 text-success">
            <Zap className="size-3" /> Instant
          </span>
        </div>

        <h3 className="font-semibold leading-snug text-white line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5",
                  i < Math.round(product.rating)
                    ? "fill-gold text-gold"
                    : "fill-white/10 text-white/10"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price + actions */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice, currency)}
              </span>
            )}
            <span className="text-lg font-bold text-white">
              {product.isFree ? "Free" : formatPrice(product.price, currency)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
          >
            {added ? (
              <Check className="size-4 text-success" />
            ) : (
              <Plus className="size-4" />
            )}
            <span className="hidden sm:inline">{product.isFree ? "Get" : "Add"}</span>
          </Button>
          <Button
            onClick={handleBuyNow}
            size="sm"
            className="flex-1 bg-gold text-black font-semibold hover:bg-gold/90"
          >
            <ShoppingCart className="size-4" />
            {product.isFree ? "Use" : "Buy"}
          </Button>
        </div>
      </div>

      {/* hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/0 transition-all duration-300 group-hover:ring-gold/20" />
    </motion.article>
  );
}

/* Compact horizontal product row (used in cart cross-sell) */
export function ProductRow({ product }: { product: Product }) {
  const { currency, addToCart } = useStore();
  const { toast } = useToast();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
      <div
        className="grid size-12 shrink-0 place-items-center rounded-lg text-2xl"
        style={{ background: product.gradient }}
      >
        {product.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{product.name}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {product.category.replace("-", " ")}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-white">
          {formatPrice(product.price, currency)}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-gold hover:bg-gold/10"
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.emoji,
              category: product.category,
            });
            toast({ title: "Added to cart", description: product.name });
          }}
        >
          <Plus className="size-3" /> Add
        </Button>
      </div>
    </div>
  );
}

export { Image };
