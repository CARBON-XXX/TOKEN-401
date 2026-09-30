"use client";

import { motion, useReducedMotion, useScroll, type MotionValue } from "motion/react";
import { useRef } from "react";

import { useScrub } from "./motion-primitives";

type Segment = { text: string; italic?: boolean };

type ScrollWordsProps = {
  segments: Segment[];
  className?: string;
  id?: string;
};

/** A statement that comes up word by word as it is read, like ink taking on paper. */
export function ScrollWords({ segments, className, id }: ScrollWordsProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.88", "end 0.42"] });

  const words = segments.flatMap((s) =>
    s.text
      .split(" ")
      .filter(Boolean)
      .map((w) => ({ w, italic: s.italic })),
  );
  const n = words.length;

  return (
    <h2 ref={ref} id={id} className={className}>
      {words.map(({ w, italic }, i) => (
        <Word key={i} progress={scrollYProgress} from={i / n} to={(i + 2.5) / n} italic={italic} still={!!reduce}>
          {w}
        </Word>
      ))}
    </h2>
  );
}

function Word({
  progress,
  from,
  to,
  italic,
  still,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  italic?: boolean;
  still: boolean;
  children: string;
}) {
  const opacity = useScrub(progress, [from, Math.min(to, 1)], [0.14, 1]);
  return (
    <>
      <motion.span style={still ? undefined : { opacity }} className={italic ? "italic" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}
