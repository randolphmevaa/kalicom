'use client';
import React, { lazy, Suspense, useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateCreditNoteModal from './CreateCreditNoteModal';
import CreateInvoiceModal from './CreateInvoiceModal';
import { 
  // FiSearch, 
  // FiFilter, 
  // FiPlus, 
  FiTrash2,
  // FiDownload,
  FiSend,
  FiClock,
  // FiRefreshCw,
  FiPrinter,
  FiCheck,
  FiInfo,
  // FiFilePlus,
  // FiChevronDown,
  // FiX,
  // FiSliders,
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
const HeaderHero = lazy(() => import('./HeaderHero'));
const StatisticsCards = lazy(() => import('./StatisticsCards'));
const InvoicesTable = lazy(() => import('./InvoicesTable'));
const ActionsSearchBar = lazy(() => import('./ActionsSearchBar'));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="w-full p-8 flex justify-center items-center">
    <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);
// --------------------------------------------------------
// 1) Define your data interfaces
// --------------------------------------------------------

// For each invoice item
interface Invoice {
  id: string;
  date: string;
  client: string;
  montantHT: string;
  montantTTC: string;
  statut: InvoiceStatus; // e.g. "Payée", "En attente", ...
  dateEcheance: string;
  dateReglement: string | null;
  modeReglement: string | null;
  creePar: string;
  typeFacture: string;
  notes: string;
}

// Potential statuses for an invoice
type InvoiceStatus =
  | 'Payée'
  | 'En attente'
  | 'En retard'
  | 'Partiellement payée'
  | 'Annulée'
  | string; // fallback if you introduce others

// For the “filter” statuses including "Tous"
type FilterStatus = InvoiceStatus | 'Tous';

// For sorting, define the fields you actually allow
type SortField =
  | 'id'
  | 'date'
  | 'client'
  | 'montantHT'
  | 'montantTTC'
  | 'statut'
  | 'dateEcheance';

// For the “export” format
type ExportFormat = 'pdf' | 'csv' | 'excel';

// For the period filter
type FilterPeriod = 'Tous' | 'Ce mois' | 'Mois dernier' | 'Ce trimestre' | 'Cette année';

// For your stat cards
interface Statistic {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

// --------------------------------------------------------
// 2) Type your component
// --------------------------------------------------------
export default function Factures() {
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
  const [selectedClient, setSelectedClient] = useState<string>('Tous');

  // date range picker for export
  const [showDateRangePicker, setShowDateRangePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  // selection array for bulk actions
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // view mode
  const [viewMode, setViewMode] = useState<'compact' | 'comfortable'>('comfortable');

  // expanded row
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  // Add this to your Factures component's state definitions
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Add this handler for opening the modal
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  // Add this to your Factures component's state definitions
  const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState<boolean>(false);

  // Add this handler for opening the modal
  const handleOpenCreateCreditNoteModal = () => {
    setShowCreateCreditNoteModal(true);
  };

  // -----------------------------
  // Sample data
  // -----------------------------
  const invoices: Invoice[] = [
    {
      id: 'FACT-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montantHT: '13 000,00 €',
      montantTTC: '15 600,00 €',
      statut: 'Payée',
      dateEcheance: '05/04/2025',
      dateReglement: '02/04/2025',
      modeReglement: 'Virement',
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Paiement reçu avant échéance',
    },
    {
      id: 'FACT-2025-002',
      date: '28/02/2025',
      client: 'Nexus Tech',
      montantHT: '2 491,67 €',
      montantTTC: '2 990,00 €',
      statut: 'En attente',
      dateEcheance: '30/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Relance envoyée le 20/03/2025',
    },
    {
      id: 'FACT-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montantHT: '4 158,33 €',
      montantTTC: '4 990,00 €',
      statut: 'En retard',
      dateEcheance: '25/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Client à contacter pour paiement',
    },
    {
      id: 'FACT-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montantHT: '2 916,67 €',
      montantTTC: '3 500,00 €',
      statut: 'Payée',
      dateEcheance: '20/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Carte bancaire',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: 'Paiement reçu en avance',
    },
    {
      id: 'FACT-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montantHT: '10 625,00 €',
      montantTTC: '12 750,00 €',
      statut: 'Partiellement payée',
      dateEcheance: '15/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Chèque',
      creePar: 'Jean Martin',
      typeFacture: 'Échelonnée',
      notes: 'Premier versement de 6 000 € reçu',
    },
    {
      id: 'FACT-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montantHT: '7 000,00 €',
      montantTTC: '8 400,00 €',
      statut: 'Payée',
      dateEcheance: '10/03/2025',
      dateReglement: '08/03/2025',
      modeReglement: 'Virement',
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: '',
    },
    {
      id: 'FACT-2025-007',
      date: '05/02/2025',
      client: 'Groupe Média',
      montantHT: '1 458,33 €',
      montantTTC: '1 750,00 €',
      statut: 'Annulée',
      dateEcheance: '05/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Annulée à la demande du client',
    },
    {
      id: 'FACT-2025-008',
      date: '01/02/2025',
      client: 'Data Services',
      montantHT: '4 416,67 €',
      montantTTC: '5 300,00 €',
      statut: 'Payée',
      dateEcheance: '01/03/2025',
      dateReglement: '28/02/2025',
      modeReglement: 'Virement',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: '',
    },
    {
      id: 'FACT-2025-009',
      date: '28/01/2025',
      client: 'ConsultCorp',
      montantHT: '8 166,67 €',
      montantTTC: '9 800,00 €',
      statut: 'En attente',
      dateEcheance: '28/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Client a demandé une extension de délai',
    },
    {
      id: 'FACT-2025-010',
      date: '15/01/2025',
      client: 'Systèmes Avancés',
      montantHT: '6 208,33 €',
      montantTTC: '7 450,00 €',
      statut: 'En retard',
      dateEcheance: '15/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Plusieurs relances effectuées',
    },
  ];

  const statusOptions: FilterStatus[] = [
    'Tous',
    'Payée',
    'En attente',
    'En retard',
    'Partiellement payée',
    'Annulée',
  ];

  const periodOptions: FilterPeriod[] = [
    'Tous',
    'Ce mois',
    'Mois dernier',
    'Ce trimestre',
    'Cette année',
  ];

  const clientOptions: string[] = [
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

  // const exportFormatOptions: ExportFormat[] = ['pdf', 'csv', 'excel'];

  // sample stats
  const statistics: Statistic[] = [
    {
      title: 'Total facturé',
      value: '72 530,00 €',
      icon: <FaEuroSign className="text-green-500" />,
      trend: '+12.4%',
      trendUp: true,
    },
    {
      title: 'En attente',
      value: '12 790,00 €',
      icon: <FiClock className="text-amber-500" />,
      trend: '-3.8%',
      trendUp: false,
    },
    {
      title: 'En retard',
      value: '12 440,00 €',
      icon: <FiInfo className="text-red-500" />,
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: 'Payées',
      value: '47 300,00 €',
      icon: <FiCheck className="text-blue-500" />,
      trend: '+8.7%',
      trendUp: true,
    },
  ];

  // --------------------------------------------------------
  // Handlers
  // --------------------------------------------------------

  // Toggle "select all" checkbox
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedInvoices(invoices.map((i) => i.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  // Checkbox for individual invoice
  const handleCheckboxChange = (invoiceId: string, e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // so it doesn't also trigger row click
    const isChecked = e.target.checked;

    // If we check a box, add that ID; if we uncheck it, remove that ID
    setSelectedInvoices((prev) => {
      if (isChecked) {
        return [...prev, invoiceId];
      }
      return prev.filter((id) => id !== invoiceId);
    });

    // If any item is individually changed, we know "select all" is no longer guaranteed
    setSelectAll(false);
  };

  // Export logic
  const handleExport = () => {
    // your exporting logic
    console.log(
      `Exporting invoices from ${startDate} to ${endDate} in ${exportFormat} format`
    );
    setShowDateRangePicker(false);
  };

  // Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Toggle row expansion
  const handleRowClick = (invoiceId: string) => {
    setExpandedRow((prev) => (prev === invoiceId ? null : invoiceId));
  };

  // Filter & search
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      !searchTerm ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.montantTTC.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'Tous' || invoice.statut === selectedStatus;

    const matchesClient =
      selectedClient === 'Tous' || invoice.client === selectedClient;

    // Simplified period check (always returning true except 'Tous'),
    // You’d do real date checks for your actual logic
    const matchesPeriod = selectedPeriod === 'Tous' || true;

    return matchesSearch && matchesStatus && matchesClient && matchesPeriod;
  });

  // Because TS doesn’t like a[sortField] by default, define a helper:
  function getSortValue(inv: Invoice, field: SortField): string {
    return inv[field];
  }

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
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

  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedClient('Tous');
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // status colors
  const getStatusBadgeColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'En attente':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'En retard':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Partiellement payée':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Annulée':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
  };

  const getStatusDotColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'Payée':
        return 'bg-green-500';
      case 'En attente':
        return 'bg-amber-500';
      case 'En retard':
        return 'bg-red-500';
      case 'Partiellement payée':
        return 'bg-blue-500';
      case 'Annulée':
        return 'bg-gray-500';
      default:
        return 'bg-purple-500';
    }
  };

  // animation variants
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

  const statCardVariants = {
    hover: {
      y: -5,
      boxShadow:
        '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
          {/* ---------- HEADER / HERO SECTION (Lazy Loaded) ---------- */}
          <Suspense fallback={<LoadingFallback />}>
            <HeaderHero />
          </Suspense>

          {/* Lazy loaded Statistics Cards */}
          <Suspense fallback={<LoadingFallback />}>
            <StatisticsCards 
              statistics={statistics}
              itemVariants={itemVariants}
              statCardVariants={statCardVariants}
            />
          </Suspense>

          {/* Actions & Search Bar */}
          <Suspense fallback={<LoadingFallback />}>
            <ActionsSearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearSearch={clearSearch}
              handleOpenCreateModal={handleOpenCreateModal}
              handleOpenCreateCreditNoteModal={handleOpenCreateCreditNoteModal}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              showDateRangePicker={showDateRangePicker}
              setShowDateRangePicker={setShowDateRangePicker}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              handleExport={handleExport}
              viewMode={viewMode}
              setViewMode={setViewMode}
              statusOptions={statusOptions}
              periodOptions={periodOptions}
              clientOptions={clientOptions}
              selectedStatus={selectedStatus}
              selectedPeriod={selectedPeriod}
              selectedClient={selectedClient}
              setSelectedStatus={setSelectedStatus}
              setSelectedPeriod={setSelectedPeriod}
              setSelectedClient={setSelectedClient}
              resetFilters={resetFilters}
              itemVariants={itemVariants}
            />
          </Suspense>

          {/* Bulk Actions (visible when invoices are selected) */}
          <AnimatePresence>
            {selectedInvoices.length > 0 && (
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
                    {selectedInvoices.length}
                  </span>{' '}
                  facture(s) sélectionnée(s)
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md hover:bg-red-700 transition-all flex items-center space-x-2"
                  >
                    <FiTrash2 size={16} />
                    <span>Supprimer</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lazy loaded Invoices Table */}
          <Suspense fallback={<LoadingFallback />}>
            <InvoicesTable
              sortedInvoices={sortedInvoices}
              selectAll={selectAll}
              handleSelectAll={handleSelectAll}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              expandedRow={expandedRow}
              handleRowClick={handleRowClick}
              selectedInvoices={selectedInvoices}
              handleCheckboxChange={handleCheckboxChange}
              getStatusDotColor={getStatusDotColor}
              getStatusBadgeColor={getStatusBadgeColor}
              resetFilters={resetFilters}
              filteredInvoices={filteredInvoices}
              invoices={invoices}
            />
          </Suspense>
        </div>
        {/* Create Invoice Modal */}
        <CreateInvoiceModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
        {/* Create Credit Note Modal */}
        <CreateCreditNoteModal
          isOpen={showCreateCreditNoteModal} 
          onClose={() => setShowCreateCreditNoteModal(false)} 
        />
      </motion.div>
    </div>
  );
}
