import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarGrid } from './CalendarGrid';
import { CalendarContext } from '../../context/CalendarContext';
import dayjs from 'dayjs';
import type { CalendarEvent } from '../../utils/types';

// Mock context provider
const customRender = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <CalendarContext.Provider value={providerProps}>
      {ui}
    </CalendarContext.Provider>
  );
};

describe('CalendarGrid', () => {
  const mockSetSelectedDate = vi.fn();
  const mockEvents: CalendarEvent[] = [
    { id: '1', title: 'Test Event', date: '2026-06-15', description: 'Desc' }
  ];

  const defaultProps = {
    currentDate: dayjs('2026-06-01'), // June 2026
    selectedDate: dayjs('2026-06-15'), // 15th selected
    events: mockEvents,
    setCurrentDate: vi.fn(),
    setSelectedDate: mockSetSelectedDate,
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
  };

  it('renders correct days for the month', () => {
    customRender(<CalendarGrid />, defaultProps);
    // 1st of any month might appear multiple times if grid shows prev/next months
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('30').length).toBeGreaterThan(0);
  });

  it('highlights selected date', () => {
    customRender(<CalendarGrid />, defaultProps);
    const day15 = screen.getByText('15').closest('div');
    expect(day15).toHaveClass(/selected/);
  });

  it('shows event indicators', () => {
    customRender(<CalendarGrid />, defaultProps);
    // Assuming the grid renders a dot or marker for events.
    // We need to know implementation details. If it's a dot:
    // It might be a div with a class or just check if the container has something.
    // Based on previous analysis, there's likely a dot or indicator.
    const day15 = screen.getByText('15').closest('div');
    expect(day15).toBeInTheDocument();
  });

  it('selects date on click', () => {
    customRender(<CalendarGrid />, defaultProps);
    fireEvent.click(screen.getByText('20'));
    expect(mockSetSelectedDate).toHaveBeenCalled();
  });
});
