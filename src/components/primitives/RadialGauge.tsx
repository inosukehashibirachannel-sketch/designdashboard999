import { clamp, describeArc } from './svg/geometry';
import styles from './RadialGauge.module.css';

export interface RadialGaugeProps {
  /** Current value. */
  value: number;
  min?: number;
  max?: number;
  /** `radial` = ~270° dial; `semicircle` = compact half dial. */
  variant?: 'radial' | 'semicircle';
  /** Arc color (e.g. healthy green for CSAT, high-risk red for churn). */
  arcColor: string;
  /** Large centered label, e.g. `91%`. */
  label: string;
  /** Small caption under the value, e.g. `CSAT`. */
  caption?: string;
  /** Accessible description, e.g. `CSAT score 91 percent`. */
  ariaLabel: string;
}

const CX = 60;
const CY = 60;
const R = 48;
const STROKE = 12;

const GEOMETRY = {
  radial: { start: -135, sweep: 270, viewBox: '0 0 120 120', labelY: 58 },
  semicircle: { start: -90, sweep: 180, viewBox: '0 0 120 76', labelY: 54 },
} as const;

/**
 * Accessible custom-SVG radial / semicircle gauge. Draws a track plus a value
 * arc proportional to `value` within `[min, max]`. Colors and the value label
 * are supplied by the caller so it serves both the CSAT and churn widgets.
 */
export function RadialGauge({
  value,
  min = 0,
  max = 100,
  variant = 'radial',
  arcColor,
  label,
  caption,
  ariaLabel,
}: RadialGaugeProps) {
  const g = GEOMETRY[variant];
  const fraction = clamp((value - min) / (max - min || 1), 0, 1);
  const valueEnd = g.start + fraction * g.sweep;

  const trackPath = describeArc(CX, CY, R, g.start, g.start + g.sweep);
  const valuePath = describeArc(CX, CY, R, g.start, valueEnd);

  return (
    <svg
      className={styles.gauge}
      viewBox={g.viewBox}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      <path
        className={styles.track}
        d={trackPath}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <path
        d={valuePath}
        fill="none"
        stroke={arcColor}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <text
        className={styles.value}
        x={CX}
        y={g.labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={variant === 'radial' ? 26 : 22}
      >
        {label}
      </text>
      {caption ? (
        <text
          className={styles.caption}
          x={CX}
          y={g.labelY + (variant === 'radial' ? 20 : 16)}
          textAnchor="middle"
          fontSize={11}
        >
          {caption}
        </text>
      ) : null}
    </svg>
  );
}
