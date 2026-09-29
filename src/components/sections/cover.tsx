"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { CoverEmblem } from "@/components/brand/cover-emblem";
import { SLOW } from "@/components/site/motion-primitives";

export function Cover() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.6, delay, ease: SLOW },
  });

  return (
    <section
      ref={ref}
      id="top"
      data-surface="ink"
      aria-labelledby="cover-title"
      className="ink-field relative h-[100svh] min-h-[680px] overflow-hidden bg-ink text-chalk"
    >
      <CoverEmblem
        lift={reduce ? undefined : lift}
        className="absolute top-[64%] left-1/2 aspect-[317/325] w-[180vw] -translate-x-1/2 sm:top-[62%] sm:w-[max(96vw,560px)] lg:w-[min(92vw,1320px)]"
      />

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        className="frame relative flex h-[62%] flex-col items-center justify-center pt-[var(--nav-h)] text-center"
      >
        <motion.p {...rise(0.9)} className="type-label text-chalk/62">
          An AI research company
        </motion.p>
        <h1 id="cover-title" className="type-cover mt-7 max-w-[14em] sm:mt-9">
          <motion.span {...rise(1.1)} className="block">
            There is a pause
          </motion.span>
          <motion.span {...rise(1.3)} className="block">
            before every <em className="italic">good</em> answer.
          </motion.span>
        </h1>
        <motion.p {...rise(1.7)} className="type-lede mt-7 max-w-[27em] text-chalk/62 sm:mt-9">
          We build systems that take their time, say what they don’t know, and ask before they act.
        </motion.p>
      </motion.div>

      <motion.a
        href="#approach"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 2.8, ease: SLOW }}
        className="type-label absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 text-chalk/62 transition-colors duration-500 hover:text-chalk"
      >
        Read on
        <motion.span
          aria-hidden
          className="block h-10 w-px origin-top bg-chalk/28"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.6, delay: 3.1, ease: SLOW }}
        />
      </motion.a>
    </section>
  );
}
