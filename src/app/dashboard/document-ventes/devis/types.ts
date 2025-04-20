import { ReactNode } from 'react';

// For each quote item
export interface Devis {
  id: string;
  date: string;
  prospect: string;
  montantHT: string;
  montantTTC: string;
  statut: DevisStatus; // e.g. "Accepté", "En attente", ...
  dateValidite: string;
  dateAcceptation: string | null;
  creePar: string;
  typeDevis: string;
  notes: string;
}

// Potential statuses for a quote
export type DevisStatus =
  | 'Accepté'
  | 'En attente'
  | 'Refusé'
  | 'Expiré'
  | 'En préparation'
  | string; // fallback if you introduce others

// For the "filter" statuses including "Tous"
export type FilterStatus = DevisStatus | 'Tous';

// For sorting, define the fields you actually allow
export type SortField =
  | 'id'
  | 'date'
  | 'prospect'
  | 'montantHT'
  | 'montantTTC'
  | 'statut'
  | 'dateValidite';

// For the "export" format
export type ExportFormat = 'pdf' | 'csv' | 'excel';

// For the period filter
export type FilterPeriod = 'Tous' | 'Ce mois' | 'Mois dernier' | 'Ce trimestre' | 'Cette année';

// For your stat cards
export interface Statistic {
  title: string;
  value: string;
  icon: ReactNode;
  trend: string;
  trendUp: boolean;
}

// Component Props Interfaces
export interface PaginationProps {
  filteredDevis: Devis[];
  totalDevis: number;
}

export interface EmptyStateProps {
  resetFilters: () => void;
}

export interface BulkActionsProps {
  selectedDevis: string[];
  transformToInvoice: (ids: string[]) => void;
}

export interface ExportPanelProps {
  showDateRangePicker: boolean;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  exportFormat: ExportFormat;
  setExportFormat: React.Dispatch<React.SetStateAction<ExportFormat>>;
  handleExport: () => void;
  setShowDateRangePicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FiltersPanelProps {
  showFilters: boolean;
  selectedStatus: FilterStatus;
  setSelectedStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<FilterPeriod>>;
  selectedProspect: string;
  setSelectedProspect: React.Dispatch<React.SetStateAction<string>>;
  statusOptions: FilterStatus[];
  periodOptions: FilterPeriod[];
  prospectOptions: string[];
  resetFilters: () => void;
}

export interface ActionBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  showDateRangePicker: boolean;
  setShowDateRangePicker: React.Dispatch<React.SetStateAction<boolean>>;
  transformToInvoice: (ids: string[]) => void;
  selectedDevis: string[];
  viewMode: 'compact' | 'comfortable';
  setViewMode: React.Dispatch<React.SetStateAction<'compact' | 'comfortable'>>;
  handleOpenCreateModal: () => void;
  clearSearch: () => void;
}

export interface StatisticsCardsProps {
  statistics: Statistic[];
}

export interface DevisTableProps {
  sortedDevis: Devis[];
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: SortField) => void;
  selectedDevis: string[];
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (devisId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  selectAll: boolean;
  expandedRow: string | null;
  handleRowClick: (devisId: string) => void;
  transformToInvoice: (ids: string[]) => void;
}

// Define interfaces for proper typing
export interface CreateQuoteModalProps {
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
  validite: string;
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

// Sample data
export const articlesCommuns: Article[] = [
  { code: 'ART001', desc: 'Consultation standard', prix: '75.00', unite: 'h', tva: '20.00' },
  { code: 'ART002', desc: 'Maintenance informatique', prix: '95.00', unite: 'h', tva: '20.00' },
  { code: 'ART003', desc: 'Développement sur mesure', prix: '120.00', unite: 'h', tva: '20.00' },
  { code: 'ART004', desc: 'Formation utilisateurs', prix: '650.00', unite: 'jour', tva: '20.00' },
  { code: 'ART005', desc: 'Audit de sécurité', prix: '1200.00', unite: 'forfait', tva: '20.00' },
];

// Sample client data
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