'use client';

/**
 * Provides the single shared dashboard dataset to every widget.
 *
 * Hydration safety: the dataset is generated from a PURE function of
 * `(seed, REFERENCE_MS)`. The provider initializes with the DEFAULT seed, so the
 * server-prerendered HTML and the first client render are byte-identical — no
 * hydration mismatch. The optional `?seed=` override is read from the URL in a
 * client-only `useEffect` AFTER hydration and only re-generates when it differs,
 * so it never affects the prerendered markup.
 *
 * The reference instant is FIXED (not the live clock) so demos and screenshots
 * are fully repeatable and date math can never drift between prerender/runtime.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { generateDashboardData } from './generateDashboardData';
import { hashSeed } from './rng';
import type { DashboardData } from './types';

/** Default seed used for prerender and when no `?seed=` is supplied. */
export const DEFAULT_SEED = 1337;

/**
 * Fixed reference instant the dashboard is anchored to (a Wednesday, for a
 * natural mid-week peak). Using a constant keeps the dataset deterministic.
 */
export const REFERENCE_MS = Date.UTC(2026, 5, 10, 9, 30); // 2026-06-10T09:30Z

const DashboardDataContext = createContext<DashboardData | null>(null);

/** Read and resolve the `?seed=` query param to a usable seed value. */
function resolveSeedFromUrl(): number | string {
  if (typeof window === 'undefined') return DEFAULT_SEED;
  const raw = new URLSearchParams(window.location.search).get('seed');
  if (raw === null || raw.trim() === '') return DEFAULT_SEED;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : raw;
}

export function DashboardDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start from the default seed so SSR/prerender === first client render.
  const [seed, setSeed] = useState<number | string>(DEFAULT_SEED);

  // After hydration, apply any `?seed=` override (client-only).
  useEffect(() => {
    const resolved = resolveSeedFromUrl();
    setSeed((current) =>
      hashSeed(resolved) === hashSeed(current) ? current : resolved,
    );
  }, []);

  // Generate once per resolved seed; shared by all consumers.
  const data = useMemo(() => generateDashboardData(seed, REFERENCE_MS), [seed]);

  return (
    <DashboardDataContext.Provider value={data}>
      {children}
    </DashboardDataContext.Provider>
  );
}

/** Access the shared dashboard dataset. Must be used within the provider. */
export function useDashboardData(): DashboardData {
  const data = useContext(DashboardDataContext);
  if (data === null) {
    throw new Error(
      'useDashboardData must be used within a <DashboardDataProvider>.',
    );
  }
  return data;
}
