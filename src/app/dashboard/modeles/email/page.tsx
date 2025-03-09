'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiSend,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiPlus,
  FiCopy,
  // FiRefreshCw,
  FiCheck,
  // FiX,
  // FiCalendar,
  FiClock,
  // FiBarChart2,
  // FiUsers,
  FiList,
  FiGrid,
  // FiStar,
  // FiAlertCircle,
  // FiCheckCircle,
  FiFileText,
  // FiPaperclip,
  // FiTag,
  // FiArchive,
  // FiDownload,
  // FiSettings,
  // FiAlertTriangle,
  // FiBookmark,
  // FiLink,
  // FiMessageSquare
} from 'react-icons/fi';

export default function Email() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('emails');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [editMode, setEditMode] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [recipientFilter, setRecipientFilter] = useState('Tous');
  
  // Sample email templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-E001',
      nom: 'Email Devis',
      description: "Template d'email pour l'envoi de devis",
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Commercial',
      htmlContent: '<div class="template">Contenu du template d\'email pour devis...</div>',
      subject: 'Votre devis [REF_DEVIS]',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Suite à notre échange, veuillez trouver ci-joint votre devis [REF_DEVIS].' },
        { id: 'details', name: 'Détails', content: 'Ce devis comprend [DESCRIPTION_PROJET] pour un montant total de [MONTANT] €.' },
        { id: 'instructions', name: 'Instructions', content: 'Pour accepter ce devis, veuillez [INSTRUCTIONS_ACCEPTATION].' },
        { id: 'validity', name: 'Validité', content: 'Ce devis est valable jusqu\'au [DATE_VALIDITE].' },
        { id: 'closing', name: 'Conclusion', content: 'N\'hésitez pas à nous contacter pour toute question.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_DEVIS', 'DESCRIPTION_PROJET', 'MONTANT', 'INSTRUCTIONS_ACCEPTATION', 'DATE_VALIDITE', 'EXPEDITEUR_NOM'
      ]
    },
    {
      id: 'TPL-E002',
      nom: 'Email Facture',
      description: "Template d'email pour l'envoi de factures",
      dateCreation: '20/01/2024',
      derniereMaj: '02/03/2025',
      isDefault: false,
      category: 'Comptabilité',
      htmlContent: '<div class="template">Contenu du template d\'email pour factures...</div>',
      subject: 'Votre facture [REF_FACTURE]',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Veuillez trouver ci-joint votre facture [REF_FACTURE].' },
        { id: 'details', name: 'Détails', content: 'Cette facture concerne [DESCRIPTION_SERVICE] pour un montant de [MONTANT] €.' },
        { id: 'payment', name: 'Paiement', content: 'Nous vous remercions de bien vouloir régler cette facture avant le [DATE_ECHEANCE].' },
        { id: 'methods', name: 'Moyens de paiement', content: 'Vous pouvez effectuer votre règlement par [MOYENS_PAIEMENT].' },
        { id: 'closing', name: 'Conclusion', content: 'Nous vous remercions de votre confiance.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_FACTURE', 'DESCRIPTION_SERVICE', 'MONTANT', 'DATE_ECHEANCE', 'MOYENS_PAIEMENT', 'EXPEDITEUR_NOM'
      ]
    },
    {
      id: 'TPL-E003',
      nom: 'Email Relance',
      description: "Template d'email pour relance de paiement",
      dateCreation: '05/02/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Comptabilité',
      htmlContent: '<div class="template">Contenu du template d\'email pour relances...</div>',
      subject: 'Rappel : Facture [REF_FACTURE] échue',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: "Nous nous permettons de vous rappeler que la facture [REF_FACTURE] d'un montant de [MONTANT] € est échue depuis le [DATE_ECHEANCE]." },
        { id: 'details', name: 'Détails', content: 'Cette facture concerne [DESCRIPTION_SERVICE] et devait être réglée il y a [JOURS_RETARD] jours.' },
        { id: 'action', name: 'Action', content: 'Nous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.' },
        { id: 'closing', name: 'Conclusion', content: "Si votre paiement a été effectué entre-temps, nous vous prions d'ignorer ce message." },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_FACTURE', 'MONTANT', 'DATE_ECHEANCE', 'DESCRIPTION_SERVICE', 'JOURS_RETARD', 'EXPEDITEUR_NOM'
      ]
    },
    {
      id: 'TPL-E004',
      nom: 'Email Bienvenue',
      description: "Template d'email de bienvenue pour nouveaux clients",
      dateCreation: '10/02/2024',
      derniereMaj: '28/02/2025',
      isDefault: false,
      category: 'Marketing',
      htmlContent: '<div class="template">Contenu du template d\'email de bienvenue...</div>',
      subject: 'Bienvenue chez [ENTREPRISE_NOM]',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Bonjour [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Nous sommes ravis de vous compter parmi nos clients !' },
        { id: 'presentation', name: 'Présentation', content: 'Chez [ENTREPRISE_NOM], nous nous engageons à [VALEURS_ENTREPRISE].' },
        { id: 'contact', name: 'Contact', content: 'Votre interlocuteur privilégié est [CONTACT_NOM], joignable au [CONTACT_TEL].' },
        { id: 'next', name: 'Prochaines étapes', content: 'Voici les prochaines étapes : [PROCHAINES_ETAPES]' },
        { id: 'closing', name: 'Conclusion', content: 'Nous vous souhaitons une excellente collaboration.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'ENTREPRISE_NOM', 'VALEURS_ENTREPRISE', 'CONTACT_NOM', 'CONTACT_TEL', 'PROCHAINES_ETAPES', 'EXPEDITEUR_NOM'
      ]
    },
    {
      id: 'TPL-E005',
      nom: 'Email Remerciement',
      description: "Template d'email de remerciement après achat",
      dateCreation: '15/02/2024',
      derniereMaj: '25/02/2025',
      isDefault: false,
      category: 'Marketing',
      htmlContent: '<div class="template">Contenu du template d\'email de remerciement...</div>',
      subject: 'Merci pour votre confiance !',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Nous tenons à vous remercier sincèrement pour votre récente commande [REF_COMMANDE].' },
        { id: 'appreciation', name: 'Appréciation', content: 'Votre confiance est précieuse et nous sommes heureux de contribuer à [BENEFICE_CLIENT].' },
        { id: 'feedback', name: 'Feedback', content: "Votre satisfaction est notre priorité. N'hésitez pas à nous faire part de vos retours." },
        { id: 'closing', name: 'Conclusion', content: 'Au plaisir de vous accompagner dans vos futurs projets.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_COMMANDE', 'BENEFICE_CLIENT', 'EXPEDITEUR_NOM'
      ]
    }
  ]);

  // Sample emails data
  const [emailsData ] = useState([
    {
      id: 'EML-001',
      subject: 'Votre devis D2025-0125',
      destinataire: 'contact@acmecorp.com',
      destinataireName: 'Acme Corp',
      date: '05/03/2025',
      dateEnvoi: '05/03/2025',
      statut: 'Envoyé',
      template: 'TPL-E001',
      category: 'Commercial',
      documentRef: 'D2025-0125',
      documentType: 'Devis',
      createdBy: 'Jean Dupont',
      ouvert: true,
      dateOuverture: '05/03/2025 16:32',
      contenu: 'Cher M. Smith, Suite à notre échange, veuillez trouver ci-joint votre devis D2025-0125...',
      pieceJointe: true
    },
    {
      id: 'EML-002',
      subject: 'Votre facture F2025-0088',
      destinataire: 'finance@acmecorp.com',
      destinataireName: 'Acme Corp - Finance',
      date: '01/03/2025',
      dateEnvoi: '01/03/2025',
      statut: 'Envoyé',
      template: 'TPL-E002',
      category: 'Comptabilité',
      documentRef: 'F2025-0088',
      documentType: 'Facture',
      createdBy: 'Marie Martin',
      ouvert: false,
      dateOuverture: null,
      contenu: 'Cher M. Smith, Veuillez trouver ci-joint votre facture F2025-0088...',
      pieceJointe: true
    },
    {
      id: 'EML-003',
      subject: 'Rappel : Facture F2025-0056 échue',
      destinataire: 'finance@zenithsa.com',
      destinataireName: 'Zenith SA',
      date: '28/02/2025',
      dateEnvoi: '28/02/2025',
      statut: 'Envoyé',
      template: 'TPL-E003',
      category: 'Comptabilité',
      documentRef: 'F2025-0056',
      documentType: 'Facture',
      createdBy: 'Marie Martin',
      ouvert: true,
      dateOuverture: '28/02/2025 14:15',
      contenu: 'Cher M. Dupont, Nous nous permettons de vous rappeler que la facture F2025-0056 est échue...',
      pieceJointe: true
    },
    {
      id: 'EML-004',
      subject: 'Bienvenue chez Notre Société',
      destinataire: 'contact@nexustech.com',
      destinataireName: 'Nexus Tech',
      date: '25/02/2025',
      dateEnvoi: '25/02/2025',
      statut: 'Envoyé',
      template: 'TPL-E004',
      category: 'Marketing',
      documentRef: null,
      documentType: null,
      createdBy: 'Pierre Dubois',
      ouvert: true,
      dateOuverture: '25/02/2025 10:45',
      contenu: 'Bonjour M. Johnson, Nous sommes ravis de vous compter parmi nos clients !...',
      pieceJointe: false
    },
    {
      id: 'EML-005',
      subject: 'Merci pour votre confiance !',
      destinataire: 'director@globalindustries.com',
      destinataireName: 'Global Industries',
      date: '20/02/2025',
      dateEnvoi: '20/02/2025',
      statut: 'Envoyé',
      template: 'TPL-E005',
      category: 'Marketing',
      documentRef: 'CMD-2025-032',
      documentType: 'Commande',
      createdBy: 'Jean Dupont',
      ouvert: false,
      dateOuverture: null,
      contenu: 'Cher M. Williams, Nous tenons à vous remercier sincèrement pour votre récente commande...',
      pieceJointe: false
    },
    {
      id: 'EML-006',
      subject: 'Votre devis D2025-0126',
      destinataire: 'info@techsolutions.com',
      destinataireName: 'Tech Solutions',
      date: '07/03/2025',
      dateEnvoi: null,
      statut: 'Brouillon',
      template: 'TPL-E001',
      category: 'Commercial',
      documentRef: 'D2025-0126',
      documentType: 'Devis',
      createdBy: 'Marie Martin',
      ouvert: false,
      dateOuverture: null,
      contenu: 'Cher M. Brown, Suite à notre échange, veuillez trouver ci-joint votre devis D2025-0126...',
      pieceJointe: true
    }
  ]);

  // Statistics
  const emailStatistics = [
    { title: "Emails envoyés", value: `${emailsData.filter(e => e.statut === 'Envoyé').length}`, icon: <FiSend className="text-blue-500" />, change: "Ce mois" },
    { title: "Taux d'ouverture", value: `${Math.round((emailsData.filter(e => e.ouvert).length / emailsData.filter(e => e.statut === 'Envoyé').length) * 100)}%`, icon: <FiEye className="text-green-500" />, change: "En hausse de 5%" },
    { title: "Emails en attente", value: emailsData.filter(e => e.statut === 'Brouillon').length, icon: <FiClock className="text-amber-500" />, change: "À finaliser" },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Envoyé', 'Brouillon', 'Programmé'];
  const categoryOptions = ['Tous', 'Commercial', 'Comptabilité', 'Marketing', 'Support', 'Autre'];
  // const documentOptions = ['Tous', 'Devis', 'Facture', 'Avoir', 'Commande', 'Autre'];
  const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent'];

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

  // Set active email
  const setActiveEmailHandler = (id: string) => {
    setSelectedEmail(id === selectedEmail ? null : id);
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
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Tous' || template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered emails
  const getFilteredEmails = () => {
    return emailsData.filter(email => {
      const matchesSearch = 
        searchTerm === '' || 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.destinataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.destinataireName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.documentRef && email.documentRef.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'Tous' || email.statut === statusFilter;
      const matchesCategory = categoryFilter === 'Tous' || email.category === categoryFilter;
      const matchesTemplate = templateFilter === 'Tous' || email.template === templateFilter;
      const matchesRecipient = recipientFilter === 'Tous' || email.destinataireName === recipientFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesTemplate && matchesRecipient && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Tous');
    setCategoryFilter('Tous');
    setTemplateFilter('Tous');
    setRecipientFilter('Tous');
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
      id: `TPL-E00${templatesData.length + 1}`,
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
      case 'Envoyé':
        return 'bg-green-100 text-green-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Programmé':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category color
  // const getCategoryColor = (category) => {
  //   switch(category) {
  //     case 'Commercial':
  //       return 'bg-blue-100 text-blue-800';
  //     case 'Comptabilité':
  //       return 'bg-amber-100 text-amber-800';
  //     case 'Marketing':
  //       return 'bg-purple-100 text-purple-800';
  //     case 'Support':
  //       return 'bg-green-100 text-green-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // Truncate text
  const truncateText = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  // Preview sent emails
  const emailPreview = selectedEmail ? emailsData.find(email => email.id === selectedEmail) : null;

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
              Emails
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos emails et modèles de communication
            </p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiMail className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'emails' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('emails');
                setSelectedTemplate(null);
                setSelectedEmail(null);
                setEditMode(false);
              }}
            >
              Emails
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedEmail(null);
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
                setSelectedEmail(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Emails tab */}
          {activeTab === 'emails' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {emailStatistics.map((stat, index) => (
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
                    placeholder="Rechercher un email..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer un email</span>
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
                        {statusOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        {categoryOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plage de dates
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
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={resetFilters}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </motion.div>
              )}

              {/* List/Grid of Emails */}
              <div className={viewMode === 'liste' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {getFilteredEmails().map(email => (
                  <div 
                    key={email.id} 
                    className={`p-4 bg-white rounded-lg shadow border ${selectedEmail === email.id ? 'border-indigo-600' : 'border-gray-200'}`}
                    onClick={() => setActiveEmailHandler(email.id)}
                  >
                    <h3 className="text-lg font-semibold">{email.subject}</h3>
                    <p className="text-sm text-gray-600">{truncateText(email.contenu, 60)}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(email.statut)}`}>
                        {email.statut}
                      </span>
                      <span className="text-xs text-gray-500">{email.dateEnvoi || email.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email Preview */}
              {emailPreview && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-white rounded-lg shadow border"
                >
                  <h2 className="text-xl font-bold mb-2">{emailPreview.subject}</h2>
                  <p className="text-sm text-gray-600 mb-4">{emailPreview.contenu}</p>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiMail />
                    <span>Envoyer un suivi</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Content for Modèles tab */}
          {activeTab === 'modeles' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Liste des modèles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map(template => (
                  <div 
                    key={template.id} 
                    className={`p-4 bg-white rounded-lg shadow border ${selectedTemplate === template.id ? 'border-indigo-600' : 'border-gray-200'}`}
                    onClick={() => setActiveTemplateHandler(template.id)}
                  >
                    <h3 className="text-lg font-semibold">{template.nom}</h3>
                    <p className="text-sm text-gray-600">{truncateText(template.description, 60)}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{template.dateCreation}</span>
                      <span className="text-xs text-gray-500">{template.derniereMaj}</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button onClick={() => duplicateTemplate(template.id)} className="p-1 border rounded hover:bg-gray-50">
                        <FiCopy />
                      </button>
                      <button onClick={() => deleteTemplate(template.id)} className="p-1 border rounded hover:bg-gray-50">
                        <FiTrash2 />
                      </button>
                      <button onClick={toggleEditMode} className="p-1 border rounded hover:bg-gray-50">
                        {editMode ? <FiCheck /> : <FiEdit />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTemplate && editMode && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-white rounded-lg shadow border"
                >
                  <h2 className="text-xl font-bold mb-2">Modifier le modèle</h2>
                  {/* Here you can include a form to edit the template details */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded mt-1" 
                      defaultValue={getTemplateById(selectedTemplate)?.nom} 
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded mt-1" 
                      defaultValue={getTemplateById(selectedTemplate)?.description} 
                    />
                  </div>
                  <button onClick={saveTemplateChanges} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    Sauvegarder
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <p className="text-sm text-gray-600">Ici, vous pouvez gérer les paramètres de vos emails et modèles.</p>
              {/* Insert settings form or options as needed */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Exemple de paramètre</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Valeur du paramètre" />
              </div>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                Sauvegarder les paramètres
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
