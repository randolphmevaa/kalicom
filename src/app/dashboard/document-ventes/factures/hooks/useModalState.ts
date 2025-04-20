import { useState, useCallback, useEffect } from 'react';
import { Invoice, sampleInvoices } from '../types/creditNote';

// General hook for managing modal states
export const useModalState = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
};

// Hook for managing tabs (used in invoice modal)
export const useTabState = (initialTab: 'details' | 'echeance' = 'details') => {
  const [activeTab, setActiveTab] = useState<'details' | 'echeance'>(initialTab);

  const setDetailsTab = useCallback(() => setActiveTab('details'), []);
  const setEcheanceTab = useCallback(() => setActiveTab('echeance'), []);
  
  return {
    activeTab,
    setActiveTab,
    setDetailsTab,
    setEcheanceTab
  };
};

// Hook for managing client search and dropdown
export const useClientSelectionState = () => {
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
  const [clientSearch, setClientSearch] = useState<string>('');
  const [clientType, setClientType] = useState<'client' | 'prospect'>('client');
  
  const openDropdown = useCallback(() => setShowClientDropdown(true), []);
  const closeDropdown = useCallback(() => setShowClientDropdown(false), []);
  
  const handleSearchChange = useCallback((value: string) => {
    setClientSearch(value);
    setShowClientDropdown(true);
  }, []);
  
  const setClientTypeAndCloseDropdown = useCallback((type: 'client' | 'prospect') => {
    setClientType(type);
    setShowClientDropdown(false);
  }, []);
  
  return {
    showClientDropdown,
    clientSearch,
    clientType,
    setClientType,
    setClientSearch,
    openDropdown,
    closeDropdown,
    handleSearchChange,
    setClientTypeAndCloseDropdown
  };
};

// Hook for managing invoice search and selection
export const useInvoiceSelection = () => {
  const [invoiceSearch, setInvoiceSearch] = useState<string>('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(sampleInvoices);
  
  // Filter invoices based on search term
  useEffect(() => {
    if (invoiceSearch) {
      setFilteredInvoices(sampleInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        invoice.client.toLowerCase().includes(invoiceSearch.toLowerCase())
      ));
    } else {
      setFilteredInvoices(sampleInvoices);
    }
  }, [invoiceSearch]);
  
  return {
    invoiceSearch,
    setInvoiceSearch,
    filteredInvoices
  };
};

// Hook for managing save confirmation toast
export const useSaveConfirmation = (onClose: () => void) => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  
  const handleSave = useCallback(() => {
    // Show save confirmation briefly
    setShowSaveConfirmation(true);
    
    // In a real app, you would save the document to your backend here
    console.log("Enregistrement effectué");
    
    // Hide confirmation after 1.5 seconds and close modal
    setTimeout(() => {
      setShowSaveConfirmation(false);
      onClose();
    }, 1500);
  }, [onClose]);
  
  return {
    showSaveConfirmation,
    handleSave,
    handleSaveInvoice: handleSave,      // Alias for invoice modal
    handleSaveCreditNote: handleSave    // Alias for credit note modal
  };
};