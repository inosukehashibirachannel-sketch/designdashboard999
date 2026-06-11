/**
 * The single source of truth for all dashboard widgets.
 *
 * `generateDashboardData` is a PURE function of `(seed, referenceMs)` — it uses
 * no `Date.now()` and no `Math.random()`, so the same inputs always yield a
 * deeply-equal dataset. This guarantees repeatable demos and identical
 * server-prerender / client-hydration output (no hydration mismatch).
 *
 * All date math uses UTC getters so the output does not depend on the host
 * timezone (another potential prerender-vs-client divergence).
 */
import {
  createRng,
  hashSeed,
  jitter,
  pick,
  randFloat,
  randInt,
  type Rng,
} from './rng';
import { computeDelta } from './format';
import type {
  ChurnKpi,
  CsatKpi,
  DashboardData,
  FeedbackItem,
  LtvKpi,
  ProductStat,
  ReceivedSolvedPoint,
  TagCount,
  TimeKpi,
  WeekDay,
} from './types';

const DAY_MS = 86_400_000;

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Fixed operational tag order (a stable, consistent set to draw from). */
const TAG_POOL = [
  'Billing',
  'Bug',
  'Feature Request',
  'Account',
  'Performance',
  'Integration',
  'Other',
] as const;

/**
 * Weekday weight curve (Mon→Sun) producing a plausible weekly cadence:
 * a mid-week peak (Wed) and a clear weekend drop (Sat/Sun).
 */
const WEEKDAY_WEIGHTS = [0.78, 0.92, 1.0, 0.96, 0.82, 0.45, 0.34];

const FEEDBACK_AUTHORS = [
  'Ava M.',
  'Liam K.',
  'Noah R.',
  'Mia T.',
  'Ethan P.',
  'Sofia L.',
  'Lucas H.',
  'Emma W.',
  'Oliver B.',
  'Isla D.',
];

const POSITIVE_COMMENTS = [
  'Support sorted my issue in minutes — incredible turnaround!',
  'The new dashboard is exactly what our team needed. Love it.',
  'Fast, friendly, and they actually fixed the root cause. 10/10.',
  'Onboarding was seamless and the docs are top notch.',
  'Reports are so much clearer now. Huge time saver.',
  'Best support experience I have had with any SaaS product.',
  'The integration just worked out of the box. Delighted.',
  'Response time has improved massively this week. Thank you!',
];

const NEGATIVE_COMMENTS = [
  'Took a couple of tries to get my billing question resolved.',
  'The export feature was a little slow for large reports.',
  'Hit a confusing error during setup, but support helped.',
  'Wish the mobile view were a bit more polished.',
];

/** Build the Mon–Sun week containing `referenceMs` (UTC). */
function buildWeek(referenceMs: number): WeekDay[] {
  const ref = new Date(referenceMs);
  const utcDay = ref.getUTCDay(); // 0=Sun … 6=Sat
  // Distance back to Monday (treat Sunday as the 7th day, not the start).
  const offsetToMonday = (utcDay + 6) % 7;
  const mondayMs =
    Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()) -
    offsetToMonday * DAY_MS;

  return Array.from({ length: 7 }, (_, i) => {
    const dayMs = mondayMs + i * DAY_MS;
    const d = new Date(dayMs);
    return {
      key: d.toISOString().slice(0, 10),
      weekdayShort: WEEKDAY_LABELS[d.getUTCDay()],
      dateLabel: `${MONTH_LABELS[d.getUTCMonth()]} ${d.getUTCDate()}`,
      timestampMs: dayMs,
    };
  });
}

/** Received vs solved series with a mid-week peak and weekend drop (0–400). */
function buildReceivedSolved(
  rng: Rng,
  week: WeekDay[],
): { points: ReceivedSolvedPoint[]; receivedTotal: number } {
  const peak = randInt(rng, 300, 360); // Wednesday-ish ceiling, under 400
  const solveRatio = randFloat(rng, 0.82, 0.94, 2);
  let receivedTotal = 0;

  const points = week.map((day, i) => {
    const received = clamp(
      Math.round(jitter(rng, peak * WEEKDAY_WEIGHTS[i], 0.06)),
      0,
      400,
    );
    const solved = clamp(
      Math.round(received * jitter(rng, solveRatio, 0.05)),
      0,
      400,
    );
    receivedTotal += received;
    return { day, received, solved };
  });

  return { points, receivedTotal };
}

/**
 * Tickets by tag whose counts sum EXACTLY to `total` (internal consistency
 * with the received series), sorted by volume descending.
 */
function buildTicketsByTag(
  rng: Rng,
  total: number,
  tagCount: number,
): TagCount[] {
  const tags = TAG_POOL.slice(0, tagCount);
  const weights = tags.map(() => randFloat(rng, 0.3, 1, 3));
  const weightSum = weights.reduce((a, b) => a + b, 0);

  // Largest-remainder apportionment so the integer counts sum to `total`.
  const raw = weights.map((w) => (w / weightSum) * total);
  const floors = raw.map((r) => Math.floor(r));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  const counts = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k += 1) {
    counts[order[k].i] += 1;
    remainder -= 1;
  }

  return tags
    .map((tag, i) => ({
      tag,
      count: counts[i],
      share: total === 0 ? 0 : counts[i] / total,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Build the customer feedback list (mostly positive), newest first. */
function buildFeedback(rng: Rng, referenceMs: number): FeedbackItem[] {
  const count = randInt(rng, 9, 12);
  const items: FeedbackItem[] = [];
  let cursor = referenceMs - randInt(rng, 20, 90) * 60_000; // start ~minutes ago

  for (let i = 0; i < count; i += 1) {
    // ~70% positive so the positive-only default carousel is well populated.
    const sentiment = rng() < 0.7 ? 'positive' : 'negative';
    const comment =
      sentiment === 'positive'
        ? pick(rng, POSITIVE_COMMENTS)
        : pick(rng, NEGATIVE_COMMENTS);
    items.push({
      id: `fb-${i + 1}`,
      sentiment,
      author: pick(rng, FEEDBACK_AUTHORS),
      comment,
      timestampMs: Math.round(cursor),
    });
    // Step further into the past for the next (older) item.
    cursor -= randInt(rng, 35, 360) * 60_000;
  }

  return items;
}

function buildCsat(rng: Rng): CsatKpi {
  const score = randFloat(rng, 70, 100, 1);
  const previous = clamp(score - randFloat(rng, -3, 4, 1), 70, 100);
  return { score, delta: computeDelta(score, previous) };
}

function buildTimeKpi(
  rng: Rng,
  label: string,
  min: number,
  max: number,
): TimeKpi {
  const minutes = randInt(rng, min, max);
  const previous = Math.max(1, Math.round(jitter(rng, minutes, 0.18)));
  return {
    label,
    minutes,
    delta: computeDelta(minutes, previous, { lowerIsBetter: true }),
  };
}

function buildProductStat(
  rng: Rng,
  label: string,
  min: number,
  max: number,
): ProductStat {
  const value = randInt(rng, min, max);
  // Previous week lower on average → positive (green ▲) deltas.
  const previous = Math.max(1, Math.round(value / jitter(rng, 1.12, 0.06)));
  return { label, value, delta: computeDelta(value, previous) };
}

function buildChurn(rng: Rng): ChurnKpi {
  const rate = randFloat(rng, 3, 18, 1); // within the 0–50 gauge scale
  const previous = clamp(rate + randFloat(rng, -2, 3, 1), 0, 50);
  return { rate, delta: computeDelta(rate, previous, { lowerIsBetter: true }) };
}

function buildLtv(rng: Rng): LtvKpi {
  const target = 250_000;
  const value = randInt(rng, 120_000, 240_000);
  return { value, target, progress: clamp(value / target, 0, 1) };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Generate the complete, internally consistent dashboard dataset.
 * @param seed resolved numeric/string seed (default applied by callers).
 * @param referenceMs fixed reference instant the week + timestamps anchor to.
 */
export function generateDashboardData(
  seed: number | string,
  referenceMs: number,
): DashboardData {
  const rng = createRng(seed);

  const week = buildWeek(referenceMs);
  const { points: receivedSolved, receivedTotal } = buildReceivedSolved(
    rng,
    week,
  );
  const ticketsByTag = buildTicketsByTag(
    rng,
    receivedTotal,
    randInt(rng, 6, 7),
  );

  return {
    seed: typeof seed === 'number' ? seed : hashSeed(seed),
    referenceMs,
    week,
    csat: buildCsat(rng),
    firstResponseTime: buildTimeKpi(rng, 'First Response Time', 18, 75),
    avgResolutionTime: buildTimeKpi(rng, 'Avg Resolution Time', 180, 540),
    ticketsByTag,
    receivedTotal,
    feedback: buildFeedback(rng, referenceMs),
    receivedSolved,
    productStats: [
      buildProductStat(rng, 'New users added', 900, 2400),
      buildProductStat(rng, 'Reports created', 3200, 8600),
    ],
    churn: buildChurn(rng),
    ltv: buildLtv(rng),
  };
}
