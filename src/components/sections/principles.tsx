import { Rise } from "@/components/site/motion-primitives";

const PRINCIPLES = [
  {
    numeral: "I",
    title: "We would rather be right than fast.",
    body: "We judge our models by the quality of their judgement, not the speed of their reply. When a question deserves time, they are allowed to take it.",
  },
  {
    numeral: "II",
    title: "We ask before we act.",
    body: "Anything consequential — a payment, a deletion, a message sent in your name — waits for a person to say yes. Permission is part of the work, not friction in the way of it.",
  },
  {
    numeral: "III",
    title: "We show our working.",
    body: "A model’s reasoning should be as legible as a well-kept notebook. We publish our methods and our mistakes, and we build tools that let others check them.",
  },
] as const;

export function Principles() {
  return (
    <section
      id="principles"
      data-surface="ink"
      aria-labelledby="principles-title"
      className="ink-field section-y relative scroll-mt-[var(--nav-h)] bg-ink text-chalk"
    >
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <Rise className="col-span-12 lg:col-span-3">
            <p className="type-label text-chalk/62">Principles</p>
          </Rise>
          <Rise as="header" className="col-span-12 lg:col-span-9" delay={0.1}>
            <h2 id="principles-title" className="type-display-1 max-w-[10em]">
              Three things we will not trade for speed.
            </h2>
          </Rise>
        </div>

        <ol className="mt-[clamp(72px,9vw,144px)]">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="border-t border-chalk/14 last:border-b">
              <Rise className="grid grid-cols-12 gap-x-6 gap-y-5 py-10 sm:py-14 lg:items-baseline lg:py-16">
                <span
                  aria-hidden
                  className="col-span-3 font-display text-[clamp(4.5rem,10vw,9.5rem)] leading-[0.7] font-light text-chalk/28 lg:col-span-3"
                >
                  {p.numeral}
                </span>
                <h3 className="type-display-2 col-span-12 max-w-[11em] sm:col-span-9 lg:col-span-5">
                  <span className="sr-only">{p.numeral}. </span>
                  {p.title}
                </h3>
                <p className="type-body col-span-12 max-w-[24em] text-chalk/62 sm:col-span-9 sm:col-start-4 lg:col-span-4 lg:col-start-9">
                  {p.body}
                </p>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
