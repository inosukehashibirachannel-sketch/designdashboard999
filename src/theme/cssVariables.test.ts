import { describe, expect, it } from 'vitest';
import { cssVariableDeclarations, rootCssVariables } from './cssVariables';
import { colors } from './tokens';

describe('cssVariables', () => {
  it('emits one declaration per color token', () => {
    const decls = cssVariableDeclarations();
    Object.keys(colors).forEach((key) => {
      expect(decls).toContain(
        `--color-${key}: ${colors[key as keyof typeof colors]};`,
      );
    });
  });

  it('wraps declarations in a :root block', () => {
    const root = rootCssVariables();
    expect(root.startsWith(':root {')).toBe(true);
    expect(root.trimEnd().endsWith('}')).toBe(true);
    expect(root).toContain('--color-bg: #0b1120;');
    expect(root).toContain('--space-lg: 16px;');
    expect(root).toContain('--radius-lg: 14px;');
  });

  it('includes the base font-family variable', () => {
    expect(rootCssVariables()).toContain('--font-family-base:');
  });
});
