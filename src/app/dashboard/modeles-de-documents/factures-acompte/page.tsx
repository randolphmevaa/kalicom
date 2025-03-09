'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiCopy,
  // FiSend,
  // FiCheck,
  // FiX,
  // FiCalendar,
  FiClock,
  // FiRefreshCw,
  // FiBarChart2,
  // FiCheckCircle,
  // FiAlertTriangle,
  // FiClipboard,
  FiList,
  FiGrid,
  // FiColumns,
  // FiMoreVertical,
  // FiArrowLeft,
  FiLink,
  FiPercent,
  // FiTarget
} from 'react-icons/fi';

export default function FacturesAcompte() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('factures');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedFacture, setSelectedFacture] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [editMode, setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [clientFilter, setClientFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [devisFilter, setDevisFilter] = useState('Tous');
  
  // Sample facture d'acompte templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-FA001',
      nom: 'Acompte Standard',
      description: 'Template de facture d\'acompte standard (30%)',
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de la facture d\'acompte standard...</div>',
      pourcentageDefaut: 30,
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'devisRef', name: 'Référence devis', content: 'Informations sur le devis lié' },
        { id: 'montant', name: 'Montant d\'acompte', content: 'Détail du calcul de l\'acompte' },
        { id: 'paiement', name: 'Modalités de paiement', content: 'Instructions de paiement' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-FA002',
      nom: 'Acompte Détaillé',
      description: 'Template de facture d\'acompte avec descriptions détaillées',
      dateCreation: '05/02/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de la facture d\'acompte détaillée...</div>',
      pourcentageDefaut: 40,
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'devisRef', name: 'Référence devis', content: 'Informations sur le devis lié' },
        { id: 'rappelProjet', name: 'Rappel du projet', content: 'Description détaillée du projet' },
        { id: 'montant', name: 'Montant d\'acompte', content: 'Détail du calcul de l\'acompte' },
        { id: 'echeancier', name: 'Échéancier prévisionnel', content: 'Calendrier des paiements futurs' },
        { id: 'paiement', name: 'Modalités de paiement', content: 'Instructions de paiement' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-FA003',
      nom: 'Acompte Produits',
      description: 'Template pour acompte sur commande de produits',
      dateCreation: '10/11/2024',
      derniereMaj: '20/02/2025',
      isDefault: false,
      category: 'Produits',
      htmlContent: '<div class="template">Contenu de la facture d\'acompte produits...</div>',
      pourcentageDefaut: 50,
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'devisRef', name: 'Référence devis', content: 'Informations sur le devis lié' },
        { id: 'products', name: 'Produits commandés', content: 'Liste des produits avec photos' },
        { id: 'montant', name: 'Montant d\'acompte', content: 'Détail du calcul de l\'acompte' },
        { id: 'livraison', name: 'Informations livraison', content: 'Délais et conditions de livraison' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de vente' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-FA004',
      nom: 'Acompte Minimaliste',
      description: 'Template simple et épuré pour factures d\'acompte',
      dateCreation: '05/01/2025',
      derniereMaj: '05/01/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de la facture d\'acompte minimaliste...</div>',
      pourcentageDefaut: 25,
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'devisRef', name: 'Référence devis', content: 'Informations sur le devis lié' },
        { id: 'montant', name: 'Montant d\'acompte', content: 'Détail du calcul de l\'acompte' },
        { id: 'paiement', name: 'Modalités de paiement', content: 'Instructions de paiement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    }
  ]);

  // Sample factures d'acompte data
  const [facturesData ] = useState([
    {
      id: 'FAC-001',
      numero: 'AC2025-0045',
      client: 'Acme Corp',
      date: '05/03/2025',
      montant: 750.0,
      pourcentage: 30,
      statut: 'Émise',
      template: 'TPL-FA001',
      reference: 'ACOMPTE-2025-045',
      devisReference: 'D2025-0125',
      devisMontant: 2500.0,
      projet: 'Refonte site web',
      echeance: '15/03/2025',
      notes: 'Premier acompte pour le projet de site web',
      lastModified: '05/03/2025',
      createdBy: 'Jean Dupont',
      paye: false,
      datePaiement: null,
      soldeFinal: false
    },
    {
      id: 'FAC-002',
      numero: 'AC2025-0046',
      client: 'Zenith SA',
      date: '03/03/2025',
      montant: 1800.0,
      pourcentage: 40,
      statut: 'Payée',
      template: 'TPL-FA002',
      reference: 'ACOMPTE-2025-046',
      devisReference: 'D2025-0126',
      devisMontant: 4500.0,
      projet: 'Développement application mobile',
      echeance: '10/03/2025',
      notes: 'Acompte initial pour le développement de l\'application',
      lastModified: '04/03/2025',
      createdBy: 'Marie Martin',
      paye: true,
      datePaiement: '07/03/2025',
      soldeFinal: false
    },
    {
      id: 'FAC-003',
      numero: 'AC2025-0047',
      client: 'Global Industries',
      date: '27/02/2025',
      montant: 6250.0,
      pourcentage: 50,
      statut: 'Brouillon',
      template: 'TPL-FA003',
      reference: 'ACOMPTE-2025-047',
      devisReference: 'D2025-0127',
      devisMontant: 12500.0,
      projet: 'Fourniture matériel informatique',
      echeance: '15/03/2025',
      notes: 'Acompte pour la commande de matériel',
      lastModified: '01/03/2025',
      createdBy: 'Pierre Dubois',
      paye: false,
      datePaiement: null,
      soldeFinal: false
    },
    {
      id: 'FAC-004',
      numero: 'AC2025-0048',
      client: 'Nexus Tech',
      date: '01/03/2025',
      montant: 800.0,
      pourcentage: 25,
      statut: 'En attente',
      template: 'TPL-FA004',
      reference: 'ACOMPTE-2025-048',
      devisReference: 'D2025-0128',
      devisMontant: 3200.0,
      projet: 'Maintenance annuelle',
      echeance: '15/03/2025',
      notes: 'Acompte pour démarrage du contrat annuel',
      lastModified: '01/03/2025',
      createdBy: 'Jean Dupont',
      paye: false,
      datePaiement: null,
      soldeFinal: false
    },
    {
      id: 'FAC-005',
      numero: 'AC2025-0049',
      client: 'Tech Solutions',
      date: '20/02/2025',
      montant: 2680.0,
      pourcentage: 40,
      statut: 'Annulée',
      template: 'TPL-FA002',
      reference: 'ACOMPTE-2025-049',
      devisReference: 'D2025-0129',
      devisMontant: 6700.0,
      projet: 'Développement logiciel sur mesure',
      echeance: '05/03/2025',
      notes: 'Acompte annulé suite au refus du devis',
      lastModified: '25/02/2025',
      createdBy: 'Marie Martin',
      paye: false,
      datePaiement: null,
      soldeFinal: false
    }
  ]);

  // Statistics
  const facturesStatistics = [
    { title: "Total acomptes", value: `${facturesData.filter(f => f.statut !== 'Annulée').reduce((sum, f) => sum + f.montant, 0).toLocaleString('fr-FR')} €`, icon: <FiDollarSign className="text-blue-500" />, change: "Factures actives" },
    { title: "En attente de paiement", value: facturesData.filter(f => f.statut === 'Émise' || f.statut === 'En attente').length, icon: <FiClock className="text-amber-500" />, change: `${facturesData.filter(f => f.statut === 'Émise' || f.statut === 'En attente').reduce((sum, f) => sum + f.montant, 0).toLocaleString('fr-FR')} €` },
    { title: "Taux moyen", value: `${Math.round(facturesData.reduce((sum, f) => sum + f.pourcentage, 0) / facturesData.length)}%`, icon: <FiPercent className="text-green-500" />, change: "D'acompte" },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statutOptions = ['Tous', 'Brouillon', 'Émise', 'En attente', 'Payée', 'Annulée'];
  const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent', 'Trimestre en cours'];
  // const templateCategoryOptions = ['Tous', 'Services', 'Produits'];
  // const pourcentageOptions = ['Tous', '25%', '30%', '40%', '50%', 'Autre'];

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

  // Set active facture
  const setActiveFactureHandler = (id: string) => {
    setSelectedFacture(id === selectedFacture ? null : id);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

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

  // Get filtered factures
  const getFilteredFactures = () => {
    return facturesData.filter(facture => {
      const matchesSearch = 
        searchTerm === '' || 
        facture.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.devisReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.projet.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Tous' || facture.statut === statusFilter;
      const matchesClient = clientFilter === 'Tous' || facture.client === clientFilter;
      const matchesTemplate = templateFilter === 'Tous' || facture.template === templateFilter;
      const matchesDevis = devisFilter === 'Tous' || facture.devisReference === devisFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesStatus && matchesClient && matchesTemplate && matchesDevis && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setClientFilter('Tous');
    setTemplateFilter('Tous');
    setDevisFilter('Tous');
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
      id: `TPL-FA00${templatesData.length + 1}`,
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
      case 'Émise':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format percentage
  const formatPercentage = (percent: number) => {
    return `${percent}%`;
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
              Factures d&apos;Acompte
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos factures d&apos;acompte et modèles de documents
            </p>
          </div>
          <div className="p-2 bg-amber-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'factures' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('factures');
                setSelectedTemplate(null);
                setSelectedFacture(null);
                setEditMode(false);
              }}
            >
              Factures d&apos;Acompte
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedFacture(null);
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
                setSelectedFacture(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Factures d'Acompte tab */}
          {activeTab === 'factures' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {facturesStatistics.map((stat, index) => (
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
                    placeholder="Rechercher une facture d'acompte..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer une facture d&apos;acompte</span>
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
                        Devis d&apos;origine
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={devisFilter}
                        onChange={(e) => setDevisFilter(e.target.value)}
                      >
                        <option value="Tous">Tous</option>
                        {[...new Set(facturesData.map(f => f.devisReference))].map((devisRef) => (
                          <option key={devisRef} value={devisRef}>{devisRef}</option>
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

              {/* Factures List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredFactures().map(facture => (
                    <div 
                      key={facture.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedFacture === facture.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveFactureHandler(facture.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{facture.numero}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(facture.statut)}`}>
                          {facture.statut}
                        </span>
                      </div>
                      <p className="text-gray-500 mb-2">{facture.client}</p>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <FiLink className="mr-1" size={14} />
                          <span className="text-sm text-gray-500">Devis: {facture.devisReference}</span>
                        </div>
                        <div className="flex items-center">
                          <FiPercent className="mr-1" size={14} />
                          <span className="text-sm font-medium">{formatPercentage(facture.pourcentage)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">{facture.montant.toLocaleString('fr-FR')} €</span>
                        <span className="text-sm text-gray-500">{facture.date}</span>
                      </div>
                      {selectedFacture === facture.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                          <button className="flex items-center space-x-1 text-sm text-blue-600">
                            <FiEye /><span>Voir</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-green-600">
                            <FiEdit /><span>Éditer</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-red-600">
                            <FiTrash2 /><span>Supprimer</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-600">
                            <FiDownload /><span>Télécharger</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredFactures().map(facture => (
                      <tr key={facture.id} className="cursor-pointer hover:bg-gray-100" onClick={() => setActiveFactureHandler(facture.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">{facture.numero}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{facture.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{facture.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{facture.montant.toLocaleString('fr-FR')} €</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${getStatusColor(facture.statut)}`}>{facture.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Content for Modèles tab */}
          {activeTab === 'modeles' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map(template => (
                  <div
                    key={template.id}
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedTemplate === template.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveTemplateHandler(template.id)}
                  >
                    <h3 className="text-lg font-bold">{template.nom}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                    <div className="mt-2 text-xs text-gray-400">Créé le: {template.dateCreation}</div>
                    <div className="text-xs text-gray-400">Modifié le: {template.derniereMaj}</div>
                    {selectedTemplate === template.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2">
                        <button className="flex items-center space-x-1 text-sm text-green-600" onClick={toggleEditMode}>
                          <FiEdit /><span>Éditer</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-blue-600" onClick={() => duplicateTemplate(template.id)}>
                          <FiCopy /><span>Dupliquer</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-red-600" onClick={() => deleteTemplate(template.id)}>
                          <FiTrash2 /><span>Supprimer</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {editMode && selectedTemplate && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow border">
                  <h4 className="text-lg font-bold mb-4">Modifier le modèle</h4>
                  {/* Simplified edit form */}
                  <input type="text" className="w-full p-2 border border-gray-300 rounded mb-4" placeholder="Nom du modèle" value={getTemplateById(selectedTemplate)?.nom || ''} readOnly />
                  <textarea className="w-full p-2 border border-gray-300 rounded mb-4" placeholder="Description" value={getTemplateById(selectedTemplate)?.description || ''} readOnly />
                  <div className="flex justify-end">
                    <button onClick={saveTemplateChanges} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Sauvegarder</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <p className="text-gray-600">Ici vous pouvez configurer les paramètres de vos factures d&apos;acompte.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
