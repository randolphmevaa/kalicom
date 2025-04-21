import { useState, useCallback } from 'react';
import { Notification } from '../types';

export const useNotification = () => {
  // Notification state
  const [notification, setNotification] = useState<Notification>({
    message: '',
    visible: false
  });
  
  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification({
      message,
      visible: true
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, visible: false}));
    }, 3000);
  }, []);
  
  // Hide notification
  const hideNotification = useCallback(() => {
    setNotification(prev => ({...prev, visible: false}));
  }, []);
  
  return {
    notification,
    showNotification,
    hideNotification
  };
};