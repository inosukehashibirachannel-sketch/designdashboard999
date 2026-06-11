/**
 * Types for the shared dashboard dataset. One `DashboardData` object is the
 * single source of truth consumed by every widget.
 */

/** Direction of a week-over-week change. */
export type DeltaDirection = 'up' | 'down' | 'flat';

/**
 * A week-over-week change between a current and previous value.
 * `isImprovement` accounts for metrics where lower is better (e.g. response
 * time, churn), so badges can color consistently regardless of direction.
 */
export interface Delta {
  current: number;
  previous: number;
  /** Signed absolute change (`current - previous`). */
  deltaAbs: number;
  /** Signed percentage change relative to the previous value. */
  deltaPct: number;
  direction: DeltaDirection;
  /** True when the change is good for the business. */
  isImprovement: boolean;
}

/** A single day of the displayed week. */
export interface WeekDay {
  /** Stable key, e.g. `2026-06-08`. */
  key: string;
  /** Short weekday label, e.g. `Mon`. */
  weekdayShort: string;
  /** Short date label, e.g. `Jun 8`. */
  dateLabel: string;
  /** Epoch milliseconds for the start of the day. */
  timestampMs: number;
}

/** One day's received/solved ticket counts (each within 0–400). */
export interface ReceivedSolvedPoint {
  day: WeekDay;
  received: number;
  solved: number;
}

/** CSAT score KPI. */
export interface CsatKpi {
  /** Percentage in [70, 100]. */
  score: number;
  delta: Delta;
}

/** A time-based KPI (response/resolution) measured in minutes. */
export interface TimeKpi {
  label: string;
  minutes: number;
  delta: Delta;
}

/** A ticket tag with its weekly count and share of the total. */
export interface TagCount {
  tag: string;
  count: number;
  /** Fraction of the week's received total, in [0, 1]. */
  share: number;
}

export type FeedbackSentiment = 'positive' | 'negative';

/** A single customer feedback item. */
export interface FeedbackItem {
  id: string;
  sentiment: FeedbackSentiment;
  author: string;
  comment: string;
  timestampMs: number;
}

/** A product stat card value with a week-over-week delta. */
export interface ProductStat {
  label: string;
  value: number;
  delta: Delta;
}

/** Churn rate KPI. */
export interface ChurnKpi {
  /** Percentage in [0, 50]. */
  rate: number;
  delta: Delta;
}

/** Lifetime-value progress toward a target. */
export interface LtvKpi {
  value: number;
  target: number;
  /** `value / target` clamped to [0, 1]. */
  progress: number;
}

/** The complete, internally consistent dashboard dataset. */
export interface DashboardData {
  /** The resolved seed used to generate this dataset. */
  seed: number;
  /** Reference instant the dataset is anchored to (epoch ms). */
  referenceMs: number;
  /** Mon–Sun for the displayed week. */
  week: WeekDay[];
  csat: CsatKpi;
  firstResponseTime: TimeKpi;
  avgResolutionTime: TimeKpi;
  ticketsByTag: TagCount[];
  /** Total received tickets for the week (sum of `ticketsByTag` counts). */
  receivedTotal: number;
  feedback: FeedbackItem[];
  receivedSolved: ReceivedSolvedPoint[];
  productStats: ProductStat[];
  churn: ChurnKpi;
  ltv: LtvKpi;
}
