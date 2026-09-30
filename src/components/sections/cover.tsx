"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useRef, useState } from "react";

import { PressSheet, type PressState } from "@/components/art/press-sheet";
import { AnchorLink } from "@/components/site/anchor-link";
import { SLOW } from "@/components/site/motion-primitives";
import { Arrow } from "@/components/site/pill";
import { cn } from "@/lib/utils";

export function Cover() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduce = useReducedMotion();
  const [press, setPress] = useState<PressState | "pending">("pending");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const printed = press !== "failed";
  const after = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.4, delay, ease: SLOW },
        };

  return (
    <section
      ref={ref}
      id="top"
      data-surface="bone"
      aria-labelledby="cover-title"
      className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-bone text-soot [--press-ink:rgb(17_17_16)]"
    >
      <PressSheet sheetRef={ref} progressRef={progressRef} onState={setPress} className="absolute inset-0 size-full transition-opacity duration-300" />

      <span
        aria-hidden
        data-press="blind"
        className="type-blind pointer-events-none absolute top-[calc(var(--nav-h)+2vh)] -right-[0.03em] text-transparent select-none sm:top-auto sm:-bottom-[0.12em]"
      >
        401
      </span>

      <div className="frame relative mt-auto pt-[calc(var(--nav-h)+2rem)] pb-[clamp(44px,9vh,104px)] sm:pr-[50%] lg:pr-[48%]">
        <motion.p {...after(1.2)} className="type-label text-graphite">
          An AI research company
        </motion.p>
        <h1
          id="cover-title"
          data-press="ink"
          className={cn("type-hero mt-6 sm:mt-8", printed ? "text-transparent" : "text-soot")}
        >
          Every word,
          <br />
          weighed.
        </h1>
        <motion.p {...after(1.8)} className="type-lede mt-8 max-w-[25em] text-graphite sm:mt-10">
          TOKEN/401 builds language models that reason before they answer, say what they don’t know,
          and ask before they act.
        </motion.p>
        <motion.div {...after(2.1)} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
          <AnchorLink
            href="/#products"
            className="type-ui inline-flex h-12 items-center gap-4 rounded-full bg-soot px-7 text-chalk"
          >
            Our models
            <Arrow />
          </AnchorLink>
          <AnchorLink href="/#journal" className="type-ui inline-flex items-center gap-3 border-b border-soot/40 pb-1">
            Read the research
          </AnchorLink>
        </motion.div>
      </div>
    </section>
  );
}
