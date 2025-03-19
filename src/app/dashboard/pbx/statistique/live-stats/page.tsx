'use client';

import { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import {
  FiEye,
  FiHome,
  FiChevronRight,
  FiRefreshCw,
  // FiDownload,
  FiInfo,
  FiActivity,
  FiPhone,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  // FiPhoneCall,
  FiClock,
  FiAlertCircle,
  FiPieChart,
  FiRadio,
  FiZap,
  FiUsers,
  FiPause,
  FiPlay,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  // BarChart, 
  // Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Define types for the data structures
interface ChartDataItem {
  time: string;
  entrants: number;
  sortants: number;
  internes: number;
  enAttente: number;
}

interface CallItem {
  id: number;
  extension: string;
  user: string;
  number: string;
  contact: string | null;
  type: 'incoming' | 'outgoing' | 'internal';
  duration: string;
  status: 'active' | 'hold' | 'problem';
}

// Shimmer loading effect component
interface ShimmerProps {
  className: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] ${className}`}></div>
);

// Enhanced Breadcrumbs component
interface BreadcrumbsProps {
  items: (string | ReactElement)[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center text-sm text-gray-600 mb-6 overflow-x-auto whitespace-nowrap pb-1"
  >
    <Link href="/dashboard" className="hover:text-[#004AC8] transition-colors">
      <FiHome className="mr-2 text-gray-500" />
    </Link>
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        <FiChevronRight className="mx-2 text-gray-400" />
        {index === items.length - 1 ? (
          <span className="text-[#004AC8] font-medium">{item}</span>
        ) : (
          <Link 
            href={index === 0 ? "/dashboard" : "/dashboard/pbx/statistique"}
            className="hover:text-[#004AC8] transition-colors"
          >
            {item}
          </Link>
        )}
      </div>
    ))}
  </motion.div>
);

// Enhanced Tooltip Component for Charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    value: string | number;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            <span className="font-bold">{entry.value}</span> {entry.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Pulsing Live Indicator Component
const LiveIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <span className="flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>
      <span className="text-xs font-medium text-red-600">LIVE</span>
    </div>
  );
};

// Last Updated Time Component
interface LastUpdatedProps {
  timestamp: Date;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
      let interval = seconds;
      let unit = 'seconde';
      
      if (seconds >= 60) {
        interval = Math.floor(seconds / 60);
        unit = 'minute';
      }
      
      setTimeAgo(`il y a ${interval} ${unit}${interval !== 1 ? 's' : ''}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timestamp]);
  
  return (
    <span className="text-xs text-gray-500">
      Mis à jour {timeAgo}
    </span>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{className?: string}>;
  change?: number;
  theme: 'red' | 'blue' | 'green' | 'orange';
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, theme, isLoading }) => {
  type ThemeStyles = {
    [key: string]: {
      bg: string;
      iconBg: string;
      iconColor: string;
      text: string;
      border: string;
      upText: string;
      downText: string;
    }
  };

  const themeStyles: ThemeStyles = {
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-700',
      border: 'border-red-100',
      upText: 'text-green-600',
      downText: 'text-red-600'
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-100',
      upText: 'text-green-600',
      downText: 'text-red-600'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      text: 'text-green-700',
      border: 'border-green-100',
      upText: 'text-green-600',
      downText: 'text-red-600'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      text: 'text-orange-700',
      border: 'border-orange-100',
      upText: 'text-green-600',
      downText: 'text-red-600'
    }
  };
  
  const style = themeStyles[theme] || themeStyles.red;
  const isPositive = change !== undefined && change > 0;
  
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`${style.bg} rounded-xl border ${style.border} shadow-sm p-4`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-lg ${style.iconBg}`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        {change !== undefined && (
          <div className={`text-xs flex items-center ${isPositive ? style.upText : style.downText}`}>
            {isPositive ? <FiArrowUp className="mr-0.5 w-3 h-3" /> : <FiArrowDown className="mr-0.5 w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-gray-500 text-sm">{title}</p>
        {isLoading ? (
          <Shimmer className="h-7 w-2/3 rounded" />
        ) : (
          <p className={`text-xl font-bold ${style.text}`}>{value}</p>
        )}
      </div>
    </motion.div>
  );
};

// Chart Components

// Call Summary Chart
interface CallSummaryChartProps {
  data: ChartDataItem[];
  isLoading: boolean;
}

const CallSummaryChart: React.FC<CallSummaryChartProps> = ({ data, isLoading }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-red-100 rounded-lg mr-3">
            <FiPieChart className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Résumé des appels</h3>
            <div className="flex items-center gap-3 mt-1">
              <LiveIndicator />
              <LastUpdated timestamp={new Date()} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <FiRefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Actualiser
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center text-blue-600"
          >
            <FiClock className="w-3.5 h-3.5 mr-1.5" />
            Historique
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-32 w-32 rounded-full mb-4" />
          <Shimmer className="h-4 w-40 rounded mb-2" />
          <Shimmer className="h-4 w-24 rounded" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="entrants" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Entrants" />
                  <Area type="monotone" dataKey="sortants" stackId="1" stroke="#10B981" fill="#10B981" name="Sortants" />
                  <Area type="monotone" dataKey="internes" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Internes" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Entrants', value: data.reduce((sum, item) => sum + item.entrants, 0) },
                      { name: 'Sortants', value: data.reduce((sum, item) => sum + item.sortants, 0) },
                      { name: 'Internes', value: data.reduce((sum, item) => sum + item.internes, 0) },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mb-1"></div>
                  <div className="font-medium">Entrants</div>
                  <div className="text-gray-500">{data.reduce((sum, item) => sum + item.entrants, 0)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                  <div className="font-medium">Sortants</div>
                  <div className="text-gray-500">{data.reduce((sum, item) => sum + item.sortants, 0)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mb-1"></div>
                  <div className="font-medium">Internes</div>
                  <div className="text-gray-500">{data.reduce((sum, item) => sum + item.internes, 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <StatCard 
            title="Entrants" 
            value={data.reduce((sum, item) => sum + item.entrants, 0)} 
            icon={FiPhoneIncoming} 
            change={8} 
            theme="blue" 
            isLoading={isLoading} 
          />
          <StatCard 
            title="Sortants" 
            value={data.reduce((sum, item) => sum + item.sortants, 0)} 
            icon={FiPhoneOutgoing} 
            change={-2} 
            theme="green" 
            isLoading={isLoading} 
          />
          <StatCard 
            title="Internes" 
            value={data.reduce((sum, item) => sum + item.internes, 0)} 
            icon={FiUsers} 
            change={5} 
            theme="orange" 
            isLoading={isLoading} 
          />
          <StatCard 
            title="Total appels" 
            value={data.reduce((sum, item) => sum + item.entrants + item.sortants + item.internes, 0)} 
            icon={FiPhone} 
            change={4} 
            theme="red" 
            isLoading={isLoading} 
          />
        </div>
      )}
    </motion.div>
  );
};

// Total Calls Chart
interface TotalCallsChartProps {
  data: ChartDataItem[];
  isLoading: boolean;
}

const TotalCallsChart: React.FC<TotalCallsChartProps> = ({ data, isLoading }) => {
  // const COLORS = ['#EF4444', '#A855F7'];
  
  // Process data for the chart
  const totalCallsData = data.map((item) => ({
    time: item.time,
    total: item.entrants + item.sortants + item.internes,
    enAttente: item.enAttente
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-red-100 rounded-lg mr-3">
            <FiActivity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Total</h3>
            <div className="flex items-center gap-3 mt-1">
              <LiveIndicator />
              <LastUpdated timestamp={new Date()} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="p-1.5 rounded-lg bg-white shadow-sm">
              <FiActivity className="w-3.5 h-3.5 text-gray-700" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-500">
              <FiBarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <FiRefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Actualiser
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={totalCallsData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#EF4444" 
                    name="Tous les appels"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="enAttente" 
                    stroke="#A855F7" 
                    name="Appels en attente" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Maintenant</h4>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">Live</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <FiPhone className="text-red-500 w-4 h-4 mr-2" />
                    <span className="text-xs text-gray-500">Tous les appels</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalCallsData[totalCallsData.length - 1].total}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <FiClock className="text-purple-500 w-4 h-4 mr-2" />
                    <span className="text-xs text-gray-500">En attente</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {totalCallsData[totalCallsData.length - 1].enAttente}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Aujourd&apos;hui</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>16:45</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Total des appels</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800 mr-2">
                      {totalCallsData.reduce((sum, item) => sum + item.total, 0)}
                    </span>
                    <span className="text-xs text-green-600 flex items-center">
                      <FiArrowUp className="w-3 h-3 mr-0.5" /> 12%
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Temps d&apos;attente moyen</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800 mr-2">
                      1m 24s
                    </span>
                    <span className="text-xs text-red-600 flex items-center">
                      <FiArrowUp className="w-3 h-3 mr-0.5" /> 8%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Active Calls Table Component
interface ActiveCallsTableProps {
  calls: CallItem[];
  isLoading: boolean;
}

const ActiveCallsTable: React.FC<ActiveCallsTableProps> = ({ calls, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mt-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div className="flex items-center">
          <div className="p-1.5 bg-red-100 rounded-lg mr-3">
            <FiPhone className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Appels en cours</h3>
            <div className="flex items-center gap-3 mt-1">
              <LiveIndicator />
              <LastUpdated timestamp={new Date()} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-green-50 border border-green-100 rounded-lg text-xs text-green-700 font-medium">
            {calls.length} appels actifs
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <FiRefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Actualiser
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ligne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {calls.map((call) => (
                <motion.tr 
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <FiUser className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{call.extension}</div>
                        <div className="text-xs text-gray-500">{call.user}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{call.number}</div>
                    <div className="text-xs text-gray-500">{call.contact || "Inconnu"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {call.type === 'incoming' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FiPhoneIncoming className="w-3 h-3 mr-1" />
                        Entrant
                      </span>
                    ) : call.type === 'outgoing' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiPhoneOutgoing className="w-3 h-3 mr-1" />
                        Sortant
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <FiUsers className="w-3 h-3 mr-1" />
                        Interne
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-gray-500 mr-1.5" />
                      <span className="text-sm text-gray-900 font-medium">{call.duration}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {call.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                        Actif
                      </span>
                    ) : call.status === 'hold' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <FiPause className="w-3 h-3 mr-1" />
                        En attente
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiAlertCircle className="w-3 h-3 mr-1" />
                        Problème
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                        <FiZap className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {calls.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <FiPhone className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p>Aucun appel en cours pour le moment</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

// FiUser icon component (not imported in the component list)
interface FiIconProps {
  className?: string;
}

const FiUser: React.FC<FiIconProps> = ({ className = "" }) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// FiX icon component (not imported in the component list)
const FiX: React.FC<FiIconProps> = ({ className = "" }) => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// FiBarChart2 icon component (not imported in the component list)
const FiBarChart2: React.FC<FiIconProps> = ({ className = "" }) => (
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
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

// Main component
export default function StatistiquesEnDirect() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [activeCalls, setActiveCalls] = useState<CallItem[]>([]);
  
  // Generate random data for demonstration
  const generateRandomData = () => {
    const now = new Date();
    const times = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(now);
      time.setMinutes(now.getMinutes() - (11 - i) * 5);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    return times.map(time => ({
      time,
      entrants: Math.floor(Math.random() * 10) + 1,
      sortants: Math.floor(Math.random() * 8) + 1,
      internes: Math.floor(Math.random() * 5) + 1,
      enAttente: Math.floor(Math.random() * 3)
    }));
  };
  
  // Generate random active calls
  const generateRandomCalls = () => {
    const callTypes = ['incoming', 'outgoing', 'internal'] as const;
    const statuses = ['active', 'hold', 'active', 'active', 'active'] as const; // weighted towards active
    
    return Array.from({ length: Math.floor(Math.random() * 6) + 2 }, (_, i) => ({
      id: i + 1,
      extension: `10${i + 1}`,
      user: ['Jean Dupont', 'Marie Laurent', 'Thomas Petit', 'Julie Martin', 'Luc Bernard'][i % 5],
      number: `+33 1 ${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`,
      contact: Math.random() > 0.3 ? ['Acme Corp', 'XYZ Industries', 'Client A', 'Support', 'Partenaire B'][i % 5] : null,
      type: callTypes[Math.floor(Math.random() * callTypes.length)],
      duration: `${Math.floor(Math.random() * 15) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };
  
  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setChartData(generateRandomData());
      setActiveCalls(generateRandomCalls());
      setIsLoading(false);
    }, 1500);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (!isPaused) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        setChartData(prev => {
          const newData = [...prev.slice(1), {
            time,
            entrants: Math.floor(Math.random() * 10) + 1,
            sortants: Math.floor(Math.random() * 8) + 1,
            internes: Math.floor(Math.random() * 5) + 1,
            enAttente: Math.floor(Math.random() * 3)
          }];
          return newData;
        });
        
        // Randomly update active calls (50% chance)
        if (Math.random() > 0.5) {
          setActiveCalls(generateRandomCalls());
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Animation variants
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageVariants}
      className="pt-20 min-h-screen pb-10"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Statistiques', 'Statistiques en direct']} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/10 via-white/70 to-[#F87171]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#EF4444]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#F87171]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Subtle pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative p-6 md:p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2.5 bg-[#EF4444]/15 rounded-xl shadow-inner"
                  >
                    <FiEye className="w-6 h-6 text-[#EF4444]" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#EF4444] to-[#F87171]">
                    Statistiques en direct
                  </h1>
                  <LiveIndicator />
                </div>
                
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Visualisez l&apos;activité de vos lignes téléphoniques en temps réel. Surveillez le nombre d&apos;appels, 
                  la durée et les performances pour une gestion optimale.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsPaused(!isPaused)}
                  className={`flex items-center px-4 py-2.5 rounded-xl hover:shadow-md transition shadow-sm text-sm md:text-base ${
                    isPaused 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isPaused ? (
                    <>
                      <FiPlay className="mr-2" />
                      Reprendre
                    </>
                  ) : (
                    <>
                      <FiPause className="mr-2" />
                      Pause
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition shadow-sm text-sm md:text-base"
                >
                  <FiRadio className="mr-2" />
                  <span className="hidden sm:inline">Historique des appels</span>
                  <span className="sm:hidden">Historique</span>
                </motion.button>
              </div>
            </div>
            
            {/* Quick tip with enhanced style */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex items-start gap-3 p-4 bg-red-50/70 border border-red-100 rounded-xl text-sm backdrop-blur-sm shadow-inner"
            >
              <div className="p-1.5 bg-red-100 rounded-lg shrink-0">
                <FiInfo className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <span className="font-medium text-red-800">Astuce :</span>{' '}
                <span className="text-red-700">
                  Ces statistiques sont mises à jour en temps réel. Vous pouvez mettre en pause les mises à jour à tout moment. 
                  Cliquez sur un appel dans la liste pour voir plus de détails.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CallSummaryChart data={chartData} isLoading={isLoading} />
          <TotalCallsChart data={chartData} isLoading={isLoading} />
        </div>
        
        {/* Active Calls Table */}
        <ActiveCallsTable calls={activeCalls} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}
