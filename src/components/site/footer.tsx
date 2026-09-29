"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { CamelliaMark, Wordmark } from "@/components/brand/camellia-mark";
import { useContact } from "@/components/contact/contact-provider";
import { CONTACT_EMAIL } from "@/lib/contact";

import { QUILL } from "./motion-primitives";
import { NAV_LINKS } from "./nav";

export function Footer() {
  const { openContact } = useContact();
  const reduce = useReducedMotion();
  const year = 2026;

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="grain-light pointer-events-none absolute inset-0 opacity-50" />

      <div className="frame relative pt-20 sm:pt-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          <div className="col-span-12 lg:col-span-5">
            <CamelliaMark className="h-12 w-auto text-paper" />
            <p className="mt-8 max-w-[22rem] font-serif text-[1.3125rem] leading-[1.45] text-paper/85">
              Intelligence, unfolding with care. Made slowly, on purpose.
            </p>
          </div>

          <FooterColumn title="Index" className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7">
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="col-span-6 sm:col-span-4 lg:col-span-2">
            <FooterLink as="button" onClick={() => openContact("Careers")}>
              Careers
            </FooterLink>
            <FooterLink as="button" onClick={() => openContact("Research")}>
              Press
            </FooterLink>
            <FooterLink href="#principles">Responsible use</FooterLink>
          </FooterColumn>

          <FooterColumn title="Elsewhere" className="col-span-12 sm:col-span-4 lg:col-span-2">
            <FooterLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</FooterLink>
            <FooterLink href="https://www.linkedin.com" external>
              LinkedIn
            </FooterLink>
            <FooterLink href="https://x.com" external>
              X
            </FooterLink>
          </FooterColumn>
        </div>

        <motion.div
          className="mt-24 sm:mt-32"
          initial={reduce ? false : { opacity: 0, y: "18%" }}
          whileInView={{ opacity: 1, y: "0%" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: QUILL }}
        >
          <Wordmark className="block h-auto w-full text-paper" title="TOKEN/401" />
        </motion.div>

        <div className="eyebrow flex flex-col gap-4 border-t border-paper/15 py-7 text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} TOKEN/401, Inc.</span>
          <span className="flex gap-8">
            <a href="#top" className="transition-colors hover:text-paper">Privacy</a>
            <a href="#top" className="transition-colors hover:text-paper">Terms</a>
            <a href="#top" className="transition-colors hover:text-paper">Back to top ↑</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <p className="eyebrow text-paper/45">{title}</p>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}

type FooterLinkProps =
  | { as?: "a"; href: string; external?: boolean; children: ReactNode; onClick?: never }
  | { as: "button"; onClick: () => void; children: ReactNode; href?: never; external?: never };

function FooterLink(props: FooterLinkProps) {
  const cls =
    "text-left text-[0.9375rem] text-paper/80 transition-colors duration-300 hover:text-paper";
  return (
    <li>
      {props.as === "button" ? (
        <button type="button" onClick={props.onClick} className={cls}>
          {props.children}
        </button>
      ) : (
        <a
          href={props.href}
          className={cls}
          {...(props.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {props.children}
        </a>
      )}
    </li>
  );
}
