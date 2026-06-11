import { describe, expect, it } from 'vitest';
import {
  axisTicks,
  clamp,
  describeArc,
  pointsToPolyline,
  polarToCartesian,
  scaleLinear,
} from './geometry';

describe('clamp', () => {
  it('bounds values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('scaleLinear', () => {
  it('maps domain to range', () => {
    expect(scaleLinear(0, [0, 400], [200, 0])).toBe(200);
    expect(scaleLinear(400, [0, 400], [200, 0])).toBe(0);
    expect(scaleLinear(200, [0, 400], [200, 0])).toBe(100);
  });

  it('handles a degenerate domain safely', () => {
    expect(scaleLinear(5, [3, 3], [0, 100])).toBe(0);
  });
});

describe('polarToCartesian', () => {
  it('places 0° at the top and 90° to the right', () => {
    const top = polarToCartesian(0, 0, 10, 0);
    expect(top.x).toBeCloseTo(0);
    expect(top.y).toBeCloseTo(-10);
    const right = polarToCartesian(0, 0, 10, 90);
    expect(right.x).toBeCloseTo(10);
    expect(right.y).toBeCloseTo(0);
  });
});

describe('describeArc', () => {
  it('produces a valid arc path', () => {
    const d = describeArc(50, 50, 40, 0, 90);
    expect(d.startsWith('M ')).toBe(true);
    expect(d).toContain('A 40 40');
  });

  it('sets the large-arc flag past 180°', () => {
    expect(describeArc(50, 50, 40, 0, 270)).toContain(' 1 0 ');
    expect(describeArc(50, 50, 40, 0, 90)).toContain(' 0 0 ');
  });
});

describe('pointsToPolyline', () => {
  it('joins points', () => {
    expect(
      pointsToPolyline([
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]),
    ).toBe('1,2 3,4');
  });
});

describe('axisTicks', () => {
  it('produces 0–400 at 100 increments', () => {
    expect(axisTicks(0, 400, 100)).toEqual([0, 100, 200, 300, 400]);
  });
});
