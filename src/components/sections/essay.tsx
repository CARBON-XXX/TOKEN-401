import Image from "next/image";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { Rise } from "@/components/site/motion-primitives";

import plaster from "../../../public/images/camellia-plaster.jpg";

export function Essay() {
  return (
    <section data-surface="bone" aria-labelledby="essay-title" className="pb-[clamp(112px,14vw,208px)]">
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14 border-t border-plaster pt-[clamp(72px,9vw,128px)]">
          <Rise
            as="figure"
            className="order-last col-span-7 sm:col-span-4 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:order-none lg:col-span-3 lg:self-start"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-plaster">
              <Image
                src={plaster}
                alt="A single camellia and its leaves against a cracked plaster wall, in black and white."
                placeholder="blur"
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 58vw"
                className="size-full object-cover grayscale"
              />
            </div>
            <figcaption className="type-caption mt-4 text-stone">
              Camellia japonica, which flowers in winter.
            </figcaption>
          </Rise>

          <article className="col-span-12 lg:col-span-6 lg:col-start-6">
            <Rise as="header">
              <p className="type-label text-stone">On the name</p>
              <h2 id="essay-title" className="type-display-2 mt-8 max-w-[11em] text-soot">
                Why we named a company after a refusal.
              </h2>
              <p className="type-label mt-8 text-stone">By the founders · Four minutes</p>
            </Rise>

            <div className="type-body mt-14 max-w-[34em] space-y-6 text-soot">
              <Rise as="p" className="drop-cap">
                A token is the smallest piece of language a model can hold — a syllable, a word, a
                comma. Everything an AI says is built from them, one after another, each a small
                decision about what comes next.
              </Rise>
              <Rise as="p">
                401 is what a system says when it will not go on without permission. In the grammar
                of the internet it is a polite refusal: not <em>no</em>, but not yet — who’s asking?
              </Rise>
              <Rise as="p">
                We put the two together because we believe the next era of intelligence will be
                defined less by how much a machine can do than by how well it knows when to stop. A
                model that can write, reason and act in the world should also be able to pause, say
                what it doesn’t know, and ask.
              </Rise>
              <Rise as="p">
                The camellia came later. It flowers in the depths of winter, when almost nothing
                else will, and it is the plant that gave the world tea — and with it, a ritual built
                entirely around patience. It seemed right for a company that intends to take its
                time.
              </Rise>
            </div>

            <CamelliaBloom
              trigger="inView"
              spread={1.2}
              strokeWidth={4}
              className="mt-14 size-9 text-soot"
            />
          </article>
        </div>
      </div>
    </section>
  );
}
