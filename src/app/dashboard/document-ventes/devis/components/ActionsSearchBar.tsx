'use client';
import React, { memo, ChangeEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiRefreshCw,
  FiFileText,
  FiChevronDown,
  FiX,
  FiSliders,
  FiDownload,
  // FiCalendar,
} from 'react-icons/fi';
import type { FilterStatus, FilterPeriod, ExportFormat } from '../types';

interface ActionsSearchBarProps {
  // Search state
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  
  // Filters state
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedStatus: FilterStatus;
  setSelectedStatus: (status: FilterStatus) => void;
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: (period: FilterPeriod) => void;
  selectedProspect: string;
  setSelectedProspect: (prospect: string) => void;
  resetFilters: () => void;
  
  // View mode
  viewMode: 'compact' | 'comfortable';
  setViewMode: (mode: 'compact' | 'comfortable') => void;
  
  // Export state
  showDateRangePicker: boolean;
  setShowDateRangePicker: (show: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  handleExport: () => void;
  
  // Actions 
  handleOpenCreateModal: () => void;
  transformToInvoice: (ids: string[]) => void;
  selectedDevisIds: string[];
  
  // Options for selects
  statusOptions: FilterStatus[];
  periodOptions: FilterPeriod[];
  prospectOptions: string[];
  
  // Animation variants
  itemVariants: Variants;
}

const ActionsSearchBar: React.FC<ActionsSearchBarProps> = memo(({
  // Search state
  searchTerm,
  setSearchTerm,
  clearSearch,
  
  // Filters state
  showFilters,
  setShowFilters,
  selectedStatus,
  setSelectedStatus,
  selectedPeriod,
  setSelectedPeriod,
  selectedProspect,
  setSelectedProspect,
  resetFilters,
  
  // View mode
  viewMode,
  setViewMode,
  
  // Export state
  showDateRangePicker,
  setShowDateRangePicker,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  exportFormat,
  setExportFormat,
  handleExport,
  
  // Actions
  handleOpenCreateModal,
  transformToInvoice,
  selectedDevisIds,
  
  // Options
  statusOptions,
  periodOptions,
  prospectOptions,
  
  // Animation variants
  itemVariants,
}) => {
  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Primary color theme
  const primaryColor = '#1B0353';
  const greenColor = '#4CAF50';
  
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        {/* Main controls section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="w-full lg:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un devis..."
              className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-indigo-500 transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Rechercher un devis"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Effacer la recherche"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Action Buttons - Improved responsive layout */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Main Action Buttons Group */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: primaryColor }}
                onClick={handleOpenCreateModal}
                aria-label="Créer un devis"
              >
                <FiPlus aria-hidden="true" />
                <span className="hidden xs:inline">Créer un devis</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => transformToInvoice(selectedDevisIds.length ? selectedDevisIds : [])}
                className="flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: greenColor }}
                aria-label="Transformer en facture"
              >
                <FiPlus aria-hidden="true" />
                <span className="hidden xs:inline">Transformer en facture</span>
              </motion.button>
            </div>
            
            {/* Secondary Action Buttons Group */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: primaryColor }}
                aria-label="Dupliquer un devis"
              >
                <FiFileText className="mr-1" aria-hidden="true" />
                <span className="hidden sm:inline">Dupliquer un devis</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                  showFilters
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-expanded={showFilters}
                aria-controls="filters-panel"
              >
                <FiFilter aria-hidden="true" />
                <span className="hidden sm:inline">{showFilters ? 'Masquer filtres' : 'Filtres'}</span>
                {showFilters ? (
                  <FiChevronDown className="transform rotate-180 transition-transform duration-200" aria-hidden="true" />
                ) : (
                  <FiChevronDown className="transition-transform duration-200" aria-hidden="true" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                className={`flex items-center space-x-1 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg hover:shadow-sm transition-all duration-200 ${
                  showDateRangePicker
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                aria-expanded={showDateRangePicker}
                aria-controls="date-range-picker-panel"
              >
                <FiDownload aria-hidden="true" />
                <span className="hidden sm:inline">Exporter</span>
              </motion.button>
            </div>
            
            {/* Utility Buttons Group */}
            <div className="flex items-center ml-0 sm:ml-2 sm:border-l sm:pl-2 h-10">
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
                aria-label={
                  viewMode === 'comfortable'
                    ? 'Affichage compact'
                    : 'Affichage confortable'
                }
              >
                <FiSliders size={18} aria-hidden="true" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                title="Actualiser"
                aria-label="Actualiser"
              >
                <FiRefreshCw size={18} aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Date Range Picker for Export */}
        <AnimatePresence>
          {showDateRangePicker && (
            <motion.div
              id="date-range-picker-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden border-t pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="start-date">
                    Date de début
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="end-date">
                    Date de fin
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="complete-month">
                    Mois complet
                  </label>
                  <select 
                    id="complete-month"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Sélectionner un mois</option>
                    <option value="01/2025">Janvier 2025</option>
                    <option value="02/2025">Février 2025</option>
                    <option value="03/2025">Mars 2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" id="export-format-label">
                    Format
                  </label>
                  <div className="flex space-x-2" role="radiogroup" aria-labelledby="export-format-label">
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                        exportFormat === 'pdf'
                          ? 'border-transparent text-white shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor:
                          exportFormat === 'pdf' ? primaryColor : '',
                      }}
                      onClick={() => setExportFormat('pdf')}
                      aria-checked={exportFormat === 'pdf'}
                      role="radio"
                    >
                      PDF
                    </button>
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                        exportFormat === 'csv'
                          ? 'border-transparent text-white shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor:
                          exportFormat === 'csv' ? primaryColor : '',
                      }}
                      onClick={() => setExportFormat('csv')}
                      aria-checked={exportFormat === 'csv'}
                      role="radio"
                    >
                      CSV
                    </button>
                    <button
                      className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                        exportFormat === 'excel'
                          ? 'border-transparent text-white shadow-md'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundColor:
                          exportFormat === 'excel' ? primaryColor : '',
                      }}
                      onClick={() => setExportFormat('excel')}
                      aria-checked={exportFormat === 'excel'}
                      role="radio"
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
                  style={{ backgroundColor: primaryColor }}
                >
                  Exporter
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 overflow-hidden border-t pt-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status-filter">
                    Statut
                  </label>
                  <select
                    id="status-filter"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="period-filter">
                    Période
                  </label>
                  <select
                    id="period-filter"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prospect-filter">
                    Prospect
                  </label>
                  <select
                    id="prospect-filter"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    value={selectedProspect}
                    onChange={(e) => setSelectedProspect(e.target.value)}
                  >
                    {prospectOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 mt-6">
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
                  style={{ backgroundColor: primaryColor }}
                >
                  Appliquer les filtres
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// Display name helps with debugging
ActionsSearchBar.displayName = 'ActionsSearchBar';

export default ActionsSearchBar;