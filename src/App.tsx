import styles from './App.module.css';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { CalendarGrid } from './components/CalendarGrid/CalendarGrid';
import { DayPanel } from './components/DayPanel/DayPanel';

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarPlaceholder}>
        <Sidebar />
      </div>
      
      <div className={styles.mainContent}>
        <Header />
        
        <div className={styles.calendarArea}>
          <CalendarGrid />
          
          <div className={styles.dayPanelPlaceholder}>
            <DayPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
