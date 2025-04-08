'use client';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import CreateDepositInvoiceModal from './CreateDepositInvoiceModal';
import { 
  // FiFileText, 
  // FiSearch, 
  // FiFilter, 
  // FiPlus, 
  // FiMoreVertical, 
  // FiEdit,
  FiTrash2,
  // FiEye,
  // FiDownload,
  FiSend,
  // FiClock,
  // FiUser,
  // FiCalendar,
  // FiRefreshCw,
  FiPrinter,
  // FiLink,
  // FiCheckCircle,
  // FiPercent,
  // FiArrowRight,
  // FiCheck,
  // FiX,
  // FiInfo
} from 'react-icons/fi';
// import { FaEuroSign } from 'react-icons/fa6';
import dynamic from 'next/dynamic';
const HeaderHeroSection = dynamic(() => import('./HeaderHeroSection'));
// const StatsCards = dynamic(() => import('./StatsCards'));
const DepositInvoicesTable = dynamic(() => import('./DepositInvoicesTable'));
const SearchAndActions = dynamic(() => import('./SearchAndActions'));

export default function FacturesAcompte() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  const [selectedClient, setSelectedClient] = useState('Tous');
  
  // State for selected deposit invoices (for bulk actions)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Add this to your Factures component's state definitions
    // const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState<boolean>(false);
  
    // Add this handler for opening the modal
    // const handleOpenCreateCreditNoteModal = () => {
    //   setShowCreateCreditNoteModal(true);
    // };

     // Add this to your Factures component's state definitions
      const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    
      // Add this handler for opening the modal
      const handleOpenCreateModal = () => {
        setShowCreateModal(true);
      };
    

  // Sample deposit invoices data
  const depositInvoices = [
    {
      id: 'FA-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montant: '5 000,00 €',
      statut: 'Payée',
      echeance: '20/03/2025',
      dateReglement: '15/03/2025',
      montantTotal: '15 600,00 €',
      pourcentage: '32%',
      factureFinale: 'FACT-2025-001',
      creePar: 'Jean Martin',
      notes: 'Premier acompte pour projet CRM'
    },
    {
      id: 'FA-2025-002',
      date: '01/03/2025',
      client: 'Nexus Tech',
      montant: '1 000,00 €',
      statut: 'Payée',
      echeance: '15/03/2025',
      dateReglement: '10/03/2025',
      montantTotal: '2 990,00 €',
      pourcentage: '33%',
      factureFinale: 'FACT-2025-002',
      creePar: 'Sophie Leclerc',
      notes: 'Acompte pour module facturation'
    },
    {
      id: 'FA-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montant: '2 500,00 €',
      statut: 'En attente',
      echeance: '15/03/2025',
      dateReglement: null,
      montantTotal: '4 990,00 €',
      pourcentage: '50%',
      factureFinale: null,
      creePar: 'Thomas Bernard',
      notes: 'Acompte pour contrat annuel'
    },
    {
      id: 'FA-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montant: '1 200,00 €',
      statut: 'Payée',
      echeance: '05/03/2025',
      dateReglement: '28/02/2025',
      montantTotal: '3 500,00 €',
      pourcentage: '34%',
      factureFinale: 'FACT-2025-004',
      creePar: 'Marie Dupont',
      notes: 'Acompte pour formation'
    },
    {
      id: 'FA-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montant: '6 000,00 €',
      statut: 'Payée',
      echeance: '01/03/2025',
      dateReglement: '25/02/2025',
      montantTotal: '12 750,00 €',
      pourcentage: '47%',
      factureFinale: 'FACT-2025-005',
      creePar: 'Jean Martin',
      notes: 'Acompte pour pack démarrage'
    },
    {
      id: 'FA-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montant: '3 000,00 €',
      statut: 'En retard',
      echeance: '25/02/2025',
      dateReglement: null,
      montantTotal: '8 400,00 €',
      pourcentage: '36%',
      factureFinale: null,
      creePar: 'Sophie Leclerc',
      notes: 'Relance envoyée le 28/02/2025'
    },
    {
      id: 'FA-2025-007',
      date: '05/02/2025',
      client: 'Groupe Média',
      montant: '875,00 €',
      statut: 'Annulée',
      echeance: '20/02/2025',
      dateReglement: null,
      montantTotal: '1 750,00 €',
      pourcentage: '50%',
      factureFinale: null,
      creePar: 'Thomas Bernard',
      notes: 'Projet annulé par le client'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Payée', 'En attente', 'En retard', 'Annulée'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];
  const clientOptions = ['Tous', 'Acme Corp', 'Nexus Tech', 'Zenith SA', 'Global Industries', 'Tech Innovate', 'Solutions Pro', 'Groupe Média'];

  // Statistics
  // const statistics = [
  //   { title: "Total acomptes", value: "19 575,00 €", icon: <FaEuroSign className="text-green-500" /> },
  //   { title: "En attente", value: "2 500,00 €", icon: <FiClock className="text-amber-500" /> },
  //   { title: "En retard", value: "3 000,00 €", icon: <FiX className="text-red-500" /> },
  //   { title: "Acomptes payés", value: "13 200,00 €", icon: <FiCheck className="text-blue-500" /> }
  // ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectInvoice = (invoiceId: string) => {
    if (selectedInvoices.includes(invoiceId)) {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
      setSelectAll(false);
    } else {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    }
  };

  // Filter deposit invoices based on search and filter criteria
  const filteredInvoices = depositInvoices.filter(invoice => {
    const matchesSearch = 
      searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.montant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || invoice.statut === selectedStatus;
    
    const matchesClient = selectedClient === 'Tous' || invoice.client === selectedClient;
    
    // For period filter we would need actual date logic, 
    // this is simplified for the example
    const matchesPeriod = selectedPeriod === 'Tous' || true;
    
    return matchesSearch && matchesStatus && matchesClient && matchesPeriod;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedClient('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      case 'Annulée':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="pt-12 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        {/* ---------- HEADER / HERO SECTION ---------- */}
        <Suspense fallback={
          <div className="w-full p-8 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        }>
          <HeaderHeroSection />
        </Suspense>

        {/* Statistics Cards */}
        <Suspense fallback={
          <div className="w-full p-8 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        }>
          {/* <StatsCards statistics={statistics} /> */}
        </Suspense>

        {/* Actions & Search Bar */}
        <Suspense fallback={
          <div className="w-full p-8 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        }>
          <SearchAndActions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleOpenCreateModal={handleOpenCreateModal}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            resetFilters={resetFilters}
            statusOptions={statusOptions}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            periodOptions={periodOptions}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            clientOptions={clientOptions}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
          />
        </Suspense>

        {/* Bulk Actions (visible when invoices are selected) */}
        {selectedInvoices.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
            <div className="text-indigo-800">
              <span className="font-medium">{selectedInvoices.length}</span> facture(s) d&apos;acompte sélectionnée(s)
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1">
                <FiSend />
                <span>Envoyer par email</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                <FiPrinter />
                <span>Imprimer</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1">
                <FiTrash2 />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        )}

        {/* Deposit Invoices Table */}
        <Suspense fallback={
          <div className="w-full p-8 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        }>
          <DepositInvoicesTable
            filteredInvoices={filteredInvoices}
            depositInvoices={depositInvoices}
            selectedInvoices={selectedInvoices}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            handleSelectInvoice={handleSelectInvoice}
            getStatusBadgeColor={getStatusBadgeColor}
            resetFilters={resetFilters}
          />
        </Suspense>
      </div>
      {/* Create Invoice Modal */}
      <CreateDepositInvoiceModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
    </motion.div>
  );
}