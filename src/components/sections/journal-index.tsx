import Link from "next/link";

import { Rise } from "@/components/site/motion-primitives";
import { Arrow } from "@/components/site/pill";
import { JOURNAL } from "@/content/journal";

export function JournalIndex() {
  return (
    <section
      id="journal"
      data-surface="bone"
      aria-labelledby="journal-title"
      className="pb-[clamp(112px,14vw,208px)] scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-plaster pt-[clamp(72px,9vw,128px)]">
          <Rise className="col-span-12 lg:col-span-3">
            <p className="type-label text-stone">Journal</p>
          </Rise>
          <Rise as="header" className="col-span-12 lg:col-span-9" delay={0.1}>
            <h2 id="journal-title" className="type-display-2 max-w-[12em] text-soot">
              Notes, kept in public — including the ones that went wrong.
            </h2>
          </Rise>
        </div>

        <ul className="mt-[clamp(56px,7vw,112px)] border-t border-soot">
          {JOURNAL.map((entry, i) => (
            <Rise as="li" key={entry.slug} delay={i * 0.08} className="border-b border-plaster">
              <Link
                href={`/journal/${entry.slug}`}
                className="group grid grid-cols-12 gap-x-6 gap-y-3 py-8 sm:py-10"
              >
                <span className="type-label col-span-6 text-stone sm:col-span-3 lg:col-span-2">
                  <time dateTime={entry.published}>{entry.date}</time>
                </span>
                <span className="type-label col-span-6 text-right text-stone sm:col-span-9 sm:text-left lg:col-span-1">
                  {entry.kind}
                </span>
                <span className="col-span-12 sm:col-span-9 sm:col-start-4 lg:col-span-5 lg:col-start-4">
                  <span className="block font-display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-[1.02] font-light tracking-[-0.012em] text-soot transition-transform duration-700 ease-[var(--ease-slow)] group-hover:translate-x-2">
                    {entry.title}
                  </span>
                </span>
                <span className="type-body col-span-12 text-graphite sm:col-span-8 sm:col-start-4 lg:col-span-3 lg:col-start-9 lg:self-center">
                  {entry.dek}
                </span>
                <span className="hidden text-soot lg:col-span-1 lg:col-start-12 lg:flex lg:items-center lg:justify-end">
                  <Arrow />
                </span>
              </Link>
            </Rise>
          ))}
        </ul>
      </div>
    </section>
  );
}
