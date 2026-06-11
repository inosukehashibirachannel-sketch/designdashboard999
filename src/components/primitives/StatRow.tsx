import type { ReactNode } from 'react';
import styles from './StatRow.module.css';

export interface StatRowProps {
  label: ReactNode;
  value: ReactNode;
  /** Optional unit shown after the value, e.g. `min`. */
  unit?: string;
  /** Optional trailing content, typically a <DeltaBadge>. */
  trailing?: ReactNode;
}

/** A labeled metric row: label on the left, value (+ unit + badge) on the right. */
export function StatRow({ label, value, unit, trailing }: StatRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.valueGroup}>
        <span className={styles.value}>{value}</span>
        {unit ? <span className={styles.unit}>{unit}</span> : null}
        {trailing}
      </span>
    </div>
  );
}
