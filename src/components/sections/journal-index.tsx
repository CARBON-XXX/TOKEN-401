import Link from "next/link";

import { Rise } from "@/components/site/motion-primitives";
import { Arrow } from "@/components/site/pill";
import { SectionLabel } from "@/components/site/section-label";
import { JOURNAL, stampDate } from "@/content/journal";

export function JournalIndex() {
  return (
    <section id="journal" data-surface="bone" aria-labelledby="journal-title" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame">
        <Rise>
          <SectionLabel label="Research" note="Notes kept in public, including what failed" />
        </Rise>
        <Rise as="header" delay={0.06} className="mt-[clamp(40px,5vw,80px)]">
          <h2 id="journal-title" className="type-display-1 text-soot">
            From the journal
          </h2>
        </Rise>

        <ul className="mt-[clamp(40px,5vw,72px)] border-t border-plaster lg:grid lg:grid-cols-3 lg:gap-px lg:border lg:bg-plaster">
          {JOURNAL.map((entry, i) => (
            <Rise as="li" key={entry.slug} delay={i * 0.08} className="border-b border-plaster bg-bone lg:border-0">
              <Link
                href={`/journal/${entry.slug}`}
                className="grid grid-cols-12 gap-x-6 py-7 sm:py-9 lg:flex lg:h-full lg:flex-col lg:p-8"
              >
                <span className="type-tech col-span-12 flex justify-between gap-4 text-stone md:col-span-3 md:flex-col md:justify-start md:gap-1.5 lg:flex-row lg:justify-between">
                  <span>{entry.kind}</span>
                  <time dateTime={entry.published}>{stampDate(entry.published)}</time>
                </span>
                <span className="col-span-12 mt-4 block md:col-span-7 md:mt-0 lg:mt-16">
                  <span className="type-title block text-soot">{entry.title}</span>
                  <span className="type-body mt-3 block max-w-[34em] text-graphite">{entry.dek}</span>
                </span>
                <span className="type-ui col-span-12 mt-5 flex items-center gap-2 font-medium text-soot md:col-span-2 md:mt-0 md:justify-end md:self-start lg:mt-auto lg:justify-start lg:self-auto lg:pt-10">
                  Read <Arrow />
                </span>
              </Link>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}
