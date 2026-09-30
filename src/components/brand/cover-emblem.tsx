"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";
import type { Ref } from "react";

import { CAMELLIA_SILHOUETTE, CAMELLIA_STROKES, CAMELLIA_VIEWBOX } from "./logo-paths";

const SLOW = [0.16, 1, 0.3, 1] as const;
const INK_EASE = [0.65, 0, 0.35, 1] as const;

/** Highest point of each stroke, 0 at the crown and 1 at the foot, so light can travel down the petals. */
const STROKE_TOP = CAMELLIA_STROKES.map((s) => {
  const n = s.d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  let top: number = CAMELLIA_VIEWBOX.height;
  for (let i = 1; i < n.length; i += 2) top = Math.min(top, n[i]);
  return top / CAMELLIA_VIEWBOX.height;
});

type CoverEmblemProps = {
  className?: string;
  /** Extra vertical travel driven by scroll. */
  lift?: MotionValue<string>;
  /** The box the horizon shader paints the stone into. */
  ref?: Ref<HTMLDivElement>;
  /** Seconds before the first petal line starts to draw. */
  drawDelay?: number;
};

/**
 * The crisp layer of the cover horizon: the camellia's rim and petal lines, drawn in as the light
 * reaches them. The stone, glow and haze beneath are painted by `HorizonField`.
 */
export function CoverEmblem({ className, lift, ref, drawDelay = 1.6 }: CoverEmblemProps) {
  const reduce = useReducedMotion();
  const { width, height, transform, paths } = CAMELLIA_SILHOUETTE;

  return (
    <motion.div className={className} style={lift ? { y: lift } : undefined} aria-hidden>
      <motion.div
        ref={ref}
        className="relative size-full"
        initial={reduce ? false : { y: "9%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 3.4, delay: 0.1, ease: SLOW }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="relative size-full overflow-visible">
          <defs>
            <radialGradient id="emblem-light" cx="0.5" cy="0" r="0.78">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.42" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
            </radialGradient>
            <mask id="emblem-light-mask" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="url(#emblem-light)" />
            </mask>
          </defs>

          <g mask="url(#emblem-light-mask)" fill="none" stroke="#f6d8b2" strokeLinecap="round" strokeLinejoin="round">
            <g strokeOpacity={0.5}>
              {CAMELLIA_STROKES.map((s, i) => (
                <motion.path
                  key={i}
                  d={s.d}
                  strokeWidth={0.55}
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: drawDelay + STROKE_TOP[i] * 2.6, duration: 1.4 + s.len / 260, ease: INK_EASE },
                    opacity: { delay: drawDelay + STROKE_TOP[i] * 2.6, duration: 0.3 },
                  }}
                />
              ))}
            </g>
            <motion.g
              transform={transform}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.4, delay: 1.2, ease: SLOW }}
            >
              {paths.map((d, i) => (
                <path key={i} d={d} strokeWidth={2.6} strokeOpacity={0.85} />
              ))}
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
