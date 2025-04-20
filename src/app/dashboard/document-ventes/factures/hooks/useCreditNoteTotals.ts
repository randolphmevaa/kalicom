import { useState, useCallback, useMemo } from 'react';
import { LineItem, Totals } from '../types/creditNote';

export const useCreditNoteTotals = (lineItems: LineItem[]) => {
  // State for the totals
  const [totals, setTotals] = useState<Totals>({
    totalBrutHT: '0.00',
    pourcentageRemise: '0.00',
    portHT: '0.00',
    tvaPort: '20.00',
    totalNetHT: '0.00',
    soit: '',
    totalTTC: '0.00',
    soitTTC: '',
    netARembourser: '0.00',
  });

  // Update a specific total field
  const updateTotalField = useCallback((field: keyof Totals, value: string) => {
    setTotals(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Calculate all totals based on line items
  const calculateTotals = useCallback(() => {
    // Calculate gross total
    const totalBrutHT = lineItems.reduce(
      (sum, item) => {
        const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite;
        return sum + (quantity * parseFloat(item.pvHT));
      }, 
      0
    ).toFixed(2);
    
    // Calculate discount amount
    const remiseGlobale = parseFloat(totalBrutHT) * parseFloat(totals.pourcentageRemise) / 100;
    
    // Calculate net total without VAT
    const totalNetHT = (parseFloat(totalBrutHT) - remiseGlobale).toFixed(2);
    
    // Calculate total VAT
    const totalTVA = lineItems.reduce(
      (sum, item) => sum + (parseFloat(item.montantNetHT) * parseFloat(item.tva) / 100), 
      0
    ).toFixed(2);
    
    // Calculate shipping and shipping VAT
    const portHTValue = parseFloat(totals.portHT) || 0;
    const tvaPortValue = (portHTValue * parseFloat(totals.tvaPort) / 100);
    
    // Calculate total with VAT
    const totalTTC = (parseFloat(totalNetHT) + parseFloat(totalTVA) + portHTValue + tvaPortValue).toFixed(2);
    
    // Update totals
    setTotals(prev => ({
      ...prev,
      totalBrutHT,
      totalNetHT,
      totalTTC,
      netARembourser: totalTTC
    }));
  }, [
    lineItems, 
    totals.portHT, 
    totals.tvaPort, 
    totals.pourcentageRemise
  ]);

  // Memoized dependencies for useEffect
  const totalsDependencies = useMemo(() => ({
    portHT: totals.portHT,
    tvaPort: totals.tvaPort,
    pourcentageRemise: totals.pourcentageRemise
  }), [
    totals.portHT, 
    totals.tvaPort, 
    totals.pourcentageRemise
  ]);

  return {
    totals,
    setTotals,
    updateTotalField,
    calculateTotals,
    totalsDependencies
  };
};