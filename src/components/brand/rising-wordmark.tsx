"use client";

import { motion } from "motion/react";

import { SLOW, useStill } from "@/components/site/motion-primitives";

import { Wordmark } from "./camellia-mark";
import { WORDMARK } from "./logo-paths";

/** Left-to-right order of the traced glyphs, from where each path starts. */
const GLYPH_RANK = (() => {
  const xs = WORDMARK.paths.map((d) => Number(d.match(/^M(-?\d+)/)?.[1] ?? 0));
  const sorted = [...xs].sort((a, b) => a - b);
  return xs.map((x) => sorted.indexOf(x));
})();

type RisingWordmarkProps = {
  className?: string;
  trigger?: "mount" | "inView";
  delay?: number;
  /** Seconds between one letter and the next. */
  stagger?: number;
  duration?: number;
  /** Without a title the wordmark is decorative and hidden from assistive tech. */
  title?: string;
};

/** The wordmark set letter by letter, each glyph rising out of the line it stands on. */
export function RisingWordmark({
  className,
  trigger = "inView",
  delay = 0,
  stagger = 0.085,
  duration = 1.9,
  title,
}: RisingWordmarkProps) {
  const still = useStill();
  const { width, height, transform, paths } = WORDMARK;

  if (still) return <Wordmark className={className} title={title} />;

  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown" };

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      initial="hidden"
      {...play}
      viewport={{ once: true, amount: 0.5 }}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((d, i) => (
        <motion.g
          key={i}
          variants={{
            hidden: { y: height * 1.05 },
            shown: { y: 0, transition: { duration, delay: delay + GLYPH_RANK[i] * stagger, ease: SLOW } },
          }}
        >
          <g transform={transform}>
            <path d={d} />
          </g>
        </motion.g>
      ))}
    </motion.svg>
  );
}
