// Define interfaces for proper typing
export interface CreateInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  export interface Article {
    code: string;
    desc: string;
    prix: string;
    unite: string;
    tva: string;
  }
  
  export interface Client {
    id: string;
    name: string;
    type: 'client' | 'prospect';
    // Extended client data
    civilite?: string;
    nom?: string;
    prenom?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    telephone?: string;
    email?: string;
  }
  
  export interface FormData {
    numero: string;
    codeTiers: string;
    civilite: string;
    nom: string;
    prenom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    reference: string;
    etat: string;
    date: string;
    dateEcheance: string;
    modeReglement: string;
    modeCalcul: 'HT' | 'TTC';
    montantHT: string;
  }
  
  export interface LineItem {
    id: number;
    codeArticle: string;
    description: string;
    quantite: number;
    codeUnite: string;
    pvHT: string;
    remise: string;
    montantNetHT: string;
    tva: string;
  }
  
  export interface PaymentSchedule {
    id: number;
    dateEcheance: string;
    montant: string;
    moyenPaiement: string;
    soldeDu: string;
    estRegle: boolean;
  }
  
  export interface Totals {
    totalBrutHT: string;
    pourcentageRemise: string;
    portHT: string;
    tvaPort: string;
    totalNetHT: string;
    soit: string;
    pourcentageAcompte: string;
    totalTTC: string;
    soitTTC: string;
    netAPayer: string;
  }
  
  // Sample articles for quick selection
  export const articlesCommuns: Article[] = [
    { code: 'ART001', desc: 'Consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
    { code: 'ART002', desc: 'Maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
    { code: 'ART003', desc: 'Développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
    { code: 'ART004', desc: 'Formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
    { code: 'ART005', desc: 'Audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
  ];
  
  // Sample client data for dropdown with extended information (French data)
  export const sampleClients: Client[] = [
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
      id: 'PRO001', 
      name: 'Groupe Bernard SA', 
      type: 'prospect',
      civilite: 'M.',
      nom: 'Bernard',
      prenom: 'Philippe',
      adresse: '12 Cours Pasteur',
      codePostal: '33000',
      ville: 'Bordeaux',
      telephone: '05 56 78 90 12',
      email: 'contact@bernard-groupe.fr'
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
  export const moyensPaiement = [
    'Virement', 
    'Carte bancaire', 
    'Chèque', 
    'Espèces', 
    'Prélèvement', 
    'PayPal', 
    'Lettre de change'
  ];