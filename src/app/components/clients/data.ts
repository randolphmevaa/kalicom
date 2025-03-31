// data.ts
import React from 'react';
import { Client, DocumentOption } from './types';
import { FiFileText, FiClipboard, FiCreditCard } from 'react-icons/fi';

// Filter options
export const statusOptions: string[] = ['Tous', 'Actif', 'Inactif', 'En attente'];
export const tagOptions: string[] = ['Tous', 'VIP', 'Fidèle', 'Nouveau', 'Prospect', 'International', 'Ancien'];
export const sourceOptions: string[] = [
  'Tous', 
  'Site Web', 
  'Référence', 
  'Salon', 
  'Publicité', 
  'Email', 
  'Partenaire', 
  'Réseau social', 
  'Conférence', 
  'Recommandation'
];

// Sample client data
export const clients: Client[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@example.com',
      telephone: '+33 6 12 34 56 78',
      entreprise: 'Acme Corp',
      ville: 'Paris',
      pays: 'France',
      adresse: '123 Avenue des Champs-Élysées, 75008',
      statut: 'Actif',
      source: 'Site Web',
      tags: ['VIP', 'Fidèle'],
      dernierContact: '02/03/2025',
      valeurTotale: '15,600 €'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@example.com',
      telephone: '+33 6 23 45 67 89',
      entreprise: 'Nexus Tech',
      ville: 'Lyon',
      pays: 'France',
      adresse: '45 Rue de la République, 69002',
      statut: 'Actif',
      source: 'Référence',
      tags: ['Nouveau'],
      dernierContact: '28/02/2025',
      valeurTotale: '5,800 €'
    },
    {
      id: 3,
      nom: 'Leclerc',
      prenom: 'Sophie',
      email: 'sophie.leclerc@example.com',
      telephone: '+33 6 34 56 78 90',
      entreprise: 'Zenith SA',
      ville: 'Marseille',
      pays: 'France',
      adresse: '187 Quai du Port, 13002',
      statut: 'Inactif',
      source: 'Salon',
      tags: ['Prospect'],
      dernierContact: '15/02/2025',
      valeurTotale: '0 €'
    },
    {
      id: 4,
      nom: 'Bernard',
      prenom: 'Thomas',
      email: 'thomas.bernard@example.com',
      telephone: '+33 6 45 67 89 01',
      entreprise: 'Global Industries',
      ville: 'Bordeaux',
      pays: 'France',
      adresse: '28 Cours du Chapeau Rouge, 33000',
      statut: 'Actif',
      source: 'Publicité',
      tags: ['VIP', 'International'],
      dernierContact: '05/03/2025',
      valeurTotale: '24,750 €'
    },
    {
      id: 5,
      nom: 'Petit',
      prenom: 'Julie',
      email: 'julie.petit@example.com',
      telephone: '+33 6 56 78 90 12',
      entreprise: 'Tech Innovate',
      ville: 'Toulouse',
      pays: 'France',
      adresse: '12 Place du Capitole, 31000',
      statut: 'En attente',
      source: 'Email',
      tags: ['Prospect'],
      dernierContact: '25/02/2025',
      valeurTotale: '1,200 €'
    },
    {
      id: 6,
      nom: 'Moreau',
      prenom: 'Pierre',
      email: 'pierre.moreau@example.com',
      telephone: '+33 6 67 89 01 23',
      entreprise: 'Eco Solutions',
      ville: 'Nantes',
      pays: 'France',
      adresse: '4 Rue Crébillon, 44000',
      statut: 'Actif',
      source: 'Partenaire',
      tags: ['Fidèle'],
      dernierContact: '01/03/2025',
      valeurTotale: '8,900 €'
    },
    {
      id: 7,
      nom: 'Lefebvre',
      prenom: 'Emma',
      email: 'emma.lefebvre@example.com',
      telephone: '+33 6 78 90 12 34',
      entreprise: 'Design Studio',
      ville: 'Lille',
      pays: 'France',
      adresse: '76 Rue de Paris, 59800',
      statut: 'Inactif',
      source: 'Site Web',
      tags: ['Ancien'],
      dernierContact: '10/01/2025',
      valeurTotale: '3,500 €'
    },
    {
      id: 8,
      nom: 'Garcia',
      prenom: 'Lucas',
      email: 'lucas.garcia@example.com',
      telephone: '+33 6 89 01 23 45',
      entreprise: 'Media Group',
      ville: 'Strasbourg',
      pays: 'France',
      adresse: '23 Place Kléber, 67000',
      statut: 'Actif',
      source: 'Réseau social',
      tags: ['Nouveau', 'International'],
      dernierContact: '28/02/2025',
      valeurTotale: '6,200 €'
    },
    {
      id: 9,
      nom: 'Girard',
      prenom: 'Léa',
      email: 'lea.girard@example.com',
      telephone: '+33 6 90 12 34 56',
      entreprise: 'Finance Conseil',
      ville: 'Nice',
      pays: 'France',
      adresse: '15 Promenade des Anglais, 06000',
      statut: 'En attente',
      source: 'Conférence',
      tags: ['Prospect', 'VIP'],
      dernierContact: '18/02/2025',
      valeurTotale: '2,100 €'
    },
    {
      id: 10,
      nom: 'Roux',
      prenom: 'Antoine',
      email: 'antoine.roux@example.com',
      telephone: '+33 6 01 23 45 67',
      entreprise: 'Santé Plus',
      ville: 'Montpellier',
      pays: 'France',
      adresse: '8 Rue Foch, 34000',
      statut: 'Actif',
      source: 'Recommandation',
      tags: ['Fidèle'],
      dernierContact: '03/03/2025',
      valeurTotale: '12,300 €'
    }
  ];


// Document options for the modal
export const documentOptions: DocumentOption[] = [
  {
    id: 'facture',
    title: 'Envoyer une facture',
    icon: React.createElement(FiFileText, { className: "w-6 h-6 text-blue-600" }),
    description: 'Envoyer une facture standard au client'
  },
  {
    id: 'devis',
    title: 'Envoyer un devis',
    icon: React.createElement(FiClipboard, { className: "w-6 h-6 text-green-600" }),
    description: 'Envoyer un devis pour une prestation ou des produits'
  },
  {
    id: 'avoir',
    title: 'Envoyer un avoir',
    icon: React.createElement(FiCreditCard, { className: "w-6 h-6 text-purple-600" }),
    description: 'Émettre un avoir pour un remboursement ou annulation'
  },
  {
    id: 'factureAcompte',
    title: 'Envoyer une facture d\'acompte',
    icon: React.createElement(FiFileText, { className: "w-6 h-6 text-orange-600" }),
    description: 'Envoyer une facture pour un paiement partiel anticipé'
  },
  {
    id: 'avoirAcompte',
    title: 'Envoyer un avoir d\'acompte',
    icon: React.createElement(FiCreditCard, { className: "w-6 h-6 text-red-600" }),
    description: 'Émettre un avoir pour un acompte déjà versé'
  }
];
