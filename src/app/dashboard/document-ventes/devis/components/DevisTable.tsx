'use client';
import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence,Variants } from 'framer-motion';
import { 
  FiFileText, 
  FiUser, 
  FiEdit,
  // FiTrash2,
  FiEye,
  FiDownload,
  FiSend,
  FiCalendar,
  FiRefreshCw,
  FiPlus,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

// Types imported from parent component
import type { Devis, DevisStatus, SortField } from '../types';

// Props interface for the DevisTable component
interface DevisTableProps {
  // Data
  devis: Devis[];
  filteredDevis: Devis[];
  sortedDevis: Devis[];
  
  // State
  expandedRow: string | null;
  selectedDevis: string[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  selectAll: boolean;
  
  // Handlers
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (devisId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRowClick: (devisId: string) => void;
  handleSort: (field: SortField) => void;
  transformToInvoice: (ids: string[]) => void;
  resetFilters: () => void;
  
  // Helper functions
  getStatusBadgeColor: (status: DevisStatus) => string;
  getStatusDotColor: (status: DevisStatus) => string;
  
  // Animation variants
  itemVariants: Variants;
}

const DevisTable: React.FC<DevisTableProps> = memo(({
  devis,
  filteredDevis,
  sortedDevis,
  expandedRow,
  selectedDevis,
  sortField,
  sortDirection,
  selectAll,
  handleSelectAll,
  handleCheckboxChange,
  handleRowClick,
  handleSort,
  transformToInvoice,
  resetFilters,
  getStatusBadgeColor,
  getStatusDotColor,
  itemVariants
}) => {
  // Memoize the empty state check to prevent unnecessary renders
  const isEmpty = useMemo(() => filteredDevis.length === 0, [filteredDevis.length]);

  return (
    <motion.div
      variants={itemVariants}
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
                      aria-label="Select all"
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
                  <span>N° devis</span>
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
                onClick={() => handleSort('prospect')}
              >
                <div className="flex items-center space-x-1">
                  <span>Prospect</span>
                  {sortField === 'prospect' && (
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
                onClick={() => handleSort('dateValidite')}
              >
                <div className="flex items-center space-x-1">
                  <span>Validité</span>
                  {sortField === 'dateValidite' && (
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
            {sortedDevis.map((devis) => (
              <React.Fragment key={devis.id}>
                <tr
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    expandedRow === devis.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => handleRowClick(devis.id)}
                >
                  <td
                    className="px-4 py-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 focus:ring-opacity-50 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        checked={selectedDevis.includes(devis.id)}
                        onChange={(e) => handleCheckboxChange(devis.id, e)}
                        aria-label={`Select ${devis.id}`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${getStatusDotColor(
                          devis.statut
                        )}`}
                        aria-hidden="true"
                      ></div>
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: '#1B0353' }}
                        >
                          {devis.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="flex items-center">
                            <FiUser className="mr-1" size={12} aria-hidden="true" />
                            {devis.creePar}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {devis.date}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {devis.prospect}
                    </div>
                    <div className="text-xs text-gray-500">
                      {devis.typeDevis}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {devis.montantHT}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {devis.montantTTC}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full inline-flex items-center ${getStatusBadgeColor(
                        devis.statut
                      )}`}
                    >
                      {devis.statut}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" size={12} aria-hidden="true" />
                      {devis.dateValidite}
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
                        aria-label="Voir"
                      >
                        <FiEye size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                        style={{ color: '#1B0353' }}
                        title="Modifier"
                        aria-label="Modifier"
                      >
                        <FiEdit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                        title="Transformer en facture"
                        aria-label="Transformer en facture"
                        onClick={() => transformToInvoice([devis.id])}
                      >
                        <FiPlus size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                        title="Télécharger"
                        aria-label="Télécharger"
                      >
                        <FiDownload size={18} />
                      </motion.button>
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                          title="Plus d'options"
                          aria-label="Plus d'options"
                        >
                          <FiMoreVertical size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Expanded row details */}
                <AnimatePresence>
                  {expandedRow === devis.id && (
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
                              Détails du devis
                            </div>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">Statut</div>
                                <div className="font-medium">
                                  {devis.statut}
                                </div>
                                <div className="text-gray-500">Date d&apos;acceptation</div>
                                <div className="font-medium">
                                  {devis.dateAcceptation || 'Non défini'}
                                </div>
                                <div className="text-gray-500">Type</div>
                                <div className="font-medium">
                                  {devis.typeDevis}
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
                                  {devis.montantHT}
                                </div>
                                <div className="text-gray-500">TVA</div>
                                <div className="font-medium">20%</div>
                                <div className="text-gray-500">
                                  Montant TTC
                                </div>
                                <div className="font-medium">
                                  {devis.montantTTC}
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
                                {devis.notes || 'Aucune note'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-end mt-4 gap-2">
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
                            onClick={() => transformToInvoice([devis.id])}
                          >
                            <FiPlus size={12} />
                            <span>Transformer en facture</span>
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
      {isEmpty && (
        <div className="text-center py-16">
          <div className="bg-gray-100 mx-auto h-16 w-16 flex items-center justify-center rounded-full">
            <FiFileText className="h-8 w-8 text-gray-400" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Aucun devis trouvé
          </h3>
          <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
            Aucun devis ne correspond à vos critères de recherche.
          </p>
          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              style={{ backgroundColor: '#1B0353' }}
            >
              <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Réinitialiser les filtres
            </motion.button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isEmpty && (
        <div
          className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{' '}
              <span className="font-medium">
                {filteredDevis.length}
              </span>{' '}
              sur <span className="font-medium">{devis.length}</span>{' '}
              devis
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
              disabled={true} // Add real pagination logic
            >
              Précédent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
              disabled={false} // Add real pagination logic
            >
              Suivant
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
});

DevisTable.displayName = 'DevisTable';

export default DevisTable;