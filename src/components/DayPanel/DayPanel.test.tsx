import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DayPanel } from './DayPanel';
import { CalendarContext } from '../../context/CalendarContext';
import dayjs from 'dayjs';
import type { CalendarEvent } from '../../utils/types';

// Mock sub-components to keep unit tests fast and isolated
vi.mock('../EventModal/EventModal', () => ({
  EventModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="mock-modal">Event Modal</div> : null
}));

vi.mock('../ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="mock-dialog">Confirm Dialog</div> : null
}));

const customRender = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <CalendarContext.Provider value={providerProps}>
      {ui}
    </CalendarContext.Provider>
  );
};

describe('DayPanel', () => {
  const mockDeleteEvent = vi.fn();
  const mockEvents: CalendarEvent[] = [
    { id: '1', title: 'Meeting', date: '2026-06-15', time: '10:00', description: 'Team sync' }
  ];

  const defaultProps = {
    currentDate: dayjs('2026-06-01'),
    selectedDate: dayjs('2026-06-15'),
    events: mockEvents,
    setCurrentDate: vi.fn(),
    setSelectedDate: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: mockDeleteEvent,
  };

  it('renders selected date info', () => {
    customRender(<DayPanel />, defaultProps);
    expect(screen.getByText(/15 June/)).toBeInTheDocument(); // Format "D MMMM"
  });

  it('lists events for the day', () => {
    customRender(<DayPanel />, defaultProps);
    expect(screen.getByText('Meeting')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('opens modal on add button click', () => {
    customRender(<DayPanel />, defaultProps);
    const addBtn = screen.getByTestId('add-event-btn');
    fireEvent.click(addBtn);
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
  });

  it('opens generic delete dialog on delete click', () => {
    customRender(<DayPanel />, defaultProps);
    
    // Open menu
    const menuIcon = screen.getByTestId('event-menu-1');
    fireEvent.click(menuIcon);
    
    // Click delete
    const deleteBtn = screen.getByTestId('delete-event-btn');
    fireEvent.click(deleteBtn);
    
    expect(screen.getByTestId('mock-dialog')).toBeInTheDocument();
  });
});
