# TOKEN/401 — Visual system

Direction first, values second. Every colour, size and motion below exists because one of
these words asks for it. If a new element can’t be justified by one of them, it doesn’t ship.

## 1. Direction

**Humanist · Editorial · Intellectual · Warm · Restrained · Organic**

Warm humanist modernism: the calm of a serious journal, not the glare of a console. Quality comes
from the texture of the materials — paper, ink, stipple, hairline — never from lighting effects.

| Word           | What it means for the work                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **Humanist**   | A person is always in the picture: a serif voice for judgement, “a person’s yes” drawn into the product. |
| **Editorial**  | Asymmetric grid, section rules, standfirsts in the serif, figures with captions — a magazine, not an app. |
| **Intellectual** | Research-driven and precise: diagrams that explain one idea each, real labels, nothing decorative.    |
| **Warm**       | Off-white paper, charcoal type, earth accents. No cold greys, no pure black.                            |
| **Restrained** | Generous negative space. One idea per section, one figure per idea.                                     |
| **Organic**    | Hand-feeling forms against exact lines: the stippled arch, the camellia, curves that breathe.           |

The home page is an **official company site**, not a product manual. It opens on the company’s
thesis and a single drawing, introduces the first product in a two-figure spread and the
safeguards, and then gives the company its own voice: statement, principles, journal, the essay
on the name, the closing letter.

## 2. Material

- **Paper.** The whole page carries a fine tooth of specks (`body::after`), printed over
  everything. Ink fields carry the same tooth in reverse (`[data-surface="ink"]::before`).
- **Stipple.** Organic forms are printed as dots whose _number_ thins out, the way an engraver
  shades (`Stipple` in `src/components/art/grain.tsx`). Never a smooth gradient.
- **Hairline.** Figures are drawn in fine lines — 0.75–1.25 px — like a pen, never as boxes and
  arrows. Hand-feeling outlines come from `organic.ts` (pebbles, seed heads), deterministic so
  server and client draw the same shape.
- **No light.** No glow, bloom, lens, blur or soft-light highlights. Nothing emits light.

## 3. Colour

Paper, charcoal, the warm greys between, and three earth accents that each mean one thing.

| Token      | Hex       | Role                                                        |
| ---------- | --------- | ----------------------------------------------------------- |
| `bone`     | `#EEE9DF` | Paper: the page ground                                      |
| `chalk`    | `#F6F2EA` | Type on ink                                                 |
| `plaster`  | `#D9D1C3` | Rules and cell borders on paper                             |
| `stone`    | `#8B8378` | Metadata, figure labels                                     |
| `graphite` | `#4B4640` | Secondary text                                              |
| `soot`     | `#201E1B` | Charcoal: primary type, strong lines, the solid button      |
| `ink`      | `#1B1916` | Ink fields: safeguards, principles, closing, footer         |
| `rubric`   | `#9B3B2B` | Earth red. The threat, and only the threat, on paper        |
| `alert`    | `#CF6A4F` | The same meaning on ink, and the person’s node in safeguards |
| `clay`     | `#A8603F` | Organic forms (the hero arch) and the shared incident state |
| `ochre`    | `#B48A47` | A quiet second earth, for small organic accents             |

On ink the steps are made from `chalk` alone: 100% for type, 60–68% for secondary type, 40–50%
for metadata, 12–20% for rules. No neon, no glossy gradients, no “cyber” colour.

## 4. Type

A refined serif against a grotesk, and a mono only for what a machine would print.

| Role    | Family                  | Use                                                                    |
| ------- | ----------------------- | ---------------------------------------------------------------------- |
| Display | Instrument Sans 500     | Headlines and titles. Tight tracking, lining figures.                  |
| Voice   | Newsreader 300 italic   | The judgement half of a headline (`type-voice`). At most once a view.  |
| Lede    | Newsreader 400          | Standfirsts under headlines (`type-lede`), set like a magazine’s deck. |
| Text    | Instrument Sans 400/450 | Body and interface.                                                    |
| Prose   | Newsreader 400          | Long reading: the essay and journal articles (`type-prose`).           |
| Caption | Newsreader italic       | Figure captions, “System 1”, the camellia’s name.                      |
| Machine | Geist Mono 400          | Figure labels and identifiers only.                                    |

| Step      | Size (fluid)                        | Line height | Tracking |
| --------- | ----------------------------------- | ----------- | -------- |
| Hero      | `clamp(2.75rem, 6.6vw, 7rem)`       | 0.98        | −0.045em |
| Display 1 | `clamp(2.375rem, 4.9vw, 4.625rem)`  | 1.01        | −0.04em  |
| Display 2 | `clamp(1.875rem, 3vw, 2.75rem)`     | 1.08        | −0.03em  |
| Title     | `clamp(1.25rem, 1.6vw, 1.5rem)`     | 1.2         | −0.018em |
| Lede      | `clamp(1.1875rem, 1.6vw, 1.4375rem)`, serif | 1.42 | −0.008em |
| Body      | `1rem`                              | 1.6         | 0        |
| Prose     | `1.1875rem`, serif                  | 1.62        | 0        |
| Mono      | `0.75rem`, tabular figures          | 1.5         | +0.01em  |

The voice rule: the serif italic appears only where the sentence turns from what the machine does
to the judgement it exercises — “Judgment that asks first.”, “asks first.”, “when to stop.”,
“A person’s yes”.

## 5. Layout

- Twelve columns, 1440 px measure, outer margin `clamp(20px, 5vw, 88px)`, 24 px gutter.
- Section rhythm `clamp(96px, 11vw, 168px)`. Reading measure never exceeds 34em.
- **Asymmetric head:** a section rule with its label (and a note on the right), the title over ten
  columns from the left, the standfirst offset to columns 7–11. Never a centred split hero.
- **Figures:** one idea each, set on the paper itself, never boxed. Figures are numbered like a
  journal’s (“Fig. 2”, serif italic) and captioned beneath a hairline: number, title, one plain
  paragraph. Spreads are staggered — the second figure starts lower than the first. No cards, no
  shadows.

## 6. Figures

| Figure             | Where      | What it says                                                                 |
| ------------------ | ---------- | ---------------------------------------------------------------------------- |
| Fig. 1 Two speeds  | Hero       | A sharp burst cut off in 12 ms, then a long stippled arch as the agents work. |
| Fig. 2 Seed head   | Product    | Tacit: one fine line for every workload, one in earth red where it acted.    |
| Fig. 3 Gathering   | Product    | The agents: seven engraved stones around the one incident they share.        |
| Fig. 4 Seven checks | Safeguards | One line of checks, with a branch through a person’s yes.                   |

Everything in them is illustrative, and says so where it could be mistaken for data.

## 7. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Text 1.2 s, colour 0.3–0.5 s.
- Behaviours:
  - **rise** — fade + 16 px, once, as content arrives.
  - **two speeds** — on load the burst draws in a fraction of a second, the arch over several.
    The motion _is_ the idea.
  - **loop** — the Tacit marker turns continuously; it is the one thing that never stops.
  - **flow** — the safeguards pulse and the threat-graph dashes move along their paths.
  - **scrub** — the company statement follows the reader’s scroll.
  - **draw** — the camellia opens across the principles.
- Nothing responds to hover or follows the pointer. Hover may change a colour; nothing moves,
  grows or appears. Every behaviour works the same on a phone.
- `prefers-reduced-motion` stops all of it and shows the finished state.

## 8. Imagery

Drawings, not pictures: every product idea is a figure in the page’s own lines, type and earth
colours. No mock screens, no dashboards, no generic AI imagery.

Photography is an accent: at most one per page, set small, warm monochrome, beside writing about
what it shows — the camellia beside the essay on the name.

## 9. Not in this system

Glow, bloom or light effects · glossy or decorative gradients · neon or cyberpunk colour · glass
and blur · incident logs, timestamps or telemetry as decoration · dashboards and feature grids ·
split hero with a dark rounded product card · rounded cards · drop shadows · stock security
imagery (locks, shields, hooded figures, matrix rain) · generic AI imagery (brains, circuits,
glowing orbs) · hover-driven motion · pointer-following effects · icons except the arrow · badges ·
invented performance claims outside a labelled illustration.
