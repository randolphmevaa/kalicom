"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Configuration OAuth2
const CLIENT_ID = "67e1f96262f4c";
const CLIENT_SECRET = "b9b83284780d5463fa1a1ff2"; // Normalement stocké côté serveur
const REDIRECT_URI = "https://kalicom.vercel.app/dashboard/acceuil";
const AUTHORIZE_URL = "https://ssl.keyyo.com/oauth2/authorize.php";
const TOKEN_URL = "https://api.keyyo.com/oauth2/token.php";
const API_BASE_URL = "https://api.keyyo.com/manager/1.0";

// Types pour les services Keyyo
interface Service {
  _resource_type: string;
  csi: string;
  formatted_csi: string;
  name: string;
  offer_id: number;
  offer_name: string;
  commitment_start_date: string | null;
  status: string;
  blocking_status: string | null;
  options: Record<string, unknown>;
  short_number?: string;
  first_name?: string;
  last_name?: string;
  quota?: string;
}

interface ServiceResponse {
  _embedded: {
    [key: string]: Service[];
  };
}

// Types pour les détails d'appels entrants
interface CallDetail {
  id: string;
  datetime_start: string;
  datetime_answer?: string;
  datetime_end?: string;
  source: string;
  destination: string;
  duration: number;
  billing_duration?: number;
  status: string;
  service_name?: string;
  service_csi?: string;
  unit?: string;
}

interface CallDetailResponse {
  _embedded: {
    CallDetailRecord: CallDetail[];
  };
  total_count: number;
}

export default function KeyyoApiTest() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [callDetails, setCallDetails] = useState<CallDetail[]>([]);
  const [totalCalls, setTotalCalls] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCalls, setLoadingCalls] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  
  // État pour les filtres des appels
  const [dateStart, setDateStart] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 jours en arrière
  );
  const [dateEnd, setDateEnd] = useState<string>(
    new Date().toISOString().split('T')[0] // Aujourd'hui
  );
  const [limit, setLimit] = useState<number>(50);
  const [offset, setOffset] = useState<number>(0);

  // Step 1: Redirect to Keyyo OAuth authorization
  const initiateOAuth = () => {
    // Générer un état aléatoire pour sécuriser le flux OAuth
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Stocker l'état pour vérification lors du retour
    localStorage.setItem('keyyo_oauth_state', state);
    
    const authUrl = `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=code&state=${encodeURIComponent(state)}`;
    
    window.location.href = authUrl;
  };

  // Step 2: Handle OAuth callback and fetch token
  useEffect(() => {
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    
    if (code && !accessToken) {
      setLoading(true);
      setError(null);
      
      // Vérifier l'état pour prévenir les attaques CSRF
      const savedState = localStorage.getItem('keyyo_oauth_state');
      
      if (!returnedState || returnedState !== savedState) {
        setError("Échec de validation de sécurité (state). Veuillez réessayer.");
        setLoading(false);
        return;
      }
      
      // État vérifié, on peut le supprimer
      localStorage.removeItem('keyyo_oauth_state');
      
      // Exchange code for token
      fetchAccessToken(code);
    }
  }, [searchParams, accessToken]);

  // Exchange authorization code for access token
  const fetchAccessToken = async (code: string) => {
    try {
      // Note: In production, this should be done server-side to protect CLIENT_SECRET
      const tokenResponse = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Erreur lors de la récupération du token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      setAccessToken(tokenData.access_token);
      
      // Store token in localStorage (be cautious with this in production)
      localStorage.setItem("keyyo_access_token", tokenData.access_token);
      
      // After getting the token, fetch services
      fetchServices(tokenData.access_token);
    } catch (err) {
      console.error("Erreur d'authentification:", err);
      setError(`Erreur d'authentification: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };

  // Step 3: Fetch services with the access token
  const fetchServices = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json() as ServiceResponse;
      
      // Flatten all service types into a single array
      const allServices: Service[] = [];
      Object.keys(data._embedded).forEach(serviceType => {
        allServices.push(...data._embedded[serviceType]);
      });
      
      setServices(allServices);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des services:", err);
      setError(`Erreur API: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
    }
  };
  
  // Fetch incoming call details
  const fetchIncomingCallDetails = async () => {
    if (!accessToken) return;
    
    setLoadingCalls(true);
    setCallError(null);
    
    try {
      // Construire l'URL avec les paramètres
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      params.append('date_start', dateStart);
      params.append('date_end', dateEnd);
      
      const response = await fetch(`${API_BASE_URL}/incoming_call_detail?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json() as CallDetailResponse;
      
      setCallDetails(data._embedded?.CallDetailRecord || []);
      setTotalCalls(data.total_count || 0);
    } catch (err) {
      console.error("Erreur lors de la récupération des appels:", err);
      setCallError(`Erreur API: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingCalls(false);
    }
  };

  // Check if token exists in localStorage on initial load or initiate auth if not
  useEffect(() => {
    const storedToken = localStorage.getItem("keyyo_access_token");
    if (storedToken) {
      setAccessToken(storedToken);
      fetchServices(storedToken);
    } else {
      // Initier automatiquement l'authentification au chargement si aucun token n'est trouvé
      initiateOAuth();
    }
  }, []);
  
  // Charger les appels lorsque les paramètres de filtre changent
  useEffect(() => {
    if (accessToken) {
      fetchIncomingCallDetails();
    }
  }, [accessToken, dateStart, dateEnd, limit, offset]);

  // Logout function
  const logout = () => {
    localStorage.removeItem("keyyo_access_token");
    setAccessToken(null);
    setServices([]);
  };

  // Formater la durée en minutes et secondes
  const formatDuration = (seconds: number): string => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Formater la date et l'heure
  const formatDateTime = (datetime: string): string => {
    if (!datetime) return '--';
    const date = new Date(datetime);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Keyyo</h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p>Authentification et chargement des données...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erreur de connexion</p>
          <p>{error}</p>
          <button
            onClick={initiateOAuth}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer la connexion
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              {accessToken && (
                <span className="text-green-600 text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  Connecté à l&apos;API Keyyo
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Déconnexion
            </button>
          </div>

          {/* Onglets de navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Services
              </button>
              <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Appels entrants
              </button>
            </nav>
          </div>

          {/* Section des services */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Services Keyyo</h2>
            
            {loading ? (
              <p>Chargement des services...</p>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Type</th>
                      <th className="border px-4 py-2">Nom</th>
                      <th className="border px-4 py-2">Numéro</th>
                      <th className="border px-4 py-2">Offre</th>
                      <th className="border px-4 py-2">Statut</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="border px-4 py-2 text-center">
                          Aucun service trouvé
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.csi}>
                          <td className="border px-4 py-2">{service._resource_type}</td>
                          <td className="border px-4 py-2">{service.name}</td>
                          <td className="border px-4 py-2">{service.formatted_csi}</td>
                          <td className="border px-4 py-2">{service.offer_name}</td>
                          <td className="border px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded ${
                                service.status === "in_service"
                                  ? "bg-green-100 text-green-800"
                                  : service.status === "suspended" || service.status === "cancellation_pending"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {service.status}
                            </span>
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() => {
                                // Exemple: afficher les détails du service
                                alert(`Détails pour ${service.name}: ${JSON.stringify(service, null, 2)}`);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded text-sm"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Service Type Filter */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Types de services disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {services.length > 0 &&
                  [...new Set(services.map((service) => service._resource_type))].map((type) => (
                    <span
                      key={type}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {type} ({services.filter((s) => s._resource_type === type).length})
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Section des appels entrants */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Détails des appels entrants</h2>
            
            {/* Filtres pour les appels */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de résultats</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                    className="border rounded p-2 w-full"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => fetchIncomingCallDetails()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    disabled={loadingCalls}
                  >
                    {loadingCalls ? "Chargement..." : "Actualiser"}
                  </button>
                </div>
              </div>
            </div>
            
            {loadingCalls ? (
              <p>Chargement des appels...</p>
            ) : callError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {callError}
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-3">
                  {totalCalls} appel(s) trouvé(s) pour la période du {dateStart} au {dateEnd}
                </div>
              
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Date et heure</th>
                        <th className="border px-4 py-2">Source</th>
                        <th className="border px-4 py-2">Destination</th>
                        <th className="border px-4 py-2">Durée</th>
                        <th className="border px-4 py-2">Statut</th>
                        <th className="border px-4 py-2">Service</th>
                      </tr>
                    </thead>
                    <tbody>
                      {callDetails.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="border px-4 py-2 text-center">
                            Aucun appel trouvé pour cette période
                          </td>
                        </tr>
                      ) : (
                        callDetails.map((call) => (
                          <tr key={call.id}>
                            <td className="border px-4 py-2">{formatDateTime(call.datetime_start)}</td>
                            <td className="border px-4 py-2">{call.source}</td>
                            <td className="border px-4 py-2">{call.destination}</td>
                            <td className="border px-4 py-2">{formatDuration(call.duration)}</td>
                            <td className="border px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded ${
                                  call.status === "answered"
                                    ? "bg-green-100 text-green-800"
                                    : call.status === "missed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {call.status === "answered" ? "Répondu" : 
                                 call.status === "missed" ? "Manqué" : call.status}
                              </span>
                            </td>
                            <td className="border px-4 py-2">{call.service_name || '--'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalCalls > limit && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <button
                        onClick={() => setOffset(Math.max(0, offset - limit))}
                        disabled={offset === 0}
                        className={`px-3 py-1 rounded border ${
                          offset === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setOffset(offset + limit)}
                        disabled={offset + limit >= totalCalls}
                        className={`ml-2 px-3 py-1 rounded border ${
                          offset + limit >= totalCalls
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        Suivant
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Affichage {offset + 1} à {Math.min(offset + limit, totalCalls)} sur {totalCalls}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}