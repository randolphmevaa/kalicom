import { useState, useCallback, useEffect } from 'react';
import { PaymentSchedule } from '../types';

export const usePaymentSchedule = (totalTTC: string) => {
  // State for payment schedule
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([
    {
      id: 1,
      dateEcheance: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      montant: '0.00',
      moyenPaiement: 'Virement',
      soldeDu: '0.00',
      estRegle: false
    }
  ]);

  // Handle payment schedule changes
  const handlePaymentScheduleChange = useCallback((id: number, field: keyof PaymentSchedule, value: string | boolean | number) => {
    setPaymentSchedule(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }, []);

  // Add a new payment schedule entry
  const addPaymentSchedule = useCallback((): void => {
    const newId = paymentSchedule.length > 0 ? Math.max(...paymentSchedule.map(item => item.id)) + 1 : 1;
    
    // Calculate the default date as previous date + 30 days
    const previousDate = paymentSchedule.length > 0 
      ? new Date(paymentSchedule[paymentSchedule.length - 1].dateEcheance)
      : new Date();
    
    const newDate = new Date(previousDate);
    newDate.setDate(newDate.getDate() + 30);
    
    setPaymentSchedule(prev => [
      ...prev, 
      { 
        id: newId, 
        dateEcheance: newDate.toISOString().split('T')[0],
        montant: '0.00',
        moyenPaiement: 'Virement',
        soldeDu: '0.00',
        estRegle: false
      }
    ]);
  }, [paymentSchedule]);

  // Remove a payment schedule entry
  const removePaymentSchedule = useCallback((id: number): void => {
    setPaymentSchedule(prev => prev.filter(item => item.id !== id));
  }, []);
  
  // Mark a payment as completed
  const markPaymentComplete = useCallback((id: number): void => {
    setPaymentSchedule(prev => 
      prev.map(item => 
        item.id === id ? { 
          ...item,
          estRegle: true
        } : item
      )
    );
  }, []);

  // Calculate payment schedule total
  const calculatePaymentScheduleTotal = useCallback((): string => {
    return paymentSchedule.reduce((sum, item) => sum + parseFloat(item.montant || '0'), 0).toFixed(2);
  }, [paymentSchedule]);

  // Calculate difference between invoice total and payment schedule total
  const calculateDifference = useCallback((): string => {
    const paymentTotal = parseFloat(calculatePaymentScheduleTotal());
    const invoiceTotal = parseFloat(totalTTC);
    return (invoiceTotal - paymentTotal).toFixed(2);
  }, [calculatePaymentScheduleTotal, totalTTC]);

  // Check if payment schedule total matches invoice total
  const isPaymentScheduleBalanced = useCallback((): boolean => {
    return Math.abs(parseFloat(calculateDifference())) <= 0.01;
  }, [calculateDifference]);

  // Update payment schedule when total changes
  useEffect(() => {
    if (paymentSchedule.length === 1 && parseFloat(totalTTC) > 0) {
      setPaymentSchedule([
        {
          ...paymentSchedule[0],
          montant: totalTTC,
          soldeDu: totalTTC
        }
      ]);
    }
  }, [totalTTC, paymentSchedule.length]);

  return {
    paymentSchedule,
    setPaymentSchedule,
    handlePaymentScheduleChange,
    addPaymentSchedule,
    removePaymentSchedule,
    markPaymentComplete,
    calculatePaymentScheduleTotal,
    calculateDifference,
    isPaymentScheduleBalanced
  };
};