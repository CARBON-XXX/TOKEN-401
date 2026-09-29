"use client";

import type { ReactNode } from "react";

import { ArchFigure } from "@/components/art/figures";
import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { useContact } from "@/components/contact/contact-provider";
import { MaskedLines, PlateHeader, Reveal } from "@/components/site/motion-primitives";
import { Arrow } from "@/components/site/pill";
import type { ContactTopic } from "@/lib/contact";

type Product = {
  name: string;
  kind: string;
  lede: string;
  body: string;
  specs: [string, string][];
  topic: ContactTopic;
  action: string;
  figure: ReactNode;
  caption: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Camellia",
    kind: "Model family",
    lede: "Language models that reason in layers, like petals around a centre.",
    body: "Built for depth, candour, and the grace to say “I’m not sure.” Camellia shows its working, cites its sources, and declines gracefully when a question sits outside what it can responsibly answer.",
    specs: [
      ["Context", "1M tokens"],
      ["Modalities", "Text · Image · Code"],
      ["Status", "Private preview"],
    ],
    topic: "Camellia models",
    action: "Request preview access",
    figure: <CamelliaBloom trigger="inView" className="size-full" strokeWidth={1.25} spread={1.6} />,
    caption: "Fig. 6 — Camellia, in bloom.",
  },
  {
    name: "Threshold",
    kind: "Permissions for agents",
    lede: "A permission layer for autonomous systems that act in the world.",
    body: "Every consequential action — a payment, a deletion, a message sent on your behalf — pauses at a threshold and waits for an explicit, auditable yes. Our answer to 401, made into infrastructure.",
    specs: [
      ["Decision latency", "< 40 ms"],
      ["Audit trail", "Signed · Append-only"],
      ["Status", "Early access"],
    ],
    topic: "Threshold",
    action: "Join early access",
    figure: <ArchFigure className="size-full" delay={0.1} />,
    caption: "Fig. 7 — Nine doorways, one ground.",
  },
];

export function Work() {
  const { openContact } = useContact();

  return (
    <section id="work" className="relative scroll-mt-8 pt-28 pb-32 sm:pt-36 lg:pb-44">
      <div className="frame">
        <PlateHeader numeral="V" label="Work" aside="What we are building" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-24">
          <h2 className="display col-span-12 text-[clamp(2.9rem,6.4vw,6.5rem)] lg:col-span-8">
            <MaskedLines lines={["Two instruments,", <em key="h" className="italic">one intention.</em>]} />
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-2">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.name} delay={i * 0.12} y={28}>
              <article className="group flex h-full flex-col border border-rule-strong bg-paper transition-colors duration-700 hover:bg-[#f6f4f0]">
                <div className="flex items-center justify-between border-b border-rule px-6 py-4 sm:px-9">
                  <span className="eyebrow text-ink">{product.kind}</span>
                  <span className="eyebrow text-ink-4">0{i + 1}</span>
                </div>

                <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden border-b border-rule sm:aspect-[16/11]">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(20,20,19,0.045),transparent_62%)]"
                  />
                  <div className="relative aspect-square h-[62%] text-ink transition-transform duration-[1.8s] ease-[var(--ease-quill)] group-hover:scale-[1.04]">
                    {product.figure}
                  </div>
                  <span className="caption absolute bottom-4 left-6 text-[0.875rem] text-ink-4 sm:left-9">
                    {product.caption}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-6 pt-9 pb-8 sm:px-9 sm:pt-11">
                  <h3 className="display text-[clamp(3rem,5vw,4.75rem)] tracking-[-0.03em]">
                    {product.name}
                  </h3>
                  <p className="mt-6 max-w-[30rem] font-serif text-[1.3125rem] leading-[1.45] text-ink">
                    {product.lede}
                  </p>
                  <p className="mt-5 max-w-[32rem] text-[0.975rem] leading-[1.7] text-ink-3">
                    {product.body}
                  </p>

                  <dl className="mt-10 grid grid-cols-1 border-t border-rule sm:grid-cols-3">
                    {product.specs.map(([term, detail]) => (
                      <div
                        key={term}
                        className="border-b border-rule py-4 sm:border-b-0 sm:py-5 sm:pr-4 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-4"
                      >
                        <dt className="eyebrow text-ink-4">{term}</dt>
                        <dd className="mt-2.5 font-serif text-[1.0625rem] text-ink">{detail}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto pt-10">
                    <button
                      type="button"
                      onClick={() => openContact(product.topic)}
                      className="group/cta flex w-full items-center justify-between border-t border-rule-strong pt-6 text-left text-[0.9375rem] text-ink"
                    >
                      <span className="relative">
                        {product.action}
                        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-ink transition-transform duration-700 ease-[var(--ease-quill)] group-hover/cta:origin-left group-hover/cta:scale-x-100" />
                      </span>
                      <Arrow className="group-hover/cta:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
