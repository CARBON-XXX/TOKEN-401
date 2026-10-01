"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

import { useStill } from "./motion-primitives";

/** A hairline across the top of the page that fills as the element with `targetId` is read through. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const still = useStill();
  const span = useRef({ start: 0, length: 1 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const measure = () => {
      const start = el.getBoundingClientRect().top + window.scrollY;
      span.current = { start, length: Math.max(1, el.offsetHeight - window.innerHeight) };
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [targetId]);

  const read = useTransform(scrollY, (y) => Math.min(1, Math.max(0, (y - span.current.start) / span.current.length)));
  const eased = useSpring(read, { stiffness: 140, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-soot"
      style={{ scaleX: still ? read : eased }}
    />
  );
}
