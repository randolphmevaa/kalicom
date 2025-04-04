// InvoicesTable.tsx
'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiUser, FiCalendar, FiEye, FiEdit, FiDownload, FiMoreVertical, FiRefreshCw, FiFileText } from 'react-icons/fi';

interface Invoice {
  id: string;
  date: string;
  client: string;
  montantHT: string;
  montantTTC: string;
  statut: string;
  dateEcheance: string;
  dateReglement: string | null;
  modeReglement: string | null;
  creePar: string;
  typeFacture: string;
  notes: string;
}

interface InvoicesTableProps {
  sortedInvoices: Invoice[];
  selectAll: boolean;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSort: (field: 'id' | 'date' | 'client' | 'montantHT' | 'montantTTC' | 'statut' | 'dateEcheance') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  expandedRow: string | null;
  handleRowClick: (invoiceId: string) => void;
  selectedInvoices: string[];
  handleCheckboxChange: (invoiceId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  getStatusDotColor: (status: string) => string;
  getStatusBadgeColor: (status: string) => string;
  resetFilters: () => void;
  filteredInvoices: Invoice[];
  invoices: Invoice[];
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  sortedInvoices,
  selectAll,
  handleSelectAll,
  handleSort,
  sortField,
  sortDirection,
  expandedRow,
  handleRowClick,
  selectedInvoices,
  handleCheckboxChange,
  getStatusDotColor,
  getStatusBadgeColor,
  resetFilters,
  filteredInvoices,
  invoices,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </div>
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>N° facture</span>
                  {sortField === 'id' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === 'date' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center space-x-1">
                  <span>Client</span>
                  {sortField === 'client' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('montantHT')}
              >
                <div className="flex items-center space-x-1">
                  <span>Montant HT</span>
                  {sortField === 'montantHT' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('montantTTC')}
              >
                <div className="flex items-center space-x-1">
                  <span>Montant TTC</span>
                  {sortField === 'montantTTC' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('statut')}
              >
                <div className="flex items-center space-x-1">
                  <span>Statut</span>
                  {sortField === 'statut' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('dateEcheance')}
              >
                <div className="flex items-center space-x-1">
                  <span>Échéance</span>
                  {sortField === 'dateEcheance' && (
                    <span>
                      {sortDirection === 'asc' ? (
                        <FiArrowUp size={14} />
                      ) : (
                        <FiArrowDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                <tr
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    expandedRow === invoice.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => handleRowClick(invoice.id)}
                >
                  <td
                    className="px-4 py-4 whitespace-nowrap"
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
                        <div className="text-sm font-medium" style={{ color: '#1B0353' }}>
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
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-indigo-50"
                    >
                      <td colSpan={9} className="px-4 py-4">
                        {/* Details content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Payment Details */}
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
                          {/* Amount Details */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-500">
                              Montants
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">Montant HT</div>
                                <div className="font-medium">
                                  {invoice.montantHT}
                                </div>
                                <div className="text-gray-500">TVA</div>
                                <div className="font-medium">20%</div>
                                <div className="text-gray-500">Montant TTC</div>
                                <div className="font-medium">
                                  {invoice.montantTTC}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Notes */}
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
                            <FiRefreshCw size={12} />
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
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredInvoices.length === 0 && (
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
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#1B0353' }}
            >
              <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
              Réinitialiser les filtres
            </motion.button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <div
          className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{' '}
              <span className="font-medium">{filteredInvoices.length}</span> sur{' '}
              <span className="font-medium">{invoices.length}</span> factures
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              Suivant
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InvoicesTable;
