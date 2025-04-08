'use client';
import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateCreditNoteModal from './CreateCreditNoteModal';
import CreateInvoiceModal from './CreateInvoiceModal';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiSend,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiPrinter,
  FiCheck,
  FiInfo,
  FiFilePlus,
  FiCalendar,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiX,
  FiSliders,
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
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
          {/* ---------- HEADER / HERO SECTION ---------- */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
>
  {/* Background gradient with pattern */}
  <div 
    className="absolute inset-0 opacity-5 mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '30px 30px'
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-br from-[#1B0353]/10 via-white/70 to-[#7B4AE2]/10 rounded-3xl pointer-events-none" />

  {/* Blurred circles for decoration */}
  <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#1B0353]/10 rounded-full blur-3xl pointer-events-none"></div>
  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#7B4AE2]/10 rounded-full blur-3xl pointer-events-none"></div>

  <div className="relative p-8 z-10">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
      <div className="max-w-2xl">
        {/* Title with decorative elements */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#1B0353]/10 rounded-lg">
            <FiFileText className="w-6 h-6 text-[#1B0353]" />
          </div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#7B4AE2]">
            Factures
          </h1>
          <span className="px-2 py-1 text-xs font-medium text-[#1B0353] bg-[#1B0353]/10 rounded-full">
            Gestion des factures
          </span>
        </div>
        
        <p className="text-base text-gray-600 leading-relaxed">
          Gérez vos factures et suivez leur état de paiement. Visualisez rapidement 
          les montants dus et les délais de paiement de vos clients.
        </p>
      </div>
      
      <div className="flex items-center bg-[#1B0353]/5 p-3 rounded-xl">
        <FiFileText className="w-6 h-6 text-[#1B0353]" />
        <span className="ml-2 text-[#1B0353] font-medium">Système de facturation</span>
      </div>
    </div>
    
    {/* Quick tip */}
    <div className="mt-6 flex items-start gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm">
      <FiInfo className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
      <div>
        <span className="font-medium text-purple-700">Astuce :</span>{' '}
        <span className="text-purple-700">
          Utilisez les filtres pour trouver rapidement les factures impayées ou en retard. Les factures sont automatiquement classées par date d&apos;échéance.
        </span>
      </div>
    </div>
  </div>
</motion.div>

          {/* Statistics Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 md:p-7 rounded-2xl shadow-md transition-all duration-300 flex flex-col"
                whileHover="hover"
                variants={statCardVariants}
              >
                <div className="flex items-center mb-2 justify-between">
                  <div className="flex items-center">
                    <div
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: 'rgba(27, 3, 83, 0.1)' }}
                    >
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-medium flex items-center ${
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.trendUp ? (
                      <FiArrowUp size={14} className="mr-1" />
                    ) : (
                      <FiArrowDown size={14} className="mr-1" />
                    )}
                    {stat.trend}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Actions & Search Bar */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                {/* Search */}
                <div className="w-full lg:w-80 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher une facture..."
                    className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-indigo-500 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: '#1B0353' }}
                    onClick={handleOpenCreateModal}
                  >
                    <FiPlus />
                    <span>Créer une facture</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    style={{ backgroundColor: '#1B0353' }}
                    onClick={handleOpenCreateCreditNoteModal}
                  >
                    <FiFilePlus />
                    <span>Créer un avoir</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                      showFilters
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiFilter />
                    <span>{showFilters ? 'Masquer filtres' : 'Filtres'}</span>
                    {showFilters ? (
                      <FiChevronDown className="transform rotate-180 transition-transform duration-200" />
                    ) : (
                      <FiChevronDown className="transition-transform duration-200" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                    className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                      showDateRangePicker
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiDownload />
                    <span>Exporter</span>
                  </motion.button>
                  <div className="flex items-center ml-2 border-l pl-2 h-10">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setViewMode(
                          viewMode === 'comfortable' ? 'compact' : 'comfortable'
                        )
                      }
                      className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                      title={
                        viewMode === 'comfortable'
                          ? 'Affichage compact'
                          : 'Affichage confortable'
                      }
                    >
                      <FiSliders size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                      title="Actualiser"
                    >
                      <FiRefreshCw size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Date Range Picker for Export */}
              <AnimatePresence>
                {showDateRangePicker && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 overflow-hidden border-t pt-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mois complet
                        </label>
                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all">
                          <option value="">Sélectionner un mois</option>
                          <option value="01/2025">Janvier 2025</option>
                          <option value="02/2025">Février 2025</option>
                          <option value="03/2025">Mars 2025</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Format
                        </label>
                        <div className="flex space-x-2">
                          <button
                            className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                              exportFormat === 'pdf'
                                ? 'border-transparent text-white shadow-md'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            style={{
                              backgroundColor:
                                exportFormat === 'pdf' ? '#1B0353' : '',
                            }}
                            onClick={() => setExportFormat('pdf')}
                          >
                            PDF
                          </button>
                          <button
                            className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                              exportFormat === 'csv'
                                ? 'border-transparent text-white shadow-md'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            style={{
                              backgroundColor:
                                exportFormat === 'csv' ? '#1B0353' : '',
                            }}
                            onClick={() => setExportFormat('csv')}
                          >
                            CSV
                          </button>
                          <button
                            className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                              exportFormat === 'excel'
                                ? 'border-transparent text-white shadow-md'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            style={{
                              backgroundColor:
                                exportFormat === 'excel' ? '#1B0353' : '',
                            }}
                            onClick={() => setExportFormat('excel')}
                          >
                            Excel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDateRangePicker(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Annuler
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExport}
                        className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        style={{ backgroundColor: '#1B0353' }}
                      >
                        Exporter
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 overflow-hidden border-t pt-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                        >
                          {statusOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Période
                        </label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value as FilterPeriod)}
                        >
                          {periodOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client
                        </label>
                        <select
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                          value={selectedClient}
                          onChange={(e) => setSelectedClient(e.target.value)}
                        >
                          {clientOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetFilters}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        Réinitialiser
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                        style={{ backgroundColor: '#1B0353' }}
                      >
                        Appliquer les filtres
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

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

          {/* Invoices Table */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </div>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>N° facture</span>
                        {sortField === 'id' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortField === 'date' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('client')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Client</span>
                        {sortField === 'client' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('montantHT')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Montant HT</span>
                        {sortField === 'montantHT' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('montantTTC')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Montant TTC</span>
                        {sortField === 'montantTTC' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('statut')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Statut</span>
                        {sortField === 'statut' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('dateEcheance')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Échéance</span>
                        {sortField === 'dateEcheance' && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <FiArrowUp size={14} />
                            ) : (
                              <FiArrowDown size={14} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInvoices.map((invoice) => (
                    <React.Fragment key={invoice.id}>
                      <tr
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          expandedRow === invoice.id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => handleRowClick(invoice.id)}
                      >
                        <td
                          className="px-4 py-4 whitespace-nowrap"
                          // Stop row click from toggling expansion
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                              checked={selectedInvoices.includes(invoice.id)}
                              onChange={(e) => handleCheckboxChange(invoice.id, e)}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`h-2 w-2 rounded-full mr-2 ${getStatusDotColor(
                                invoice.statut
                              )}`}
                            ></div>
                            <div>
                              <div
                                className="text-sm font-medium"
                                style={{ color: '#1B0353' }}
                              >
                                {invoice.id}
                              </div>
                              <div className="text-xs text-gray-500">
                                <span className="flex items-center">
                                  <FiUser className="mr-1" size={12} />
                                  {invoice.creePar}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {invoice.client}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.typeFacture}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.montantHT}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.montantTTC}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-xs rounded-full inline-flex items-center ${getStatusBadgeColor(
                              invoice.statut
                            )}`}
                          >
                            {invoice.statut}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="flex items-center">
                            <FiCalendar className="mr-1" size={12} />
                            {invoice.dateEcheance}
                          </span>
                        </td>
                        <td
                          className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                              style={{ color: '#1B0353' }}
                              title="Voir"
                            >
                              <FiEye size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                              style={{ color: '#1B0353' }}
                              title="Modifier"
                            >
                              <FiEdit size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                              title="Télécharger"
                            >
                              <FiDownload size={18} />
                            </motion.button>
                            <div className="relative">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                                title="Plus d'options"
                              >
                                <FiMoreVertical size={18} />
                              </motion.button>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded row details */}
                      <AnimatePresence>
                        {expandedRow === invoice.id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-indigo-50"
                          >
                            <td colSpan={9} className="px-4 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-gray-500">
                                    Détails de paiement
                                  </div>
                                  <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="text-gray-500">Mode</div>
                                      <div className="font-medium">
                                        {invoice.modeReglement || 'Non défini'}
                                      </div>
                                      <div className="text-gray-500">Date</div>
                                      <div className="font-medium">
                                        {invoice.dateReglement || 'Non défini'}
                                      </div>
                                      <div className="text-gray-500">État</div>
                                      <div className="font-medium">
                                        {invoice.statut}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-gray-500">
                                    Montants
                                  </div>
                                  <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="text-gray-500">
                                        Montant HT
                                      </div>
                                      <div className="font-medium">
                                        {invoice.montantHT}
                                      </div>
                                      <div className="text-gray-500">TVA</div>
                                      <div className="font-medium">20%</div>
                                      <div className="text-gray-500">
                                        Montant TTC
                                      </div>
                                      <div className="font-medium">
                                        {invoice.montantTTC}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="text-xs font-medium text-gray-500">
                                    Notes
                                  </div>
                                  <div className="bg-white p-3 rounded-lg shadow-sm h-full">
                                    <p className="text-sm">
                                      {invoice.notes || 'Aucune note'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end mt-4 space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-3 py-1.5 text-xs border border-indigo-300 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center space-x-1"
                                >
                                  <FiSend size={12} />
                                  <span>Envoyer</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-3 py-1.5 text-xs border border-green-300 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
                                >
                                  <FiDownload size={12} />
                                  <span>Télécharger</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-3 py-1.5 text-xs border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center space-x-1"
                                >
                                  <FiEdit size={12} />
                                  <span>Modifier</span>
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {filteredInvoices.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-100 mx-auto h-16 w-16 flex items-center justify-center rounded-full">
                  <FiFileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Aucune facture trouvée
                </h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  Aucune facture ne correspond à vos critères de recherche.
                </p>
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    style={{ backgroundColor: '#1B0353' }}
                  >
                    <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
                    Réinitialiser les filtres
                  </motion.button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredInvoices.length > 0 && (
              <div
                className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">1</span> à{' '}
                    <span className="font-medium">
                      {filteredInvoices.length}
                    </span>{' '}
                    sur <span className="font-medium">{invoices.length}</span>{' '}
                    factures
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
                  >
                    Précédent
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
                  >
                    Suivant
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
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