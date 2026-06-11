# CLAUDE.md

Guidance for working in this repository.

## Project

**DesignDashboard999** — a single-page, dark-themed **weekly analytics dashboard**
for demos and UI prototyping. Front-end only: no backend, no auth, no API calls.
All data is generated in-browser from a **seeded RNG** so the UI is lively but
repeatable. Built with Next.js + TypeScript and deployed as a **fully static
export** to Vercel. Requires **no environment variables or secrets**.

## Tech stack

- **Next.js 15** (App Router) — `output: 'export'` for a fully static site.
- **React 18.3** + **TypeScript 5.6** (strict mode).
- **CSS Modules** + token-derived CSS custom properties (no CSS-in-JS lib).
- **Vitest 3** + Testing Library (jsdom) for unit/component tests.
- **ESLint** (`next/core-web-vitals` + `prettier`) and **Prettier**.

## Commands

| Command            | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Local dev server (http://localhost:3000).       |
| `npm run build`    | Static export → `out/` (also `npm run export`). |
| `npm run lint`     | ESLint via `next lint`.                         |
| `npm run format`   | Prettier write (`format:check` to verify).      |
| `npm run test`     | Vitest run (`test:watch` for watch mode).       |
| `npx tsc --noEmit` | Type-check the whole project.                   |

Before committing, ensure all pass: typecheck, lint, test, `format:check`, build.

## Structure

- `app/` — App Router. `layout.tsx` (root layout, Inter font, token injection),
  `page.tsx` (the single dashboard route), `globals.css`, CSS Modules.
- `src/theme/` — `tokens.ts` (the single source of truth for all design tokens)
  and `cssVariables.ts` (flattens tokens into `:root` CSS custom properties,
  injected by the layout so CSS and TS/SVG code never drift).
- `src/data/` — the single source of truth for all widget data. `rng.ts`
  (seeded PRNG + helpers), `generateDashboardData.ts` (pure
  `(seed, referenceMs) → DashboardData`), `format.ts` (pure display/`computeDelta`
  helpers), `types.ts`, and `DashboardDataContext.tsx`
  (`DashboardDataProvider` + `useDashboardData()`). Generated once per load and
  shared via context; never call the generator directly inside a widget.

## Conventions & constraints (must follow)

- **Tokens only.** Never hardcode colors, spacing, radii, or typography. Add to
  `src/theme/tokens.ts` and consume via CSS variables (`var(--color-…)`,
  `var(--space-…)`, etc.) or by importing the TS token objects (e.g. for SVG).
- **Single page only** — no sidebar, no multi-page navigation.
- **Front-end only** — no backend, no network/fetch for dashboard data.
- **Seeded data** — one shared module is the source of truth for all widgets.
  Default seed `1337`, optional `?seed=` client-side override. Resolve the seed
  client-side consistently to avoid hydration mismatches.
- **Charts** — custom SVG components; avoid heavy charting libraries (bundle).
- **TypeScript** everywhere; keep components small, focused, reusable.
- **Accessibility** — semantic HTML, keyboard nav, visible focus, ARIA on
  non-text/chart elements; maintain WCAG AA contrast on the dark theme.
- **Tests** — unit tests for data generation and formatting helpers; component
  tests for critical widgets (render/empty/responsive states).
- **Performance** — memoize expensive computations; keep animations subtle and
  honor `prefers-reduced-motion`; bundle target < 300 KB gz for the route.
- **Static export** — anything used must work without a server runtime.

## Notes

- `next lint` prints a deprecation notice (removed in Next 16) but runs cleanly.
- `npm audit`: 0 critical/high. Remaining moderates are build/dev tooling only
  (postcss/esbuild/vite) and are not shipped in the static `out/` artifact.
- `vitest.config.mts` uses the `.mts` extension because `@vitejs/plugin-react`
  is ESM-only.
