"use client";

import { Motes } from "@/components/art/motes";
import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { useContact } from "@/components/contact/contact-provider";
import { Rise } from "@/components/site/motion-primitives";
import { PillButton } from "@/components/site/pill";
import { CONTACT_EMAIL } from "@/lib/contact";

export function Closing() {
  const { openContact } = useContact();

  return (
    <section
      id="contact"
      data-surface="ink"
      aria-labelledby="closing-title"
      className="ink-field section-y relative scroll-mt-[var(--nav-h)] bg-ink text-center text-chalk"
    >
      <Motes className="pointer-events-none absolute inset-0 size-full" count={30} />
      <div className="frame relative flex flex-col items-center">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-[120%] [animation:breathe-glow_10s_ease-in-out_infinite] [background:radial-gradient(closest-side,rgb(245_243_238/0.09),transparent)]"
          />
          <CamelliaBloom
            trigger="inView"
            strokeWidth={1.3}
            spread={1.8}
            className="relative aspect-[317/325] w-[clamp(96px,11vw,148px)] text-chalk/62"
          />
        </div>
        <Rise as="header" className="mt-14 sm:mt-16" delay={0.3}>
          <h2 id="closing-title" className="type-display-2 max-w-[14em]">
            If you have read this far, we would like to hear from you.
          </h2>
        </Rise>
        <Rise as="p" className="type-lede mt-8 max-w-[24em] text-chalk/62" delay={0.4}>
          Researchers, builders and the simply curious — a person reads every letter, and answers.
        </Rise>
        <Rise className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-10" delay={0.5}>
          <PillButton surface="ink" onClick={() => openContact()}>
            Write to us
          </PillButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="type-ui text-chalk/62 transition-colors duration-500 hover:text-chalk"
          >
            {CONTACT_EMAIL}
          </a>
        </Rise>
      </div>
    </section>
  );
}
