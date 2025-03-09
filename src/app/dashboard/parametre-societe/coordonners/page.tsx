'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiPhone,
  FiMail,
  FiUser,
  FiUsers,
  FiRefreshCw,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiUserPlus,
  FiCalendar,
  FiBriefcase
} from 'react-icons/fi';

export default function Coordonnees() {
  // State for active tab, filters, search and selections
  const [activeTab, setActiveTab] = useState('clients');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedTags, setSelectedTags] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sample clients data
  const clientsData = [
    {
      id: 'CLI-2025-001',
      nom: 'Acme Corp',
      type: 'Entreprise',
      categorie: 'Client',
      telephone: '+33 1 23 45 67 89',
      email: 'contact@acmecorp.fr',
      adresse: '25 Rue du Commerce, 75015 Paris',
      contact: 'Jean Dupont',
      tags: ['VIP', 'Tech'],
      statut: 'Actif',
      website: 'www.acmecorp.fr',
      dateCreation: '15/01/2022',
      noteInterne: 'Client fidèle depuis 3 ans'
    },
    {
      id: 'CLI-2025-002',
      nom: 'Nexus Tech',
      type: 'Entreprise',
      categorie: 'Client',
      telephone: '+33 1 34 56 78 90',
      email: 'info@nexustech.fr',
      adresse: "8 Avenue de l'Innovation, 69002 Lyon",
      contact: 'Marie Laurent',
      tags: ['Tech', 'Startup'],
      statut: 'Actif',
      website: 'www.nexustech.fr',
      dateCreation: '03/05/2023',
      noteInterne: 'Nouveau client avec potentiel de croissance'
    },
    {
      id: 'CLI-2025-003',
      nom: 'Zenith SA',
      type: 'Entreprise',
      categorie: 'Client',
      telephone: '+33 1 45 67 89 01',
      email: 'contact@zenithsa.fr',
      adresse: '12 Boulevard Saint-Michel, 75006 Paris',
      contact: 'Pierre Leroy',
      tags: ['Finance'],
      statut: 'Actif',
      website: 'www.zenithsa.fr',
      dateCreation: '20/06/2021',
      noteInterne: 'Rencontre régulière tous les trimestres'
    },
    {
      id: 'CLI-2025-004',
      nom: 'Global Industries',
      type: 'Entreprise',
      categorie: 'Prospect',
      telephone: '+33 1 56 78 90 12',
      email: 'contact@globalindustries.fr',
      adresse: "45 Rue de l'Industrie, 59000 Lille",
      contact: 'Sophie Dubois',
      tags: ['Industrie', 'International'],
      statut: 'En discussion',
      website: 'www.globalindustries.fr',
      dateCreation: '12/01/2024',
      noteInterne: 'Premier devis envoyé, en attente de retour'
    },
    {
      id: 'CLI-2025-005',
      nom: 'Tech Innovate',
      type: 'Entreprise',
      categorie: 'Client',
      telephone: '+33 1 67 89 01 23',
      email: 'hello@techinnovate.io',
      adresse: '3 Rue des Startups, 44000 Nantes',
      contact: 'Alexandre Martin',
      tags: ['Tech', 'Innovation', 'Startup'],
      statut: 'Actif',
      website: 'www.techinnovate.io',
      dateCreation: '05/08/2022',
      noteInterne: 'Client très réactif, privilégier les communications par email'
    },
    {
      id: 'CLI-2025-006',
      nom: 'Solutions Pro',
      type: 'Entreprise',
      categorie: 'Client',
      telephone: '+33 1 78 90 12 34',
      email: 'support@solutionspro.fr',
      adresse: '28 Avenue des Solutions, 33000 Bordeaux',
      contact: 'Claire Moreau',
      tags: ['Tech', 'Services'],
      statut: 'Actif',
      website: 'www.solutionspro.fr',
      dateCreation: '17/03/2022',
      noteInterne: 'Contrat de maintenance annuel renouvelable'
    },
    {
      id: 'CLI-2025-007',
      nom: 'Marie Dupont',
      type: 'Particulier',
      categorie: 'Client',
      telephone: '+33 6 12 34 56 78',
      email: 'marie.dupont@email.fr',
      adresse: '5 Rue du Parc, 75019 Paris',
      contact: '',
      tags: ['Particulier'],
      statut: 'Actif',
      website: '',
      dateCreation: '10/12/2023',
      noteInterne: 'Préfère être contactée en soirée'
    },
    {
      id: 'CLI-2025-008',
      nom: 'Data Services',
      type: 'Entreprise',
      categorie: 'Prospect',
      telephone: '+33 1 89 01 23 45',
      email: 'info@dataservices.fr',
      adresse: '17 Rue des Données, 67000 Strasbourg',
      contact: 'Thomas Bernard',
      tags: ['Tech', 'Data'],
      statut: 'En discussion',
      website: 'www.dataservices.fr',
      dateCreation: '03/02/2024',
      noteInterne: 'Intéressé par notre offre d\'analyse de données'
    },
    {
      id: 'CLI-2025-009',
      nom: 'Paul Durand',
      type: 'Particulier',
      categorie: 'Prospect',
      telephone: '+33 6 23 45 67 89',
      email: 'paul.durand@email.fr',
      adresse: '10 Allée des Roses, 13008 Marseille',
      contact: '',
      tags: ['Particulier'],
      statut: 'Nouveau contact',
      website: '',
      dateCreation: '25/02/2024',
      noteInterne: 'Demande d\'information suite au salon professionnel'
    }
  ];

  // Sample fournisseurs data
  const fournisseursData = [
    {
      id: 'FOU-2025-001',
      nom: 'Digital Services',
      type: 'Entreprise',
      categorie: 'Fournisseur',
      telephone: '+33 1 23 45 67 88',
      email: 'commercial@digitalservices.fr',
      adresse: '30 Rue de la Technologie, 75016 Paris',
      contact: 'Luc Girard',
      tags: ['Tech', 'Hébergement'],
      statut: 'Actif',
      website: 'www.digitalservices.fr',
      dateCreation: '10/01/2022',
      noteInterne: 'Services d\'hébergement et maintenance serveurs'
    },
    {
      id: 'FOU-2025-002',
      nom: 'Bureau Plus',
      type: 'Entreprise',
      categorie: 'Fournisseur',
      telephone: '+33 1 34 56 78 99',
      email: 'commandes@bureauplus.fr',
      adresse: '15 Avenue des Fournitures, 69003 Lyon',
      contact: 'Julie Blanc',
      tags: ['Fournitures', 'Bureau'],
      statut: 'Actif',
      website: 'www.bureauplus.fr',
      dateCreation: '05/06/2022',
      noteInterne: 'Livraison sous 48h, commande minimum 100€'
    },
    {
      id: 'FOU-2025-003',
      nom: 'Formation Experts',
      type: 'Entreprise',
      categorie: 'Fournisseur',
      telephone: '+33 1 45 67 89 00',
      email: 'contact@formationexperts.fr',
      adresse: '22 Rue des Savoirs, 33000 Bordeaux',
      contact: 'Marc Lefort',
      tags: ['Formation', 'RH'],
      statut: 'Actif',
      website: 'www.formationexperts.fr',
      dateCreation: '15/09/2021',
      noteInterne: 'Organisme de formation agréé'
    },
    {
      id: 'FOU-2025-004',
      nom: 'Green Workspace',
      type: 'Entreprise',
      categorie: 'Fournisseur',
      telephone: '+33 1 56 78 90 22',
      email: 'hello@greenworkspace.fr',
      adresse: '8 Rue Écologique, 44000 Nantes',
      contact: 'Élodie Verte',
      tags: ['Mobilier', 'Écologie'],
      statut: 'Inactif',
      website: 'www.greenworkspace.fr',
      dateCreation: '02/03/2023',
      noteInterne: 'Mobilier de bureau éco-responsable'
    },
    {
      id: 'FOU-2025-005',
      nom: 'SécuriNet',
      type: 'Entreprise',
      categorie: 'Fournisseur',
      telephone: '+33 1 67 89 01 33',
      email: 'pro@securinet.fr',
      adresse: '34 Avenue de la Sécurité, 75008 Paris',
      contact: 'Hugo Sécur',
      tags: ['Sécurité', 'Tech'],
      statut: 'Actif',
      website: 'www.securinet.fr',
      dateCreation: '20/11/2022',
      noteInterne: 'Services de cybersécurité et audit'
    }
  ];

  // Filter options
  const typeOptions = ['Tous', 'Entreprise', 'Particulier', 'Association', 'Administration'];
  const categoryOptions = ['Tous', 'Client', 'Prospect', 'Fournisseur', 'Partenaire'];
  const tagOptions = ['Tous', 'VIP', 'Tech', 'Finance', 'Startup', 'Innovation', 'Services', 'International', 'Particulier', 'Data', 'Hébergement', 'Fournitures', 'Bureau', 'Formation', 'RH', 'Mobilier', 'Écologie', 'Sécurité'];
  const statusOptions = ['Tous', 'Actif', 'Inactif', 'En discussion', 'Nouveau contact'];

  // Statistics
  const clientsStatistics = [
    { title: "Total clients", value: "172", icon: <FiUsers className="text-blue-500" />, change: "+5 ce mois" },
    { title: "Prospects", value: "28", icon: <FiUserPlus className="text-amber-500" />, change: "+3 ce mois" },
    { title: "Entreprises", value: "145", icon: <FiBriefcase className="text-indigo-500" />, change: "+4 ce mois" },
    { title: "Particuliers", value: "55", icon: <FiUser className="text-purple-500" />, change: "+1 ce mois" }
  ];

  const fournisseursStatistics = [
    { title: "Total fournisseurs", value: "47", icon: <FiBriefcase className="text-blue-500" />, change: "+2 ce mois" },
    { title: "Actifs", value: "39", icon: <FiCheck className="text-green-500" />, change: "+1 ce mois" },
    { title: "Inactifs", value: "8", icon: <FiX className="text-red-500" />, change: "+1 ce mois" },
    { title: "Récemment ajoutés", value: "4", icon: <FiCalendar className="text-indigo-500" />, change: "+2 ce mois" }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'clients') {
        setSelectedContacts(filteredClients.map(client => client.id));
      } else {
        setSelectedContacts(filteredFournisseurs.map(fournisseur => fournisseur.id));
      }
    } else {
      setSelectedContacts([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectItem = (itemId: string): void => {
    if (selectedContacts.includes(itemId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedContacts([...selectedContacts, itemId]);
    }
  };

  // Filter clients and fournisseurs based on search and selected filters
  const filteredClients = clientsData.filter(client => {
    const matchesSearch = 
      searchTerm === '' || 
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contact && client.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'Tous' || client.type === selectedType;
    const matchesCategory = selectedCategory === 'Tous' || client.categorie === selectedCategory;
    const matchesStatus = selectedStatus === 'Tous' || client.statut === selectedStatus;
    const matchesTags = selectedTags === 'Tous' || (client.tags && client.tags.includes(selectedTags));
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesTags;
  });

  const filteredFournisseurs = fournisseursData.filter(fournisseur => {
    const matchesSearch = 
      searchTerm === '' || 
      fournisseur.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fournisseur.contact && fournisseur.contact.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'Tous' || fournisseur.type === selectedType;
    const matchesCategory = selectedCategory === 'Tous' || fournisseur.categorie === selectedCategory;
    const matchesStatus = selectedStatus === 'Tous' || fournisseur.statut === selectedStatus;
    const matchesTags = selectedTags === 'Tous' || (fournisseur.tags && fournisseur.tags.includes(selectedTags));
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesTags;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedType('Tous');
    setSelectedCategory('Tous');
    setSelectedTags('Tous');
    setSelectedStatus('Tous');
    setSearchTerm('');
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'En discussion':
        return 'bg-amber-100 text-amber-800';
      case 'Nouveau contact':
        return 'bg-blue-100 text-blue-800';
      case 'Inactif':
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Coordonnées
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos contacts clients, prospects et fournisseurs
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiMapPin className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'clients' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('clients');
                setSelectedContacts([]);
                setSelectAll(false);
              }}
            >
              Clients &amp; Prospects
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'fournisseurs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('fournisseurs');
                setSelectedContacts([]);
                setSelectAll(false);
              }}
            >
              Fournisseurs &amp; Partenaires
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {(activeTab === 'clients' ? clientsStatistics : fournisseursStatistics).map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-2">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions & Search Bar */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              {/* Search */}
              <div className="w-full md:w-72 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Rechercher ${activeTab === 'clients' ? 'un client ou prospect' : 'un fournisseur ou partenaire'}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>{activeTab === 'clients' ? 'Ajouter un contact' : 'Ajouter un fournisseur'}</span>
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
                className="mt-4 p-4 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {typeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categoryOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedTags}
                      onChange={(e) => setSelectedTags(e.target.value)}
                    >
                      {tagOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
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

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div className="text-indigo-800">
                  <span className="font-medium">{selectedContacts.length}</span>{' '}
                  {activeTab === 'clients' ? 'contact(s)' : 'fournisseur(s)'} sélectionné(s)
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1">
                    <FiMessageSquare />
                    <span>Envoyer un message</span>
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                    <FiDownload />
                    <span>Exporter</span>
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1">
                    <FiTrash2 />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          <div className="px-6 pb-6">
            {/* Clients Tab */}
            {activeTab === 'clients' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredClients.map(client => (
                        <tr key={client.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiPhone className="h-4 w-4 text-gray-400 mr-1" />
                              {client.telephone}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiMail className="h-4 w-4 text-gray-400 mr-1" />
                              {client.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiMapPin className="h-4 w-4 text-gray-400 mr-1" />
                              {client.adresse}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {client.contact ? client.contact : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(client.statut)}`}>
                              {client.statut}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600"><FiEye /></button>
                              <button className="p-1 text-gray-400 hover:text-indigo-600"><FiEdit /></button>
                              <button className="p-1 text-gray-400 hover:text-red-600"><FiTrash2 /></button>
                              <button className="p-1 text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Fournisseurs Tab */}
            {activeTab === 'fournisseurs' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFournisseurs.map(fournisseur => (
                        <tr key={fournisseur.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={selectedContacts.includes(fournisseur.id)}
                              onChange={() => handleSelectItem(fournisseur.id)}
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{fournisseur.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                {fournisseur.type === 'Entreprise' ? (
                                  <FiBriefcase className="h-4 w-4 text-indigo-700" />
                                ) : (
                                  <FiUser className="h-4 w-4 text-indigo-700" />
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="font-medium">{fournisseur.nom}</div>
                                <div className="text-xs text-gray-500">
                                  {fournisseur.tags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center mr-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{fournisseur.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{fournisseur.categorie}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiPhone className="h-4 w-4 text-gray-400 mr-1" />
                              {fournisseur.telephone}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiMail className="h-4 w-4 text-gray-400 mr-1" />
                              {fournisseur.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiMapPin className="h-4 w-4 text-gray-400 mr-1" />
                              {fournisseur.adresse}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {fournisseur.contact ? fournisseur.contact : '-'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(fournisseur.statut)}`}>
                              {fournisseur.statut}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600"><FiEye /></button>
                              <button className="p-1 text-gray-400 hover:text-indigo-600"><FiEdit /></button>
                              <button className="p-1 text-gray-400 hover:text-red-600"><FiTrash2 /></button>
                              <button className="p-1 text-gray-400 hover:text-gray-600"><FiMoreVertical /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">1</span> à <span className="font-medium">
                    {activeTab === 'clients' ? filteredClients.length : filteredFournisseurs.length}
                  </span> sur <span className="font-medium">
                    {activeTab === 'clients' ? clientsData.length : fournisseursData.length}
                  </span> résultats
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Précédent
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
