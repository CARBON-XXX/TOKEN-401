import { mulberry32, r2 } from "@/lib/random";

/** All figures share a 240×240 plate. */
export const PLATE = 240;
const C = PLATE / 2;

const f1 = (n: number) => Math.round(n * 10) / 10;
const polyline = (pts: [number, number][]) =>
  "M" + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L");

/** A damped two-pendulum harmonograph: four lobes slowly settling toward stillness. */
export function harmonographPath() {
  const f = [3, 1, 3.006, 1];
  const p = [0, Math.PI / 2, Math.PI / 2, 0];
  const d = [0.003, 0.004, 0.0035, 0.005];
  const pts: [number, number][] = [];
  for (let t = 0; t < 236; t += 0.075) {
    const x =
      Math.sin(f[0] * t + p[0]) * Math.exp(-d[0] * t) +
      Math.sin(f[1] * t + p[1]) * Math.exp(-d[1] * t);
    const y =
      Math.sin(f[2] * t + p[2]) * Math.exp(-d[2] * t) +
      Math.sin(f[3] * t + p[3]) * Math.exp(-d[3] * t);
    pts.push([C + x * 52, C + y * 52]);
  }
  return polyline(pts);
}

/** Contour lines of a small hill, each held inside one perfect boundary circle. */
export function topographyPaths() {
  const rand = mulberry32(7);
  const phases = Array.from({ length: 5 }, () => rand() * Math.PI * 2);
  const out: string[] = [];
  for (let k = 1; k < 15; k++) {
    const base = 104 - k * 7.1;
    if (base < 4) break;
    const pts: [number, number][] = [];
    const n = 150;
    const cx = C + k * 1.6;
    const cy = C - k * 1.1;
    for (let i = 0; i <= n; i++) {
      const th = (i / n) * Math.PI * 2;
      let w = 0;
      for (let h = 0; h < 5; h++) {
        w += Math.sin(th * (h + 1) + phases[h] + k * 0.23 * (h + 1)) / (h + 1.6);
      }
      const r = base + w * (2.2 + k * 0.35) * Math.min(1, base / 30);
      pts.push([cx + Math.cos(th) * r, cy + Math.sin(th) * r]);
    }
    out.push(polyline(pts) + "Z");
  }
  return out;
}

export const BOUNDARY_PATH = `M${C} ${C - 104}A104 104 0 1 1 ${C - 0.01} ${C - 104}`;

/** Seeds placed on the golden angle; one continuous path so they draw centre-outward. */
export function phyllotaxisPath() {
  const golden = Math.PI * (3 - Math.sqrt(5));
  let d = "";
  for (let n = 1; n < 260; n++) {
    const r = 6.6 * Math.sqrt(n);
    if (r > 104) break;
    const th = n * golden;
    const x = C + r * Math.cos(th);
    const y = C + r * Math.sin(th);
    const s = 0.9 + 3.2 * (r / 104);
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    const deg = Math.round((th * 180) / Math.PI) % 360;
    const ax = r2(x - ux * s);
    const ay = r2(y - uy * s);
    const bx = r2(x + ux * s);
    const by = r2(y + uy * s);
    const rx = f1(s);
    const ry = f1(s * 0.62);
    d += `M${ax} ${ay}A${rx} ${ry} ${deg} 0 1 ${bx} ${by}A${rx} ${ry} ${deg} 0 1 ${ax} ${ay}`;
  }
  return d;
}

/** Nested doorways standing on one ground line. */
export function archPaths() {
  const out: string[] = [];
  const ground = 216;
  for (let k = 0; k < 9; k++) {
    const w = 150 - k * 14;
    const h = 190 - k * 16;
    const x0 = C - w / 2;
    const x1 = C + w / 2;
    const r = w / 2;
    const top = ground - h + r;
    out.push(`M${x0} ${ground}L${x0} ${top}A${r} ${r} 0 0 1 ${x1} ${top}L${x1} ${ground}`);
  }
  return out;
}

export const GROUND_PATH = "M18 216L222 216";
