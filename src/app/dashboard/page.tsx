// app/dashboard/pbx/tableau-de-bord/page.tsx
'use client';

import { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  // Legend,
  AreaChart,
  Area,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhoneCall,
  FiUsers,
  FiServer,
  FiSettings,
  FiGlobe,
  FiActivity,
  FiClock,
  FiPhoneForwarded,
  // FiCalendar,
  FiFilter,
  FiArrowRight,
  FiMousePointer,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import 'mapbox-gl/dist/mapbox-gl.css';
import EnhancedGeographicMap from "./EnhancedGeographicMap"
import { Cell } from 'recharts';

// -------------------------------------------------------------------
// Other interfaces
interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend: string;
  chart: ReactNode;
}

// Extend the ActiveCall interface to include a "staff" property.
interface ActiveCall {
  id: number;
  number: string;
  duration: string;
  status: 'answered' | 'ringing' | 'onHold' | string;
  location: string;
  staff: string; // New property for staff info
}

interface SystemHealthIndicatorProps {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
  suffix?: string;
}

interface CallData {
  date: string;
  heure: string;
  appels: number;
  duree: number;
  taux: number;
}

interface ActiveCall {
  id: number;
  number: string;
  duration: string;
  status: 'answered' | 'ringing' | 'onHold' | string;
  location: string;
}

interface ChartClickData {
  activePayload?: { payload: CallData }[];
}

// interface CallLocation {
//   name: string;
//   coordinates: number[];
//   calls: number;
//   radius: number;
// }

interface TimePeriod {
  id: string;
  label: string;
}

// -------------------------------------------------------------------
// Define constants with explicit types
const callData: CallData[] = [
  { date: '2025-02-20', heure: '08:00', appels: 45, duree: 4.2, taux: 92 },
  { date: '2025-02-20', heure: '10:00', appels: 78, duree: 3.8, taux: 89 },
  // ... more data if needed
];

// const callLocations: CallLocation[] = [
//   { name: 'Paris', coordinates: [2.3522, 48.8566], calls: 1560, radius: 18 },
//   { name: 'New York', coordinates: [-74.0060, 40.7128], calls: 1250, radius: 16 },
//   { name: 'London', coordinates: [-0.1278, 51.5074], calls: 980, radius: 15 },
//   { name: 'Berlin', coordinates: [13.4050, 52.5200], calls: 890, radius: 14 },
//   { name: 'Tokyo', coordinates: [139.6917, 35.6895], calls: 670, radius: 13 },
//   { name: 'Sydney', coordinates: [151.2093, -33.8688], calls: 540, radius: 12 },
//   { name: 'São Paulo', coordinates: [-46.6333, -23.5505], calls: 480, radius: 11 },
//   { name: 'Mumbai', coordinates: [72.8777, 19.0760], calls: 420, radius: 10 },
//   { name: 'Dubai', coordinates: [55.2708, 25.2048], calls: 390, radius: 9 },
//   { name: 'Toronto', coordinates: [-79.3832, 43.6532], calls: 350, radius: 8 },
// ];

const timePeriods: TimePeriod[] = [
  { id: 'day', label: 'Jour' },
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
];

const MotionCell = motion(Cell);

// -------------------------------------------------------------------
// Dashboard Card component
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, chart }) => (
  <div className="bg-white p-4 rounded-xl shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className={`text-xs ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </div>
      </div>
      <div>{icon}</div>
    </div>
    <div className="mt-4 h-20">{chart}</div>
  </div>
);

// System Health Indicator component
const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  label,
  value,
  color,
  icon,
  suffix = '',
}) => (
  <div className="flex items-center">
    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm">{label}</div>
      <div className="text-lg font-bold">
        {value}
        {suffix}
      </div>
    </div>
  </div>
);

export default function PBXDashboard() {
  const router = useRouter();
  // Only the state value is needed (setter removed)
  // Update the initial activeCalls state with staff information.
const [activeCalls] = useState<ActiveCall[]>([
  { id: 1, number: '+33 6 12 34 56 78', duration: '00:02:45', status: 'answered', location: 'Paris', staff: 'John Doe' },
  { id: 2, number: '+1 212 555 0199', duration: '00:01:23', status: 'ringing', location: 'New York', staff: 'Jane Smith' },
  { id: 3, number: '+49 30 12345678', duration: '00:04:12', status: 'onHold', location: 'Berlin', staff: 'Carlos Garcia' },
]);

  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [filteredData, setFilteredData] = useState<CallData[]>(callData);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState<CallData | null>(null);
  // const [, setMapZoom] = useState(1);
  // const [, setMapCenter] = useState<number[]>([0, 0]);

  const totalCalls = callData.reduce((sum: number, item: CallData) => sum + item.appels, 0);
  const totalDuration = callData
    .reduce((sum: number, item: CallData) => sum + item.duree * item.appels, 0)
    .toFixed(0);

  useEffect(() => {
    // In a real app, filter based on the selected period.
    setFilteredData(callData);
  }, [selectedPeriod]);

  const handleDataPointClick = (data: ChartClickData) => {
    if (data.activePayload && data.activePayload.length > 0) {
      setSelectedCallData(data.activePayload[0].payload);
      setIsDetailOpen(true);
    }
  };

  // const handleResetMap = () => {
  //   setMapZoom(1);
  //   setMapCenter([0, 0]);
  // };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Premium Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-2xl">
          <div>
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-[#1B0353] drop-shadow-md"
            >
              Tableau de Bord PBX
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Surveillance avancée de votre infrastructure t&eacute;l&eacute;phonique
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div
              className="flex items-center space-x-3 px-5 py-3 rounded-xl"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(75,178,246,0.2), rgba(0,74,200,0.2))',
              }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#004AC8' }} />
              <span className="text-sm font-semibold text-[#1B0353]">Syst&egrave;me optimal</span>
            </div>
            <button className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
              <FiSettings className="w-6 h-6 text-[#64748b]" />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Appels Actifs"
            value={activeCalls.length}
            icon={<FiPhoneCall className="w-6 h-6 text-[#004AC8]" />}
            trend="+8.3%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={filteredData.slice(-8)}>
                  <defs>
                    <linearGradient id="activeCallsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004AC8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#004AC8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="appels"
                    stroke="#004AC8"
                    strokeWidth={2}
                    fill="url(#activeCallsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="Nombre d'appels"
            value={totalCalls}
            icon={<FiPhoneForwarded className="w-6 h-6 text-[#4BB2F6]" />}
            trend="+12.4%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={filteredData.slice(-6)}>
                  <Bar dataKey="appels" fill="#1B0353" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="Dur&eacute;e d'appels"
            value={`${totalDuration} min`}
            icon={<FiClock className="w-6 h-6 text-[#1B0353]" />}
            trend="+5.7%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={filteredData.slice(-6)}>
                  <Line
                    type="monotone"
                    dataKey="duree"
                    stroke="#4BB2F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="Direct"
            value={activeCalls.filter((call) => call.status === 'answered').length}
            icon={<FiUsers className="w-6 h-6 text-[#004AC8]" />}
            trend="Stable"
            chart={
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(75,178,246,0.2)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,74,200,0.3)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                        style={{ backgroundColor: '#1B0353' }}
                      >
                        <span className="text-lg font-bold text-white">
                          {activeCalls.filter((call) => call.status === 'answered').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>

        {/* Enhanced Geographic Map */}
        <EnhancedGeographicMap />

        {/* Enhanced Analytics with Filtering */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
         {/* Enhanced Call Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative bg-white p-6 rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/5 to-[#4BB2F6]/5 opacity-30 pointer-events-none" />
            
            {/* Header with Enhanced Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#1B0353] mb-1">Performance des Appels</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FiActivity className="w-4 h-4" />
                  Données en temps réel
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl flex border border-gray-200">
                  {timePeriods.map((period) => (
                    <motion.button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
                        selectedPeriod === period.id
                          ? 'bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-200/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {selectedPeriod === period.id && (
                        <motion.div
                          layoutId="periodBg"
                          className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#004AC8] to-[#4BB2F6]"
                          transition={{ type: 'spring', bounce: 0.2 }}
                        />
                      )}
                      <span className="relative z-10">{period.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                <motion.button 
                  whileHover={{ rotate: -15 }}
                  className="p-2 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/50 rounded-xl border border-gray-200 transition-colors"
                >
                  <FiFilter className="w-5 h-5 text-[#004AC8]" />
                </motion.button>
              </div>
            </div>

            {/* Enhanced Chart Container */}
            <div className="h-[420px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  onClick={handleDataPointClick}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    vertical={false}
                  />
                  
                  <XAxis
                    dataKey="heure"
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: 'transparent' }}
                    tickMargin={12}
                  />
                  
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={{ stroke: 'transparent' }}
                  />
                  
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={{ stroke: 'transparent' }}
                  />
                  
                  <Tooltip
                    cursor={false}
                    content={({ payload }) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-100"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FiClock className="w-4 h-4 text-[#004AC8]" />
                            <strong className="text-gray-800">{payload?.[0]?.payload.heure}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#1B0353] rounded-full" />
                            <span className="text-sm">Appels: {payload?.[0]?.value}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#4BB2F6] rounded-full" />
                            <span className="text-sm">Taux: {payload?.[1]?.value}%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  />
                  
                  <Bar
                    name="Nombre d'appels"
                    dataKey="appels"
                    yAxisId="left"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={24}
                  >
                    {filteredData.map((_, index) => (
                      <MotionCell
                        key={`bar-${index}`}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                      />
                    ))}
                  </Bar>
                  
                  <Line
                    name="Taux de réponse"
                    type="monotone"
                    dataKey="taux"
                    yAxisId="right"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#fff', stroke: '#4BB2F6', strokeWidth: 2 }}
                    activeDot={{
                      r: 8,
                      fill: '#fff',
                      stroke: '#4BB2F6',
                      strokeWidth: 2,
                    }}
                  />
                  
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B0353" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#004AC8" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4BB2F6" />
                      <stop offset="100%" stopColor="#004AC8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Footer */}
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 cursor-pointer"
            >
              <FiMousePointer className="w-4 h-4 animate-pulse" />
              <span>Cliquez sur un point pour explorer les détails</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* System Health with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-3xl shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8] via-[#1B0353] to-[#4BB2F6]" />
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)]"
              style={{ backgroundSize: '20px 20px' }}
            />
            <div className="relative p-6 text-white">
              <h3 className="text-xl font-bold mb-8">Diagnostic Syst&egrave;me</h3>
              <div className="grid grid-cols-2 gap-6">
                <SystemHealthIndicator
                  label="Qualit&eacute; VoIP"
                  value={98.7}
                  color="#004AC8"
                  icon={<FiPhoneCall className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Charge Serveurs"
                  value={32}
                  color="#1B0353"
                  icon={<FiServer className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Stockage"
                  value={78}
                  color="#4BB2F6"
                  icon={<FiActivity className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Latence Moyenne"
                  value={28}
                  color="#4BB2F6"
                  icon={<FiGlobe className="w-5 h-5" />}
                  suffix="ms"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Calls List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-3xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">Appels en cours</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Num&eacute;ro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dur&eacute;e
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
                  {/* New Staff Column */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activeCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{call.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          call.status === 'answered'
                            ? 'bg-green-100 text-green-800'
                            : call.status === 'ringing'
                            ? 'bg-[#004AC8]/20 text-[#004AC8]'
                            : call.status === 'onHold'
                            ? 'bg-[#4BB2F6]/20 text-[#4BB2F6]'
                            : ''
                        }`}
                      >
                        {call.status === 'answered'
                          ? 'R&eacute;pondu'
                          : call.status === 'ringing'
                          ? 'Sonnerie'
                          : call.status === 'onHold'
                          ? 'En attente'
                          : call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {call.location}
                    </td>
                    {/* New column for staff info */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {call.staff}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => router.push(`/dashboard/pbx/call/${call.id}`)}
                        className="text-[#1B0353] hover:text-[#4BB2F6] font-medium"
                      >
                        D&eacute;tails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && selectedCallData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    D&eacute;tails des appels - {selectedCallData.heure}
                  </h3>
                  <p className="text-gray-500">Date: {selectedCallData.date}</p>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-400 hover:text-gray-500 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(75,178,246,0.2)' }}
                >
                  <div className="text-sm font-medium" style={{ color: '#004AC8' }}>
                    Nombre d&apos;appels
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#004AC8' }}>
                    {selectedCallData.appels}
                  </div>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(0,74,200,0.2)' }}
                >
                  <div className="text-sm font-medium" style={{ color: '#1B0353' }}>
                    Dur&eacute;e moyenne
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#1B0353' }}>
                    {selectedCallData.duree} min
                  </div>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'rgba(27,3,83,0.2)' }}
                >
                  <div className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                    Taux de r&eacute;ponse
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                    {selectedCallData.taux}%
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Graphique d&eacute;taill&eacute;</h4>
                <div className="h-64 border border-gray-200 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...Array(24)].map((_, i) => ({
                        time: `${String(i).padStart(2, '0')}:00`,
                        calls:
                          Math.floor(Math.random() * selectedCallData.appels * 0.3) + 1,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                          padding: '10px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="calls"
                        stroke="#004AC8"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#004AC8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
