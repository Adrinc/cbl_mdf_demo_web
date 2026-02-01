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

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => info.getValue(),
        size: 80,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('tipo', {
        header: ingles ? 'Type' : 'Tipo',
        cell: info => (
          <span className={styles.typeTag}>{info.getValue()}</span>
        ),
        filterFn: 'includesString',
        size: 120,
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
              
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>
                  <span className={styles.typeTag}>{item.tipo}</span>
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