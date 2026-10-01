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
| **Warm**       | Off-white paper, charcoal type, earth accents; one cool ink kept for the machine. No pure black.        |
| **Restrained** | Generous negative space. One idea per section, one figure per idea.                                     |
| **Organic**    | Hand-feeling forms against exact lines: the stippled arch, the camellia, curves that breathe.           |

The home page is an **official company site**, not a product manual. It opens on the company’s
thesis and a single drawing, introduces the first product in a two-figure spread and the
safeguards, and then gives the company its own voice: statement, principles, journal, the essay
on the name, the closing letter.

## 2. Material

- **Paper.** The whole page carries a fine tooth of specks (`body::after`), printed over
  everything. Ink fields carry the same tooth in reverse (`[data-surface="ink"]::before`). Keep it
  faint, felt more than seen: 26% on paper, 16% on ink. If the grain reads as texture from arm’s
  length, it is too strong.
- **Stipple.** Organic forms are printed as dots whose _number_ thins out, the way an engraver
  shades (`Stipple` in `src/components/art/grain.tsx`). Never a smooth gradient.
- **Hairline.** Figures are drawn in fine lines — 0.75–1.25 px — like a pen, never as boxes and
  arrows. Hand-feeling outlines come from `organic.ts` (pebbles, seed heads), deterministic so
  server and client draw the same shape.
- **Instrument markings.** The technology shows in precision, not in effects: scales with minor
  and major ticks, a broken axis where two time scales meet, a bezel with one mark per workload,
  leader lines to callouts, step numbers. Readouts are a value over a state — `12 ms` over
  `CONTAINED` — as an instrument would print them.
- **No light.** No glow, bloom, lens, blur or soft-light highlights. Nothing emits light.

## 3. Colour

Paper and charcoal, near-neutral greys between, and a page printed in **two temperatures**, the
way the headline is set in two voices. Indigo is the machine — Tacit, the reflex, anything
measured. Clay is judgement — the agents’ long deliberation, the incident they share, a
person’s yes. Cinnabar is the threat and nothing else. Think of a two-ink print: every accent is a
spot colour with one meaning, never decoration.

| Token      | Hex       | Role                                                             |
| ---------- | --------- | ---------------------------------------------------------------- |
| `bone`     | `#EDEAE3` | Paper: the page ground                                           |
| `chalk`    | `#F4F2ED` | Type on ink                                                      |
| `plaster`  | `#D6D2C9` | Rules, cell borders, minor ticks                                 |
| `stone`    | `#77726B` | Metadata, figure labels, major ticks                             |
| `graphite` | `#4A4845` | Secondary text                                                   |
| `soot`     | `#1C1C1B` | Charcoal: primary type, strong lines, the solid button           |
| `ink`      | `#171819` | Ink fields: safeguards, principles, closing, footer              |
| `indigo`   | `#2F4B72` | The machine on paper: Tacit’s signal and core, “contained”, text selection |
| `mist`     | `#9DB0C5` | The machine on ink: the Tacit risk check                         |
| `clay`     | `#94533A` | Judgement on paper: the agents’ arch, the shared incident, “verified” |
| `alert`    | `#D8795C` | Judgement on ink: the person’s node in safeguards                |
| `rubric`   | `#B23B22` | Cinnabar. The threat, and only the threat                        |

On ink the steps are made from `chalk` alone: 100% for type, 55–68% for secondary type, 40–50%
for metadata, 12–20% for rules. No neon, no glossy gradients, no “cyber” colour; indigo stays a
printing ink, never a screen blue.

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
| Machine | Geist Mono 400          | Readouts, identifiers and dates (`type-mono`).                         |
| Marking | Geist Mono 400, caps    | Instrument labels: states, stages, kinds (`type-tech`). Units stay lower case: `12 ms`. |

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
| Marking   | `0.6875rem`, caps, tabular figures  | 1.3         | +0.08em  |

Sentences are never set in mono: a check’s question (“is it allowed?”) is text, in the grotesk.
Mono is for what the machine prints — a value, a state, a step number.

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
- **Below the wide grid:** a layout that only fits at 1440 px is not a layout. Section labels stack
  their note under the label on phones rather than wrap either side. The journal is set as a
  contents list — kind and date in a margin column, title and dek beside it — until three columns
  have room (`lg`). Where a figure leads its prose (the camellia in the essay) it opens the
  article as a plate on phones and sits sticky beside it from `md`.

## 6. Figures

| Figure             | Where      | What it says                                                                 |
| ------------------ | ---------- | ---------------------------------------------------------------------------- |
| Fig. 1 Two speeds  | Hero       | An indigo burst cut off in 12 ms, then a long clay arch as the agents work, on one axis broken between milliseconds and minutes. |
| Fig. 2 Seed head   | Product    | Tacit: one fine line for every workload inside a bezel with one mark per workload; one in cinnabar, called out, where it acted. |
| Fig. 3 Gathering   | Product    | The agents: seven engraved stones around the one incident they share.        |
| Fig. 4 Seven checks | Safeguards | Seven numbered checks on one line, with a branch through a person’s yes.    |

Everything in them is illustrative, and says so where it could be mistaken for data. Where a
figure has a scale, the scale is honest about itself: a broken axis rather than “not to scale”.

A figure’s lines may scale with the page; its type may not. Fig. 1 is drawn in three geometries
(wide from `xl`, medium from `md`, narrow below) and holds its markings near their set size with
`useTypeHold`, which measures the drawing and counter-scales the type within a clamp. Labels that
cross the stipple are knocked out of it with a paper-coloured stroke behind the letters, as a
printer would mask a plate, never with a box.

## 7. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Text 1.2 s, colour 0.3–0.5 s.
- Behaviours:
  - **rise** — fade + 16 px, once, as content arrives.
  - **ink** — on arrival the nav camellia is inked in along its own centerlines, heart first,
    while the wordmark’s letters rise out of their baseline. The pen is a mask over the real
    filled mark, so the last frame is the logo itself. Going back to the top inks it again.
  - **lean** — the camellia leans with the speed of the scroll (at most 8°) and springs back
    upright when the page is still, like a flower in a draught.
  - **two speeds** — on load the burst draws in a fraction of a second, the arch over several.
    The motion _is_ the idea.
  - **loop** — the Tacit marker turns continuously; it is the one thing that never stops.
  - **flow** — the safeguards pulse and the threat-graph dashes move along their paths.
  - **scrub** — the company statement follows the reader’s scroll.
  - **draw** — the camellia opens across the principles.
  - **read** — a hairline across the top of a journal article fills with the reader’s place in
    the text, on a soft spring so it never jitters.
- Interaction is answered by touch, not by hover:
  - **press** — buttons and pills set one pixel into the page while held, at 75 ms, and darken a
    step, the way a key gives under a finger.
  - **place** — one line under the nav marks the section being read and slides to the next as
    the reader arrives; it is measured from the link itself, so it fits any label length.
  - **copy** — the closing address copies in one press; the label turns from `Copy` to `Copied`
    and back, and a polite status line tells a screen reader the same.
- Nothing responds to hover or follows the pointer. Hover may change a colour; nothing moves,
  grows or appears. Every behaviour works the same on a phone.
- `prefers-reduced-motion` stops all of it and shows the finished state. New components read it
  through `useStill()` (in `motion-primitives.tsx`), which stays false through hydration so the
  server HTML always matches.

## 8. Imagery

Drawings, not pictures: every product idea is a figure in the page’s own lines, type and earth
colours. No mock screens, no dashboards, no generic AI imagery.

Photography is an accent: at most one per page, set small, warm monochrome, beside writing about
what it shows — the camellia beside the essay on the name.

## 9. Colophon and edges

The site signs off like a printed book. The footer closes with a colophon: the three typefaces by
name and role, the paper (“bone”), and the four inks it is printed in — charcoal, indigo, clay,
cinnabar — as swatches with what each one means. It is the palette’s rule stated in public.

The edges keep the voice. A missing page answers as an instrument would: 401 against 404, “asks
first” against “nothing here”, the name of the company explained by the one error it is not.

## 10. Not in this system

Glow, bloom or light effects · glossy or decorative gradients · neon or cyberpunk colour · glass
and blur · incident logs, timestamps or telemetry as decoration · dashboards and feature grids ·
split hero with a dark rounded product card · rounded cards · drop shadows · stock security
imagery (locks, shields, hooded figures, matrix rain) · generic AI imagery (brains, circuits,
glowing orbs) · hover-driven motion · pointer-following effects · icons except the arrow · badges ·
invented performance claims outside a labelled illustration.
