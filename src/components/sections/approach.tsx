import { InkPath, InkSvg } from "@/components/art/ink";
import { PlateHeader, Reveal, TokenReveal } from "@/components/site/motion-primitives";

const PASSAGE =
  "Every answer a model gives is written one token at a time. Each token is a small decision — and small decisions, made with care, become character. We believe the most important thing an intelligent system can learn is when to stop, and ask.";

const ENTRIES = [
  {
    word: "to·ken",
    phonetic: "/ˈtō-kən/",
    kind: "noun",
    senses: [
      "The smallest unit of meaning a model can hold.",
      "A sign of trust, given freely — and kept.",
    ],
  },
  {
    word: "four·oh·one",
    phonetic: "/ˌfôr-ō-ˈwən/",
    kind: "status",
    senses: [
      "The answer a system gives when it must not proceed without permission.",
      "The discipline of asking first.",
    ],
  },
] as const;

export function Approach() {
  return (
    <section id="approach" className="relative scroll-mt-8 pt-28 pb-32 sm:pt-36 lg:pb-44">
      <div className="frame">
        <PlateHeader numeral="II" label="Approach" aside="On the name" />

        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 lg:mt-24">
          <Reveal className="col-span-12 lg:col-span-3">
            <p className="caption text-ink-3">A note from the founders</p>
            <p className="eyebrow mt-4 leading-[1.8] text-ink-4">
              Written slowly
              <br />
              Read in 40 seconds
            </p>
          </Reveal>
          <div className="col-span-12 lg:col-span-9">
            <TokenReveal
              text={PASSAGE}
              emphasis={["care", "stop", "ask"]}
              className="font-serif text-[clamp(1.85rem,3.6vw,3.5rem)] leading-[1.14] font-light tracking-[-0.018em] text-ink"
            />
          </div>
        </div>

        <div className="relative mt-24 grid grid-cols-12 gap-x-6 gap-y-16 lg:mt-36">
          {ENTRIES.map((entry, i) => (
            <Reveal
              key={entry.word}
              delay={i * 0.12}
              className={
                i === 0
                  ? "col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-4"
                  : "col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-9"
              }
            >
              <article>
                <div className="flex items-baseline justify-between border-t border-rule-strong pt-5">
                  <h3 className="font-serif text-[2.5rem] leading-none font-light tracking-[-0.02em]">
                    {entry.word}
                  </h3>
                  <span className="eyebrow text-ink-4">{entry.kind}</span>
                </div>
                <p className="caption mt-3 text-ink-3">{entry.phonetic}</p>
                <ol className="mt-6 space-y-3">
                  {entry.senses.map((sense, n) => (
                    <li key={n} className="flex gap-4 font-serif text-[1.125rem] leading-[1.55] text-ink-2">
                      <span className="eyebrow pt-[0.45em] text-ink-4">{n + 1}.</span>
                      <span>{sense}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          ))}
          <InkSvg
            viewBox="0 0 60 200"
            className="pointer-events-none absolute top-[-2rem] left-[62.5%] hidden h-[15rem] w-auto -translate-x-1/2 text-ink-4 lg:block"
            strokeWidth={0.6}
          >
            <InkPath d="M52 4 8 196" duration={1.8} />
          </InkSvg>
        </div>
      </div>
    </section>
  );
}
