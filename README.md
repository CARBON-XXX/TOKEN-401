# TOKEN/401

The website of TOKEN/401, an AI research company whose first product is an autonomous cyber
defense system: **Tacit**, a millisecond reflex layer (System 1), and a team of agents that
investigates, contains, repairs and verifies incidents (System 2).

The home page is the company's site. It opens on the company's thesis and one drawing, then
introduces the first product in a two-figure spread (Tacit and the agents) and the safeguards.
After that come the statement, the principles, the journal, an essay on the name and a closing
letter. There are three journal articles at `/journal/[slug]`. The contact form opens as a letter.

Every colour, type size and motion on the site comes from [`DESIGN.md`](./DESIGN.md), the visual
system. It starts with the direction and derives the values from it. Read it before adding
anything to the UI.

## Running locally

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:4401
```

```bash
pnpm lint
npx tsc --noEmit
pnpm build && pnpm start
```

## Where things live

| Path                               | What it is                                                         |
| ---------------------------------- | ------------------------------------------------------------------ |
| `src/app/globals.css`              | Colour tokens and type steps (`type-*` utilities)                  |
| `src/components/sections/`         | The home page, one file per section                                |
| `src/components/art/two-speeds.tsx` | The hero drawing: a 12 ms burst and the stippled arch that follows |
| `src/components/art/seed-head.tsx`, `gathering.tsx` | The product figures: Tacit's seed head, the agents' stones |
| `src/components/art/organic.ts`    | Deterministic geometry for hand-feeling forms (pebbles, seed heads) |
| `src/components/art/grain.tsx`     | Print textures: `Grain` (specks) and `Stipple` (engraver's shading) |
| `src/components/brand/`            | The camellia: traced logo paths, stroke-by-stroke bloom, inked nav mark, rising wordmark |
| `src/content/journal.ts`           | Journal articles (plain data; add an entry to publish a new one)   |
| `src/app/api/contact/route.ts`     | Contact endpoint                                                   |

## Contact form

`POST /api/contact` validates the letter and logs it to the server console. Nothing is sent
anywhere yet. To deliver letters, replace the `console.info` in the route with your mail or CRM
provider and add its API key as an environment variable.

## Images

The site uses one photograph: the camellia beside the essay on the name
(`public/images/camellia-plaster.jpg`). The rule in `DESIGN.md` is at most one per page, set small.
The product is shown as SVG figures drawn in the page's own lines, type and earth colours.
Everything in them is illustrative, not live data. The paper texture is generated in CSS, so there
are no texture images to ship.
