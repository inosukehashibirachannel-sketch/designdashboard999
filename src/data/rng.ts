/**
 * Tiny, dependency-free seeded pseudo-random number generator.
 *
 * Determinism is essential: the same seed must always produce the same dashboard
 * so demos and screenshots are repeatable and so server-prerender and client
 * hydration agree. We avoid `Math.random()` entirely.
 */

/**
 * Hash an arbitrary string/number seed into a 32-bit unsigned integer.
 * Based on the well-known `cyrb53`/`xmur3` mixing approach. Lets `?seed=anything`
 * (numeric or textual) map deterministically onto the PRNG's numeric seed space.
 */
export function hashSeed(input: string | number): number {
  const str = String(input);
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/** A function returning the next pseudo-random float in `[0, 1)`. */
export type Rng = () => number;

/**
 * mulberry32 — a compact, fast, well-distributed 32-bit PRNG.
 * @param seed any string or number; hashed to a 32-bit state.
 */
export function createRng(seed: string | number): Rng {
  let state = hashSeed(seed);
  return function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random integer in the inclusive range `[min, max]`. */
export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Random float in `[min, max)` rounded to `decimals` places. */
export function randFloat(
  rng: Rng,
  min: number,
  max: number,
  decimals = 2,
): number {
  const value = rng() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Pick a single element from a non-empty array. */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Apply a symmetric ±`pct` (0–1) random jitter to a base value.
 * e.g. `jitter(rng, 100, 0.1)` → a value in roughly [90, 110].
 */
export function jitter(rng: Rng, base: number, pct: number): number {
  const delta = base * pct;
  return base + (rng() * 2 - 1) * delta;
}
