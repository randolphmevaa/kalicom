'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPercent, 
  // FiEdit, 
  FiPlus,
  // FiTrash2,
  FiCheckCircle,
  FiX,
  FiAlertTriangle,
  FiInfo,
  FiGlobe,
  // FiSettings,
  FiRefreshCw,
  FiHelpCircle,
  // FiChevronDown,
  // FiChevronUp,
  // FiArrowRight,
  // FiArrowLeft,
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiTag,
  // FiCheckSquare,
  FiFileText,
  // FiBarChart2,
  // FiSave,
  // FiList,
  // FiActivity,
  // FiPieChart,
  // FiFlag
} from 'react-icons/fi';

export default function Taxes() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('tva');
  const [activeTaxId, setActiveTaxId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [ , setEditMode] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  
  // Sample TVA data
  const [tvaData, setTvaData] = useState([
    {
      id: 'TVA-001',
      taux: 20,
      nom: 'TVA Standard',
      description: 'Taux standard applicable à la majorité des biens et services',
      codeComptable: '445710',
      type: 'Collectée',
      region: 'France',
      isDefault: true,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Taux standard française',
      historique: [
        { date: '01/01/2014', action: 'Modification taux', valeur: '20%', ancienneValeur: '19.6%' }
      ]
    },
    {
      id: 'TVA-002',
      taux: 10,
      nom: 'TVA Intermédiaire',
      description: 'Taux intermédiaire pour la restauration, transports, etc.',
      codeComptable: '445711',
      type: 'Collectée',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Applicable notamment aux travaux de rénovation, restauration, hôtellerie',
      historique: [
        { date: '01/01/2014', action: 'Création', valeur: '10%', ancienneValeur: '-' }
      ]
    },
    {
      id: 'TVA-003',
      taux: 5.5,
      nom: 'TVA Réduite',
      description: 'Taux réduit pour les produits de première nécessité',
      codeComptable: '445712',
      type: 'Collectée',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Applicable aux produits alimentaires, livres, etc.',
      historique: [
        { date: '01/07/2012', action: 'Modification taux', valeur: '5.5%', ancienneValeur: '5.5%' },
        { date: '01/01/2012', action: 'Modification taux', valeur: '7%', ancienneValeur: '5.5%' },
        { date: '01/07/2009', action: 'Création', valeur: '5.5%', ancienneValeur: '-' }
      ]
    },
    {
      id: 'TVA-004',
      taux: 2.1,
      nom: 'TVA Super réduite',
      description: 'Taux super réduit pour certains biens et services spécifiques',
      codeComptable: '445713',
      type: 'Collectée',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Applicable aux médicaments remboursables par la sécurité sociale, certaines publications de presse',
      historique: [
        { date: '01/01/1989', action: 'Création', valeur: '2.1%', ancienneValeur: '-' }
      ]
    },
    {
      id: 'TVA-005',
      taux: 0,
      nom: 'Exonération de TVA',
      description: 'Pas de TVA applicable',
      codeComptable: '445714',
      type: 'Exonération',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Pour les opérations exonérées de TVA (export, livraisons intracommunautaires, etc.)',
      historique: []
    },
    {
      id: 'TVA-006',
      taux: 21,
      nom: 'TVA Standard Belgique',
      description: 'Taux standard applicable en Belgique',
      codeComptable: '445720',
      type: 'Collectée',
      region: 'Belgique',
      isDefault: false,
      isActive: true,
      dateCreation: '01/06/2021',
      dateMaj: '01/01/2025',
      notes: 'Pour les ventes en Belgique',
      historique: [
        { date: '01/01/2021', action: 'Création', valeur: '21%', ancienneValeur: '-' }
      ]
    },
    {
      id: 'TVA-007',
      taux: 19,
      nom: 'TVA Standard Allemagne',
      description: 'Taux standard applicable en Allemagne',
      codeComptable: '445721',
      type: 'Collectée',
      region: 'Allemagne',
      isDefault: false,
      isActive: true,
      dateCreation: '01/06/2021',
      dateMaj: '01/01/2025',
      notes: 'Pour les ventes en Allemagne',
      historique: [
        { date: '01/01/2021', action: 'Création', valeur: '19%', ancienneValeur: '-' }
      ]
    }
  ]);

  // Sample other taxes data
  const [otherTaxesData, setOtherTaxesData] = useState([
    {
      id: 'TAX-001',
      taux: 0.10,
      nom: 'Contribution à la formation professionnelle',
      description: 'Contribution pour la formation professionnelle',
      codeComptable: '6313',
      type: 'Taxe sur revenus',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Pour les indépendants et micro-entrepreneurs',
      periodicite: 'Annuelle',
      dateEcheance: '15/01',
      baseCalcul: "Chiffre d'affaires"
    },
    {
      id: 'TAX-002',
      taux: 2.2,
      nom: "Taxe d'apprentissage",
      description: 'Taxe pour financer les formations en alternance',
      codeComptable: '6314',
      type: 'Taxe sur salaires',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: "Pour les entreprises soumises à l'impôt sur les sociétés",
      periodicite: 'Annuelle',
      dateEcheance: '01/03',
      baseCalcul: 'Masse salariale'
    },
    {
      id: 'TAX-003',
      taux: 0.3,
      nom: 'Contribution économique territoriale',
      description: 'Ancienne taxe professionnelle',
      codeComptable: '6315',
      type: 'Taxe locale',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Composée de la CFE et de la CVAE',
      periodicite: 'Annuelle',
      dateEcheance: '15/12',
      baseCalcul: 'Valeur ajoutée'
    },
    {
      id: 'TAX-004',
      taux: 1.5,
      nom: 'Taxe sur les surfaces commerciales',
      description: 'Taxe sur les commerces de détail',
      codeComptable: '6316',
      type: 'Taxe locale',
      region: 'France',
      isDefault: false,
      isActive: true,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Pour les surfaces de vente > 400m²',
      periodicite: 'Annuelle',
      dateEcheance: '15/06',
      baseCalcul: 'Surface commerciale'
    },
    {
      id: 'TAX-005',
      taux: 5.5,
      nom: 'Contribution sociale de solidarité',
      description: 'Financement de la sécurité sociale',
      codeComptable: '6317',
      type: 'Cotisation sociale',
      region: 'France',
      isDefault: false,
      isActive: false,
      dateCreation: '01/01/2020',
      dateMaj: '01/01/2025',
      notes: 'Pour les sociétés dont le CA > 19M€',
      periodicite: 'Annuelle',
      dateEcheance: '15/05',
      baseCalcul: "Chiffre d'affaires"
    }
  ]);

  // Settings data
  const [settingsData, setSettingsData] = useState({
    tvaDefaultCountry: 'France',
    defaultTvaRate: 20,
    automaticVatCalculation: true,
    showTaxesOnDocuments: true,
    roundingMethod: 'Standard',
    displayTaxDetailsOnInvoices: true,
    taxReportingPeriod: 'Mensuelle',
    vatNumberRequired: true,
    autoUpdateRates: true
  });

  // Statistics
  const tvaStatistics = [
    { title: "Taux actifs", value: tvaData.filter(item => item.isActive).length, icon: <FiCheckCircle className="text-green-500" /> },
    { title: "Taux standard", value: "20%", icon: <FiPercent className="text-blue-500" /> },
    { title: "Pays configurés", value: Array.from(new Set(tvaData.map(item => item.region))).length, icon: <FiGlobe className="text-indigo-500" /> },
    { title: "Mise à jour", value: "01/01/2025", icon: <FiRefreshCw className="text-amber-500" /> }
  ];

  const otherTaxesStatistics = [
    { title: "Taxes actives", value: otherTaxesData.filter(item => item.isActive).length, icon: <FiCheckCircle className="text-green-500" /> },
    { title: "Types de taxes", value: Array.from(new Set(otherTaxesData.map(item => item.type))).length, icon: <FiTag className="text-blue-500" /> },
    { title: "Prochaine échéance", value: "15/01/2025", icon: <FiCalendar className="text-indigo-500" /> },
    { title: "Taxes périodiques", value: otherTaxesData.filter(item => item.periodicite).length, icon: <FiClock className="text-amber-500" /> }
  ];

  const reportsStatistics = [
    { title: "Déclarations en attente", value: "1", icon: <FiAlertTriangle className="text-amber-500" /> },
    { title: "Dernière déclaration", value: "T4 2024", icon: <FiFileText className="text-blue-500" /> },
    { title: "Périodicité", value: "Trimestrielle", icon: <FiCalendar className="text-indigo-500" /> },
    { title: "TVA due - T1 2025", value: "14,250 €", icon: <FiDollarSign className="text-green-500" /> }
  ];

  // Filter options
  const regionOptions = ['Tous', 'France', 'Belgique', 'Allemagne', 'Espagne', 'Italie', 'Royaume-Uni', 'Autre'];
  const typeOptions = ['Tous', 'Collectée', 'Déductible', 'Exonération', 'Taxe sur revenus', 'Taxe sur salaires', 'Taxe locale', 'Cotisation sociale'];
  const statusOptions = ['Tous', 'Actif', 'Inactif'];

  // Toggle help box
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Set active tax
  const setActiveTaxHandler = (id: string) => {
    if (activeTaxId === id) {
      setActiveTaxId(null);
    } else {
      setActiveTaxId(id);
      setEditMode(false);
    }
  };
  

  // Toggle active status
  const toggleActive = (id: string) => {
    if (activeTab === 'tva') {
      setTvaData(
        tvaData.map(item => 
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    } else if (activeTab === 'autres') {
      setOtherTaxesData(
        otherTaxesData.map(item => 
          item.id === id ? { ...item, isActive: !item.isActive } : item
        )
      );
    }
  };

  // Set as default TVA rate
  // const setAsDefault = (id) => {
  //   setTvaData(
  //     tvaData.map(item => 
  //       item.id === id ? { ...item, isDefault: true } : { ...item, isDefault: false }
  //     )
  //   );
  // };

  // Get active tax data based on tab
  const getActiveTaxData = () => {
    if(activeTab === 'tva') return tvaData;
    else if(activeTab === 'autres') return otherTaxesData;
    else return [];
  };

  // Filter taxes based on search and filter criteria
  const filteredTaxes = getActiveTaxData().filter(tax => {
    const matchesSearch = 
      searchTerm === '' || 
      tax.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tax.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tax.notes && tax.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRegion = selectedRegion === 'Tous' || tax.region === selectedRegion;
    const matchesType = selectedType === 'Tous' || tax.type === selectedType;
    const matchesStatus = selectedStatus === 'Tous' || 
      (selectedStatus === 'Actif' && tax.isActive) || 
      (selectedStatus === 'Inactif' && !tax.isActive);
    
    return matchesSearch && matchesRegion && matchesType && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('Tous');
    setSelectedType('Tous');
    setSelectedStatus('Tous');
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
              Taxes
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos taux de TVA et autres taxes applicables
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
                activeTab === 'tva' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('tva');
                setActiveTaxId(null);
                setEditMode(false);
              }}
            >
              TVA
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'autres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('autres');
                setActiveTaxId(null);
                setEditMode(false);
              }}
            >
              Autres taxes
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'rapports' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('rapports');
                setActiveTaxId(null);
                setEditMode(false);
              }}
            >
              Rapports
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'parametres' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('parametres');
                setActiveTaxId(null);
                setEditMode(false);
              }}
            >
              Paramètres
            </button>
          </div>

          {/* Content for TVA and Autres taxes tabs */}
          {(activeTab === 'tva' || activeTab === 'autres') && (
            <>
              {/* Statistics */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {(activeTab === 'tva' ? tvaStatistics : otherTaxesStatistics).map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help box for TVA */}
              {activeTab === 'tva' && showHelp && (
                <div className="mx-6 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">À propos de la TVA</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            La Taxe sur la Valeur Ajoutée (TVA) est un impôt indirect sur la consommation :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>En France, il existe 4 taux principaux : 20% (normal), 10% (intermédiaire), 5,5% (réduit) et 2,1% (particulier)</li>
                            <li>Les taux peuvent varier selon les pays de l&apos;Union Européenne</li>
                            <li>Certaines activités sont exonérées de TVA (santé, enseignement, etc.)</li>
                            <li>Vérifiez régulièrement les mises à jour des taux qui peuvent changer</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={toggleHelp}
                          className="inline-flex rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Help box for other taxes */}
              {activeTab === 'autres' && showHelp && (
                <div className="mx-6 mt-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Autres taxes et contributions</h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            En plus de la TVA, votre entreprise peut être soumise à d&apos;autres taxes :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Contribution à la formation professionnelle (CFP)</li>
                            <li>Taxe d&apos;apprentissage</li>
                            <li>Contribution économique territoriale (CET)</li>
                            <li>Taxes spécifiques à votre secteur d&apos;activité</li>
                            <li>N&apos;oubliez pas de vérifier les échéances de déclaration et paiement</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={toggleHelp}
                          className="inline-flex rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions & Search Bar */}
              <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  {/* Search */}
                  <div className="w-full md:w-72 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={`Rechercher ${activeTab === 'tva' ? 'un taux de TVA' : 'une taxe'}...`}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                      <FiPlus />
                      <span>{activeTab === 'tva' ? 'Ajouter un taux de TVA' : 'Ajouter une taxe'}</span>
                    </button>
                    <button 
                      onClick={toggleFilters}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                    >
                      <FiFilter />
                      <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                    </button>
                    <button 
                      onClick={toggleHelp}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                    >
                      <FiHelpCircle />
                      <span className="hidden md:inline">{showHelp ? 'Masquer l\'aide' : 'Afficher l\'aide'}</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Région
                        </label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                          {regionOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select 
                          className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                        >
                          {typeOptions.map((option, index) => (
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
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          {statusOptions.map((option, index) => (
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
              </div>

              {/* List of Taxes */}
              <div className="px-6 py-4">
                {filteredTaxes.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTaxes.map((tax) => (
                      <div key={tax.id} className="p-4 bg-white rounded-lg shadow border flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold">{tax.nom}</h4>
                          <p className="text-sm text-gray-500">{tax.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setActiveTaxHandler(tax.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                          >
                            Détails
                          </button>
                          <button 
                            onClick={() => toggleActive(tax.id)}
                            className={`px-3 py-1 rounded transition ${tax.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {tax.isActive ? 'Actif' : 'Inactif'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun résultat trouvé.</p>
                )}
              </div>
            </>
          )}

          {/* Content for Rapports Tab */}
          {activeTab === 'rapports' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Rapports</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {reportsStatistics.map((report, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                        {report.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-500">{report.title}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{report.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content for Paramètres Tab */}
          {activeTab === 'parametres' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Paramètres</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pays par défaut pour la TVA</label>
                  <input 
                    type="text"
                    value={settingsData.tvaDefaultCountry}
                    onChange={(e) => setSettingsData({...settingsData, tvaDefaultCountry: e.target.value})}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taux de TVA par défaut</label>
                  <input 
                    type="number"
                    value={settingsData.defaultTvaRate}
                    onChange={(e) => setSettingsData({...settingsData, defaultTvaRate: parseFloat(e.target.value)})}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      checked={settingsData.automaticVatCalculation}
                      onChange={(e) => setSettingsData({...settingsData, automaticVatCalculation: e.target.checked})}
                      className="mr-2"
                    />
                    Calcul automatique de la TVA
                  </label>
                </div>
                {/* You can add additional settings here */}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
