import type { ReactNode } from 'react';
import { clamp } from './svg/geometry';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
  /** Progress fraction, in [0, 1]. */
  value: number;
  /** Optional caption shown on the left under the bar. */
  caption?: ReactNode;
  /** Optional target label shown on the right under the bar. */
  targetLabel?: ReactNode;
  /** Accessible name for the progress bar. */
  ariaLabel: string;
}

/**
 * A progress bar toward a target (used by the LTV card). Exposes the proper
 * `progressbar` ARIA semantics with `aria-valuenow/min/max`.
 */
export function ProgressBar({
  value,
  caption,
  targetLabel,
  ariaLabel,
}: ProgressBarProps) {
  const pct = Math.round(clamp(value, 0, 1) * 100);
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      {caption || targetLabel ? (
        <div className={styles.caption}>
          <span>{caption}</span>
          {targetLabel ? (
            <span className={styles.target}>{targetLabel}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
