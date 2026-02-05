import { useState, useEffect } from 'react';
import type { CalendarEvent } from '../../utils/types';

interface UseEventFormProps {
  defaultDate?: string;
  eventToEdit?: CalendarEvent;
  onSubmit: (eventData: Omit<CalendarEvent, 'id'>, isEdit: boolean) => void;
}

const MAX_TITLE_LENGTH = 60;
const MAX_DESC_LENGTH = 500;

export const useEventForm = ({ defaultDate, eventToEdit, onSubmit }: UseEventFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    time?: string;
  }>({});

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
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setDate(eventToEdit.date);
      
      const { start, end } = parseTimeRange(eventToEdit.time);
      setStartTime(start);
      setEndTime(end);
      setErrors({});
    } else {
      // Reset logic for create mode if needed, though usually handled by parent resetting key or props
      // We'll trust the parent to mount/unmount or pass correct initial props.
    }
  }, [eventToEdit]);

  // Update date when defaultDate changes (only if not editing)
  useEffect(() => {
    if (defaultDate && !eventToEdit) {
      setDate(defaultDate);
    }
  }, [defaultDate, eventToEdit]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or less`;
      isValid = false;
    }

    if (description.length > MAX_DESC_LENGTH) {
      newErrors.description = `Description must be ${MAX_DESC_LENGTH} characters or less`;
      isValid = false;
    }

    if (!date) {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (startTime && endTime) {
      if (endTime <= startTime) {
        newErrors.time = 'End time must be after start time';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Combine start and end time into a range string
    let timeRange: string | undefined = undefined;
    if (startTime && endTime) {
      timeRange = `${startTime} - ${endTime}`;
    } else if (startTime) {
      timeRange = startTime;
    }

    const eventData = {
      title: title.trim(),
      date,
      description: description.trim() || undefined,
      time: timeRange,
    };

    onSubmit(eventData, !!eventToEdit);
  };

  const resetForm = () => {
     setTitle('');
      setDescription('');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
      setStartTime('');
      setEndTime('');
      setErrors({});
  }

  return {
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
  };
};
