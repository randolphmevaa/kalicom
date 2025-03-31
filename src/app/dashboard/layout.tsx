// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Use dynamic imports with no SSR for faster client-side rendering
const Sidebar = dynamic(
  () => import('../components/Sidebar'),
  { 
    ssr: false, 
    loading: () => (
      <div className="h-screen w-20 bg-gradient-to-b from-[#004AC8] to-[#1B0353] fixed" />
    )
  }
);
const Header = dynamic(() => import('../components/Header'), { ssr: false });

// Simple loading component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-[#004AC8] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Initialize with stored value for faster initial render
  const initialSidebarState = typeof window !== 'undefined' 
    ? localStorage.getItem('sidebarOpen') !== 'false' 
    : true;
  
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarState);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Toggle sidebar with localStorage update
  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', String(newState));
      return newState;
    });
  };

  // Show navigation loading state between page transitions
  useEffect(() => {
    // When route changes, show navigation loading
    setIsNavigating(true);
    
    // Short timeout for very fast navigation
    const timeout = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Check authentication once on component mount - optimized
  useEffect(() => {
    // Create an AbortController to cancel fetch if component unmounts
    const controller = new AbortController();
    
    const checkAuth = async () => {
      try {
        // Get login info from localStorage - wrapped in try/catch for safety
        let proInfo;
        try {
          proInfo = localStorage.getItem('proInfo');
        } catch (e) {
          console.error('Error accessing localStorage:', e);
          setAuthError('Erreur d\'accès au stockage local');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (!proInfo) {
          setAuthError('Aucune information de connexion trouvée');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Parse once - don't parse multiple times
        const userInfo = JSON.parse(proInfo);
        
        if (!userInfo || !userInfo.isLoggedIn) {
          setAuthError('Session non valide');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Simple timestamp check
        const currentTime = Date.now();
        const loginTime = userInfo.timestamp || 0;
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
        
        if (currentTime - loginTime > expirationTime) {
          localStorage.removeItem('proInfo');
          setAuthError('Votre session a expiré');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Cache the authenticated state in sessionStorage for faster subsequent checks
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('proInfo');
        setAuthError('Erreur d\'authentification');
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    // Try to get from session cache first (much faster)
    const cachedAuth = sessionStorage.getItem('isAuthenticated');
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      checkAuth();
    }

    return () => {
      controller.abort();
    };
  }, []);

  // Auto-redirect with reduced timer for faster UX
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 2000); // Reduced from 4000ms to 2000ms

      return () => clearTimeout(redirectTimer);
    }
  }, [isLoading, isAuthenticated, router]);

  // Memoize the sidebar width to prevent recalculation on every render
  const sidebarWidth = useMemo(() => sidebarOpen ? 280 : 80, [sidebarOpen]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#e7eaf1]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#004AC8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#EEF2FF] via-[#F5F8FF] to-[#FAFBFF]">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md border border-[#004AC8]/10 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" 
            style={{ 
              backgroundImage: 'radial-gradient(#004AC8 0.8px, transparent 0.8px)',
              backgroundSize: '20px 20px'
            }}>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#004AC8]/5 to-[#4BB2F6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#4BB2F6]/5 to-[#004AC8]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-md"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          {/* Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Accès restreint</h2>
          <p className="text-gray-600 mb-2 text-lg">Vous ne pouvez pas accéder à cette page</p>
          <p className="text-gray-500 mb-6 text-sm">
            {authError || 'Veuillez vous connecter pour accéder à votre espace Kalicom PBX'}
          </p>
          
          {/* Progress bar for auto-redirect - faster animation */}
          <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-[#004AC8] rounded-full" 
                style={{ animation: 'countdown 2s linear forwards' }}></div>
          </div>
          <style jsx>{`
            @keyframes countdown {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
          
          {/* CTA Button */}
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center w-full font-medium shadow-sm"
          >
            Se connecter maintenant
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          
          <p className="mt-4 text-xs text-gray-400">Redirection automatique dans 2 secondes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e7eaf1] overflow-hidden">
      {/* Show navigation loading spinner if navigating between pages */}
      {isNavigating && <LoadingSpinner />}
      
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header sidebarWidth={sidebarWidth} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
