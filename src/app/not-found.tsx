import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/site/footer";
import { Rise } from "@/components/site/motion-primitives";
import { Nav } from "@/components/site/nav";
import { Arrow, buttonClass } from "@/components/site/pill";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Not found",
};

const CODES = [
  { code: "401", state: "Asks first", note: "What we are named for", here: false },
  { code: "404", state: "Nothing here", note: "What this page is", here: true },
] as const;

export default function NotFound() {
  return (
    <>
      <Nav />
      <main>
        <section
          id="top"
          data-surface="bone"
          aria-labelledby="missing-title"
          className="flex min-h-[100svh] flex-col pt-[var(--nav-h)]"
        >
          <div className="frame flex flex-1 flex-col pt-[clamp(48px,9vh,140px)] pb-[clamp(40px,6vh,72px)]">
            <Rise as="header">
              <p className="type-tech text-stone">Error 404</p>
              <h1 id="missing-title" className="type-hero mt-8 text-soot">
                <span className="block">Nothing here.</span>
                <span className="type-voice block text-graphite">Not even a refusal.</span>
              </h1>
            </Rise>

            <div className="mt-[clamp(28px,4.5vh,56px)] grid grid-cols-12 gap-x-6 gap-y-8">
              <Rise
                as="p"
                delay={0.15}
                className="type-lede col-span-12 max-w-[27em] text-graphite sm:col-span-10 lg:col-span-5 lg:col-start-7"
              >
                Our name borrows 401, the answer a system gives when it needs permission before it
                goes on. This is 404, its plainer cousin: the page you asked for does not exist, or
                has moved.
              </Rise>
              <Rise delay={0.25} className="col-span-12 flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-5 lg:col-start-7">
                <Link href="/" className={buttonClass({})}>
                  Back to the beginning
                  <Arrow />
                </Link>
                <Link href="/#journal" className="type-ui font-medium text-soot underline decoration-current/35 underline-offset-[5px]">
                  Read the journal
                </Link>
              </Rise>
            </div>

            <Rise delay={0.35} className="mt-auto pt-[clamp(56px,10vh,120px)]">
              <dl className="grid grid-cols-2 gap-6 border-t border-plaster pt-5 sm:flex sm:gap-20">
                {CODES.map((c) => (
                  <div key={c.code}>
                    <dt className={cn("font-mono text-[0.9375rem] tabular-nums", c.here ? "text-soot" : "text-stone")}>
                      {c.code}
                    </dt>
                    <dd className={cn("type-tech mt-1", c.here ? "text-indigo" : "text-stone")}>{c.state}</dd>
                    <dd className="type-caption mt-3 text-stone">{c.note}</dd>
                  </div>
                ))}
              </dl>
            </Rise>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
