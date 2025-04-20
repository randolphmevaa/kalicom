// data/sampleData.ts
import { Client, Project, Article } from '../types';

// Sample projects for quick selection
export const projetsList: Project[] = [
  { id: 'PROJ001', titre: 'Développement CRM', client: 'Société Dupont', montant: '15600.00', echeance: '30/05/2025' },
  { id: 'PROJ002', titre: 'Refonte site web', client: 'Entreprise Martin', montant: '8900.00', echeance: '15/04/2025' },
  { id: 'PROJ003', titre: 'Module facturation', client: 'Nexus Tech', montant: '2990.00', echeance: '10/04/2025' },
  { id: 'PROJ004', titre: 'Audit de sécurité', client: 'Global Industries', montant: '3500.00', echeance: '05/04/2025' },
  { id: 'PROJ005', titre: 'Formation utilisateurs', client: 'Tech Innovate', montant: '12750.00', echeance: '20/04/2025' },
];

// Sample articles for quick selection
export const articlesCommuns: Article[] = [
  { code: 'ART001', desc: 'Acompte pour consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
  { code: 'ART002', desc: 'Acompte pour maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
  { code: 'ART003', desc: 'Acompte pour développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
  { code: 'ART004', desc: 'Acompte pour formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
  { code: 'ART005', desc: 'Acompte pour audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
];

// Deposit percentages
export const depositPercentages: string[] = ['30%', '40%', '50%', '60%', '70%'];

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
    id: 'CLI004', 
    name: 'Nexus Tech', 
    type: 'client',
    civilite: 'Mme',
    nom: 'Nexus',
    prenom: 'Technologies',
    adresse: '456 Tech Street',
    codePostal: '69002',
    ville: 'Lyon',
    telephone: '04 78 12 34 56',
    email: 'info@nexus-tech.fr'
  },
  { 
    id: 'CLI005', 
    name: 'Tech Innovate', 
    type: 'client',
    civilite: 'Mme',
    nom: 'Tech',
    prenom: 'Innovate',
    adresse: '34 Rue des Lilas',
    codePostal: '67000',
    ville: 'Strasbourg',
    telephone: '03 88 56 78 90',
    email: 'm.petit@techinnovate.fr'
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