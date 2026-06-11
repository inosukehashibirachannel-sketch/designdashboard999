import type { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Wires the card to its heading for screen readers (see SectionHeader id). */
  ariaLabelledBy?: string;
  /** Accessible label when there is no visible heading to reference. */
  ariaLabel?: string;
}

/**
 * The navy surface container used by every widget. Provides consistent
 * background, border, radius, elevation, and padding from the design tokens.
 */
export function Card({
  children,
  className,
  ariaLabelledBy,
  ariaLabel,
}: CardProps) {
  return (
    <section
      className={className ? `${styles.card} ${className}` : styles.card}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}
