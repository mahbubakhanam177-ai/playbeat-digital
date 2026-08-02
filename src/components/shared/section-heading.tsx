"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-8 md:mb-10",
        align === "center" ? "items-center text-center" : "items-start",
        action && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold"
          >
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            {eyebrow}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold tracking-tight text-white"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={cn(
              "text-sm md:text-base text-muted-foreground max-w-2xl",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
