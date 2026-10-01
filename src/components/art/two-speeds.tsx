"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { Stipple } from "@/components/art/grain";
import { SLOW } from "@/components/site/motion-primitives";

type Geometry = {
  w: number;
  h: number;
  /** The line of time everything stands on. */
  base: number;
  /** First tick of the attack's signal. */
  x0: number;
  /** Where Tacit contains it. */
  xc: number;
  /** Where the agents have verified it closed. */
  xe: number;
  peak: number;
  lift: number;
  ticks: number;
  font: number;
  stages: { t: number; label: string }[];
  systems: readonly [string, string];
  /**
   * The rendered width, in px, the type was drawn for. At other widths the type is held near its
   * drawn size instead of scaling with the drawing, within `hold`.
   */
  setAt: number;
  hold: readonly [number, number];
  /** Narrow screens: titles sit above the drawing on leaders, and end labels hang from the edge. */
  compact?: boolean;
};

const FOUR_STAGES = [
  { t: 0.3, label: "Investigate" },
  { t: 0.5, label: "Isolate" },
  { t: 0.68, label: "Rebuild" },
  { t: 0.86, label: "Verify" },
];

const WIDE: Geometry = {
  w: 1200,
  h: 250,
  base: 200,
  x0: 12,
  xc: 118,
  xe: 1036,
  peak: 112,
  lift: 8,
  ticks: 30,
  font: 11.5,
  stages: FOUR_STAGES,
  systems: ["System 1 · milliseconds", "System 2 · minutes"],
  setAt: 1296,
  hold: [0.85, 1.15],
};

const MEDIUM: Geometry = {
  w: 880,
  h: 262,
  base: 210,
  x0: 8,
  xc: 136,
  xe: 716,
  peak: 104,
  lift: 12,
  ticks: 28,
  font: 12,
  stages: [
    { t: 0.36, label: "Investigate" },
    { t: 0.53, label: "Isolate" },
    { t: 0.7, label: "Rebuild" },
    { t: 0.87, label: "Verify" },
  ],
  systems: ["System 1", "System 2"],
  setAt: 880,
  hold: [0.75, 1.3],
};

const NARROW: Geometry = {
  w: 400,
  h: 300,
  base: 250,
  x0: 4,
  xc: 70,
  xe: 344,
  peak: 100,
  lift: 43,
  ticks: 18,
  font: 12.5,
  stages: [
    { t: 0.62, label: "Rebuild" },
    { t: 0.84, label: "Verify" },
  ],
  systems: ["System 1", "System 2"],
  setAt: 350,
  hold: [0.6, 1.2],
  compact: true,
};

type Bezier = readonly [number, number, number, number];

const DRAW_AT = 1.3;
const DRAW_FOR = 3.6;
const ARC_EASE = [0.45, 0, 0.25, 1] as const;

/** Tacit's side of the axis runs in milliseconds up to containment; the agents' side in seconds after it. */
const CONTAINED_MS = 12;
const VERIFIED_S = 221;

const round = (v: number) => Math.round(v * 100) / 100;

function burst(g: Geometry) {
  const peakAt = Math.round(g.ticks * 0.66);
  const step = (g.xc - 10 - g.x0) / (g.ticks - 1);
  return Array.from({ length: g.ticks }, (_, i) => {
    const grain = 0.55 + 0.45 * Math.abs(Math.sin(i * 12.9898 + 4.1));
    const k =
      i < peakAt
        ? (0.06 + 0.7 * Math.pow(i / peakAt, 2.6)) * grain
        : i === peakAt
          ? 1
          : 0.3 * Math.exp(-(i - peakAt) * 0.8) * grain;
    return { x: round(g.x0 + i * step), h: round(Math.max(3, k * g.peak)), threat: i === peakAt };
  });
}

function arc(g: Geometry) {
  const span = g.xe - g.xc;
  const p = [
    [g.xc, g.base],
    [g.xc + span * 0.05, g.lift],
    [g.xc + span * 0.52, g.lift],
    [g.xe, g.base],
  ] as const;
  const at = (t: number) => {
    const u = 1 - t;
    const x = u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0];
    const y = u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1];
    const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
    const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
    const len = Math.hypot(dx, dy) || 1;
    // The normal on the outside of the arch.
    return { x, y, nx: dy / len, ny: -dx / len };
  };
  const d = `M${p[0].join(" ")} C${p[1].join(" ")} ${p[2].join(" ")} ${p[3].join(" ")}`;
  return { d, at };
}

export function TwoSpeeds({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Figure g={WIDE} className="hidden xl:block" />
      <Figure g={MEDIUM} className="hidden md:block xl:hidden" />
      <Figure g={NARROW} className="md:hidden" />
    </div>
  );
}

/** How much larger than drawn the type must be set for it to read at its intended size. */
function useTypeHold(ref: RefObject<SVGSVGElement | null>, g: Geometry) {
  const [k, setK] = useState(1);
  const [lo, hi] = g.hold;
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = (width: number) => {
      if (width > 0) setK(Math.min(hi, Math.max(lo, round(g.setAt / width))));
    };
    fit(el.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, g.setAt, lo, hi]);
  return k;
}

function Figure({ g, className }: { g: Geometry; className?: string }) {
  const still = !!useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const k = useTypeHold(svgRef, g);
  const uid = useId().replace(/:/g, "");
  const grainId = `arch-stipple-${uid}`;
  const shadeId = `arch-shade-${uid}`;
  const ticks = burst(g);
  const { d, at } = arc(g);
  const apex = at(0.5);
  const burstDone = 0.55 + g.ticks * 0.016;

  const fade = (delay: number, duration = 1.1, to = 1) =>
    still
      ? { style: { opacity: to } }
      : {
          initial: { opacity: 0 },
          animate: { opacity: to },
          transition: { duration, delay, ease: SLOW },
        };

  const draw = (delay: number, duration: number, ease: Bezier = SLOW) =>
    still
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration, delay, ease },
        };

  const type = (size: number) => round(size * k);
  const tech = { className: "font-mono uppercase", fontSize: type(g.font - 1), letterSpacing: "0.08em" } as const;
  const readout = { className: "font-mono tabular-nums", fontSize: type(g.font + 0.5) } as const;
  const title = { className: "font-sans", fontSize: type(g.font + 3), fontWeight: 500, fill: "var(--soot)" } as const;
  const valueY = round(g.base + 13 + 14 * k);
  const tagY = round(valueY + 16 * k);
  const sub = type(18);
  /** Labels set over the stipple are knocked out of it, as a map lifts names off its hatching. */
  const halo = g.compact
    ? {}
    : ({ stroke: "var(--bone)", strokeWidth: type(3.5), strokeLinejoin: "round", paintOrder: "stroke" } as const);
  const breakX = g.xc + 20;
  const msX = (ms: number) => round(g.x0 + (ms / CONTAINED_MS) * (g.xc - g.x0));
  const secondX = (s: number) => round(g.xc + (s / VERIFIED_S) * (g.xe - g.xc));
  const scale = [
    ...Array.from({ length: CONTAINED_MS / 2 + 1 }, (_, i) => ({ x: msX(i * 2), major: i === 0 })),
    ...Array.from({ length: Math.floor(VERIFIED_S / 10) - 1 }, (_, i) => {
      const s = (i + 2) * 10;
      return { x: secondX(s), major: s % 60 === 0 };
    }),
  ];
  const minutes = g.compact ? [60, 120] : [60, 120, 180];
  const redX = ticks.find((t) => t.threat)?.x ?? g.x0;
  const tacitY = g.compact ? 20 : round(g.base - g.peak - 12 - sub - 14 * k);
  const agents = g.compact
    ? { x: round(apex.x), y: 20, anchor: "start" as const }
    : { x: round(apex.x), y: round(apex.y + (g.base - apex.y) * 0.46), anchor: "middle" as const };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${g.w} ${g.h}`}
      className={`h-auto w-full overflow-visible ${className ?? ""}`}
      role="img"
      aria-label="An attack's signal rises and is cut off by Tacit within 12 milliseconds; a long arc follows as the agents investigate, isolate, rebuild and verify, closing the incident at 3 minutes 41 seconds, before the system returns to watching."
    >
      <Stipple id={grainId} color="var(--clay)" frequency={0.8} seed={11} />
      <defs>
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.35" stopColor="#000" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000" stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <motion.path
        d={`${d} Z`}
        fill={`url(#${shadeId})`}
        filter={`url(#${grainId})`}
        {...fade(DRAW_AT + DRAW_FOR * 0.5, 2.6, 0.78)}
      />
      {scale.map((t) => (
        <motion.line
          key={t.x}
          x1={t.x}
          y1={g.base}
          x2={t.x}
          y2={g.base + (t.major ? 7 : 4)}
          stroke={t.major ? "var(--stone)" : "var(--plaster)"}
          strokeWidth={1}
          {...fade(0.3 + (t.x / g.w) * 1.2, 0.6)}
        />
      ))}
      <motion.path
        d={`M0 ${g.base} H${breakX - 4} M${breakX + 4} ${g.base} H${g.xe}`}
        stroke="var(--stone)"
        strokeWidth={1}
        fill="none"
        {...draw(0.2, 1.6)}
      />
      <motion.g {...fade(0.9, 0.6)}>
        {[-4, 4].map((o) => (
          <line key={o} x1={breakX + o - 2.5} y1={g.base + 5} x2={breakX + o + 2.5} y2={g.base - 5} stroke="var(--stone)" strokeWidth={1} />
        ))}
      </motion.g>

      <motion.g {...fade(0.35)}>
        <text x={g.x0} y={tacitY} {...title}>
          Tacit
        </text>
        <text x={g.x0} y={tacitY + sub} {...tech} fill="var(--stone)">
          {g.systems[0]}
        </text>
        {g.compact ? (
          <line x1={redX} y1={tacitY + sub + 12} x2={redX} y2={g.base - g.peak - 8} stroke="var(--stone)" strokeWidth={1} strokeDasharray="1 3" />
        ) : null}
      </motion.g>

      {ticks.map((t, i) => (
        <motion.path
          key={t.x}
          d={`M${t.x} ${g.base} V${round(g.base - t.h)}`}
          stroke={t.threat ? "var(--rubric)" : "var(--indigo)"}
          strokeWidth={t.threat ? 1.6 : 1}
          fill="none"
          {...draw(0.55 + i * 0.016, 0.22, [0.2, 0, 0, 1])}
        />
      ))}
      {g.compact ? null : (
        <motion.text x={redX + 8} y={round(g.base - g.peak + 9)} {...tech} fill="var(--rubric)" {...fade(burstDone - 0.15, 0.6)}>
          Detected
        </motion.text>
      )}

      <motion.circle
        cx={g.xc}
        cy={g.base}
        r={4.5}
        fill="var(--bone)"
        stroke="var(--indigo)"
        strokeWidth={1.25}
        {...fade(burstDone, 0.5)}
      />
      <motion.g {...fade(burstDone + 0.1)}>
        <text x={msX(0)} y={valueY} {...readout} fill="var(--stone)">
          0
        </text>
        <text x={g.xc} y={valueY} textAnchor="middle" {...readout} fill="var(--soot)">
          12 ms
        </text>
        <text x={g.xc} y={tagY} textAnchor="middle" {...tech} fill="var(--indigo)">
          Contained
        </text>
      </motion.g>

      {minutes.map((s) => (
        <motion.text
          key={s}
          x={secondX(s)}
          y={valueY}
          textAnchor="middle"
          {...readout}
          fontSize={type(g.font)}
          fill="var(--stone)"
          {...fade(DRAW_AT + DRAW_FOR * (s / VERIFIED_S) * 0.9, 0.8)}
        >
          {s / 60} min
        </motion.text>
      ))}

      <motion.path d={d} stroke="var(--soot)" strokeWidth={1.25} fill="none" {...draw(DRAW_AT, DRAW_FOR, ARC_EASE)} />

      <motion.g {...fade(DRAW_AT + DRAW_FOR * 0.45, 1.6)}>
        <text x={agents.x} y={agents.y} textAnchor={agents.anchor} {...title} {...halo}>
          The agents
        </text>
        <text x={agents.x} y={agents.y + sub} textAnchor={agents.anchor} {...tech} fill="var(--graphite)" {...halo}>
          {g.systems[1]}
        </text>
        {g.compact ? (
          <line x1={agents.x} y1={agents.y + sub + 12} x2={agents.x} y2={round(apex.y - 8)} stroke="var(--stone)" strokeWidth={1} strokeDasharray="1 3" />
        ) : null}
      </motion.g>

      {g.stages.map((s) => {
        const p = at(s.t);
        const anchor = p.nx < -0.2 ? "end" : p.nx > 0.2 ? "start" : "middle";
        return (
          <motion.g key={s.label} {...fade(DRAW_AT + DRAW_FOR * (0.12 + s.t * 0.8), 0.9)}>
            <circle cx={round(p.x)} cy={round(p.y)} r={2.6} fill="var(--soot)" />
            <text x={round(p.x + p.nx * 14)} y={round(p.y + p.ny * 14 + 4 * k)} textAnchor={anchor} {...tech} fill="var(--graphite)">
              {s.label}
            </text>
          </motion.g>
        );
      })}

      <motion.g {...fade(DRAW_AT + DRAW_FOR - 0.1, 0.8)}>
        <circle cx={g.xe} cy={g.base} r={4.5} fill="var(--soot)" />
        <text x={g.compact ? g.w : g.xe} y={valueY} textAnchor={g.compact ? "end" : "middle"} {...readout} fill="var(--soot)">
          3 min 41 s
        </text>
        <text x={g.compact ? g.w : g.xe} y={tagY} textAnchor={g.compact ? "end" : "middle"} {...tech} fill="var(--clay)">
          Verified
        </text>
      </motion.g>

      <motion.g {...fade(DRAW_AT + DRAW_FOR + 0.3, 1.4)}>
        <path
          d={`M${g.xe + 10} ${g.base} H${g.w}`}
          stroke="var(--stone)"
          strokeWidth={1}
          strokeDasharray="3 7"
          fill="none"
          style={still ? undefined : { animation: "dash-flow 2.4s linear infinite" }}
        />
        {g.compact ? null : (
          <text x={g.w} y={round(g.base - 6 - 8 * k)} textAnchor="end" {...tech} fill="var(--stone)">
            Back to watching
          </text>
        )}
      </motion.g>
    </svg>
  );
}
