import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';
import { ProportionalBar } from './ProportionalBar';

describe('ProportionalBar', () => {
  it('exposes its accessible label and clamps the fill width', () => {
    render(<ProportionalBar value={1.5} ariaLabel="Billing: 320 (18%)" />);
    const bar = screen.getByRole('img', { name: 'Billing: 320 (18%)' });
    const fill = bar.querySelector('span') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('reflects a partial share', () => {
    render(<ProportionalBar value={0.25} ariaLabel="Bug" />);
    const fill = screen
      .getByRole('img', { name: 'Bug' })
      .querySelector('span') as HTMLElement;
    expect(fill.style.width).toBe('25%');
  });
});

describe('ProgressBar', () => {
  it('exposes progressbar semantics with rounded value', () => {
    render(
      <ProgressBar
        value={0.728}
        ariaLabel="LTV progress"
        caption="$182k"
        targetLabel="Target: $250k"
      />,
    );
    const bar = screen.getByRole('progressbar', { name: 'LTV progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '73');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('Target: $250k')).toBeInTheDocument();
  });
});
