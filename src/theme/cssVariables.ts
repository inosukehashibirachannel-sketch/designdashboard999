/**
 * Bridges the TypeScript design tokens to CSS custom properties.
 *
 * The tokens in `tokens.ts` are the single source of truth. This module flattens
 * them into `--namespace-key` CSS variables so that CSS Modules and global styles
 * consume the exact same values as TypeScript/SVG code — they can never drift.
 *
 * The generated declaration block is injected once into the document `<head>`
 * by the root layout, so `:root` always carries the live token values.
 */
import { colors, radii, spacing, typography, shadows } from './tokens';

/** Convert a token group into `--prefix-key: value;` declarations. */
function declarations(
  prefix: string,
  group: Record<string, string | number>,
): string[] {
  return Object.entries(group).map(
    ([key, value]) => `--${prefix}-${key}: ${value};`,
  );
}

/**
 * Build the full list of CSS variable declarations from the tokens.
 * Returned as an array so it is trivially unit-testable.
 */
export function cssVariableDeclarations(): string[] {
  return [
    ...declarations('color', colors),
    ...declarations('space', spacing),
    ...declarations('radius', radii),
    ...declarations('font-size', typography.fontSize),
    ...declarations('font-weight', typography.fontWeight),
    ...declarations('line-height', typography.lineHeight),
    `--font-family-base: ${typography.fontFamily};`,
    `--font-family-mono: ${typography.fontMono};`,
    ...declarations('shadow', shadows),
  ];
}

/** Render the `:root { ... }` block injected by the layout. */
export function rootCssVariables(): string {
  return `:root {\n  ${cssVariableDeclarations().join('\n  ')}\n}`;
}

export default rootCssVariables;
