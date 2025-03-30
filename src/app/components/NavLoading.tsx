// app/components/NavLoading.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Create a context to track navigation state
type NavigationContextType = {
  isNavigating: boolean;
};

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
});

export const useNavigation = () => useContext(NavigationContext);

// Loading bar component at the top of the page
export function NavigationLoadingBar() {
  const { isNavigating } = useNavigation();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 z-[100] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          initial={{ width: '0%', opacity: 1 }}
          animate={{ 
            width: ['0%', '30%', '60%', '80%'],
            opacity: 1
          }}
          exit={{ 
            width: '100%', 
            opacity: 0,
            transition: { duration: 0.2 } 
          }}
          transition={{ 
            width: { 
              duration: 2, 
              ease: 'easeInOut',
              times: [0, 0.3, 0.6, 0.9]
            }
          }}
        />
      )}
    </AnimatePresence>
  );
}

// Loading indicator for when navigation is taking longer than expected
export function NavigationLoadingIndicator() {
  const { isNavigating } = useNavigation();
  const [showDelayedIndicator, setShowDelayedIndicator] = useState(false);

  // Only show the full-screen indicator after a delay
  useEffect(() => {
    if (isNavigating) {
      const timer = setTimeout(() => {
        setShowDelayedIndicator(true);
      }, 800); // Show indicator after 800ms of loading
      
      return () => clearTimeout(timer);
    } else {
      setShowDelayedIndicator(false);
    }
  }, [isNavigating]);

  return (
    <AnimatePresence>
      {showDelayedIndicator && (
        <motion.div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-lg p-6 shadow-lg text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-center mb-2">
              <svg 
                className="animate-spin h-8 w-8 text-indigo-600" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">Chargement en cours...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [prevPathname, setPrevPathname] = useState('');

  // Use effects to track navigation state changes
  useEffect(() => {
    if (prevPathname !== pathname) {
      // Navigation completed
      setIsNavigating(false);
      setPrevPathname(pathname);
    }
  }, [pathname, prevPathname]);
  
  // Listen to navigation events from router
  useEffect(() => {
    const handleStart = (url: string) => {
      // Only set navigating to true if it's a new path
      const newPath = url.split('?')[0];
      if (pathname !== newPath) {
        setIsNavigating(true);
      }
    };
    
    // const handleComplete = () => {
    //   setIsNavigating(false);
    // };
    
    // In Next.js, we would listen to events like this, but in app router
    // these are not directly available, so we can create our own custom
    // router wrapper to capture this behavior
    window.addEventListener('popstate', () => handleStart(window.location.pathname));
    
    // Capture clicks on links
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link && link.getAttribute('href')?.startsWith('/')) {
        handleStart(link.getAttribute('href') || '');
      }
    };
    
    document.addEventListener('click', handleLinkClick);
    
    return () => {
      window.removeEventListener('popstate', () => handleStart(window.location.pathname));
      document.removeEventListener('click', handleLinkClick);
    };
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      <NavigationLoadingBar />
      <NavigationLoadingIndicator />
      {children}
    </NavigationContext.Provider>
  );
}