import { InvoiceTemplate } from '../types';

// Sample template data
export const templates: InvoiceTemplate[] = [
  {
    id: 'template1',
    name: 'Facture avec code barre client',
    description: 'Modèle de facture incluant un code barre pour identification client',
    isDefault: true,
    isHidden: false,
    lastModified: '12/03/2025',
    previewUrl: '/specimen-barcode.png',
    pdfUrl: '/facture-barcode.pdf'
  },
  {
    id: 'template2',
    name: 'Facture HT simple',
    description: 'Modèle de facture hors taxe pour professionnels',
    isDefault: false,
    isHidden: false,
    lastModified: '05/02/2025',
    previewUrl: '/specimen-ht.png',
    pdfUrl: '/facture-ht.pdf'
  },
  {
    id: 'template3',
    name: 'Facture Pré-imprimé',
    description: 'Compatible avec papier à en-tête personnalisé',
    isDefault: false,
    isHidden: false,
    lastModified: '28/01/2025',
    previewUrl: '/specimen-preprinted.png',
    pdfUrl: '/facture-preprinted.pdf'
  },
  {
    id: 'template4',
    name: 'Facture simple TTC',
    description: 'Modèle standard avec TVA incluse',
    isDefault: false,
    isHidden: false,
    lastModified: '15/01/2025',
    previewUrl: '/specimen-ttc.png',
    pdfUrl: '/facture-ttc.pdf'
  },
  {
    id: 'template5',
    name: 'Liste des factures',
    description: 'Mise en page pour impression de récapitulatifs',
    isDefault: false,
    isHidden: true,
    lastModified: '02/12/2024',
    previewUrl: '/specimen-list.png',
    pdfUrl: '/facture-list.pdf'
  }
];