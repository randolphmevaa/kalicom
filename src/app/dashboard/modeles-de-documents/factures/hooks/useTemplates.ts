import { useState, useEffect } from 'react';
import { InvoiceTemplate } from '../types';
import { templates as initialTemplates } from '../data/templates';

export function useTemplates() {
  // State
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenTemplates, setShowHiddenTemplates] = useState(false);
  
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
  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  // If we don't have a selected template, set the first visible one
  useEffect(() => {
    if (!selectedTemplate && filteredTemplates.length > 0) {
      setSelectedTemplate(filteredTemplates[0].id);
    }
  }, [selectedTemplate, filteredTemplates]);

  // Toggle template visibility
  const toggleTemplateVisibility = (id: string) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, isHidden: !template.isHidden } 
          : template
      )
    );
    
    // In a real app, this would update the template in your database
    console.log(`Toggling visibility for template: ${id}`);
  };

  // Set template as default
  const setAsDefault = (id: string) => {
    setTemplates(prev => 
      prev.map(template => ({
        ...template,
        isDefault: template.id === id
      }))
    );
    
    // In a real app, this would update the template in your database
    console.log(`Setting template ${id} as default`);
  };

  // Delete template
  const confirmDeleteTemplate = () => {
    if (!currentTemplate) return;
    
    // Remove the template from the state
    setTemplates(prev => prev.filter(template => template.id !== currentTemplate.id));
    
    // In a real app, this would delete the template from your database
    console.log(`Deleting template: ${currentTemplate.id}`);
    
    // Select first available template
    if (filteredTemplates.length > 1) {
      const newSelectedId = filteredTemplates.find(t => t.id !== currentTemplate.id)?.id;
      setSelectedTemplate(newSelectedId || null);
    } else {
      setSelectedTemplate(null);
    }
  };

  // Create new template (in a real app this would add to the database)
  const createNewTemplate = () => {
    // This would be implemented to actually create the template
    // For now, we just return the action for the wizard to handle
    console.log('Initiating template creation...');
  };

  return {
    templates,
    filteredTemplates,
    selectedTemplate,
    currentTemplate,
    searchQuery,
    showHiddenTemplates,
    setSelectedTemplate,
    setSearchQuery,
    setShowHiddenTemplates,
    toggleTemplateVisibility,
    setAsDefault,
    confirmDeleteTemplate,
    createNewTemplate
  };
}