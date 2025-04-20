import { useState, useCallback, useMemo } from 'react';
import { LineItem, Article } from '../types';

export const useLineItems = () => {
  // State for the line items in the invoice
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { 
      id: 1, 
      codeArticle: '', 
      description: '', 
      quantite: 1, 
      codeUnite: 'h', 
      pvHT: '0.00', 
      remise: '0.00', 
      montantNetHT: '0.00', 
      tva: '20.00' 
    }
  ]);

  // State for article selection modal
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Calculate line item amount - pure function
  const calculateLineItemAmount = useCallback((item: LineItem): string => {
    const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite || 0;
    const price = parseFloat(item.pvHT) || 0;
    const discount = parseFloat(item.remise) || 0;
    
    const grossAmount = quantity * price;
    const discountAmount = grossAmount * (discount / 100);
    const netAmount = grossAmount - discountAmount;
    
    return netAmount.toFixed(2);
  }, []);

  // Handle line item changes
  const handleLineItemChange = useCallback((id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  // Add a new line item
  const addLineItem = useCallback((): void => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map(item => item.id)) + 1 : 1;
    setLineItems(prev => [
      ...prev, 
      { 
        id: newId, 
        codeArticle: '', 
        description: '', 
        quantite: 1, 
        codeUnite: 'h', 
        pvHT: '0.00', 
        remise: '0.00', 
        montantNetHT: '0.00', 
        tva: '20.00' 
      }
    ]);
  }, [lineItems]);

  // Remove a line item
  const removeLineItem = useCallback((id: number): void => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  // Open article selection modal for a specific line
  const openArticleSelection = useCallback((id: number): void => {
    setSelectedLineId(id);
  }, []);
  
  // Select an article and add it to the line item
  const selectArticle = useCallback((article: Article): void => {
    if (selectedLineId !== null) {
      setLineItems(prev => 
        prev.map(item => 
          item.id === selectedLineId ? { 
            ...item,
            codeArticle: article.code,
            description: article.desc,
            pvHT: article.prix,
            codeUnite: article.unite,
            tva: article.tva
          } : item
        )
      );
    }
  }, [selectedLineId]);

  // Update line items with calculated montantNetHT values
  const updateLineItemsWithCalculatedAmounts = useCallback(() => {
    const updatedLineItems = lineItems.map(item => ({
      ...item,
      montantNetHT: calculateLineItemAmount(item)
    }));
    
    // Only update if they've actually changed to prevent loops
    const hasLineItemsChanged = JSON.stringify(updatedLineItems) !== JSON.stringify(lineItems);
    
    if (hasLineItemsChanged) {
      setLineItems(updatedLineItems);
    }
  }, [lineItems, calculateLineItemAmount]);

  // Memoized dependencies for useEffect
  const lineItemsDependencies = useMemo(() => ({
    prices: lineItems.map(item => item.pvHT).join(','),
    quantities: lineItems.map(item => item.quantite).join(','),
    discounts: lineItems.map(item => item.remise).join(','),
  }), [lineItems]);

  return {
    lineItems,
    setLineItems,
    selectedLineId,
    setSelectedLineId,
    calculateLineItemAmount,
    handleLineItemChange,
    addLineItem,
    removeLineItem,
    openArticleSelection,
    selectArticle,
    updateLineItemsWithCalculatedAmounts,
    lineItemsDependencies
  };
};