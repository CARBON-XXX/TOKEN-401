"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; speed: number; phase: number; alpha: number; soft: boolean };

/**
 * Dust in the air of the ink rooms: a few dozen motes rising very slowly, the same air the cover's
 * light passes through. Drawn on a 2D canvas at low cost; paused whenever it is off screen.
 */
export function Motes({ className, count = 42 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let seed = 11;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const motes: Mote[] = Array.from({ length: count }, (_, i) => {
      const soft = i % 9 === 0;
      return {
        x: rand(),
        y: rand(),
        r: soft ? 5 + rand() * 7 : 0.5 + rand() * 1.1,
        speed: 0.004 + rand() * 0.012,
        phase: rand() * Math.PI * 2,
        alpha: soft ? 0.035 + rand() * 0.03 : 0.12 + rand() * 0.34,
        soft,
      };
    });

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const x = (m.x + Math.sin(t * 0.00012 + m.phase) * 0.012) * w;
        const y = m.y * h;
        const a = m.alpha * (0.65 + 0.35 * Math.sin(t * 0.0007 + m.phase * 3));
        if (m.soft) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, m.r);
          g.addColorStop(0, `rgba(245,243,238,${a})`);
          g.addColorStop(1, "rgba(245,243,238,0)");
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = `rgba(245,243,238,${a})`;
        }
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    let last = performance.now();
    let visible = false;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      for (const m of motes) {
        m.y -= m.speed * dt * (m.soft ? 0.5 : 1);
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = rand();
        }
      }
      draw(now);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (!document.hidden && visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    if (reduce) draw(0);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
