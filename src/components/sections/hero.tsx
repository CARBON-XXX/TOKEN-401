"use client";

import { motion } from "motion/react";

import { TwoSpeeds } from "@/components/art/two-speeds";
import { useContact } from "@/components/contact/contact-provider";
import { SLOW } from "@/components/site/motion-primitives";
import { ButtonLink, PillButton } from "@/components/site/pill";

export function Hero() {
  const { openContact } = useContact();

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease: SLOW },
  });

  return (
    <section id="top" data-surface="bone" aria-labelledby="hero-title" className="relative pt-[var(--nav-h)]">
      <div className="frame pt-[clamp(32px,6vh,120px)] pb-[clamp(72px,9vw,128px)]">
        <motion.h1 {...enter(0)} id="hero-title" className="type-hero text-soot">
          <span className="block">Machine reflexes.</span>
          <span className="type-voice block text-graphite">Judgment that asks first.</span>
        </motion.h1>

        <div className="mt-[clamp(28px,4.5vh,56px)] grid grid-cols-12 gap-x-6 gap-y-8">
          <motion.p {...enter(0.15)} className="type-lede col-span-12 max-w-[29em] text-graphite sm:col-span-10 lg:col-span-5 lg:col-start-7">
            TOKEN/401 is an AI research company. We build autonomous defense for the systems the
            world now runs on: fast where it has to be, careful everywhere else, and always
            answerable to the people it protects.
          </motion.p>
          <motion.div {...enter(0.25)} className="col-span-12 flex flex-wrap gap-3 lg:col-span-5 lg:col-start-7">
            <ButtonLink href="#product">Our first product</ButtonLink>
            <PillButton tone="outline" arrow={false} onClick={() => openContact("Early access")}>
              Request access
            </PillButton>
          </motion.div>
        </div>

        <motion.figure {...enter(0.35)} className="mt-[clamp(40px,5.5vh,112px)]">
          <TwoSpeeds />
          <figcaption className="type-label mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-plaster pt-4 text-stone">
            <span className="flex items-baseline gap-3 text-soot">
              <span className="type-caption text-stone">Fig. 1</span>
              One incident, at two speeds
            </span>
            <span>Illustrative · two time scales</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
