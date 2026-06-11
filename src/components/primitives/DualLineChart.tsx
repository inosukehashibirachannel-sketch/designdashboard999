import { Fragment } from 'react';
import {
  axisTicks,
  pointsToPolyline,
  scaleLinear,
  type Point,
} from './svg/geometry';
import styles from './DualLineChart.module.css';

/** An x-axis category, e.g. a weekday with its date. */
export interface ChartCategory {
  label: string;
  sublabel?: string;
}

/** A named data series rendered as a line. */
export interface ChartSeries {
  name: string;
  color: string;
  values: number[];
}

export interface DualLineChartProps {
  categories: ChartCategory[];
  series: ChartSeries[];
  yMin?: number;
  yMax?: number;
  yStep?: number;
  /** Accessible description of the chart. */
  ariaLabel: string;
}

const VIEW_W = 520;
const VIEW_H = 250;
const MARGIN = { top: 30, right: 16, bottom: 34, left: 36 };
const PLOT_LEFT = MARGIN.left;
const PLOT_RIGHT = VIEW_W - MARGIN.right;
const PLOT_TOP = MARGIN.top;
const PLOT_BOTTOM = VIEW_H - MARGIN.bottom;

/**
 * Accessible custom-SVG dual-line chart with a labeled Y axis (default 0–400 at
 * 100 increments), categorical X axis (weekday + date), and an inline legend.
 * Responsive via `viewBox`; no charting library.
 */
export function DualLineChart({
  categories,
  series,
  yMin = 0,
  yMax = 400,
  yStep = 100,
  ariaLabel,
}: DualLineChartProps) {
  const n = categories.length;
  const ticks = axisTicks(yMin, yMax, yStep);

  const xFor = (i: number): number =>
    n <= 1
      ? (PLOT_LEFT + PLOT_RIGHT) / 2
      : scaleLinear(i, [0, n - 1], [PLOT_LEFT, PLOT_RIGHT]);
  const yFor = (v: number): number =>
    scaleLinear(v, [yMin, yMax], [PLOT_BOTTOM, PLOT_TOP]);

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>

      {/* Inline legend */}
      {series.map((s, i) => {
        const lx = PLOT_LEFT + i * 132;
        return (
          <g key={s.name}>
            <line
              x1={lx}
              y1={14}
              x2={lx + 18}
              y2={14}
              stroke={s.color}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <text className={styles.legendLabel} x={lx + 24} y={18}>
              {s.name}
            </text>
          </g>
        );
      })}

      {/* Y gridlines + tick labels */}
      {ticks.map((t) => {
        const y = yFor(t);
        return (
          <Fragment key={t}>
            <line
              className={styles.gridline}
              x1={PLOT_LEFT}
              y1={y}
              x2={PLOT_RIGHT}
              y2={y}
            />
            <text
              className={styles.axisLabel}
              x={PLOT_LEFT - 8}
              y={y + 3}
              textAnchor="end"
            >
              {t}
            </text>
          </Fragment>
        );
      })}

      {/* X-axis category labels (weekday + date) */}
      {categories.map((c, i) => {
        const x = xFor(i);
        return (
          <Fragment key={c.label + i}>
            <text
              className={styles.xLabelDay}
              x={x}
              y={PLOT_BOTTOM + 16}
              textAnchor="middle"
            >
              {c.label}
            </text>
            {c.sublabel ? (
              <text
                className={styles.xLabelDate}
                x={x}
                y={PLOT_BOTTOM + 28}
                textAnchor="middle"
              >
                {c.sublabel}
              </text>
            ) : null}
          </Fragment>
        );
      })}

      {/* Series lines + point markers */}
      {series.map((s) => {
        const pts: Point[] = s.values.map((v, i) => ({
          x: xFor(i),
          y: yFor(v),
        }));
        return (
          <g key={s.name}>
            <polyline
              points={pointsToPolyline(pts)}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={2.6} fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
