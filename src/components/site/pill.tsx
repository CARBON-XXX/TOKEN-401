import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Surface = "bone" | "ink";
type Tone = "solid" | "outline";

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-3.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden
    >
      <path d="M2 8h11.5M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

const tones: Record<Surface, Record<Tone, string>> = {
  bone: {
    solid: "bg-soot text-chalk hover:bg-graphite active:bg-ink",
    outline: "border border-soot/20 text-soot hover:border-soot/45 active:bg-soot/[0.06]",
  },
  ink: {
    solid: "bg-chalk text-ink hover:bg-plaster active:bg-plaster/80",
    outline: "border border-chalk/25 text-chalk hover:border-chalk/55 active:bg-chalk/[0.08]",
  },
};

/** A press sets the button a pixel into the page, like type into paper. */
const base =
  "type-ui inline-flex h-11 items-center gap-2.5 rounded-[4px] px-5 font-medium transition-[color,background-color,border-color,translate] duration-300 active:translate-y-px active:duration-75";

export function buttonClass({ surface = "bone", tone = "solid", className }: { surface?: Surface; tone?: Tone; className?: string }) {
  return cn(base, tones[surface][tone], className);
}

type PillButtonProps = ComponentProps<"button"> & { surface?: Surface; tone?: Tone; arrow?: boolean };

export function PillButton({
  surface = "bone",
  tone = "solid",
  arrow = true,
  className,
  children,
  type = "button",
  ...props
}: PillButtonProps) {
  return (
    <button type={type} className={buttonClass({ surface, tone, className })} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<"a"> & { surface?: Surface; tone?: Tone; arrow?: boolean };

export function ButtonLink({ surface = "bone", tone = "solid", arrow = true, className, children, ...props }: ButtonLinkProps) {
  return (
    <a className={buttonClass({ surface, tone, className })} {...props}>
      {children}
      {arrow ? <Arrow /> : null}
    </a>
  );
}

type TextLinkProps = ComponentProps<"a"> & { arrow?: boolean };

/** Quiet inline action, underlined. */
export function TextLink({ className, children, arrow = false, ...props }: TextLinkProps) {
  return (
    <a className={cn("type-ui inline-flex items-center gap-2 font-medium", className)} {...props}>
      <span className="underline decoration-current/35 underline-offset-[5px]">{children}</span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}
