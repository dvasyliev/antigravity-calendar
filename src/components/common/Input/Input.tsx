import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  maxLength?: number;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  maxLength, 
  required, 
  className = '', 
  value, 
  ...props 
}) => {
  const currentLength = value?.toString().length || 0;
  const isWarning = maxLength && currentLength >= maxLength * 0.9;
  const isError = maxLength && currentLength > maxLength;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
          value={value}
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
