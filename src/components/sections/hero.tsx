"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { ContourField } from "@/components/art/contour-field";
import { CamelliaBloom, bloomDuration } from "@/components/brand/camellia-bloom";
import { useContact } from "@/components/contact/contact-provider";
import { MaskedLines, QUILL } from "@/components/site/motion-primitives";
import { PillLink, TextLink } from "@/components/site/pill";

const BLOOM_DELAY = 0.45;
const BLOOM_SPREAD = 1.9;

export function Hero() {
  const { openContact } = useContact();
  const sectionRef = useRef<HTMLElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const flowerY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease: QUILL },
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-title"
    >
      <ContourField
        anchorRef={flowerRef}
        startDelay={BLOOM_DELAY + bloomDuration(BLOOM_SPREAD) * 0.45}
        className="absolute inset-0 -z-10 size-full [mask-image:linear-gradient(to_bottom,black_62%,transparent_98%)]"
      />
      <CropMarks />

      <motion.div
        style={{ opacity: fade }}
        className="frame grid min-h-[100svh] grid-cols-12 content-center gap-y-10 pt-[calc(var(--nav-h)+2.5rem)] pb-32 lg:items-center lg:pt-[var(--nav-h)]"
      >
        <motion.div style={{ y: textY }} className="relative col-span-12 lg:col-span-7">
          <motion.p {...fadeUp(0.3)} className="eyebrow flex items-center gap-4 text-ink-3">
            <span className="text-ink">Plate I</span>
            <span aria-hidden className="h-px w-10 bg-rule-strong" />
            An AI research company
          </motion.p>

          <h1
            id="hero-title"
            className="display mt-8 text-[clamp(3.4rem,8.6vw,9.25rem)] text-ink lg:mt-10"
          >
            <MaskedLines
              trigger="mount"
              delay={0.35}
              lines={[
                "Intelligence,",
                "unfolding",
                <em key="care" className="font-light italic tracking-[-0.035em]">
                  with care.
                </em>,
              ]}
            />
          </h1>

          <motion.p
            {...fadeUp(0.95)}
            className="mt-9 max-w-[31rem] font-serif text-[1.1875rem] leading-[1.6] text-ink-2 sm:text-[1.3125rem]"
          >
            TOKEN/401 builds AI that reasons one token at a time — and knows when to pause and ask.
            Systems designed to earn trust, never to assume it.
          </motion.p>

          <motion.div {...fadeUp(1.1)} className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-5">
            <PillLink href="#approach">Read our approach</PillLink>
            <TextLink
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                openContact();
              }}
            >
              Write to us
            </TextLink>
          </motion.div>
        </motion.div>

        <motion.figure
          style={{ y: flowerY }}
          className="relative order-first col-span-12 flex flex-col items-center lg:order-none lg:col-span-5 lg:items-end"
        >
          <div
            ref={flowerRef}
            className="aspect-[317/325] w-[min(58vw,17rem)] text-ink sm:w-[min(48vw,22rem)] lg:w-[min(34vw,31rem)]"
          >
            <CamelliaBloom
              className="size-full"
              strokeWidth={1.15}
              delay={BLOOM_DELAY}
              spread={BLOOM_SPREAD}
              title="A camellia drawn in sixty-two strokes"
            />
          </div>
          <motion.figcaption
            {...fadeUp(BLOOM_DELAY + bloomDuration(BLOOM_SPREAD) * 0.7)}
            className="mt-8 hidden w-[min(34vw,31rem)] items-baseline justify-between gap-6 border-t border-rule pt-3 lg:flex"
          >
            <span className="caption text-ink-3">Fig. 1 — Camellia japonica, in sixty-two strokes.</span>
            <span className="eyebrow shrink-0 text-ink-4">N° 401</span>
          </motion.figcaption>
        </motion.figure>
      </motion.div>

      <motion.div
        {...fadeUp(1.6)}
        className="frame absolute inset-x-0 bottom-0 flex items-end justify-between pb-7"
      >
        <a href="#approach" className="group flex items-center gap-4 text-ink-3">
          <span className="relative block h-10 w-px overflow-hidden bg-rule">
            <span className="absolute inset-0 bg-ink [animation:scroll-cue_2.6s_var(--ease-ink)_infinite]" />
          </span>
          <span className="eyebrow transition-colors group-hover:text-ink">Scroll to read</span>
        </a>
        <span className="eyebrow hidden text-ink-4 sm:block">Vol. 01 — MMXXVI</span>
      </motion.div>
    </section>
  );
}

/** Printer's registration marks, a quiet nod to ink on paper. */
function CropMarks() {
  const mark = (
    <svg viewBox="0 0 16 16" className="size-4 text-ink-4" aria-hidden>
      <path d="M8 0v16M0 8h16" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="8" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="frame relative h-full">
        <div className="absolute top-[calc(var(--nav-h)+1.5rem)] left-[var(--frame-x)] -translate-x-1/2 opacity-70">
          {mark}
        </div>
        <div className="absolute top-[calc(var(--nav-h)+1.5rem)] right-[var(--frame-x)] translate-x-1/2 opacity-70">
          {mark}
        </div>
      </div>
    </div>
  );
}
