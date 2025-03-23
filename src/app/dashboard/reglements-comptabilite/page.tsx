'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDollarSign, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  // FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  // FiUpload,
  FiCalendar,
  FiRefreshCw,
  FiCheckCircle,
  FiArrowUp,
  FiArrowDown,
  FiInfo,
  FiAlertCircle,
  FiCheck,
  // FiX,
  FiSettings,
  FiBell,
  FiFileText,
  FiGrid,
  FiList,
  // FiChevronDown,
  FiChevronsLeft,
  FiChevronsRight,
  FiSliders,
  FiClock
} from 'react-icons/fi';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

/** Interface for the notification object */
interface NotificationState {
  message: string;
  type: "info" | "success" | "error";
}

/** Payment data structure */
interface Reglement {
  id: string;
  client: string;
  nom: string;
  prenom: string;
  montant: string;
  montantNum: number; // For sorting and calculations
  date: string;
  moyenPaiement: string;
  restantAffecter: string;
  restantAffecterNum: number; // For sorting and calculations
  notes?: string;
  reference?: string;
}

/** Schedule data structure */
interface Echeance {
  id: string;
  dateEcheancier: string;
  nDocument: string;
  montant: string;
  montantNum: number; // For sorting and calculations
  soldee: boolean;
  codeTiers: string;
  client: string;
  nom: string;
  prenom: string;
  moyenPaiement: string;
  soldeDu: string;
  soldeDuNum: number; // For sorting and calculations
  notes?: string;
  urgence?: 'high' | 'medium' | 'low';
}

// Define a type for possible sort values
type SortValueType = string | number | boolean | undefined;

export default function ReglementsEcheancier() {
  // State for active tab, filters, and search
  const [activeTab, setActiveTab] = useState<"reglements" | "echeancier">("reglements");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMoyenPaiement, setSelectedMoyenPaiement] = useState<string>("Tous");
  const [selectedClient, setSelectedClient] = useState<string>("Tous");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Tous");
  const [ , setShowAddForm] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // State for selected items (for bulk actions)
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [bulkDelete, setBulkDelete] = useState<boolean>(false);

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

  // New form state
  // const [newItem, setNewItem] = useState({
  //   client: "",
  //   nom: "",
  //   prenom: "",
  //   montant: "",
  //   date: new Date().toISOString().split('T')[0],
  //   moyenPaiement: "Virement",
  //   notes: ""
  // });

  // Primary colors from the provided colors
  const primaryColor = "#1B0353";
  const secondaryColor = "#004AC8";
  const accentColor = "#4BB2F6";
  
  // Color gradient strings
  const primaryGradient = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;
  const secondaryGradient = `linear-gradient(to right, ${secondaryColor}, ${accentColor})`;

  // Sample payment data
  const reglementsData: Reglement[] = [
    {
      id: 'REG-23001',
      client: 'Entreprise ABC',
      nom: 'Dubois',
      prenom: 'Jean',
      montant: '5 280,00 €',
      montantNum: 5280,
      date: '05/03/2025',
      moyenPaiement: 'Virement',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Paiement pour facture FAC-2025-042',
      reference: 'VIR-20250305-1'
    },
    {
      id: 'REG-23002',
      client: 'SAS Martin & Co',
      nom: 'Martin',
      prenom: 'Sophie',
      montant: '1 350,75 €',
      montantNum: 1350.75,
      date: '04/03/2025',
      moyenPaiement: 'Carte bancaire',
      restantAffecter: '250,75 €',
      restantAffecterNum: 250.75,
      notes: 'Paiement partiel',
      reference: 'CB-20250304-1'
    },
    {
      id: 'REG-23003',
      client: 'Boutique Le Petit',
      nom: 'Petit',
      prenom: 'Marie',
      montant: '2 840,00 €',
      montantNum: 2840,
      date: '28/02/2025',
      moyenPaiement: 'Chèque',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Chèque n°4572196',
      reference: 'CHQ-20250228-1'
    },
    {
      id: 'REG-23004',
      client: 'Technologie Plus',
      nom: 'Leroy',
      prenom: 'Thomas',
      montant: '7 600,00 €',
      montantNum: 7600,
      date: '25/02/2025',
      moyenPaiement: 'Virement',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Paiement pour factures FAC-2025-038 et FAC-2025-039',
      reference: 'VIR-20250225-1'
    },
    {
      id: 'REG-23005',
      client: 'Agence Immobilière Centre',
      nom: 'Bernard',
      prenom: 'Claire',
      montant: '950,50 €',
      montantNum: 950.5,
      date: '22/02/2025',
      moyenPaiement: 'Espèces',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Reçu n°ESP-202502-1',
      reference: 'ESP-20250222-1'
    },
    {
      id: 'REG-23006',
      client: 'Cabinet Medical Santé',
      nom: 'Durand',
      prenom: 'Pierre',
      montant: '3 200,00 €',
      montantNum: 3200,
      date: '20/02/2025',
      moyenPaiement: 'Virement',
      restantAffecter: '1 200,00 €',
      restantAffecterNum: 1200,
      notes: 'Paiement partiel facture FAC-2025-035',
      reference: 'VIR-20250220-1'
    },
    {
      id: 'REG-23007',
      client: 'Restaurant Le Gourmet',
      nom: 'Moreau',
      prenom: 'Julie',
      montant: '4 750,25 €',
      montantNum: 4750.25,
      date: '15/02/2025',
      moyenPaiement: 'Chèque',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Chèque n°6578214',
      reference: 'CHQ-20250215-1'
    },
    {
      id: 'REG-23008',
      client: 'Auto École Permis',
      nom: 'Lefebvre',
      prenom: 'Marc',
      montant: '1 820,00 €',
      montantNum: 1820,
      date: '12/02/2025',
      moyenPaiement: 'Carte bancaire',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Paiement complet',
      reference: 'CB-20250212-1'
    },
    {
      id: 'REG-23009',
      client: 'Boulangerie Tradition',
      nom: 'Dupont',
      prenom: 'Lucie',
      montant: '925,40 €',
      montantNum: 925.4,
      date: '10/02/2025',
      moyenPaiement: 'Virement',
      restantAffecter: '0,00 €',
      restantAffecterNum: 0,
      notes: 'Paiement facture FAC-2025-030',
      reference: 'VIR-20250210-1'
    },
    {
      id: 'REG-23010',
      client: 'Institut Beauté Zen',
      nom: 'Richard',
      prenom: 'Émilie',
      montant: '2 150,00 €',
      montantNum: 2150,
      date: '05/02/2025',
      moyenPaiement: 'Virement',
      restantAffecter: '150,00 €',
      restantAffecterNum: 150,
      notes: 'Paiement partiel factures multiples',
      reference: 'VIR-20250205-1'
    },
  ];

  // Sample schedule data
  const echeancesData: Echeance[] = [
    {
      id: 'ECH-23001',
      dateEcheancier: '20/03/2025',
      nDocument: 'FAC-2025-048',
      montant: '4 580,00 €',
      montantNum: 4580,
      soldee: false,
      codeTiers: 'CLI0042',
      client: 'Entreprise ABC',
      nom: 'Dubois',
      prenom: 'Jean',
      moyenPaiement: 'Virement',
      soldeDu: '4 580,00 €',
      soldeDuNum: 4580,
      urgence: 'medium',
      notes: 'Première échéance du contrat annuel'
    },
    {
      id: 'ECH-23002',
      dateEcheancier: '15/03/2025',
      nDocument: 'FAC-2025-045',
      montant: '1 250,00 €',
      montantNum: 1250,
      soldee: true,
      codeTiers: 'CLI0036',
      client: 'SAS Martin & Co',
      nom: 'Martin',
      prenom: 'Sophie',
      moyenPaiement: 'Carte bancaire',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Échéance soldée le 04/03/2025'
    },
    {
      id: 'ECH-23003',
      dateEcheancier: '10/03/2025',
      nDocument: 'FAC-2025-044',
      montant: '3 750,00 €',
      montantNum: 3750,
      soldee: false,
      codeTiers: 'CLI0028',
      client: 'Boutique Le Petit',
      nom: 'Petit',
      prenom: 'Marie',
      moyenPaiement: 'Chèque',
      soldeDu: '910,00 €',
      soldeDuNum: 910,
      urgence: 'high',
      notes: 'Relance effectuée le 11/03/2025'
    },
    {
      id: 'ECH-23004',
      dateEcheancier: '05/03/2025',
      nDocument: 'FAC-2025-042',
      montant: '5 280,00 €',
      montantNum: 5280,
      soldee: true,
      codeTiers: 'CLI0042',
      client: 'Entreprise ABC',
      nom: 'Dubois',
      prenom: 'Jean',
      moyenPaiement: 'Virement',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Paiement reçu à la date prévue'
    },
    {
      id: 'ECH-23005',
      dateEcheancier: '28/02/2025',
      nDocument: 'FAC-2025-041',
      montant: '2 840,00 €',
      montantNum: 2840,
      soldee: true,
      codeTiers: 'CLI0028',
      client: 'Boutique Le Petit',
      nom: 'Petit',
      prenom: 'Marie',
      moyenPaiement: 'Chèque',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Chèque reçu et encaissé'
    },
    {
      id: 'ECH-23006',
      dateEcheancier: '25/02/2025',
      nDocument: 'FAC-2025-039',
      montant: '4 200,00 €',
      montantNum: 4200,
      soldee: true,
      codeTiers: 'CLI0054',
      client: 'Technologie Plus',
      nom: 'Leroy',
      prenom: 'Thomas',
      moyenPaiement: 'Virement',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Paiement inclus dans le virement global du 25/02/2025'
    },
    {
      id: 'ECH-23007',
      dateEcheancier: '25/02/2025',
      nDocument: 'FAC-2025-038',
      montant: '3 400,00 €',
      montantNum: 3400,
      soldee: true,
      codeTiers: 'CLI0054',
      client: 'Technologie Plus',
      nom: 'Leroy',
      prenom: 'Thomas',
      moyenPaiement: 'Virement',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Paiement inclus dans le virement global du 25/02/2025'
    },
    {
      id: 'ECH-23008',
      dateEcheancier: '20/02/2025',
      nDocument: 'FAC-2025-035',
      montant: '3 200,00 €',
      montantNum: 3200,
      soldee: false,
      codeTiers: 'CLI0067',
      client: 'Cabinet Medical Santé',
      nom: 'Durand',
      prenom: 'Pierre',
      moyenPaiement: 'Virement',
      soldeDu: '2 000,00 €',
      soldeDuNum: 2000,
      urgence: 'high',
      notes: 'Paiement partiel reçu le 20/02/2025, relance prévue'
    },
    {
      id: 'ECH-23009',
      dateEcheancier: '15/02/2025',
      nDocument: 'FAC-2025-034',
      montant: '4 750,25 €',
      montantNum: 4750.25,
      soldee: true,
      codeTiers: 'CLI0073',
      client: 'Restaurant Le Gourmet',
      nom: 'Moreau',
      prenom: 'Julie',
      moyenPaiement: 'Chèque',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Chèque reçu et encaissé'
    },
    {
      id: 'ECH-23010',
      dateEcheancier: '10/02/2025',
      nDocument: 'FAC-2025-030',
      montant: '925,40 €',
      montantNum: 925.4,
      soldee: true,
      codeTiers: 'CLI0085',
      client: 'Boulangerie Tradition',
      nom: 'Dupont',
      prenom: 'Lucie',
      moyenPaiement: 'Virement',
      soldeDu: '0,00 €',
      soldeDuNum: 0,
      urgence: 'low',
      notes: 'Paiement reçu dans les délais'
    },
  ];

  // Calculate statistics
  const totalMontantReglements = reglementsData.reduce((sum, item) => sum + item.montantNum, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const totalReglements = reglementsData.length;
  
  const totalMontantEcheances = echeancesData.reduce((sum, item) => sum + item.montantNum, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  const totalEcheances = echeancesData.length;
  const totalEcheancesSoldees = echeancesData.filter(item => item.soldee).length;
  // const totalEcheancesNonSoldees = echeancesData.filter(item => !item.soldee).length;
  const pourcentageSoldees = Math.round((totalEcheancesSoldees / totalEcheances) * 100);

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'payment', action: 'Règlement ajouté', details: 'Entreprise ABC - 5 280,00 €', time: 'Il y a 2 heures' },
    { id: 2, type: 'schedule', action: 'Échéance soldée', details: 'SAS Martin & Co - 1 250,00 €', time: 'Il y a 3 heures' },
    { id: 3, type: 'payment', action: 'Relance envoyée', details: 'Boutique Le Petit - Échéance du 10/03', time: 'Il y a 5 heures' },
    { id: 4, type: 'schedule', action: 'Nouvelle échéance', details: 'Entreprise ABC - 4 580,00 €', time: 'Hier' },
    { id: 5, type: 'payment', action: 'Paiement partiel', details: 'Cabinet Medical Santé - 3 200,00 €', time: 'Il y a 2 jours' }
  ];

  // Filter options
  const moyenPaiementOptions = ['Tous', 'Virement', 'Carte bancaire', 'Chèque', 'Espèces', 'Prélèvement'];
  const periodOptions = ['Tous', 'Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Ce trimestre', 'Cette année'];
  const clientOptions = ['Tous', 'Entreprise ABC', 'SAS Martin & Co', 'Boutique Le Petit', 'Technologie Plus', 'Agence Immobilière Centre', 'Cabinet Medical Santé', 'Restaurant Le Gourmet', 'Auto École Permis', 'Boulangerie Tradition', 'Institut Beauté Zen'];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'reglements') {
        setSelectedItems(filteredReglements.map(item => item.id));
      } else {
        setSelectedItems(filteredEcheances.map(item => item.id));
      }
    } else {
      setSelectedItems([]);
    }
  };

  // Handler for individual item selection
  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handler for delete confirmation
  const confirmDelete = (id: string | null = null) => {
    if (id) {
      setItemToDelete(id);
      setBulkDelete(false);
    } else {
      setBulkDelete(true);
    }
    setShowDeleteModal(true);
  };

  // Handler for actual deletion
  const handleDelete = () => {
    if (bulkDelete) {
      // Here you would delete all selected items
      displayNotification(`${selectedItems.length} élément(s) supprimé(s) avec succès`, 'success');
    } else if (itemToDelete) {
      // Here you would delete the specific item
      displayNotification(`Élément ${itemToDelete} supprimé avec succès`, 'success');
    }
    
    // Reset states
    setShowDeleteModal(false);
    setItemToDelete(null);
    setBulkDelete(false);
    setSelectedItems([]);
    setSelectAll(false);
  };

  // Filter reglements based on search and filter criteria
  const filteredReglements = reglementsData.filter(reglement => {
    const matchesSearch = 
      searchTerm === '' || 
      reglement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reglement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reglement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reglement.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reglement.montant.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMoyenPaiement = selectedMoyenPaiement === 'Tous' || reglement.moyenPaiement === selectedMoyenPaiement;
    const matchesClient = selectedClient === 'Tous' || reglement.client === selectedClient;
    
    // Date filtering
    let matchesDate = true;
    if (dateDebut && dateFin) {
      const reglementDate = new Date(reglement.date.split('/').reverse().join('-'));
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      matchesDate = reglementDate >= startDate && reglementDate <= endDate;
    }
    
    return matchesSearch && matchesMoyenPaiement && matchesClient && matchesDate;
  });

  // Apply sorting to reglements
  const sortedReglements = [...filteredReglements].sort((a, b) => {
    let aValue: SortValueType = '';
    let bValue: SortValueType = '';
    
    // Determine which values to compare based on sortField
    switch(sortField) {
      case 'montant':
        aValue = a.montantNum;
        bValue = b.montantNum;
        break;
      case 'restantAffecter':
        aValue = a.restantAffecterNum;
        bValue = b.restantAffecterNum;
        break;
      case 'date':
        aValue = new Date(a.date.split('/').reverse().join('-')).getTime();
        bValue = new Date(b.date.split('/').reverse().join('-')).getTime();
        break;
      default:
        // Type assertion to avoid undefined error
        if (sortField in a && sortField in b) {
          aValue = a[sortField as keyof Reglement];
          bValue = b[sortField as keyof Reglement];
        }
        break;
    }
    
    // Compare values with null checks
    if (sortDirection === 'asc') {
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      return aValue > bValue ? 1 : -1;
    } else {
      if (aValue === undefined) return -1;
      if (bValue === undefined) return 1;
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filter echeances based on search and filter criteria
  const filteredEcheances = echeancesData.filter(echeance => {
    const matchesSearch = 
      searchTerm === '' || 
      echeance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      echeance.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      echeance.nDocument.toLowerCase().includes(searchTerm.toLowerCase()) ||
      echeance.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      echeance.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      echeance.codeTiers.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMoyenPaiement = selectedMoyenPaiement === 'Tous' || echeance.moyenPaiement === selectedMoyenPaiement;
    const matchesClient = selectedClient === 'Tous' || echeance.client === selectedClient;
    
    // Date filtering
    let matchesDate = true;
    if (dateDebut && dateFin) {
      const echeanceDate = new Date(echeance.dateEcheancier.split('/').reverse().join('-'));
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      matchesDate = echeanceDate >= startDate && echeanceDate <= endDate;
    }
    
    return matchesSearch && matchesMoyenPaiement && matchesClient && matchesDate;
  });

  // Apply sorting to echeances
const sortedEcheances = [...filteredEcheances].sort((a, b) => {
  let aValue: SortValueType = '';
  let bValue: SortValueType = '';
  
  // Determine which values to compare based on sortField
  switch(sortField) {
    case 'montant':
      aValue = a.montantNum;
      bValue = b.montantNum;
      break;
    case 'soldeDu':
      aValue = a.soldeDuNum;
      bValue = b.soldeDuNum;
      break;
    case 'dateEcheancier':
      aValue = new Date(a.dateEcheancier.split('/').reverse().join('-')).getTime();
      bValue = new Date(b.dateEcheancier.split('/').reverse().join('-')).getTime();
      break;
    case 'soldee':
      aValue = a.soldee ? 1 : 0;
      bValue = b.soldee ? 1 : 0;
      break;
    default:
      // Type assertion to avoid undefined error
      if (sortField in a && sortField in b) {
        aValue = a[sortField as keyof Echeance];
        bValue = b[sortField as keyof Echeance];
      }
      break;
  }
  
  // Compare values with null checks
  if (sortDirection === 'asc') {
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    return aValue > bValue ? 1 : -1;
  } else {
    if (aValue === undefined) return -1;
    if (bValue === undefined) return 1;
    return aValue < bValue ? 1 : -1;
  }
});

  // Reset filters
  const resetFilters = () => {
    setSelectedMoyenPaiement('Tous');
    setSelectedClient('Tous');
    setDateDebut('');
    setDateFin('');
    setSelectedPeriod('Tous');
    setSearchTerm('');
    displayNotification('Filtres réinitialisés', 'success');
  };

  // Apply period filter
  const applyPeriodFilter = (period: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();
    
    switch(period) {
      case 'Aujourd\'hui':
        setDateDebut(today.toISOString().split('T')[0]);
        setDateFin(today.toISOString().split('T')[0]);
        break;
      case 'Cette semaine':
        start.setDate(today.getDate() - today.getDay());
        end.setDate(today.getDate() + (6 - today.getDay()));
        setDateDebut(start.toISOString().split('T')[0]);
        setDateFin(end.toISOString().split('T')[0]);
        break;
      case 'Ce mois':
        start.setDate(1);
        end.setMonth(today.getMonth() + 1);
        end.setDate(0);
        setDateDebut(start.toISOString().split('T')[0]);
        setDateFin(end.toISOString().split('T')[0]);
        break;
      case 'Ce trimestre':
        start.setMonth(Math.floor(today.getMonth() / 3) * 3);
        start.setDate(1);
        end.setMonth(Math.floor(today.getMonth() / 3) * 3 + 3);
        end.setDate(0);
        setDateDebut(start.toISOString().split('T')[0]);
        setDateFin(end.toISOString().split('T')[0]);
        break;
      case 'Cette année':
        start.setMonth(0);
        start.setDate(1);
        end.setMonth(11);
        end.setDate(31);
        setDateDebut(start.toISOString().split('T')[0]);
        setDateFin(end.toISOString().split('T')[0]);
        break;
      default:
        setDateDebut('');
        setDateFin('');
        break;
    }
  };

  // Chart data for monthly statistics
  const monthlyStatsReglements = [
    { name: 'Jan', amount: 12500 },
    { name: 'Fév', amount: 17800 },
    { name: 'Mar', amount: 15400 },
    { name: 'Avr', amount: 21000 },
    { name: 'Mai', amount: 18300 },
    { name: 'Juin', amount: 24700 },
    { name: 'Juil', amount: 22100 },
    { name: 'Août', amount: 19500 },
    { name: 'Sep', amount: 26800 },
    { name: 'Oct', amount: 25200 },
    { name: 'Nov', amount: 29800 },
    { name: 'Déc', amount: 30900 }
  ];

  const monthlyStatsEcheances = [
    { name: 'Jan', prevues: 14200, soldees: 12800 },
    { name: 'Fév', prevues: 18900, soldees: 16300 },
    { name: 'Mar', prevues: 16800, soldees: 15400 },
    { name: 'Avr', prevues: 22400, soldees: 20100 },
    { name: 'Mai', prevues: 19700, soldees: 17500 },
    { name: 'Juin', prevues: 26300, soldees: 23800 },
    { name: 'Juil', prevues: 23500, soldees: 21200 },
    { name: 'Août', prevues: 20800, soldees: 18700 },
    { name: 'Sep', prevues: 28500, soldees: 25400 },
    { name: 'Oct', prevues: 27100, soldees: 24300 },
    { name: 'Nov', prevues: 31600, soldees: 28200 },
    { name: 'Déc', prevues: 33200, soldees: 29800 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Sticky top bar */}
      <div className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg" style={{ background: primaryGradient }}>
              <FiDollarSign className="text-white text-xl" />
            </div>
            {isScrolled && <span style={{ color: primaryColor }}>Règlements & Échéancier</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition relative">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
              <FiSettings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium shadow-md" style={{ background: secondaryGradient }}>
              JD
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl shadow-xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-70"></div>
          <div className="relative">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: primaryGradient }}>
                Règlements & Échéancier
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Gérez efficacement vos règlements clients et votre échéancier de paiements. Suivez l&apos;état de vos encaissements et planifiez vos revenus futurs.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2.5 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                style={{ background: primaryGradient }}
                onClick={() => displayNotification('Synchronisation des données en cours...', 'info')}
              >
                <FiRefreshCw className="mr-2" />
                <span>Synchroniser les données</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow transition-all"
                onClick={() => displayNotification('Rapports financiers générés avec succès', 'success')}
              >
                <FiFileText className="mr-2" style={{ color: secondaryColor }} />
                <span>Exporter les rapports</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
                <button className="text-xs hover:underline transition" style={{ color: secondaryColor }}>
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
                      {activity.type === 'payment' ? (
                        <FiDollarSign size={16} style={{ color: secondaryColor }} />
                      ) : (
                        <FiCalendar size={16} style={{ color: primaryColor }} />
                      )}
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
            
            {/* Chart */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-bold text-gray-800 mb-4">Evolution sur 12 mois</h3>
              <div className="h-60">
                {activeTab === 'reglements' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyStatsReglements}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={10} tickMargin={5} />
                      <YAxis fontSize={10} tickFormatter={(value) => `${value / 1000}k€`} />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
                        labelFormatter={(label) => `Mois: ${label}`}
                      />
                      <Bar dataKey="amount" fill={accentColor} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyStatsEcheances}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" fontSize={10} tickMargin={5} />
                      <YAxis fontSize={10} tickFormatter={(value) => `${value / 1000}k€`} />
                      <Tooltip 
                        formatter={(value) => [`${value.toLocaleString('fr-FR')} €`, 'Montant']}
                        labelFormatter={(label) => `Mois: ${label}`}
                      />
                      <Bar dataKey="prevues" name="Échéances prévues" fill={secondaryColor} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="soldees" name="Échéances soldées" fill={accentColor} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 text-xs text-center text-gray-500">
                Évolution des {activeTab === 'reglements' ? 'règlements' : 'échéances'} sur les 12 derniers mois
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'reglements' 
                    ? 'border-b-2 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('reglements');
                    setSelectedItems([]);
                    setSelectAll(false);
                  }}
                  style={activeTab === 'reglements' ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10`, color: primaryColor } : {}}
                >
                  <FiDollarSign className={`mr-2 ${activeTab === 'reglements' ? '' : 'text-gray-400'}`} style={activeTab === 'reglements' ? { color: primaryColor } : {}} />
                  Règlements
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition flex items-center justify-center ${
                    activeTab === 'echeancier' 
                    ? 'border-b-2 bg-opacity-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('echeancier');
                    setSelectedItems([]);
                    setSelectAll(false);
                  }}
                  style={activeTab === 'echeancier' ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10`, color: primaryColor } : {}}
                >
                  <FiCalendar className={`mr-2 ${activeTab === 'echeancier' ? '' : 'text-gray-400'}`} style={activeTab === 'echeancier' ? { color: primaryColor } : {}} />
                  Échéancier
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="p-6">
                {activeTab === 'reglements' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${primaryColor}15` }}>
                          <FiFileText size={20} style={{ color: primaryColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Nombre total de règlements</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{totalReglements}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 text-green-700 bg-green-50">
                          <FiArrowUp size={12} />
                          <span>+12% ce mois</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${secondaryColor}15` }}>
                          <FiDollarSign size={20} style={{ color: secondaryColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Montant total</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{totalMontantReglements}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 text-green-700 bg-green-50">
                          <FiArrowUp size={12} />
                          <span>+8.5% ce mois</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${primaryColor}15` }}>
                          <FiFileText size={20} style={{ color: primaryColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Nombre total d&apos;échéances</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{totalEcheances}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 text-amber-700 bg-amber-50">
                          <FiArrowDown size={12} />
                          <span>-5% ce mois</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${secondaryColor}15` }}>
                          <FiDollarSign size={20} style={{ color: secondaryColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Montant total</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{totalMontantEcheances}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 text-green-700 bg-green-50">
                          <FiArrowUp size={12} />
                          <span>+7.2% ce mois</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: `${accentColor}15` }}>
                          <FiCheckCircle size={20} style={{ color: accentColor }} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Taux de recouvrement</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-gray-900">{pourcentageSoldees}%</div>
                        <div className="text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 text-green-700 bg-green-50">
                          <FiArrowUp size={12} />
                          <span>+3% ce mois</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
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
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                      // style={{ focusRing: primaryColor }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-1 px-3 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
                      style={{ background: primaryGradient }}
                      onClick={() => setShowAddForm(true)}
                    >
                      <FiPlus size={18} />
                      <span>{activeTab === 'reglements' ? 'Ajouter un règlement' : 'Ajouter une échéance'}</span>
                    </motion.button>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      <FiFilter size={18} />
                      <span>{showFilters ? 'Masquer filtres' : 'Filtres'}</span>
                    </button>
                    
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 ${viewMode === 'table' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        style={{ backgroundColor: viewMode === 'table' ? primaryColor : '' }}
                      >
                        <FiList size={18} />
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        style={{ backgroundColor: viewMode === 'grid' ? primaryColor : '' }}
                      >
                        <FiGrid size={18} />
                      </button>
                    </div>
                    
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => displayNotification('Données actualisées', 'success')}
                    >
                      <FiRefreshCw size={18} />
                      <span className="hidden md:inline">Actualiser</span>
                    </button>
                    
                    <button 
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      onClick={() => displayNotification('Export en cours...', 'info')}
                    >
                      <FiDownload size={18} />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {activeTab === 'reglements' ? 'Moyen de paiement' : 'Moyen de paiement'}
                          </label>
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                            // style={{ focusRing: primaryColor }}
                            value={selectedMoyenPaiement}
                            onChange={(e) => setSelectedMoyenPaiement(e.target.value)}
                          >
                            {moyenPaiementOptions.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client
                          </label>
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                            // style={{ focusRing: primaryColor }}
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
                            Période prédéfinie
                          </label>
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                            // style={{ focusRing: primaryColor }}
                            value={selectedPeriod}
                            onChange={(e) => {
                              setSelectedPeriod(e.target.value);
                              applyPeriodFilter(e.target.value);
                            }}
                          >
                            {periodOptions.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date début
                            </label>
                            <input 
                              type="date" 
                              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                              // style={{ focusRing: primaryColor }}
                              value={dateDebut}
                              onChange={(e) => setDateDebut(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date fin
                            </label>
                            <input 
                              type="date" 
                              className={`w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                              // style={{ focusRing: primaryColor }}
                              value={dateFin}
                              onChange={(e) => setDateFin(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={resetFilters}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                          Réinitialiser
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 text-white rounded-lg transition"
                          style={{ backgroundColor: primaryColor }}
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
                {selectedItems.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="px-6 pb-6"
                  >
                    <div className="p-4 rounded-xl border flex justify-between items-center"
                      style={{ backgroundColor: `${primaryColor}05`, borderColor: `${primaryColor}25` }}>
                      <div className="flex items-center" style={{ color: primaryColor }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                          style={{ backgroundColor: `${primaryColor}15` }}>
                          <FiCheck size={16} style={{ color: primaryColor }} />
                        </div>
                        <span className="font-medium">{selectedItems.length}</span>{' '}
                        {activeTab === 'reglements' ? 'règlement(s)' : 'échéance(s)'} sélectionné(s)
                      </div>
                      <div className="flex space-x-2">
                        {activeTab === 'echeancier' && (
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-1.5 text-sm text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                            style={{ backgroundColor: '#10B981' }}
                            onClick={() => {
                              displayNotification(`${selectedItems.length} échéance(s) marquée(s) comme soldée(s)`, 'success');
                              setSelectedItems([]);
                            }}
                          >
                            <FiCheckCircle size={16} />
                            <span>Marquer comme soldée</span>
                          </motion.button>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 text-sm text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                          style={{ backgroundColor: secondaryColor }}
                          onClick={() => displayNotification(`${selectedItems.length} élément(s) exporté(s)`, 'success')}
                        >
                          <FiDownload size={16} />
                          <span>Exporter</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg shadow-sm hover:shadow transition flex items-center space-x-1"
                          onClick={() => confirmDelete()}
                        >
                          <FiTrash2 size={16} />
                          <span>Supprimer</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content based on active tab */}
              <div className="px-6 pb-6">
                {/* Reglements Tab */}
                {activeTab === 'reglements' && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className={`h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 text-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                                  // style={{ color: primaryColor, focusRing: primaryColor }}
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('client')}
                            >
                              <div className="flex items-center">
                                <span>Client</span>
                                {sortField === 'client' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('nom')}
                            >
                              <div className="flex items-center">
                                <span>Nom</span>
                                {sortField === 'nom' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('prenom')}
                            >
                              <div className="flex items-center">
                                <span>Prénom</span>
                                {sortField === 'prenom' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('montant')}
                            >
                              <div className="flex items-center">
                                <span>Montant</span>
                                {sortField === 'montant' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('date')}
                            >
                              <div className="flex items-center">
                                <span>Date</span>
                                {sortField === 'date' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('moyenPaiement')}
                            >
                              <div className="flex items-center">
                                <span>Moyen de paiement</span>
                                {sortField === 'moyenPaiement' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('restantAffecter')}
                            >
                              <div className="flex items-center">
                                <span>Restant à affecter</span>
                                {sortField === 'restantAffecter' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedReglements.length > 0 ? (
                            sortedReglements.map((reglement) => (
                              <motion.tr 
                                key={reglement.id}
                                whileHover={{ backgroundColor: '#F9FAFB' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                layout
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input 
                                    type="checkbox" 
                                    className={`h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 text-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                                    // style={{ color: primaryColor, focusRing: primaryColor }}
                                    checked={selectedItems.includes(reglement.id)}
                                    onChange={() => handleSelectItem(reglement.id)}
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{reglement.client}</div>
                                  <div className="text-xs text-gray-500">{reglement.id}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {reglement.nom}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {reglement.prenom}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {reglement.montant}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {reglement.date}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {reglement.moyenPaiement}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  <span className={reglement.restantAffecterNum > 0 ? 'text-amber-600 font-medium' : ''}>
                                    {reglement.restantAffecter}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button 
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      onClick={() => displayNotification(`Détails du règlement ${reglement.id}`, 'info')}
                                    >
                                      <FiEye size={18} />
                                    </button>
                                    <button 
                                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                      onClick={() => displayNotification(`Modification du règlement ${reglement.id}`, 'info')}
                                    >
                                      <FiEdit size={18} />
                                    </button>
                                    <button 
                                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                      onClick={() => displayNotification(`Rapprochement du règlement ${reglement.id}`, 'info')}
                                    >
                                      <FiSliders size={18} />
                                    </button>
                                    <button 
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      onClick={() => confirmDelete(reglement.id)}
                                    >
                                      <FiTrash2 size={18} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                <div className="flex flex-col items-center">
                                  <FiInfo className="w-10 h-10 text-gray-300 mb-2" />
                                  <p>Aucun règlement ne correspond à vos critères</p>
                                  <button 
                                    className="mt-2 hover:underline font-medium"
                                    style={{ color: primaryColor }}
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
                )}

                {/* Echeancier Tab */}
                {activeTab === 'echeancier' && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className={`h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 text-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                                  // style={{ color: primaryColor, focusRing: primaryColor }}
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                />
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('dateEcheancier')}
                            >
                              <div className="flex items-center">
                                <span>Date d&apos;échéancier</span>
                                {sortField === 'dateEcheancier' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('nDocument')}
                            >
                              <div className="flex items-center">
                                <span>N° document</span>
                                {sortField === 'nDocument' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('montant')}
                            >
                              <div className="flex items-center">
                                <span>Montant</span>
                                {sortField === 'montant' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('soldee')}
                            >
                              <div className="flex items-center">
                                <span>Soldée</span>
                                {sortField === 'soldee' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('codeTiers')}
                            >
                              <div className="flex items-center">
                                <span>Code tiers</span>
                                {sortField === 'codeTiers' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('client')}
                            >
                              <div className="flex items-center">
                                <span>Client / Nom / Prénom</span>
                                {sortField === 'client' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('moyenPaiement')}
                            >
                              <div className="flex items-center">
                                <span>Moyen de paiement</span>
                                {sortField === 'moyenPaiement' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => handleSort('soldeDu')}
                            >
                              <div className="flex items-center">
                                <span>Solde dû</span>
                                {sortField === 'soldeDu' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedEcheances.length > 0 ? (
                            sortedEcheances.map((echeance) => (
                              <motion.tr 
                                key={echeance.id}
                                whileHover={{ backgroundColor: '#F9FAFB' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                layout
                                className={echeance.urgence === 'high' ? 'bg-red-50' : ''}
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <input 
                                    type="checkbox" 
                                    className={`h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50 text-[${primaryColor}] focus:ring-[${primaryColor}] transition`}
                                    // style={{ color: primaryColor, focusRing: primaryColor }}
                                    checked={selectedItems.includes(echeance.id)}
                                    onChange={() => handleSelectItem(echeance.id)}
                                  />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {echeance.dateEcheancier}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium" style={{ color: secondaryColor }}>{echeance.nDocument}</div>
                                  <div className="text-xs text-gray-500">{echeance.id}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {echeance.montant}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {echeance.soldee ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                      <FiCheck size={12} className="mr-1" /> Oui
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                      <FiClock size={12} className="mr-1" /> Non
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {echeance.codeTiers}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{echeance.client}</div>
                                  <div className="text-xs text-gray-500">{echeance.nom} {echeance.prenom}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {echeance.moyenPaiement}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  <span className={echeance.soldeDuNum > 0 ? 'text-red-600' : 'text-green-600'}>
                                    {echeance.soldeDu}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button 
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      onClick={() => displayNotification(`Détails de l'échéance ${echeance.id}`, 'info')}
                                    >
                                      <FiEye size={18} />
                                </button>
                                <button 
                                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                  onClick={() => displayNotification(`Modification de l'échéance ${echeance.id}`, 'info')}
                                >
                                  <FiEdit size={18} />
                                </button>
                                {!echeance.soldee && (
                                  <button 
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                    onClick={() => {
                                      displayNotification(`Échéance ${echeance.id} marquée comme soldée`, 'success');
                                    }}
                                  >
                                    <FiCheckCircle size={18} />
                                  </button>
                                )}
                                <button 
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  onClick={() => confirmDelete(echeance.id)}
                                >
                                  <FiTrash2 size={18} />
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
                                className="mt-2 hover:underline font-medium"
                                style={{ color: primaryColor }}
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
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 pb-6 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">
                {activeTab === 'reglements' ? filteredReglements.length : filteredEcheances.length}
              </span> sur <span className="font-medium">
                {activeTab === 'reglements' ? reglementsData.length : echeancesData.length}
              </span> résultats
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                <FiChevronsLeft size={16} />
              </button>
              <button className="px-3 py-2 border text-white rounded-md text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                <FiChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>

  {/* Delete Confirmation Modal */}
  <AnimatePresence>
    {showDeleteModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmation de suppression</h3>
          <p className="text-gray-600 mb-6">
            {bulkDelete 
              ? `Êtes-vous sûr de vouloir supprimer les ${selectedItems.length} élément(s) sélectionné(s) ?` 
              : `Êtes-vous sûr de vouloir supprimer cet élément "${itemToDelete}" ?`
            }
            <br />
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={handleDelete}
            >
              Supprimer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

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
