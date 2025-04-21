'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiInfo, FiPrinter, FiKey, FiStar, FiPlus } from 'react-icons/fi';

import TemplateList from './components/TemplateList';
import TemplatePreview from './components/TemplatePreview';
import { useTemplates } from './hooks/useTemplates';
import { useNotification } from './hooks/useNotification';

// Lazy-loaded components
const DeleteConfirmModal = lazy(() => import('./components/Modals/DeleteConfirmModal'));
const ExpandedPreviewModal = lazy(() => import('./components/Modals/ExpandedPreviewModal'));
const TemplateWizard = lazy(() => import('./components/TemplateWizard'));
const NotificationToast = lazy(() => import('./components/Modals/NotificationToast'));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeOut', duration: 0.6 },
  },
};

export default function ModeleFacture() {
  const { 
    templates,
    filteredTemplates,
    selectedTemplate,
    currentTemplate,
    searchQuery,
    setSearchQuery,
    showHiddenTemplates,
    setShowHiddenTemplates,
    setSelectedTemplate,
    toggleTemplateVisibility,
    setAsDefault,
    confirmDeleteTemplate,
    createNewTemplate
  } = useTemplates();

  const {
    notification,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    isPreviewExpanded,
    setIsPreviewExpanded,
    showEditor,
    setShowEditor,
    showNotification,
    printTemplate,
    downloadPdf
  } = useNotification();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Notification Toast */}
      <Suspense fallback={null}>
        {notification.visible && (
          <NotificationToast message={notification.message} />
        )}
      </Suspense>
      
      {/* Modals */}
      <Suspense fallback={null}>
        {deleteConfirmOpen && (
          <DeleteConfirmModal 
            template={currentTemplate} 
            onClose={() => setDeleteConfirmOpen(false)} 
            onConfirm={confirmDeleteTemplate} 
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isPreviewExpanded && currentTemplate && (
          <ExpandedPreviewModal 
            template={currentTemplate} 
            onClose={() => setIsPreviewExpanded(false)}
            onPrint={printTemplate}
            onDownload={downloadPdf}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showEditor && (
          <TemplateWizard 
            onClose={() => setShowEditor(false)}
            onComplete={(templateData) => {
              showNotification('Modèle créé avec succès');
              setShowEditor(false);
              // In a real app, you would save the template here
              console.log('Creating template with data:', templateData);
            }}
          />
        )}
      </Suspense>
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Header / Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiFileText className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Modèles de Facture
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {filteredTemplates.length} modèles
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez et personnalisez vos modèles d&apos;impression pour factures.
                  Sélectionnez un modèle pour visualiser et modifier son apparence.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={printTemplate}
                  className="flex items-center px-4 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003AA0] transition shadow-sm"
                  title="Imprimer le modèle sélectionné"
                >
                  <FiPrinter className="mr-2" />
                  Imprimer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2.5 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Consulter les mots-clés disponibles"
                >
                  <FiKey className="mr-2" />
                  Mots-clés
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectedTemplate && setAsDefault(selectedTemplate)}
                  className="flex items-center px-4 py-2.5 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Définir comme modèle par défaut"
                >
                  <FiStar className="mr-2" />
                  Modèle par défaut
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    createNewTemplate();
                    setShowEditor(true);
                    setSelectedTemplate(null);
                  }}
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
                  Personnalisez vos modèles avec votre logo et vos informations d&apos;entreprise. 
                  Utilisez les mots-clés pour insérer des données dynamiques comme les coordonnées client ou les détails de facturation.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {/* Template List */}
          <TemplateList 
            templates={templates}
            filteredTemplates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            searchQuery={searchQuery}
            showHiddenTemplates={showHiddenTemplates}
            onSelectTemplate={setSelectedTemplate}
            onSearchChange={setSearchQuery}
            onToggleHidden={setShowHiddenTemplates}
          />
          
          {/* Template Preview */}
          <TemplatePreview
            currentTemplate={currentTemplate}
            onEdit={() => setShowEditor(true)}
            onToggleVisibility={() => currentTemplate && toggleTemplateVisibility(currentTemplate.id)}
            onDelete={() => setDeleteConfirmOpen(true)}
            onExpand={() => setIsPreviewExpanded(true)}
            onPrint={printTemplate}
            onDownload={downloadPdf}
            onSetDefault={() => currentTemplate && setAsDefault(currentTemplate.id)}
            onCreateNew={createNewTemplate}
          />
        </div>
      </div>
    </motion.div>
  );
}