// types.ts
export interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    entreprise: string;
    ville: string;
    pays: string;
    adresse: string;
    statut: string;
    source: string;
    tags: string[];
    dernierContact: string;
    valeurTotale: string;
  }
  
  export interface Stats {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    pendingClients: number;
    vipClients: number;
    totalValue: number;
    lastMonthNewClients: number;
  }
  
  export interface DocumentOption {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
  }
  
  // Tag color mapping
  export const tagColors: { [key: string]: string } = {
    "VIP": "#1B0353",
    "Fidèle": "#004AC8",
    "Nouveau": "#4BB2F6",
    "Prospect": "#004AC8",
    "International": "#1B0353",
    "Ancien": "#4BB2F6",
    "default": "#4BB2F6"
  };
  