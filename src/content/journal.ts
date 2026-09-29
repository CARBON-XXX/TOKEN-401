export type JournalKind = "Essay" | "Research" | "Product";

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
    slug: "calibrated-refusal",
    kind: "Research",
    title: "Calibrated refusal",
    dek: "Teaching a model the shape of its own uncertainty.",
    date: "2 September 2026",
    published: "2026-09-02",
    readingTime: "Six minutes",
    byline: "From the research team",
    opening: [
      "Most discussion of refusals treats them as a switch: the model either answers or it doesn’t. In practice the interesting cases sit in between — questions a model can partly answer, answers it can partly stand behind. We have spent the past year studying that middle ground.",
      "Our starting point is calibration, an old idea from weather forecasting. A forecaster who says there is a seventy per cent chance of rain is not judged on any single day, but on whether it rains on roughly seven of every ten days they say so. The same standard can be applied to a model.",
    ],
    pullQuote: "A model that says it is ninety per cent sure should be right about nine times in ten.",
    closing: [
      "Large models are often poorly calibrated in exactly the places that matter: they are most overconfident on questions that look familiar but are not. We trained Camellia to produce, alongside each answer, a private estimate of how likely it is to be correct, and then rewarded that estimate for being honest rather than for being high.",
      "The effect on behaviour was larger than we expected. When the estimate is low, the model now tends to do one of three things: say plainly what it is unsure of, ask the question that would resolve the doubt, or offer the part of the answer it can support and stop there. Outright refusals became rarer, not more common — because the model had better options than silence.",
      "There is a great deal we have not solved. Calibration degrades on subjects far from the training data, and a model can be well calibrated on average while being badly wrong about one person’s particular question. We are publishing our methods, our evaluation sets and the failures we found, in the hope that others will find more.",
      "The goal is not a model that refuses less, or one that refuses more. It is a model whose refusals mean something.",
    ],
  },
  {
    slug: "permission-as-a-feature",
    kind: "Product",
    title: "Permission as a feature",
    dek: "Notes on designing agents that ask before they act.",
    date: "18 August 2026",
    published: "2026-08-18",
    readingTime: "Five minutes",
    byline: "From the Threshold team",
    opening: [
      "When software only answered questions, a mistake cost you a bad answer. Now that it books, buys, sends and deletes, a mistake costs you whatever it touched. Threshold began as an internal rule — no agent of ours acts on the world without a person’s yes — and became a product when we saw how many teams were writing the same rule by hand.",
      "The difficulty is not asking. It is asking well. An agent that interrupts for everything is soon ignored, and a permission that is always granted is no permission at all.",
    ],
    pullQuote: "Most actions are small and reversible, and a few are neither.",
    closing: [
      "Threshold sorts every action an agent proposes by two questions: can it be undone, and does it speak for you? Reading a calendar is neither. Moving a meeting can be undone, but it speaks for you. Paying an invoice is both. Only that last kind waits for a person, and when it does, the request is written in plain language — what will happen, why the agent thinks it should, and what cannot be taken back.",
      "Every decision, whether yes, no or not yet, is signed and kept in a record that cannot be quietly edited. That record is for you, not for us. Months later, anyone with access can see who allowed what, and on what information.",
      "We think of a permission request the way a good correspondent thinks of the last line of a letter: the place where care becomes visible. It should be rare, clear and impossible to misread. Most of our design work on Threshold has been taking words out of it.",
    ],
  },
  {
    slug: "on-restraint",
    kind: "Essay",
    title: "On restraint",
    dek: "Why the best answer is sometimes a question.",
    date: "14 April 2026",
    published: "2026-04-14",
    readingTime: "Four minutes",
    byline: "By the founders",
    opening: [
      "Ask a good doctor a hard question and watch what happens before the answer. There is a pause — sometimes only a breath — in which they decide what they actually know, what they suspect, and what they would need to find out. That pause is not a delay in the work. It is the work.",
      "Language models are not built to pause. They are built to continue. Given any run of words they produce the most plausible next one, and then the next, with the same even confidence whether the subject is the boiling point of water or the dose of a medicine they have seen mentioned twice. The fluency is real. What it seems to promise often is not.",
    ],
    pullQuote: "Fluency is not the same as knowledge, but it is very easy to mistake one for the other.",
    closing: [
      "We think much of the work ahead in AI is teaching systems the difference — and, just as importantly, teaching them to show it. A model that is unsure should sound unsure. A model that is missing something should ask for it. A model that is about to do something it cannot take back should stop and check.",
      "None of this is glamorous. Restraint rarely demonstrates well; an assistant that says “I don’t know, but here is how we could find out” will lose most side-by-side comparisons to one that simply answers. We have decided to accept that trade. What we care about is not how often a model impresses someone in the first minute, but whether it is still trusted in the hundredth hour.",
      "So we build for the pause. Our models are trained to separate what they know from what they are guessing, to ask when a request could mean two different things, and to decline — plainly, and without a lecture — when a question sits outside what they can responsibly answer. It is slower. We think it is also the only way this goes well.",
    ],
  },
];

export function getEntry(slug: string) {
  return JOURNAL.find((entry) => entry.slug === slug);
}

/** The entry after this one in the index, wrapping to the first. */
export function getNextEntry(slug: string) {
  const i = JOURNAL.findIndex((entry) => entry.slug === slug);
  return JOURNAL[(i + 1) % JOURNAL.length];
}
