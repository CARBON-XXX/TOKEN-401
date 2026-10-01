"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { useContact } from "@/components/contact/contact-provider";
import { Rise, SLOW } from "@/components/site/motion-primitives";
import { PillButton } from "@/components/site/pill";
import { CONTACT_EMAIL } from "@/lib/contact";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

const COPY_LABEL: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Not copied",
};

function CopyEmail() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), 2400);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${CONTACT_EMAIL}`}
        className={cn(
          "type-tech relative grid h-7 min-w-[5.5rem] place-items-center overflow-hidden rounded-[3px] border px-2.5 transition-[color,border-color,background-color,translate] duration-500 active:translate-y-px active:bg-chalk/[0.06] active:duration-75",
          state === "copied" ? "border-mist/45 text-mist" : "border-chalk/20 text-chalk/55",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.45, ease: SLOW }}
          >
            {COPY_LABEL[state]}
          </motion.span>
        </AnimatePresence>
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Address copied" : ""}
      </span>
    </>
  );
}

export function Closing() {
  const { openContact } = useContact();

  return (
    <section
      id="contact"
      data-surface="ink"
      aria-labelledby="closing-title"
      className="section-y relative scroll-mt-[var(--nav-h)] bg-ink text-center text-chalk"
    >
      <div className="frame relative flex flex-col items-center">
        <CamelliaBloom
          trigger="inView"
          strokeWidth={1.3}
          spread={1.8}
          className="relative aspect-[317/325] w-[clamp(96px,11vw,148px)] text-chalk/62"
        />
        <Rise as="header" className="mt-14 sm:mt-16" delay={0.3}>
          <h2 id="closing-title" className="type-display-1 max-w-[13em]">
            If you run systems worth defending, we would like to talk.
          </h2>
        </Rise>
        <Rise as="p" className="type-lede mt-8 max-w-[24em] text-chalk/62" delay={0.4}>
          We are working with a small number of early partners. A person reads every message, and
          answers.
        </Rise>
        <Rise className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-10" delay={0.5}>
          <PillButton surface="ink" onClick={() => openContact("Early access")}>
            Request access
          </PillButton>
          <span className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="type-ui text-chalk/62 transition-colors duration-500 hover:text-chalk"
            >
              {CONTACT_EMAIL}
            </a>
            <CopyEmail />
          </span>
        </Rise>
      </div>
    </section>
  );
}
