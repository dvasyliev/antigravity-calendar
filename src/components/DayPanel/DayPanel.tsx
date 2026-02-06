import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarEvent } from '../../utils/types';
import { EventModal } from '../EventModal/EventModal';
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import styles from './DayPanel.module.css';

const EventItem: React.FC<{ event: CalendarEvent; onEdit: () => void; onDelete: () => void }> = ({ event, onEdit, onDelete }) => {
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

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit();
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDelete();
  };

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
          data-testid={`event-menu-${event.id}`}
        />
        
        {isMenuOpen && (
          <div className={styles.dropdownMenu}>
            <button className={styles.dropdownItem} onClick={handleEdit}>
              <Edit2 size={14} />
              Edit
            </button>
            <button className={`${styles.dropdownItem} ${styles.deleteAction}`} onClick={handleDelete} data-testid="delete-event-btn">
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
  const { selectedDate, events, deleteEvent } = useCalendar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | undefined>(undefined);

  const currentDayEvents = events.filter(event => {
    return event.date === selectedDate.format('YYYY-MM-DD');
  });

  const handleOpenCreateModal = () => {
    setEventToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventToEdit(undefined);
  };

  const handleOpenDeleteDialog = (event: CalendarEvent) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setIsDeleteDialogOpen(false);
      setEventToDelete(undefined);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setEventToDelete(undefined);
  };

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
            <EventItem 
              key={event.id} 
              event={event} 
              onEdit={() => handleOpenEditModal(event)}
              onDelete={() => handleOpenDeleteDialog(event)}
            />
          ))
        )}
      </div>

      <button 
        className={styles.addButton} 
        title="Add New Event"
        onClick={handleOpenCreateModal}
        data-testid="add-event-btn"
      >
        <Plus size={24} color="#fff" />
      </button>

      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultDate={selectedDate.format('YYYY-MM-DD')}
        eventToEdit={eventToEdit}
      />

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />
    </div>
  );
};
