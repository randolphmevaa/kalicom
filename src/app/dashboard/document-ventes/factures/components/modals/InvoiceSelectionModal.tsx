import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { Invoice } from '../../types/creditNote';

interface InvoiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceSearch: string;
  onSearchChange: (value: string) => void;
  filteredInvoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
}

const InvoiceSelectionModal: React.FC<InvoiceSelectionModalProps> = ({
  isOpen,
  onClose,
  invoiceSearch,
  onSearchChange,
  filteredInvoices,
  onSelectInvoice
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-xl shadow-xl w-full max-w-lg m-4 z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">
            Sélectionner une facture
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all pl-10 text-gray-800"
                placeholder="Rechercher une facture..."
                value={invoiceSearch}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            <div className="space-y-2">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectInvoice(invoice)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-900">{invoice.id}</div>
                      <div className="text-sm font-bold">{invoice.montantTTC}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-500">{invoice.client}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{invoice.date}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          invoice.statut === 'Payée' 
                            ? 'bg-green-100 text-green-800' 
                            : invoice.statut === 'En attente'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.statut}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  Aucune facture trouvée
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
            >
              Annuler
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default memo(InvoiceSelectionModal);