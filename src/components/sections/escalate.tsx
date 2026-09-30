"use client";

import { motion, useReducedMotion } from "motion/react";

import { Rise, SLOW } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";
import { cn } from "@/lib/utils";

const HYPOTHESES = [
  { text: "Stolen CI token, moving laterally", p: 0.74 },
  { text: "Misconfigured service account", p: 0.18 },
  { text: "Benign automation", p: 0.08 },
];

const WORK = [
  "Investigates and correlates evidence across nodes",
  "Holds competing hypotheses and revises them",
  "Chooses its own next investigation task",
  "Predicts what the attacker will try next",
  "Weighs defense strategies by effect and business cost",
  "Writes containment, remediation and recovery plans",
  "Finds the root cause and traces it back",
  "Replans when the situation changes",
];

const AGENTS = [
  { name: "Defender", role: "Handles the active attack: containment, node isolation, credential revocation, tool restriction.", acts: "node.isolate · token.revoke" },
  { name: "Investigation", role: "Collects and correlates evidence, tests hypotheses and sets the scope of the compromise.", acts: "evidence.collect · scope" },
  { name: "Threat Hunter", role: "Looks for what has not surfaced yet: lateral movement, hidden footholds, unusual credential use.", acts: "hunt.lateral · hunt.persist" },
  { name: "Forensics", role: "Reconstructs the entry point, timeline, privilege escalation and the complete attack path.", acts: "timeline · attack.path" },
  { name: "Recovery", role: "Rebuilds from a trusted state: rotates credentials, restores configuration, redeploys clean instances.", acts: "rotate · redeploy" },
  { name: "Verification", role: "Confirms the attack has stopped, no persistence remains and services are healthy again.", acts: "verify.path · health" },
  { name: "Coordinator", role: "Holds the cluster-wide view: assigns tasks, synchronises nodes and resolves conflicts between agents.", acts: "assign · lock · sync" },
];

const SCALE = [
  { level: "Normal", team: "Tacit + Coordinator" },
  { level: "Standard", team: "+ Defender" },
  { level: "Complex", team: "+ Investigation, Hunter" },
  { level: "Major", team: "+ Defenders, Forensics, Recovery, Verification" },
];

export function Escalate() {
  return (
    <section
      id="escalate"
      data-surface="bone"
      data-time="T+00:00.400"
      data-stage="Escalate"
      aria-labelledby="escalate-title"
      className="pb-[clamp(96px,11vw,168px)] scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <SectionHead
          id="escalate-title"
          time="T+00:00.400"
          stage="Escalate"
          actor="Coordinator · System 2"
          title="Then the thinking starts."
          lede="System 2 is a team of specialised agents. They investigate, weigh competing explanations and plan the response while Tacit holds the line. They do not advise; they own the incident until it is resolved."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)] grid gap-px border border-plaster bg-plaster lg:grid-cols-12">
          <div className="bg-bone p-6 sm:p-10 lg:col-span-5">
            <Hypotheses />
          </div>
          <div className="bg-bone p-6 sm:p-10 lg:col-span-7">
            <p className="type-label text-stone">What System 2 does</p>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {WORK.map((w) => (
                <li key={w} className="type-body border-t border-plaster py-3 text-soot">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </Rise>

        <div className="mt-[clamp(72px,8vw,120px)] flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="type-display-2 max-w-[16em] text-soot">Seven specialists, one shared incident.</h3>
          <p className="type-ui max-w-[26em] text-graphite">
            Agents join as an incident grows and are released when it closes.
          </p>
        </div>

        <ul className="mt-10 grid gap-px border border-plaster bg-plaster sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((a, i) => (
            <Rise as="li" key={a.name} delay={(i % 4) * 0.05} className="flex flex-col bg-bone p-6">
              <span className="type-mono text-stone">A{i + 1}</span>
              <p className="type-title mt-8 text-soot">{a.name}</p>
              <p className="type-body mt-2 mb-8 text-graphite">{a.role}</p>
              <p className="type-mono mt-auto text-stone">{a.acts}</p>
            </Rise>
          ))}
          <Rise as="li" delay={0.15} className="flex flex-col bg-soot p-6 text-chalk">
            <span className="type-mono text-chalk/50">Scaling</span>
            <p className="type-title mt-8">Sized to the incident</p>
            <dl className="mt-5 space-y-3">
              {SCALE.map((s) => (
                <div key={s.level} className="grid grid-cols-[4.75rem_1fr] gap-3">
                  <dt className="type-mono text-chalk/50">{s.level}</dt>
                  <dd className="type-mono text-chalk/85">{s.team}</dd>
                </div>
              ))}
            </dl>
          </Rise>
        </ul>
      </div>
    </section>
  );
}

function Hypotheses() {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="type-mono flex justify-between text-stone">
        <span>Open hypotheses · INC-2F9C</span>
        <span>Confidence</span>
      </div>
      <ul className="mt-8 space-y-6">
        {HYPOTHESES.map((h, i) => (
          <li key={h.text}>
            <div className="flex items-baseline justify-between gap-4">
              <span className={cn("type-ui", i === 0 ? "text-soot" : "text-graphite")}>{h.text}</span>
              <span className="type-mono text-stone">{h.p.toFixed(2)}</span>
            </div>
            <div className="mt-2.5 h-[3px] bg-plaster">
              <motion.div
                className={cn("h-full origin-left", i === 0 ? "bg-soot" : "bg-stone")}
                style={{ width: `${h.p * 100}%` }}
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: SLOW }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="type-mono mt-10 border-t border-plaster pt-4 text-graphite">
        <p className="text-stone">Next task</p>
        <p className="mt-1">Threat Hunter · search the cluster for reuse of ci-deploy-07</p>
      </div>
    </div>
  );
}
