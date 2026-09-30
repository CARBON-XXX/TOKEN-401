/** Geometry for hand-feeling forms: pebbles, seed heads. Deterministic, so server and client agree. */

export const round = (v: number) => Math.round(v * 100) / 100;

/** A repeatable pseudo-random value in [0, 1) for a given index and seed. */
export function grain(i: number, seed = 0) {
  const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

type Pebble = { cx: number; cy: number; r: number; seed: number; stretch?: number; turn?: number };

/** A closed, softly irregular outline, like a stone worn smooth. */
export function pebblePath({ cx, cy, r, seed, stretch = 1.12, turn = 0 }: Pebble) {
  const n = 12;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k =
      1 +
      0.1 * Math.sin(2 * a + seed * 1.7) +
      0.06 * Math.sin(3 * a + seed * 2.9) +
      0.035 * Math.sin(5 * a + seed * 0.7);
    const x = Math.cos(a) * r * k * stretch;
    const y = Math.sin(a) * r * k;
    const c = Math.cos(turn);
    const s = Math.sin(turn);
    return [cx + x * c - y * s, cy + x * s + y * c] as const;
  });
  let d = `M${round(pts[0][0])} ${round(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return `${d} Z`;
}
