"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 2000, bounce: 0 });

  React.useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    return spring.on("change", (latest) => {
      const formatted = latest.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      setDisplay(formatted);
    });
  }, [spring, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
