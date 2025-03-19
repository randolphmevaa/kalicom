'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiClock,
  FiPhone,
  // FiRefreshCw,
  FiDownload,
  // FiSearch,
  FiChevronDown,
  // FiInfo,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiPieChart,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiActivity,
  FiBarChart2,
  // FiPercent,
  FiCheckCircle,
  // FiMaximize2,
  // FiMinimize2,
  // FiChevronsUp,
  // FiChevronsDown,
  // IconType
} from 'react-icons/fi';
import { 
  // LineChart, 
  // Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  // TooltipProps
} from 'recharts';
import { IconType } from 'react-icons/lib';

// Define interfaces for our data structures
interface DailyCall {
  date: string;
  incoming: number;
  outgoing: number;
  total: number;
}

interface DailyDuration {
  date: string;
  duration: number;
}

interface UserData {
  dailyCalls: DailyCall[];
  dailyDuration: DailyDuration[];
  incoming: number;
  outgoing: number;
  incomingDuration: number;
  outgoingDuration: number;
  totalDuration: number;
  avgIncomingDuration: number;
  avgOutgoingDuration: number;
  avgDuration: number;
  shortestCall: number;
  longestCall: number;
}

// Define types for component props
interface ShimmerProps {
  className: string;
}

interface BreadcrumbsProps {
  items: string[];
}

interface DateRange {
  label: string;
  value: string;
  icon: IconType;
}

interface DateRangeSelectorProps {
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

// Define the tooltip payload item interface for better typing
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (value: number) => string;
}

interface StatCardProps {
  data: Partial<UserData>;
  isLoading: boolean;
}

// Shimmer loading effect component
const Shimmer: React.FC<ShimmerProps> = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] ${className}`}></div>
);

// Enhanced Breadcrumbs component
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

// Enhanced Date Range Selector Component
const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ selectedRange, setSelectedRange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dateRanges: DateRange[] = [
    { label: "Aujourd'hui", value: "today", icon: FiCalendar },
    { label: "Hier", value: "yesterday", icon: FiCalendar },
    { label: "7 derniers jours", value: "last7days", icon: FiCalendar },
    { label: "30 derniers jours", value: "last30days", icon: FiCalendar },
    { label: "Ce mois", value: "thisMonth", icon: FiCalendar },
    { label: "Tout le temps", value: "allTime", icon: FiCalendar },
    { label: "Plage personnalisée", value: "custom", icon: FiCalendar }
  ];

  const selectedRangeData = dateRanges.find(r => r.value === selectedRange) || dateRanges[0];

  return (
    <div className="relative inline-block w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-teal-300 transition-colors"
      >
        <div className="flex items-center">
          <selectedRangeData.icon className="w-4 h-4 text-gray-500 mr-2" />
          <span>{selectedRangeData.label}</span>
        </div>
        <FiChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-64 overflow-auto"
          >
            {dateRanges.map((range) => (
              <motion.div
                key={range.value}
                whileHover={{ backgroundColor: '#F3F4F6' }}
                className={`px-4 py-2 cursor-pointer flex items-center ${selectedRange === range.value ? 'bg-teal-50 text-teal-700' : ''}`}
                onClick={() => {
                  setSelectedRange(range.value);
                  setIsDropdownOpen(false);
                }}
              >
                <range.icon className="w-4 h-4 mr-2 text-gray-500" />
                {range.label}
                {selectedRange === range.value && (
                  <FiCheckCircle className="w-4 h-4 ml-auto text-teal-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Tooltip Component for Charts
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            <span className="font-bold">
              {formatter ? formatter(entry.value) : entry.value}
            </span> {entry.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Summary Stats Card
const SummaryStatsCard: React.FC<StatCardProps> = ({ data, isLoading }) => {
  // Format duration as "Xh Ym Zs"
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };
  
  // Format total calls
  const totalCalls = (data.incoming || 0) + (data.outgoing || 0);
  
  // Calculate average duration
  const avgDuration = totalCalls > 0 
    ? Math.round(((data.totalDuration || 0) / totalCalls) * 10) / 10
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex items-center mb-6">
        <div className="p-1.5 bg-teal-100 rounded-lg mr-3">
          <FiActivity className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Vue d&apos;ensemble</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Calls */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FiPhone className="w-5 h-5 text-teal-600" />
            </div>
            {!isLoading && (
              <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                <FiArrowUp className="inline-block w-3 h-3 mr-0.5" />
                12%
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-1">Total des appels</p>
          {isLoading ? (
            <Shimmer className="h-8 w-2/3 rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-800">{totalCalls}</p>
          )}
          
          {!isLoading && (
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                <span>Entrants: {data.incoming}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span>Sortants: {data.outgoing}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Total Duration */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FiClock className="w-5 h-5 text-teal-600" />
            </div>
            {!isLoading && (
              <span className="text-xs text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                <FiArrowUp className="inline-block w-3 h-3 mr-0.5" />
                9%
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-1">Durée d&apos;appel totale</p>
          {isLoading ? (
            <Shimmer className="h-8 w-2/3 rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-800">{formatDuration(data.totalDuration || 0)}</p>
          )}
          
          {!isLoading && (
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <div className="flex items-center">
                <FiPhoneIncoming className="w-3 h-3 mr-1 text-blue-500" />
                <span>{formatDuration(data.incomingDuration || 0)}</span>
              </div>
              <div className="flex items-center">
                <FiPhoneOutgoing className="w-3 h-3 mr-1 text-green-500" />
                <span>{formatDuration(data.outgoingDuration || 0)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Average Duration */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FiClock className="w-5 h-5 text-teal-600" />
            </div>
            {!isLoading && (
              <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                <FiArrowDown className="inline-block w-3 h-3 mr-0.5" />
                3%
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-1">Durée moyenne par appel</p>
          {isLoading ? (
            <Shimmer className="h-8 w-2/3 rounded" />
          ) : (
            <p className="text-2xl font-bold text-gray-800">{avgDuration} min</p>
          )}
          
          {!isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
              <div 
                className="bg-teal-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(100, (avgDuration / 15) * 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Call Count Chart
const CallCountChart: React.FC<StatCardProps> = ({ data, isLoading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-teal-100 rounded-lg mr-3">
            <FiBarChart2 className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Nombre d&apos;appels</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="p-1.5 rounded-lg bg-white shadow-sm">
              <FiBarChart2 className="w-3.5 h-3.5 text-gray-700" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-500">
              <FiTrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <FiDownload className="w-3.5 h-3.5 mr-1.5" />
            Exporter
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.dailyCalls || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                name="Appels entrants" 
                dataKey="incoming" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                name="Appels sortants" 
                dataKey="outgoing" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiPhoneIncoming className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Appels entrants</span>
              </div>
              <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {Math.round(((data.incoming || 0) / ((data.incoming || 0) + (data.outgoing || 0))) * 100)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-2">{data.incoming || 0}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiPhoneOutgoing className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Appels sortants</span>
              </div>
              <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                {Math.round(((data.outgoing || 0) / ((data.incoming || 0) + (data.outgoing || 0))) * 100)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-800 mt-2">{data.outgoing || 0}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Call Duration by Day Chart
const CallDurationChart: React.FC<StatCardProps> = ({ data, isLoading }) => {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div className="flex items-center">
          <div className="p-1.5 bg-teal-100 rounded-lg mr-3">
            <FiClock className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Durée d&apos;appel par jour</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <FiDownload className="w-3.5 h-3.5 mr-1.5" />
            Exporter
          </motion.button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.dailyDuration || []}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${Math.floor(value/60)}h`}
              />
              <Tooltip content={<CustomTooltip formatter={formatDuration} />} />
              <Legend />
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="duration" 
                stroke="#14B8A6" 
                fill="url(#colorDuration)" 
                name="Durée d'appel"
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
            <span className="text-xs text-gray-500">Durée totale</span>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatDuration(data.totalDuration || 0)}</p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
            <span className="text-xs text-gray-500">Appel le plus long</span>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatDuration(data.longestCall || 0)}</p>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100">
            <span className="text-xs text-gray-500">Jour le plus actif</span>
            <p className="text-xl font-bold text-gray-800 mt-1">Mercredi</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Incoming Outgoing Ratio Chart
const RatioChart: React.FC<StatCardProps> = ({ data, isLoading }) => {
  const COLORS = ['#3B82F6', '#10B981'];
  
  const pieData = [
    { name: 'Entrants', value: data.incoming || 0 },
    { name: 'Sortants', value: data.outgoing || 0 }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex items-center mb-6">
        <div className="p-1.5 bg-teal-100 rounded-lg mr-3">
          <FiPieChart className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Ratio entrants et sortants</h3>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-48 rounded-full mx-auto" />
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={5}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {!isLoading && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Entrants</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{data.incoming || 0}</p>
            <span className="text-xs text-blue-600">
              {Math.round(((data.incoming || 0) / ((data.incoming || 0) + (data.outgoing || 0))) * 100)}%
            </span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Sortants</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{data.outgoing || 0}</p>
            <span className="text-xs text-green-600">
              {Math.round(((data.outgoing || 0) / ((data.incoming || 0) + (data.outgoing || 0))) * 100)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Average Call Duration Chart
const AverageCallDurationChart: React.FC<StatCardProps> = ({ data, isLoading }) => {
  // Calculate percentages
  const percentageOfMax = ((data.avgDuration || 0) / 15) * 100; // Assuming 15 min is max
  
  // Format duration as "Xm Ys"
  const formatDuration = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins}m ${secs}s`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
    >
      <div className="flex items-center mb-6">
        <div className="p-1.5 bg-teal-100 rounded-lg mr-3">
          <FiClock className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Durée moyenne par appel</h3>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Shimmer className="h-48 w-48 rounded-full mx-auto" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative h-56 w-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="70%" 
                outerRadius="90%" 
                barSize={20} 
                data={[
                  {
                    name: 'Durée moyenne',
                    value: percentageOfMax,
                    fill: '#14B8A6',
                  }
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill="#14B8A6"
                />
                <Tooltip 
                  formatter={(value: number) => formatDuration((value / 100) * 15)} 
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-gray-800">{formatDuration(data.avgDuration || 0)}</p>
              <p className="text-sm text-gray-500">Moyenne</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6 w-full max-w-md">
            <div className="flex items-center">
              <FiPhoneIncoming className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Entrants</p>
                <p className="text-base font-medium text-gray-800">{formatDuration(data.avgIncomingDuration || 0)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiPhoneOutgoing className="w-4 h-4 text-green-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Sortants</p>
                <p className="text-base font-medium text-gray-800">{formatDuration(data.avgOutgoingDuration || 0)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiActivity className="w-4 h-4 text-amber-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Plus long</p>
                <p className="text-base font-medium text-gray-800">{formatDuration((data.longestCall || 0) / 60)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <FiClock className="w-4 h-4 text-rose-500 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Plus court</p>
                <p className="text-base font-medium text-gray-800">{formatDuration((data.shortestCall || 0) / 60)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Main component
export default function MesStatistiques() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('last7days');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Generate random data for demonstration
  const generateRandomData = (): UserData => {
    // Generate daily data for the past 7 days
    const today = new Date();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const dailyCalls = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      const dayName = days[date.getDay()];
      const incoming = Math.floor(Math.random() * 15) + 5;
      const outgoing = Math.floor(Math.random() * 12) + 3;
      return {
        date: dayName,
        incoming,
        outgoing,
        total: incoming + outgoing
      };
    });
    
    // Generate daily durations
    const dailyDuration = dailyCalls.map(day => ({
      date: day.date,
      duration: (day.incoming * (Math.random() * 5 + 3)) + (day.outgoing * (Math.random() * 6 + 2))
    }));
    
    // Calculate totals
    const incoming = dailyCalls.reduce((sum, day) => sum + day.incoming, 0);
    const outgoing = dailyCalls.reduce((sum, day) => sum + day.outgoing, 0);
    const incomingDuration = Math.floor(incoming * (Math.random() * 5 + 3));
    const outgoingDuration = Math.floor(outgoing * (Math.random() * 6 + 2));
    const totalDuration = incomingDuration + outgoingDuration;
    
    // Average durations
    const avgIncomingDuration = incoming > 0 ? incomingDuration / incoming : 0;
    const avgOutgoingDuration = outgoing > 0 ? outgoingDuration / outgoing : 0;
    const avgDuration = (incoming + outgoing) > 0 ? totalDuration / (incoming + outgoing) : 0;
    
    // Min and max call duration in seconds
    const shortestCall = Math.floor(Math.random() * 60) + 30; // 30-90 seconds
    const longestCall = Math.floor(Math.random() * 1800) + 600; // 10-40 minutes
    
    return {
      dailyCalls,
      dailyDuration,
      incoming,
      outgoing,
      incomingDuration,
      outgoingDuration,
      totalDuration,
      avgIncomingDuration,
      avgOutgoingDuration,
      avgDuration,
      shortestCall,
      longestCall
    };
  };
  
  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setUserData(generateRandomData());
      setIsLoading(false);
    }, 1800);
  }, []);
  
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
        <Breadcrumbs items={['PBX', 'Statistiques', 'Mes statistiques']} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#14B8A6]/10 via-white/70 to-[#0D9488]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#0D9488]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Subtle pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative p-6 md:p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2.5 bg-[#14B8A6]/15 rounded-xl shadow-inner"
                  >
                    <FiUser className="w-6 h-6 text-[#14B8A6]" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#0F766E] to-[#14B8A6]">
                    Mes statistiques
                  </h1>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Consultez les statistiques détaillées de vos appels personnels. Analysez votre activité 
                  téléphonique et suivez vos performances au fil du temps.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                <DateRangeSelector
                  selectedRange={selectedDateRange}
                  setSelectedRange={setSelectedDateRange}
                />
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition shadow-sm"
                >
                  <FiFilter className="w-4 h-4 mr-2" />
                  Appliquer le filtre
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats Card */}
        <SummaryStatsCard data={userData || {}} isLoading={isLoading} />
        
        {/* Call Count Chart */}
        <CallCountChart data={userData || {}} isLoading={isLoading} />
        
        {/* Call Duration Chart */}
        <CallDurationChart data={userData || {}} isLoading={isLoading} />
        
        {/* Bottom Two Charts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RatioChart data={userData || {}} isLoading={isLoading} />
          <AverageCallDurationChart data={userData || {}} isLoading={isLoading} />
        </div>
      </div>
    </motion.div>
  );
}
