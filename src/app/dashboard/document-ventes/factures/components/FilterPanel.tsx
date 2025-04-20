'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterStatus, FilterPeriod, statusOptions, periodOptions, clientOptions } from '../types';

interface FilterPanelProps {
  showFilters: boolean;
  selectedStatus: FilterStatus;
  setSelectedStatus: (status: FilterStatus) => void;
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: (period: FilterPeriod) => void;
  selectedClient: string;
  setSelectedClient: (client: string) => void;
  resetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  showFilters,
  selectedStatus,
  setSelectedStatus,
  selectedPeriod,
  setSelectedPeriod,
  selectedClient,
  setSelectedClient,
  resetFilters,
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
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
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;