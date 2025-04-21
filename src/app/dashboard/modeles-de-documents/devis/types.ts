// Template data interface
export interface QuoteTemplate {
    id: string;
    name: string;
    description: string;
    isDefault: boolean;
    isHidden: boolean;
    lastModified: string;
    previewUrl: string;
    pdfUrl: string;
  }
  
  // Notification type
  export interface Notification {
    message: string;
    visible: boolean;
  }
  
  // Wizard form data interface
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