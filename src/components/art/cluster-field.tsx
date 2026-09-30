"use client";

import { useEffect, useRef } from "react";

/*
 * The cluster as a plotted map on paper: every dot a workload, every square a region's coordinator,
 * receding towards the horizon. Every few seconds one incident plays through — an intrusion moves
 * laterally, Tacit cuts it off, agents leave the coordinator, the nodes are rebuilt and the region is
 * verified. Illustrative only; it is not connected to anything.
 */

export type IncidentPhase = "calm" | "detected" | "contained" | "recovered" | "verified";

type Node = { x: number; z: number; size: number; region: number; hub: boolean };
type Incident = { start: number; hub: number; a: number; b: number; c: number; hunts: [number, number] };

const COUNT = 2000;
const PERIOD = 11;
const PIVOT = 60;
const T = { reachB: 0.8, contain: 1.05, agents: 1.7, rebuild: 4.0, verify: 5.4, verified: 6.0, rest: 9.8 };
const INK = "27,26,24";
const RUBRIC = "163,48,58";

function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (rand: () => number) => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function buildCluster() {
  const rand = random(401);
  const regions = Array.from({ length: 16 }, (_, i) => {
    const z = 16 + Math.pow(i / 15, 1.3) * 140 + (rand() - 0.5) * 8;
    const half = 1.2 * (5 + 0.92 * z);
    return { x: (rand() * 2 - 1) * half * 0.9, z, r: 2 + z * 0.04 + rand() * 2.4 };
  });
  const nodes: Node[] = regions.map((g, i) => ({ x: g.x, z: g.z, size: 1.6, region: i, hub: true }));
  while (nodes.length < COUNT) {
    const i = Math.floor(rand() * regions.length);
    const g = regions[i];
    if (rand() < 0.16) {
      const h = regions.reduce((best, r, j) =>
        j !== i && (r.x - g.x) ** 2 + (r.z - g.z) ** 2 < (best.x - g.x) ** 2 + (best.z - g.z) ** 2 ? r : best,
      regions[(i + 1) % regions.length]);
      const k = rand();
      nodes.push({ x: g.x + (h.x - g.x) * k + gauss(rand) * 0.6, z: g.z + (h.z - g.z) * k + gauss(rand) * 0.6, size: 0.55, region: i, hub: false });
    } else {
      nodes.push({ x: g.x + gauss(rand) * g.r, z: g.z + gauss(rand) * g.r * 0.75, size: 0.6 + Math.pow(rand(), 3) * 1.2, region: i, hub: false });
    }
  }

  const byRegion: number[][] = regions.map(() => []);
  nodes.forEach((n, i) => byRegion[n.region].push(i));
  const edges: [number, number][] = [];
  const neighbours: number[][] = nodes.map(() => []);
  for (const members of byRegion) {
    for (const i of members) {
      const best: [number, number][] = [];
      for (const j of members) {
        if (i === j) continue;
        const d = (nodes[i].x - nodes[j].x) ** 2 + (nodes[i].z - nodes[j].z) ** 2;
        if (best.length < 2 || d < best[best.length - 1][0]) {
          best.push([d, j]);
          best.sort((p, q) => p[0] - q[0]);
          if (best.length > 2) best.pop();
        }
      }
      const reach = 3 + nodes[i].z * 0.03;
      for (const [d, j] of best) {
        if (d > reach * reach) continue;
        if (!neighbours[i].includes(j)) {
          edges.push([i, j]);
          neighbours[i].push(j);
          neighbours[j].push(i);
        }
      }
    }
  }
  return { nodes, edges, neighbours, byRegion };
}

function disc(rgb: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = `rgb(${rgb})`;
  ctx.beginPath();
  ctx.arc(16, 16, 15, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

export function ClusterField({ className, onPhase }: { className?: string; onPhase?: (phase: IncidentPhase) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onPhaseRef = useRef(onPhase);
  useEffect(() => {
    onPhaseRef.current = onPhase;
  }, [onPhase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { nodes, edges, neighbours, byRegion } = buildCluster();
    const inkDot = disc(INK);
    const redDot = disc(RUBRIC);
    const rand = random(77);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(canvas).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";

    let W = 1;
    let H = 1;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();

    // A camera well above the plane, looking down, with the horizon near the top edge.
    const camH = 14;
    const view = () => {
      const focal = H * 0.95;
      const pitch = Math.atan((-0.32 * H) / focal);
      return { focal, sp: Math.sin(pitch), cp: Math.cos(pitch) };
    };
    let V = view();
    const project = (x: number, y: number, z: number, yaw: number) => {
      const zc = z - PIVOT;
      const rx = x * Math.cos(yaw) - zc * Math.sin(yaw);
      const rz = x * Math.sin(yaw) + zc * Math.cos(yaw) + PIVOT;
      const py = y - camH;
      const depth = py * V.sp + rz * V.cp;
      if (depth < 1) return null;
      const up = py * V.cp - rz * V.sp;
      return { x: W / 2 + (V.focal * rx) / depth, y: H / 2 - (V.focal * up) / depth, depth, z: rz };
    };
    const haze = (z: number) => 1 - smooth(95, 172, z);

    let incident: Incident | null = null;
    let lastPhase: IncidentPhase = "calm";
    const setPhase = (p: IncidentPhase) => {
      if (p === lastPhase) return;
      lastPhase = p;
      onPhaseRef.current?.(p);
    };

    const newIncident = (start: number, yaw: number): Incident | null => {
      const candidates = byRegion
        .map((members, r) => ({ members, r, p: project(nodes[r].x, 0, nodes[r].z, yaw) }))
        .filter(({ p, r }) => p && p.x > W * 0.14 && p.x < W * 0.86 && p.y > H * 0.5 && p.y < H * 0.85 && nodes[r].z < 80);
      for (let tries = 0; tries < 60 && candidates.length; tries++) {
        const { members, r } = candidates[Math.floor(rand() * candidates.length)];
        const pool = members.filter((i) => !nodes[i].hub);
        const a = pool[Math.floor(rand() * pool.length)];
        const b = neighbours[a].find((j) => !nodes[j].hub);
        if (b === undefined) continue;
        const c = neighbours[b].find((j) => j !== a && !nodes[j].hub);
        if (c === undefined) continue;
        const pick = () => pool[Math.floor(rand() * pool.length)];
        return { start, hub: r, a, b, c, hunts: [pick(), pick()] };
      }
      return null;
    };

    const ring = (x: number, y: number, rx: number, alpha: number, rgb = INK, width = 1) => {
      if (alpha <= 0.002) return;
      ctx.strokeStyle = `rgba(${rgb},${alpha})`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, rx * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const note = (from: { x: number; y: number }, lines: string[], alpha: number, rgb = INK) => {
      if (alpha <= 0.01) return;
      const left = from.x > W * 0.62;
      const ex = from.x + (left ? -28 : 28);
      const ey = from.y - 26;
      ctx.strokeStyle = `rgba(${rgb},${0.5 * alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(from.x + (left ? -5 : 5), from.y - 4);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex + (left ? -10 : 10), ey);
      ctx.stroke();
      ctx.font = `11px ${mono}`;
      ctx.textAlign = left ? "right" : "left";
      ctx.textBaseline = "middle";
      const tx = ex + (left ? -14 : 14);
      const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 10;
      ctx.fillStyle = `rgba(236,232,224,${0.88 * alpha})`;
      ctx.fillRect(left ? tx - w + 5 : tx - 5, ey - 9, w, lines.length * 15 + 3);
      lines.forEach((l, i) => {
        ctx.fillStyle = `rgba(${i === 0 ? rgb : INK},${(i === 0 ? 0.95 : 0.55) * alpha})`;
        ctx.fillText(l, tx, ey + i * 15);
      });
    };

    const draw = (now: number) => {
      const t = now / 1000;
      const yaw = reduce ? 0 : Math.sin(t * 0.018) * 0.05;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Survey marks on the ground plane.
      ctx.strokeStyle = `rgba(${INK},0.16)`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let z = 20; z <= 160; z += 20) {
        for (let x = -260; x <= 260; x += 20) {
          const p = project(x, 0, z, yaw);
          if (!p || p.x < 0 || p.x > W || p.y < 0 || p.y > H) continue;
          const s = Math.min(3.5, 55 / p.depth);
          if (haze(p.z) < 0.4) continue;
          ctx.moveTo(p.x - s, p.y);
          ctx.lineTo(p.x + s, p.y);
          ctx.moveTo(p.x, p.y - s * 0.62);
          ctx.lineTo(p.x, p.y + s * 0.62);
        }
      }
      ctx.stroke();

      const inc = incident && t >= incident.start ? incident : null;
      const it = inc ? t - inc.start : -1;
      const contained = !!inc && it >= T.contain;
      const rebuilt = inc ? smooth(T.rebuild, T.rebuild + 1.1, it) : 0;
      const quarantined = (i: number) => contained && inc && (i === inc.a || i === inc.b) && rebuilt < 1;

      const P = nodes.map((n) => project(n.x, 0, n.z, yaw));

      for (const [bucket, alpha] of [
        [0, 0.2],
        [1, 0.13],
        [2, 0.07],
      ] as const) {
        ctx.beginPath();
        for (const [i, j] of edges) {
          const p = P[i];
          const q = P[j];
          if (!p || !q) continue;
          const zm = (p.z + q.z) / 2;
          if ((zm < 45 ? 0 : zm < 95 ? 1 : 2) !== bucket || quarantined(i) || quarantined(j)) continue;
          if ((p.x < 0 && q.x < 0) || (p.x > W && q.x > W)) continue;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        }
        ctx.strokeStyle = `rgba(${INK},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (let i = 0; i < nodes.length; i++) {
        const p = P[i];
        if (!p || p.x < -8 || p.x > W + 8 || p.y < -8 || p.y > H + 8) continue;
        const n = nodes[i];
        const h = haze(p.z);
        if (h <= 0.01) continue;
        if (n.hub) {
          const s = Math.max(2, Math.min(5, (n.size * V.focal * 0.07) / p.depth));
          ctx.fillStyle = `rgba(${INK},${0.9 * h})`;
          ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
          continue;
        }
        const r = Math.min(3, Math.max(0.65, (n.size * V.focal * 0.065) / p.depth));
        let img = inkDot;
        let alpha = h * (0.55 + 0.4 * Math.min(1, n.size / 1.4));
        if (inc && (i === inc.a || i === inc.b)) {
          const infected = i === inc.a ? it >= 0 : it >= T.reachB;
          if (infected && !contained) {
            img = redDot;
            alpha = 1;
          }
          if (contained) alpha *= rebuilt;
        }
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(img, p.x - r, p.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      if (inc) {
        const pa = P[inc.a];
        const pb = P[inc.b];
        const pc = P[inc.c];
        const ph = P[inc.hub];
        const lerp = (p: { x: number; y: number }, q: { x: number; y: number }, k: number) => ({ x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k });

        if (pa && pb && pc) {
          // The intrusion moves laterally, and is stopped partway along its next link.
          const k1 = smooth(0.15, T.reachB, it);
          const k2 = smooth(T.reachB, T.reachB + 0.75, Math.min(it, T.contain));
          const fade = contained ? 1 - smooth(T.contain + 0.6, T.contain + 2, it) : 1;
          ctx.strokeStyle = `rgba(${RUBRIC},${0.9 * fade})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          const e1 = lerp(pa, pb, k1);
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(e1.x, e1.y);
          let e2: { x: number; y: number } = pb;
          if (it > T.reachB) {
            e2 = lerp(pb, pc, k2);
            ctx.moveTo(pb.x, pb.y);
            ctx.lineTo(e2.x, e2.y);
          }
          ctx.stroke();
          if (contained && fade > 0) {
            ctx.strokeStyle = `rgba(${INK},${fade})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(e2.x - 4, e2.y - 4);
            ctx.lineTo(e2.x + 4, e2.y + 4);
            ctx.moveTo(e2.x + 4, e2.y - 4);
            ctx.lineTo(e2.x - 4, e2.y + 4);
            ctx.stroke();
          }
          if (!contained) ring(pa.x, pa.y, 6 + 10 * ((it * 1.6) % 1), 0.7 * (1 - ((it * 1.6) % 1)), RUBRIC);
        }

        if (contained && pa && pb) {
          const snap = smooth(T.contain, T.contain + 0.3, it);
          for (const p of [pa, pb]) {
            ring(p.x, p.y, 3 + 22 * snap, 0.8 * (1 - snap), INK, 1.2);
            if (rebuilt < 1) {
              ctx.strokeStyle = `rgba(${INK},${0.85 * (1 - rebuilt)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }

        if (ph && it >= T.agents && it < T.verify + 0.3) {
          const trips: [number, number, number][] = [
            [inc.a, 0, 1.3],
            [inc.b, 0.2, 1.3],
            [inc.hunts[0], 0.45, 1.1],
            [inc.hunts[1], 1.6, 1.1],
          ];
          for (const [target, delay, dur] of trips) {
            const k = (it - T.agents - delay) / dur;
            if (k <= 0 || k > 1.3) continue;
            const from = nodes[inc.hub];
            const to = nodes[target];
            const at = (kk: number) => {
              const e = kk * kk * (3 - 2 * kk);
              return project(from.x + (to.x - from.x) * e, Math.sin(Math.PI * e) * 1.6, from.z + (to.z - from.z) * e, yaw);
            };
            const fadeOut = 1 - smooth(1, 1.3, k);
            ctx.strokeStyle = `rgba(${INK},${0.5 * fadeOut})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            for (let s = 0; s <= 10; s++) {
              const p = at(Math.min(1, Math.max(0, k - 0.3 + s * 0.03)));
              if (!p) continue;
              if (s === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
            const head = at(Math.min(1, k));
            if (head) {
              ctx.globalAlpha = fadeOut;
              ctx.drawImage(inkDot, head.x - 2.2, head.y - 2.2, 4.4, 4.4);
              ctx.globalAlpha = 1;
            }
          }
        }

        if (it >= T.verify && it < T.verify + 1.8) {
          const k = (it - T.verify) / 1.8;
          const g = nodes[inc.hub];
          const rad = 1.5 + k * 13;
          ctx.beginPath();
          for (let s = 0; s <= 56; s++) {
            const a = (s / 56) * Math.PI * 2;
            const p = project(g.x + Math.cos(a) * rad, 0, g.z + Math.sin(a) * rad * 0.75, yaw);
            if (!p) continue;
            if (s === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(${INK},${0.6 * Math.sin(Math.PI * k)})`;
          ctx.lineWidth = 0.9;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Printed annotations follow the incident, one at a time.
        if (pa) {
          const show = (a: number, b: number) => smooth(a, a + 0.25, it) * (1 - smooth(b - 0.3, b, it));
          note(pa, ["INC-2F9C  node-3", "credential misuse"], show(0, T.contain), RUBRIC);
          note(pa, ["contained  00:00.012", "Tacit · token.revoke"], show(T.contain, T.agents + 0.9));
          if (ph) note(ph, ["coordinator eu-2", "Defender · Investigation · Hunter"], show(T.agents + 0.9, T.rebuild));
          note(pa, ["rebuilt  03:12.406", "Recovery · clean instance"], show(T.rebuild, T.verify + 0.2));
          if (ph) note(ph, ["verified  03:41.090", "no persistence · services healthy"], show(T.verify + 0.2, T.rest));
        }

        const phase: IncidentPhase =
          it < T.contain ? "detected" : it < T.rebuild + 0.6 ? "contained" : it < T.verified ? "recovered" : it < T.rest ? "verified" : "calm";
        setPhase(phase);
      }

      // Soften the far edge into the paper.
      const fog = ctx.createLinearGradient(0, 0, 0, H * 0.42);
      fog.addColorStop(0, "rgba(236,232,224,1)");
      fog.addColorStop(0.45, "rgba(236,232,224,0.92)");
      fog.addColorStop(1, "rgba(236,232,224,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H * 0.42);
    };

    let raf = 0;
    let visible = true;
    let cycle = -Infinity;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const t = now / 1000;
      if (t - cycle > PERIOD) {
        cycle = t;
        incident = newIncident(t + 1.4, Math.sin(t * 0.018) * 0.05);
        setPhase("calm");
      }
      draw(now);
    };

    if (reduce) draw(performance.now());
    else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      V = view();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
