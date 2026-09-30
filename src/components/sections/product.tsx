import type { ReactNode } from "react";

import { Gathering } from "@/components/art/gathering";
import { SeedHead } from "@/components/art/seed-head";
import { Rise } from "@/components/site/motion-primitives";
import { SectionHead } from "@/components/site/section-head";

export function Product() {
  return (
    <section id="product" data-surface="bone" aria-labelledby="product-title" className="section-y scroll-mt-[var(--nav-h)]">
      <div className="frame">
        <SectionHead
          id="product-title"
          label="Our first product"
          note="Distributed autonomous cyber defense"
          title="A reflex that acts at once, and a team that thinks it through."
          lede="It defends a whole cluster in two layers. The first contains an attack in milliseconds. The second takes the time to understand it, repair it and prove that it is gone."
        />

        <div className="mt-[clamp(72px,9vw,144px)] grid grid-cols-12 gap-x-6 gap-y-24">
          <Rise as="figure" className="col-span-12 sm:col-span-10 lg:col-span-5">
            <SeedHead className="h-auto w-full" />
            <Caption fig="Fig. 2" title="Tacit" aside="System 1">
              A model of our own that runs beside every workload — one line for each — and never
              stops deciding. When the risk is real it acts at once: freezing a process, revoking a
              token, closing a connection.
            </Caption>
          </Rise>

          <Rise
            as="figure"
            delay={0.1}
            className="col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-5 lg:col-start-8 lg:mt-[clamp(140px,15vw,240px)]"
          >
            <Gathering className="h-auto w-full" />
            <Caption fig="Fig. 3" title="The agents" aside="System 2">
              Seven specialists gather around one shared incident. They investigate, hunt, contain,
              rebuild and verify, check one another’s work, and hold the incident open until it has
              been shown to be closed.
            </Caption>
          </Rise>
        </div>
      </div>
    </section>
  );
}

function Caption({ fig, title, aside, children }: { fig: string; title: string; aside: string; children: ReactNode }) {
  return (
    <figcaption className="mt-10 border-t border-plaster pt-5">
      <p className="type-caption text-stone">{fig}</p>
      <p className="mt-3 flex items-baseline gap-3">
        <span className="type-title text-soot">{title}</span>
        <span className="type-caption text-[1rem] text-stone">{aside}</span>
      </p>
      <p className="type-body mt-3 max-w-[30em] text-graphite">{children}</p>
    </figcaption>
  );
}
