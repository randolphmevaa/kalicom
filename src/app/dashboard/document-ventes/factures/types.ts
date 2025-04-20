// Types for the invoices management page

// For each invoice item
export interface Invoice {
    id: string;
    date: string;
    client: string;
    montantHT: string;
    montantTTC: string;
    statut: InvoiceStatus;
    dateEcheance: string;
    dateReglement: string | null;
    modeReglement: string | null;
    creePar: string;
    typeFacture: string;
    notes: string;
  }
  
  // Potential statuses for an invoice
  export type InvoiceStatus =
    | 'Payée'
    | 'En attente'
    | 'En retard'
    | 'Partiellement payée'
    | 'Annulée'
    | string; // fallback if you introduce others
  
  // For the "filter" statuses including "Tous"
  export type FilterStatus = InvoiceStatus | 'Tous';
  
  // For sorting, define the fields you actually allow
  export type SortField =
    | 'id'
    | 'date'
    | 'client'
    | 'montantHT'
    | 'montantTTC'
    | 'statut'
    | 'dateEcheance';
  
  // For sorting direction
  export type SortDirection = 'asc' | 'desc';
  
  // For the "export" format
  export type ExportFormat = 'pdf' | 'csv' | 'excel';
  
  // For the period filter
  export type FilterPeriod = 'Tous' | 'Ce mois' | 'Mois dernier' | 'Ce trimestre' | 'Cette année';
  
  // For your stat cards
  export interface Statistic {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendUp: boolean;
  }
  
  // For the view mode
  export type ViewMode = 'compact' | 'comfortable';
  
  // Sample data
  export const sampleInvoices: Invoice[] = [
    {
      id: 'FACT-2025-001',
      date: '05/03/2025',
      client: 'Acme Corp',
      montantHT: '13 000,00 €',
      montantTTC: '15 600,00 €',
      statut: 'Payée',
      dateEcheance: '05/04/2025',
      dateReglement: '02/04/2025',
      modeReglement: 'Virement',
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Paiement reçu avant échéance',
    },
    {
      id: 'FACT-2025-002',
      date: '28/02/2025',
      client: 'Nexus Tech',
      montantHT: '2 491,67 €',
      montantTTC: '2 990,00 €',
      statut: 'En attente',
      dateEcheance: '30/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Relance envoyée le 20/03/2025',
    },
    {
      id: 'FACT-2025-003',
      date: '25/02/2025',
      client: 'Zenith SA',
      montantHT: '4 158,33 €',
      montantTTC: '4 990,00 €',
      statut: 'En retard',
      dateEcheance: '25/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Client à contacter pour paiement',
    },
    {
      id: 'FACT-2025-004',
      date: '20/02/2025',
      client: 'Global Industries',
      montantHT: '2 916,67 €',
      montantTTC: '3 500,00 €',
      statut: 'Payée',
      dateEcheance: '20/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Carte bancaire',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: 'Paiement reçu en avance',
    },
    {
      id: 'FACT-2025-005',
      date: '15/02/2025',
      client: 'Tech Innovate',
      montantHT: '10 625,00 €',
      montantTTC: '12 750,00 €',
      statut: 'Partiellement payée',
      dateEcheance: '15/03/2025',
      dateReglement: '15/03/2025',
      modeReglement: 'Chèque',
      creePar: 'Jean Martin',
      typeFacture: 'Échelonnée',
      notes: 'Premier versement de 6 000 € reçu',
    },
    {
      id: 'FACT-2025-006',
      date: '10/02/2025',
      client: 'Solutions Pro',
      montantHT: '7 000,00 €',
      montantTTC: '8 400,00 €',
      statut: 'Payée',
      dateEcheance: '10/03/2025',
      dateReglement: '08/03/2025',
      modeReglement: 'Virement',
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: '',
    },
    {
      id: 'FACT-2025-007',
      date: '05/02/2025',
      client: 'Groupe Média',
      montantHT: '1 458,33 €',
      montantTTC: '1 750,00 €',
      statut: 'Annulée',
      dateEcheance: '05/03/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Thomas Bernard',
      typeFacture: 'Standard',
      notes: 'Annulée à la demande du client',
    },
    {
      id: 'FACT-2025-008',
      date: '01/02/2025',
      client: 'Data Services',
      montantHT: '4 416,67 €',
      montantTTC: '5 300,00 €',
      statut: 'Payée',
      dateEcheance: '01/03/2025',
      dateReglement: '28/02/2025',
      modeReglement: 'Virement',
      creePar: 'Marie Dupont',
      typeFacture: 'Standard',
      notes: '',
    },
    {
      id: 'FACT-2025-009',
      date: '28/01/2025',
      client: 'ConsultCorp',
      montantHT: '8 166,67 €',
      montantTTC: '9 800,00 €',
      statut: 'En attente',
      dateEcheance: '28/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Jean Martin',
      typeFacture: 'Standard',
      notes: 'Client a demandé une extension de délai',
    },
    {
      id: 'FACT-2025-010',
      date: '15/01/2025',
      client: 'Systèmes Avancés',
      montantHT: '6 208,33 €',
      montantTTC: '7 450,00 €',
      statut: 'En retard',
      dateEcheance: '15/02/2025',
      dateReglement: null,
      modeReglement: null,
      creePar: 'Sophie Leclerc',
      typeFacture: 'Standard',
      notes: 'Plusieurs relances effectuées',
    },
  ];
  
  export const statusOptions: FilterStatus[] = [
    'Tous',
    'Payée',
    'En attente',
    'En retard',
    'Partiellement payée',
    'Annulée',
  ];
  
  export const periodOptions: FilterPeriod[] = [
    'Tous',
    'Ce mois',
    'Mois dernier',
    'Ce trimestre',
    'Cette année',
  ];
  
  export const clientOptions: string[] = [
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