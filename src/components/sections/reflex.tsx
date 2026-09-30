"use client";

import { motion, useReducedMotion } from "motion/react";

import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";

const TRAITS = [
  {
    title: "Reads everything, continuously",
    body: "Nodes, networks, processes, accounts, credentials, tokens and AI agent runtimes, scored for risk as they change.",
  },
  {
    title: "Acts in the same moment",
    body: "Ranks the candidate actions and takes the right one: freeze a process, revoke a token, block a connection.",
  },
  {
    title: "Knows what to hand on",
    body: "Decides which incidents need System 2, and keeps defending while the agents reason about them.",
  },
  {
    title: "Never waits on the network",
    body: "Runs on the cluster itself, so it keeps working through API switches and model outages.",
  },
];

const ACTIONS = [
  "process.freeze",
  "process.kill",
  "container.isolate",
  "node.isolate",
  "net.quarantine",
  "conn.block",
  "rate.limit",
  "token.revoke",
  "credential.revoke",
  "account.restrict",
  "tool.disable",
  "agent.freeze",
  "workload.quarantine",
  "traffic.reroute",
];

export function Reflex() {
  return (
    <section
      id="reflex"
      data-surface="bone"
      data-time="T+00:00.012"
      data-stage="Contain"
      aria-labelledby="reflex-title"
      className="section-y scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <SectionHead
          id="reflex-title"
          time="T+00:00.012"
          stage="Contain"
          actor="Tacit · System 1"
          title="Contained before anyone is paged."
          lede="Tacit is System 1: a model of our own that runs beside every workload. It never stops deciding, and when the risk is real it acts at once, instead of filing a ticket."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)] grid gap-px border border-plaster bg-plaster lg:grid-cols-12">
          <div className="flex flex-col items-center justify-center gap-8 bg-bone p-8 sm:p-12 lg:col-span-5">
            <ReflexLoop />
            <p className="type-mono text-center text-stone">State → Decision → Action → New state → Decision</p>
          </div>
          <div className="grid gap-px sm:grid-cols-2 lg:col-span-7">
            {TRAITS.map((t, i) => (
              <div key={t.title} className="bg-bone p-6 sm:p-8">
                <span className="type-mono text-stone">{String(i + 1).padStart(2, "0")}</span>
                <p className="type-title mt-10 text-soot">{t.title}</p>
                <p className="type-body mt-2 max-w-[30em] text-graphite">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-bone p-6 sm:p-8 lg:col-span-12">
            <p className="type-label text-stone">What it can do, not merely recommend</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {ACTIONS.map((a) => (
                <li key={a} className="type-mono rounded-[3px] border border-plaster px-2.5 py-1 text-soot">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </section>
  );
}

const LOOP = ["State", "Decision", "Action", "New state"];
const round = (v: number) => Math.round(v * 100) / 100;

function ReflexLoop() {
  const reduce = useReducedMotion();
  const r = 92;
  const c = 130;
  return (
    <div className="relative size-[260px]">
      <svg viewBox="0 0 260 260" className="absolute inset-0 size-full" aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--plaster)" strokeWidth="1" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const l = i % 15 === 0 ? 0 : i % 5 === 0 ? 5 : 2.5;
          return l ? (
            <line
              key={i}
              x1={round(c + Math.cos(a) * (r + 8))}
              y1={round(c + Math.sin(a) * (r + 8))}
              x2={round(c + Math.cos(a) * (r + 8 + l))}
              y2={round(c + Math.sin(a) * (r + 8 + l))}
              stroke="var(--stone)"
              strokeWidth="0.8"
            />
          ) : null;
        })}
        <motion.g
          style={{ originX: `${c}px`, originY: `${c}px` }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
        >
          <circle cx={c} cy={c} r={r} fill="none" stroke="var(--soot)" strokeWidth="1.25" strokeDasharray={`${r * 0.9} ${r * 10}`} />
          <circle cx={c + r} cy={c} r="3.5" fill="var(--soot)" />
        </motion.g>
      </svg>
      {LOOP.map((label, i) => {
        const a = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <span
            key={label}
            className="type-mono absolute -translate-x-1/2 -translate-y-1/2 rounded-[3px] border border-plaster bg-bone px-2 py-1 whitespace-nowrap text-soot"
            style={{ left: round(c + Math.cos(a) * r), top: round(c + Math.sin(a) * r) }}
          >
            {label}
          </span>
        );
      })}
      <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-[2.5rem] leading-none font-medium tracking-[-0.04em] text-soot">ms</span>
        <span className="type-mono mt-1 text-stone">per decision</span>
      </span>
    </div>
  );
}
