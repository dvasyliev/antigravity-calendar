import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarEvent } from '../../utils/types';
import styles from './EventModal.module.css';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string; // YYYY-MM-DD format
  eventToEdit?: CalendarEvent; // If provided, modal is in edit mode
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, defaultDate, eventToEdit }) => {
  const { addEvent, updateEvent } = useCalendar();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Parse time range from existing event
  const parseTimeRange = (timeString?: string): { start: string; end: string } => {
    if (!timeString) return { start: '', end: '' };
    
    // Check if it's a time range (e.g., "09:00 - 10:30")
    const rangeMatch = timeString.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
    if (rangeMatch) {
      return { start: rangeMatch[1], end: rangeMatch[2] };
    }
    
    // If it's just a single time, use it as start time
    const timeMatch = timeString.match(/^(\d{2}:\d{2})$/);
    if (timeMatch) {
      return { start: timeMatch[1], end: '' };
    }
    
    return { start: '', end: '' };
  };

  // Populate form when editing an event
  useEffect(() => {
    if (isOpen && eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setDate(eventToEdit.date);
      
      const { start, end } = parseTimeRange(eventToEdit.time);
      setStartTime(start);
      setEndTime(end);
    }
  }, [isOpen, eventToEdit]);

  // Update date when defaultDate changes (for create mode)
  useEffect(() => {
    if (defaultDate && !eventToEdit) {
      setDate(defaultDate);
    }
  }, [defaultDate, eventToEdit]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setStartTime('');
      setEndTime('');
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    // Combine start and end time into a range string
    let timeRange: string | undefined = undefined;
    if (startTime && endTime) {
      timeRange = `${startTime} - ${endTime}`;
    } else if (startTime) {
      timeRange = startTime;
    }

    if (eventToEdit) {
      // Edit mode: update existing event
      const updatedEvent: CalendarEvent = {
        ...eventToEdit,
        title: title.trim(),
        date,
        description: description.trim() || undefined,
        time: timeRange,
      };
      updateEvent(updatedEvent);
    } else {
      // Create mode: add new event
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        date,
        description: description.trim() || undefined,
        time: timeRange,
      };
      addEvent(newEvent);
    }
    
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{eventToEdit ? 'Edit Event' : 'Create Event'}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="event-title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Event title"
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="event-description" className={styles.label}>
              Description <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              placeholder="Add description..."
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="event-date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="event-start-time" className={styles.label}>
                Start Time <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="event-start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="event-end-time" className={styles.label}>
                End Time <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="event-end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.saveButton}
              disabled={!title.trim()}
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
