import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarEvent } from '../../utils/types';
import styles from './DayPanel.module.css';

const EventItem: React.FC<{ event: CalendarEvent }> = ({ event }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventInfo}>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        {event.time && <div className={styles.eventTime}>{event.time}</div>}
        {event.description && <div className={styles.eventDesc}>{event.description}</div>}
      </div>
      <div className={styles.eventActions} ref={menuRef}>
        <MoreHorizontal 
          size={16} 
          className={styles.moreIcon} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
              <Edit2 size={14} />
              Edit
            </button>
            <button className={`${styles.dropdownItem} ${styles.deleteAction}`} onClick={() => setIsMenuOpen(false)}>
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const DayPanel: React.FC = () => {
  const { selectedDate, events } = useCalendar();

  const currentDayEvents = events.filter(event => {
    return event.date === selectedDate.format('YYYY-MM-DD');
  });

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.dateTitle}>{selectedDate.format('D MMMM')}</h2>
        <div className={styles.dayName}>{selectedDate.format('dddd')}</div>
      </div>

      <div className={styles.eventList}>
        {currentDayEvents.length === 0 ? (
          <div className={styles.emptyState}>No events for this day.</div>
        ) : (
          currentDayEvents.map(event => (
            <EventItem key={event.id} event={event} />
          ))
        )}
      </div>

      <button className={styles.addButton} title="Add New Event">
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
};
