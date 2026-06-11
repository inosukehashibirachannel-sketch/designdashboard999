import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { computeDelta } from '@/src/data/format';
import { DeltaBadge } from './DeltaBadge';

describe('DeltaBadge', () => {
  it('shows an up arrow and "improved" for a positive (higher-is-better) change', () => {
    render(<DeltaBadge delta={computeDelta(120, 100)} />);
    const badge = screen.getByLabelText(/improved/i);
    expect(badge.textContent).toContain('▲');
    expect(badge.textContent).toContain('+20.0%');
  });

  it('treats a decrease as improvement when lower is better (e.g. response time)', () => {
    render(
      <DeltaBadge delta={computeDelta(40, 60, { lowerIsBetter: true })} />,
    );
    const badge = screen.getByLabelText(/improved/i);
    expect(badge.textContent).toContain('▼');
  });

  it('treats an increase as worsening when lower is better (e.g. churn)', () => {
    render(
      <DeltaBadge delta={computeDelta(60, 40, { lowerIsBetter: true })} />,
    );
    expect(screen.getByLabelText(/worsened/i)).toBeInTheDocument();
  });

  it('renders a neutral badge with no arrow when flat', () => {
    render(<DeltaBadge delta={computeDelta(50, 50)} />);
    const badge = screen.getByLabelText(/no change/i);
    expect(badge.textContent).not.toContain('▲');
    expect(badge.textContent).not.toContain('▼');
  });

  it('can display an absolute change with a unit', () => {
    render(
      <DeltaBadge delta={computeDelta(1200, 1000)} absoluteUnit=" users" />,
    );
    expect(screen.getByText('+200 users')).toBeInTheDocument();
  });
});
