import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../data/variables';
import styles from './css/demoFooter.module.css';

const DemoFooter = () => {
  const ingles = useStore(isEnglish);
  const [isHovered, setIsHovered] = useState(false);

  const handleExit = () => {
    if (confirm(ingles ? 'Exit demo and return to portal?' : '¿Salir de la demo y volver al portal?')) {
      window.location.href = 'https://cbluna.com/';
    }
  };

  return (
    <>
      {/* Botón FAB en esquina inferior derecha */}
      <button 
        className={`${styles.fabButton} ${isHovered ? styles.fabExpanded : ''}`}
        onClick={handleExit}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={ingles ? 'Exit Demo' : 'Salir de la Demo'}
      >
        <svg className={styles.fabIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
        <span className={styles.fabText}>{ingles ? 'Exit' : 'Salir'}</span>
      </button>
    </>
  );
};

export default DemoFooter;
