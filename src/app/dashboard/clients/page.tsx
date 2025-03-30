'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
import {
  FiUsers,
  FiSearch,
  FiPlus,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiCheckSquare,
  FiSquare,
  FiTag,
  // FiUser,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiGrid,
  FiList,
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiX,
  FiInfo,
  FiArrowRight,
  FiBarChart2,
  FiUserCheck,
  // FiCheck,
  FiFileText,
  FiActivity,
  // FiHome,
  // FiChevronRight,
  FiSend,
  FiAward,
  FiCreditCard,
  FiClipboard,
  FiUserPlus,
  // FiEye
} from "react-icons/fi";
import { FaEuroSign } from "react-icons/fa";

// Define client interface
interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  ville: string;
  pays: string;
  adresse: string;
  statut: string;
  source: string;
  tags: string[];
  dernierContact: string;
  valeurTotale: string;
}

// Define stats interface
interface Stats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  vipClients: number;
  totalValue: number;
  lastMonthNewClients: number;
}

// Define the document types for the modal
interface DocumentOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

// Updated Breadcrumbs component with navigation
// const Breadcrumbs = ({ items }: { items: string[] }) => (
//   <div className="flex items-center text-sm text-gray-600 mb-6">
//     <FiHome className="mr-2 text-gray-500" />
//     {items.map((item, index) => (
//       <div key={index} className="flex items-center">
//         {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
//         {index === items.length - 1 ? (
//           <span className="text-[#004AC8] font-medium">{item}</span>
//         ) : (
//           <Link 
//             href={item === 'Accueil' ? '/dashboard/accueil' : `/${item.toLowerCase()}`}
//             className="hover:text-[#004AC8] transition-colors duration-200"
//           >
//             {item}
//           </Link>
//         )}
//       </div>
//     ))}
//   </div>
// );

// Tag color mapping with brand colors
const tagColors: { [key: string]: string } = {
  "VIP": "#1B0353",
  "Fidèle": "#004AC8",
  "Nouveau": "#4BB2F6",
  "Prospect": "#004AC8",
  "International": "#1B0353",
  "Ancien": "#4BB2F6",
  // Default color for any other tags
  "default": "#4BB2F6"
};

export default function ClientsPage() {
  // State for filters and search
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  const [selectedTag, setSelectedTag] = useState<string>('Tous');
  const [selectedSource, setSelectedSource] = useState<string>('Tous');
  
  // State for view mode
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // State for selected clients (for bulk actions)
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // State for the send modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedClientForModal, setSelectedClientForModal] = useState<Client | null>(null);
  
  // State for quick view
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // State for export dropdown
  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);
  const [showAbove, setShowAbove] = useState<boolean>(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Refs for checking position
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  // Check dropdown position when showing export dropdown
  useEffect(() => {
    if (showExportDropdown && exportButtonRef.current) {
      const buttonRect = exportButtonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // If space below button is less than 150px, show dropdown above
      setShowAbove(spaceBelow < 150);
    }
  }, [showExportDropdown]);

  // Stats calculations
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    pendingClients: 0,
    vipClients: 0,
    totalValue: 0,
    lastMonthNewClients: 3
  });

  // Sample client data
  const clients: Client[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      entreprise: 'Acme Corp',
      ville: 'Paris',
      pays: 'France',
      adresse: '123 Avenue des Champs-Élysées, 75008',
      statut: 'Actif',
      source: 'Site Web',
      tags: ['VIP', 'Fidèle'],
      dernierContact: '02/03/2025',
      valeurTotale: '15,600 €'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@example.com',
      telephone: '+33 6 23 45 67 89',
      entreprise: 'Nexus Tech',
      ville: 'Lyon',
      pays: 'France',
      adresse: '45 Rue de la République, 69002',
      statut: 'Actif',
      source: 'Référence',
      tags: ['Nouveau'],
      dernierContact: '28/02/2025',
      valeurTotale: '5,800 €'
    },
    {
      id: 3,
      nom: 'Leclerc',
      prenom: 'Sophie',
      email: 'sophie.leclerc@example.com',
      telephone: '+33 6 34 56 78 90',
      entreprise: 'Zenith SA',
      ville: 'Marseille',
      pays: 'France',
      adresse: '187 Quai du Port, 13002',
      statut: 'Inactif',
      source: 'Salon',
      tags: ['Prospect'],
      dernierContact: '15/02/2025',
      valeurTotale: '0 €'
    },
    {
      id: 4,
      nom: 'Bernard',
      prenom: 'Thomas',
      email: 'thomas.bernard@example.com',
      telephone: '+33 6 45 67 89 01',
      entreprise: 'Global Industries',
      ville: 'Bordeaux',
      pays: 'France',
      adresse: '28 Cours du Chapeau Rouge, 33000',
      statut: 'Actif',
      source: 'Publicité',
      tags: ['VIP', 'International'],
      dernierContact: '05/03/2025',
      valeurTotale: '24,750 €'
    },
    {
      id: 5,
      nom: 'Petit',
      prenom: 'Julie',
      email: 'julie.petit@example.com',
      telephone: '+33 6 56 78 90 12',
      entreprise: 'Tech Innovate',
      ville: 'Toulouse',
      pays: 'France',
      adresse: '12 Place du Capitole, 31000',
      statut: 'En attente',
      source: 'Email',
      tags: ['Prospect'],
      dernierContact: '25/02/2025',
      valeurTotale: '1,200 €'
    },
    {
      id: 6,
      nom: 'Moreau',
      prenom: 'Pierre',
      email: 'pierre.moreau@example.com',
      telephone: '+33 6 67 89 01 23',
      entreprise: 'Eco Solutions',
      ville: 'Nantes',
      pays: 'France',
      adresse: '4 Rue Crébillon, 44000',
      statut: 'Actif',
      source: 'Partenaire',
      tags: ['Fidèle'],
      dernierContact: '01/03/2025',
      valeurTotale: '8,900 €'
    },
    {
      id: 7,
      nom: 'Lefebvre',
      prenom: 'Emma',
      email: 'emma.lefebvre@example.com',
      telephone: '+33 6 78 90 12 34',
      entreprise: 'Design Studio',
      ville: 'Lille',
      pays: 'France',
      adresse: '76 Rue de Paris, 59800',
      statut: 'Inactif',
      source: 'Site Web',
      tags: ['Ancien'],
      dernierContact: '10/01/2025',
      valeurTotale: '3,500 €'
    },
    {
      id: 8,
      nom: 'Garcia',
      prenom: 'Lucas',
      email: 'lucas.garcia@example.com',
      telephone: '+33 6 89 01 23 45',
      entreprise: 'Media Group',
      ville: 'Strasbourg',
      pays: 'France',
      adresse: '23 Place Kléber, 67000',
      statut: 'Actif',
      source: 'Réseau social',
      tags: ['Nouveau', 'International'],
      dernierContact: '28/02/2025',
      valeurTotale: '6,200 €'
    },
    {
      id: 9,
      nom: 'Girard',
      prenom: 'Léa',
      email: 'lea.girard@example.com',
      telephone: '+33 6 90 12 34 56',
      entreprise: 'Finance Conseil',
      ville: 'Nice',
      pays: 'France',
      adresse: '15 Promenade des Anglais, 06000',
      statut: 'En attente',
      source: 'Conférence',
      tags: ['Prospect', 'VIP'],
      dernierContact: '18/02/2025',
      valeurTotale: '2,100 €'
    },
    {
      id: 10,
      nom: 'Roux',
      prenom: 'Antoine',
      email: 'antoine.roux@example.com',
      telephone: '+33 6 01 23 45 67',
      entreprise: 'Santé Plus',
      ville: 'Montpellier',
      pays: 'France',
      adresse: '8 Rue Foch, 34000',
      statut: 'Actif',
      source: 'Recommandation',
      tags: ['Fidèle'],
      dernierContact: '03/03/2025',
      valeurTotale: '12,300 €'
    }
  ];

  // Document options for the modal
  const documentOptions: DocumentOption[] = [
    {
      id: 'facture',
      title: 'Envoyer une facture',
      icon: <FiFileText className="w-6 h-6 text-blue-600" />,
      description: 'Envoyer une facture standard au client'
    },
    {
      id: 'devis',
      title: 'Envoyer un devis',
      icon: <FiClipboard className="w-6 h-6 text-green-600" />,
      description: 'Envoyer un devis pour une prestation ou des produits'
    },
    {
      id: 'avoir',
      title: 'Envoyer un avoir',
      icon: <FiCreditCard className="w-6 h-6 text-purple-600" />,
      description: 'Émettre un avoir pour un remboursement ou annulation'
    },
    {
      id: 'factureAcompte',
      title: 'Envoyer une facture d\'acompte',
      icon: <FiFileText className="w-6 h-6 text-orange-600" />,
      description: 'Envoyer une facture pour un paiement partiel anticipé'
    },
    {
      id: 'avoirAcompte',
      title: 'Envoyer un avoir d\'acompte',
      icon: <FiCreditCard className="w-6 h-6 text-red-600" />,
      description: 'Émettre un avoir pour un acompte déjà versé'
    }
  ];

  // Calculate statistics based on client data
  useEffect(() => {
    const activeClients = clients.filter(client => client.statut === 'Actif').length;
    const inactiveClients = clients.filter(client => client.statut === 'Inactif').length;
    const pendingClients = clients.filter(client => client.statut === 'En attente').length;
    const vipClients = clients.filter(client => client.tags.includes('VIP')).length;
    
    // Calculate total value
    const totalValue = clients.reduce((total, client) => {
      const value = parseFloat(client.valeurTotale.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
      return total + value;
    }, 0);
    
    setStats({
      totalClients: clients.length,
      activeClients,
      inactiveClients,
      pendingClients,
      vipClients,
      totalValue,
      lastMonthNewClients: 3
    });
  }, [clients]);

  // Filter options
  const statusOptions: string[] = ['Tous', 'Actif', 'Inactif', 'En attente'];
  const tagOptions: string[] = ['Tous', 'VIP', 'Fidèle', 'Nouveau', 'Prospect', 'International', 'Ancien'];
  const sourceOptions: string[] = ['Tous', 'Site Web', 'Référence', 'Salon', 'Publicité', 'Email', 'Partenaire', 'Réseau social', 'Conférence', 'Recommandation'];

  // Filter clients based on search and filter criteria
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchTerm === '' || 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || client.statut === selectedStatus;
    
    const matchesTag = selectedTag === 'Tous' || client.tags.includes(selectedTag);
    
    const matchesSource = selectedSource === 'Tous' || client.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesTag && matchesSource;
  });

  // Handler for toggling all checkboxes
  const handleSelectAll = (): void => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedClients(filteredClients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectClient = (clientId: number, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
      setSelectAll(false);
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  // Handler for opening send modal
  const handleOpenSendModal = (client: Client, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedClientForModal(client);
    setIsModalOpen(true);
  };

  // Handler for closing send modal
  const handleCloseSendModal = (): void => {
    setIsModalOpen(false);
    setSelectedClientForModal(null);
  };

  // Handler for document selection in modal
  const handleSendDocument = (documentType: string): void => {
    // Here you would implement the logic to send the document
    console.log(`Sending ${documentType} to ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    
    // Close the modal after sending
    handleCloseSendModal();

    // For demo purposes, we'll just close the modal
    setTimeout(() => {
      alert(`${documentType} envoyé à ${selectedClientForModal?.prenom} ${selectedClientForModal?.nom}`);
    }, 500);
  };

  // Open quick view for a client
  const openQuickView = (client: Client): void => {
    setSelectedClient(client);
    setIsQuickViewOpen(true);
  };

  // Close quick view
  const closeQuickView = (): void => {
    setIsQuickViewOpen(false);
    setSelectedClient(null);
  };

  // Reset filters
  const resetFilters = (): void => {
    setSelectedStatus('Tous');
    setSelectedTag('Tous');
    setSelectedSource('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Actif':
        return 'bg-green-100 text-green-800';
      case 'Inactif':
        return 'bg-gray-100 text-gray-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get status color based on last contact date (using brand colors)
  const getStatusColor = (lastContactDate: string) => {
    const dateParts = lastContactDate.split('/');
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "#4BB2F6"; // Light blue for recent contact
    if (diffDays <= 14) return "#004AC8"; // Medium blue for medium
    return "#1B0353"; // Dark blue for stale
  };

  // Get appropriate tag color
  const getTagColor = (tag: string) => {
    return tagColors[tag] || tagColors.default;
  };

  // Get the initials of a person
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Format value for display
  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      // Create CSV header
      const headers = ["ID", "Nom", "Prénom", "Email", "Téléphone", "Entreprise", "Ville", "Pays", "Adresse", "Statut", "Source", "Tags", "Dernier Contact", "Valeur Totale"];
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...clients.map(client => [
          client.id,
          client.nom,
          client.prenom,
          client.email,
          client.telephone,
          client.entreprise,
          client.ville,
          client.pays,
          client.adresse.replace(/,/g, " "),
          client.statut,
          client.source,
          client.tags.join(";"),
          client.dernierContact,
          client.valeurTotale
        ].join(","))
      ].join("\n");
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
    } finally {
      setShowExportDropdown(false);
    }
  };
  
  // Export to PDF
  const exportToPDF = () => {
    try {
      alert("Fonctionnalité d'export PDF à implémenter avec une bibliothèque comme jsPDF");
      // En production, utilisez une bibliothèque comme jsPDF pour générer un PDF
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
    } finally {
      setShowExportDropdown(false);
    }
  };

  // Enhanced animation variants
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        mass: 1.2
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 10,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  // Pagination variables
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const displayedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Add additional top padding to account for fixed navbar */}
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
    

        {/* Header - Luxury Gradient Background with Brand Colors */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl p-8 shadow-2xl mb-6 relative overflow-hidden backdrop-blur-sm"
          style={{ 
            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.95) 0%, rgba(0, 74, 200, 0.95) 60%, rgba(27, 3, 83, 0.95) 100%)",
            boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.3), 0 8px 10px -6px rgba(27, 3, 83, 0.2)"
          }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            {/* Background pattern */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white bg-opacity-20 p-2 rounded-lg"
                >
                  <FiUsers className="text-white text-2xl" />
                </motion.div>
                <h1 className="text-3xl font-bold text-white">Clients</h1>
              </div>
              <p className="text-white text-opacity-90 mt-2 max-w-lg">
                Gérez votre base clients, consultez l&apos;historique des interactions et des transactions, et développez vos relations commerciales.
              </p>
              
              {/* Stats Bar */}
              <div className="mt-6 flex space-x-6">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Total</div>
                  <div className="text-white font-bold text-xl">{stats.totalClients}</div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Actifs</div>
                  <div className="text-white font-bold text-xl">{stats.activeClients}</div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <div className="text-white text-opacity-80 text-sm">Valeur totale</div>
                  <div className="text-white font-bold text-xl">{formatValue(stats.totalValue)}</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-3 rounded-lg shadow-lg font-medium"
              >
                <FiBarChart2 />
                <span>Statistiques</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-lg shadow-lg font-medium"
              >
                <FiPlus />
                <span>Ajouter un client</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-green-500 font-bold">+{stats.lastMonthNewClients}</span> nouveaux ce mois
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <FiCalendar className="inline mr-1" size={12} /> Mise à jour: aujourd&apos;hui
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active/Inactive Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients Actifs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeClients}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiUserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.activeClients / stats.totalClients) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  {Math.round((stats.activeClients / stats.totalClients) * 100)}% du total
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-red-500 font-bold">{stats.inactiveClients}</span> inactifs
                </div>
              </div>
            </div>
          </motion.div>

          {/* VIP Clients */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Clients VIP</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.vipClients}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiAward className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(stats.vipClients / stats.totalClients) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  {Math.round((stats.vipClients / stats.totalClients) * 100)}% du total
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-amber-500 font-bold">{stats.pendingClients}</span> en attente
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Value */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatValue(stats.totalValue)}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaEuroSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs font-medium text-gray-500">
                  <span className="text-green-500 font-bold">+12%</span> vs dernier trimestre
                </div>
                <div className="text-xs font-medium text-gray-500">
                  <FiActivity className="inline mr-1" size={12} /> Croissance stable
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Filters + Actions Bar - Refined with brand colors */}
        <motion.div 
          className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 p-4 mb-6"
          style={{
            boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.05), 0 2px 4px -1px rgba(27, 3, 83, 0.01)"
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3 flex-grow">
              <motion.button 
                className="bg-[#1B0353] text-white p-2 rounded-lg shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter className="w-5 h-5" />
              </motion.button>
              
              <div className="w-full md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {(selectedStatus !== 'Tous' || selectedTag !== 'Tous' || selectedSource !== 'Tous') && (
                <div className="flex flex-wrap gap-2">
                  {selectedStatus !== 'Tous' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      <span className="text-[#1B0353] font-medium">Statut: {selectedStatus}</span>
                      <motion.button 
                        className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedStatus('Tous')}
                      >
                        <FiX size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {selectedTag !== 'Tous' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      <span className="text-[#1B0353] font-medium">Tag: {selectedTag}</span>
                      <motion.button 
                        className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedTag('Tous')}
                      >
                        <FiX size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {selectedSource !== 'Tous' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                    >
                      <span className="text-[#1B0353] font-medium">Source: {selectedSource}</span>
                      <motion.button 
                        className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedSource('Tous')}
                      >
                        <FiX size={16} />
                      </motion.button>
                    </motion.div>
                  )}
                  
                  <motion.button 
                    className="text-sm text-[#004AC8] hover:text-[#1B0353] font-medium hover:underline focus:outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetFilters}
                  >
                    Réinitialiser tout
                  </motion.button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex p-1 bg-[#4BB2F6] bg-opacity-10 rounded-lg shadow-sm">
                <motion.button 
                  className={`p-2 rounded transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                  whileHover={viewMode !== 'grid' ? { scale: 1.05 } : {}}
                  whileTap={viewMode !== 'grid' ? { scale: 0.98 } : {}}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid className={viewMode === 'grid' ? 'text-[#1B0353]' : 'text-gray-500'} />
                </motion.button>
                <motion.button 
                  className={`p-2 rounded transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                  whileHover={viewMode !== 'list' ? { scale: 1.05 } : {}}
                  whileTap={viewMode !== 'list' ? { scale: 0.98 } : {}}
                  onClick={() => setViewMode('list')}
                >
                  <FiList className={viewMode === 'list' ? 'text-[#1B0353]' : 'text-gray-500'} />
                </motion.button>
              </div>
              
              {/* Export dropdown button with position control */}
              <div className="relative">
                <motion.button
                  ref={exportButtonRef}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4BB2F6] to-[#004AC8] text-white rounded-lg shadow-sm hover:shadow transition text-sm font-medium"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Exporter</span>
                  {showExportDropdown ? (
                    <FiChevronUp className="w-4 h-4" />
                  ) : (
                    <FiChevronDown className="w-4 h-4" />
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {showExportDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute z-20 ${showAbove ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-40 bg-white border border-[#4BB2F6] border-opacity-30 rounded-xl shadow-xl overflow-hidden`}
                      style={{ boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.1), 0 8px 10px -6px rgba(27, 3, 83, 0.08)" }}
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                        onClick={exportToCSV}
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Exporter en CSV</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                        onClick={exportToPDF}
                      >
                        <FiFileText className="w-4 h-4" />
                        <span>Exporter en PDF</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-4 py-2 bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] rounded-lg border border-[#4BB2F6] border-opacity-30 shadow-sm hover:shadow transition text-sm font-medium"
              >
                {selectAll ? (
                  <FiCheckSquare className="w-4 h-4 text-[#004AC8]" />
                ) : (
                  <FiSquare className="w-4 h-4" />
                )}
                <span>Tout sélectionner</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg shadow-sm hover:shadow transition text-sm font-medium"
              >
                <FiUserPlus className="w-4 h-4" />
                <span>Ajouter</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel (Collapsible) with glass effect */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden mb-6"
              style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)"
              }}
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Statut */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
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
                  
                  {/* Tags */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                    >
                      {tagOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Source */}
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={selectedSource}
                      onChange={(e) => setSelectedSource(e.target.value)}
                    >
                      {sourceOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between mt-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={resetFilters}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <FiRefreshCw className="mr-2" />
                      <span>Réinitialiser</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected clients actions */}
        {selectedClients.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row justify-between gap-3 items-center mb-6"
          >
            <div className="text-indigo-800 font-medium">
              <span className="font-bold">{selectedClients.length}</span> client(s) sélectionné(s)
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm">
                <FiMail />
                <span>Email</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1 shadow-sm">
                <FiTag />
                <span>Assigner tag</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 shadow-sm">
                <FiSend />
                <span>Envoyer document</span>
              </button>
              <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 shadow-sm">
                <FiTrash2 />
                <span>Supprimer</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content - Grid of Cards or List */}
        <div className="mb-6">
          {viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {displayedClients.map((client) => (
                  <motion.div
                    key={client.id}
                    layoutId={`card-${client.id}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 74, 200, 0.15), 0 10px 10px -5px rgba(27, 3, 83, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
                    style={{ 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
                      transform: "perspective(1000px) rotateX(0deg)"
                    }}
                    onClick={() => openQuickView(client)}
                  >
                    {/* Card Header with Gradient using brand colors */}
                    <div 
                      className="h-16 relative overflow-hidden"
                      style={{ 
                        background: "linear-gradient(120deg, #4BB2F6, #004AC8, #1B0353)",
                        clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)"
                      }}
                    >
                      {/* Abstract pattern overlay with animated subtle movement */}
                      <motion.div 
                        className="absolute inset-0 opacity-20"
                        animate={{ 
                          backgroundPosition: ["0% 0%", "100% 100%"], 
                        }} 
                        transition={{ 
                          duration: 20, 
                          ease: "linear", 
                          repeat: Infinity, 
                          repeatType: "reverse" 
                        }}
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                      />
                    </div>

                    <div className="relative px-6 pt-8 pb-6">
                      {/* Status indicator with pulse animation for recent contacts */}
                      <div className="absolute top-4 right-4 flex items-center">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            getStatusColor(client.dernierContact) === "#4BB2F6" ? "animate-ping absolute" : ""
                          }`}
                          style={{ 
                            backgroundColor: getStatusColor(client.dernierContact),
                            opacity: 0.5
                          }}
                        />
                        <div 
                          className="w-2 h-2 rounded-full relative"
                          style={{ backgroundColor: getStatusColor(client.dernierContact) }}
                          title={`Dernier contact: ${client.dernierContact}`}
                        />
                        <span className="ml-2 text-xs text-gray-500">{client.dernierContact}</span>
                      </div>
                      
                      {/* Checkbox for selection */}
                      <button
                        className="absolute top-4 left-4 focus:outline-none"
                        onClick={(e) => handleSelectClient(client.id, e)}
                      >
                        {selectedClients.includes(client.id) ? (
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-indigo-600"
                          >
                            <FiCheckSquare className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <FiSquare className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                      
                      <div className="flex flex-col items-center mb-6">
                        {/* Improved avatar with depth and subtle glow */}
                        <div className="relative mb-4">
                          {/* Soft glow behind avatar */}
                          <div 
                            className="absolute -inset-1 rounded-full opacity-20 blur-md"
                            style={{ 
                              background: "radial-gradient(circle, #4BB2F6, #004AC8)", 
                            }}
                          />
                          <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold relative z-10 border-2 border-white"
                            style={{ 
                              background: "linear-gradient(45deg, #4BB2F6, #004AC8, #1B0353)",
                              boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.15)"
                            }}
                          >
                            {getInitials(client.prenom, client.nom)}
                            
                            {/* Shine effect */}
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full"
                              animate={{ 
                                x: ["150%", "-150%"],
                              }}
                              transition={{ 
                                repeat: Infinity, 
                                repeatType: "mirror", 
                                duration: 2,
                                ease: "easeInOut",
                                repeatDelay: 4
                              }}
                              style={{ 
                                transform: "skewX(45deg)",
                                width: "50%"
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
                          {client.prenom} {client.nom}
                        </h3>
                        
                        <p className="text-sm font-medium text-[#004AC8]">
                          {client.entreprise}
                        </p>
                        
                        <p className="text-xs text-gray-500 mb-2">
                          ID: {client.id}
                        </p>
                        
                        {/* Status badge */}
                        <span className={`mt-1 px-3 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                          {client.statut}
                        </span>
                        
                        {/* Tags with glass morphism and hover effect */}
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                          {client.tags.map((tag, tagIndex) => (
                            <motion.span 
                              key={tagIndex}
                              whileHover={{ y: -2, scale: 1.05 }}
                              className="px-3 py-1 text-xs font-medium rounded-full text-white shadow-sm transform transition-transform" 
                              style={{ 
                                backgroundColor: getTagColor(tag),
                                boxShadow: `0 2px 5px ${getTagColor(tag)}40`,
                                backdropFilter: "blur(8px)"
                              }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced contact info with glass morphism and brand colors */}
                      <div className="space-y-3 mt-4">
                        <motion.div 
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(75, 178, 246, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                            <FiMail className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Email</div>
                            <div className="text-gray-700 text-sm font-medium truncate" title={client.email}>
                              {client.email}
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(0, 74, 200, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                            <FiPhone className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Téléphone</div>
                            <a 
                              href={`tel:${client.telephone.replace(/\s/g, '')}`} 
                              className="text-gray-700 text-sm font-medium block truncate hover:text-[#004AC8]" 
                              title={client.telephone}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {client.telephone}
                            </a>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#1B0353] bg-opacity-10 text-[#1B0353] mr-3 flex-shrink-0">
                            <FiMapPin className="w-4 h-4" />
                          </div>
                          {/* Show complete address */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Adresse</div>
                            <div className="text-gray-700 text-sm font-medium truncate" title={`${client.adresse}, ${client.ville}, ${client.pays}`}>
                              {client.adresse}
                            </div>
                            <div className="text-gray-700 text-sm font-medium">
                              {client.ville}, {client.pays}
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Valeur due */}
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
                          }}
                        >
                          <div className="flex items-center">
                            <div className="p-2 rounded-full bg-[#004AC8] bg-opacity-10 text-[#004AC8] mr-3 flex-shrink-0">
                              <FaEuroSign className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Valeur due</div>
                              <div className="text-gray-700 text-sm font-medium">
                                {client.valeurTotale}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Source */}
                        <motion.div
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="flex items-center p-3 rounded-lg border border-gray-100 group-hover:border-[#4BB2F6] transition-colors"
                          style={{
                            background: "linear-gradient(to right, rgba(240, 249, 255, 0.8), rgba(255, 255, 255, 0.9))",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 6px rgba(27, 3, 83, 0.1)"
                          }}
                        >
                          <div className="p-2 rounded-full bg-[#1B0353] bg-opacity-10 text-[#1B0353] mr-3 flex-shrink-0">
                            <FiInfo className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium uppercase tracking-wider text-[#1B0353]">Source</div>
                            <div className="text-gray-700 text-sm font-medium truncate">
                              {client.source}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Quick Actions with advanced hover effects */}
                      <div className="flex justify-center space-x-2 mt-6">
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
                            border: "1px solid rgba(75, 178, 246, 0.2)",
                            boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
                          }}
                        >
                          <FiPhone className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(0, 74, 200, 0.1), rgba(0, 74, 200, 0.2))",
                            border: "1px solid rgba(0, 74, 200, 0.2)",
                            boxShadow: "0 2px 5px rgba(0, 74, 200, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${client.email}`;
                          }}
                        >
                          <FiMail className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(27, 3, 83, 0.1), rgba(27, 3, 83, 0.2))",
                            border: "1px solid rgba(27, 3, 83, 0.2)",
                            boxShadow: "0 2px 5px rgba(27, 3, 83, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Commencer une conversation avec ${client.prenom}`);
                          }}
                        >
                          <FiMessageCircle className="w-5 h-5 text-[#1B0353]" />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(75, 178, 246, 0.1), rgba(75, 178, 246, 0.2))",
                            border: "1px solid rgba(75, 178, 246, 0.2)",
                            boxShadow: "0 2px 5px rgba(75, 178, 246, 0.1)"
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Modifier les informations de ${client.prenom}`);
                          }}
                        >
                          <FiEdit className="w-5 h-5 text-[#004AC8]" />
                        </motion.button>
                        
                        {/* Send document button */}
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg shadow-sm transition-all duration-300"
                          style={{
                            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))",
                            border: "1px solid rgba(34, 197, 94, 0.2)",
                            boxShadow: "0 2px 5px rgba(34, 197, 94, 0.1)"
                          }}
                          onClick={(e) => handleOpenSendModal(client, e)}
                        >
                          <FiSend className="w-5 h-5 text-green-600" />
                        </motion.button>
                      </div>

                      {/* "Voir le detail" Button */}
                      <div className="mt-5 flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center w-full transition-all duration-300 bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white shadow-md hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(client);
                          }}
                        >
                          <FiArrowRight className="mr-2 w-4 h-4" />
                          <span>Voir le détail</span>
                        </motion.button>
                      </div>
                      
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-10 px-4 py-3 text-left">
                        <button onClick={handleSelectAll} className="focus:outline-none">
                          {selectAll ? (
                            <FiCheckSquare className="text-indigo-600" />
                          ) : (
                            <FiSquare className="text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nom complet
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Entreprise
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Localisation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tags
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dernier contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Valeur
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayedClients.map((client, index) => (
                      <tr
                        key={client.id}
                        className={`hover:bg-gray-50 cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        onClick={() => openQuickView(client)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            className="focus:outline-none"
                            onClick={(e) => handleSelectClient(client.id, e)}
                          >
                            {selectedClients.includes(client.id) ? (
                              <FiCheckSquare className="text-indigo-600" />
                            ) : (
                              <FiSquare className="text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                              style={{ background: "linear-gradient(45deg, #4BB2F6, #004AC8)" }}
                            >
                              {getInitials(client.prenom, client.nom)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {client.prenom} {client.nom}
                              </div>
                              <div className="text-xs text-gray-500">
                                Source: {client.source}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.entreprise}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-indigo-600">
                            <a href={`mailto:${client.email}`} onClick={(e) => e.stopPropagation()}>
                              {client.email}
                            </a>
                          </div>
                          <div className="text-sm text-gray-500">
                            <a 
                              href={`tel:${client.telephone.replace(/\s/g, '')}`} 
                              className="hover:text-[#004AC8]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {client.telephone}
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={`${client.adresse}, ${client.ville}, ${client.pays}`}>
                            {client.ville}, {client.pays}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(client.statut)}`}>
                            {client.statut}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex} 
                                className="px-2 py-1 text-xs rounded-full text-white" 
                                style={{ backgroundColor: getTagColor(tag) }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2" 
                              style={{ backgroundColor: getStatusColor(client.dernierContact) }}
                            />
                            {client.dernierContact}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {client.valeurTotale}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-1">
                            <button 
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `tel:${client.telephone.replace(/\s/g, '')}`;
                              }}
                            >
                              <FiPhone size={16} />
                            </button>
                            <button 
                              className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${client.email}`;
                              }}
                            >
                              <FiMail size={16} />
                            </button>
                            <button 
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              onClick={(e) => handleOpenSendModal(client, e)}
                            >
                              <FiSend size={16} />
                            </button>
                            <button 
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Modifier les informations de ${client.prenom}`);
                              }}
                            >
                              <FiEdit size={16} />
                            </button>
                            <button 
                              className="p-1 text-blue-700 hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                openQuickView(client);
                              }}
                            >
                              <FiArrowRight size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination - Updated with brand colors */}
        <motion.div 
          className="flex items-center justify-between bg-white bg-opacity-95 backdrop-blur-sm p-5 rounded-xl border border-[#4BB2F6] border-opacity-20"
          style={{ 
            boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.05), 0 4px 6px -2px rgba(27, 3, 83, 0.01)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-sm text-[#1B0353] flex items-center">
              <span className="bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] p-1 rounded-md shadow-sm mr-2 flex items-center justify-center">
                <FiInfo className="w-4 h-4" />
              </span>
              Affichage de{" "}
              <span className="font-bold mx-1 text-[#004AC8]">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
              <span className="font-bold mx-1 text-[#004AC8]">
                {Math.min(currentPage * itemsPerPage, filteredClients.length)}
              </span>{" "}
              sur <span className="font-bold mx-1 text-[#004AC8]">{filteredClients.length}</span> résultats
            </p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white hover:shadow-md"
              }`}
            >
              <FiArrowRight className="w-4 h-4 mr-1 transform rotate-180" /> Précédent
            </motion.button>
            
            {/* Page numbers with elegant design and brand colors */}
            <div className="hidden sm:flex space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg font-medium shadow-sm transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white"
                      : "bg-white border border-[#4BB2F6] border-opacity-30 text-[#1B0353] hover:border-[#004AC8]"
                  }`}
                  style={currentPage === i + 1 ? { boxShadow: "0 4px 10px rgba(27, 3, 83, 0.3)" } : {}}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white hover:shadow-md"
              }`}
            >
              Suivant <FiArrowRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1B0353] bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, rotateX: 5 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 30, rotateX: 5 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 1.5
              }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
              style={{ 
                boxShadow: "0 25px 50px -12px rgba(27, 3, 83, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)",
                transform: "perspective(1000px)",
                transformStyle: "preserve-3d"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Enhanced modal header with advanced gradient and overlay */}
              <div className="relative p-8" style={{ 
                background: "linear-gradient(135deg, #4BB2F6 0%, #004AC8 60%, #1B0353 100%)",
                boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.1)"
              }}>
                {/* Animated background pattern */}
<motion.div 
  className="absolute inset-0 opacity-15"
  animate={{ 
    backgroundPosition: ["0% 0%", "100% 100%"], 
  }} 
  transition={{ 
    duration: 20, 
    ease: "linear", 
    repeat: Infinity, 
    repeatType: "reverse" 
  }}
  style={{
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
  }}
/>

<button 
  className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 z-10"
  onClick={closeQuickView}
>
  <FiX size={24} />
</button>

<div className="flex items-center space-x-4 relative z-10">
  {/* Enhanced avatar with 3D effect */}
  <motion.div 
    whileHover={{ scale: 1.05, rotate: 5 }}
    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold overflow-hidden"
    style={{ 
      background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 80%)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.3)"
    }}
  >
    {getInitials(selectedClient.prenom, selectedClient.nom)}
    
    {/* Animated shine effect */}
    <motion.div 
      className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-40"
      animate={{ 
        x: ["150%", "-150%"],
      }}
      transition={{ 
        repeat: Infinity, 
        repeatType: "mirror", 
        duration: 1.5,
        ease: "easeInOut",
        repeatDelay: 3
      }}
      style={{ 
        transform: "skewX(45deg)",
        width: "50%"
      }}
    />
  </motion.div>
  
  <div className="text-white">
    <h2 className="text-2xl font-bold">{selectedClient.prenom} {selectedClient.nom}</h2>
    <p className="opacity-90">{selectedClient.entreprise}</p>
    <div className="flex mt-2 space-x-2">
      {selectedClient.tags.map((tag, index) => (
        <motion.span 
          key={index}
          whileHover={{ y: -2, scale: 1.05 }}
          className="px-2 py-1 text-xs rounded-full bg-white bg-opacity-20 backdrop-blur-sm shadow-sm"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  </div>
</div>
</div>

{/* Modal Content */}
<div className="p-8">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
      <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
        <FiInfo className="text-indigo-600 w-5 h-5" />
      </div>
      Informations de contact
    </h3>
    
    <div className="space-y-4">
      <motion.div 
        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(75, 178, 246, 0.2)"
        }}
      >
        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
          }}
        >
          <FiMail className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Email</div>
          <div className="text-sm font-semibold text-gray-800 mt-1 truncate">
            {selectedClient.email}
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto p-2 rounded-lg text-[#004AC8] hover:bg-[#004AC8] hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `mailto:${selectedClient.email}`;
          }}
          style={{
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <FiMail className="w-4 h-4" />
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(0, 74, 200, 0.2)"
        }}
      >
        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #1B0353, #004AC8)",
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
          }}
        >
          <FiPhone className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-[#1B0353]">Téléphone</div>
          <div className="text-sm font-semibold text-gray-800 mt-1">{selectedClient.telephone}</div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto p-2 rounded-lg text-[#1B0353] hover:bg-[#1B0353] hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `tel:${selectedClient.telephone.replace(/\s/g, '')}`;
          }}
          style={{
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <FiPhone className="w-4 h-4" />
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(75, 178, 246, 0.2)"
        }}
      >
        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
          }}
        >
          <FiMapPin className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-[#004AC8]">Adresse</div>
          <div className="text-sm font-semibold text-gray-800 mt-1">{selectedClient.adresse}</div>
          <div className="text-sm font-semibold text-gray-800">{selectedClient.ville}, {selectedClient.pays}</div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex items-center p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #f0fff4, #e6ffe9)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(52, 211, 153, 0.2)"
        }}
      >
        <div className="p-3 rounded-full mr-4 flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, #4BB2F6, #004AC8)",
            boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3), 3px 3px 6px rgba(0,0,0,0.1)"
          }}
        >
          <FaEuroSign className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-green-600">Valeur Totale</div>
          <div className="text-lg font-bold text-green-700 mt-1">{selectedClient.valeurTotale}</div>
        </div>
      </motion.div>
    </div>
  </motion.div>
  
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 }}
  >
    <h3 className="text-lg font-bold mb-4 text-indigo-900 flex items-center">
      <div className="p-2 rounded-lg bg-indigo-100 mr-3 shadow-sm">
        <FiBriefcase className="text-indigo-600 w-5 h-5" />
      </div>
      Informations additionnelles
    </h3>
    
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="p-4 rounded-xl shadow-sm transition-all duration-300"
          whileHover={{ y: -5, scale: 1.02 }}
          style={{
            background: "linear-gradient(145deg, #f0f9ff, #e6f7ff)",
            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
            border: "1px solid rgba(75, 178, 246, 0.2)"
          }}
        >
          <div className="text-xs font-medium text-cyan-700 uppercase tracking-wide">Statut</div>
          <div className="mt-2 flex items-center">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(selectedClient.statut)}`}>
              {selectedClient.statut}
            </span>
          </div>
        </motion.div>
        
        <motion.div className="p-4 rounded-xl shadow-sm transition-all duration-300"
          whileHover={{ y: -5, scale: 1.02 }}
          style={{
          background: "linear-gradient(145deg, #f2f0ff, #e8e6ff)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(124, 58, 237, 0.2)"
          }}
        >
          <div className="text-xs font-medium text-violet-700 uppercase tracking-wide">Source</div>
          <div className="text-sm font-semibold text-gray-800 mt-2 bg-violet-100 py-1 px-2 rounded inline-block">{selectedClient.source}</div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="p-4 rounded-xl shadow-sm transition-all duration-300"
          whileHover={{ y: -5, scale: 1.02 }}
          style={{
            background: "linear-gradient(145deg, #fff0f0, #ffe6e6)",
            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
            border: "1px solid rgba(244, 63, 94, 0.2)"
          }}
        >
          <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">ID Client</div>
          <div className="text-sm font-semibold text-gray-800 mt-2">#{selectedClient.id}</div>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-xl shadow-sm transition-all duration-300"
          whileHover={{ y: -5, scale: 1.02 }}
          style={{
            background: "linear-gradient(145deg, #fdf0ff, #f8e6ff)",
            boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
            border: "1px solid rgba(217, 70, 239, 0.2)"
          }}
        >
          <div className="text-xs font-medium text-fuchsia-700 uppercase tracking-wide">Tags</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedClient.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs rounded-full text-white" 
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #f0fff4, #e6ffe9)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(52, 211, 153, 0.2)"
        }}
      >
        <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Dernier contact</div>
        <div className="flex items-center mt-2">
          <div 
            className="w-3 h-3 rounded-full mr-2 shadow-sm" 
            style={{ backgroundColor: getStatusColor(selectedClient.dernierContact) }}
          />
          <span className="text-sm font-semibold text-gray-800">{selectedClient.dernierContact}</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="p-4 rounded-xl shadow-sm transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        style={{
          background: "linear-gradient(145deg, #fff9e6, #fff5d6)",
          boxShadow: "5px 5px 10px rgba(0,0,0,0.05), -5px -5px 10px #ffffff",
          border: "1px solid rgba(251, 191, 36, 0.2)"
        }}
      >
        <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">Activité récente</div>
        <div className="text-sm font-medium text-gray-800 mt-2">
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Dernière facture envoyée le 28/02/2025</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Email envoyé le 01/03/2025</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  </motion.div>
</div>
</div>

{/* Modal Footer */}
<div className="border-t p-4 flex justify-between items-center bg-gray-50">
<div className="flex space-x-2">
  <button 
    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm flex items-center"
    onClick={(e) => {
      e.stopPropagation();
      alert(`Supprimer ${selectedClient.prenom} ?`);
    }}
  >
    <FiTrash2 className="mr-2" />
    <span>Supprimer</span>
  </button>
  
  <button 
    className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm flex items-center"
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = `tel:${selectedClient.telephone.replace(/\s/g, '')}`;
    }}
  >
    <FiPhone className="mr-2" />
    <span>Appeler</span>
  </button>
  
  <button 
    className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm flex items-center"
    onClick={(e) => {
      e.stopPropagation();
      window.location.href = `mailto:${selectedClient.email}`;
    }}
  >
    <FiMail className="mr-2" />
    <span>Email</span>
  </button>
</div>

<div className="flex space-x-2">
  <motion.button 
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center"
    onClick={(e) => {
      e.stopPropagation();
      handleOpenSendModal(selectedClient, e);
    }}
  >
    <FiSend className="mr-2" />
    <span>Envoyer document</span>
  </motion.button>

  <button 
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center"
    onClick={(e) => {
      e.stopPropagation();
      alert(`Éditer les informations de ${selectedClient.prenom}`);
    }}
  >
    <FiEdit className="mr-2" />
    <span>Modifier</span>
  </button>
</div>
</div>

{/* Add a prominent "Voir fiche complète" button as a sticky element at bottom */}
<div className="sticky bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 flex justify-center shadow-lg">
  {/* Option 1: Use direct button with programmatic navigation */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 w-full max-w-md"
    style={{
      background: "linear-gradient(135deg, #4BB2F6, #004AC8, #1B0353)"
    }}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      closeQuickView();

      const clientDetailPath = `/dashboard/clients/${selectedClient.id}`;
      // const altPath = `/dashboard/clients/${selectedClient.id}`;
      // const altPath2 = `/dashboard/crm/clients/${selectedClient.id}`;
      
      console.log(`Navigating to client detail page: ${clientDetailPath}`);
      
      // Try with window.location first (most reliable but causes full page refresh)
      window.location.href = clientDetailPath;
    }}
  >
    <span className="mx-auto flex items-center">
      Voir fiche complète
      <FiArrowRight className="ml-2" />
    </span>
  </motion.button>
</div>
  
</motion.div>
</motion.div>
)}
</AnimatePresence>

{/* Send Document Modal */}
<AnimatePresence>
{isModalOpen && (
  <>
    {/* Backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-40"
      onClick={handleCloseSendModal}
    />
    
    {/* Modal */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", duration: 0.3 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-auto overflow-hidden">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Envoyer au client: {selectedClientForModal?.prenom} {selectedClientForModal?.nom}
            </h3>
            <button 
              onClick={handleCloseSendModal}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Sélectionnez le type de document à envoyer à {selectedClientForModal?.prenom} {selectedClientForModal?.nom}
            </p>
            
            <div className="grid gap-3">
              {documentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSendDocument(option.title)}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
                >
                  <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-white">
                    {option.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-medium text-gray-900">{option.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button 
              onClick={handleCloseSendModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </>
)}
</AnimatePresence>
</motion.div>
  );
}
