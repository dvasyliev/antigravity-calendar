import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    render(<Header />);
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Alice Doe')).toBeInTheDocument();
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });
});
