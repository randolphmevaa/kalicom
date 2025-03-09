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
  // FiDownload,
  FiPlus,
  FiCopy,
  FiSend,
  FiClock,
  FiBarChart2,
  FiList,
  FiGrid,
  FiLink
} from 'react-icons/fi';

interface Template {
  id: string;
  nom: string;
  description: string;
  dateCreation: string;
  derniereMaj: string;
  isDefault: boolean;
  category: string;
  htmlContent: string;
  sections: {
    id: string;
    name: string;
    content: string;
  }[];
}


export default function Avoirs() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('avoirs');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedAvoir, setSelectedAvoir] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [ , setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [clientFilter, setClientFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [factureFilter, setFactureFilter] = useState('Tous');
  
  // Sample avoir templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-A001',
      nom: 'Avoir Standard',
      description: "Template d'avoir standard avec conditions générales",
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir standard...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture', content: "Informations sur la facture d'origine" },
        { id: 'items', name: "Lignes d'avoir", content: 'Tableau des prestations remboursées' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-A002',
      nom: 'Avoir Détaillé',
      description: "Template d'avoir avec descriptions détaillées et motifs",
      dateCreation: '05/02/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir détaillé...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture', content: "Informations sur la facture d'origine" },
        { id: 'motif', name: 'Motif de remboursement', content: 'Explication détaillée du motif' },
        { id: 'items', name: "Lignes d'avoir", content: 'Tableau des prestations remboursées' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de remboursement' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-A003',
      nom: 'Avoir Produits',
      description: "Template spécifique pour le remboursement de produits",
      dateCreation: '10/11/2024',
      derniereMaj: '20/02/2025',
      isDefault: false,
      category: 'Produits',
      htmlContent: '<div class="template">Contenu de l\'avoir produits...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture', content: "Informations sur la facture d'origine" },
        { id: 'products', name: 'Produits retournés', content: 'Liste des produits avec photos' },
        { id: 'conditions', name: 'Conditions', content: 'Conditions générales de retour' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    },
    {
      id: 'TPL-A004',
      nom: 'Avoir Minimaliste',
      description: "Template simple et épuré pour les avoirs",
      dateCreation: '05/01/2025',
      derniereMaj: '05/01/2025',
      isDefault: false,
      category: 'Services',
      htmlContent: '<div class="template">Contenu de l\'avoir minimaliste...</div>',
      sections: [
        { id: 'header', name: 'En-tête', content: 'Logo, coordonnées, etc.' },
        { id: 'client', name: 'Informations client', content: 'Nom, adresse, etc.' },
        { id: 'factureRef', name: 'Référence facture', content: "Informations sur la facture d'origine" },
        { id: 'items', name: "Lignes d'avoir", content: 'Tableau simplifié des remboursements' },
        { id: 'footer', name: 'Pied de page', content: 'Signature, mentions légales' }
      ]
    }
  ]);

  // Sample avoirs data
  const [avoirsData ] = useState([
    {
      id: 'AV-001',
      numero: 'A2025-0023',
      client: 'Acme Corp',
      date: '05/03/2025',
      montant: 500.00,
      statut: 'Émis',
      template: 'TPL-A001',
      reference: 'AVOIR-2025-023',
      factureOrigine: 'F2025-0088',
      motif: 'Correction de facturation',
      notes: 'Remboursement partiel suite à une erreur de tarification',
      lastModified: '05/03/2025',
      createdBy: 'Jean Dupont',
      items: [
        { id: 1, designation: 'Hébergement annuel', quantite: 1, prixUnitaire: 500, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'AV-002',
      numero: 'A2025-0024',
      client: 'Zenith SA',
      date: '03/03/2025',
      montant: 1200.00,
      statut: 'Comptabilisé',
      template: 'TPL-A002',
      reference: 'AVOIR-2025-024',
      factureOrigine: 'F2025-0075',
      motif: 'Annulation de service',
      notes: 'Remboursement pour prestation non réalisée',
      lastModified: '04/03/2025',
      createdBy: 'Marie Martin',
      items: [
        { id: 1, designation: 'Développement sur mesure', quantite: 1, prixUnitaire: 1200, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'AV-003',
      numero: 'A2025-0025',
      client: 'Global Industries',
      date: '27/02/2025',
      montant: 3500.00,
      statut: 'Brouillon',
      template: 'TPL-A003',
      reference: 'AVOIR-2025-025',
      factureOrigine: 'F2025-0062',
      motif: 'Retour produits défectueux',
      notes: 'Remboursement pour matériel défectueux',
      lastModified: '01/03/2025',
      createdBy: 'Pierre Dubois',
      items: [
        { id: 1, designation: 'Ordinateurs portables', quantite: 2, prixUnitaire: 1500, tva: 20, remise: 0 },
        { id: 2, designation: 'Frais de retour', quantite: 1, prixUnitaire: 500, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'AV-004',
      numero: 'A2025-0026',
      client: 'Nexus Tech',
      date: '01/03/2025',
      montant: 800.00,
      statut: 'En attente',
      template: 'TPL-A001',
      reference: 'AVOIR-2025-026',
      factureOrigine: 'F2025-0080',
      motif: 'Résiliation anticipée',
      notes: 'Remboursement partiel suite à résiliation',
      lastModified: '01/03/2025',
      createdBy: 'Jean Dupont',
      items: [
        { id: 1, designation: 'Contrat maintenance - remboursement partiel', quantite: 1, prixUnitaire: 800, tva: 20, remise: 0 }
      ]
    },
    {
      id: 'AV-005',
      numero: 'A2025-0027',
      client: 'Tech Solutions',
      date: '20/02/2025',
      montant: 1700.00,
      statut: 'Annulé',
      template: 'TPL-A002',
      reference: 'AVOIR-2025-027',
      factureOrigine: 'F2025-0055',
      motif: 'Double facturation',
      notes: 'Avoir créé par erreur - annulé',
      lastModified: '25/02/2025',
      createdBy: 'Marie Martin',
      items: [
        { id: 1, designation: 'Analyse des besoins', quantite: 1, prixUnitaire: 1200, tva: 20, remise: 0 },
        { id: 2, designation: 'Formation utilisateurs', quantite: 1, prixUnitaire: 500, tva: 20, remise: 0 }
      ]
    }
  ]);

  // Statistics
  const avoirsStatistics = [
    { title: "Montant total", value: `${avoirsData.reduce((sum, a) => a.statut !== 'Annulé' ? sum + a.montant : sum, 0).toLocaleString('fr-FR')} €`, icon: <FiDollarSign className="text-red-500" />, change: "Avoirs actifs" },
    { title: "Avoirs en cours", value: avoirsData.filter(a => a.statut === 'Émis' || a.statut === 'En attente').length, icon: <FiClock className="text-amber-500" />, change: "Non comptabilisés" },
    { title: "Avoirs ce mois", value: avoirsData.filter(a => a.date.includes('/03/2025')).length, icon: <FiBarChart2 className="text-blue-500" />, change: `${avoirsData.filter(a => a.date.includes('/03/2025')).reduce((sum, a) => sum + a.montant, 0).toLocaleString('fr-FR')} €` },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statutOptions = ['Tous', 'Brouillon', 'Émis', 'En attente', 'Comptabilisé', 'Annulé'];
  const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent', 'Trimestre en cours'];
  // const templateCategoryOptions = ['Tous', 'Services', 'Produits'];
  // const motifOptions = ['Tous', 'Correction de facturation', 'Annulation de service', 'Retour produits défectueux', 'Résiliation anticipée', 'Double facturation', 'Autre'];

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'liste' ? 'grid' : 'liste');
  };

  // Set active template
  const setActiveTemplateHandler = (id: string): void => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
    setEditMode(false);
  };

  // Set active avoir
  const setActiveAvoirHandler = (id: string): void => {
    setSelectedAvoir(id === selectedAvoir ? null : id);
  };

  // Get template by ID
  const getTemplateById = (id: string): Template | undefined => {
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
        avoir.factureOrigine.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Tous' || avoir.statut === statusFilter;
      const matchesClient = clientFilter === 'Tous' || avoir.client === clientFilter;
      const matchesTemplate = templateFilter === 'Tous' || avoir.template === templateFilter;
      const matchesFacture = factureFilter === 'Tous' || avoir.factureOrigine === factureFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesStatus && matchesClient && matchesTemplate && matchesFacture && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setClientFilter('Tous');
    setTemplateFilter('Tous');
    setFactureFilter('Tous');
    setDateRangeFilter('Tous');
  };

  // Duplicate template
  const duplicateTemplate = (id: string): void => {
    const template = getTemplateById(id);
    if (!template) return;
    
    const newTemplate = {
      ...template,
      id: `TPL-A00${templatesData.length + 1}`,
      nom: `${template.nom} (Copie)`,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false
    };
    
    setTemplatesData([...templatesData, newTemplate]);
  };

  // Delete template
  const deleteTemplate = (id: string): void => {
    setTemplatesData(templatesData.filter(template => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
      setEditMode(false);
    }
  };

  // Get status color
  const getStatusColor = (statut: string): string => {
    switch (statut) {
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Émis':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Comptabilisé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
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
              Avoirs
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos avoirs et modèles de documents
            </p>
          </div>
          <div className="p-2 bg-red-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'avoirs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('avoirs');
                setSelectedTemplate(null);
                setSelectedAvoir(null);
                setEditMode(false);
              }}
            >
              Avoirs
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedAvoir(null);
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
                setSelectedAvoir(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Avoirs tab */}
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
                {/* Search */}
                <div className="w-full md:w-72 relative mb-4 md:mb-0">
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
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer un avoir</span>
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
                        Facture d&apos;origine
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={factureFilter}
                        onChange={(e) => setFactureFilter(e.target.value)}
                      >
                        <option value="Tous">Toutes</option>
                        {[...new Set(avoirsData.map(a => a.factureOrigine))].map((factureRef) => (
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

              {/* Avoirs List - Grid View */}
              {viewMode === 'grid' && (
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
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FiLink className="mr-1" size={14} />
                        <span>Facture: {avoir.factureOrigine}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-600">{avoir.montant.toLocaleString('fr-FR')} €</span>
                        <span className="text-sm text-gray-500">{avoir.date}</span>
                      </div>
                      {selectedAvoir === avoir.id && (
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

              {/* Avoirs List - List View */}
              {viewMode === 'liste' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b">Numéro</th>
                        <th className="px-4 py-2 border-b">Client</th>
                        <th className="px-4 py-2 border-b">Facture d&apos;origine</th>
                        <th className="px-4 py-2 border-b">Montant</th>
                        <th className="px-4 py-2 border-b">Date</th>
                        <th className="px-4 py-2 border-b">Statut</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredAvoirs().map((avoir) => (
                        <tr key={avoir.id} 
                            className={`cursor-pointer ${selectedAvoir === avoir.id ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
                            onClick={() => setActiveAvoirHandler(avoir.id)}>
                          <td className="px-4 py-2 border-b">{avoir.numero}</td>
                          <td className="px-4 py-2 border-b">{avoir.client}</td>
                          <td className="px-4 py-2 border-b">{avoir.factureOrigine}</td>
                          <td className="px-4 py-2 border-b">{avoir.montant.toLocaleString('fr-FR')} €</td>
                          <td className="px-4 py-2 border-b">{avoir.date}</td>
                          <td className="px-4 py-2 border-b">
                            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(avoir.statut)}`}>
                              {avoir.statut}
                            </span>
                          </td>
                          <td className="px-4 py-2 border-b">
                            <div className="flex items-center space-x-2">
                              <button className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                                <FiEye size={14} />
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                                <FiEdit size={14} />
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition">
                                <FiCopy size={14} />
                              </button>
                              <button className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition">
                                <FiSend size={14} />
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
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Modèles</h2>
              {/* Displaying template cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map((template) => (
                  <div 
                    key={template.id} 
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedTemplate === template.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveTemplateHandler(template.id)}
                  >
                    <h3 className="text-lg font-bold mb-1">{template.nom}</h3>
                    <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                    <p className="text-xs text-gray-400">Créé le: {template.dateCreation}</p>
                    <p className="text-xs text-gray-400">Dernière maj: {template.derniereMaj}</p>
                    {selectedTemplate === template.id && (
                      <div className="mt-4 flex items-center space-x-2">
                        <button 
                          onClick={() => duplicateTemplate(template.id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          <FiCopy size={14} />
                          <span className="text-sm">Dupliquer</span>
                        </button>
                        <button 
                          onClick={() => deleteTemplate(template.id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                        >
                          <FiTrash2 size={14} />
                          <span className="text-sm">Supprimer</span>
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
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Paramètres</h2>
              <p className="text-gray-600">Ici, vous pouvez ajouter vos paramètres et configurations.</p>
              {/* Add your settings form or options here */}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
