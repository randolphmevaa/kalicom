// FilterBar.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiSearch, FiX, FiChevronDown, FiChevronUp, FiRefreshCw, FiDownload, FiFileText, FiCheckSquare, FiSquare, FiUserPlus, FiGrid, FiList } from 'react-icons/fi';

interface FilterBarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  resetFilters: () => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  selectAll: boolean;
  handleSelectAll: () => void;
  showExportDropdown: boolean;
  setShowExportDropdown: (show: boolean) => void;
  exportToCSV: () => void;
  exportToPDF: () => void;
  statusOptions: string[];
  tagOptions: string[];
  sourceOptions: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  showFilters,
  setShowFilters,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedTag,
  setSelectedTag,
  selectedSource,
  setSelectedSource,
  resetFilters,
  viewMode,
  setViewMode,
  selectAll,
  handleSelectAll,
  showExportDropdown,
  setShowExportDropdown,
  exportToCSV,
  exportToPDF,
  statusOptions,
  tagOptions,
  sourceOptions
}) => {
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [showAbove, setShowAbove] = useState<boolean>(false);
  
  // Check dropdown position when showing export dropdown
  useEffect(() => {
    if (showExportDropdown && exportButtonRef.current) {
      const buttonRect = exportButtonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // If space below button is less than 150px, show dropdown above
      setShowAbove(spaceBelow < 150);
    }
  }, [showExportDropdown]);

  return (
    <>
      {/* Active Filters + Actions Bar */}
      <motion.div 
        className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 p-4 mb-6"
        style={{
          boxShadow: "0 4px 6px -1px rgba(27, 3, 83, 0.05), 0 2px 4px -1px rgba(27, 3, 83, 0.01)"
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-grow">
            <motion.button 
              className="bg-[#1B0353] text-white p-2 rounded-lg shadow-md flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="w-5 h-5" />
            </motion.button>
            
            <div className="w-full md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un client..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {(selectedStatus !== 'Tous' || selectedTag !== 'Tous' || selectedSource !== 'Tous') && (
              <div className="flex flex-wrap gap-2">
                {selectedStatus !== 'Tous' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    <span className="text-[#1B0353] font-medium">Statut: {selectedStatus}</span>
                    <motion.button 
                      className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedStatus('Tous')}
                    >
                      <FiX size={16} />
                    </motion.button>
                  </motion.div>
                )}
                
                {selectedTag !== 'Tous' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    <span className="text-[#1B0353] font-medium">Tag: {selectedTag}</span>
                    <motion.button 
                      className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedTag('Tous')}
                    >
                      <FiX size={16} />
                    </motion.button>
                  </motion.div>
                )}
                
                {selectedSource !== 'Tous' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center bg-[#4BB2F6] bg-opacity-10 border border-[#4BB2F6] border-opacity-30 px-3 py-1 rounded-full text-sm shadow-sm"
                  >
                    <span className="text-[#1B0353] font-medium">Source: {selectedSource}</span>
                    <motion.button 
                      className="ml-2 text-[#004AC8] hover:text-red-500 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedSource('Tous')}
                    >
                      <FiX size={16} />
                    </motion.button>
                  </motion.div>
                )}
                
                <motion.button 
                  className="text-sm text-[#004AC8] hover:text-[#1B0353] font-medium hover:underline focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                >
                  Réinitialiser tout
                </motion.button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex p-1 bg-[#4BB2F6] bg-opacity-10 rounded-lg shadow-sm">
              <motion.button 
                className={`p-2 rounded transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-md' : ''}`}
                whileHover={viewMode !== 'grid' ? { scale: 1.05 } : {}}
                whileTap={viewMode !== 'grid' ? { scale: 0.98 } : {}}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid className={viewMode === 'grid' ? 'text-[#1B0353]' : 'text-gray-500'} />
              </motion.button>
              <motion.button 
                className={`p-2 rounded transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-md' : ''}`}
                whileHover={viewMode !== 'list' ? { scale: 1.05 } : {}}
                whileTap={viewMode !== 'list' ? { scale: 0.98 } : {}}
                onClick={() => setViewMode('list')}
              >
                <FiList className={viewMode === 'list' ? 'text-[#1B0353]' : 'text-gray-500'} />
              </motion.button>
            </div>
            
            {/* Export dropdown button with position control */}
            <div className="relative">
              <motion.button
                ref={exportButtonRef}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4BB2F6] to-[#004AC8] text-white rounded-lg shadow-sm hover:shadow transition text-sm font-medium"
              >
                <FiDownload className="w-4 h-4" />
                <span>Exporter</span>
                {showExportDropdown ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </motion.button>
              
              <AnimatePresence>
                {showExportDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: showAbove ? -10 : 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute z-20 ${showAbove ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-40 bg-white border border-[#4BB2F6] border-opacity-30 rounded-xl shadow-xl overflow-hidden`}
                    style={{ boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.1), 0 8px 10px -6px rgba(27, 3, 83, 0.08)" }}
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                      onClick={exportToCSV}
                    >
                      <FiDownload className="w-4 h-4" />
                      <span>Exporter en CSV</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
                      onClick={exportToPDF}
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>Exporter en PDF</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] rounded-lg border border-[#4BB2F6] border-opacity-30 shadow-sm hover:shadow transition text-sm font-medium"
            >
              {selectAll ? (
                <FiCheckSquare className="w-4 h-4 text-[#004AC8]" />
              ) : (
                <FiSquare className="w-4 h-4" />
              )}
              <span>Tout sélectionner</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg shadow-sm hover:shadow transition text-sm font-medium"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Ajouter</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters Panel (Collapsible) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-lg overflow-hidden mb-6"
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)"
            }}
          >
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Statut */}
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statusOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {/* Tags */}
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    {tagOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                {/* Source */}
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                  >
                    {sourceOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between mt-6">
                <div className="flex space-x-3">
                  <button
                    onClick={resetFilters}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    <FiRefreshCw className="mr-2" />
                    <span>Réinitialiser</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterBar;