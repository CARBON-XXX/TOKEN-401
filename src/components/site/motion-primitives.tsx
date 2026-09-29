"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export const SLOW = [0.16, 1, 0.3, 1] as const;

type RiseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "li" | "figure" | "header" | "article";
};

/** The system’s only reveal: a fade and a 16px rise, once, as content reaches the reader. */
export function Rise({ children, className, delay = 0, as = "div" }: RiseProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, delay, ease: SLOW }}
    >
      {children}
    </Tag>
  );
}
