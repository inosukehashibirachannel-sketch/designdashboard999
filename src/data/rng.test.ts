import { describe, expect, it } from 'vitest';
import { createRng, hashSeed, jitter, pick, randFloat, randInt } from './rng';

describe('rng', () => {
  it('is deterministic for the same seed', () => {
    const a = createRng(1337);
    const b = createRng(1337);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createRng(1337);
    const b = createRng(2024);
    expect(a()).not.toEqual(b());
  });

  it('returns values within [0, 1)', () => {
    const rng = createRng('hello');
    for (let i = 0; i < 1000; i += 1) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('hashSeed is stable and unsigned 32-bit', () => {
    expect(hashSeed('seed')).toBe(hashSeed('seed'));
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
    expect(hashSeed(1337)).toBeGreaterThanOrEqual(0);
    expect(hashSeed(1337)).toBeLessThanOrEqual(0xffffffff);
  });

  it('randInt respects inclusive bounds', () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i += 1) {
      const v = randInt(rng, 3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it('randFloat respects bounds and decimals', () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i += 1) {
      const v = randFloat(rng, 1, 2, 1);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(2);
    }
  });

  it('pick returns an element of the array', () => {
    const rng = createRng(9);
    const items = ['a', 'b', 'c'] as const;
    for (let i = 0; i < 100; i += 1) {
      expect(items).toContain(pick(rng, items));
    }
  });

  it('jitter stays within the expected band', () => {
    const rng = createRng(5);
    for (let i = 0; i < 500; i += 1) {
      const v = jitter(rng, 100, 0.1);
      expect(v).toBeGreaterThanOrEqual(90);
      expect(v).toBeLessThanOrEqual(110);
    }
  });
});
