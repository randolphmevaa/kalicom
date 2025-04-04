'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiHome,
  FiChevronRight,
  FiDownload,
  FiFileText,
  FiFilter,
  FiSliders,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiToggleRight,
  FiActivity,
  FiInfo,
  // FiHash,
  // FiClock,
  FiPercent,
  // FiPhoneOutgoing,
  // FiPhoneIncoming
} from 'react-icons/fi';
import { KalicomChatWidget } from '@/app/components/dashboard/KalicomChatWidget';

interface Numero {
  id: number;
  destination: string;
  nom: string;
  pays: string;
  active: boolean;
  action: string;
  description: string;
  linesUsed?: number[]; 
}

// Sample lines for multi-select
interface LineOption {
  id: number;
  number: string;
}

// Animation variants
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut" 
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * custom,
      duration: 0.4
    }
  })
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

// --------------- SAMPLE DATA ---------------
const sampleLines: LineOption[] = [
  { id: 1, number: '+33 1 23 45 67 89' },
  { id: 2, number: '+33 1 98 76 54 32' },
  { id: 3, number: '+33 6 11 22 33 44' },
  { id: 4, number: '+44 20 1234 5678' },
];

const initialNumeros: Numero[] = [
  {
    id: 1,
    destination: '+33 1 23 45 67 89',
    nom: 'Numéro principal',
    pays: 'France',
    active: true,
    action: 'Renvoi vers IP',
    description: 'Numéro utilisé pour les appels entrants principaux.',
    linesUsed: [1],
  },
  {
    id: 2,
    destination: '+44 20 1234 5678',
    nom: 'London Office',
    pays: 'Royaume-Uni',
    active: false,
    action: 'Bloqué temporairement',
    description: 'Numéro inactif en attente de réactivation.',
    linesUsed: [3],
  },
  {
    id: 3,
    destination: '+33 6 98 76 54 32',
    nom: 'Portable équipe',
    pays: 'France',
    active: true,
    action: 'Renvoi vers GSM',
    description: 'Numéro dédié aux déplacements commerciaux.',
    linesUsed: [1, 2],
  },
  {
    id: 4,
    destination: '+39 06 1234 5678',
    nom: 'Italie Bureau',
    pays: 'Italie',
    active: true,
    action: 'Renvoi vers IP',
    description: 'Numéro local italien pour le bureau de Rome.',
    linesUsed: [],
  },
];

// Breadcrumbs Component
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="flex items-center text-sm text-gray-600 mb-6"
  >
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </motion.div>
);

// Helper functions for export
const exportToCSV = <T extends object>(data: T[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (elementId: string, filename: string) => {
  // In a real implementation, this would use a library like jsPDF or html2pdf.js
  // For this example, we'll just show an alert
  alert(`Le PDF ${filename} a été généré et téléchargé.`);
  
  // In a real implementation:
  /*
  import html2pdf from 'html2pdf.js';
  const element = document.getElementById(elementId);
  html2pdf()
    .from(element)
    .save(`${filename}.pdf`);
  */
};

// --------------- MAIN PAGE COMPONENT ---------------
export default function MesNumeros() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [numeros, ] = useState<Numero[]>(initialNumeros);
  const [activeCountryFilter, setActiveCountryFilter] = useState<string>('Tous');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('Tous');

  // Sorting config
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Numero | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter states
  const [showLinesDropdown, setShowLinesDropdown] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Derived data
  const totalNumeros = numeros.length;
  const activeNumeros = numeros.filter((n) => n.active).length;
  const inactiveNumeros = numeros.filter((n) => !n.active).length;
  // const internationalCount = new Set(numeros.map(n => n.pays)).size;

  // Get unique countries for filtering
  const uniqueCountries = ['Tous', ...Array.from(new Set(numeros.map(n => n.pays)))];

  // ----------------- FILTER & SEARCH -----------------
  const filteredNumeros = numeros
    .filter((num) => {
      // Search filter
      const matchSearch =
        num.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
        num.action.toLowerCase().includes(searchQuery.toLowerCase());

      // Country filter
      const matchCountry = activeCountryFilter === 'Tous' || num.pays === activeCountryFilter;

      // Status filter
      const matchStatus = 
        activeStatusFilter === 'Tous' || 
        (activeStatusFilter === 'Actifs' && num.active) || 
        (activeStatusFilter === 'Inactifs' && !num.active);

      // LinesUsed filter: if selectedLines is not empty, we only show those containing any selected line
      const matchLines =
        selectedLines.length === 0 ||
        selectedLines.some((lineId) => num.linesUsed?.includes(lineId));

      return matchSearch && matchLines && matchCountry && matchStatus;
    })
    .sort((a, b) => {
      // Sorting
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Convert non-string fields to strings if needed
      if (typeof valA === 'boolean') valA = valA ? 'true' : 'false';
      if (typeof valB === 'boolean') valB = valB ? 'true' : 'false';
      if (typeof valA === 'number') valA = valA.toString();
      if (typeof valB === 'number') valB = valB.toString();

      return isAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  // Handle sort
  const handleSort = (key: keyof Numero) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery('');
    setSelectedLines([]);
    setActiveCountryFilter('Tous');
    setActiveStatusFilter('Tous');
  };

  // Add new number (placeholder)
  const handleAddNumber = () => {
    alert('Fonctionnalité à venir: Ajouter un nouveau numéro');
  };

  // --------------------------------------------------------------------
  // UI RENDER
  // --------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Mes Numéros']} />

        {/* ---------- ENHANCED HEADER / HERO SECTION ---------- */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiPhone className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Gestion des Numéros
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {totalNumeros} numéros
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez et suivez tous vos numéros téléphoniques. Configurez les destinations, 
                  assignez des lignes et optimisez votre infrastructure de communication.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Export Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => exportToCSV(numeros, 'mes-numeros')}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en CSV"
                  >
                    <FiDownload className="mr-2" />
                    CSV
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => exportToPDF('numeros-table', 'mes-numeros')}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en PDF"
                  >
                    <FiFileText className="mr-2" />
                    PDF
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Utilisez les filtres pour affiner vos résultats. Vous pouvez filtrer par pays ou par ligne utilisée. 
                  Les numéros peuvent être exportés au format CSV ou PDF pour partage.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- ENHANCED STATS CARDS ---------- */}
        <motion.div 
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6"
        >
          <motion.div
            custom={0}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#1B0353] to-[#004AC8] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="pattern-0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-0)" />
              </svg>
            </div>
            
            <div className="flex items-center relative z-10">
              <FiPhone className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Total Numéros</p>
                <p className="text-3xl font-extrabold">{totalNumeros}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="pattern-1" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-1)" />
              </svg>
            </div>
            
            <div className="flex items-center relative z-10">
              <FiCheckCircle className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Numéros Actifs</p>
                <p className="text-3xl font-extrabold">{activeNumeros}</p>
                <div className="mt-1 text-xs text-white/80 flex items-center">
                  <FiPercent className="mr-1 w-3 h-3" />
                  <span>{Math.round((activeNumeros / totalNumeros) * 100)}% du total</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className="bg-gradient-to-br from-[#4BB2F6] to-[#1B0353] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id="pattern-2" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pattern-2)" />
              </svg>
            </div>
            
            <div className="flex items-center relative z-10">
              <FiXCircle className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">Numéros Inactifs</p>
                <p className="text-3xl font-extrabold">{inactiveNumeros}</p>
                <div className="mt-1 text-xs text-white/80 flex items-center">
                  <FiPercent className="mr-1 w-3 h-3" />
                  <span>{Math.round((inactiveNumeros / totalNumeros) * 100)}% du total</span>
                </div>
              </div>
            </div>
          </motion.div>

         
        </motion.div>

        {/* Add New Number Button */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddNumber}
            className="flex items-center px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors shadow-md"
          >
            <FiPlus className="mr-2" />
            Ajouter un numéro
          </motion.button>
        </div>

        {/* ---------- ENHANCED FILTERS SECTION ---------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1B0353] flex items-center">
              <FiFilter className="mr-2" /> Filtres
            </h2>
            <button 
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="text-[#004AC8] hover:text-[#003DA8] flex items-center text-sm font-medium"
            >
              <FiSliders className="mr-1" />
              {showFiltersPanel ? 'Masquer les filtres avancés' : 'Afficher les filtres avancés'}
            </button>
          </div>

          {/* Basic Search */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
            {/* Search Bar */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher par numéro, nom ou pays..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Country Filter Selector */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par pays</label>
              <div className="relative">
                <select
                  value={activeCountryFilter}
                  onChange={(e) => setActiveCountryFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all text-gray-800"
                >
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-end gap-3 ml-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiRefreshCw className="mr-2" />
                Réinitialiser
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center"
              >
                <FiFilter className="mr-2" />
                Appliquer
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFiltersPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Multi-select: "Numéro utilisé par la ligne :" */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro utilisé par la ligne :
                  </label>
                  <div
                    className="select-none cursor-pointer relative bg-gray-50 border-2 border-gray-200 rounded-xl py-2.5 px-4 flex items-center justify-between"
                    onClick={() => setShowLinesDropdown((prev) => !prev)}
                  >
                    <span className="text-gray-700 text-sm">
                      {selectedLines.length === 0
                        ? 'Toutes les lignes'
                        : `Lignes sélectionnées (${selectedLines.length})`}
                    </span>
                    {showLinesDropdown ? (
                      <FiChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>

                  {/* Dropdown for lines */}
                  {showLinesDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute z-20 mt-1 w-[calc(50%-1rem)] bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto"
                    >
                      <div className="p-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-medium text-gray-500">Sélectionnez une ou plusieurs lignes</span>
                      </div>
                      {sampleLines.map((line) => {
                        const isSelected = selectedLines.includes(line.id);
                        return (
                          <div
                            key={line.id}
                            className={`px-4 py-2.5 hover:bg-gray-100 flex items-center cursor-pointer ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLines((prev) =>
                                isSelected
                                  ? prev.filter((x) => x !== line.id)
                                  : [...prev, line.id]
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="mr-2 w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                            />
                            <span className="text-sm text-gray-700 font-medium">{line.number}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut :
                  </label>
                  <div className="flex space-x-3">
                    <div 
                      className={`flex-1 flex items-center p-3 border-2 ${activeStatusFilter === 'Tous' ? 'border-[#004AC8] bg-blue-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200`}
                      onClick={() => setActiveStatusFilter('Tous')}
                    >
                      <input
                        type="radio"
                        id="status-all"
                        name="status"
                        className="mr-2 text-[#004AC8]"
                        checked={activeStatusFilter === 'Tous'}
                        onChange={() => setActiveStatusFilter('Tous')}
                      />
                      <label htmlFor="status-all" className="text-sm text-gray-700 flex-1 cursor-pointer">Tous</label>
                    </div>
                    <div 
                      className={`flex-1 flex items-center p-3 border-2 ${activeStatusFilter === 'Actifs' ? 'border-[#004AC8] bg-blue-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200`}
                      onClick={() => setActiveStatusFilter('Actifs')}
                    >
                      <input
                        type="radio"
                        id="status-active"
                        name="status"
                        className="mr-2 text-[#004AC8]"
                        checked={activeStatusFilter === 'Actifs'}
                        onChange={() => setActiveStatusFilter('Actifs')}
                      />
                      <label htmlFor="status-active" className="text-sm text-gray-700 flex-1 cursor-pointer">Actifs</label>
                    </div>
                    <div 
                      className={`flex-1 flex items-center p-3 border-2 ${activeStatusFilter === 'Inactifs' ? 'border-[#004AC8] bg-blue-50' : 'border-gray-200'} rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200`}
                      onClick={() => setActiveStatusFilter('Inactifs')}
                    >
                      <input
                        type="radio"
                        id="status-inactive"
                        name="status"
                        className="mr-2 text-[#004AC8]"
                        checked={activeStatusFilter === 'Inactifs'}
                        onChange={() => setActiveStatusFilter('Inactifs')}
                      />
                      <label htmlFor="status-inactive" className="text-sm text-gray-700 flex-1 cursor-pointer">Inactifs</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ---------- ENHANCED TABLE SECTION ---------- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          id="numeros-table" 
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  {[
                    { key: 'destination', label: 'Destination', icon: FiPhone },
                    { key: 'nom', label: 'Nom', icon: FiMapPin },
                    { key: 'pays', label: 'Pays', icon: FiGlobe },
                    { key: 'active', label: 'Activé', icon: FiToggleRight },
                    { key: 'action', label: 'Action', icon: FiActivity },
                    { key: 'description', label: 'Description', icon: null },
                    { key: 'actions', label: 'Actions', icon: null },
                  ].map((column, idx) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                        idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {column.icon && <column.icon className="w-4 h-4 text-[#004AC8]" />}
                        {column.label}
                        {/* Enable sorting on certain columns */}
                        {['destination', 'nom', 'pays', 'active'].includes(column.key) && (
                          <button
                            onClick={() => handleSort(column.key as keyof Numero)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {sortConfig.key === column.key
                              ? sortConfig.direction === 'asc'
                                ? (
                                  <FiChevronUp className="w-4 h-4 text-[#004AC8]" />
                                ) : (
                                  <FiChevronDown className="w-4 h-4 text-[#004AC8]" />
                                )
                              : (
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200/80">
                {filteredNumeros.map((num) => (
                  <motion.tr
                    key={num.id}
                    variants={rowVariants}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="group transition-colors"
                  >
                    {/* Destination */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-[#004AC8]">
                          <FiPhone className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-800">{num.destination}</span>
                      </div>
                    </td>
                    
                    {/* Nom */}
                    <td className="px-6 py-4 text-sm text-gray-700">{num.nom}</td>
                    
                    {/* Pays */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        <FiGlobe className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        {num.pays}
                      </div>
                    </td>
                    
                    {/* Activé */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            num.active ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span
                          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                            num.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {num.active ? 'Actif' : 'Inactif'}
                        </span>
                      </motion.div>
                    </td>
                    
                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                        <FiActivity className="w-3.5 h-3.5 mr-1.5" />
                        {num.action}
                      </div>
                    </td>
                    
                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {num.description}
                    </td>
                    
                    {/* Actions Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <FiEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                          title="Réinitialiser"
                        >
                          <FiRefreshCw className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {/* Enhanced Empty State */}
                {filteredNumeros.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td
                      colSpan={7}
                      className="py-16 text-center"
                    >
                      <div className="mx-auto flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucun numéro trouvé avec ces critères
                        </p>
                        <p className="text-sm text-gray-500">
                          Essayez d&apos;ajuster vos filtres ou d&apos;effectuer une recherche différente
                        </p>
                        <button 
                          onClick={handleReset}
                          className="mt-4 px-4 py-2 bg-blue-50 text-[#004AC8] rounded-xl hover:bg-blue-100 transition-colors font-medium"
                        >
                          Réinitialiser les filtres
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      {/* Chat Widget */}
      <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
        <KalicomChatWidget />
      </Suspense>
    </motion.div>
  );
}
