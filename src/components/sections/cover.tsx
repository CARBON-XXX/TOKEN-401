"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { HorizonField } from "@/components/art/horizon-field";
import { CoverEmblem } from "@/components/brand/cover-emblem";
import { SLOW } from "@/components/site/motion-primitives";

const LINES: { w: string; italic?: boolean }[][] = [
  [{ w: "There" }, { w: "is" }, { w: "a" }, { w: "pause" }],
  [{ w: "before" }, { w: "every" }, { w: "good", italic: true }, { w: "answer." }],
];

export function Cover() {
  const ref = useRef<HTMLElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  return (
    <section
      ref={ref}
      id="top"
      data-surface="ink"
      aria-labelledby="cover-title"
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink text-chalk"
    >
      <HorizonField anchorRef={emblemRef} progressRef={progressRef} className="absolute inset-0 size-full" />

      <CoverEmblem
        ref={emblemRef}
        lift={reduce ? undefined : lift}
        className="absolute top-[64%] left-1/2 aspect-[317/325] w-[190vw] -translate-x-1/2 sm:top-[62%] sm:w-[max(92vw,560px)] lg:top-[58%] lg:w-[min(80vw,1160px)]"
      />

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        className="frame relative flex h-[62%] flex-col items-center justify-center pt-[var(--nav-h)] text-center"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, letterSpacing: "0.32em" }}
          animate={{ opacity: 1, letterSpacing: "0.16em" }}
          transition={{ duration: 2.4, delay: 0.6, ease: SLOW }}
          className="type-label text-chalk/62"
        >
          An AI research company
        </motion.p>
        <h1 id="cover-title" className="type-cover mt-7 max-w-[14em] sm:mt-9">
          {LINES.map((line, li) => (
            <span key={li} className="block">
              {line.map(({ w, italic }, wi) => {
                const i = LINES.slice(0, li).reduce((n, l) => n + l.length, 0) + wi;
                return (
                  <motion.span
                    key={w}
                    className={italic ? "inline-block italic" : "inline-block"}
                    initial={reduce ? false : { opacity: 0, y: "0.28em", filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                    transition={{ duration: 1.8, delay: 1 + i * 0.11 + (w === "good" ? 0.35 : 0), ease: SLOW }}
                  >
                    {w}
                    {wi < line.length - 1 ? "\u00a0" : null}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 2.4, ease: SLOW }}
          className="type-lede mt-7 max-w-[27em] text-chalk/62 sm:mt-9"
        >
          We build systems that take their time, say what they don’t know, and ask before they act.
        </motion.p>
      </motion.div>

      <motion.a
        href="#approach"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 3.4, ease: SLOW }}
        className="type-label absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 text-chalk/62 transition-colors duration-500 hover:text-chalk"
      >
        Read on
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-chalk/14">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-chalk/62 [animation:fall_2.8s_var(--ease-slow)_infinite]" />
        </span>
      </motion.a>
    </section>
  );
}
