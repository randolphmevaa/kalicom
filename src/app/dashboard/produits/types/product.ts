// types.ts - Create a shared types file to consolidate type definitions

// Main Product interface - this should be used across all components
export interface Product {
    id: number;
    nom: string;
    reference: string;
    description: string;
    prix: string;
    prixAchat: string;
    categorie: string;
    statut: string;
    stock: string;
    dateCreation: string;
    dateMiseAJour: string;
    image: string;
    vendu: number; // This is a number, not a string
  
    // Optional fields from ProductDetailsModal
    descriptionCommerciale?: string;
    tauxTVA?: string;
    prixVenteHT?: string;
    quantiteParDefaut?: string;
    uniteVente?: string;
    codeBarre?: string;
    monnaie?: string;
    poids?: string;
    unitesPoids?: string;
    isServicePersonne?: boolean;
    intervenantPrincipal?: string;
    nombreHeuresQuantite?: boolean;
    ecoContribution?: string;
    compteComptable?: string;
    classificationStatut?: string;
    fraisPourcentage?: string;
    prixRevient?: string;
    tauxMargePourcentage?: string;
    tauxMarque?: string;
  }
  
  // // If needed, you can create additional interfaces that extend Product
  // export interface ProductFormData extends Product {
  //   // Add any form-specific fields here if needed
  //   // Making sure all required fields in Product are included
  // }