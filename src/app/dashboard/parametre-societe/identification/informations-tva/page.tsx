'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPercent, 
  FiSearch, 
  FiFilter, 
  // FiPlus, 
  // FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  // FiDownload,
  // FiUpload,
  FiCalendar,
  // FiClock,
  // FiRefreshCw,
  // FiCheckCircle,
  // FiAlertTriangle,
  FiBarChart2,
  FiArrowUp,
  FiArrowDown,
  FiDollarSign,
  FiFileText,
  FiSettings,
  // FiArchive,
  // FiChevronDown,
  // FiChevronUp,
  // FiPrinter,
  // FiSend,
  // FiUser,
  // FiLink,
  FiExternalLink,
  // FiCheckSquare,
  // FiXCircle,
  // FiInfoAlt,
  FiInfo,
  // FiGlobe,
  // FiLink2
} from 'react-icons/fi';

export default function InformationsTVA() {
  // State for active tab, filters, and search
  const [activeTab, setActiveTab] = useState('declarations');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');
  
  // State for selected declarations (for bulk actions)
  const [selectedDeclarations, setSelectedDeclarations] = useState<string[]>([]);

  const [selectAll, setSelectAll] = useState(false);

  // Récapitulatif TVA state
  const [tvaRecap ] = useState({
    regime: 'Réel normal',
    periodicite: 'Mensuelle',
    dateProchaine: '15/04/2025',
    periodeProchaine: 'Mars 2025',
    derniereDeclaration: 'Février 2025',
    montantDerniereDeclaration: '3 890,00 €',
    creditTVA: false,
    montantCreditTVA: '0,00 €',
    tauxPrincipal: '20%',
    tauxIntermediaire: '10%',
    tauxReduit: '5.5%',
    tauxParticulier: '2.1%'
  });

  // Sample TVA declarations data
  const tvaDeclarationsData = [
    {
      id: 'TVA-2025-003',
      periode: 'Mars 2025',
      dateDeclaration: 'À venir',
      dateEcheance: '15/04/2025',
      statut: 'À préparer',
      montantDu: 'Non calculé',
      montantCollecte: 'Non calculé',
      montantDeductible: 'Non calculé',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: '-',
      validePar: '-',
      notes: 'À préparer à partir du 01/04/2025'
    },
    {
      id: 'TVA-2025-002',
      periode: 'Février 2025',
      dateDeclaration: '10/03/2025',
      dateEcheance: '15/03/2025',
      statut: 'En cours',
      montantDu: '3 890,00 €',
      montantCollecte: '12 765,00 €',
      montantDeductible: '8 875,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: '-',
      notes: 'À finaliser avant le 15/03/2025'
    },
    {
      id: 'TVA-2025-001',
      periode: 'Janvier 2025',
      dateDeclaration: '10/02/2025',
      dateEcheance: '15/02/2025',
      statut: 'Soumis',
      montantDu: '4 320,00 €',
      montantCollecte: '14 250,00 €',
      montantDeductible: '9 930,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/02/2025'
    },
    {
      id: 'TVA-2024-012',
      periode: 'Décembre 2024',
      dateDeclaration: '12/01/2025',
      dateEcheance: '15/01/2025',
      statut: 'Soumis',
      montantDu: '6 150,00 €',
      montantCollecte: '18 900,00 €',
      montantDeductible: '12 750,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 15/01/2025'
    },
    {
      id: 'TVA-2024-011',
      periode: 'Novembre 2024',
      dateDeclaration: '10/12/2024',
      dateEcheance: '15/12/2024',
      statut: 'Soumis',
      montantDu: '3 780,00 €',
      montantCollecte: '11 250,00 €',
      montantDeductible: '7 470,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/12/2024'
    },
    {
      id: 'TVA-2024-010',
      periode: 'Octobre 2024',
      dateDeclaration: '12/11/2024',
      dateEcheance: '15/11/2024',
      statut: 'Soumis',
      montantDu: '4 560,00 €',
      montantCollecte: '13 950,00 €',
      montantDeductible: '9 390,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/11/2024'
    },
    {
      id: 'TVA-2024-009',
      periode: 'Septembre 2024',
      dateDeclaration: '10/10/2024',
      dateEcheance: '15/10/2024',
      statut: 'Soumis',
      montantDu: '3 980,00 €',
      montantCollecte: '12.500,00 €',
      montantDeductible: '8.520,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/10/2024'
    },
    {
      id: 'TVA-2024-008',
      periode: 'Août 2024',
      dateDeclaration: '12/09/2024',
      dateEcheance: '15/09/2024',
      statut: 'Soumis',
      montantDu: '2 850,00 €',
      montantCollecte: '9 750,00 €',
      montantDeductible: '6 900,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/09/2024'
    },
    {
      id: 'TVA-2024-007',
      periode: 'Juillet 2024',
      dateDeclaration: '10/08/2024',
      dateEcheance: '15/08/2024',
      statut: 'Soumis',
      montantDu: '3 450,00 €',
      montantCollecte: '11 250,00 €',
      montantDeductible: '7 800,00 €',
      typeDeclaration: 'CA3',
      modeDepot: 'EDI',
      preparePar: 'Marie Comptable',
      validePar: 'Jean Directeur',
      notes: 'Paiement effectué le 14/08/2024'
    }
  ];

  // Sample TVA accounts data
  const tvaAccountsData = [
    {
      id: 'CMP-44571',
      compte: '44571',
      libelle: 'TVA collectée',
      solde: '12 765,00 €',
      typeSolde: 'Créditeur',
      derniereOperation: '28/02/2025',
      notes: 'TVA collectée pour la période en cours'
    },
    {
      id: 'CMP-44566',
      compte: '44566',
      libelle: 'TVA déductible sur biens et services',
      solde: '8 875,00 €',
      typeSolde: 'Débiteur',
      derniereOperation: '28/02/2025',
      notes: 'TVA déductible pour la période en cours'
    },
    {
      id: 'CMP-44567',
      compte: '44567',
      libelle: 'Crédit de TVA à reporter',
      solde: '0,00 €',
      typeSolde: 'Débiteur',
      derniereOperation: '31/12/2024',
      notes: 'Crédit de TVA à reporter sur périodes suivantes'
    },
    {
      id: 'CMP-44551',
      compte: '44551',
      libelle: 'TVA à décaisser',
      solde: '3 890,00 €',
      typeSolde: 'Créditeur',
      derniereOperation: '28/02/2025',
      notes: 'TVA à payer pour la période en cours'
    },
    {
      id: 'CMP-44570',
      compte: '44570',
      libelle: 'TVA collectée par taux',
      solde: '12 765,00 €',
      typeSolde: 'Créditeur',
      derniereOperation: '28/02/2025',
      notes: 'Détail TVA collectée par taux de TVA'
    }
  ];

  // Sample TVA rates data
  const tvaRatesData = [
    {
      id: 'TVR-01',
      taux: '20%',
      libelle: 'Taux normal',
      description: 'Taux applicable à la majorité des biens et services',
      compteCollecte: '445710',
      compteDeductible: '445660',
      actif: true,
      dateMAJ: '01/01/2024'
    },
    {
      id: 'TVR-02',
      taux: '10%',
      libelle: 'Taux intermédiaire',
      description: 'Restauration, transport, travaux de rénovation, etc.',
      compteCollecte: '445712',
      compteDeductible: '445662',
      actif: true,
      dateMAJ: '01/01/2024'
    },
    {
      id: 'TVR-03',
      taux: '5.5%',
      libelle: 'Taux réduit',
      description: 'Produits alimentaires, livres, etc.',
      compteCollecte: '445713',
      compteDeductible: '445663',
      actif: true,
      dateMAJ: '01/01/2024'
    },
    {
      id: 'TVR-04',
      taux: '2.1%',
      libelle: 'Taux particulier',
      description: 'Médicaments remboursables, presse, etc.',
      compteCollecte: '445714',
      compteDeductible: '445664',
      actif: true,
      dateMAJ: '01/01/2024'
    },
    {
      id: 'TVR-05',
      taux: '0%',
      libelle: 'Exonération',
      description: 'Opérations exonérées de TVA',
      compteCollecte: '445715',
      compteDeductible: '445665',
      actif: true,
      dateMAJ: '01/01/2024'
    }
  ];

  // Filter options
  const statusOptions = ['Tous', 'À préparer', 'En cours', 'Soumis', 'En retard'];
  const periodOptions = ['Tous', 'Ce mois', 'Mois dernier', 'Ce trimestre', 'Cette année', 'Année précédente'];
  const typeOptions = ['Tous', 'CA3', 'CA12'];

  // Statistics for recap
  const tvaStatistics = [
    { title: "Prochaine échéance", value: "15/04/2025", icon: <FiCalendar className="text-blue-500" />, change: "Mars 2025" },
    { title: "TVA collectée", value: "12 765,00 €", icon: <FiArrowDown className="text-green-500" />, change: "+5% vs mois précédent" },
    { title: "TVA déductible", value: "8 875,00 €", icon: <FiArrowUp className="text-red-500" />, change: "+3% vs mois précédent" },
    { title: "Solde à payer", value: "3 890,00 €", icon: <FiDollarSign className="text-purple-500" />, change: "+10% vs mois précédent" }
  ];

  // const tvaCompteStatistics = [
  //   { title: "Total TVA collectée", value: "12 765,00 €", icon: <FiBarChart2 className="text-green-500" />, change: "Période en cours" },
  //   { title: "Total TVA déductible", value: "8 875,00 €", icon: <FiBarChart2 className="text-amber-500" />, change: "Période en cours" },
  //   { title: "Solde TVA", value: "3 890,00 €", icon: <FiDollarSign className="text-blue-500" />, change: "À payer" },
  //   { title: "Taux moyen TVA", value: "16.7%", icon: <FiPercent className="text-indigo-500" />, change: "Calculé sur le CA" }
  // ];

  // Handler for toggling all checkboxes
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      if (activeTab === 'declarations') {
        setSelectedDeclarations(filteredDeclarations.map(declaration => declaration.id));
      }
    } else {
      setSelectedDeclarations([]);
    }
  };

  // Handler for toggling individual checkboxes
  const handleSelectItem = (itemId: string) => {
    if (selectedDeclarations.includes(itemId)) {
      setSelectedDeclarations(selectedDeclarations.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedDeclarations([...selectedDeclarations, itemId]);
    }
  };

  // Filter declarations based on search and filter criteria
  const filteredDeclarations = tvaDeclarationsData.filter(declaration => {
    const matchesSearch = 
      searchTerm === '' || 
      declaration.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.periode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      declaration.montantDu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (declaration.notes && declaration.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'Tous' || declaration.statut === selectedStatus;
    const matchesType = selectedType === 'Tous' || declaration.typeDeclaration === selectedType;
    
    // For period filter, actual date logic would be required; simplified here
    const matchesPeriod = selectedPeriod === 'Tous' || true;
    
    return matchesSearch && matchesStatus && matchesType && matchesPeriod;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedType('Tous');
    setSearchTerm('');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch(status) {
      case 'Soumis':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-amber-100 text-amber-800';
      case 'À préparer':
        return 'bg-blue-100 text-blue-800';
      case 'En retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  // Function to format amount values
  const formatMontant = (montant: string): string => {
    if (montant === 'Non calculé') return montant;
    return montant;
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
              Informations TVA
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos déclarations de TVA, comptes et paramètres
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiPercent className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'recap' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('recap');
                setSelectedDeclarations([]);
                setSelectAll(false);
              }}
            >
              Récapitulatif
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'declarations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('declarations');
                setSelectedDeclarations([]);
                setSelectAll(false);
              }}
            >
              Déclarations
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'comptes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('comptes');
                setSelectedDeclarations([]);
                setSelectAll(false);
              }}
            >
              Comptes de TVA
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'taux' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('taux');
                setSelectedDeclarations([]);
                setSelectAll(false);
              }}
            >
              Taux de TVA
            </button>
          </div>

          {/* Recap Tab */}
          {activeTab === 'recap' && (
            <div className="p-6">
              {/* Key Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {tvaStatistics.map((stat, index) => (
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

              {/* TVA Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations générales */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Régime et échéances</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Régime de TVA</span>
                      <span className="font-medium">{tvaRecap.regime}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Périodicité de déclaration</span>
                      <span className="font-medium">{tvaRecap.periodicite}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Prochaine déclaration</span>
                      <div className="flex items-center">
                        <span className="font-medium">{tvaRecap.periodeProchaine}</span>
                        <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Échéance: {tvaRecap.dateProchaine}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Dernière déclaration</span>
                      <div className="flex items-center">
                        <span className="font-medium">{tvaRecap.derniereDeclaration}</span>
                        <div className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                          Montant: {tvaRecap.montantDerniereDeclaration}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Crédit de TVA</span>
                      <span className="font-medium">
                        {tvaRecap.creditTVA ? `Oui (${tvaRecap.montantCreditTVA})` : 'Non'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Taux applicables */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Taux de TVA appliqués</h3>
                    <button className="p-1 text-gray-400 hover:text-indigo-600">
                      <FiEdit />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Taux normal</span>
                      <span className="font-medium">{tvaRecap.tauxPrincipal}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Taux intermédiaire</span>
                      <span className="font-medium">{tvaRecap.tauxIntermediaire}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Taux réduit</span>
                      <span className="font-medium">{tvaRecap.tauxReduit}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Taux particulier</span>
                      <span className="font-medium">{tvaRecap.tauxParticulier}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="flex items-start">
                          <FiInfo className="text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm text-indigo-800">
                            La modification des taux de TVA peut avoir un impact important sur votre comptabilité. 
                            Consultez votre comptable avant de procéder à des changements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center text-center">
                    <div className="p-2 bg-indigo-100 rounded-full mb-2">
                      <FiFileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-800">Nouvelle déclaration</span>
                    <span className="text-xs text-gray-500 mt-1">Créer une déclaration de TVA</span>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center text-center">
                    <div className="p-2 bg-indigo-100 rounded-full mb-2">
                      <FiBarChart2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-800">Rapport TVA</span>
                    <span className="text-xs text-gray-500 mt-1">Générer un rapport détaillé</span>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center text-center">
                    <div className="p-2 bg-indigo-100 rounded-full mb-2">
                      <FiSettings className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-800">Paramètres</span>
                    <span className="text-xs text-gray-500 mt-1">Configurer les règles de TVA</span>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col items-center text-center">
                    <div className="p-2 bg-indigo-100 rounded-full mb-2">
                      <FiExternalLink className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-800">Plus d&apos;actions</span>
                    <span className="text-xs text-gray-500 mt-1">Voir plus d&apos;options</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Declarations Tab */}
          {activeTab === 'declarations' && (
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FiSearch className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher une déclaration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button
                    className="flex items-center space-x-1 p-2 border border-gray-300 rounded-md"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter />
                    <span>Filtres</span>
                  </button>
                  <button
                    className="p-2 border border-gray-300 rounded-md"
                    onClick={resetFilters}
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-600">Statut</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      {statusOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Période</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      {periodOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      {typeOptions.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Declarations Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">
                        <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                      </th>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Période</th>
                      <th className="px-4 py-2 border">Date Déclaration</th>
                      <th className="px-4 py-2 border">Date Échéance</th>
                      <th className="px-4 py-2 border">Statut</th>
                      <th className="px-4 py-2 border">Montant dû</th>
                      <th className="px-4 py-2 border">Montant Collecté</th>
                      <th className="px-4 py-2 border">Montant Déductible</th>
                      <th className="px-4 py-2 border">Type</th>
                      <th className="px-4 py-2 border">Mode Dépôt</th>
                      <th className="px-4 py-2 border">Préparé par</th>
                      <th className="px-4 py-2 border">Validé par</th>
                      <th className="px-4 py-2 border">Notes</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeclarations.map((declaration) => (
                      <tr key={declaration.id} className="text-center">
                        <td className="px-4 py-2 border">
                          <input
                            type="checkbox"
                            checked={selectedDeclarations.includes(declaration.id)}
                            onChange={() => handleSelectItem(declaration.id)}
                          />
                        </td>
                        <td className="px-4 py-2 border">{declaration.id}</td>
                        <td className="px-4 py-2 border">{declaration.periode}</td>
                        <td className="px-4 py-2 border">{declaration.dateDeclaration}</td>
                        <td className="px-4 py-2 border">{declaration.dateEcheance}</td>
                        <td className={`px-4 py-2 border ${getStatusBadgeColor(declaration.statut)}`}>
                          {declaration.statut}
                        </td>
                        <td className="px-4 py-2 border">{formatMontant(declaration.montantDu)}</td>
                        <td className="px-4 py-2 border">{formatMontant(declaration.montantCollecte)}</td>
                        <td className="px-4 py-2 border">{formatMontant(declaration.montantDeductible)}</td>
                        <td className="px-4 py-2 border">{declaration.typeDeclaration}</td>
                        <td className="px-4 py-2 border">{declaration.modeDepot}</td>
                        <td className="px-4 py-2 border">{declaration.preparePar}</td>
                        <td className="px-4 py-2 border">{declaration.validePar}</td>
                        <td className="px-4 py-2 border">{declaration.notes}</td>
                        <td className="px-4 py-2 border space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <FiEye />
                          </button>
                          <button className="text-green-500 hover:text-green-700">
                            <FiEdit />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Comptes Tab */}
          {activeTab === 'comptes' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Comptes de TVA</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Compte</th>
                      <th className="px-4 py-2 border">Libellé</th>
                      <th className="px-4 py-2 border">Solde</th>
                      <th className="px-4 py-2 border">Type Solde</th>
                      <th className="px-4 py-2 border">Dernière Opération</th>
                      <th className="px-4 py-2 border">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvaAccountsData.map((account) => (
                      <tr key={account.id} className="text-center">
                        <td className="px-4 py-2 border">{account.id}</td>
                        <td className="px-4 py-2 border">{account.compte}</td>
                        <td className="px-4 py-2 border">{account.libelle}</td>
                        <td className="px-4 py-2 border">{account.solde}</td>
                        <td className="px-4 py-2 border">{account.typeSolde}</td>
                        <td className="px-4 py-2 border">{account.derniereOperation}</td>
                        <td className="px-4 py-2 border">{account.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Taux Tab */}
          {activeTab === 'taux' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taux de TVA</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">ID</th>
                      <th className="px-4 py-2 border">Taux</th>
                      <th className="px-4 py-2 border">Libellé</th>
                      <th className="px-4 py-2 border">Description</th>
                      <th className="px-4 py-2 border">Compte Collecte</th>
                      <th className="px-4 py-2 border">Compte Déductible</th>
                      <th className="px-4 py-2 border">Actif</th>
                      <th className="px-4 py-2 border">Date MAJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvaRatesData.map((rate) => (
                      <tr key={rate.id} className="text-center">
                        <td className="px-4 py-2 border">{rate.id}</td>
                        <td className="px-4 py-2 border">{rate.taux}</td>
                        <td className="px-4 py-2 border">{rate.libelle}</td>
                        <td className="px-4 py-2 border">{rate.description}</td>
                        <td className="px-4 py-2 border">{rate.compteCollecte}</td>
                        <td className="px-4 py-2 border">{rate.compteDeductible}</td>
                        <td className="px-4 py-2 border">{rate.actif ? 'Oui' : 'Non'}</td>
                        <td className="px-4 py-2 border">{rate.dateMAJ}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
