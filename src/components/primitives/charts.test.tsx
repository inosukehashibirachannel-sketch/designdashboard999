import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DualLineChart } from './DualLineChart';
import { RadialGauge } from './RadialGauge';

describe('RadialGauge', () => {
  it('renders the value label and an accessible name', () => {
    render(
      <RadialGauge
        value={91}
        arcColor="#22c55e"
        label="91%"
        caption="CSAT"
        ariaLabel="CSAT score 91 percent"
      />,
    );
    const gauge = screen.getByRole('img', { name: 'CSAT score 91 percent' });
    expect(gauge).toBeInTheDocument();
    expect(screen.getByText('91%')).toBeInTheDocument();
    expect(screen.getByText('CSAT')).toBeInTheDocument();
  });

  it('supports the semicircle variant for churn', () => {
    const { container } = render(
      <RadialGauge
        value={8}
        max={50}
        variant="semicircle"
        arcColor="#ef4444"
        label="8%"
        ariaLabel="Churn rate 8 percent"
      />,
    );
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 120 76',
    );
  });
});

describe('DualLineChart', () => {
  const categories = [
    { label: 'Mon', sublabel: 'Jun 8' },
    { label: 'Tue', sublabel: 'Jun 9' },
    { label: 'Wed', sublabel: 'Jun 10' },
    { label: 'Thu', sublabel: 'Jun 11' },
    { label: 'Fri', sublabel: 'Jun 12' },
    { label: 'Sat', sublabel: 'Jun 13' },
    { label: 'Sun', sublabel: 'Jun 14' },
  ];
  const series = [
    {
      name: 'Received',
      color: '#3b82f6',
      values: [200, 280, 360, 320, 250, 120, 90],
    },
    {
      name: 'Solved',
      color: '#f59e0b',
      values: [180, 260, 320, 300, 230, 110, 80],
    },
  ];

  it('renders Y ticks at 0–400 in 100s, day+date labels, and the legend', () => {
    render(
      <DualLineChart
        categories={categories}
        series={series}
        ariaLabel="Weekly received vs solved"
      />,
    );
    ['0', '100', '200', '300', '400'].forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument(),
    );
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Jun 10')).toBeInTheDocument();
    expect(screen.getByText('Received')).toBeInTheDocument();
    expect(screen.getByText('Solved')).toBeInTheDocument();
  });

  it('draws one polyline per series', () => {
    const { container } = render(
      <DualLineChart
        categories={categories}
        series={series}
        ariaLabel="chart"
      />,
    );
    expect(container.querySelectorAll('polyline')).toHaveLength(2);
  });
});
