import React, { createContext, useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type { CalendarEvent } from '../utils/types';

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
  const [events, setEvents] = useState<CalendarEvent[]>([
    { 
      id: '1', 
      title: 'Work Time', 
      date: dayjs().format('YYYY-MM-DD'), 
      time: '09:00 - 15:30', 
    },
    { 
      id: '2', 
      title: 'Coffee Time at Frozen Coffee Shop', 
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'), 
      time: '19:00 - 10:00', 
    },
    { 
      id: '3', 
      title: 'Product Design Congress', 
      date: dayjs().add(3, 'day').format('YYYY-MM-DD'), 
      time: '12:00 - 14:00', 
    },
    {
       id: '4',
       title: 'Fishing with family',
       date: dayjs().add(15, 'day').format('YYYY-MM-DD'),
       time: '06:00 - 10:00'
    }
  ]);

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
