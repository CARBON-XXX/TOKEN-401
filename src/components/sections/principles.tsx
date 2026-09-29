import type { ComponentType } from "react";

import { HarmonographFigure, PhyllotaxisFigure, TopographyFigure } from "@/components/art/figures";
import { MaskedLines, PlateHeader, Reveal } from "@/components/site/motion-primitives";

type Principle = {
  numeral: string;
  title: string;
  body: string;
  figure: ComponentType<{ className?: string; delay?: number }>;
  caption: string;
};

const PRINCIPLES: Principle[] = [
  {
    numeral: "i.",
    title: "Considered",
    body: "Every output is a decision. We train models to deliberate before they speak, to weigh what they know against what they merely suspect, and to show the reasoning that got them there.",
    figure: HarmonographFigure,
    caption: "Fig. 2 — Two pendulums, slowly coming to rest.",
  },
  {
    numeral: "ii.",
    title: "Bounded",
    body: "Capability without consent is only risk. Our systems know the edges of their authority, and pause at every threshold that matters until a person says yes.",
    figure: TopographyFigure,
    caption: "Fig. 3 — Contours that never cross their boundary.",
  },
  {
    numeral: "iii.",
    title: "Legible",
    body: "Trust grows from understanding. We invest in interpretability so that what a model knows — and what it doesn’t — can be read as plainly as a page.",
    figure: PhyllotaxisFigure,
    caption: "Fig. 4 — Seeds set on the golden angle.",
  },
];

export function Principles() {
  return (
    <section id="principles" className="relative scroll-mt-8 pt-10 pb-32 lg:pb-44">
      <div className="frame">
        <PlateHeader numeral="III" label="Principles" aside="Three quiet commitments" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-24">
          <h2 className="display col-span-12 text-[clamp(2.9rem,6.4vw,6.5rem)] lg:col-span-7">
            <MaskedLines lines={["What we", <em key="h" className="italic">hold to.</em>]} />
          </h2>
          <Reveal className="col-span-12 self-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <p className="font-serif text-[1.1875rem] leading-[1.6] text-ink-2">
              Three commitments shape every model we train and every product we ship. None of them
              are new. All of them are hard.
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 grid grid-cols-1 border-t border-rule-strong md:grid-cols-3 lg:mt-28">
          {PRINCIPLES.map((p, i) => {
            const Figure = p.figure;
            return (
              <li
                key={p.title}
                className="group relative border-b border-rule py-12 md:border-b-0 md:px-8 md:py-14 md:first:pl-0 md:last:pr-0 md:[&:not(:first-child)]:border-l"
              >
                <div className="flex items-baseline justify-between">
                  <span className="caption text-[1.25rem] text-ink-3">{p.numeral}</span>
                  <span className="eyebrow text-ink-4">0{i + 1} / 03</span>
                </div>
                <div className="mx-auto mt-10 aspect-square w-full max-w-[17rem] text-ink transition-transform duration-[1.6s] ease-[var(--ease-quill)] group-hover:scale-[1.035]">
                  <Figure className="size-full" delay={0.15 + i * 0.2} />
                </div>
                <p className="caption mt-8 text-center text-[0.875rem] text-ink-4">{p.caption}</p>
                <Reveal delay={0.1 + i * 0.1}>
                  <h3 className="mt-12 font-serif text-[2.25rem] leading-none font-light tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="mt-5 max-w-[26rem] text-[1rem] leading-[1.7] text-ink-2">{p.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
