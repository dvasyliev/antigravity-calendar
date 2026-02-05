import { Dayjs } from 'dayjs';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO string YYYY-MM-DD
  description?: string;
  time?: string;
}

export interface CalendarState {
  currentDate: Dayjs;
  selectedDate: Dayjs;
  events: CalendarEvent[];
}
