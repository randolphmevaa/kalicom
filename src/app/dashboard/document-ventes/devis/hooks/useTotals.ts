import { useState, useCallback, useMemo } from 'react';
import { LineItem, Totals } from '../types';

export const useTotals = (lineItems: LineItem[]) => {
  // State for the totals
  const [totals, setTotals] = useState<Totals>({
    totalBrutHT: '0.00',
    pourcentageRemise: '0.00',
    portHT: '0.00',
    tvaPort: '20.00',
    totalNetHT: '0.00',
    soit: '',
    pourcentageAcompte: '0.00',
    totalTTC: '0.00',
    soitTTC: '',
    netAPayer: '0.00',
  });

  // Update a specific total field
  const updateTotalField = useCallback((field: keyof Totals, value: string) => {
    setTotals(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Calculate all totals based on line items and existing totals
  const calculateTotals = useCallback(() => {
    // Calculate totals based on line items
    const totalBrutHT = lineItems.reduce(
      (sum, item) => {
        const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite;
        return sum + (quantity * parseFloat(item.pvHT));
      }, 
      0
    ).toFixed(2);
    
    const remiseGlobale = parseFloat(totalBrutHT) * parseFloat(totals.pourcentageRemise) / 100;
    
    const totalNetHT = (parseFloat(totalBrutHT) - remiseGlobale).toFixed(2);
    
    const totalTVA = lineItems.reduce(
      (sum, item) => sum + (parseFloat(item.montantNetHT) * parseFloat(item.tva) / 100), 
      0
    ).toFixed(2);
    
    const portHTValue = parseFloat(totals.portHT) || 0;
    const tvaPortValue = (portHTValue * parseFloat(totals.tvaPort) / 100);
    
    const totalTTC = (parseFloat(totalNetHT) + parseFloat(totalTVA) + portHTValue + tvaPortValue).toFixed(2);
    
    const acompte = parseFloat(totalTTC) * parseFloat(totals.pourcentageAcompte) / 100;
    const netAPayer = (parseFloat(totalTTC) - acompte).toFixed(2);
    
    // Update totals without causing re-render loop
    setTotals(prev => ({
      ...prev,
      totalBrutHT,
      totalNetHT,
      totalTTC,
      netAPayer
    }));
  }, [
    lineItems, 
    totals.portHT, 
    totals.tvaPort, 
    totals.pourcentageRemise, 
    totals.pourcentageAcompte
  ]);

  // Memoized dependencies for useEffect
  const totalsDependencies = useMemo(() => ({
    portHT: totals.portHT,
    tvaPort: totals.tvaPort,
    pourcentageRemise: totals.pourcentageRemise,
    pourcentageAcompte: totals.pourcentageAcompte
  }), [
    totals.portHT, 
    totals.tvaPort, 
    totals.pourcentageRemise, 
    totals.pourcentageAcompte
  ]);

  return {
    totals,
    setTotals,
    updateTotalField,
    calculateTotals,
    totalsDependencies
  };
};
