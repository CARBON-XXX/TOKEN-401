import { cn } from "@/lib/utils";

type SectionLabelProps = {
  label: string;
  note?: string;
  surface?: "bone" | "ink";
  className?: string;
};

/** The quiet rule each section opens on: what it is, and a note on the right. */
export function SectionLabel({ label, note, surface = "bone", className }: SectionLabelProps) {
  const ink = surface === "ink";
  return (
    <div
      className={cn(
        "type-label flex flex-col gap-1.5 border-t pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6",
        ink ? "border-chalk/20 text-chalk/55" : "border-soot/15 text-stone",
        className,
      )}
    >
      <span className={ink ? "text-chalk" : "text-soot"}>{label}</span>
      {note ? <span className="sm:text-right">{note}</span> : null}
    </div>
  );
}
