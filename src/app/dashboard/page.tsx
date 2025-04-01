'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPhoneCall,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPhone,
  FiPhoneMissed,
  FiClock, 
  FiPauseCircle,
  FiUsers,
  // FiRefreshCw
} from 'react-icons/fi';
// import { FiPieChart } from './components/IconComponents';
import { callData, timePeriods } from './pbx/helpers/data';
import { CallData, ChartClickData, ActiveCall } from './pbx/models/type';

// Lazy loaded components
const DashboardHeader = lazy(() => import('./pbx/components/DashboardHeader'));
const DashboardCard = lazy(() => import('./pbx/components/DashboardCard'));
const DetailModal = lazy(() => import('./pbx/components/DetailModal'));
const CallPerformanceChart = lazy(() => import('./pbx/components/CallPerformanceChart'));
const SystemHealthPanel = lazy(() => import('./pbx/components/SystemHealthPanel'));
const ActiveCallsList = lazy(() => import('./pbx/components/ActiveCallsList'));
const EnhancedGeographicMap = lazy(() => import('./EnhancedGeographicMap'));
const KalicomChatWidget = lazy(() => import('../components/dashboard/KalicomChatWidget').then(module => ({ default: module.KalicomChatWidget })));

// Loading fallbacks
const CardSkeleton = () => (
  <div className="bg-gray-100 animate-pulse rounded-xl h-80 w-full"></div>
);

const ChartSkeleton = () => (
  <div className="bg-gray-100 animate-pulse rounded-xl h-[500px] w-full"></div>
);

export default function PBXDashboard() {
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [filteredData, setFilteredData] = useState<CallData[]>(callData);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState<CallData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Sample data for active calls
  const [activeCalls] = useState<ActiveCall[]>([
    { 
      id: 1, 
      number: '+33 6 12 34 56 78', 
      duration: '00:02:45', 
      status: 'answered', 
      location: 'Paris', 
      staff: 'John Doe',
      direction: 'incoming'
    },
    { 
      id: 2, 
      number: '+1 212 555 0199', 
      duration: '00:01:23', 
      status: 'ringing', 
      location: 'New York', 
      staff: 'Jane Smith',
      direction: 'outgoing'
    },
    { 
      id: 3, 
      number: '+49 30 12345678', 
      duration: '00:04:12', 
      status: 'onHold', 
      location: 'Berlin', 
      staff: 'Carlos Garcia',
      direction: 'outgoing'
    },
    { 
      id: 4, 
      number: '+33 1 23 45 67 89', 
      duration: '00:03:17', 
      status: 'internal', 
      location: 'Lyon', 
      staff: 'Marie Dupont',
      direction: 'internal'
    },
  ]);

  // Calculate statistics
  const totalCalls = filteredData.reduce((sum, item) => sum + item.appels, 0);
  const totalEntrants = filteredData.reduce((sum, item) => sum + (item.entrants || 0), 0);
  const totalSortants = filteredData.reduce((sum, item) => sum + (item.sortants || 0), 0);
  const totalInternes = filteredData.reduce((sum, item) => sum + (item.internes || 0), 0);
  const totalManques = filteredData.reduce((sum, item) => sum + (item.manques || 0), 0);
  
  const totalDuration = filteredData
    .reduce((sum, item) => sum + item.duree * item.appels, 0)
    .toFixed(0);
    
  const avgIncomingDuration = totalEntrants > 0 
    ? (filteredData.reduce((sum, item) => sum + item.duree * (item.entrants || 0), 0) / totalEntrants).toFixed(1) 
    : "0";
    
  const avgOutgoingDuration = totalSortants > 0 
    ? (filteredData.reduce((sum, item) => sum + item.duree * (item.sortants || 0), 0) / totalSortants).toFixed(1) 
    : "0";
  
  // Active calls stats
  const activeIncoming = activeCalls.filter(call => call.direction === 'incoming').length;
  const activeOutgoing = activeCalls.filter(call => call.direction === 'outgoing').length;
  const activeOnHold = activeCalls.filter(call => call.status === 'onHold').length;
  const activeInternal = activeCalls.filter(call => call.direction === 'internal').length;

  // Refresh handler with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      // Re-filter based on selected period
      setFilteredData([...callData]);
      setIsRefreshing(false);
    }, 1200);
  };

  useEffect(() => {
    // Filter data based on the selected period
    // This is a simulation - in a real app, you'd have different data for each period
    setFilteredData(callData);
  }, [selectedPeriod]);

  const handleDataPointClick = (data: ChartClickData) => {
    if (data.activePayload && data.activePayload.length > 0) {
      setSelectedCallData(data.activePayload[0].payload);
      setIsDetailOpen(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-20 min-h-screen pb-10 bg-gray-50/50"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6">
        {/* Dashboard Header */}
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-2xl"></div>}>
          <DashboardHeader 
            title="Tableau de Bord PBX"
            description="Surveillance avancée de votre infrastructure téléphonique. Visualisez les performances en temps réel et optimisez vos services."
            stats={{
              totalCalls,
              responseRate: Math.round(((totalCalls - totalManques) / totalCalls) * 100),
              avgTime: `${(Number(totalDuration) / totalCalls).toFixed(1)} min`,
              activity: "Élevée"
            }}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        </Suspense>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Nombre d'appels */}
          <Suspense fallback={<CardSkeleton />}>
            <DashboardCard
              title="Nombre d'appels"
              description="Nombre total d'appels"
              value={totalCalls}
              icon={<FiPhoneCall className="w-6 h-6 text-[#004AC8]" />}
              trend="+12.4%"
              type="calls"
              circles={[
                {
                  label: "Entrants",
                  value: totalEntrants,
                  color: "#3B82F6",
                  icon: <FiPhoneIncoming />,
                  isActionable: true,
                  percentage: (totalEntrants / totalCalls) * 100
                },
                {
                  label: "Sortants",
                  value: totalSortants,
                  color: "#10B981",
                  icon: <FiPhoneOutgoing />,
                  isActionable: true,
                  percentage: (totalSortants / totalCalls) * 100
                },
                {
                  label: "Internes",
                  value: totalInternes,
                  color: "#8B5CF6",
                  icon: <FiPhone />,
                  isActionable: true,
                  percentage: (totalInternes / totalCalls) * 100
                },
                {
                  label: "Manqué",
                  value: totalManques,
                  color: "#EF4444",
                  icon: <FiPhoneMissed />,
                  isActionable: true,
                  percentage: (totalManques / totalCalls) * 100
                }
              ]}
            />
          </Suspense>

          {/* 2. Durée d'appels */}
          <Suspense fallback={<CardSkeleton />}>
            <DashboardCard
              title="Durée d'appels"
              description="Durée totale d'appels"
              value={`${totalDuration} min`}
              icon={<FiClock className="w-6 h-6 text-[#1B0353]" />}
              trend="+5.7%"
              type="duration"
              circles={[
                {
                  label: "Moy. Entrants",
                  value: `${avgIncomingDuration} min`,
                  color: "#3B82F6",
                  icon: <FiPhoneIncoming />,
                  percentage: (Number(avgIncomingDuration) / 10) * 100
                },
                {
                  label: "Moy. Sortants",
                  value: `${avgOutgoingDuration} min`,
                  color: "#10B981",
                  icon: <FiPhoneOutgoing />,
                  percentage: (Number(avgOutgoingDuration) / 10) * 100
                }
              ]}
            />
          </Suspense>

          {/* 3. Direct (Appels en cours) */}
          <Suspense fallback={<CardSkeleton />}>
            <DashboardCard
              title="Direct"
              description="Appels en cours"
              value={activeCalls.length}
              icon={<FiUsers className="w-6 h-6 text-[#004AC8]" />}
              trend="Stable"
              type="direct"
              circles={[
                {
                  label: "Entrants",
                  value: activeIncoming,
                  color: "#3B82F6",
                  icon: <FiPhoneIncoming />
                },
                {
                  label: "Sortants",
                  value: activeOutgoing,
                  color: "#10B981",
                  icon: <FiPhoneOutgoing />
                },
                {
                  label: "En attente",
                  value: activeOnHold,
                  color: "#F59E0B",
                  icon: <FiPauseCircle />
                },
                {
                  label: "Internes",
                  value: activeInternal,
                  color: "#8B5CF6",
                  icon: <FiPhone />
                }
              ]}
            />
          </Suspense>
        </div>

        {/* Enhanced Geographic Map */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-xl"></div>}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <EnhancedGeographicMap />
          </motion.div>
        </Suspense>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Call Performance Chart */}
          <Suspense fallback={<ChartSkeleton />}>
            <CallPerformanceChart 
              data={filteredData}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              onDataPointClick={handleDataPointClick}
              timePeriods={timePeriods}
            />
          </Suspense>

          {/* System Health Panel */}
          <Suspense fallback={<ChartSkeleton />}>
            <SystemHealthPanel />
          </Suspense>
        </div>

        {/* Active Calls List */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-xl"></div>}>
          <ActiveCallsList 
            calls={activeCalls} 
            onRefresh={handleRefresh} 
          />
        </Suspense>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && (
          <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 animate-pulse w-1/2 h-1/2"></div>
          </div>}>
            <DetailModal 
              isOpen={isDetailOpen} 
              onClose={() => setIsDetailOpen(false)} 
              callData={selectedCallData} 
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
        <KalicomChatWidget />
      </Suspense>
    </motion.div>
  );
}