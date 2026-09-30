/** The shared drawing vocabulary of every product figure: a labelled box on a hairline. */

export type GNode = { id: string; x: number; y: number };

export type ChipTone = "outline" | "solid" | "threat" | "muted" | "earth";

export const CHIP_H = 30;

export function chipWidth(label: string) {
  return Math.max(84, label.length * 7.4 + 24);
}

const FILL: Record<ChipTone, string> = {
  outline: "var(--bone)",
  solid: "var(--soot)",
  threat: "var(--rubric)",
  muted: "var(--bone)",
  earth: "var(--bone)",
};

const STROKE: Record<ChipTone, string> = {
  outline: "var(--soot)",
  solid: "var(--soot)",
  threat: "var(--rubric)",
  muted: "var(--plaster)",
  earth: "var(--clay)",
};

const INK: Record<ChipTone, string> = {
  outline: "var(--soot)",
  solid: "var(--chalk)",
  threat: "var(--chalk)",
  muted: "var(--stone)",
  earth: "var(--clay)",
};

export function Chip({ n, tone = "outline" }: { n: GNode; tone?: ChipTone }) {
  const w = chipWidth(n.id);
  return (
    <g>
      <rect
        x={n.x - w / 2}
        y={n.y - CHIP_H / 2}
        width={w}
        height={CHIP_H}
        rx={3}
        fill={FILL[tone]}
        stroke={STROKE[tone]}
        strokeWidth={1}
      />
      <text x={n.x} y={n.y + 4} textAnchor="middle" className="font-mono" fontSize={11.5} fill={INK[tone]}>
        {n.id}
      </text>
    </g>
  );
}
