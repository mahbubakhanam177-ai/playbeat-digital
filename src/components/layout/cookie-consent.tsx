"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { POINT_REWARDS } from "@/lib/loyalty";

/**
 * GDPR-style cookie consent banner. Appears on first visit (before consent
 * is recorded). Persists the choice. Three options: Accept all, Essential
 * only, Reject. Accepting awards loyalty points as a small engagement bonus.
 */
export default function CookieConsent() {
  const cookieConsent = useStore((s) => s.cookieConsent);
  const setCookieConsent = useStore((s) => s.setCookieConsent);
  const addPoints = useStore((s) => s.addPoints);
  const [mounted, setMounted] = React.useState(false);

  // Avoid SSR flash — only show after mount (persisted state hydrates client-side).
  React.useEffect(() => setMounted(true), []);

  const handleChoice = (choice: "accepted" | "essential") => {
    setCookieConsent(choice);
    if (choice === "accepted") {
      addPoints(POINT_REWARDS.newsletter, "cookie consent");
    }
  };

  const visible = mounted && cookieConsent === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.8 }}
          className="fixed bottom-4 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
        >
          <div className="glass-strong overflow-hidden rounded-2xl border border-white/[0.1] shadow-premium">
            {/* gold top hairline */}
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              {/* Icon */}
              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center">
                <span className="grid size-11 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/25">
                  <Cookie className="size-5.5" />
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">
                  We value your privacy
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Playbeat Digital uses cookies to enhance your browsing experience,
                  personalize content, and analyze traffic. Choose what you&apos;re
                  comfortable with.{" "}
                  <button className="font-medium text-gold underline-offset-2 hover:underline">
                    Read our Privacy Policy
                  </button>
                </p>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleChoice("accepted")}
                    className="h-8 gap-1.5 bg-gold text-xs font-semibold text-black hover:bg-gold/90"
                  >
                    <Check className="size-3.5" />
                    Accept all
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleChoice("essential")}
                    className="h-8 gap-1.5 border-white/[0.1] bg-white/[0.03] text-xs text-white hover:bg-white/[0.06]"
                  >
                    <ShieldCheck className="size-3.5" />
                    Essential only
                  </Button>
                </div>

                {/* trust line */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-3 text-success" />
                  Your choice is stored locally and never shared.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
