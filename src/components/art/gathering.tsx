"use client";

import { motion, type Variants } from "motion/react";

import { SLOW, useStill } from "@/components/site/motion-primitives";

import { Stipple } from "./grain";
import { pebblePath, round } from "./organic";

const W = 440;
const H = 420;
const HEART = { x: 222, y: 218 };

type Agent = { name: string; cx: number; cy: number; r: number; seed: number; turn: number; above?: boolean; lead?: boolean };

const AGENTS: Agent[] = [
  { name: "Coordinator", cx: 222, cy: 82, r: 40, seed: 1, turn: 0.2, above: true, lead: true },
  { name: "Investigation", cx: 96, cy: 158, r: 33, seed: 2, turn: -0.4 },
  { name: "Threat Hunter", cx: 352, cy: 150, r: 29, seed: 3, turn: 0.7 },
  { name: "Defender", cx: 84, cy: 290, r: 37, seed: 4, turn: 0.3 },
  { name: "Forensics", cx: 360, cy: 282, r: 28, seed: 5, turn: -0.2 },
  { name: "Recovery", cx: 172, cy: 348, r: 29, seed: 6, turn: 0.9 },
  { name: "Verification", cx: 290, cy: 344, r: 32, seed: 7, turn: -0.6 },
];

const stone: Variants = {
  hidden: { opacity: 0, y: 6 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1.1, delay: i * 0.09, ease: SLOW } }),
};

const thread: Variants = {
  hidden: { pathLength: 0 },
  shown: (i: number) => ({ pathLength: 1, transition: { duration: 1, delay: 0.7 + i * 0.06, ease: SLOW } }),
};

const heart: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 1.2, delay: 1.2, ease: SLOW } },
};

/** Seven specialists as worn stones, gathered around the one incident they share. */
export function Gathering({ className }: { className?: string }) {
  const still = useStill();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="The agents drawn as seven stones — coordinator, investigation, threat hunter, defender, forensics, recovery and verification — gathered around one shared incident."
    >
      <Stipple id="stone-stipple" color="var(--soot)" frequency={0.95} seed={13} />
      <defs>
        <linearGradient id="stone-shade" x1="0.15" y1="0.05" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#000" stopOpacity={0.02} />
          <stop offset="0.55" stopColor="#000" stopOpacity={0.16} />
          <stop offset="1" stopColor="#000" stopOpacity={0.44} />
        </linearGradient>
        <linearGradient id="stone-shade-lead" x1="0.15" y1="0.05" x2="0.85" y2="0.95">
          <stop offset="0" stopColor="#000" stopOpacity={0.14} />
          <stop offset="0.55" stopColor="#000" stopOpacity={0.34} />
          <stop offset="1" stopColor="#000" stopOpacity={0.62} />
        </linearGradient>
      </defs>

      <motion.g key={String(still)} initial={still ? false : "hidden"} whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
        {AGENTS.map((a, i) => {
          const dx = HEART.x - a.cx;
          const dy = HEART.y - a.cy;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          return (
            <motion.path
              key={`t-${a.name}`}
              d={`M${round(a.cx + ux * (a.r + 8))} ${round(a.cy + uy * (a.r + 8))} L${round(HEART.x - ux * 16)} ${round(HEART.y - uy * 16)}`}
              stroke="var(--stone)"
              strokeWidth={1}
              strokeDasharray="1 4"
              strokeLinecap="round"
              fill="none"
              custom={i}
              variants={thread}
            />
          );
        })}

        {AGENTS.map((a, i) => {
          const d = pebblePath({ cx: a.cx, cy: a.cy, r: a.r, seed: a.seed, turn: a.turn });
          return (
            <motion.g key={a.name} custom={i} variants={stone}>
              <path d={d} fill={`url(#${a.lead ? "stone-shade-lead" : "stone-shade"})`} filter="url(#stone-stipple)" />
              <path d={d} fill="none" stroke="var(--soot)" strokeOpacity={0.85} strokeWidth={1} />
              <text
                x={a.cx}
                y={a.above ? a.cy - a.r - 12 : a.cy + a.r + 22}
                textAnchor="middle"
                className="font-serif"
                fontStyle="italic"
                fontSize={15}
                fill="var(--graphite)"
              >
                {a.name}
              </text>
            </motion.g>
          );
        })}

        <motion.g variants={heart}>
          <circle cx={HEART.x} cy={HEART.y} r={10} fill="var(--bone)" stroke="var(--clay)" strokeWidth={1.25} />
          <circle cx={HEART.x} cy={HEART.y} r={2.6} fill="var(--clay)" />
          <text x={HEART.x + 20} y={HEART.y + 4} className="font-serif" fontStyle="italic" fontSize={14} fill="var(--clay)">
            one incident
          </text>
        </motion.g>
      </motion.g>
    </svg>
  );
}
