import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { Footer } from "@/components/site/footer";
import { Rise } from "@/components/site/motion-primitives";
import { Nav } from "@/components/site/nav";
import { Arrow } from "@/components/site/pill";
import { JOURNAL, getEntry, getNextEntry } from "@/content/journal";

export function generateStaticParams() {
  return JOURNAL.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.dek,
    openGraph: { title: entry.title, description: entry.dek, type: "article" },
  };
}

export default async function JournalEntryPage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  const next = getNextEntry(slug);

  return (
    <>
      <Nav />
      <main>
        <article
          id="top"
          data-surface="bone"
          aria-labelledby="entry-title"
          className="pt-[calc(var(--nav-h)+clamp(64px,9vw,144px))] pb-[clamp(112px,14vw,208px)]"
        >
          <Rise as="header" className="frame flex flex-col items-center text-center">
            <p className="type-label text-stone">
              <Link href="/#journal" className="transition-colors duration-500 hover:text-soot">
                Journal
              </Link>
              <span aria-hidden> · </span>
              {entry.kind}
            </p>
            <h1 id="entry-title" className="type-display-1 mt-10 max-w-[10em] text-soot">
              {entry.title}
            </h1>
            <p className="type-lede mt-8 max-w-[22em] text-graphite">{entry.dek}</p>
            <p className="type-label mt-10 flex flex-col items-center gap-3 text-stone">
              <span>{entry.byline}</span>
              <span>
                <time dateTime={entry.published}>{entry.date}</time> · {entry.readingTime}
              </span>
            </p>
          </Rise>

          <div className="frame mt-[clamp(72px,9vw,128px)]">
            <div className="type-body mx-auto max-w-[34em] space-y-6 border-t border-plaster pt-14 text-soot">
              {entry.opening.map((para, i) => (
                <Rise as="p" key={i}>
                  {para}
                </Rise>
              ))}
            </div>

            <Rise as="figure" className="mx-auto my-[clamp(56px,7vw,104px)] max-w-[44rem] text-center">
              <blockquote className="type-display-2 text-soot">
                <p className="italic">“{entry.pullQuote}”</p>
              </blockquote>
            </Rise>

            <div className="type-body mx-auto max-w-[34em] space-y-6 text-soot">
              {entry.closing.map((para, i) => (
                <Rise as="p" key={i}>
                  {para}
                </Rise>
              ))}
              <div className="flex justify-center pt-10">
                <CamelliaBloom
                  trigger="inView"
                  spread={1.2}
                  strokeWidth={4}
                  className="size-9 text-soot"
                  title="End of the essay"
                />
              </div>
            </div>
          </div>
        </article>

        <section data-surface="bone" aria-label="Next in the journal" className="pb-[clamp(112px,14vw,208px)]">
          <div className="frame">
            <Link
              href={`/journal/${next.slug}`}
              className="group grid grid-cols-12 gap-x-6 gap-y-6 border-t border-soot pt-8"
            >
              <span className="type-label col-span-12 text-stone lg:col-span-3">Next in the journal</span>
              <span className="col-span-12 lg:col-span-9">
                <span className="type-display-1 block text-soot transition-transform duration-700 ease-[var(--ease-slow)] group-hover:translate-x-2">
                  {next.title}
                </span>
                <span className="mt-6 flex items-center gap-4 text-graphite">
                  <span className="type-body">{next.dek}</span>
                  <Arrow />
                </span>
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
