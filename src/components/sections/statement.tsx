import { LogLine } from "@/components/site/log-line";
import { Rise } from "@/components/site/motion-primitives";
import { ScrollWords } from "@/components/site/scroll-words";

export function Statement() {
  return (
    <section
      id="approach"
      data-surface="bone"
      data-time="T+03:41.091"
      data-stage="Continue"
      className="section-y scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <Rise>
          <LogLine time="T+03:41.091" stage="Continue" actor="TOKEN/401 · the company" />
        </Rise>

        <header className="mt-[clamp(40px,5vw,80px)]">
          <ScrollWords
            className="type-display-1 max-w-[16em] text-soot"
            segments={[
              {
                text: "We believe the measure of an intelligent system is not how much it can do, but how well it knows",
              },
              { text: "when to stop.", italic: true },
            ]}
          />
        </header>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-20">
          <Rise as="p" className="type-body col-span-12 max-w-[28em] text-graphite sm:col-span-6 lg:col-span-4 lg:col-start-7" delay={0.15}>
            So we build defense at two speeds: a reflex fast enough to stop an attack as it happens,
            and agents that reason with care, show how they reached each decision, and treat
            permission as part of the work rather than an obstacle to it.
          </Rise>
          <Rise as="p" className="type-body col-span-12 max-w-[28em] text-graphite sm:col-span-6 lg:col-span-2" delay={0.25}>
            We are a small team of researchers and security engineers. We publish what we learn,
            including what fails.
          </Rise>
        </div>
      </div>
    </section>
  );
}
