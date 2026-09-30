import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { LogLine } from "./log-line";
import { Rise } from "./motion-primitives";

type SectionHeadProps = {
  id: string;
  time: string;
  stage: string;
  actor: string;
  title: ReactNode;
  lede?: ReactNode;
  surface?: "bone" | "ink";
  className?: string;
};

export function SectionHead({ id, time, stage, actor, title, lede, surface = "bone", className }: SectionHeadProps) {
  const ink = surface === "ink";
  return (
    <div className={className}>
      <Rise>
        <LogLine time={time} stage={stage} actor={actor} surface={surface} />
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
