/** Small deterministic PRNG so generative art renders identically on server and client. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Round for SVG path output; keeps markup small and SSR/CSR output stable. */
export const r2 = (n: number) => Math.round(n * 100) / 100;
