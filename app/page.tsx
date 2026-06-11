import { DashboardDataProvider } from '@/src/data/DashboardDataContext';
import { DashboardShell } from './DashboardShell';

/**
 * Single dashboard route (no sidebar, no multi-page navigation). The provider
 * generates the seeded dataset once per load and shares it with every widget.
 */
export default function DashboardPage() {
  return (
    <DashboardDataProvider>
      <DashboardShell />
    </DashboardDataProvider>
  );
}
