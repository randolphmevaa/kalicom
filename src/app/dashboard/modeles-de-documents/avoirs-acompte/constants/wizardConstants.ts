// File: constants/wizardConstants.js

// Wizard step names
export const WIZARD_STEPS = [
    {
      id: 1,
      name: "Entête: style",
      description: "Choix du style d'entête du modèle d'impression"
    },
    {
      id: 2,
      name: "Entête: données",
      description: "Choix des données affichées en entête de document"
    },
    {
      id: 3,
      name: "Facture de référence",
      description: "Définition de la référence à la facture d'acompte d'origine"
    },
    {
      id: 4,
      name: "Corps & Pied",
      description: "Choix des éléments à afficher dans le corps et le pied"
    },
    {
      id: 5,
      name: "Mise en forme",
      description: "Paramétrage de la mise en forme du modèle"
    }
  ];
  
  // Header style options
  export const HEADER_STYLES = [
    { name: 'Standard', desc: 'Logo à gauche, informations à droite' },
    { name: 'Moderne', desc: 'Design épuré avec entête colorée' },
    { name: 'Classique', desc: 'Présentation traditionnelle centrée' },
    { name: 'Minimaliste', desc: 'Style simple sans fioritures' },
    { name: 'Élégant', desc: 'Mise en page sophistiquée' },
    { name: 'Professionnel', desc: 'Présentation business formelle' }
  ];
  
  // Header element options
  export const HEADER_ELEMENTS = {
    company: [
      { id: 'pays', label: 'Pays' },
      { id: 'telephone', label: 'Téléphone' },
      { id: 'portable', label: 'Tél portable' },
      { id: 'fax', label: 'Fax' },
      { id: 'siteweb', label: 'Site web' },
      { id: 'email', label: 'Email' },
      { id: 'agrement', label: 'N d\'agrément' },
      { id: 'declaration', label: 'N de déclaration' }
    ],
    client: [
      { id: 'espace_vide', label: 'Espace vide' },
      { id: 'telephone_client', label: 'Téléphone' },
      { id: 'portable_client', label: 'Téléphone portable' },
      { id: 'email_client', label: 'Email' }
    ],
    additional: [
      { id: 'references', label: 'Références' },
      { id: 'no_commande', label: 'N de commande client' },
      { id: 'no_facture', label: 'N de facture liée' },
      { id: 'masquer_contact', label: 'Masquer le contact principal' },
      { id: 'masquer_tva', label: 'Masquer le numéro de TVA du client' },
      { id: 'masquer_reglement', label: 'Masquer le mode règlement du client' }
    ]
  };
  
  // Column options for body
  export const COLUMN_OPTIONS = [
    'Code article', 'Description', 'Montant HT initial', 'Unité (Libellé)', 
    'Unité (Code)', 'Quantité', 'P.U. TTC', 'P.U. HT', '% Remboursé', 
    'Montant TTC', 'Montant HT', 'TVA', 'Référence facture'
  ];
  
  // Amount display options
  export const AMOUNT_OPTIONS = [
    'Total HT', 'TVA', 'Total TTC', 'Montant à rembourser', 
    'Montant initial', 'Facture d\'origine', 'Mode de remboursement'
  ];
  
  // Footer elements options
  export const FOOTER_ELEMENTS = [
    { id: 'company_info', label: 'Informations société' },
    { id: 'special_mention', label: 'Mention spéciale "Avoir d\'acompte"' },
    { id: 'original_invoice_reference', label: 'Référence de la facture d\'origine' },
    { id: 'bank_details', label: 'Coordonnées bancaires pour remboursement' },
    { id: 'credit_reason', label: 'Motif de l\'avoir' }
  ];
  
  // Refund method options
  export const REFUND_METHODS = [
    { id: 'bank_transfer', label: 'Virement bancaire' },
    { id: 'next_invoice', label: 'Avoir sur prochaine facture' },
    { id: 'check', label: 'Chèque' },
    { id: 'card_refund', label: 'Remboursement carte bancaire' }
  ];
  
  // Color options
  export const DEFAULT_COLORS = {
    frameColor: '#E05D5D',
    labelTextColor: '#FFFFFF',
    labelBgColor: '#E05D5D',
    creditHighlightColor: '#E05D5D',
    otherTextColor: '#333333'
  };
  
  // Font options
  export const FONT_OPTIONS = [
    'Helvetica', 'Arial', 'Open Sans', 'Roboto', 'Montserrat'
  ];
  
  // Font size options
  export const FONT_SIZE_OPTIONS = [
    { value: 'small', label: '10px' },
    { value: 'medium', label: '12px' },
    { value: 'large', label: '14px' }
  ];