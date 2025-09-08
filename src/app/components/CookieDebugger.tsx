'use client';
// src/app/components/CookieDebugger.tsx

import { useState, useEffect } from 'react';

export default function CookieDebugger() {
  const [cookies, setCookies] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    setCookies(document.cookie);
    
    // Rafraîchir les cookies toutes les secondes
    const interval = setInterval(() => {
      setCookies(document.cookie);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const parsedCookies = cookies.split(';').map(cookie => {
    const [name, value] = cookie.trim().split('=');
    return { name, value };
  }).filter(cookie => cookie.name); // Filter out empty cookies

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
      >
        {isVisible ? 'Masquer' : 'Afficher'} les cookies
      </button>
      
      {isVisible && (
        <div className="mt-2 p-3 bg-white border rounded shadow-lg max-w-md max-h-80 overflow-auto">
          <h3 className="font-bold mb-2">Cookies actuels:</h3>
          {parsedCookies.length > 0 ? (
            <ul className="text-sm">
              {parsedCookies.map((cookie, index) => (
                <li key={index} className="mb-1">
                  <span className="font-semibold">{cookie.name}:</span> 
                  <span className="ml-1 break-all">{cookie.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun cookie trouvé</p>
          )}
        </div>
      )}
    </div>
  );
}