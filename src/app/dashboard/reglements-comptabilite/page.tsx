'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiClock,
  FiCalendar,
  FiRefreshCw,
  // FiFile,
  FiCheckCircle,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  // FiChevronDown,
  FiChevronRight,
  FiInfo,
  FiAlertCircle,
  FiCheck,
  FiCornerUpRight,
  FiSettings,
  FiBell,
  // FiUser,
  FiPieChart,
  FiTrendingUp,
  FiMail,
  FiFileText,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

/** Example interface for the notification object */
interface NotificationState {
  message: string;
  type: "info" | "success" | "error"; // or extend as needed
}


export default function ReglementsEcheancier() {
  // State for active tab, filters, and search
  const [activeTab, setActiveTab] = useState<"reglements" | "echeancier">("reglements");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tous");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Tous");
  const [selectedClient, setSelectedClient] = useState<string>("Tous");

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("Tous");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  // State for selected payments (for bulk actions)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Check for scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show a notification
  const displayNotification = (message: string, type: "info" | "success" | "error" = "info") => {
    setNotification({ message, type });
    setShowNotification(true);

    // Hide after 3s
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Chart data for mini-charts

  // Sample payment data
  const paymentsData = [
    {
      id: 'PAY-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montant: '15 600,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-001',
      methode: 'Virement bancaire',
      creePar: 'Jean Martin',
      notes: 'Paiement reçu pour facture complète',
      logo: '🏢',
      color: '#4F46E5'
    },
    {
      id: 'PAY-2025-002',
      date: '01/03/2025',
      client: 'Nexus Tech',
      montant: '2 990,00 €',
      statut: 'En attente',
      facture: 'FACT-2025-002',
      methode: 'Chèque',
      creePar: 'Sophie Leclerc',
      notes: 'Chèque en cours de traitement',
      logo: '💻',
      color: '#0EA5E9'
    },
    {
      id: 'PAY-2025-003',
      date: '28/02/2025',
      client: 'Zenith SA',
      montant: '4 990,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-003',
      methode: 'Carte bancaire',
      creePar: 'Thomas Bernard',
      notes: 'Paiement par carte bancaire réussi',
      logo: '🌐',
      color: '#8B5CF6'
    },
    {
      id: 'PAY-2025-004',
      date: '25/02/2025',
      client: 'Global Industries',
      montant: '3 500,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-004',
      methode: 'Virement bancaire',
      creePar: 'Marie Dupont',
      notes: 'Virement reçu le 24/02/2025',
      logo: '🏭',
      color: '#EC4899'
    },
    {
      id: 'PAY-2025-005',
      date: '20/02/2025',
      client: 'Tech Innovate',
      montant: '6 375,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-005',
      methode: 'Virement bancaire',
      creePar: 'Jean Martin',
      notes: 'Premier versement de 50% reçu',
      logo: '🚀',
      color: '#F59E0B'
    },
    {
      id: 'PAY-2025-006',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montant: '6 375,00 €',
      statut: 'Planifié',
      facture: 'FACT-2025-005',
      methode: 'Virement bancaire',
      creePar: 'Jean Martin',
      notes: 'Second versement planifié pour le 15/03/2025',
      logo: '🚀',
      color: '#F59E0B'
    },
    {
      id: 'PAY-2025-007',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montant: '8 400,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-006',
      methode: 'Virement bancaire',
      creePar: 'Sophie Leclerc',
      notes: 'Paiement complet reçu',
      logo: '⚙️',
      color: '#10B981'
    },
    {
      id: 'PAY-2025-008',
      date: '05/02/2025',
      client: 'Data Services',
      montant: '5 300,00 €',
      statut: 'Validé',
      facture: 'FACT-2025-008',
      methode: 'Prélèvement',
      creePar: 'Thomas Bernard',
      notes: 'Prélèvement automatique effectué',
      logo: '📊',
      color: '#6366F1'
    },
    {
      id: 'PAY-2025-009',
      date: '01/02/2025',
      client: 'ConsultCorp',
      montant: '1 200,00 €',
      statut: 'Rejeté',
      facture: 'FACT-2025-009',
      methode: 'Chèque',
      creePar: 'Marie Dupont',
      notes: 'Chèque rejeté pour provision insuffisante',
      logo: '📝',
      color: '#EF4444'
    }
  ];

  // Sample schedule entries data
  const scheduleData = [
    {
      id: 'ECH-2025-001',
      date: '15/03/2025',
      client: 'Tech Innovate',
      montant: '6 375,00 €',
      type: 'Versement',
      facture: 'FACT-2025-005',
      statut: 'Planifié',
      creePar: 'Jean Martin',
      notes: 'Second versement planifié',
      logo: '🚀',
      color: '#F59E0B',
      daysLeft: 5
    },
    {
      id: 'ECH-2025-002',
      date: '20/03/2025',
      client: 'Nexus Tech',
      montant: '3 500,00 €',
      type: 'Paiement mensuel',
      facture: 'FACT-2025-010',
      statut: 'Planifié',
      creePar: 'Sophie Leclerc',
      notes: 'Paiement mensuel contrat maintenance',
      logo: '💻',
      color: '#0EA5E9',
      daysLeft: 10
    },
    {
      id: 'ECH-2025-003',
      date: '25/03/2025',
      client: 'Global Industries',
      montant: '8 900,00 €',
      type: 'Paiement unique',
      facture: 'FACT-2025-011',
      statut: 'À venir',
      creePar: 'Thomas Bernard',
      notes: 'Échéance de paiement à 30 jours',
      logo: '🏭',
      color: '#EC4899',
      daysLeft: 15
    },
    {
      id: 'ECH-2025-004',
      date: '01/04/2025',
      client: 'Acme Corp',
      montant: '12 500,00 €',
      type: 'Paiement trimestriel',
      facture: 'FACT-2025-012',
      statut: 'À venir',
      creePar: 'Marie Dupont',
      notes: 'Paiement trimestriel Q2 2025',
      logo: '🏢',
      color: '#4F46E5',
      daysLeft: 22
    },
    {
      id: 'ECH-2025-005',
      date: '05/04/2025',
      client: 'Zenith SA',
      montant: '4 250,00 €',
      type: 'Paiement mensuel',
      facture: 'FACT-2025-013',
      statut: 'À venir',
      creePar: 'Jean Martin',
      notes: 'Paiement mensuel contrat SaaS',
      logo: '🌐',
      color: '#8B5CF6',
      daysLeft: 26
    },
    {
      id: 'ECH-2025-006',
      date: '10/04/2025',
      client: 'Data Services',
      montant: '5 300,00 €',
      type: 'Prélèvement automatique',
      facture: 'FACT-2025-014',
      statut: 'Planifié',
      creePar: 'Sophie Leclerc',
      notes: 'Prélèvement mensuel récurrent',
      logo: '📊',
      color: '#6366F1',
      daysLeft: 31
    },
    {
      id: 'ECH-2025-007',
      date: '15/04/2025',
      client: 'Solutions Pro',
      montant: '7 600,00 €',
      type: 'Versement',
      facture: 'FACT-2025-015',
      statut: 'À venir',
      creePar: 'Thomas Bernard',
      notes: 'Premier versement projet web',
      logo: '⚙️',
      color: '#10B981',
      daysLeft: 36
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Validé', 'En attente', 'Planifié', 'Rejeté', 'À venir'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année'];
  const clientOptions = [
    'Tous', 
    'Acme Corp', 
    'Nexus Tech', 
    'Zenith SA', 
    'Global Industries', 
    'Tech Innovate', 
    'Solutions Pro', 
    'Data Services', 
    'ConsultCorp'
  ];
  const paymentMethodOptions = ['Tous', 'Virement bancaire', 'Chèque', 'Carte bancaire', 'Prélèvement', 'Espèces'];
  const scheduleTypeOptions = ['Tous', 'Versement', 'Paiement mensuel', 'Paiement trimestriel', 'Paiement unique', 'Prélèvement automatique'];

  // Statistics
  const paymentStatistics = [
    { 
      title: "Total reçu", 
      value: "53 155,00 €", 
      icon: <FiArrowDown className="text-green-500" />, 
      change: "+15% ce mois",
      trend: "up",
      chartData: [
        { value: 40 }, { value: 42 }, { value: 45 }, { value: 47 }, 
        { value: 50 }, { value: 52 }, { value: 53 }
      ]
    },
    { 
      title: "En attente", 
      value: "9 365,00 €", 
      icon: <FiClock className="text-amber-500" />, 
      change: "-5% ce mois",
      trend: "down",
      chartData: [
        { value: 12 }, { value: 14 }, { value: 13 }, { value: 11 }, 
        { value: 10 }, { value: 9.5 }, { value: 9.3 }
      ]
    },
    { 
      title: "Taux de recouvrement", 
      value: "92%", 
      icon: <FiBarChart2 className="text-blue-500" />, 
      change: "+2% ce mois",
      trend: "up",
      chartData: [
        { value: 88 }, { value: 89 }, { value: 90 }, { value: 90 }, 
        { value: 91 }, { value: 91.5 }, { value: 92 }
      ]
    },
    { 
      title: "Délai moyen", 
      value: "12 jours", 
      icon: <FiCalendar className="text-purple-500" />, 
      change: "-3 jours ce mois",
      trend: "down",
      chartData: [
        { value: 16 }, { value: 15 }, { value: 15 }, { value: 14 }, 
        { value: 13 }, { value: 12.5 }, { value: 12 }
      ]
    }
  ];

  const scheduleStatistics = [
    { 
      title: "Montant prévu", 
      value: "48 425,00 €", 
      icon: <FiArrowUp className="text-blue-500" />, 
      change: "+8% ce mois",
      trend: "up",
      chartData: [
        { value: 42 }, { value: 43 }, { value: 44 }, { value: 45 }, 
        { value: 46 }, { value: 47 }, { value: 48 }
      ]
    },
    { 
      title: "Échéances planifiées", 
      value: "3", 
      icon: <FiClock className="text-amber-500" />, 
      change: "-1 vs mois dernier",
      trend: "down",
      chartData: [
        { value: 5 }, { value: 5 }, { value: 4 }, { value: 4 }, 
        { value: 4 }, { value: 3 }, { value: 3 }
      ]
    },
    { 
      title: "Prochaine échéance", 
      value: "15/03/2025", 
      icon: <FiCalendar className="text-indigo-500" />, 
      change: "Dans 5 jours",
      trend: "neutral",
      chartData: [
        { value: 30 }, { value: 25 }, { value: 20 }, { value: 15 }, 
        { value: 10 }, { value: 5 }, { value: 0 }
      ]
    },
    { 
      title: "Taux de ponctualité", 
      value: "89%", 
      icon: <FiCheckCircle className="text-green-500" />, 
      change: "+4% ce mois",
      trend: "up",
      chartData: [
        { value: 84 }, { value: 85 }, { value: 86 }, { value: 87 }, 
        { value: 88 }, { value: 88.5 }, { value: 89 }
      ]
    }
  ];

  // Recent activities
  const recentActivities = [
    { 
      id: 1, 
      type: "payment",
      action: "Paiement validé", 
      details: "Acme Corp - 15 600,00 €", 
      time: "Il y a 3 heures",
      icon: <FiCheck className="text-green-500" />
    },
    { 
      id: 2, 
      type: "schedule",
      action: "Échéance modifiée", 
      details: "Tech Innovate - 6 375,00 €", 
      time: "Il y a 5 heures",
      icon: <FiEdit className="text-blue-500" />
    },
    { 
      id: 3, 
      type: "payment",
      action: "Paiement en attente", 
      details: "Nexus Tech - 2 990,00 €", 
      time: "Il y a 1 jour",
      icon: <FiClock className="text-amber-500" />
    },
    { 
      id: 4, 
      type: "schedule",
      action: "Nouvelle échéance créée", 
      details: "Global Industries - 8 900,00 €", 
      time: "Il y a 2 jours",
      icon: <FiPlus className="text-indigo-500" />
    },
    { 
      id: 5, 
      type: "payment",
      action: "Paiement rejeté", 
      details: "ConsultCorp - 1 200,00 €", 
      time: "Il y a 3 jours",
      icon: <FiAlertCircle className="text-red-500" />
    }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'reglements') {
        setSelectedPayments(filteredPayments.map(payment => payment.id));
      } else {
        setSelectedPayments(filteredScheduleEntries.map(entry => entry.id));
      }
    } else {
      setSelectedPayments([]);
    }
  };

  // Make sure to type itemId: string
  const handleSelectItem = (itemId: string) => {
    if (selectedPayments.includes(itemId)) {
      setSelectedPayments(selectedPayments.filter((id) => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedPayments([...selectedPayments, itemId]);
    }
  };

  // Filter payments based on search and filter criteria
  const filteredPayments = paymentsData.filter(payment => {
    const matchesSearch = 
      searchTerm === '' || 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.facture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.montant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || payment.statut === selectedStatus;
    const matchesClient = selectedClient === 'Tous' || payment.client === selectedClient;
    const matchesPaymentMethod = selectedPaymentMethod === 'Tous' || payment.methode === selectedPaymentMethod;
    
    // For period filter we would need actual date logic; simplified here
    const matchesPeriod = selectedPeriod === 'Tous' || true;
    
    return matchesSearch && matchesStatus && matchesClient && matchesPaymentMethod && matchesPeriod;
  });

  // Filter schedule entries based on search and filter criteria
  const filteredScheduleEntries = scheduleData.filter(entry => {
    const matchesSearch = 
      searchTerm === '' || 
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.facture.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || entry.statut === selectedStatus;
    
    // For the "Echeancier" tab, we used `selectedPaymentMethod` to store the 'type' filter
    const matchesType = selectedPaymentMethod === 'Tous' || entry.type === selectedPaymentMethod;

    // For period filter we would need actual date logic; simplified here
    const matchesPeriod = selectedPeriod === 'Tous' || true;
    
    return matchesSearch && matchesStatus && matchesType && matchesPeriod;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedClient('Tous');
    setSelectedPaymentMethod('Tous');
    setSearchTerm('');
    displayNotification('Filtres réinitialisés', 'success');
  };

   // Provide a type for "status"
   const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Validé":
        return "bg-green-100 text-green-800 border border-green-200";
      case "En attente":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "Planifié":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Rejeté":
        return "bg-red-100 text-red-800 border border-red-200";
      case "À venir":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Provide a type for "trend"
  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case "up":
        return <FiArrowUp className="text-green-500" />;
      case "down":
        return <FiArrowDown className="text-red-500" />;
      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  // Simulate data loading and validation
  // Provide a type for "action"
  const handleDataAction = (action: string) => {
    // Show loading notification
    displayNotification(`Action en cours: ${action}...`, "info");

    // Simulate loading
    setTimeout(() => {
      displayNotification(`${action} effectuée avec succès!`, "success");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Sticky top bar */}
      <div className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-indigo-700 text-lg flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
              <FiDollarSign className="text-white text-xl" />
            </div>
            {isScrolled && <span>Reglements & Echeancier</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition relative">
              <FiBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition">
              <FiSettings />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium shadow">
              JD
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl shadow-xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full opacity-70"></div>
          <div className="relative">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
                Reglements & Echeancier
              </h1>

            </div>
            <p className="text-gray-600 max-w-2xl">
              Gérez efficacement vos règlements clients et votre échéancier de paiements. Suivez vos encaissements et planifiez vos revenus futurs.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                onClick={() => handleDataAction('Synchronisation')}
              >
                <FiRefreshCw className="mr-2" />
                <span>Synchroniser les données</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all"
              >
                <FiPieChart className="mr-2 text-indigo-600" />
                <span>Tableau de bord analytique</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all"
              >
                <FiFileText className="mr-2 text-indigo-600" />
                <span>Rapports financiers</span>
              </motion.button>
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
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Activité récente</h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 transition">
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
                <button className="w-full p-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition text-left flex items-center">
                  <FiCornerUpRight className="mr-3" />
                  Envoyer rappel de paiement
                </button>
                <button className="w-full p-3 rounded-lg bg-green-50 text-green-700 font-medium text-sm hover:bg-green-100 transition text-left flex items-center">
                  <FiMail className="mr-3" />
                  Email confirmation de règlement
                </button>
                <button className="w-full p-3 rounded-lg bg-amber-50 text-amber-700 font-medium text-sm hover:bg-amber-100 transition text-left flex items-center">
                  <FiTrendingUp className="mr-3" />
                  Prévisions de trésorerie
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
                    activeTab === 'reglements' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('reglements');
                    setSelectedPayments([]);
                    setSelectAll(false);
                  }}
                >
                  <FiDollarSign className={`mr-2 ${activeTab === 'reglements' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  Reglements
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'echeancier' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('echeancier');
                    setSelectedPayments([]);
                    setSelectAll(false);
                  }}
                >
                  <FiCalendar className={`mr-2 ${activeTab === 'echeancier' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  Echeancier
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {(activeTab === 'reglements' ? paymentStatistics : scheduleStatistics).map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
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
                                  ? '#10B981' 
                                  : stat.trend === 'down' 
                                    ? '#F59E0B' 
                                    : '#6366F1'
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
                      placeholder={`Rechercher ${activeTab === 'reglements' ? 'un règlement' : 'une échéance'}...`}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <FiPlus />
                      <span>{activeTab === 'reglements' ? 'Ajouter un règlement' : 'Ajouter une échéance'}</span>
                    </motion.button>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      <FiFilter />
                      <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                    </button>
                    
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiList />
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <FiGrid />
                      </button>
                    </div>
                    
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => handleDataAction('Actualisation')}
                    >
                      <FiRefreshCw />
                      <span className="hidden md:inline">Actualiser</span>
                    </button>
                    
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => handleDataAction('Export')}
                    >
                      <FiDownload />
                      <span className="hidden md:inline">Exporter</span>
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
                      className="mt-4 p-6 border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                          </label>
                          <select 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                          >
                            {statusOptions.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Période
                          </label>
                          <select 
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                          >
                            {periodOptions.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        
                        {activeTab === 'reglements' ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client
                              </label>
                              <select 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                              >
                                {clientOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Méthode de paiement
                              </label>
                              <select 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              >
                                {paymentMethodOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type d&apos;échéance
                              </label>
                              <select 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={selectedPaymentMethod}
                                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                              >
                                {scheduleTypeOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client
                              </label>
                              <select 
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                              >
                                {clientOptions.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetFilters}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                          Réinitialiser
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                          onClick={() => {
                            setShowFilters(false);
                            displayNotification('Filtres appliqués', 'success');
                          }}
                        >
                          Appliquer les filtres
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bulk Actions (visible when items are selected) */}
              <AnimatePresence>
                {selectedPayments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-6 pb-6"
                  >
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center">
                      <div className="text-indigo-800 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <FiCheck className="text-indigo-600" />
                        </div>
                        <span className="font-medium">{selectedPayments.length}</span>{' '}
                        {activeTab === 'reglements' ? 'règlement(s)' : 'échéance(s)'} sélectionné(s)
                      </div>
                      <div className="flex space-x-2">
                        {activeTab === 'reglements' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                            onClick={() => handleDataAction('Validation')}
                          >
                            <FiCheckCircle />
                            <span>Valider</span>
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                          onClick={() => handleDataAction('Export')}
                        >
                          <FiDownload />
                          <span>Exporter</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                          onClick={() => {
                            // Add confirmation logic here
                            handleDataAction('Suppression');
                            setSelectedPayments([]);
                            setSelectAll(false);
                          }}
                        >
                          <FiTrash2 />
                          <span>Supprimer</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content based on active tab */}
              <div className="px-6 pb-6">
                {/* Payments Tab */}
                {activeTab === 'reglements' && (
                  <>
                    {viewMode === 'table' ? (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                      checked={selectAll}
                                      onChange={handleSelectAll}
                                    />
                                  </div>
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  N° règlement
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Client
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Montant
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Méthode
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Statut
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Facture
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Notes
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                  <motion.tr 
                                    key={payment.id}
                                    whileHover={{ backgroundColor: '#F9FAFB' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                  >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={selectedPayments.includes(payment.id)}
                                        onChange={() => handleSelectItem(payment.id)}
                                      />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {payment.id}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {payment.date}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <span className="w-6 h-6 mr-2 flex items-center justify-center rounded-md" style={{ backgroundColor: `${payment.color}20` }}>
                                          {payment.logo}
                                        </span>
                                        {payment.client}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {payment.montant}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {payment.methode}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <span 
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payment.statut)}`}
                                      >
                                        {payment.statut}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                                      {payment.facture}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {payment.notes}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                          <FiEye />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                                          <FiEdit />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                          <FiTrash2 />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                          <FiMoreVertical />
                                        </button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                      <FiInfo className="w-10 h-10 text-gray-300 mb-2" />
                                      <p>Aucun règlement ne correspond à vos critères</p>
                                      <button 
                                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        onClick={resetFilters}
                                      >
                                        Réinitialiser les filtres
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPayments.length > 0 ? (
                          filteredPayments.map((payment) => (
                            <motion.div
                              key={payment.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                            >
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                                      checked={selectedPayments.includes(payment.id)}
                                      onChange={() => handleSelectItem(payment.id)}
                                    />
                                    <span 
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(payment.statut)}`}
                                    >
                                      {payment.statut}
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {payment.montant}
                                  </div>
                                </div>
                                
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: `${payment.color}20` }}>
                                    <span className="text-xl">{payment.logo}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{payment.client}</div>
                                    <div className="text-sm text-gray-500">{payment.date}</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                  <div>
                                    <div className="text-gray-500">N° règlement</div>
                                    <div className="font-medium">{payment.id}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Facture</div>
                                    <div className="font-medium text-indigo-600">{payment.facture}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Méthode</div>
                                    <div className="font-medium">{payment.methode}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Créé par</div>
                                    <div className="font-medium">{payment.creePar}</div>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600 border-t pt-3">
                                  <div className="font-medium text-gray-500 mb-1">Notes :</div>
                                  {payment.notes}
                                </div>
                              </div>
                              
                              <div className="flex divide-x border-t">
                                <button className="flex-1 p-2 text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center">
                                  <FiEye className="mr-1" /> Voir
                                </button>
                                <button className="flex-1 p-2 text-sm text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center">
                                  <FiEdit className="mr-1" /> Modifier
                                </button>
                                <button className="flex-1 p-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                                  <FiTrash2 className="mr-1" /> Supprimer
                                </button>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full flex items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="text-center">
                              <FiInfo className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">Aucun règlement ne correspond à vos critères</p>
                              <button 
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                onClick={resetFilters}
                              >
                                Réinitialiser les filtres
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Schedule Tab */}
                {activeTab === 'echeancier' && (
                  <>
                    {viewMode === 'table' ? (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                      checked={selectAll}
                                      onChange={handleSelectAll}
                                    />
                                  </div>
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  N° échéance
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Client
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Montant
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Délai
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Statut
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Facture
                                </th>
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {filteredScheduleEntries.length > 0 ? (
                                filteredScheduleEntries.map((entry) => (
                                  <motion.tr 
                                    key={entry.id}
                                    whileHover={{ backgroundColor: '#F9FAFB' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                  >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <input 
                                        type="checkbox" 
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={selectedPayments.includes(entry.id)}
                                        onChange={() => handleSelectItem(entry.id)}
                                      />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {entry.id}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {entry.date}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <span className="w-6 h-6 mr-2 flex items-center justify-center rounded-md" style={{ backgroundColor: `${entry.color}20` }}>
                                          {entry.logo}
                                        </span>
                                        {entry.client}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {entry.montant}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                      {entry.type}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        entry.daysLeft <= 7 
                                          ? 'bg-red-100 text-red-800 border border-red-200' 
                                          : entry.daysLeft <= 14
                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                            : 'bg-green-100 text-green-800 border border-green-200'
                                      }`}>
                                        {entry.daysLeft} jours
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <span 
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.statut)}`}
                                      >
                                        {entry.statut}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                                      {entry.facture}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                      <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                          <FiEye />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                                          <FiEdit />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                          <FiTrash2 />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                          <FiMoreVertical />
                                        </button>
                                      </div>
                                    </td>
                                  </motion.tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                      <FiInfo className="w-10 h-10 text-gray-300 mb-2" />
                                      <p>Aucune échéance ne correspond à vos critères</p>
                                      <button 
                                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        onClick={resetFilters}
                                      >
                                        Réinitialiser les filtres
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredScheduleEntries.length > 0 ? (
                          filteredScheduleEntries.map((entry) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                            >
                              <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                                      checked={selectedPayments.includes(entry.id)}
                                      onChange={() => handleSelectItem(entry.id)}
                                    />
                                    <span 
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.statut)}`}
                                    >
                                      {entry.statut}
                                    </span>
                                  </div>
                                  <div className="text-lg font-bold text-gray-900">
                                    {entry.montant}
                                  </div>
                                </div>
                                
                                <div className="flex items-center mb-3">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{ backgroundColor: `${entry.color}20` }}>
                                    <span className="text-xl">{entry.logo}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{entry.client}</div>
                                    <div className="text-sm text-gray-500">{entry.date}</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                  <div>
                                    <div className="text-gray-500">N° échéance</div>
                                    <div className="font-medium">{entry.id}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Facture</div>
                                    <div className="font-medium text-indigo-600">{entry.facture}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Type</div>
                                    <div className="font-medium">{entry.type}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Délai</div>
                                    <div className={`font-medium ${
                                      entry.daysLeft <= 7 
                                        ? 'text-red-600' 
                                        : entry.daysLeft <= 14
                                          ? 'text-amber-600'
                                          : 'text-green-600'
                                    }`}>{entry.daysLeft} jours</div>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600 border-t pt-3">
                                  <div className="font-medium text-gray-500 mb-1">Notes :</div>
                                  {entry.notes}
                                </div>
                              </div>
                              
                              <div className="flex divide-x border-t">
                                <button className="flex-1 p-2 text-sm text-gray-600 hover:bg-gray-50 transition flex items-center justify-center">
                                  <FiEye className="mr-1" /> Voir
                                </button>
                                <button className="flex-1 p-2 text-sm text-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center">
                                  <FiEdit className="mr-1" /> Modifier
                                </button>
                                <button className="flex-1 p-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center justify-center">
                                  <FiTrash2 className="mr-1" /> Supprimer
                                </button>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full flex items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="text-center">
                              <FiInfo className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <p className="text-gray-500">Aucune échéance ne correspond à vos critères</p>
                              <button 
                                className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                onClick={resetFilters}
                              >
                                Réinitialiser les filtres
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Pagination */}
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
                      Affichage de <span className="font-medium">1</span> à <span className="font-medium">
                        {activeTab === 'reglements' ? filteredPayments.length : filteredScheduleEntries.length}
                      </span> sur <span className="font-medium">
                        {activeTab === 'reglements' ? paymentsData.length : scheduleData.length}
                      </span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Précédent</span>
                        <FiChevronRight className="h-5 w-5 transform rotate-180" />
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-5 right-5 p-4 rounded-lg shadow-lg z-50"
            style={{
              background: notification?.type === 'success' 
                ? 'linear-gradient(to right, #10B981, #059669)' 
                : notification?.type === 'error'
                  ? 'linear-gradient(to right, #EF4444, #DC2626)'
                  : 'linear-gradient(to right, #6366F1, #4F46E5)'
            }}
          >
            <div className="flex items-center text-white">
              {notification?.type === 'success' ? (
                <FiCheckCircle className="w-5 h-5 mr-2" />
              ) : notification?.type === 'error' ? (
                <FiAlertCircle className="w-5 h-5 mr-2" />
              ) : (
                <FiInfo className="w-5 h-5 mr-2" />
              )}
              <span>{notification?.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


