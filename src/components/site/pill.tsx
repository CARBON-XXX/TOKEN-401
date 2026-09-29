import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "solid" | "outline" | "paper";

const tones: Record<Tone, string> = {
  solid: "bg-ink text-paper",
  outline: "border border-ink text-ink",
  paper: "bg-paper text-ink",
};

const wipes: Record<Tone, string> = {
  solid: "bg-ink-2",
  outline: "bg-ink",
  paper: "bg-paper-3",
};

const hoverText: Record<Tone, string> = {
  solid: "",
  outline: "group-hover:text-paper",
  paper: "",
};

function PillInner({ children, tone, arrow }: { children: ReactNode; tone: Tone; arrow: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 rounded-[inherit] transition-transform duration-700 ease-[var(--ease-quill)] group-hover:scale-y-100",
          wipes[tone],
        )}
      />
      <span
        className={cn(
          "relative flex items-center gap-3 transition-colors duration-500",
          hoverText[tone],
        )}
      >
        {children}
        {arrow ? <Arrow /> : null}
      </span>
    </>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 10"
      className={cn(
        "h-2.5 w-[1.375rem] transition-transform duration-700 ease-[var(--ease-quill)] group-hover:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M0 5h21M16.5 0.5 21 5l-4.5 4.5" />
    </svg>
  );
}

const base =
  "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-6 text-[0.9375rem] tracking-[0.005em] outline-offset-4";

type PillLinkProps = ComponentProps<"a"> & { tone?: Tone; arrow?: boolean };

export function PillLink({ tone = "solid", arrow = true, className, children, ...props }: PillLinkProps) {
  return (
    <a className={cn(base, tones[tone], className)} {...props}>
      <PillInner tone={tone} arrow={arrow}>
        {children}
      </PillInner>
    </a>
  );
}

type PillButtonProps = ComponentProps<"button"> & { tone?: Tone; arrow?: boolean };

export function PillButton({
  tone = "solid",
  arrow = true,
  className,
  children,
  type = "button",
  ...props
}: PillButtonProps) {
  return (
    <button type={type} className={cn(base, tones[tone], className)} {...props}>
      <PillInner tone={tone} arrow={arrow}>
        {children}
      </PillInner>
    </button>
  );
}

type TextLinkProps = ComponentProps<"a"> & { arrow?: boolean };

/** Quiet inline action: underline recedes and returns on hover. */
export function TextLink({ className, children, arrow = true, ...props }: TextLinkProps) {
  return (
    <a className={cn("group inline-flex items-center gap-3 text-[0.9375rem]", className)} {...props}>
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-700 ease-[var(--ease-quill)] group-hover:origin-right group-hover:scale-x-0" />
      </span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}
