import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BranchesTableSection from './BranchesTableSection';
import AddCompanyModal from './AddCompanyModal';
import AddBranchModal from './AddBranchModal';
import styles from './css/companySelector.module.css';

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';

// Configurar íconos de Leaflet solo en el navegador
if (isBrowser) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Componente de Tooltip personalizado
const CustomTooltip = ({ branch, show, position }) => {
  if (!show || !branch) return null;

  return (
    <div 
      className={styles.customTooltip}
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className={styles.tooltipImage}>
        <img 
          src={branch.image} 
          alt={branch.name}
          onError={(e) => {
            // Si la imagen no existe, usar una imagen placeholder
            e.target.src = `${import.meta.env.BASE_URL}/logo_nh_b.png`;
          }}
        />
      </div>
      <div className={styles.tooltipContent}>
        <h4>{branch.name}</h4>
        <p className={styles.tooltipCity}>{branch.city}</p>
        <p className={styles.tooltipAddress}>{branch.address}</p>
        <div className={styles.tooltipEmployees}>
          <span className={styles.employeeIcon}>👥</span>
          {branch.employees} empleados
        </div>
      </div>
      <div className={styles.tooltipArrow}></div>
    </div>
  );
};

// Componente personalizado para manejar eventos del mapa
const MapEventHandler = ({ onMouseMove }) => {
  useMapEvents({
    mousemove: (e) => {
      onMouseMove(e);
    }
  });
  return null;
};

// Componente CustomMarker que maneja el hover
const CustomMarker = ({ branch, onHover, onLeave, onClick, mapRef }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      const marker = markerRef.current;
      const map = mapRef.current;

      const handleMouseEnter = (e) => {
        const containerPoint = map.latLngToContainerPoint(e.latlng);
        const mapContainer = map.getContainer().getBoundingClientRect();
        
        onHover(branch, {
          x: mapContainer.left + containerPoint.x,
          y: mapContainer.top + containerPoint.y
        });
      };

      const handleMouseLeave = () => {
        onLeave();
      };

      marker.on('mouseover', handleMouseEnter);
      marker.on('mouseout', handleMouseLeave);

      return () => {
        marker.off('mouseover', handleMouseEnter);
        marker.off('mouseout', handleMouseLeave);
      };
    }
  }, [branch, onHover, onLeave, mapRef]);

  return (
    <Marker
      ref={markerRef}
      position={branch.position}
      eventHandlers={{
        click: () => onClick(branch)
      }}
    >
      <Popup>
        <div className={styles.popupContent}>
          <div className={styles.popupImage}>
            <img 
              src={branch.image} 
              alt={branch.name}
              onError={(e) => {
                e.target.src = `${import.meta.env.BASE_URL}/logo_nh_b.png`;
              }}
            />
          </div>
          <h4>{branch.name}</h4>
          <p><strong>{branch.city}</strong></p>
          <p className={styles.popupAddress}>{branch.address}</p>
          <p>{branch.employees} empleados</p>
          <button 
            className={styles.selectButton}
            onClick={() => onClick(branch)}
          >
            Seleccionar Sucursal
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

// Datos de empresas y sus sucursales (hardcodeado para demo)
const companiesData = {
  "TechCorp Solutions": {
    id: "techcorp",
    industry: "Tecnología",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%2300bcd4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3ETC%3C/text%3E%3C/svg%3E",
    branches: [
      { 
        id: 1, 
        name: "Sede Central", 
        position: [19.4326, -99.1332], 
        city: "Ciudad de México", 
        employees: 250,
        address: "Av. Paseo de la Reforma 123, Col. Juárez, 06600 Ciudad de México, CDMX",
        image: `${import.meta.env.BASE_URL}/image/companies/e2.jpg`
      },
      { 
        id: 2, 
        name: "Sucursal Norte", 
        position: [25.6866, -100.3161], 
        city: "Monterrey", 
        employees: 120,
        address: "Av. Constitución 456, Centro, 64000 Monterrey, N.L.",
        image: `${import.meta.env.BASE_URL}/image/companies/e3.jpg`
      },
      { 
        id: 3, 
        name: "Sucursal Occidente", 
        position: [20.6597, -103.3496], 
        city: "Guadalajara", 
        employees: 180,
        address: "Av. López Mateos 789, Providencia, 44630 Guadalajara, Jal.",
        image: `${import.meta.env.BASE_URL}/image/companies/e4.jpg`
      },
      { 
        id: 4, 
        name: "Centro de Desarrollo", 
        position: [32.5027, -117.0037], 
        city: "Tijuana", 
        employees: 95,
        address: "Blvd. Agua Caliente 321, Aviación, 22420 Tijuana, B.C.",
        image: `${import.meta.env.BASE_URL}/image/companies/e5.jpg`
      }
    ]
  },
  "Global Manufacturing Inc": {
    id: "globalmanuf",
    industry: "Manufactura",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23ff7043'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='26' font-weight='bold' fill='white'%3EGM%3C/text%3E%3C/svg%3E",
    branches: [
      { 
        id: 5, 
        name: "Planta Principal", 
        position: [19.0414, -98.2063], 
        city: "Puebla", 
        employees: 450,
        address: "Carretera Federal México-Puebla Km 112, San Lorenzo Almecatla, 72830 Puebla, Pue.",
        image: `${import.meta.env.BASE_URL}/image/companies/e7.jpg`
      },
      { 
        id: 6, 
        name: "Centro Logístico", 
        position: [20.9754, -89.6173], 
        city: "Mérida", 
        employees: 85,
        address: "Calle 60 Norte 234, Centro Histórico, 97000 Mérida, Yuc.",
        image: `${import.meta.env.BASE_URL}/image/companies/e8.jpg`
      },
      { 
        id: 7, 
        name: "Almacén Norte", 
        position: [31.7619, -106.4850], 
        city: "Ciudad Juárez", 
        employees: 160,
        address: "Av. de las Américas 567, Partido Romero, 32030 Cd. Juárez, Chih.",
        image: `${import.meta.env.BASE_URL}/image/companies/e8.jpg`
      },
      { 
        id: 8, 
        name: "Oficina Corporativa", 
        position: [19.4326, -99.1332], 
        city: "CDMX", 
        employees: 220,
        address: "Torre Corporativa, Polanco V Sección, 11560 Ciudad de México, CDMX",
        image: `${import.meta.env.BASE_URL}/image/companies/e3.jpg`
      }
    ]
  },
  "FinanceHub Networks": {
    id: "financehub",
    industry: "Servicios Financieros",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%2342a5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3EFH%3C/text%3E%3C/svg%3E",
    branches: [
      { 
        id: 9, 
        name: "Torre Corporativa", 
        position: [19.4326, -99.1332], 
        city: "Ciudad de México", 
        employees: 380,
        address: "Av. Santa Fe 890, Santa Fe, 01219 Ciudad de México, CDMX",
        image: `${import.meta.env.BASE_URL}/image/companies/e1.jpg`
      },
      { 
        id: 10, 
        name: "Centro de Operaciones", 
        position: [25.6866, -100.3161], 
        city: "Monterrey", 
        employees: 150,
        address: "Av. San Jerónimo 432, San Jerónimo, 64640 Monterrey, N.L.",
        image: `${import.meta.env.BASE_URL}/image/companies/e8.jpg`
      },
      { 
        id: 11, 
        name: "Sucursal Bajío", 
        position: [21.1619, -101.6827], 
        city: "León", 
        employees: 90,
        address: "Blvd. López Mateos 654, Centro, 37000 León, Gto.",
        image: `${import.meta.env.BASE_URL}/image/companies/e7.jpg`
      },
      { 
        id: 12, 
        name: "Centro de Datos", 
        position: [20.6597, -103.3496], 
        city: "Guadalajara", 
        employees: 45,
        address: "Av. Américas 876, Providencia, 44630 Guadalajara, Jal.",
        image: `${import.meta.env.BASE_URL}/image/companies/e6.jpg`
      }
    ]
  },
  "RetailChain Express": {
    id: "retailchain",
    industry: "Retail",
    logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23ab47bc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3ERC%3C/text%3E%3C/svg%3E",
    branches: [
      { 
        id: 13, 
        name: "Almacén Central", 
        position: [19.3629, -99.2506], 
        city: "Toluca", 
        employees: 200,
        address: "Av. Solidaridad las Torres 543, Las Torres, 50140 Toluca, Méx.",
        image: `${import.meta.env.BASE_URL}/image/companies/e4.jpg`
      },
      { 
        id: 14, 
        name: "Tienda Norte", 
        position: [25.6866, -100.3161], 
        city: "Monterrey", 
        employees: 75,
        address: "Av. Universidad 765, Del Valle, 66220 San Pedro Garza García, N.L.",
        image: `${import.meta.env.BASE_URL}/image/companies/e3.jpg`
      },
      { 
        id: 15, 
        name: "Tienda Sur", 
        position: [16.8531, -99.8237], 
        city: "Acapulco", 
        employees: 60,
        address: "Costera Miguel Alemán 987, Fracc. Costa Azul, 39850 Acapulco, Gro.",
        image: `${import.meta.env.BASE_URL}/image/companies/e2.jpg`
      },
      { 
        id: 16, 
        name: "Centro Distribución", 
        position: [20.6597, -103.3496], 
        city: "Guadalajara", 
        employees: 135,
        address: "Av. Patria 321, Jardines del Sol, 45050 Zapopan, Jal.",
        image: `${import.meta.env.BASE_URL}/image/companies/e1.jpg`
      }
    ]
  }
};

// Componente wrapper para el mapa que solo se renderiza en el cliente
const ClientOnlyMap = ({ mapCenter, mapZoom, selectedCompany, handleMarkerHover, handleMarkerLeave, handleBranchSelect, mapRef }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted || !isBrowser) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando mapa...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className={styles.map}
        key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {selectedCompany && companiesData[selectedCompany] && companiesData[selectedCompany].branches.map((branch) => (
          <CustomMarker
            key={branch.id}
            branch={branch}
            onHover={handleMarkerHover}
            onLeave={handleMarkerLeave}
            onClick={handleBranchSelect}
            mapRef={mapRef}
          />
        ))}
      </MapContainer>
    </div>
  );
};

// Componente principal CompanySelector
const CompanySelector = ({ onCompanySelect, onBranchSelect }) => {
  const ingles = useStore(isEnglish);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.6345, -102.5528]);
  const [mapZoom, setMapZoom] = useState(5);
  const [hoveredBranch, setHoveredBranch] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('map'); // 'map' o 'table'
  const [companies, setCompanies] = useState([]);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // Estado para sidebar móvil
  const mapRef = useRef(null);

  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar sidebar cuando se selecciona una empresa en móvil
  const handleCompanySelectMobile = (companyName) => {
    handleCompanySelect(companyName);
    if (isMobile) {
      setSidebarExpanded(false);
    }
  };

  // Convertir companiesData a formato de array para la tabla
  useEffect(() => {
    const companiesArray = Object.keys(companiesData).map(name => ({
      id: companiesData[name].id,
      name: name,
      industry: companiesData[name].industry,
      logo: companiesData[name].logo,
      branches: companiesData[name].branches,
      createdAt: '2024-01-15T10:00:00Z', // Fecha simulada
      updatedAt: '2024-07-02T14:30:00Z'   // Fecha simulada
    }));
    setCompanies(companiesArray);
    
    // Seleccionar TechCorp Solutions por defecto
    setSelectedCompany('TechCorp Solutions');
    
    if (companiesData['TechCorp Solutions'] && companiesData['TechCorp Solutions'].branches.length > 0) {
      const company = companiesData['TechCorp Solutions'];
      const avgLat = company.branches.reduce((sum, branch) => sum + branch.position[0], 0) / company.branches.length;
      const avgLng = company.branches.reduce((sum, branch) => sum + branch.position[1], 0) / company.branches.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(7);
    }
  }, []);

  // Generar sucursales automáticamente para nuevas empresas
  const generateBranches = (companyName, industry) => {
    const cities = [
      { name: 'Ciudad de México', position: [19.4326, -99.1332] },
      { name: 'Guadalajara', position: [20.6597, -103.3496] },
      { name: 'Monterrey', position: [25.6866, -100.3161] },
      { name: 'Puebla', position: [19.0414, -98.2063] },
      { name: 'Tijuana', position: [32.5027, -117.0037] },
      { name: 'León', position: [21.1619, -101.6827] },
      { name: 'Juárez', position: [31.7619, -106.4850] },
      { name: 'Mérida', position: [20.9754, -89.6173] }
    ];

    const branchTypes = {
      'Tecnología': ['Sede Central', 'Centro de Desarrollo', 'Oficina Regional', 'Centro de Innovación'],
      'Manufactura': ['Planta Principal', 'Almacén', 'Centro Logístico', 'Oficina Administrativa'],
      'Servicios Financieros': ['Torre Corporativa', 'Centro de Operaciones', 'Sucursal', 'Centro de Datos'],
      'Retail': ['Tienda Principal', 'Centro de Distribución', 'Almacén', 'Oficina Regional']
    };

    const types = branchTypes[industry] || branchTypes['Tecnología'];
    const numBranches = Math.floor(Math.random() * 3) + 2; // 2-4 sucursales
    const selectedCities = cities.sort(() => 0.5 - Math.random()).slice(0, numBranches);

    return selectedCities.map((city, index) => ({
      id: Date.now() + index,
      name: types[index % types.length],
      position: city.position,
      city: city.name,
      employees: Math.floor(Math.random() * 300) + 50,
      address: `Dirección ejemplo ${index + 1}, ${city.name}`,
      image: `${import.meta.env.BASE_URL}/image/companies/e1.png`
    }));
  };

  // Manejar CRUD de empresas
  const handleAddCompany = (companyData) => {
    // Convertir el archivo de imagen a URL si es necesario
    const processedCompanyData = { ...companyData };
    
    if (companyData.logo && typeof companyData.logo !== 'string') {
      // Si es un objeto File, convertir a URL
      processedCompanyData.logo = URL.createObjectURL(companyData.logo);
    }
    
    const newBranches = generateBranches(companyData.name, companyData.industry);
    const newCompany = {
      ...processedCompanyData,
      branches: newBranches
    };
    
    setCompanies(prev => [...prev, newCompany]);
    
    // Actualizar companiesData también
    companiesData[companyData.name] = {
      id: companyData.id,
      industry: companyData.industry,
      logo: processedCompanyData.logo,
      branches: newBranches
    };
  };

  const handleEditCompany = (companyData) => {
    // Convertir el archivo de imagen a URL si es necesario
    const processedCompanyData = { ...companyData };
    
    if (companyData.logo && typeof companyData.logo !== 'string') {
      // Si es un objeto File, convertir a URL
      processedCompanyData.logo = URL.createObjectURL(companyData.logo);
    }
    
    setCompanies(prev => prev.map(company => 
      company.id === companyData.id ? processedCompanyData : company
    ));
    
    // Actualizar companiesData también
    const oldName = companies.find(c => c.id === companyData.id)?.name;
    if (oldName && oldName !== companyData.name) {
      delete companiesData[oldName];
    }
    companiesData[companyData.name] = {
      id: companyData.id,
      industry: companyData.industry,
      logo: processedCompanyData.logo,
      branches: companyData.branches
    };
  };

  const handleDeleteCompany = (companyId) => {
    const companyToDelete = companies.find(c => c.id === companyId);
    if (companyToDelete) {
      setCompanies(prev => prev.filter(company => company.id !== companyId));
      delete companiesData[companyToDelete.name];
      
      // Si la empresa eliminada estaba seleccionada, limpiar selección
      if (selectedCompany === companyToDelete.name) {
        setSelectedCompany(null);
        setSelectedBranch(null);
      }
    }
  };

  // Manejar CRUD de sucursales
  const handleAddBranch = (branchData, isEdit = false) => {
    if (!selectedCompany) return;
    
    if (isEdit) {
      // Actualizar sucursal existente
      const branchIndex = companiesData[selectedCompany].branches.findIndex(b => b.id === branchData.id);
      if (branchIndex !== -1) {
        companiesData[selectedCompany].branches[branchIndex] = branchData;
      }
      
      // Actualizar en companies array
      setCompanies(prev => prev.map(company => 
        company.name === selectedCompany 
          ? { 
              ...company, 
              branches: company.branches.map(branch => 
                branch.id === branchData.id ? branchData : branch
              )
            }
          : company
      ));
    } else {
      // Agregar nueva sucursal
      const newBranch = {
        ...branchData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      // Actualizar en companiesData
      companiesData[selectedCompany].branches.push(newBranch);
      
      // Actualizar en companies array
      setCompanies(prev => prev.map(company => 
        company.name === selectedCompany 
          ? { ...company, branches: [...company.branches, newBranch] }
          : company
      ));
    }
    
    setShowAddBranchModal(false);
    setEditingBranch(null);
  };

  const handleEditBranch = (branchData) => {
    setEditingBranch(branchData);
    setShowAddBranchModal(true);
  };

  const handleDeleteBranch = (branchId) => {
    if (!selectedCompany) return;
    
    // Actualizar en companiesData
    companiesData[selectedCompany].branches = companiesData[selectedCompany].branches.filter(b => b.id !== branchId);
    
    // Actualizar en companies array
    setCompanies(prev => prev.map(company => 
      company.name === selectedCompany 
        ? { 
            ...company, 
            branches: company.branches.filter(branch => branch.id !== branchId)
          }
        : company
    ));
    
    // Si la sucursal eliminada estaba seleccionada, limpiar selección
    if (selectedBranch && selectedBranch.id === branchId) {
      setSelectedBranch(null);
    }
  };

  const handleCompanySelect = (companyName) => {
    const company = companiesData[companyName];
    setSelectedCompany(companyName);
    setSelectedBranch(null);
    
    if (company.branches.length > 0) {
      // Calcular el centro del mapa basado en las sucursales
      const avgLat = company.branches.reduce((sum, branch) => sum + branch.position[0], 0) / company.branches.length;
      const avgLng = company.branches.reduce((sum, branch) => sum + branch.position[1], 0) / company.branches.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(7);
    }
    
    onCompanySelect && onCompanySelect(company);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setMapCenter(branch.position);
    setMapZoom(12);
    
    // Generar datos específicos para esta sucursal
    const branchData = generateBranchData(branch, selectedCompany);
    onBranchSelect && onBranchSelect(branchData);
  };

  // Generar datos específicos para cada sucursal
  const generateBranchData = (branch, companyName) => {
    const baseData = {
      branchInfo: {
        name: branch.name,
        company: companyName,
        city: branch.city,
        employees: branch.employees,
        id: branch.id
      }
    };

    // Generar inventario específico basado en el tamaño de la sucursal
    const switchCount = Math.floor(branch.employees / 50) + 2;
    const patchCount = switchCount * 2;
    
    const inventory = [];
    let id = 1;

    // Generar switches
    for (let i = 1; i <= switchCount; i++) {
      inventory.push({
        id: id++,
        tipo: 'Switch',
        modelo: `Cisco 2960X-${i <= 2 ? '48TS' : '24PS'}`,
        ubicacion: `${branch.name}-Rack-0${i}`,
        estado: Math.random() > 0.1 ? 'Operativo' : 'Mantenimiento',
        puertos: i <= 2 ? 48 : 24,
        fechaInstalacion: `2024-0${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 28) + 1}`
      });
    }

    // Generar patch panels
    for (let i = 1; i <= patchCount; i++) {
      inventory.push({
        id: id++,
        tipo: 'Patch Panel',
        modelo: 'Panduit DP485E88TGY',
        ubicacion: `${branch.name}-Rack-0${Math.ceil(i / 2)}`,
        estado: 'Operativo',
        puertos: 48,
        fechaInstalacion: `2024-0${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 28) + 1}`
      });
    }

    // Generar conexiones de topología
    const connections = [];
    for (let i = 1; i < switchCount; i++) {
      connections.push({
        from: `${branch.name}-SW-01`,
        to: `${branch.name}-SW-0${i + 1}`,
        tipo: 'Fibra Optica',
        estado: Math.random() > 0.05 ? 'Activo' : 'Inactivo',
        ancho_banda: '10Gbps'
      });
    }

    // Generar alertas específicas
    const alertTypes = ['Warning', 'Info', 'Critical'];
    const alerts = [];
    const alertCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < alertCount; i++) {
      const tipo = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      alerts.push({
        id: i + 1,
        tipo,
        mensaje: `${tipo === 'Critical' ? 'CRÍTICO' : tipo === 'Warning' ? 'ADVERTENCIA' : 'INFO'}: ${branch.name} - ${getRandomAlertMessage()}`,
        timestamp: `2024-07-0${Math.floor(Math.random() * 2) + 1} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
        criticidad: tipo === 'Critical' ? 'Alta' : tipo === 'Warning' ? 'Media' : 'Baja'
      });
    }

    return {
      ...baseData,
      inventory,
      topologyConnections: connections,
      alertsData: alerts
    };
  };

  const getRandomAlertMessage = () => {
    const messages = [
      'Puerto desconectado en switch principal',
      'Temperatura elevada en rack',
      'Mantenimiento programado completado',
      'UPS funcionando con batería',
      'Actualización de firmware disponible',
      'Conectividad restaurada',
      'Backup completado exitosamente'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Manejar hover sobre marcadores
  const handleMarkerHover = (branch, position) => {
    setHoveredBranch(branch);
    setTooltipPosition(position);
  };

  const handleMarkerLeave = () => {
    setHoveredBranch(null);
  };

  const textos = {
    es: {
      title: "Seleccionar Empresa",
      subtitle: "Elige una empresa para ver sus sucursales",
      industryLabel: "Industria:",
      branchesLabel: "Sucursales:",
      employeesLabel: "empleados",
      selectBranchInfo: "Selecciona una sucursal en el mapa para ver su dashboard",
      noBranchSelected: "Ninguna sucursal seleccionada",
      selectedBranch: "Sucursal seleccionada:",
      selectedCompany: "Empresa seleccionada:",
      mapView: "Vista de Mapa",
      tableView: "Gestión de Sucursales",
      viewToggle: "Cambiar Vista",
      addCompany: "Añadir Empresa",
      addBranch: "Añadir Sucursal",
      branchesOf: "Sucursales de",
      selectCompanyFirst: "Selecciona una empresa primero",
      noCompanySelectedTitle: "No hay empresa seleccionada",
      noCompanySelectedDesc: "Por favor, selecciona una empresa de la lista para ver sus sucursales."
    },
    en: {
      title: "Select Company",
      subtitle: "Choose a company to view its branches",
      industryLabel: "Industry:",
      branchesLabel: "Branches:",
      employeesLabel: "employees",
      selectBranchInfo: "Select a branch on the map to view its dashboard",
      noBranchSelected: "No branch selected",
      selectedBranch: "Selected branch:",
      selectedCompany: "Selected company:",
      mapView: "Map View",
      tableView: "Branch Management",
      viewToggle: "Toggle View",
      addCompany: "Add Company",
      addBranch: "Add Branch",
      branchesOf: "Branches of",
      selectCompanyFirst: "Please select a company first",
      noCompanySelectedTitle: "No company selected",
      noCompanySelectedDesc: "Please select a company from the list to view its branches."
    }
  };

  const currentTextos = ingles ? textos.en : textos.es;

  return (
    <div className={styles.container}>
      {/* Panel lateral izquierdo - Colapsable en móvil */}
      <div className={`${styles.sidebar} ${sidebarExpanded ? styles.expanded : ''}`}>
        <div 
          className={styles.sidebarHeader}
          onClick={() => isMobile && setSidebarExpanded(!sidebarExpanded)}
        >
          <h2>{currentTextos.title}</h2>
          <p>{currentTextos.subtitle}</p>
        </div>
        
        <div className={styles.companiesList}>
          {companies.map((company) => (
            <div
              key={company.name}
              className={`${styles.companyCard} ${selectedCompany === company.name ? styles.selected : ''}`}
              onClick={() => handleCompanySelectMobile(company.name)}
            >
              <div className={styles.companyCardHeader}>
                <div className={styles.companyLogo}>
                  {company.logo ? (
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={styles.companyLogoPlaceholder} style={{ display: company.logo ? 'none' : 'flex' }}>
                    {company.industry === 'Tecnología' && '💻'}
                    {company.industry === 'Manufactura' && '🏭'}
                    {company.industry === 'Servicios Financieros' && '💰'}
                    {company.industry === 'Retail' && '🛍️'}
                  </div>
                </div>
                <div className={styles.companyInfo}>
                  <h3>{company.name}</h3>
                  <p className={styles.industryTag}>{company.industry}</p>
                </div>
              </div>
              <div className={styles.companyCardFooter}>
                <p><strong>{currentTextos.branchesLabel}</strong> {company.branches.length}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para añadir empresa - Solo visible en vista de tabla */}
        {viewMode === 'table' && (
          <div className={styles.addCompanySection}>
            <button 
              className={styles.addCompanyButton}
              onClick={() => setShowAddCompanyModal(true)}
            >
              <span className={styles.addIcon}>+</span>
              {currentTextos.addCompany}
            </button>
          </div>
        )}

        {/* Información de sucursal seleccionada - Solo en vista de mapa */}
        {viewMode === 'map' && (
          <div className={styles.branchInfo}>
            {selectedBranch ? (
              <div className={styles.selectedBranchInfo}>
                <h4>{currentTextos.selectedBranch}</h4>
                <div className={styles.branchDetails}>
                  <p><strong>{selectedBranch.name}</strong></p>
                  <p>{selectedBranch.city}</p>
                  <p>{selectedBranch.employees} {currentTextos.employeesLabel}</p>
                </div>
              </div>
            ) : (
              <div className={styles.noBranchSelected}>
                <p>{selectedCompany ? currentTextos.selectBranchInfo : currentTextos.noBranchSelected}</p>
              </div>
            )}
          </div>
        )}

        {/* Información de empresa seleccionada - Solo en vista de tabla */}
        {viewMode === 'table' && selectedCompany && (
          <div className={styles.companyInfo}>
            <h4>{currentTextos.selectedCompany}</h4>
            <div className={styles.companyDetails}>
              <p><strong>{selectedCompany}</strong></p>
              <p>{companiesData[selectedCompany].industry}</p>
              <p>{companiesData[selectedCompany].branches.length} {currentTextos.branchesLabel}</p>
              <button 
                className={styles.addBranchButton}
                onClick={() => setShowAddBranchModal(true)}
              >
                <span className={styles.addIcon}>+</span>
                {currentTextos.addBranch}
              </button>
            </div>
          </div>
        )}

        {/* Toggle de vista en la sidebar */}
        <div className={styles.sidebarFooter}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ {currentTextos.mapView}
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              📊 {currentTextos.tableView}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        {viewMode === 'table' ? (
          /* Vista de tabla */
          <div className={styles.tableView}>
            <div className={styles.tableHeader}>
              <h2>{selectedCompany ? `${currentTextos.branchesOf} ${selectedCompany}` : currentTextos.selectCompanyFirst}</h2>
            </div>
            
            <div className={styles.tableContent}>
              {selectedCompany ? (
                <BranchesTableSection
                  branches={companiesData[selectedCompany].branches}
                  companyName={selectedCompany}
                  onAddBranch={handleAddBranch}
                  onEditBranch={handleEditBranch}
                  onDeleteBranch={handleDeleteBranch}
                  onBranchSelect={handleBranchSelect}
                />
              ) : (
                <div className={styles.noCompanySelected}>
                  <div className={styles.noCompanyIcon}>🏢</div>
                  <h3>{currentTextos.noCompanySelectedTitle}</h3>
                  <p>{currentTextos.noCompanySelectedDesc}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Vista de mapa */
          <ClientOnlyMap 
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            selectedCompany={selectedCompany}
            handleMarkerHover={handleMarkerHover}
            handleMarkerLeave={handleMarkerLeave}
            handleBranchSelect={handleBranchSelect}
            mapRef={mapRef}
          />
        )}
        
        {/* Tooltip personalizado - Solo mostrar si el mapa está montado */}
        {hoveredBranch && (
          <CustomTooltip
            branch={hoveredBranch}
            show={!!hoveredBranch}
            position={tooltipPosition}
          />
        )}
      </div>

      {/* Modal para agregar/editar empresa */}
      <AddCompanyModal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        onSaveCompany={handleAddCompany}
        editingCompany={editingCompany}
        existingCompanies={companies}
      />

      {/* Modal para agregar/editar sucursal */}
      <AddBranchModal
        isOpen={showAddBranchModal}
        onClose={() => setShowAddBranchModal(false)}
        onSaveBranch={handleAddBranch}
        editingBranch={editingBranch}
        companyName={selectedCompany}
      />
    </div>
  );
};

export default CompanySelector;