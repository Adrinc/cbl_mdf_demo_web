import React from 'react';
import styles from './css/statCard.module.css';

const StatCard = ({ 
  icon, 
  value, 
  label, 
  color, 
  trend = null, 
  onClick = null,
  className = ""
}) => {
  return (
    <div 
      className={`${styles.statCard} ${className}`} 
      style={{"--card-color": color}}
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
    >
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>
          {value}
          {trend && (
            <span className={`${styles.trend} ${styles[trend.type]}`}>
              {trend.type === 'up' ? '↗️' : '↘️'} {trend.value}
            </span>
          )}
        </div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
};

export default StatCard;