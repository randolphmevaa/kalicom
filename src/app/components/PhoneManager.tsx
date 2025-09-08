'use client';
// components/PhoneManager.tsx

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Define TypeScript interfaces
interface KeyyoError {
  code?: number;
  message?: string;
}

interface KeyyoResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
}

interface KeyyoCTIOptions {
  cookie_name?: string;
  cookie_expires?: number;
}

interface CallData {
  callref: string;
  caller: string;
  callee: string;
  state: 'SETUP' | 'CONNECT' | 'RELEASE' | 'MISSED';
  setup_date: number;
  connect_date?: number;
  release_date?: number;
  callpark_slot?: string;
  // Add methods that will be attached by the Keyyo CTI library
  onSetup?: () => void;
  onConnect?: () => void;
  onRelease?: () => void;
  onMissed?: () => void;
  answer?: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  hang_up?: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  reject?: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  transfer?: (call_side: string, to: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  supervised_transfer?: (call_side: string, to: string, invite_timer: number, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  merge?: (call_side: string, second_call: CallData, second_call_side: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  pause?: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  park?: (side: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  unpark?: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  get_ringing_duration?: () => number;
  get_duration?: () => number;
}

// Separate the instance interface from the constructor
interface KeyyoCTIInstance {
  create_session: (csiToken: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  restore_session: (csiToken: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void, sessionId?: string) => void;
  destroy_session: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  subscribe: (number: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  unsubscribe: (number: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  get_subscriptions: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  set_auto_answer: (auto_answer: boolean, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  get_auto_answer: (callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  dial: (number: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  send_message: (number: string, message: string, callback: (err: KeyyoError | null, res?: KeyyoResponse) => void) => void;
  get_calls: () => CallData[];
  get_call: (callref: string) => CallData;
  onNewCall?: (call: CallData) => void;
  connected: boolean;
}

// Define the constructor type
interface KeyyoCTIConstructor {
  new (options?: KeyyoCTIOptions): KeyyoCTIInstance;
}

// Define window with Keyyo property
declare global {
  interface Window {
    Keyyo?: {
      CTI: KeyyoCTIConstructor;
    };
  }
}

const PhoneManager: React.FC = () => {
  const [ , setCsiToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeCall, setActiveCall] = useState<CallData | null>(null);
  const [callHistory, setCallHistory] = useState<CallData[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ctiRef = useRef<KeyyoCTIInstance | null>(null);

  useEffect(() => {
    // Initialize CTI if Keyyo script is already loaded
    if (window.Keyyo) {
      ctiRef.current = new window.Keyyo.CTI({
        cookie_name: 'keyyo_cti_session',
        cookie_expires: 1 // 1 day
      });
      fetchCsiToken();
    }

    // Set up listener for when the script loads
    const handleKeyyoLoad = () => {
      if (window.Keyyo && !ctiRef.current) {
        ctiRef.current = new window.Keyyo.CTI({
          cookie_name: 'keyyo_cti_session',
          cookie_expires: 1 // 1 day
        });
        fetchCsiToken();
      }
    };

    // Check periodically if Keyyo is loaded (backup approach)
    const checkInterval = setInterval(() => {
      if (window.Keyyo && !ctiRef.current) {
        handleKeyyoLoad();
        clearInterval(checkInterval);
      }
    }, 500);

    return () => {
      // Clean up on unmount
      clearInterval(checkInterval);
      if (ctiRef.current && ctiRef.current.connected) {
        try {
          ctiRef.current.destroy_session(() => {
            console.log('Session destroyed');
          });
        } catch (e) {
          console.error('Error destroying session:', e);
        }
      }
    };
  }, []);

  const fetchCsiToken = async () => {
    setIsLoading(true);
    setStatusMessage('Connexion à Keyyo...');
    
    try {
      const response = await axios.post('/api/keyyo/csi-token');
      setCsiToken(response.data.csiToken);
      
      if (response.data.csiToken && ctiRef.current) {
        connectToCTI(response.data.csiToken);
      }
    } catch (error) {
      console.error('Failed to get CSI token:', error);
      setStatusMessage('Échec de la connexion. Veuillez vérifier votre authentification.');
      setIsLoading(false);
    }
  };

  const connectToCTI = (token: string) => {
    if (!ctiRef.current) return;

    ctiRef.current.create_session(token, (err ) => {
      setIsLoading(false);
      
      if (err) {
        console.error('CTI connection error:', err);
        setStatusMessage('Échec de la connexion au système téléphonique');
        return;
      }

      setIsConnected(true);
      setStatusMessage('Connecté au système téléphonique Keyyo');
      setupCallListeners();
      refreshCallHistory();
    });
  };

  const setupCallListeners = () => {
    if (!ctiRef.current) return;

    ctiRef.current.onNewCall = (call: CallData) => {
      // Handle incoming or outgoing call
      setActiveCall(call);
      
      call.onSetup = () => {
        setStatusMessage('Appel en cours...');
      };

      call.onConnect = () => {
        setStatusMessage('Appel connecté');
      };

      call.onRelease = () => {
        setStatusMessage('Appel terminé');
        setActiveCall(null);
        refreshCallHistory();
      };

      call.onMissed = () => {
        setStatusMessage('Appel manqué');
        setActiveCall(null);
        refreshCallHistory();
      };
    };
  };

  const refreshCallHistory = () => {
    if (!ctiRef.current) return;
    
    const calls = ctiRef.current.get_calls();
    setCallHistory(calls || []);
  };

  const handleDial = () => {
    if (!ctiRef.current || !isConnected || !phoneNumber) return;

    // Format the number as international format if needed
    let formattedNumber = phoneNumber;
    if (!phoneNumber.startsWith('33') && phoneNumber.startsWith('0')) {
      formattedNumber = '33' + phoneNumber.substring(1);
    }

    ctiRef.current.dial(formattedNumber, (err ) => {
      if (err) {
        console.error('Error dialing:', err);
        setStatusMessage(`Erreur lors de l'appel de ${phoneNumber}`);
        return;
      }
      setStatusMessage(`Appel en cours vers ${phoneNumber}...`);
    });
  };

  const handleHangUp = () => {
    if (!activeCall || !activeCall.hang_up) return;

    activeCall.hang_up((err) => {
      if (err) {
        console.error('Error hanging up:', err);
        return;
      }
      setStatusMessage('Appel terminé');
    });
  };

  const handleAnswer = () => {
    if (!activeCall || !activeCall.answer) return;

    activeCall.answer((err) => {
      if (err) {
        console.error('Error answering call:', err);
        return;
      }
      setStatusMessage('Appel répondu');
    });
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 font-header">Gestion Téléphonique</h2>
      
      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="font-body">Statut: {statusMessage || 'Non connecté'}</p>
        <p className="font-body">Connexion: {isConnected ? 'Connecté' : 'Déconnecté'}</p>
      </div>

      {!isConnected && (
        <button 
          onClick={fetchCsiToken}
          disabled={isLoading}
          className={`mb-4 px-4 py-2 rounded text-white font-body ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Connexion...' : 'Connecter au système téléphonique'}
        </button>
      )}

      {isConnected && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-body">Numéro de téléphone:</label>
            <div className="flex">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 border rounded p-2 mr-2 font-body"
                placeholder="Entrez un numéro de téléphone"
              />
              <button 
                onClick={handleDial}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-body"
              >
                Appeler
              </button>
            </div>
          </div>

          {activeCall && (
            <div className="mb-4 p-3 border rounded bg-yellow-50">
              <p className="font-body">
                {activeCall.caller === activeCall.callee ? 
                  `Sortant: ${activeCall.callee}` : 
                  `Entrant: ${activeCall.caller}`}
              </p>
              <p className="font-body">Statut: {activeCall.state}</p>
              <div className="mt-2 flex space-x-2">
                {activeCall.state === 'SETUP' && (
                  <button 
                    onClick={handleAnswer}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 font-body"
                  >
                    Répondre
                  </button>
                )}
                <button 
                  onClick={handleHangUp}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-body"
                >
                  Raccrocher
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-bold font-header">Appels récents</h3>
            {callHistory.length > 0 ? (
              <ul className="mt-2 border rounded divide-y">
                {callHistory.map((call, index) => (
                  <li key={index} className="p-2">
                    <p className="font-body">{call.caller === call.callee ? 'Sortant' : 'Entrant'}: {call.caller === call.callee ? call.callee : call.caller}</p>
                    <p className="text-sm text-gray-500 font-body">
                      {new Date(call.setup_date * 1000).toLocaleString()} - {call.state}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2 font-body">Aucun historique d&apos;appel disponible</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneManager;