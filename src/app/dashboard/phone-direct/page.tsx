'use client';
// app/dashboard/phone-direct/page.tsx
// Cette page évite délibérément le middleware pour tester le composant

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneManager from '../../components/PhoneManager';
import KeyyoScriptLoader from '../../components/KeyyoScriptLoader';
import KeyyoLogin from '../../components/KeyyoLogin';

export default function PhoneDirectAccess() {
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  return (
    <KeyyoScriptLoader>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 font-header">Test Direct - Gestion Téléphonique</h1>
        
        <div className="mb-4 p-4 bg-yellow-100 rounded border border-yellow-300">
          <p className="font-body">
            Ceci est une page de test direct pour contourner le middleware. 
            Utilisez les boutons ci-dessous pour tester les différents composants.
          </p>
        </div>
        
        <div className="mb-6 flex space-x-4">
          <button 
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded font-body"
          >
            Afficher Login
          </button>
          <button 
            onClick={() => setShowLogin(false)}
            className="px-4 py-2 bg-green-500 text-white rounded font-body"
          >
            Afficher Phone Manager
          </button>
        </div>
        
        {showLogin ? (
          <div className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="text-xl mb-2 font-header">Test de connexion à Keyyo</h2>
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
  );
}
