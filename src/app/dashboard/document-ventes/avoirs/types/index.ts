// types/index.ts

export interface CreateCreditNoteModalProps {
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
  
  export interface Invoice {
    id: string;
    client: string;
    date: string;
    montantTTC: string;
    statut: string;
  }
  
  export interface Article {
    code: string;
    desc: string;
    prix: string;
    unite: string;
    tva: string;
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
    factureLiee: string;
    motif: string;
    etat: string;
    date: string;
    dateReglement: string;
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
    totalTTC: string;
    soitTTC: string;
    netARembourser: string;
  }
  
  export interface InvoiceSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceSearch: string;
    setInvoiceSearch: (search: string) => void;
    filteredInvoices: Invoice[];
    selectInvoice: (invoice: Invoice) => void;
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
    addLineItem: () => void;
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
    filteredClients: Client[];
    moyensPaiement: string[];
    refundReasons: string[];
    setShowInvoiceModal: (show: boolean) => void;
  }
  
  export interface CreditNoteTotalsProps {
    totals: Totals;
    setTotals: React.Dispatch<React.SetStateAction<Totals>>;
    formData: FormData;
  }
  
  export interface CreditNoteHeaderProps {
    onClose: () => void;
  }