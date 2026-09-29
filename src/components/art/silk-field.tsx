"use client";

import { useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";

import { clamp, easeOutCubic, mulberry32 } from "@/lib/random";
import { useCanvasLoop } from "@/lib/use-canvas-loop";

type SilkFieldProps = {
  className?: string;
  /** Vertical band the silk occupies, as fractions of the canvas height. */
  band?: [number, number];
};

/**
 * Hundreds of hairlines displaced by the same slow noise surface. Adjacent lines move
 * together, so where the surface folds they bunch into bright ridges, like draped silk.
 */
export function SilkField({ className, band = [0.1, 0.95] }: SilkFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;
  const noise = useMemo(() => createNoise3D(mulberry32(1937)), []);
  const grid = useRef({ lines: 0, samples: 0 });

  useCanvasLoop(canvasRef, {
    still: reduce,
    onResize: ({ width, height }) => {
      const span = height * (band[1] - band[0]);
      grid.current = {
        lines: Math.round(clamp(span / 5.2, 60, 150)),
        samples: Math.round(clamp(width / 7, 90, 280)),
      };
    },
    draw: ({ ctx, width, height, time, pointer }) => {
      const { lines, samples } = grid.current;
      const t = reduce ? 6 : time;
      const top = height * band[0];
      const span = height * (band[1] - band[0]);
      const amp = span * 0.34;
      const sigma2 = 2 * 140 * 140;
      const lift = 60 * pointer.active;

      ctx.lineWidth = 0.6;
      ctx.lineJoin = "round";

      for (let i = 0; i < lines; i++) {
        const v = i / (lines - 1);
        const weave = reduce ? 1 : easeOutCubic(clamp((t * 0.55 - v * 0.35) / 1.1));
        if (weave <= 0) continue;
        const last = Math.max(2, Math.round(samples * weave));
        const baseY = top + v * span;
        const envelope = Math.sin(Math.PI * v);
        const alpha = (0.035 + 0.23 * Math.pow(envelope, 1.4)) * (0.35 + 0.65 * weave);

        ctx.beginPath();
        let px = 0;
        let py = 0;
        for (let j = 0; j <= last; j++) {
          const u = j / samples;
          const x = u * width;
          const broad = noise(u * 1.05 + t * 0.018, v * 0.9 - t * 0.012, t * 0.04);
          const fine = noise(u * 2.6 - t * 0.03, v * 2.2, t * 0.06 + 11);
          let y = baseY + envelope * (amp * broad + amp * 0.28 * fine);

          if (lift > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            y -= lift * Math.exp(-(dx * dx + dy * dy) / sigma2) * envelope;
          }

          if (j === 0) ctx.moveTo(x, y);
          else ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
          px = x;
          py = y;
        }
        ctx.lineTo(px, py);
        ctx.strokeStyle = `rgba(243, 241, 236, ${alpha})`;
        ctx.stroke();
      }
    },
  });

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
