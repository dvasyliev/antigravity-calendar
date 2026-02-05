import React from 'react';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonStyle = 'primary',
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={48} className={styles.icon} />
        </div>
        
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className={`${styles.confirmButton} ${confirmButtonStyle === 'danger' ? styles.danger : styles.primary}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
