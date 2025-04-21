'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateCreationModal from './TemplateCreationModal';
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
  FiX,
  FiClock,
  FiList,
  FiGrid,
  FiFileText,
  FiRepeat,
  FiSettings,

  FiBell,


  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,

  FiBarChart2,

  FiArrowRight,
  FiArrowUp,
  FiArrowDown,
  FiPaperclip,

} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import EmailComposeDrawer from './EmailComposeDrawer';

type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface NotificationPayload {
  message: string;
  type: NotificationType;
}


type ExtendedCSSProperties = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined; // for custom CSS variables
  WebkitBackgroundClip?: string;                     // or other custom vendor properties
};

// Template section structure
interface TemplateSection {
  id: string;
  name: string;
  content: string;
}

// Complete email template structure
interface EmailTemplate {
  id: string;
  nom: string;
  description: string;
  dateCreation: string;
  derniereMaj: string;
  isDefault: boolean;
  category: string;
  htmlContent: string;
  subject: string;
  sections: TemplateSection[];
  variables: string[];
  usageCount: number;
  color: string;
}

export default function Email() {
  // Theme color
  const primaryColor = '#1B0353';
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('emails');
  const [activeSubtab, setActiveSubtab] = useState('tous');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('liste');
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [ , setComposeMode] = useState(false);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [templateFilter, setTemplateFilter] = useState('Tous');
  const [recipientFilter, setRecipientFilter] = useState('Tous');
  
  // Notification handler
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
      ],
      usageCount: 24,
      color: '#4F46E5'
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
      ],
      usageCount: 35,
      color: '#F59E0B'
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
      ],
      usageCount: 12,
      color: '#EF4444'
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
      ],
      usageCount: 18,
      color: '#10B981'
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
      ],
      usageCount: 9,
      color: '#8B5CF6'
    }
  ]);

  // Sample emails data
  const [emailsData, setEmailsData] = useState([
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
      contenu: 'Cher M. Smith, Suite à notre échange, veuillez trouver ci-joint votre devis D2025-0125. Ce devis comprend le développement d\'une application web complète pour un montant total de 12.500 €. Pour accepter ce devis, veuillez le signer et nous le retourner par email. Ce devis est valable jusqu\'au 05/04/2025. N\'hésitez pas à nous contacter pour toute question. Cordialement, Jean Dupont',
      pieceJointe: true,
      color: '#4F46E5',
      avatar: '🏢'
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
      contenu: 'Cher M. Smith, Veuillez trouver ci-joint votre facture F2025-0088. Cette facture concerne la maintenance du système CRM pour un montant de 1.200 €. Nous vous remercions de bien vouloir régler cette facture avant le 15/03/2025. Vous pouvez effectuer votre règlement par virement bancaire ou par chèque. Nous vous remercions de votre confiance. Cordialement, Marie Martin',
      pieceJointe: true,
      color: '#F59E0B',
      avatar: '📊'
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
      contenu: 'Cher M. Dupont, Nous nous permettons de vous rappeler que la facture F2025-0056 d\'un montant de 3.450 € est échue depuis le 15/02/2025. Cette facture concerne la formation sur le logiciel XYZ et devait être réglée il y a 13 jours. Nous vous prions de bien vouloir procéder au règlement dans les plus brefs délais. Si votre paiement a été effectué entre-temps, nous vous prions d\'ignorer ce message. Cordialement, Marie Martin',
      pieceJointe: true,
      color: '#EF4444',
      avatar: '🏭'
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
      contenu: 'Bonjour M. Johnson, Nous sommes ravis de vous compter parmi nos clients ! Chez Notre Société, nous nous engageons à fournir des services de qualité avec une attention particulière à vos besoins. Votre interlocuteur privilégié est Pierre Dubois, joignable au 01 23 45 67 89. Voici les prochaines étapes : mise en place de votre espace client, configuration initiale, et formation de vos équipes. Nous vous souhaitons une excellente collaboration. Cordialement, Pierre Dubois',
      pieceJointe: false,
      color: '#10B981',
      avatar: '💻'
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
      contenu: 'Cher M. Williams, Nous tenons à vous remercier sincèrement pour votre récente commande CMD-2025-032. Votre confiance est précieuse et nous sommes heureux de contribuer à l\'optimisation de vos processus industriels. Votre satisfaction est notre priorité. N\'hésitez pas à nous faire part de vos retours. Au plaisir de vous accompagner dans vos futurs projets. Cordialement, Jean Dupont',
      pieceJointe: false,
      color: '#8B5CF6',
      avatar: '🌐'
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
      contenu: 'Cher M. Brown, Suite à notre échange, veuillez trouver ci-joint votre devis D2025-0126. Ce devis comprend la mise en place d\'une infrastructure cloud sécurisée pour un montant total de 8.750 €. Pour accepter ce devis, veuillez le signer électroniquement via notre plateforme. Ce devis est valable jusqu\'au 07/04/2025. N\'hésitez pas à nous contacter pour toute question. Cordialement, Marie Martin',
      pieceJointe: true,
      color: '#EC4899',
      avatar: '🔧'
    },
    {
      id: 'EML-007',
      subject: 'Programmation de la réunion trimestrielle',
      destinataire: 'team@dataanalytics.com',
      destinataireName: 'Data Analytics Corp',
      date: '08/03/2025',
      dateEnvoi: null,
      statut: 'Programmé',
      template: null,
      category: 'Commercial',
      documentRef: null,
      documentType: null,
      createdBy: 'Jean Dupont',
      ouvert: false,
      dateOuverture: null,
      contenu: 'Chers partenaires, J\'ai le plaisir de vous inviter à notre réunion trimestrielle qui se tiendra le 20 mars 2025 à 14h00. Nous y discuterons des résultats du Q1 et des perspectives pour le trimestre à venir. Un lien de visioconférence vous sera envoyé la veille de la réunion. Cordialement, Jean Dupont',
      pieceJointe: false,
      color: '#0EA5E9',
      avatar: '📊'
    }
  ]);

  // Advanced statistics
  const emailsByCategory = [
    { name: 'Commercial', value: 3 },
    { name: 'Comptabilité', value: 2 },
    { name: 'Marketing', value: 2 }
  ];
  
  const openRates = [
    { name: 'Ouvert', value: 3 },
    { name: 'Non ouvert', value: 2 }
  ];
  
  const emailTrend = [
    { name: 'Lun', sent: 5, opened: 3 },
    { name: 'Mar', sent: 8, opened: 4 },
    { name: 'Mer', sent: 6, opened: 3 },
    { name: 'Jeu', sent: 10, opened: 7 },
    { name: 'Ven', sent: 12, opened: 8 },
    { name: 'Sam', sent: 4, opened: 2 },
    { name: 'Dim', sent: 2, opened: 1 }
  ];
  
  const colors = ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#0EA5E9'];
  
  // Statistics
  const emailStatistics = [
    { 
      title: "Emails envoyés", 
      value: `${emailsData.filter(e => e.statut === 'Envoyé').length}`,
      icon: <FiSend className="text-indigo-500" />,
      change: "+10% ce mois",
      trend: "up",
      chartData: [
        { value: 35 }, { value: 38 }, { value: 40 }, { value: 42 }, 
        { value: 45 }, { value: 47 }, { value: 50 }
      ]
    },
    { 
      title: "Taux d'ouverture", 
      value: `${Math.round((emailsData.filter(e => e.ouvert).length / emailsData.filter(e => e.statut === 'Envoyé').length) * 100)}%`,
      icon: <FiEye className="text-purple-500" />,
      change: "+5% ce mois",
      trend: "up",
      chartData: [
        { value: 55 }, { value: 57 }, { value: 58 }, { value: 60 }, 
        { value: 62 }, { value: 64 }, { value: 67 }
      ]
    },
    { 
      title: "Emails en attente", 
      value: emailsData.filter(e => e.statut === 'Brouillon' || e.statut === 'Programmé').length,
      icon: <FiClock className="text-amber-500" />,
      change: "+2 cette semaine",
      trend: "neutral",
      chartData: [
        { value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, 
        { value: 2 }, { value: 2 }, { value: 2 }
      ]
    },
    { 
      title: "Taux de succès", 
      value: "94%",
      icon: <FiCheckCircle className="text-green-500" />,
      change: "Stable",
      trend: "neutral",
      chartData: [
        { value: 94 }, { value: 93 }, { value: 94 }, { value: 95 }, 
        { value: 94 }, { value: 93 }, { value: 94 }
      ]
    }
  ];

  // Recent activities
  const recentActivities = [
    { 
      id: 1, 
      type: "sent",
      action: "Email envoyé", 
      details: "Acme Corp - Devis D2025-0125", 
      time: "Il y a 2 heures",
      icon: <FiSend className="text-indigo-500" />
    },
    { 
      id: 2, 
      type: "read",
      action: "Email ouvert", 
      details: "Zenith SA - Facture F2025-0056", 
      time: "Il y a 3 heures",
      icon: <FiEye className="text-purple-500" />
    },
    { 
      id: 3, 
      type: "draft",
      action: "Brouillon créé", 
      details: "Tech Solutions - Devis D2025-0126", 
      time: "Il y a 5 heures",
      icon: <FiEdit className="text-amber-500" />
    },
    { 
      id: 4, 
      type: "scheduled",
      action: "Email programmé", 
      details: "Data Analytics Corp - Réunion", 
      time: "Il y a 1 jour",
      icon: <FiClock className="text-blue-500" />
    },
    { 
      id: 5, 
      type: "template",
      action: "Template modifié", 
      details: "Email Devis - Commercial", 
      time: "Il y a 2 jours",
      icon: <FiFileText className="text-green-500" />
    }
  ];



  // Filter options
  const statusOptions = ['Tous', 'Envoyé', 'Brouillon', 'Programmé'];
  const categoryOptions = ['Tous', 'Commercial', 'Comptabilité', 'Marketing', 'Support', 'Autre'];
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
      
      // Subtab filtering
      if (activeSubtab === 'envoyes' && email.statut !== 'Envoyé') return false;
      if (activeSubtab === 'brouillons' && email.statut !== 'Brouillon') return false;
      if (activeSubtab === 'programmes' && email.statut !== 'Programmé') return false;
      
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
    displayNotification("Filtres réinitialisés", "success");
  };

  // Save template changes
  const saveTemplateChanges = () => {
    // Implement save logic here
    setEditMode(false);
    displayNotification("Modèle enregistré avec succès", "success");
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
      isDefault: false,
      usageCount: 0
    };
    
    setTemplatesData([...templatesData, newTemplate]);
    displayNotification("Modèle dupliqué avec succès", "success");
  };

  // Update your handleCreateTemplate function with proper type annotation
const handleCreateTemplate = (newTemplate: EmailTemplate) => {
  setTemplatesData([...templatesData, newTemplate]);
  setShowTemplateModal(false);
  displayNotification("Modèle créé avec succès", "success");
};

  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplatesData(templatesData.filter(template => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
      setEditMode(false);
    }
    displayNotification("Modèle supprimé", "warning");
  };

  // Delete email
  const deleteEmail = (id: string) => {
    setEmailsData(emailsData.filter(email => email.id !== id));
    if (selectedEmail === id) {
      setSelectedEmail(null);
    }
    displayNotification("Email supprimé", "warning");
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
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  // Get trend indicator
  const getTrendIndicator = (trend: string) => {
    switch(trend) {
      case 'up':
        return <FiArrowUp className="text-green-500" />;
      case 'down':
        return <FiArrowDown className="text-red-500" />;
      default:
        return <FiArrowRight className="text-gray-400" />;
    }
  };

  // Truncate text
  const truncateText = (text: string, length: number) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };
  
  // Preview email
  const emailPreview = selectedEmail ? emailsData.find(email => email.id === selectedEmail) : null;
  
  // Handle compose
  const handleCompose = () => {
    setComposeMode(true);
    setDrawerOpen(true);
    setSelectedEmail(null);
    setSelectedTemplate(null);
  };
  
  // Close drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setComposeMode(false);
    }, 300);
  };
  
  // Send email
  // const sendEmail = () => {
  //   // Implement send logic here
  //   closeDrawer();
  //   displayNotification("Email envoyé avec succès", "success");
  // };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Sticky top bar */}
      <div className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-indigo-800 text-lg flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-700 to-purple-800 flex items-center justify-center mr-3 shadow-lg" style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}>
              <FiMail className="text-white text-xl" />
            </div>
            {isScrolled && <span style={{ color: primaryColor }}>Gestion Emails</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition relative">
              <FiBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition">
              <FiSettings />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center text-white font-medium shadow" style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}>
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
                    <FiMail className="w-6 h-6 text-indigo-700" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                    Gestion Emails
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-700/10 rounded-full">
                    {/* Replace with your actual email count variable or calculation */}
                    0 emails
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez et suivez votre communication par email. Créez des modèles personnalisés, 
                  automatisez vos envois et analysez les performances.
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
                  <FiMail className="mr-2" />
                  Composer un email
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
                  setSelectedEmail(null);
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
                  Utilisez des modèles personnalisés pour standardiser votre communication. Suivez les taux d&apos;ouverture et de clic pour optimiser vos campagnes.
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
            <div className="text-gray-500 bg-white rounded-2xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Statut des emails</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm">Envoyés</span>
                  </div>
                  <span className="text-sm font-medium">{emailsData.filter(email => email.statut === 'Envoyé').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Programmés</span>
                  </div>
                  <span className="text-sm font-medium">{emailsData.filter(email => email.statut === 'Programmé').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    <span className="text-sm">Brouillons</span>
                  </div>
                  <span className="text-sm font-medium">{emailsData.filter(email => email.statut === 'Brouillon').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-sm">Ouverts</span>
                  </div>
                  <span className="text-sm font-medium">{emailsData.filter(email => email.ouvert).length}</span>
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
                        data={emailsByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {emailsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Recent Activities */}
            <div className="text-gray-500 bg-white rounded-2xl shadow-md p-6 overflow-hidden">
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
                      <div className="text-sm font-medium">{activity.action}</div>
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
                  <FiMail className="mr-3" />
                  Nouvel email
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-blue-50 text-blue-700 font-medium text-sm hover:bg-blue-100 transition text-left flex items-center"
                  onClick={() => {
                    setActiveTab('modeles');
                    setShowTemplateModal(true); // Update this line
                  }}
                >
                  <FiFileText className="mr-3" />
                  Créer un modèle
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm hover:bg-amber-100 transition text-left flex items-center"
                  onClick={() => {
                    displayNotification("Planification d'un email récurrent...", "info");
                    setTimeout(() => {
                      displayNotification("Email récurrent planifié", "success");
                    }, 1500);
                  }}
                >
                  <FiClock className="mr-3" />
                  Planifier récurrence
                </button>
                <button 
                  className="w-full p-3 rounded-lg bg-purple-50 text-purple-700 font-medium text-sm hover:bg-purple-100 transition text-left flex items-center"
                  onClick={() => {
                    setActiveTab('parametres');
                    displayNotification("Configurez vos préférences email", "info");
                  }}
                >
                  <FiSettings className="mr-3" />
                  Configuration email
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
            <div className="text-gray-500 bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'emails' 
                    ? 'border-b-2 bg-opacity-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ 
                    color: activeTab === 'emails' ? primaryColor : undefined,
                    borderColor: activeTab === 'emails' ? primaryColor : undefined,
                    backgroundColor: activeTab === 'emails' ? `${primaryColor}08` : undefined
                  }}
                  onClick={() => {
                    setActiveTab('emails');
                    setSelectedTemplate(null);
                    setSelectedEmail(null);
                    setEditMode(false);
                  }}
                >
                  <FiMail className={`mr-2 ${activeTab === 'emails' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'emails' ? primaryColor : undefined }} />
                  Emails
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
                    setSelectedEmail(null);
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
                    setSelectedEmail(null);
                    setEditMode(false);
                  }}
                >
                  <FiSettings className={`mr-2 ${activeTab === 'parametres' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'parametres' ? primaryColor : undefined }} />
                  Paramètres
                </button>
              </div>

              {/* Content for Emails tab */}
              {activeTab === 'emails' && (
                <div className="p-6">
                  {/* Sub-tabs for email types */}
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
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeSubtab === 'ouverts' ? 'border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
                      style={{ 
                        color: activeSubtab === 'ouverts' ? primaryColor : undefined,
                        borderColor: activeSubtab === 'ouverts' ? primaryColor : undefined
                      }}
                      onClick={() => setActiveSubtab('ouverts')}
                    >
                      Ouverts
                    </button>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {emailStatistics.map((stat, index) => (
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
                        placeholder="Rechercher un email..."
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
                        <span>Créer un email</span>
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
                        transition={{ duration: 0.3 }}
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
                              Plage de dates
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

                  {/* Email List - Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredEmails().length > 0 ? (
                        getFilteredEmails().map(email => (
                          <motion.div 
                            key={email.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-white rounded-lg shadow-sm border overflow-hidden ${selectedEmail === email.id ? 'ring-2' : 'hover:shadow-md'}`}
                            style={{ '--tw-ring-color': selectedEmail === email.id ? primaryColor : undefined }as ExtendedCSSProperties}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${email.color}20` }}>
                                    <span className="text-lg">{email.avatar}</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{email.destinataireName}</p>
                                    <p className="text-xs text-gray-500">{email.destinataire}</p>
                                  </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.statut)}`}>
                                  {email.statut}
                                </span>
                              </div>
                              <div 
                                className="bg-gray-50 p-3 rounded-lg mb-3 text-sm max-h-24 overflow-y-auto"
                                onClick={() => setActiveEmailHandler(email.id)}
                              >
                                <div className="font-medium mb-1">{email.subject}</div>
                                {truncateText(email.contenu, 120)}
                              </div>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{email.dateEnvoi || email.date}</span>
                                <div className="flex items-center space-x-1">
                                  {email.pieceJointe && <FiPaperclip size={12} />}
                                  {email.ouvert && <FiEye size={12} className="text-green-500" />}
                                  {email.category === 'Commercial' && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">Commercial</span>}
                                  {email.category === 'Comptabilité' && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">Comptabilité</span>}
                                  {email.category === 'Marketing' && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-full">Marketing</span>}
                                </div>
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {selectedEmail === email.id && (
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
                                    {email.statut === 'Brouillon' && (
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
                                        deleteEmail(email.id);
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
                            <FiMail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun email ne correspond à vos critères</p>
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

                  {/* Email List - List View */}
                  {viewMode === 'liste' && (
                    <div className="space-y-3">
                      {getFilteredEmails().length > 0 ? (
                        getFilteredEmails().map(email => (
                          <motion.div 
                            key={email.id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`bg-white rounded-lg shadow-sm border overflow-hidden ${selectedEmail === email.id ? 'ring-2' : 'hover:shadow-md'}`}
                            style={{ '--tw-ring-color': selectedEmail === email.id ? primaryColor : undefined }as ExtendedCSSProperties}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          >
                            <div 
                              className="p-4 cursor-pointer" 
                              onClick={() => setActiveEmailHandler(email.id)}
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${email.color}20` }}>
                                    <span className="text-lg">{email.avatar}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <p className="font-medium">{email.destinataireName}</p>
                                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(email.statut)}`}>{email.statut}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{email.destinataire}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">{email.dateEnvoi || email.date}</div>
                                  <div className="flex items-center space-x-1 text-xs">
                                    {email.pieceJointe && <FiPaperclip size={14} className="text-gray-400" />}
                                    {email.ouvert && <FiEye size={14} className="text-green-500" />}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="font-medium text-sm">{email.subject}</p>
                                <p className="text-sm text-gray-600 mt-1">{truncateText(email.contenu, 150)}</p>
                              </div>
                            </div>
                            
                            <AnimatePresence>
                              {selectedEmail === email.id && (
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
                                    {email.statut === 'Brouillon' && (
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
                                        deleteEmail(email.id);
                                      }}
                                    >
                                      <FiTrash2 size={14} />
                                      <span className="text-sm">Supprimer</span>
                                    </button>
                                    <button 
                                      className="flex items-center space-x-1 px-3 py-1.5 text-white rounded-lg ml-auto"
                                      style={{ backgroundColor: primaryColor }}
                                      onClick={() => {
                                        handleCompose();
                                        displayNotification("Nouveau message basé sur cet email", "info");
                                      }}
                                    >
                                      <FiRepeat size={14} />
                                      <span className="text-sm">Réutiliser</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                          <div className="text-center">
                            <FiMail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun email ne correspond à vos critères</p>
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
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Tendance des emails</h3>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={emailTrend}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="sent" name="Envoyés" fill={primaryColor} />
                              <Bar dataKey="opened" name="Ouverts" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Répartition par catégorie</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={emailsByCategory}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {emailsByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">Taux d&apos;ouverture</h3>
                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={openRates}
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
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Modèles Email</h2>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-3 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
                      style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}
                      onClick={() => {
                        setShowTemplateModal(true); // Update this line
                      }}
                    >
                      <FiPlus />
                      <span>Créer un modèle</span>
                    </motion.button>
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
                        className={`p-4 bg-white rounded-lg shadow-sm border overflow-hidden ${selectedTemplate === template.id ? 'ring-2' : 'hover:shadow-md'}`}
                        style={{ '--tw-ring-color': selectedTemplate === template.id ? primaryColor : undefined }as ExtendedCSSProperties}
                        onClick={() => setActiveTemplateHandler(template.id)}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
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
                            <FiMail size={12} />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                  style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                                  value={getTemplateById(selectedTemplate)?.subject || ''} 
                                  onChange={(e) => {
                                    const newTemplates = templatesData.map(t => {
                                      if (t.id === selectedTemplate) {
                                        return { ...t, subject: e.target.value };
                                      }
                                      return t;
                                    });
                                    setTemplatesData(newTemplates);
                                  }}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sections</label>
                                <div className="space-y-2">
                                  {getTemplateById(selectedTemplate)?.sections.map((section, idx) => (
                                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-gray-700">{section.name}</label>
                                      </div>
                                      <textarea 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                                        style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                                        value={section.content} 
                                        onChange={(e) => {
                                          const newTemplates = templatesData.map(t => {
                                            if (t.id === selectedTemplate) {
                                              const newSections = [...t.sections];
                                              newSections[idx] = {
                                                ...newSections[idx],
                                                content: e.target.value
                                              };
                                              return { ...t, sections: newSections };
                                            }
                                            return t;
                                          });
                                          setTemplatesData(newTemplates);
                                        }}
                                        rows={2}
                                      />
                                    </div>
                                  ))}
                                </div>
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
onClick={() => setEditMode(false)}
className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
>
  Annuler
</motion.button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <h3 className="text-xl font-bold mb-4 text-gray-800">{getTemplateById(selectedTemplate)?.nom}</h3>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={toggleEditMode}
                                  className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition"
                                >
                                  <FiEdit />
                                </button>
                                <button 
                                  onClick={() => duplicateTemplate(selectedTemplate)}
                                  className="p-2 rounded-full text-gray-500 hover:text-indigo-800 hover:bg-indigo-50 transition"
                                >
                                  <FiCopy />
                                </button>
                                <button 
                                  onClick={() => deleteTemplate(selectedTemplate)}
                                  className="p-2 rounded-full text-gray-500 hover:text-red-800 hover:bg-red-50 transition"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-gray-600 mb-4">{getTemplateById(selectedTemplate)?.description}</p>
                                <div className="space-y-2">
                                  <div className="flex items-center">
                                    <span className="w-24 text-sm font-medium text-gray-700">Catégorie:</span>
                                    <span className="text-sm">{getTemplateById(selectedTemplate)?.category}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-24 text-sm font-medium text-gray-700">Créé le:</span>
                                    <span className="text-sm">{getTemplateById(selectedTemplate)?.dateCreation}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-24 text-sm font-medium text-gray-700">Modifié le:</span>
                                    <span className="text-sm">{getTemplateById(selectedTemplate)?.derniereMaj}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="w-24 text-sm font-medium text-gray-700">Utilisations:</span>
                                    <span className="text-sm">{getTemplateById(selectedTemplate)?.usageCount}</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="text-sm font-medium text-gray-700 mb-2">Variables disponibles:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {getTemplateById(selectedTemplate)?.variables.map((variable, idx) => (
                                      <span 
                                        key={idx} 
                                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs"
                                      >
                                        [{variable}]
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="text-sm font-medium text-gray-700 mb-2">Objet:</div>
                                  <div className="px-3 py-2 bg-white rounded border border-gray-300 text-sm mb-4">
                                    {getTemplateById(selectedTemplate)?.subject}
                                  </div>
                                  
                                  <div className="text-sm font-medium text-gray-700 mb-2">Contenu:</div>
                                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {getTemplateById(selectedTemplate)?.sections.map((section, idx) => (
                                      <div key={idx}>
                                        <div className="text-xs font-medium text-gray-500 mb-1">{section.name}:</div>
                                        <p className="px-3 py-2 bg-white rounded border border-gray-300 text-sm">
                                          {section.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex space-x-2">
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  // Logic to use template
                                  handleCompose();
                                  displayNotification("Modèle sélectionné", "success");
                                }} 
                                className="px-4 py-2 text-white rounded-lg transition"
                                style={{ backgroundColor: primaryColor }}
                              >
                                Utiliser ce modèle
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
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Paramètres</h2>
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4">Paramètres généraux</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom d&apos;expéditeur par défaut</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                          defaultValue="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email d&apos;expéditeur par défaut</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                          defaultValue="contact@entreprise.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Signature email</label>
                        <textarea 
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': `${primaryColor}40` }as ExtendedCSSProperties}
                          rows={4}
                          defaultValue="Cordialement,&#10;Jean Dupont&#10;Responsable Commercial&#10;Tel: 01 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <h3 className="text-lg font-medium mb-4">Paramètres de notification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notification lorsqu&apos;un email est ouvert</span>
                        <div className="w-12 h-6 bg-green-500 rounded-full p-1 flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notification pour les emails programmés</span>
                        <div className="w-12 h-6 bg-green-500 rounded-full p-1 flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Notification pour les rapports hebdomadaires</span>
                        <div className="w-12 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-lg font-medium mb-4">Intégrations</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">SMTP</span>
                          <span className="text-xs text-gray-500">Configuration du serveur d&apos;envoi</span>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                          Configurer
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">CRM</span>
                          <span className="text-xs text-gray-500">Connecter à votre CRM</span>
                        </div>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                          Connecter
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">Google Calendar</span>
                          <span className="text-xs text-gray-500">Synchroniser les emails programmés</span>
                        </div>
                        <button className="px-3 py-1 text-white rounded-lg text-sm" style={{ backgroundColor: primaryColor }}>
                          Connecté
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
      
      {/* Email Preview Modal */}
      <AnimatePresence>
        {showPreview && emailPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-gray-500 p-6 border-b">
                <div className="text-gray-500 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Détails de l&apos;email</h3>
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${emailPreview.color}20` }}>
                      <span className="text-lg">{emailPreview.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">{emailPreview.destinataireName}</p>
                      <p className="text-sm text-gray-500">{emailPreview.destinataire}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emailPreview.statut)}`}>
                    {emailPreview.statut}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-1">Objet:</div>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-500 ">
                    {emailPreview.subject}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-1">Contenu:</div>
                  <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg whitespace-pre-line">
                    {emailPreview.contenu}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Date d&apos;envoi:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {emailPreview.dateEnvoi || "Non envoyé"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Date d&apos;ouverture:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {emailPreview.dateOuverture || "Non ouvert"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Catégorie:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {emailPreview.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Créé par:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {emailPreview.createdBy}
                    </div>
                  </div>
                </div>
                
                {emailPreview.documentRef && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-1">Document lié:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg flex items-center">
                      <FiFileText className="text-gray-500 mr-2" />
                      <span>{emailPreview.documentType} {emailPreview.documentRef}</span>
                    </div>
                  </div>
                )}
                
                {emailPreview.pieceJointe && (
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-700 mb-1">Pièces jointes:</div>
                    <div className="text-gray-500 px-3 py-2 bg-gray-50 rounded-lg flex items-center">
                      <FiPaperclip className="text-gray-500 mr-2" />
                      <span>{emailPreview.documentType} {emailPreview.documentRef}.pdf</span>
                      <button className="ml-auto text-indigo-700 text-sm hover:underline">
                        Télécharger
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex justify-end space-x-2">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Fermer
                </button>
                {emailPreview.statut === 'Brouillon' && (
                  <button 
                    onClick={() => {
                      setShowPreview(false);
                      handleCompose();
                      displayNotification("Édition du brouillon", "info");
                    }}
                    className="px-4 py-2 border text-white rounded-lg transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Modifier
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Compose/Edit Email Drawer */}
      {drawerOpen && (
        <EmailComposeDrawer 
          isOpen={drawerOpen} 
          onClose={closeDrawer} 
        />
      )}
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md ${
              notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              notification.type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
              notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {notification.type === 'success' && <FiCheckCircle className="text-green-500" />}
              {notification.type === 'warning' && <FiAlertTriangle className="text-amber-500" />}
              {notification.type === 'error' && <FiX className="text-red-500" />}
              {notification.type === 'info' && <FiInfo className="text-blue-500" />}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Template Creation Modal */}
      <TemplateCreationModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSave={handleCreateTemplate}
        primaryColor={primaryColor}
      />
    </motion.div>
  );
}
