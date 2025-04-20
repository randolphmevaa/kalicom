// hooks/useTotals.ts
import { useState, useEffect } from 'react';
import { Totals, LineItem } from '../types';
import { calculateTotals } from '../utils/calculations';

const useTotals = (lineItems: LineItem[]) => {
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

  // Calculate totals when line items change
  useEffect(() => {
    const updatedTotals = calculateTotals(lineItems, totals);
    setTotals(updatedTotals);
  }, [lineItems, totals.portHT, totals.tvaPort, totals.pourcentageRemise]);

  return {
    totals,
    setTotals
  };
};

export default useTotals;