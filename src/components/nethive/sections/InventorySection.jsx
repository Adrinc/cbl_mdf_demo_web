import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../data/variables';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import AddEquipmentModal from '../AddEquipmentModal';
import styles from '../css/tableSection.module.css';

const InventorySection = ({ inventoryData, onAddEquipment }) => {
  const ingles = useStore(isEnglish);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  // Mapeo de tipos a colores e iconos
  const typeConfig = {
    'Switch': { icon: '🔀', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.2)' },
    'Patch Panel': { icon: '🔳', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.2)' },
    'Router': { icon: '🌐', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.2)' },
    'Firewall': { icon: '🛡️', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.2)' },
    'UPS': { icon: '🔋', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.2)' },
    'Cable Cat6A': { icon: '🔌', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.2)' },
    'Fibra Optica': { icon: '💡', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.2)' },
    'Server Rack': { icon: '🗄️', color: '#6366f1', bgColor: 'rgba(99, 102, 241, 0.2)' },
    'PDU': { icon: '⚡', color: '#eab308', bgColor: 'rgba(234, 179, 8, 0.2)' },
    'Conversor Media': { icon: '🔄', color: '#14b8a6', bgColor: 'rgba(20, 184, 166, 0.2)' },
    'Access Point': { icon: '📡', color: '#a855f7', bgColor: 'rgba(168, 85, 247, 0.2)' },
    'KVM Switch': { icon: '🖥️', color: '#64748b', bgColor: 'rgba(100, 116, 139, 0.2)' },
  };

  // Mapeo de tipos a imágenes
  const getImageForType = (tipo) => {
    const imageMap = {
      'Switch': 'switch_default.png',
      'Patch Panel': 'patch_default.jpg',
      'Router': 'switch_default.png',
      'Firewall': 'switch_default.png',
      'UPS': 'ups_default.jpg',
      'Cable Cat6A': 'cable_fibra_optica_default.jpg',
      'Fibra Optica': 'cable_fibra_optica_default.jpg',
      'Server Rack': 'rack_default.jpg',
      'PDU': 'rack_default.jpg',
      'Conversor Media': 'idf_default.jpg',
      'Access Point': 'idf_default.jpg',
      'KVM Switch': 'rack.jpg',
    };
    return `${import.meta.env.BASE_URL}/image/inventarioMDF/${imageMap[tipo] || 'rack_default.jpg'}`;
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        size: 60,
        enableColumnFilter: false,
      }),
      columnHelper.display({
        id: 'image',
        header: ingles ? 'Image' : 'Imagen',
        cell: ({ row }) => (
          <div className={styles.imageCell}>
            <img 
              src={getImageForType(row.original.tipo)} 
              alt={row.original.tipo}
              className={styles.equipmentImage}
              onError={(e) => {
                e.target.src = `${import.meta.env.BASE_URL}/image/inventarioMDF/rack_default.jpg`;
              }}
            />
          </div>
        ),
        size: 80,
        enableSorting: false,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('tipo', {
        header: ingles ? 'Type' : 'Tipo',
        cell: info => {
          const tipo = info.getValue();
          const config = typeConfig[tipo] || { icon: '📦', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' };
          return (
            <span 
              className={styles.typeTag}
              style={{ 
                background: config.bgColor, 
                color: config.color,
                border: `1px solid ${config.color}40`
              }}
            >
              <span className={styles.typeIcon}>{config.icon}</span>
              {tipo}
            </span>
          );
        },
        filterFn: 'includesString',
        size: 150,
      }),
      columnHelper.accessor('modelo', {
        header: ingles ? 'Model' : 'Modelo',
        cell: info => info.getValue(),
        filterFn: 'includesString',
        size: 180,
      }),
      columnHelper.accessor('ubicacion', {
        header: ingles ? 'Location' : 'Ubicación',
        cell: info => info.getValue(),
        filterFn: 'includesString',
        size: 140,
      }),
      columnHelper.accessor('estado', {
        header: ingles ? 'Status' : 'Estado',
        cell: info => (
          <span className={`${styles.statusBadge} ${styles.operativo}`}>
            {info.getValue()}
          </span>
        ),
        filterFn: 'equals',
        size: 120,
      }),
      columnHelper.accessor(row => 
        row.puertos || row.longitud || row.capacidad || row.unidades, {
        id: 'capacity',
        header: ingles ? 'Ports/Capacity' : 'Puertos/Capacidad',
        cell: info => info.getValue(),
        enableColumnFilter: false,
        size: 150,
      }),
      columnHelper.accessor('fechaInstalacion', {
        header: ingles ? 'Install Date' : 'Fecha Instalación',
        cell: info => info.getValue(),
        enableColumnFilter: false,
        size: 130,
      }),
      columnHelper.display({
        id: 'actions',
        header: ingles ? 'Actions' : 'Acciones',
        cell: () => (
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn} title={ingles ? 'Edit' : 'Editar'}>📝</button>
            <button className={styles.actionBtn} title={ingles ? 'View' : 'Ver'}>🔍</button>
            <button className={styles.actionBtn} title={ingles ? 'Delete' : 'Eliminar'}>🗑️</button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 120,
      }),
    ],
    [ingles, columnHelper]
  );

  const table = useReactTable({
    data: inventoryData,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleAddEquipment = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <h3>{ingles ? 'Infrastructure Inventory' : 'Inventario de Infraestructura'}</h3>
        <div className={styles.headerControls}>
          {/* Filtro global */}
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={ingles ? 'Search all columns...' : 'Buscar en todas las columnas...'}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={handleAddEquipment}>
            + {ingles ? 'Add Equipment' : 'Agregar Equipo'}
          </button>
        </div>
      </div>
      
      {/* Vista de tabla para desktop y tablet */}
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      <div className={styles.headerContent}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={header.column.getCanSort() ? styles.sortableHeader : ''}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <span className={styles.sortIcon}>
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted()] ?? 
                              (header.column.getCanSort() ? ' ↕️' : null)}
                            </span>
                          </div>
                        )}
                        {/* Filtro por columna */}
                        {header.column.getCanFilter() && (
                          <div className={styles.columnFilter}>
                            <input
                              type="text"
                              value={header.column.getFilterValue() ?? ''}
                              onChange={e => header.column.setFilterValue(e.target.value)}
                              placeholder={`${ingles ? 'Filter' : 'Filtrar'}...`}
                              className={styles.columnFilterInput}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={styles.tableRow}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de tarjetas para móviles */}
      <div className={styles.cardsContainer}>
        {table.getRowModel().rows.map((row) => {
          const item = row.original;
          const config = typeConfig[item.tipo] || { icon: '📦', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.2)' };
          return (
            <div key={item.id} className={styles.inventoryCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardId}>#{item.id}</div>
                <div className={styles.cardActions}>
                  <button className={styles.cardActionBtn} title={ingles ? 'Edit' : 'Editar'}>📝</button>
                  <button className={styles.cardActionBtn} title={ingles ? 'View' : 'Ver'}>🔍</button>
                  <button className={styles.cardActionBtn} title={ingles ? 'Delete' : 'Eliminar'}>🗑️</button>
                </div>
              </div>
              
              <div className={styles.cardImageSection}>
                <img 
                  src={getImageForType(item.tipo)} 
                  alt={item.tipo}
                  className={styles.cardEquipmentImage}
                  onError={(e) => {
                    e.target.src = `${import.meta.env.BASE_URL}/image/inventarioMDF/rack_default.jpg`;
                  }}
                />
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>
                  <span 
                    className={styles.typeTag}
                    style={{ 
                      background: config.bgColor, 
                      color: config.color,
                      border: `1px solid ${config.color}40`
                    }}
                  >
                    <span className={styles.typeIcon}>{config.icon}</span>
                    {item.tipo}
                  </span>
                  <span className={`${styles.statusBadge} ${styles.operativo}`}>
                    {item.estado}
                  </span>
                </div>
                
                <div className={styles.cardInfo}>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Model' : 'Modelo'}:</span>
                    <span className={styles.cardValue}>{item.modelo}</span>
                  </div>
                  
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Location' : 'Ubicación'}:</span>
                    <span className={styles.cardValue}>{item.ubicacion}</span>
                  </div>
                  
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Capacity' : 'Capacidad'}:</span>
                    <span className={styles.cardValue}>{item.puertos || item.longitud || item.capacidad || item.unidades}</span>
                  </div>
                  
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Install Date' : 'Fecha Instalación'}:</span>
                    <span className={styles.cardValue}>{item.fechaInstalacion}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Paginación mejorada con TanStack Table */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          {table.getFilteredRowModel().rows.length > 0 ? (
            ingles 
              ? `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of ${table.getFilteredRowModel().rows.length} entries`
              : `Mostrando ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de ${table.getFilteredRowModel().rows.length} entradas`
          ) : (
            ingles ? 'No entries found' : 'No se encontraron entradas'
          )}
        </div>
        <div className={styles.paginationControls}>
          <button
            className={`${styles.paginationBtn} ${styles.navBtn} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹ {ingles ? 'Previous' : 'Anterior'}
          </button>
          
          {/* Botones de página mejorados */}
          {Array.from({ length: table.getPageCount() }, (_, i) => i).map(page => (
            <button
              key={page}
              className={`${styles.paginationBtn} ${table.getState().pagination.pageIndex === page ? styles.active : ''}`}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </button>
          ))}
          
          <button
            className={`${styles.paginationBtn} ${styles.navBtn} ${!table.getCanNextPage() ? styles.disabled : ''}`}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {ingles ? 'Next' : 'Siguiente'} ›
          </button>
        </div>
      </div>

      {/* Modal para agregar equipo */}
      <AddEquipmentModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onAddEquipment={onAddEquipment}
        inventoryData={inventoryData}
      />
    </div>
  );
};

export default InventorySection;