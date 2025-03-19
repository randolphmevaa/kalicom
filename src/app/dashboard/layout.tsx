// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get login info from localStorage
        const proInfo = localStorage.getItem('proInfo');
        
        if (!proInfo) {
          // No login info found, show access denied message
          setAuthError('Aucune information de connexion trouvée');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Parse the login info
        const userInfo = JSON.parse(proInfo);
        
        if (!userInfo || !userInfo.isLoggedIn) {
          // User is not logged in, show access denied message
          setAuthError('Session non valide');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if the login is expired (optional - you can set an expiration time)
        const currentTime = new Date().getTime();
        const loginTime = userInfo.timestamp || 0;
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (currentTime - loginTime > expirationTime) {
          // Login expired, clear localStorage and show access denied message
          localStorage.removeItem('proInfo');
          setAuthError('Votre session a expiré');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        // In case of any error, show access denied message
        localStorage.removeItem('proInfo');
        setAuthError('Erreur d\'authentification');
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-redirect after 4 seconds if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectTimer = setTimeout(() => {
        router.push('/');
      }, 4000);

      // Clean up timer on unmount
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoading, isAuthenticated, router]);

  // Sidebar widths: open = 280px, closed = 80px
  const sidebarWidth = sidebarOpen ? 280 : 80;

  // Show loading state
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

  // If not authenticated, show access denied message and auto-redirect
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
          
          {/* Progress bar for auto-redirect */}
          <div className="w-full h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-[#004AC8] rounded-full" 
                style={{ animation: 'countdown 4s linear forwards' }}></div>
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
          
          <p className="mt-4 text-xs text-gray-400">Redirection automatique dans 4 secondes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e7eaf1]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} sidebarWidth={sidebarWidth} />
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header sidebarWidth={sidebarWidth} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
