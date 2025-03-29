// types.ts - Shared type definitions for the application

// Main Product interface - to be used across all components
export interface Product {
    // Required fields
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
    vendu: number; // This is defined as a number
  
    // Optional fields
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
  
  // Form-specific interface for internal form state
  export interface ProductFormData {
    // Basic fields
    nom: string;
    reference: string;
    description: string;
    categorie: string;
    statut: string;
    image: string;
    stock: string;
    
    // Form-specific fields
    prixVenteTTC: string;
    modifieLe: string;
    
    // All other fields from Product can be optional in form state
    id?: number;
    prix?: string;
    prixAchat: string;
    dateCreation?: string;
    dateMiseAJour?: string;
    vendu?: number;
    
    // Other optional fields
    descriptionCommerciale: string;
    tauxTVA: string;
    prixVenteHT: string;
    quantiteParDefaut: string;
    uniteVente: string;
    codeBarre: string;
    monnaie: string;
    poids: string;
    unitesPoids: string;
    isServicePersonne: boolean;
    intervenantPrincipal: string;
    nombreHeuresQuantite: boolean;
    ecoContribution: string;
    compteComptable: string;
    classificationStatut: string;
    fraisPourcentage: string;
    prixRevient: string;
    tauxMargePourcentage: string;
    tauxMarque: string;
  }