import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import styles from './DayPanel.module.css';

export const DayPanel: React.FC = () => {
  const { selectedDate, events } = useCalendar();

  const currentDayEvents = events.filter(event => {
    // Assuming event.date is YYYY-MM-DD
    return event.date === selectedDate.format('YYYY-MM-DD');
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.dateTitle}>{selectedDate.format('D [of] MMMM')}</h2>
        <div className={styles.dayName}>{selectedDate.format('dddd')}</div>
      </div>

      <div className={styles.eventList}>
        {currentDayEvents.length === 0 ? (
          <div className={styles.emptyState}>No events for this day.</div>
        ) : (
          currentDayEvents.map(event => (
            <div key={event.id} className={styles.eventCard}>
               <div className={styles.eventInfo}>
                 <h3 className={styles.eventTitle}>{event.title}</h3>
                 {event.time && <div className={styles.eventTime}>{event.time}</div>}
                 {event.description && <div className={styles.eventDesc}>{event.description}</div>}
               </div>
               <div className={styles.eventActions}>
                 {/* Visual dots */}
                 <MoreHorizontal size={16} className={styles.moreIcon} />
               </div>
            </div>
          ))
        )}
      </div>

      <button className={styles.addButton} title="Add New Event">
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
};
