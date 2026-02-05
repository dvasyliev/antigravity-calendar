import dayjs from 'dayjs';
import type { CalendarEvent } from '../utils/types';

const currentYear = 2026;

// Themed activity pools
const morningSports = ['Tennis Match', 'Swimming Session', 'Bike Ride', 'Gym Workout', 'Yoga Morning'];
const meals = ['Breakfast', 'Lunch with Team', 'Dinner with Wife', 'Family Dinner'];
const work = ['Daily Stand-up', 'Project Review', 'Client Meeting', 'Stakeholder Sync', 'Deep Work', 'Code Review'];
const familyFriends = ['Coffee with Friends', 'Meeting with Parents', 'Family Weekend Activity', 'Evening with Wife', 'Drinks with Friends'];
const vacations = ['Summer Vacation', 'Winter Break', 'Ski Trip', 'Weekend Getaway', 'Beach Trip'];

const generateEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  let id = 1;

  let currentDay = dayjs(`${currentYear}-01-01`);
  const lastDay = dayjs(`${currentYear}-12-31`);

  while (currentDay.isBefore(lastDay) || currentDay.isSame(lastDay, 'day')) {
    const dateStr = currentDay.format('YYYY-MM-DD');
    const dayOfWeek = currentDay.day(); // 0 (Sun) to 6 (Sat)

    // 1. Morning Activity (7:00 - 9:00) - Most mornings
    if (Math.random() > 0.3) {
      const sport = morningSports[Math.floor(Math.random() * morningSports.length)];
      events.push({
        id: String(id++),
        title: sport,
        date: dateStr,
        time: '07:00 - 08:30',
      });
    }

    // 2. Meals
    events.push({ id: String(id++), title: meals[0], date: dateStr, time: '08:30 - 09:00' }); // Breakfast
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      events.push({ id: String(id++), title: meals[1], date: dateStr, time: '12:30 - 13:30' }); // Lunch with Team
    } else {
      events.push({ id: String(id++), title: 'Family Lunch', date: dateStr, time: '13:00 - 14:30' });
    }
    if (Math.random() > 0.4) {
      const dinner = (dayOfWeek === 0 || dayOfWeek === 6) ? meals[3] : meals[2]; // Family Dinner vs Dinner with Wife
      events.push({ id: String(id++), title: dinner, date: dateStr, time: '19:30 - 21:00' });
    }

    // 3. Work Meetings (Weekdays)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      events.push({ id: String(id++), title: work[0], date: dateStr, time: '10:00 - 10:30' }); // Daily Stand-up
      
      if (Math.random() > 0.5) {
        events.push({ id: String(id++), title: work[2], date: dateStr, time: '14:00 - 15:00' }); // Client Meeting
      }
      if (Math.random() > 0.6) {
        events.push({ id: String(id++), title: work[1], date: dateStr, time: '16:00 - 17:00' }); // Project Review
      }
    }

    // 4. Family & Friends (Evenings / Weekends)
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekends
      if (Math.random() > 0.4) {
        events.push({ id: String(id++), title: familyFriends[1], date: dateStr, time: '11:00 - 13:00' }); // Meeting with Parents
      }
      events.push({ id: String(id++), title: familyFriends[3], date: dateStr, time: '19:00 - 22:00' }); // Evening with Wife
    } else if (Math.random() > 0.6) {
      events.push({ id: String(id++), title: familyFriends[4], date: dateStr, time: '19:30 - 21:30' }); // Drinks with Friends
    }

    // 5. Vacations (Special Blocks)
    if (currentDay.month() === 6 && currentDay.date() >= 10 && currentDay.date() <= 17) {
      events.push({ id: String(id++), title: vacations[0], date: dateStr, time: 'All Day' }); // Summer Vacation
    }
    if (currentDay.month() === 1 && currentDay.date() >= 15 && currentDay.date() <= 20) {
      events.push({ id: String(id++), title: vacations[2], date: dateStr, time: 'All Day' }); // Ski Trip
    }

    currentDay = currentDay.add(1, 'day');
  }

  return events;
};

export const MOCK_EVENTS: CalendarEvent[] = generateEvents();
