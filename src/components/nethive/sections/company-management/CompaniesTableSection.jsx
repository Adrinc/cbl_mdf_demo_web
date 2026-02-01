import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { isEnglish } from '../../../../data/variables';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import AddCompanyModal from './AddCompanyModal';
import styles from './css/companyTable.module.css';

const CompaniesTableSection = ({ companies, onSaveCompany, onDeleteCompany }) => {
  const ingles = useStore(isEnglish);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => (
          <span className={styles.idCell}>#{info.getValue()}</span>
        ),
        size: 100,
        enableColumnFilter: false,
      }),
      columnHelper.accessor('logo', {
        header: ingles ? 'Logo' : 'Logo',
        cell: info => {
          const logoValue = info.getValue();
          let logoSrc = '';
          
          if (logoValue) {
            if (typeof logoValue === 'string') {
              logoSrc = logoValue;
            } else if (logoValue instanceof File) {
              logoSrc = URL.createObjectURL(logoValue);
            }
          }
          
          return (
            <div className={styles.logoCell}>
              {logoSrc ? (
                <img 
                  src={logoSrc} 
                  alt="Company logo" 
                  className={styles.companyLogo}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.logoPlaceholder} style={{ display: logoSrc ? 'none' : 'flex' }}>
                <span>🏢</span>
              </div>
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: ingles ? 'Company Name' : 'Nombre de la Empresa',
        cell: info => (
          <div className={styles.nameCell}>
            <span className={styles.companyName}>{info.getValue()}</span>
          </div>
        ),
        filterFn: 'includesString',
        size: 200,
      }),
      columnHelper.accessor('industry', {
        header: ingles ? 'Industry' : 'Industria',
        cell: info => (
          <span className={styles.industryTag}>{info.getValue()}</span>
        ),
        filterFn: 'includesString',
        size: 150,
      }),
      columnHelper.accessor('branches', {
        header: ingles ? 'Branches' : 'Sucursales',
        cell: info => {
          const branches = info.getValue() || [];
          return (
            <span className={styles.branchesCount}>
              {branches.length} {ingles ? 'branches' : 'sucursales'}
            </span>
          );
        },
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor('createdAt', {
        header: ingles ? 'Created' : 'Creado',
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString(ingles ? 'en-US' : 'es-ES');
        },
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.display({
        id: 'actions',
        header: ingles ? 'Actions' : 'Acciones',
        cell: ({ row }) => (
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.actionBtn} ${styles.editBtn}`} 
              title={ingles ? 'Edit Company' : 'Editar Empresa'}
              onClick={() => handleEdit(row.original)}
            >
              ✏️
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.viewBtn}`} 
              title={ingles ? 'View Details' : 'Ver Detalles'}
              onClick={() => handleView(row.original)}
            >
              👁️
            </button>
            <button 
              className={`${styles.actionBtn} ${styles.deleteBtn}`} 
              title={ingles ? 'Delete Company' : 'Eliminar Empresa'}
              onClick={() => handleDelete(row.original)}
            >
              🗑️
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 140,
      }),
    ],
    [ingles, columnHelper]
  );

  const table = useReactTable({
    data: companies,
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

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowAddModal(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowAddModal(true);
  };

  const handleView = (company) => {
    // En una aplicación real, esto abriría un modal de vista detallada
    alert(`${ingles ? 'Viewing details for' : 'Viendo detalles de'}: ${company.name}`);
  };

  const handleDelete = (company) => {
    setShowDeleteConfirm(company);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      onDeleteCompany(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      
      const message = ingles 
        ? `Company "${showDeleteConfirm.name}" deleted successfully!`
        : `¡Empresa "${showDeleteConfirm.name}" eliminada exitosamente!`;
      
      setTimeout(() => alert(message), 100);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCompany(null);
  };

  const textos = {
    es: {
      title: 'Gestión de Empresas',
      searchPlaceholder: 'Buscar empresas...',
      addCompany: 'Agregar Empresa',
      showingText: 'Mostrando',
      toText: 'a',
      ofText: 'de',
      entriesText: 'entradas',
      noEntriesText: 'No se encontraron empresas',
      previousText: 'Anterior',
      nextText: 'Siguiente',
      filterText: 'Filtrar',
      deleteConfirmTitle: 'Confirmar Eliminación',
      deleteConfirmText: '¿Estás seguro de que deseas eliminar esta empresa?',
      deleteConfirmSubtext: 'Esta acción no se puede deshacer.',
      cancelText: 'Cancelar',
      deleteText: 'Eliminar'
    },
    en: {
      title: 'Company Management',
      searchPlaceholder: 'Search companies...',
      addCompany: 'Add Company',
      showingText: 'Showing',
      toText: 'to',
      ofText: 'of',
      entriesText: 'entries',
      noEntriesText: 'No companies found',
      previousText: 'Previous',
      nextText: 'Next',
      filterText: 'Filter',
      deleteConfirmTitle: 'Confirm Deletion',
      deleteConfirmText: 'Are you sure you want to delete this company?',
      deleteConfirmSubtext: 'This action cannot be undone.',
      cancelText: 'Cancel',
      deleteText: 'Delete'
    }
  };

  const currentTextos = ingles ? textos.en : textos.es;

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleSection}>
          <h3>{currentTextos.title}</h3>
          <div className={styles.statsInfo}>
            <span className={styles.totalCount}>
              {companies.length} {ingles ? 'companies' : 'empresas'}
            </span>
          </div>
        </div>
        <div className={styles.headerControls}>
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={currentTextos.searchPlaceholder}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={handleAddCompany}>
            <span className={styles.addIcon}>+</span>
            {currentTextos.addCompany}
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
                              placeholder={`${currentTextos.filterText}...`}
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
          const company = row.original;
          return (
            <div key={company.id} className={styles.companyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.companyInfo}>
                  <div className={styles.logoCell}>
                    {company.logo ? (
                      <img 
                        src={typeof company.logo === 'string' ? company.logo : URL.createObjectURL(company.logo)} 
                        alt="Company logo" 
                        className={styles.companyLogo}
                      />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        <span>🏢</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.companyDetails}>
                    <h4 className={styles.companyName}>{company.name}</h4>
                    <span className={styles.industryTag}>{company.industry}</span>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button 
                    className={`${styles.cardActionBtn} ${styles.editBtn}`} 
                    title={ingles ? 'Edit' : 'Editar'}
                    onClick={() => handleEdit(company)}
                  >
                    ✏️
                  </button>
                  <button 
                    className={`${styles.cardActionBtn} ${styles.viewBtn}`} 
                    title={ingles ? 'View' : 'Ver'}
                    onClick={() => handleView(company)}
                  >
                    👁️
                  </button>
                  <button 
                    className={`${styles.cardActionBtn} ${styles.deleteBtn}`} 
                    title={ingles ? 'Delete' : 'Eliminar'}
                    onClick={() => handleDelete(company)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardField}>
                  <span className={styles.cardLabel}>{ingles ? 'ID' : 'ID'}:</span>
                  <span className={styles.cardValue}>#{company.id}</span>
                </div>
                
                <div className={styles.cardField}>
                  <span className={styles.cardLabel}>{ingles ? 'Branches' : 'Sucursales'}:</span>
                  <span className={styles.cardValue}>
                    {(company.branches || []).length} {ingles ? 'branches' : 'sucursales'}
                  </span>
                </div>
                
                <div className={styles.cardField}>
                  <span className={styles.cardLabel}>{ingles ? 'Created' : 'Creado'}:</span>
                  <span className={styles.cardValue}>
                    {new Date(company.createdAt).toLocaleDateString(ingles ? 'en-US' : 'es-ES')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Paginación */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          {table.getFilteredRowModel().rows.length > 0 ? (
            `${currentTextos.showingText} ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} ${currentTextos.toText} ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} ${currentTextos.ofText} ${table.getFilteredRowModel().rows.length} ${currentTextos.entriesText}`
          ) : (
            currentTextos.noEntriesText
          )}
        </div>
        <div className={styles.paginationControls}>
          <button
            className={`${styles.paginationBtn} ${styles.navBtn} ${!table.getCanPreviousPage() ? styles.disabled : ''}`}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹ {currentTextos.previousText}
          </button>
          
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
            {currentTextos.nextText} ›
          </button>
        </div>
      </div>

      {/* Modal para agregar/editar empresa */}
      <AddCompanyModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSaveCompany={onSaveCompany}
        editingCompany={editingCompany}
        existingCompanies={companies}
      />

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className={styles.confirmOverlay} onClick={() => setShowDeleteConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmHeader}>
              <h4>{currentTextos.deleteConfirmTitle}</h4>
            </div>
            <div className={styles.confirmContent}>
              <p>{currentTextos.deleteConfirmText}</p>
              <p className={styles.companyNameToDelete}>"{showDeleteConfirm.name}"</p>
              <p className={styles.confirmSubtext}>{currentTextos.deleteConfirmSubtext}</p>
            </div>
            <div className={styles.confirmActions}>
              <button 
                className={styles.confirmCancelBtn}
                onClick={() => setShowDeleteConfirm(null)}
              >
                {currentTextos.cancelText}
              </button>
              <button 
                className={styles.confirmDeleteBtn}
                onClick={confirmDelete}
              >
                {currentTextos.deleteText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesTableSection;