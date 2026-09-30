import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App smoke test', () => {
  it('renders the dashboard shell', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /one-day plan/i })).toBeInTheDocument();
    expect(screen.getByText(/study next/i)).toBeInTheDocument();
  });
});
