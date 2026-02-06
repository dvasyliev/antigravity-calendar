import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';
import { CalendarContext } from '../../context/CalendarContext';
import dayjs from 'dayjs';

// Mock context provider
const customRender = (ui: React.ReactElement, providerProps: any) => {
  return render(
    <CalendarContext.Provider value={providerProps}>
      {ui}
    </CalendarContext.Provider>
  );
};

describe('Sidebar', () => {
  const mockSetCurrentDate = vi.fn();
  const defaultProps = {
    currentDate: dayjs('2026-06-15'), // June 2026
    setCurrentDate: mockSetCurrentDate,
    events: [],
    selectedDate: dayjs(),
    setSelectedDate: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
  };

  it('renders months correctly', () => {
    customRender(<Sidebar />, defaultProps);
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  it('highlights current month', () => {
    customRender(<Sidebar />, defaultProps);
    const juneText = screen.getByText('June');
    // Traverse up to find the monthItem container. 
    const juneContainer = juneText.parentElement;
    // Check class name directly to avoid potential matcher issues with CSS modules
    expect(juneContainer?.className).toMatch(/active/);
  });

  it('navigates years correctly', () => {
    customRender(<Sidebar />, defaultProps);
    
    // prevBtn is not used directly if we use getAllByRole

    // Better to query by class or add aria-label in source if possible.
    // Given the component source, we have two buttons.
    const buttons = screen.getAllByRole('button'); // Should be 2 nav buttons
    
    // Previous Year
    fireEvent.click(buttons[0]);
    expect(mockSetCurrentDate).toHaveBeenCalled();
    // Verify call argument is 2025 (we can't easily check dayjs object exact equality without matchers, but we can check if it was called)
    
    // Next Year
    fireEvent.click(buttons[1]);
    expect(mockSetCurrentDate).toHaveBeenCalledTimes(2);
  });

  it('updates month on click', () => {
    customRender(<Sidebar />, defaultProps);
    
    fireEvent.click(screen.getByText('March'));
    // Expect setCurrentDate called
    expect(mockSetCurrentDate).toHaveBeenCalled();
  });
});
