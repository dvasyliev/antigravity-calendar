import React, { useEffect } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarEvent } from '../../utils/types';
import { Modal } from '../common/Modal/Modal';
import { Input } from '../common/Input/Input';
import { TextArea } from '../common/TextArea/TextArea';
import { Button } from '../common/Button/Button';
import { useEventForm } from './useEventForm';
import styles from './EventModal.module.css';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string; // YYYY-MM-DD format
  eventToEdit?: CalendarEvent; // If provided, modal is in edit mode
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, defaultDate, eventToEdit }) => {
  const { addEvent, updateEvent } = useCalendar();

  const handleFormSubmit = (eventData: Omit<CalendarEvent, 'id'>, isEdit: boolean) => {
    if (isEdit && eventToEdit) {
      updateEvent({ ...eventToEdit, ...eventData });
    } else {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...eventData
      };
      addEvent(newEvent);
    }
    onClose();
  };

  const {
    title, setTitle,
    description, setDescription,
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    errors, setErrors,
    handleSubmit,
    resetForm,
    MAX_TITLE_LENGTH,
    MAX_DESC_LENGTH
  } = useEventForm({ defaultDate, eventToEdit, onSubmit: handleFormSubmit });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, defaultDate, resetForm]);

  const footer = (
    <div className={styles.actions}>
      <Button 
        type="button" 
        variant="secondary"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button 
        type="button"
        variant="primary"
        onClick={() => handleSubmit()}
      >
        Save Event
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event' : 'Create Event'}
      footer={footer}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Input
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
          }}
          placeholder="Event title"
          autoFocus
          required
          maxLength={MAX_TITLE_LENGTH}
          error={errors.title}
        />

        <TextArea
          label="Description (optional)"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
          }}
          placeholder="Add description..."
          maxLength={MAX_DESC_LENGTH}
          error={errors.description}
        />

        <div className={styles.formRow}>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
            }}
            required
            error={errors.date}
          />
        </div>

        <div className={styles.formRow}>
          <Input
            label="Start Time (optional)"
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
            }}
            error={errors.time ? ' ' : undefined} // Just trigger error state style, message is below
          />

          <Input
            label="End Time (optional)"
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
              if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
            }}
            error={errors.time ? ' ' : undefined}
          />
        </div>
        {errors.time && (
          <div className={styles.errorContainer}>
            <span className={styles.errorText}>{errors.time}</span>
          </div>
        )}
      </form>
    </Modal>
  );
};
