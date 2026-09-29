"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const INK_EASE = [0.65, 0, 0.35, 1] as const;

export type InkTiming = { delay?: number; duration?: number };

const inkVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  drawn: ({ delay = 0, duration = 2.4 }: InkTiming) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration, ease: INK_EASE },
      opacity: { delay, duration: 0.3 },
    },
  }),
};

type InkSvgProps = {
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  children: ReactNode;
  title?: string;
  /** Portion of the drawing that must be visible before ink starts to flow. */
  amount?: number;
};

/** An SVG whose `InkPath` children draw themselves once, the first time they scroll into view. */
export function InkSvg({
  viewBox,
  className,
  strokeWidth = 1,
  children,
  title,
  amount = 0.4,
}: InkSvgProps) {
  return (
    <motion.svg
      viewBox={viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      whileInView="drawn"
      viewport={{ once: true, amount }}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </motion.svg>
  );
}

type InkPathProps = InkTiming & {
  d: string;
  opacity?: number;
  strokeWidth?: number;
};

export function InkPath({ d, delay, duration, opacity, strokeWidth }: InkPathProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <path d={d} strokeOpacity={opacity} strokeWidth={strokeWidth} />;
  }
  return (
    <motion.path
      d={d}
      strokeOpacity={opacity}
      strokeWidth={strokeWidth}
      variants={inkVariants}
      custom={{ delay, duration }}
    />
  );
}
