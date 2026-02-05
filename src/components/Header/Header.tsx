import React from 'react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        {/* Simple logo icon or text */}
        <div className={styles.logoIcon}>C</div>
        <span>Calendar</span>
      </div>
      
      <div className={styles.userControls}>
        <span className={styles.userName}>Alice Doe</span>
        <div className={styles.avatar}>
          <img src="https://i.pravatar.cc/150?u=alice" alt="User" />
        </div>
      </div>
    </header>
  );
};
