# DesignDashboard999

A single-page, dark-themed **weekly analytics dashboard** for demos and UI
prototyping. Built with **Next.js + TypeScript** and deployed as a **fully
static site** (no backend, no auth, no API calls). All data is generated
in-browser from a seeded RNG so the UI is lively yet repeatable.

> The app requires **no environment variables or secrets** to run or build.

## Prerequisites

- Node.js 20+ (developed on Node 22)
- npm 10+

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Description                                        |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Start the local dev server.                        |
| `npm run build`  | Build the **static export** into `out/`.           |
| `npm run export` | Alias of `build` (static export is config-driven). |
| `npm run lint`   | Run ESLint (`next lint`).                          |
| `npm run format` | Format the codebase with Prettier.                 |
| `npm run test`   | Run unit/component tests with Vitest.              |

## Static export

`next.config.mjs` sets `output: 'export'`, so `npm run build` emits a fully
static site to the `out/` directory — no server runtime required. This deploys
to Vercel (or any static host) with zero configuration.

## Architecture

- **`app/`** — App Router. `layout.tsx` (root layout, fonts, token injection)
  and `page.tsx` (the single dashboard route).
- **`src/theme/`** — centralized design tokens (`tokens.ts`) and the
  CSS-variable bridge (`cssVariables.ts`). **All styling must consume these
  tokens** — never hardcode colors, spacing, radii, or typography elsewhere.
- **`app/globals.css`** — global dark styles referencing the generated CSS
  custom properties.

Styling uses CSS Modules (built into Next.js, zero extra dependencies) reading
the token-derived CSS variables, keeping the bundle lean and SSR/export-safe.
