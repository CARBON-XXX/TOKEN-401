import type { ReactNode } from "react";

import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";
import { cn } from "@/lib/utils";

export function Continuity() {
  return (
    <section
      id="continuity"
      data-surface="bone"
      data-time="T+01:48.300"
      data-stage="Provider fails"
      aria-labelledby="continuity-title"
      className="section-y scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <SectionHead
          id="continuity-title"
          time="T+01:48.300"
          stage="Provider fails"
          actor="Cognitive Gateway"
          title="A model fails mid‑incident. Nothing is lost."
          lede="Long incidents meet slow APIs, dropped networks and failing providers. The system expects all three, and carries on through each of them."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)] grid gap-px border border-plaster bg-plaster lg:grid-cols-3">
          <Panel
            index="01"
            title="Cognitive Gateway"
            body="No agent is bound to one model. The gateway routes each task by capability, latency and cost, watches every provider’s health, and fails over through circuit breakers. Critical steps can be hedged across two."
          >
            <Gateway />
          </Panel>
          <Panel
            index="02"
            title="Cognitive Checkpoint"
            body="The incident’s state lives outside any model: facts, hypotheses, actions, outcomes and plan. When a provider drops, the next one continues from the checkpoint instead of starting again."
          >
            <Checkpoint />
          </Panel>
          <Panel
            index="03"
            title="Offline operation"
            body="If every external API is unreachable, Tacit and the local runtime keep containing, preserving evidence and executing approved plans. Deeper reasoning resumes on reconnect."
          >
            <Offline />
          </Panel>
        </Rise>
      </div>
    </section>
  );
}

function Panel({ index, title, body, children }: { index: string; title: string; body: string; children: ReactNode }) {
  return (
    <article className="flex flex-col bg-bone p-6 sm:p-8">
      <span className="type-mono text-stone">{index}</span>
      <div className="mt-6 min-h-[204px]">{children}</div>
      <h3 className="type-title mt-8 border-t border-plaster pt-6 text-soot">{title}</h3>
      <p className="type-body mt-2 text-graphite">{body}</p>
    </article>
  );
}

function Dot({ tone }: { tone: "on" | "off" | "alert" }) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        tone === "on" && "bg-soot",
        tone === "off" && "border border-stone",
        tone === "alert" && "bg-rubric",
      )}
    />
  );
}

const PROVIDERS = [
  { name: "cloud-a", state: "alert", ms: "timeout", note: "circuit open" },
  { name: "local-7b", state: "on", ms: "58 ms", note: "selected" },
  { name: "cloud-b", state: "on", ms: "340 ms", note: "hedge" },
  { name: "cloud-c", state: "on", ms: "410 ms", note: "" },
] as const;

function Gateway() {
  return (
    <div className="type-mono">
      <div className="flex justify-between text-stone">
        <span>task · investigate.reason</span>
        <span>priority 1</span>
      </div>
      <ul className="mt-4 divide-y divide-plaster border-y border-plaster">
        {PROVIDERS.map((p) => (
          <li
            key={p.name}
            className={cn(
              "grid grid-cols-[0.75rem_1fr_4.5rem_5.5rem] items-center gap-2 py-2.5",
              p.note === "selected" ? "text-soot" : "text-graphite",
            )}
          >
            <Dot tone={p.state} />
            <span>{p.name}</span>
            <span className="text-right">{p.ms}</span>
            <span className={cn("text-right", p.state === "alert" ? "text-rubric" : "text-stone")}>{p.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Checkpoint() {
  const rows: { name: string; detail: string; tone: "alert" | "state" | "on" }[] = [
    { name: "Provider A", detail: "cloud-a · timeout", tone: "alert" },
    { name: "Checkpoint", detail: "14 facts · 3 hypotheses", tone: "state" },
    { name: "Provider B", detail: "local-7b · resumed", tone: "on" },
    { name: "Continue", detail: "plan step 4 of 9", tone: "on" },
  ];
  return (
    <div className="type-mono">
      <div className="flex justify-between text-stone">
        <span>incident state</span>
        <span>model-independent</span>
      </div>
      <ol className="relative mt-4 divide-y divide-plaster border-y border-plaster">
        {rows.map((r) => (
          <li key={r.name} className="grid grid-cols-[0.75rem_1fr_auto] items-center gap-2 py-2.5 text-graphite">
            {r.tone === "state" ? (
              <span className="inline-block size-1.5 bg-soot" />
            ) : (
              <Dot tone={r.tone === "alert" ? "alert" : "on"} />
            )}
            <span className={cn(r.tone === "alert" ? "text-rubric line-through decoration-rubric/40" : "text-soot")}>{r.name}</span>
            <span className="text-stone">{r.detail}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-stone">Provider A → Checkpoint → Provider B → Continue</p>
    </div>
  );
}

function Offline() {
  const rows: [string, string, "on" | "off"][] = [
    ["Tacit", "running", "on"],
    ["Agent runtime", "running", "on"],
    ["Incident state", "local", "on"],
    ["Action executor", "running", "on"],
    ["System 2 reasoning", "on reconnect", "off"],
  ];
  return (
    <div className="type-mono">
      <div className="flex justify-between text-stone">
        <span>external APIs</span>
        <span className="text-rubric">unreachable</span>
      </div>
      <ul className="mt-4 divide-y divide-plaster border-y border-plaster">
        {rows.map(([name, state, tone]) => (
          <li key={name} className="grid grid-cols-[0.75rem_1fr_auto] items-center gap-2 py-2.5 text-graphite">
            <Dot tone={tone} />
            <span className={tone === "on" ? "text-soot" : undefined}>{name}</span>
            <span className="text-stone">{state}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
