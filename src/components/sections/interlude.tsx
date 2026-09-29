import { SilkField } from "@/components/art/silk-field";
import { MaskedLines, PlateHeader, Reveal } from "@/components/site/motion-primitives";

export function Interlude() {
  return (
    <section
      aria-label="Founding note"
      className="relative isolate overflow-hidden bg-ink text-paper"
    >
      <SilkField
        band={[0.34, 0.98]}
        className="absolute inset-0 -z-10 size-full [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
      />
      <div aria-hidden className="grain-light pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="frame flex min-h-[110svh] flex-col pt-24 pb-16 sm:pt-32">
        <PlateHeader numeral="IV" label="Interlude" aside="From our founding note" tone="paper" />

        <blockquote className="mt-16 max-w-[68rem] lg:mt-24">
          <p className="display text-[clamp(2.4rem,5.6vw,5.75rem)] leading-[1.02] text-paper">
            <MaskedLines
              stagger={0.09}
              lines={[
                "“We don’t want machines",
                "that know everything.",
                <span key="q" className="text-paper/55">
                  We want machines that know
                </span>,
                <em key="e" className="text-paper/55 italic">
                  what they don’t.”
                </em>,
              ]}
            />
          </p>
          <Reveal delay={0.5}>
            <footer className="mt-10 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-paper/40" />
              <cite className="caption text-paper/60 not-italic">
                <span className="italic">The founding note</span>, TOKEN/401 — 2026
              </cite>
            </footer>
          </Reveal>
        </blockquote>

        <div className="eyebrow mt-auto flex justify-between pt-24 text-paper/40">
          <span>Fig. 5 — Silk, 140 threads, one surface</span>
          <span className="hidden sm:inline">Move slowly</span>
        </div>
      </div>
    </section>
  );
}
