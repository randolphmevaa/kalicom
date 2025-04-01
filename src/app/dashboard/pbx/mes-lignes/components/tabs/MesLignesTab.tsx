// app/dashboard/pbx/mes-lignes/components/tabs/MesLignesTab.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPhone, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch, 
  FiRefreshCw, 
  FiFilter, 
  FiChevronUp, 
  FiChevronDown, 
  FiHash, 
  FiUsers, 
  FiMail, 
  FiX, 
  FiEdit, 
  FiTrash2 
} from 'react-icons/fi';
import { LineType } from '../../models/types';
import { tableVariants, rowVariants, cardVariants } from '../../utils/animations';

interface MesLignesTabProps {
  lines: LineType[];
  onSelectLine: (line: LineType) => void;
}

const MesLignesTab: React.FC<MesLignesTabProps> = ({ lines, onSelectLine }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [sortConfig, setSortConfig] = useState<{ key: keyof LineType | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [ , setSelectedLine] = useState<LineType | null>(null);
  const [showDescription, setShowDescription] = useState<number | null>(null);

  // Use a typed record for status mapping
  const statusMap: Record<string, string | null> = { Tous: null, Actifs: 'Active', Inactifs: 'Inactive' };

  const filteredLines = lines
    .filter(
      (line: LineType) =>
        (line.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.user.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedFilter === 'Tous' || line.status === statusMap[selectedFilter])
    )
    .sort((a: LineType, b: LineType) => {
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      return isAsc
        ? a[sortConfig.key]!.toString().localeCompare(b[sortConfig.key]!.toString())
        : b[sortConfig.key]!.toString().localeCompare(a[sortConfig.key]!.toString());
    });

  const totalLines = lines.length;
  const activeLines = lines.filter((line: LineType) => line.status === 'Active').length;
  const inactiveLines = lines.filter((line: LineType) => line.status === 'Inactive').length;

  const handleSort = (key: keyof LineType) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const handleLineClick = (line: LineType) => {
    setSelectedLine(line);
    onSelectLine(line);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('Tous');
    setSortConfig({ key: null, direction: 'asc' });
  };

  const cardStyles = [
    { label: 'Total Lignes', value: totalLines, icon: FiPhone, color: 'from-[#1B0353] to-[#004AC8]' },
    { label: 'Lignes Actives', value: activeLines, icon: FiCheckCircle, color: 'from-[#004AC8] to-[#4BB2F6]' },
    { label: 'Lignes Inactives', value: inactiveLines, icon: FiXCircle, color: 'from-[#4BB2F6] to-[#1B0353]' },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <motion.div 
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {cardStyles.map((card, index: number) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className={`bg-gradient-to-br ${card.color} p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden`}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id={`grid-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
              </svg>
            </div>
            
            <div className="flex items-center relative z-10">
              <card.icon className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-extrabold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Table Section */}
      <motion.div 
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
        {/* Enhanced Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
              <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par extension, numéro, nom ou utilisateur..."
              className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>
          
          <div className="flex w-full sm:w-auto space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" />
              Réinitialiser
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* Apply filter logic */}}
              className="w-full sm:w-auto px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center justify-center"
            >
              <FiFilter className="mr-2" />
              Appliquer
            </motion.button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(statusMap).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === status 
                  ? 'bg-[#004AC8] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>

        {/* Enhanced Table */}
        <div id="mes-lignes-table" className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                {['Extension', 'Numéro à l\'affichage', 'Nom du numéro', 'Utilisateur', 'Messagerie vocale activée', 'Statut', 'Actions'].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {['Extension', 'Numéro à l\'affichage', 'Nom du numéro', 'Utilisateur', 'Statut'].includes(header) && (
                        <button
                          onClick={() => handleSort(
                            header === 'Extension' ? 'extension' : 
                            header === 'Numéro à l\'affichage' ? 'displayNumber' : 
                            header === 'Nom du numéro' ? 'name' : 
                            header === 'Utilisateur' ? 'user' : 'status' as keyof LineType
                          )}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {sortConfig.key === (
                            header === 'Extension' ? 'extension' : 
                            header === 'Numéro à l\'affichage' ? 'displayNumber' : 
                            header === 'Nom du numéro' ? 'name' : 
                            header === 'Utilisateur' ? 'user' : 'status'
                          ) ? (
                            sortConfig.direction === 'asc' ? (
                              <FiChevronUp className="w-4 h-4 text-[#004AC8]" />
                            ) : (
                              <FiChevronDown className="w-4 h-4 text-[#004AC8]" />
                            )
                          ) : (
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
              {filteredLines.map((line) => (
                <motion.tr
                  key={line.id}
                  variants={rowVariants}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors relative"
                  onMouseEnter={() => setShowDescription(line.id)}
                  onMouseLeave={() => setShowDescription(null)}
                >
                  {/* Extension Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiHash className="w-5 h-5 text-[#004AC8]/80 shrink-0" />
                      <span className="font-medium text-gray-900">{line.extension}</span>
                    </div>
                  </td>

                  {/* Display Number Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-5 h-5 text-[#004AC8]/80 shrink-0" />
                      <span className="font-medium text-gray-900">{line.displayNumber}</span>
                    </div>
                  </td>
                  
                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{line.name}</span>
                  </td>
                  
                  {/* User Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{line.user}</span>
                    </div>
                  </td>
                  
                  {/* Voicemail Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {line.voicemailEnabled ? (
                        <FiMail className="w-5 h-5 text-green-500" />
                      ) : (
                        <FiX className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          line.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span
                        className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                          line.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {line.status === 'Active' ? 'Actif' : 'Inactif'}
                      </span>
                    </motion.div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLineClick(line)}
                        className="p-2 hover:bg-blue-100 rounded-lg text-[#004AC8] transition-colors"
                        title="Modifier"
                      >
                        <FiEdit className="w-5 h-5" />
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
                  
                  {/* Description tooltip */}
                  {showDescription === line.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 left-0 mt-2 -bottom-20 ml-6 px-4 py-3 bg-gray-800 text-white text-sm rounded-xl shadow-xl max-w-md"
                    >
                      <div className="font-medium mb-1">Description:</div>
                      <div>{line.description}</div>
                    </motion.div>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Enhanced Empty State */}
          {filteredLines.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 text-[#004AC8]/50">
                <FiSearch className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">
                Aucune ligne trouvée avec ces critères de recherche
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez d&apos;ajuster votre recherche ou vos filtres
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MesLignesTab;
