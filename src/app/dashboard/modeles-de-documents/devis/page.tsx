'use client';
import {useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  // FiDownload,
  FiPlus,
  FiCopy,
  FiSend,
  // FiCheck,
  // FiX,
  // FiCalendar,
  FiClock,
  // FiRefreshCw,
  FiBarChart2,
  // FiCheckCircle,
  // FiAlertTriangle,
  // FiClipboard,
  FiList,
  FiGrid,
  // FiColumns,
  // FiMoreVertical
} from 'react-icons/fi';

export default function Devis() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('devis');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDevis, setSelectedDevis] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [editMode, setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [clientFilter, setClientFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  
  // Sample devis templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-001',
      nom: 'Devis Standard',
      description: 'Template de devis standard avec conditions générales',
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Services',
      htmlContent: '<div class="template">Contenu du devis standard...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'items', name: 'Lignes de devis', content: 'Tableau des prestations' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-002',
      nom: 'Devis Détaillé',
      description: 'Template de devis avec descriptions détaillées et options',
      dateCreation: '05/02/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu du devis détaillé...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'intro', name: 'Introduction', content: 'Présentation du projet' },
        { id: 'items', name: 'Lignes de devis', content: 'Tableau des prestations' },
        { id: 'options', name: 'Options', content: 'Options supplémentaires' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-003',
      nom: 'Devis Produits',
      description: 'Template spécifique pour la vente de produits',
      dateCreation: '10/11/2024',
      derniereMaj: '20/02/2025',
      isDefault: false,
      category: 'Produits',
      htmlContent: '<div class="template">Contenu du devis produits...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'products', name: 'Produits', content: 'Liste des produits avec photos' },
        { id: 'delivery', name: 'Livraison', content: 'Informations de livraison' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-004',
      nom: 'Devis Minimaliste',
      description: 'Template simple et épuré',
      dateCreation: '05/01/2025',
      derniereMaj: '05/01/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu du devis minimaliste...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'items', name: 'Lignes de devis', content: 'Tableau des prestations' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    }
  ]);

  // Sample devis data
  const [devisData ] = useState([
    {
      id: 'DEV-001',
      numero: 'D2025-0125',
      client: 'Acme Corp',
      date: '05/03/2025',
      dateExpiration: '05/04/2025',
      montant: 2500.00,
      statut: 'Envoyé',
      template: 'TPL-001',
      reference: 'PROJ-2025-042',
      notes: 'Devis pour projet de refonte site web',
      lastModified: '05/03/2025',
      createdBy: 'Jean Dupont',
      items: [
        { id: 1, designation: 'Refonte site web', quantite: 1, prixUnitaire: 2000, tva: 20, remise: 0 },
        { id: 2, designation: 'Hébergement annuel', quantite: 1, prixUnitaire: 500, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'DEV-002',
      numero: 'D2025-0126',
      client: 'Zenith SA',
      date: '03/03/2025',
      dateExpiration: '03/04/2025',
      montant: 4500.00,
      statut: 'Accepté',
      template: 'TPL-002',
      reference: 'PROJ-2025-043',
      notes: 'Devis pour développement application mobile',
      lastModified: '04/03/2025',
      createdBy: 'Marie Martin',
      items: [
        { id: 1, designation: 'Développement application iOS', quantite: 1, prixUnitaire: 2500, tva: 20, remise: 0 },
        { id: 2, designation: 'Développement application Android', quantite: 1, prixUnitaire: 2000, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'DEV-003',
      numero: 'D2025-0127',
      client: 'Global Industries',
      date: '27/02/2025',
      dateExpiration: '27/03/2025',
      montant: 12500.00,
      statut: 'Brouillon',
      template: 'TPL-003',
      reference: 'PROJ-2025-044',
      notes: 'Devis pour fourniture matériel informatique',
      lastModified: '01/03/2025',
      createdBy: 'Pierre Dubois',
      items: [
        { id: 1, designation: 'Ordinateurs portables', quantite: 5, prixUnitaire: 1500, tva: 20, remise: 5 },
        { id: 2, designation: 'Moniteurs 27"', quantite: 5, prixUnitaire: 300, tva: 20, remise: 0 },
        { id: 3, designation: 'Installation et configuration', quantite: 1, prixUnitaire: 1000, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'DEV-004',
      numero: 'D2025-0128',
      client: 'Nexus Tech',
      date: '01/03/2025',
      dateExpiration: '31/03/2025',
      montant: 3200.00,
      statut: 'En attente',
      template: 'TPL-001',
      reference: 'PROJ-2025-045',
      notes: 'Devis pour maintenance annuelle',
      lastModified: '01/03/2025',
      createdBy: 'Jean Dupont',
      items: [
        { id: 1, designation: 'Contrat maintenance annuel', quantite: 1, prixUnitaire: 3200, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'DEV-005',
      numero: 'D2025-0129',
      client: 'Tech Solutions',
      date: '20/02/2025',
      dateExpiration: '20/03/2025',
      montant: 6700.00,
      statut: 'Refusé',
      template: 'TPL-002',
      reference: 'PROJ-2025-040',
      notes: 'Devis pour développement logiciel sur mesure',
      lastModified: '25/02/2025',
      createdBy: 'Marie Martin',
      items: [
        { id: 1, designation: 'Analyse des besoins', quantite: 1, prixUnitaire: 1200, tva: 20, remise: 0 },
        { id: 2, designation: 'Développement module de gestion', quantite: 1, prixUnitaire: 4500, tva: 20, remise: 0 },
        { id: 3, designation: 'Formation utilisateurs', quantite: 1, prixUnitaire: 1000, tva: 20, remise: 0 }
      ]
    }
  ]);

  // Statistics
  const devisStatistics = [
    { title: "Montant total", value: `${devisData.reduce((sum, d) => d.statut !== 'Refusé' ? sum + d.montant : sum, 0).toLocaleString('fr-FR')} €`, icon: <FiDollarSign className="text-blue-500" />, change: "Devis actifs" },
    { title: "Devis en cours", value: devisData.filter(d => d.statut === 'Envoyé' || d.statut === 'En attente').length, icon: <FiClock className="text-amber-500" />, change: "En attente de réponse" },
    { title: "Taux de conversion", value: "60%", icon: <FiBarChart2 className="text-green-500" />, change: "En hausse de 5%" },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statutOptions = ['Tous', 'Brouillon', 'Envoyé', 'En attente', 'Accepté', 'Refusé'];
  const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent', 'Trimestre en cours'];
  // const templateCategoryOptions = ['Tous', 'Services', 'Produits'];

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'liste' ? 'grid' : 'liste');
  };

  // Set active template
  const setActiveTemplateHandler = (id: string) => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
    setEditMode(false);
  };

  // Set active devis
  const setActiveDevisHandler = (id: string) => {
    setSelectedDevis(id === selectedDevis ? null : id);
  };

  // Toggle edit mode
  // const toggleEditMode = () => {
  //   setEditMode(!editMode);
  // };

  // Get template by ID
  const getTemplateById = (id: string) => {
    return templatesData.find(template => template.id === id);
  };

  // Get filtered templates
  const getFilteredTemplates = () => {
    return templatesData.filter(template => {
      const matchesSearch = 
        searchTerm === '' || 
        template.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = templateFilter === 'Tous' || template.category === templateFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered devis
  const getFilteredDevis = () => {
    return devisData.filter(devis => {
      const matchesSearch = 
        searchTerm === '' || 
        devis.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis.client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Tous' || devis.statut === statusFilter;
      const matchesClient = clientFilter === 'Tous' || devis.client === clientFilter;
      const matchesTemplate = templateFilter === 'Tous' || devis.template === templateFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesStatus && matchesClient && matchesTemplate && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setClientFilter('Tous');
    setTemplateFilter('Tous');
    setDateRangeFilter('Tous');
  };

  // Save template changes
  const saveTemplateChanges = () => {
    // Implement save logic here
    setEditMode(false);
  };

  // Duplicate template
  const duplicateTemplate = (id: string) => {
    const template = getTemplateById(id);
    if (!template) return;
    
    const newTemplate = {
      ...template,
      id: `TPL-00${templatesData.length + 1}`,
      nom: `${template.nom} (Copie)`,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false
    };
    
    setTemplatesData([...templatesData, newTemplate]);
  };

  // Delete template
  const deleteTemplate = (id: string | null) => {
    setTemplatesData(templatesData.filter(template => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
      setEditMode(false);
    }
  };

  // Get status color
  const getStatusColor = (statut: string) => {
    switch(statut) {
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Envoyé':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-100"
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
              Devis
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos devis et modèles de documents
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'devis' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('devis');
                setSelectedTemplate(null);
                setSelectedDevis(null);
                setEditMode(false);
              }}
            >
              Devis
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedDevis(null);
                setEditMode(false);
              }}
            >
              Modèles
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setSelectedTemplate(null);
                setSelectedDevis(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Devis tab */}
          {activeTab === 'devis' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {devisStatistics.map((stat, index) => (
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

              {/* Actions & Search Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                {/* Search */}
                <div className="w-full md:w-72 relative mb-4 md:mb-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un devis..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer un devis</span>
                  </button>
                  <button 
                    onClick={toggleFilters}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    <FiFilter />
                    <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                  </button>
                  <button 
                    onClick={toggleViewMode}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    {viewMode === 'liste' ? <FiGrid /> : <FiList />}
                    <span className="hidden md:inline">{viewMode === 'liste' ? 'Vue grille' : 'Vue liste'}</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mb-6 p-4 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {statutOptions.map((option, index) => (
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
                        value={dateRangeFilter}
                        onChange={(e) => setDateRangeFilter(e.target.value)}
                      >
                        {dateRangeOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Modèle
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={templateFilter}
                        onChange={(e) => setTemplateFilter(e.target.value)}
                      >
                        <option value="Tous">Tous</option>
                        {templatesData.map((template) => (
                          <option key={template.id} value={template.id}>{template.nom}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Devis List - Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredDevis().map(devis => (
                    <div 
                      key={devis.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedDevis === devis.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveDevisHandler(devis.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{devis.numero}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(devis.statut)}`}>
                          {devis.statut}
                        </span>
                      </div>
                      <p className="text-gray-500 mb-2">{devis.client}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{devis.montant.toLocaleString('fr-FR')} €</span>
                        <span className="text-sm text-gray-500">{devis.date}</span>
                      </div>
                      {selectedDevis === devis.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                          <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                            <FiEye size={14} />
                            <span className="text-sm">Voir</span>
                          </button>
                          <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                            <FiEdit size={14} />
                            <span className="text-sm">Éditer</span>
                          </button>
                          <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition">
                            <FiCopy size={14} />
                            <span className="text-sm">Dupliquer</span>
                          </button>
                          <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition">
                            <FiSend size={14} />
                            <span className="text-sm">Envoyer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Devis List - List View */}
              {viewMode === 'liste' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Numéro
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredDevis().map(devis => (
                        <tr key={devis.id} className="border-t">
                          <td className="py-3 px-4 text-sm">{devis.numero}</td>
                          <td className="py-3 px-4 text-sm">{devis.client}</td>
                          <td className="py-3 px-4 text-sm">{devis.date}</td>
                          <td className="py-3 px-4 text-sm">{devis.montant.toLocaleString('fr-FR')} €</td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(devis.statut)}`}>
                              {devis.statut}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                                <FiEye size={14} />
                                <span className="text-xs">Voir</span>
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                                <FiEdit size={14} />
                                <span className="text-xs">Éditer</span>
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition">
                                <FiCopy size={14} />
                                <span className="text-xs">Dupliquer</span>
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition">
                                <FiSend size={14} />
                                <span className="text-xs">Envoyer</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Content for Modèles tab */}
          {activeTab === 'modeles' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Modèles de devis</h2>
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>Créer un modèle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map(template => (
                  <div key={template.id} className={`p-4 bg-white rounded-lg shadow border ${selectedTemplate === template.id ? 'border-indigo-500' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-bold">{template.nom}</h3>
                    <p className="text-gray-500 mb-2">{template.description}</p>
                    <div className="text-xs text-gray-400 mb-2">Créé le: {template.dateCreation}</div>
                    <div className="flex space-x-2">
                      <button onClick={() => setActiveTemplateHandler(template.id)} className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                        {selectedTemplate === template.id ? 'Sélectionné' : 'Sélectionner'}
                      </button>
                      <button onClick={() => duplicateTemplate(template.id)} className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                        <FiCopy size={14} />
                      </button>
                      <button onClick={() => deleteTemplate(template.id)} className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    {selectedTemplate === template.id && editMode && (
                      <div className="mt-4">
                        <textarea className="w-full p-2 border border-gray-300 rounded" defaultValue={template.htmlContent}></textarea>
                        <button onClick={saveTemplateChanges} className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                          Sauvegarder
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <p className="text-gray-600">
                Ici vous pouvez configurer les paramètres de l&apos;application de devis. 
                (Ajoutez ici vos composants ou formulaires de paramètres selon vos besoins.)
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
