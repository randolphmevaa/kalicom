'use client';
// src/app/components/KeyyoLogin.tsx

import { useState } from 'react';
// import { useRouter } from 'next/navigation';

const KeyyoLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScope, setSelectedScope] = useState('none');
  // const router = useRouter();
  
  const handleLogin = () => {
    setIsLoading(true);
    
    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store the state in sessionStorage
    sessionStorage.setItem('keyyo_auth_state', state);
    
    // Get client ID from environment variables
    const clientId = process.env.NEXT_PUBLIC_KEYYO_CLIENT_ID;
    
    // Determine the redirect URI based on environment
    const redirectUri = encodeURIComponent(
      process.env.NODE_ENV === 'production'
        ? 'https://kalicom.vercel.app/api/auth/callback/keyyo'
        : 'http://localhost:3000/api/auth/callback/keyyo'
    );
    
    // Build the base authorization URL
    let authUrl = `https://ssl.keyyo.com/oauth2/authorize.php?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
    
    // Add scope parameter based on selection
    if (selectedScope !== 'none') {
      authUrl += `&scope=${encodeURIComponent(selectedScope)}`;
    }
    
    console.log("Redirecting to Keyyo authorization with auth URL:", authUrl);
    
    // Redirect to Keyyo authorization page
    window.location.href = authUrl;
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 font-body">Choisir un scope:</label>
        <select 
          value={selectedScope}
          onChange={(e) => setSelectedScope(e.target.value)}
          className="w-full p-2 border rounded font-body"
        >
          <option value="none">Sans scope (recommandé pour tester)</option>
          <option value="a.user">a.user</option>
          <option value="o.w.voipprofile">o.w.voipprofile</option>
          <option value="full_access">full_access</option>
          <option value="cti_admin">cti_admin</option>
          <option value="voip_profiles_admin">voip_profiles_admin</option>
          <option value="service_password_read_only">service_password_read_only</option>
          <option value="full_access_read_only">full_access_read_only</option>
        </select>
      </div>
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`px-4 py-2 rounded transition-colors font-body ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Connexion en cours...' : 'Se connecter avec Keyyo'}
      </button>
      
      <div className="mt-2 text-sm text-gray-500">
        <p>Si vous rencontrez des problèmes d&apos;autorisation, essayez d&apos;abord sans scope.</p>
        <p>Les scopes corrects peuvent dépendre de la configuration de votre application Keyyo.</p>
      </div>
    </div>
  );
};

export default KeyyoLogin;