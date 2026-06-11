import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  /** Visible heading text. */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: ReactNode;
  /** Optional right-aligned content (e.g. a legend or control). */
  actions?: ReactNode;
  /**
   * Id applied to the heading element so a Card can reference it via
   * `aria-labelledby` for an accessible region name.
   */
  id?: string;
  /** Heading level for correct document outline (defaults to h2). */
  as?: 'h2' | 'h3';
}

/** Consistent card/section header: title, optional subtitle and actions. */
export function SectionHeader({
  title,
  subtitle,
  actions,
  id,
  as: Heading = 'h2',
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleGroup}>
        <Heading id={id} className={styles.title}>
          {title}
        </Heading>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
