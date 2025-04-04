// ActionsSearchBar.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';

export type ActionsSearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleOpenCreateCreditNoteModal: () => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  resetFilters: () => void;
  statusOptions: string[];
  periodOptions: string[];
  clientOptions: string[];
};

export default function ActionsSearchBar({
  searchTerm,
  setSearchTerm,
  handleOpenCreateCreditNoteModal,
  showFilters,
  setShowFilters,
  selectedStatus,
  setSelectedStatus,
  selectedPeriod,
  setSelectedPeriod,
  selectedClient,
  setSelectedClient,
  resetFilters,
  statusOptions,
  periodOptions,
  clientOptions,
}: ActionsSearchBarProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Search */}
        <div className="w-full md:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un avoir..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-1 px-4 py-2.5 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: '#1B0353' }}
            onClick={handleOpenCreateCreditNoteModal}
          >
            <FiPlus />
            <span>Créer un avoir</span>
          </motion.button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
          >
            <FiFilter />
            <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
            <FiRefreshCw />
            <span className="hidden md:inline">Actualiser</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
            <FiDownload />
            <span className="hidden md:inline">Exporter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 p-4 border-t overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {periodOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
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

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={resetFilters}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Réinitialiser
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Appliquer les filtres
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
