// ActionsSearchBar.tsx
'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FiSearch, FiX, FiPlus, FiFilePlus, FiFilter, FiChevronDown, FiDownload, FiSliders, FiRefreshCw } from 'react-icons/fi';

type FilterPeriod = 'Tous' | 'Ce mois' | 'Mois dernier' | 'Ce trimestre' | 'Cette année';

interface ActionsSearchBarProps {
  // Search and input state/handlers
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  clearSearch: () => void;
  // Modal handlers
  handleOpenCreateModal: () => void;
  handleOpenCreateCreditNoteModal: () => void;
  // Filter panel toggle
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  // Date range picker state/handlers
  showDateRangePicker: boolean;
  setShowDateRangePicker: (show: boolean) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  exportFormat: 'pdf' | 'csv' | 'excel';
  setExportFormat: (format: 'pdf' | 'csv' | 'excel') => void;
  handleExport: () => void;
  // View mode state/handler
  viewMode: 'compact' | 'comfortable';
  setViewMode: (mode: 'compact' | 'comfortable') => void;
  // Options for filters
  statusOptions: string[];
  periodOptions: string[];
  clientOptions: string[];
  selectedStatus: string;
  selectedPeriod: string;
  selectedClient: string;
  setSelectedStatus: (value: string) => void;
  setSelectedPeriod: (value: FilterPeriod) => void;
  setSelectedClient: (value: string) => void;
  resetFilters: () => void;
  // Animation variants passed from parent
  itemVariants: Variants;
}

const ActionsSearchBar: React.FC<ActionsSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  clearSearch,
  handleOpenCreateModal,
  handleOpenCreateCreditNoteModal,
  showFilters,
  setShowFilters,
  showDateRangePicker,
  setShowDateRangePicker,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  exportFormat,
  setExportFormat,
  handleExport,
  viewMode,
  setViewMode,
  statusOptions,
  periodOptions,
  clientOptions,
  selectedStatus,
  selectedPeriod,
  selectedClient,
  setSelectedStatus,
  setSelectedPeriod,
  setSelectedClient,
  resetFilters,
  itemVariants,
}) => {
  return (
    <motion.div
      variants={itemVariants}
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
              className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg transition-all duration-200 ${
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
              className={`flex items-center space-x-1 px-4 py-2.5 border rounded-lg transition-all duration-200 ${
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
                onClick={() => setViewMode(viewMode === 'comfortable' ? 'compact' : 'comfortable')}
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                title={viewMode === 'comfortable' ? 'Affichage compact' : 'Affichage confortable'}
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

        {/* Date Range Picker for Export */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-6 overflow-hidden border-t pt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois complet
              </label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all">
                <option value="">Sélectionner un mois</option>
                <option value="01/2025">Janvier 2025</option>
                <option value="02/2025">Février 2025</option>
                <option value="03/2025">Mars 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: exportFormat === 'pdf' ? '#1B0353' : '' }}
                  onClick={() => setExportFormat('pdf')}
                >
                  PDF
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'csv'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: exportFormat === 'csv' ? '#1B0353' : '' }}
                  onClick={() => setExportFormat('csv')}
                >
                  CSV
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'excel'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ backgroundColor: exportFormat === 'excel' ? '#1B0353' : '' }}
                  onClick={() => setExportFormat('excel')}
                >
                  Excel
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDateRangePicker(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: '#1B0353' }}
            >
              Exporter
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-6 overflow-hidden border-t pt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as FilterPeriod)}
              >
                {periodOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client
              </label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                {clientOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Réinitialiser
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: '#1B0353' }}
            >
              Appliquer les filtres
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ActionsSearchBar;
