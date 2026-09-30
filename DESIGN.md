# TOKEN/401 — Visual system

Direction first, values second. Every colour, size and motion below exists because one of
these six words asks for it. If a new element can’t be justified by one of them, it doesn’t ship.

## 1. Direction

| Word           | What it means for the work                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Clear**      | An official website first: plain navigation, a statement a stranger understands, clean surfaces. Art is one touch. |
| **Unhurried**  | Time is a material. Long, soft easing. Generous space. One idea per screen; the reader is never rushed.               |
| **Pressed**    | The one image is made by a real process: type pressed into cotton paper, inked or blind, shown by raking light.       |
| **Candid**     | The writing carries the brand. Plain sentences, first person plural, no jargon, no metrics theatre.                  |
| **Reserved**   | Monochrome. Nothing decorative. An element earns its place by carrying meaning, or it is removed.                    |
| **Heritage**   | The camellia is treated as a house emblem: used large, used rarely, with ceremony — the way a maison uses its seal.  |

## 2. Colour

Seven tones: ink on cotton paper, and the greys between them. No pure black, no pure white,
no accent colour. Surfaces are flat — no grain, noise or paper overlays. The only texture on the
site is the cover sheet's, and it comes from the press.

| Token      | Hex       | Role                                                        |
| ---------- | --------- | ----------------------------------------------------------- |
| `ink`      | `#0F0E0D` | Dark fields: cover, principles, closing, footer             |
| `soot`     | `#1B1A18` | Primary text on paper                                       |
| `graphite` | `#4A4742` | Secondary text                                              |
| `stone`    | `#8A857C` | Captions, metadata, disabled                                |
| `plaster`  | `#D5D0C5` | Rules on paper, quiet fills                                 |
| `bone`     | `#ECE8E0` | Page ground                                                 |
| `chalk`    | `#F5F3EE` | Type and light on ink                                       |

On ink the same four steps are made from `chalk` alone: 100% for type, 62% for secondary type,
28% for numerals and quiet marks (never for words), 14% for rules. A strong rule on paper is `soot`.
Proportion across a page: roughly 60% bone, 35% ink, the rest in type.
The only gradients are made by light: the raking light across the cover sheet, and the glow
behind the closing flower.

## 3. Type

Two voices. Newsreader, a serif with optical sizes, for everything that speaks; a geometric sans
that echoes the wordmark for everything that directs.

| Role     | Family                     | Use                                                  |
| -------- | -------------------------- | ---------------------------------------------------- |
| Display  | Newsreader 300             | Headlines, statements. 40 px and above only.         |
| Pressed  | Newsreader 400 / 300       | The cover headline (inked) and numerals (blind).     |
| Text     | Newsreader 400             | Reading: ledes, essays, captions. 16–24 px.          |
| Utility  | Jost 400 / 500             | Navigation, labels, buttons. Never for reading.      |

| Step        | Size (fluid)                   | Line height | Tracking  |
| ----------- | ------------------------------ | ----------- | --------- |
| Hero        | `clamp(3.5rem, 8vw, 8.25rem)`   | 0.96        | −0.03em   |
| Blind       | `min(50svh, 29vw)`, lining figures | 0.8      | −0.04em   |
| Marque      | `clamp(3.75rem, 13vw, 12rem)`   | 0.86        | −0.04em   |
| Display 1   | `clamp(3rem, 7.2vw, 7.75rem)`   | 0.96        | −0.02em   |
| Display 2   | `clamp(2.25rem, 4.2vw, 4.25rem)`| 1.06        | −0.012em  |
| Lede        | `clamp(1.375rem, 2vw, 1.75rem)` | 1.45        | 0         |
| Body        | `1.1875rem`                     | 1.65        | 0         |
| Caption     | `0.9375rem`, italic             | 1.5         | 0         |
| Label       | `0.75rem`, Jost 500, uppercase  | 1           | +0.16em   |

Marque is reserved for proper names set as lettering — the two product names. The footer wordmark
is the logo itself, never retyped.

Rules: italic at most once per section, and only where the voice would lean on the word.
Serif text uses old-style figures. No monospace anywhere.

## 4. Layout

- Twelve columns, 1440 px measure, outer margin `clamp(20px, 5vw, 88px)`, 24 px gutter.
- Section rhythm `clamp(112px, 14vw, 208px)`. Reading measure never exceeds 36em.
- The **cover** is a full-bleed sheet: the statement set left and low, the blind 401 at the right
  edge, never under the words. The **page** is bone with asymmetric editorial columns; the ink rooms
  (principles, closing, footer) give the scroll its rhythm.
- Scale does the work that ornament usually does: the pressed 401, the footer wordmark and the
  principle numerals are the only “graphics”.

## 5. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Text 1.2 s, the press 1.8 s, colour changes 0.5 s.
- Behaviours, each tied to reading rather than to time:
  - **rise** — fade + 16 px, for most text.
  - **draw** — the camellia, stroke by stroke. In Principles it is scrubbed by scroll and opens
    from bud to full bloom across the three principles (sticky on wide screens).
  - **press** — on arrival the cover headline is pressed and inked as the cylinder of a proof press
    passes left to right, while the light lowers from overhead to raking and the blind 401 appears.
  - **ink** — the Approach statement takes on ink word by word as it is read.
  - **pause, then speak** — the Camellia specimen waits visibly before answering word by word.
  - **set** — the footer wordmark rises glyph by glyph out of its baseline.
- Only light moves on its own: the light on the cover sheet (which also turns as the sheet scrolls
  away), the glow behind the closing flower (10 s), and daylight across the essay photograph (26 s).
  The single other loop is the “awaiting you” dot, because the slip is literally waiting.
- Nothing responds to hover or follows the pointer. Hover may change a colour; nothing moves,
  grows or appears. Every behaviour works the same on a phone.
- `prefers-reduced-motion` removes all of it: text is shown fully inked, flowers fully drawn.

## 6. Imagery

**The press.** The site's one image is the cover sheet (`PressSheet`). It prints only the page's
own words: text marked `data-press="ink"` is pressed and inked, `data-press="blind"` is pressed
without ink. The page lays the words out; the sheet only reads where each glyph landed, so the
text stays real, selectable and responsive, and falls back to plain type without WebGL. Depths are
shallow and walls soft — a blind impression should be found by the light, not announced.

Photography is an accent, never the subject of a page. At most one photograph per page, set small
(three columns or fewer), monochrome only, and only beside writing that is about what it shows —
the camellia beside the essay on the name. A photograph never stands in for a product, an idea or
a mood.

When a product needs showing, it is shown working and set in type: a single specimen such as the
Threshold request, drawn with the same rules, labels and buttons as the page. No mock screens.

## 7. Not in this system

Monospace “technical” labels · procedural art for its own sake (the press renders a physical
process, and prints only the page's words) · grain, noise or paper overlays · hover-driven motion ·
pointer-following effects · glass, blur and glow effects · gradients as decoration · icons (except
the arrow) · badges · drop shadows · stock metaphors.
