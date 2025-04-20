'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit, 
  FiDownload, 
  FiMoreVertical, 
  FiEye,
  FiUser,
  FiCalendar,
//   FiSend
} from 'react-icons/fi';
import { Invoice } from '../../types';
import { getStatusBadgeColor, getStatusDotColor } from '../../utils/statusHelpers';
import ExpandedDetails from './ExpandedDetails';

interface InvoiceRowProps {
  invoice: Invoice;
  selectedInvoices: string[];
  handleCheckboxChange: (invoiceId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  expandedRow: string | null;
  handleRowClick: (invoiceId: string) => void;
}

const InvoiceRow: React.FC<InvoiceRowProps> = ({
  invoice,
  selectedInvoices,
  handleCheckboxChange,
  expandedRow,
  handleRowClick,
}) => {
  return (
    <React.Fragment>
      <tr
        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
          expandedRow === invoice.id ? 'bg-indigo-50' : ''
        }`}
        onClick={() => handleRowClick(invoice.id)}
      >
        <td
          className="px-4 py-4 whitespace-nowrap"
          // Stop row click from toggling expansion
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
              checked={selectedInvoices.includes(invoice.id)}
              onChange={(e) => handleCheckboxChange(invoice.id, e)}
            />
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${getStatusDotColor(
                invoice.statut
              )}`}
            ></div>
            <div>
              <div
                className="text-sm font-medium"
                style={{ color: '#1B0353' }}
              >
                {invoice.id}
              </div>
              <div className="text-xs text-gray-500">
                <span className="flex items-center">
                  <FiUser className="mr-1" size={12} />
                  {invoice.creePar}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {invoice.date}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {invoice.client}
          </div>
          <div className="text-xs text-gray-500">
            {invoice.typeFacture}
          </div>
        </td>
        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          {invoice.montantHT}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {invoice.montantTTC}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <span
            className={`px-2.5 py-1 text-xs rounded-full inline-flex items-center ${getStatusBadgeColor(
              invoice.statut
            )}`}
          >
            {invoice.statut}
          </span>
        </td>
        <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
          <span className="flex items-center">
            <FiCalendar className="mr-1" size={12} />
            {invoice.dateEcheance}
          </span>
        </td>
        <td
          className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              style={{ color: '#1B0353' }}
              title="Voir"
            >
              <FiEye size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
              style={{ color: '#1B0353' }}
              title="Modifier"
            >
              <FiEdit size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
              title="Télécharger"
            >
              <FiDownload size={18} />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                title="Plus d'options"
              >
                <FiMoreVertical size={18} />
              </motion.button>
            </div>
          </div>
        </td>
      </tr>

      {/* Expanded row details */}
      <AnimatePresence>
        {expandedRow === invoice.id && (
          <ExpandedDetails invoice={invoice} />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default InvoiceRow;