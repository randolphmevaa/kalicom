import { useState } from 'react';
import { Notification } from '../types';

export function useNotification() {
  // Modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  // Notification system
  const [notification, setNotification] = useState<Notification>({
    message: '',
    visible: false
  });
  
  // Show notification with auto-hide
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

  // Print the template
  const printTemplate = () => {
    // In a real app, this would trigger print functionality
    console.log(`Printing template`);
    showNotification('Impression en cours...');
  };
  
  // Download template as PDF
  const downloadPdf = () => {
    // In a real app, this would trigger download functionality
    console.log(`Downloading template as PDF`);
    showNotification('Téléchargement du PDF en cours...');
  };

  return {
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
  };
}