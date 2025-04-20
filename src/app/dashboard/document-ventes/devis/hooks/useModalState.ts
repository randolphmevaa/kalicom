import { useState, useCallback } from 'react';

// General hook for managing modal states
export const useModalState = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
};

// Specific hooks for each modal in our application
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

// Hook for managing save confirmation toast
export const useSaveConfirmation = (onClose: () => void) => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  
  const handleSaveQuote = useCallback(() => {
    // Show save confirmation briefly
    setShowSaveConfirmation(true);
    
    // In a real app, you would save the quote to your backend here
    console.log("Enregistrement du devis effectué");
    
    // Hide confirmation after 1.5 seconds and close modal
    setTimeout(() => {
      setShowSaveConfirmation(false);
      onClose();
    }, 1500);
  }, [onClose]);
  
  return {
    showSaveConfirmation,
    handleSaveQuote
  };
};
