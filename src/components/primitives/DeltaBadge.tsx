import { formatSignedPercent } from '@/src/data/format';
import type { Delta } from '@/src/data/types';
import styles from './DeltaBadge.module.css';

/** Magnitude (in %) below which a worsening change is shown as amber, not red. */
const CAUTION_THRESHOLD_PCT = 5;

export interface DeltaBadgeProps {
  delta: Delta;
  /**
   * Display the absolute change with this unit (e.g. `'m'`, `' users'`)
   * instead of a percentage. Defaults to a signed percentage.
   */
  absoluteUnit?: string;
}

/**
 * Week-over-week change badge. Color reflects whether the change is GOOD for the
 * business (`isImprovement`) — green for improvement, red/amber for worsening —
 * so metrics where lower is better (response time, churn) color correctly. The
 * ▲/▼ arrow reflects the raw direction of movement.
 */
export function DeltaBadge({ delta, absoluteUnit }: DeltaBadgeProps) {
  const { direction, isImprovement, deltaPct, deltaAbs } = delta;

  let variant: string = styles.flat;
  let state = 'no change';
  if (direction !== 'flat') {
    if (isImprovement) {
      variant = styles.improvement;
      state = 'improved';
    } else if (Math.abs(deltaPct) < CAUTION_THRESHOLD_PCT) {
      variant = styles.caution;
      state = 'worsened';
    } else {
      variant = styles.worsening;
      state = 'worsened';
    }
  }

  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '–';
  const magnitude = absoluteUnit
    ? `${deltaAbs > 0 ? '+' : ''}${Math.round(deltaAbs)}${absoluteUnit}`
    : formatSignedPercent(deltaPct);

  const label =
    direction === 'flat'
      ? 'No change vs last week'
      : `${state} ${magnitude.replace(/^[+-]/, '')} vs last week`;

  return (
    <span className={`${styles.badge} ${variant}`} aria-label={label}>
      <span className={styles.arrow} aria-hidden="true">
        {arrow}
      </span>
      <span aria-hidden="true">{magnitude}</span>
    </span>
  );
}
