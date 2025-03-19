'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiPhoneMissed,
  FiArrowUpRight,
  FiArrowDownRight,
  FiUser,
  FiHome,
  // FiChevronRight,
  FiPhone,
  FiRefreshCw,
  FiFilter,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiClock,
  FiCalendar,
  FiHash,
  FiCornerUpRight,
  FiVolume2,
  FiPhoneCall,
  FiPhoneOff,
  FiX,
  FiMail
} from 'react-icons/fi';

// ------------------ Data Types ------------------
interface CallLog {
  id: number;
  direction: 'Entrant' | 'Sortant' | 'Interne';
  extensionUser: string; 
  callerName: string;
  debut: string; // e.g. 'YYYY-MM-DD HH:mm'
  fin: string;   // e.g. 'YYYY-MM-DD HH:mm'
  monNumero: string;
  numeroDuContact: string;
  dureeAppel: number; // in seconds
  tta: number; // time to answer in seconds
  enregistrement: boolean;
  du: string;
  vers: string;
  cost: number;
  statut: 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
}

// Generate more sample data for demonstration
const generateSampleLogs = () => {
  const statuses = ['Répondu', 'Échoué', 'Annulé', 'Messagerie vocale'];
  const directions = ['Entrant', 'Sortant', 'Interne'];
  const extensions = ['101', '102', '103', '104', '105'];
  const callerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
  const phoneNumbers = [
    '+33 1 23 45 67 89', 
    '+33 6 54 32 10 98', 
    '+33 1 98 76 54 32', 
    '+33 7 12 34 56 78',
    '+33 6 87 65 43 21'
  ];
  const providers = ['SIP/ProviderA', 'SIP/ProviderB', 'SIP/Trunk1', 'SIP/Trunk2', 'Local/'];
  
  const logs = [];
  
  for (let i = 1; i <= 20; i++) {
    const direction = directions[Math.floor(Math.random() * directions.length)] as 'Entrant' | 'Sortant' | 'Interne';
    const extension = extensions[Math.floor(Math.random() * extensions.length)];
    const dureeAppel = Math.floor(Math.random() * 600); // 0-600 seconds
    const tta = Math.floor(Math.random() * 30); // 0-30 seconds
    const cost = direction === 'Sortant' ? Math.random() * 2 : 0;
    const statut = statuses[Math.floor(Math.random() * statuses.length)] as 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
    const enregistrement = Math.random() > 0.5;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    date.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const debutDate = new Date(date);
    const finDate = new Date(date);
    finDate.setSeconds(finDate.getSeconds() + dureeAppel);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    
    logs.push({
      id: i,
      direction,
      extensionUser: extension,
      callerName: callerNames[Math.floor(Math.random() * callerNames.length)],
      debut: formatDate(debutDate),
      fin: formatDate(finDate),
      monNumero: direction === 'Sortant' ? phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)] : extension,
      numeroDuContact: direction === 'Entrant' ? phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)] : (direction === 'Interne' ? extensions[Math.floor(Math.random() * extensions.length)] : phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]),
      dureeAppel,
      tta,
      enregistrement,
      du: providers[Math.floor(Math.random() * providers.length)] + (direction === 'Interne' ? extension : ''),
      vers: providers[Math.floor(Math.random() * providers.length)] + (direction === 'Interne' ? extensions[Math.floor(Math.random() * extensions.length)] : ''),
      cost,
      statut,
    });
  }
  
  return logs;
};

// Example extension dropdown options
const extensionOptions = [
  { value: '', label: 'Toutes' },
  { value: '101', label: '101 (Support)' },
  { value: '102', label: '102 (Commercial)' },
  { value: '103', label: '103 (Administration)' },
  { value: '104', label: '104 (Direction)' },
  { value: '105', label: '105 (Technique)' },
];

// Status options for dropdown
const statusOptions = [
  { value: '', label: 'Tous' },
  { value: 'Répondu', label: 'Répondu' },
  { value: 'Échoué', label: 'Échoué' },
  { value: 'Annulé', label: 'Annulé' },
  { value: 'Messagerie vocale', label: 'Messagerie vocale' },
];

// Direction options for dropdown
const directionOptions = [
  { value: '', label: 'Toutes' },
  { value: 'Entrant', label: 'Entrant' },
  { value: 'Sortant', label: 'Sortant' },
  { value: 'Interne', label: 'Interne' },
];

// ------------------ Breadcrumbs component ------------------
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </div>
);

// Format time from seconds to human-readable form (mm:ss)
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// ------------------ Main Component ------------------
export default function JournalAppelsEnregistrements() {
  // The call logs
  const [logs, setLogs] = useState<CallLog[]>([]);
  
  // Load sample data
  useEffect(() => {
    setLogs(generateSampleLogs());
  }, []);
  
  // ------------------ Stats calculations ------------------
  const totalCalls = logs.length;
  const incomingCalls = logs.filter(log => log.direction === 'Entrant').length;
  const outgoingCalls = logs.filter(log => log.direction === 'Sortant').length;
  const internalCalls = logs.filter(log => log.direction === 'Interne').length;
  const answeredCalls = logs.filter(log => log.statut === 'Répondu').length;
  const failedCalls = logs.filter(log => log.statut === 'Échoué').length;
  const missedCalls = logs.filter(log => log.statut === 'Annulé' || log.statut === 'Messagerie vocale').length;
  const totalDuration = logs.reduce((sum, log) => sum + log.dureeAppel, 0);
  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
  const avgCallDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
  
  // ------------------ Filter States ------------------
  const [searchParams, setSearchParams] = useState({
    direction: '',
    date: '',
    monNumero: '',
    numeroDuContact: '',
    statut: '',
    extensionUser: '',
    minDureeSec: '',
    maxDureeSec: '',
    callName: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust based on your preference
  
  // ------------------ Filtered logs ------------------
  const filteredLogs = logs.filter(log => {
    // Apply filters
    if (searchParams.direction && log.direction !== searchParams.direction) return false;
    if (searchParams.statut && log.statut !== searchParams.statut) return false;
    if (searchParams.extensionUser && log.extensionUser !== searchParams.extensionUser) return false;
    if (searchParams.date && !log.debut.includes(searchParams.date)) return false;
    
    // Phone number filters (partial match)
    if (searchParams.monNumero && !log.monNumero.includes(searchParams.monNumero)) return false;
    if (searchParams.numeroDuContact && !log.numeroDuContact.includes(searchParams.numeroDuContact)) return false;
    
    // Caller name filter (partial match)
    if (searchParams.callName && !log.callerName.toLowerCase().includes(searchParams.callName.toLowerCase())) return false;
    
    // Duration range filter
    if (searchParams.minDureeSec && log.dureeAppel < parseInt(searchParams.minDureeSec)) return false;
    if (searchParams.maxDureeSec && log.dureeAppel > parseInt(searchParams.maxDureeSec)) return false;
    
    return true;
  });
  
  // ------------------ Pagination ------------------
  const pageCount = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // --------------- Handlers ---------------
  const handleChange = (field: string, value: string) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleFilter = () => {
    // Filter is applied automatically through the filteredLogs calculation
    console.log('Filtering with:', searchParams);
  };
  
  const handleReset = () => {
    setSearchParams({
      direction: '',
      date: '',
      monNumero: '',
      numeroDuContact: '',
      statut: '',
      extensionUser: '',
      minDureeSec: '',
      maxDureeSec: '',
      callName: '',
    });
    setCurrentPage(1);
  };
  
  const exportToCSV = () => {
    console.log('Exporting to CSV');
    // Implement CSV export functionality
    alert('Le CSV journal-appels.csv a été généré et téléchargé.');
  };
  
  const exportToPDF = () => {
    console.log('Exporting to PDF');
    // Implement PDF export functionality
    alert('Le PDF journal-appels.pdf a été généré et téléchargé.');
  };
  
  // ------------------ Animation Variants ------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  // ------------------ JSX ------------------
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen pb-10"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Journal d\'appels']} />
        
        {/* ========== Header ========== */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <FiPhone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Journal d&apos;appels & enregistrements</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Consultez, filtrez et exportez l&apos;historique de vos appels.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              {/* Export Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en CSV"
                >
                  <FiDownload className="mr-2" />
                  CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToPDF}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en PDF"
                >
                  <FiFileText className="mr-2" />
                  PDF
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* ========== Stats Section ========== */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Calls */}
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiPhone className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-purple-900">Total</h3>
              </div>
              <p className="text-2xl font-bold text-purple-800">{totalCalls}</p>
              <p className="text-sm text-purple-700 mt-1">appels</p>
            </div>
            
            {/* Call Directions */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiCornerUpRight className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Directions</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {incomingCalls} Entrants
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {outgoingCalls} Sortants
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {internalCalls} Internes
                </span>
              </div>
            </div>
            
            {/* Call Statuses */}
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhoneCall className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Statuts</h3>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {answeredCalls} Répondus
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {failedCalls} Échoués
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {missedCalls} Manqués
                </span>
              </div>
            </div>
            
            {/* Call Duration & Cost */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiClock className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Durée & Coût</h3>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Durée moyenne:</span>
                  <span className="font-bold text-gray-900">{formatTime(avgCallDuration)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-700">Coût total:</span>
                  <span className="font-bold text-gray-900">{totalCost.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* ========== Filters ========== */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <h3 className="text-lg font-semibold text-[#1B0353] flex items-center gap-2">
              <FiFilter className="text-[#004AC8]" />
              Filtres
            </h3>
            
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchParams.callName}
                onChange={(e) => handleChange('callName', e.target.value)}
                placeholder="Rechercher par nom..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
          
          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Direction */}
            <div className="flex flex-col">
              <label htmlFor="direction" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <FiCornerUpRight className="w-4 h-4 text-[#004AC8]" />
                Direction
              </label>
              <select
                id="direction"
                value={searchParams.direction}
                onChange={(e) => handleChange('direction', e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
              >
                {directionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-[#004AC8]" />
                Date
              </label>
              <input
                id="date"
                type="date"
                value={searchParams.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
              />
            </div>

            {/* Mon numéro */}
            <div className="flex flex-col">
              <label htmlFor="monNumero" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                <FiPhone className="w-4 h-4 text-[#004AC8]" />
                Mon numéro
              </label>
              <input
                id="monNumero"
                type="text"
                value={searchParams.monNumero}
                onChange={(e) => handleChange('monNumero', e.target.value)}
                placeholder="Ex: +33 1 23 45 67 89"
                className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
              />
            </div>

            {/* Numéro du contact */}
            <div className="flex flex-col">
              <label
                htmlFor="numeroDuContact"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"
              >
                <FiPhone className="w-4 h-4 text-[#004AC8]" />
                Numéro du contact
              </label>
              <input
                id="numeroDuContact"
                type="text"
                value={searchParams.numeroDuContact}
                onChange={(e) => handleChange('numeroDuContact', e.target.value)}
                placeholder="Ex: +33 6 54 32 10 98"
                className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
              />
            </div>
          </div>

          {/* Advanced Toggle */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <FiSearch className="w-4 h-4" />
              Filtres avancés
              {showAdvanced ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Advanced Filters (AnimatePresence for smooth show/hide) */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {/* Statut */}
                  <div className="flex flex-col">
                    <label htmlFor="statut" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                      <FiInfo className="w-4 h-4 text-[#004AC8]" />
                      Statut
                    </label>
                    <select
                      id="statut"
                      value={searchParams.statut}
                      onChange={(e) => handleChange('statut', e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Extension (Utilisateur) as dropdown */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="extensionUser"
                      className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"
                    >
                      <FiHash className="w-4 h-4 text-[#004AC8]" />
                      Extension (Utilisateur)
                    </label>
                    <select
                      id="extensionUser"
                      value={searchParams.extensionUser}
                      onChange={(e) =>
                        handleChange('extensionUser', e.target.value)
                      }
                      className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                    >
                      {extensionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Durée de l'appel (sec) => min / max */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                      <FiClock className="w-4 h-4 text-[#004AC8]" />
                      Durée de l&apos;appel (sec)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={searchParams.minDureeSec}
                        onChange={(e) =>
                          handleChange('minDureeSec', e.target.value)
                        }
                        className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={searchParams.maxDureeSec}
                        onChange={(e) =>
                          handleChange('maxDureeSec', e.target.value)
                        }
                        className="w-1/2 px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Recording */}
                  <div className="flex flex-col">
                    <label htmlFor="enregistrement" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                      <FiVolume2 className="w-4 h-4 text-[#004AC8]" />
                      Enregistrement
                    </label>
                    <select
                      id="enregistrement"
                      className="px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/20 focus:border-[#004AC8] text-gray-800 appearance-none"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z' fill='rgba(74,85,104,1)'/%3E%3C/svg%3E\")", backgroundPosition: "right 8px center", backgroundRepeat: "no-repeat", paddingRight: "2.5rem" }}
                    >
                      <option value="">Tous</option>
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFilter}
              className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                Appliquer le filtre
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiRefreshCw className="w-4 h-4" />
                Réinitialiser
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* ========== Legend Section ========== */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-800">
            {/* Status Legend */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <FiInfo className="w-4 h-4 text-[#004AC8]" />
                Légende Statuts
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-900">Répondu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-900">Échoué</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-gray-900">Annulé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span className="text-gray-900">Messagerie vocale</span>
                </div>
              </div>
            </div>

            {/* Direction Legend */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
                <FiCornerUpRight className="w-4 h-4 text-[#004AC8]" />
                Légende Directions
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />
                  <span className="text-gray-900">Appels sortants</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiArrowDownRight className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900">Appels entrants</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-900">Internes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhoneMissed className="w-4 h-4 rotate-90 text-orange-500" />
                  <span className="text-gray-900">Enregistrements</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== Table Section ========== */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5 text-gray-900">
                <tr>
                  {[
                    'Direction',
                    'Extension',
                    'Contact',
                    'Début',
                    'Durée',
                    'Mon numéro',
                    'Numéro du contact',
                    'TTA',
                    'Enregistrement',
                    'Statut',
                    'Coût',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-sm font-semibold first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm">
                {paginatedLogs.map((log) => {
                  // Status color based on status
                  const statusColor = {
                    'Répondu': 'bg-green-100 text-green-700',
                    'Échoué': 'bg-red-100 text-red-700',
                    'Annulé': 'bg-orange-100 text-orange-700',
                    'Messagerie vocale': 'bg-purple-100 text-purple-700'
                  }[log.statut];
                  
                  // Direction icon based on direction
                  const directionIcon = {
                    'Sortant': <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />,
                    'Entrant': <FiArrowDownRight className="w-4 h-4 text-green-600" />,
                    'Interne': <FiUser className="w-4 h-4 text-purple-600" />
                  }[log.direction];
                  
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      {/* Direction */}
                      <td className="px-4 py-3 font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          {directionIcon}
                          <span>{log.direction}</span>
                        </div>
                      </td>
                      
                      {/* Extension (Utilisateur) */}
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          <FiHash className="w-3.5 h-3.5 mr-1.5" />
                          {log.extensionUser}
                        </div>
                      </td>
                      
                      {/* Caller name */}
                      <td className="px-4 py-3 font-medium text-gray-800">{log.callerName}</td>
                      
                      {/* Début */}
                      <td className="px-4 py-3 text-gray-700">{log.debut}</td>
                      
                      {/* Durée de l'appel */}
                      <td className="px-4 py-3 text-gray-700">
                        <div className="inline-flex items-center gap-1">
                          <FiClock className="w-3.5 h-3.5 text-gray-500" />
                          {formatTime(log.dureeAppel)}
                        </div>
                      </td>
                      
                      {/* Mon numéro */}
                      <td className="px-4 py-3 text-gray-700">{log.monNumero}</td>
                      
                      {/* Numéro du contact */}
                      <td className="px-4 py-3 text-gray-700">
                        {log.numeroDuContact}
                      </td>
                      
                      {/* TTA */}
                      <td className="px-4 py-3 text-gray-700">{log.tta} sec</td>
                      
                      {/* Enregistrement */}
                      <td className="px-4 py-3 text-gray-700">
                        {log.enregistrement ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full text-blue-700">
                            <FiPhoneMissed className="w-3.5 h-3.5 rotate-90" />
                            <span className="text-xs font-medium">Oui</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Non</span>
                        )}
                      </td>
                      
                      {/* Statut */}
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {log.statut === 'Répondu' && <FiPhoneCall className="w-3 h-3 mr-1" />}
                          {log.statut === 'Échoué' && <FiPhoneOff className="w-3 h-3 mr-1" />}
                          {log.statut === 'Annulé' && <FiX className="w-3 h-3 mr-1" />}
                          {log.statut === 'Messagerie vocale' && <FiMail className="w-3 h-3 mr-1" />}
                          {log.statut}
                        </div>
                      </td>
                      
                      {/* Cost */}
                      <td className="px-4 py-3 font-medium">
                        {log.cost > 0 ? (
                          <span className="text-[#004AC8]">{log.cost.toFixed(2)} €</span>
                        ) : (
                          <span className="text-gray-400">0.00 €</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}

                {/* If no logs found */}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-20 text-center text-gray-600">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucun appel trouvé
                        </p>
                        <p className="text-sm text-gray-500">
                          Essayez de modifier vos filtres ou de réinitialiser la recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
                </span>{' '}
                sur <span className="font-medium">{filteredLogs.length}</span> appels
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#004AC8] hover:bg-[#004AC8]/10'
                  }`}
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                  // Show current page and 2 pages before/after
                  const pageNum = currentPage <= 3
                    ? i + 1
                    : currentPage >= pageCount - 2
                      ? pageCount - 4 + i
                      : currentPage - 2 + i;
                  
                  if (pageNum <= 0 || pageNum > pageCount) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-medium text-sm ${
                        currentPage === pageNum
                          ? 'bg-[#004AC8] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                  disabled={currentPage === pageCount || pageCount === 0}
                  className={`p-2 rounded-lg ${
                    currentPage === pageCount || pageCount === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#004AC8] hover:bg-[#004AC8]/10'
                  }`}
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
