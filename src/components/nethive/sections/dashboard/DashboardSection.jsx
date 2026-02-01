import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import DashboardVisual from './DashboardVisual';
import DashboardStats from './DashboardStats';
import styles from './css/dashboardSection.module.css';

const DashboardSection = ({ 
  inventoryData, 
  topologyConnections, 
  alertsData, 
  alerts, 
  onNavClick, 
  onComponentClick 
}) => {
  const ingles = useStore(isEnglish);
  const [viewMode, setViewMode] = useState('stats'); // Cambiado de 'visual' a 'stats'

  return (
    <div className={styles.topologySection}>
      <div className={styles.sectionHeader}>
        <h3>{ingles ? 'Infrastructure Dashboard' : 'Panel de Infraestructura'}</h3>
        <div className={styles.viewControls}>
          <button 
            className={`${styles.viewButton} ${viewMode === 'stats' ? styles.active : ''}`}
            onClick={() => setViewMode('stats')}
          >
            📊 {ingles ? 'Statistics' : 'Estadísticas'}
          </button>
          <button 
            className={`${styles.viewButton} ${viewMode === 'visual' ? styles.active : ''}`}
            onClick={() => setViewMode('visual')}
          >
            🌐 {ingles ? 'Visual Overview' : 'Vista Visual'}
          </button>
        </div>
      </div>
      
      {viewMode === 'visual' ? (
        <DashboardVisual
          inventoryData={inventoryData}
          topologyConnections={topologyConnections}
          alertsData={alertsData}
          onNavClick={onNavClick}
        />
      ) : (
        <DashboardStats
          inventoryData={inventoryData}
          topologyConnections={topologyConnections}
          alertsData={alertsData}
          alerts={alerts}
          onNavClick={onNavClick}
        />
      )}
    </div>
  );
};

export default DashboardSection;