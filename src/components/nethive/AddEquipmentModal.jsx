import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../data/variables';
import styles from './css/addEquipmentModal.module.css';

const AddEquipmentModal = ({ isOpen, onClose, onAddEquipment, inventoryData }) => {
  const ingles = useStore(isEnglish);
  const [newEquipment, setNewEquipment] = useState({
    tipo: '',
    modelo: '',
    ubicacion: '',
    estado: 'Operativo',
    puertos: '',
    capacidad: '',
    longitud: '',
    unidades: '',
    fechaInstalacion: new Date().toISOString().split('T')[0],
    imagen: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [preventClose, setPreventClose] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const resetForm = () => {
    setNewEquipment({
      tipo: '',
      modelo: '',
      ubicacion: '',
      estado: 'Operativo',
      puertos: '',
      capacidad: '',
      longitud: '',
      unidades: '',
      fechaInstalacion: new Date().toISOString().split('T')[0],
      imagen: null
    });
    setImagePreview(null);
  };

  const handleClose = () => {
    if (!preventClose) {
      // Verificar si hay datos en el formulario
      const hasData = Object.values(newEquipment).some(value => 
        value !== '' && value !== 'Operativo' && value !== new Date().toISOString().split('T')[0] && value !== null
      );
      
      if (hasData) {
        setShowConfirmation(true);
      } else {
        resetForm();
        onClose();
      }
    }
  };

  const confirmClose = () => {
    setShowConfirmation(false);
    resetForm();
    onClose();
  };

  const cancelClose = () => {
    setShowConfirmation(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !preventClose) {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEquipment(prev => ({ ...prev, imagen: file }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generar nuevo ID
    const newId = Math.max(...inventoryData.map(item => item.id)) + 1;
    
    // Determinar el campo de capacidad apropiado
    let capacityField = {};
    if (newEquipment.puertos) capacityField.puertos = newEquipment.puertos;
    else if (newEquipment.capacidad) capacityField.capacidad = newEquipment.capacidad;
    else if (newEquipment.longitud) capacityField.longitud = newEquipment.longitud;
    else if (newEquipment.unidades) capacityField.unidades = newEquipment.unidades;
    
    const equipmentToAdd = {
      id: newId,
      tipo: newEquipment.tipo,
      modelo: newEquipment.modelo,
      ubicacion: newEquipment.ubicacion,
      estado: newEquipment.estado,
      fechaInstalacion: newEquipment.fechaInstalacion,
      imagen: newEquipment.imagen,
      ...capacityField
    };

    onAddEquipment(equipmentToAdd);
    resetForm();
    onClose();
    
    // Mostrar mensaje de éxito (simulado)
    alert(ingles ? 'Equipment added successfully!' : '¡Equipo agregado exitosamente!');
  };

  const tiposEquipo = [
    'Switch', 'Router', 'Firewall', 'Patch Panel', 'UPS', 'Server Rack', 
    'PDU', 'Access Point', 'Cable Cat6A', 'Fibra Optica', 'Conversor Media', 'KVM Switch'
  ];

  const ubicaciones = [
    'MDF-Rack-01', 'MDF-Rack-02', 'IDF-01-Rack-01', 'IDF-02-Rack-01', 
    'IDF-03-Rack-01', 'MDF-IDF-01', 'MDF-IDF-02', 'MDF-IDF-03', 'Piso-02-Zona-A'
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Modal de confirmación */}
        {showConfirmation && (
          <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationModal}>
              <div className={styles.confirmationHeader}>
                <h4>{ingles ? 'Confirm Exit' : 'Confirmar Salida'}</h4>
              </div>
              <div className={styles.confirmationContent}>
                <p>{ingles ? 'Continue with iteration?' : '¿Desea continuar con la iteración?'}</p>
                <p className={styles.confirmationWarning}>
                  {ingles ? 'Unsaved data will be lost.' : 'Se perderán los datos no guardados.'}
                </p>
              </div>
              <div className={styles.confirmationActions}>
                <button
                  className={styles.confirmationCancel}
                  onClick={cancelClose}
                >
                  {ingles ? 'Cancel' : 'Cancelar'}
                </button>
                <button
                  className={styles.confirmationConfirm}
                  onClick={confirmClose}
                >
                  {ingles ? 'Continue' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.modalHeader}>
          <h3>{ingles ? 'Add New Equipment' : 'Agregar Nuevo Equipo'}</h3>
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
                {ingles ? 'Lock modal' : 'Bloquear modal'}
              </span>
            </label>
            <button className={styles.closeButton} onClick={handleClose}>×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.equipmentForm}>
          <div className={styles.formGrid}>
            {/* Columna izquierda */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label>{ingles ? 'Equipment Type' : 'Tipo de Equipo'} *</label>
                <select 
                  name="tipo" 
                  value={newEquipment.tipo} 
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">{ingles ? 'Select type...' : 'Seleccionar tipo...'}</option>
                  {tiposEquipo.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Model' : 'Modelo'} *</label>
                <input 
                  type="text" 
                  name="modelo" 
                  value={newEquipment.modelo}
                  onChange={handleInputChange}
                  placeholder={ingles ? 'e.g., Cisco 2960X-24PS' : 'ej. Cisco 2960X-24PS'}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Location' : 'Ubicación'} *</label>
                <select 
                  name="ubicacion" 
                  value={newEquipment.ubicacion} 
                  onChange={handleInputChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">{ingles ? 'Select location...' : 'Seleccionar ubicación...'}</option>
                  {ubicaciones.map(ubicacion => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Status' : 'Estado'}</label>
                <select 
                  name="estado" 
                  value={newEquipment.estado} 
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  <option value="Operativo">{ingles ? 'Operational' : 'Operativo'}</option>
                  <option value="Mantenimiento">{ingles ? 'Maintenance' : 'Mantenimiento'}</option>
                  <option value="Inactivo">{ingles ? 'Inactive' : 'Inactivo'}</option>
                </select>
              </div>
            </div>

            {/* Columna derecha */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label>{ingles ? 'Install Date' : 'Fecha de Instalación'}</label>
                <input 
                  type="date" 
                  name="fechaInstalacion" 
                  value={newEquipment.fechaInstalacion}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Ports' : 'Puertos'}</label>
                <input 
                  type="number" 
                  name="puertos" 
                  value={newEquipment.puertos}
                  onChange={handleInputChange}
                  placeholder={ingles ? 'Number of ports' : 'Número de puertos'}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Capacity' : 'Capacidad'}</label>
                <input 
                  type="text" 
                  name="capacidad" 
                  value={newEquipment.capacidad}
                  onChange={handleInputChange}
                  placeholder={ingles ? 'e.g., 3000VA, 300 users' : 'ej. 3000VA, 300 usuarios'}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label>{ingles ? 'Length/Units' : 'Longitud/Unidades'}</label>
                <input 
                  type="text" 
                  name="longitud" 
                  value={newEquipment.longitud}
                  onChange={handleInputChange}
                  placeholder={ingles ? 'e.g., 150m, 42U' : 'ej. 150m, 42U'}
                  className={styles.formInput}
                />
              </div>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className={styles.imageSection}>
            <label>{ingles ? 'Equipment Image' : 'Imagen del Equipo'}</label>
            <div className={styles.imageUpload}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className={styles.fileInput}
                id="equipmentImage"
              />
              <label htmlFor="equipmentImage" className={styles.fileLabel}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <span>📷</span>
                    <p>{ingles ? 'Click to upload image' : 'Click para subir imagen'}</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className={styles.formActions}>
            <button type="button" onClick={handleClose} className={styles.cancelButton}>
              {ingles ? 'Cancel' : 'Cancelar'}
            </button>
            <button type="submit" className={styles.saveButton}>
              {ingles ? 'Save Equipment' : 'Guardar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEquipmentModal;