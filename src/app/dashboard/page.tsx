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
  // LineChart,
  Line,
  CartesianGrid,
  // AreaChart,
  // Area,
  PieChart,
  Pie,
  Cell,
  // RadialBarChart,
  // RadialBar,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhoneCall,
  FiUsers,
  FiServer,
  FiSettings,
  // FiGlobe,
  FiActivity,
  FiClock,
  FiPhoneForwarded,
  FiFilter,
  FiArrowRight,
  FiMousePointer,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPhone,
  FiPhoneMissed,
  FiPauseCircle,
  FiRefreshCw,
  // FiInfo,
  FiArrowUp,
  FiArrowDown,
  // FiPlusCircle,
  // FiMinusCircle,
  // FiDownloadCloud,
  // FiAlertCircle,
  // FiBell,
  FiCalendar,
  FiMonitor,
  FiUserCheck,
  // FiLink,
  FiMaximize,
  FiCheckCircle,
  FiX,
  FiDownload,
  FiTrendingUp,
  FiZap,
  FiShield,
  FiWifi,
  FiCpu,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import 'mapbox-gl/dist/mapbox-gl.css';
import EnhancedGeographicMap from "./EnhancedGeographicMap";

// -------------------------------------------------------------------
// Other interfaces
interface DashboardCardProps {
  title: string;
  description: string;
  value: number | string;
  icon: ReactNode;
  trend: string;
  chart?: ReactNode;
  circles?: CircleItem[];
  type?: 'calls' | 'duration' | 'direct';
}

interface CircleItem {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
  isActionable?: boolean;
  percentage?: number;
}

// Extend the ActiveCall interface to include a "staff" property.
interface ActiveCall {
  id: number;
  number: string;
  duration: string;
  status: 'answered' | 'ringing' | 'onHold' | 'internal' | string;
  location: string;
  staff: string; // Staff info
  direction: 'incoming' | 'outgoing' | 'internal';
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
  entrants?: number;
  sortants?: number;
  internes?: number;
  manques?: number;
}

interface ChartClickData {
  activePayload?: { payload: CallData }[];
}

interface TimePeriod {
  id: string;
  label: string;
}

// -------------------------------------------------------------------
// Enhanced sample data
const callData: CallData[] = [
  { 
    date: '2025-02-20', 
    heure: '08:00', 
    appels: 45, 
    duree: 4.2, 
    taux: 92,
    entrants: 22,
    sortants: 15,
    internes: 5,
    manques: 3
  },
  { 
    date: '2025-02-20', 
    heure: '10:00', 
    appels: 78, 
    duree: 3.8, 
    taux: 89,
    entrants: 35,
    sortants: 28,
    internes: 10,
    manques: 5
  },
  { 
    date: '2025-02-20', 
    heure: '12:00', 
    appels: 62, 
    duree: 4.5, 
    taux: 91,
    entrants: 28,
    sortants: 24,
    internes: 7,
    manques: 3
  },
  { 
    date: '2025-02-20', 
    heure: '14:00', 
    appels: 85, 
    duree: 3.9, 
    taux: 94,
    entrants: 40,
    sortants: 32,
    internes: 9,
    manques: 4
  },
  { 
    date: '2025-02-20', 
    heure: '16:00', 
    appels: 93, 
    duree: 4.8, 
    taux: 90,
    entrants: 45,
    sortants: 35,
    internes: 8,
    manques: 5
  },
  { 
    date: '2025-02-20', 
    heure: '18:00', 
    appels: 55, 
    duree: 4.1, 
    taux: 88,
    entrants: 25,
    sortants: 20,
    internes: 6,
    manques: 4
  },
];

const timePeriods: TimePeriod[] = [
  { id: 'day', label: 'Jour' },
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
];

// Enhanced CircleStat component for interactive/non-interactive circles - ONLY ICONS
const CircleStat: React.FC<{
  item: CircleItem;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showLabel?: boolean;
}> = ({ item, size = 'md', onClick, showLabel = false }) => {
  // Size classes based on the size prop
  const sizeClasses = {
    sm: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    md: { container: 'w-20 h-20', icon: 'w-8 h-8' },
    lg: { container: 'w-24 h-24', icon: 'w-10 h-10' },
  };

  return (
    <motion.div
      whileHover={item.isActionable ? { scale: 1.08, rotate: 3 } : { scale: 1.05 }}
      whileTap={item.isActionable ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`relative ${sizeClasses[size].container} rounded-full flex flex-col items-center justify-center ${
        item.isActionable ? 'cursor-pointer shadow-md hover:shadow-xl' : 'shadow-sm'
      }`}
      style={{ 
        backgroundColor: `${item.color}15`, 
        border: `2px solid ${item.color}50`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* Progress circle if percentage is provided */}
      {item.percentage !== undefined && (
        <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={`gradient-${item.label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={`${item.color}`} />
              <stop offset="100%" stopColor={`${item.color}90`} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`${item.color}20`}
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`url(#gradient-${item.label})`}
            strokeWidth="6"
            strokeDasharray={`${item.percentage * 2.89} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`${sizeClasses[size].icon} text-gray-700 flex items-center justify-center`} style={{ color: item.color }}>
          {item.icon}
        </div>
        
        {showLabel && (
          <div className="absolute -bottom-8 text-xs font-medium text-gray-600 whitespace-nowrap">
            {item.label}: <span className="font-bold">{item.value}</span>
          </div>
        )}
      </div>
      
      {/* Glowing effect for actionable items */}
      {item.isActionable && (
        <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-all duration-300"></span>
      )}

      {/* Pulse animation for important metrics */}
      {item.label === 'Manqué' && item.percentage && item.percentage > 30 && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20 duration-1000" style={{ animationDuration: '3s' }}></span>
      )}
    </motion.div>
  );
};

// Enhanced Dashboard Card component for the 3 critical boxes
const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description,
  value, 
  icon, 
  trend, 
  chart,
  circles,
  type
}) => {
  const router = useRouter();
  
  // Function to handle click on actionable circles (for Nombre d'appels)
  const handleCircleClick = (label: string) => {
    if (type === 'calls') {
      // Redirect to journal-appels with filter parameter
      router.push(`/dashboard/pbx/journal-appels?filter=${label.toLowerCase()}`);
    }
  };

  // Render circles layout based on the type of card
  const renderCircles = () => {
    if (!circles) return null;
    
    // For the "calls" type, use a 2x2 grid layout
    if (type === 'calls') {
      return (
        <div className="relative pt-8 pb-6">
          <div className="grid grid-cols-2 gap-5">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat 
                  item={circle} 
                  onClick={() => circle.isActionable ? handleCircleClick(circle.label) : null}
                />
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added decorative element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gray-100 opacity-60"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-px bg-gray-100 opacity-60"></div>
        </div>
      );
    }
    
    // For "duration" type, use a 2x1 grid layout
    if (type === 'duration') {
      return (
        <div className="pt-8 pb-2">
          <div className="flex items-center justify-around">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat item={circle} />
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added decorative vertical line */}
          <div className="my-2 w-full h-px bg-gray-100"></div>
        </div>
      );
    }
    
    // For "direct" type, use a 2x2 grid layout
    if (type === 'direct') {
      return (
        <div className="relative pt-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat item={circle} size="sm" />
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added light grid background */}
          <div className="absolute inset-0 bg-gray-50 bg-opacity-30 rounded-lg -z-10"></div>
        </div>
      );
    }
    
    // Default fallback
    return (
      <div className="flex flex-wrap justify-center gap-5 py-4">
        {circles.map((circle, index) => (
          <div key={index} className="flex flex-col items-center">
            <CircleStat item={circle} />
            <div className="mt-3 text-xs font-medium text-gray-500">{circle.label}: <span className="font-bold">{circle.value}</span></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg shadow-sm" style={{ 
              background: `linear-gradient(135deg, ${icon ? '#004AC815' : '#f8fafc'}, ${icon ? '#004AC805' : '#f8fafc'})` 
            }}>
              {icon}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{title}</h4>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">{value}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
              trend.startsWith('+') 
                ? 'bg-green-100 text-green-700' 
                : trend === 'Stable' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-red-100 text-red-700'
            }`}>
              {trend.startsWith('+') ? <FiArrowUp className="w-3 h-3" /> : 
               trend === 'Stable' ? <FiActivity className="w-3 h-3" /> : 
               <FiArrowDown className="w-3 h-3" />}
              {trend}
            </span>
          </div>
        </div>
      </div>
      
      {/* Chart or circles with improved spacing */}
      <div className={`${circles ? 'mt-2' : 'mt-6'}`}>
        {circles ? renderCircles() : chart}
      </div>
      
      {/* Add subtle divider */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className="text-xs text-[#004AC8] font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          Plus de détails <FiArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// System Health Indicator component
const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  label,
  value,
  color,
  icon,
  suffix = '',
}) => (
  <motion.div 
    className="flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
    whileHover={{ y: -3, x: 2 }}
  >
    <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: `${color}30` }}>
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-lg font-bold">
        {value}
        {suffix}
      </div>
    </div>
  </motion.div>
);

export default function PBXDashboard() {
  const router = useRouter();
  
  // Time period state
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [filteredData, setFilteredData] = useState<CallData[]>(callData);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCallData, setSelectedCallData] = useState<CallData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Extended sample data for active calls
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
        {/* Enhanced Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 to-[#4BB2F6]/10 pointer-events-none"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#4BB2F6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          
          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(#004AC8 0.5px, transparent 0.5px), radial-gradient(#4BB2F6 0.5px, transparent 0.5px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          ></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <motion.div 
                  className="flex items-center gap-3 mb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <div className="p-3 bg-gradient-to-br from-[#004AC8]/20 to-[#004AC8]/10 rounded-xl shadow-md">
                    <FiMonitor className="w-7 h-7 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-bold text-[#1B0353] drop-shadow-sm">
                    Tableau de Bord PBX
                  </h1>
                </motion.div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Surveillance avancée de votre infrastructure téléphonique. Visualisez les performances en temps réel et optimisez vos services.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-xl border border-[#004AC8]/20 shadow-sm"
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Système optimal</span>
                </motion.div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 15 }}
                    whileTap={{ scale: 0.95, rotate: 30 }}
                    onClick={handleRefresh}
                    className={`p-3 rounded-xl transition-all shadow-md ${
                      isRefreshing 
                        ? 'bg-blue-100 text-blue-700 shadow-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    disabled={isRefreshing}
                  >
                    <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-md"
                  >
                    <FiSettings className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-blue-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiPhoneCall className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">Total appels</div>
                  <div className="text-xl font-bold text-gray-800">{totalCalls}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-green-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiPhoneIncoming className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">Taux de réponse</div>
                  <div className="text-xl font-bold text-gray-800">
                    {Math.round(((totalCalls - totalManques) / totalCalls) * 100)}%
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-purple-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiClock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Temps moyen</div>
                  <div className="text-xl font-bold text-gray-800">{(Number(totalDuration) / totalCalls).toFixed(1)} min</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-amber-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiActivity className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-amber-600 transition-colors">Activité du jour</div>
                  <div className="text-xl font-bold text-gray-800">
                    {isRefreshing ? (
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      "Élevée"
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Download/Export button */}
            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white/80 rounded-lg border border-gray-200 shadow-sm hover:bg-white hover:text-[#004AC8] transition-all"
              >
                <FiDownload className="w-3.5 h-3.5" />
                Exporter les données
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards - Focus on the 3 critical boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1. Nombre d'appels box with actionable circles */}
          <DashboardCard
            title="Nombre d'appels"
            description="Nombre total d'appels"
            value={totalCalls}
            icon={<FiPhoneForwarded className="w-6 h-6 text-[#004AC8]" />}
            trend="+12.4%"
            type="calls"
            circles={[
              {
                label: "Entrants",
                value: totalEntrants,
                color: "#3B82F6", // Blue
                icon: <FiPhoneIncoming />,
                isActionable: true,
                percentage: (totalEntrants / totalCalls) * 100
              },
              {
                label: "Sortants",
                value: totalSortants,
                color: "#10B981", // Green
                icon: <FiPhoneOutgoing />,
                isActionable: true,
                percentage: (totalSortants / totalCalls) * 100
              },
              {
                label: "Internes",
                value: totalInternes,
                color: "#8B5CF6", // Purple
                icon: <FiPhone />,
                isActionable: true,
                percentage: (totalInternes / totalCalls) * 100
              },
              {
                label: "Manqué",
                value: totalManques,
                color: "#EF4444", // Red
                icon: <FiPhoneMissed />,
                isActionable: true,
                percentage: (totalManques / totalCalls) * 100
              }
            ]}
          />

          {/* 2. Durée d'appels box with non-actionable circles */}
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
                color: "#3B82F6", // Blue
                icon: <FiPhoneIncoming />,
                percentage: (Number(avgIncomingDuration) / 10) * 100 // Assuming 10 min is max
              },
              {
                label: "Moy. Sortants",
                value: `${avgOutgoingDuration} min`,
                color: "#10B981", // Green
                icon: <FiPhoneOutgoing />,
                percentage: (Number(avgOutgoingDuration) / 10) * 100 // Assuming 10 min is max
              }
            ]}
          />

          {/* 3. Direct (Appels en cours) box with non-actionable circles */}
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
                color: "#3B82F6", // Blue
                icon: <FiPhoneIncoming />
              },
              {
                label: "Sortants",
                value: activeOutgoing,
                color: "#10B981", // Green
                icon: <FiPhoneOutgoing />
              },
              {
                label: "En attente",
                value: activeOnHold,
                color: "#F59E0B", // Amber
                icon: <FiPauseCircle />
              },
              {
                label: "Internes",
                value: activeInternal,
                color: "#8B5CF6", // Purple
                icon: <FiPhone />
              }
            ]}
          />
        </div>

        {/* Enhanced Geographic Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <EnhancedGeographicMap />
        </motion.div>

        {/* Enhanced Analytics with Filtering */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Enhanced Call Performance Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative bg-white p-6 rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/5 to-[#4BB2F6]/5 opacity-50 pointer-events-none" />
            
            {/* Subtle pattern overlay */}
            <div 
              className="absolute inset-0 opacity-5" 
              style={{ 
                backgroundImage: 'radial-gradient(#004AC8 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px'
              }}
            ></div>
            
            {/* Header with Enhanced Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#1B0353] mb-1">Performance des Appels</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FiActivity className="w-4 h-4" />
                  Données en temps réel
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl flex border border-gray-200 shadow-sm">
                  {timePeriods.map((period) => (
                    <motion.button
                      key={period.id}
                      onClick={() => setSelectedPeriod(period.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
                        selectedPeriod === period.id
                          ? 'text-white shadow-lg'
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
                  className="p-2 bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/50 rounded-xl border border-gray-200 transition-colors shadow-sm"
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
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B0353" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#004AC8" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4BB2F6" />
                      <stop offset="100%" stopColor="#004AC8" />
                    </linearGradient>
                    
                    {/* Add subtle shadow */}
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000010" />
                    </filter>
                  </defs>
                
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
                        className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100"
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
                    radius={[8, 8, 0, 0]}
                    barSize={24}
                    filter="url(#shadow)"
                  />
                  
                  <Line
                    name="Taux de réponse"
                    type="monotone"
                    dataKey="taux"
                    yAxisId="right"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#fff', stroke: '#4BB2F6', strokeWidth: 2 }}
                    activeDot={{
                      r: 8,
                      fill: '#fff',
                      stroke: '#4BB2F6',
                      strokeWidth: 2,
                      filter: "url(#shadow)"
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Footer */}
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 cursor-pointer"
            >
              <FiMousePointer className="w-4 h-4 animate-ping" style={{ animationDuration: '3s' }} />
              <span>Cliquez sur un point pour explorer les détails</span>
              <FiArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>

          {/* System Health with Gradient Background */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8] via-[#1B0353] to-[#4BB2F6]" />
            
            {/* Enhanced background effects */}
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)]"
              style={{ backgroundSize: '20px 20px' }}
            />
            
            <div className="absolute inset-0 overflow-hidden">
              <svg width="100%" height="100%" className="absolute opacity-5">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>
            
            <div className="relative p-6 text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/10 rounded-lg">
                    <FiServer className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Diagnostic Système</h3>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg shadow-black/10"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>Tous les services actifs</span>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <SystemHealthIndicator
                  label="Qualité VoIP"
                  value={98.7}
                  suffix="%"
                  color="#4BB2F6"
                  icon={<FiWifi className="w-5 h-5 text-white" />}
                />
                <SystemHealthIndicator
                  label="Charge Serveurs"
                  value={32}
                  suffix="%"
                  color="#ffffff"
                  icon={<FiCpu className="w-5 h-5 text-white" />}
                />
                <SystemHealthIndicator
                  label="Stockage"
                  value={78}
                  suffix="%"
                  color="#10B981"
                  icon={<FiServer className="w-5 h-5 text-white" />}
                />
                <SystemHealthIndicator
                  label="Latence Moyenne"
                  value={28}
                  suffix="ms"
                  color="#F59E0B"
                  icon={<FiZap className="w-5 h-5 text-white" />}
                />
              </div>
              
              {/* Event timeline */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <FiActivity className="w-4 h-4" />
                  Derniers événements système
                </h4>
                <div className="space-y-4">
                  {[
                    { time: '10:45', event: 'Mise à jour système réussie', icon: FiCheckCircle, color: 'bg-green-400' },
                    { time: '09:12', event: 'Pic de trafic détecté', icon: FiTrendingUp, color: 'bg-blue-400' },
                    { time: '08:30', event: 'Maintenance programmée', icon: FiCalendar, color: 'bg-amber-400' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 3 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className={`${item.color} p-2 rounded-full shrink-0 mt-0.5 shadow-lg shadow-black/10 group-hover:shadow-xl transition-all duration-300`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-white/70">{item.time}</div>
                        <div className="text-sm font-medium">{item.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Added: System security status */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 text-green-300" />
                    <span className="text-sm font-medium">Sécurité du système</span>
                  </div>
                  <span className="text-xs bg-green-400/20 px-2 py-1 rounded-full text-green-300">Protégé</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Calls List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiPhoneCall className="w-5 h-5 text-[#004AC8]" />
                </div>
                Appels en cours
              </h3>
              <p className="text-sm text-gray-500 mt-1 ml-9">Liste des appels actifs sur votre système</p>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors shadow-sm"
              >
                <FiMaximize className="w-4 h-4" />
                <span>Plein écran</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95, rotate: 30 }}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
              >
                <FiRefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localisation
                  </th>
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
                  <motion.tr 
                    key={call.id} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * call.id }}
                    whileHover={{ backgroundColor: '#f8fafc', scale: 1.005 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{call.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{call.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full shadow-sm ${
                          call.status === 'answered'
                            ? 'bg-green-100 text-green-800'
                            : call.status === 'ringing'
                            ? 'bg-blue-100 text-blue-800'
                            : call.status === 'onHold'
                            ? 'bg-amber-100 text-amber-800'
                            : call.status === 'internal'
                            ? 'bg-purple-100 text-purple-800'
                            : ''
                        }`}
                      >
                        {call.status === 'answered'
                          ? 'Répondu'
                          : call.status === 'ringing'
                          ? 'Sonnerie'
                          : call.status === 'onHold'
                          ? 'En attente'
                          : call.status === 'internal'
                          ? 'Interne'
                          : call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full shadow-sm ${
                          call.direction === 'incoming'
                            ? 'bg-blue-50 text-blue-700'
                            : call.direction === 'outgoing'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-purple-50 text-purple-700'
                        }`}
                      >
                        {call.direction === 'incoming' ? (
                          <><FiPhoneIncoming className="w-3 h-3" /> Entrant</>
                        ) : call.direction === 'outgoing' ? (
                          <><FiPhoneOutgoing className="w-3 h-3" /> Sortant</>
                        ) : (
                          <><FiPhone className="w-3 h-3" /> Interne</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {call.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <FiUserCheck className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        {call.staff}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <motion.button
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-2 text-[#004AC8] hover:text-[#4BB2F6] font-medium text-sm"
                        onClick={() => router.push(`/dashboard/pbx/call/${call.id}`)}
                      >
                        Détails
                        <FiArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Added export button */}
          <div className="flex justify-end mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white/80 rounded-lg border border-gray-200 shadow-sm hover:bg-white hover:text-[#004AC8] transition-all"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Exporter la liste
            </motion.button>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FiActivity className="w-5 h-5 text-[#004AC8]" />
                    </div>
                    Détails des appels - {selectedCallData.heure}
                  </h3>
                  <p className="text-gray-500 ml-9">Date: {selectedCallData.date}</p>
                </div>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm"
                >
                  <div className="text-sm font-medium text-blue-700">
                    Nombre d&apos;appels
                  </div>
                  <div className="text-2xl font-bold text-blue-700 mt-1 flex items-baseline gap-1">
                    {selectedCallData.appels}
                    <span className="text-xs font-normal text-blue-500">appels</span>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm"
                >
                  <div className="text-sm font-medium text-purple-700">
                    Durée moyenne
                  </div>
                  <div className="text-2xl font-bold text-purple-700 mt-1 flex items-baseline gap-1">
                    {selectedCallData.duree}
                    <span className="text-xs font-normal text-purple-500">min</span>
                  </div>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm"
                >
                  <div className="text-sm font-medium text-green-700">
                    Taux de réponse
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1 flex items-baseline gap-1">
                    {selectedCallData.taux}
                    <span className="text-xs font-normal text-green-500">%</span>
                  </div>
                </motion.div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiPieChart className="w-4 h-4 text-[#004AC8]" />
                  Répartition des appels
                </h4>
                <div className="h-64 border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feFlood floodColor="#00000010" result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="shadow" />
                          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                        </filter>
                      </defs>
                      <Pie
                        data={[
                          { name: 'Entrants', value: selectedCallData.entrants || 0, color: '#3B82F6' },
                          { name: 'Sortants', value: selectedCallData.sortants || 0, color: '#10B981' },
                          { name: 'Internes', value: selectedCallData.internes || 0, color: '#8B5CF6' },
                          { name: 'Manqués', value: selectedCallData.manques || 0, color: '#EF4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        filter="url(#glow)"
                        dataKey="value"
                      >
                        {[
                          { name: 'Entrants', value: selectedCallData.entrants || 0, color: '#3B82F6' },
                          { name: 'Sortants', value: selectedCallData.sortants || 0, color: '#10B981' },
                          { name: 'Internes', value: selectedCallData.internes || 0, color: '#8B5CF6' },
                          { name: 'Manqués', value: selectedCallData.manques || 0, color: '#EF4444' },
                        ].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color} 
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [
                          <span key="value" className="font-bold">{value} appels</span>, 
                          <span key="name" className="text-gray-600">{name}</span>
                        ]} 
                        itemStyle={{ padding: '4px 8px' }}
                        contentStyle={{ 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #e2e8f0',
                          padding: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#004AC8] bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  <FiDownload className="w-4 h-4" />
                  Télécharger le rapport
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// FiPieChart icon component (not imported in the component list)
const FiPieChart = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
    <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
  </svg>
);
