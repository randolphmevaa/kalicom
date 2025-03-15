'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiMoreVertical, 
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  // FiFileInvoice,
  FiDownload,
  FiChevronDown,
  FiRefreshCw,
  FiAlertCircle,
  // FiArrowRight
} from 'react-icons/fi';

// Define possible tabs
type ActiveTab = 'devis' | 'devises' | 'taxes' | 'societes' | 'produits';

// Define interfaces for each data type
interface Devis {
  description: string;
  societe: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  actif?: boolean;
  pourcentage: string;
  code: string;
  symbole: string;
  nom: string;
  id: number;
  creePar: string;
  sujet: string;
  prospect: string;
  prix: string;
  statut: string;
  creeLe: string;
}

interface Devise {
  id: number;
  nom: string;
  code: string;
  symbole: string;
}

interface Taxe {
  id: number;
  nom: string;
  pourcentage: string;
}

interface Societe {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  actif: boolean;
}

interface Produit {
  id: number;
  nom: string;
  code: string;
  description: string;
  actif: boolean;
  societe: string;
  prix: string;
}

export default function Devis() {
  // State for tabs and filters
  const [activeTab, setActiveTab] = useState<ActiveTab>('devis');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Sample data for all tabs
  const devisData: Devis[] = [
    {
      id: 1,
      creePar: 'Jean Martin',
      sujet: 'Mise en place CRM Pro',
      prospect: 'Acme Corp',
      prix: '15 600,00 €',
      statut: 'En attente',
      creeLe: '02/03/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 2,
      creePar: 'Sophie Leclerc',
      sujet: 'Module Facturation',
      prospect: 'Nexus Tech',
      prix: '2 990,00 €',
      statut: 'Accepté',
      creeLe: '28/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 3,
      creePar: 'Thomas Bernard',
      sujet: 'Support Premium Annuel',
      prospect: 'Zenith SA',
      prix: '4 990,00 €',
      statut: 'En attente',
      creeLe: '25/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 4,
      creePar: 'Marie Dupont',
      sujet: 'Formation Utilisateurs',
      prospect: 'Global Industries',
      prix: '3 500,00 €',
      statut: 'Accepté',
      creeLe: '20/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
    {
      id: 5,
      creePar: 'Jean Martin',
      sujet: 'Pack Démarrage Complet',
      prospect: 'Tech Innovate',
      prix: '12 750,00 €',
      statut: 'Refusé',
      creeLe: '15/02/2025',
      description: '',
      societe: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      email: '',
      actif: undefined,
      pourcentage: '',
      code: '',
      symbole: '',
      nom: ''
    },
  ];

  const devisesData: Devise[] = [
    {
      id: 1,
      nom: 'Euro',
      code: 'EUR',
      symbole: '€'
    },
    {
      id: 2,
      nom: 'Dollar américain',
      code: 'USD',
      symbole: '$'
    },
    {
      id: 3,
      nom: 'Livre sterling',
      code: 'GBP',
      symbole: '£'
    },
    {
      id: 4,
      nom: 'Franc suisse',
      code: 'CHF',
      symbole: 'CHF'
    },
    {
      id: 5,
      nom: 'Yen japonais',
      code: 'JPY',
      symbole: '¥'
    },
  ];

  const taxesData: Taxe[] = [
    {
      id: 1,
      nom: 'TVA standard',
      pourcentage: '20%'
    },
    {
      id: 2,
      nom: 'TVA intermédiaire',
      pourcentage: '10%'
    },
    {
      id: 3,
      nom: 'TVA réduite',
      pourcentage: '5.5%'
    },
    {
      id: 4,
      nom: 'TVA super réduite',
      pourcentage: '2.1%'
    },
    {
      id: 5,
      nom: 'Exonération TVA',
      pourcentage: '0%'
    },
  ];

  const societesData: Societe[] = [
    {
      id: 1,
      nom: 'CRM Solutions France',
      adresse: '15 rue de l\'Innovation',
      ville: 'Paris',
      codePostal: '75008',
      pays: 'France',
      telephone: '+33 1 23 45 67 89',
      email: 'contact@crmsolutions.fr',
      actif: true
    },
    {
      id: 2,
      nom: 'CRM Solutions Belgique',
      adresse: '25 Avenue des Affaires',
      ville: 'Bruxelles',
      codePostal: '1000',
      pays: 'Belgique',
      telephone: '+32 2 345 67 89',
      email: 'contact@crmsolutions.be',
      actif: true
    },
    {
      id: 3,
      nom: 'CRM Solutions Suisse',
      adresse: '10 Rue du Commerce',
      ville: 'Genève',
      codePostal: '1204',
      pays: 'Suisse',
      telephone: '+41 22 345 67 89',
      email: 'contact@crmsolutions.ch',
      actif: true
    },
    {
      id: 4,
      nom: 'CRM Solutions Canada',
      adresse: '500 Business Avenue',
      ville: 'Montréal',
      codePostal: 'H3B 2C6',
      pays: 'Canada',
      telephone: '+1 514 345 6789',
      email: 'contact@crmsolutions.ca',
      actif: false
    },
    {
      id: 5,
      nom: 'CRM Solutions UK',
      adresse: '100 Tech Street',
      ville: 'London',
      codePostal: 'EC2R 8AH',
      pays: 'Royaume-Uni',
      telephone: '+44 20 3456 7890',
      email: 'contact@crmsolutions.co.uk',
      actif: true
    },
  ];

  const produitsData: Produit[] = [
    {
      id: 1,
      nom: 'CRM Pro License',
      code: 'CRM-PRO',
      description: 'Licence complète CRM Pro avec tous les modules',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '1 200,00 €'
    },
    {
      id: 2,
      nom: 'Module Facturation',
      code: 'MOD-FACT',
      description: 'Module de facturation automatisée',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '299,00 €'
    },
    {
      id: 3,
      nom: 'Module Marketing',
      code: 'MOD-MKT',
      description: 'Module marketing et gestion de campagnes',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '399,00 €'
    },
    {
      id: 4,
      nom: 'Support Premium',
      code: 'SUP-PREM',
      description: 'Support premium 24/7',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '499,00 €'
    },
    {
      id: 5,
      nom: 'Formation Utilisateur',
      code: 'FORM-USR',
      description: 'Formation utilisateur standard',
      actif: true,
      societe: 'CRM Solutions France',
      prix: '350,00 €'
    },
  ];

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'Accepté':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Refusé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Helper functions for the new features
  const exportToCSV = () => {
    // Logic to export data to CSV would go here
    alert('Exporting to CSV...');
  };

  const exportToPDF = () => {
    // Logic to export data to PDF would go here
    alert('Exporting to PDF...');
  };

  const exportToExcel = () => {
    // Logic to export data to Excel would go here
    alert('Exporting to Excel...');
  };

  const transformToInvoice = (id: number) => {
    // Logic to transform a quote to invoice would go here
    alert(`Transforming quote #${id} to invoice...`);
  };

  // Filter data based on search term and active tab
  const getFilteredData = (): Devis[] | Devise[] | Taxe[] | Societe[] | Produit[] => {
    switch(activeTab) {
      case 'devis':
        return devisData.filter(devis => 
          devis.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devis.prospect.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devis.creePar.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'devises':
        return devisesData.filter(devise => 
          devise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          devise.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'taxes':
        return taxesData.filter(taxe => 
          taxe.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'societes':
        return societesData.filter(societe => 
          societe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          societe.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
          societe.pays.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'produits':
        return produitsData.filter(produit => 
          produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          produit.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
  };

  // Get appropriate add button text based on active tab
  const getAddButtonText = () => {
    switch(activeTab) {
      case 'devis':
        return 'Ajouter un devis';
      case 'devises':
        return 'Ajouter une devise';
      case 'taxes':
        return 'Ajouter une taxe';
      case 'societes':
        return 'Ajouter une société';
      case 'produits':
        return 'Ajouter un produit';
      default:
        return 'Ajouter';
    }
  };

  const filteredDevis = activeTab === 'devis' ? (getFilteredData() as Devis[]) : [];

  // Custom button and text color styles based on the requested color
  const primaryBgColor = 'bg-[#1B0353]';
  const primaryTextColor = 'text-[#1B0353]';
  const primaryBorderColor = 'border-[#1B0353]';
  const primaryHoverBgColor = 'hover:bg-[#2D0B75]';
  // const primaryHoverTextColor = 'hover:text-[#2D0B75]';
  // const primaryLightBgColor = 'bg-[#1B0353]/10';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl"
        >
          <div>
            <motion.h1
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold drop-shadow-md flex items-center gap-2"
              style={{ color: "#1B0353" }}
            >
              <FiFileText className="inline-block" />
              Devis
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos devis et configurez les paramètres associés
            </p>
          </div>
          <div className="p-3 bg-[#1B0353]/10 rounded-lg">
            <FiFileText className="w-7 h-7" style={{ color: "#1B0353" }} />
          </div>
        </motion.div>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-3 sm:flex-row">
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 px-5 py-3 ${primaryBgColor} text-white rounded-lg shadow-md transition-all ${primaryHoverBgColor}`}
          >
            <FiPlus className="w-5 h-5" />
            <span>Ajouter un devis</span>
          </motion.button>
          
          <div className="flex gap-2">
            {/* Transformer en facture button - separate outside the table for visibility */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={() => transformToInvoice(0)}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
            >
              <FiPlus className="w-5 h-5" />
              <span>Transformer en facture</span>
            </motion.button>
            
            {/* Export dropdown menu */}
            <div className="relative">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
              >
                <FiDownload className="w-5 h-5" />
                <span>Exporter</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              {showExportMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200"
                >
                  <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiFileText className="w-4 h-4 text-gray-500" />
                    <span>Exporter en CSV</span>
                  </button>
                  <button 
                    onClick={exportToPDF}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiFileText className="w-4 h-4 text-gray-500" />
                    <span>Exporter en PDF</span>
                  </button>
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiFileText className="w-4 h-4 text-gray-500" />
                    <span>Exporter en Excel</span>
                  </button>
                </motion.div>
              )}
            </div>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center p-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              <FiRefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex overflow-x-auto border-b">
            <button
              className={`px-6 py-4 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'devis' ? `${primaryTextColor} border-b-2 ${primaryBorderColor}` : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('devis')}
            >
              Devis
            </button>
            <button
              className={`px-6 py-4 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'devises' ? `${primaryTextColor} border-b-2 ${primaryBorderColor}` : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('devises')}
            >
              Devises
            </button>
            <button
              className={`px-6 py-4 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'taxes' ? `${primaryTextColor} border-b-2 ${primaryBorderColor}` : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('taxes')}
            >
              Taxes
            </button>
            <button
              className={`px-6 py-4 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'societes' ? `${primaryTextColor} border-b-2 ${primaryBorderColor}` : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('societes')}
            >
              Sociétés
            </button>
            <button
              className={`px-6 py-4 text-center font-medium transition whitespace-nowrap ${
                activeTab === 'produits' ? `${primaryTextColor} border-b-2 ${primaryBorderColor}` : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('produits')}
            >
              Produits
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Tab-specific add button and search bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="w-full md:w-80 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B0353] focus:border-transparent shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-4 py-2.5 ${primaryBgColor} text-white rounded-lg shadow-md ${primaryHoverBgColor} transition-all`}
                >
                  <FiPlus className="w-5 h-5" />
                  <span>{getAddButtonText()}</span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                >
                  <FiFilter className="w-5 h-5" />
                  <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
                </motion.button>
              </div>
            </div>

            {/* Filters (if enabled) */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 p-5 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm"
              >
                <div className="flex flex-wrap gap-4">
                  {/* Tab-specific filters would go here */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrer par statut
                    </label>
                    <select className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#1B0353] focus:${primaryBorderColor} bg-white shadow-sm`}>
                      <option>Tous</option>
                      {activeTab === 'devis' && (
                        <>
                          <option>En attente</option>
                          <option>Accepté</option>
                          <option>Refusé</option>
                        </>
                      )}
                      {activeTab === 'societes' && (
                        <>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </>
                      )}
                      {activeTab === 'produits' && (
                        <>
                          <option>Actif</option>
                          <option>Inactif</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  {activeTab === 'devis' && (
                    <>
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de création
                        </label>
                        <select className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#1B0353] focus:${primaryBorderColor} bg-white shadow-sm`}>
                          <option>Tous</option>
                          <option>Aujourd&apos;hui</option>
                          <option>Cette semaine</option>
                          <option>Ce mois</option>
                          <option>Ce trimestre</option>
                        </select>
                      </div>
                      
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Créé par
                        </label>
                        <select className={`w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#1B0353] focus:${primaryBorderColor} bg-white shadow-sm`}>
                          <option>Tous</option>
                          <option>Jean Martin</option>
                          <option>Sophie Leclerc</option>
                          <option>Thomas Bernard</option>
                          <option>Marie Dupont</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-5">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm"
                  >
                    Réinitialiser
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-4 py-2 ${primaryBgColor} text-white rounded-lg ${primaryHoverBgColor} transition shadow-md`}
                  >
                    Appliquer les filtres
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Devis Tab Content */}
            {activeTab === 'devis' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Créé par
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Sujet
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Prospect
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Créé le
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevis.map((devis) => (
                      <tr key={devis.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devis.creePar}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium" style={{ color: "#1B0353" }}>
                            {devis.sujet}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devis.prospect}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {devis.prix}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1.5 text-xs font-medium rounded-full ${getStatusBadgeColor(devis.statut)}`}>
                            {devis.statut}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {devis.creeLe}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Voir">
                              <FiEye size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            {/* Transformer en facture button within the table */}
                            <button 
                              onClick={() => transformToInvoice(devis.id)}
                              className="p-1.5 rounded-md hover:bg-green-100 text-green-600 hover:text-green-800" 
                              title="Transformer en facture"
                            >
                              <FiPlus size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-800" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900" title="Plus d'options">
                              <FiMoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredDevis.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <FiAlertCircle className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun devis trouvé</h3>
                    <p className="text-gray-500 max-w-md">
                      Aucun devis ne correspond à vos critères de recherche. Veuillez modifier vos filtres ou créer un nouveau devis.
                    </p>
                    <button className={`mt-5 flex items-center gap-2 px-4 py-2 ${primaryBgColor} text-white rounded-lg ${primaryHoverBgColor} transition`}>
                      <FiPlus size={16} />
                      <span>Créer un devis</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Devises Tab Content */}
            {activeTab === 'devises' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Symbole
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devisesData.filter(devise => 
                      devise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      devise.code.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((devise) => (
                      <tr key={devise.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {devise.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devise.code}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {devise.symbole}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-800" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Taxes Tab Content */}
            {activeTab === 'taxes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Pourcentage
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxesData.filter(taxe => 
                      taxe.nom.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((taxe) => (
                      <tr key={taxe.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {taxe.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {taxe.pourcentage}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-800" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Sociétés Tab Content */}
            {activeTab === 'societes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Adresse
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Ville
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Code postal
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Pays
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Numéro de Tél.
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actif
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {societesData.filter(societe => 
                      societe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      societe.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      societe.pays.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((societe) => (
                      <tr key={societe.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {societe.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.adresse}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.ville}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.codePostal}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.pays}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.telephone}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {societe.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {societe.actif ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheck className="inline mr-1" /> Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FiX className="inline mr-1" /> Inactif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-800" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Produits Tab Content */}
            {activeTab === 'produits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
              >
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actif
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Société
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produitsData.filter(produit => 
                      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      produit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      produit.description.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((produit) => (
                      <tr key={produit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {produit.nom}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.code}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.description}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {produit.actif ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FiCheck className="inline mr-1" /> Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <FiX className="inline mr-1" /> Inactif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {produit.societe}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {produit.prix}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 rounded-md hover:bg-gray-100" style={{ color: "#1B0353" }} title="Modifier">
                              <FiEdit size={18} />
                            </button>
                            <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600 hover:text-red-800" title="Supprimer">
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 px-1">
              <div className="flex items-center text-sm text-gray-500">
                <span>Affichage de 1 à 5 sur 5 entrées</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Précédent
                </button>
                <button className={`px-3 py-2 border ${primaryBorderColor} rounded-md text-sm font-medium ${primaryTextColor} bg-white`}>
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
