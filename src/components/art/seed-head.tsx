"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { SLOW } from "@/components/site/motion-primitives";

import { Stipple } from "./grain";
import { grain, round } from "./organic";

const W = 440;
const H = 420;
const C = { x: 220, y: 210 };
const N = 150;
const ACTED = 13;

/** One fine line for each workload Tacit watches, radiating like a seed head. */
const LINES = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2 + (grain(i, 1) - 0.5) * 0.03;
  const acted = i === ACTED;
  const r0 = 26 + grain(i, 2) * 7;
  const r1 =
    126 +
    11 * Math.sin(3 * a + 0.6) +
    8 * Math.sin(2 * a + 1.3) +
    6 * Math.sin(8 * a + 2) +
    (grain(i, 3) - 0.5) * 16 +
    (acted ? 18 : 0);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  return {
    d: `M${round(C.x + dx * r0)} ${round(C.y + dy * r0)} L${round(C.x + dx * r1)} ${round(C.y + dy * r1)}`,
    tip: { x: round(C.x + dx * r1), y: round(C.y + dy * r1) },
    dir: { x: dx, y: dy },
    delay: grain(i, 4) * 0.4,
    acted,
  };
});

const line: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: (delay: number) => ({ pathLength: 1, opacity: 1, transition: { duration: 0.55, delay, ease: SLOW } }),
};

const dot: Variants = {
  hidden: { opacity: 0 },
  shown: (delay: number) => ({ opacity: 1, transition: { duration: 0.4, delay: delay + 0.4, ease: SLOW } }),
};

const late: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 1.2, delay: 0.9, ease: SLOW } },
};

export function SeedHead({ className }: { className?: string }) {
  const still = !!useReducedMotion();
  const acted = LINES[ACTED];
  const label = {
    x: round(acted.tip.x + acted.dir.x * 12),
    y: round(acted.tip.y + acted.dir.y * 12 + 4),
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="Tacit drawn as a seed head: one fine line for every workload it watches, one of them in red where it has acted within 12 milliseconds."
    >
      <Stipple id="seed-stipple" color="var(--clay)" frequency={0.9} seed={21} />
      <defs>
        <radialGradient id="seed-shade" cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#000" stopOpacity={0.2} />
          <stop offset="1" stopColor="#000" stopOpacity={0.5} />
        </radialGradient>
      </defs>

      <motion.g initial={still ? false : "hidden"} whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
        <motion.g variants={late}>
          <circle cx={C.x} cy={C.y} r={21} fill="url(#seed-shade)" filter="url(#seed-stipple)" />
          <circle cx={C.x} cy={C.y} r={21} fill="none" stroke="var(--soot)" strokeOpacity={0.7} strokeWidth={0.9} />
        </motion.g>
        {LINES.map((l, i) => (
          <g key={i}>
            <motion.path
              d={l.d}
              stroke={l.acted ? "var(--rubric)" : "var(--soot)"}
              strokeOpacity={l.acted ? 1 : 0.78}
              strokeWidth={l.acted ? 1.3 : 0.75}
              fill="none"
              custom={l.delay}
              variants={line}
            />
            <motion.circle
              cx={l.tip.x}
              cy={l.tip.y}
              r={l.acted ? 2.6 : 1.3}
              fill={l.acted ? "var(--rubric)" : "var(--soot)"}
              custom={l.delay}
              variants={dot}
            />
          </g>
        ))}
        <motion.text x={label.x} y={label.y} className="font-mono" fontSize={11.5} fill="var(--rubric)" variants={late}>
          acted on · 12 ms
        </motion.text>
      </motion.g>
    </svg>
  );
}
