// data/sampleData.ts
import { Client, Invoice, Article } from '../types';

// Sample articles for quick selection
export const articlesCommuns: Article[] = [
  { code: 'ART001', desc: 'Consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
  { code: 'ART002', desc: 'Maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
  { code: 'ART003', desc: 'Développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
  { code: 'ART004', desc: 'Formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
  { code: 'ART005', desc: 'Audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
];

// Sample invoices for reference
export const sampleInvoices: Invoice[] = [
  {
    id: 'FACT-2025-001',
    client: 'Société Dupont',
    date: '05/03/2025',
    montantTTC: '15 600,00 €',
    statut: 'Payée'
  },
  {
    id: 'FACT-2025-002',
    client: 'Entreprise Martin',
    date: '28/02/2025',
    montantTTC: '2 990,00 €',
    statut: 'En attente'
  },
  {
    id: 'FACT-2025-004',
    client: 'Industries Moreau',
    date: '20/02/2025',
    montantTTC: '3 500,00 €',
    statut: 'Payée'
  },
  {
    id: 'FACT-2025-006',
    client: 'Tech Petit SARL',
    date: '10/02/2025',
    montantTTC: '8 400,00 €',
    statut: 'Payée'
  }
];

// Refund reasons
export const refundReasons: string[] = [
  'Erreur de facturation',
  'Produit retourné',
  'Service annulé',
  'Remise commerciale',
  'Double facturation',
  'Article défectueux',
  'Annulation de commande',
  'Autre'
];

// Sample client data for dropdown with extended information (French data)
export const clients: Client[] = [
  { 
    id: 'CLI001', 
    name: 'Société Dupont', 
    type: 'client',
    civilite: 'M.',
    nom: 'Dupont',
    prenom: 'Jean',
    adresse: '23 Rue de la République',
    codePostal: '75001',
    ville: 'Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@dupont.fr'
  },
  { 
    id: 'CLI002', 
    name: 'Entreprise Martin', 
    type: 'client',
    civilite: 'Mme',
    nom: 'Martin',
    prenom: 'Sophie',
    adresse: '45 Avenue Victor Hugo',
    codePostal: '69002',
    ville: 'Lyon',
    telephone: '04 78 12 34 56',
    email: 'info@martin-entreprise.fr'
  },
  { 
    id: 'CLI003', 
    name: 'Industries Moreau', 
    type: 'client',
    civilite: 'M.',
    nom: 'Moreau',
    prenom: 'Pierre',
    adresse: '78 Boulevard Gambetta',
    codePostal: '59000',
    ville: 'Lille',
    telephone: '03 20 45 67 89',
    email: 'p.moreau@industriesmoreau.fr'
  },
  { 
    id: 'PRO002', 
    name: 'Tech Petit SARL', 
    type: 'prospect',
    civilite: 'Mme',
    nom: 'Petit',
    prenom: 'Marie',
    adresse: '34 Rue des Lilas',
    codePostal: '67000',
    ville: 'Strasbourg',
    telephone: '03 88 56 78 90',
    email: 'm.petit@techpetit.fr'
  },
];

// Payment method options
export const moyensPaiement: string[] = [
  'Virement', 
  'Carte bancaire', 
  'Chèque', 
  'Espèces', 
  'Prélèvement', 
  'PayPal', 
  'Lettre de change'
];