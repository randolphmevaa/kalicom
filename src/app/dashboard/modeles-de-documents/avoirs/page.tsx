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
} from 'react-icons/fi';

// Define types
interface CreditNoteTemplate {
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
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  // const [activeTab, setActiveTab] = useState<'design' | 'preview'>('preview');
  
  // References
  // const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample data
  const templates: CreditNoteTemplate[] = [
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
                  <FiFileText className="mr-2 text-[#6C5DD3]" />
                  {currentTemplate?.name}
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={downloadPdf}
                    className="px-3 py-2 rounded-lg bg-[#6C5DD3]/10 text-[#6C5DD3] hover:bg-[#6C5DD3]/20 transition flex items-center"
                  >
                    <FiDownload className="mr-2" />
                    Télécharger
                  </button>
                  <button
                    onClick={printTemplate}
                    className="px-3 py-2 rounded-lg bg-[#6C5DD3] text-white hover:bg-[#5C4DC3] transition flex items-center"
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
                    src={currentTemplate?.pdfUrl || '/avoir-specimen.pdf'}
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
                  <h2 className="text-xl font-bold text-gray-800">Nouveau modèle d&apos;avoir</h2>
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
                      className="absolute top-0 left-0 h-2 bg-[#6C5DD3] rounded-full"
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
                              ? 'bg-[#6C5DD3] text-white' 
                              : index + 1 === wizardStep 
                                ? 'bg-white border-2 border-[#6C5DD3] text-[#6C5DD3]' 
                                : 'bg-white border border-gray-300 text-gray-400'
                            }`}
                        >
                          {index + 1 < wizardStep ? '✓' : index + 1}
                        </div>
                        <span className={`text-xs whitespace-nowrap ${
                          index + 1 === wizardStep ? 'text-[#6C5DD3] font-medium' : 'text-gray-500'
                        }`}>
                          {index === 0 && "Entête: style"}
                          {index === 1 && "Entête: données"}
                          {index === 2 && "Corps: données"}
                          {index === 3 && "Pied: données"}
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
                                  ? 'border-[#6C5DD3] bg-[#6C5DD3]/5 shadow-md' 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-800">{style.name}</h4>
                                {wizardData.headerStyle === style.name.toLowerCase() && (
                                  <div className="w-5 h-5 bg-[#6C5DD3] rounded-full flex items-center justify-center">
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
                                    <div className="w-16 h-10 bg-[#6C5DD3]/10 rounded flex items-center justify-center text-[#6C5DD3] text-xs font-bold">LOGO</div>
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-gray-800">AVOIR</div>
                                      <div className="text-xs text-gray-500 mt-1">N° AV-2025-0042</div>
                                      <div className="text-xs text-gray-500">Date: 23/03/2025</div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Moderne' && (
                                  <div className="w-full h-full flex flex-col">
                                    <div className="h-8 bg-[#6C5DD3]/80 w-full p-2 flex justify-between items-center">
                                      <div className="text-xs font-bold text-white">AVOIR N° AV-2025-0042</div>
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
                                      <div className="text-sm font-bold">AVOIR</div>
                                      <div className="text-xs text-gray-500">N° AV-2025-0042 • 23/03/2025</div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Minimaliste' && (
                                  <div className="w-full h-full p-3">
                                    <div className="text-sm font-medium">AVOIR #AV-2025-0042</div>
                                    <div className="flex justify-between items-center mt-2">
                                      <div className="text-xs text-gray-500">23/03/2025</div>
                                      <div className="w-10 h-6 bg-gray-100 rounded"></div>
                                    </div>
                                  </div>
                                )}
                                
                                {style.name === 'Élégant' && (
                                  <div className="w-full h-full border-b-2 border-[#6C5DD3]">
                                    <div className="flex justify-between items-center h-full p-2">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full mr-2"></div>
                                        <div>
                                          <div className="text-xs font-medium">Votre Entreprise</div>
                                          <div className="text-[10px] text-gray-500">Paris, France</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-serif font-medium text-[#6C5DD3]">Avoir</div>
                                        <div className="text-xs text-gray-600">#AV-2025-0042</div>
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
                                      <div className="text-sm font-bold text-gray-800">AVOIR N° AV-2025-0042</div>
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
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
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
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
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
                                  { id: 'siret', label: 'N° SIRET' },
                                  { id: 'tva', label: 'N° TVA' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <label className="flex items-center space-x-2 border-t pt-3">
                                <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                <span className="text-gray-700">Masquer les coordonnées de la société</span>
                              </label>
                            </div>
                            
                            {/* Facture d'origine Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                Facture d&apos;origine
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                  { id: 'num_facture', label: 'Numéro de facture' },
                                  { id: 'date_facture', label: 'Date de facture' },
                                  { id: 'motif_avoir', label: 'Motif de l\'avoir' },
                                  { id: 'ref_commande', label: 'Référence commande' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
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
                                  { id: 'ref_client', label: 'Référence client' },
                                  { id: 'telephone_client', label: 'Téléphone' },
                                  { id: 'email_client', label: 'Email' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                    <span className="text-gray-700">{item.label}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <div className="border-t pt-3 space-y-2">
                                {[
                                  { id: 'masquer_contact', label: 'Masquer le contact principal' },
                                  { id: 'masquer_tva', label: 'Masquer le numéro de TVA du client' }
                                ].map(item => (
                                  <label key={item.id} className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
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
                                <div className="w-24 h-12 bg-[#6C5DD3]/20 rounded-lg flex items-center justify-center text-[#6C5DD3] font-bold">LOGO</div>
                                <div className="text-right">
                                  <div className="text-xl font-bold text-gray-800">AVOIR</div>
                                  <div className="text-sm text-gray-600">N° AV-2025-0042</div>
                                  <div className="text-sm text-gray-600">Date: 23/03/2025</div>
                                  <div className="text-sm text-gray-600">Facture d&apos;origine: FA-2025-0127</div>
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
                                  <div>Réf: CLI2025-042</div>
                                  <div>Tél: 04 78 12 34 56</div>
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
                    
                    {/* Step 3: Body Data */}
                    {wizardStep === 3 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Corps du document: données</h3>
                        <p className="text-gray-600 mb-6">Choisir les données affichées dans le corps du document</p>
                        
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
                              
                              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {[
                                  'Référence', 'Description', 'Montant HT', 'Unité (Libellé)', 
                                  'Unité (Code)', 'Quantité', 'P.U. TTC', 'P.U. HT', '% Rem', 
                                  'Montant TTC', 'Montant HT', 'TVA'
                                ].map((column, index) => (
                                  <div 
                                    key={index} 
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                                      <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
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
                              
                              <div className="mt-4 border-t pt-4">
                                <div className="flex items-center space-x-4">
                                  <div className="w-40">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Largeur</label>
                                    <div className="flex">
                                      <input 
                                        type="number" 
                                        min="1"
                                        className="w-20 px-3 py-1.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50"
                                        defaultValue="100"
                                      />
                                      <span className="inline-flex items-center px-3 py-1.5 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                                        px
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                                    <div className="flex border rounded-lg overflow-hidden">
                                      <button className="p-1.5 bg-[#6C5DD3] text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
                                        </svg>
                                      </button>
                                      <button className="p-1.5 border-l border-r border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M9 12h6M11 18h2" />
                                        </svg>
                                      </button>
                                      <button className="p-1.5 bg-white text-gray-700 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M14 18h6" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Origine des articles Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" />
                                </svg>
                                Origine des articles
                              </h4>
                              
                              <label className="flex items-center space-x-2 mb-4">
                                <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                <span className="text-gray-700">Afficher la référence facture sur chaque ligne</span>
                              </label>
                              
                              <div className="space-y-3 mt-2">
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                  <span className="text-gray-700">Afficher les lignes en négatif (remboursement)</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                  <span className="text-gray-700">Ajouter une colonne de motif</span>
                                </label>
                              </div>
                            </div>
                            
                            {/* Police Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Police
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
                                    <option>Helvetica</option>
                                    <option>Arial</option>
                                    <option>Open Sans</option>
                                    <option>Roboto</option>
                                    <option>Montserrat</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
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
                                <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Gras">
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
                                
                                <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Couleur">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
                            <div className="font-medium text-gray-700 mb-4 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Aperçu du corps
                            </div>
                            
                            <div className="bg-white border rounded-lg p-3 overflow-hidden shadow-sm">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-1 text-xs text-gray-600">Réf.</th>
                                    <th className="py-2 px-1 text-xs text-gray-600">Description</th>
                                    <th className="py-2 px-1 text-xs text-gray-600 text-center">Qté</th>
                                    <th className="py-2 px-1 text-xs text-gray-600 text-right">P.U. HT</th>
                                    <th className="py-2 px-1 text-xs text-gray-600 text-right">Total HT</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  <tr>
                                    <td className="py-1 px-1 text-xs">PRO-001</td>
                                    <td className="py-1 px-1 text-xs">Service de consultation <span className="text-xs text-gray-500">(FA-2025-0127)</span></td>
                                    <td className="py-1 px-1 text-xs text-center">-1</td>
                                    <td className="py-1 px-1 text-xs text-right">650,00 €</td>
                                    <td className="py-1 px-1 text-xs text-right">-650,00 €</td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 px-1 text-xs">PRO-003</td>
                                    <td className="py-1 px-1 text-xs">Maintenance mensuelle <span className="text-xs text-gray-500">(FA-2025-0127)</span></td>
                                    <td className="py-1 px-1 text-xs text-center">-1</td>
                                    <td className="py-1 px-1 text-xs text-right">225,00 €</td>
                                    <td className="py-1 px-1 text-xs text-right">-225,00 €</td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <div className="flex justify-end mt-3">
                                <div className="w-40 text-xs">
                                  <div className="flex justify-between py-1">
                                    <span>Total HT</span>
                                    <span>-875,00 €</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Cet aperçu représente la mise en page des colonnes sélectionnées
                              </div>
                              <div className="mt-2 text-center">
                                <button className="text-[#6C5DD3] text-xs hover:underline">
                                  Voir l&apos;aperçu complet
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 4: Footer Data */}
                    {wizardStep === 4 && (
                      <div className="h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Pied du document: données</h3>
                        <p className="text-gray-600 mb-6">Choisir les données affichées dans le pied du document</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-6">
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
                                  'Total HT', 'Total TVA', 'Total TTC', 'Total TTC en lettres',
                                  'Montant remboursé', 'Montant avoir', 'Méthode de remboursement'
                                ].map((item, index) => (
                                  <label key={index} className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]"
                                      defaultChecked={['Total HT', 'Total TVA', 'Total TTC', 'Montant remboursé'].includes(item)}
                                    />
                                    <span className="text-gray-700">{item}</span>
                                  </label>
                                ))}
                              </div>
                              
                              <div className="border-t pt-3 space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" checked />
                                  <span className="text-gray-700">Afficher montants en négatif</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                                  <span className="text-gray-700">Afficher date du remboursement</span>
                                </label>
                              </div>
                            </div>
                            
                            {/* Récap. TVA Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                                </svg>
                                Mentions légales
                              </h4>
                              
                              <div className="space-x-4 flex items-center mb-4">
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name="recap_tva" 
                                    value="always" 
                                    defaultChecked
                                    className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3]" 
                                  />
                                  <span className="text-gray-700">Afficher récap. TVA</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name="recap_tva" 
                                    value="multiple_rates" 
                                    className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3]" 
                                  />
                                  <span className="text-gray-700">Seulement si plus d&apos;un taux</span>
                                </label>
                              </div>
                              
                              <div className="space-y-3">
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" defaultChecked />
                                  <span className="text-gray-700">Mentions légales d&apos;avoir</span>
                                </label>
                                
                                <div className="flex items-center ml-6">
                                  <a href="/dashboard/parametre-societe/mentions-avoir" className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Modifier les mentions légales...
                                  </a>
                                </div>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" defaultChecked />
                                  <span className="text-gray-700">Motif de l&apos;avoir</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" defaultChecked />
                                  <span className="text-gray-700">Coordonnées bancaires de la société</span>
                                </label>
                                
                                <label className="flex items-center space-x-2">
                                  <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" defaultChecked />
                                  <span className="text-gray-700">Numéro de page</span>
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
                              Aperçu du pied de page
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4 h-80 overflow-y-auto shadow-sm">
                              {/* Total Section */}
                              <div className="border-t border-gray-200 pt-3 mb-4">
                                <div className="flex justify-end">
                                  <table className="text-sm w-48">
                                    <tbody>
                                      <tr>
                                        <td className="py-1 text-gray-600">Total HT</td>
                                        <td className="py-1 text-gray-800 text-right">-875,00 €</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1 text-gray-600">Total TVA</td>
                                        <td className="py-1 text-gray-800 text-right">-175,00 €</td>
                                      </tr>
                                      <tr className="font-medium">
                                        <td className="py-1 text-gray-700">Total TTC</td>
                                        <td className="py-1 text-gray-800 text-right">-1.050,00 €</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              
                              {/* Remboursement Section */}
                              <div className="mb-4 border-t pt-4">
                                <div className="text-xs text-gray-600 mb-2">
                                  <div className="font-medium text-gray-700">Modalités de remboursement</div>
                                  <div>Le montant sera remboursé par virement bancaire sous 15 jours.</div>
                                </div>
                                
                                <div className="text-xs text-gray-600 mt-3">
                                  <div className="font-medium text-gray-700">Motif de l&apos;avoir</div>
                                  <div>Annulation partielle de la commande suite à une erreur de facturation.</div>
                                </div>
                              </div>
                              
                              {/* TVA Summary */}
                              <div className="mb-4 border rounded p-2 bg-gray-50">
                                <div className="text-xs font-medium text-gray-700 mb-1">Récapitulatif TVA</div>
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="py-1 text-left text-gray-600">Taux</th>
                                      <th className="py-1 text-right text-gray-600">Base HT</th>
                                      <th className="py-1 text-right text-gray-600">Montant TVA</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="py-1 text-gray-700">20,00%</td>
                                      <td className="py-1 text-gray-700 text-right">-875,00 €</td>
                                      <td className="py-1 text-gray-700 text-right">-175,00 €</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Company Info */}
                              <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
                                <div className="flex justify-between mb-1">
                                  <div>
                                    <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires</div>
                                    <div>Banque: BNP Paribas</div>
                                    <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                                    <div>BIC: BNPAFRPPXXX</div>
                                  </div>
                                </div>
                                
                                <div className="text-center text-[10px] text-gray-500 mt-2">
                                  <div>Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789</div>
                                  <div>Pour tout renseignement complémentaire, veuillez nous contacter au 01 23 45 67 89</div>
                                </div>
                                
                                <div className="text-right mt-2 text-[10px] text-gray-500">
                                  Page 1/1
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
                                  { id: 'frame_color', label: 'Cadre', color: '#6C5DD3' },
                                  { id: 'label_text_color', label: 'Text des intitulés', color: '#FFFFFF' },
                                  { id: 'label_bg_color', label: 'Fond des intitulés', color: '#6C5DD3' },
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
                                          className="w-24 px-2 py-1 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#6C5DD3]"
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
                                  <span>Les couleurs seront appliquées à tous les éléments correspondants dans le document.</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Police des intitulés Section */}
                            <div className="border rounded-xl p-4 bg-white">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                Police des intitulés
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
                                    <option>Helvetica</option>
                                    <option>Arial</option>
                                    <option>Open Sans</option>
                                    <option>Roboto</option>
                                    <option>Montserrat</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
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
                            <button className="p-2 border rounded-lg bg-[#6C5DD3] text-white" title="Gras">
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
                              <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                              <span className="text-gray-700">Masquer les cadres</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" />
                              <span className="text-gray-700">Masquer les entêtes</span>
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
                        
                        <div className="bg-white border border-[#6C5DD3] rounded-lg p-3 overflow-hidden shadow-sm">
                          {/* Header with selected styles */}
                          <div className="flex justify-between mb-3 pb-2 border-b border-[#6C5DD3]">
                            <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0"></div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-800">AVOIR</div>
                              <div className="text-xs text-gray-600">N° AV-2025-0042</div>
                            </div>
                          </div>
                          
                          {/* Table with selected styles */}
                          <table className="w-full text-xs mb-3">
                            <thead>
                              <tr>
                                <th className="py-1 px-1 bg-[#6C5DD3] text-white text-left rounded-tl-md">Description</th>
                                <th className="py-1 px-1 bg-[#6C5DD3] text-white text-center">Qté</th>
                                <th className="py-1 px-1 bg-[#6C5DD3] text-white text-right rounded-tr-md">Prix</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-1 px-1">Prestation de service</td>
                                <td className="py-1 px-1 text-center">-1</td>
                                <td className="py-1 px-1 text-right">-650,00 €</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          {/* Total section with selected styles */}
                          <div className="flex justify-end mb-2">
                            <div className="w-32">
                              <div className="flex justify-between text-xs">
                                <span>Total HT:</span>
                                <span>-650,00 €</span>
                              </div>
                              <div className="flex justify-between text-xs mt-1 pb-1 border-b border-gray-200">
                                <span>TVA 20%:</span>
                                <span>-130,00 €</span>
                              </div>
                              <div className="flex justify-between text-xs font-bold mt-1">
                                <span>Total TTC:</span>
                                <span>-780,00 €</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Footer with selected styles */}
                          <div className="text-[9px] text-gray-600 border-t border-[#6C5DD3] pt-2">
                            <div className="flex justify-between items-end">
                              <div>Référence facture: FA-2025-0127</div>
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
                            <button className="text-[#6C5DD3] text-xs hover:underline">
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
                className="px-6 py-2 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5C4DC3] transition flex items-center shadow-sm"
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C5DD3]/10 via-white/70 to-[#A78BFA]/10 rounded-3xl pointer-events-none" />

      {/* Blurred circles for decoration */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#6C5DD3]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#A78BFA]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative p-8 z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="max-w-2xl">
            {/* Title with decorative elements */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#6C5DD3]/10 rounded-lg">
                <FiFileText className="w-6 h-6 text-[#6C5DD3]" />
              </div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#4C3AA9] to-[#A78BFA]">
                Modèles d&apos;Avoirs
              </h1>
              <span className="px-2 py-1 text-xs font-medium text-[#6C5DD3] bg-[#6C5DD3]/10 rounded-full">
                {filteredTemplates.length} modèles
              </span>
            </div>
            
            <p className="text-base text-gray-600 leading-relaxed">
              Gérez et personnalisez vos modèles d&apos;impression pour avoirs.
              Sélectionnez un modèle pour visualiser et modifier son apparence.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTemplate}
              className="flex items-center px-4 py-2.5 bg-[#6C5DD3] text-white rounded-xl hover:bg-[#5C4DC3] transition shadow-sm"
              title="Imprimer le modèle sélectionné"
            >
              <FiPrinter className="mr-2" />
              Imprimer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2.5 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-xl hover:bg-[#6C5DD3]/20 transition"
              title="Consulter les mots-clés disponibles"
            >
              <FiKey className="mr-2" />
              Mots-clés
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectedTemplate && setAsDefault(selectedTemplate)}
              className="flex items-center px-4 py-2.5 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-xl hover:bg-[#6C5DD3]/20 transition"
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
              Personnalisez vos modèles d&apos;avoirs en incluant les références aux factures d&apos;origine.
              Les montants négatifs sont automatiquement formatés pour indiquer clairement qu&apos;il s&apos;agit d&apos;un remboursement.
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
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50 focus:border-transparent"
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
                    ? 'bg-[#6C5DD3]/10 border-l-4 border-[#6C5DD3]' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${selectedTemplate === template.id ? 'text-[#6C5DD3]' : 'text-gray-800'}`}>
                        {template.name}
                      </h3>
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
                    <FiChevronRight className={`w-5 h-5 transition-transform ${selectedTemplate === template.id ? 'transform rotate-90 text-[#6C5DD3]' : ''}`} />
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
              className="text-sm text-gray-600 flex items-center hover:text-[#6C5DD3]"
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
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditor(true)}
              className="flex items-center px-3 py-1.5 text-sm bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg hover:bg-[#6C5DD3]/20 transition"
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
                {/* This would be the actual credit note template preview */}
                <div className="w-[650px] h-[900px] bg-white p-10 relative">
                  {/* Header section with logo and info */}
                  <div className="flex justify-between mb-10">
                    <div>
                      <div className="w-24 h-12 bg-[#6C5DD3]/20 rounded-lg flex items-center justify-center text-[#6C5DD3] font-bold">LOGO</div>
                      <div className="mt-2 text-gray-800 text-sm">
                        <div>Votre Entreprise SARL</div>
                        <div>123 Avenue des Affaires</div>
                        <div>75001 Paris, France</div>
                        <div>contact@votreentreprise.fr</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800 mb-2">AVOIR</div>
                      <div className="text-gray-600 text-sm">
                        <div>N° AV-2025-0042</div>
                        <div>Date: 23/03/2025</div>
                        {currentTemplate.id === 'template1' && (
                          <div className="text-sm font-medium text-[#6C5DD3]">Facture d&apos;origine: FA-2025-0127</div>
                        )}
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
                  
                  {/* Credit note reason */}
                  <div className="border border-[#6C5DD3]/20 rounded-lg p-3 mb-6 bg-[#6C5DD3]/5">
                    <div className="text-sm font-semibold text-[#6C5DD3] mb-1">MOTIF DE L&apos;AVOIR</div>
                    <div className="text-gray-700">
                      {currentTemplate.id === 'template2' 
                        ? "Remboursement partiel suite à l'annulation de certaines prestations." 
                        : "Remboursement intégral suite à l'annulation de la commande."}
                    </div>
                  </div>
                  
                  {/* Credit note items */}
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
                      {currentTemplate.id === 'template2' ? (
                        <>
                          <tr>
                            <td className="py-3 px-2 text-gray-800">Service de consultation</td>
                            <td className="py-3 px-2 text-center text-gray-600">-1</td>
                            <td className="py-3 px-2 text-right text-gray-600">650,00 €</td>
                            <td className="py-3 px-2 text-right text-gray-800">-650,00 €</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 text-gray-800">Maintenance mensuelle</td>
                            <td className="py-3 px-2 text-center text-gray-600">-1</td>
                            <td className="py-3 px-2 text-right text-gray-600">225,00 €</td>
                            <td className="py-3 px-2 text-right text-gray-800">-225,00 €</td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr>
                            <td className="py-3 px-2 text-gray-800">Service de consultation</td>
                            <td className="py-3 px-2 text-center text-gray-600">-2</td>
                            <td className="py-3 px-2 text-right text-gray-600">650,00 €</td>
                            <td className="py-3 px-2 text-right text-gray-800">-1.300,00 €</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 text-gray-800">Développement web</td>
                            <td className="py-3 px-2 text-center text-gray-600">-1</td>
                            <td className="py-3 px-2 text-right text-gray-600">1.200,00 €</td>
                            <td className="py-3 px-2 text-right text-gray-800">-1.200,00 €</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 text-gray-800">Maintenance mensuelle</td>
                            <td className="py-3 px-2 text-center text-gray-600">-3</td>
                            <td className="py-3 px-2 text-right text-gray-600">75,00 €</td>
                            <td className="py-3 px-2 text-right text-gray-800">-225,00 €</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 text-gray-600 flex justify-between">
                        <span>Total HT</span>
                        <span>{currentTemplate.id === 'template2' ? '-875,00 €' : '-2.725,00 €'}</span>
                      </div>
                      
                      <div className="bg-white px-4 py-2 text-gray-600 flex justify-between border-t border-gray-100">
                        <span>TVA (20%)</span>
                        <span>{currentTemplate.id === 'template2' ? '-175,00 €' : '-545,00 €'}</span>
                      </div>
                      
                      <div className="bg-[#6C5DD3]/10 px-4 py-3 text-[#6C5DD3] font-semibold flex justify-between border-t border-gray-100">
                        <span>Total TTC</span>
                        <span>{currentTemplate.id === 'template2' ? '-1.050,00 €' : '-3.270,00 €'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t pt-6 text-sm text-gray-500">
                    <div className="mb-4">
                      <div className="font-medium text-gray-700 mb-1">Modalités de remboursement</div>
                      <div>Le montant sera remboursé par virement bancaire sous 15 jours.</div>
                    </div>
                    
                    <div className="text-center text-xs text-gray-400 mt-8">
                      <div>Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789</div>
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
                className="mt-6 px-4 py-2 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5C4DC3] transition"
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
              className="flex items-center px-4 py-2 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg hover:bg-[#6C5DD3]/20 transition"
              title="Télécharger en PDF"
            >
              <FiDownload className="mr-2" />
              Télécharger
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTemplate}
              className="flex items-center px-4 py-2 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5C4DC3] transition shadow-sm"
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