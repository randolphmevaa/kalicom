'use client';
// src/app/dashboard/phone/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KeyyoLogin from '@/app/components/KeyyoLogin';
import PhoneManager from '@/app/components/PhoneManager';
import KeyyoScriptLoader from '@/app/components/KeyyoScriptLoader';
import CookieDebugger from '@/app/components/CookieDebugger';

export default function PhoneDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  // Check if the user is authenticated with Keyyo
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // A simple check to see if we have cookies
        const cookies = document.cookie;
        const hasAccessToken = cookies.includes('keyyo_access_token');
        const hasRefreshToken = cookies.includes('keyyo_refresh_token');
        
        console.log("Cookie check:", { cookies, hasAccessToken, hasRefreshToken });
        setIsAuthenticated(hasAccessToken && hasRefreshToken);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <>
      <KeyyoScriptLoader>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6 font-header">Gestion Téléphonique</h1>
          
          {!isAuthenticated ? (
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h2 className="text-xl mb-2 font-header">Connexion à Keyyo</h2>
              <p className="mb-4 font-body">
                Veuillez connecter votre compte Keyyo pour utiliser les fonctionnalités téléphoniques dans ce CRM.
              </p>
              <KeyyoLogin />
            </div>
          ) : (
            <PhoneManager />
          )}
          
          <div className="mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-body"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </KeyyoScriptLoader>
      <CookieDebugger />
    </>
  );
}