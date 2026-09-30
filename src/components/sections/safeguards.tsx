import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";
import { cn } from "@/lib/utils";

const PIPELINE = [
  { name: "Proposal", body: "An agent proposes an action, with its reason." },
  { name: "Validation", body: "Is it well formed, and does it fit the plan?" },
  { name: "Permission", body: "May this agent do this, here, now?" },
  { name: "Impact", body: "What depends on it? Read from the service graph." },
  { name: "Conflict", body: "Does it collide with another agent’s work?" },
  { name: "Tacit risk", body: "A last machine-speed check on the live state." },
  { name: "Execute", body: "Run with an action ID, a lock and a way back." },
];

const TIERS = [
  { level: "Low", examples: ["Rate limiting"], n: 1 },
  { level: "Medium", examples: ["Token revocation"], n: 2 },
  { level: "High", examples: ["Node isolation"], n: 3 },
  { level: "Critical", examples: ["Cluster-wide changes", "Database shutdown", "Mass credential rotation"], n: 4 },
];

const RECORD: [string, string][] = [
  ["action", "node.isolate  node-3"],
  ["proposed by", "Defender · INC-2F9C"],
  ["validation", "passed"],
  ["permission", "passed · scope prod/eu-2"],
  ["impact", "2 services · 3 of 4 replicas healthy"],
  ["reroute", "checkout → node-5, node-8"],
  ["conflict", "none · lock acquired"],
  ["tacit risk", "0.12"],
];

const AGENT_SECURITY = [
  "Prompt-injection detection",
  "Tool-call risk analysis",
  "Malicious tool-output detection",
  "Inter-agent authentication",
  "Tool allowlists",
  "Permission boundaries",
  "Compromised-agent isolation",
];

export function Safeguards() {
  return (
    <section
      id="safeguards"
      data-surface="ink"
      data-time="T+00:02.140"
      data-stage="Propose"
      aria-labelledby="safeguards-title"
      className="section-y scroll-mt-[var(--nav-h)] bg-ink text-chalk"
    >
      <div className="frame">
        <SectionHead
          id="safeguards-title"
          surface="ink"
          time="T+00:02.140"
          stage="Propose"
          actor="Defender → Validation"
          title={
            <>
              Every action <span className="type-voice">asks first.</span>
            </>
          }
          lede="Nothing the agents decide runs directly. Each proposal passes the same seven checks, and the higher its risk, the more it has to prove. It is the idea our name comes from, built into the product."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)]">
          <ol className="relative grid gap-px overflow-hidden border border-chalk/12 bg-chalk/12 sm:grid-cols-2 lg:grid-cols-7">
            {PIPELINE.map((s, i) => (
              <li
                key={s.name}
                className={cn(
                  "relative bg-ink p-5 lg:min-h-[208px]",
                  i === PIPELINE.length - 1 && "bg-chalk text-ink sm:col-span-2 lg:col-span-1",
                )}
              >
                <span className={cn("type-mono", i === PIPELINE.length - 1 ? "text-ink/50" : "text-chalk/40")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-title mt-8">{s.name}</p>
                <p className={cn("type-body mt-2 text-[0.9375rem]", i === PIPELINE.length - 1 ? "text-ink/65" : "text-chalk/60")}>
                  {s.body}
                </p>
              </li>
            ))}
            <span
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 hidden h-px w-[14%] bg-gradient-to-r from-transparent via-chalk to-transparent lg:block"
              style={{ animation: "traverse 5.5s cubic-bezier(0.45, 0, 0.2, 1) infinite" }}
            />
          </ol>
        </Rise>

        <div className="mt-px grid gap-px border-x border-b border-chalk/12 bg-chalk/12 lg:grid-cols-12">
          <Rise className="bg-ink p-6 sm:p-8 lg:col-span-7">
            <p className="type-label text-chalk/55">Checks scale with the stakes</p>
            <ul className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-4">
              {TIERS.map((t) => (
                <li key={t.level}>
                  <div className="flex gap-1" aria-hidden>
                    {[1, 2, 3, 4].map((k) => (
                      <span
                        key={k}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          k <= t.n ? (t.level === "Critical" ? "bg-alert" : "bg-chalk") : "bg-chalk/15",
                        )}
                      />
                    ))}
                  </div>
                  <p className="type-title mt-4 text-chalk">{t.level}</p>
                  <ul className="mt-2 space-y-1">
                    {t.examples.map((e) => (
                      <li key={e} className="type-body text-[0.9375rem] text-chalk/60">
                        {e}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="type-body mt-10 max-w-[34em] text-[0.9375rem] text-chalk/60">
              Critical actions meet the strictest standard of all, including a person’s sign-off
              wherever you require one.
            </p>
          </Rise>

          <Rise delay={0.1} className="bg-soot p-6 sm:p-8 lg:col-span-5">
            <div className="type-mono flex items-center justify-between text-chalk/45">
              <span>Action record</span>
              <span>act_7f3a2c</span>
            </div>
            <dl className="mt-6 divide-y divide-chalk/8">
              {RECORD.map(([k, v]) => (
                <div key={k} className="type-mono grid grid-cols-[6.5rem_1fr] gap-3 py-2">
                  <dt className="text-chalk/45">{k}</dt>
                  <dd className="text-chalk/85">{v}</dd>
                </div>
              ))}
              <div className="type-mono grid grid-cols-[6.5rem_1fr] gap-3 pt-3">
                <dt className="text-chalk/45">result</dt>
                <dd className="text-chalk">executed in 31 ms · verifying</dd>
              </div>
            </dl>
          </Rise>
        </div>

        <Rise className="mt-[clamp(72px,8vw,120px)] grid grid-cols-12 gap-x-6 gap-y-6 border-t border-chalk/12 pt-10">
          <div className="col-span-12 lg:col-span-3">
            <p className="type-label text-chalk/55">The defenders are defended</p>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <p className="type-lede max-w-[30em] text-chalk/80">
              A defense made of agents is itself a target, so every agent is watched, authenticated
              and bounded like any other workload.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {AGENT_SECURITY.map((s) => (
                <li key={s} className="type-mono rounded-[3px] border border-chalk/15 px-2.5 py-1 text-chalk/75">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Rise>
      </div>
    </section>
  );
}
