'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiDollarSign,
  FiEdit,
  FiTrash2,
  // FiEye,
  FiSearch,
  FiFilter,
  // FiDownload,
  FiPlus,
  FiCopy,
  // FiSend,
  FiCheck,
  FiX,
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
  // FiLink,
  FiPercent,
  // FiRefreshCcw,
  FiRotateCw
} from 'react-icons/fi';

export default function AvoirAcompte() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('avoirs');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAvoir, setSelectedAvoir] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [editMode, setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [clientFilter, setClientFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [factureAcompteFilter, setFactureAcompteFilter] = useState('Tous');
  
  // Sample avoir d'acompte templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-AA001',
      nom: 'Avoir d\'Acompte Standard',
      description: 'Template d\'avoir d\'acompte standard',
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir d\'acompte standard...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture d\'acompte', content: 'Informations sur la facture d\'acompte d\'origine' },
        { id: 'motif', name: 'Motif d\'annulation', content: 'Explication de l\'annulation de l\'acompte' },
        { id: 'montant', name: 'Montant à rembourser', content: 'Détail du calcul du remboursement' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-AA002',
      nom: 'Avoir d\'Acompte Détaillé',
      description: 'Template d\'avoir d\'acompte avec descriptions détaillées',
      dateCreation: '05/02/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir d\'acompte détaillé...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture d\'acompte', content: 'Informations sur la facture d\'acompte d\'origine' },
        { id: 'devisRef', name: 'Référence devis', content: 'Informations sur le devis initial' },
        { id: 'motif', name: 'Motif détaillé d\'annulation', content: 'Explication détaillée de l\'annulation' },
        { id: 'detailProjet', name: 'Détails du projet annulé', content: 'Description du projet qui a été annulé' },
        { id: 'montant', name: 'Montant à rembourser', content: 'Détail du calcul du remboursement' },
        { id: 'modalites', name: 'Modalités de remboursement', content: 'Informations sur le processus de remboursement' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-AA003',
      nom: 'Avoir d\'Acompte Produits',
      description: 'Template pour remboursement d\'acompte sur commande de produits',
      dateCreation: '10/11/2024',
      derniereMaj: '20/02/2025',
      isDefault: false,
      category: 'Produits',
      htmlContent: '<div class="template">Contenu de l\'avoir d\'acompte produits...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture d\'acompte', content: 'Informations sur la facture d\'acompte d\'origine' },
        { id: 'products', name: 'Produits annulés', content: 'Liste des produits avec photos' },
        { id: 'motif', name: 'Motif d\'annulation', content: 'Raison de l\'annulation de la commande' },
        { id: 'montant', name: 'Montant à rembourser', content: 'Détail du calcul du remboursement' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-AA004',
      nom: 'Avoir d\'Acompte Minimaliste',
      description: 'Template simple et épuré pour avoirs d\'acompte',
      dateCreation: '05/01/2025',
      derniereMaj: '05/01/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir d\'acompte minimaliste...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture d\'acompte', content: 'Informations sur la facture d\'acompte d\'origine' },
        { id: 'montant', name: 'Montant à rembourser', content: 'Détail du calcul du remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    }
  ]);

  // Sample avoirs d'acompte data
  const [avoirsData ] = useState([
    {
      id: 'AAC-001',
      numero: 'AAC2025-0012',
      client: 'Acme Corp',
      date: '05/03/2025',
      montant: 750.00,
      pourcentage: 30,
      statut: 'Émis',
      template: 'TPL-AA001',
      reference: 'AVOIR-AC-2025-012',
      factureAcompteReference: 'AC2025-0045',
      devisReference: 'D2025-0125',
      projetAnnule: 'Refonte site web',
      motifAnnulation: 'Annulation du projet par le client',
      dateRemboursement: '20/03/2025',
      notes: 'Remboursement d\'acompte suite à annulation du projet',
      lastModified: '05/03/2025',
      createdBy: 'Jean Dupont',
      rembourse: false,
      dateRemboursementEffectif: null
    },
    {
      id: 'AAC-002',
      numero: 'AAC2025-0013',
      client: 'Zenith SA',
      date: '03/03/2025',
      montant: 1800.00,
      pourcentage: 40,
      statut: 'Remboursé',
      template: 'TPL-AA002',
      reference: 'AVOIR-AC-2025-013',
      factureAcompteReference: 'AC2025-0046',
      devisReference: 'D2025-0126',
      projetAnnule: 'Développement application mobile',
      motifAnnulation: 'Changement de fournisseur',
      dateRemboursement: '10/03/2025',
      notes: 'Remboursement d\'acompte suite à résiliation du contrat',
      lastModified: '04/03/2025',
      createdBy: 'Marie Martin',
      rembourse: true,
      dateRemboursementEffectif: '08/03/2025'
    },
    {
      id: 'AAC-003',
      numero: 'AAC2025-0014',
      client: 'Global Industries',
      date: '27/02/2025',
      montant: 6250.00,
      pourcentage: 50,
      statut: 'Brouillon',
      template: 'TPL-AA003',
      reference: 'AVOIR-AC-2025-014',
      factureAcompteReference: 'AC2025-0047',
      devisReference: 'D2025-0127',
      projetAnnule: 'Fourniture matériel informatique',
      motifAnnulation: 'Produits non disponibles',
      dateRemboursement: '15/03/2025',
      notes: 'Remboursement d\'acompte suite à rupture de stock',
      lastModified: '01/03/2025',
      createdBy: 'Pierre Dubois',
      rembourse: false,
      dateRemboursementEffectif: null
    },
    {
      id: 'AAC-004',
      numero: 'AAC2025-0015',
      client: 'Nexus Tech',
      date: '01/03/2025',
      montant: 800.00,
      pourcentage: 25,
      statut: 'En attente',
      template: 'TPL-AA004',
      reference: 'AVOIR-AC-2025-015',
      factureAcompteReference: 'AC2025-0048',
      devisReference: 'D2025-0128',
      projetAnnule: 'Maintenance annuelle',
      motifAnnulation: 'Service non adapté aux besoins',
      dateRemboursement: '15/03/2025',
      notes: 'Remboursement d\'acompte suite à malentendu sur les services',
      lastModified: '01/03/2025',
      createdBy: 'Jean Dupont',
      rembourse: false,
      dateRemboursementEffectif: null
    },
    {
      id: 'AAC-005',
      numero: 'AAC2025-0016',
      client: 'Tech Solutions',
      date: '20/02/2025',
      montant: 2680.00,
      pourcentage: 40,
      statut: 'Annulé',
      template: 'TPL-AA002',
      reference: 'AVOIR-AC-2025-016',
      factureAcompteReference: 'AC2025-0049',
      devisReference: 'D2025-0129',
      projetAnnule: 'Développement logiciel sur mesure',
      motifAnnulation: 'Reprise du projet, remboursement non nécessaire',
      dateRemboursement: null,
      notes: 'Avoir annulé car le projet a finalement été maintenu',
      lastModified: '25/02/2025',
      createdBy: 'Marie Martin',
      rembourse: false,
      dateRemboursementEffectif: null
    }
  ]);

  // Statistics
  const avoirsStatistics = [
    { title: "Total remboursements", value: `${avoirsData.filter(a => a.statut !== 'Annulé').reduce((sum, a) => sum + a.montant, 0).toLocaleString('fr-FR')} €`, icon: <FiDollarSign className="text-red-500" />, change: "Avoirs actifs" },
    { title: "En attente", value: avoirsData.filter(a => a.statut === 'Émis' || a.statut === 'En attente').length, icon: <FiClock className="text-amber-500" />, change: `${avoirsData.filter(a => a.statut === 'Émis' || a.statut === 'En attente').reduce((sum, a) => sum + a.montant, 0).toLocaleString('fr-FR')} €` },
    { title: "Taux moyen", value: `${Math.round(avoirsData.reduce((sum, a) => sum + a.pourcentage, 0) / avoirsData.length)}%`, icon: <FiPercent className="text-blue-500" />, change: "D'acompte remboursé" },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statutOptions = ['Tous', 'Brouillon', 'Émis', 'En attente', 'Remboursé', 'Annulé'];
  const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent', 'Trimestre en cours'];
  // const templateCategoryOptions = ['Tous', 'Services', 'Produits'];
  // const motifOptions = ['Tous', 'Annulation du projet', 'Changement de fournisseur', 'Produits non disponibles', 'Service non adapté', 'Autre'];

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

  // Set active avoir
  const setActiveAvoirHandler = (id: string) => {
    setSelectedAvoir(id === selectedAvoir ? null : id);
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

  // Get filtered avoirs
  const getFilteredAvoirs = () => {
    return avoirsData.filter(avoir => {
      const matchesSearch = 
        searchTerm === '' || 
        avoir.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        avoir.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        avoir.factureAcompteReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        avoir.projetAnnule.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Tous' || avoir.statut === statusFilter;
      const matchesClient = clientFilter === 'Tous' || avoir.client === clientFilter;
      const matchesTemplate = templateFilter === 'Tous' || avoir.template === templateFilter;
      const matchesFactureAcompte = factureAcompteFilter === 'Tous' || avoir.factureAcompteReference === factureAcompteFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesStatus && matchesClient && matchesTemplate && matchesFactureAcompte && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setClientFilter('Tous');
    setTemplateFilter('Tous');
    setFactureAcompteFilter('Tous');
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
      id: `TPL-AA00${templatesData.length + 1}`,
      nom: `${template.nom} (Copie)`,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false
    };
    
    setTemplatesData([...templatesData, newTemplate]);
  };

  // Delete template
  const deleteTemplate = (id: string) => {
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
      case 'Émis':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Remboursé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-3xl font-bold text-indigo-700 drop-shadow-md">
              Avoirs d&apos;Acompte
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos avoirs d&apos;acompte et modèles de documents
            </p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiRotateCw className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'avoirs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('avoirs');
                setSelectedTemplate(null);
                setSelectedAvoir(null);
                setEditMode(false);
              }}
            >
              Avoirs d&apos;Acompte
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedAvoir(null);
                setEditMode(false);
              }}
            >
              Modèles
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'parametres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('parametres');
                setSelectedTemplate(null);
                setSelectedAvoir(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Avoirs d'Acompte tab */}
          {activeTab === 'avoirs' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {avoirsStatistics.map((stat, index) => (
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
                <div className="w-full md:w-72 relative mb-4 md:mb-0">
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

                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer un avoir d&apos;acompte</span>
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
                        Facture d&apos;acompte
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={factureAcompteFilter}
                        onChange={(e) => setFactureAcompteFilter(e.target.value)}
                      >
                        <option value="Tous">Toutes</option>
                        {[...new Set(avoirsData.map(a => a.factureAcompteReference))].map((factureRef) => (
                          <option key={factureRef} value={factureRef}>{factureRef}</option>
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

              {/* Avoirs List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredAvoirs().map(avoir => (
                    <div 
                      key={avoir.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedAvoir === avoir.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveAvoirHandler(avoir.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{avoir.numero}</h3>
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(avoir.statut)}`}>
                          {avoir.statut}
                        </span>
                      </div>
                      <p className="text-gray-500 mb-2">{avoir.client}</p>
                      <p className="text-sm text-gray-600">Montant: {avoir.montant.toLocaleString('fr-FR')} €</p>
                      <p className="text-xs text-gray-400 mt-1">Dernière modification: {avoir.lastModified}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredAvoirs().map(avoir => (
                    <div 
                      key={avoir.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer flex justify-between items-center ${selectedAvoir === avoir.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveAvoirHandler(avoir.id)}
                    >
                      <div>
                        <h3 className="text-lg font-bold">{avoir.numero}</h3>
                        <p className="text-gray-500">{avoir.client}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(avoir.statut)}`}>
                          {avoir.statut}
                        </span>
                        <p className="text-sm text-gray-600">Montant: {avoir.montant.toLocaleString('fr-FR')} €</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content for Modèles tab */}
          {activeTab === 'modeles' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-700">Modèles d&apos;Avoir d&apos;Acompte</h2>
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>Ajouter un modèle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map(template => (
                  <div 
                    key={template.id} 
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedTemplate === template.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveTemplateHandler(template.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{template.nom}</h3>
                      {template.isDefault && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{template.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Créé le: {template.dateCreation}</p>
                  </div>
                ))}
              </div>
              {selectedTemplate && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow border">
                  {editMode ? (
                    <>
                      <h3 className="text-xl font-bold mb-4">Modifier le modèle</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nom du modèle</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded"
                          value={getTemplateById(selectedTemplate)?.nom || ''}
                          onChange={(e) => {
                            const updatedTemplates = templatesData.map(t => t.id === selectedTemplate ? { ...t, nom: e.target.value } : t);
                            setTemplatesData(updatedTemplates);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded"
                          value={getTemplateById(selectedTemplate)?.description || ''}
                          onChange={(e) => {
                            const updatedTemplates = templatesData.map(t => t.id === selectedTemplate ? { ...t, description: e.target.value } : t);
                            setTemplatesData(updatedTemplates);
                          }}
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button onClick={saveTemplateChanges} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                          <FiCheck />
                          <span>Sauvegarder</span>
                        </button>
                        <button onClick={toggleEditMode} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                          <FiX />
                          <span>Annuler</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">Détails du modèle</h3>
                      <p><strong>Nom:</strong> {getTemplateById(selectedTemplate)?.nom}</p>
                      <p><strong>Description:</strong> {getTemplateById(selectedTemplate)?.description}</p>
                      <p><strong>Date de création:</strong> {getTemplateById(selectedTemplate)?.dateCreation}</p>
                      <p><strong>Dernière mise à jour:</strong> {getTemplateById(selectedTemplate)?.derniereMaj}</p>
                      <div className="flex space-x-4 mt-4">
                        <button onClick={toggleEditMode} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                          <FiEdit />
                          <span>Modifier</span>
                        </button>
                        <button onClick={() => duplicateTemplate(selectedTemplate)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                          <FiCopy />
                          <span>Dupliquer</span>
                        </button>
                        <button onClick={() => deleteTemplate(selectedTemplate)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                          <FiTrash2 />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Paramètres</h2>
              <p className="text-gray-500">
                Ici vous pouvez configurer les paramètres liés aux avoirs d&apos;acompte et aux modèles.
              </p>
              {/* Add your parameters settings here */}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
