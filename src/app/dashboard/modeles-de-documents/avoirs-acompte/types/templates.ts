// Template type definitions
export interface DepositCreditNoteTemplate {
    id: string;
    name: string;
    description: string;
    isDefault: boolean;
    isHidden: boolean;
    lastModified: string;
    previewUrl: string;
    pdfUrl: string;
    depositPercentage?: number;
    linkedInvoice?: string;
  }

  export interface FormattingOptions {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    fontSize: string;
    paperSize: string;
    hideBorders?: boolean;
    hideHeaders?: boolean;
    showWatermark?: boolean;
    frameBorderColor?: string;
    highlightColor?: string;
  }
  
//   // Wizard data structure
  export interface WizardData {
    headerStyle: string;
    headerElements: string[];
    bodyElements: string[];
    footerElements: string[];
    // creditOptions: {
    //   type: 'full' | 'percentage' | 'fixed';
    //   percentage: number;
    //   fixedAmount: number;
    //   showOriginalAmount: boolean;
    //   referencedInvoice: string;
    //   refundMethod: string;
    // };
    // formatting: {
    //   primaryColor: string;
    //   secondaryColor: string;
    //   font: string;
    //   fontSize: string;
    //   paperSize: string;
    // };
    // templateName: string;
  }

  // File: types/templates.ts

export interface CreditOptions {
    type: 'full' | 'percentage' | 'fixed';
    percentage: number;
    fixedAmount: number;
    referencedInvoice: string;
    refundMethod: string;
    reason?: string;
    comment?: string;
  }
  
  export interface FormattingOptions {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    fontSize: string;
    paperSize: string;
    // Additional properties used in the FormattingStep component
    hideBorders?: boolean;
    hideHeaders?: boolean;
    showWatermark?: boolean;
    frameBorderColor?: string;
    highlightColor?: string;
  }
  
// File: types/templates.ts

// Template type definitions
export interface DepositCreditNoteTemplate {
    id: string;
    name: string;
    description: string;
    isDefault: boolean;
    isHidden: boolean;
    lastModified: string;
    previewUrl: string;
    pdfUrl: string;
    depositPercentage?: number;
    linkedInvoice?: string;
  }
  
  // Credit options interface
  export interface CreditOptions {
    type: 'full' | 'percentage' | 'fixed';
    percentage: number;
    fixedAmount: number;
    showOriginalAmount?: boolean;
    referencedInvoice: string;
    refundMethod: string;
    reason?: string;
    comment?: string;
  }
  
  // Formatting options interface
  export interface FormattingOptions {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    fontSize: string;
    paperSize: string;
    // Additional properties used in the FormattingStep component
    hideBorders?: boolean;
    hideHeaders?: boolean;
    showWatermark?: boolean;
    frameBorderColor?: string;
    highlightColor?: string;
  }
  
  // Wizard data structure - consolidated version
  export interface WizardData {
    // Step 1: Header style
    headerStyle: string;
    
    // Step 2: Header data
    headerElements: string[];
    
    // Step 3: Original invoice reference
    creditOptions: CreditOptions;
    
    // Step 4: Body & Footer
    bodyElements: string[];
    footerElements: string[];
    
    // Step 5: Formatting
    formatting: FormattingOptions;
    
    // Additional properties
    templateName?: string;
  }
  
  // Props interface for step components
  export interface StepComponentProps {
    wizardData: WizardData;
    setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
  }