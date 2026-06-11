import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { rootCssVariables } from '@/src/theme/cssVariables';
import './globals.css';

// Inter with a complete fallback stack (see typography token `fontFamily`).
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'DesignDashboard999 — Weekly Analytics',
  description:
    'Single-page weekly support & product analytics dashboard with seeded demo data.',
};

export const viewport: Viewport = {
  themeColor: '#0b1120',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Inject token-derived CSS custom properties so `:root` always
            matches the TypeScript design tokens (single source of truth). */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: rootCssVariables() }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
