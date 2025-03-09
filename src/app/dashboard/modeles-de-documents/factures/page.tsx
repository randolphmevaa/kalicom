'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiCopy, 
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiGrid,
  FiList,
  FiLayout,
} from 'react-icons/fi';

export default function FacturesModeles() {
  // State for active tab and other UI states
  const [activeTab, setActiveTab] = useState('factures');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [languageFilter, setLanguageFilter] = useState('Toutes');
  
  // Sample invoice templates data
  const [invoiceTemplatesData, setInvoiceTemplatesData] = useState([
    {
      id: 'TMPL-FACT-001',
      nom: 'Facture Standard',
      description: 'Modèle de facture professionnel standard',
      type: 'Facture',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 3,
      thumbnail: '/templates/facture-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour toutes les factures',
      usages: 245
    },
    {
      id: 'TMPL-FACT-002',
      nom: 'Facture Élégante',
      description: 'Design élégant avec finitions premium',
      type: 'Facture',
      categorie: 'Premium',
      langue: 'Français',
      dateCreation: '20/03/2023',
      dateMaj: '05/02/2025',
      creePar: 'Admin',
      modifiePar: 'Sophie Dupont',
      isDefault: false,
      isActive: true,
      versions: 2,
      thumbnail: '/templates/facture-elegante.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#1E293B',
      couleurSecondaire: '#F8FAFC',
      police: 'Playfair Display',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Élevée',
      secteur: 'Luxe, Conseil',
      notes: 'Design soigné pour clientèle haut de gamme',
      usages: 87
    },
    {
      id: 'TMPL-FACT-003',
      nom: 'Facture Minimaliste',
      description: 'Design épuré, simple et moderne',
      type: 'Facture',
      categorie: 'Minimaliste',
      langue: 'Français',
      dateCreation: '05/05/2023',
      dateMaj: '10/01/2025',
      creePar: 'Jean Martin',
      modifiePar: 'Jean Martin',
      isDefault: false,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/facture-minimaliste.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#27272A',
      couleurSecondaire: '#FAFAFA',
      police: 'Inter',
      inclutLogo: true,
      inclutSignature: false,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Minimale',
      secteur: 'Tech, Design, Digital',
      notes: 'Modèle minimaliste adapté aux entreprises modernes',
      usages: 136
    },
    {
      id: 'TMPL-FACT-004',
      nom: 'Invoice Standard (English)',
      description: 'Standard invoice template in English',
      type: 'Facture',
      categorie: 'Standard',
      langue: 'Anglais',
      dateCreation: '15/06/2023',
      dateMaj: '15/12/2024',
      creePar: 'Admin',
      modifiePar: 'Admin',
      isDefault: false,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/invoice-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'International',
      notes: 'Version anglaise de la facture standard',
      usages: 42
    },
    {
      id: 'TMPL-FACT-005',
      nom: 'Facture Créative',
      description: 'Design artistique pour secteurs créatifs',
      type: 'Facture',
      categorie: 'Créatif',
      langue: 'Français',
      dateCreation: '10/09/2023',
      dateMaj: '05/01/2025',
      creePar: 'Sophie Dupont',
      modifiePar: 'Sophie Dupont',
      isDefault: false,
      isActive: true,
      versions: 4,
      thumbnail: '/templates/facture-creative.png',
      format: 'A4',
      orientation: 'Paysage',
      couleurPrincipale: '#8B5CF6',
      couleurSecondaire: '#F5F3FF',
      police: 'Poppins',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Élevée',
      secteur: 'Design, Art, Marketing',
      notes: 'Design artistique pour entreprises créatives',
      usages: 56
    },
    {
      id: 'TMPL-FACT-006',
      nom: 'Facture Traditionnelle',
      description: 'Format classique pour secteurs traditionnels',
      type: 'Facture',
      categorie: 'Classique',
      langue: 'Français',
      dateCreation: '05/11/2023',
      dateMaj: '20/12/2024',
      creePar: 'Admin',
      modifiePar: 'Thomas Bernard',
      isDefault: false,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/facture-traditionnelle.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#334155',
      couleurSecondaire: '#F8FAFC',
      police: 'Times New Roman',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Juridique, Finance, Administration',
      notes: 'Format traditionnel pour secteurs conventionnels',
      usages: 98
    }
  ]);

  // Sample quote templates data
  const [quoteTemplatesData, setQuoteTemplatesData] = useState([
    {
      id: 'TMPL-DEV-001',
      nom: 'Devis Standard',
      description: 'Modèle de devis professionnel standard',
      type: 'Devis',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 2,
      thumbnail: '/templates/devis-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour tous les devis',
      usages: 178
    },
    {
      id: 'TMPL-DEV-002',
      nom: 'Devis Détaillé',
      description: 'Modèle avec options et détails approfondis',
      type: 'Devis',
      categorie: 'Détaillé',
      langue: 'Français',
      dateCreation: '20/03/2023',
      dateMaj: '05/02/2025',
      creePar: 'Admin',
      modifiePar: 'Sophie Dupont',
      isDefault: false,
      isActive: true,
      versions: 3,
      thumbnail: '/templates/devis-detaille.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#0F766E',
      couleurSecondaire: '#F0FDFA',
      police: 'Roboto',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Élevée',
      secteur: 'Tech, BTP, Projets complexes',
      notes: 'Parfait pour les devis nécessitant beaucoup de détails',
      usages: 124
    },
    {
      id: 'TMPL-DEV-003',
      nom: 'Quote Template (English)',
      description: 'Standard quote template in English',
      type: 'Devis',
      categorie: 'Standard',
      langue: 'Anglais',
      dateCreation: '15/06/2023',
      dateMaj: '15/12/2024',
      creePar: 'Admin',
      modifiePar: 'Admin',
      isDefault: false,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/quote-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'International',
      notes: 'Version anglaise du devis standard',
      usages: 36
    },
    {
      id: 'TMPL-DEV-004',
      nom: 'Devis Prestations',
      description: 'Spécialement conçu pour les services et prestations',
      type: 'Devis',
      categorie: 'Services',
      langue: 'Français',
      dateCreation: '10/09/2023',
      dateMaj: '05/01/2025',
      creePar: 'Sophie Dupont',
      modifiePar: 'Sophie Dupont',
      isDefault: false,
      isActive: true,
      versions: 2,
      thumbnail: '/templates/devis-prestations.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#4F46E5',
      couleurSecondaire: '#EEF2FF',
      police: 'Poppins',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Services, Conseil, Formation',
      notes: 'Adapté aux entreprises de services',
      usages: 67
    }
  ]);

  // Sample other templates data
  const [otherTemplatesData, setOtherTemplatesData] = useState([
    {
      id: 'TMPL-BL-001',
      nom: 'Bon de Livraison Standard',
      description: 'Modèle standard pour bons de livraison',
      type: 'Bon de livraison',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/01/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/bl-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: false,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour les bons de livraison',
      usages: 132
    },
    {
      id: 'TMPL-AV-001',
      nom: 'Avoir Standard',
      description: 'Modèle standard pour avoirs clients',
      type: 'Avoir',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/02/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/avoir-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour les avoirs',
      usages: 54
    },
    {
      id: 'TMPL-CMD-001',
      nom: 'Bon de Commande Standard',
      description: 'Modèle standard pour bons de commande',
      type: 'Bon de commande',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/03/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/commande-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: true,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour les bons de commande',
      usages: 89
    },
    {
      id: 'TMPL-REL-001',
      nom: 'Relance Standard',
      description: 'Modèle standard pour relances de paiement',
      type: 'Relance',
      categorie: 'Standard',
      langue: 'Français',
      dateCreation: '15/04/2023',
      dateMaj: '10/02/2025',
      creePar: 'Admin',
      modifiePar: 'Jean Martin',
      isDefault: true,
      isActive: true,
      versions: 1,
      thumbnail: '/templates/relance-standard.png',
      format: 'A4',
      orientation: 'Portrait',
      couleurPrincipale: '#3B82F6',
      couleurSecondaire: '#F3F4F6',
      police: 'Montserrat',
      inclutLogo: true,
      inclutSignature: true,
      inclutCoordonnees: true,
      inclutConditions: false,
      personalisation: 'Standard',
      secteur: 'Tous',
      notes: 'Modèle par défaut pour les relances de paiement',
      usages: 67
    }
  ]);

  // Settings data
  // const [settingsData, setSettingsData] = useState({
  //   defaultInvoiceTemplate: 'TMPL-FACT-001',
  //   defaultQuoteTemplate: 'TMPL-DEV-001',
  //   defaultPaperSize: 'A4',
  //   defaultOrientation: 'Portrait',
  //   defaultLanguage: 'Français',
  //   defaultFont: 'Montserrat',
  //   includeLogo: true,
  //   includeSignature: true,
  //   includeTerms: true,
  //   colorScheme: 'Bleu',
  //   emailTemplatesEnabled: true,
  //   pdfCompression: 'Moyenne',
  //   watermarkEnabled: false,
  //   watermarkText: '',
  //   autoSaveTemplates: true
  // });

  // Statistics
  // const invoiceStatistics = [
  //   { title: "Templates actifs", value: invoiceTemplatesData.filter(t => t.isActive).length, icon: <FiFileText className="text-blue-500" /> },
  //   { title: "Template par défaut", value: invoiceTemplatesData.find(t => t.isDefault)?.nom || "Non défini", icon: <FiCheckCircle className="text-green-500" /> },
  //   { title: "Langues disponibles", value: Array.from(new Set(invoiceTemplatesData.map(t => t.langue))).length, icon: <FiGlobe className="text-indigo-500" /> },
  //   { title: "Factures émises", value: "435", icon: <FiTrendingUp className="text-amber-500" /> }
  // ];

  // const quoteStatistics = [
  //   { title: "Templates actifs", value: quoteTemplatesData.filter(t => t.isActive).length, icon: <FiFileText className="text-blue-500" /> },
  //   { title: "Template par défaut", value: quoteTemplatesData.find(t => t.isDefault)?.nom || "Non défini", icon: <FiCheckCircle className="text-green-500" /> },
  //   { title: "Langues disponibles", value: Array.from(new Set(quoteTemplatesData.map(t => t.langue))).length, icon: <FiGlobe className="text-indigo-500" /> },
  //   { title: "Devis émis", value: "218", icon: <FiTrendingUp className="text-amber-500" /> }
  // ];

  // const otherStatistics = [
  //   { title: "Autres templates", value: otherTemplatesData.length, icon: <FiFileText className="text-blue-500" /> },
  //   { title: "Types de documents", value: Array.from(new Set(otherTemplatesData.map(t => t.type))).length, icon: <FiTag className="text-green-500" /> },
  //   { title: "Dernière mise à jour", value: "10/02/2025", icon: <FiRefreshCw className="text-indigo-500" /> },
  //   { title: "Documents émis", value: "342", icon: <FiTrendingUp className="text-amber-500" /> }
  // ];

  // Filter options
  const templateTypeOptions = ['Tous', 'Facture', 'Devis', 'Bon de livraison', 'Avoir', 'Bon de commande', 'Relance'];
  const templateCategoryOptions = ['Tous', 'Standard', 'Premium', 'Minimaliste', 'Créatif', 'Classique', 'Détaillé', 'Services'];
  const templateLanguageOptions = ['Toutes', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];
  
  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Toggle help
  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };

  // Set active template
  const setActiveTemplateHandler = (id: string) => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
    setPreviewMode(false);
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Get active templates data based on tab
  const getActiveTemplatesData = () => {
    switch(activeTab) {
      case 'factures':
        return invoiceTemplatesData;
      case 'devis':
        return quoteTemplatesData;
      case 'autres':
        return otherTemplatesData;
      default:
        return [];
    }
  };

  // Get selected template details
  const getSelectedTemplateDetails = () => {
    if (!selectedTemplate) return null;
    return getActiveTemplatesData().find(template => template.id === selectedTemplate);
  };

  // Get filtered templates
  const getFilteredTemplates = () => {
    return getActiveTemplatesData().filter(template => {
      const matchesSearch = 
        searchTerm === '' || 
        template.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'Tous' || template.type === typeFilter;
      const matchesCategory = categoryFilter === 'Tous' || template.categorie === categoryFilter;
      const matchesLanguage = languageFilter === 'Toutes' || template.langue === languageFilter;
      
      return matchesSearch && matchesType && matchesCategory && matchesLanguage;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('Tous');
    setCategoryFilter('Tous');
    setLanguageFilter('Toutes');
  };

  // Set template as default
  const setTemplateAsDefault = (id: string) => {
    switch(activeTab) {
      case 'factures':
        setInvoiceTemplatesData(
          invoiceTemplatesData.map(template => 
            template.id === id ? { ...template, isDefault: true } : { ...template, isDefault: false }
          )
        );
        break;
      case 'devis':
        setQuoteTemplatesData(
          quoteTemplatesData.map(template => 
            template.id === id ? { ...template, isDefault: true } : { ...template, isDefault: false }
          )
        );
        break;
      case 'autres':
        // For other templates, set default per type
        const selected = otherTemplatesData.find(t => t.id === id);
        if (selected) {
          setOtherTemplatesData(
            otherTemplatesData.map(template => 
              template.id === id ? { ...template, isDefault: true } : 
              (template.type === selected.type ? { ...template, isDefault: false } : template)
            )
          );
        }
        break;
    }
  };

  // Toggle template active status
  const toggleTemplateActive = (id: string) => {
    switch(activeTab) {
      case 'factures':
        setInvoiceTemplatesData(
          invoiceTemplatesData.map(template => 
            template.id === id ? { ...template, isActive: !template.isActive } : template
          )
        );
        break;
      case 'devis':
        setQuoteTemplatesData(
          quoteTemplatesData.map(template => 
            template.id === id ? { ...template, isActive: !template.isActive } : template
          )
        );
        break;
      case 'autres':
        setOtherTemplatesData(
          otherTemplatesData.map(template => 
            template.id === id ? { ...template, isActive: !template.isActive } : template
          )
        );
        break;
    }
  };

  // Duplicate template
  const duplicateTemplate = (id: string) => {
    const templateToDuplicate = getActiveTemplatesData().find(template => template.id === id);
    if (!templateToDuplicate) return;
    
    const newTemplate = {
      ...templateToDuplicate,
      id: `${templateToDuplicate.id}-COPY`,
      nom: `${templateToDuplicate.nom} (Copie)`,
      isDefault: false,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      dateMaj: new Date().toLocaleDateString('fr-FR'),
      creePar: 'Utilisateur actuel',
      modifiePar: 'Utilisateur actuel',
      versions: 1,
      usages: 0
    };
    
    switch(activeTab) {
      case 'factures':
        setInvoiceTemplatesData([...invoiceTemplatesData, newTemplate]);
        break;
      case 'devis':
        setQuoteTemplatesData([...quoteTemplatesData, newTemplate]);
        break;
      case 'autres':
        setOtherTemplatesData([...otherTemplatesData, newTemplate]);
        break;
    }
  };

  // Delete template (mock function)
  const deleteTemplate = (id: string) => {
    // In a real app, you might show a confirmation dialog before deleting
    switch(activeTab) {
      case 'factures':
        setInvoiceTemplatesData(invoiceTemplatesData.filter(template => template.id !== id));
        break;
      case 'devis':
        setQuoteTemplatesData(quoteTemplatesData.filter(template => template.id !== id));
        break;
      case 'autres':
        setOtherTemplatesData(otherTemplatesData.filter(template => template.id !== id));
        break;
    }
    setSelectedTemplate(null);
  };

  // Get status badge color
  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Get language badge color
  const getLanguageBadgeColor = (langue: string) => {
    switch(langue) {
      case 'Français':
        return 'bg-blue-100 text-blue-800';
      case 'Anglais':
        return 'bg-red-100 text-red-800';
      case 'Espagnol':
        return 'bg-yellow-100 text-yellow-800';
      case 'Allemand':
        return 'bg-amber-100 text-amber-800';
      case 'Italien':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
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
              Modèles de documents
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez et personnalisez vos modèles de factures, devis et autres documents
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            {['factures', 'devis', 'autres'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-center font-medium transition ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedTemplate(null);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <button onClick={toggleFilters} className="flex items-center px-3 py-1 border rounded">
                  <FiFilter className="mr-1" /> Filtres
                </button>
                <button onClick={resetFilters} className="flex items-center px-3 py-1 border rounded">
                  <FiRefreshCw className="mr-1" /> Réinitialiser
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border rounded"
                />
                <button className="px-3 py-1 border rounded">
                  <FiSearch />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    {templateTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    {templateCategoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Langue</label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    {templateLanguageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Toggle view mode */}
            <div className="flex justify-end mb-2">
              <button onClick={() => setViewMode('grid')} className={`px-3 py-1 border rounded ${viewMode === 'grid' ? 'bg-indigo-100' : ''}`}>
                <FiGrid />
              </button>
              <button onClick={() => setViewMode('list')} className={`ml-2 px-3 py-1 border rounded ${viewMode === 'list' ? 'bg-indigo-100' : ''}`}>
                <FiList />
              </button>
            </div>

            {/* Templates List */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4"}>
              {getFilteredTemplates().map(template => (
                <div
                  key={template.id}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
                  onClick={() => setActiveTemplateHandler(template.id)}
                >
                  <img src={template.thumbnail} alt={template.nom} className="w-full h-32 object-cover rounded mb-2" />
                  <h3 className="font-semibold text-lg">{template.nom}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(template.isActive)}`}>
                      {template.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getLanguageBadgeColor(template.langue)}`}>
                      {template.langue}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); duplicateTemplate(template.id); }} title="Dupliquer">
                      <FiCopy />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setTemplateAsDefault(template.id); }} title="Définir par défaut">
                      <FiCheck />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleTemplateActive(template.id); }} title="Activer/Désactiver">
                      <FiX />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }} title="Supprimer">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Template Details / Preview */}
        {selectedTemplate && (
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                Détails du modèle: {getSelectedTemplateDetails()?.nom}
              </h2>
              <button onClick={togglePreviewMode} className="px-4 py-2 border rounded flex items-center">
                {previewMode ? <FiEye /> : <FiLayout />} {previewMode ? 'Mode Édition' : 'Mode Prévisualisation'}
              </button>
            </div>
            {previewMode ? (
              <div className="p-4 border rounded">
                {/* A simulated preview area */}
                <p>Prévisualisation du modèle {getSelectedTemplateDetails()?.nom}</p>
                <img src={getSelectedTemplateDetails()?.thumbnail} alt={getSelectedTemplateDetails()?.nom} className="w-full h-64 object-cover mt-2 rounded" />
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Description:</strong> {getSelectedTemplateDetails()?.description}</p>
                <p><strong>Créé par:</strong> {getSelectedTemplateDetails()?.creePar}</p>
                <p><strong>Modifié par:</strong> {getSelectedTemplateDetails()?.modifiePar}</p>
                <p><strong>Version:</strong> {getSelectedTemplateDetails()?.versions}</p>
                <p><strong>Date de création:</strong> {getSelectedTemplateDetails()?.dateCreation}</p>
                <p><strong>Date de mise à jour:</strong> {getSelectedTemplateDetails()?.dateMaj}</p>
                <p><strong>Usages:</strong> {getSelectedTemplateDetails()?.usages}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
