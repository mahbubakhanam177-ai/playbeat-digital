import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import CartDrawer from "@/components/layout/cart-drawer";
import SearchModal from "@/components/layout/search-modal";
import MobileNav from "@/components/layout/mobile-nav";
import QuickViewModal from "@/components/layout/quick-view-modal";
import PromoBar from "@/components/layout/promo-bar";
import ScrollProgress from "@/components/layout/scroll-progress";
import BackToTop from "@/components/layout/back-to-top";
import SocialProofToast from "@/components/layout/social-proof";
import WishlistDrawer from "@/components/layout/wishlist-drawer";
import CheckoutModal from "@/components/layout/checkout-modal";
import CompareDrawer from "@/components/layout/compare-drawer";
import CompareBar from "@/components/layout/compare-bar";
import CookieConsent from "@/components/layout/cookie-consent";
import RewardsModal from "@/components/layout/rewards-modal";
import PointsHistoryModal from "@/components/layout/points-history-modal";
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
import { RecentlyViewed } from "@/components/sections/recently-viewed";
import { DealOfTheDay } from "@/components/sections/deal-of-the-day";
import { AllProducts } from "@/components/sections/all-products";
import { WhyChooseUs, Testimonials, AffiliateCTA } from "@/components/sections/why-testimonials";
import { BlogPosts, Newsletter } from "@/components/sections/blog-newsletter";
import LiveActivityTicker from "@/components/sections/live-activity-ticker";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Top-of-page chrome (above header) */}
      <ScrollProgress />
      <PromoBar />
      <SiteHeader />
      <main className="flex-1 pb-24 lg:pb-0">
        {/* 1. Hero */}
        <Hero />
        {/* Live activity ticker (social proof marquee) */}
        <LiveActivityTicker />
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
        {/* Deal of the Day spotlight */}
        <DealOfTheDay />
        {/* 7. Best Sellers */}
        <BestSellers />
        {/* Recently viewed (auto-populated on Quick View; hidden until first view) */}
        <RecentlyViewed />
        {/* 8. AI Tools */}
        <AiTools />
        {/* 9. Free Tools */}
        <FreeTools />
        {/* 10. Bundles */}
        <Bundles />
        {/* All Products browse grid (full catalog with filter/sort) */}
        <AllProducts />
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
      <WishlistDrawer />
      <CompareDrawer />
      <SearchModal />
      <QuickViewModal />
      <CheckoutModal />
      <MobileNav />
      <BackToTop />
      <CompareBar />
      <SocialProofToast />
      <CookieConsent />
      <RewardsModal />
      <PointsHistoryModal />
    </div>
  );
}
