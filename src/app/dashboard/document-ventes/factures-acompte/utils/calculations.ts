// utils/calculations.ts
import { LineItem, FormData, Totals } from '../types';

/**
 * Calculate line item amount
 * @param item The line item to calculate amount for
 * @returns The net amount as a string with 2 decimal places
 */
export const calculateLineItemAmount = (item: LineItem): string => {
  const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite || 0;
  const price = parseFloat(item.pvHT) || 0;
  const discount = parseFloat(item.remise) || 0;
  
  const grossAmount = quantity * price;
  const discountAmount = grossAmount * (discount / 100);
  const netAmount = grossAmount - discountAmount;
  
  return netAmount.toFixed(2);
};

/**
 * Update the montant acompte based on percentage
 * @param formData Current form data
 * @param pourcentage Percentage to apply
 * @returns The deposit amount as a string with 2 decimal places
 */
export const calculateDepositFromPercentage = (formData: FormData, pourcentage: number): string => {
  const totalAmount = parseFloat(formData.montantTotal.replace(/[^\d,.]/g, '').replace(',', '.')) || 0;
  return (totalAmount * pourcentage / 100).toFixed(2);
};

/**
 * Calculate percentage from deposit amount
 * @param totalAmount Total project amount
 * @param depositAmount Deposit amount
 * @returns The percentage as a string
 */
export const calculatePercentageFromDeposit = (totalAmount: number, depositAmount: number): string => {
  return totalAmount > 0 ? ((depositAmount * 100) / totalAmount).toFixed(0) : '0';
};

/**
 * Calculate the remaining amount after deposit
 * @param totalAmount Total project amount
 * @param depositAmount Deposit amount
 * @returns The remaining amount as a string with 2 decimal places
 */
export const calculateRemainingAmount = (totalAmount: number, depositAmount: number): string => {
  return (totalAmount - depositAmount).toFixed(2);
};

/**
 * Calculate totals based on line items
 * @param lineItems The line items
 * @param currentTotals Current totals state
 * @returns Updated totals object
 */
export const calculateTotals = (lineItems: LineItem[], currentTotals: Totals): Totals => {
  // Calculate each line item's net amount first
  const updatedLineItems = lineItems.map(item => ({
    ...item,
    montantNetHT: calculateLineItemAmount(item)
  }));
  
  // Calculate gross total
  const totalBrutHT = updatedLineItems.reduce(
    (sum, item) => {
      const quantity = typeof item.quantite === 'string' ? parseFloat(item.quantite) : item.quantite;
      return sum + (quantity * parseFloat(item.pvHT));
    }, 
    0
  ).toFixed(2);
  
  // Apply global discount
  const remiseGlobale = parseFloat(totalBrutHT) * parseFloat(currentTotals.pourcentageRemise) / 100;
  const totalNetHT = (parseFloat(totalBrutHT) - remiseGlobale).toFixed(2);
  
  // Calculate VAT
  const totalTVA = updatedLineItems.reduce(
    (sum, item) => sum + (parseFloat(item.montantNetHT) * parseFloat(item.tva) / 100), 
    0
  ).toFixed(2);
  
  // Calculate shipping and its VAT
  const portHTValue = parseFloat(currentTotals.portHT) || 0;
  const tvaPortValue = (portHTValue * parseFloat(currentTotals.tvaPort) / 100);
  
  // Calculate final total
  const totalTTC = (parseFloat(totalNetHT) + parseFloat(totalTVA) + portHTValue + tvaPortValue).toFixed(2);
  
  // Use first line item for deposit amount if available
  const firstItemAmount = updatedLineItems.length > 0 ? parseFloat(updatedLineItems[0].montantNetHT) : 0;
  
  return {
    ...currentTotals,
    totalBrutHT,
    totalNetHT,
    totalTTC,
    montantAcompte: firstItemAmount.toFixed(2)
  };
};