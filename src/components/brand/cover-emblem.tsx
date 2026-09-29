"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";

import { CAMELLIA_SILHOUETTE, CAMELLIA_STROKES } from "./logo-paths";

const SLOW = [0.16, 1, 0.3, 1] as const;

type CoverEmblemProps = {
  className?: string;
  /** Extra vertical travel driven by scroll, e.g. a transform of scrollYProgress. */
  lift?: MotionValue<string>;
};

/**
 * The camellia as a horizon: a vast, solid emblem rising from the foot of the cover with
 * first light along its crown and the petal drawing faintly visible within, like relief.
 */
export function CoverEmblem({ className, lift }: CoverEmblemProps) {
  const reduce = useReducedMotion();
  const { width, height, transform, paths } = CAMELLIA_SILHOUETTE;
  const silhouette = paths[0];

  return (
    <motion.div className={className} style={lift ? { y: lift } : undefined} aria-hidden>
      <motion.div
        className="relative size-full"
        initial={reduce ? false : { y: "9%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 3.2, delay: 0.2, ease: SLOW }}
      >
        <div className="absolute top-0 left-1/2 aspect-[2/1] w-[74%] -translate-x-1/2 -translate-y-[46%]">
          <motion.div
            className="size-full"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4, delay: 1, ease: SLOW }}
          >
            <div className="absolute inset-0 [animation:breathe_10s_ease-in-out_infinite] bg-[radial-gradient(closest-side,rgba(245,243,238,0.2),rgba(245,243,238,0.07)_45%,transparent)]" />
          </motion.div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="relative size-full overflow-visible">
          <defs>
            <linearGradient id="emblem-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#23211f" />
              <stop offset="0.22" stopColor="#151413" />
              <stop offset="0.6" stopColor="#0f0e0d" />
            </linearGradient>
            <radialGradient id="emblem-rim-fade" cx="0.5" cy="0" r="0.62">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="emblem-rim-mask" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="url(#emblem-rim-fade)" />
            </mask>
            <clipPath id="emblem-clip">
              <path d={silhouette} transform={transform} />
            </clipPath>
            <filter id="emblem-bloom" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          <g transform={transform}>
            <path d={silhouette} fill="url(#emblem-shade)" />
          </g>

          <g clipPath="url(#emblem-clip)" stroke="#f5f3ee" fill="none" strokeLinecap="round">
            <g strokeOpacity="0.08">
              {CAMELLIA_STROKES.map((s, i) => (
                <path key={i} d={s.d} strokeWidth={0.6} />
              ))}
            </g>
            <g mask="url(#emblem-rim-mask)" strokeOpacity="0.34">
              {CAMELLIA_STROKES.map((s, i) => (
                <path key={i} d={s.d} strokeWidth={0.6} />
              ))}
            </g>
          </g>

          <g mask="url(#emblem-rim-mask)" fill="none" stroke="#f5f3ee">
            <g transform={transform}>
              <path d={silhouette} strokeWidth={9} strokeOpacity={0.35} filter="url(#emblem-bloom)" />
              <path d={silhouette} strokeWidth={3.2} strokeOpacity={0.9} />
            </g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
