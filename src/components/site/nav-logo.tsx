"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useState } from "react";

import { BloomingMark } from "@/components/brand/blooming-mark";
import { RisingWordmark } from "@/components/brand/rising-wordmark";

import { AnchorLink } from "./anchor-link";
import { useStill } from "./motion-primitives";

/** The nav bar itself fades in at 0.4 s; the flower starts inking just after. */
const FIRST_BLOOM_AT = 0.5;

/**
 * The camellia inks itself in on arrival, leans with the speed of the scroll the way a flower
 * moves in a draught, and comes back upright when the page is still. Going back to the
 * beginning draws it again.
 */
export function NavLogo() {
  const still = useStill();
  const [bloom, setBloom] = useState(0);
  const { scrollY } = useScroll();
  const speed = useVelocity(scrollY);
  const lean = useSpring(useTransform(speed, [-1500, 0, 1500], still ? [0, 0, 0] : [-8, 0, 8]), {
    stiffness: 60,
    damping: 11,
    mass: 0.9,
  });

  return (
    <AnchorLink
      href="/#top"
      onClick={() => setBloom((n) => n + 1)}
      className="flex items-center gap-3"
      aria-label="TOKEN/401 — back to the beginning"
    >
      <motion.span className="block" style={{ rotate: lean }}>
        <BloomingMark key={bloom} className="block h-[22px] w-auto" delay={bloom === 0 ? FIRST_BLOOM_AT : 0.1} />
      </motion.span>
      <RisingWordmark trigger="mount" delay={FIRST_BLOOM_AT + 0.45} stagger={0.055} duration={1.3} className="h-[12px] w-auto" />
    </AnchorLink>
  );
}
