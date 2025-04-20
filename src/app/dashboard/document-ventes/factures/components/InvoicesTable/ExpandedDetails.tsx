'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiDownload, FiEdit } from 'react-icons/fi';
import { Invoice } from '../../types';

interface ExpandedDetailsProps {
  invoice: Invoice;
}

const ExpandedDetails: React.FC<ExpandedDetailsProps> = ({ invoice }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-indigo-50"
    >
      <td colSpan={9} className="px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">
              Détails de paiement
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Mode</div>
                <div className="font-medium">
                  {invoice.modeReglement || 'Non défini'}
                </div>
                <div className="text-gray-500">Date</div>
                <div className="font-medium">
                  {invoice.dateReglement || 'Non défini'}
                </div>
                <div className="text-gray-500">État</div>
                <div className="font-medium">
                  {invoice.statut}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">
              Montants
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">
                  Montant HT
                </div>
                <div className="font-medium">
                  {invoice.montantHT}
                </div>
                <div className="text-gray-500">TVA</div>
                <div className="font-medium">20%</div>
                <div className="text-gray-500">
                  Montant TTC
                </div>
                <div className="font-medium">
                  {invoice.montantTTC}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500">
              Notes
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm h-full">
              <p className="text-sm">
                {invoice.notes || 'Aucune note'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 text-xs border border-indigo-300 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center space-x-1"
          >
            <FiSend size={12} />
            <span>Envoyer</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 text-xs border border-green-300 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center space-x-1"
          >
            <FiDownload size={12} />
            <span>Télécharger</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-3 py-1.5 text-xs border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center space-x-1"
          >
            <FiEdit size={12} />
            <span>Modifier</span>
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ExpandedDetails;