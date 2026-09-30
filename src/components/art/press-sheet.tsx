"use client";

import { useEffect, useRef, type RefObject } from "react";

/*
 * A sheet of paper that the page prints on. Text marked `data-press="ink"` is pressed into the
 * sheet and inked; `data-press="blind"` is pressed without ink and shows only where light rakes
 * across it. The type is laid out by the page itself — this only reads where each glyph landed —
 * so the words stay real, selectable and responsive.
 */

export type PressState = "ready" | "failed";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/** Separable gaussian over the two masks, with its own width for each. */
const BLUR = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uStep;
uniform vec2 uSigma;
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 acc = vec2(0.0);
  vec2 wsum = vec2(0.0);
  for (int i = -24; i <= 24; i++) {
    float x = float(i);
    vec2 w = exp(-x * x / (2.0 * uSigma * uSigma));
    acc += texture2D(uTex, uv + uStep * x).rg * w;
    wsum += w;
  }
  gl_FragColor = vec4(acc / wsum, 0.0, 1.0);
}
`;

const SHADE = `
precision highp float;
uniform sampler2D uSharp;
uniform sampler2D uFine;
uniform sampler2D uBroad;
uniform vec2 uRes;
uniform vec2 uSize;
uniform vec3 uLight;
uniform float uSweep;
uniform vec4 uDepth;
uniform vec3 uPaper;
uniform vec3 uInk;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Cotton rag: a fine tooth, and fibres felted in every direction.
float tooth(vec2 p) {
  float h = noise(p * 0.35) * 0.6 + noise(p * 0.9 + 7.1) * 0.4;
  vec2 a = mat2(0.94, 0.34, -0.34, 0.94) * p;
  vec2 b = mat2(0.17, -0.98, 0.98, 0.17) * p;
  vec2 c = mat2(0.64, 0.77, -0.77, 0.64) * p;
  float fib = noise(a * vec2(0.05, 0.5)) + noise(b * vec2(0.04, 0.55) + 5.0) + noise(c * vec2(0.05, 0.45) + 9.0);
  return h * 0.7 + fib * 0.1;
}

// Behind the cylinder of the proof press the type has bitten; ahead of it the sheet is untouched.
float bitten(float x) {
  float k = clamp((uSweep - x) / 180.0, 0.0, 1.0);
  return k * k * (3.0 - 2.0 * k);
}

float relief(vec2 uv) {
  vec2 f = texture2D(uFine, uv).rg;
  vec2 b = texture2D(uBroad, uv).rg;
  return -(uDepth.x * f.r + 0.6 * b.r) * bitten(uv.x * uSize.x) - (uDepth.y * f.g + uDepth.z * b.g);
}

vec3 toLinear(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 p = uv * uSize;
  vec2 px = 1.0 / uRes;
  float cssPerTexel = uSize.x / uRes.x;

  float h = relief(uv);
  float dhx = (relief(uv + vec2(px.x, 0.0)) - relief(uv - vec2(px.x, 0.0))) / (2.0 * cssPerTexel);
  float dhy = (relief(uv + vec2(0.0, px.y)) - relief(uv - vec2(0.0, px.y))) / (2.0 * cssPerTexel);

  // Where the type pressed, the fibres were crushed flat.
  vec2 floorMask = texture2D(uFine, uv).rg;
  float crushed = clamp(floorMask.r * bitten(p.x) + floorMask.g, 0.0, 1.0);
  float amp = uDepth.w * (1.0 - 0.85 * crushed);
  float e = 0.5;
  float t0 = tooth(p);
  dhx += (tooth(p + vec2(e, 0.0)) - tooth(p - vec2(e, 0.0))) / (2.0 * e) * amp;
  dhy += (tooth(p + vec2(0.0, e)) - tooth(p - vec2(0.0, e))) / (2.0 * e) * amp;

  vec3 N = normalize(vec3(-dhx, -dhy, 1.0));
  vec3 L = normalize(uLight);

  // Walls of the impression cast shadows across its floor.
  vec2 dir = normalize(L.xy);
  float rise = L.z / length(L.xy);
  float stepPx = (uDepth.y + 1.0) / rise / 12.0;
  float shadow = 1.0;
  for (int i = 1; i <= 12; i++) {
    float dist = float(i) * stepPx;
    float above = relief(uv + dir * dist / uSize) - (h + dist * rise);
    shadow = min(shadow, clamp(1.0 - above * 1.6, 0.0, 1.0));
  }

  float direct = max(dot(N, L), 0.0) / L.z * shadow;
  float lum = 0.5 + 0.5 * direct;

  float inked = texture2D(uSharp, uv).r * smoothstep(0.35, 0.8, bitten(p.x));
  float mottle = noise(p * 0.16) * 0.6 + noise(p * 0.45 + 2.0) * 0.4;
  float density = inked * (0.975 + 0.025 * mottle - 0.03 * smoothstep(0.62, 0.85, t0));
  vec3 albedo = mix(toLinear(uPaper), toLinear(uInk), clamp(density, 0.0, 1.0));
  albedo *= 1.0 - 0.035 * floorMask.g;

  vec3 col = pow(albedo * lum, vec3(1.0 / 2.2));
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Depths in CSS px: inked type, blind type, the blind type's shallow bruise, the paper's tooth. */
const DEPTH = [1.3, 2.6, 0.8, 0.1] as const;
/** Wall softness in CSS px for inked and blind type; the bruise spreads wider. */
const WALL = [0.6, 3.2] as const;
const BRUISE = 14;
/** Enough resolution for the type to stay sharp, without building a 5K texture on large screens. */
const MAX_PIXELS = 3.6e6;

function parseRgb(value: string, fallback: [number, number, number]): [number, number, number] {
  const m = value.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0] / 255, +m[1] / 255, +m[2] / 255] : fallback;
}

async function loadFonts(sheet: HTMLElement) {
  const fonts = new Set<string>();
  for (const el of sheet.querySelectorAll<HTMLElement>("[data-press]")) {
    const cs = getComputedStyle(el);
    fonts.add(`${cs.fontStyle} ${cs.fontWeight} 64px ${cs.fontFamily}`);
  }
  await Promise.allSettled([...fonts].map((f) => document.fonts.load(f)));
  await document.fonts.ready.catch(() => undefined);
}

/** Paints each glyph where the page set it: R for inked type, G for blind. */
function rasterize(sheet: HTMLElement, scale: number) {
  const box = sheet.getBoundingClientRect();
  const w = Math.max(1, Math.round(box.width * scale));
  const h = Math.max(1, Math.round(box.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  ctx.scale(w / box.width, h / box.height);
  ctx.textBaseline = "alphabetic";

  const range = document.createRange();
  for (const el of sheet.querySelectorAll<HTMLElement>("[data-press]")) {
    const colour = el.dataset.press === "blind" ? "#00ff00" : "#ff0000";
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? "";
      const cs = getComputedStyle(node.parentElement!);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.fillStyle = colour;
      const m = ctx.measureText("Hg");
      const ascent = m.fontBoundingBoxAscent;
      const descent = m.fontBoundingBoxDescent;
      for (let i = 0; i < text.length; i++) {
        if (/\s/.test(text[i])) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getClientRects()[0];
        if (!r) continue;
        const baseline = r.top - box.top + (r.height - (ascent + descent)) / 2 + ascent;
        ctx.fillText(text[i], r.left - box.left, baseline);
      }
    }
  }
  return { canvas, w, h, cssW: box.width, cssH: box.height };
}

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };

export function PressSheet({
  sheetRef,
  progressRef,
  onState,
  className,
}: {
  sheetRef: RefObject<HTMLElement | null>;
  /** 0 while the sheet fills the view, 1 once it has scrolled away; turns the light. */
  progressRef: RefObject<number>;
  onState: (state: PressState) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onStateRef = useRef(onState);
  useEffect(() => {
    onStateRef.current = onState;
  }, [onState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sheet = sheetRef.current;
    if (!canvas || !sheet) return;
    const report = (s: PressState) => onStateRef.current(s);

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) {
      report("failed");
      return;
    }

    const compile = (frag: string) => {
      const make = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, make(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, make(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(prog, 0, "aPos");
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
      const u = (n: string) => gl.getUniformLocation(prog, n);
      return { prog, u };
    };
    const blur = compile(BLUR);
    const shade = compile(SHADE);
    if (!blur || !shade) {
      report("failed");
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const texture = (w: number, h: number, source?: HTMLCanvasElement) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (source) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return tex;
    };
    const target = (w: number, h: number): Target => {
      const tex = texture(w, h);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo, w, h };
    };
    const release = (t: Target) => {
      gl.deleteFramebuffer(t.fbo);
      gl.deleteTexture(t.tex);
    };
    const blurPass = (src: WebGLTexture, srcW: number, srcH: number, dst: Target, dir: [number, number], stride: number, sigma: [number, number]) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
      gl.viewport(0, 0, dst.w, dst.h);
      gl.useProgram(blur.prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src);
      gl.uniform1i(blur.u("uTex"), 0);
      gl.uniform2f(blur.u("uRes"), dst.w, dst.h);
      gl.uniform2f(blur.u("uStep"), (dir[0] * stride) / srcW, (dir[1] * stride) / srcH);
      gl.uniform2f(blur.u("uSigma"), sigma[0], sigma[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let sharp: WebGLTexture | null = null;
    let fine: Target | null = null;
    let broad: Target | null = null;
    let size = { w: 1, h: 1, cssW: 1, cssH: 1 };
    let paper: [number, number, number] = [0.925, 0.91, 0.88];
    let ink: [number, number, number] = [0.07, 0.068, 0.065];
    let ready = false;
    let dirty = true;
    let startedAt = -1;
    let lastKey = "";
    let last: [number, number, number] | null = null;
    let disposed = false;

    const build = async () => {
      await loadFonts(sheet);
      if (disposed) return;
      const box = sheet.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(dpr, Math.sqrt(MAX_PIXELS / Math.max(1, box.width * box.height)));
      const r = rasterize(sheet, scale);
      size = r;
      const cs = getComputedStyle(sheet);
      paper = parseRgb(cs.backgroundColor, paper);
      ink = parseRgb(cs.getPropertyValue("--press-ink") || "", ink);

      if (sharp) gl.deleteTexture(sharp);
      if (fine) release(fine);
      if (broad) release(broad);
      sharp = texture(r.w, r.h, r.canvas);

      const k = r.w / r.cssW;
      const tmp = target(r.w, r.h);
      fine = target(r.w, r.h);
      blurPass(sharp, r.w, r.h, tmp, [1, 0], 1, [WALL[0] * k, WALL[1] * k]);
      blurPass(tmp.tex, r.w, r.h, fine, [0, 1], 1, [WALL[0] * k, WALL[1] * k]);
      release(tmp);

      const hw = Math.max(1, Math.round(r.w / 2));
      const hh = Math.max(1, Math.round(r.h / 2));
      const stride = 3;
      const sigma = (BRUISE * k) / stride;
      const tmp2 = target(hw, hh);
      broad = target(hw, hh);
      blurPass(fine.tex, r.w, r.h, tmp2, [1, 0], stride, [sigma, sigma]);
      blurPass(tmp2.tex, hw, hh, broad, [0, 1], stride / 2, [sigma, sigma]);
      release(tmp2);

      canvas.width = r.w;
      canvas.height = r.h;
      dirty = true;
      if (last) draw(...last);
      if (!ready) {
        ready = true;
        startedAt = performance.now();
      }
    };

    const draw = (sweep: number, elevation: number, azimuth: number) => {
      if (!sharp || !fine || !broad) return;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, size.w, size.h);
      gl.useProgram(shade.prog);
      const bind = (unit: number, tex: WebGLTexture, name: string) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(shade.u(name), unit);
      };
      bind(0, sharp, "uSharp");
      bind(1, fine.tex, "uFine");
      bind(2, broad.tex, "uBroad");
      const el = (elevation * Math.PI) / 180;
      const az = (azimuth * Math.PI) / 180;
      gl.uniform2f(shade.u("uRes"), size.w, size.h);
      gl.uniform2f(shade.u("uSize"), size.cssW, size.cssH);
      gl.uniform3f(shade.u("uLight"), Math.cos(az) * Math.cos(el), Math.sin(az) * Math.cos(el), Math.sin(el));
      gl.uniform1f(shade.u("uSweep"), sweep);
      gl.uniform4f(shade.u("uDepth"), DEPTH[0], DEPTH[1], DEPTH[2], DEPTH[3]);
      gl.uniform3f(shade.u("uPaper"), ...paper);
      gl.uniform3f(shade.u("uInk"), ...ink);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

    let raf = 0;
    let reported = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!ready) return;
      const t = (now - startedAt) / 1000;
      const pull = reduce ? 1 : clamp01((t - 0.3) / 1.8);
      const sweep = -200 + ease(pull) * (size.cssW + 400);
      const settle = reduce ? 1 : easeOut(clamp01((t - 0.1) / 3.4));
      const p = reduce ? 0 : clamp01(progressRef.current ?? 0);
      const elevation = 64 - 40 * settle - 8 * p;
      const azimuth = 206 + 38 * p;
      const key = `${sweep.toFixed(1)}|${elevation.toFixed(2)}|${azimuth.toFixed(2)}`;
      if (key === lastKey && !dirty) return;
      lastKey = key;
      dirty = false;
      last = [sweep, elevation, azimuth];
      draw(sweep, elevation, azimuth);
      if (!reported) {
        reported = true;
        canvas.style.opacity = "1";
        report("ready");
      }
    };

    build()
      .then(() => {
        if (!disposed) raf = requestAnimationFrame(frame);
      })
      .catch((err) => {
        console.warn("PressSheet:", err);
        report("failed");
      });

    let pending = 0;
    let lastW = sheet.clientWidth;
    let lastH = sheet.clientHeight;
    const ro = new ResizeObserver(() => {
      if (sheet.clientWidth === lastW && sheet.clientHeight === lastH) return;
      lastW = sheet.clientWidth;
      lastH = sheet.clientHeight;
      window.clearTimeout(pending);
      pending = window.setTimeout(() => void build(), 160);
    });
    ro.observe(sheet);

    const onLost = (e: Event) => {
      e.preventDefault();
      report("failed");
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(pending);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      if (sharp) gl.deleteTexture(sharp);
      if (fine) release(fine);
      if (broad) release(broad);
    };
  }, [sheetRef, progressRef]);

  return <canvas ref={canvasRef} aria-hidden style={{ opacity: 0 }} className={className} />;
}
