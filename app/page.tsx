import styles from './page.module.css';

/**
 * Single dashboard route. This is the only page in the app (no sidebar, no
 * multi-page navigation). The themed shell below is a scaffold placeholder —
 * seeded data, primitives, and widgets are composed here in later steps.
 */
export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Weekly Analytics</h1>
          <p className={styles.subtitle}>
            Support &amp; product overview · current week
          </p>
        </div>
        <span className={styles.badge}>Demo data</span>
      </header>
      <section className={styles.placeholder} aria-label="Dashboard content">
        Dashboard widgets coming soon
      </section>
    </main>
  );
}
