"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { ClusterField, type IncidentPhase } from "@/components/art/cluster-field";
import { useContact } from "@/components/contact/contact-provider";
import { LogLine } from "@/components/site/log-line";
import { SLOW } from "@/components/site/motion-primitives";
import { ButtonLink, PillButton } from "@/components/site/pill";
import { cn } from "@/lib/utils";

const STEPS: { at: IncidentPhase; label: string; time: string; by: string }[] = [
  { at: "detected", label: "Detected", time: "00:00.000", by: "Tacit" },
  { at: "contained", label: "Contained", time: "00:00.012", by: "Tacit" },
  { at: "recovered", label: "Rebuilt", time: "03:12.406", by: "Recovery" },
  { at: "verified", label: "Verified", time: "03:41.090", by: "Verification" },
];
const ORDER: IncidentPhase[] = ["calm", "detected", "contained", "recovered", "verified"];

export function Hero() {
  const reduce = useReducedMotion();
  const { openContact } = useContact();
  const [phase, setPhase] = useState<IncidentPhase>("calm");

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, delay, ease: SLOW },
        };

  return (
    <section
      id="top"
      data-surface="bone"
      data-time="T+00:00.000"
      data-stage="Perceive"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col pt-[var(--nav-h)]"
    >
      <div className="frame pt-[clamp(24px,4.5vh,64px)]">
        <motion.div {...enter(0)}>
          <LogLine time="T+00:00.000" stage="Perceive · simulated incident" actor="Tacit · 1,284 workloads watched" />
        </motion.div>

        <motion.h1 {...enter(0.1)} id="hero-title" className="type-hero mt-[clamp(28px,5vh,72px)] text-soot">
          <span className="block">Machine reflexes.</span>
          <span className="type-voice block text-graphite">Judgment that asks first.</span>
        </motion.h1>
      </div>

      <div className="relative mt-[clamp(8px,2vh,24px)] flex flex-1 flex-col md:min-h-[420px]">
        <div className="relative min-h-[300px] flex-1 md:absolute md:inset-0 md:min-h-0">
          <ClusterField className="absolute inset-0 size-full" onPhase={setPhase} />
        </div>
        <div className="frame relative -order-1 grid grid-cols-12 gap-x-6 gap-y-6 pt-[clamp(8px,2vh,24px)] md:order-none">
          <motion.p {...enter(0.25)} className="type-lede col-span-12 max-w-[29em] text-graphite md:col-span-7 lg:col-span-5">
            TOKEN/401 builds autonomous cyber defense. Tacit stops an attack in milliseconds; a
            team of agents investigates, repairs and verifies it. Every action is checked before it
            runs.
          </motion.p>
          <motion.div
            {...enter(0.35)}
            className="col-span-12 flex flex-wrap items-end gap-3 md:col-span-5 md:justify-end lg:col-span-7"
          >
            <ButtonLink href="#reflex">Follow an incident</ButtonLink>
            <PillButton tone="outline" arrow={false} className="bg-bone" onClick={() => openContact("Early access")}>
              Request access
            </PillButton>
          </motion.div>
        </div>
      </div>

      <Readout phase={reduce ? "verified" : phase} />
    </section>
  );
}

function Readout({ phase }: { phase: IncidentPhase }) {
  const reached = ORDER.indexOf(phase);
  return (
    <div className="frame" aria-hidden>
      <dl className="grid grid-cols-2 border-t border-soot/20 sm:grid-cols-4">
        {STEPS.map((s, i) => {
          const on = reached > 0 && ORDER.indexOf(s.at) <= reached;
          const live = on && ORDER.indexOf(s.at) === reached;
          return (
            <div
              key={s.at}
              className={cn(
                "py-4 transition-opacity duration-500 sm:py-5",
                i > 0 && "sm:border-l sm:border-soot/10 sm:pl-5",
                i % 2 === 1 && "border-l border-soot/10 pl-4",
                on ? "opacity-100" : "opacity-35",
              )}
            >
              <dt className="type-mono flex items-center gap-2 text-stone">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    live && s.at === "detected" ? "bg-rubric" : on ? "bg-soot" : "border border-stone",
                  )}
                />
                {s.label}
              </dt>
              <dd className="type-mono mt-1.5 flex justify-between gap-3 text-soot">
                <span>{on ? s.time : "--:--.---"}</span>
                <span className="text-stone">{s.by}</span>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
