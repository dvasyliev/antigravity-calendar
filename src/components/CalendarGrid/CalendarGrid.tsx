import React from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useCalendar } from '../../context/CalendarContext';
import styles from './CalendarGrid.module.css';

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const CalendarGrid: React.FC = () => {
  const { currentDate, selectedDate, setSelectedDate, events } = useCalendar();

  // Generate days
  // Start of the month
  const startMonth = currentDate.startOf('month');
  
  // Start of the grid (start of the week for the 1st of month)
  // Monday start: isoWeekday 1-7. 1=Mon.
  // We want to find the Monday before or on startMonth.
  const startGrid = startMonth.startOf('isoWeek');
  
  // We need 6 weeks normally to be safe, or just enough to cover endMonth.
  // 6 * 7 = 42 days fixed grid is common
  const days = [];
  let day = startGrid;
  
  for (let i = 0; i < 42; i++) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const getEventsForDay = (date: dayjs.Dayjs) => {
    return events.filter(e => {
       return dayjs(e.date).isSame(date, 'day');
    });
  };

  return (
    <div className={styles.gridContainer}>
      {/* Headers */}
      <div className={styles.headers}>
        {WEEKDAYS.map(d => (
          <div key={d} className={styles.headerCell}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {days.map((dateItem) => {
           const isCurrentMonth = dateItem.month() === currentDate.month();
           const isSelected = dateItem.isSame(selectedDate, 'day');
           const dayEvents = getEventsForDay(dateItem);
           
           return (
             <div 
               key={dateItem.toISOString()} 
               className={classNames(styles.dayCell, {
                 [styles.outsideMonth]: !isCurrentMonth,
                 [styles.selected]: isSelected
               })}
               onClick={() => setSelectedDate(dateItem)}
             >
               <span className={styles.dayNumber}>{dateItem.date()}</span>
               
               <div className={styles.eventDots}>
                 {dayEvents.map(event => (
                   <div key={event.id} className={styles.dot} title={event.title} />
                 ))}
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};
