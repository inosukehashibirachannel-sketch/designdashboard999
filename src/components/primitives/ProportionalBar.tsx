import { clamp } from './svg/geometry';
import styles from './ProportionalBar.module.css';

export interface ProportionalBarProps {
  /** Fraction of the maximum, in [0, 1]. */
  value: number;
  /** Accessible description, e.g. `Billing: 320 tickets (18%)`. */
  ariaLabel: string;
}

/**
 * A cyan/blue horizontal bar sized as a proportion of its track. The width is a
 * dynamic data value (the only legitimate inline style) — all colors/sizing
 * tokens come from CSS variables.
 */
export function ProportionalBar({ value, ariaLabel }: ProportionalBarProps) {
  const pct = clamp(value, 0, 1) * 100;
  return (
    <div className={styles.track} role="img" aria-label={ariaLabel}>
      <span className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  );
}
