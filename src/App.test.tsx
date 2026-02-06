import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { CalendarProvider } from './context/CalendarContext';

// Mock Header
vi.mock('./components/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

// Mock Sidebar
vi.mock('./components/Sidebar/Sidebar', () => ({
  Sidebar: () => <div data-testid="mock-sidebar">Sidebar</div>
}));

// Mock CalendarGrid
vi.mock('./components/CalendarGrid/CalendarGrid', () => ({
  CalendarGrid: () => <div data-testid="mock-grid">Grid</div>
}));

// Mock MOCK_EVENTS
vi.mock('./mocks/events', () => ({
  MOCK_EVENTS: [
    { id: '1', title: 'Existing Event', date: '2026-01-15', time: '10:00' }
  ]
}));

// Mock heavy children of DayPanel
vi.mock('./components/EventModal/EventModal', () => ({
  EventModal: (props: { isOpen: boolean }) => props.isOpen ? <div data-testid="mock-event-modal">Event Modal</div> : null
}));

vi.mock('./components/ConfirmDialog/ConfirmDialog', () => ({
  ConfirmDialog: (props: { isOpen: boolean }) => props.isOpen ? <div data-testid="mock-confirm-dialog">Confirm Dialog</div> : null
}));

describe('App Integration', () => {
  const renderApp = () => {
    return render(
      <CalendarProvider>
        <App />
      </CalendarProvider>
    );
  };

  it('renders main layout', () => {
    renderApp();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-grid')).toBeInTheDocument();
  });

  it('opens add event modal', () => {
    renderApp();
    // Default selected date is today. click Add Event button.
    
    const addBtn = screen.getByTestId('add-event-btn');
    fireEvent.click(addBtn);
    
    expect(screen.getByTestId('mock-event-modal')).toBeInTheDocument();
  });
});
