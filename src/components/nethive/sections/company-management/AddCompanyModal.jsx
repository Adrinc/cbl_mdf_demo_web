import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import styles from './css/addCompanyModal.module.css';

const AddCompanyModal = ({ isOpen, onClose, onSaveCompany, editingCompany, existingCompanies }) => {
  const ingles = useStore(isEnglish);
  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    industry: '',
    logo: null,
    branches: []
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [preventClose, setPreventClose] = useState(false);
  const [errors, setErrors] = useState({});

  const industryOptions = [
    { value: 'Tecnología', label: ingles ? 'Technology' : 'Tecnología' },
    { value: 'Manufactura', label: ingles ? 'Manufacturing' : 'Manufactura' },
    { value: 'Servicios Financieros', label: ingles ? 'Financial Services' : 'Servicios Financieros' },
    { value: 'Retail', label: ingles ? 'Retail' : 'Retail' },
    { value: 'Salud', label: ingles ? 'Healthcare' : 'Salud' },
    { value: 'Educación', label: ingles ? 'Education' : 'Educación' },
    { value: 'Telecomunicaciones', label: ingles ? 'Telecommunications' : 'Telecomunicaciones' },
    { value: 'Energía', label: ingles ? 'Energy' : 'Energía' },
    { value: 'Transporte', label: ingles ? 'Transportation' : 'Transporte' },
    { value: 'Otros', label: ingles ? 'Others' : 'Otros' }
  ];

  // Resetear form cuando se abre/cierra el modal o cambia el modo de edición
  useEffect(() => {
    if (isOpen) {
      if (editingCompany) {
        setCompanyData({
          id: editingCompany.id,
          name: editingCompany.name,
          industry: editingCompany.industry,
          logo: editingCompany.logo,
          branches: editingCompany.branches || []
        });
        setLogoPreview(editingCompany.logo);
      } else {
        setCompanyData({
          id: generateNewId(),
          name: '',
          industry: '',
          logo: null,
          branches: []
        });
        setLogoPreview(null);
      }
      setErrors({});
    }
  }, [isOpen, editingCompany]);

  const generateNewId = () => {
    const existingIds = existingCompanies.map(c => c.id);
    let newId = 'company_' + Date.now();
    while (existingIds.includes(newId)) {
      newId = 'company_' + (Date.now() + Math.random());
    }
    return newId;
  };

  const handleClose = () => {
    if (!preventClose) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setCompanyData({
      id: '',
      name: '',
      industry: '',
      logo: null,
      branches: []
    });
    setLogoPreview(null);
    setErrors({});
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !preventClose) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ 
          ...prev, 
          logo: ingles ? 'Please select a valid image file' : 'Por favor selecciona un archivo de imagen válido' 
        }));
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          logo: ingles ? 'Image size must be less than 5MB' : 'El tamaño de la imagen debe ser menor a 5MB' 
        }));
        return;
      }

      setCompanyData(prev => ({ ...prev, logo: file }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error de logo si había uno
      if (errors.logo) {
        setErrors(prev => ({ ...prev, logo: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!companyData.name.trim()) {
      newErrors.name = ingles ? 'Company name is required' : 'El nombre de la empresa es requerido';
    } else if (companyData.name.length < 2) {
      newErrors.name = ingles ? 'Company name must be at least 2 characters' : 'El nombre debe tener al menos 2 caracteres';
    } else {
      // Verificar si el nombre ya existe (solo si no estamos editando la misma empresa)
      const existingCompany = existingCompanies.find(c => 
        c.name.toLowerCase() === companyData.name.toLowerCase() && c.id !== companyData.id
      );
      if (existingCompany) {
        newErrors.name = ingles ? 'A company with this name already exists' : 'Ya existe una empresa con este nombre';
      }
    }

    if (!companyData.industry) {
      newErrors.industry = ingles ? 'Industry is required' : 'La industria es requerida';
    }

    if (!companyData.logo && !editingCompany) {
      newErrors.logo = ingles ? 'Company logo is required' : 'El logo de la empresa es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const isEdit = !!editingCompany;
    const finalCompanyData = {
      ...companyData,
      updatedAt: new Date().toISOString(),
      createdAt: editingCompany?.createdAt || new Date().toISOString()
    };

    onSaveCompany(finalCompanyData, isEdit);
    resetForm();
    onClose();
    
    // Mostrar mensaje de éxito
    const message = isEdit 
      ? (ingles ? 'Company updated successfully!' : '¡Empresa actualizada exitosamente!')
      : (ingles ? 'Company added successfully!' : '¡Empresa agregada exitosamente!');
    
    // En una aplicación real, usarías un sistema de notificaciones más sofisticado
    setTimeout(() => alert(message), 100);
  };

  const textos = {
    es: {
      addTitle: 'Agregar Nueva Empresa',
      editTitle: 'Editar Empresa',
      companyInfo: 'Información de la Empresa',
      companyName: 'Nombre de la Empresa',
      industry: 'Industria',
      selectIndustry: 'Seleccionar industria...',
      companyLogo: 'Logo de la Empresa',
      logoUploadText: 'Haz clic para subir logo',
      logoUploadHint: 'PNG, JPG, GIF hasta 5MB',
      companyDetails: 'Detalles de la Empresa',
      totalBranches: 'Total de Sucursales',
      estimatedEmployees: 'Empleados Estimados',
      marketPresence: 'Presencia en el Mercado',
      digitalReadiness: 'Preparación Digital',
      cancel: 'Cancelar',
      save: 'Guardar Empresa',
      update: 'Actualizar Empresa',
      lockModal: 'Bloquear modal',
      required: 'Requerido'
    },
    en: {
      addTitle: 'Add New Company',
      editTitle: 'Edit Company',
      companyInfo: 'Company Information',
      companyName: 'Company Name',
      industry: 'Industry',
      selectIndustry: 'Select industry...',
      companyLogo: 'Company Logo',
      logoUploadText: 'Click to upload logo',
      logoUploadHint: 'PNG, JPG, GIF up to 5MB',
      companyDetails: 'Company Details',
      totalBranches: 'Total Branches',
      estimatedEmployees: 'Estimated Employees',
      marketPresence: 'Market Presence',
      digitalReadiness: 'Digital Readiness',
      cancel: 'Cancel',
      save: 'Save Company',
      update: 'Update Company',
      lockModal: 'Lock modal',
      required: 'Required'
    }
  };

  const currentTextos = ingles ? textos.en : textos.es;
  const isEdit = !!editingCompany;

  // Calcular estadísticas basadas en la industria seleccionada
  const getIndustryStats = (industry) => {
    const stats = {
      'Tecnología': { branches: '3-8', employees: '150-500', market: 'Nacional', digital: '95%' },
      'Manufactura': { branches: '2-6', employees: '200-800', market: 'Internacional', digital: '78%' },
      'Servicios Financieros': { branches: '5-12', employees: '100-600', market: 'Nacional', digital: '92%' },
      'Retail': { branches: '8-20', employees: '300-1200', market: 'Regional', digital: '85%' },
      'Salud': { branches: '2-5', employees: '80-300', market: 'Regional', digital: '72%' },
      'Educación': { branches: '1-4', employees: '50-250', market: 'Local', digital: '68%' },
      'Telecomunicaciones': { branches: '4-10', employees: '200-700', market: 'Nacional', digital: '98%' },
      'Energía': { branches: '3-8', employees: '150-600', market: 'Nacional', digital: '82%' },
      'Transporte': { branches: '5-15', employees: '100-500', market: 'Regional', digital: '75%' },
      'Otros': { branches: '2-6', employees: '50-300', market: 'Variable', digital: '70%' }
    };
    return stats[industry] || stats['Otros'];
  };

  const industryStats = companyData.industry ? getIndustryStats(companyData.industry) : null;

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

        <form onSubmit={handleSubmit} className={styles.companyForm}>
          <div className={styles.formGrid}>
            {/* Columna izquierda - Información básica */}
            <div className={styles.formSection}>
              <h4>{currentTextos.companyInfo}</h4>
              
              <div className={styles.formGroup}>
                <label>
                  {currentTextos.companyName} *
                  {errors.name && <span className={styles.errorText}> - {errors.name}</span>}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={companyData.name}
                  onChange={handleInputChange}
                  placeholder={ingles ? 'e.g., TechCorp Solutions' : 'ej. TechCorp Solutions'}
                  required
                  className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  {currentTextos.industry} *
                  {errors.industry && <span className={styles.errorText}> - {errors.industry}</span>}
                </label>
                <select 
                  name="industry" 
                  value={companyData.industry} 
                  onChange={handleInputChange}
                  required
                  className={`${styles.formSelect} ${errors.industry ? styles.inputError : ''}`}
                >
                  <option value="">{currentTextos.selectIndustry}</option>
                  {industryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna derecha - Logo */}
            <div className={styles.formSection}>
              <h4>{currentTextos.companyLogo}</h4>
              
              <div className={styles.logoUpload}>
                {errors.logo && <p className={styles.errorText}>{errors.logo}</p>}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className={styles.fileInput}
                  id="companyLogo"
                />
                <label htmlFor="companyLogo" className={styles.fileLabel}>
                  {logoPreview ? (
                    <div className={styles.logoPreviewContainer}>
                      <img src={logoPreview} alt="Logo preview" className={styles.logoPreview} />
                      <div className={styles.logoOverlay}>
                        <span>{ingles ? 'Change Logo' : 'Cambiar Logo'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <span>🏢</span>
                      <p>{currentTextos.logoUploadText}</p>
                      <small>{currentTextos.logoUploadHint}</small>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Detalles de la empresa (solo si hay industria seleccionada) */}
          {industryStats && (
            <div className={styles.formSection}>
              <h4>{currentTextos.companyDetails}</h4>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>🏢</span>
                  <div>
                    <strong>{currentTextos.totalBranches}</strong>
                    <p>{industryStats.branches}</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>👥</span>
                  <div>
                    <strong>{currentTextos.estimatedEmployees}</strong>
                    <p>{industryStats.employees}</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>🌍</span>
                  <div>
                    <strong>{currentTextos.marketPresence}</strong>
                    <p>{industryStats.market}</p>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>💻</span>
                  <div>
                    <strong>{currentTextos.digitalReadiness}</strong>
                    <p>{industryStats.digital}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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

export default AddCompanyModal;