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

const CompanyTableSection = ({ companies, onAddCompany, onEditCompany, onDeleteCompany }) => {
  const ingles = useStore(isEnglish);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('logo', {
        header: '',
        cell: info => (
          <div className={styles.logoCell}>
            <img 
              src={info.getValue()} 
              alt={`${info.row.original.name} logo`}
              className={styles.companyLogo}
              onError={(e) => {
                e.target.src = `${import.meta.env.BASE_URL}/image/companies/equipment.png`;
              }}
            />
          </div>
        ),
        size: 60,
        enableColumnFilter: false,
        enableSorting: false,
      }),
      columnHelper.accessor('name', {
        header: ingles ? 'Company Name' : 'Nombre de Empresa',
        cell: info => (
          <div className={styles.companyNameCell}>
            <span className={styles.companyName}>{info.getValue()}</span>
            <span className={styles.companyId}>ID: {info.row.original.id}</span>
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
      columnHelper.accessor(row => row.branches?.length || 0, {
        id: 'branchCount',
        header: ingles ? 'Branches' : 'Sucursales',
        cell: info => (
          <div className={styles.branchCount}>
            <span className={styles.count}>{info.getValue()}</span>
            <span className={styles.countLabel}>
              {ingles ? 'branches' : 'sucursales'}
            </span>
          </div>
        ),
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor('createdAt', {
        header: ingles ? 'Created' : 'Creada',
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString(ingles ? 'en-US' : 'es-MX');
        },
        enableColumnFilter: false,
        size: 120,
      }),
      columnHelper.accessor('updatedAt', {
        header: ingles ? 'Last Modified' : 'Última Modificación',
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString(ingles ? 'en-US' : 'es-MX');
        },
        enableColumnFilter: false,
        size: 150,
      }),
      columnHelper.display({
        id: 'actions',
        header: ingles ? 'Actions' : 'Acciones',
        cell: ({ row }) => (
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionBtn} 
              title={ingles ? 'Edit' : 'Editar'}
              onClick={() => handleEdit(row.original)}
            >
              ✏️
            </button>
            <button 
              className={styles.actionBtn} 
              title={ingles ? 'View Branches' : 'Ver Sucursales'}
              onClick={() => handleViewBranches(row.original)}
            >
              🏢
            </button>
            <button 
              className={styles.actionBtn} 
              title={ingles ? 'Delete' : 'Eliminar'}
              onClick={() => handleDelete(row.original)}
            >
              🗑️
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 150,
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
        pageSize: 8,
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

  const handleViewBranches = (company) => {
    // Esta función se puede usar para mostrar un modal con las sucursales
    alert(`${company.name} tiene ${company.branches?.length || 0} sucursales`);
  };

  const handleDelete = (company) => {
    if (window.confirm(
      ingles 
        ? `Are you sure you want to delete ${company.name}? This action cannot be undone.`
        : `¿Estás seguro de que quieres eliminar ${company.name}? Esta acción no se puede deshacer.`
    )) {
      onDeleteCompany(company.id);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCompany(null);
  };

  const handleSaveCompany = (companyData, isEdit) => {
    if (isEdit) {
      onEditCompany(companyData);
    } else {
      onAddCompany(companyData);
    }
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerTitle}>
          <h3>{ingles ? 'Company Management' : 'Gestión de Empresas'}</h3>
          <p>{ingles ? 'Manage your companies and their branches' : 'Gestiona tus empresas y sus sucursales'}</p>
        </div>
        <div className={styles.headerControls}>
          {/* Filtro global */}
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder={ingles ? 'Search companies...' : 'Buscar empresas...'}
            className={styles.searchInput}
          />
          <button className={styles.addButton} onClick={handleAddCompany}>
            + {ingles ? 'Add Company' : 'Agregar Empresa'}
          </button>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏢</span>
          <div>
            <span className={styles.statValue}>{companies.length}</span>
            <span className={styles.statLabel}>
              {ingles ? 'Total Companies' : 'Empresas Totales'}
            </span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏭</span>
          <div>
            <span className={styles.statValue}>
              {companies.reduce((acc, company) => acc + (company.branches?.length || 0), 0)}
            </span>
            <span className={styles.statLabel}>
              {ingles ? 'Total Branches' : 'Sucursales Totales'}
            </span>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏷️</span>
          <div>
            <span className={styles.statValue}>
              {new Set(companies.map(c => c.industry)).size}
            </span>
            <span className={styles.statLabel}>
              {ingles ? 'Industries' : 'Industrias'}
            </span>
          </div>
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
          const company = row.original;
          return (
            <div key={company.id} className={styles.companyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardLogo}>
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    onError={(e) => {
                      e.target.src = `${import.meta.env.BASE_URL}/image/companies/equipment.png`;
                    }}
                  />
                </div>
                <div className={styles.cardActions}>
                  <button 
                    className={styles.cardActionBtn} 
                    title={ingles ? 'Edit' : 'Editar'}
                    onClick={() => handleEdit(company)}
                  >
                    ✏️
                  </button>
                  <button 
                    className={styles.cardActionBtn} 
                    title={ingles ? 'View Branches' : 'Ver Sucursales'}
                    onClick={() => handleViewBranches(company)}
                  >
                    🏢
                  </button>
                  <button 
                    className={styles.cardActionBtn} 
                    title={ingles ? 'Delete' : 'Eliminar'}
                    onClick={() => handleDelete(company)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>
                  <h4>{company.name}</h4>
                  <span className={styles.industryTag}>{company.industry}</span>
                </div>
                
                <div className={styles.cardInfo}>
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Branches' : 'Sucursales'}:</span>
                    <span className={styles.cardValue}>{company.branches?.length || 0}</span>
                  </div>
                  
                  <div className={styles.cardField}>
                    <span className={styles.cardLabel}>{ingles ? 'Created' : 'Creada'}:</span>
                    <span className={styles.cardValue}>
                      {new Date(company.createdAt).toLocaleDateString(ingles ? 'en-US' : 'es-MX')}
                    </span>
                  </div>
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
            ingles 
              ? `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of ${table.getFilteredRowModel().rows.length} companies`
              : `Mostrando ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de ${table.getFilteredRowModel().rows.length} empresas`
          ) : (
            ingles ? 'No companies found' : 'No se encontraron empresas'
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

      {/* Modal para agregar/editar empresa */}
      <AddCompanyModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSaveCompany={handleSaveCompany}
        editingCompany={editingCompany}
        existingCompanies={companies}
      />
    </div>
  );
};

export default CompanyTableSection;