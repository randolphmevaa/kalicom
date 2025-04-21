// Template types
export interface InvoiceTemplate {
    id: string;
    name: string;
    description: string;
    isDefault: boolean;
    isHidden: boolean;
    lastModified: string;
    previewUrl: string;
    pdfUrl: string;
  }
  
  // Notification types
  export interface Notification {
    message: string;
    visible: boolean;
  }
  
  // Wizard data types
  export interface WizardFormData {
    headerStyle: string;
    headerElements: string[];
    bodyElements: string[];
    footerElements: string[];
    formatting: {
      primaryColor: string;
      secondaryColor: string;
      font: string;
      fontSize: string;
      paperSize: string;
    };
    templateName: string;
  }
  
  // Motion variants types
export interface MotionVariants {
  hidden: Record<string, unknown>;
  show: Record<string, unknown>;
  exit?: Record<string, unknown>;
  hover?: Record<string, unknown>;
}
  
  // Props for components
  export interface TemplateListProps {
    templates: InvoiceTemplate[];
    filteredTemplates: InvoiceTemplate[];
    selectedTemplate: string | null;
    searchQuery: string;
    showHiddenTemplates: boolean;
    onSelectTemplate: (id: string) => void;
    onSearchChange: (query: string) => void;
    onToggleHidden: (show: boolean) => void;
  }
  
  export interface TemplatePreviewProps {
    currentTemplate: InvoiceTemplate | undefined;
    onEdit: () => void;
    onToggleVisibility: () => void;
    onDelete: () => void;
    onExpand: () => void;
    onPrint: () => void;
    onDownload: () => void;
    onSetDefault: () => void;
    onCreateNew: () => void;
  }
  
  export interface DeleteConfirmModalProps {
    template: InvoiceTemplate | undefined;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  export interface ExpandedPreviewModalProps {
    template: InvoiceTemplate;
    onClose: () => void;
    onPrint: () => void;
    onDownload: () => void;
  }
  
  export interface TemplateWizardProps {
    onClose: () => void;
    onComplete: (data: WizardFormData) => void;
    initialData?: Partial<WizardFormData>;
  }
  
  export interface NotificationToastProps {
    message: string;
  }
  
  export interface WizardStepProps {
    wizardData: WizardFormData;
    updateWizardData: (data: Partial<WizardFormData>) => void;
  }