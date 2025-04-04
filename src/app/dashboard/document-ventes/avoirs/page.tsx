'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateCreditNoteModal from './CreateCreditNoteModal';
import { 
  FiFileText, 
  // FiMoreVertical, 
  // FiEdit,
  FiTrash2,
  // FiEye,
  // FiDownload,
  FiSend,
  FiClock,
  // FiUser,
  // FiRefreshCw,
  FiPrinter,
  // FiLink,
  FiCheckCircle,

} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('./HeroSection'), {
  loading: () => 
  <div className="w-full p-8 flex justify-center items-center">
    <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>,
  ssr: false, // if you want to disable server-side rendering for this component
});

const StatsCards = dynamic(() => import('./StatsCards'), {
  loading: () => 
    <div className="w-full p-8 flex justify-center items-center">
      <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>,
    ssr: false,
});

const DynamicActionsSearchBar = dynamic(
  () => import('./ActionsSearchBar'),
  {
    loading: () => (
      <div className="w-full p-8 flex justify-center items-center">
        <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    ),
    ssr: false,
  }
);

// Dynamically import the CreditNotesTable component with a custom loader
const DynamicCreditNotesTable = dynamic(
  () => import('./CreditNotesTable'),
  {
    loading: () => (
      <div className="w-full p-8 flex justify-center items-center">
        <div className="h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    ),
    ssr: false,
  }
);

export default function Avoirs() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  const [selectedClient, setSelectedClient] = useState('Tous');
  
  // State for selected credit notes (for bulk actions)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const [selectAll, setSelectAll] = useState(false);
  // Add this to your Factures component's state definitions
  const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState<boolean>(false);

  // Add this handler for opening the modal
  const handleOpenCreateCreditNoteModal = () => {
    setShowCreateCreditNoteModal(true);
  };

  // Sample credit notes data
  const creditNotes = [
    {
      id: 'AV-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montant: '1 560,00 €',
      statut: 'Émis',
      facture: 'FACT-2025-001',
      raison: 'Remboursement partiel',
      creePar: 'Jean Martin',
      notes: 'Erreur de facturation sur services non fournis'
    },
    {
      id: 'AV-2025-002',
      date: '01/03/2025',
      client: 'Nexus Tech',
      montant: '299,00 €',
      statut: 'Émis',
      facture: 'FACT-2025-002',
      raison: 'Remboursement module',
      creePar: 'Sophie Leclerc',
      notes: 'Module facturé mais non livré'
    },
    {
      id: 'AV-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montant: '499,00 €',
      statut: 'En attente',
      facture: 'FACT-2025-003',
      raison: 'Correction tarif',
      creePar: 'Thomas Bernard',
      notes: 'Remise non appliquée sur facture initiale'
    },
    {
      id: 'AV-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montant: '350,00 €',
      statut: 'Émis',
      facture: 'FACT-2025-004',
      raison: 'Annulation formation',
      creePar: 'Marie Dupont',
      notes: 'Formation annulée à la demande du client'
    },
    {
      id: 'AV-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montant: '1 275,00 €',
      statut: 'Traité',
      facture: 'FACT-2025-005',
      raison: 'Correction montant',
      creePar: 'Jean Martin',
      notes: 'Erreur sur le montant total facturé'
    },
    {
      id: 'AV-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montant: '840,00 €',
      statut: 'Traité',
      facture: 'FACT-2025-006',
      raison: 'Remise fidélité',
      creePar: 'Sophie Leclerc',
      notes: 'Remise exceptionnelle accordée'
    },
    {
      id: 'AV-2025-007',
      date: '05/02/2025',
      client: 'Groupe Média',
      montant: '1 750,00 €',
      statut: 'Refusé',
      facture: 'FACT-2025-007',
      raison: 'Annulation contrat',
      creePar: 'Thomas Bernard',
      notes: 'Demande d\'avoir refusée suite à vérification'
    },
    {
      id: 'AV-2025-008',
      date: '01/02/2025',
      client: 'Data Services',
      montant: '530,00 €',
      statut: 'Traité',
      facture: 'FACT-2025-008',
      raison: 'Réduction quantité',
      creePar: 'Marie Dupont',
      notes: 'Ajustement quantité licences'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Émis', 'En attente', 'Traité', 'Refusé'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];
  const clientOptions = ['Tous', 'Acme Corp', 'Nexus Tech', 'Zenith SA', 'Global Industries', 'Tech Innovate', 'Solutions Pro', 'Groupe Média', 'Data Services'];

  // Statistics
  const statistics = [
    { title: "Total avoirs", value: "7 103,00 €", icon: <FaEuroSign className="text-red-500" /> },
    { title: "En attente", value: "499,00 €", icon: <FiClock className="text-amber-500" /> },
    { title: "Émis", value: "2 709,00 €", icon: <FiFileText className="text-blue-500" /> },
    { title: "Traités", value: "2 645,00 €", icon: <FiCheckCircle className="text-green-500" /> }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedNotes(filteredNotes.map(note => note.id));
    } else {
      setSelectedNotes([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectNote = (noteId: string): void => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId));
      setSelectAll(false);
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };  

  // Filter credit notes based on search and filter criteria
  const filteredNotes = creditNotes.filter(note => {
    const matchesSearch = 
      searchTerm === '' || 
      note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.montant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || note.statut === selectedStatus;
    
    const matchesClient = selectedClient === 'Tous' || note.client === selectedClient;
    
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
      case 'Émis':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Traité':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
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
        <HeroSection />

        {/* Statistics Cards */}
        <StatsCards statistics={statistics} />

        {/* Actions & Search Bar */}
        {/* Lazy-loaded Actions & Search Bar */}
        <DynamicActionsSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleOpenCreateCreditNoteModal={handleOpenCreateCreditNoteModal}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          resetFilters={resetFilters}
          statusOptions={statusOptions}
          periodOptions={periodOptions}
          clientOptions={clientOptions}
        />

        {/* Bulk Actions (visible when notes are selected) */}
        {selectedNotes.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
            <div className="text-indigo-800">
              <span className="font-medium">{selectedNotes.length}</span> avoir(s) sélectionné(s)
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

        {/* Credit Notes Table */}
        <DynamicCreditNotesTable
          creditNotes={filteredNotes}  // or if you want to pass full notes, use creditNotes={creditNotes}
          filteredNotes={filteredNotes} // Now we pass filteredNotes as required
          selectedNotes={selectedNotes}
          selectAll={selectAll}
          handleSelectAll={handleSelectAll}
          handleSelectNote={handleSelectNote}
          getStatusBadgeColor={getStatusBadgeColor}
          resetFilters={resetFilters}
          setSelectedStatus={setSelectedStatus}
          setSelectedClient={setSelectedClient}
          setShowFilters={setShowFilters}
          showFilters={showFilters}
          showCreateCreditNoteModal={showCreateCreditNoteModal}
          handleOpenCreateCreditNoteModal={handleOpenCreateCreditNoteModal}
        />

        {/* <CreateCreditNoteModal isOpen={false} onClose={() => {}} /> */}
      </div>
      {/* Create Credit Note Modal */}
      <CreateCreditNoteModal
        isOpen={showCreateCreditNoteModal} 
        onClose={() => setShowCreateCreditNoteModal(false)} 
      />
    </motion.div>
  );
}