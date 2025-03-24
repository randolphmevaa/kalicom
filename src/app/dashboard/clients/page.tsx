'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiMail,
  FiPhone,
  FiMapPin,
  FiTag,
  FiRefreshCw,
  FiDownload,
  FiTrash2,
  FiEdit,
  FiEye,
  FiActivity,
  FiDollarSign,
  FiUserCheck,
  // FiUserX,
  FiAward,
  FiCalendar,
  FiSend,
  FiX,
  FiFileText,
  FiCreditCard,
  FiClipboard
} from 'react-icons/fi';

// Define client interface
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  ville: string;
  pays: string;
  adresse: string;
  statut: string;
  source: string;
  tags: string[];
  dernierContact: string;
  valeurTotale: string;
}

// Define stats interface
interface Stats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  vipClients: number;
  totalValue: number;
  lastMonthNewClients: number;
}

// Define the document types for the modal
interface DocumentOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function Clients() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [selectedSource, setSelectedSource] = useState<string>('Tous');
  
  // State for selected clients (for bulk actions)
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // State for the send modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClientForModal, setSelectedClientForModal] = useState<Client | null>(null);

  // Stats calculations
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    pendingClients: 0,
    vipClients: 0,
    totalValue: 0,
    lastMonthNewClients: 3
  });

  // Sample client data
  const clients: Client[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      entreprise: 'Acme Corp',
      ville: 'Paris',
      pays: 'France',
      adresse: '123 Avenue des Champs-Élysées, 75008',
      statut: 'Actif',
      source: 'Site Web',
      tags: ['VIP', 'Fidèle'],
      dernierContact: '02/03/2025',
      valeurTotale: '15,600 €'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@example.com',
      telephone: '+33 6 23 45 67 89',
      entreprise: 'Nexus Tech',
      ville: 'Lyon',
      pays: 'France',
      adresse: '45 Rue de la République, 69002',
      statut: 'Actif',
      source: 'Référence',
      tags: ['Nouveau'],
      dernierContact: '28/02/2025',
      valeurTotale: '5,800 €'
    },
    {
      id: 3,
      nom: 'Leclerc',
      prenom: 'Sophie',
      email: 'sophie.leclerc@example.com',
      telephone: '+33 6 34 56 78 90',
      entreprise: 'Zenith SA',
      ville: 'Marseille',
      pays: 'France',
      adresse: '187 Quai du Port, 13002',
      statut: 'Inactif',
      source: 'Salon',
      tags: ['Prospect'],
      dernierContact: '15/02/2025',
      valeurTotale: '0 €'
    },
    {
      id: 4,
      nom: 'Bernard',
      prenom: 'Thomas',
      email: 'thomas.bernard@example.com',
      telephone: '+33 6 45 67 89 01',
      entreprise: 'Global Industries',
      ville: 'Bordeaux',
      pays: 'France',
      adresse: '28 Cours du Chapeau Rouge, 33000',
      statut: 'Actif',
      source: 'Publicité',
      tags: ['VIP', 'International'],
      dernierContact: '05/03/2025',
      valeurTotale: '24,750 €'
    },
    {
      id: 5,
      nom: 'Petit',
      prenom: 'Julie',
      email: 'julie.petit@example.com',
      telephone: '+33 6 56 78 90 12',
      entreprise: 'Tech Innovate',
      ville: 'Toulouse',
      pays: 'France',
      adresse: '12 Place du Capitole, 31000',
      statut: 'En attente',
      source: 'Email',
      tags: ['Prospect'],
      dernierContact: '25/02/2025',
      valeurTotale: '1,200 €'
    },
    {
      id: 6,
      nom: 'Moreau',
      prenom: 'Pierre',
      email: 'pierre.moreau@example.com',
      telephone: '+33 6 67 89 01 23',
      entreprise: 'Eco Solutions',
      ville: 'Nantes',
      pays: 'France',
      adresse: '4 Rue Crébillon, 44000',
      statut: 'Actif',
      source: 'Partenaire',
      tags: ['Fidèle'],
      dernierContact: '01/03/2025',
      valeurTotale: '8,900 €'
    },
    {
      id: 7,
      nom: 'Lefebvre',
      prenom: 'Emma',
      email: 'emma.lefebvre@example.com',
      telephone: '+33 6 78 90 12 34',
      entreprise: 'Design Studio',
      ville: 'Lille',
      pays: 'France',
      adresse: '76 Rue de Paris, 59800',
      statut: 'Inactif',
      source: 'Site Web',
      tags: ['Ancien'],
      dernierContact: '10/01/2025',
      valeurTotale: '3,500 €'
    },
    {
      id: 8,
      nom: 'Garcia',
      prenom: 'Lucas',
      email: 'lucas.garcia@example.com',
      telephone: '+33 6 89 01 23 45',
      entreprise: 'Media Group',
      ville: 'Strasbourg',
      pays: 'France',
      adresse: '23 Place Kléber, 67000',
      statut: 'Actif',
      source: 'Réseau social',
      tags: ['Nouveau', 'International'],
      dernierContact: '28/02/2025',
      valeurTotale: '6,200 €'
    },
    {
      id: 9,
      nom: 'Girard',
      prenom: 'Léa',
      email: 'lea.girard@example.com',
      telephone: '+33 6 90 12 34 56',
      entreprise: 'Finance Conseil',
      ville: 'Nice',
      pays: 'France',
      adresse: '15 Promenade des Anglais, 06000',
      statut: 'En attente',
      source: 'Conférence',
      tags: ['Prospect', 'VIP'],
      dernierContact: '18/02/2025',
      valeurTotale: '2,100 €'
    },
    {
      id: 10,
      nom: 'Roux',
      prenom: 'Antoine',
      email: 'antoine.roux@example.com',
      telephone: '+33 6 01 23 45 67',
      entreprise: 'Santé Plus',
      ville: 'Montpellier',
      pays: 'France',
      adresse: '8 Rue Foch, 34000',
      statut: 'Actif',
      source: 'Recommandation',
      tags: ['Fidèle'],
      dernierContact: '03/03/2025',
      valeurTotale: '12,300 €'
    }
  ];

  // Document options for the modal
  const documentOptions: DocumentOption[] = [
    {
      id: 'facture',
      title: 'Envoyer une facture',
      icon: <FiFileText className="w-6 h-6 text-blue-600" />,
      description: 'Envoyer une facture standard au client'
    },
    {
      id: 'devis',
      title: 'Envoyer un devis',
      icon: <FiClipboard className="w-6 h-6 text-green-600" />,
      description: 'Envoyer un devis pour une prestation ou des produits'
    },
    {
      id: 'avoir',
      title: 'Envoyer un avoir',
      icon: <FiCreditCard className="w-6 h-6 text-purple-600" />,
      description: 'Émettre un avoir pour un remboursement ou annulation'
    },
    {
      id: 'factureAcompte',
      title: 'Envoyer une facture d\'acompte',
      icon: <FiFileText className="w-6 h-6 text-orange-600" />,
      description: 'Envoyer une facture pour un paiement partiel anticipé'
    },
    {
      id: 'avoirAcompte',
      title: 'Envoyer un avoir d\'acompte',
      icon: <FiCreditCard className="w-6 h-6 text-red-600" />,
      description: 'Émettre un avoir pour un acompte déjà versé'
    }
  ];

  // Calculate statistics based on client data
  useEffect(() => {
    const activeClients = clients.filter(client => client.statut === 'Actif').length;
    const inactiveClients = clients.filter(client => client.statut === 'Inactif').length;
    const pendingClients = clients.filter(client => client.statut === 'En attente').length;
    const vipClients = clients.filter(client => client.tags.includes('VIP')).length;
    
    // Calculate total value
    const totalValue = clients.reduce((total, client) => {
      const value = parseFloat(client.valeurTotale.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      return total + value;
    }, 0);
    
    setStats({
      totalClients: clients.length,
      activeClients,
      inactiveClients,
      pendingClients,
      vipClients,
      totalValue,
      lastMonthNewClients: 3
    });
  }, [clients]);

  // Filter options
  const statusOptions: string[] = ['Tous', 'Actif', 'Inactif', 'En attente'];
  const tagOptions: string[] = ['Tous', 'VIP', 'Fidèle', 'Nouveau', 'Prospect', 'International', 'Ancien'];
  const sourceOptions: string[] = ['Tous', 'Site Web', 'Référence', 'Salon', 'Publicité', 'Email', 'Partenaire', 'Réseau social', 'Conférence', 'Recommandation'];

  // Handler for toggling all checkboxes
  const handleSelectAll = (): void => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectClient = (clientId: number): void => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
      setSelectAll(false);
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  // Handler for opening send modal
  const handleOpenSendModal = (client: Client): void => {
    setSelectedClientForModal(client);
    setIsModalOpen(true);
  };

  // Handler for closing send modal
  const handleCloseSendModal = (): void => {
    setIsModalOpen(false);
    setSelectedClientForModal(null);
  };

  // Handler for document selection in modal
  const handleSendDocument = (documentType: string): void => {
    // Here you would implement the logic to send the document
    console.log(`Sending ${documentType} to ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    
    // Close the modal after sending
    handleCloseSendModal();

    // For demo purposes, we'll just close the modal
    setTimeout(() => {
      alert(`${documentType} envoyé à ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    }, 500);
  };

  // Filter clients based on search and filter criteria
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchTerm === '' || 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || client.statut === selectedStatus;
    
    const matchesTag = selectedTag === 'Tous' || client.tags.includes(selectedTag);
    
    const matchesSource = selectedSource === 'Tous' || client.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesTag && matchesSource;
  });

  // Reset filters
  const resetFilters = (): void => {
    setSelectedStatus('Tous');
    setSelectedTag('Tous');
    setSelectedSource('Tous');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Format value for display
  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
              style={{ color: "#1B0353" }}
            >
              Clients
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez votre base de clients et leurs informations
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Statistics Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-green-500 font-bold">+{stats.lastMonthNewClients}</span> nouveaux ce mois
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <FiCalendar className="inline mr-1" size={12} /> Mise à jour: aujourd&apos;hui
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active/Inactive Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients Actifs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeClients}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.activeClients / stats.totalClients) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  {Math.round((stats.activeClients / stats.totalClients) * 100)}% du total
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-red-500 font-bold">{stats.inactiveClients}</span> inactifs
                </div>
              </div>
            </div>
          </motion.div>

          {/* VIP Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients VIP</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.vipClients}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiAward className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(stats.vipClients / stats.totalClients) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  {Math.round((stats.vipClients / stats.totalClients) * 100)}% du total
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-amber-500 font-bold">{stats.pendingClients}</span> en attente
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Value */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatValue(stats.totalValue)}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-green-500 font-bold">+12%</span> vs dernier trimestre
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <FiActivity className="inline mr-1" size={12} /> Croissance stable
                </div>
              </div>
            </div>
          </motion.div>
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
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-sm">
                <FiPlus />
                <span>Ajouter un client</span>
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
              
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                  <FiDownload />
                  <span className="hidden md:inline">Exporter</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg className="mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 7H7v2h6V7zm0 4H7v2h6v-2z" />
                        <path fillRule="evenodd" d="M3 3a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2 0v14h10V3H5z" clipRule="evenodd" />
                      </svg>
                      Exporter en PDF
                    </button>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <svg className="mr-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v4h1a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2h1V4zm2 0v4h6V4H7zm9 6H4v5h12v-5z" clipRule="evenodd" />
                      </svg>
                      Exporter en CSV
                    </button>
                  </div>
                </div>
              </div>
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
                    Tag
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    {tagOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    {sourceOptions.map((option, index) => (
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

        {/* Clients Table/Cards Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Bulk Actions (visible when clients are selected) */}
          {selectedClients.length > 0 && (
            <div className="p-4 bg-indigo-50 border-b flex flex-col sm:flex-row justify-between gap-3 items-center">
              <div className="text-indigo-800 font-medium">
                <span className="font-bold">{selectedClients.length}</span> client(s) sélectionné(s)
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm">
                  <FiMail />
                  <span>Email</span>
                </button>
                <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1 shadow-sm">
                  <FiTag />
                  <span>Assigner tag</span>
                </button>
                <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 shadow-sm">
                  <FiTrash2 />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block w-full">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-2 py-3 text-left w-10">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Nom & Contact
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                    Entreprise
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Localisation
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Code Postal
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Statut
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Tags
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Dernier Contact
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Valeur Due
                  </th>
                  <th scope="col" className="px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client, index) => {
                  // Extract ZIP code from address - assuming it's at the end
                  const zipCodeMatch = client.adresse.match(/\d{5}$/);
                  const zipCode = zipCodeMatch ? zipCodeMatch[0] : "";
                  
                  // Format address without ZIP code
                  const addressWithoutZip = client.adresse.replace(/, \d{5}$/, '');
                  
                  return (
                    <tr key={client.id} className={`hover:bg-indigo-50 transition duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-2 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                          />
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-sm">
                            {client.prenom.charAt(0)}{client.nom.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 break-words">
                              {client.prenom} {client.nom}
                            </div>
                            <div className="flex flex-col text-xs text-gray-500">
                              <div className="flex items-center space-x-1 break-words">
                                <FiMail className="text-gray-400 flex-shrink-0" size={12} />
                                <span className="break-all">{client.email}</span>
                              </div>
                              <div className="flex items-center space-x-1 break-words">
                                <FiPhone className="text-gray-400 flex-shrink-0" size={12} />
                                <span>{client.telephone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="text-sm font-medium text-gray-900 break-words">{client.entreprise}</div>
                        <div className="text-xs text-gray-500 break-words">Source: {client.source}</div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center text-sm text-gray-900 break-words">
                          <FiMapPin className="mr-1 text-gray-400 flex-shrink-0" size={14} />
                          <span className="break-words">{client.ville}, {client.pays}</span>
                        </div>
                        <div className="text-xs text-gray-500 break-words">{addressWithoutZip}</div>
                      </td>
                      <td className="px-2 py-4">
                        <div className="text-sm font-medium text-gray-900">{zipCode}</div>
                      </td>
                      <td className="px-2 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                          {client.statut}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex flex-wrap gap-1">
                          {client.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full break-words">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-900">
                        {client.dernierContact}
                      </td>
                      <td className="px-2 py-4 text-sm font-medium text-gray-900">
                        {client.valeurTotale}
                      </td>
                      <td className="px-2 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-1">
                          {/* New Send Button */}
                          <button 
                            onClick={() => handleOpenSendModal(client)}
                            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full transition duration-150" 
                            title="Envoyer au client"
                          >
                            <FiSend size={16} />
                          </button>
                          <button className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition duration-150" title="Voir">
                            <FiEye size={16} />
                          </button>
                          <button className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition duration-150" title="Modifier">
                            <FiEdit size={16} />
                          </button>
                          <button className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition duration-150" title="Supprimer">
                            <FiTrash2 size={16} />
                          </button>
                          <div className="relative">
                            <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition duration-150" title="Plus d'options">
                              <FiMoreVertical size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View (shown only on mobile) */}
          <div className="md:hidden">
            {filteredClients.map((client) => {
              // Extract ZIP code from address
              const zipCodeMatch = client.adresse.match(/\d{5}$/);
              const zipCode = zipCodeMatch ? zipCodeMatch[0] : "";
              
              // Format address without ZIP code
              const addressWithoutZip = client.adresse.replace(/, \d{5}$/, '');
              
              return (
                <div key={client.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                      />
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                        {client.prenom.charAt(0)}{client.nom.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">{client.prenom} {client.nom}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{client.entreprise}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                        {client.statut}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 gap-2 ml-8">
                    <div className="flex items-center text-sm">
                      <FiMail className="text-gray-400 flex-shrink-0 mr-2" size={14} />
                      <span className="text-gray-600 break-all">{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiPhone className="text-gray-400 flex-shrink-0 mr-2" size={14} />
                      <span className="text-gray-600">{client.telephone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiMapPin className="text-gray-400 flex-shrink-0 mr-2" size={14} />
                      <span className="text-gray-600 break-words">{client.ville}, {client.pays}</span>
                    </div>
                    <div className="flex items-center text-sm ml-6">
                      <span className="text-gray-600 break-words">{addressWithoutZip}</span>
                    </div>
                    <div className="flex items-center text-sm ml-6">
                      <span className="text-gray-600 font-medium">Code postal: {zipCode}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 ml-8">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {client.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Valeur due:</span> <span className="font-medium">{client.valeurTotale}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Dernier contact:</span> <span>{client.dernierContact}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end space-x-2">
                    {/* New Send Button for mobile */}
                    <button 
                      onClick={() => handleOpenSendModal(client)}
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-full transition duration-150" 
                      title="Envoyer au client"
                    >
                      <FiSend size={18} />
                    </button>
                    <button className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-full transition duration-150" title="Voir">
                      <FiEye size={18} />
                    </button>
                    <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition duration-150" title="Modifier">
                      <FiEdit size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition duration-150" title="Supprimer">
                      <FiTrash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition duration-150" title="Plus d'options">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Empty state */}
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun client trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun client ne correspond à vos critères de recherche.
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
          <nav className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
            <div className="mb-3 sm:mb-0">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredClients.length}</span> sur <span className="font-medium">{clients.length}</span> clients
              </p>
            </div>
            <div className="flex justify-between gap-3">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition">
                Précédent
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition">
                Suivant
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Send Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={handleCloseSendModal}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden">
                  {/* Modal Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">
                      Envoyer au client: {selectedClientForModal?.prenom} {selectedClientForModal?.nom}
                    </h3>
                    <button 
                      onClick={handleCloseSendModal}
                      className="text-white hover:bg-white/20 rounded-full p-1 transition"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Sélectionnez le type de document à envoyer à {selectedClientForModal?.prenom} {selectedClientForModal?.nom}
                    </p>
                    
                    <div className="grid gap-3">
                      {documentOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSendDocument(option.title)}
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
                        >
                          <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-white">
                            {option.icon}
                          </div>
                          <div className="ml-4 text-left">
                            <h4 className="font-medium text-gray-900">{option.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-gray-50 flex justify-end">
                    <button 
                      onClick={handleCloseSendModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
