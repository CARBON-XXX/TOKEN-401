# TOKEN/401 — Visual system

Direction first, values second. Every colour, size and motion below exists because one of
these words asks for it. If a new element can’t be justified by one of them, it doesn’t ship.

## 1. Direction

| Word          | What it means for the work                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Clear**     | An official website first: plain navigation, a statement a stranger understands, clean surfaces.                |
| **Exact**     | The look of a well-made instrument or technical document: hairline rules, square cells, real identifiers.       |
| **Two-speed** | The product thinks at two speeds, and so does the page: the grotesque for reflex, the serif italic for judgement. |
| **Candid**    | The writing carries the brand. Plain sentences, first person plural, no hype, no invented metrics.              |
| **Reserved**  | Monochrome with one signal colour. An element earns its place by carrying meaning, or it is removed.            |

The home page is **one incident, told in chapters**. Each section opens with a log line — time,
stage, actor — and the chapters run in order: Perceive, Contain, Escalate, Map, Propose, Provider
fails, Verified, Continue. The company’s own voice (statement, principles, journal, essay, letter)
comes after the incident is closed. The nav carries the clock of the chapter being read.

## 2. Colour

Ink on paper, the greys between them, and **rubric** as the only signal. Rubric means one thing
everywhere: the threat, or a thing that has failed. It is never decoration, never a link colour.
Surfaces are flat — no grain, noise or glow.

| Token      | Hex       | Role                                                   |
| ---------- | --------- | ------------------------------------------------------ |
| `ink`      | `#0F0E0D` | Dark fields: safeguards, principles, closing, footer   |
| `soot`     | `#1B1A18` | Primary text on paper, strong rules, the solid button  |
| `graphite` | `#4A4742` | Secondary text                                         |
| `stone`    | `#8A857C` | Metadata, log lines, disabled                          |
| `plaster`  | `#D5D0C5` | Rules and cell borders on paper                        |
| `bone`     | `#ECE8E0` | Page ground                                            |
| `chalk`    | `#F5F3EE` | Type on ink                                            |
| `rubric`   | `#A3303A` | Threat and failure on paper                            |
| `alert`    | `#D4404C` | Threat and failure on ink                              |

On ink the steps are made from `chalk` alone: 100% for type, 60–68% for secondary type, 40–50%
for metadata, 12–20% for rules.

## 3. Type

Three families, each with one job.

| Role    | Family                   | Use                                                                   |
| ------- | ------------------------ | --------------------------------------------------------------------- |
| Display | Instrument Sans 500      | Headlines and titles. Tight tracking, lining figures.                 |
| Voice   | Newsreader 300 italic    | The judgement half of a headline (`type-voice`). At most once a view. |
| Text    | Instrument Sans 400/450  | Ledes, body, interface.                                               |
| Prose   | Newsreader 400           | Long reading only: the essay and journal articles (`type-prose`).     |
| Machine | Geist Mono 400           | Only what a machine would print: times, IDs, action names, states.    |

| Step      | Size (fluid)                       | Line height | Tracking |
| --------- | ---------------------------------- | ----------- | -------- |
| Hero      | `clamp(2.75rem, 6.6vw, 7rem)`      | 0.98        | −0.045em |
| Display 1 | `clamp(2.375rem, 4.9vw, 4.625rem)` | 1.01        | −0.04em  |
| Display 2 | `clamp(1.875rem, 3vw, 2.75rem)`    | 1.08        | −0.03em  |
| Title     | `clamp(1.25rem, 1.6vw, 1.5rem)`    | 1.2         | −0.018em |
| Lede      | `clamp(1.125rem, 1.45vw, 1.3125rem)` | 1.45      | −0.012em |
| Body      | `1rem`                             | 1.6         | 0        |
| Prose     | `1.1875rem`, serif                 | 1.62        | 0        |
| Mono      | `0.75rem`, tabular figures         | 1.5         | +0.01em  |

The voice rule: the serif italic appears only where the sentence turns from what the machine does
to the judgement it exercises — “Judgment that asks first.”, “asks first.”, “when to stop.”

## 4. Layout

- Twelve columns, 1440 px measure, outer margin `clamp(20px, 5vw, 88px)`, 24 px gutter.
- Section rhythm `clamp(96px, 11vw, 168px)`. Reading measure never exceeds 34em.
- Chapter head: log line across the full measure, then the title over ten columns, then the lede
  offset to columns 7–11. Never a two-column split hero.
- Content sits in **ruled grids**: cells separated by 1 px of `plaster` (or `chalk` 12% on ink),
  square corners. No rounded cards, no shadows. Controls have a 4 px radius; chips 3 px.
- The hero is the only full-bleed image: the plotted cluster under the headline, with a readout
  strip of the incident beneath it.

## 5. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)`. Text 1.2 s, colour 0.3–0.5 s.
- Behaviours:
  - **rise** — fade + 16 px, once, as content arrives.
  - **incident** — the hero map plays one incident every 11 s and annotates itself as it goes.
  - **reflex** — the Tacit loop marker turns continuously; it is the one thing that never stops.
  - **flow** — the pipeline pulse and the threat-graph dashes move along their paths.
  - **scrub** — the lifecycle rule and the company statement follow the reader’s scroll.
  - **draw** — the camellia opens across the principles.
- Nothing responds to hover or follows the pointer. Hover may change a colour; nothing moves,
  grows or appears. Every behaviour works the same on a phone.
- `prefers-reduced-motion` stops all of it and shows the finished state.

## 6. Imagery

**The plotted cluster** (`ClusterField`) is the site’s one image. It is a 2D canvas drawing of a
cluster on paper — dots for workloads, squares for coordinators, survey crosses on the ground plane
— and it only ever shows what the product does. It is illustrative and says so in its readout.

Product ideas are shown as **specimens set in type**: the reflex loop, open hypotheses, the action
record, the provider table, the incident reconstruction, the two graphs. They use the page’s own
rules, mono and colours. No mock screens, no dashboards pretending to be screenshots.

Photography is an accent: at most one per page, set small, monochrome, beside writing about what it
shows — the camellia beside the essay on the name.

## 7. Not in this system

Split hero with a dark rounded product card · rounded cards · glass, blur and glow · neon or
“cyber” colour · gradients as decoration · stock security imagery (locks, shields, hooded figures,
matrix rain) · grain or noise · hover-driven motion · pointer-following effects · icons except the
arrow · badges · drop shadows · invented performance claims outside a labelled simulation.
