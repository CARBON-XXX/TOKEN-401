# TOKEN/401

The website of TOKEN/401, an AI research company. The site has a home page (cover, approach,
an essay on the name, principles, products, journal index and a closing letter) and three journal
articles at `/journal/[slug]`. The contact form opens as a letter.

Every colour, type size and motion on the site comes from [`DESIGN.md`](./DESIGN.md), the visual
system. It starts with five words of direction and derives the values from them. Read it before
adding anything to the UI.

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
| `src/app/globals.css`              | Colour tokens, type steps (`type-*` utilities), paper texture      |
| `src/components/sections/`         | The home page, one file per section                                |
| `src/components/brand/`            | The camellia: traced logo paths, stroke-by-stroke bloom, cover emblem |
| `src/content/journal.ts`           | Journal articles (plain data; add an entry to publish a new one)   |
| `src/app/api/contact/route.ts`     | Contact endpoint                                                   |

## Contact form

`POST /api/contact` validates the letter and logs it to the server console. Nothing is sent
anywhere yet. To deliver letters, replace the `console.info` in the route with your mail or CRM
provider and add its API key as an environment variable.

## Images

Only two photographs are used, both of the camellia (`public/images/`). The rule in `DESIGN.md`
is at most two per page. Everything else is type, the traced logo, and paper.
