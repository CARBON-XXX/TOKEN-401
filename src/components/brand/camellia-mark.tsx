import type { SVGProps } from "react";

import { CAMELLIA_FILL, WORDMARK, type TracedGlyph } from "./logo-paths";

type GlyphProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  title?: string;
};

function TracedSvg({ glyph, title, ...props }: GlyphProps & { glyph: TracedGlyph }) {
  return (
    <svg
      viewBox={`0 0 ${glyph.width} ${glyph.height}`}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <g transform={glyph.transform}>
        {glyph.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

export function CamelliaMark(props: GlyphProps) {
  return <TracedSvg glyph={CAMELLIA_FILL} {...props} />;
}

export function Wordmark(props: GlyphProps) {
  return <TracedSvg glyph={WORDMARK} {...props} />;
}

export const WORDMARK_RATIO = WORDMARK.width / WORDMARK.height;
