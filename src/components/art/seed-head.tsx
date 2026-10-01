"use client";

import { motion, type Variants } from "motion/react";

import { SLOW, useStill } from "@/components/site/motion-primitives";

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

/** The bezel: one mark per workload, in step with the lines, every tenth drawn long. */
const DIAL_R = 194;
const DIAL = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  const long = i % 10 === 0;
  const r0 = DIAL_R - (long ? 8 : 4);
  return {
    d: `M${round(C.x + Math.cos(a) * r0)} ${round(C.y + Math.sin(a) * r0)} L${round(C.x + Math.cos(a) * DIAL_R)} ${round(C.y + Math.sin(a) * DIAL_R)}`,
    long,
    acted: i === ACTED,
  };
});

const bezel: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 1.4, delay: 0.2, ease: SLOW } },
};

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
  const still = useStill();
  const acted = LINES[ACTED];
  const along = (r: number) => ({ x: round(C.x + acted.dir.x * r), y: round(C.y + acted.dir.y * r) });
  const from = { x: round(acted.tip.x + acted.dir.x * 6), y: round(acted.tip.y + acted.dir.y * 6) };
  const elbow = along(DIAL_R + 12);
  const label = { x: elbow.x + 14, y: elbow.y };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="Tacit drawn as a seed head: one fine line for every workload it watches, one of them in red where it has acted within 12 milliseconds."
    >
      <Stipple id="seed-stipple" color="var(--indigo)" frequency={0.9} seed={21} />
      <defs>
        <radialGradient id="seed-shade" cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#000" stopOpacity={0.2} />
          <stop offset="1" stopColor="#000" stopOpacity={0.5} />
        </radialGradient>
      </defs>

      <motion.g key={String(still)} initial={still ? false : "hidden"} whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
        <motion.g variants={bezel} fill="none" strokeWidth={0.75}>
          {DIAL.map((t, i) => (
            <path
              key={i}
              d={t.d}
              stroke={t.acted ? "var(--rubric)" : t.long ? "var(--stone)" : "var(--plaster)"}
              strokeWidth={t.acted ? 1.1 : undefined}
            />
          ))}
        </motion.g>
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
        <motion.g variants={late}>
          <path
            d={`M${from.x} ${from.y} L${elbow.x} ${elbow.y} H${label.x - 5}`}
            fill="none"
            stroke="var(--rubric)"
            strokeWidth={0.75}
          />
          <text x={label.x} y={label.y - 3} className="font-mono tabular-nums" fontSize={12} fill="var(--soot)">
            12 ms
          </text>
          <text x={label.x} y={label.y + 12} className="font-mono uppercase" fontSize={10.5} letterSpacing="0.08em" fill="var(--rubric)">
            Acted on
          </text>
        </motion.g>
      </motion.g>
    </svg>
  );
}
