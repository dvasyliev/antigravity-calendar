import React, { createContext, useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { CalendarEvent } from '../utils/types';
import { MOCK_EVENTS } from '../mocks/events';

interface CalendarContextType {
  currentDate: Dayjs;
  selectedDate: Dayjs;
  events: CalendarEvent[];
  setCurrentDate: (date: Dayjs) => void;
  setSelectedDate: (date: Dayjs) => void;
  addEvent: (event: CalendarEvent) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);


  const addEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  return (
    <CalendarContext.Provider value={{ currentDate, selectedDate, events, setCurrentDate, setSelectedDate, addEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};
