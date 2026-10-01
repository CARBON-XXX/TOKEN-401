"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

export const SLOW = [0.16, 1, 0.3, 1] as const;

const PREFERS_STILL = "(prefers-reduced-motion: reduce)";

function onPreferenceChange(onChange: () => void) {
  const mq = window.matchMedia(PREFERS_STILL);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Like `useReducedMotion`, but false until hydration has finished, so the client's first render
 * matches the server's HTML; readers who prefer less motion switch to the still version right after.
 */
export function useStill() {
  return useSyncExternalStore(
    onPreferenceChange,
    () => window.matchMedia(PREFERS_STILL).matches,
    () => false,
  );
}

function interpolate(v: number, input: readonly number[], output: readonly number[]) {
  if (v <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (v <= input[i]) {
      const span = input[i] - input[i - 1];
      const k = span > 0 ? (v - input[i - 1]) / span : 1;
      return output[i - 1] + (output[i] - output[i - 1]) * k;
    }
  }
  return output[output.length - 1];
}

/**
 * Maps scroll progress onto a value, like `useTransform` with ranges. Computed on the main thread on
 * purpose: Motion would otherwise hand opacity and filter to a native ScrollTimeline, whose ranges
 * disagree with `useScroll` offsets on tall sticky sections.
 */
export function useScrub(progress: MotionValue<number>, input: readonly number[], output: readonly number[]) {
  return useTransform(progress, (v) => interpolate(v, input, output));
}

/** As `useScrub`, for a CSS blur in pixels. */
export function useScrubBlur(progress: MotionValue<number>, input: readonly number[], output: readonly number[]) {
  return useTransform(progress, (v) => `blur(${interpolate(v, input, output)}px)`);
}

type RiseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "li" | "figure" | "header" | "article";
};

/**
 * The system’s only reveal: a fade and a 16px rise, once, as content reaches the reader.
 * With reduced motion the global MotionConfig drops the rise and keeps the fade.
 */
export function Rise({ children, className, delay = 0, as = "div" }: RiseProps) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, delay, ease: SLOW }}
    >
      {children}
    </Tag>
  );
}
