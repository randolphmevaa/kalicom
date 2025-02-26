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
  Legend,
  AreaChart,
  Area
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
  FiCalendar,
  FiFilter
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';

// type WithChildren<P = object> = P & { children?: ReactNode };

// -------------------------------------------------------------------
// Define a type for geography items (adjust properties as needed)
// type Geo = {
//   rsmKey: string;
//   [key: string]: unknown;
// };

// -------------------------------------------------------------------
// Define prop types for react-simple-maps components as type aliases
// type ComposableMapProps = WithChildren<{ width: number; height: number }>;

// type ZoomableGroupProps = WithChildren<{
//   zoom: number;
//   center: number[];
//   onMoveEnd: (params: { zoom: number; coordinates: number[] }) => void;
// }>;

// type GeographiesProps = WithChildren<{
//   geography: string;
//   children: (props: { geographies: Geo[] }) => ReactNode;
// }>;

// interface GeographyProps {
//   geography: unknown;
//   fill?: string;
//   stroke?: string;
//   style?: {
//     default: CSSProperties;
//     hover: CSSProperties;
//     pressed: CSSProperties;
//   };
// }

// type MarkerProps = WithChildren<{
//   coordinates: number[];
// }>;

// -------------------------------------------------------------------
// Dynamic imports with proper types (using ComponentType)
// const WorldMap = dynamic<React.ComponentType<ComposableMapProps>>(() =>
//   import('react-simple-maps').then(mod => mod.ComposableMap), { ssr: false }
// );

// const ZoomableGroup = dynamic<React.ComponentType<ZoomableGroupProps>>(() =>
//   import('react-simple-maps').then(mod => mod.ZoomableGroup), { ssr: false }
// );

// const Geographies = dynamic<React.ComponentType<GeographiesProps>>(() =>
//   import('react-simple-maps').then(mod => mod.Geographies), { ssr: false }
// );

// const Geography = dynamic<React.ComponentType<GeographyProps>>(() =>
//   import('react-simple-maps').then(mod => mod.Geography), { ssr: false }
// );

// const Marker = dynamic<React.ComponentType<MarkerProps>>(() =>
//   import('react-simple-maps').then(mod => mod.Marker), { ssr: false }
// );

// -------------------------------------------------------------------
// Other interfaces
interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend: string;
  chart: ReactNode;
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

interface CallLocation {
  name: string;
  coordinates: number[];
  calls: number;
  radius: number;
}

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

const callLocations: CallLocation[] = [
  { name: 'Paris', coordinates: [2.3522, 48.8566], calls: 1560, radius: 18 },
  { name: 'New York', coordinates: [-74.0060, 40.7128], calls: 1250, radius: 16 },
  { name: 'London', coordinates: [-0.1278, 51.5074], calls: 980, radius: 15 },
  { name: 'Berlin', coordinates: [13.4050, 52.5200], calls: 890, radius: 14 },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], calls: 670, radius: 13 },
  { name: 'Sydney', coordinates: [151.2093, -33.8688], calls: 540, radius: 12 },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505], calls: 480, radius: 11 },
  { name: 'Mumbai', coordinates: [72.8777, 19.0760], calls: 420, radius: 10 },
  { name: 'Dubai', coordinates: [55.2708, 25.2048], calls: 390, radius: 9 },
  { name: 'Toronto', coordinates: [-79.3832, 43.6532], calls: 350, radius: 8 },
];

const timePeriods: TimePeriod[] = [
  { id: 'day', label: 'Jour' },
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
];

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
const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ label, value, color, icon, suffix = '' }) => (
  <div className="flex items-center">
    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm">{label}</div>
      <div className="text-lg font-bold">
        {value}{suffix}
      </div>
    </div>
  </div>
);

export default function PBXDashboard() {
  const router = useRouter();
  // Only the state value is needed (setter removed)
  const [activeCalls] = useState<ActiveCall[]>([
    { id: 1, number: '+33 6 12 34 56 78', duration: '00:02:45', status: 'answered', location: 'Paris' },
    { id: 2, number: '+1 212 555 0199', duration: '00:01:23', status: 'ringing', location: 'New York' },
    { id: 3, number: '+49 30 12345678', duration: '00:04:12', status: 'onHold', location: 'Berlin' },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [filteredData, setFilteredData] = useState<CallData[]>(callData);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState<CallData | null>(null);
  const [ , setMapZoom] = useState(1);
  const [ , setMapCenter] = useState<number[]>([0, 0]);

  const totalCalls = callData.reduce((sum: number, item: CallData) => sum + item.appels, 0);
  const totalDuration = callData.reduce((sum: number, item: CallData) => sum + (item.duree * item.appels), 0).toFixed(0);

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

  const handleResetMap = () => {
    setMapZoom(1);
    setMapCenter([0, 0]);
  };

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
            <div className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-emerald-100 px-5 py-3 rounded-xl">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">Syst&egrave;me optimal</span>
            </div>
            <button className="p-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95">
              <FiSettings className="text-gray-700 w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Appels Actifs"
            value={activeCalls.length}
            icon={<FiPhoneCall className="w-6 h-6 text-blue-600" />}
            trend="+8.3%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={filteredData.slice(-8)}>
                  <defs>
                    <linearGradient id="activeCallsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="appels"
                    stroke="#3b82f6"
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
            icon={<FiPhoneForwarded className="w-6 h-6 text-violet-600" />}
            trend="+12.4%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={filteredData.slice(-6)}>
                  <Bar dataKey="appels" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="Dur&eacute;e d'appels"
            value={`${totalDuration} min`}
            icon={<FiClock className="w-6 h-6 text-amber-600" />}
            trend="+5.7%"
            chart={
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={filteredData.slice(-6)}>
                  <Line
                    type="monotone"
                    dataKey="duree"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <DashboardCard
            title="Direct"
            value={activeCalls.filter(call => call.status === 'answered').length}
            icon={<FiUsers className="w-6 h-6 text-emerald-600" />}
            trend="Stable"
            chart={
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-300 flex items-center justify-center animate-pulse">
                        <span className="text-lg font-bold text-emerald-700">
                          {activeCalls.filter(call => call.status === 'answered').length}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-xl mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">R&eacute;partition G&eacute;ographique</h3>
              <p className="text-sm text-gray-500">Visualisation en temps r&eacute;el des appels par localisation</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-blue-50 rounded-lg text-blue-700 text-sm font-medium">
                Total: {callLocations.reduce((sum: number, loc: CallLocation) => sum + loc.calls, 0)} appels
              </div>
              <button
                onClick={handleResetMap}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition"
              >
                R&eacute;initialiser
              </button>
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50">
            <div className="h-96">
              {/* <WorldMap width={900} height={500}>
                <ZoomableGroup
                  zoom={mapZoom}
                  center={mapCenter}
                  onMoveEnd={({ zoom, coordinates }: { zoom: number; coordinates: number[] }) => {
                    setMapZoom(zoom);
                    setMapCenter(coordinates);
                  }}
                >
                  <Geographies geography="/world-110m.json">
                    {({ geographies }: { geographies: Geo[] }) =>
                      geographies.map((geo: Geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#E5E7EB"
                          stroke="#D1D5DB"
                          style={{
                            default: { outline: 'none' },
                            hover: { fill: '#F3F4F6', outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {callLocations.map(({ name, coordinates, calls, radius }: CallLocation) => (
                    <Marker key={name} coordinates={coordinates}>
                      <circle
                        r={radius}
                        fill="#3b82f6"
                        fillOpacity={0.7}
                        stroke="#2563eb"
                        strokeWidth={1}
                      />
                      <circle
                        r={radius}
                        fill="transparent"
                        stroke="#93c5fd"
                        strokeWidth={2}
                        strokeOpacity={0.3}
                        className="animate-ping"
                      />
                      <text
                        textAnchor="middle"
                        y={-radius - 5}
                        style={{
                          fontFamily: 'system-ui',
                          fill: '#1e40af',
                          fontSize: 10,
                          fontWeight: 'bold'
                        }}
                      >
                        {name}
                      </text>
                      <text
                        textAnchor="middle"
                        y={-radius - 18}
                        style={{ fontFamily: 'system-ui', fill: '#3b82f6', fontSize: 8 }}
                      >
                        {calls} appels
                      </text>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </WorldMap> */}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Analytics with Filtering */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Performance des Appels</h3>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <div className="p-1 bg-gray-100 rounded-lg flex">
                  {timePeriods.map((period: TimePeriod) => (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        selectedPeriod === period.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <FiFilter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                  onClick={handleDataPointClick}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="heure"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      padding: '12px 16px',
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: '8px' }} />
                  <Bar
                    name="Nombre d'appels"
                    dataKey="appels"
                    yAxisId="left"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                    cursor="pointer"
                  />
                  <Line
                    name="Taux de r&eacute;ponse (%)"
                    type="monotone"
                    dataKey="taux"
                    yAxisId="right"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-4 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4 mr-1" />
              <span>Cliquez sur un point pour voir les d&eacute;tails</span>
            </div>
          </motion.div>

          {/* System Health with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative overflow-hidden rounded-3xl shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
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
                  color="#22d3ee"
                  icon={<FiPhoneCall className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Charge Serveurs"
                  value={32}
                  color="#a5b4fc"
                  icon={<FiServer className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Stockage"
                  value={78}
                  color="#fbbf24"
                  icon={<FiActivity className="w-5 h-5" />}
                />
                <SystemHealthIndicator
                  label="Latence Moyenne"
                  value={28}
                  color="#c4b5fd"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num&eacute;ro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dur&eacute;e</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {activeCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{call.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          call.status === 'answered'
                            ? 'bg-green-100 text-green-800'
                            : call.status === 'ringing'
                            ? 'bg-blue-100 text-blue-800'
                            : call.status === 'onHold'
                            ? 'bg-amber-100 text-amber-800'
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => router.push(`/dashboard/pbx/call/${call.id}`)}
                        className="text-[#1B0353] hover:text-[#a0c8f0] font-medium"
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
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-blue-800 text-sm font-medium mb-1">Nombre d&apos;appels</div>
                  <div className="text-2xl font-bold text-blue-700">{selectedCallData.appels}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl">
                  <div className="text-amber-800 text-sm font-medium mb-1">Dur&eacute;e moyenne</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {selectedCallData.duree} min
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <div className="text-emerald-800 text-sm font-medium mb-1">Taux de r&eacute;ponse</div>
                  <div className="text-2xl font-bold text-emerald-700">
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
                        calls: Math.floor(Math.random() * selectedCallData.appels * 0.3) + 1,
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
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#3b82f6' }}
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
