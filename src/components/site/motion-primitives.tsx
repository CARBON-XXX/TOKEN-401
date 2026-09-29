"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const QUILL = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "p" | "li" | "span";
};

/** Fades and lifts content the first time it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 18, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay, ease: QUILL }}
    >
      {children}
    </Tag>
  );
}

type MaskedLinesProps = {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "inView";
};

/** Each line rises out of its own clipping mask, like type set into a forme. */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.11,
  trigger = "inView",
}: MaskedLinesProps) {
  const reduce = useReducedMotion();
  const play =
    trigger === "mount"
      ? { animate: "shown" }
      : { whileInView: "shown", viewport: { once: true, amount: 0.5 } };

  return (
    <motion.span className={cn("block", className)} initial={reduce ? false : "hidden"} {...play}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            variants={{
              hidden: { y: "108%", rotate: 1.5 },
              shown: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1.25, delay: delay + i * stagger, ease: QUILL },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** A hairline rule that draws itself from left to right. */
export function Rule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("hairline", className)}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.6, delay, ease: QUILL }}
    />
  );
}

type PlateHeaderProps = {
  numeral: string;
  label: string;
  aside?: string;
  className?: string;
  tone?: "ink" | "paper";
};

/** Folio-style running head: plate numeral, subject, and a marginal note. */
export function PlateHeader({ numeral, label, aside, className, tone = "ink" }: PlateHeaderProps) {
  const muted = tone === "ink" ? "text-ink-3" : "text-paper/55";
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("eyebrow flex items-baseline justify-between gap-6 pb-4", muted)}>
        <span className="flex items-baseline gap-4">
          <span className={tone === "ink" ? "text-ink" : "text-paper"}>Plate {numeral}</span>
          <span aria-hidden>—</span>
          <span>{label}</span>
        </span>
        {aside ? <span className="hidden sm:inline">{aside}</span> : null}
      </div>
      <Rule className={tone === "paper" ? "bg-paper/25" : undefined} />
    </div>
  );
}

type TokenRevealProps = {
  text: string;
  className?: string;
  /** Words to set in italic, matched exactly. */
  emphasis?: string[];
};

/**
 * Words brighten one after another as the passage scrolls through the reading line,
 * the way a model writes: one token at a time.
 */
export function TokenReveal({ text, className, emphasis = [] }: TokenRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1.6 / words.length;
        const clean = word.replace(/[.,—:;]/g, "");
        return (
          <Token
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            italic={emphasis.includes(clean)}
            still={Boolean(reduce)}
          >
            {word}
          </Token>
        );
      })}
    </p>
  );
}

function Token({
  children,
  progress,
  range,
  italic,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  italic: boolean;
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <>
      <motion.span
        className={cn("inline-block", italic && "italic")}
        style={still ? undefined : { opacity, filter: blur }}
      >
        {children}
      </motion.span>{" "}
    </>
  );
}
