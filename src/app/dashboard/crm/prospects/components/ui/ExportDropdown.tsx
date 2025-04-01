'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText } from 'react-icons/fi';

// Define props interface
interface ExportDropdownProps {
  showAbove: boolean;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

// This component is responsible for rendering the export dropdown menu
// It's optimized with motion animations and properly handles upward/downward positioning
const ExportDropdown = React.memo<ExportDropdownProps>(({ 
  showAbove,
  onExportCSV,
  onExportPDF
}) => {
  return (
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
        onClick={onExportCSV}
      >
        <FiDownload className="w-4 h-4" />
        <span>Exporter en CSV</span>
      </motion.button>
      <motion.button
        whileHover={{ backgroundColor: "rgba(75, 178, 246, 0.1)" }}
        className="w-full flex items-center gap-2 px-4 py-3 text-[#004AC8] text-sm font-medium text-left hover:bg-blue-50"
        onClick={onExportPDF}
      >
        <FiFileText className="w-4 h-4" />
        <span>Exporter en PDF</span>
      </motion.button>
    </motion.div>
  );
});

// Add a display name to help with debugging and React DevTools
ExportDropdown.displayName = 'ExportDropdown';

export default ExportDropdown;