# TOKEN/401

The website of TOKEN/401, an AI research company whose first product is an autonomous cyber
defense system: **Tacit**, a millisecond reflex layer (System 1), and a team of agents that
investigates, contains, repairs and verifies incidents (System 2).

The home page tells one simulated incident in chapters — Perceive, Contain, Escalate, Map, Propose,
Provider fails, Verified — and then the company: statement, principles, journal, an essay on the
name and a closing letter. There are three journal articles at `/journal/[slug]`. The contact form
opens as a letter.

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
| `src/components/sections/`         | The home page, one file per chapter                                |
| `src/components/art/cluster-field.tsx` | The hero map: a canvas drawing of the cluster that plays an incident |
| `src/components/site/log-line.tsx` | The time · stage · actor line each chapter opens with              |
| `src/components/brand/`            | The camellia: traced logo paths and stroke-by-stroke bloom         |
| `src/content/journal.ts`           | Journal articles (plain data; add an entry to publish a new one)   |
| `src/app/api/contact/route.ts`     | Contact endpoint                                                   |

## Contact form

`POST /api/contact` validates the letter and logs it to the server console. Nothing is sent
anywhere yet. To deliver letters, replace the `console.info` in the route with your mail or CRM
provider and add its API key as an environment variable.

## Images

The site uses one photograph: the camellia beside the essay on the name
(`public/images/camellia-plaster.jpg`). The rule in `DESIGN.md` is at most one per page, set small.
The product is shown as typeset specimens and one canvas drawing, the hero's plotted cluster.
Everything in them is illustrative, not live data. Everything else is type and the traced logo.
