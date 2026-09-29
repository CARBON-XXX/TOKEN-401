"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { CAMELLIA_STROKES, CAMELLIA_VIEWBOX } from "./logo-paths";

const MAX_R = Math.max(...CAMELLIA_STROKES.map((s) => s.r));
const INK_EASE = [0.65, 0, 0.35, 1] as const;

type BloomTiming = { delay: number; duration: number };

function strokeTiming(r: number, len: number, spread: number): BloomTiming {
  return {
    delay: Math.pow(r / MAX_R, 0.85) * spread,
    duration: 0.9 + len / 240,
  };
}

/** Seconds until the last petal finishes drawing, for a given spread. */
export function bloomDuration(spread = 1.9) {
  return Math.max(
    ...CAMELLIA_STROKES.map((s) => {
      const t = strokeTiming(s.r, s.len, spread);
      return t.delay + t.duration;
    }),
  );
}

const strokeVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  drawn: (t: BloomTiming) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: t.delay, duration: t.duration, ease: INK_EASE },
      opacity: { delay: t.delay, duration: 0.25 },
    },
  }),
};

type CamelliaBloomProps = {
  className?: string;
  /** Stroke width in viewBox units (the bloom is 317 units wide). */
  strokeWidth?: number;
  delay?: number;
  /** Time between the first (innermost) and last (outermost) stroke starting. */
  spread?: number;
  trigger?: "mount" | "inView";
  title?: string;
};

export function CamelliaBloom({
  className,
  strokeWidth = 1.4,
  delay = 0,
  spread = 1.9,
  trigger = "mount",
  title,
}: CamelliaBloomProps) {
  const reduce = useReducedMotion();
  const svgProps = {
    viewBox: `0 0 ${CAMELLIA_VIEWBOX.width} ${CAMELLIA_VIEWBOX.height}`,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    role: title ? "img" : undefined,
    "aria-hidden": title ? undefined : true,
  };

  if (reduce) {
    return (
      <svg {...svgProps}>
        {title ? <title>{title}</title> : null}
        {CAMELLIA_STROKES.map((s, i) => (
          <path key={i} d={s.d} />
        ))}
      </svg>
    );
  }

  const play = trigger === "mount" ? { animate: "drawn" } : { whileInView: "drawn" };

  return (
    <motion.svg
      {...svgProps}
      initial="hidden"
      {...play}
      viewport={{ once: true, amount: 0.35 }}
    >
      {title ? <title>{title}</title> : null}
      {CAMELLIA_STROKES.map((s, i) => {
        const t = strokeTiming(s.r, s.len, spread);
        return (
          <motion.path
            key={i}
            d={s.d}
            variants={strokeVariants}
            custom={{ delay: delay + t.delay, duration: t.duration }}
          />
        );
      })}
    </motion.svg>
  );
}
