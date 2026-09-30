"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";

import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";
import { cn } from "@/lib/utils";

const STEPS = [
  { name: "Proposal", ask: "with its reason" },
  { name: "Validation", ask: "is it well formed?" },
  { name: "Permission", ask: "is it allowed?" },
  { name: "Impact", ask: "what depends on it?" },
  { name: "Conflict", ask: "does it collide?" },
  { name: "Tacit risk", ask: "is it safe right now?" },
  { name: "Execute", ask: "with a way back" },
];

const HUMAN_AFTER = "Tacit risk";

export function Safeguards() {
  return (
    <section
      id="safeguards"
      data-surface="ink"
      aria-labelledby="safeguards-title"
      className="section-y relative scroll-mt-[var(--nav-h)] bg-ink text-chalk"
    >
      <div className="frame">
        <SectionHead
          id="safeguards-title"
          surface="ink"
          label="Safeguards"
          note="The idea our name comes from"
          title={
            <>
              Every action <span className="type-voice">asks first.</span>
            </>
          }
          lede="Nothing the agents decide runs directly. Each proposal passes the same seven checks, in order, and the more an action could cost, the more it has to prove."
        />

        <Rise as="figure" className="mt-[clamp(64px,8vw,120px)]">
          <Pipeline className="hidden lg:block" />
          <PipelineList className="lg:hidden" />
          <figcaption className="mt-14 grid grid-cols-12 gap-x-6 gap-y-4 border-t border-chalk/14 pt-6">
            <div className="col-span-12 lg:col-span-4">
              <p className="type-caption text-chalk/50">Fig. 4</p>
              <p className="type-title mt-3">Seven checks, then a way back</p>
            </div>
            <p className="type-body col-span-12 max-w-[34em] text-chalk/62 lg:col-span-6 lg:col-start-7">
              Rate limiting passes quickly. Isolating a node must first show which services depend on
              it and where their traffic will go. Cluster-wide changes meet the strictest standard of
              all, including a person’s sign-off wherever you require one. Every action runs with an
              ID, a lock on what it touches, and a way back.
            </p>
          </figcaption>
        </Rise>
      </div>
    </section>
  );
}

const W = 1200;
const LINE_Y = 132;
const X0 = 44;
const X1 = W - 44;
const xs = STEPS.map((_, i) => X0 + (i * (X1 - X0)) / (STEPS.length - 1));

function Pipeline({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const hi = STEPS.findIndex((s) => s.name === HUMAN_AFTER);
  const a = xs[hi];
  const b = xs[hi + 1];
  const dip = LINE_Y + 110;
  const person = { x: (a + b) / 2, y: LINE_Y + (dip - LINE_Y) * 0.75 };

  return (
    <svg
      viewBox={`0 0 ${W} 310`}
      className={cn("h-auto w-full overflow-visible", className)}
      role="img"
      aria-label="Seven checks in order: proposal, validation, permission, impact, conflict, Tacit risk and execute. Critical actions take a branch through a person's approval before they execute."
    >
      <line x1={X0} y1={LINE_Y} x2={X1} y2={LINE_Y} stroke="var(--chalk)" strokeOpacity={0.3} strokeWidth={1} />
      <path
        d={`M${a} ${LINE_Y} C${a} ${dip} ${b} ${dip} ${b} ${LINE_Y}`}
        fill="none"
        stroke="var(--chalk)"
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      {reduce ? null : (
        <motion.circle
          cy={LINE_Y}
          r={3}
          fill="var(--chalk)"
          initial={{ cx: X0 }}
          animate={{ cx: X1 }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity, repeatDelay: 1.2 }}
        />
      )}

      {STEPS.map((s, i) => {
        const last = i === STEPS.length - 1;
        const anchor = i === 0 ? "start" : last ? "end" : "middle";
        const tx = i === 0 ? xs[i] - 6 : last ? xs[i] + 6 : xs[i];
        return (
          <g key={s.name}>
            <text x={tx} y={LINE_Y - 58} textAnchor={anchor} className="font-sans" fontSize={17} fontWeight={500} fill="var(--chalk)">
              {s.name}
            </text>
            <text x={tx} y={LINE_Y - 34} textAnchor={anchor} className="font-mono" fontSize={11.5} fill="var(--chalk)" fillOpacity={0.5}>
              {s.ask}
            </text>
            <circle
              cx={xs[i]}
              cy={LINE_Y}
              r={last ? 6.5 : 5}
              fill={last ? "var(--chalk)" : "var(--ink)"}
              stroke="var(--chalk)"
              strokeOpacity={last ? 1 : 0.7}
              strokeWidth={1}
            />
          </g>
        );
      })}

      <circle cx={person.x} cy={person.y} r={5} fill="var(--ink)" stroke="var(--alert)" strokeWidth={1.25} />
      <text x={person.x} y={person.y + 42} textAnchor="middle" className="font-serif" fontStyle="italic" fontSize={26} fontWeight={300} fill="var(--chalk)">
        A person’s yes
      </text>
      <text x={person.x} y={person.y + 64} textAnchor="middle" className="font-mono" fontSize={11.5} fill="var(--chalk)" fillOpacity={0.5}>
        when the stakes are critical
      </text>
    </svg>
  );
}

function PipelineList({ className }: { className?: string }) {
  return (
    <ol className={cn("relative ml-[5px] border-l border-chalk/25", className)}>
      {STEPS.map((s, i) => {
        const last = i === STEPS.length - 1;
        return (
          <Fragment key={s.name}>
            <li className="relative pb-8 pl-8 last:pb-0">
              <span
                aria-hidden
                className={cn(
                  "absolute top-[0.5em] -left-[6px] size-[11px] rounded-full border border-chalk/70",
                  last ? "bg-chalk" : "bg-ink",
                )}
              />
              <p className="type-title">{s.name}</p>
              <p className="type-mono mt-1 text-chalk/50">{s.ask}</p>
            </li>
            {s.name === HUMAN_AFTER ? (
              <li className="relative pb-8 pl-8">
                <div className="border-l border-dashed border-alert/70 py-1 pl-5">
                  <p className="font-serif text-[1.5rem] leading-tight font-light italic">A person’s yes</p>
                  <p className="type-mono mt-1 text-chalk/50">when the stakes are critical</p>
                </div>
              </li>
            ) : null}
          </Fragment>
        );
      })}
    </ol>
  );
}
