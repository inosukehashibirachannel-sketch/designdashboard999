/**
 * Pure formatting helpers for displaying dataset values. Kept free of React so
 * they are trivially unit-testable and reusable across widgets.
 */
import type { Delta, DeltaDirection } from './types';

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/**
 * Compute a week-over-week delta between two values.
 * @param lowerIsBetter set for metrics where a decrease is good (time, churn).
 */
export function computeDelta(
  current: number,
  previous: number,
  { lowerIsBetter = false }: { lowerIsBetter?: boolean } = {},
): Delta {
  const deltaAbs = current - previous;
  const deltaPct = previous === 0 ? 0 : (deltaAbs / previous) * 100;
  let direction: DeltaDirection = 'flat';
  if (deltaAbs > 0) direction = 'up';
  else if (deltaAbs < 0) direction = 'down';

  let isImprovement = false;
  if (direction !== 'flat') {
    const wentUp = direction === 'up';
    isImprovement = lowerIsBetter ? !wentUp : wentUp;
  }

  return { current, previous, deltaAbs, deltaPct, direction, isImprovement };
}

/** Format a whole number with thousands separators, e.g. `12,480`. */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** Format a percentage to a fixed number of decimals, e.g. `91.4%`. */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a signed percentage for delta badges, e.g. `+4.2%` / `-1.0%`.
 * The arrow/color is handled by the badge component, not here.
 */
export function formatSignedPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a duration given in minutes into a compact human string:
 * `45m`, `3h 20m`, `2h`.
 */
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format a currency value compactly: `$182k`, `$1.2M`, `$950`.
 */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (abs >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return `$${Math.round(value)}`;
}

/**
 * Format a timestamp relative to a reference instant, e.g. `just now`,
 * `2h ago`, `3d ago`. Deterministic because the reference is passed in.
 */
export function formatRelativeTime(timestampMs: number, nowMs: number): string {
  const diff = Math.max(0, nowMs - timestampMs);
  if (diff < MINUTE_MS) return 'just now';
  if (diff < HOUR_MS) {
    const m = Math.floor(diff / MINUTE_MS);
    return `${m}m ago`;
  }
  if (diff < DAY_MS) {
    const h = Math.floor(diff / HOUR_MS);
    return `${h}h ago`;
  }
  const d = Math.floor(diff / DAY_MS);
  return `${d}d ago`;
}
