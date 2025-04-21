'use client';

import React, { Suspense } from 'react';
// import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import types, hooks, and smaller components
import { useTemplates } from './hooks/useTemplates';
import { useNotification } from './hooks/useNotification';
// import { headerVariants } from './animations';

// Import regular components
import Header from './components/Header';
import TemplateList from './components/TemplateList';
import TemplatePreview from './components/TemplatePreview';
import Notification from './components/Notification';

// Dynamically import modals for code splitting
const DeleteConfirmModal = dynamic(() => import('./components/DeleteConfirmModal'), { ssr: false });
const ExpandedPreviewModal = dynamic(() => import('./components/ExpandedPreviewModal'), { ssr: false });
const TemplateWizard = dynamic(() => import('./components/wizard/TemplateWizard'), { ssr: false });

export default function ModeleDevis() {
  // Use custom hooks for state management
  const {
    selectedTemplate,
    setSelectedTemplate,
    searchQuery,
    setSearchQuery,
    showHiddenTemplates,
    setShowHiddenTemplates,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    showEditor,
    setShowEditor,
    isPreviewExpanded,
    setIsPreviewExpanded,
    templates,
    filteredTemplates,
    currentTemplate,
    toggleTemplateVisibility,
    setAsDefault,
    confirmDeleteTemplate,
    printTemplate,
    downloadPdf,
    createNewTemplate
  } = useTemplates();

  const { notification, showNotification } = useNotification();

  return (
    <div className="min-h-screen">
      {/* Notification Toast */}
      <Notification
        message={notification.message}
        visible={notification.visible}
      />
      
      {/* Modals - Dynamically loaded */}
      {deleteConfirmOpen && (
        <DeleteConfirmModal
          template={currentTemplate}
          onConfirm={confirmDeleteTemplate}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}
      
      {isPreviewExpanded && (
        <ExpandedPreviewModal
          template={currentTemplate}
          onClose={() => setIsPreviewExpanded(false)}
          onDownload={downloadPdf}
          onPrint={printTemplate}
        />
      )}
      
      {showEditor && (
        <TemplateWizard
          onClose={() => setShowEditor(false)}
          onComplete={showNotification}
        />
      )}
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Header Section */}
        <Header
          templateCount={filteredTemplates.length}
          onPrint={printTemplate}
          onSetDefault={() => selectedTemplate && setAsDefault(selectedTemplate)}
          onCreateNew={createNewTemplate}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {/* Template List (Left Column) */}
          <TemplateList
            templates={filteredTemplates}
            selectedTemplate={selectedTemplate}
            searchQuery={searchQuery}
            showHiddenTemplates={showHiddenTemplates}
            totalTemplates={templates.length}
            onSelectTemplate={setSelectedTemplate}
            onSearchChange={setSearchQuery}
            onToggleHidden={setShowHiddenTemplates}
          />
          
          {/* Template Preview (Right Column) */}
          <Suspense fallback={<div className="md:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 h-[600px] flex items-center justify-center">Loading preview...</div>}>
            <TemplatePreview
              template={currentTemplate}
              isDefault={currentTemplate?.isDefault}
              isHidden={currentTemplate?.isHidden}
              onEdit={() => setShowEditor(true)}
              onToggleVisibility={() => currentTemplate && toggleTemplateVisibility(currentTemplate.id)}
              onDelete={() => setDeleteConfirmOpen(true)}
              onExpandPreview={() => setIsPreviewExpanded(true)}
              onDownload={downloadPdf}
              onPrint={printTemplate}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}