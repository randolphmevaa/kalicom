import { Devis, DevisStatus, SortField, Statistic } from '../types';
// import { ReactNode } from 'react';

// Get color for status badge
export const getStatusBadgeColor = (status: DevisStatus): string => {
  switch (status) {
    case 'Accepté':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'En attente':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Refusé':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'Expiré':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    case 'En préparation':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    default:
      return 'bg-purple-100 text-purple-800 border border-purple-200';
  }
};

// Get color for status dot
export const getStatusDotColor = (status: DevisStatus): string => {
  switch (status) {
    case 'Accepté':
      return 'bg-green-500';
    case 'En attente':
      return 'bg-amber-500';
    case 'Refusé':
      return 'bg-red-500';
    case 'Expiré':
      return 'bg-gray-500';
    case 'En préparation':
      return 'bg-blue-500';
    default:
      return 'bg-purple-500';
  }
};

// Sort helper function to get sortable value from Devis object
export function getSortValue(dev: Devis, field: SortField): string {
  return dev[field];
}

// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

export const statCardVariants = {
  hover: {
    y: -5,
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Sample data
export const getDefaultDevis = (): Devis[] => [
  {
    id: 'DEV-2025-001',
    date: '05/03/2025',
    prospect: 'Acme Corp',
    montantHT: '13 000,00 €',
    montantTTC: '15 600,00 €',
    statut: 'En attente',
    dateValidite: '05/04/2025',
    dateAcceptation: null,
    creePar: 'Jean Martin',
    typeDevis: 'Standard',
    notes: 'Relance effectuée le 15/03/2025',
  },
  {
    id: 'DEV-2025-002',
    date: '28/02/2025',
    prospect: 'Nexus Tech',
    montantHT: '2 491,67 €',
    montantTTC: '2 990,00 €',
    statut: 'Accepté',
    dateValidite: '30/03/2025',
    dateAcceptation: '15/03/2025',
    creePar: 'Sophie Leclerc',
    typeDevis: 'Standard',
    notes: 'Transformé en facture le 16/03/2025',
  },
  {
    id: 'DEV-2025-003',
    date: '25/02/2025',
    prospect: 'Zenith SA',
    montantHT: '4 158,33 €',
    montantTTC: '4 990,00 €',
    statut: 'Refusé',
    dateValidite: '25/03/2025',
    dateAcceptation: null,
    creePar: 'Thomas Bernard',
    typeDevis: 'Standard',
    notes: 'Client a refusé suite au prix jugé trop élevé',
  },
  {
    id: 'DEV-2025-004',
    date: '20/02/2025',
    prospect: 'Global Industries',
    montantHT: '2 916,67 €',
    montantTTC: '3 500,00 €',
    statut: 'Accepté',
    dateValidite: '20/03/2025',
    dateAcceptation: '10/03/2025',
    creePar: 'Marie Dupont',
    typeDevis: 'Standard',
    notes: 'Accepté avec conditions de paiement à 30 jours',
  },
  {
    id: 'DEV-2025-005',
    date: '15/02/2025',
    prospect: 'Tech Innovate',
    montantHT: '10 625,00 €',
    montantTTC: '12 750,00 €',
    statut: 'En préparation',
    dateValidite: '15/03/2025',
    dateAcceptation: null,
    creePar: 'Jean Martin',
    typeDevis: 'Personnalisé',
    notes: 'En attente de validation interne',
  },
  {
    id: 'DEV-2025-006',
    date: '10/02/2025',
    prospect: 'Solutions Pro',
    montantHT: '7 000,00 €',
    montantTTC: '8 400,00 €',
    statut: 'Accepté',
    dateValidite: '10/03/2025',
    dateAcceptation: '25/02/2025',
    creePar: 'Sophie Leclerc',
    typeDevis: 'Standard',
    notes: '',
  },
  {
    id: 'DEV-2025-007',
    date: '05/02/2025',
    prospect: 'Groupe Média',
    montantHT: '1 458,33 €',
    montantTTC: '1 750,00 €',
    statut: 'Expiré',
    dateValidite: '05/03/2025',
    dateAcceptation: null,
    creePar: 'Thomas Bernard',
    typeDevis: 'Standard',
    notes: 'Aucune réponse du client malgré les relances',
  },
  {
    id: 'DEV-2025-008',
    date: '01/02/2025',
    prospect: 'Data Services',
    montantHT: '4 416,67 €',
    montantTTC: '5 300,00 €',
    statut: 'Accepté',
    dateValidite: '01/03/2025',
    dateAcceptation: '20/02/2025',
    creePar: 'Marie Dupont',
    typeDevis: 'Standard',
    notes: '',
  },
  {
    id: 'DEV-2025-009',
    date: '28/01/2025',
    prospect: 'ConsultCorp',
    montantHT: '8 166,67 €',
    montantTTC: '9 800,00 €',
    statut: 'En attente',
    dateValidite: '28/02/2025',
    dateAcceptation: null,
    creePar: 'Jean Martin',
    typeDevis: 'Standard',
    notes: 'Client a demandé des précisions sur le contenu',
  },
  {
    id: 'DEV-2025-010',
    date: '15/01/2025',
    prospect: 'Systèmes Avancés',
    montantHT: '6 208,33 €',
    montantTTC: '7 450,00 €',
    statut: 'Refusé',
    dateValidite: '15/02/2025',
    dateAcceptation: null,
    creePar: 'Sophie Leclerc',
    typeDevis: 'Standard',
    notes: 'Client a choisi un autre prestataire',
  },
];

export const getStatusOptions = (): string[] => [
  'Tous',
  'Accepté',
  'En attente',
  'Refusé',
  'Expiré',
  'En préparation',
];

export const getPeriodOptions = (): string[] => [
  'Tous',
  'Ce mois',
  'Mois dernier',
  'Ce trimestre',
  'Cette année',
];

export const getProspectOptions = (): string[] => [
  'Tous',
  'Acme Corp',
  'Nexus Tech',
  'Zenith SA',
  'Global Industries',
  'Tech Innovate',
  'Solutions Pro',
  'Groupe Média',
  'Data Services',
  'ConsultCorp',
  'Systèmes Avancés',
];

// Default statistics without icons (will be added in the component)
export const getDefaultStatistics = (): Omit<Statistic, 'icon'>[] => [
  {
    title: 'Total devis',
    value: '72 530,00 €',
    trend: '+15.7%',
    trendUp: true,
  } as Omit<Statistic, 'icon'>,
  {
    title: 'En attente',
    value: '25 400,00 €',
    trend: '+8.2%',
    trendUp: true,
  } as Omit<Statistic, 'icon'>,
  {
    title: 'Acceptés',
    value: '34 690,00 €',
    trend: '+12.5%',
    trendUp: true,
  } as Omit<Statistic, 'icon'>,
  {
    title: 'Refusés',
    value: '12 440,00 €',
    trend: '-3.8%',
    trendUp: false,
  } as Omit<Statistic, 'icon'>,
];