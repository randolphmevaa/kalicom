// app/dashboard/pbx/mes-lignes/components/tabs/UsageSummaryTab.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPhone, 
  // FiPhoneIncoming, 
  // FiActivity, 
  FiSearch, 
  FiClock, 
  FiXCircle, 
  FiGlobe, 
  FiArrowLeft, 
  FiX, 
  FiChevronDown, 
  FiCalendar, 
  FiRefreshCw, 
  FiFilter, 
  FiToggleRight, 
  FiToggleLeft, 
  FiChevronUp, 
  FiBarChart2 
} from 'react-icons/fi';
import { UsageLine } from '../../models/types';
import { tableVariants, cardVariants, rowVariants } from '../../utils/animations';

interface UsageSummaryTabProps {
  usageLines: UsageLine[];
}

const UsageSummaryTab: React.FC<UsageSummaryTabProps> = ({ usageLines }) => {
  const [timeRange, setTimeRange] = useState('7j');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Tous');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeInternal, setIncludeInternal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UsageLine | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const filteredLines = usageLines
    .filter((line) => {
      // Apply search filter
      if (searchQuery && searchType !== 'Tous') {
        const field = searchType.toLowerCase() as keyof UsageLine;
        return line[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchQuery) {
        return (
          line.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
          line.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          line.aliasNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isAsc ? aValue - bValue : bValue - aValue;
      }
      
      return isAsc
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    
  const handleSort = (key: keyof UsageLine) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSearchType('Tous');
    setStartDate('');
    setEndDate('');
    setIncludeInternal(false);
  };

  // Calculate totals
  const totalIncomingCalls = usageLines.reduce((sum, line) => sum + line.incomingCalls, 0);
  const totalOutgoingCalls = usageLines.reduce((sum, line) => sum + line.outgoingCalls, 0);
  const totalMissedCalls = usageLines.reduce((sum, line) => sum + line.missed, 0);
  const totalIncomingDuration = usageLines.reduce((sum, line) => sum + line.incomingDuration, 0);

  // Time range options
  const timeRangeOptions = [
    { value: '24h', label: 'Dernières 24h' },
    { value: '7j', label: '7 derniers jours' },
    { value: '30j', label: '30 derniers jours' },
    { value: 'custom', label: 'Personnalisé' }
  ];

  return (
    <div>
      {/* Usage Stats Cards */}
      <motion.div 
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="text-gray-700 grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
      >
        <motion.div
          custom={0}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-[#004AC8]/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#004AC8]/5 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#004AC8]/10 rounded-lg mr-4">
              <FiPhone className="w-6 h-6 text-[#004AC8]" />
            </div>
            <span className="text-sm font-medium text-gray-500">Appels Entrants</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalIncomingCalls}</p>
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <FiArrowLeft className="mr-1" /> 
            <span>+{Math.round(totalIncomingCalls * 0.05)} cette semaine</span>
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-[#4BB2F6]/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4BB2F6]/5 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-[#4BB2F6]/10 rounded-lg mr-4">
              <FiPhone className="w-6 h-6 text-[#4BB2F6] transform rotate-90" />
            </div>
            <span className="text-sm font-medium text-gray-500">Appels Sortants</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalOutgoingCalls}</p>
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <FiArrowLeft className="mr-1 transform rotate-180" /> 
            <span>+{Math.round(totalOutgoingCalls * 0.03)} cette semaine</span>a
          </div>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-red-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg mr-4">
              <FiXCircle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Appels Manqués</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalMissedCalls}</p>
          <div className="mt-2 text-sm text-red-500 flex items-center">
            <FiX className="mr-1" /> 
            <span>{Math.round(totalMissedCalls / totalIncomingCalls * 100)}% du total</span>
          </div>
        </motion.div>

        <motion.div
          custom={3}
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          className="bg-white p-6 rounded-3xl shadow-lg border border-purple-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <FiClock className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-500">Durée Totale</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalIncomingDuration} min</p>
          <div className="mt-2 text-sm text-purple-600 flex items-center">
            <FiGlobe className="mr-1" /> 
            <span>~{Math.round(totalIncomingDuration / totalIncomingCalls)} min/appel</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        {timeRangeOptions.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeRange(option.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              timeRange === option.value 
                ? 'bg-[#004AC8] text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Enhanced Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche rapide</label>
            <div className="relative">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="text-gray-400 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              >
                <option value="Tous">Tous les champs</option>
                <option value="extension">Extension</option>
                <option value="userName">Utilisateur</option>
                <option value="aliasNumber">Numéro alias</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiCalendar className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiCalendar className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inclure appels internes</label>
            <button
              onClick={() => setIncludeInternal(!includeInternal)}
              className="text-gray-700 flex items-center px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none hover:bg-gray-50 transition-colors"
            >
              {includeInternal ? (
                <FiToggleRight className="w-6 h-6 text-[#004AC8] mr-2" />
              ) : (
                <FiToggleLeft className="w-6 h-6 text-gray-400 mr-2" />
              )}
              {includeInternal ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Réinitialiser
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {/* Apply filter logic */}}
            className="px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center"
          >
            <FiFilter className="mr-2" />
            Appliquer le filtre
          </motion.button>
        </div>
      </motion.div>

      {/* Usage Summary Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        id="resume-utilisation-table" 
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                {[
                  'Extension', 'Nom de l\'utilisateur', 'Numéro alias', 'Manqué', 'Non répondu', 'Occupé', 
                  'ALOC', 'Appels entrants', 'Durée entrants', 'Appels sortants', 'Échec de l\'appel sortant', 
                  'Appel sortant manqué', 'Durée sortants', 'Description'
                ].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-4 py-3 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 13 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="whitespace-nowrap">{header}</span>
                      <button
                        onClick={() => handleSort(
                          header === 'Extension' ? 'extension' : 
                          header === 'Nom de l\'utilisateur' ? 'userName' : 
                          header === 'Numéro alias' ? 'aliasNumber' : 
                          header === 'Manqué' ? 'missed' :
                          header === 'Non répondu' ? 'unanswered' :
                          header === 'Occupé' ? 'busy' :
                          header === 'ALOC' ? 'aloc' :
                          header === 'Appels entrants' ? 'incomingCalls' :
                          header === 'Durée entrants' ? 'incomingDuration' :
                          header === 'Appels sortants' ? 'outgoingCalls' :
                          header === 'Échec de l\'appel sortant' ? 'outgoingFailed' :
                          header === 'Appel sortant manqué' ? 'outgoingMissed' :
                          header === 'Durée sortants' ? 'outgoingDuration' : 'description' as keyof UsageLine
                        )}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {sortConfig.key === (
                          header === 'Extension' ? 'extension' : 
                          header === 'Nom de l\'utilisateur' ? 'userName' : 
                          header === 'Numéro alias' ? 'aliasNumber' : 
                          header === 'Manqué' ? 'missed' :
                          header === 'Non répondu' ? 'unanswered' :
                          header === 'Occupé' ? 'busy' :
                          header === 'ALOC' ? 'aloc' :
                          header === 'Appels entrants' ? 'incomingCalls' :
                          header === 'Durée entrants' ? 'incomingDuration' :
                          header === 'Appels sortants' ? 'outgoingCalls' :
                          header === 'Échec de l\'appel sortant' ? 'outgoingFailed' :
                          header === 'Appel sortant manqué' ? 'outgoingMissed' :
                          header === 'Durée sortants' ? 'outgoingDuration' : 'description'
                        ) ? (
                          sortConfig.direction === 'asc' ? (
                            <FiChevronUp className="w-3 h-3 text-[#004AC8]" />
                          ) : (
                            <FiChevronDown className="w-3 h-3 text-[#004AC8]" />
                          )
                        ) : (
                          <FiChevronDown className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80">
              {filteredLines.map((line, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{line.extension}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{line.userName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{line.aliasNumber}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.missed}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.unanswered}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.busy}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.aloc}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.incomingCalls}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.incomingDuration} min</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.outgoingCalls}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.outgoingFailed}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.outgoingMissed}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-gray-700">{line.outgoingDuration} min</td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-700">{line.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredLines.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 text-[#004AC8]/50">
                <FiBarChart2 className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">
                Aucune donnée trouvée
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez d&apos;ajuster vos filtres de recherche
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UsageSummaryTab;