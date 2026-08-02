"use client";

/* ------------------------------------------------------------------
 * Playbeat Digital — Blog + Newsletter sections
 * Two named exports:
 *   • <BlogPosts />   — magazine layout (featured + 3 small cards)
 *   • <Newsletter />  — conversion band with email capture form
 * Dark premium theme, gold primary accent, framer-motion stagger.
 * ------------------------------------------------------------------ */

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Lock } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import { BLOG_POSTS, type BlogPost } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ----------------------------- Motion ----------------------------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* --------------------------- Author avatar -------------------------- */
/** Small circle with initials on a per-post gradient. */
function AuthorAvatar({
  author,
  gradient,
  className,
}: {
  author: string;
  gradient: string;
  className?: string;
}) {
  const initials = author
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-7 place-items-center rounded-full text-[10px] font-bold text-black ring-1 ring-black/20",
        className
      )}
      style={{ background: gradient }}
    >
      {initials}
    </span>
  );
}

/* --------------------------- Featured card -------------------------- */
function FeaturedCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  return (
    <motion.article
      variants={item}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-premium",
        "lg:col-span-2 lg:h-full",
        className
      )}
    >
      {/* Cover */}
      <div className="relative h-56 overflow-hidden md:h-72 lg:h-80">
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
          style={{ background: post.gradient }}
        />
        {/* readability gradient at the bottom */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent"
        />
        {/* overlaid badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10 backdrop-blur-sm">
            {post.category}
          </span>
        </div>
        <div className="absolute right-4 top-4">
          <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
            {post.readingTime}
          </span>
        </div>
        {/* big emoji */}
        <div
          aria-hidden
          className="absolute bottom-4 left-5 select-none text-6xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] md:text-7xl"
        >
          {post.emoji}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <h3 className="text-2xl font-bold leading-tight tracking-tight text-white transition-colors group-hover:text-gold">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-3">
          <AuthorAvatar author={post.author} gradient={post.gradient} />
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-white">
              {post.author}
            </span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------------------- Small card ---------------------------- */
function SmallCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  return (
    <motion.article
      variants={item}
      className={cn(
        "group flex items-stretch overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141414]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-premium",
        className
      )}
    >
      {/* gradient swatch with emoji */}
      <div
        className="relative grid size-20 shrink-0 place-items-center md:size-24"
        style={{ background: post.gradient }}
        aria-hidden
      >
        <span className="select-none text-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] md:text-4xl">
          {post.emoji}
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        <span className="inline-flex w-fit rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold ring-1 ring-gold/20">
          {post.category}
        </span>
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-gold">
          {post.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.date}</span>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </motion.article>
  );
}

/* ----------------------------- BlogPosts ---------------------------- */
export function BlogPosts() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <section id="blog" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          eyebrow="From the blog"
          title={
            <>
              Latest <span className="text-gradient-gold">articles</span>
            </>
          }
          description="Guides, deals and digital marketplace insights from the Playbeat team."
          action={
            <a
              href="#blog"
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </a>
          }
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 lg:grid-cols-3 lg:items-stretch"
        >
          <FeaturedCard post={featured} />
          <div className="flex flex-col gap-6 lg:col-span-1">
            {rest.map((post) => (
              <SmallCard key={post.id} post={post} className="flex-1" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------- Newsletter ---------------------------- */
const SOCIAL_GRADIENTS = [
  "linear-gradient(135deg, #FFE9A8 0%, #FFD54F 50%, #8A6300 100%)",
  "linear-gradient(135deg, #9CC0FF 0%, #4D8DFF 50%, #0E2A66 100%)",
  "linear-gradient(135deg, #D4B5FF 0%, #6C2BD9 50%, #2B0F5A 100%)",
  "linear-gradient(135deg, #A7F3D0 0%, #4CAF50 50%, #143A18 100%)",
  "linear-gradient(135deg, #FFB3C1 0%, #FF4D6D 50%, #5A0E22 100%)",
];

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section
      aria-label="Newsletter signup"
      className="px-4 py-16 md:px-6 md:py-24"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] p-8 md:p-14">
        {/* gold glow blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 size-[440px] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px] animate-pulse-glow"
        />
        {/* dots overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-dots opacity-40"
        />

        <div className="relative flex flex-col items-center text-center">
          {/* eyebrow pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            Newsletter
          </span>

          {/* headline */}
          <h2 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight text-white">
            Join <span className="text-gradient-gold">Playbeat Digital</span>
          </h2>

          {/* subtext */}
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Get exclusive deals, early access to flash sales and AI tool drops —
            straight to your inbox. No spam, unsubscribe anytime.
          </p>

          {/* form / success */}
          {subscribed ? (
            <div
              role="status"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-success/10 px-5 py-3 text-sm font-semibold text-success ring-1 ring-success/30"
            >
              <Check className="size-4" />
              Subscribed! Check your inbox.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8 w-full max-w-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold/20 sm:flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-black transition-colors hover:bg-gold/90"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}

          {/* privacy note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5" />
            <span>We respect your privacy. Your email is never shared.</span>
          </div>

          {/* social proof */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {SOCIAL_GRADIENTS.map((g, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="size-7 rounded-full ring-2 ring-[#0d0d0d]"
                  style={{ background: g }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              Joined by{" "}
              <span className="font-semibold text-white">320,000+</span>{" "}
              digital creators
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
