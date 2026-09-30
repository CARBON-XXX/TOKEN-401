"use client";

import { motion, useReducedMotion } from "motion/react";

import { Chip, chipWidth, type GNode } from "@/components/art/figure-kit";
import { Stipple } from "@/components/art/grain";
import { Rise, SLOW } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";

export function Product() {
  return (
    <section id="product" data-surface="bone" aria-labelledby="product-title" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame">
        <SectionHead
          id="product-title"
          label="Our first product"
          note="Distributed autonomous cyber defense"
          title="A reflex that acts at once, and a team that thinks it through."
          lede="It defends a whole cluster in two layers. The first contains an attack in milliseconds. The second takes the time to understand it, repair it and prove that it is gone."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)] grid gap-px border border-plaster bg-plaster lg:grid-cols-2">
          <figure className="bg-bone p-6 sm:p-10">
            <TacitLoop />
            <figcaption className="mt-10 border-t border-plaster pt-6">
              <p className="type-title text-soot">
                Tacit <span className="type-caption ml-2 text-[1rem] text-stone">System 1</span>
              </p>
              <p className="type-body mt-2 max-w-[32em] text-graphite">
                A model of our own that runs beside every workload and never stops deciding. It reads
                processes, credentials, networks and agent activity as they change, and when the risk
                is real it acts: freezing a process, revoking a token, closing a connection.
              </p>
            </figcaption>
          </figure>
          <figure className="bg-bone p-6 sm:p-10">
            <AgentSpine />
            <figcaption className="mt-10 border-t border-plaster pt-6">
              <p className="type-title text-soot">
                The agents <span className="type-caption ml-2 text-[1rem] text-stone">System 2</span>
              </p>
              <p className="type-body mt-2 max-w-[32em] text-graphite">
                Six specialists and a coordinator take the incident from there. They investigate,
                hunt, contain, rebuild and verify, share one incident state, and hold it open until it
                has been shown to be closed.
              </p>
            </figcaption>
          </figure>
        </Rise>
      </div>
    </section>
  );
}

const round = (v: number) => Math.round(v * 100) / 100;

function TacitLoop() {
  const reduce = useReducedMotion();
  const c = { x: 190, y: 176 };
  const r = 112;
  const stations: GNode[] = [
    { id: "State", x: c.x, y: c.y - r },
    { id: "Decision", x: c.x + r, y: c.y },
    { id: "Action", x: c.x, y: c.y + r },
    { id: "New state", x: c.x - r, y: c.y },
  ];

  return (
    <svg
      viewBox="0 0 380 352"
      className="mx-auto h-auto w-full max-w-[460px]"
      role="img"
      aria-label="Tacit's loop: state, decision, action, new state, and round again, continuously."
    >
      <Stipple id="tacit-stipple" color="var(--ochre)" frequency={0.85} seed={8} />
      <defs>
        <radialGradient id="tacit-shade">
          <stop offset="0" stopColor="#000" stopOpacity={0.4} />
          <stop offset="0.55" stopColor="#000" stopOpacity={0.22} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={c.x} cy={c.y} r={78} fill="url(#tacit-shade)" filter="url(#tacit-stipple)" />
      <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="var(--stone)" strokeWidth={1} />
      {[45, 135, 225, 315].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const p = { x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) };
        const t = { x: -Math.sin(a), y: Math.cos(a) };
        const n = { x: Math.cos(a), y: Math.sin(a) };
        const tip = { x: p.x + t.x * 4, y: p.y + t.y * 4 };
        const w1 = { x: p.x - t.x * 3 + n.x * 4, y: p.y - t.y * 3 + n.y * 4 };
        const w2 = { x: p.x - t.x * 3 - n.x * 4, y: p.y - t.y * 3 - n.y * 4 };
        return (
          <path
            key={deg}
            d={`M${round(w1.x)} ${round(w1.y)} L${round(tip.x)} ${round(tip.y)} L${round(w2.x)} ${round(w2.y)}`}
            fill="none"
            stroke="var(--stone)"
            strokeWidth={1}
          />
        );
      })}
      <motion.g
        style={{ originX: `${c.x}px`, originY: `${c.y}px` }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 6, ease: "linear", repeat: Infinity }}
      >
        <circle cx={c.x + r} cy={c.y} r={3.5} fill="var(--soot)" />
      </motion.g>
      {stations.map((n) => (
        <Chip key={n.id} n={n} />
      ))}
      <text x={c.x} y={c.y + 2} textAnchor="middle" className="font-sans" fontSize={22} fontWeight={500} fill="var(--soot)">
        12 ms
      </text>
      <text x={c.x} y={c.y + 22} textAnchor="middle" className="font-mono" fontSize={11} fill="var(--graphite)">
        to contain
      </text>
    </svg>
  );
}

const SPINE_X = 190;
const ROWS = [110, 176, 242];
const PAIRS: [string, string][] = [
  ["Defender", "Investigation"],
  ["Threat Hunter", "Forensics"],
  ["Recovery", "Verification"],
];

function AgentSpine() {
  const reduce = useReducedMotion();
  const top: GNode = { id: "Coordinator", x: SPINE_X, y: 36 };
  const state: GNode = { id: "Incident state", x: SPINE_X, y: 316 };

  const appear = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.9, delay, ease: SLOW },
        };

  return (
    <svg
      viewBox="0 0 380 352"
      className="mx-auto h-auto w-full max-w-[460px]"
      role="img"
      aria-label="The agents: a coordinator above six specialists — defender, investigation, threat hunter, forensics, recovery and verification — all joined to one shared incident state."
    >
      <motion.path
        d={`M${SPINE_X} ${top.y + 15} V${state.y - 15}`}
        stroke="var(--stone)"
        strokeWidth={1}
        fill="none"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, ease: SLOW }}
      />
      {ROWS.map((y, i) => {
        const [l, rt] = PAIRS[i];
        const left: GNode = { id: l, x: 100, y };
        const right: GNode = { id: rt, x: 280, y };
        return (
          <motion.g key={y} {...appear(0.35 + i * 0.22)}>
            <line x1={SPINE_X} y1={y} x2={left.x + chipWidth(l) / 2} y2={y} stroke="var(--stone)" strokeWidth={1} />
            <line x1={SPINE_X} y1={y} x2={right.x - chipWidth(rt) / 2} y2={y} stroke="var(--stone)" strokeWidth={1} />
            <circle cx={SPINE_X} cy={y} r={2.5} fill="var(--soot)" />
            <Chip n={left} />
            <Chip n={right} />
          </motion.g>
        );
      })}
      <Chip n={top} tone="solid" />
      <motion.g {...appear(1.1)}>
        <Chip n={state} tone="earth" />
      </motion.g>
    </svg>
  );
}
