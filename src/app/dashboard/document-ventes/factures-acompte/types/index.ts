// types/index.ts

export interface CreateDepositInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
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
    projetLie: string;
    montantTotal: string;
    pourcentageAcompte: string;
    montantAcompte: string;
    etat: string;
    date: string;
    dateEcheance: string;
    modeReglement: string;
    typePaiement: 'pourcentage' | 'montant';
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
    totalTTC: string;
    soitTTC: string;
    montantAcompte: string;
    pourcentageAcompte: string;
    soldeFinalPrevu: string;
  }
  
  export interface Project {
    id: string;
    titre: string;
    client: string;
    montant: string;
    echeance: string;
  }
  
  export interface Article {
    code: string;
    desc: string;
    prix: string;
    unite: string;
    tva: string;
  }
  
  export interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientType: 'client' | 'prospect';
  }
  
  export interface ProjectSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectSearch: string;
    setProjectSearch: (search: string) => void;
    filteredProjects: Project[];
    selectProject: (project: Project) => void;
  }
  
  export interface ArticleSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectArticle: (article: Article) => void;
    articles: Article[];
  }
  
  export interface SaveConfirmationProps {
    isOpen: boolean;
  }
  
  export interface LineItemsTableProps {
    lineItems: LineItem[];
    handleLineItemChange: (id: number, field: keyof LineItem, value: string | number) => void;
    openArticleSelection: (id: number) => void;
    removeLineItem: (id: number) => void;
  }
  
  export interface ProjectSectionProps {
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleTogglePaymentType: (type: 'pourcentage' | 'montant') => void;
    setShowProjectModal: (show: boolean) => void;
    applyPresetPercentage: (percentage: string) => void;
  }
  
  export interface ClientInfoSectionProps {
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    clients: Client[];
    clientSearch: string;
    setClientSearch: (search: string) => void;
    showClientDropdown: boolean;
    setShowClientDropdown: (show: boolean) => void;
    selectClient: (client: Client) => void;
    handleAddClient: (type: 'client' | 'prospect') => void;
    filteredClients: Client[];
    moyensPaiement: string[];
  }
  
  export interface InvoiceTotalsProps {
    totals: Totals;
    setTotals: React.Dispatch<React.SetStateAction<Totals>>;
    formData: FormData;
  }