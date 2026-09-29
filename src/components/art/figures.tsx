"use client";

import { InkPath, InkSvg } from "./ink";
import {
  BOUNDARY_PATH,
  GROUND_PATH,
  PLATE,
  archPaths,
  harmonographPath,
  phyllotaxisPath,
  topographyPaths,
} from "./figure-paths";

const VIEWBOX = `0 0 ${PLATE} ${PLATE}`;
const HARMONOGRAPH = harmonographPath();
const TOPOGRAPHY = topographyPaths();
const PHYLLOTAXIS = phyllotaxisPath();
const ARCHES = archPaths();

type FigureProps = { className?: string; delay?: number };

export function HarmonographFigure({ className, delay = 0 }: FigureProps) {
  return (
    <InkSvg viewBox={VIEWBOX} className={className} title="A damped harmonograph settling into four lobes">
      <InkPath d={HARMONOGRAPH} strokeWidth={0.32} opacity={0.9} delay={delay} duration={5.2} />
    </InkSvg>
  );
}

export function TopographyFigure({ className, delay = 0 }: FigureProps) {
  return (
    <InkSvg viewBox={VIEWBOX} className={className} title="Contour lines held within a single boundary">
      <InkPath d={BOUNDARY_PATH} strokeWidth={0.9} delay={delay} duration={2.2} />
      {TOPOGRAPHY.map((d, i) => (
        <InkPath
          key={i}
          d={d}
          strokeWidth={0.6}
          opacity={0.85}
          delay={delay + 0.5 + i * 0.12}
          duration={2.4}
        />
      ))}
    </InkSvg>
  );
}

export function PhyllotaxisFigure({ className, delay = 0 }: FigureProps) {
  return (
    <InkSvg viewBox={VIEWBOX} className={className} title="Seeds arranged on the golden angle">
      <InkPath d={PHYLLOTAXIS} strokeWidth={0.6} delay={delay} duration={4.2} />
    </InkSvg>
  );
}

export function ArchFigure({ className, delay = 0 }: FigureProps) {
  return (
    <InkSvg viewBox={VIEWBOX} className={className} title="Nested doorways on a single threshold">
      <InkPath d={GROUND_PATH} strokeWidth={0.8} delay={delay} duration={1.4} />
      {ARCHES.map((d, i) => (
        <InkPath key={i} d={d} strokeWidth={0.75} delay={delay + 0.3 + i * 0.14} duration={2} />
      ))}
    </InkSvg>
  );
}
