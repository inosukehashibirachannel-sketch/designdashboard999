'use client';

import { useDashboardData } from '@/src/data/DashboardDataContext';
import styles from './page.module.css';

/**
 * Client shell that consumes the shared seeded dataset. For now it renders the
 * page header and a small live summary proving the data pipeline is wired;
 * primitives and widgets are composed here in later steps.
 */
export function DashboardShell() {
  const data = useDashboardData();
  const firstDay = data.week[0];
  const lastDay = data.week[data.week.length - 1];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Weekly Analytics</h1>
          <p className={styles.subtitle}>
            Support &amp; product overview · {firstDay.dateLabel} –{' '}
            {lastDay.dateLabel}
          </p>
        </div>
        <span className={styles.badge}>Demo data · seed {data.seed}</span>
      </header>
      <section className={styles.placeholder} aria-label="Dashboard content">
        {data.receivedTotal.toLocaleString('en-US')} tickets received this week
        · widgets coming soon
      </section>
    </main>
  );
}
