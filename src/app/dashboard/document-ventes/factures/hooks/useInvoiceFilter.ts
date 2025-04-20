import { useState, useMemo } from 'react';
import { 
  Invoice, 
  FilterStatus, 
  FilterPeriod
} from '../types';

interface UseInvoiceFilterProps {
  invoices: Invoice[];
}

interface UseInvoiceFilterReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: FilterStatus;
  setSelectedStatus: (status: FilterStatus) => void;
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: (period: FilterPeriod) => void;
  selectedClient: string;
  setSelectedClient: (client: string) => void;
  filteredInvoices: Invoice[];
  resetFilters: () => void;
  clearSearch: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const useInvoiceFilter = ({ invoices }: UseInvoiceFilterProps): UseInvoiceFilterReturn => {
  // Filter UI state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Search input
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter selectors
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('Tous');
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('Tous');
  const [selectedClient, setSelectedClient] = useState<string>('Tous');

  // Reset all filters to default values
  const resetFilters = () => {
    setSelectedStatus('Tous');
    setSelectedPeriod('Tous');
    setSelectedClient('Tous');
    setSearchTerm('');
  };

  // Just clear the search term
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Memoized filtered invoices based on current filter state
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Filter by search term (case insensitive)
      const matchesSearch =
        !searchTerm ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.montantTTC.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by selected status
      const matchesStatus =
        selectedStatus === 'Tous' || invoice.statut === selectedStatus;

      // Filter by selected client
      const matchesClient =
        selectedClient === 'Tous' || invoice.client === selectedClient;

      // Filter by selected period
      // In a real app, you'd implement actual date range checking here
      // For simplicity we'll just return true unless it's 'Tous'
      const matchesPeriod = selectedPeriod === 'Tous' || true;

      // Invoice must match all active filters
      return matchesSearch && matchesStatus && matchesClient && matchesPeriod;
    });
  }, [invoices, searchTerm, selectedStatus, selectedClient, selectedPeriod]);

  return {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedPeriod,
    setSelectedPeriod,
    selectedClient,
    setSelectedClient,
    filteredInvoices,
    resetFilters,
    clearSearch,
    showFilters,
    setShowFilters,
  };
};