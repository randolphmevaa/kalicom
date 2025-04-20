'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PaginationProps {
  totalItems: number;
  filteredItems: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  filteredItems,
  currentPage = 1,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Affichage de <span className="font-medium">1</span> à{' '}
          <span className="font-medium">
            {filteredItems}
          </span>{' '}
          sur <span className="font-medium">{totalItems}</span>{' '}
          factures
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Précédent
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
        >
          Suivant
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;