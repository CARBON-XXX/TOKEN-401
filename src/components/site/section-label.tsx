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
        "type-label flex items-baseline justify-between gap-6 border-t pt-3",
        ink ? "border-chalk/20 text-chalk/55" : "border-soot/15 text-stone",
        className,
      )}
    >
      <span className={ink ? "text-chalk" : "text-soot"}>{label}</span>
      {note ? <span className="text-right">{note}</span> : null}
    </div>
  );
}
