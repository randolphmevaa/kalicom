import { QuoteTemplate } from './types';

/**
 * Utility functions for the templates page
 */

/**
 * Filter templates based on search query and visibility settings
 */
export const filterTemplates = (
  templates: QuoteTemplate[],
  searchQuery: string,
  showHiddenTemplates: boolean
): QuoteTemplate[] => {
  return templates.filter(template => {
    // Filter by search query
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by visibility
    const isVisible = showHiddenTemplates || !template.isHidden;
    
    return matchesSearch && isVisible;
  });
};

/**
 * Format date string as dd/mm/yyyy
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format currency value
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Generate a unique template ID
 */
export const generateTemplateId = (): string => {
  return `template-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Get current date formatted for template
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date());
};