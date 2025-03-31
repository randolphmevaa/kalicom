'use client';

// Pagination.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiInfo } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  setCurrentPage
}) => {
  return (
    <motion.div 
      className="flex items-center justify-between bg-white bg-opacity-95 backdrop-blur-sm p-5 rounded-xl border border-[#4BB2F6] border-opacity-20"
      style={{ 
        boxShadow: "0 10px 15px -3px rgba(27, 3, 83, 0.05), 0 4px 6px -2px rgba(27, 3, 83, 0.01)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div>
        <p className="text-sm text-[#1B0353] flex items-center">
          <span className="bg-[#4BB2F6] bg-opacity-10 text-[#1B0353] p-1 rounded-md shadow-sm mr-2 flex items-center justify-center">
            <FiInfo className="w-4 h-4" />
          </span>
          Affichage de{" "}
          <span className="font-bold mx-1 text-[#004AC8]">{(currentPage - 1) * itemsPerPage + 1}</span> à{" "}
          <span className="font-bold mx-1 text-[#004AC8]">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{" "}
          sur <span className="font-bold mx-1 text-[#004AC8]">{totalItems}</span> résultats
        </p>
      </div>
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white hover:shadow-md"
          }`}
        >
          <FiArrowRight className="w-4 h-4 mr-1 transform rotate-180" /> Précédent
        </motion.button>
        
        {/* Page numbers with elegant design and brand colors */}
        <div className="hidden sm:flex space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg font-medium shadow-sm transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-gradient-to-r from-[#004AC8] to-[#1B0353] text-white"
                  : "bg-white border border-[#4BB2F6] border-opacity-30 text-[#1B0353] hover:border-[#004AC8]"
              }`}
              style={currentPage === i + 1 ? { boxShadow: "0 4px 10px rgba(27, 3, 83, 0.3)" } : {}}
            >
              {i + 1}
            </motion.button>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-5 py-2 text-sm rounded-lg font-medium flex items-center shadow-sm transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white hover:shadow-md"
          }`}
        >
          Suivant <FiArrowRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Pagination;