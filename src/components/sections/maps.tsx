import { Chip, CHIP_H, type GNode } from "@/components/art/figure-kit";
import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";

export function Maps() {
  return (
    <section id="maps" data-surface="bone" aria-labelledby="maps-title" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame">
        <SectionHead
          id="maps-title"
          label="Awareness"
          note="Service graph · Threat graph"
          title="It knows what depends on what, and where the attack is heading."
          lede="Two graphs are kept live across the whole cluster, from physical servers to agent tools. One says what an action will cost. The other says where the attacker can go next."
        />

        <Rise className="mt-[clamp(56px,7vw,104px)] grid gap-px border border-plaster bg-plaster lg:grid-cols-2">
          <figure className="bg-bone p-6 sm:p-10">
            <ServiceGraph />
            <figcaption className="mt-10 border-t border-plaster pt-6">
              <p className="type-title text-soot">Service Graph</p>
              <p className="type-body mt-2 max-w-[32em] text-graphite">
                Every dependency, kept current. Before a node is isolated the system knows which
                services it carries, which replicas are healthy, where traffic should move and what
                the action will cost the business.
              </p>
            </figcaption>
          </figure>
          <figure className="bg-bone p-6 sm:p-10">
            <ThreatGraph />
            <figcaption className="mt-10 border-t border-plaster pt-6">
              <p className="type-title text-soot">Threat Graph</p>
              <p className="type-body mt-2 max-w-[32em] text-graphite">
                The attack as it propagates, entity by entity: credentials, processes, agents, tool
                calls and connections. The path is inferred ahead of the attacker, so it can be cut
                where it has not yet reached.
              </p>
            </figcaption>
          </figure>
        </Rise>
      </div>
    </section>
  );
}

const HALF = CHIP_H / 2;

function ServiceGraph() {
  const N: Record<string, GNode> = {
    user: { id: "User", x: 88, y: 32 },
    gw: { id: "API Gateway", x: 88, y: 102 },
    app: { id: "Application", x: 88, y: 172 },
    agent: { id: "AI Agent", x: 292, y: 32 },
    tool: { id: "Tool", x: 292, y: 102 },
    api: { id: "API", x: 292, y: 172 },
    db: { id: "Database", x: 190, y: 250 },
    st: { id: "Storage", x: 190, y: 320 },
  };
  const edges: [string, string][] = [
    ["user", "gw"],
    ["gw", "app"],
    ["app", "db"],
    ["agent", "tool"],
    ["tool", "api"],
    ["api", "db"],
    ["db", "st"],
  ];
  return (
    <svg
      viewBox="0 0 380 352"
      className="mx-auto h-auto w-full max-w-[460px]"
      role="img"
      aria-label="Service graph: user to API gateway to application to database to storage, and AI agent to tool to API to database."
    >
      {edges.map(([a, b]) => (
        <line key={a + b} x1={N[a].x} y1={N[a].y + HALF} x2={N[b].x} y2={N[b].y - HALF} stroke="var(--stone)" strokeWidth={1} />
      ))}
      {Object.values(N).map((n) => (
        <Chip key={n.id} n={n} />
      ))}
    </svg>
  );
}

function ThreatGraph() {
  const chain: GNode[] = [
    { id: "Credential A", x: 110, y: 32 },
    { id: "Node 3", x: 250, y: 90 },
    { id: "Process X", x: 120, y: 148 },
    { id: "Agent Worker", x: 262, y: 206 },
    { id: "Tool Gateway", x: 128, y: 264 },
    { id: "Database", x: 262, y: 322 },
  ];
  const cut = 3;
  const a = chain[cut];
  const b = chain[cut + 1];
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  return (
    <svg
      viewBox="0 0 380 352"
      className="mx-auto h-auto w-full max-w-[460px]"
      role="img"
      aria-label="Threat graph: credential A, node 3, process X and agent worker are compromised; the path to tool gateway and database is cut."
    >
      {chain.slice(0, -1).map((n, i) => {
        const m = chain[i + 1];
        const blocked = i >= cut;
        return (
          <line
            key={n.id}
            x1={n.x}
            y1={n.y + HALF}
            x2={m.x}
            y2={m.y - HALF}
            stroke={blocked ? "var(--plaster)" : "var(--rubric)"}
            strokeWidth={blocked ? 1 : 1.4}
            strokeDasharray={blocked ? "3 4" : "5 5"}
            style={blocked ? undefined : { animation: "dash-flow 1.2s linear infinite" }}
          />
        );
      })}
      {chain.map((n, i) => (
        <Chip key={n.id} n={n} tone={i <= cut ? "threat" : "muted"} />
      ))}
      <circle cx={mx} cy={my} r={9} fill="var(--soot)" />
      <path d={`M${mx - 3.5} ${my - 3.5}l7 7M${mx + 3.5} ${my - 3.5}l-7 7`} stroke="var(--chalk)" strokeWidth={1.4} />
      <text x={mx + 16} y={my + 4} className="font-mono" fontSize={11} fill="var(--graphite)">
        tool.disable · Tacit
      </text>
    </svg>
  );
}
