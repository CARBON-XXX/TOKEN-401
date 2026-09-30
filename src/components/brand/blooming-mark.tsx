"use client";

import { motion } from "motion/react";
import { useId } from "react";

import { useStill } from "@/components/site/motion-primitives";

import { strokeTiming, strokeVariants } from "./camellia-bloom";
import { CamelliaMark } from "./camellia-mark";
import { CAMELLIA_FILL, CAMELLIA_STROKES } from "./logo-paths";

/** Mask pen width in viewBox units. 10 already uncovers every traced line; the rest is margin. */
const PEN = 14;

type BloomingMarkProps = {
  className?: string;
  delay?: number;
  spread?: number;
  pace?: number;
};

/** The filled camellia, inked in along its own centerlines from the heart outward. */
export function BloomingMark({ className, delay = 0, spread = 0.9, pace = 2 }: BloomingMarkProps) {
  const still = useStill();
  const maskId = `bloom-${useId().replace(/[^\w-]/g, "")}`;
  if (still) return <CamelliaMark className={className} />;

  const { width, height, transform, paths } = CAMELLIA_FILL;
  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="currentColor"
      aria-hidden
      initial="hidden"
      animate="drawn"
    >
      <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
        <g fill="none" stroke="#fff" strokeWidth={PEN} strokeLinecap="round" strokeLinejoin="round">
          {CAMELLIA_STROKES.map((s, i) => {
            const t = strokeTiming(s.r, s.len, spread, pace);
            return (
              <motion.path
                key={i}
                d={s.d}
                variants={strokeVariants}
                custom={{ delay: delay + t.delay, duration: t.duration }}
              />
            );
          })}
        </g>
      </mask>
      <g mask={`url(#${maskId})`}>
        <g transform={transform}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </motion.svg>
  );
}
