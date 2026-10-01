"use client";

import type { ReactNode } from "react";

import { RisingWordmark } from "@/components/brand/rising-wordmark";
import { useContact } from "@/components/contact/contact-provider";
import { CONTACT_EMAIL } from "@/lib/contact";

import { AnchorLink } from "./anchor-link";
import { NAV_LINKS } from "./nav";

const linkClass = "type-ui text-left text-chalk/62 transition-colors duration-500 hover:text-chalk";

const INKS = [
  { name: "Charcoal", color: "var(--ink)" },
  { name: "Indigo", color: "var(--indigo)" },
  { name: "Clay", color: "var(--clay)" },
  { name: "Cinnabar", color: "var(--rubric)" },
] as const;

export function Footer() {
  const { openContact } = useContact();

  return (
    <footer data-surface="ink" className="relative overflow-hidden bg-ink text-chalk">
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 border-t border-chalk/14 pt-16 sm:pt-20">
          <p className="type-lede col-span-12 max-w-[16em] text-chalk lg:col-span-5 lg:row-start-1">
            Autonomous defense for the systems the world now runs on.
          </p>

          <FooterColumn title="Index" className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7 lg:row-span-2 lg:row-start-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className={linkClass}>
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Company" className="col-span-6 sm:col-span-4 lg:col-span-2 lg:row-span-2 lg:row-start-1">
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

          <FooterColumn title="Correspondence" className="col-span-12 sm:col-span-4 lg:col-span-2 lg:row-span-2 lg:row-start-1">
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

          <div className="col-span-12 border-t border-chalk/14 pt-6 sm:col-span-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end lg:border-0 lg:pt-0">
            <p className="type-label text-chalk/62">Colophon</p>
            <p className="type-caption mt-3 max-w-[30em] text-chalk/62">
              Set in Instrument Sans, Newsreader and Geist Mono. Printed in four inks on bone.
            </p>
            <ul className="type-tech mt-4 flex flex-wrap gap-x-5 gap-y-2 text-chalk/55">
              {INKS.map((ink) => (
                <li key={ink.name} className="flex items-center gap-2">
                  <span aria-hidden className="size-2.5 rounded-[1px] ring-1 ring-chalk/25" style={{ background: ink.color }} />
                  {ink.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 sm:mt-32">
          <RisingWordmark className="block h-auto w-full text-chalk" title="TOKEN/401" />
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

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="type-label text-chalk/62">{title}</p>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}
