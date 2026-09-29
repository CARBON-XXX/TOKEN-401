"use client";

import { useReducedMotion } from "motion/react";
import { useMemo, useRef, type RefObject } from "react";
import { createNoise3D } from "simplex-noise";

import { clamp, easeOutCubic, mulberry32 } from "@/lib/random";
import { useCanvasLoop } from "@/lib/use-canvas-loop";

type ContourFieldProps = {
  /** Element whose centre the rings emanate from (the drawn camellia). */
  anchorRef: RefObject<HTMLElement | null>;
  className?: string;
  /** Seconds before the first ring begins to spread. */
  startDelay?: number;
};

type Ring = { base: number; amp: number; freq: number; alpha: number; points: number; petal: number };

const TAU = Math.PI * 2;

/**
 * Concentric, slowly breathing contour lines around the bloom. Near the flower they
 * keep its six-fold silhouette; further out they loosen into free, water-like ripples.
 */
export function ContourField({ anchorRef, className, startDelay = 1.2 }: ContourFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const noise = useMemo(() => createNoise3D(mulberry32(401)), []);
  const layout = useRef({ cx: 0, cy: 0, rings: [] as Ring[] });

  useCanvasLoop(canvasRef, {
    still: reduce,
    observe: anchorRef,
    onResize: ({ width, height }) => {
      const canvas = canvasRef.current;
      const anchor = anchorRef.current;
      if (!canvas) return;
      const c = canvas.getBoundingClientRect();
      const a = anchor?.getBoundingClientRect();
      const cx = a ? a.left - c.left + a.width / 2 : width * 0.7;
      const cy = a ? a.top - c.top + a.height / 2 : height * 0.5;
      const r0 = a ? (a.width / 2) * 1.04 : Math.min(width, height) * 0.2;
      const far = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(width - cx, cy),
        Math.hypot(cx, height - cy),
        Math.hypot(width - cx, height - cy),
      );

      const rings: Ring[] = [];
      let base = r0;
      let gap = Math.max(7, r0 * 0.052);
      for (let k = 0; base < far * 1.05 && k < 72; k++) {
        const out = (base - r0) / Math.max(1, far - r0);
        rings.push({
          base,
          amp: 3 + (base - r0) * 0.085,
          freq: 0.9 + out * 0.9,
          alpha: 0.05 + 0.3 * Math.pow(1 - clamp(out), 1.6),
          points: Math.round(clamp((TAU * base) / 5, 140, 520)),
          petal: r0 * 0.055 * Math.exp(-k / 5),
        });
        base += gap;
        gap *= 1.042;
      }
      layout.current = { cx, cy, rings };
    },
    draw: ({ ctx, time, pointer }) => {
      const { cx, cy, rings } = layout.current;
      const t = reduce ? 0 : time;
      const spread = t - startDelay;
      const sigma2 = 2 * 110 * 110;
      const push = 34 * pointer.active;

      ctx.lineWidth = 0.75;
      ctx.lineJoin = "round";

      for (let k = 0; k < rings.length; k++) {
        const ring = rings[k];
        const reveal = reduce ? 1 : easeOutCubic(clamp((spread - k * 0.05) / 1.6));
        if (reveal <= 0) continue;

        const pulse = Math.sin(k * 0.42 - t * 0.55) * (1.2 + k * 0.05);
        const base = ring.base * (0.9 + 0.1 * reveal) + pulse;
        const z = t * 0.045 + k * 0.035;
        const n = ring.points;

        ctx.beginPath();
        let fx = 0;
        let fy = 0;
        let px = 0;
        let py = 0;
        for (let i = 0; i <= n; i++) {
          const th = (i % n) / n * TAU;
          const c = Math.cos(th);
          const s = Math.sin(th);
          const wobble = noise(c * ring.freq, s * ring.freq, z) * ring.amp;
          const petal = Math.cos(6 * (th + Math.PI / 2)) * ring.petal;
          const r = base + wobble + petal;
          let x = cx + c * r;
          let y = cy + s * r;

          if (push > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < sigma2 * 4) {
              const f = (push * Math.exp(-d2 / sigma2)) / (Math.sqrt(d2) + 1);
              x += dx * f;
              y += dy * f;
            }
          }

          if (i === 0) {
            fx = x;
            fy = y;
            ctx.moveTo(x, y);
          } else {
            ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
          }
          px = x;
          py = y;
        }
        ctx.quadraticCurveTo(px, py, fx, fy);
        ctx.strokeStyle = `rgba(20, 20, 19, ${ring.alpha * reveal})`;
        ctx.stroke();
      }
    },
  });

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
