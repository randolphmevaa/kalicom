'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiCreditCard,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  // FiEdit,
  // FiTrash2,
  // FiEye,
  FiSearch,
  FiFilter,
  // FiDownload,
  // FiUpload,
  FiRefreshCw,
  // FiCheck,
  // FiX,
  FiCheckCircle,
  // FiAlertTriangle,
  // FiInfo,
  FiCalendar,
  // FiClock,
  // FiFileText,
  // FiLink,
  // FiLock,
  // FiUnlock,
  // FiSettings,
  FiActivity,
  FiBarChart2,
  // FiPieChart,
  // FiColumns,
  // FiList,
  // FiGrid,
  // FiMoreVertical
} from 'react-icons/fi';

export default function Banque() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('comptes');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // const [viewMode, setViewMode] = useState('liste');
  const [ , setReconciliationMode] = useState(false);
  // const [dateRange, setDateRange] = useState('last30');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [categoryFilter, setCategoryFilter] = useState('Tous');
  const [dateRangeFilter, setDateRangeFilter] = useState('Tous');
  
  // Sample bank accounts data
  const [accountsData ] = useState([
    {
      id: 'BA-001',
      nom: 'Compte Courant Professionnel',
      numero: 'FR76 3000 1007 1600 0000 8977 C32',
      banque: 'Crédit Mutuel',
      type: 'Courant',
      devise: 'EUR',
      solde: 15782.45,
      soldeInitial: 10000.00,
      dateOuverture: '15/01/2023',
      derniereMaj: '05/03/2025',
      isActive: true,
      isDefault: true,
      notes: 'Compte principal de l\'entreprise',
      rapprochementDate: '29/02/2025',
      soldeRapproche: 15637.25,
      categorie: 'Professionnel'
    },
    {
      id: 'BA-002',
      nom: 'Compte Épargne',
      numero: 'FR76 3000 1007 1600 0000 8977 D45',
      banque: 'Crédit Mutuel',
      type: 'Épargne',
      devise: 'EUR',
      solde: 45000.00,
      soldeInitial: 30000.00,
      dateOuverture: '15/01/2023',
      derniereMaj: '01/03/2025',
      isActive: true,
      isDefault: false,
      notes: 'Réserve de trésorerie',
      rapprochementDate: '31/01/2025',
      soldeRapproche: 45000.00,
      categorie: 'Professionnel'
    },
    {
      id: 'BA-003',
      nom: 'Carte de Crédit Professionnelle',
      numero: '4242 XXXX XXXX 4242',
      banque: 'Crédit Mutuel',
      type: 'Carte',
      devise: 'EUR',
      solde: -1432.78,
      soldeInitial: 0,
      dateOuverture: '20/01/2023',
      derniereMaj: '05/03/2025',
      isActive: true,
      isDefault: false,
      notes: 'Carte de crédit d\'entreprise principale',
      rapprochementDate: '15/02/2025',
      soldeRapproche: -1287.56,
      categorie: 'Crédit'
    },
    {
      id: 'BA-004',
      nom: 'Compte Dollar',
      numero: 'FR76 3000 1007 1600 0000 8977 E67',
      banque: 'Crédit Mutuel',
      type: 'Courant',
      devise: 'USD',
      solde: 5240.15,
      soldeInitial: 5000.00,
      dateOuverture: '10/05/2023',
      derniereMaj: '01/03/2025',
      isActive: true,
      isDefault: false,
      notes: 'Pour les transactions en dollars',
      rapprochementDate: '29/02/2025',
      soldeRapproche: 5240.15,
      categorie: 'International'
    },
    {
      id: 'BA-005',
      nom: 'Prêt Équipement',
      numero: 'FR76 3000 1007 1600 0000 8977 F89',
      banque: 'BNP Paribas',
      type: 'Prêt',
      devise: 'EUR',
      solde: -25000.00,
      soldeInitial: -30000.00,
      dateOuverture: '15/09/2023',
      derniereMaj: '01/03/2025',
      isActive: true,
      isDefault: false,
      notes: 'Prêt pour l\'achat d\'équipement informatique',
      rapprochementDate: '29/02/2025',
      soldeRapproche: -25000.00,
      categorie: 'Crédit'
    },
    {
      id: 'BA-006',
      nom: 'Ancien Compte Courant',
      numero: 'FR76 1000 1234 1234 1234 1234 123',
      banque: 'Société Générale',
      type: 'Courant',
      devise: 'EUR',
      solde: 0,
      soldeInitial: 2500.00,
      dateOuverture: '01/01/2020',
      derniereMaj: '10/01/2023',
      isActive: false,
      isDefault: false,
      notes: 'Ancien compte fermé après changement de banque',
      rapprochementDate: '31/12/2022',
      soldeRapproche: 0,
      categorie: 'Professionnel'
    }
  ]);

  // Sample transactions data
  const [transactionsData, setTransactionsData] = useState([
    {
      id: 'TR-001',
      date: '05/03/2025',
      libelle: 'Paiement client Acme Corp',
      montant: 2500.00,
      type: 'Crédit',
      compte: 'BA-001',
      categorie: 'Ventes',
      statut: 'Confirmé',
      reference: 'VIR-ACME-2503',
      facture: 'FACT-2025-042',
      notes: 'Paiement facture de février',
      tiers: 'Acme Corp',
      rapproche: true,
      tags: ['Client', 'Virement']
    },
    {
      id: 'TR-002',
      date: '04/03/2025',
      libelle: 'Loyer bureau mars',
      montant: -1200.00,
      type: 'Débit',
      compte: 'BA-001',
      categorie: 'Loyer',
      statut: 'Confirmé',
      reference: 'VIR-LOYER-0403',
      facture: '',
      notes: 'Loyer mensuel',
      tiers: 'SCI Immobilier',
      rapproche: true,
      tags: ['Fournisseur', 'Fixe']
    },
    {
      id: 'TR-003',
      date: '02/03/2025',
      libelle: 'Abonnement logiciel CRM',
      montant: -89.90,
      type: 'Débit',
      compte: 'BA-003',
      categorie: 'Logiciels',
      statut: 'Confirmé',
      reference: 'CB-CRM-0203',
      facture: '',
      notes: 'Abonnement mensuel',
      tiers: 'SaaS CRM',
      rapproche: true,
      tags: ['Fournisseur', 'Récurrent']
    },
    {
      id: 'TR-004',
      date: '28/02/2025',
      libelle: 'Virement compte épargne',
      montant: -5000.00,
      type: 'Débit',
      compte: 'BA-001',
      categorie: 'Transfert',
      statut: 'Confirmé',
      reference: 'VIR-EPARGNE-2802',
      facture: '',
      notes: 'Transfert vers épargne',
      tiers: 'Interne',
      rapproche: true,
      tags: ['Transfert', 'Interne']
    },
    {
      id: 'TR-005',
      date: '28/02/2025',
      libelle: 'Virement depuis compte courant',
      montant: 5000.00,
      type: 'Crédit',
      compte: 'BA-002',
      categorie: 'Transfert',
      statut: 'Confirmé',
      reference: 'VIR-EPARGNE-2802',
      facture: '',
      notes: 'Transfert depuis courant',
      tiers: 'Interne',
      rapproche: true,
      tags: ['Transfert', 'Interne']
    },
    {
      id: 'TR-006',
      date: '25/02/2025',
      libelle: 'Paiement fournisseur matériel',
      montant: -1850.35,
      type: 'Débit',
      compte: 'BA-001',
      categorie: 'Équipement',
      statut: 'Confirmé',
      reference: 'VIR-EQUIP-2502',
      facture: '',
      notes: 'Achat nouveaux ordinateurs',
      tiers: 'TechSupply',
      rapproche: true,
      tags: ['Fournisseur', 'Investissement']
    },
    {
      id: 'TR-007',
      date: '20/02/2025',
      libelle: 'Paiement client Zenith SA',
      montant: 4500.00,
      type: 'Crédit',
      compte: 'BA-001',
      categorie: 'Ventes',
      statut: 'Confirmé',
      reference: 'VIR-ZENITH-2002',
      facture: 'FACT-2025-039',
      notes: 'Paiement facture de janvier',
      tiers: 'Zenith SA',
      rapproche: true,
      tags: ['Client', 'Virement']
    },
    {
      id: 'TR-008',
      date: '15/02/2025',
      libelle: 'Remboursement prêt équipement',
      montant: -500.00,
      type: 'Débit',
      compte: 'BA-001',
      categorie: 'Emprunt',
      statut: 'Confirmé',
      reference: 'PRLV-PRET-1502',
      facture: '',
      notes: 'Échéance mensuelle',
      tiers: 'BNP Paribas',
      rapproche: true,
      tags: ['Banque', 'Fixe']
    },
    {
      id: 'TR-009',
      date: '15/02/2025',
      libelle: 'Remboursement reçu',
      montant: 500.00,
      type: 'Crédit',
      compte: 'BA-005',
      categorie: 'Emprunt',
      statut: 'Confirmé',
      reference: 'PRLV-PRET-1502',
      facture: '',
      notes: 'Échéance mensuelle',
      tiers: 'Interne',
      rapproche: true,
      tags: ['Banque', 'Fixe']
    },
    {
      id: 'TR-010',
      date: '07/03/2025',
      libelle: 'Paiement client Nexus Tech',
      montant: 2990.00,
      type: 'Crédit',
      compte: 'BA-001',
      categorie: 'Ventes',
      statut: 'En attente',
      reference: 'CHQ-NEXUS-0703',
      facture: 'FACT-2025-045',
      notes: 'Paiement par chèque à encaisser',
      tiers: 'Nexus Tech',
      rapproche: false,
      tags: ['Client', 'Chèque']
    },
    {
      id: 'TR-011',
      date: '01/03/2025',
      libelle: 'Achat fournitures bureau',
      montant: -145.30,
      type: 'Débit',
      compte: 'BA-003',
      categorie: 'Fournitures',
      statut: 'Confirmé',
      reference: 'CB-FOURN-0103',
      facture: '',
      notes: 'Papeterie et consommables',
      tiers: 'Office Supplies',
      rapproche: false,
      tags: ['Fournisseur', 'Variable']
    },
    {
      id: 'TR-012',
      date: '10/03/2025',
      libelle: 'Prévision règlement client Global',
      montant: 3500.00,
      type: 'Crédit',
      compte: 'BA-001',
      categorie: 'Ventes',
      statut: 'Prévu',
      reference: '',
      facture: 'FACT-2025-047',
      notes: 'Règlement prévu pour le 10/03',
      tiers: 'Global Industries',
      rapproche: false,
      tags: ['Client', 'Prévisionnel']
    }
  ]);

  // Statistics
  const compteStatistics = [
    { title: "Solde total", value: `${accountsData.filter(a => a.isActive).reduce((sum, a) => a.devise === 'EUR' ? sum + a.solde : sum, 0).toLocaleString('fr-FR')} €`, icon: <FiDollarSign className="text-blue-500" />, change: "+7.5% ce mois" },
    { title: "Comptes actifs", value: accountsData.filter(a => a.isActive).length, icon: <FiCreditCard className="text-green-500" />, change: "Sur 6 comptes" },
    { title: "Transactions", value: "56", icon: <FiActivity className="text-indigo-500" />, change: "Derniers 30 jours" },
    { title: "Prochain rapprochement", value: "31/03/2025", icon: <FiCalendar className="text-amber-500" />, change: "Dans 23 jours" }
  ];

  const transactionStatistics = [
    { title: "Entrées du mois", value: "10 250,00 €", icon: <FiArrowDown className="text-green-500" />, change: "+15% vs mois précédent" },
    { title: "Sorties du mois", value: "8 350,25 €", icon: <FiArrowUp className="text-red-500" />, change: "+5% vs mois précédent" },
    { title: "Balance", value: "1 899,75 €", icon: <FiBarChart2 className="text-blue-500" />, change: "+10% vs mois précédent" },
    { title: "À réconcilier", value: "4", icon: <FiCheckCircle className="text-amber-500" />, change: "Transactions" }
  ];

  // Filter options
  const typeOptions = ['Tous', 'Courant', 'Épargne', 'Carte', 'Prêt'];
  const categorieOptions = ['Tous', 'Professionnel', 'International', 'Crédit'];
  const statutOptions = ['Tous', 'Actif', 'Inactif'];
  // const deviseOptions = ['EUR', 'USD', 'GBP', 'CHF'];

  const transactionTypeOptions = ['Tous', 'Crédit', 'Débit'];
  const transactionStatutOptions = ['Tous', 'Confirmé', 'En attente', 'Prévu'];
  const categoriesTransactionOptions = ['Tous', 'Ventes', 'Loyer', 'Logiciels', 'Transfert', 'Équipement', 'Emprunt', 'Fournitures', 'Taxes', 'Salaires'];
  // const dateRangeOptions = ['Tous', '7 derniers jours', '30 derniers jours', 'Ce mois', 'Mois précédent', 'Trimestre en cours'];

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Set active account
  const setActiveAccountHandler = (id : string) => {
    setSelectedAccount(id === selectedAccount ? null : id);
    setSelectedTransaction(null);
  };

  // Set active transaction
  const setActiveTransactionHandler = (id : string) => {
    setSelectedTransaction(id === selectedTransaction ? null : id);
  };

  // Toggle reconciliation mode
  // const toggleReconciliationMode = () => {
  //   setReconciliationMode(!reconciliationMode);
  // };

  // Get account by ID
  // const getAccountById = (id) => {
  //   return accountsData.find(account => account.id === id);
  // };

  // Get filtered accounts
  const getFilteredAccounts = () => {
    return accountsData.filter(account => {
      const matchesSearch = 
        searchTerm === '' || 
        account.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.banque.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.numero.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'Tous' || account.type === typeFilter;
      const matchesCategory = categoryFilter === 'Tous' || account.categorie === categoryFilter;
      const matchesStatus = statusFilter === 'Tous' || 
        (statusFilter === 'Actif' && account.isActive) || 
        (statusFilter === 'Inactif' && !account.isActive);
      
      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    // First filter by selected account if any
    const accountFiltered = selectedAccount 
      ? transactionsData.filter(transaction => transaction.compte === selectedAccount)
      : transactionsData;
    
    // Then apply other filters
    return accountFiltered.filter(transaction => {
      const matchesSearch = 
        searchTerm === '' || 
        transaction.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.tiers.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'Tous' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'Tous' || transaction.statut === statusFilter;
      const matchesCategory = categoryFilter === 'Tous' || transaction.categorie === categoryFilter;
      
      // Date filtering - simplified for this example
      const matchesDate = dateRangeFilter === 'Tous' || true;
      
      return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesDate;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('Tous');
    setStatusFilter('Tous');
    setCategoryFilter('Tous');
    setDateRangeFilter('Tous');
  };

  // Mark transaction as reconciled
  const toggleReconciled = (id : string) => {
    setTransactionsData(
      transactionsData.map(transaction => 
        transaction.id === id ? { ...transaction, rapproche: !transaction.rapproche } : transaction
      )
    );
  };

  // Get status color
  const getStatusColor = (isActive: boolean): string => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Get transaction status color
  const getTransactionStatusColor = (statut:string) => {
    switch(statut) {
      case 'Confirmé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Prévu':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type:string) => {
    return type === 'Crédit' ? 'text-green-600' : 'text-red-600';
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
              Banque
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos comptes bancaires et suivez vos transactions
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiCreditCard className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'comptes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('comptes');
                setSelectedAccount(null);
                setSelectedTransaction(null);
                setReconciliationMode(false);
              }}
            >
              Comptes
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'transactions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('transactions');
                setSelectedTransaction(null);
                setReconciliationMode(false);
              }}
            >
              Transactions
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'rapprochement' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('rapprochement');
                setSelectedTransaction(null);
                setReconciliationMode(true);
              }}
            >
              Rapprochement
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setSelectedAccount(null);
                setSelectedTransaction(null);
                setReconciliationMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for Comptes tab */}
          {activeTab === 'comptes' && (
            <div className="p-6">
              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {compteStatistics.map((stat, index) => (
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
                    placeholder="Rechercher un compte..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Ajouter un compte</span>
                  </button>
                  <button 
                    onClick={toggleFilters}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    <FiFilter />
                    <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                    <FiRefreshCw />
                    <span className="hidden md:inline">Actualiser</span>
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
                        Type de compte
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        {typeOptions.map((option, index) => (
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
                        {categorieOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
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

              {/* Accounts List */}
              <div className="space-y-4">
                {getFilteredAccounts().map(account => (
                  <div 
                    key={account.id} 
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer flex justify-between items-center ${selectedAccount === account.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveAccountHandler(account.id)}
                  >
                    <div>
                      <h3 className="text-lg font-bold">{account.nom}</h3>
                      <p className="text-sm text-gray-500">{account.numero}</p>
                    </div>
                    <div className={`px-2 py-1 rounded ${getStatusColor(account.isActive)}`}>
                      {account.isActive ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Transactions tab */}
          {activeTab === 'transactions' && (
            <div className="p-6">
              {/* Transaction Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {transactionStatistics.map((stat, index) => (
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
                    placeholder="Rechercher une transaction..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    <FiPlus />
                    <span>Ajouter une transaction</span>
                  </button>
                  <button 
                    onClick={toggleFilters}
                    className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    <FiFilter />
                    <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                    <FiRefreshCw />
                    <span className="hidden md:inline">Actualiser</span>
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
                        Type de transaction
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        {transactionTypeOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {transactionStatutOptions.map((option, index) => (
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
                        {categoriesTransactionOptions.map((option, index) => (
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

              {/* Transactions List */}
              <div className="space-y-4">
                {getFilteredTransactions().map(transaction => (
                  <div 
                    key={transaction.id} 
                    className={`p-4 bg-white rounded-lg shadow border cursor-pointer flex flex-col ${selectedTransaction === transaction.id ? 'border-indigo-500' : 'border-gray-200'}`}
                    onClick={() => setActiveTransactionHandler(transaction.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{transaction.libelle}</h3>
                      <span className={`px-2 py-1 rounded ${getTransactionStatusColor(transaction.statut)}`}>
                        {transaction.statut}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`font-bold ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type === 'Crédit' ? '+' : '-'}{Math.abs(transaction.montant).toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-sm text-gray-500">{transaction.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Rapprochement tab */}
          {activeTab === 'rapprochement' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Rapprochement</h2>
              <p className="mb-4">Liste des transactions à rapprocher :</p>
              <div className="space-y-4">
                {getFilteredTransactions().filter(t => !t.rapproche).map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="p-4 bg-white rounded-lg shadow border flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{transaction.libelle}</h3>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <button 
                      onClick={() => toggleReconciled(transaction.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Marquer comme rapproché
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Paramètres tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <p>Options de configuration de l&apos;application.</p>
              {/* Additional settings can be added here */}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
