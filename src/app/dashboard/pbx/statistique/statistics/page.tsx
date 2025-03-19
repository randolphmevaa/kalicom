'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiPhoneIncoming,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiClock,
  FiPhone,
  FiBarChart2,
  FiList,
  FiRefreshCw,
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiInfo,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiSliders,
  FiMoreVertical,
  FiCheckCircle,
  FiZap,
  FiMaximize,
  FiMinimize,
  FiStar
} from 'react-icons/fi';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Define types for data structures
interface SparklineDataItem {
  name: string;
  value: number;
}

interface CallDataItem {
  name: string;
  calls: number;
  average: number;
}

interface PhoneNumberItem {
  id: number;
  number: string;
  calls: number;
  duration: string;
  callsChange: number;
}

interface DateRangeItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Theme type definitions
interface ThemeStyle {
  gradient: string;
  bgLight: string;
  text: string;
  iconBg: string;
  iconColor: string;
  borderHover: string;
  changeUp: string;
  changeDown: string;
}

interface ThemeStyles {
  blue: ThemeStyle;
  purple: ThemeStyle;
  green: ThemeStyle;
  [key: string]: ThemeStyle;
}

// Shimmer loading effect component
interface ShimmerProps {
  className: string;
}

const Shimmer: React.FC<ShimmerProps> = ({ className }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] ${className}`}></div>
);

// Enhanced Breadcrumbs component with hover effects
interface BreadcrumbsProps {
  items: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center text-sm text-gray-600 mb-6"
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

// Enhanced Stat Card Component with sparkline and animation
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  theme: 'blue' | 'purple' | 'green';
  sparklineData?: SparklineDataItem[];
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, theme, sparklineData }) => {
  const getThemeStyles = (theme: string): ThemeStyle => {
    const themeMap: ThemeStyles = {
      blue: {
        gradient: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        text: 'text-blue-700',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        borderHover: 'hover:border-blue-300',
        changeUp: 'text-blue-600',
        changeDown: 'text-red-500',
      },
      purple: {
        gradient: 'from-purple-500 to-indigo-600',
        bgLight: 'bg-purple-50',
        text: 'text-purple-700',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        borderHover: 'hover:border-purple-300',
        changeUp: 'text-purple-600',
        changeDown: 'text-red-500',
      },
      green: {
        gradient: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        text: 'text-emerald-700',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        borderHover: 'hover:border-emerald-300',
        changeUp: 'text-emerald-600',
        changeDown: 'text-red-500',
      },
    };
    
    return themeMap[theme] || themeMap.blue;
  };

  const styles = getThemeStyles(theme);
  const isPositive = change !== undefined && change > 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)' }}
      className={`${styles.bgLight} p-5 rounded-xl border border-${theme}-200 shadow-sm backdrop-blur-sm transition-all duration-300 ${styles.borderHover}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <div className="flex items-baseline mt-1">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`text-2xl font-bold ${styles.text}`}
            >
              {value}
            </motion.p>
            {change !== undefined && (
              <span className={`ml-2 text-xs flex items-center ${isPositive ? styles.changeUp : styles.changeDown}`}>
                {isPositive ? <FiArrowUp className="mr-0.5" /> : <FiArrowDown className="mr-0.5" />}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg} shadow-sm`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </div>
      
      {/* Mini sparkline */}
      {sparklineData && (
        <div className="h-12 mt-2 opacity-75">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'blue' ? '#3B82F6' : theme === 'purple' ? '#8B5CF6' : '#10B981'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme === 'blue' ? '#3B82F6' : theme === 'purple' ? '#8B5CF6' : '#10B981'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={theme === 'blue' ? '#3B82F6' : theme === 'purple' ? '#8B5CF6' : '#10B981'} 
                fillOpacity={1}
                fill={`url(#sparkline-${title})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

// Enhanced Phone Number Record Component
interface PhoneNumberRecordProps {
  number: string;
  calls: number;
  duration: string;
  callsChange?: number;
  active: boolean;
}

const PhoneNumberRecord: React.FC<PhoneNumberRecordProps> = ({ number, calls, duration, callsChange, active }) => (
  <motion.div 
    whileHover={{ scale: 1.01, x: 3 }}
    transition={{ duration: 0.2 }}
    className={`p-4 border ${active ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 bg-white'} rounded-xl shadow-sm hover:shadow-md transition-all mb-3 backdrop-blur-sm relative overflow-hidden`}
  >
    {active && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div className={`p-2 ${active ? 'bg-blue-100' : 'bg-blue-50'} rounded-lg mr-3`}>
          <FiPhoneIncoming className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{number}</p>
          <p className="text-xs text-gray-500">DID</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-800">{calls}</p>
            {callsChange !== undefined && (
              <span className={`ml-1.5 text-xs flex items-center ${callsChange > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {callsChange > 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                {Math.abs(callsChange)}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">Appels</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{duration}</p>
          <p className="text-xs text-gray-500">Durée</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
        >
          <FiMoreVertical className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
    
    {/* Mini bar chart for each record */}
    <div className="h-7 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={[
            {day: 'L', value: Math.floor(Math.random() * 10) + 1},
            {day: 'M', value: Math.floor(Math.random() * 10) + 1},
            {day: 'M', value: Math.floor(Math.random() * 10) + 1},
            {day: 'J', value: Math.floor(Math.random() * 10) + 1},
            {day: 'V', value: Math.floor(Math.random() * 10) + 1},
            {day: 'S', value: Math.floor(Math.random() * 10) + 1},
            {day: 'D', value: Math.floor(Math.random() * 10) + 1},
          ]} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <Bar dataKey="value" fill="#E0E7FF" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

// Enhanced Date Range Selector Component
interface DateRangeSelectorProps {
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ selectedRange, setSelectedRange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const dateRanges: DateRangeItem[] = [
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
        className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors"
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
                className={`px-4 py-2 cursor-pointer flex items-center ${selectedRange === range.value ? 'bg-blue-50 text-blue-700' : ''}`}
                onClick={() => {
                  setSelectedRange(range.value);
                  setIsDropdownOpen(false);
                }}
              >
                <range.icon className="w-4 h-4 mr-2 text-gray-500" />
                {range.label}
                {selectedRange === range.value && (
                  <FiCheckCircle className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Tab Component for Chart Views
interface ChartTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ChartTabs: React.FC<ChartTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: TabItem[] = [
    { id: 'hourly', label: 'Horaire', icon: FiClock },
    { id: 'daily', label: 'Journalier', icon: FiCalendar },
    { id: 'weekly', label: 'Hebdomadaire', icon: FiBarChart2 }
  ];
  
  return (
    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
            activeTab === tab.id 
              ? 'bg-white text-blue-700 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon className="w-3.5 h-3.5 mr-1.5" />
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
};

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    <Shimmer className="h-12 w-full rounded-xl" />
    <div className="grid grid-cols-3 gap-4">
      <Shimmer className="h-28 rounded-xl" />
      <Shimmer className="h-28 rounded-xl" />
      <Shimmer className="h-28 rounded-xl" />
    </div>
    <Shimmer className="h-72 w-full rounded-xl" />
  </div>
);

// Enhanced Tooltip Component for Charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-blue-600">
          <span className="font-bold">{payload[0].value}</span> appels
        </p>
      </div>
    );
  }
  return null;
};

export default function StatistiquesParNumero() {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last7days');
  const [chartTab, setChartTab] = useState<string>('hourly');
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [chartView, setChartView] = useState<'line' | 'bar'>('line');
  const [activePhoneNumber, setActivePhoneNumber] = useState<number | null>(null);
  
  // Sample data for sparklines
  const generateSparklineData = (count: number): SparklineDataItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      name: i.toString(),
      value: Math.floor(Math.random() * 100)
    }));
  };

  // Sample chart data for different views
  const hourlyCallData: CallDataItem[] = [
    { name: '9:00', calls: 4, average: 3.5 },
    { name: '10:00', calls: 3, average: 3.2 },
    { name: '11:00', calls: 5, average: 4.7 },
    { name: '12:00', calls: 7, average: 6.3 },
    { name: '13:00', calls: 2, average: 2.8 },
    { name: '14:00', calls: 6, average: 5.5 },
    { name: '15:00', calls: 8, average: 7.2 },
    { name: '16:00', calls: 9, average: 8.1 },
    { name: '17:00', calls: 11, average: 9.6 },
  ];

  const dailyCallData: CallDataItem[] = [
    { name: 'Lun', calls: 24, average: 22 },
    { name: 'Mar', calls: 18, average: 20 },
    { name: 'Mer', calls: 32, average: 28 },
    { name: 'Jeu', calls: 27, average: 25 },
    { name: 'Ven', calls: 35, average: 30 },
    { name: 'Sam', calls: 15, average: 12 },
    { name: 'Dim', calls: 10, average: 8 },
  ];

  const weeklyCallData: CallDataItem[] = [
    { name: 'S1', calls: 140, average: 130 },
    { name: 'S2', calls: 125, average: 135 },
    { name: 'S3', calls: 160, average: 145 },
    { name: 'S4', calls: 175, average: 155 },
  ];

  // Sample phone numbers data with more details
  const phoneNumbers: PhoneNumberItem[] = [
    { id: 1, number: '+33 1 23 45 67 89', calls: 42, duration: '2h 15m', callsChange: 8 },
    { id: 2, number: '+33 1 98 76 54 32', calls: 37, duration: '1h 58m', callsChange: -3 },
    { id: 3, number: '+33 1 45 67 89 12', calls: 28, duration: '1h 32m', callsChange: 12 },
    { id: 4, number: '+33 1 56 78 90 12', calls: 24, duration: '3h 07m', callsChange: 5 },
    { id: 5, number: '+33 1 34 56 78 90', calls: 22, duration: '1h 44m', callsChange: -6 },
    { id: 6, number: '+33 1 67 89 01 23', calls: 19, duration: '0h 48m', callsChange: 0 },
  ];

  // Get chart data based on active tab
  const getChartData = (): CallDataItem[] => {
    switch(chartTab) {
      case 'daily': return dailyCallData;
      case 'weekly': return weeklyCallData;
      default: return hourlyCallData;
    }
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const chartContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
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
        <Breadcrumbs items={['PBX', 'Statistiques', 'Statistiques par numéro']} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Subtle pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2.5 bg-[#004AC8]/15 rounded-xl shadow-inner"
                  >
                    <FiPhoneIncoming className="w-6 h-6 text-[#004AC8]" />
                  </motion.div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Statistiques par numéro
                  </h1>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-2.5 py-1 text-xs font-semibold text-[#004AC8] bg-[#004AC8]/10 rounded-full shadow-sm border border-[#004AC8]/20"
                  >
                    30j
                  </motion.div>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Consultez les statistiques détaillées des appels reçus sur vos numéros. Analysez la répartition du trafic et 
                  identifiez les tendances par numéro de téléphone.
                </p>
              </div>
              
              <div className="flex space-x-3">
                {/* Export Button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#004AC8] hover:border-[#004AC8]/30 transition shadow-sm"
                >
                  <FiDownload className="mr-2" />
                  Exporter
                </motion.button>
                
                {/* Refresh Button with enhance style */}
                <motion.button
                  whileHover={{ scale: 1.03, rotate: 30 }}
                  whileTap={{ scale: 0.97, rotate: 60 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#004AC8] hover:border-[#004AC8]/30 transition shadow-sm"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </motion.button>
                
                {/* Settings Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-[#004AC8] hover:border-[#004AC8]/30 transition shadow-sm"
                >
                  <FiSliders className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Quick tip with enhanced style */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex items-start gap-3 p-4 bg-amber-50/70 border border-amber-100 rounded-xl text-sm backdrop-blur-sm shadow-inner"
            >
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <FiInfo className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="font-medium text-amber-800">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Sélectionnez un numéro dans la liste de droite pour voir ses statistiques détaillées. Vous pouvez aussi filtrer par période ou par ligne spécifique.
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <LoadingState />
            </motion.div>
          ) : (
            /* Main Content - Two Column Grid */
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Left Column */}
              <div className="space-y-6">
                {/* Filters Panel */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-blue-100 rounded-lg">
                        <FiFilter className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {isFilterExpanded ? <FiMinimize className="w-4 h-4" /> : <FiMaximize className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {isFilterExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Line Selector with enhanced style */}
                          <div>
                            <label className="block text-sm text-gray-600 font-medium mb-2">Ligne</label>
                            <div className="relative">
                              <select
                                value={selectedLine}
                                onChange={(e) => setSelectedLine(e.target.value)}
                                className="w-full appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors shadow-sm"
                              >
                                <option value="all">Toutes les lignes</option>
                                <option value="line1">Ligne 1</option>
                                <option value="line2">Ligne 2</option>
                                <option value="line3">Ligne 3</option>
                              </select>
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <FiPhone className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <FiChevronDown className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Date Range with enhanced component */}
                          <div>
                            <label className="block text-sm text-gray-600 font-medium mb-2">Période</label>
                            <DateRangeSelector
                              selectedRange={selectedDateRange}
                              setSelectedRange={setSelectedDateRange}
                            />
                          </div>
                        </div>
                        
                        {/* Apply Filter Button with enhanced style */}
                        <motion.button
                          whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0, 74, 200, 0.15)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-[#004AC8] to-[#0070F3] text-white rounded-xl transition-all flex items-center justify-center shadow-md hover:from-[#0039A0] hover:to-[#005FD1]"
                        >
                          <FiZap className="mr-2" />
                          Appliquer le filtre
                          <span className="ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-md">
                            Entrées: 42
                          </span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
                </motion.div>
                
                {/* Stats Cards with enhanced design */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                  <StatCard
                    title="Total Appels"
                    value="247"
                    change={5.2}
                    icon={FiPhone}
                    theme="blue"
                    sparklineData={generateSparklineData(10)}
                  />
                  <StatCard
                    title="Total Durée"
                    value="14h 32m"
                    change={-2.1}
                    icon={FiClock}
                    theme="purple"
                    sparklineData={generateSparklineData(10)}
                  />
                  <StatCard
                    title="Temps d'attente"
                    value="1m 24s"
                    change={-8.7}
                    icon={FiClock}
                    theme="green"
                    sparklineData={generateSparklineData(10)}
                  />
                </motion.div>
                
                {/* Enhanced Graph Panel */}
                <motion.div
                  variants={chartContainerVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-blue-100 rounded-lg">
                        <FiBarChart2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Appels entrants</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Chart view toggle */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartView('line')}
                          className={`p-1.5 rounded-lg ${chartView === 'line' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiTrendingUp className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartView('bar')}
                          className={`p-1.5 rounded-lg ${chartView === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiBarChart2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                      
                      {/* Time period tabs */}
                      <ChartTabs activeTab={chartTab} setActiveTab={setChartTab} />
                    </div>
                  </div>
                  
                  {/* Chart with enhanced styling */}
                  <motion.div 
                    key={chartTab + chartView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-72 mt-2"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === 'line' ? (
                        <LineChart data={getChartData()}>
                          <defs>
                            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0070F3" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0070F3" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{ paddingTop: 15 }}
                            iconType="circle"
                            iconSize={8}
                          />
                          <Area
                            type="monotone"
                            dataKey="calls"
                            stroke="#0070F3"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCalls)"
                            name="Appels"
                            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Moyenne"
                            strokeDasharray="5 5"
                            dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{ paddingTop: 15 }}
                            iconType="circle"
                            iconSize={8}
                          />
                          <Bar 
                            dataKey="calls" 
                            fill="#0070F3" 
                            radius={[4, 4, 0, 0]}
                            name="Appels"
                          />
                          <Bar 
                            dataKey="average" 
                            fill="#10B981" 
                            radius={[4, 4, 0, 0]} 
                            name="Moyenne"
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                  
                  {/* User insights */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 flex items-start">
                    <FiStar className="w-4 h-4 text-amber-400 mr-2 mt-0.5" />
                    <p>
                      <span className="font-medium text-gray-900">Insight :</span>{' '}
                      Le créneau 17:00 enregistre le pic d&apos;appels avec 11 appels, soit 27% de plus que la moyenne.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Right Column - Enhanced Phone Numbers List */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-1.5 mr-2 bg-blue-100 rounded-lg">
                      <FiList className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Numéros</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                      <span className="font-bold">{phoneNumbers.length}</span> enregistrements
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Search with transitions */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="relative mb-6 group"
                >
                  <input
                    type="text"
                    placeholder="Rechercher un numéro..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 transition-colors shadow-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 group-hover:text-blue-500 transition-colors">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
                
                {/* Enhanced Phone number list with sorting options */}
                <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Trier par:</span>
                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white">
                      <option>Appels (décroissant)</option>
                      <option>Appels (croissant)</option>
                      <option>Durée (décroissant)</option>
                      <option>Durée (croissant)</option>
                    </select>
                  </div>
                  
                  <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                    <FiRefreshCw className="w-3 h-3 mr-1" />
                    Actualiser
                  </button>
                </div>
                
                {/* Phone number list with enhanced interactions */}
                <motion.div 
                  className="space-y-3 max-h-[540px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100"
                  variants={containerVariants}
                >
                  <AnimatePresence>
                    {phoneNumbers.map((phone) => (
                      <motion.div
                        key={phone.id}
                        variants={itemVariants}
                        onClick={() => setActivePhoneNumber(phone.id === activePhoneNumber ? null : phone.id)}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <PhoneNumberRecord
                          number={phone.number}
                          calls={phone.calls}
                          duration={phone.duration}
                          callsChange={phone.callsChange}
                          active={phone.id === activePhoneNumber}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                
                {/* Action buttons */}
                <div className="mt-6 flex justify-between">
                  <button className="text-sm text-gray-600 flex items-center">
                    <FiDownload className="w-4 h-4 mr-1" />
                    Exporter les numéros
                  </button>
                  
                  <button className="text-sm text-blue-600 flex items-center font-medium">
                    Voir tous les numéros
                    <FiChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
