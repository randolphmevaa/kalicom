'use client';

import React, { useState, Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiGrid } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

// Lightweight loading components
// import { LoadingCard } from '@/app/components/ui/LoadingCard';
import { ErrorBoundary } from '@/app/components/ui/ErrorBoundary';

// Simple components that don't need to be lazy loaded
// import { CircleStat } from '@/app/components/dashboard/CircleStat';

// Lazy load all major sections
const DashboardHeader = lazy(() => import('@/app/components/dashboard/DashboardHeader'));
const QuickActionSection = lazy(() => 
  import('@/app/components/dashboard/QuickActionSection').then(module => ({
    default: module.QuickActionSection
  }))
);
const PerformanceAnalyticsSection = lazy(() => 
  import('@/app/components/dashboard/PerformanceAnalyticsSection').then(module => ({
    default: module.PerformanceAnalyticsSection
  }))
);
const WeatherWidget = lazy(() => 
  import('@/app/components/dashboard/WeatherWidget').then(module => ({
    default: module.WeatherWidget
  }))
);
const ActivityFeedSection = lazy(() => 
  import('@/app/components/dashboard/ActivityFeedSection').then(module => ({
    default: module.ActivityFeedSection
  }))
);
const TicketsSAVSection = lazy(() => import('@/app/components/dashboard/TicketsSAVSection'));
const SystemStatusSection = lazy(() => 
  import('@/app/components/dashboard/SystemStatusSection').then(module => ({
    default: module.SystemStatusSection
  }))
);
const EventsSection = lazy(() => import('@/app/components/dashboard/EventsSection'));
const ChatSection = lazy(() => import('@/app/components/dashboard/ChatSection'));
const KalicomChatWidget = lazy(() => 
  import('@/app/components/dashboard/KalicomChatWidget').then(module => ({
    default: module.KalicomChatWidget
  }))
)

// Import sample data from a separate file instead of including it here
import { 
  prospectData, 
  callData, 
  ticketData, 
  chatMessages, 
  activitiesData, 
  weatherData 
} from '@/app/data/dashboardData';

// Custom loading component for better UX
const SectionSkeleton = ({ height = "h-64", title = true }) => (
  <div className="bg-white/80 rounded-xl shadow-md border border-gray-100 animate-pulse">
    {title && (
      <div className="p-4 border-b border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    )}
    <div className={`${height} p-6`}>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const AuthSuccessNotification: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
  >
    <FiCheckCircle className="w-6 h-6 text-green-600" />
    <div>
      <h3 className="font-medium">Connexion Keyyo réussie!</h3>
      <p className="text-sm">Vous pouvez maintenant utiliser le poste de travail téléphonique.</p>
    </div>
    <button
      onClick={onClose}
      className="ml-4 bg-green-200 hover:bg-green-300 text-green-800 px-3 py-1 rounded-lg text-sm"
    >
      Fermer
    </button>
  </motion.div>
);

// Main Dashboard component
export default function AccueilDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [darkMode, setDarkMode] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  
  const searchParams = useSearchParams();
  // Process Keyyo OAuth callback
  useEffect(() => {
    const processKeyyoCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      
      if (error) {
        console.error('OAuth error:', error);
        setAuthError(`Erreur d'authentification: ${error}`);
        return;
      }
      
      if (code && !isProcessingAuth) {
        setIsProcessingAuth(true);
        
        try {
          console.log('Processing authorization code...');
          
          // Exchange code for access token
          const tokenResponse = await fetch('https://api.keyyo.com/oauth2/token.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
              client_id: '67e1f96262f4c',
              client_secret: 'b9b83284780d5463fa1a1ff2',
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: 'https://kalicom.vercel.app/dashboard/acceuil'
            })
          });
          
          const tokenData = await tokenResponse.json();
          
          if (tokenData.error) {
            console.error('Token error:', tokenData.error);
            setAuthError(`Erreur d'authentification: ${tokenData.error}`);
            setIsProcessingAuth(false);
            return;
          }
          
          // In a production app, you would need to make an additional API call to get the CSI token
          // For now, we'll just use the access token (in a real app, replace this with proper CSI token retrieval)
          localStorage.setItem('keyyoCSIToken', tokenData.access_token);
          localStorage.setItem('keyyoAuthDate', new Date().toISOString());
          
          // Show success notification
          setAuthSuccess(true);
          
          // Auto-dismiss after 5 seconds
          setTimeout(() => {
            setAuthSuccess(false);
          }, 5000);
          
        } catch (err) {
          console.error('Auth processing error:', err);
          setAuthError(`Erreur de traitement: ${err instanceof Error ? err.message : 'Une erreur inconnue s\'est produite'}`);
        } finally {
          setIsProcessingAuth(false);
        }
      }
    };
    
    processKeyyoCallback();
  }, [searchParams, isProcessingAuth]);
  
  // Calculate summary statistics - consider moving this logic to a custom hook
  const totalCalls = callData.reduce((sum, item) => sum + item.appels, 0);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status !== 'Résolu').length;
  const totalProspects = prospectData.reduce((acc, item) => acc + item.prospects, 0);
  const unreadMessages = chatMessages.filter(m => m.unread).length;

  // Optimize expensive calculations with useMemo if they're not changing often
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`pt-20 min-h-screen pb-10 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50/50 text-gray-800'
      }`}
    >
      {/* Auth success notification */}
      {authSuccess && (
        <AuthSuccessNotification onClose={() => setAuthSuccess(false)} />
      )}

      {/* Auth error notification */}
      {authError && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-6 py-4 rounded-xl shadow-lg z-50">
          <p>{authError}</p>
          <button 
            onClick={() => setAuthError(null)}
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 px-3 py-1 rounded-lg text-sm"
          >
            Fermer
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6">
        {/* Dashboard Header - use error boundary with fallback */}
        <ErrorBoundary fallback={<div className="p-6 bg-white rounded-xl shadow">Failed to load dashboard header</div>}>
          <Suspense fallback={<SectionSkeleton height="h-32" />}>
            <DashboardHeader 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              totalProspects={totalProspects}
              totalTickets={totalTickets}
              openTickets={openTickets}
              chatMessagesCount={chatMessages.length}
              unreadMessages={unreadMessages}
              lastClientCount={prospectData[prospectData.length-1].clients}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Action rapide section */}
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
          <FiGrid className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          Action Rapide
        </h2>

        {/* Quick Action Section */}
        <ErrorBoundary>
          <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-xl shadow h-24 animate-pulse"></div>
            ))}
          </div>}>
            <QuickActionSection 
              darkMode={darkMode} 
              unreadMessages={unreadMessages} 
              openTickets={openTickets}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Top Row: Performance & Global Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Analytics */}
          <ErrorBoundary fallback={<SectionSkeleton height="h-96" />}>
            <Suspense fallback={<SectionSkeleton height="h-96" />}>
              <div className="lg:col-span-2">
                <PerformanceAnalyticsSection 
                  darkMode={darkMode} 
                  timeRange={timeRange} 
                  setTimeRange={setTimeRange}
                  prospectData={prospectData}
                  totalCalls={totalCalls}
                />
              </div>
            </Suspense>
          </ErrorBoundary>
          
          {/* Split into 2 cards: Weather and Activity Feed */}
          <div className="flex flex-col gap-6">
            {/* Weather Widget */}
            <ErrorBoundary>
              <Suspense fallback={<div className="h-40 bg-white/80 rounded-xl shadow animate-pulse"></div>}>
                <div className="w-full max-w-sm">
                  <WeatherWidget 
                    data={weatherData} 
                    darkMode={darkMode} 
                    onRefresh={() => console.log('Refreshing weather data')}
                  />
                </div>
              </Suspense>
            </ErrorBoundary>

            {/* Activity Feed */}
            <ErrorBoundary>
              <Suspense fallback={<SectionSkeleton height="h-64" />}>
                <ActivityFeedSection 
                  darkMode={darkMode} 
                  activitiesData={activitiesData} 
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        {/* Middle Row: Support Tickets and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets SAV Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton height="h-96" />}>
              <TicketsSAVSection 
                darkMode={darkMode}
                ticketData={ticketData}
                totalTickets={totalTickets}
                openTickets={openTickets}
              />
            </Suspense>
          </ErrorBoundary>

          {/* System Status Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton height="h-96" />}>
              <SystemStatusSection 
                darkMode={darkMode}
                callData={callData}
              />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Bottom Row: Events and Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton height="h-96" />}>
              <EventsSection darkMode={darkMode} />
            </Suspense>
          </ErrorBoundary>

          {/* Chat Section */}
          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton height="h-96" />}>
              <ChatSection darkMode={darkMode} chatMessages={chatMessages} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Add Kalicom Chat Widget */}
      <ErrorBoundary>
        <Suspense fallback={<div className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-indigo-100 animate-pulse"></div>}>
          <KalicomChatWidget />
        </Suspense>
      </ErrorBoundary>
    </motion.div>
  );
}
