'use client';

import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';

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

// Main Dashboard component
export default function AccueilDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [darkMode, setDarkMode] = useState(false);
  
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
