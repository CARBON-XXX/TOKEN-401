"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/camellia-mark";
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
    <footer data-surface="ink" className="ink-field relative overflow-hidden bg-ink text-chalk">
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 border-t border-chalk/14 pt-16 sm:pt-20">
          <p className="type-lede col-span-12 max-w-[16em] text-chalk lg:col-span-5">
            An AI research company, made slowly and on purpose.
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
              <button type="button" onClick={() => openContact("Research")} className={linkClass}>
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

        <motion.div
          className="mt-24 sm:mt-32"
          initial={reduce ? false : { opacity: 0, y: "18%" }}
          whileInView={{ opacity: 1, y: "0%" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, ease: SLOW }}
        >
          <Wordmark className="block h-auto w-full text-chalk" title="TOKEN/401" />
        </motion.div>

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

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="type-label text-chalk/62">{title}</p>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}
