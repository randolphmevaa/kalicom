import { QuoteTemplate, WizardFormData } from './types';

// Sample templates data
export const templates: QuoteTemplate[] = [
  {
    id: 'template1',
    name: 'Devis avec numéro client',
    description: 'Modèle de devis incluant une référence client visible',
    isDefault: true,
    isHidden: false,
    lastModified: '15/03/2025',
    previewUrl: '/specimen-client.png',
    pdfUrl: '/devis-client.pdf'
  },
  {
    id: 'template2',
    name: 'Devis détaillé par poste',
    description: 'Présentation détaillée avec regroupement par poste',
    isDefault: false,
    isHidden: false,
    lastModified: '08/02/2025',
    previewUrl: '/specimen-poste.png',
    pdfUrl: '/devis-poste.pdf'
  },
  {
    id: 'template3',
    name: 'Devis Pré-imprimé',
    description: 'Compatible avec papier à en-tête personnalisé',
    isDefault: false,
    isHidden: false,
    lastModified: '01/02/2025',
    previewUrl: '/specimen-preprinted.png',
    pdfUrl: '/devis-preprinted.pdf'
  },
  {
    id: 'template4',
    name: 'Devis professionnel simple',
    description: 'Modèle standard avec affichage clair des prix',
    isDefault: false,
    isHidden: false,
    lastModified: '20/01/2025',
    previewUrl: '/specimen-pro.png',
    pdfUrl: '/devis-pro.pdf'
  },
  {
    id: 'template5',
    name: 'Liste des devis',
    description: 'Mise en page pour impression de récapitulatifs',
    isDefault: false,
    isHidden: true,
    lastModified: '05/12/2024',
    previewUrl: '/specimen-list.png',
    pdfUrl: '/devis-list.pdf'
  }
];

// Initial wizard form data
export const initialWizardData: WizardFormData = {
  headerStyle: 'standard',
  headerElements: ['logo', 'company', 'quoteNumber', 'quoteDate'],
  bodyElements: ['clientInfo', 'items', 'subtotal', 'taxes', 'total'],
  footerElements: ['validityPeriod', 'contact', 'legalInfo'],
  formatting: {
    primaryColor: '#009B72',
    secondaryColor: '#f3f4f6',
    font: 'Helvetica',
    fontSize: 'medium',
    paperSize: 'A4'
  },
  templateName: 'Nouveau modèle de devis'
};

// Total steps in the wizard
export const TOTAL_WIZARD_STEPS = 5;

// Header style options for the wizard
export const headerStyleOptions = [
  { name: 'Standard', desc: 'Logo à gauche, informations à droite' },
  { name: 'Moderne', desc: 'Design épuré avec entête colorée' },
  { name: 'Classique', desc: 'Présentation traditionnelle centrée' },
  { name: 'Minimaliste', desc: 'Style simple sans fioritures' },
  { name: 'Élégant', desc: 'Mise en page sophistiquée' },
  { name: 'Professionnel', desc: 'Présentation business formelle' }
];