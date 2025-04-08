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
