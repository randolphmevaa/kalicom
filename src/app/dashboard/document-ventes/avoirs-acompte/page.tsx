'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateDepositCreditNoteModal from './CreateDepositCreditNoteModal';
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
  FiClock,
  // FiUser,
  // FiRefreshCw,
  FiPrinter,
  // FiLink,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
const HeaderHeroSection = dynamic(() => import('./HeaderHeroSection'), {
  ssr: false,
});
const StatisticsCards = dynamic(() => import('./StatisticsCards'), {
  ssr: false,
});
const DepositCreditNotesTable = dynamic(() => import('./DepositCreditNotesTable'), {
  ssr: false,
});
const ActionsSearchBar = dynamic(() => import('./ActionsSearchBar'), {
  ssr: false,
});

// Define an interface for a deposit credit note
interface DepositCreditNote {
  id: string;
  date: string;
  client: string;
  montant: string;
  statut: string;
  factureAcompte: string;
  pourcentage: string;
  raison: string;
  creePar: string;
  notes: string;
}

export default function AvoirAcompte() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Tous');
  const [selectedClient, setSelectedClient] = useState<string>('Tous');
  // Add this state in your AvoirAcompte component
const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  
  // State for selected deposit credit notes (for bulk actions)
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Sample deposit credit notes data
  const depositCreditNotes: DepositCreditNote[] = [
    {
      id: 'AAC-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montant: '1 500,00 €',
      statut: 'Émis',
      factureAcompte: 'FA-2025-001',
      pourcentage: '30%',
      raison: 'Modification de commande',
      creePar: 'Jean Martin',
      notes: 'Réduction du périmètre du projet'
    },
    {
      id: 'AAC-2025-002',
      date: '01/03/2025',
      client: 'Nexus Tech',
      montant: '300,00 €',
      statut: 'Traité',
      factureAcompte: 'FA-2025-002',
      pourcentage: '30%',
      raison: 'Remise commerciale',
      creePar: 'Sophie Leclerc',
      notes: 'Remise accordée suite à négociation'
    },
    {
      id: 'AAC-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montant: '500,00 €',
      statut: 'En attente',
      factureAcompte: 'FA-2025-003',
      pourcentage: '20%',
      raison: 'Changement de forfait',
      creePar: 'Thomas Bernard',
      notes: 'Passage à une offre inférieure'
    },
    {
      id: 'AAC-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montant: '400,00 €',
      statut: 'Émis',
      factureAcompte: 'FA-2025-004',
      pourcentage: '33%',
      raison: 'Réduction participants',
      creePar: 'Marie Dupont',
      notes: 'Réduction du nombre de participants à la formation'
    },
    {
      id: 'AAC-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montant: '1 500,00 €',
      statut: 'Traité',
      factureAcompte: 'FA-2025-005',
      pourcentage: '25%',
      raison: 'Modules non retenus',
      creePar: 'Jean Martin',
      notes: 'Retrait de certains modules du pack initial'
    },
    {
      id: 'AAC-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montant: '750,00 €',
      statut: 'Refusé',
      factureAcompte: 'FA-2025-006',
      pourcentage: '25%',
      raison: 'Demande après paiement',
      creePar: 'Sophie Leclerc',
      notes: 'Demande effectuée trop tard après paiement'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Émis', 'En attente', 'Traité', 'Refusé'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];
  const clientOptions = ['Tous', 'Acme Corp', 'Nexus Tech', 'Zenith SA', 'Global Industries', 'Tech Innovate', 'Solutions Pro'];

  // Statistics
  const statistics = [
    { title: "Total avoirs d'acompte", value: "4 950,00 €", icon: <FaEuroSign className="text-red-500" /> },
    { title: "En attente", value: "500,00 €", icon: <FiClock className="text-amber-500" /> },
    { title: "Émis", value: "1 900,00 €", icon: <FiInfo className="text-blue-500" /> },
    { title: "Traités", value: "1 800,00 €", icon: <FiCheckCircle className="text-green-500" /> }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedNotes(filteredNotes.map((note) => note.id));
    } else {
      setSelectedNotes([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectNote = (noteId: string) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
      setSelectAll(false);
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  // Filter deposit credit notes based on search and filter criteria
  const filteredNotes = depositCreditNotes.filter((note) => {
    const matchesSearch = 
      searchTerm === '' || 
      note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.factureAcompte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.raison.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || note.statut === selectedStatus;
    const matchesClient = selectedClient === 'Tous' || note.client === selectedClient;
    // Simplified period matching; in a real scenario, add proper date checks.
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

  // Get status badge color with an explicitly typed parameter
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 min-h-screen">
      <div className="pt-12 max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">

        {/* ---------- HEADER / HERO SECTION ---------- */}
        <HeaderHeroSection />

        {/* Statistics Cards */}
        <StatisticsCards statistics={statistics} />

        {/* Actions & Search Bar */}
        <ActionsSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsCreateModalOpen={setIsCreateModalOpen}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          statusOptions={statusOptions}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          periodOptions={periodOptions}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          clientOptions={clientOptions}
          resetFilters={resetFilters}
        />

        {/* Bulk Actions (visible when notes are selected) */}
        {selectedNotes.length > 0 && (
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
            <div className="text-indigo-800">
              <span className="font-medium">{selectedNotes.length}</span> avoir(s) d&apos;acompte sélectionné(s)
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

        {/* Deposit Credit Notes Table */}
        <DepositCreditNotesTable
          filteredNotes={filteredNotes}
          depositCreditNotes={depositCreditNotes}
          selectedNotes={selectedNotes}
          handleSelectAll={handleSelectAll}
          handleSelectNote={handleSelectNote}
          resetFilters={resetFilters}
          getStatusBadgeColor={getStatusBadgeColor}
        />
      </div>
      <CreateDepositCreditNoteModal 
      isOpen={isCreateModalOpen} 
      onClose={() => setIsCreateModalOpen(false)} 
    />
    </motion.div>
  );
}