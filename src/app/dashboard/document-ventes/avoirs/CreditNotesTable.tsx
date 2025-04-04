// CreditNotesTable.tsx
'use client';
import React from 'react';
import { FiFileText, FiUser, FiLink, FiEye, FiEdit, FiDownload, FiMoreVertical, FiRefreshCw } from 'react-icons/fi';

export type CreditNote = {
  id: string;
  date: string;
  client: string;
  montant: string;
  statut: string;
  facture: string;
  creePar: string;
  notes: string;
};

export type CreditNotesTableProps = {
  creditNotes: CreditNote[];
  filteredNotes: CreditNote[]; // required prop
  selectAll: boolean;
  handleSelectAll: () => void;
  selectedNotes: string[];
  handleSelectNote: (noteId: string) => void;
  getStatusBadgeColor: (status: string) => string;
  resetFilters: () => void;
  // Extra props added:
  setSelectedStatus?: (value: string) => void;
  setSelectedClient?: (value: string) => void;
  setShowFilters?: (value: boolean) => void;
  showFilters?: boolean;
  showCreateCreditNoteModal?: boolean;
  handleOpenCreateCreditNoteModal?: () => void;
};


export default function CreditNotesTable({
  creditNotes,
  filteredNotes,
  selectAll,
  handleSelectAll,
  selectedNotes,
  handleSelectNote,
  getStatusBadgeColor,
  resetFilters
}: CreditNotesTableProps): React.JSX.Element {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                N° avoir
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Client
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Montant
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Facture liée
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
            {filteredNotes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => handleSelectNote(note.id)}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-600">{note.id}</div>
                  <div className="text-xs text-gray-500">
                    <span className="flex items-center">
                      <FiUser className="mr-1" size={12} />
                      {note.creePar}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{note.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{note.client}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{note.montant}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(note.statut)}`}>
                    {note.statut}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-indigo-600">
                  <div className="flex items-center">
                    <FiLink className="mr-1" size={12} />
                    {note.facture}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="p-1 text-indigo-600 hover:text-indigo-900" title="Voir">
                      <FiEye size={18} />
                    </button>
                    <button className="p-1 text-blue-600 hover:text-blue-900" title="Modifier">
                      <FiEdit size={18} />
                    </button>
                    <button className="p-1 text-green-600 hover:text-green-900" title="Télécharger">
                      <FiDownload size={18} />
                    </button>
                    <div className="relative">
                      <button className="p-1 text-gray-600 hover:text-gray-900" title="Plus d'options">
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun avoir trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun avoir ne correspond à vos critères de recherche.
          </p>
          <div className="mt-6">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiRefreshCw className="-ml-1 mr-2 h-5 w-5" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à{' '}
            <span className="font-medium">{filteredNotes.length}</span> sur{' '}
            <span className="font-medium">{creditNotes.length}</span> avoirs
          </p>
        </div>
        <div className="flex-1 flex justify-between sm:justify-end">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Précédent
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Suivant
          </button>
        </div>
      </nav>
    </div>
  );
}
