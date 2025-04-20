'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiRefreshCw } from 'react-icons/fi';

interface EmptyStateProps {
  resetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ resetFilters }) => {
  return (
    <div className="text-center py-16">
      <div className="bg-gray-100 mx-auto h-16 w-16 flex items-center justify-center rounded-full">
        <FiFileText className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        Aucune facture trouvée
      </h3>
      <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
        Aucune facture ne correspond à vos critères de recherche.
      </p>
      <div className="mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetFilters}
          className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          style={{ backgroundColor: '#1B0353' }}
        >
          <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
          Réinitialiser les filtres
        </motion.button>
      </div>
    </div>
  );
};

export default EmptyState;