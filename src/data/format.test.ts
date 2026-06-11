import { describe, expect, it } from 'vitest';
import {
  computeDelta,
  formatCompactCurrency,
  formatDuration,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  formatSignedPercent,
} from './format';

describe('computeDelta', () => {
  it('marks an increase as improvement by default', () => {
    const d = computeDelta(120, 100);
    expect(d.direction).toBe('up');
    expect(d.deltaAbs).toBe(20);
    expect(d.deltaPct).toBeCloseTo(20);
    expect(d.isImprovement).toBe(true);
  });

  it('marks a decrease as improvement when lowerIsBetter', () => {
    const d = computeDelta(40, 60, { lowerIsBetter: true });
    expect(d.direction).toBe('down');
    expect(d.isImprovement).toBe(true);
  });

  it('marks an increase as worsening when lowerIsBetter', () => {
    const d = computeDelta(60, 40, { lowerIsBetter: true });
    expect(d.direction).toBe('up');
    expect(d.isImprovement).toBe(false);
  });

  it('handles flat and zero-previous safely', () => {
    expect(computeDelta(50, 50).direction).toBe('flat');
    expect(computeDelta(50, 50).isImprovement).toBe(false);
    expect(computeDelta(5, 0).deltaPct).toBe(0);
  });
});

describe('number/percent/currency formatting', () => {
  it('formats numbers with separators', () => {
    expect(formatNumber(12480)).toBe('12,480');
    expect(formatNumber(1480.6)).toBe('1,481');
  });

  it('formats percentages', () => {
    expect(formatPercent(91.4, 1)).toBe('91.4%');
    expect(formatPercent(91.4)).toBe('91%');
  });

  it('formats signed percentages for badges', () => {
    expect(formatSignedPercent(4.2)).toBe('+4.2%');
    expect(formatSignedPercent(-1)).toBe('-1.0%');
  });

  it('formats compact currency', () => {
    expect(formatCompactCurrency(182000)).toBe('$182k');
    expect(formatCompactCurrency(250000)).toBe('$250k');
    expect(formatCompactCurrency(1200000)).toBe('$1.2M');
    expect(formatCompactCurrency(950)).toBe('$950');
  });
});

describe('formatDuration', () => {
  it('formats minutes, hours, and combinations', () => {
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(200)).toBe('3h 20m');
    expect(formatDuration(0)).toBe('0m');
  });
});

describe('formatRelativeTime', () => {
  const now = Date.UTC(2026, 5, 10, 12, 0);
  it('formats recent and older timestamps', () => {
    expect(formatRelativeTime(now - 30_000, now)).toBe('just now');
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe('5m ago');
    expect(formatRelativeTime(now - 2 * 3_600_000, now)).toBe('2h ago');
    expect(formatRelativeTime(now - 3 * 86_400_000, now)).toBe('3d ago');
  });
});
