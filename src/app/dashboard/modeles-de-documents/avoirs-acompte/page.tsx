'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FiPrinter,
  FiKey,
  FiStar,
  FiPlus,
  FiInfo,
  FiFileText,
} from 'react-icons/fi';

// Simple components load immediately
import Notification from './components/ui/Notification';
import TemplateList from './components/templates/TemplateList';

// Lazy load components that aren't needed on initial render
const TemplatePreview = lazy(() => import('./components/templates/TemplatePreview'));
const DeleteConfirmModal = lazy(() => import('./components/templates/DeleteConfirmModal'));
const ExpandedPreviewModal = lazy(() => import('./components/templates/ExpandedPreviewModal'));
const TemplateWizard = lazy(() => import('./components/templates/TemplateWizard'));

// Types
import { DepositCreditNoteTemplate, WizardData } from './types/templates';

// Fallback loaders
const PreviewFallback = () => (
  <div className="md:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col items-center justify-center p-8">
    <div className="w-24 h-24 rounded-full border-4 border-t-[#E05D5D] border-gray-200 animate-spin mb-4"></div>
    <p className="text-gray-500">Chargement de l&apos;aperçu...</p>
  </div>
);

const ModalFallback = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md flex flex-col items-center">
      <div className="w-16 h-16 rounded-full border-4 border-t-[#E05D5D] border-gray-200 animate-spin"></div>
      <p className="text-gray-700 mt-4">Chargement...</p>
    </div>
  </div>
);

export default function ModeleAvoirAcompte() {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  // Loading state for templates
  const [templates, setTemplates] = useState<DepositCreditNoteTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch templates with artificial delay to simulate API call
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTemplates = async () => {
      setIsLoading(true);
      
      // Sample data
      const data: DepositCreditNoteTemplate[] = [
        {
          id: 'template1',
          name: 'Avoir d\'acompte standard',
          description: 'Modèle d\'avoir d\'acompte pour annulation de commande',
          isDefault: true,
          isHidden: false,
          lastModified: '12/03/2025',
          previewUrl: '/specimen-avoir-standard.png',
          pdfUrl: '/avoir-acompte-standard.pdf',
          depositPercentage: 30,
          linkedInvoice: 'FA-2025-A0042'
        },
        {
          id: 'template2',
          name: 'Avoir acompte 50%',
          description: 'Pour remboursement d\'acomptes de 50% sur travaux annulés',
          isDefault: false,
          isHidden: false,
          lastModified: '05/02/2025',
          previewUrl: '/specimen-avoir-50.png',
          pdfUrl: '/avoir-acompte-50.pdf',
          depositPercentage: 50,
          linkedInvoice: 'FA-2025-A0038'
        },
        {
          id: 'template3',
          name: 'Avoir montant fixe',
          description: 'Pour avoirs sur acomptes à montant fixe',
          isDefault: false,
          isHidden: false,
          lastModified: '28/01/2025',
          previewUrl: '/specimen-avoir-fixe.png',
          pdfUrl: '/avoir-acompte-fixe.pdf',
          linkedInvoice: 'FA-2025-A0027'
        },
        {
          id: 'template4',
          name: 'Avoir partiel d\'acompte',
          description: 'Pour remboursement partiel sur un acompte versé',
          isDefault: false,
          isHidden: false,
          lastModified: '15/01/2025',
          previewUrl: '/specimen-avoir-partiel.png',
          pdfUrl: '/avoir-acompte-partiel.pdf',
          depositPercentage: 40,
          linkedInvoice: 'FA-2025-A0018'
        },
        {
          id: 'template5',
          name: 'Avoir détaillé multi-lignes',
          description: 'Pour avoirs d\'acompte avec détails par prestation',
          isDefault: false,
          isHidden: true,
          lastModified: '02/12/2024',
          previewUrl: '/specimen-avoir-detaille.png',
          pdfUrl: '/avoir-acompte-detaille.pdf',
          linkedInvoice: 'FA-2024-A0127'
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setTemplates(data);
      setIsLoading(false);
    };
    
    fetchTemplates();
  }, []);
  
  // Notification system
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({
    message: '',
    visible: false
  });
  
  // Set initial template when data is loaded
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates, selectedTemplate]);

  // Filtered templates based on search and visibility
  const filteredTemplates = templates.filter(template => {
    // Filter by search query
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by visibility
    const isVisible = showHiddenTemplates || !template.isHidden;
    
    return matchesSearch && isVisible;
  });

  // Get the current selected template object
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || (templates.length > 0 ? templates[0] : undefined);

  // Toggle template visibility
  const toggleTemplateVisibility = (id: string) => {
    // In a real app, this would update the template in your database
    console.log(`Toggling visibility for template: ${id}`);
    // Show success notification
    showNotification('État du modèle modifié avec succès');
  };

  // Set template as default
  const setAsDefault = (id: string) => {
    // In a real app, this would update the template in your database
    console.log(`Setting template ${id} as default`);
    // Show success notification
    showNotification('Modèle défini par défaut avec succès');
  };

  // Delete template confirmation
  const confirmDeleteTemplate = () => {
    if (!currentTemplate) return;
    
    // In a real app, this would delete the template from your database
    console.log(`Deleting template: ${currentTemplate.id}`);
    
    // Close confirmation modal
    setDeleteConfirmOpen(false);
    
    // Select first available template
    if (filteredTemplates.length > 1) {
      const newSelectedId = filteredTemplates.find(t => t.id !== currentTemplate.id)?.id;
      setSelectedTemplate(newSelectedId || null);
    } else {
      setSelectedTemplate(null);
    }
    
    // Show success notification
    showNotification('Modèle supprimé avec succès');
  };

  // Print the template
  const printTemplate = () => {
    console.log(`Printing template: ${selectedTemplate}`);
    showNotification('Impression en cours...');
  };
  
  // Download template as PDF
  const downloadPdf = () => {
    if (!currentTemplate) return;
    console.log(`Downloading template as PDF: ${currentTemplate.pdfUrl}`);
    showNotification('Téléchargement du PDF en cours...');
  };
  
  // Initial wizard data (memoized to avoid re-creation on every render)
  const initialWizardData = React.useMemo<WizardData>(() => ({
    headerStyle: 'standard',
    headerElements: ['logo', 'company', 'creditNoteNumber', 'creditNoteDate'],
    bodyElements: ['clientInfo', 'items', 'subtotal', 'taxes', 'creditAmount', 'originalInvoice'],
    footerElements: ['refundInfo', 'contact', 'legalInfo'],
    creditOptions: {
      type: 'percentage',
      percentage: 30,
      fixedAmount: 0,
      showOriginalAmount: true,
      referencedInvoice: '',
      refundMethod: 'bank_transfer'
    },
    formatting: {
      primaryColor: '#E05D5D',
      secondaryColor: '#f3f4f6',
      font: 'Helvetica',
      fontSize: 'medium',
      paperSize: 'A4'
    },
    templateName: 'Nouveau modèle d\'avoir d\'acompte'
  }), []);
  
  // Create new template
  const createNewTemplate = () => {
    setShowEditor(true);
    // Clear any selected template
    setSelectedTemplate(null);
  };
  
  // Show notification
  const showNotification = (message: string) => {
    setNotification({
      message,
      visible: true
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, visible: false}));
    }, 3000);
  };

  // Handle expanded preview
  const toggleExpandedPreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  /**
   * Framer Motion Variants
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Notification */}
      <Notification 
        message={notification.message} 
        visible={notification.visible} 
      />
      
      {/* Delete Confirmation Modal - only load when needed */}
      {deleteConfirmOpen && (
        <Suspense fallback={<ModalFallback />}>
          <DeleteConfirmModal 
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={confirmDeleteTemplate}
            templateName={currentTemplate?.name || ''}
          />
        </Suspense>
      )}
      
      {/* Expanded Preview Modal - only load when needed */}
      {isPreviewExpanded && (
        <Suspense fallback={<ModalFallback />}>
          <ExpandedPreviewModal 
            isOpen={isPreviewExpanded}
            onClose={toggleExpandedPreview}
            template={currentTemplate}
            onDownload={downloadPdf}
            onPrint={printTemplate}
          />
        </Suspense>
      )}
      
      {/* Template Wizard Modal - only load when needed */}
      {showEditor && (
        <Suspense fallback={<ModalFallback />}>
          <TemplateWizard 
            isOpen={showEditor}
            onClose={() => setShowEditor(false)}
            initialData={initialWizardData}
            onComplete={(data) => {
              console.log('Creating template with data:', data);
              showNotification('Modèle créé avec succès');
              setShowEditor(false);
            }}
          />
        </Suspense>
      )}
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* ---------- HEADER / HERO SECTION ---------- */}
        <motion.div
          variants={headerVariants}
          className="relative mt-20 mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background gradient with pattern - preloaded with low quality */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#E05D5D]/10 via-white/70 to-[#F19797]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#E05D5D]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#F19797]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#E05D5D]/10 rounded-lg">
                    <FiFileText className="w-6 h-6 text-[#E05D5D]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#C04040] to-[#F19797]">
                    Modèles d&apos;Avoirs d&apos;Acompte
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#E05D5D] bg-[#E05D5D]/10 rounded-full">
                    {filteredTemplates.length} modèles
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez et personnalisez vos modèles d&apos;impression pour avoirs d&apos;acompte.
                  Sélectionnez un modèle pour visualiser et modifier son apparence.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={printTemplate}
                  className="flex items-center px-4 py-2.5 bg-[#E05D5D] text-white rounded-xl hover:bg-[#D04D4D] transition shadow-sm"
                  title="Imprimer le modèle sélectionné"
                >
                  <FiPrinter className="mr-2" />
                  Imprimer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2.5 bg-[#E05D5D]/10 text-[#E05D5D] rounded-xl hover:bg-[#E05D5D]/20 transition"
                  title="Consulter les mots-clés disponibles"
                >
                  <FiKey className="mr-2" />
                  Mots-clés
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectedTemplate && setAsDefault(selectedTemplate)}
                  className="flex items-center px-4 py-2.5 bg-[#E05D5D]/10 text-[#E05D5D] rounded-xl hover:bg-[#E05D5D]/20 transition"
                  title="Définir comme modèle par défaut"
                >
                  <FiStar className="mr-2" />
                  Modèle par défaut
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createNewTemplate}
                  className="flex items-center px-4 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-sm"
                  title="Créer un nouveau modèle"
                >
                  <FiPlus className="mr-2" />
                  Nouveau modèle
                </motion.button>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Les avoirs d&apos;acompte doivent toujours référencer la facture d&apos;acompte d&apos;origine. 
                  Assurez-vous que votre modèle indique clairement le montant à rembourser et le motif de l&apos;avoir.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- MAIN CONTENT GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {/* ----- LEFT COLUMN: Template List ----- */}
          {isLoading ? (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 flex justify-center items-center">
              <div className="w-12 h-12 rounded-full border-4 border-t-[#E05D5D] border-gray-200 animate-spin"></div>
            </div>
          ) : (
            <TemplateList 
              templates={filteredTemplates}
              selectedId={selectedTemplate}
              onSelect={setSelectedTemplate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showHidden={showHiddenTemplates}
              onToggleShowHidden={() => setShowHiddenTemplates(!showHiddenTemplates)}
              totalTemplates={templates.length}
            />
          )}
          
          {/* ----- RIGHT COLUMN: Template Preview ----- */}
          {isLoading ? (
            <PreviewFallback />
          ) : (
            <Suspense fallback={<PreviewFallback />}>
              <TemplatePreview 
                template={currentTemplate}
                onEdit={() => setShowEditor(true)}
                onToggleVisibility={() => currentTemplate && toggleTemplateVisibility(currentTemplate.id)}
                onDelete={() => setDeleteConfirmOpen(true)}
                onExpandPreview={toggleExpandedPreview}
                onDownloadPdf={downloadPdf}
                onPrint={printTemplate}
                onCreateNew={createNewTemplate}
              />
            </Suspense>
          )}
        </div>
      </div>
    </motion.div>
  );
}