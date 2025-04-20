import { useState, useCallback, ChangeEvent } from 'react';
import { Invoice } from '../types';

interface UseInvoiceSelectionProps {
  invoices: Invoice[];
}

interface UseInvoiceSelectionReturn {
  selectedInvoices: string[];
  selectAll: boolean;
  handleSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (invoiceId: string, e: ChangeEvent<HTMLInputElement>) => void;
  clearSelection: () => void;
}

export const useInvoiceSelection = ({ invoices }: UseInvoiceSelectionProps): UseInvoiceSelectionReturn => {
  // Selected invoices for bulk actions
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Handle "select all" checkbox
  const handleSelectAll = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    
    if (isChecked) {
      // Select all invoices
      setSelectedInvoices(invoices.map((invoice) => invoice.id));
    } else {
      // Deselect all
      setSelectedInvoices([]);
    }
  }, [invoices]);

  // Handle individual invoice checkbox
  const handleCheckboxChange = useCallback((invoiceId: string, e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent row click/expansion
    const isChecked = e.target.checked;

    setSelectedInvoices((prev) => {
      if (isChecked) {
        // Add this ID to selected
        return [...prev, invoiceId];
      } else {
        // Remove this ID from selected
        return prev.filter((id) => id !== invoiceId);
      }
    });

    // If a checkbox is manually changed, "select all" is no longer valid
    setSelectAll(false);
  }, []);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedInvoices([]);
    setSelectAll(false);
  }, []);

  return {
    selectedInvoices,
    selectAll,
    handleSelectAll,
    handleCheckboxChange,
    clearSelection,
  };
};