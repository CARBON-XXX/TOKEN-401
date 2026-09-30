import { cn } from "@/lib/utils";

type LogLineProps = {
  time: string;
  stage: string;
  actor: string;
  surface?: "bone" | "ink";
  className?: string;
};

/** The line every chapter of the incident opens with: when, what, and who acted. */
export function LogLine({ time, stage, actor, surface = "bone", className }: LogLineProps) {
  const ink = surface === "ink";
  return (
    <div
      className={cn(
        "type-mono grid grid-cols-12 items-baseline gap-x-6 border-t pt-3",
        ink ? "border-chalk/20 text-chalk/50" : "border-soot/20 text-stone",
        className,
      )}
    >
      <span className={cn("col-span-5 sm:col-span-3", ink ? "text-chalk" : "text-soot")}>{time}</span>
      <span className="col-span-7 sm:col-span-5 lg:col-span-6">{stage}</span>
      <span className="col-span-12 mt-1 sm:col-span-4 sm:mt-0 sm:text-right lg:col-span-3">{actor}</span>
    </div>
  );
}
