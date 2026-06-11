import { describe, expect, it } from 'vitest';
import { generateDashboardData } from './generateDashboardData';

const REF = Date.UTC(2026, 5, 10, 9, 30); // Wed 2026-06-10

describe('generateDashboardData', () => {
  const data = generateDashboardData(1337, REF);

  it('is deterministic: same seed → deeply equal output', () => {
    const again = generateDashboardData(1337, REF);
    expect(again).toEqual(data);
  });

  it('differs for different seeds', () => {
    const other = generateDashboardData(2024, REF);
    expect(other.receivedTotal).not.toBe(data.receivedTotal);
  });

  it('builds a Mon–Sun week with date labels', () => {
    expect(data.week).toHaveLength(7);
    expect(data.week.map((d) => d.weekdayShort)).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
    expect(data.week[0].key).toBe('2026-06-08'); // Monday of that week
    expect(data.week[0].dateLabel).toBe('Jun 8');
  });

  it('CSAT is within [70, 100]', () => {
    expect(data.csat.score).toBeGreaterThanOrEqual(70);
    expect(data.csat.score).toBeLessThanOrEqual(100);
  });

  it('churn is within [0, 50]', () => {
    expect(data.churn.rate).toBeGreaterThanOrEqual(0);
    expect(data.churn.rate).toBeLessThanOrEqual(50);
  });

  it('time KPIs use lower-is-better delta semantics', () => {
    expect(data.firstResponseTime.minutes).toBeGreaterThan(0);
    const d = data.avgResolutionTime.delta;
    if (d.direction === 'down') expect(d.isImprovement).toBe(true);
    if (d.direction === 'up') expect(d.isImprovement).toBe(false);
  });

  it('tickets by tag: 6–7 rows, sorted desc, summing to received total', () => {
    const { ticketsByTag, receivedTotal } = data;
    expect(ticketsByTag.length).toBeGreaterThanOrEqual(6);
    expect(ticketsByTag.length).toBeLessThanOrEqual(7);
    const counts = ticketsByTag.map((t) => t.count);
    expect([...counts].sort((a, b) => b - a)).toEqual(counts); // already desc
    expect(counts.reduce((a, b) => a + b, 0)).toBe(receivedTotal);
    ticketsByTag.forEach((t) =>
      expect(t.share).toBeCloseTo(t.count / receivedTotal),
    );
  });

  it('received/solved series stays within 0–400 with mid-week peak + weekend drop', () => {
    const series = data.receivedSolved;
    expect(series).toHaveLength(7);
    series.forEach((p) => {
      expect(p.received).toBeGreaterThanOrEqual(0);
      expect(p.received).toBeLessThanOrEqual(400);
      expect(p.solved).toBeGreaterThanOrEqual(0);
      expect(p.solved).toBeLessThanOrEqual(400);
    });
    const wed = series[2].received; // mid-week peak
    const sat = series[5].received;
    const sun = series[6].received;
    expect(wed).toBeGreaterThan(sat);
    expect(wed).toBeGreaterThan(sun);
  });

  it('has feedback with at least one positive item and ordered timestamps', () => {
    expect(data.feedback.length).toBeGreaterThan(0);
    expect(data.feedback.some((f) => f.sentiment === 'positive')).toBe(true);
    for (let i = 1; i < data.feedback.length; i += 1) {
      expect(data.feedback[i].timestampMs).toBeLessThan(
        data.feedback[i - 1].timestampMs,
      );
    }
  });

  it('product stats expose large numbers with deltas', () => {
    expect(data.productStats.map((s) => s.label)).toEqual([
      'New users added',
      'Reports created',
    ]);
    data.productStats.forEach((s) => expect(s.value).toBeGreaterThan(0));
  });

  it('LTV has a value, target, and progress in [0, 1]', () => {
    expect(data.ltv.target).toBe(250_000);
    expect(data.ltv.value).toBeGreaterThan(0);
    expect(data.ltv.progress).toBeGreaterThanOrEqual(0);
    expect(data.ltv.progress).toBeLessThanOrEqual(1);
  });

  it('supports string seeds (e.g. ?seed=spring) deterministically', () => {
    const a = generateDashboardData('spring', REF);
    const b = generateDashboardData('spring', REF);
    expect(a).toEqual(b);
    expect(typeof a.seed).toBe('number');
  });
});
