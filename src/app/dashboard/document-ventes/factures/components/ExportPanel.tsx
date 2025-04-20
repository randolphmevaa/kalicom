'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportFormat } from '../types';

interface ExportPanelProps {
  showDateRangePicker: boolean;
  setShowDateRangePicker: (show: boolean) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  showDateRangePicker,
  setShowDateRangePicker,
}) => {
  // State for export options
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  // Handle export action
  const handleExport = () => {
    // Implement your export logic here
    console.log(`Exporting invoices from ${startDate} to ${endDate} in ${exportFormat} format`);
    
    // Close the panel after export
    setShowDateRangePicker(false);
  };

  return (
    <AnimatePresence>
      {showDateRangePicker && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-6 overflow-hidden border-t pt-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois complet
              </label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all">
                <option value="">Sélectionner un mois</option>
                <option value="01/2025">Janvier 2025</option>
                <option value="02/2025">Février 2025</option>
                <option value="03/2025">Mars 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <div className="flex space-x-2">
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'pdf'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor:
                      exportFormat === 'pdf' ? '#1B0353' : '',
                  }}
                  onClick={() => setExportFormat('pdf')}
                >
                  PDF
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'csv'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor:
                      exportFormat === 'csv' ? '#1B0353' : '',
                  }}
                  onClick={() => setExportFormat('csv')}
                >
                  CSV
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all ${
                    exportFormat === 'excel'
                      ? 'border-transparent text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor:
                      exportFormat === 'excel' ? '#1B0353' : '',
                  }}
                  onClick={() => setExportFormat('excel')}
                >
                  Excel
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDateRangePicker(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow-md transition-all"
              style={{ backgroundColor: '#1B0353' }}
            >
              Exporter
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportPanel;