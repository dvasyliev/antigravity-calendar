import React from 'react';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import styles from './Sidebar.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Sidebar: React.FC = () => {
  const { currentDate, setCurrentDate, events } = useCalendar();
  const currentYear = currentDate.year();
  const currentMonth = currentDate.month(); // 0-11

  const handlePrevYear = () => {
    setCurrentDate(currentDate.subtract(1, 'year'));
  };

  const handleNextYear = () => {
    setCurrentDate(currentDate.add(1, 'year'));
  };

  const handleMonthClick = (index: number) => {
    // Keep the year, change the month
    setCurrentDate(currentDate.month(index));
  };

  const getEventCountForMonth = (monthIndex: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      // Ensure we match year and month
      return eventDate.getMonth() === monthIndex && eventDate.getFullYear() === currentYear;
    }).length;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.yearControl}>
        <button onClick={handlePrevYear} className={styles.navBtn}>
          <ChevronLeft size={16} />
        </button>
        <div className={styles.yearDisplay}>{currentYear}</div>
        <button onClick={handleNextYear} className={styles.navBtn}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.monthList}>
        {MONTHS.map((month, index) => {
          const isActive = index === currentMonth;
          const count = getEventCountForMonth(index);
          
          return (
            <div 
              key={month} 
              className={classNames(styles.monthItem, { [styles.active]: isActive })}
              onClick={() => handleMonthClick(index)}
            >
              <div className={styles.monthName}>{month}</div>
              {count > 0 && (
                <div className={styles.eventCount}>{count}</div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
