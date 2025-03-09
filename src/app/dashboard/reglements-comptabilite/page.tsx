'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
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
  // FiCreditCard,
  FiClock,
  // FiUser,
  FiCalendar,
  FiRefreshCw,
  FiFile,
  // FiLink,
  FiCheckCircle,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  // FiCheck,
  // FiX
} from 'react-icons/fi';

export default function ReglementsComptabilite() {
  // State for active tab, filters, and search
  const [activeTab, setActiveTab] = useState('reglements');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  const [selectedClient, setSelectedClient] = useState('Tous');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tous');
  
  // State for selected payments (for bulk actions)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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
      notes: 'Paiement reçu pour facture complète'
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
      notes: 'Chèque en cours de traitement'
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
      notes: 'Paiement par carte bancaire réussi'
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
      notes: 'Virement reçu le 24/02/2025'
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
      notes: 'Premier versement de 50% reçu'
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
      notes: 'Second versement planifié pour le 15/03/2025'
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
      notes: 'Paiement complet reçu'
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
      notes: 'Prélèvement automatique effectué'
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
      notes: 'Chèque rejeté pour provision insuffisante'
    }
  ];

  // Sample accounting entries data
  const accountingData = [
    {
      id: 'ECR-2025-001',
      date: '05/03/2025',
      libelle: 'Facture FACT-2025-001',
      type: 'Vente',
      debit: '0,00 €',
      credit: '15 600,00 €',
      compte: '706000',
      pieceComptable: 'FACT-2025-001',
      statut: 'Validé',
      creePar: 'Jean Martin'
    },
    {
      id: 'ECR-2025-002',
      date: '05/03/2025',
      libelle: 'Règlement facture FACT-2025-001',
      type: 'Règlement',
      debit: '15 600,00 €',
      credit: '0,00 €',
      compte: '512000',
      pieceComptable: 'PAY-2025-001',
      statut: 'Validé',
      creePar: 'Jean Martin'
    },
    {
      id: 'ECR-2025-003',
      date: '01/03/2025',
      libelle: 'Facture FACT-2025-002',
      type: 'Vente',
      debit: '0,00 €',
      credit: '2 990,00 €',
      compte: '706000',
      pieceComptable: 'FACT-2025-002',
      statut: 'Validé',
      creePar: 'Sophie Leclerc'
    },
    {
      id: 'ECR-2025-004',
      date: '28/02/2025',
      libelle: 'Facture FACT-2025-003',
      type: 'Vente',
      debit: '0,00 €',
      credit: '4 990,00 €',
      compte: '706000',
      pieceComptable: 'FACT-2025-003',
      statut: 'Validé',
      creePar: 'Thomas Bernard'
    },
    {
      id: 'ECR-2025-005',
      date: '28/02/2025',
      libelle: 'Règlement facture FACT-2025-003',
      type: 'Règlement',
      debit: '4 990,00 €',
      credit: '0,00 €',
      compte: '512000',
      pieceComptable: 'PAY-2025-003',
      statut: 'Validé',
      creePar: 'Thomas Bernard'
    },
    {
      id: 'ECR-2025-006',
      date: '25/02/2025',
      libelle: 'Facture FACT-2025-004',
      type: 'Vente',
      debit: '0,00 €',
      credit: '3 500,00 €',
      compte: '706000',
      pieceComptable: 'FACT-2025-004',
      statut: 'Validé',
      creePar: 'Marie Dupont'
    },
    {
      id: 'ECR-2025-007',
      date: '25/02/2025',
      libelle: 'Règlement facture FACT-2025-004',
      type: 'Règlement',
      debit: '3 500,00 €',
      credit: '0,00 €',
      compte: '512000',
      pieceComptable: 'PAY-2025-004',
      statut: 'Validé',
      creePar: 'Marie Dupont'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'Validé', 'En attente', 'Planifié', 'Rejeté'];
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
  const accountingTypeOptions = ['Tous', 'Vente', 'Règlement', 'Avoir', 'Frais'];

  // Statistics
  const paymentStatistics = [
    { title: "Total reçu", value: "53 155,00 €", icon: <FiArrowDown className="text-green-500" />, change: "+15% ce mois" },
    { title: "En attente", value: "9 365,00 €", icon: <FiClock className="text-amber-500" />, change: "-5% ce mois" },
    { title: "Taux de recouvrement", value: "92%", icon: <FiBarChart2 className="text-blue-500" />, change: "+2% ce mois" },
    { title: "Délai moyen", value: "12 jours", icon: <FiCalendar className="text-purple-500" />, change: "-3 jours ce mois" }
  ];

  const accountingStatistics = [
    { title: "Total crédit", value: "72 530,00 €", icon: <FiArrowUp className="text-blue-500" />, change: "+12% ce mois" },
    { title: "Total débit", value: "53 155,00 €", icon: <FiArrowDown className="text-red-500" />, change: "+15% ce mois" },
    { title: "Balance", value: "19 375,00 €", icon: <FiDollarSign className="text-green-500" />, change: "+8% ce mois" },
    { title: "Écritures", value: "54", icon: <FiFile className="text-indigo-500" />, change: "+8 ce mois" }
  ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'reglements') {
        setSelectedPayments(filteredPayments.map(payment => payment.id));
      } else {
        setSelectedPayments(filteredAccountingEntries.map(entry => entry.id));
      }
    } else {
      setSelectedPayments([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectItem = (itemId: string): void => {
    if (selectedPayments.includes(itemId)) {
      setSelectedPayments(selectedPayments.filter(id => id !== itemId));
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

  // Filter accounting entries based on search and filter criteria
  const filteredAccountingEntries = accountingData.filter(entry => {
    const matchesSearch = 
      searchTerm === '' || 
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pieceComptable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'Tous' || entry.statut === selectedStatus;
    
    // For the "Comptabilité" tab, we used `selectedPaymentMethod` to store the 'type' filter
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
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Validé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Planifié':
        return 'bg-blue-100 text-blue-800';
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
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
              Règlements & Comptabilité
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos règlements clients et votre comptabilité
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiDollarSign className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'reglements' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('reglements');
                setSelectedPayments([]);
                setSelectAll(false);
              }}
            >
              Règlements
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'comptabilite' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('comptabilite');
                setSelectedPayments([]);
                setSelectAll(false);
              }}
            >
              Comptabilité
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {(activeTab === 'reglements' ? paymentStatistics : accountingStatistics).map((stat, index) => (
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
                  placeholder={`Rechercher ${activeTab === 'reglements' ? 'un règlement' : 'une écriture'}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                  <FiPlus />
                  <span>{activeTab === 'reglements' ? 'Ajouter un règlement' : 'Ajouter une écriture'}</span>
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  <FiFilter />
                  <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                  <FiRefreshCw />
                  <span className="hidden md:inline">Actualiser</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                  <FiDownload />
                  <span className="hidden md:inline">Exporter</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mt-4 p-4 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
                          Type d&apos;écriture
                        </label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedPaymentMethod}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        >
                          {accountingTypeOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compte
                        </label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option>Tous</option>
                          <option>706000 - Prestations de services</option>
                          <option>512000 - Banque</option>
                          <option>411000 - Clients</option>
                          <option>445660 - TVA déductible</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={resetFilters}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                  >
                    Réinitialiser
                  </button>
                  <button 
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bulk Actions (visible when items are selected) */}
          {selectedPayments.length > 0 && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div className="text-indigo-800">
                  <span className="font-medium">{selectedPayments.length}</span>{' '}
                  {activeTab === 'reglements' ? 'règlement(s)' : 'écriture(s)'} sélectionné(s)
                </div>
                <div className="flex space-x-2">
                  {activeTab === 'reglements' && (
                    <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-1">
                      <FiCheckCircle />
                      <span>Valider</span>
                    </button>
                  )}
                  <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center space-x-1">
                    <FiDownload />
                    <span>Exporter</span>
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center space-x-1">
                    <FiTrash2 />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          <div className="px-6 pb-6">
            {/* Payments Tab */}
            {activeTab === 'reglements' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
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
                            {payment.client}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
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
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {payment.facture}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {payment.notes}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <FiEye />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-indigo-600">
                                <FiEdit />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <FiTrash2 />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <FiMoreVertical />
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

            {/* Accounting Tab */}
            {activeTab === 'comptabilite' && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                          N° écriture
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Libellé
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compte
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Débit
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Crédit
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAccountingEntries.map((entry) => (
                        <tr key={entry.id}>
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
                            {entry.libelle}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {entry.type}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {entry.compte}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {entry.debit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                            {entry.credit}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.statut)}`}
                            >
                              {entry.statut}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <FiEye />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-indigo-600">
                                <FiEdit />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <FiTrash2 />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <FiMoreVertical />
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
        </div>
      </div>
    </motion.div>
  );
}
