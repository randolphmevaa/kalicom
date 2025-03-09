'use client';
import {  useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMessageSquare,
  FiSend,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiPlus,
  FiCopy,
  FiCheck,
  FiX,
  FiClock,
  FiList,
  FiGrid,
  FiFileText,
  FiRepeat
} from 'react-icons/fi';

export default function SMS() {
  // State for active tab and selection
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<string | null>(null);
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
  
  // Sample SMS templates data
  const [templatesData, setTemplatesData] = useState([
    {
      id: 'TPL-S001',
      nom: 'Confirmation de RDV',
      description: 'Template de confirmation de rendez-vous',
      dateCreation: '15/01/2024',
      derniereMaj: '05/03/2025',
      isDefault: true,
      category: 'Rendez-vous',
      content: 'Bonjour [NOM_CLIENT], nous vous confirmons votre rendez-vous le [DATE_RDV] à [HEURE_RDV]. À bientôt !',
      variables: ['NOM_CLIENT', 'DATE_RDV', 'HEURE_RDV'],
      maxLength: 160,
      emojis: false
    },
    {
      id: 'TPL-S002',
      nom: 'Rappel de RDV',
      description: 'Template de rappel de rendez-vous (24h avant)',
      dateCreation: '16/01/2024',
      derniereMaj: '03/03/2025',
      isDefault: false,
      category: 'Rendez-vous',
      content: 'Rappel : Votre rendez-vous est prévu demain [DATE_RDV] à [HEURE_RDV]. Pour annuler, appelez le [TEL_CONTACT]. À bientôt !',
      variables: ['DATE_RDV', 'HEURE_RDV', 'TEL_CONTACT'],
      maxLength: 160,
      emojis: false
    },
    {
      id: 'TPL-S003',
      nom: 'Notification de Livraison',
      description: 'Template de notification de livraison',
      dateCreation: '20/01/2024',
      derniereMaj: '02/03/2025',
      isDefault: false,
      category: 'Logistique',
      content: 'Votre commande [REF_COMMANDE] sera livrée le [DATE_LIVRAISON] entre [HEURE_DEBUT] et [HEURE_FIN]. Suivez votre colis : [LIEN_SUIVI]',
      variables: ['REF_COMMANDE', 'DATE_LIVRAISON', 'HEURE_DEBUT', 'HEURE_FIN', 'LIEN_SUIVI'],
      maxLength: 200,
      emojis: true
    },
    {
      id: 'TPL-S004',
      nom: 'Code de Confirmation',
      description: 'Template pour envoi de code de confirmation',
      dateCreation: '25/01/2024',
      derniereMaj: '01/03/2025',
      isDefault: false,
      category: 'Sécurité',
      content: 'Votre code de confirmation : [CODE]. Ne partagez jamais ce code avec une autre personne.',
      variables: ['CODE'],
      maxLength: 120,
      emojis: false
    },
    {
      id: 'TPL-S005',
      nom: 'Promotion',
      description: 'Template pour envoi de promotion',
      dateCreation: '05/02/2024',
      derniereMaj: '28/02/2025',
      isDefault: false,
      category: 'Marketing',
      content: '🎉 [PROMO_TITRE] ! Profitez de [PROMO_REDUCTION] sur votre prochaine commande avec le code [PROMO_CODE]. Offre valable jusqu\'au [PROMO_DATE_FIN]. 🎁',
      variables: ['PROMO_TITRE', 'PROMO_REDUCTION', 'PROMO_CODE', 'PROMO_DATE_FIN'],
      maxLength: 200,
      emojis: true
    }
  ]);

  // Sample SMS data
  const [smsData, setSmsData] = useState([
    {
      id: 'SMS-001',
      contenu: 'Bonjour M. Smith, nous vous confirmons votre rendez-vous le 10/03/2025 à 14h30. À bientôt !',
      destinataire: '+33601020304',
      destinataireName: 'John Smith - Acme Corp',
      date: '05/03/2025',
      dateEnvoi: '05/03/2025 10:25',
      statut: 'Envoyé',
      template: 'TPL-S001',
      category: 'Rendez-vous',
      createdBy: 'Jean Dupont',
      recu: true,
      dateLecture: '05/03/2025 10:26',
      repondu: false,
      dateReponse: null,
      longueur: 98,
      nbSMS: 1
    },
    {
      id: 'SMS-002',
      contenu: 'Rappel : Votre rendez-vous est prévu demain 15/03/2025 à 11h00. Pour annuler, appelez le 01 23 45 67 89. À bientôt !',
      destinataire: '+33607080910',
      destinataireName: 'Marie Dupont - Zenith SA',
      date: '14/03/2025',
      dateEnvoi: '14/03/2025 11:00',
      statut: 'Programmé',
      template: 'TPL-S002',
      category: 'Rendez-vous',
      createdBy: 'Pierre Dubois',
      recu: false,
      dateLecture: null,
      repondu: false,
      dateReponse: null,
      longueur: 114,
      nbSMS: 1
    },
    {
      id: 'SMS-003',
      contenu: 'Votre commande CMD-2025-032 sera livrée le 07/03/2025 entre 9h et 12h. Suivez votre colis : http://trackr.co/ABC123',
      destinataire: '+33612345678',
      destinataireName: 'Robert Johnson - Global Industries',
      date: '06/03/2025',
      dateEnvoi: '06/03/2025 08:30',
      statut: 'Envoyé',
      template: 'TPL-S003',
      category: 'Logistique',
      createdBy: 'Marie Martin',
      recu: true,
      dateLecture: '06/03/2025 08:31',
      repondu: true,
      dateReponse: '06/03/2025 08:35',
      longueur: 114,
      nbSMS: 1
    },
    {
      id: 'SMS-004',
      contenu: 'Votre code de confirmation : 854712. Ne partagez jamais ce code avec une autre personne.',
      destinataire: '+33623456789',
      destinataireName: 'David Brown - Tech Solutions',
      date: '04/03/2025',
      dateEnvoi: '04/03/2025 15:45',
      statut: 'Envoyé',
      template: 'TPL-S004',
      category: 'Sécurité',
      createdBy: 'Système',
      recu: true,
      dateLecture: '04/03/2025 15:46',
      repondu: false,
      dateReponse: null,
      longueur: 82,
      nbSMS: 1
    },
    {
      id: 'SMS-005',
      contenu: '🎉 SOLDES D\'HIVER ! Profitez de 20% de réduction sur votre prochaine commande avec le code HIVER25. Offre valable jusqu\'au 31/03/2025. 🎁',
      destinataire: '+33634567890',
      destinataireName: 'Laura Wilson - Nexus Tech',
      date: '01/03/2025',
      dateEnvoi: '01/03/2025 09:00',
      statut: 'Envoyé',
      template: 'TPL-S005',
      category: 'Marketing',
      createdBy: 'Pierre Dubois',
      recu: true,
      dateLecture: '01/03/2025 10:15',
      repondu: false,
      dateReponse: null,
      longueur: 142,
      nbSMS: 1
    },
    {
      id: 'SMS-006',
      contenu: 'Bonjour Mme Garcia, nous vous confirmons votre rendez-vous le 12/03/2025 à 16h00. À bientôt !',
      destinataire: '+33645678901',
      destinataireName: 'Elena Garcia - EG Consulting',
      date: '07/03/2025',
      dateEnvoi: null,
      statut: 'Brouillon',
      template: 'TPL-S001',
      category: 'Rendez-vous',
      createdBy: 'Jean Dupont',
      recu: false,
      dateLecture: null,
      repondu: false,
      dateReponse: null,
      longueur: 100,
      nbSMS: 1
    }
  ]);

  // Statistics
  const smsStatistics = [
    { title: "SMS envoyés", value: `${smsData.filter(s => s.statut === 'Envoyé').length}`, icon: <FiSend className="text-blue-500" />, change: "Ce mois" },
    { title: "Taux de lecture", value: `${Math.round((smsData.filter(s => s.recu).length / smsData.filter(s => s.statut === 'Envoyé').length) * 100)}%`, icon: <FiEye className="text-green-500" />, change: "En hausse de 3%" },
    { title: "SMS programmés", value: smsData.filter(s => s.statut === 'Programmé').length, icon: <FiClock className="text-amber-500" />, change: "À envoyer" },
    { title: "Templates", value: templatesData.length, icon: <FiFileText className="text-indigo-500" />, change: "Modèles disponibles" }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Envoyé', 'Brouillon', 'Programmé', 'Échec'];
  const categoryOptions = ['Tous', 'Rendez-vous', 'Logistique', 'Sécurité', 'Marketing', 'Service client', 'Autre'];
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
  const setActiveTemplateHandler = (id: string): void => {
    setSelectedTemplate(id === selectedTemplate ? null : id);
    setEditMode(false);
  };

  // Set active SMS
  const setActiveSMSHandler = (id: string): void => {
    setSelectedSMS(id === selectedSMS ? null : id);
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
        template.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Tous' || template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered SMS
  const getFilteredSMS = () => {
    return smsData.filter(sms => {
      const matchesSearch = 
        searchTerm === '' || 
        sms.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.destinataire.includes(searchTerm) ||
        sms.destinataireName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Tous' || sms.statut === statusFilter;
      const matchesCategory = categoryFilter === 'Tous' || sms.category === categoryFilter;
      const matchesTemplate = templateFilter === 'Tous' || sms.template === templateFilter;
      const matchesRecipient = recipientFilter === 'Tous' || sms.destinataireName === recipientFilter;
      
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
      id: `TPL-S00${templatesData.length + 1}`,
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
  const getStatusColor = (statut: string): string => {
    switch (statut) {
      case 'Envoyé':
        return 'bg-green-100 text-green-800';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'Programmé':
        return 'bg-blue-100 text-blue-800';
      case 'Échec':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    // Simple format for French numbers: +33 6 01 02 03 04
    if (phoneNumber.startsWith('+33')) {
      const digits = phoneNumber.substring(3);
      return '+33 ' + digits.match(/.{1,2}/g)!.join(' ');
    }
    return phoneNumber;
  };
  
  // Preview sent SMS
  const smsPreview = selectedSMS ? smsData.find(sms => sms.id === selectedSMS) : null;

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
              SMS
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos SMS et modèles de communication
            </p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <FiMessageSquare className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'messages' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('messages');
                setSelectedTemplate(null);
                setSelectedSMS(null);
                setEditMode(false);
              }}
            >
              Messages
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'modeles' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('modeles');
                setSelectedSMS(null);
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
                setSelectedSMS(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Messages tab */}
          {activeTab === 'messages' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {smsStatistics.map((stat, index) => (
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
                    placeholder="Rechercher un SMS..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Créer un SMS</span>
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

              {/* SMS List - Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredSMS().map(sms => (
                    <div 
                      key={sms.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedSMS === sms.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveSMSHandler(sms.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FiMessageSquare className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{sms.destinataireName}</p>
                            <p className="text-xs text-gray-500">{formatPhoneNumber(sms.destinataire)}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sms.statut)}`}>
                          {sms.statut}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                        {sms.contenu}
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{sms.date}</span>
                        <div className="flex items-center space-x-1">
                          <span>{sms.longueur} car.</span>
                          <span>•</span>
                          <span>{sms.nbSMS} SMS</span>
                          {sms.recu && (
                            <>
                              <span>•</span>
                              <FiCheck size={12} className="text-green-500" />
                            </>
                          )}
                          {sms.repondu && (
                            <>
                              <span>•</span>
                              <FiRepeat size={12} className="text-blue-500" />
                            </>
                          )}
                        </div>
                      </div>
                      {selectedSMS === sms.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
                          <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                            <FiEye size={14} />
                            <span className="text-sm">Détails</span>
                          </button>
                          {sms.statut === 'Brouillon' && (
                            <button className="flex items-center justify-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
                              <FiEdit size={14} />
                              <span className="text-sm">Modifier</span>
                            </button>
                          )}
                          <button 
                            className="flex items-center justify-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            onClick={() => {
                              // Add delete SMS logic here
                              setSmsData(smsData.filter(item => item.id !== sms.id));
                              if (selectedSMS === sms.id) setSelectedSMS(null);
                            }}
                          >
                            <FiTrash2 size={14} />
                            <span className="text-sm">Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SMS List - List View */}
              {viewMode === 'liste' && (
                <div className="space-y-4">
                  {getFilteredSMS().map(sms => (
                    <div 
                      key={sms.id} 
                      className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedSMS === sms.id ? 'border-indigo-500' : 'border-gray-200'}`}
                      onClick={() => setActiveSMSHandler(sms.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{sms.destinataireName}</p>
                          <p className="text-sm text-gray-500">{formatPhoneNumber(sms.destinataire)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sms.statut)}`}>{sms.statut}</span>
                      </div>
                      <p className="mt-2 text-sm">{sms.contenu}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                        <span>{sms.date}</span>
                        <div className="flex items-center space-x-1">
                          <span>{sms.longueur} car.</span>
                          <span>•</span>
                          <span>{sms.nbSMS} SMS</span>
                          {sms.recu && (
                            <>
                              <span>•</span>
                              <FiCheck size={12} className="text-green-500" />
                            </>
                          )}
                          {sms.repondu && (
                            <>
                              <span>•</span>
                              <FiRepeat size={12} className="text-blue-500" />
                            </>
                          )}
                        </div>
                      </div>
                      {selectedSMS === sms.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                          <button className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                            <FiEye size={14} />
                            <span className="text-sm">Détails</span>
                          </button>
                          {sms.statut === 'Brouillon' && (
                            <button className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
                              <FiEdit size={14} />
                              <span className="text-sm">Modifier</span>
                            </button>
                          )}
                          <button 
                            className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            onClick={() => {
                              // Add delete SMS logic here
                              setSmsData(smsData.filter(item => item.id !== sms.id));
                              if (selectedSMS === sms.id) setSelectedSMS(null);
                            }}
                          >
                            <FiTrash2 size={14} />
                            <span className="text-sm">Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content for Templates tab */}
          {activeTab === 'modeles' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Modèles SMS</h2>
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>Créer un modèle</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredTemplates().map(template => (
                  <div 
                    key={template.id} 
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer ${selectedTemplate === template.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveTemplateHandler(template.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{template.nom}</h3>
                      {template.isDefault && (
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Par défaut</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{template.description}</p>
                    <p className="mt-2 text-xs text-gray-500">Créé le: {template.dateCreation}</p>
                  </div>
                ))}
              </div>
              {selectedTemplate && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow border">
                  {editMode ? (
                    <>
                      <h3 className="text-xl font-bold mb-4">Modifier le modèle</h3>
                      <textarea 
                        className="w-full p-2 border border-gray-300 rounded" 
                        value={getTemplateById(selectedTemplate)?.content || ''} 
                        onChange={(e) => {
                          const newTemplates = templatesData.map(t => {
                            if (t.id === selectedTemplate) {
                              return { ...t, content: e.target.value };
                            }
                            return t;
                          });
                          setTemplatesData(newTemplates);
                        }} 
                      />
                      <div className="mt-4 flex space-x-2">
                        <button onClick={saveTemplateChanges} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                          Enregistrer
                        </button>
                        <button onClick={toggleEditMode} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition">
                          Annuler
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">Détails du modèle</h3>
                      <p className="text-sm text-gray-700">{getTemplateById(selectedTemplate)?.content}</p>
                      <div className="mt-4 flex space-x-2">
                        <button onClick={toggleEditMode} className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
                          <FiEdit />
                          <span>Modifier</span>
                        </button>
                        <button onClick={() => duplicateTemplate(selectedTemplate)} className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                          <FiCopy />
                          <span>Dupliquer</span>
                        </button>
                        <button onClick={() => deleteTemplate(selectedTemplate)} className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
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

          {/* Content for Settings tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Paramètres</h2>
              <p className="text-sm text-gray-600">
                Ici, vous pouvez configurer les paramètres de votre système SMS.
              </p>
              {/* Add settings form or options as needed */}
            </div>
          )}
        </div>

        {/* SMS Preview Modal */}
        {smsPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setSelectedSMS(null)}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Aperçu du SMS</h3>
                <button onClick={() => setSelectedSMS(null)}>
                  <FiX size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-700">{smsPreview.contenu}</p>
              <div className="mt-4 text-xs text-gray-500">
                <p>Destinataire: {smsPreview.destinataireName} ({formatPhoneNumber(smsPreview.destinataire)})</p>
                <p>Date d&apos;envoi: {smsPreview.dateEnvoi || smsPreview.date}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
