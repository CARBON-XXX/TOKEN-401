"use client";

import { useEffect, useRef, type RefObject } from "react";

import { CAMELLIA_SILHOUETTE, CAMELLIA_VIEWBOX } from "@/components/brand/logo-paths";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/*
 * Dawn behind the camellia. A light source sits hidden behind the crown and rises; its light
 * reaches the reader only by scattering: shafts through the gaps between petals, a limb of
 * atmosphere hugging the flower's edge, fog drifting across the horizon, and dust caught in it.
 * The flower itself stays dark, grazed with light only along its edges.
 */
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec4 uEmblem;
uniform vec2 uPad;
uniform vec2 uPointer;
uniform float uRise;
uniform float uLift;
uniform sampler2D uMask;

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
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
vec4 maskAt(vec2 px) {
  vec2 uv = (px - uEmblem.xy) / uEmblem.zw;
  vec2 m = (uv + uPad) / (1.0 + 2.0 * uPad);
  if (m.x < 0.0 || m.y < 0.0 || m.x > 1.0 || m.y > 1.0) return vec4(0.0);
  return texture2D(uMask, m);
}

float dust(vec2 p, float t) {
  float acc = 0.0;
  for (int l = 0; l < 3; l++) {
    float fl = float(l);
    vec2 pp = p * (6.0 + fl * 5.5) + vec2(t * 0.012 + fl * 3.7, t * (0.05 + 0.035 * fl)) + uPointer * 0.12 * (fl + 1.0);
    vec2 id = floor(pp);
    vec2 f = fract(pp) - 0.5;
    float h = hash(id + fl * 19.1);
    vec2 o = vec2(hash(id + 2.3), hash(id + 5.9)) - 0.5;
    o += 0.16 * vec2(sin(t * 0.27 + h * 20.0), cos(t * 0.21 + h * 13.0));
    float dd = length(f - o * 0.7);
    float sz = mix(0.012, 0.035, hash(id + 8.1));
    float tw = 0.6 + 0.4 * sin(t * (0.4 + h) + h * 30.0);
    acc += step(0.78, h) * smoothstep(sz, sz * 0.15, dd) * tw * (1.0 - fl * 0.22);
  }
  // A few large, out-of-focus motes close to the lens.
  vec2 bp = p * 2.2 + vec2(-t * 0.008, t * 0.02) + uPointer * 0.5;
  vec2 bid = floor(bp);
  vec2 bf = fract(bp) - 0.5;
  float bh = hash(bid + 41.0);
  vec2 bo = vec2(hash(bid + 1.7), hash(bid + 9.2)) - 0.5;
  acc += step(0.84, bh) * smoothstep(0.07, 0.035, length(bf - bo * 0.5)) * 0.045;
  return acc;
}

void main() {
  // Colour exists only as light: hot white-gold at the source, amber and ember as it spreads,
  // a cool teal where it scatters high into the sky. Everything unlit stays near-black.
  vec3 night = vec3(0.028, 0.034, 0.04);
  vec3 soil = vec3(0.026, 0.023, 0.023);
  vec3 hot = vec3(1.0, 0.93, 0.8);
  vec3 gold = vec3(1.0, 0.7, 0.32);
  vec3 amber = vec3(1.0, 0.42, 0.08);
  vec3 ember = vec3(0.72, 0.14, 0.04);
  vec3 teal = vec3(0.08, 0.34, 0.45);
  float t = uTime;
  float H = uRes.y;
  float W = uEmblem.z;

  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec4 m = maskAt(px);
  float body = m.r;
  float near = m.g;
  float far = m.b;

  vec2 crown = uEmblem.xy + vec2(0.5 * W, 0.012 * uEmblem.w);
  float breathe = 0.5 + 0.5 * sin(t * 0.31);
  vec2 S = crown + vec2(uPointer.x * 0.035 * H, (0.15 - 0.13 * uRise - 0.035 * uLift + 0.01 * breathe) * W);
  float power = uRise * (0.86 + 0.14 * breathe) * (1.0 + 0.6 * uLift);

  // Light falls off relative to the flower, so it keeps its proportions on narrow screens.
  vec2 d = (px - S) / (W * 0.8);
  float r = length(d);
  float dx = abs(px.x - S.x) / W;

  float shafts = 0.0;
  if (body < 0.5) {
    float decay = 1.0;
    for (int i = 1; i <= 20; i++) {
      vec2 sp = mix(px, S, float(i) / 21.0);
      shafts += (1.0 - maskAt(sp).r) * exp(-length(sp - S) / (W * 0.8) * 3.6) * decay;
      decay *= 0.94;
    }
    shafts /= 11.0;
  }
  float ang = atan(d.x, -d.y);
  float streak = 0.6 * noise(vec2(ang * 6.0, t * 0.04)) + 0.4 * noise(vec2(ang * 17.0 + 4.0, -t * 0.06));
  streak = smoothstep(0.3, 0.9, streak) * exp(-r * 1.4);

  vec2 fp = px / H;
  float f1 = fbm(fp * vec2(0.9, 2.6) + vec2(t * 0.014, 0.0));
  float f2 = fbm(fp * vec2(2.1, 4.2) + vec2(-t * 0.024, t * 0.005) + 1.3 * f1);
  float fog = smoothstep(0.22, 0.85, mix(f1, f2, 0.55));
  float horizonBand = exp(-abs(px.y - (crown.y + 0.12 * W)) / (0.3 * W));
  float fogDensity = fog * (0.12 + 0.85 * horizonBand + 0.5 * far);

  float glowWide = exp(-r * 2.3);
  float glowCore = exp(-r * 7.0);
  float warmth = clamp(glowWide * 1.4, 0.0, 1.0);
  float limbFall = exp(-dx / 0.4);
  float above = smoothstep(0.05, -0.7, d.y);

  float glowWarm = exp(-r * 3.6);
  float limbTight = exp(-dx / 0.07);
  vec3 edgeLight = mix(ember, mix(amber, gold, limbTight), limbFall);

  // Hue follows height above the horizon, as a real dawn sky does; intensity follows the source.
  float hy = (crown.y - px.y) / (W * 0.8);
  float lowSky = exp(-max(hy, 0.0) * 3.2);
  vec3 skyHue = mix(teal, mix(amber, gold, exp(-r * 4.5)), lowSky);

  vec3 L = hot * exp(-r * 8.0) * 0.95;
  L += skyHue * exp(-r * 2.2) * 0.62;
  L += teal * exp(-r * 0.8) * (0.5 + 0.5 * above) * 0.34;
  L += gold * shafts * streak * (0.25 + 0.9 * fogDensity) * 0.45;
  L += mix(teal, skyHue, clamp(glowWide * 2.0, 0.0, 1.0)) * fogDensity * (glowWide * 1.4 + shafts * 0.6 + 0.14) * 0.62;
  L += edgeLight * (1.0 - body) * (near * 2.4 + far * 1.25) * (0.2 + 0.8 * limbFall);
  L *= power;
  vec3 col = night + (1.0 - exp(-L * 1.2)) * 0.97;
  col += teal * smoothstep(0.2, 1.0, fp.y) * 0.04 * uRise;

  if (body > 0.001) {
    vec2 uv = (px - uEmblem.xy) / uEmblem.zw;
    vec2 q = uv * 3.2;
    vec2 w = vec2(fbm(q + vec2(0.0, t * 0.012)), fbm(q + vec2(5.2, 1.3) - t * 0.01));
    float marble = fbm(q + 2.2 * w);
    float edge = clamp((1.0 - near) * 2.0, 0.0, 1.0);
    float band = clamp((1.0 - far) * 2.0, 0.0, 1.0);
    float graze = (edge * 0.55 + band * 0.45) * exp(-dx / 0.3) * power;
    vec3 stone = soil * (0.75 + 0.4 * marble);
    stone += mix(ember, amber, edge) * edge * graze * (0.1 + 0.2 * marble);
    stone += mix(teal * 0.6, amber * 0.5, warmth) * fogDensity * (graze * 0.12 + glowWide * 0.1);
    col = mix(col, stone, body);
  }

  float e = W * 0.0021;
  float up1 = maskAt(px - vec2(0.0, e)).r;
  float up2 = maskAt(px - vec2(0.0, e * 3.0)).r;
  float rim = body * ((1.0 - up1) * 0.8 + (1.0 - up2) * 0.3);
  float rimFall = exp(-dx / 0.24) * exp(-max(0.0, px.y - crown.y) / (0.22 * W));
  float glint = 0.8 + 0.2 * sin((px.x - S.x) / W * 10.0 - t * 0.3);
  col += mix(amber, hot, rimFall * rimFall) * rim * (0.12 + rimFall) * glint * power * 0.95;

  float lightField = glowWide * 0.9 + shafts * 0.9 + far * limbFall * 0.4;
  col += mix(gold, hot, 0.4) * dust(fp, t) * (0.06 + 1.4 * lightField * power) * (1.0 - 0.6 * body);

  vec2 vg = gl_FragCoord.xy / uRes - 0.5;
  col *= 1.0 - dot(vg, vg) * 0.6;
  float grain = hash(floor(px) + floor(t * 24.0) * vec2(37.0, 17.0)) - 0.5;
  col += grain * 0.045;

  gl_FragColor = vec4(col, 1.0);
}
`;

const MASK_W = 1536;
/** Margin around the flower, as a fraction of its width, so the halo is not clipped. */
const PAD = 0.18;

function canvas2d(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** Gaussian-ish blur by halving down to `minWidth` and bilinear-doubling back up. Works without ctx.filter. */
function soften(src: HTMLCanvasElement, minWidth: number) {
  const levels: HTMLCanvasElement[] = [src];
  while (levels[levels.length - 1].width / 2 >= minWidth) {
    const prev = levels[levels.length - 1];
    const [c, ctx] = canvas2d(Math.round(prev.width / 2), Math.round(prev.height / 2));
    ctx.drawImage(prev, 0, 0, c.width, c.height);
    levels.push(c);
  }
  let cur = levels[levels.length - 1];
  for (let i = levels.length - 2; i >= 0; i--) {
    const [c, ctx] = canvas2d(levels[i].width, levels[i].height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(cur, 0, 0, c.width, c.height);
    cur = c;
  }
  return cur.getContext("2d")!.getImageData(0, 0, cur.width, cur.height).data;
}

/** R: the silhouette. G: softened a little, for the rim. B: softened a lot, for the atmosphere. */
function buildMask() {
  const { width: vw, height: vh } = CAMELLIA_VIEWBOX;
  const padX = PAD * vw;
  const k = MASK_W / (vw + 2 * padX);
  const w = MASK_W;
  const h = Math.round((vh + 2 * padX) * k);

  const [fill, fctx] = canvas2d(w, h);
  fctx.fillStyle = "#fff";
  fctx.setTransform(k, 0, 0, k, padX * k, padX * k);
  fctx.transform(0.166667, 0, 0, -0.166667, 0, vh);
  for (const d of CAMELLIA_SILHOUETTE.paths) fctx.fill(new Path2D(d));

  const crisp = fctx.getImageData(0, 0, w, h).data;
  const near = soften(fill, 96);
  const far = soften(fill, 10);
  const [out, octx] = canvas2d(w, h);
  const img = octx.createImageData(w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = crisp[i + 3];
    img.data[i + 1] = near[i + 3];
    img.data[i + 2] = far[i + 3];
    img.data[i + 3] = 255;
  }
  octx.putImageData(img, 0, 0);
  return { canvas: out, pad: [PAD, (PAD * vw) / vh] as const };
}

type HorizonFieldProps = {
  className?: string;
  /** The element whose on-screen box the flower should fill. Read every frame, so transforms carry through. */
  anchorRef: RefObject<HTMLElement | null>;
  /** 0–1, how far the reader has scrolled through the cover. */
  progressRef?: RefObject<number>;
};

export function HorizonField({ className, anchorRef, progressRef }: HorizonFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const mask = buildMask();
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask.canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uEmblem = u("uEmblem");
    const uPointer = u("uPointer");
    const uRise = u("uRise");
    const uLift = u("uLift");
    gl.uniform1i(u("uMask"), 0);
    gl.uniform2f(u("uPad"), mask.pad[0], mask.pad[1]);

    // The field is soft by nature, so it renders below device resolution; the crisp lines live in SVG.
    let quality = 1;
    let scale = 1;
    const resize = () => {
      scale = Math.min(Math.max((window.devicePixelRatio || 1) * 0.66, 0.75), 1.3) * quality;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    io.observe(canvas);
    if (reduce) window.addEventListener("scroll", schedule, { passive: true });

    const start = performance.now();
    let last = start;
    let slowFrames = 0;
    function frame(now: number) {
      raf = 0;
      if (!canvas || !gl) return;
      const elapsed = (now - start) / 1000;

      // Step down once if the device cannot keep up; the field reads the same at lower resolution.
      if (!reduce && quality > 0.7 && elapsed > 2) {
        slowFrames = now - last > 28 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        if (slowFrames > 40) {
          quality = 0.7;
          resize();
        }
      }
      last = now;

      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;

      const c = canvas.getBoundingClientRect();
      const a = anchorRef.current?.getBoundingClientRect();
      if (a) {
        gl.uniform4f(uEmblem, (a.left - c.left) * scale, (a.top - c.top) * scale, a.width * scale, a.height * scale);
      }
      const rise = reduce ? 1 : Math.min(1, Math.max(0, (elapsed - 0.3) / 5.2));
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduce ? 30 : elapsed + 30);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uRise, 1 - Math.pow(1 - rise, 3));
      gl.uniform1f(uLift, progressRef?.current ?? 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduce && visible && !document.hidden) schedule();
    }
    schedule();
    const onVisibility = () => {
      if (!document.hidden && visible) schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [anchorRef, progressRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
