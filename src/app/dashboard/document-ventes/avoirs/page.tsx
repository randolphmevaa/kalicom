'use client';
import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
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
  FiLink,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';

// Lazy load the modal component
const CreateCreditNoteModal = lazy(() => import('./CreateCreditNoteModal'));

// Loading fallback component for the modal
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
    <div className="fixed inset-0 bg-black/50"></div>
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto m-4 p-6 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700">Chargement en cours...</p>
      </div>
    </div>
  </div>
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
  
  // State for modal visibility
  const [showCreateCreditNoteModal, setShowCreateCreditNoteModal] = useState<boolean>(false);

  // Handler for opening the modal
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
                    Avoirs
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#1B0353] bg-[#1B0353]/10 rounded-full">
                    Remboursements
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez vos avoirs clients et remboursements. Suivez les montants crédités 
                  et associez-les facilement aux factures correspondantes.
                </p>
              </div>
              
              <div className="flex items-center bg-[#1B0353]/5 p-3 rounded-xl">
                <FiFileText className="w-6 h-6 text-[#1B0353]" />
                <span className="ml-2 text-[#1B0353] font-medium">Gestion des avoirs</span>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-purple-700">Astuce :</span>{' '}
                <span className="text-purple-700">
                  Les avoirs peuvent être créés à partir d&apos;une facture existante ou indépendamment. 
                  N&apos;oubliez pas de préciser la raison de l&apos;avoir pour votre comptabilité.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.title}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Actions & Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Search */}
            <div className="w-full md:w-72 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un avoir..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#1B0353' }}
              onClick={handleOpenCreateCreditNoteModal}
            >
              <FiPlus />
              <span>Créer un avoir</span>
            </motion.button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                <FiFilter />
                <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                <FiRefreshCw />
                <span className="hidden md:inline">Actualiser</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                <FiDownload />
                <span className="hidden md:inline">Exporter</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-4 border-t overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    {periodOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    {clientOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Appliquer les filtres
                </button>
              </div>
            </motion.div>
          )}
        </div>

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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° avoir
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture liée
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedNotes.includes(note.id)}
                          onChange={() => handleSelectNote(note.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-indigo-600">
                        {note.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center">
                          <FiUser className="mr-1" size={12} />
                          {note.creePar}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {note.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {note.client}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {note.montant}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(note.statut)}`}>
                        {note.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600">
                      <div className="flex items-center">
                        <FiLink className="mr-1" size={12} />
                        {note.facture}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-indigo-600 hover:text-indigo-900" title="Voir">
                          <FiEye size={18} />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                          <FiEdit size={18} />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-900" title="Télécharger">
                          <FiDownload size={18} />
                        </button>
                        <div className="relative">
                          <button className="p-1 text-gray-600 hover:text-gray-900" title="Plus d'options">
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty state */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun avoir trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun avoir ne correspond à vos critères de recherche.
              </p>
              <div className="mt-6">
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredNotes.length}</span> sur <span className="font-medium">{creditNotes.length}</span> avoirs
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Lazy loaded modal with Suspense */}
      {showCreateCreditNoteModal && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <CreateCreditNoteModal
            isOpen={showCreateCreditNoteModal} 
            onClose={() => setShowCreateCreditNoteModal(false)} 
          />
        </Suspense>
      )}
    </motion.div>
  );
}