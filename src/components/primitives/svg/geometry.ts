/**
 * Pure SVG geometry helpers shared by the gauge and line-chart primitives.
 * Kept free of React so they are trivially unit-testable.
 */

/** Clamp a value into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Map a value from a numeric `domain` onto a pixel `range` (linear scale).
 * Mirrors d3's `scaleLinear` for the small subset we need.
 */
export function scaleLinear(
  value: number,
  domain: readonly [number, number],
  range: readonly [number, number],
): number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return r0;
  const t = (value - d0) / (d1 - d0);
  return r0 + t * (r1 - r0);
}

/** A point in the SVG coordinate space. */
export interface Point {
  x: number;
  y: number;
}

/**
 * Convert a polar coordinate to cartesian.
 * Angles are in degrees, measured clockwise from 12 o'clock (top), which is the
 * intuitive orientation for gauges.
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): Point {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/**
 * Build an SVG arc path (stroke, not filled wedge) from `startAngle` to
 * `endAngle` (degrees, clockwise from top) on a circle of the given radius.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';
  // Sweep flag 0 draws counter-clockwise from `start` to `end`, which traces the
  // increasing-angle direction given our endpoint ordering.
  return [
    'M',
    round(start.x),
    round(start.y),
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    round(end.x),
    round(end.y),
  ].join(' ');
}

/** Build a polyline `points` attribute from a list of points. */
export function pointsToPolyline(points: readonly Point[]): string {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(' ');
}

/**
 * Evenly spaced tick values across `[min, max]` inclusive at `step` increments.
 * e.g. `axisTicks(0, 400, 100)` → `[0, 100, 200, 300, 400]`.
 */
export function axisTicks(min: number, max: number, step: number): number[] {
  const ticks: number[] = [];
  for (let v = min; v <= max + 1e-9; v += step) {
    ticks.push(Math.round(v));
  }
  return ticks;
}

/** Round to 2 decimals to keep SVG path strings compact and stable. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
