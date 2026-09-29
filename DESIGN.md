# TOKEN/401 — Visual system

Direction first, values second. Every colour, size and motion below exists because one of
these five words asks for it. If a new element can’t be justified by one of them, it doesn’t ship.

## 1. Direction

| Word           | What it means for the work                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Unhurried**  | Time is a material. Long, soft easing. Generous space. One idea per screen; the reader is never rushed.               |
| **Tactile**    | Surfaces read as paper, plaster and ink. Texture comes from material — grain, fibre, print — never from effects.      |
| **Candid**     | The writing carries the brand. Plain sentences, first person plural, no jargon, no metrics theatre.                  |
| **Reserved**   | Monochrome. Nothing decorative. An element earns its place by carrying meaning, or it is removed.                    |
| **Heritage**   | The camellia is treated as a house emblem: used large, used rarely, with ceremony — the way a maison uses its seal.  |

## 2. Colour

Seven tones, taken from the brand poster: ink on cotton paper, and the greys of old plaster.
No pure black, no pure white, no accent colour.

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
The single gradient allowed is light itself — the glow behind the emblem on the cover.

## 3. Type

Two voices. A Garamond for everything that speaks, a geometric sans that echoes the wordmark
for everything that directs.

| Role     | Family                     | Use                                                  |
| -------- | -------------------------- | ---------------------------------------------------- |
| Display  | Cormorant Garamond 300     | Headlines, statements. 40 px and above only.         |
| Text     | EB Garamond 400            | Reading: ledes, essays, captions. 16–24 px.          |
| Utility  | Jost 400 / 500             | Navigation, labels, buttons. Never for reading.      |

| Step        | Size (fluid)                   | Line height | Tracking  |
| ----------- | ------------------------------ | ----------- | --------- |
| Marque      | `clamp(4.25rem, 15vw, 14rem)`   | 0.82        | −0.035em  |
| Cover       | `clamp(2.75rem, 5.4vw, 5.5rem)` | 1.04        | −0.012em  |
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
- Pages alternate two compositions: the **cover** (full-bleed ink, centred, cinematic) and the
  **page** (bone, asymmetric editorial columns). No two consecutive sections share a layout.
- Scale does the work that ornament usually does: the footer wordmark, the cover emblem and the
  principle numerals are the only “graphics”.

## 5. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Text 1.2 s, emblem 2.8 s, hover 0.5 s.
- Three behaviours only: **rise** (fade + 16 px), **draw** (the camellia, stroke by stroke),
  **ascend** (the cover emblem rising like first light).
- Nothing loops except the cover’s light, which breathes once every ten seconds.
- `prefers-reduced-motion` removes all of it.

## 6. Imagery

Photography is an accent, never the subject of a page. At most two photographs per page,
monochrome silver-gelatin only, and always the camellia itself.

When a product needs showing, it is shown working and set in type: a single specimen such as the
Threshold request, drawn with the same rules, labels and buttons as the page. No mock screens.

## 7. Not in this system

Monospace “technical” labels · generative or procedural art · glass, blur and glow effects ·
gradients as decoration · icons (except the arrow) · badges · drop shadows · stock metaphors.
