import { Rise } from "@/components/site/motion-primitives";
import { ScrollWords } from "@/components/site/scroll-words";
import { SectionLabel } from "@/components/site/section-label";

export function Statement() {
  return (
    <section id="approach" data-surface="bone" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame">
        <Rise>
          <SectionLabel label="The company" note="TOKEN/401, Inc." />
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

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-6 lg:mt-20">
          <Rise as="p" className="type-lede col-span-12 max-w-[27em] text-graphite sm:col-span-10 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-7" delay={0.15}>
            So we build defense at two speeds: a reflex fast enough to stop an attack as it happens,
            and agents that reason with care, show how they reached each decision, and treat
            permission as part of the work rather than an obstacle to it.
          </Rise>
          <Rise as="p" className="type-body col-span-12 max-w-[30em] text-stone sm:col-span-10 md:col-span-8 md:col-start-5 lg:col-span-5 lg:col-start-7" delay={0.25}>
            We are a small team of researchers and security engineers. We publish what we learn,
            including what fails.
          </Rise>
        </div>
      </div>
    </section>
  );
}
