"use client";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { useContact } from "@/components/contact/contact-provider";
import { MaskedLines, PlateHeader, Reveal } from "@/components/site/motion-primitives";
import { PillButton, TextLink } from "@/components/site/pill";
import { CONTACT_EMAIL } from "@/lib/contact";

export function Closing() {
  const { openContact } = useContact();

  return (
    <section id="contact" className="relative scroll-mt-8 pt-10 pb-36 lg:pb-48">
      <div className="frame">
        <PlateHeader numeral="VII" label="Correspondence" aside="We answer every letter" />

        <div className="mt-24 flex flex-col items-center text-center lg:mt-32">
          <div className="aspect-[317/325] w-24 text-ink sm:w-28">
            <CamelliaBloom trigger="inView" className="size-full" strokeWidth={2.2} spread={1.2} />
          </div>

          <h2 className="display mt-14 text-[clamp(3rem,7.4vw,7.75rem)]">
            <MaskedLines
              lines={["Let’s build something", <em key="w" className="italic">worth trusting.</em>]}
            />
          </h2>

          <Reveal delay={0.25}>
            <p className="mx-auto mt-9 max-w-[34rem] font-serif text-[1.1875rem] leading-[1.6] text-ink-2 sm:text-[1.3125rem]">
              Whether you are a researcher, a builder, or simply curious, we would like to hear from
              you. A person will write back.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:gap-9">
            <PillButton onClick={() => openContact()}>Start a conversation</PillButton>
            <TextLink href={`mailto:${CONTACT_EMAIL}`} arrow={false} className="font-mono text-[0.8125rem] tracking-[0.04em]">
              {CONTACT_EMAIL}
            </TextLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
