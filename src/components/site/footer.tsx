"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/camellia-mark";
import { WORDMARK } from "@/components/brand/logo-paths";
import { useContact } from "@/components/contact/contact-provider";
import { CONTACT_EMAIL } from "@/lib/contact";

import { AnchorLink } from "./anchor-link";
import { SLOW } from "./motion-primitives";
import { NAV_LINKS } from "./nav";

const linkClass = "type-ui text-left text-chalk/62 transition-colors duration-500 hover:text-chalk";

export function Footer() {
  const { openContact } = useContact();
  const reduce = useReducedMotion();

  return (
    <footer data-surface="ink" className="relative overflow-hidden bg-ink text-chalk">
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 border-t border-chalk/14 pt-16 sm:pt-20">
          <p className="type-lede col-span-12 max-w-[16em] text-chalk lg:col-span-5">
            Autonomous defense for the systems the world now runs on.
          </p>

          <FooterColumn title="Index" className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className={linkClass}>
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="col-span-6 sm:col-span-4 lg:col-span-2">
            <li>
              <button type="button" onClick={() => openContact("Careers")} className={linkClass}>
                Careers
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openContact("Press")} className={linkClass}>
                Press
              </button>
            </li>
            <li>
              <AnchorLink href="/#principles" className={linkClass}>
                Responsible use
              </AnchorLink>
            </li>
          </FooterColumn>

          <FooterColumn title="Correspondence" className="col-span-12 sm:col-span-4 lg:col-span-2">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className={linkClass}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://x.com" target="_blank" rel="noreferrer" className={linkClass}>
                X
              </a>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-24 sm:mt-32">
          {reduce ? (
            <Wordmark className="block h-auto w-full text-chalk" title="TOKEN/401" />
          ) : (
            <RisingWordmark />
          )}
        </div>

        <div className="type-label flex flex-col gap-4 border-t border-chalk/14 py-7 text-chalk/62 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 TOKEN/401, Inc.</span>
          <span className="flex gap-8">
            <AnchorLink href="/#top" className="transition-colors duration-500 hover:text-chalk">
              Privacy
            </AnchorLink>
            <AnchorLink href="/#top" className="transition-colors duration-500 hover:text-chalk">
              Terms
            </AnchorLink>
            <a href="#top" className="transition-colors duration-500 hover:text-chalk">
              Back to top
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Left-to-right order of the traced glyphs, from where each path starts. */
const GLYPH_RANK = (() => {
  const xs = WORDMARK.paths.map((d) => Number(d.match(/^M(-?\d+)/)?.[1] ?? 0));
  const sorted = [...xs].sort((a, b) => a - b);
  return xs.map((x) => sorted.indexOf(x));
})();

/** The wordmark set letter by letter, each glyph rising out of the line it stands on. */
function RisingWordmark() {
  const { width, height, transform, paths } = WORDMARK;
  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full text-chalk"
      fill="currentColor"
      role="img"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      <title>TOKEN/401</title>
      {paths.map((d, i) => (
        <motion.g
          key={i}
          variants={{
            hidden: { y: height * 1.05 },
            shown: { y: 0, transition: { duration: 1.9, delay: GLYPH_RANK[i] * 0.085, ease: SLOW } },
          }}
        >
          <g transform={transform}>
            <path d={d} />
          </g>
        </motion.g>
      ))}
    </motion.svg>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="type-label text-chalk/62">{title}</p>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}
