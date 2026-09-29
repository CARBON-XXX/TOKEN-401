import { Rise } from "@/components/site/motion-primitives";

export function Statement() {
  return (
    <section id="approach" data-surface="bone" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame grid grid-cols-12 gap-x-6 gap-y-10">
        <Rise className="col-span-12 lg:col-span-3">
          <p className="type-label text-stone">Approach</p>
        </Rise>

        <Rise as="header" className="col-span-12 lg:col-span-9" delay={0.1}>
          <h2 className="type-display-2 max-w-[17em] text-soot">
            We believe the measure of an intelligent system is not how much it can do, but how
            well it knows <em className="italic">when to stop.</em>
          </h2>
        </Rise>

        <div className="col-span-12 mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:col-span-8 lg:col-start-4 lg:mt-14">
          <Rise as="p" className="type-body max-w-[26em] text-graphite" delay={0.15}>
            So we build models that reason slowly and speak plainly. They are trained to say what
            they don’t know, to show how they reached an answer, and to treat a person’s permission
            as part of the work rather than an obstacle to it.
          </Rise>
          <Rise as="p" className="type-body max-w-[26em] text-graphite" delay={0.25}>
            We are a small team of researchers, engineers and writers. We publish what we learn,
            including what fails, and we would rather be trusted in ten years than admired this
            week.
          </Rise>
        </div>
      </div>
    </section>
  );
}
