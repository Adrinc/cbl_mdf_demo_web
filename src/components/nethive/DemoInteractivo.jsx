import React, { useState, useEffect } from "react";
import { isEnglish } from '../../data/variables.js';
import { useStore } from '@nanostores/react';

// Importar el componente de login
import LoginScreen from './LoginScreen';

// Importar los componentes de secciones
import CompanySelector from './sections/company-management/CompanySelector';
import DashboardSection from './sections/dashboard/DashboardSection';
import InventorySection from './sections/InventorySection';
import TopologySection from './sections/TopologySection';
import AlertsSection from './sections/AlertsSection';
import SettingsSection from './sections/SettingsSection';

import styles from "./css/demoInteractivo.module.css";

const DemoInteractivo = () => {
  const ingles = useStore(isEnglish);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado del login
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeSection, setActiveSection] = useState('company-selector');
  const [selectedBranchData, setSelectedBranchData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventory, setInventory] = useState([
    { id: 1, tipo: 'Switch', modelo: 'Cisco 2960X-24PS', ubicacion: 'MDF-Rack-01', estado: 'Operativo', puertos: 24, fechaInstalacion: '2024-01-15' },
    { id: 2, tipo: 'Patch Panel', modelo: 'CommScope 1375055-2', ubicacion: 'MDF-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-01-15' },
    { id: 3, tipo: 'Switch', modelo: 'Cisco 2960X-48TS', ubicacion: 'IDF-01-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-02-10' },
    { id: 4, tipo: 'Patch Panel', modelo: 'Panduit DP485E88TGY', ubicacion: 'IDF-01-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-02-10' },
    { id: 5, tipo: 'Switch', modelo: 'Cisco 2960X-48TS', ubicacion: 'IDF-02-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-02-12' },
    { id: 6, tipo: 'Patch Panel', modelo: 'Panduit DP485E88TGY', ubicacion: 'IDF-02-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-02-12' },
    { id: 7, tipo: 'Cable Cat6A', modelo: 'Belden 2413', ubicacion: 'MDF-IDF-01', estado: 'Operativo', longitud: '150m', fechaInstalacion: '2024-01-20' },
    { id: 8, tipo: 'UPS', modelo: 'APC Smart-UPS 3000VA', ubicacion: 'IDF-02-Rack-01', estado: 'Operativo', capacidad: '3000VA', fechaInstalacion: '2024-03-05' },
    { id: 9, tipo: 'Fibra Optica', modelo: 'Corning SMF-28', ubicacion: 'MDF-IDF-02', estado: 'Operativo', categoria: 'Monomodo', fechaInstalacion: '2024-02-25' },
    { id: 10, tipo: 'Router', modelo: 'Cisco ISR 4321', ubicacion: 'MDF-Rack-01', estado: 'Operativo', puertos: 4, fechaInstalacion: '2024-01-10' },
    { id: 11, tipo: 'Firewall', modelo: 'Fortinet FortiGate 100F', ubicacion: 'MDF-Rack-01', estado: 'Operativo', puertos: 14, fechaInstalacion: '2024-01-12' },
    { id: 12, tipo: 'Switch', modelo: 'Cisco 2960X-24PS', ubicacion: 'IDF-03-Rack-01', estado: 'Operativo', puertos: 24, fechaInstalacion: '2024-03-15' },
    { id: 13, tipo: 'Patch Panel', modelo: 'Panduit DP485E88TGY', ubicacion: 'IDF-03-Rack-01', estado: 'Operativo', puertos: 48, fechaInstalacion: '2024-03-15' },
    { id: 14, tipo: 'UPS', modelo: 'APC Smart-UPS 1500VA', ubicacion: 'IDF-01-Rack-01', estado: 'Operativo', capacidad: '1500VA', fechaInstalacion: '2024-02-20' },
    { id: 15, tipo: 'Cable Cat6A', modelo: 'Belden 2413', ubicacion: 'MDF-IDF-03', estado: 'Operativo', longitud: '200m', fechaInstalacion: '2024-03-10' },
    { id: 16, tipo: 'Server Rack', modelo: 'APC NetShelter SX 42U', ubicacion: 'MDF-Rack-02', estado: 'Operativo', unidades: '42U', fechaInstalacion: '2024-01-05' },
    { id: 17, tipo: 'PDU', modelo: 'APC Rack PDU 2G', ubicacion: 'MDF-Rack-02', estado: 'Operativo', puertos: 20, fechaInstalacion: '2024-01-08' },
    { id: 18, tipo: 'Conversor Media', modelo: 'TP-Link MC220L', ubicacion: 'IDF-01-Rack-01', estado: 'Operativo', puertos: 2, fechaInstalacion: '2024-02-15' },
    { id: 19, tipo: 'Access Point', modelo: 'Ubiquiti UniFi 6 Pro', ubicacion: 'Piso-02-Zona-A', estado: 'Operativo', capacidad: '300 usuarios', fechaInstalacion: '2024-03-20' },
    { id: 20, tipo: 'KVM Switch', modelo: 'Raritan DKX3-101', ubicacion: 'MDF-Rack-01', estado: 'Operativo', puertos: 8, fechaInstalacion: '2024-01-18' }
  ]);

  const topologyConnections = [
    { from: 'MDF', to: 'IDF-01', tipo: 'Fibra Optica', estado: 'Activo', ancho_banda: '10Gbps' },
    { from: 'MDF', to: 'IDF-02', tipo: 'Fibra Optica', estado: 'Activo', ancho_banda: '10Gbps' },
    { from: 'IDF-01', to: 'Endpoint-A1', tipo: 'Cat6A', estado: 'Activo', ancho_banda: '1Gbps' },
    { from: 'IDF-01', to: 'Endpoint-A2', tipo: 'Cat6A', estado: 'Activo', ancho_banda: '1Gbps' },
    { from: 'IDF-02', to: 'Endpoint-B1', tipo: 'Cat6A', estado: 'Activo', ancho_banda: '1Gbps' },
    { from: 'IDF-02', to: 'Endpoint-B2', tipo: 'Cat6A', estado: 'Inactivo', ancho_banda: '1Gbps' }
  ];

  const alertsData = [
    { id: 1, tipo: 'Warning', mensaje: 'Puerto 24 del Switch MDF desconectado', timestamp: '2024-06-24 10:30', criticidad: 'Media' },
    { id: 2, tipo: 'Info', mensaje: 'Mantenimiento programado IDF-02 completado', timestamp: '2024-06-24 09:15', criticidad: 'Baja' },
    { id: 3, tipo: 'Critical', mensaje: 'UPS IDF-02 funcionando con batería', timestamp: '2024-06-24 08:45', criticidad: 'Alta' },
    { id: 4, tipo: 'Warning', mensaje: 'Temperatura elevada en Rack MDF-01', timestamp: '2024-06-24 07:20', criticidad: 'Media' }
  ];

  const configData = [
    { categoria: 'Red', parametro: 'VLAN por defecto', valor: '100', descripcion: 'VLAN asignada a nuevos dispositivos' },
    { categoria: 'Monitoreo', parametro: 'Intervalo de polling', valor: '30 segundos', descripcion: 'Frecuencia de consulta SNMP' },
    { categoria: 'Alertas', parametro: 'Email notificaciones', valor: 'admin@empresa.com', descripcion: 'Destinatario de alertas críticas' },
    { categoria: 'Backup', parametro: 'Frecuencia respaldo', valor: 'Diario', descripcion: 'Backup automático de configuraciones' },
    { categoria: 'Seguridad', parametro: 'Timeout sesión', valor: '30 minutos', descripcion: 'Tiempo límite de inactividad' }
  ];

  useEffect(() => {
    // Solo ejecutar alertas dinámicas si está logueado
    if (!isLoggedIn) return;
    
    const alertInterval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'warning' : 'info',
        message: ingles ? 'Connection status updated' : 'Estado de conexión actualizado'
      };
      setAlerts(prev => [...prev.slice(-2), newAlert]);
    }, 5000);

    return () => clearInterval(alertInterval);
  }, [ingles, isLoggedIn]);

  const content = {
    es: {
      title: "Demo Interactiva",
      subtitle: "Dashboard de Control de Infraestructura MDF/IDF",
      backButton: "Volver al Portal",
      exitDemo: "Salir de la Demo",
      navigation: {
        dashboard: "Dashboard",
        inventory: "Inventario",
        topology: "Topología",
        alerts: "Alertas",
        settings: "Configuración"
      }
    },
    en: {
      title: "Interactive Demo",
      subtitle: "MDF/IDF Infrastructure Control Dashboard",
      backButton: "Back to Portal",
      exitDemo: "Exit Demo",
      navigation: {
        dashboard: "Dashboard",
        inventory: "Inventory",
        topology: "Topology",
        alerts: "Alerts",
        settings: "Settings"
      }
    }
  };

  const textos = ingles ? content.en : content.es;

  // Handler para el login exitoso
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleBackToHome = () => {
    window.location.href = 'https://cbluna.com/';
  };

  const handleExitDemo = () => {
    if (confirm(ingles ? 'Exit demo and return to portal?' : '¿Salir de la demo y volver al portal?')) {
      window.location.href = 'https://cbluna.com/';
    }
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false); // Cerrar menú móvil al navegar
  };

  const handleAddEquipment = (newEquipment) => {
    setInventory(prevInventory => [...prevInventory, newEquipment]);
  };

  const handleBranchSelect = (branchData) => {
    setSelectedBranchData(branchData);
    setInventory(branchData.inventory);
    setActiveSection('dashboard');
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  // Si no está logueado, mostrar la pantalla de login
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch(activeSection) {
      case 'company-selector':
        return (
          <CompanySelector
            onBranchSelect={handleBranchSelect}
            onCompanySelect={handleCompanySelect}
          />
        );
      case 'dashboard':
        return (
          <DashboardSection
            inventoryData={selectedBranchData ? selectedBranchData.inventory : inventory}
            topologyConnections={selectedBranchData ? selectedBranchData.topologyConnections : topologyConnections}
            alertsData={selectedBranchData ? selectedBranchData.alertsData : alertsData}
            alerts={alerts}
            onNavClick={handleNavClick}
            onComponentClick={handleComponentClick}
            branchInfo={selectedBranchData ? selectedBranchData.branchInfo : null}
          />
        );
      case 'inventory':
        return <InventorySection inventoryData={inventory} onAddEquipment={handleAddEquipment} />;
      case 'topology':
        return <TopologySection topologyConnections={topologyConnections} />;
      case 'alerts':
        return <AlertsSection alertsData={alertsData} />;
      case 'settings':
        return <SettingsSection configData={configData} />;
      default:
        return (
          <DashboardSection
            inventoryData={inventory}
            topologyConnections={topologyConnections}
            alertsData={alertsData}
            alerts={alerts}
            onNavClick={handleNavClick}
            onComponentClick={handleComponentClick}
          />
        );
    }
  };

  return (
    <div className={styles.demoContainer}>
      {/* Solo mostrar header y sidebar si no estamos en company-selector */}
      {activeSection !== 'company-selector' && (
        <>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              {/* Botón hamburguesa para móvil */}
              <button 
                className={styles.mobileMenuBtn}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></span>
                <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`}></span>
              </button>
              <img src={`${import.meta.env.BASE_URL}/image/isotipodemo/nethive.png`} alt="Logo" className={styles.logo} />
              <h1 className={styles.title}>{textos.title}</h1>
              {selectedBranchData && (
                <div className={styles.branchIndicator}>
                  <span className={styles.branchName}>{selectedBranchData.branchInfo.name}</span>
                  <span className={styles.companyName}>({selectedBranchData.branchInfo.company})</span>
                </div>
              )}
            </div>
            <div className={styles.headerRight}>
              <div className={styles.userProfile}>
                <span className={styles.userName}>Demo User</span>
              </div>
            </div>
          </header>

          {/* Menú móvil desplegable */}
          <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
            <nav className={styles.mobileNav}>
              {/* Botón de regresar a Empresas - separado del resto */}
              <div 
                className={`${styles.mobileNavItem} ${styles.backToCompanies} ${activeSection === 'company-selector' ? styles.active : ''}`}
                onClick={() => handleNavClick('company-selector')}
              >
                <span className={styles.mobileNavIcon}>⬅</span>
                <span>{ingles ? 'Companies' : 'Empresas'}</span>
              </div>
              
              {/* Separador */}
              <div className={styles.mobileNavDivider}></div>
              
              <div 
                className={`${styles.mobileNavItem} ${activeSection === 'dashboard' ? styles.active : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <span className={styles.mobileNavIcon}>📊</span>
                <span>{textos.navigation.dashboard}</span>
              </div>
              <div 
                className={`${styles.mobileNavItem} ${activeSection === 'inventory' ? styles.active : ''}`}
                onClick={() => handleNavClick('inventory')}
              >
                <span className={styles.mobileNavIcon}>📦</span>
                <span>{textos.navigation.inventory}</span>
              </div>
              <div 
                className={`${styles.mobileNavItem} ${activeSection === 'topology' ? styles.active : ''}`}
                onClick={() => handleNavClick('topology')}
              >
                <span className={styles.mobileNavIcon}>🌐</span>
                <span>{textos.navigation.topology}</span>
              </div>
              <div 
                className={`${styles.mobileNavItem} ${activeSection === 'alerts' ? styles.active : ''}`}
                onClick={() => handleNavClick('alerts')}
              >
                <span className={styles.mobileNavIcon}>🚨</span>
                <span>{textos.navigation.alerts}</span>
              </div>
              <div 
                className={`${styles.mobileNavItem} ${activeSection === 'settings' ? styles.active : ''}`}
                onClick={() => handleNavClick('settings')}
              >
                <span className={styles.mobileNavIcon}>⚙️</span>
                <span>{textos.navigation.settings}</span>
              </div>
              
              {/* Separador */}
              <div className={styles.mobileNavDivider}></div>
              
              {/* Acciones adicionales */}
              <div 
                className={`${styles.mobileNavItem} ${styles.exitItem}`}
                onClick={handleExitDemo}
              >
                <span className={styles.mobileNavIcon}>🚪</span>
                <span>{ingles ? 'Exit Demo' : 'Salir de Demo'}</span>
              </div>
            </nav>
            
            {/* Info de sucursal en móvil */}
            {selectedBranchData && (
              <div className={styles.mobileBranchInfo}>
                <span className={styles.mobileBranchName}>{selectedBranchData.branchInfo.name}</span>
                <span className={styles.mobileCompanyName}>{selectedBranchData.branchInfo.company}</span>
              </div>
            )}
          </div>
          
          {/* Overlay para cerrar menú */}
          {mobileMenuOpen && (
            <div 
              className={styles.mobileMenuOverlay} 
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div className={styles.mainContent}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <nav className={styles.navigation}>
                {/* Botón de regresar a Empresas - separado del resto */}
                <div 
                  className={`${styles.navItem} ${styles.backToCompanies} ${activeSection === 'company-selector' ? styles.active : ''}`}
                  onClick={() => handleNavClick('company-selector')}
                >
                  <span className={styles.navIcon}>⬅</span>
                  {ingles ? 'Companies' : 'Empresas'}
                </div>
                
                {/* Separador */}
                <div className={styles.navDivider}></div>
                
                <div 
                  className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.active : ''}`}
                  onClick={() => handleNavClick('dashboard')}
                >
                  <span className={styles.navIcon}>📊</span>
                  {textos.navigation.dashboard}
                </div>
                <div 
                  className={`${styles.navItem} ${activeSection === 'inventory' ? styles.active : ''}`}
                  onClick={() => handleNavClick('inventory')}
                >
                  <span className={styles.navIcon}>📦</span>
                  {textos.navigation.inventory}
                </div>
                <div 
                  className={`${styles.navItem} ${activeSection === 'topology' ? styles.active : ''}`}
                  onClick={() => handleNavClick('topology')}
                >
                  <span className={styles.navIcon}>🌐</span>
                  {textos.navigation.topology}
                </div>
                <div 
                  className={`${styles.navItem} ${activeSection === 'alerts' ? styles.active : ''}`}
                  onClick={() => handleNavClick('alerts')}
                >
                  <span className={styles.navIcon}>🚨</span>
                  {textos.navigation.alerts}
                </div>
                <div 
                  className={`${styles.navItem} ${activeSection === 'settings' ? styles.active : ''}`}
                  onClick={() => handleNavClick('settings')}
                >
                  <span className={styles.navIcon}>⚙️</span>
                  {textos.navigation.settings}
                </div>
              </nav>
            </aside>

            {/* Dashboard Content */}
            <main className={styles.dashboardContent}>
              <div className={styles.dashboardHeader}>
                <h2>{activeSection === 'company-selector' ? (ingles ? 'Select Company' : 'Seleccionar Empresa') : textos.navigation[activeSection]}</h2>
              </div>

              {renderContent()}
            </main>
          </div>
        </>
      )}

      {/* Render CompanySelector directamente cuando está activo */}
      {activeSection === 'company-selector' && renderContent()}

      {/* Selected Component Modal */}
      {selectedComponent && (
        <div className={styles.modal} onClick={() => setSelectedComponent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Detalles de {selectedComponent}</h3>
            <p>Estado: Operativo</p>
            <p>Última actualización: Hace 2 minutos</p>
            <p>Conexiones activas: 8/12</p>
            <button onClick={() => setSelectedComponent(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoInteractivo;