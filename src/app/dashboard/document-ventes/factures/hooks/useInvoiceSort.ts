import { useState, useMemo } from 'react';
import { Invoice, SortField, SortDirection } from '../types';
import { parseCurrency } from '../utils/formatters';

interface UseInvoiceSortProps {
  invoices: Invoice[];
}

interface UseInvoiceSortReturn {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  sortedInvoices: Invoice[];
}

export const useInvoiceSort = ({ invoices }: UseInvoiceSortProps): UseInvoiceSortReturn => {
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Helper function to get sortable value from an invoice
  const getSortValue = (invoice: Invoice, field: SortField): string => {
    return invoice[field];
  };

  // Handle sort column change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, toggle direction
      setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      // If clicking a new field, set it and default to asc
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Memoized sorted invoices
  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => {
      let aValue = getSortValue(a, sortField);
      let bValue = getSortValue(b, sortField);

      // If sorting by montants, convert currency strings to numbers
      if (sortField === 'montantHT' || sortField === 'montantTTC') {
        aValue = String(parseCurrency(aValue));
        bValue = String(parseCurrency(bValue));
      }

      if (aValue === bValue) {
        // Fallback sort by ID to keep consistent ordering
        return a.id.localeCompare(b.id);
      }

      // Apply sort direction
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [invoices, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedInvoices,
  };
};