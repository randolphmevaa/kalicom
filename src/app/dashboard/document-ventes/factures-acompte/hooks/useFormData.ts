// hooks/useFormData.ts
import { useState, ChangeEvent } from 'react';
import { FormData, LineItem, Totals } from '../types';
import { calculateDepositFromPercentage, calculatePercentageFromDeposit } from '../utils/calculations';

const useFormData = (
  setLineItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
  setTotals: React.Dispatch<React.SetStateAction<Totals>>
) => {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    numero: 'FA-2025-008',
    codeTiers: '',
    civilite: '',
    nom: '',
    prenom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    reference: '',
    projetLie: '',
    montantTotal: '0.00',
    pourcentageAcompte: '30',
    montantAcompte: '0.00',
    etat: 'En attente',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    modeReglement: 'Virement',
    typePaiement: 'pourcentage'
  });

  // Handle input change for form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Special handling for percentage and amount to keep them in sync
    if (name === 'pourcentageAcompte' && formData.typePaiement === 'pourcentage') {
      const percentage = parseFloat(value) || 0;
      const depositAmount = calculateDepositFromPercentage(formData, percentage);
      
      setFormData(prev => ({
        ...prev,
        montantAcompte: depositAmount
      }));
      
      setTotals(prev => ({
        ...prev,
        pourcentageAcompte: value,
        montantAcompte: depositAmount
      }));
      
      // Update the line item with the new amount
      setLineItems(prev => 
        prev.map((item, index) => 
          index === 0 ? { ...item, pvHT: depositAmount } : item
        )
      );
    } 
    else if (name === 'montantAcompte' && formData.typePaiement === 'montant') {
      const depositAmount = parseFloat(value) || 0;
      const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const percentage = calculatePercentageFromDeposit(totalAmount, depositAmount);
      
      setFormData(prev => ({
        ...prev,
        pourcentageAcompte: percentage
      }));
      
      setTotals(prev => ({
        ...prev,
        pourcentageAcompte: percentage,
        montantAcompte: value
      }));
      
      // Update the line item with the new amount
      setLineItems(prev => 
        prev.map((item, index) => 
          index === 0 ? { ...item, pvHT: value } : item
        )
      );
    }
    else if (name === 'montantTotal') {
      const totalAmount = parseFloat(value.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
      const percentage = parseFloat(formData.pourcentageAcompte) || 0;
      const depositAmount = calculateDepositFromPercentage({...formData, montantTotal: value}, percentage);
      
      setFormData(prev => ({
        ...prev,
        montantAcompte: depositAmount
      }));
      
      setTotals(prev => ({
        ...prev,
        montantAcompte: depositAmount,
        soldeFinalPrevu: (totalAmount - parseFloat(depositAmount)).toFixed(2)
      }));
      
      // Update the line item with the new amount
      setLineItems(prev => 
        prev.map((item, index) => 
          index === 0 ? { ...item, pvHT: depositAmount } : item
        )
      );
    }
    else if (name === 'typePaiement') {
      setFormData(prev => ({
        ...prev,
        typePaiement: value as 'pourcentage' | 'montant'
      }));
    }
  };

  // Toggle between percentage and fixed amount
  const handleTogglePaymentType = (type: 'pourcentage' | 'montant') => {
    setFormData(prev => ({
      ...prev,
      typePaiement: type
    }));
  };

  // Apply a predefined percentage
  const applyPresetPercentage = (percentage: string): void => {
    const cleanPercentage = percentage.replace('%', '');
    const percentageValue = parseFloat(cleanPercentage);
    const depositAmount = calculateDepositFromPercentage(formData, percentageValue);
    const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
    
    setFormData(prev => ({
      ...prev,
      pourcentageAcompte: cleanPercentage,
      montantAcompte: depositAmount,
      typePaiement: 'pourcentage'
    }));
    
    setTotals(prev => ({
      ...prev,
      pourcentageAcompte: cleanPercentage,
      montantAcompte: depositAmount,
      soldeFinalPrevu: (totalAmount - parseFloat(depositAmount)).toFixed(2)
    }));
    
    // Update the line item with the new amount
    setLineItems(prev => 
      prev.map((item, index) => 
        index === 0 ? { ...item, pvHT: depositAmount } : item
      )
    );
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleTogglePaymentType,
    applyPresetPercentage
  };
};

export default useFormData;