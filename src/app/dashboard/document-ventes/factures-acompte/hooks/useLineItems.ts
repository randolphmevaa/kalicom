// hooks/useLineItems.ts
import { useState } from 'react';
import { LineItem, Article } from '../types';
import { calculateLineItemAmount } from '../utils/calculations';

const useLineItems = () => {
  // State for the line items in the invoice
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { 
      id: 1, 
      codeArticle: '', 
      description: 'Acompte sur projet', 
      quantite: 1, 
      codeUnite: 'forfait', 
      pvHT: '0.00', 
      remise: '0.00', 
      montantNetHT: '0.00', 
      tva: '20.00' 
    }
  ]);

  // State for showing article selection modal
  const [showArticleModal, setShowArticleModal] = useState<boolean>(false);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // Handle line item changes
  const handleLineItemChange = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Add a new line item
  const addLineItem = (): void => {
    const newId = lineItems.length > 0 ? Math.max(...lineItems.map(item => item.id)) + 1 : 1;
    setLineItems(prev => [
      ...prev, 
      { 
        id: newId, 
        codeArticle: '', 
        description: 'Ajustement ligne', 
        quantite: 1, 
        codeUnite: 'forfait', 
        pvHT: '0.00', 
        remise: '0.00', 
        montantNetHT: '0.00', 
        tva: '20.00' 
      }
    ]);
  };

  // Remove a line item
  const removeLineItem = (id: number): void => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };
  
  // Open article selection modal for a specific line
  const openArticleSelection = (id: number): void => {
    setSelectedLineId(id);
    setShowArticleModal(true);
  };
  
  // Select an article and add it to the line item
  const selectArticle = (article: Article): void => {
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
      setShowArticleModal(false);
    }
  };

  // Update montantNetHT for all line items
  const updateLineItemAmounts = () => {
    setLineItems(prev => 
      prev.map(item => ({
        ...item,
        montantNetHT: calculateLineItemAmount(item)
      }))
    );
  };

  return {
    lineItems,
    setLineItems,
    showArticleModal,
    setShowArticleModal,
    selectedLineId,
    handleLineItemChange,
    addLineItem,
    removeLineItem,
    openArticleSelection,
    selectArticle,
    updateLineItemAmounts
  };
};

export default useLineItems;