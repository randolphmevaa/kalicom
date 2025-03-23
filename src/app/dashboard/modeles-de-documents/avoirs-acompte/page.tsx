'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FiPrinter,
  FiKey,
  FiStar,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEyeOff,
  FiEye,
  FiInfo,
  FiFileText,
  FiDownload,
  FiX,
  FiCheck,
  FiChevronRight,
  FiCalendar,
  FiSearch,
  FiArrowLeft,
  FiPercent,
  FiRefreshCw
} from 'react-icons/fi';

// Define types
interface DepositCreditNoteTemplate {
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

export default function ModeleAvoirAcompte() {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  // const [activeTab, setActiveTab] = useState<'design' | 'preview'>('preview');
  
  // Sample data
  const templates: DepositCreditNoteTemplate[] = [
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

  // If we don't have a selected template, set the first one
  if (!selectedTemplate && templates.length > 0) {
    setSelectedTemplate(templates[0].id);
  }

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
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

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
  
  // State for wizard steps
  const [wizardStep, setWizardStep] = useState(1);
  const totalSteps = 5;
  
  // Wizard form data
  const [wizardData, setWizardData] = useState({
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
  });
  
  // Create new template
  const createNewTemplate = () => {
    setShowEditor(true);
    setWizardStep(1);
    // Clear any selected template
    setSelectedTemplate(null);
  };
  
  // Go to next step in wizard
  const goToNextStep = () => {
    if (wizardStep < totalSteps) {
      setWizardStep(wizardStep + 1);
    } else {
      // On the last step, finalize creation
      finishTemplateCreation();
    }
  };
  
  // Go to previous step in wizard
  const goToPreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };
  
  // Save template and close wizard
  const finishTemplateCreation = () => {
    // In a real app, this would send the data to your backend
    console.log('Creating template with data:', wizardData);
    showNotification('Modèle créé avec succès');
    setShowEditor(false);
  };
  
  // Notification system (simple version)
  const [notification, setNotification] = useState<{message: string, visible: boolean}>({
    message: '',
    visible: false
  });
  
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

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { ease: 'easeOut', duration: 0.3 }
    },
    hover: { 
      x: 5,
      transition: { ease: 'easeOut', duration: 0.2 }
    }
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Handle expanded preview
  const toggleExpandedPreview = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Notification */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center"
          >
            <FiCheck className="mr-2" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Supprimer le modèle</h3>
                <button 
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer le modèle &quot;<span className="font-medium">{currentTemplate?.name}</span>&quot; ? 
                Cette action est irréversible.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteTemplate}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expanded Preview Modal */}
      <AnimatePresence>
        {isPreviewExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FiFileText className="mr-2 text-[#E05D5D]" />
                  {currentTemplate?.name}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={downloadPdf}
                    className="px-3 py-2 rounded-lg bg-[#E05D5D]/10 text-[#E05D5D] hover:bg-[#E05D5D]/20 transition flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Télécharger
                  </button>
                  <button
                    onClick={printTemplate}
                    className="px-3 py-2 rounded-lg bg-[#E05D5D] text-white hover:bg-[#D04D4D] transition flex items-center"
                  >
                    <FiPrinter className="mr-2" />
                    Imprimer
                  </button>
                  <button 
                    onClick={toggleExpandedPreview}
                    className="text-gray-500 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow overflow-auto p-6 bg-gray-100 flex items-center justify-center">
                {/* This would be replaced with a proper PDF viewer in a real app */}
                <div className="w-[650px] bg-white shadow-xl rounded-lg overflow-hidden">
                  {/* PDF Content */}
                  <iframe 
                    src={currentTemplate?.pdfUrl || '/avoir-acompte-specimen.pdf'}
                    className="w-full h-[800px]"
                    title={`Aperçu de ${currentTemplate?.name}`}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Template Wizard Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col"
            >
              {/* Wizard Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg mr-3 text-gray-500"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">Nouveau modèle d&apos;avoir d&apos;acompte</h2>
                </div>
                
                <div className="text-sm text-gray-500">
                  Étape {wizardStep} sur {totalSteps}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="relative">
                  {/* Bar background */}
                  <div className="h-2 bg-gray-200 rounded-full">
                    {/* Progress fill */}
                    <motion.div 
                      className="absolute top-0 left-0 h-2 bg-[#E05D5D] rounded-full"
                      initial={{ width: `${((wizardStep-1) / totalSteps) * 100}%` }}
                      animate={{ width: `${(wizardStep / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  {/* Step indicators */}
                  <div className="flex justify-between mt-2">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                      <div key={index} className="flex flex-col items-center mt-1">
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1
                            ${index + 1 < wizardStep 
                              ? 'bg-[#E05D5D] text-white' 
                              : index + 1 === wizardStep 
                                ? 'bg-white border-2 border-[#E05D5D] text-[#E05D5D]' 
                                : 'bg-white border border-gray-300 text-gray-400'
                            }`}
                        >
                          {index + 1 < wizardStep ? '✓' : index + 1}
                        </div>
                        <span className={`text-xs whitespace-nowrap ${
                          index + 1 === wizardStep ? 'text-[#E05D5D] font-medium' : 'text-gray-500'
                        }`}>
                          {index === 0 && "Entête: style"}
                          {index === 1 && "Entête: données"}
                          {index === 2 && "Facture de référence"}
                          {index === 3 && "Corps & Pied"}
                          {index === 4 && "Mise en forme"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Wizard Content */}
              <div className="flex-grow p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {/* Step 1: Header Style */}
                    {wizardStep === 1 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: choix du style</h3>
                        <p className="text-gray-600 mb-6">Choisir dans la liste ci-dessous, le style d&apos;entête du modèle d&apos;impression</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                          {[
                            { name: 'Standard', desc: 'Logo à gauche, informations à droite' },
                            { name: 'Moderne', desc: 'Design épuré avec entête colorée' },
                            { name: 'Classique', desc: 'Présentation traditionnelle centrée' },
                            { name: 'Minimaliste', desc: 'Style simple sans fioritures' },
                            { name: 'Élégant', desc: 'Mise en page sophistiquée' },
                            { name: 'Professionnel', desc: 'Présentation business formelle' }
                          ].map((style, index) => (
                            <div 
                              key={index}
                              onClick={() => setWizardData({...wizardData, headerStyle: style.name.toLowerCase()})}
                              className={`border rounded-xl p-4 cursor-pointer transition-all
                                ${wizardData.headerStyle === style.name.toLowerCase() 
                                  ? 'border-[#E05D5D] bg-[#E05D5D]/5 shadow-md' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-800">{style.name}</h4>
                                {wizardData.headerStyle === style.name.toLowerCase() && (
                                  <div className="w-5 h-5 bg-[#E05D5D] rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-xs text-gray-500 mb-3">{style.desc}</p>
                              
                              {/* Header style preview */}
                              <div className="h-24 bg-white border rounded-lg overflow-hidden shadow-sm">
                                {style.name === 'Standard' && (
                                  <div className="w-full h-full p-2 flex justify-between">
                                    <div className="w-16 h-10 bg-[#E05D5D]/10 rounded flex items-center justify-center text-[#E05D5D] text-xs font-bold">LOGO</div>
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
                                      <div className="text-xs text-gray-500 mt-1">N° AV-2025-A0042</div>
                                      <div className="text-xs text-gray-500">Date: 23/03/2025</div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Moderne' && (
                                  <div className="w-full h-full flex flex-col">
                                    <div className="h-8 bg-[#E05D5D]/80 w-full p-2 flex justify-between items-center">
                                      <div className="text-xs font-bold text-white">AVOIR D&apos;ACOMPTE N° AV-2025-A0042</div>
                                      <div className="text-xs text-white">23/03/2025</div>
                                    </div>
                                    <div className="flex justify-between p-2">
                                      <div className="w-12 h-8 bg-gray-100 rounded"></div>
                                      <div className="text-xs text-right text-gray-600">
                                        <div>Votre Entreprise</div>
                                        <div>contact@entreprise.fr</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Classique' && (
                                  <div className="w-full h-full p-2 flex flex-col items-center">
                                    <div className="w-16 h-8 bg-gray-100 rounded mb-1"></div>
                                    <div className="text-center">
                                      <div className="text-sm font-bold">AVOIR D&apos;ACOMPTE</div>
                                      <div className="text-xs text-gray-500">N° AV-2025-A0042 • 23/03/2025</div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Minimaliste' && (
                                  <div className="w-full h-full p-3">
                                    <div className="text-sm font-medium">AVOIR #AV-2025-A0042</div>
                                    <div className="flex justify-between items-center mt-2">
                                      <div className="text-xs text-gray-500">23/03/2025</div>
                                      <div className="w-10 h-6 bg-gray-100 rounded"></div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Élégant' && (
                                  <div className="w-full h-full border-b-2 border-[#E05D5D]">
                                    <div className="flex justify-between items-center h-full p-2">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full mr-2"></div>
                                        <div>
                                          <div className="text-xs font-medium">Votre Entreprise</div>
                                          <div className="text-[10px] text-gray-500">Paris, France</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-serif font-medium text-[#E05D5D]">Avoir</div>
                                        <div className="text-xs text-gray-600">#AV-2025-A0042</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Professionnel' && (
                                  <div className="w-full h-full flex flex-col">
                                    <div className="flex justify-between bg-gray-50 p-2 border-b">
                                      <div className="w-12 h-8 bg-gray-200 rounded"></div>
                                      <div className="text-xs text-gray-500 text-right">
                                        <div>Tél: 01 23 45 67 89</div>
                                        <div>contact@entreprise.fr</div>
                                      </div>
                                    </div>
                                    <div className="p-2">
                                      <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE N° AV-2025-A0042</div>
                                      <div className="text-xs text-gray-500">Émis le 23/03/2025</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Header Data */}
                    {wizardStep === 2 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: données</h3>
                        <p className="text-gray-600 mb-6">Choisir les données affichées en entête de document</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          <div className="md:col-span-3 space-y-6">
                            {/* Logo Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                Logo
                              </h4>
                              <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                  <span className="text-gray-700">Afficher</span>
                                </label>
                                
                                <div className="flex items-center">
                                  <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Modifier le logo...
                                  </button>
                                  <span className="text-xs text-gray-500 ml-3">Aucun logo sélectionné</span>
                                </div>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                  <span className="text-gray-700">Ajuster la taille de l&apos;image</span>
                                </label>
                              </div>
                            </div>
                            
                            {/* Coordonnées de la société Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                </svg>
                                Coordonnées de la société
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                  { id: 'pays', label: 'Pays' },
                                  { id: 'telephone', label: 'Téléphone' },
                                  { id: 'portable', label: 'Tél portable' },
                                  { id: 'fax', label: 'Fax' },
                                  { id: 'siteweb', label: 'Site web' },
                                  { id: 'email', label: 'Email' },
                                  { id: 'agrement', label: 'N d\'agrément' },
                                  { id: 'declaration', label: 'N de déclaration' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <label className="flex items-center space-x-2 border-t pt-3">
                                <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                <span className="text-gray-700">Masquer les coordonnées de la société</span>
                              </label>
                            </div>
                            
                            {/* Coordonnées du client Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Coordonnées du client
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                  { id: 'espace_vide', label: 'Espace vide' },
                                  { id: 'telephone_client', label: 'Téléphone' },
                                  { id: 'portable_client', label: 'Téléphone portable' },
                                  { id: 'email_client', label: 'Email' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <div className="border-t pt-3 space-y-2">
                                {[
                                  { id: 'references', label: 'Références' },
                                  { id: 'no_commande', label: 'N de commande client' },
                                  { id: 'no_facture', label: 'N de facture liée' },
                                  { id: 'masquer_contact', label: 'Masquer le contact principal' },
                                  { id: 'masquer_tva', label: 'Masquer le numéro de TVA du client' },
                                  { id: 'masquer_reglement', label: 'Masquer le mode règlement du client' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
                            <div className="font-medium text-gray-700 mb-4 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Aperçu de l&apos;entête
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4 h-64 shadow-sm">
                              <div className="flex justify-between mb-3">
                                <div className="w-24 h-12 bg-[#E05D5D]/20 rounded-lg flex items-center justify-center text-[#E05D5D] font-bold">LOGO</div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
                                  <div className="text-sm text-gray-600">N° AV-2025-A0042</div>
                                  <div className="text-sm text-gray-600">Date: 23/03/2025</div>
                                  <div className="text-sm text-gray-600">Réf. facture: FA-2025-A0042</div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-4">
                                <div className="text-sm text-gray-700">
                                  <div className="font-medium">Votre Entreprise SARL</div>
                                  <div>123 Avenue des Affaires</div>
                                  <div>75001 Paris, France</div>
                                  <div>Tél: 01 23 45 67 89</div>
                                  <div>Email: contact@entreprise.fr</div>
                                </div>
                                
                                <div className="border p-3 bg-gray-50 rounded text-sm w-52">
                                  <div className="font-medium mb-1">CLIENT</div>
                                  <div>Client Exemple Inc.</div>
                                  <div>42 Rue du Commerce</div>
                                  <div>69002 Lyon</div>
                                  <div>Tél: 04 78 12 34 56</div>
                                  <div>Email: contact@client.fr</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Les éléments affichés dépendent des options sélectionnées
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Original Invoice Reference */}
                    {wizardStep === 3 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Facture de référence</h3>
                        <p className="text-gray-600 mb-6">Définir la référence à la facture d&apos;acompte d&apos;origine</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-6">
                            {/* Référence facture Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiRefreshCw className="mr-2 text-gray-500" />
                                Facture d&apos;acompte associée
                              </h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Numéro de la facture d&apos;acompte
                                  </label>
                                  <div className="flex">
                                    <input
                                      type="text"
                                      value={wizardData.creditOptions.referencedInvoice}
                                      onChange={(e) => setWizardData({
                                        ...wizardData,
                                        creditOptions: {
                                          ...wizardData.creditOptions,
                                          referencedInvoice: e.target.value
                                        }
                                      })}
                                      placeholder="FA-2025-A0042"
                                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                                    />
                                    <button className="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition">
                                      Rechercher
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="font-medium text-gray-700 mb-2 flex items-center">
                                    <FiInfo className="mr-2 text-amber-500" />
                                    Informations importantes
                                  </div>
                                  <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
                                    <li>L&apos;avoir d&apos;acompte doit toujours référencer la facture d&apos;acompte d&apos;origine</li>
                                    <li>Les montants et taux de TVA doivent correspondre à la facture d&apos;origine</li>
                                    <li>La législation oblige à mentionner clairement le motif de l&apos;avoir</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            {/* Type d'avoir Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiPercent className="mr-2 text-gray-500" />
                                Type d&apos;avoir
                              </h4>
                              
                              <div className="space-y-4">
                                <label className="flex items-center space-x-3">
                                  <input 
                                    type="radio" 
                                    name="credit_type"
                                    checked={wizardData.creditOptions.type === 'full'}
                                    onChange={() => setWizardData({
                                      ...wizardData, 
                                      creditOptions: {...wizardData.creditOptions, type: 'full'}
                                    })}
                                    className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                                  />
                                  <span className="text-gray-700">Avoir total (100% de l&apos;acompte)</span>
                                </label>
                                
                                <label className="flex items-center space-x-3">
                                  <input 
                                    type="radio" 
                                    name="credit_type"
                                    checked={wizardData.creditOptions.type === 'percentage'}
                                    onChange={() => setWizardData({
                                      ...wizardData, 
                                      creditOptions: {...wizardData.creditOptions, type: 'percentage'}
                                    })}
                                    className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                                  />
                                  <span className="text-gray-700">Avoir partiel (pourcentage de l&apos;acompte)</span>
                                </label>
                                
                                {wizardData.creditOptions.type === 'percentage' && (
                                  <div className="ml-7 mt-2">
                                    <label className="block text-sm text-gray-700 mb-1">Pourcentage de l&apos;avoir</label>
                                    <div className="flex items-center">
                                      <input 
                                        type="number" 
                                        min="1" 
                                        max="99"
                                        value={wizardData.creditOptions.percentage}
                                        onChange={(e) => setWizardData({
                                          ...wizardData,
                                          creditOptions: {
                                            ...wizardData.creditOptions,
                                            percentage: parseInt(e.target.value) || 0
                                          }
                                        })}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                                      />
                                      <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                                        %
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                <label className="flex items-center space-x-3">
                                  <input 
                                    type="radio" 
                                    name="credit_type"
                                    checked={wizardData.creditOptions.type === 'fixed'}
                                    onChange={() => setWizardData({
                                      ...wizardData, 
                                      creditOptions: {...wizardData.creditOptions, type: 'fixed'}
                                    })}
                                    className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                                  />
                                  <span className="text-gray-700">Avoir à montant fixe</span>
                                </label>
                                
                                {wizardData.creditOptions.type === 'fixed' && (
                                  <div className="ml-7 mt-2">
                                    <label className="block text-sm text-gray-700 mb-1">Montant de l&apos;avoir</label>
                                    <div className="flex items-center">
                                      <input 
                                        type="number" 
                                        min="0"
                                        value={wizardData.creditOptions.fixedAmount}
                                        onChange={(e) => setWizardData({
                                          ...wizardData,
                                          creditOptions: {
                                            ...wizardData.creditOptions,
                                            fixedAmount: parseFloat(e.target.value) || 0
                                          }
                                        })}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                                      />
                                      <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                                        €
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Motif de l'avoir */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiFileText className="mr-2 text-gray-500" />
                                Motif de l&apos;avoir
                              </h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Motif
                                  </label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50">
                                    <option>Annulation de commande</option>
                                    <option>Erreur de facturation</option>
                                    <option>Remboursement partiel</option>
                                    <option>Résiliation de contrat</option>
                                    <option>Autre (à préciser)</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commentaire
                                  </label>
                                  <textarea 
                                    rows={3}
                                    placeholder="Précisez le motif de l'avoir..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
                            <div className="font-medium text-gray-700 mb-4 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Aperçu de l&apos;avoir
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4 shadow-sm">
                              <div className="mb-2 text-sm font-medium text-gray-800">Simulation d&apos;avoir</div>
                              
                              <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm">
                                <div className="font-medium text-gray-700 mb-1">Facture d&apos;acompte d&apos;origine</div>
                                <div className="flex justify-between text-gray-600">
                                  <span>N° Facture:</span>
                                  <span>{wizardData.creditOptions.referencedInvoice || 'FA-2025-A0042'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Montant:</span>
                                  <span>900,00 €</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                  <span>Date:</span>
                                  <span>10/03/2025</span>
                                </div>
                              </div>

                              <table className="w-full text-sm mb-6">
                                <tbody className="divide-y divide-gray-100">
                                  <tr>
                                    <td className="py-2 text-gray-700">Montant HT</td>
                                    <td className="py-2 text-right text-gray-700">750,00 €</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 text-gray-700">TVA (20%)</td>
                                    <td className="py-2 text-right text-gray-700">150,00 €</td>
                                  </tr>
                                  <tr>
                                    <td className="py-2 text-gray-700 font-medium">Montant TTC</td>
                                    <td className="py-2 text-right text-gray-700 font-medium">900,00 €</td>
                                  </tr>
                                </tbody>
                              </table>

                              {/* Credit amount calculation */}
                              <div className="bg-[#E05D5D]/5 p-3 rounded-lg border-l-4 border-[#E05D5D] mb-4">
                                <div className="flex justify-between font-medium text-[#E05D5D]">
                                  <span>
                                    {wizardData.creditOptions.type === 'full'
                                      ? 'Montant de l\'avoir (100%)'
                                      : wizardData.creditOptions.type === 'percentage'
                                        ? `Montant de l'avoir (${wizardData.creditOptions.percentage}%)`
                                        : 'Montant de l\'avoir (fixe)'}
                                  </span>
                                  <span>
                                    {wizardData.creditOptions.type === 'full'
                                      ? '900,00 €'
                                      : wizardData.creditOptions.type === 'percentage'
                                        ? `${(900 * wizardData.creditOptions.percentage / 100).toFixed(2).replace('.', ',')} €`
                                        : `${wizardData.creditOptions.fixedAmount.toFixed(2).replace('.', ',')} €`}
                                  </span>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                <div className="font-medium mb-1">Modalité de remboursement</div>
                                <select className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#E05D5D]">
                                  <option>Virement bancaire</option>
                                  <option>Avoir sur prochaine facture</option>
                                  <option>Chèque</option>
                                  <option>Remboursement carte bancaire</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                              <div className="flex items-start">
                                <FiInfo className="mr-2 mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium">Important :</span>{' '}
                                  Un avoir d&apos;acompte doit clairement mentionner le numéro de la facture d&apos;acompte à laquelle il se rapporte, ainsi que le motif de l&apos;avoir.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 4: Body & Footer Data */}
                    {wizardStep === 4 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Corps et pied du document</h3>
                        <p className="text-gray-600 mb-6">Choisir les éléments à afficher dans le corps et le pied de l&apos;avoir d&apos;acompte</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-6">
                            {/* Colonnes Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Colonnes
                              </h4>
                              
                              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {[
                                  'Code article', 'Description', 'Montant HT initial', 'Unité (Libellé)', 
                                  'Unité (Code)', 'Quantité', 'P.U. TTC', 'P.U. HT', '% Remboursé', 
                                  'Montant TTC', 'Montant HT', 'TVA', 'Référence facture'
                                ].map((column, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                                      <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                                      <span className="text-gray-700">{column}</span>
                                    </label>
                                    
                                    <div className="flex items-center space-x-1">
                                      <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la gauche">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                      
                                      <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la droite">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Montant Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                Montant
                              </h4>
                              
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                {[
                                  'Total HT', 'TVA', 'Total TTC', 'Montant à rembourser', 
                                  'Montant initial', 'Facture d\'origine', 'Mode de remboursement'
                                ].map((item, index) => (
                                  <label key={index} className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]"
                                      defaultChecked={['Total HT', 'TVA', 'Total TTC', 'Montant à rembourser', 'Facture d\'origine'].includes(item)}
                                    />
                                    <span className="text-gray-700">{item}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            {/* Récap. TVA Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                                </svg>
                                Récap. TVA et mentions légales
                              </h4>
                              
                              <div className="space-x-4 flex items-center mb-4">
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name="recap_tva" 
                                    value="always" 
                                    defaultChecked
                                    className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                                  />
                                  <span className="text-gray-700">Toujours</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name="recap_tva" 
                                    value="multiple_rates" 
                                    className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                                  />
                                  <span className="text-gray-700">Seulement si plus d&apos;un taux</span>
                                </label>
                              </div>
                              
                              <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                                  <span className="text-gray-700">Informations société</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                                  <span className="text-gray-700">Mention spéciale &quot;Avoir d&apos;acompte&quot;</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                                  <span className="text-gray-700">Référence de la facture d&apos;origine</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                                  <span className="text-gray-700">Coordonnées bancaires pour remboursement</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                                  <span className="text-gray-700">Motif de l&apos;avoir</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
                            <div className="font-medium text-gray-700 mb-4 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Aperçu du document
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4 overflow-y-auto shadow-sm h-96">
                              {/* Table preview */}
                              <table className="w-full text-xs mb-4">
                                <thead>
                                  <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-1 text-gray-600">Description</th>
                                    <th className="py-2 px-1 text-center text-gray-600">Qté</th>
                                    <th className="py-2 px-1 text-right text-gray-600">P.U. HT</th>
                                    <th className="py-2 px-1 text-right text-gray-600">Total HT</th>
                                    <th className="py-2 px-1 text-right text-gray-600">TVA</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  <tr>
                                    <td className="py-1 px-1">Acompte sur développement site web</td>
                                    <td className="py-1 px-1 text-center">1</td>
                                    <td className="py-1 px-1 text-right">-750,00 €</td>
                                    <td className="py-1 px-1 text-right">-750,00 €</td>
                                    <td className="py-1 px-1 text-right">20%</td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              {/* Reference to original invoice */}
                              <div className="p-2 bg-gray-50 rounded-lg mb-4 text-xs">
                                <div className="font-medium text-gray-700">Facture d&apos;acompte d&apos;origine</div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Référence:</span>
                                  <span className="text-gray-700">FA-2025-A0042 du 10/03/2025</span>
                                </div>
                              </div>
                              
                              {/* Totals */}
                              <div className="border-t pt-2 mb-4">
                                <div className="flex justify-end">
                                  <table className="text-xs w-48">
                                    <tbody>
                                      <tr>
                                        <td className="py-1 text-gray-600">Total HT</td>
                                        <td className="py-1 text-right">-750,00 €</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1 text-gray-600">TVA (20%)</td>
                                        <td className="py-1 text-right">-150,00 €</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1 text-gray-600 font-medium">Total TTC</td>
                                        <td className="py-1 text-right font-medium">-900,00 €</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              
                              {/* Credit Amount (highlighted) */}
                              <div className="bg-[#E05D5D]/5 border border-[#E05D5D]/20 rounded-lg p-3 mb-4">
                                <div className="text-xs font-medium text-[#E05D5D] mb-1">MONTANT À REMBOURSER</div>
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-gray-600">
                                    Remboursement par virement bancaire
                                  </div>
                                  <div className="text-lg font-bold text-[#E05D5D]">
                                    900,00 €
                                  </div>
                                </div>
                              </div>
                              
                              {/* Footer Section */}
                              <div className="border-t pt-3 text-xs">
                                <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires pour remboursement</div>
                                <div className="text-gray-600">
                                  <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                                  <div>BIC: BNPAFRPPXXX</div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-600">
                                  <div className="font-medium mb-1">Motif de l&apos;avoir</div>
                                  <div>Annulation de commande suite à la demande du client le 20/03/2025</div>
                                </div>
                                
                                <div className="mt-3 text-center text-[10px] text-gray-500">
                                  <div>Ce document est un avoir d&apos;acompte en référence à la facture FA-2025-A0042 du 10/03/2025.</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Les éléments affichés dépendent des options sélectionnées
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 5: Template Formatting */}
                    {wizardStep === 5 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mise en forme du modèle</h3>
                        <p className="text-gray-600 mb-6">Paramétrer la mise en forme du modèle (couleurs, police, etc.)</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-6">
                            {/* Couleurs Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                                </svg>
                                Couleurs
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {[
                                  { id: 'frame_color', label: 'Cadre', color: '#E05D5D' },
                                  { id: 'label_text_color', label: 'Text des intitulés', color: '#FFFFFF' },
                                  { id: 'label_bg_color', label: 'Fond des intitulés', color: '#E05D5D' },
                                  { id: 'credit_highlight_color', label: 'Mise en avant du montant', color: '#E05D5D' },
                                  { id: 'other_text_color', label: 'Autres textes', color: '#333333' }
                                ].map(item => (
                                  <div key={item.id} className="flex items-center space-x-3">
                                    <label className="flex items-center w-full">
                                      <span className="text-gray-700 flex-grow">{item.label}</span>
                                      <div className="flex">
                                        <input 
                                          type="color" 
                                          value={item.color}
                                          className="w-10 h-8 p-1 border border-gray-300 rounded-l-lg"
                                        />
                                        <input 
                                          type="text" 
                                          value={item.color}
                                          className="w-24 px-2 py-1 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#E05D5D]"
                                        />
                                      </div>
                                    </label>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                                <div className="flex items-center text-gray-700">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <span>Il est recommandé d&apos;utiliser une couleur différente de vos factures pour faciliter l&apos;identification des avoirs.</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Police des intitulés Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Police et typographie
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50">
                                    <option>Helvetica</option>
                                    <option>Arial</option>
                                    <option>Open Sans</option>
                                    <option>Roboto</option>
                                    <option>Montserrat</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50">
                                    <option>9px</option>
                                    <option>10px</option>
                                    <option>11px</option>
                                    <option selected>12px</option>
                                    <option>14px</option>
                                    <option>16px</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 items-center">
                                <button className="p-2 border rounded-lg bg-[#E05D5D] text-white" title="Gras">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                  </svg>
                                </button>
                                
                                <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Italique">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M10 4H16M14 20H4" />
                                    <line x1="15" y1="4" x2="9" y2="20" />
                                  </svg>
                                </button>
                                
                                <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Souligné">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path d="M9 7L9 14M15 7L15 14M6 20H18" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {/* Cadres et entêtes Section */}
                        <div className="border rounded-xl p-4 bg-white">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            Cadres et entêtes
                          </h4>
                          
                          <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                              <span className="text-gray-700">Masquer les cadres</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                              <span className="text-gray-700">Masquer les entêtes</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" />
                              <span className="text-gray-700">Encadrer le bloc de remboursement</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4 text-[#E05D5D] rounded focus:ring-[#E05D5D]" defaultChecked />
                              <span className="text-gray-700">Afficher &quot;AVOIR&quot; en grand</span>
                            </label>
                          </div>
                        </div>
                        
                        {/* Fond de page Section */}
                        <div className="border rounded-xl p-4 bg-white">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Fond de page
                          </h4>
                          
                          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Modifier le fond de page...
                          </button>
                          
                          <div className="mt-3 text-sm text-gray-500">
                            Aucun fond de page sélectionné
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
                        <div className="font-medium text-gray-700 mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          Aperçu du style
                        </div>
                        
                        <div className="bg-white border border-[#E05D5D] rounded-lg p-3 overflow-hidden shadow-sm">
                          {/* Header with selected styles */}
                          <div className="flex justify-between mb-3 pb-2 border-b border-[#E05D5D]">
                            <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0"></div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
                              <div className="text-xs text-gray-600">N° AV-2025-A0042</div>
                            </div>
                          </div>
                          
                          {/* Table with selected styles */}
                          <table className="w-full text-xs mb-3">
                            <thead>
                              <tr>
                                <th className="py-1 px-1 bg-[#E05D5D] text-white text-left rounded-tl-md">Description</th>
                                <th className="py-1 px-1 bg-[#E05D5D] text-white text-center">Qté</th>
                                <th className="py-1 px-1 bg-[#E05D5D] text-white text-right rounded-tr-md">Prix</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-1 px-1">Acompte sur commande</td>
                                <td className="py-1 px-1 text-center">1</td>
                                <td className="py-1 px-1 text-right">-900,00 €</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          {/* Credit section with selected styles */}
                          <div className="bg-[#E05D5D]/5 p-2 rounded-lg border-l-4 border-[#E05D5D] mb-3">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-[#E05D5D]">À rembourser</span>
                              <span className="font-bold text-[#E05D5D]">900,00 €</span>
                            </div>
                          </div>
                          
                          {/* Footer with selected styles */}
                          <div className="text-[9px] text-gray-600 border-t border-[#E05D5D] pt-2">
                            <div className="flex justify-between items-end">
                              <div>Coordonnées bancaires</div>
                              <div className="text-right">SIRET: 123 456 789 00012</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Cet aperçu reflète les couleurs et styles sélectionnés
                          </div>
                          <div className="mt-2 text-center">
                            <button className="text-[#E05D5D] text-xs hover:underline">
                              Voir l&apos;aperçu complet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Wizard Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <div>
              {wizardStep > 1 && (
                <button
                  onClick={goToPreviousStep}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Précédent
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              
              <button
                onClick={goToNextStep}
                className="px-6 py-2 bg-[#E05D5D] text-white rounded-lg hover:bg-[#D04D4D] transition flex items-center shadow-sm"
              >
                {wizardStep === totalSteps ? (
                  <>
                    <FiCheck className="mr-2" />
                    Terminer
                  </>
                ) : (
                  <>
                    Suivant
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  
  <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
    {/* ---------- HEADER / HERO SECTION ---------- */}
    <motion.div
      variants={headerVariants}
      className="relative mt-20 mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Background gradient with pattern */}
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
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
        {/* Search & Filter Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch className="w-4 h-4" />
            </span>
          </div>
        </div>
        
        {/* Template List */}
        <div className="max-h-[calc(100vh-380px)] overflow-y-auto p-4">
          <motion.div
            variants={containerVariants}
            className="space-y-3"
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                variants={listItemVariants}
                whileHover="hover"
                animate="show"
                initial="hidden"
                custom={index}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id 
                    ? 'bg-[#E05D5D]/10 border-l-4 border-[#E05D5D]' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${selectedTemplate === template.id ? 'text-[#E05D5D]' : 'text-gray-800'}`}>
                        {template.name}
                      </h3>
                      {template.depositPercentage && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-xs">
                          <FiPercent className="w-3 h-3 mr-1" />
                          {template.depositPercentage}%
                        </span>
                      )}
                      {template.linkedInvoice && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs">
                          <FiRefreshCw className="w-3 h-3 mr-1" />
                          {template.linkedInvoice}
                        </span>
                      )}
                      {template.isDefault && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">
                          <FiStar className="w-3 h-3 mr-1" />
                          Défaut
                        </span>
                      )}
                      {template.isHidden && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                          <FiEyeOff className="w-3 h-3 mr-1" />
                          Masqué
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <FiCalendar className="w-3 h-3 mr-1" />
                      Modifié le {template.lastModified}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <FiChevronRight className={`w-5 h-5 transition-transform ${selectedTemplate === template.id ? 'transform rotate-90 text-[#E05D5D]' : ''}`} />
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <FiInfo className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucun modèle trouvé</p>
                <p className="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between">
            <button 
              onClick={() => setShowHiddenTemplates(!showHiddenTemplates)}
              className="text-sm text-gray-600 flex items-center hover:text-[#E05D5D]"
            >
              {showHiddenTemplates ? (
                <>
                  <FiEye className="w-4 h-4 mr-1" />
                  Masquer les modèles cachés
                </>
              ) : (
                <>
                  <FiEyeOff className="w-4 h-4 mr-1" />
                  Afficher tous les modèles
                </>
              )}
            </button>
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} sur {templates.length} modèles
            </div>
          </div>
        </div>
      </div>
      
      {/* ----- RIGHT COLUMN: Template Preview ----- */}
      <motion.div 
        className="md:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Template Actions Header */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between gap-2">
          <div className="flex items-center">
            <h2 className="font-semibold text-gray-800">Aperçu du modèle</h2>
            {currentTemplate?.isDefault && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center">
                <FiStar className="w-3 h-3 mr-1" />
                Modèle par défaut
              </span>
            )}
            {currentTemplate?.linkedInvoice && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                <FiRefreshCw className="w-3 h-3 mr-1" />
                Réf. {currentTemplate.linkedInvoice}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditor(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-[#E05D5D]/10 text-[#E05D5D] rounded-lg hover:bg-[#E05D5D]/20 transition"
            >
              <FiEdit3 className="mr-1" />
              Modifier
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => currentTemplate && toggleTemplateVisibility(currentTemplate.id)}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {currentTemplate?.isHidden ? (
                <>
                  <FiEye className="mr-1" />
                  Afficher
                </>
              ) : (
                <>
                  <FiEyeOff className="mr-1" />
                  Masquer
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDeleteConfirmOpen(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <FiTrash2 className="mr-1" />
              Supprimer
            </motion.button>
          </div>
        </div>
        
        {/* Preview Area */}
        <div className="flex-grow p-8 flex items-center justify-center bg-gray-50 overflow-auto">
          {currentTemplate ? (
            <div className="relative group">
              {/* Specimen watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-9xl font-black text-gray-100 transform -rotate-45 opacity-20">
                  SPECIMEN
                </div>
              </div>
              
              {/* Preview image/placeholder - In a real app, this would be a PDF viewer */}
              <div 
                className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 group-hover:scale-[1.01] border border-gray-200"
                onClick={toggleExpandedPreview}
              >
                {/* This would be the actual invoice template preview */}
                <div className="w-[650px] h-[900px] bg-white p-10 relative">
                  {/* Header section with logo and info */}
                  <div className="flex justify-between mb-10">
                    <div>
                      <div className="w-24 h-12 bg-[#E05D5D]/20 rounded-lg flex items-center justify-center text-[#E05D5D] font-bold">LOGO</div>
                      <div className="mt-2 text-gray-800 text-sm">
                        <div>Votre Entreprise SARL</div>
                        <div>123 Avenue des Affaires</div>
                        <div>75001 Paris, France</div>
                        <div>contact@votreentreprise.fr</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-2">AVOIR D&apos;ACOMPTE</div>
                      <div className="text-gray-600 text-sm">
                        <div>N° AV-2025-A0042</div>
                        <div>Date: 23/03/2025</div>
                        <div className="text-xs mt-1 text-[#E05D5D]">Facture d&apos;origine: {currentTemplate.linkedInvoice || 'FA-2025-A0042'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Client info */}
                  <div className="border rounded-lg p-4 bg-gray-50 mb-8">
                    <div className="text-sm font-semibold text-gray-500 mb-1">CLIENT</div>
                    <div className="text-gray-800">
                      <div className="font-semibold">Client Exemple Inc.</div>
                      <div>42 Rue du Commerce</div>
                      <div>69002 Lyon, France</div>
                      <div>client@exemple.fr</div>
                    </div>
                  </div>
                  
                  {/* Credit Note items */}
                  <table className="w-full mb-8">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-2 rounded-tl-lg text-sm text-gray-600">Description</th>
                        <th className="py-2 px-2 text-sm text-gray-600 text-center">Quantité</th>
                        <th className="py-2 px-2 text-sm text-gray-600 text-right">Prix unitaire</th>
                        <th className="py-2 px-2 rounded-tr-lg text-sm text-gray-600 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-3 px-2 text-gray-800">Avoir sur acompte {currentTemplate.id === 'template2' ? '50%' : currentTemplate.id === 'template1' ? '30%' : ''} - {currentTemplate.linkedInvoice || 'FA-2025-A0042'}</td>
                        <td className="py-3 px-2 text-center text-gray-600">1</td>
                        <td className="py-3 px-2 text-right text-gray-600">-750,00 €</td>
                        <td className="py-3 px-2 text-right text-gray-800">-750,00 €</td>
                      </tr>
                      {currentTemplate.id === 'template4' && (
                        <tr>
                          <td className="py-3 px-2 text-gray-800">Frais administratifs d&apos;annulation</td>
                          <td className="py-3 px-2 text-center text-gray-600">1</td>
                          <td className="py-3 px-2 text-right text-gray-600">-50,00 €</td>
                          <td className="py-3 px-2 text-right text-gray-800">-50,00 €</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 text-gray-600 flex justify-between">
                        <span>Total HT</span>
                        <span>{currentTemplate.id === 'template4' ? '-800,00 €' : '-750,00 €'}</span>
                      </div>
                      
                      <div className="bg-white px-4 py-2 text-gray-600 flex justify-between border-t border-gray-100">
                        <span>TVA (20%)</span>
                        <span>{currentTemplate.id === 'template4' ? '-160,00 €' : '-150,00 €'}</span>
                      </div>
                      
                      <div className="bg-white px-4 py-2 text-gray-600 font-semibold flex justify-between border-t border-gray-100">
                        <span>Total TTC</span>
                        <span>{currentTemplate.id === 'template4' ? '-960,00 €' : '-900,00 €'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Refund information */}
                  <div className="bg-[#E05D5D]/5 border border-[#E05D5D]/20 rounded-lg p-4 mb-8">
                    <div className="text-sm font-medium text-[#E05D5D] mb-2">REMBOURSEMENT</div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-600">
                        Montant à rembourser
                      </div>
                      <div className="text-xl font-bold text-[#E05D5D]">
                        {currentTemplate.id === 'template4' ? '960,00 €' : '900,00 €'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Mode de remboursement: Virement bancaire sous 14 jours
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t pt-6 text-sm text-gray-500">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires pour remboursement</div>
                        <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                        <div>BIC: BNPAFRPPXXX</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-700 mb-1">Contact</div>
                        <div>service.client@votreentreprise.fr</div>
                        <div>+33 (0)1 23 45 67 89</div>
                      </div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400 mt-4">
                      <div className="font-medium mb-1">Motif de l&apos;avoir</div>
                      <div>Annulation de commande suite à la demande du client le 20/03/2025</div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400 mt-4">
                      Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789
                      <div>www.votreentreprise.fr</div>
                    </div>
                  </div>
                  
                  {/* Expand button overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center">
                      <FiEye className="mr-2" />
                      Agrandir l&apos;aperçu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun modèle sélectionné</p>
              <p className="text-sm mt-2">Sélectionnez un modèle dans la liste ou créez-en un nouveau</p>
              <button
                onClick={createNewTemplate}
                className="mt-6 px-4 py-2 bg-[#E05D5D] text-white rounded-lg hover:bg-[#D04D4D] transition"
              >
                <FiPlus className="inline-block mr-2" />
                Nouveau modèle
              </button>
            </div>
          )}
        </div>
        
        {/* Template Info Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Format: A4 (210 × 297 mm)
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadPdf}
              className="flex items-center px-4 py-2 bg-[#E05D5D]/10 text-[#E05D5D] rounded-lg hover:bg-[#E05D5D]/20 transition"
              title="Télécharger en PDF"
            >
              <FiDownload className="mr-2" />
              Télécharger
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTemplate}
              className="flex items-center px-4 py-2 bg-[#E05D5D] text-white rounded-lg hover:bg-[#D04D4D] transition shadow-sm"
              title="Imprimer le modèle"
            >
              <FiPrinter className="mr-2" />
              Imprimer
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</motion.div>
);
}
