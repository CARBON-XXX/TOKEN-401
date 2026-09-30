import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Rise } from "./motion-primitives";
import { SectionLabel } from "./section-label";

type SectionHeadProps = {
  id: string;
  label: string;
  note?: string;
  title: ReactNode;
  lede?: ReactNode;
  surface?: "bone" | "ink";
  className?: string;
};

export function SectionHead({ id, label, note, title, lede, surface = "bone", className }: SectionHeadProps) {
  const ink = surface === "ink";
  return (
    <div className={className}>
      <Rise>
        <SectionLabel label={label} note={note} surface={surface} />
      </Rise>
      <div className="mt-[clamp(40px,5vw,80px)] grid grid-cols-12 gap-x-6 gap-y-8">
        <Rise as="header" delay={0.06} className="col-span-12 lg:col-span-10">
          <h2 id={id} className={cn("type-display-1 max-w-[14em]", ink ? "text-chalk" : "text-soot")}>
            {title}
          </h2>
        </Rise>
        {lede ? (
          <Rise
            as="p"
            delay={0.14}
            className={cn(
              "type-lede col-span-12 max-w-[30em] sm:col-span-10 lg:col-span-5 lg:col-start-7",
              ink ? "text-chalk/68" : "text-graphite",
            )}
          >
            {lede}
          </Rise>
        ) : null}
      </div>
    </div>
  );
}
