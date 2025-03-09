'use client';
import { useState } from 'react';
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
  FiDollarSign,
  FiClock,
  FiUser,
  FiRefreshCw,
  FiPrinter,
  FiLink,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';

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
    { title: "Total avoirs d'acompte", value: "4 950,00 €", icon: <FiDollarSign className="text-red-500" /> },
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold text-indigo-700 drop-shadow-md">
              Avoirs d&apos;acompte
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos avoirs sur factures d&apos;acompte
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3">{stat.icon}</div>
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
                placeholder="Rechercher un avoir d'acompte..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                <FiPlus />
                <span>Créer un avoir d&apos;acompte</span>
              </button>
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
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 p-4 border-t overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
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
                <button onClick={resetFilters} className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                  Réinitialiser
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
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
                    % facture
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture d&apos;acompte
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
                      <div className="text-sm font-medium text-indigo-600">{note.id}</div>
                      <div className="text-xs text-gray-500">
                        <span className="flex items-center">
                          <FiUser className="mr-1" size={12} />
                          {note.creePar}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{note.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{note.client}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{note.montant}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{note.pourcentage}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(note.statut)}`}>
                        {note.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600">
                      <div className="flex items-center">
                        <FiLink className="mr-1" size={12} />
                        {note.factureAcompte}
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun avoir d&apos;acompte trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun avoir d&apos;acompte ne correspond à vos critères de recherche.
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
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredNotes.length}</span> sur <span className="font-medium">{depositCreditNotes.length}</span> avoirs d&apos;acompte
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
    </motion.div>
  );
}
