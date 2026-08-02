"use client";

import * as React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Music2,
  Zap,
  ShieldCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/data";

type NavLink = { label: string; href: string };
type SocialLink = { label: string; href: string; Icon: LucideIcon };

const PAYMENT_METHODS = [
  "Visa",
  "Mastercard",
  "PayPal",
  "Stripe",
  "Crypto",
  "bKash",
  "Easypaisa",
] as const;

const COMPANY_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Careers", href: "#careers" },
  { label: "Refund Policy", href: "#refund-policy" },
  { label: "Privacy Policy", href: "#privacy-policy" },
  { label: "Terms & Conditions", href: "#terms" },
];

const SUPPORT_LINKS: NavLink[] = [
  { label: "FAQ", href: "#faq" },
  { label: "Help Center", href: "#help-center" },
  { label: "Track Order", href: "#track-order" },
  { label: "Affiliate Program", href: "#affiliate" },
  { label: "Become a Seller", href: "#become-seller" },
];

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "#facebook", Icon: Facebook },
  { label: "Instagram", href: "#instagram", Icon: Instagram },
  { label: "TikTok", href: "#tiktok", Icon: Music2 },
  { label: "YouTube", href: "#youtube", Icon: Youtube },
  { label: "Discord", href: "#discord", Icon: MessageCircle },
  { label: "WhatsApp", href: "#whatsapp", Icon: MessageCircle },
];

const TRUST_POINTS: { Icon: LucideIcon; text: string }[] = [
  { Icon: Zap, text: "Instant delivery worldwide" },
  { Icon: ShieldCheck, text: "Secure checkout" },
  { Icon: Headphones, text: "24/7 support" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const headingClass =
  "text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground";
const linkClass =
  "text-sm text-muted-foreground hover:text-gold transition-colors";

export default function SiteFooter() {
  const shopLinks: NavLink[] = React.useMemo(
    () => CATEGORIES.map((c) => ({ label: c.name, href: "#categories" })),
    []
  );

  return (
    <footer className="relative mt-auto bg-[#0a0a0a] border-t border-white/[0.06]">
      {/* Premium gradient hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Top trust strip */}
      <div className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground">
            {TRUST_POINTS.map(({ Icon, text }, i) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-gold" />
                <span>{text}</span>
                {i < TRUST_POINTS.length - 1 && (
                  <span aria-hidden className="ml-2 text-white/20">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>

          <ul className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <li key={method}>
                <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {method}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main footer body */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-20">
        {/* Brand block */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-premium ring-1 ring-inset ring-white/15">
              <Image
                src="/playbeat-logo.jpeg"
                alt="Playbeat Digital logo"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Playbeat <span className="text-gradient-gold">Digital</span>
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Premium Marketplace
              </span>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            Premium digital marketplace — instant delivery in 190+ countries.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/70">
            Prices shown in USD · PKR &amp; BDT supported at checkout · Ships
            worldwide.
          </p>
        </motion.div>

        {/* 4 link columns */}
        <motion.nav
          aria-label="Footer navigation"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Company */}
          <motion.section variants={itemVariants}>
            <h2 className={headingClass}>Company</h2>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Support */}
          <motion.section variants={itemVariants}>
            <h2 className={headingClass}>Support</h2>
            <ul className="mt-5 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Shop (generated from CATEGORIES) */}
          <motion.section variants={itemVariants}>
            <h2 className={headingClass}>Shop</h2>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Follow Us */}
          <motion.section variants={itemVariants}>
            <h2 className={headingClass}>Follow Us</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.04] text-muted-foreground transition-colors hover:border-gold hover:bg-gold hover:text-black"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground/70">
              Join 320k+ creators following Playbeat.
            </p>
          </motion.section>
        </motion.nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 Playbeat Digital. All rights reserved.</p>
          <nav aria-label="Legal">
            <ul className="flex items-center gap-2">
              <li>
                <a href="#sitemap" className="hover:text-gold transition-colors">
                  Sitemap
                </a>
              </li>
              <li aria-hidden className="text-white/20">
                ·
              </li>
              <li>
                <a
                  href="#privacy-policy"
                  className="hover:text-gold transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li aria-hidden className="text-white/20">
                ·
              </li>
              <li>
                <a href="#terms" className="hover:text-gold transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </nav>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-danger">♥</span> for digital creators
          </p>
        </div>
      </div>
    </footer>
  );
}
