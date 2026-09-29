"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { MaskedLines, PlateHeader, QUILL, Reveal } from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";

type Note = {
  date: string;
  area: string;
  title: string;
  abstract: string;
  reading: string;
};

const NOTES: Note[] = [
  {
    date: "Sep 2026",
    area: "Alignment",
    title: "Calibrated refusal: teaching models the shape of their own uncertainty",
    abstract:
      "We describe a training objective that rewards models for declining in proportion to their true error rate. On held-out tasks, calibrated models refuse 38% less often while making 61% fewer confident mistakes.",
    reading: "22 min read",
  },
  {
    date: "Aug 2026",
    area: "Agents",
    title: "Permissioned agents: a protocol for systems that ask before they act",
    abstract:
      "An open specification for expressing consent, scope, and expiry on agent actions, with reference implementations and a threat model developed alongside external red teams.",
    reading: "31 min read",
  },
  {
    date: "Jun 2026",
    area: "Interpretability",
    title: "Reading the petals: layered features in long-context attention",
    abstract:
      "We trace how meaning accumulates across layers, finding concentric structures that resemble the growth of a flower more than the stacking of a wall — and that can be steered.",
    reading: "18 min read",
  },
  {
    date: "Apr 2026",
    area: "Essay",
    title: "On restraint: why the best answer is sometimes a question",
    abstract:
      "A short essay on the design values behind TOKEN/401 — and why we believe hesitation, correctly placed, is a capability rather than a flaw.",
    reading: "9 min read",
  },
];

export function Research() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="research" className="relative scroll-mt-8 pt-10 pb-32 lg:pb-44">
      <div className="frame">
        <PlateHeader numeral="VI" label="Research" aside="Notes from the lab" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-24">
          <h2 className="display col-span-12 text-[clamp(2.9rem,6.4vw,6.5rem)] lg:col-span-7">
            <MaskedLines lines={["Written in the", <em key="h" className="italic">open.</em>]} />
          </h2>
          <Reveal className="col-span-12 self-end lg:col-span-4 lg:col-start-9" delay={0.2}>
            <p className="font-serif text-[1.1875rem] leading-[1.6] text-ink-2">
              We publish what we learn, including what didn’t work. Careful science is slower. It is
              also the only kind worth building on.
            </p>
          </Reveal>
        </div>

        <ul className="mt-20 border-t border-rule-strong lg:mt-28">
          {NOTES.map((note, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={note.title} delay={i * 0.06} className="border-b border-rule">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`note-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-12 items-baseline gap-x-6 gap-y-3 py-8 text-left sm:py-10"
                >
                  <span className="eyebrow col-span-6 text-ink-4 sm:col-span-2">{note.date}</span>
                  <span className="eyebrow col-span-6 text-right text-ink-3 sm:order-last sm:col-span-2">
                    {note.area}
                  </span>
                  <span className="col-span-11 font-serif text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.15] font-light tracking-[-0.015em] text-ink transition-transform duration-700 ease-[var(--ease-quill)] group-hover:translate-x-2 sm:col-span-7">
                    {note.title}
                  </span>
                  <span className="col-span-1 flex justify-end self-center sm:order-last sm:col-span-1">
                    <span className="relative block size-4" aria-hidden>
                      <span className="absolute top-1/2 left-0 h-px w-4 bg-ink" />
                      <span
                        className={cn(
                          "absolute top-0 left-1/2 h-4 w-px bg-ink transition-transform duration-500 ease-[var(--ease-quill)]",
                          isOpen && "scale-y-0",
                        )}
                      />
                    </span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`note-${i}`}
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.75, ease: QUILL }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-x-6 pb-10">
                        <p className="col-span-12 max-w-[40rem] text-[1rem] leading-[1.75] text-ink-2 sm:col-span-7 sm:col-start-3">
                          {note.abstract}
                        </p>
                        <p className="caption col-span-12 mt-5 text-ink-4 sm:col-span-7 sm:col-start-3">
                          {note.reading} · Full paper on request
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
