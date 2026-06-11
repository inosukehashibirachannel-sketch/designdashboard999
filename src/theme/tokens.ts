/**
 * Centralized design tokens — the single source of truth for the dashboard's
 * visual system. Every component must consume these values (either via the
 * TypeScript objects below, e.g. for SVG charts, or via the CSS custom
 * properties generated from them in `globals.css`).
 *
 * Do NOT hardcode colors, spacing, radii, or typography anywhere else.
 */

/**
 * Dark theme color palette.
 *
 * Contrast notes (WCAG 2.1 AA, against `bg`/`surface`):
 * - `text` on `bg`/`surface` exceeds 4.5:1.
 * - `textMuted` is reserved for large/secondary text only.
 * - Accent colors are tuned to remain legible on dark navy surfaces.
 */
export const colors = {
  // Backgrounds / surfaces
  bg: '#0b1120', // deep app background
  bgElevated: '#0f172a', // slightly raised regions
  surface: '#111c34', // navy/dark-blue card surface
  surfaceAlt: '#16233f', // alternate surface (rows, insets)
  border: '#243049', // subtle card / divider borders
  borderStrong: '#33425f',

  // Text
  text: '#e6edf7', // primary text
  textSecondary: '#aab6cc', // secondary text
  textMuted: '#7c89a3', // muted / captions (large text only)

  // Brand / data accents
  primary: '#3b82f6', // blue primary accent
  primaryStrong: '#60a5fa', // brighter blue for emphasis on dark bg
  cyan: '#22d3ee', // tickets-by-tag bars
  amber: '#f59e0b', // alerts / "Solved" series / warnings
  red: '#ef4444', // high-risk / worsening
  green: '#22c55e', // positive trends / healthy
  greenStrong: '#4ade80', // brighter green for arcs on dark bg

  // Series (charts)
  seriesReceived: '#3b82f6', // blue
  seriesSolved: '#f59e0b', // amber

  // Misc
  track: '#1c2942', // gauge / progress track (unfilled)
  focusRing: '#7dd3fc', // visible keyboard focus outline
} as const;

/** Spacing scale (px). Use for padding, gaps, and margins. */
export const spacing = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

/** Border radii. */
export const radii = {
  none: '0',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  pill: '999px',
} as const;

/** Typography tokens. */
export const typography = {
  fontFamily:
    "var(--font-inter), Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontMono:
    "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  fontSize: {
    xs: '11px',
    sm: '13px',
    md: '15px',
    lg: '18px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '44px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.45,
  },
} as const;

/** Elevation / shadow tokens. */
export const shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25)',
  focus: `0 0 0 2px ${colors.bg}, 0 0 0 4px ${colors.focusRing}`,
} as const;

/** z-index scale. */
export const zIndex = {
  base: 0,
  raised: 10,
  overlay: 100,
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
  zIndex,
} as const;

export type Tokens = typeof tokens;

export default tokens;
