import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAccessToken, getCSIToken } from '@/services/keyyoService';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Loading...');
  const router = useRouter();
  
  useEffect(() => {
    const handleCallback = async () => {
      const { code, error } = router.query;
      
      if (error) {
        setStatus(`Error: ${error}`);
        return;
      }
      
      if (code) {
        try {
          setStatus('Getting access token...');
          const accessTokenResponse = await getAccessToken(code);
          
          if (accessTokenResponse.error) {
            setStatus(`Error: ${accessTokenResponse.error}`);
            return;
          }
          
          setStatus('Getting CSI token...');
          const csiToken = await getCSIToken(accessTokenResponse.access_token);
          
          // Store the token securely (localStorage for simplicity, but consider more secure options)
          localStorage.setItem('keyyoCSIToken', csiToken);
          
          setStatus('Authentication completed!');
          
          // Redirect back to the phone page
          router.push('/dashboard/pbx/poste-de-travail');
        } catch (err) {
          setStatus(`Error during authentication: ${err.message}`);
        }
      }
    };
    
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Authentification Keyyo</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}