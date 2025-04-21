import { useState, useEffect } from 'react';
import { QuoteTemplate } from '../types';
import { templates as initialTemplates } from '../data';
import { filterTemplates } from '../utils';
import { useNotification } from './useNotification';

export const useTemplates = () => {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [templates, setTemplates] = useState<QuoteTemplate[]>(initialTemplates);
  
  const { showNotification } = useNotification();

  // Select the first template if none is selected
  useEffect(() => {
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, [selectedTemplate, templates]);

  // Filtered templates based on search and visibility
  const filteredTemplates = filterTemplates(templates, searchQuery, showHiddenTemplates);

  // Get the current selected template object
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || null;

  // Toggle template visibility
  const toggleTemplateVisibility = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, isHidden: !template.isHidden } 
          : template
      )
    );
    
    // Show success notification
    showNotification('État du modèle modifié avec succès');
  };

  // Set template as default
  const setAsDefault = (id: string) => {
    setTemplates(prev => 
      prev.map(template => ({
        ...template,
        isDefault: template.id === id
      }))
    );
    
    // Show success notification
    showNotification('Modèle défini par défaut avec succès');
  };

  // Delete template confirmation
  const confirmDeleteTemplate = () => {
    if (!currentTemplate) return;
    
    // Remove the template from the array
    setTemplates(prev => prev.filter(t => t.id !== currentTemplate.id));
    
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
  
  // Create new template
  const createNewTemplate = () => {
    setShowEditor(true);
  };

  return {
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
  };
};