'use client';
import React, { useState, ChangeEvent, lazy, Suspense, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock,
  // FiUser,
  FiCheck,
  FiInfo,
  FiPlus,
  FiSend,
  FiPrinter,
  FiTrash2,
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
import CreateQuoteModal from './CreateQuoteModal';

// Fix: Use type-only imports to avoid naming conflicts
import type { Devis as DevisType, FilterStatus, SortField, ExportFormat, FilterPeriod, Statistic, DevisStatus } from './types';

// Lazy load components
const HeroSection = lazy(() => import('./components/HeroSection'));
const StatisticsCards = lazy(() => import('./components/StatisticsCards'));
const DevisTable = lazy(() => import('./components/DevisTable'));
// New lazy loaded component
const ActionsSearchBar = lazy(() => import('./components/ActionsSearchBar'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="w-full p-8 flex justify-center items-center">
    <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

// --------------------------------------------------------
// 2) Type your component
// --------------------------------------------------------
export default function Devis() {
  // -----------------------------
  // States
  // -----------------------------
  // show/hide filter panel
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // search input
  const [searchTerm, setSearchTerm] = useState<string>('');

  // filter selectors
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('Tous');
  const [selectedProspect, setSelectedProspect] = useState<string>('Tous');

  // date range picker for export
  const [showDateRangePicker, setShowDateRangePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  // selection array for bulk actions
  const [selectedDevis, setSelectedDevis] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // view mode
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable'>('comfortable');

  // expanded row
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // -----------------------------
  // Sample data
  // -----------------------------
  const devis: DevisType[] = [
    {
      id: 'DEV-2025-001',
      date: '05/03/2025',
      prospect: 'Acme Corp',
      montantHT: '13 000,00 €',
      montantTTC: '15 600,00 €',
      statut: 'En attente',
      dateValidite: '05/04/2025',
      dateAcceptation: null,
      creePar: 'Jean Martin',
      typeDevis: 'Standard',
      notes: 'Relance effectuée le 15/03/2025',
    },
    {
      id: 'DEV-2025-002',
      date: '28/02/2025',
      prospect: 'Nexus Tech',
      montantHT: '2 491,67 €',
      montantTTC: '2 990,00 €',
      statut: 'Accepté',
      dateValidite: '30/03/2025',
      dateAcceptation: '15/03/2025',
      creePar: 'Sophie Leclerc',
      typeDevis: 'Standard',
      notes: 'Transformé en facture le 16/03/2025',
    },
    // ... rest of the data can remain the same
  ];

  const statusOptions: FilterStatus[] = [
    'Tous',
    'Accepté',
    'En attente',
    'Refusé',
    'Expiré',
    'En préparation',
  ];

  const periodOptions: FilterPeriod[] = [
    'Tous',
    'Ce mois',
    'Mois dernier',
    'Ce trimestre',
    'Cette année',
  ];

  const prospectOptions: string[] = [
    'Tous',
    'Acme Corp',
    'Nexus Tech',
    'Zenith SA',
    'Global Industries',
    'Tech Innovate',
    'Solutions Pro',
    'Groupe Média',
    'Data Services',
    'ConsultCorp',
    'Systèmes Avancés',
  ];

  // sample stats
  const statistics: Statistic[] = [
    {
      title: 'Total devis',
      value: '72 530,00 €',
      icon: <FaEuroSign className="text-green-500" />,
      trend: '+15.7%',
      trendUp: true,
    },
    {
      title: 'En attente',
      value: '25 400,00 €',
      icon: <FiClock className="text-amber-500" />,
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Acceptés',
      value: '34 690,00 €',
      icon: <FiCheck className="text-blue-500" />,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Refusés',
      value: '12 440,00 €',
      icon: <FiInfo className="text-red-500" />,
      trend: '-3.8%',
      trendUp: false,
    },
  ];

  // --------------------------------------------------------
  // Optimized handlers using useCallback
  // --------------------------------------------------------

  // Toggle "select all" checkbox
  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedDevis(devis.map((i) => i.id));
    } else {
      setSelectedDevis([]);
    }
  }, [devis]);

  // Checkbox for individual devis
  const handleCheckboxChange = useCallback((devisId: string, e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // so it doesn't also trigger row click
    const isChecked = e.target.checked;

    setSelectedDevis((prev) => {
      if (isChecked) {
        return [...prev, devisId];
      }
      return prev.filter((id) => id !== devisId);
    });

    setSelectAll(false);
  }, []);

  // Export logic
  const handleExport = useCallback(() => {
    console.log(
      `Exporting quotes from ${startDate} to ${endDate} in ${exportFormat} format`
    );
    setShowDateRangePicker(false);
  }, [startDate, endDate, exportFormat]);

  // Transform to invoice
  const transformToInvoice = useCallback((ids: string[]) => {
    console.log(`Transforming quotes ${ids.join(', ')} to invoices`);
    setSelectedDevis([]);
  }, []);

  // Sorting
  const handleSort = useCallback((field: SortField) => {
    setSortField(prevField => {
      if (prevField === field) {
        setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
        return field;
      } else {
        setSortDirection('asc');
        return field;
      }
    });
  }, []);

  // Toggle row expansion
  const handleRowClick = useCallback((devisId: string) => {
    setExpandedRow((prev) => (prev === devisId ? null : devisId));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedProspect('Tous');
    setSearchTerm('');
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Handle modal
  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  // --------------------------------------------------------
  // Memoized helper functions
  // --------------------------------------------------------

  // status colors
  const getStatusBadgeColor = useCallback((status: DevisStatus) => {
    switch (status) {
      case 'Accepté':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'En attente':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Refusé':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Expiré':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'En préparation':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  }, []);

  const getStatusDotColor = useCallback((status: DevisStatus) => {
    switch (status) {
      case 'Accepté':
        return 'bg-green-500';
      case 'En attente':
        return 'bg-amber-500';
      case 'Refusé':
        return 'bg-red-500';
      case 'Expiré':
        return 'bg-gray-500';
      case 'En préparation':
        return 'bg-blue-500';
      default:
        return 'bg-purple-500';
    }
  }, []);

  // --------------------------------------------------------
  // Memoized Filtering & Sorting
  // --------------------------------------------------------

  // Filter & search
  const filteredDevis = useMemo(() => {
    return devis.filter((d) => {
      const matchesSearch =
        !searchTerm ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.prospect.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.montantTTC.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'Tous' || d.statut === selectedStatus;

      const matchesProspect =
        selectedProspect === 'Tous' || d.prospect === selectedProspect;

      // Simplified period check (always returning true except 'Tous'),
      // You'd do real date checks for your actual logic
      const matchesPeriod = selectedPeriod === 'Tous' || true;

      return matchesSearch && matchesStatus && matchesProspect && matchesPeriod;
    });
  }, [devis, searchTerm, selectedStatus, selectedProspect, selectedPeriod]);

  // Helper function to get sortable values
  const getSortValue = (dev: DevisType, field: SortField): string => {
    return dev[field];
  };

  // Sort devis
  const sortedDevis = useMemo(() => {
    return [...filteredDevis].sort((a, b) => {
      let aValue = getSortValue(a, sortField);
      let bValue = getSortValue(b, sortField);

      // If sorting by montants, strip out currency symbols
      if (sortField === 'montantHT' || sortField === 'montantTTC') {
        const parseCurrency = (val: string): number => {
          // remove everything non-digit except comma or dot
          return parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'));
        };
        aValue = String(parseCurrency(aValue));
        bValue = String(parseCurrency(bValue));
      }

      if (aValue === bValue) {
        // fallback: sort by ID to keep consistent
        return a.id.localeCompare(b.id);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredDevis, sortField, sortDirection]);

  // --------------------------------------------------------
  // Animation variants
  // --------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  };

  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------
  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-16 pb-16 min-h-screen"
      >
        <div className="pt-12 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          {/* ---------- HEADER / HERO SECTION ---------- */}
          <Suspense fallback={<LoadingFallback />}>
            <HeroSection />
          </Suspense>

          {/* Statistics Cards */}
          <Suspense fallback={<LoadingFallback />}>
            <StatisticsCards statistics={statistics} />
          </Suspense>

          {/* Actions & Search Bar - Now lazy loaded */}
          <Suspense fallback={<LoadingFallback />}>
            <ActionsSearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearSearch={clearSearch}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedProspect={selectedProspect}
              setSelectedProspect={setSelectedProspect}
              resetFilters={resetFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showDateRangePicker={showDateRangePicker}
              setShowDateRangePicker={setShowDateRangePicker}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              handleExport={handleExport}
              handleOpenCreateModal={handleOpenCreateModal}
              transformToInvoice={transformToInvoice}
              selectedDevisIds={selectedDevis}
              statusOptions={statusOptions}
              periodOptions={periodOptions}
              prospectOptions={prospectOptions}
              itemVariants={itemVariants}
            />
          </Suspense>

          {/* Bulk Actions (visible when devis are selected) */}
          <AnimatePresence>
            {selectedDevis.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 md:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 border-2 shadow-md"
                style={{
                  backgroundColor: 'rgba(27, 3, 83, 0.03)',
                  borderColor: 'rgba(27, 3, 83, 0.2)',
                }}
              >
                <div className="font-medium" style={{ color: '#1B0353' }}>
                  <span className="text-lg font-semibold">
                    {selectedDevis.length}
                  </span>{' '}
                  devis sélectionné(s)
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
                    style={{ backgroundColor: '#1B0353' }}
                  >
                    <FiSend size={16} />
                    <span>Envoyer par email</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
                    style={{ backgroundColor: '#1B0353' }}
                  >
                    <FiPrinter size={16} />
                    <span>Imprimer</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => transformToInvoice(selectedDevis)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:shadow-md hover:bg-green-700 transition-all flex items-center space-x-2"
                  >
                    <FiPlus size={16} />
                    <span>Transformer en facture</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md hover:bg-red-700 transition-all flex items-center space-x-2"
                  >
                    <FiTrash2 size={16} />
                    <span>Supprimer</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Devis Table - Lazy loaded component */}
          <Suspense fallback={<LoadingFallback />}>
            <DevisTable 
              devis={devis}
              filteredDevis={filteredDevis}
              sortedDevis={sortedDevis}
              expandedRow={expandedRow}
              selectedDevis={selectedDevis}
              sortField={sortField}
              sortDirection={sortDirection}
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
              handleCheckboxChange={handleCheckboxChange}
              handleRowClick={handleRowClick}
              handleSort={handleSort}
              transformToInvoice={transformToInvoice}
              resetFilters={resetFilters}
              getStatusBadgeColor={getStatusBadgeColor}
              getStatusDotColor={getStatusDotColor}
              itemVariants={itemVariants}
            />
          </Suspense>
        </div>
        
        {/* Create Quote Modal */}
        <CreateQuoteModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      </motion.div>
    </div>
  );
}
