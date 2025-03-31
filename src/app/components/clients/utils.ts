// utils.ts
import { tagColors } from './types';

// Get status badge color
export const getStatusBadgeColor = (status: string): string => {
  switch(status) {
    case 'Actif':
      return 'bg-green-100 text-green-800';
    case 'Inactif':
      return 'bg-gray-100 text-gray-800';
    case 'En attente':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

// Get status color based on last contact date
export const getStatusColor = (lastContactDate: string) => {
  const dateParts = lastContactDate.split('/');
  const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return "#4BB2F6"; // Light blue for recent contact
  if (diffDays <= 14) return "#004AC8"; // Medium blue for medium
  return "#1B0353"; // Dark blue for stale
};

// Get appropriate tag color
export const getTagColor = (tag: string) => {
  return tagColors[tag] || tagColors.default;
};

// Get the initials of a person
export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Format value for display
export const formatValue = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};