'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiDownload,
  FiSliders,
  FiRefreshCw,
  FiX,
  FiChevronDown,
  FiFilePlus
} from 'react-icons/fi';

interface ActionBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  clearSearch: () => void;
  showDateRangePicker: boolean;
  setShowDateRangePicker: (show: boolean) => void;
  viewMode: 'compact' | 'comfortable';
  setViewMode: (mode: 'compact' | 'comfortable') => void;
  handleOpenCreateModal: () => void;
  handleOpenCreateCreditNoteModal: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  clearSearch,
  showDateRangePicker,
  setShowDateRangePicker,
  viewMode,
  setViewMode,
  handleOpenCreateModal,
  handleOpenCreateCreditNoteModal
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="w-full lg:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une facture..."
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-indigo-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#1B0353' }}
              onClick={handleOpenCreateModal}
            >
              <FiPlus />
              <span>Créer une facture</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#1B0353' }}
              onClick={handleOpenCreateCreditNoteModal}
            >
              <FiFilePlus />
              <span>Créer un avoir</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                showFilters
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFilter />
              <span>{showFilters ? 'Masquer filtres' : 'Filtres'}</span>
              {showFilters ? (
                <FiChevronDown className="transform rotate-180 transition-transform duration-200" />
              ) : (
                <FiChevronDown className="transition-transform duration-200" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDateRangePicker(!showDateRangePicker)}
              className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                showDateRangePicker
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiDownload />
              <span>Exporter</span>
            </motion.button>
            <div className="flex items-center ml-2 border-l pl-2 h-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setViewMode(
                    viewMode === 'comfortable' ? 'compact' : 'comfortable'
                  )
                }
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                title={
                  viewMode === 'comfortable'
                    ? 'Affichage compact'
                    : 'Affichage confortable'
                }
              >
                <FiSliders size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                title="Actualiser"
              >
                <FiRefreshCw size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionBar;