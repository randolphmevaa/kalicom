import { InvoiceStatus } from '../types';

/**
 * Returns the CSS classes for a status badge based on invoice status
 */
export const getStatusBadgeColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'Payée':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'En attente':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'En retard':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'Partiellement payée':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'Annulée':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    default:
      return 'bg-purple-100 text-purple-800 border border-purple-200';
  }
};

/**
 * Returns the CSS class for a status dot color based on invoice status
 */
export const getStatusDotColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'Payée':
      return 'bg-green-500';
    case 'En attente':
      return 'bg-amber-500';
    case 'En retard':
      return 'bg-red-500';
    case 'Partiellement payée':
      return 'bg-blue-500';
    case 'Annulée':
      return 'bg-gray-500';
    default:
      return 'bg-purple-500';
  }
};

/**
 * Returns the tailwind backgroundColor style based on invoice status
 * Used for more specific styling than just the CSS class
 */
export const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case 'Payée':
      return '#10B981'; // green-500
    case 'En attente':
      return '#F59E0B'; // amber-500
    case 'En retard':
      return '#EF4444'; // red-500
    case 'Partiellement payée':
      return '#3B82F6'; // blue-500
    case 'Annulée':
      return '#6B7280'; // gray-500
    default:
      return '#8B5CF6'; // purple-500
  }
};