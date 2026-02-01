import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import styles from './css/addBranchModal.module.css';

const AddBranchModal = ({ isOpen, onClose, onSaveBranch, editingBranch, companyName }) => {
  const ingles = useStore(isEnglish);
  const [branchData, setBranchData] = useState({
    id: '',
    name: '',
    city: '',
    address: '',
    employees: '',
    position: [19.4326, -99.1332], // Ciudad de México por defecto
    image: `${import.meta.env.BASE_URL}/image/companies/equipment.png`
  });
  const [preventClose, setPreventClose] = useState(false);
  const [errors, setErrors] = useState({});

  // Ciudades predefinidas con coordenadas
  const cityOptions = [
    { name: 'Ciudad de México', position: [19.4326, -99.1332] },
    { name: 'Guadalajara', position: [20.6597, -103.3496] },
    { name: 'Monterrey', position: [25.6866, -100.3161] },
    { name: 'Puebla', position: [19.0414, -98.2063] },
    { name: 'Tijuana', position: [32.5027, -117.0037] },
    { name: 'León', position: [21.1619, -101.6827] },
    { name: 'Ciudad Juárez', position: [31.7619, -106.4850] },
    { name: 'Mérida', position: [20.9754, -89.6173] },
    { name: 'Cancún', position: [21.1619, -86.8515] },
    { name: 'Acapulco', position: [16.8531, -99.8237] },
    { name: 'Toluca', position: [19.3629, -99.2506] },
    { name: 'Querétaro', position: [20.5888, -100.3899] }
  ];

  // Tipos de sucursal por industria
  const getBranchTypes = () => {
    const types = {
      'Tecnología': [
        'Sede Central', 'Centro de Desarrollo', 'Oficina Regional', 
        'Centro de Innovación', 'Laboratorio de I+D', 'Centro de Soporte'
      ],
      'Manufactura': [
        'Planta Principal', 'Almacén', 'Centro Logístico', 
        'Oficina Administrativa', 'Centro de Distribución', 'Taller'
      ],
      'Servicios Financieros': [
        'Torre Corporativa', 'Centro de Operaciones', 'Sucursal', 
        'Centro de Datos', 'Oficina Regional', 'Centro de Atención'
      ],
      'Retail': [
        'Tienda Principal', 'Centro de Distribución', 'Almacén', 
        'Oficina Regional', 'Showroom', 'Outlet'
      ],
      'Salud': [
        'Hospital Principal', 'Clínica', 'Centro de Especialidades',
        'Laboratorio', 'Centro de Rehabilitación', 'Farmacia'
      ],
      'Educación': [
        'Campus Principal', 'Centro de Extensión', 'Biblioteca',
        'Laboratorio', 'Centro de Investigación', 'Oficina Administrativa'
      ],
      'Telecomunicaciones': [
        'Centro de Operaciones', 'Torre de Transmisión', 'Centro de Datos',
        'Oficina Regional', 'Centro de Atención', 'Almacén Técnico'
      ],
      'Energía': [
        'Planta Generadora', 'Subestación', 'Centro de Control',
        'Oficina Regional', 'Centro de Mantenimiento', 'Almacén'
      ],
      'Transporte': [
        'Terminal Principal', 'Centro Logístico', 'Taller de Mantenimiento',
        'Oficina Regional', 'Almacén', 'Centro de Distribución'
      ]
    };
    return types['Tecnología']; // Por defecto, o podrías obtener la industria de la empresa
  };

  // Resetear form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      if (editingBranch) {
        setBranchData(editingBranch);
      } else {
        setBranchData({
          id: '',
          name: '',
          city: '',
          address: '',
          employees: '',
          position: [19.4326, -99.1332],
          image: `${import.meta.env.BASE_URL}/image/companies/equipment.png`
        });
      }
      setErrors({});
    }
  }, [isOpen, editingBranch]);

  const handleClose = () => {
    if (!preventClose) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setBranchData({
      id: '',
      name: '',
      city: '',
      address: '',
      employees: '',
      position: [19.4326, -99.1332],
      image: `${import.meta.env.BASE_URL}/image/companies/equipment.png`
    });
    setErrors({});
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !preventClose) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBranchData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;
    const selectedCity = cityOptions.find(city => city.name === selectedCityName);
    
    setBranchData(prev => ({
      ...prev,
      city: selectedCityName,
      position: selectedCity ? selectedCity.position : [19.4326, -99.1332]
    }));

    if (errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!branchData.name.trim()) {
      newErrors.name = ingles ? 'Branch name is required' : 'El nombre de la sucursal es requerido';
    } else if (branchData.name.length < 2) {
      newErrors.name = ingles ? 'Branch name must be at least 2 characters' : 'El nombre debe tener al menos 2 caracteres';
    }

    if (!branchData.city.trim()) {
      newErrors.city = ingles ? 'City is required' : 'La ciudad es requerida';
    }

    if (!branchData.address.trim()) {
      newErrors.address = ingles ? 'Address is required' : 'La dirección es requerida';
    } else if (branchData.address.length < 10) {
      newErrors.address = ingles ? 'Address must be at least 10 characters' : 'La dirección debe tener al menos 10 caracteres';
    }

    if (!branchData.employees || branchData.employees < 1) {
      newErrors.employees = ingles ? 'Number of employees must be at least 1' : 'El número de empleados debe ser al menos 1';
    } else if (branchData.employees > 2000) {
      newErrors.employees = ingles ? 'Number of employees cannot exceed 2000' : 'El número de empleados no puede exceder 2000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const isEdit = !!editingBranch;
    const finalBranchData = {
      ...branchData,
      id: editingBranch?.id || Date.now(),
      employees: parseInt(branchData.employees),
      updatedAt: new Date().toISOString(),
      createdAt: editingBranch?.createdAt || new Date().toISOString()
    };

    onSaveBranch(finalBranchData, isEdit);
    resetForm();
    onClose();
    
    // Mostrar mensaje de éxito
    const message = isEdit 
      ? (ingles ? 'Branch updated successfully!' : '¡Sucursal actualizada exitosamente!')
      : (ingles ? 'Branch added successfully!' : '¡Sucursal agregada exitosamente!');
    
    setTimeout(() => alert(message), 100);
  };

  const textos = {
    es: {
      addTitle: 'Agregar Nueva Sucursal',
      editTitle: 'Editar Sucursal',
      companyLabel: 'Empresa',
      branchInfo: 'Información de la Sucursal',
      branchName: 'Nombre de la Sucursal',
      city: 'Ciudad',
      selectCity: 'Seleccionar ciudad...',
      address: 'Dirección',
      employees: 'Número de Empleados',
      location: 'Ubicación',
      coordinates: 'Coordenadas',
      branchType: 'Tipo de Sucursal',
      selectType: 'Seleccionar tipo...',
      cancel: 'Cancelar',
      save: 'Guardar Sucursal',
      update: 'Actualizar Sucursal',
      lockModal: 'Bloquear modal',
      addressPlaceholder: 'Ej. Av. Reforma 123, Col. Centro, CP 06600',
      employeesRange: 'Entre 1 y 2000 empleados'
    },
    en: {
      addTitle: 'Add New Branch',
      editTitle: 'Edit Branch',
      companyLabel: 'Company',
      branchInfo: 'Branch Information',
      branchName: 'Branch Name',
      city: 'City',
      selectCity: 'Select city...',
      address: 'Address',
      employees: 'Number of Employees',
      location: 'Location',
      coordinates: 'Coordinates',
      branchType: 'Branch Type',
      selectType: 'Select type...',
      cancel: 'Cancel',
      save: 'Save Branch',
      update: 'Update Branch',
      lockModal: 'Lock modal',
      addressPlaceholder: 'e.g. Reforma Ave 123, Centro, ZIP 06600',
      employeesRange: 'Between 1 and 2000 employees'
    }
  };

  const currentTextos = ingles ? textos.en : textos.es;
  const isEdit = !!editingBranch;
  const branchTypes = getBranchTypes();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{isEdit ? currentTextos.editTitle : currentTextos.addTitle}</h3>
          <div className={styles.headerControls}>
            <label className={styles.lockToggle}>
              <input 
                type="checkbox" 
                checked={preventClose}
                onChange={(e) => setPreventClose(e.target.checked)}
              />
              <span className={styles.lockIcon}>
                {preventClose ? '🔒' : '🔓'}
              </span>
              <span className={styles.lockLabel}>
                {currentTextos.lockModal}
              </span>
            </label>
            <button 
              className={styles.closeButton} 
              onClick={handleClose}
              disabled={preventClose}
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.branchForm}>
          {/* Empresa actual */}
          <div className={styles.companyInfo}>
            <label>{currentTextos.companyLabel}:</label>
            <div className={styles.companyName}>
              <span>🏢</span>
              {companyName || 'Sin empresa seleccionada'}
            </div>
          </div>

          <div className={styles.formGrid}>
            {/* Columna izquierda - Información básica */}
            <div className={styles.formSection}>
              <h4>{currentTextos.branchInfo}</h4>
              
              <div className={styles.formGroup}>
                <label>
                  {currentTextos.branchName} *
                  {errors.name && <span className={styles.errorText}> - {errors.name}</span>}
                </label>
                <select 
                  name="name" 
                  value={branchData.name} 
                  onChange={handleInputChange}
                  required
                  className={`${styles.formSelect} ${errors.name ? styles.inputError : ''}`}
                >
                  <option value="">{currentTextos.selectType}</option>
                  {branchTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>
                  {currentTextos.city} *
                  {errors.city && <span className={styles.errorText}> - {errors.city}</span>}
                </label>
                <select 
                  name="city" 
                  value={branchData.city} 
                  onChange={handleCityChange}
                  required
                  className={`${styles.formSelect} ${errors.city ? styles.inputError : ''}`}
                >
                  <option value="">{currentTextos.selectCity}</option>
                  {cityOptions.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>
                  {currentTextos.employees} *
                  {errors.employees && <span className={styles.errorText}> - {errors.employees}</span>}
                </label>
                <input 
                  type="number" 
                  name="employees" 
                  value={branchData.employees}
                  onChange={handleInputChange}
                  placeholder="150"
                  min="1"
                  max="2000"
                  required
                  className={`${styles.formInput} ${errors.employees ? styles.inputError : ''}`}
                />
                <small className={styles.inputHint}>{currentTextos.employeesRange}</small>
              </div>
            </div>

            {/* Columna derecha - Ubicación */}
            <div className={styles.formSection}>
              <h4>{currentTextos.location}</h4>
              
              <div className={styles.formGroup}>
                <label>
                  {currentTextos.address} *
                  {errors.address && <span className={styles.errorText}> - {errors.address}</span>}
                </label>
                <textarea 
                  name="address" 
                  value={branchData.address}
                  onChange={handleInputChange}
                  placeholder={currentTextos.addressPlaceholder}
                  rows="3"
                  required
                  className={`${styles.formTextarea} ${errors.address ? styles.inputError : ''}`}
                />
              </div>

              {branchData.city && (
                <div className={styles.coordinatesInfo}>
                  <label>{currentTextos.coordinates}:</label>
                  <div className={styles.coordinates}>
                    <span>📍 Lat: {branchData.position[0].toFixed(4)}</span>
                    <span>Lng: {branchData.position[1].toFixed(4)}</span>
                  </div>
                </div>
              )}

              <div className={styles.mapPreview}>
                <div className={styles.mapPlaceholder}>
                  <span>🗺️</span>
                  <p>{branchData.city || (ingles ? 'Select a city to see location' : 'Selecciona una ciudad para ver la ubicación')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={handleClose} 
              className={styles.cancelButton}
              disabled={preventClose}
            >
              {currentTextos.cancel}
            </button>
            <button type="submit" className={styles.saveButton}>
              {isEdit ? currentTextos.update : currentTextos.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;