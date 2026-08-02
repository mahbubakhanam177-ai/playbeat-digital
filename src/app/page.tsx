import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CartDrawer from "@/components/layout/cart-drawer";
import SearchModal from "@/components/layout/search-modal";
import MobileNav from "@/components/layout/mobile-nav";
import QuickViewModal from "@/components/layout/quick-view-modal";
import Hero from "@/components/sections/hero";
import { TrustBadges, Categories } from "@/components/sections/trust-categories";
import {
  FeaturedProducts,
  TrendingProducts,
  FlashDeals,
  BestSellers,
  AiTools,
  FreeTools,
  Bundles,
} from "@/components/sections/product-rails";
import { WhyChooseUs, Testimonials, AffiliateCTA } from "@/components/sections/why-testimonials";
import { BlogPosts, Newsletter } from "@/components/sections/blog-newsletter";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-24 lg:pb-0">
        {/* 1. Hero */}
        <Hero />
        {/* 2. Trust Badges */}
        <TrustBadges />
        {/* 3. Popular Categories */}
        <Categories />
        {/* 4. Featured Products */}
        <FeaturedProducts />
        {/* 5. Trending Products */}
        <TrendingProducts />
        {/* 6. Flash Deals */}
        <FlashDeals />
        {/* 7. Best Sellers */}
        <BestSellers />
        {/* 8. AI Tools */}
        <AiTools />
        {/* 9. Free Tools */}
        <FreeTools />
        {/* 10. Bundles */}
        <Bundles />
        {/* 11. Why Choose Us */}
        <WhyChooseUs />
        {/* 12. Testimonials */}
        <Testimonials />
        {/* Affiliate CTA (nav target: #affiliate) */}
        <AffiliateCTA />
        {/* 13. Latest Blog Posts */}
        <BlogPosts />
        {/* 14. Newsletter */}
        <Newsletter />
      </main>
      <SiteFooter />

      {/* Global overlays */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <MobileNav />
    </div>
  );
}
