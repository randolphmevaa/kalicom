'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiPhone,
  FiTag,
  FiCalendar,
  FiUser,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiChevronDown
} from 'react-icons/fi';

// Define types for team members and filter models
interface TeamMember {
  id: number;
  name: string;
}

interface FilterModel {
  id: number;
  name: string;
}

// Define props interface with all required properties
interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  phoneSearch: string;
  setPhoneSearch: (value: string) => void;
  tagSearch: string;
  setTagSearch: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  selectedAssignee: string | null;
  setSelectedAssignee: (value: string | null) => void;
  teamMembers: TeamMember[];
  showTeamDropdown: boolean;
  setShowTeamDropdown: (value: boolean) => void;
  selectedFilterModel: string | null;
  setSelectedFilterModel: (value: string | null) => void;
  filterModels: FilterModel[];
  showFilterModelsDropdown: boolean;
  setShowFilterModelsDropdown: (value: boolean) => void;
  handleReset: () => void;
  applyFilters: () => void;
  setIsFilterExpanded: (value: boolean) => void;
}

// Memoize the component to prevent unnecessary re-renders
const FilterPanel = React.memo<FilterPanelProps>(({
  searchTerm,
  setSearchTerm,
  phoneSearch,
  setPhoneSearch,
  tagSearch,
  setTagSearch,
  dateFilter,
  setDateFilter,
  selectedAssignee,
  setSelectedAssignee,
  teamMembers,
  showTeamDropdown,
  setShowTeamDropdown,
  selectedFilterModel,
  setSelectedFilterModel,
  filterModels,
  showFilterModelsDropdown,
  setShowFilterModelsDropdown,
  handleReset,
  applyFilters,
  setIsFilterExpanded
}) => {
  // Use refs to handle outside clicks for dropdowns with proper types
  const teamDropdownRef = useRef<HTMLDivElement | null>(null);
  const filterModelsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
      if (filterModelsDropdownRef.current && !filterModelsDropdownRef.current.contains(event.target as Node)) {
        setShowFilterModelsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowTeamDropdown, setShowFilterModelsDropdown]);

  return (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Phone Number */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Numéro de Tél.
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                type="text"
                value={phoneSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: 06 12 34 56 78"
              />
            </div>
          </div>

          {/* Search */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Chercher
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nom, email, entreprise..."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiTag className="text-gray-400" />
              </div>
              <input
                type="text"
                value={tagSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="VIP, Premium..."
              />
            </div>
          </div>

          {/* Date Created */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Créé le
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Assigné à
            </label>
            <div className="relative" ref={teamDropdownRef}>
              <button
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setShowTeamDropdown(!showTeamDropdown)}
              >
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  <span className="text-gray-700">
                    {selectedAssignee ? selectedAssignee : "Sélectionner"}
                  </span>
                </div>
                <FiChevronDown className="text-gray-400" />
              </button>
              {showTeamDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {teamMembers.map((member: TeamMember) => (
                    <div
                      key={member.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedAssignee(member.name);
                        setShowTeamDropdown(false);
                      }}
                    >
                      {member.name}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Filter Models */}
          <div className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Modèles de filtres
            </label>
            <div className="relative" ref={filterModelsDropdownRef}>
              <button
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setShowFilterModelsDropdown(!showFilterModelsDropdown)}
              >
                <div className="flex items-center">
                  <FiFilter className="text-gray-400 mr-2" />
                  <span className="text-gray-700">
                    {selectedFilterModel ? selectedFilterModel : "Sélectionner"}
                  </span>
                </div>
                <FiChevronDown className="text-gray-400" />
              </button>
              {showFilterModelsDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filterModels.map((model: FilterModel) => (
                    <div
                      key={model.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedFilterModel(model.name);
                        setShowFilterModelsDropdown(false);
                      }}
                    >
                      {model.name}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <FiRefreshCw className="mr-2" />
              <span>Réinitialiser</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={applyFilters}
              className="flex items-center px-4 py-2 text-white rounded-lg transition text-sm bg-indigo-600 hover:bg-indigo-700"
            >
              <FiFilter className="mr-2" />
              <span>Appliquer le filtre</span>
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFilterExpanded(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;