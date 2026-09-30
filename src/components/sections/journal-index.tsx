import Link from "next/link";

import { Rise } from "@/components/site/motion-primitives";
import { Arrow } from "@/components/site/pill";
import { SectionLabel } from "@/components/site/section-label";
import { JOURNAL } from "@/content/journal";

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

        <ul className="mt-[clamp(40px,5vw,72px)] grid gap-px border border-plaster bg-plaster md:grid-cols-3">
          {JOURNAL.map((entry, i) => (
            <Rise as="li" key={entry.slug} delay={i * 0.08} className="bg-bone">
              <Link href={`/journal/${entry.slug}`} className="flex h-full flex-col p-6 sm:p-8">
                <span className="type-tech flex items-center justify-between text-stone">
                  <span>{entry.kind}</span>
                  <time dateTime={entry.published}>{entry.date}</time>
                </span>
                <span className="type-title mt-16 block text-soot">{entry.title}</span>
                <span className="type-body mt-3 block text-graphite">{entry.dek}</span>
                <span className="type-ui mt-auto flex items-center gap-2 pt-10 font-medium text-soot">
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
