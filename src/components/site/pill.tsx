import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type Surface = "bone" | "ink";

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 10"
      className={cn(
        "h-2.5 w-6 shrink-0 transition-transform duration-500 ease-[var(--ease-slow)] group-hover:translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden
    >
      <path d="M0 5h23M18.5 0.5 23 5l-4.5 4.5" />
    </svg>
  );
}

const solid: Record<Surface, string> = {
  bone: "bg-soot text-chalk hover:bg-graphite",
  ink: "bg-chalk text-ink hover:bg-plaster",
};

type PillButtonProps = ComponentProps<"button"> & { surface?: Surface };

/** The one filled button in the system. Used once per view at most. */
export function PillButton({ surface = "bone", className, children, type = "button", ...props }: PillButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "group type-ui inline-flex h-12 items-center gap-4 rounded-full px-7 transition-colors duration-500",
        solid[surface],
        className,
      )}
      {...props}
    >
      {children}
      <Arrow />
    </button>
  );
}

type TextLinkProps = ComponentProps<"a"> & { arrow?: boolean };

/** Quiet inline action: the underline recedes on hover and returns. */
export function TextLink({ className, children, arrow = false, ...props }: TextLinkProps) {
  return (
    <a className={cn("group type-ui inline-flex items-center gap-3", className)} {...props}>
      <span className="relative pb-1">
        {children}
        <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current opacity-50 transition-transform duration-500 ease-[var(--ease-slow)] group-hover:scale-x-0" />
      </span>
      {arrow ? <Arrow /> : null}
    </a>
  );
}
