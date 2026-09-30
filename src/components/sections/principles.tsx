"use client";

import { motion, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useRef, useSyncExternalStore } from "react";

import { CAMELLIA_STROKES, CAMELLIA_VIEWBOX } from "@/components/brand/logo-paths";
import { Rise, useScrub } from "@/components/site/motion-primitives";

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

const MAX_R = Math.max(...CAMELLIA_STROKES.map((s) => s.r));

/** Each petal line opens in turn from the centre outward; widths vary a little, as a pen's would. */
const STROKES = CAMELLIA_STROKES.map((s, i) => ({
  d: s.d,
  start: Math.pow(s.r / MAX_R, 0.85) * 0.74,
  width: 0.8 + ((i * 37) % 11) / 20,
}));

const WIDE = "(min-width: 1024px)";

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

export function Principles() {
  const listRef = useRef<HTMLOListElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const wide = useWide();
  const reduce = useReducedMotion();

  // On wide screens the flower stays in view and opens across all three principles;
  // on narrow ones it opens as it passes.
  const { scrollYProgress: acrossList } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.8"] });
  const { scrollYProgress: passing } = useScroll({ target: bloomRef, offset: ["start 0.95", "center 0.4"] });
  const progress = wide ? acrossList : passing;

  return (
    <section
      id="principles"
      data-surface="ink"
      aria-labelledby="principles-title"
      className="section-y relative scroll-mt-[var(--nav-h)] bg-ink text-chalk"
    >
      <div className="frame relative">
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

        <div className="mt-[clamp(72px,9vw,144px)] grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-5">
            <div className="flex justify-center lg:sticky lg:top-[var(--nav-h)] lg:h-[calc(100svh-var(--nav-h))] lg:items-center">
              <div ref={bloomRef} className="relative aspect-[317/325] w-[min(66vw,320px)] lg:w-[min(30vw,430px)]">
                <Bloom key={wide ? "wide" : "narrow"} progress={progress} still={!!reduce} />
              </div>
            </div>
          </div>

          <ol ref={listRef} className="col-span-12 mt-20 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {PRINCIPLES.map((p) => (
              <li
                key={p.title}
                className="border-t border-chalk/14 last:border-b lg:flex lg:min-h-[72svh] lg:flex-col lg:justify-center"
              >
                <Rise className="py-12 sm:py-16">
                  <span
                    aria-hidden
                    className="block font-display text-[clamp(4rem,7vw,7rem)] leading-[0.7] font-light text-chalk/28"
                  >
                    {p.numeral}
                  </span>
                  <h3 className="type-display-2 mt-10 max-w-[11em]">
                    <span className="sr-only">{p.numeral}. </span>
                    {p.title}
                  </h3>
                  <p className="type-body mt-6 max-w-[26em] text-chalk/62">{p.body}</p>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Bloom({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const glow = useScrub(progress, [0, 1], [0.1, 1]);
  const { width, height } = CAMELLIA_VIEWBOX;

  return (
    <>
      <motion.div
        aria-hidden
        style={still ? undefined : { opacity: glow }}
        className="pointer-events-none absolute -inset-[40%] [background:radial-gradient(closest-side,rgb(245_243_238/0.1),rgb(245_243_238/0.03)_55%,transparent)]"
      />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative size-full text-chalk"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <g>
          {STROKES.map((s, i) =>
            still ? (
              <path key={i} d={s.d} strokeWidth={s.width} strokeOpacity={0.9} />
            ) : (
              <BloomStroke key={i} d={s.d} start={s.start} width={s.width} progress={progress} />
            ),
          )}
        </g>
      </svg>
    </>
  );
}

function BloomStroke({
  d,
  start,
  width,
  progress,
}: {
  d: string;
  start: number;
  width: number;
  progress: MotionValue<number>;
}) {
  const pathLength = useScrub(progress, [start, start + 0.24], [0, 1]);
  const opacity = useScrub(progress, [start, start + 0.03], [0, 0.9]);
  return <motion.path d={d} strokeWidth={width} style={{ pathLength, opacity }} />;
}
