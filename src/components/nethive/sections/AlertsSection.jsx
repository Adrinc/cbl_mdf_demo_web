import React from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../data/variables';
import styles from '../css/tableSection.module.css';

const AlertsSection = ({ alertsData }) => {
  const ingles = useStore(isEnglish);

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h3>{ingles ? 'System Alerts' : 'Alertas del Sistema'}</h3>
        <button className={styles.clearButton}>
          🗑️ {ingles ? 'Clear All' : 'Limpiar Todo'}
        </button>
      </div>
      
      {/* Vista de tabla para desktop y tablet */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>{ingles ? 'Type' : 'Tipo'}</th>
                <th>{ingles ? 'Message' : 'Mensaje'}</th>
                <th>{ingles ? 'Timestamp' : 'Fecha/Hora'}</th>
                <th>{ingles ? 'Severity' : 'Criticidad'}</th>
                <th>{ingles ? 'Actions' : 'Acciones'}</th>
              </tr>
            </thead>
            <tbody>
              {alertsData.map((alert) => (
                <tr key={alert.id} className={styles.tableRow}>
                  <td>
                    <span className={`${styles.alertType} ${styles[alert.tipo.toLowerCase()]}`}>
                      {alert.tipo}
                    </span>
                  </td>
                  <td>{alert.mensaje}</td>
                  <td>{alert.timestamp}</td>
                  <td>
                    <span className={`${styles.severityBadge} ${styles[alert.criticidad.toLowerCase()]}`}>
                      {alert.criticidad}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn} title={ingles ? 'Mark as resolved' : 'Marcar como resuelto'}>✓</button>
                      <button className={styles.actionBtn} title={ingles ? 'View details' : 'Ver detalles'}>👁️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className={styles.cardsContainer}>
        {alertsData.map((alert) => (
          <div key={alert.id} className={styles.inventoryCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardId}>#{alert.id}</div>
              <div className={styles.cardActions}>
                <button className={styles.cardActionBtn} title={ingles ? 'Mark as resolved' : 'Marcar como resuelto'}>✓</button>
                <button className={styles.cardActionBtn} title={ingles ? 'View details' : 'Ver detalles'}>👁️</button>
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>
                <span className={`${styles.alertType} ${styles[alert.tipo.toLowerCase()]}`}>
                  {alert.tipo}
                </span>
                <span className={`${styles.severityBadge} ${styles[alert.criticidad.toLowerCase()]}`}>
                  {alert.criticidad}
                </span>
              </div>
              
              <div className={styles.cardInfo}>
                <div className={styles.cardField}>
                  <span className={styles.cardLabel}>{ingles ? 'Message' : 'Mensaje'}:</span>
                  <span className={styles.cardValue}>{alert.mensaje}</span>
                </div>
                
                <div className={styles.cardField}>
                  <span className={styles.cardLabel}>{ingles ? 'Timestamp' : 'Fecha/Hora'}:</span>
                  <span className={styles.cardValue}>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsSection;