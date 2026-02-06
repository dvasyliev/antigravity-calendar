import React from 'react';
import styles from './TextArea.module.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  error, 
  maxLength, 
  required, 
  className = '', 
  value, 
  id,
  ...props 
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const currentLength = value?.toString().length || 0;
  const isWarning = maxLength && currentLength >= maxLength * 0.9;
  const isError = maxLength && currentLength > maxLength;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputContainer}>
        <textarea
          className={`${styles.textarea} ${error ? styles.textareaError : ''} ${className}`}
          value={value}
          id={inputId}
          {...props}
        />
        {maxLength && (
          <span className={`${styles.charCount} ${isError ? styles.charCountError : isWarning ? styles.charCountWarning : ''}`}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
