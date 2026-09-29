"use client";

import { useEffect, useRef, type RefObject } from "react";

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D;
  /** CSS pixel size of the canvas. */
  width: number;
  height: number;
  dpr: number;
  /** Seconds since the loop started. */
  time: number;
  /** Pointer position in CSS pixels relative to the canvas, eased. */
  pointer: { x: number; y: number; active: number };
};

type Options = {
  draw: (frame: CanvasFrame) => void;
  onResize?: (size: { width: number; height: number; dpr: number }) => void;
  /** Render a single still frame (reduced motion). */
  still?: boolean;
  maxDpr?: number;
  /** Element that receives pointer events; defaults to the canvas parent. */
  pointerTarget?: RefObject<HTMLElement | null>;
  /** Extra elements whose size changes should re-run layout. */
  observe?: RefObject<HTMLElement | null>;
};

/**
 * Drives a DPR-aware canvas: sizes it to its box, pauses when off-screen or when the
 * tab is hidden, and eases pointer input so interaction feels like moving through water.
 */
export function useCanvasLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { draw, onResize, still = false, maxDpr = 2, pointerTarget, observe }: Options,
) {
  const drawRef = useRef(draw);
  const resizeRef = useRef(onResize);

  useEffect(() => {
    drawRef.current = draw;
    resizeRef.current = onResize;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let pageVisible = !document.hidden;
    let start = performance.now();
    let pausedAt = 0;
    const target = { x: -9999, y: -9999, inside: false };
    const pointer = { x: -9999, y: -9999, active: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      resizeRef.current?.({ width, height, dpr });
      if (still) renderOnce(0);
    };

    const renderOnce = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      drawRef.current({ ctx, width, height, dpr, time, pointer });
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const ease = 0.075;
      if (target.inside) {
        if (pointer.active < 0.01) {
          pointer.x = target.x;
          pointer.y = target.y;
        }
        pointer.x += (target.x - pointer.x) * ease;
        pointer.y += (target.y - pointer.y) * ease;
      }
      pointer.active += ((target.inside ? 1 : 0) - pointer.active) * 0.04;
      renderOnce((now - start) / 1000);
    };

    const play = () => {
      if (still || raf || !visible || !pageVisible) return;
      if (pausedAt) {
        start += performance.now() - pausedAt;
        pausedAt = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      pausedAt = performance.now();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (observe?.current) ro.observe(observe.current);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { rootMargin: "80px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) play();
      else pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const host = pointerTarget?.current ?? canvas.parentElement ?? canvas;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      target.inside = e.pointerType === "mouse" || e.pointerType === "pen";
    };
    const onLeave = () => {
      target.inside = false;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [canvasRef, still, maxDpr, pointerTarget, observe]);
}
