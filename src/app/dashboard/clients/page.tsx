'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  // FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTag,
  FiRefreshCw,
  FiDownload,
  FiTrash2,
  FiEdit,
  FiEye,
  // FiCheckCircle,
  // FiXCircle
} from 'react-icons/fi';

export default function Clients() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedTag, setSelectedTag] = useState('Tous');
  const [selectedSource, setSelectedSource] = useState('Tous');
  
  // State for selected clients (for bulk actions)
  // const [selectedClients, setSelectedClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);

  const [selectAll, setSelectAll] = useState(false);

  // Sample client data
  const clients = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      entreprise: 'Acme Corp',
      ville: 'Paris',
      pays: 'France',
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
      statut: 'Actif',
      source: 'Recommandation',
      tags: ['Fidèle'],
      dernierContact: '03/03/2025',
      valeurTotale: '12,300 €'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Actif', 'Inactif', 'En attente'];
  const tagOptions = ['Tous', 'VIP', 'Fidèle', 'Nouveau', 'Prospect', 'International', 'Ancien'];
  const sourceOptions = ['Tous', 'Site Web', 'Référence', 'Salon', 'Publicité', 'Email', 'Partenaire', 'Réseau social', 'Conférence', 'Recommandation'];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
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
  const resetFilters = () => {
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
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
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

        {/* Clients Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Bulk Actions (visible when clients are selected) */}
          {selectedClients.length > 0 && (
            <div className="p-4 bg-indigo-50 border-b flex justify-between items-center">
              <div className="text-indigo-800">
                <span className="font-medium">{selectedClients.length}</span> client(s) sélectionné(s)
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                  <FiMail />
                  <span>Envoyer un email</span>
                </button>
                <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition flex items-center space-x-1">
                  <FiTag />
                  <span>Assigner un tag</span>
                </button>
                <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1">
                  <FiTrash2 />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Table */}
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
                    Nom & Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernier Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valeur
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedClients.includes(client.id)}
                          onChange={() => handleSelectClient(client.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {client.prenom.charAt(0)}{client.nom.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.prenom} {client.nom}
                          </div>
                          <div className="flex flex-col text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <FiMail className="text-gray-400" size={12} />
                              <span>{client.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiPhone className="text-gray-400" size={12} />
                              <span>{client.telephone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{client.entreprise}</div>
                      <div className="text-xs text-gray-500">Source: {client.source}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMapPin className="mr-1 text-gray-400" size={14} />
                        {client.ville}, {client.pays}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                        {client.statut}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {client.dernierContact}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.valeurTotale}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-indigo-600 hover:text-indigo-900" title="Voir">
                          <FiEye size={18} />
                        </button>
                        <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                          <FiEdit size={18} />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900" title="Supprimer">
                          <FiTrash2 size={18} />
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
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredClients.length}</span> sur <span className="font-medium">{clients.length}</span> clients
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