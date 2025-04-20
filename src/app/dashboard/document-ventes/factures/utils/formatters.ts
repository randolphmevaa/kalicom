// Utility functions for formatting values

/**
 * Parses a currency string into a number
 * Example: "1 234,56 €" -> 1234.56
 */
export const parseCurrency = (value: string): number => {
    // Remove currency symbol, spaces, and convert comma to dot
    return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  };
  
  /**
   * Formats a number as a currency string with Euro symbol
   * Example: 1234.56 -> "1 234,56 €"
   */
  export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };
  
  /**
   * Formats a date string to French format
   * Example: "2025-03-05" -> "05/03/2025"
   */
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  
  /**
   * Calculates if a date is past due (earlier than today)
   */
  export const isPastDue = (dateString: string): boolean => {
    const parts = dateString.split('/');
    // Convert from DD/MM/YYYY to YYYY-MM-DD for Date constructor
    const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return dateObj < new Date();
  };
  
  /**
   * Calculates if the date is within X days from today
   */
  export const isWithinDays = (dateString: string, days: number): boolean => {
    const parts = dateString.split('/');
    // Convert from DD/MM/YYYY to YYYY-MM-DD for Date constructor
    const dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return dateObj >= today && dateObj <= futureDate;
  };