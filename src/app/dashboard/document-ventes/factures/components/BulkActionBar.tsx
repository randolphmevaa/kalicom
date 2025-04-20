'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPrinter, FiTrash2 } from 'react-icons/fi';

interface BulkActionBarProps {
  selectedInvoices: string[];
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedInvoices }) => {
  // Handlers for bulk actions
  const handleBulkEmail = () => {
    console.log(`Sending email for ${selectedInvoices.length} invoices`);
  };

  const handleBulkPrint = () => {
    console.log(`Printing ${selectedInvoices.length} invoices`);
  };

  const handleBulkDelete = () => {
    console.log(`Deleting ${selectedInvoices.length} invoices`);
  };

  return (
    <AnimatePresence>
      {selectedInvoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 md:p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 border-2 shadow-md"
          style={{
            backgroundColor: 'rgba(27, 3, 83, 0.03)',
            borderColor: 'rgba(27, 3, 83, 0.2)',
          }}
        >
          <div className="font-medium" style={{ color: '#1B0353' }}>
            <span className="text-lg font-semibold">
              {selectedInvoices.length}
            </span>{' '}
            facture(s) sélectionnée(s)
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
              style={{ backgroundColor: '#1B0353' }}
              onClick={handleBulkEmail}
            >
              <FiSend size={16} />
              <span>Envoyer par email</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2"
              style={{ backgroundColor: '#1B0353' }}
              onClick={handleBulkPrint}
            >
              <FiPrinter size={16} />
              <span>Imprimer</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md hover:bg-red-700 transition-all flex items-center space-x-2"
              onClick={handleBulkDelete}
            >
              <FiTrash2 size={16} />
              <span>Supprimer</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBar;