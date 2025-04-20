'use client';

import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { SortField, SortDirection } from '../../types';

interface TableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  selectAll: boolean;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  sortField,
  sortDirection,
  handleSort,
  selectAll,
  handleSelectAll,
}) => {
  // Helper function to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? (
        <FiArrowUp size={14} />
      ) : (
        <FiArrowDown size={14} />
      );
    }
    return null;
  };

  return (
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
            {renderSortIndicator('id')}
          </div>
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('date')}
        >
          <div className="flex items-center space-x-1">
            <span>Date</span>
            {renderSortIndicator('date')}
          </div>
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('client')}
        >
          <div className="flex items-center space-x-1">
            <span>Client</span>
            {renderSortIndicator('client')}
          </div>
        </th>
        <th
          scope="col"
          className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('montantHT')}
        >
          <div className="flex items-center space-x-1">
            <span>Montant HT</span>
            {renderSortIndicator('montantHT')}
          </div>
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('montantTTC')}
        >
          <div className="flex items-center space-x-1">
            <span>Montant TTC</span>
            {renderSortIndicator('montantTTC')}
          </div>
        </th>
        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('statut')}
        >
          <div className="flex items-center space-x-1">
            <span>Statut</span>
            {renderSortIndicator('statut')}
          </div>
        </th>
        <th
          scope="col"
          className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => handleSort('dateEcheance')}
        >
          <div className="flex items-center space-x-1">
            <span>Échéance</span>
            {renderSortIndicator('dateEcheance')}
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
  );
};

export default TableHeader;