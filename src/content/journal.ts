export type JournalKind = "Essay" | "Research" | "Engineering";

export type JournalEntry = {
  slug: string;
  kind: JournalKind;
  title: string;
  dek: string;
  date: string;
  published: string;
  readingTime: string;
  byline: string;
  /** Paragraphs before the pull quote. */
  opening: string[];
  pullQuote: string;
  /** Paragraphs after the pull quote. */
  closing: string[];
};

export const JOURNAL: JournalEntry[] = [
  {
    slug: "two-speeds-of-defense",
    kind: "Research",
    title: "Two speeds of defense",
    dek: "Why an autonomous defender needs a reflex and a mind, and how the two share one incident.",
    date: "16 September 2026",
    published: "2026-09-16",
    readingTime: "Six minutes",
    byline: "From the research team",
    opening: [
      "Attacks do not wait for reasoning. A stolen token can be used within seconds of being taken, and lateral movement across a cluster is measured in minutes. Yet the questions that actually end an incident — where did this start, what else was touched, what is safe to restore — need careful thought, and careful thought takes time.",
      "We stopped trying to make one system do both. Our defense is built in two layers, borrowing the old distinction between fast and slow thinking. The first, Tacit, is a model of our own that runs continuously beside every workload. The second is a team of agents that reasons, plans and carries an incident through to its end.",
    ],
    pullQuote: "The reflex buys time. The reasoning decides what to do with it.",
    closing: [
      "Tacit works in a tight loop: state, decision, action, new state, decision. It scores the risk of processes, credentials, service accounts and agent tool calls as they happen, and when the risk is high enough it acts at once — freezing a process, revoking a token, limiting a connection. Just as importantly, it decides what it cannot settle alone, and escalates.",
      "The agents take that escalation and own it. An Investigation agent gathers evidence and tests competing hypotheses; a Threat Hunter looks for the same pattern elsewhere; a Defender plans containment with the blast radius in view; Recovery rebuilds from a trusted state; Verification refuses to close anything that has not been shown to be closed.",
      "The hardest part has been neither layer. It has been the seam between them: making sure Tacit keeps defending while the agents think, that the two never act on the same resource at once, and that every conclusion the agents reach is written back to a shared incident state Tacit can read in real time.",
      "We will publish more on that seam, including the ways it has failed in our own testing.",
    ],
  },
  {
    slug: "an-incident-that-outlives-its-model",
    kind: "Engineering",
    title: "An incident that outlives its model",
    dek: "Cognitive checkpoints, and why none of our agents belongs to a single provider.",
    date: "2 September 2026",
    published: "2026-09-02",
    readingTime: "Five minutes",
    byline: "From the platform team",
    opening: [
      "An attack that lasts four hours will, sooner or later, meet a model API that is slow, rate-limited or down. If the agent investigating it is bound to that provider, the investigation stops at the worst possible moment — or starts again from nothing on another model that knows none of what was learned.",
      "So we separated the agent from the model. Every incident keeps a single cognitive state: the facts confirmed so far, the hypotheses still open and how confident we are in each, the actions taken and what they did, the current plan, and the parts of the service and threat graphs it touches.",
    ],
    pullQuote: "Provider A, checkpoint, Provider B, continue — without starting over.",
    closing: [
      "Agents reach models through a Cognitive Gateway rather than directly. The gateway watches the health, latency, error rate and remaining quota of every provider, cloud and local, and routes each task to the model best suited to it. When a provider degrades, a circuit breaker opens, and the next request goes elsewhere carrying the checkpoint with it.",
      "For the most critical steps it sends the same request down two paths and takes the first sound answer. That costs more, so it is used sparingly: the scheduler decides how much intelligence an incident deserves, from Tacit alone for routine noise to the strongest available models for a cluster-wide event.",
      "And when every external path is gone, the defense does not go with it. Tacit, the agent runtime, the incident state, local tools and both graphs keep running on the cluster. Containment continues, evidence is preserved, and plans already approved keep executing. When the connection returns, the deeper investigation resumes where it paused.",
    ],
  },
  {
    slug: "every-action-is-a-proposal",
    kind: "Essay",
    title: "Every action is a proposal",
    dek: "On building an autonomous defender that still asks before it acts.",
    date: "18 August 2026",
    published: "2026-08-18",
    readingTime: "Four minutes",
    byline: "By the founders",
    opening: [
      "An autonomous defender is only useful if it can act: isolate a node, revoke a credential, disable an agent’s tool. It is only safe if it cannot act carelessly. A containment that takes down the payment service has done the attacker’s work for them.",
      "Our name comes from HTTP 401, the answer a server gives when it will not go on until it knows who is asking. We held to that idea long before we built a defense system, and it turned out to be exactly the idea a defense system needs.",
    ],
    pullQuote: "Nothing the agents decide runs directly. It runs once it has been shown to be safe.",
    closing: [
      "Every action an agent proposes passes through the same sequence: validation, a permission check, an impact analysis against the live service graph, a check for conflicts with other agents’ work, and finally a risk check by Tacit. Only then is it executed — with a distributed action ID, a lock on the resource it touches, and a way back.",
      "The strictness scales with the stakes. Rate-limiting a noisy client is low risk and passes quickly. Revoking a token is medium. Isolating a node is high, and must first show which services depend on it and where their traffic will go. Cluster-wide changes, shutting a database or rotating credentials at scale are critical, and are held to the strictest standard of all — including, where an organisation chooses, a person’s approval.",
      "Then every action enters a loop of its own: act, observe, verify, replan. If the threat has not stopped, if persistence remains, or if the remedy has created a new problem, the plan changes. An incident is closed when it is shown to be closed, not when the last command returns.",
    ],
  },
];

export function getEntry(slug: string) {
  return JOURNAL.find((entry) => entry.slug === slug);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-16" as an instrument would stamp it: "16 Sep 2026". */
export function stampDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** The entry after this one in the index, wrapping to the first. */
export function getNextEntry(slug: string) {
  const i = JOURNAL.findIndex((entry) => entry.slug === slug);
  return JOURNAL[(i + 1) % JOURNAL.length];
}
