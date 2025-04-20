'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Invoice, SortDirection, SortField } from '../../types';
import TableHeader from './TableHeader';
import InvoiceRow from './InvoiceRow';
import EmptyState from './EmptyState';
import Pagination from '../Pagination';

interface InvoicesTableProps {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  selectAll: boolean;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedInvoices: string[];
  handleCheckboxChange: (invoiceId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  resetFilters: () => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  filteredInvoices,
  sortField,
  sortDirection,
  handleSort,
  selectAll,
  handleSelectAll,
  selectedInvoices,
  handleCheckboxChange,
  resetFilters,
}) => {
  // State for expanded row
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Toggle row expansion
  const handleRowClick = (invoiceId: string) => {
    setExpandedRow((prev) => (prev === invoiceId ? null : invoiceId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                selectedInvoices={selectedInvoices}
                handleCheckboxChange={handleCheckboxChange}
                expandedRow={expandedRow}
                handleRowClick={handleRowClick}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredInvoices.length === 0 && (
        <EmptyState resetFilters={resetFilters} />
      )}

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <Pagination 
          totalItems={invoices.length}
          filteredItems={filteredInvoices.length}
        />
      )}
    </motion.div>
  );
};

export default InvoicesTable;