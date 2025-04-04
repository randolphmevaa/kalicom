'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiFilter, FiRefreshCw, FiDownload } from 'react-icons/fi';

interface ActionsSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  statusOptions: string[];
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  periodOptions: string[];
  selectedClient: string;
  setSelectedClient: (client: string) => void;
  clientOptions: string[];
  resetFilters: () => void;
}

const ActionsSearchBar: FC<ActionsSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  setIsCreateModalOpen,
  showFilters,
  setShowFilters,
  statusOptions,
  selectedStatus,
  setSelectedStatus,
  selectedPeriod,
  setSelectedPeriod,
  periodOptions,
  selectedClient,
  setSelectedClient,
  clientOptions,
  resetFilters,
}) => {
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
            placeholder="Rechercher un avoir d&apos;acompte..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            <FiPlus />
            <span>Cr&eacute;er un avoir d&apos;acompte</span>
          </button>
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
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 p-4 border-t overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">P&eacute;riode</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
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
            <button onClick={resetFilters} className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
              R&eacute;initialiser
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Appliquer les filtres
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActionsSearchBar;
