type GrainProps = {
  id: string;
  /** Share of the shape that takes ink, 0–1. */
  density?: number;
  /** Speck size: higher is finer. */
  frequency?: number;
  seed?: number;
};

/**
 * An SVG filter that prints whatever it is applied to as a field of fine specks, like a
 * risograph or a worn letterpress tint, instead of a flat fill.
 */
export function Grain({ id, density = 0.5, frequency = 0.9, seed = 3 }: GrainProps) {
  const k = 7;
  const threshold = 0.5 - (density - 0.5) * 0.32;
  return (
    <defs>
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves={2} seed={seed} result="noise" />
        <feColorMatrix
          in="noise"
          type="matrix"
          values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${k} 0 0 0 ${-(k * threshold).toFixed(3)}`}
          result="specks"
        />
        <feComposite in="SourceGraphic" in2="specks" operator="in" />
      </filter>
    </defs>
  );
}

type StippleProps = {
  id: string;
  color: string;
  frequency?: number;
  seed?: number;
};

/**
 * Hand stipple: the source's opacity decides how many dots land, not how faint they are, so a
 * shape filled with a fading tint prints as dots that thin out, the way an engraver shades.
 */
export function Stipple({ id, color, frequency = 0.75, seed = 5 }: StippleProps) {
  const k = 14;
  const threshold = 0.84;
  return (
    <defs>
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves={2} seed={seed} result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="field" />
        <feComposite in="field" in2="SourceGraphic" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="sum" />
        <feColorMatrix
          in="sum"
          type="matrix"
          values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${k} ${-(k * threshold).toFixed(3)}`}
          result="dots"
        />
        <feFlood floodColor={color} result="ink" />
        <feComposite in="ink" in2="dots" operator="in" />
      </filter>
    </defs>
  );
}
