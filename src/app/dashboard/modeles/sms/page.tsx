'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { AnimatePresence, motion } from 'framer-motion';
// import { FiX, FiSmile, FiTag, FiCalendar, FiArchive, FiClock, FiSend, FiUsers, FiCheckSquare } from 'react-icons/fi';
// import { Multiselect } from 'multiselect-react-dropdown';
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
  FiRepeat,
  // FiChevronDown,
  FiSettings,
  FiSmile,
  FiBell,
  // FiUser,
  FiChevronRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiCalendar,
  // FiFolder,
  // FiPhone,
  FiBarChart2,
  FiDownload,
  FiTag,
  FiArchive,
  // FiHelpCircle,
  // FiRefreshCw,
  FiArrowRight,
  FiArrowUp,
  FiArrowDown,
  FiChevronLeft,
  FiUsers
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Multiselect from 'multiselect-react-dropdown';
import TemplateCreationModal from './TemplateCreationModal';

/* ------------------------------------------
   1. Define your TypeScript interfaces/types
------------------------------------------- */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationState {
  message: string;
  type: NotificationType;
}

type TrendType = 'up' | 'down' | 'neutral';

interface SmsStatistic {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: TrendType;
  chartData: Array<{ value: number }>;
}

interface Activity {
  id: number;
  type: string;
  action: string;
  details: string;
  time: string;
  icon: React.ReactNode;
}

interface CategoryData {
  name: string;
  value: number;
}

interface TrendData {
  name: string;
  sent: number;
  received: number;
}

interface TemplateData {
  id: string;
  nom: string;
  description: string;
  dateCreation: string;
  derniereMaj: string;
  isDefault: boolean;
  category: string;
  content: string;
  variables: string[];
  maxLength: number;
  emojis: boolean;
  usageCount: number;
  color: string;
}

interface SmsData {
  id: string;
  contenu: string;
  destinataire: string;
  destinataireName: string;
  date: string;
  dateEnvoi: string | null;
  statut: string; // Could also be union of 'Envoyé'|'Brouillon'|'Programmé'|'Échec' if you want
  template: string;
  category: string;
  createdBy: string;
  recu: boolean;
  dateLecture: string | null;
  repondu: boolean;
  dateReponse: string | null;
  longueur: number;
  nbSMS: number;
  color: string;
  avatar: string;
}

type ExtendedCSSProperties = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined; // for custom CSS variables
  WebkitBackgroundClip?: string;                     // or other custom vendor properties
  '--tw-ring-color': string;
};

// Add this type definition for recipients
interface Recipient {
  id: string;
  name: string;
  value: string;
  label: string;
}

/* ------------------------------------------
   2. Main component
------------------------------------------- */
export default function SMS() {
  // Update state definitions with proper types
  const [activeTab, setActiveTab] = useState<'messages' | 'modeles' | 'parametres'>('messages');
  const [activeSubtab, setActiveSubtab] = useState<'tous' | 'envoyes' | 'brouillons' | 'programmes' | 'echecs'>('tous');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'liste' | 'grid'>('liste');
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [ , setComposeMode] = useState(false); // Fix unused variable warning by removing the underscore
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messageText, setMessageText] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]); // Add proper type
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null); // Add proper type
  const [tags, setTags] = useState<string[]>([]); // Add proper type
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);

  // Schedule message function
  const scheduleMessage = (recipients: Recipient[], message: string, time: string | null, tags: string[]) => {
    // Implementation could save the message for scheduled delivery
    console.log('Scheduling message for', recipients, 'at', time, 'with tags', tags, 'and content:', message);
    displayNotification("SMS programmé pour envoi ultérieur", "success");
    closeDrawer();
  };

  // Save draft function
  const saveDraft = (recipients: Recipient[], message: string, tags: string[]) => {
    // Implementation to save as draft
    console.log('Saving draft for', recipients, 'with tags', tags, 'and content:', message);
    displayNotification("SMS enregistré comme brouillon", "success");
    closeDrawer();
  };

  // Reset state when drawer opens
  useEffect(() => {
    if (drawerOpen) {
      // Optionally reset or keep existing state
    }
  }, [drawerOpen]);

  // Display notification function
  // const displayNotification = (message, type) => {
  //   // Assuming there's a notification system implemented elsewhere
  //   if (window.displayNotification) {
  //     window.displayNotification(message, type);
  //   } else {
  //     console.log(`Notification (${type}): ${message}`);
  //   }
  // };

  // Send message function
  // const sendMessage = () => {
  //   if (!messageText?.trim()) {
  //     displayNotification("Le message ne peut pas être vide", "error");
  //     return;
  //   }

  //   if (selectedRecipients.length === 0) {
  //     displayNotification("Veuillez sélectionner au moins un destinataire", "error");
  //     return;
  //   }

  //   // Call the parent component's sendSMS function
  //   if (sendSMS) {
  //     const recipientIds = selectedRecipients.map(r => r.id || r.value);
  //     sendSMS(recipientIds, messageText, tags);
  //     displayNotification(
  //       selectedRecipients.length > 1 
  //         ? `SMS envoyé à ${selectedRecipients.length} destinataires` 
  //         : "SMS envoyé avec succès", 
  //       "success"
  //     );
  //   } else {
  //     // Fallback if sendSMS not provided
  //     displayNotification("SMS envoyé avec succès", "success");
  //     console.log("Sending SMS to:", selectedRecipients, "Message:", messageText);
  //   }
    
  //   closeDrawer();
  // };


  // The primary theme color
  const primaryColor = '#1B0353';

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [recipientFilter, setRecipientFilter] = useState('Tous');

  // Notification handler (fixing the implicit any type for parameters)
  const displayNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Check for scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sample SMS templates data
  const [templatesData, setTemplatesData] = useState<TemplateData[]>([
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
      emojis: false,
      usageCount: 42,
      color: '#4F46E5'
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
      emojis: false,
      usageCount: 38,
      color: '#0EA5E9'
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
      emojis: true,
      usageCount: 25,
      color: '#F59E0B'
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
      emojis: false,
      usageCount: 63,
      color: '#8B5CF6'
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
      emojis: true,
      usageCount: 19,
      color: '#EC4899'
    }
  ]);

  // Sample SMS data
  const [smsData, setSmsData] = useState<SmsData[]>([
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
      nbSMS: 1,
      color: '#4F46E5',
      avatar: '🏢'
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
      nbSMS: 1,
      color: '#8B5CF6',
      avatar: '🌐'
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
      nbSMS: 1,
      color: '#EC4899',
      avatar: '🏭'
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
      nbSMS: 1,
      color: '#0EA5E9',
      avatar: '💻'
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
      nbSMS: 1,
      color: '#0EA5E9',
      avatar: '💻'
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
      nbSMS: 1,
      color: '#10B981',
      avatar: '📝'
    },
    {
      id: 'SMS-007',
      contenu: 'Nous sommes désolés, mais votre rendez-vous du 18/03/2025 a dû être annulé. Veuillez contacter notre service client au 01 23 45 67 89 pour planifier un nouveau rendez-vous.',
      destinataire: '+33656789012',
      destinataireName: 'Paul Martin - PM Consulting',
      date: '08/03/2025',
      dateEnvoi: '08/03/2025 14:20',
      statut: 'Échec',
      template: 'TPL-S001',
      category: 'Rendez-vous',
      createdBy: 'Sophie Leclerc',
      recu: false,
      dateLecture: null,
      repondu: false,
      dateReponse: null,
      longueur: 168,
      nbSMS: 2,
      color: '#F59E0B',
      avatar: '📊'
    }
  ]);

  // Advanced statistics
  const messagesByCategory: CategoryData[] = [
    { name: 'Rendez-vous', value: 4 },
    { name: 'Logistique', value: 1 },
    { name: 'Sécurité', value: 1 },
    { name: 'Marketing', value: 1 }
  ];

  const deliverySuccess: CategoryData[] = [
    { name: 'Reçus', value: 5 },
    { name: 'Non Reçus', value: 2 }
  ];

  const messageTrend: TrendData[] = [
    { name: 'Lun', sent: 8, received: 4 },
    { name: 'Mar', sent: 12, received: 7 },
    { name: 'Mer', sent: 10, received: 6 },
    { name: 'Jeu', sent: 15, received: 13 },
    { name: 'Ven', sent: 20, received: 15 },
    { name: 'Sam', sent: 5, received: 3 },
    { name: 'Dim', sent: 3, received: 1 }
  ];

  const colors = ['#4F46E5', '#8B5CF6', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B'];

  // Basic statistics
  const smsStatistics: SmsStatistic[] = [
    {
      title: 'SMS envoyés',
      value: `${smsData.filter((s) => s.statut === 'Envoyé').length}`,
      icon: <FiSend className="text-indigo-500" />,
      change: '+12% ce mois',
      trend: 'up',
      chartData: [{ value: 30 }, { value: 35 }, { value: 40 }, { value: 38 }, { value: 42 }, { value: 48 }, { value: 52 }]
    },
    {
      title: 'Taux de lecture',
      value: `${
        Math.round(
          (smsData.filter((s) => s.recu).length /
            smsData.filter((s) => s.statut === 'Envoyé').length) *
            100
        ) || 0
      }%`,
      icon: <FiEye className="text-purple-500" />,
      change: '+3% ce mois',
      trend: 'up',
      chartData: [{ value: 82 }, { value: 84 }, { value: 85 }, { value: 86 }, { value: 88 }, { value: 90 }, { value: 92 }]
    },
    {
      title: 'SMS programmés',
      value: `${smsData.filter((s) => s.statut === 'Programmé').length}`,
      icon: <FiClock className="text-amber-500" />,
      change: '+1 cette semaine',
      trend: 'neutral',
      chartData: [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }]
    },
    {
      title: 'Taux de réponse',
      value: `${
        Math.round(
          (smsData.filter((s) => s.repondu).length /
            smsData.filter((s) => s.statut === 'Envoyé').length) *
            100
        ) || 0
      }%`,
      icon: <FiRepeat className="text-indigo-500" />,
      change: '-2% ce mois',
      trend: 'down',
      chartData: [{ value: 24 }, { value: 23 }, { value: 22 }, { value: 21 }, { value: 20 }, { value: 20 }, { value: 20 }]
    }
  ];

  // Recent activities
  const recentActivities: Activity[] = [
    {
      id: 1,
      type: 'send',
      action: 'SMS envoyé',
      details: 'John Smith - Acme Corp',
      time: 'Il y a 3 heures',
      icon: <FiSend className="text-indigo-500" />
    },
    {
      id: 2,
      type: 'read',
      action: 'SMS lu',
      details: 'Robert Johnson - Global Industries',
      time: 'Il y a 5 heures',
      icon: <FiEye className="text-purple-500" />
    },
    {
      id: 3,
      type: 'draft',
      action: 'Brouillon créé',
      details: 'Elena Garcia - EG Consulting',
      time: 'Il y a 1 jour',
      icon: <FiEdit className="text-amber-500" />
    },
    {
      id: 4,
      type: 'schedule',
      action: 'SMS programmé',
      details: 'Marie Dupont - Zenith SA',
      time: 'Il y a 2 jours',
      icon: <FiClock className="text-indigo-500" />
    },
    {
      id: 5,
      type: 'error',
      action: "Échec d'envoi",
      details: 'Paul Martin - PM Consulting',
      time: 'Il y a 3 jours',
      icon: <FiAlertTriangle className="text-red-500" />
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Envoyé', 'Brouillon', 'Programmé', 'Échec'];
  const categoryOptions = [
    'Tous',
    'Rendez-vous',
    'Logistique',
    'Sécurité',
    'Marketing',
    'Service client',
    'Autre'
  ];
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

  // Set active SMS
  const setActiveSMSHandler = (id: string) => {
    setSelectedSMS(id === selectedSMS ? null : id);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Get template by ID
  const getTemplateById = (id: string) => {
    return templatesData.find((template) => template.id === id);
  };

  // Get filtered templates
  const getFilteredTemplates = () => {
    return templatesData.filter((template) => {
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
    return smsData.filter((sms) => {
      const matchesSearch =
        searchTerm === '' ||
        sms.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.destinataire.includes(searchTerm) ||
        sms.destinataireName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'Tous' || sms.statut === statusFilter;
      const matchesCategory = categoryFilter === 'Tous' || sms.category === categoryFilter;
      const matchesTemplate = templateFilter === 'Tous' || sms.template === templateFilter;
      const matchesRecipient = recipientFilter === 'Tous' || sms.destinataireName === recipientFilter;

      // Subtab filtering
      if (activeSubtab === 'envoyes' && sms.statut !== 'Envoyé') return false;
      if (activeSubtab === 'brouillons' && sms.statut !== 'Brouillon') return false;
      if (activeSubtab === 'programmes' && sms.statut !== 'Programmé') return false;
      if (activeSubtab === 'echecs' && sms.statut !== 'Échec') return false;

      // For dateRangeFilter, we skip actual date logic here, so always true
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
    displayNotification('Filtres réinitialisés', 'success');
  };

  // Save template changes
  const saveTemplateChanges = () => {
    // Implement save logic here
    setEditMode(false);
    displayNotification('Modèle enregistré avec succès', 'success');
  };

  // Duplicate template
  const duplicateTemplate = (id: string) => {
    const template = getTemplateById(id);
    if (!template) return;

    const newTemplate: TemplateData = {
      ...template,
      id: `TPL-S00${templatesData.length + 1}`,
      nom: `${template.nom} (Copie)`,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false,
      usageCount: 0
    };

    setTemplatesData([...templatesData, newTemplate]);
    displayNotification('Modèle dupliqué avec succès', 'success');
  };

  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplatesData(templatesData.filter((template) => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
      setEditMode(false);
    }
    displayNotification('Modèle supprimé', 'warning');
  };

  // Delete SMS
  const deleteSMS = (id: string) => {
    setSmsData(smsData.filter((sms) => sms.id !== id));
    if (selectedSMS === id) {
      setSelectedSMS(null);
    }
    displayNotification('SMS supprimé', 'warning');
  };

  // Get status color
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Envoyé':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Brouillon':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'Programmé':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Échec':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get trend indicator
  const getTrendIndicator = (trend: TrendType) => {
    switch (trend) {
      case 'up':
        return <FiArrowUp className="text-green-500" />;
      case 'down':
        return <FiArrowDown className="text-red-500" />;
      default:
        return <FiArrowRight className="text-gray-400" />;
    }
  };

  // Format phone number
  const formatPhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    // Simple format for French numbers: +33 6 01 02 03 04
    if (phoneNumber.startsWith('+33')) {
      const digits = phoneNumber.substring(3);
      const spaced = digits.match(/.{1,2}/g);
      return spaced ? `+33 ${spaced.join(' ')}` : phoneNumber;
    }
    return phoneNumber;
  };

  // Preview sent SMS
  const smsPreview = selectedSMS ? smsData.find((sms) => sms.id === selectedSMS) : null;

  // Handle compose
  const handleCompose = () => {
    setComposeMode(true);
    setDrawerOpen(true);
    setSelectedSMS(null);
    setSelectedTemplate(null);
  };

  // Close drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setComposeMode(false);
    }, 300);
  };

  // Send a new message
  const sendMessage = () => {
    // Implement send logic here
    closeDrawer();
    displayNotification('SMS envoyé avec succès', 'success');
  };

  
  // Save as draft function
  const saveAsDraft = () => {
    if (saveDraft) {
      saveDraft(selectedRecipients, messageText, tags);
    }
    displayNotification("SMS enregistré comme brouillon", "success");
    closeDrawer();
  };
  
  // Schedule message function
  const handleScheduleMessage = () => {
    if (showDatePicker) {
      if (scheduleMessage && scheduledTime) {
        scheduleMessage(selectedRecipients, messageText, scheduledTime, tags);
      }
      displayNotification("SMS programmé pour envoi ultérieur", "success");
      setShowDatePicker(false);
      closeDrawer();
    } else {
      setShowDatePicker(true);
    }
  };
  
  // Toggle bulk mode
  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    if (!bulkMode) {
      displayNotification("Mode d'envoi groupé activé", "info");
    } else {
      setSelectedRecipients([]);
    }
  };

  // Handle emoji selection
  // const handleEmojiClick = (emoji) => {
  //   setMessageText((prevText) => prevText + emoji.native);
  //   setShowEmojiPicker(false);
  // };

  // // Handle tag selection
  // const handleTagSelect = (selectedTags) => {
  //   setTags(selectedTags);
  // };

  // Format recipients for display in multiselect
  const formattedRecipients = smsData.map((sms ) => ({
    id: sms.destinataire,
    name: sms.destinataireName,
    value: sms.destinataire,
    label: sms.destinataireName
  }));

  // Calculate SMS count based on message length
  const smsCount = Math.ceil((messageText?.length || 0) / 160) || 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Sticky top bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-indigo-800 text-lg flex items-center">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-700 to-purple-800 flex items-center justify-center mr-3 shadow-lg"
              style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}
            >
              <FiMessageSquare className="text-white text-xl" />
            </div>
            {isScrolled && <span style={{ color: primaryColor }}>Gestion SMS</span>}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition relative">
              <FiBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition">
              <FiSettings />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center text-white font-medium shadow"
              style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}
            >
              JD
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* ---------- HEADER / HERO SECTION ---------- */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/10 via-white/70 to-purple-700/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-700/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-700/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-700/10 rounded-lg">
                    <FiMessageSquare className="w-6 h-6 text-indigo-700" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                    Gestion SMS
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-700/10 rounded-full">
                    {/* Replace with your actual SMS count variable or calculation */}
                    0 messages
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez et suivez toutes vos communications SMS. Créez des modèles, 
                  programmez des envois et analysez vos campagnes.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-xl hover:shadow-lg transition"
                  onClick={handleCompose}
                >
                  <FiMessageSquare className="mr-2" />
                  Composer un SMS
                </motion.button>
              </div>
            </div>
            
            {/* Action buttons row */}
            <div className="flex flex-wrap gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-indigo-700/10 text-indigo-700 rounded-xl hover:bg-indigo-700/20 transition"
                onClick={() => {
                  setActiveTab('modeles');
                  setSelectedSMS(null);
                  displayNotification("Créez ou modifiez vos modèles", "info");
                }}
              >
                <FiFileText className="mr-2" />
                Gérer les modèles
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-indigo-700/10 text-indigo-700 rounded-xl hover:bg-indigo-700/20 transition"
                onClick={() => {
                  displayNotification("Téléchargement du rapport en cours...", "info");
                  setTimeout(() => {
                    displayNotification("Rapport téléchargé avec succès", "success");
                  }, 1500);
                }}
              >
                <FiBarChart2 className="mr-2" />
                Rapport d&apos;analytics
              </motion.button>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Composez des SMS personnalisés ou utilisez des modèles prédéfinis pour gagner du temps. Programmez vos envois pour optimiser vos campagnes.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Recent Activity */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Status Overview */}
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Statut des messages</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Envoyés</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{smsData.filter(sms => sms.statut === 'Envoyé').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Programmés</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{smsData.filter(sms => sms.statut === 'Programmé').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Brouillons</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{smsData.filter(sms => sms.statut === 'Brouillon').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Échecs</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{smsData.filter(sms => sms.statut === 'Échec').length}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Répartition par catégorie</span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={messagesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {messagesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Activité récente</h3>
                <button className="text-xs hover:text-indigo-800 transition" style={{ color: primaryColor }}>
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="p-3 rounded-xl hover:bg-gray-50 transition-all flex items-start"
                  >
                    <div className="p-2 rounded-full bg-gray-100 mr-3">
                      {activity.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.details}</div>
                      <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button 
                  className="w-full p-3 rounded-lg font-medium text-sm text-left flex items-center"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  onClick={handleCompose}
                >
                  <FiMessageSquare className="mr-3" />
                  Nouveau SMS
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 transition text-left flex items-center"
                  onClick={() => {
                    setActiveTab('modeles');
                    displayNotification("Créez un nouveau modèle", "info");
                  }}
                >
                  <FiFileText className="mr-3" />
                  Créer un modèle
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm hover:bg-amber-100 transition text-left flex items-center"
                  onClick={() => {
                    displayNotification("Téléchargement du rapport en cours...", "info");
                    setTimeout(() => {
                      displayNotification("Rapport téléchargé avec succès", "success");
                    }, 1500);
                  }}
                >
                  <FiDownload className="mr-3" />
                  Télécharger les logs
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-purple-50 text-purple-700 font-medium text-sm hover:bg-purple-100 transition text-left flex items-center"
                  onClick={() => {
                    setActiveTab('parametres');
                    displayNotification("Configurez vos préférences SMS", "info");
                  }}
                >
                  <FiSettings className="mr-3" />
                  Configuration SMS
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'messages' 
                    ? 'border-b-2 bg-opacity-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: activeTab === 'messages' ? primaryColor : undefined,
                    borderColor: activeTab === 'messages' ? primaryColor : undefined,
                    backgroundColor: activeTab === 'messages' ? `${primaryColor}08` : undefined
                  }}
                  onClick={() => {
                    setActiveTab('messages');
                    setSelectedTemplate(null);
                    setSelectedSMS(null);
                    setEditMode(false);
                  }}
                >
                  <FiMessageSquare className={`mr-2 ${activeTab === 'messages' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'messages' ? primaryColor : undefined }} />
                  Messages
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'modeles' 
                    ? 'border-b-2 bg-opacity-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: activeTab === 'modeles' ? primaryColor : undefined,
                    borderColor: activeTab === 'modeles' ? primaryColor : undefined,
                    backgroundColor: activeTab === 'modeles' ? `${primaryColor}08` : undefined
                  }}
                  onClick={() => {
                    setActiveTab('modeles');
                    setSelectedSMS(null);
                    setEditMode(false);
                  }}
                >
                  <FiFileText className={`mr-2 ${activeTab === 'modeles' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'modeles' ? primaryColor : undefined }} />
                  Modèles
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'parametres' 
                    ? 'border-b-2 bg-opacity-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: activeTab === 'parametres' ? primaryColor : undefined,
                    borderColor: activeTab === 'parametres' ? primaryColor : undefined,
                    backgroundColor: activeTab === 'parametres' ? `${primaryColor}08` : undefined
                  }}
                  onClick={() => {
                    setActiveTab('parametres');
                    setSelectedTemplate(null);
                    setSelectedSMS(null);
                    setEditMode(false);
                  }}
                >
                  <FiSettings className={`mr-2 ${activeTab === 'parametres' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'parametres' ? primaryColor : undefined }} />
                  Paramètres
                </button>
              </div>

              {/* Content for Messages tab */}
              {activeTab === 'messages' && (
                <div className="text-gray-500 p-6">
                  {/* Sub-tabs for message types */}
                  <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button 
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'tous' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'tous' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'tous' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('tous')}
                    >
                      Tous
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'envoyes' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'envoyes' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'envoyes' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('envoyes')}
                    >
                      Envoyés
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'brouillons' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'brouillons' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'brouillons' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('brouillons')}
                    >
                      Brouillons
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'programmes' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'programmes' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'programmes' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('programmes')}
                    >
                      Programmés
                    </button>
                    <button 
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'echecs' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'echecs' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'echecs' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('echecs')}
                    >
                      Échecs
                    </button>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {smsStatistics.map((stat, index) => (
                      <motion.div 
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center mb-2">
                          <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${primaryColor}15` }}>
                            {stat.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className={`text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 ${
                            stat.trend === 'up' 
                              ? 'text-green-700 bg-green-50' 
                              : stat.trend === 'down' 
                                ? 'text-amber-700 bg-amber-50' 
                                : 'text-gray-500 bg-gray-50'
                          }`}>
                            {getTrendIndicator(stat.trend)}
                            <span>{stat.change}</span>
                          </div>
                        </div>
                        
                        {/* Mini chart */}
                        <div className="mt-4 h-10">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stat.chartData}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={
                                  stat.trend === 'up' 
                                    ? '#16A34A' 
                                    : stat.trend === 'down' 
                                      ? '#F59E0B' 
                                      : primaryColor
                                } 
                                strokeWidth={2} 
                                dot={false} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
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
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ 
                          borderColor: 'transparent',
                          boxShadow: 'inset 0 0 0 1px rgba(209, 213, 219, 1)', // This simulates a border
                          '--tw-ring-color': `${primaryColor}40`  // This uses the primary color for focus ring with 40% opacity
                        }as ExtendedCSSProperties}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 px-3 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
                        style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}
                        onClick={handleCompose}
                      >
                        <FiPlus />
                        <span>Créer un SMS</span>
                      </motion.button>
                      <button 
                        onClick={toggleFilters}
                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        <FiFilter />
                        <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                      </button>
                      <button 
                        onClick={toggleViewMode}
                        className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        {viewMode === 'liste' ? <FiGrid /> : <FiList />}
                        <span className="hidden md:inline">{viewMode === 'liste' ? 'Vue grille' : 'Vue liste'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-6 p-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Statut
                            </label>
                            <select 
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
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
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
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
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                              value={dateRangeFilter}
                              onChange={(e) => setDateRangeFilter(e.target.value)}
                            >
                              {dateRangeOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetFilters}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                          >
                            Réinitialiser
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-white rounded-lg transition"
                            style={{ backgroundColor: primaryColor }}
                            onClick={() => {
                              setShowFilters(false);
                              displayNotification("Filtres appliqués", "success");
                            }}
                          >
                            Appliquer les filtres
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* SMS List - Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredSMS().length > 0 ? (
                        getFilteredSMS().map(sms => (
                          <motion.div 
                            key={sms.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-white rounded-lg shadow-sm border overflow-hidden ${selectedSMS === sms.id ? 'ring-2' : 'hover:shadow-md'}`}
                            style={
                              selectedSMS === sms.id
                                ? { boxShadow: `0 0 0 4px ${primaryColor}` }
                                : {}
                            }
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${sms.color}20` }}>
                                    <span className="text-lg">{sms.avatar}</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{sms.destinataireName}</p>
                                    <p className="text-xs text-gray-500">{formatPhoneNumber(sms.destinataire)}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sms.statut)}`}>
                                  {sms.statut}
                                </span>
                              </div>
                              <div 
                                className="bg-gray-50 p-3 rounded-lg mb-3 text-sm max-h-24 overflow-y-auto"
                                onClick={() => setActiveSMSHandler(sms.id)}
                              >
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
                            </div>
                            
                            <AnimatePresence>
                              {selectedSMS === sms.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-gray-50 border-t border-gray-100"
                                >
                                  <div className="p-3 grid grid-cols-3 gap-2">
                                    <button 
                                      className="flex items-center justify-center space-x-1 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                      onClick={() => {
                                        setShowPreview(true);
                                      }}
                                    >
                                      <FiEye size={14} />
                                      <span className="text-sm">Détails</span>
                                    </button>
                                    {sms.statut === 'Brouillon' && (
                                      <button 
                                        className="flex items-center justify-center space-x-1 p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                                        onClick={() => {
                                          handleCompose();
                                          displayNotification("Édition du brouillon", "info");
                                        }}
                                      >
                                        <FiEdit size={14} />
                                        <span className="text-sm">Modifier</span>
                                      </button>
                                    )}
                                    <button 
                                      className="flex items-center justify-center space-x-1 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                      onClick={() => {
                                        deleteSMS(sms.id);
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                      <span className="text-sm">Supprimer</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full flex items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                          <div className="text-center">
                            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun message ne correspond à vos critères</p>
                            <button 
                              className="mt-2 text-sm font-medium hover:text-indigo-800"
                              style={{ color: primaryColor }}
                              onClick={resetFilters}
                            >
                              Réinitialiser les filtres
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SMS List - List View */}
                  {viewMode === 'liste' && (
                    <div className="space-y-3">
                      {getFilteredSMS().length > 0 ? (
                        getFilteredSMS().map(sms => (
                          <motion.div 
                            key={sms.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-white rounded-lg shadow-sm border overflow-hidden ${selectedSMS === sms.id ? 'ring-2' : 'hover:shadow-md'}`}
                            style={
                              selectedSMS === sms.id
                                ? { boxShadow: `0 0 0 4px ${primaryColor}` }
                                : {}
                            }
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          >
                            <div 
                              className="p-4 cursor-pointer" 
                              onClick={() => setActiveSMSHandler(sms.id)}
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${sms.color}20` }}>
                                    <span className="text-lg">{sms.avatar}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-medium">{sms.destinataireName}</p>
                                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sms.statut)}`}>{sms.statut}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{formatPhoneNumber(sms.destinataire)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">{sms.date}</div>
                                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <span>{sms.nbSMS} SMS</span>
                                    {sms.recu && <FiCheck size={14} className="text-green-500" />}
                                    {sms.repondu && <FiRepeat size={14} className="text-blue-500" />}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 text-sm">{sms.contenu}</div>
                            </div>
                            
                            <AnimatePresence>
                              {selectedSMS === sms.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-gray-50 border-t border-gray-100"
                                >
                                  <div className="p-3 flex space-x-2">
                                    <button 
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                      onClick={() => {
                                        setShowPreview(true);
                                      }}
                                    >
                                      <FiEye size={14} />
                                      <span className="text-sm">Détails</span>
                                    </button>
                                    {sms.statut === 'Brouillon' && (
                                      <button 
                                        className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                                        onClick={() => {
                                          handleCompose();
                                          displayNotification("Édition du brouillon", "info");
                                        }}
                                      >
                                        <FiEdit size={14} />
                                        <span className="text-sm">Modifier</span>
                                      </button>
                                    )}
                                    <button 
                                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                      onClick={() => {
                                        deleteSMS(sms.id);
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                      <span className="text-sm">Supprimer</span>
                                    </button>
                                    {sms.statut === 'Envoyé' && (
                                      <button 
                                        className="flex items-center space-x-1 px-3 py-1.5 text-white rounded-lg transition ml-auto"
                                        style={{ backgroundColor: primaryColor }}
                                        onClick={() => {
                                          handleCompose();
                                          displayNotification("Nouveau message basé sur ce SMS", "info");
                                        }}
                                      >
                                        <FiRepeat size={14} />
                                        <span className="text-sm">Réutiliser</span>
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                          <div className="text-center">
                            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun message ne correspond à vos critères</p>
                            <button 
                              className="mt-2 text-sm font-medium hover:text-indigo-800"
                              style={{ color: primaryColor }}
                              onClick={resetFilters}
                            >
                              Réinitialiser les filtres
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Analytics charts - Only visible when on the "tous" subtab */}
                  {activeSubtab === 'tous' && (
                    <div className="mt-8 space-y-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Tendance des messages</h3>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={messageTrend}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="sent" name="Envoyés" fill={primaryColor} />
                              <Bar dataKey="received" name="Lus" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Catégories de messages</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={messagesByCategory}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {messagesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Taux de livraison</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={deliverySuccess}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  <Cell fill="#16A34A" />
                                  <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content for Templates tab */}
              {activeTab === 'modeles' && (
                <div className="text-gray-500 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Modèles SMS</h2>
                    <TemplateCreationModal/>
                  </div>
                  
                  {/* Search for templates */}
                  <div className="mb-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un modèle..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ 
                        borderColor: 'transparent',
                        boxShadow: 'inset 0 0 0 1px rgba(209, 213, 219, 1)',
                        '--tw-ring-color': `${primaryColor}40`
                      }as ExtendedCSSProperties}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredTemplates().map(template => (
                      <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setActiveTemplateHandler(template.id)}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className={`p-4 bg-white rounded-lg shadow-sm border overflow-hidden ${
                        selectedTemplate === template.id
                          ? 'ring-2 ring-offset-1 ring-purple-600' // or your color
                          : 'hover:shadow-md'
                      }`}
                    >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: template.color }}></div>
                              <h3 className="text-lg font-medium">{template.nom}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{template.category}</p>
                          </div>
                          {template.isDefault && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, border: `1px solid ${primaryColor}30` }}>
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{template.description}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                          <span>Modifié le: {template.derniereMaj}</span>
                          <div className="flex items-center space-x-1">
                            <FiMessageSquare size={12} />
                            <span>{template.usageCount} utilisations</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <AnimatePresence>
                    {selectedTemplate && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-6 p-6 bg-white rounded-lg shadow-sm border"
                      >
                        {editMode ? (
                          <>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Modifier le modèle</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du modèle</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                  style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                                  value={getTemplateById(selectedTemplate)?.nom || ''} 
                                  onChange={(e) => {
                                    const newTemplates = templatesData.map(t => {
                                      if (t.id === selectedTemplate) {
                                        return { ...t, nom: e.target.value };
                                      }
                                      return t;
                                    });
                                    setTemplatesData(newTemplates);
                                  }}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                  style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                                  value={getTemplateById(selectedTemplate)?.description || ''} 
                                  onChange={(e) => {
                                    const newTemplates = templatesData.map(t => {
                                      if (t.id === selectedTemplate) {
                                        return { ...t, description: e.target.value };
                                      }
                                      return t;
                                    });
                                    setTemplatesData(newTemplates);
                                  }}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                                <textarea 
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent min-h-32"
                                  style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
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
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Variables disponibles</label>
                                <div className="flex flex-wrap gap-2">
                                  {getTemplateById(selectedTemplate)?.variables.map((variable, idx) => (
                                    <span 
                                      key={idx} 
                                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm"
                                    >
                                      [{variable}]
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex space-x-2">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={saveTemplateChanges} 
                                className="px-4 py-2 text-white rounded-lg transition"
                                style={{ backgroundColor: primaryColor }}
                              >
                                Enregistrer
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleEditMode} 
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                              >
                                Annuler
                              </motion.button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                  {getTemplateById(selectedTemplate)?.nom}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {getTemplateById(selectedTemplate)?.description}
                                </p>
                              </div>
                              {getTemplateById(selectedTemplate)?.isDefault && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, border: `1px solid ${primaryColor}30` }}>
                                  Modèle par défaut
                                </span>
                              )}
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Contenu du modèle</h4>
                              <p className="text-gray-800">{getTemplateById(selectedTemplate)?.content}</p>
                            </div>
                            
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Variables disponibles</h4>
                              <div className="flex flex-wrap gap-2">
                                {getTemplateById(selectedTemplate)?.variables.map((variable, idx) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm"
                                  >
                                    [{variable}]
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between pt-4 border-t border-gray-200">
                              <div className="flex space-x-2 mb-3 sm:mb-0">
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={toggleEditMode} 
                                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                                >
                                  <FiEdit />
                                  <span>Modifier</span>
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => duplicateTemplate(selectedTemplate)} 
                                  className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                                >
                                  <FiCopy />
                                  <span>Dupliquer</span>
                                </motion.button>
                                {!getTemplateById(selectedTemplate)?.isDefault && (
                                  <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => deleteTemplate(selectedTemplate)} 
                                    className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                  >
                                    <FiTrash2 />
                                    <span>Supprimer</span>
                                  </motion.button>
                                )}
                              </div>
                              
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-1 px-3 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
                                style={{ backgroundColor: primaryColor }}
                                onClick={() => {
                                  handleCompose();
                                  displayNotification("Nouveau SMS basé sur ce modèle", "info");
                                }}
                              >
                                <FiMessageSquare />
                                <span>Utiliser ce modèle</span>
                              </motion.button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Content for Settings tab */}
              {activeTab === 'parametres' && (
                <div className="text-gray-500 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Configuration SMS</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l&apos;expéditeur</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                            placeholder="Votre entreprise" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Ce nom apparaîtra comme expéditeur des SMS (11 caractères max)</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone pour les réponses</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                            placeholder="+33600000000" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Les réponses à vos SMS seront dirigées vers ce numéro</p>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="track-delivery" 
                            className="h-4 w-4 focus:ring-2 border-gray-300 rounded"
                            style={{ 
                              color: primaryColor,
                              '--tw-ring-color': `${primaryColor}40`
                            }as ExtendedCSSProperties} 
                          />
                          <label htmlFor="track-delivery" className="ml-2 block text-sm text-gray-700">
                            Suivre la livraison des SMS
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="allow-replies" 
                            className="h-4 w-4 focus:ring-2 border-gray-300 rounded"
                            style={{ 
                              color: primaryColor,
                              '--tw-ring-color': `${primaryColor}40`
                            }as ExtendedCSSProperties}
                          />
                          <label htmlFor="allow-replies" className="ml-2 block text-sm text-gray-700">
                            Autoriser les réponses aux SMS
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-white rounded-lg transition"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => displayNotification("Configuration enregistrée", "success")}
                        >
                          Enregistrer la configuration
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Limites et notifications</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Limite quotidienne de SMS</label>
                          <input 
                            type="number" 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                            placeholder="500" 
                          />
                          <p className="text-xs text-gray-500 mt-1">Nombre maximum de SMS pouvant être envoyés par jour</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Seuil d&apos;alerte</label>
                          <div className="flex">
                            <input 
                              type="number" 
                              className="w-20 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                              placeholder="80" 
                            />
                            <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500">%</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Vous recevrez une alerte lorsque ce pourcentage de la limite sera atteint</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email pour les notifications</label>
                          <input 
                            type="email" 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                            placeholder="email@example.com" 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-white rounded-lg transition"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => displayNotification("Limites mises à jour", "success")}
                        >
                          Enregistrer les limites
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">API SMS</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Clé API</label>
                          <div className="flex">
                            <input 
                              type="text" 
                              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                              value="sk_live_XXXXXXXXXXXXXXXXXXXXX"
                              readOnly
                            />
                            <button 
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-lg hover:bg-gray-300 transition"
                              onClick={() => displayNotification("Clé API copiée dans le presse-papier", "success")}
                            >
                              <FiCopy />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Ne partagez jamais cette clé avec personne</p>
                        </div>
                        
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="enable-api" 
                            className="h-4 w-4 focus:ring-2 border-gray-300 rounded"
                            style={{ 
                              color: primaryColor,
                              '--tw-ring-color': `${primaryColor}40`
                            }as ExtendedCSSProperties}
                          />
                          <label htmlFor="enable-api" className="ml-2 block text-sm text-gray-700">
                            Activer l&apos;accès API
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-white rounded-lg transition"
                          style={{ backgroundColor: primaryColor }}
                          onClick={() => {
                            displayNotification("Génération d'une nouvelle clé API...", "info");
                            setTimeout(() => {
                              displayNotification("Nouvelle clé API générée", "success");
                            }, 1500);
                          }}
                        >
                          Générer une nouvelle clé
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pagination */}
              {activeTab === 'messages' && getFilteredSMS().length > 0 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Précédent
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">{getFilteredSMS().length}</span> sur <span className="font-medium">{smsData.length}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Précédent</span>
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white"
                          style={{ 
                            backgroundColor: primaryColor,
                            borderColor: primaryColor
                          }}
                        >
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Suivant</span>
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Compose SMS Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end"
            onClick={closeDrawer}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Composer un SMS</h2>
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={closeDrawer}
                    aria-label="Fermer"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                    <select 
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': `${primaryColor}40` } as ExtendedCSSProperties}
                      value={selectedTemplateId}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setSelectedTemplateId(selectedId);
                        if (selectedId) {
                          const template = templatesData.find(t => t.id === selectedId);
                          if (template) {
                            setMessageText(template.content);
                          }
                        }
                      }}
                    >
                      <option value="">Sélectionner un modèle</option>
                      {templatesData.map(template => (
                        <option key={template.id} value={template.id}>{template.nom}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Destinataire</label>
                      <button 
                        className={`flex items-center space-x-1 text-xs ${bulkMode ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-700`}
                        onClick={toggleBulkMode}
                      >
                        <FiUsers size={14} />
                        <span>{bulkMode ? 'Mode groupé actif' : 'Activer envoi groupé'}</span>
                      </button>
                    </div>
                    
                    {bulkMode ? (
                      <Multiselect
                        options={formattedRecipients}
                        selectedValues={selectedRecipients}
                        onSelect={setSelectedRecipients}
                        onRemove={setSelectedRecipients}
                        displayValue="name"
                        placeholder="Sélectionner des destinataires"
                        style={{
                          chips: { background: primaryColor },
                          searchBox: { 
                            border: '1px solid #D1D5DB', 
                            borderRadius: '0.5rem', 
                            padding: '0.5rem' 
                          }
                        }}
                      />
                    ) : (
                      <select 
                        className="text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': `${primaryColor}40` } as ExtendedCSSProperties}
                        value={selectedRecipients.length > 0 ? selectedRecipients[0].id : ''}
                        onChange={(e) => {
                          const recipientId = e.target.value;
                          if (recipientId) {
                            const recipient = formattedRecipients.find(r => r.id === recipientId);
                            if (recipient) {
                              setSelectedRecipients([recipient]);
                            }
                          } else {
                            setSelectedRecipients([]);
                          }
                        }}
                      >
                        <option value="">Sélectionner un contact</option>
                        {formattedRecipients.map((recipient) => (
                          <option key={recipient.id} value={recipient.id}>{recipient.name}</option>
                        ))}
                      </select>
                    )}
                    
                    {selectedRecipients.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        {selectedRecipients.length} destinataire{selectedRecipients.length > 1 ? 's' : ''} sélectionné{selectedRecipients.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <span className={`text-xs ${messageText?.length > 160 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {messageText?.length || 0}/160 caractères
                      </span>
                    </div>
                    <textarea 
                      className="text-gray-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent h-40"
                      style={{ '--tw-ring-color': `${primaryColor}40` } as ExtendedCSSProperties}
                      placeholder="Saisissez votre message..."
                      value={messageText || ''}
                      onChange={(e) => setMessageText(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button 
                        className={`p-2 ${showEmojiPicker ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded transition`}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        aria-label="Ajouter emoji"
                      >
                        <FiSmile size={18} />
                      </button>
                      <button 
                        className={`p-2 ${showTagSelector ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded transition`}
                        onClick={() => setShowTagSelector(!showTagSelector)}
                        aria-label="Ajouter tag"
                      >
                        <FiTag size={18} />
                      </button>
                      <button 
                        className={`p-2 ${showDatePicker ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded transition`}
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        aria-label="Programmer"
                      >
                        <FiCalendar size={18} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{smsCount} SMS</span>
                      <span>•</span>
                      <span>Standard</span>
                    </div>
                  </div>
                  
                  {/* Emoji picker would render here if showEmojiPicker is true */}
                  {showEmojiPicker && (
                    <div className="border border-gray-200 rounded-lg p-2 max-h-40 overflow-y-auto">
                      {/* Simplified emoji picker - in a real app, use a library like emoji-mart */}
                      <div className="grid grid-cols-8 gap-1">
                        {['😀', '😂', '😊', '❤️', '👍', '🎉', '🔥', '✅', '⭐', '🚀', '📞', '📱', '👋', '🤔', '😎', '🙏'].map(emoji => (
                          <button 
                            key={emoji} 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => {
                              setMessageText(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tag selector */}
                  {showTagSelector && (
                    <div className="border border-gray-200 rounded-lg p-2">
                      <div className="text-gray-600 text-sm font-medium mb-2">Sélectionner des tags</div>
                      <div className="space-y-1">
                        {['#client', '#promo', '#rappel', '#urgent', '#info'].map(tag => (
                          <div key={tag} className="flex items-center">
                            <input 
                              type="checkbox" 
                              id={tag} 
                              className="mr-2"
                              checked={tags.includes(tag)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTags([...tags, tag]);
                                } else {
                                  setTags(tags.filter(t => t !== tag));
                                }
                              }}
                            />
                            <label htmlFor={tag} className="text-gray-600 text-sm">{tag}</label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setShowTagSelector(false)}
                        >
                          Appliquer
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Date picker for scheduling */}
                  {showDatePicker && (
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium mb-2 text-gray-600">Programmer l&apos;envoi</div>
                      <input 
                        type="datetime-local" 
                        className="text-gray-600 w-full p-2 border border-gray-300 rounded"
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                      <div className="mt-2 flex justify-end">
                        <button 
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setShowDatePicker(false)}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-6 flex justify-between">
                    <div className="space-y-2">
                      <button 
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        onClick={saveAsDraft}
                        aria-label="Enregistrer brouillon"
                      >
                        <FiArchive size={16} />
                        <span>Enregistrer</span>
                      </button>
                      <button 
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        onClick={handleScheduleMessage}
                        aria-label="Programmer envoi"
                      >
                        <FiClock size={16} />
                        <span>Programmer</span>
                      </button>
                    </div>
                    
                    <div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
                        style={{ backgroundColor: primaryColor }}
                        onClick={sendMessage}
                        disabled={!messageText?.trim() || selectedRecipients.length === 0}
                        aria-label="Envoyer message"
                      >
                        <FiSend size={16} />
                        <span>Envoyer</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* SMS Preview Modal */}
      <AnimatePresence>
        {showPreview && smsPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Détails du SMS</h3>
                    <p className="text-sm text-gray-500">ID: {smsPreview.id}</p>
                  </div>
                  <button 
                    className="text-gray-500 p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={() => setShowPreview(false)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${smsPreview.color}20` }}>
                      <span className="text-xl">{smsPreview.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{smsPreview.destinataireName}</h4>
                      <p className="text-sm text-gray-500">{formatPhoneNumber(smsPreview.destinataire)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap text-gray-500">{smsPreview.contenu}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Statut</p>
                      <p className="text-sm text-gray-900">{smsPreview.statut}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date d&apos;envoi</p>
                      <p className="text-sm text-gray-900">{smsPreview.dateEnvoi || 'Non envoyé'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Catégorie</p>
                      <p className="text-sm text-gray-900">{smsPreview.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Créé par</p>
                      <p className="text-sm text-gray-900">{smsPreview.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lu</p>
                      <p className="text-sm text-gray-900">{smsPreview.dateLecture || 'Non lu'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Réponse</p>
                      <p className="text-sm text-gray-900">{smsPreview.dateReponse || 'Pas de réponse'}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                    {smsPreview.statut === 'Brouillon' && (
                      <button 
                        className="flex items-center space-x-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                        onClick={() => {
                          setShowPreview(false);
                          handleCompose();
                        }}
                      >
                        <FiEdit size={16} />
                        <span>Modifier</span>
                      </button>
                    )}
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg transition hover:bg-opacity-80"
                      style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}
                      onClick={() => {
                        setShowPreview(false);
                        handleCompose();
                      }}
                    >
                      <FiRepeat size={16} />
                      <span>Réutiliser</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      onClick={() => {
                        setShowPreview(false);
                        deleteSMS(smsPreview.id);
                      }}
                    >
                      <FiTrash2 size={16} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-5 right-5 p-4 rounded-lg shadow-lg z-50 flex items-center"
            /* For the gradient backgrounds, you can inline them with your color logic: */
            style={{
              background:
                notification.type === 'success'
                  ? 'linear-gradient(to right, #10B981, #059669)'
                  : notification.type === 'error'
                  ? 'linear-gradient(to right, #EF4444, #DC2626)'
                  : notification.type === 'warning'
                  ? 'linear-gradient(to right, #F59E0B, #D97706)'
                  : `linear-gradient(to right, ${primaryColor}, #4F0F9F)`
            }}
          >
            <div className="flex items-center text-white">
              {notification.type === 'success' ? (
                <FiCheckCircle className="w-5 h-5 mr-2" />
              ) : notification.type === 'error' ? (
                <FiAlertTriangle className="w-5 h-5 mr-2" />
              ) : notification.type === 'warning' ? (
                <FiAlertTriangle className="w-5 h-5 mr-2" />
              ) : (
                <FiInfo className="w-5 h-5 mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
