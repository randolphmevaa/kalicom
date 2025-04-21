'use client';

import { useState, lazy, Suspense } from 'react';
// Only import the essential parts of framer-motion that you need immediately
import { motion, Variants } from 'framer-motion';
import { PageHeader } from './components/PageHeader';
import { TemplateList } from './components/TemplateList';
import { TemplatePreview } from './components/TemplatePreview';

// Lazy load components that aren't needed on initial render
const NotificationToast = lazy(() => import('./components/NotificationToast').then(module => ({ 
  default: module.NotificationToast 
})));

const DeleteConfirmModal = lazy(() => import('./components/NotificationToast').then(module => ({ 
  default: module.DeleteConfirmModal 
})));

const ExpandedPreviewModal = lazy(() => import('./components/NotificationToast').then(module => ({ 
  default: module.ExpandedPreviewModal 
})));

const TemplateWizard = lazy(() => import('./components/TemplateWizard').then(module => ({ 
  default: module.TemplateWizard 
})));

// Define types
export interface CreditNoteTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isHidden: boolean;
  lastModified: string;
  previewUrl: string;
  pdfUrl: string;
}

export default function ModeleAvoir() {
  // State declarations remain the same
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  // Lazy load the templates data (could be fetched from an API in a real app)
  const [templates] = useState<CreditNoteTemplate[]>(() => [
    {
      id: 'template1',
      name: 'Avoir avec référence facture',
      description: 'Modèle d\'avoir incluant la référence à la facture d\'origine',
      isDefault: true,
      isHidden: false,
      lastModified: '18/03/2025',
      previewUrl: '/specimen-avoir-facture.png',
      pdfUrl: '/avoir-facture.pdf'
    },
    {
      id: 'template2',
      name: 'Avoir partiel',
      description: 'Modèle pour remboursement partiel avec détail par poste',
      isDefault: false,
      isHidden: false,
      lastModified: '10/02/2025',
      previewUrl: '/specimen-avoir-partiel.png',
      pdfUrl: '/avoir-partiel.pdf'
    },
    {
      id: 'template3',
      name: 'Avoir Pré-imprimé',
      description: 'Compatible avec papier à en-tête personnalisé',
      isDefault: false,
      isHidden: false,
      lastModified: '05/02/2025',
      previewUrl: '/specimen-avoir-preprinted.png',
      pdfUrl: '/avoir-preprinted.pdf'
    },
    {
      id: 'template4',
      name: 'Avoir professionnel simple',
      description: 'Modèle standard avec affichage clair des montants remboursés',
      isDefault: false,
      isHidden: false,
      lastModified: '25/01/2025',
      previewUrl: '/specimen-avoir-pro.png',
      pdfUrl: '/avoir-pro.pdf'
    },
    {
      id: 'template5',
      name: 'Liste des avoirs',
      description: 'Mise en page pour impression de récapitulatifs',
      isDefault: false,
      isHidden: true,
      lastModified: '11/12/2024',
      previewUrl: '/specimen-avoir-list.png',
      pdfUrl: '/avoir-list.pdf'
    }
  ]);

  // If we don't have a selected template, set the first one
  if (!selectedTemplate && templates.length > 0) {
    setSelectedTemplate(templates[0].id);
  }

  // Rest of your functions and logic remain the same
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isVisible = showHiddenTemplates || !template.isHidden;
    
    return matchesSearch && isVisible;
  });

  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  // Remaining functions stay the same...
  const toggleTemplateVisibility = (id: string) => {
    console.log(`Toggling visibility for template: ${id}`);
    showNotification('État du modèle modifié avec succès');
  };

  const setAsDefault = (id: string) => {
    console.log(`Setting template ${id} as default`);
    showNotification('Modèle défini par défaut avec succès');
  };

  const confirmDeleteTemplate = () => {
    if (!currentTemplate) return;
    
    console.log(`Deleting template: ${currentTemplate.id}`);
    setDeleteConfirmOpen(false);
    
    if (filteredTemplates.length > 1) {
      const newSelectedId = filteredTemplates.find(t => t.id !== currentTemplate.id)?.id;
      setSelectedTemplate(newSelectedId || null);
    } else {
      setSelectedTemplate(null);
    }
    
    showNotification('Modèle supprimé avec succès');
  };

  const printTemplate = () => {
    console.log(`Printing template: ${selectedTemplate}`);
    showNotification('Impression en cours...');
  };
  
  const downloadPdf = () => {
    if (!currentTemplate) return;
    console.log(`Downloading template as PDF: ${currentTemplate.pdfUrl}`);
    showNotification('Téléchargement du PDF en cours...');
  };
  
  // Lazy initialize complex state
  const [wizardData, setWizardData] = useState(() => ({
    headerStyle: 'standard',
    headerElements: ['logo', 'company', 'creditNoteNumber', 'creditNoteDate', 'originalInvoice'],
    bodyElements: ['clientInfo', 'items', 'subtotal', 'taxes', 'total'],
    footerElements: ['refundMethod', 'contact', 'legalInfo'],
    formatting: {
      primaryColor: '#6C5DD3',
      secondaryColor: '#f3f4f6',
      font: 'Helvetica',
      fontSize: 'medium',
      paperSize: 'A4'
    },
    templateName: 'Nouveau modèle d\'avoir'
  }));
  
  const createNewTemplate = () => {
    setShowEditor(true);
    setWizardStep(1);
    setSelectedTemplate(null);
  };
  
  const goToNextStep = () => {
    const totalSteps = 5;
    if (wizardStep < totalSteps) {
      setWizardStep(wizardStep + 1);
    } else {
      finishTemplateCreation();
    }
  };
  
  const goToPreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };
  
  const finishTemplateCreation = () => {
    console.log('Creating template with data:', wizardData);
    showNotification('Modèle créé avec succès');
    setShowEditor(false);
  };
  
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({
    message: '',
    visible: false
  });
  
  const showNotification = (message: string) => {
    setNotification({
      message,
      visible: true
    });
    
    setTimeout(() => {
      setNotification(prev => ({...prev, visible: false}));
    }, 3000);
  };

  const toggleExpandedPreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Lazily render components only when needed */}
      <Suspense fallback={<div className="fixed top-4 right-4 z-50">Chargement...</div>}>
        {notification.visible && (
          <NotificationToast notification={notification} />
        )}
      </Suspense>
      
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">Chargement...</div>}>
        {deleteConfirmOpen && (
          <DeleteConfirmModal 
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={confirmDeleteTemplate}
            templateName={currentTemplate?.name}
          />
        )}
      </Suspense>
      
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">Chargement...</div>}>
        {isPreviewExpanded && (
          <ExpandedPreviewModal
            isOpen={isPreviewExpanded}
            onClose={toggleExpandedPreview}
            template={currentTemplate}
            onDownload={downloadPdf}
            onPrint={printTemplate}
          />
        )}
      </Suspense>
      
      <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">Chargement...</div>}>
        {showEditor && (
          <TemplateWizard
            isOpen={showEditor}
            onClose={() => setShowEditor(false)}
            step={wizardStep}
            totalSteps={5}
            wizardData={wizardData}
            setWizardData={setWizardData}
            onNextStep={goToNextStep}
            onPreviousStep={goToPreviousStep}
          />
        )}
      </Suspense>
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Main content */}
        <PageHeader 
          templateCount={filteredTemplates.length}
          onPrint={printTemplate}
          onSetDefault={() => selectedTemplate && setAsDefault(selectedTemplate)}
          onCreateNew={createNewTemplate}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          <TemplateList
            templates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showHiddenTemplates={showHiddenTemplates}
            setShowHiddenTemplates={setShowHiddenTemplates}
            totalTemplates={templates.length}
          />
          
          <TemplatePreview
            template={currentTemplate}
            onToggleVisibility={() => currentTemplate && toggleTemplateVisibility(currentTemplate.id)}
            onDelete={() => setDeleteConfirmOpen(true)}
            onEdit={() => setShowEditor(true)}
            onExpand={toggleExpandedPreview}
            onDownload={downloadPdf}
            onPrint={printTemplate}
            onCreateNew={createNewTemplate}
          />
        </div>
      </div>
    </motion.div>
  );
}