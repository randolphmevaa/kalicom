'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiClock,
  FiPhone,
  FiGlobe,
  // FiList,
  FiRefreshCw,
  FiDownload,
  // FiSearch,
  FiChevronDown,
  FiInfo,
  FiTrendingUp,
  // FiArrowUp,
  // FiArrowDown,
  // FiMenu,
  // FiX,
  FiSliders,
  // FiMoreVertical,
  FiZap,
  FiMaximize,
  FiMinimize,
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPieChart,
  FiCheckCircle
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
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Define types for data structures
interface CountriesCalledDataItem {
  name: string;
  value: number;
}

interface CallDurationDataItem {
  name: string;
  value: number;
  average: number;
}

interface CallVolumeDataItem {
  name: string;
  entrants: number;
  sortants: number;
}

interface DateRangeItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ChartTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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
  tabs: ChartTab[];
}

const ChartTabs: React.FC<ChartTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
            activeTab === tab.id 
              ? 'bg-white text-purple-700 shadow-sm' 
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Shimmer className="h-64 rounded-xl" />
      <Shimmer className="h-64 rounded-xl" />
    </div>
    <Shimmer className="h-72 w-full rounded-xl" />
  </div>
);

// Enhanced Tooltip Component for Charts
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    value: number | string;
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

export default function StatistiquesDAppel() {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last7days');
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [chartViewCountry, setChartViewCountry] = useState<'bar' | 'pie'>('bar');
  const [chartViewDuration, setChartViewDuration] = useState<'line' | 'bar'>('line');
  const [chartViewCalls, setChartViewCalls] = useState<'bar' | 'line'>('bar');
  const [activeTabCalls, setActiveTabCalls] = useState<string>('daily');
  
  // Sample data for countries called
  const countriesCalledData: CountriesCalledDataItem[] = [
    { name: 'France', value: 124 },
    { name: 'Allemagne', value: 87 },
    { name: 'Espagne', value: 42 },
    { name: 'Royaume-Uni', value: 35 },
    { name: 'Italie', value: 28 },
    { name: 'Belgique', value: 22 },
    { name: 'Suisse', value: 18 },
  ];
  
  // Sample data for average call duration
  const callDurationData: CallDurationDataItem[] = [
    { name: 'Lun', value: 3.2, average: 2.8 },
    { name: 'Mar', value: 2.8, average: 2.8 },
    { name: 'Mer', value: 4.1, average: 2.8 },
    { name: 'Jeu', value: 3.5, average: 2.8 },
    { name: 'Ven', value: 2.9, average: 2.8 },
    { name: 'Sam', value: 1.8, average: 2.8 },
    { name: 'Dim', value: 1.5, average: 2.8 },
  ];
  
  // Sample data for call volumes
  const callVolumeDaily: CallVolumeDataItem[] = [
    { name: 'Lun', entrants: 42, sortants: 35 },
    { name: 'Mar', entrants: 38, sortants: 28 },
    { name: 'Mer', entrants: 56, sortants: 45 },
    { name: 'Jeu', entrants: 48, sortants: 37 },
    { name: 'Ven', entrants: 65, sortants: 52 },
    { name: 'Sam', entrants: 24, sortants: 18 },
    { name: 'Dim', entrants: 15, sortants: 12 },
  ];
  
  const callVolumeWeekly: CallVolumeDataItem[] = [
    { name: 'S1', entrants: 245, sortants: 198 },
    { name: 'S2', entrants: 267, sortants: 215 },
    { name: 'S3', entrants: 290, sortants: 233 },
    { name: 'S4', entrants: 310, sortants: 248 },
  ];
  
  const callVolumeMonthly: CallVolumeDataItem[] = [
    { name: 'Jan', entrants: 1245, sortants: 983 },
    { name: 'Fév', entrants: 1178, sortants: 945 },
    { name: 'Mar', entrants: 1298, sortants: 1045 },
    { name: 'Avr', entrants: 1354, sortants: 1125 },
    { name: 'Mai', entrants: 1489, sortants: 1256 },
    { name: 'Juin', entrants: 1587, sortants: 1345 },
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Tabs for call volume chart
  const callVolumeTabs: ChartTab[] = [
    { id: 'daily', label: 'Journalier', icon: FiCalendar },
    { id: 'weekly', label: 'Hebdomadaire', icon: FiBarChart2 },
    { id: 'monthly', label: 'Mensuel', icon: FiPieChart }
  ];
  
  // Get chart data based on active tab
  const getCallVolumeData = (): CallVolumeDataItem[] => {
    switch(activeTabCalls) {
      case 'weekly': return callVolumeWeekly;
      case 'monthly': return callVolumeMonthly;
      default: return callVolumeDaily;
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
        <Breadcrumbs items={['PBX', 'Statistiques', "Statistiques d'appel"]} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 via-white/70 to-[#D946EF]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#D946EF]/10 rounded-full blur-3xl pointer-events-none"></div>
          
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
                    className="p-2.5 bg-[#8B5CF6]/15 rounded-xl shadow-inner"
                  >
                    <FiBarChart2 className="w-6 h-6 text-[#8B5CF6]" />
                  </motion.div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
                    Statistiques d&apos;appel
                  </h1>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-2.5 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full shadow-sm border border-purple-200"
                  >
                    247 appels
                  </motion.div>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Consultez les graphiques détaillés des statistiques d&apos;appel. Analysez le volume d&apos;appels, 
                  les durées moyennes et la répartition par pays.
                </p>
              </div>
              
              <div className="flex space-x-3">
                {/* Export Button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition shadow-sm"
                >
                  <FiDownload className="mr-2" />
                  Exporter
                </motion.button>
                
                {/* Refresh Button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03, rotate: 30 }}
                  whileTap={{ scale: 0.97, rotate: 60 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition shadow-sm"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </motion.button>
                
                {/* Settings Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 transition shadow-sm"
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
              className="mt-6 flex items-start gap-3 p-4 bg-purple-50/70 border border-purple-100 rounded-xl text-sm backdrop-blur-sm shadow-inner"
            >
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <FiInfo className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <span className="font-medium text-purple-800">Astuce :</span>{' '}
                <span className="text-purple-700">
                  Utilisez les filtres pour affiner vos données et changer la période. Vous pouvez basculer entre différentes visualisations pour mieux analyser vos statistiques d&apos;appel.
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
            <motion.div variants={containerVariants}>
              {/* Filters Panel */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden backdrop-blur-sm mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-1.5 mr-2 bg-purple-100 rounded-lg">
                      <FiFilter className="w-4 h-4 text-purple-600" />
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
                              className="w-full appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-purple-300 transition-colors shadow-sm"
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
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white rounded-xl transition-all flex items-center justify-center shadow-md hover:from-[#7C3AED] hover:to-[#C026D3]"
                      >
                        <FiZap className="mr-2" />
                        Appliquer le filtre
                        <span className="ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-md">
                          247 appels
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
              </motion.div>

              {/* Two Column Grid for Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Countries Called Chart */}
                <motion.div
                  variants={chartContainerVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-blue-100 rounded-lg">
                        <FiGlobe className="w-4 h-4 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Pays appelés</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Chart view toggle */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewCountry('bar')}
                          className={`p-1.5 rounded-lg ${chartViewCountry === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiBarChart2 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewCountry('pie')}
                          className={`p-1.5 rounded-lg ${chartViewCountry === 'pie' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiPieChart className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <motion.div 
                    key={chartViewCountry}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartViewCountry === 'bar' ? (
                        <BarChart 
                          data={countriesCalledData} 
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false}
                            tickLine={false}
                            width={60}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="value" 
                            fill="#8B5CF6" 
                            radius={[0, 4, 4, 0]}
                            name="Appels"
                          />
                        </BarChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={countriesCalledData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={30}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {countriesCalledData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                </motion.div>

                {/* Right Column - Average Call Duration Chart */}
                <motion.div
                  variants={chartContainerVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-green-100 rounded-lg">
                        <FiClock className="w-4 h-4 text-green-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Durée Moyenne par appel</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Chart view toggle */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewDuration('line')}
                          className={`p-1.5 rounded-lg ${chartViewDuration === 'line' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiTrendingUp className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewDuration('bar')}
                          className={`p-1.5 rounded-lg ${chartViewDuration === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiBarChart2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <motion.div 
                    key={chartViewDuration}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartViewDuration === 'line' ? (
                        <LineChart data={callDurationData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                            domain={[0, 'auto']}
                            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 } }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{ paddingTop: 15 }}
                            iconType="circle"
                            iconSize={8}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10B981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            name="Durée (min)"
                            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#6B7280"
                            strokeWidth={2}
                            name="Moyenne"
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={callDurationData}>
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
                            domain={[0, 'auto']}
                            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 } }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend 
                            wrapperStyle={{ paddingTop: 15 }}
                            iconType="circle"
                            iconSize={8}
                          />
                          <Bar 
                            dataKey="value" 
                            fill="#10B981" 
                            name="Durée (min)"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="average" 
                            fill="#6B7280" 
                            name="Moyenne"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Full Width Call Volume Chart */}
              <motion.div
                variants={chartContainerVariants}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                  <div className="flex items-center">
                    <div className="p-1.5 mr-2 bg-blue-100 rounded-lg">
                      <FiPhone className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Nombre d&apos;appels</h2>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Chart view toggle */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChartViewCalls('bar')}
                        className={`p-1.5 rounded-lg ${chartViewCalls === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                      >
                        <FiBarChart2 className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setChartViewCalls('line')}
                        className={`p-1.5 rounded-lg ${chartViewCalls === 'line' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                      >
                        <FiTrendingUp className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    
                    {/* Time period tabs */}
                    <ChartTabs 
                      activeTab={activeTabCalls} 
                      setActiveTab={setActiveTabCalls} 
                      tabs={callVolumeTabs}
                    />
                  </div>
                </div>
                
                {/* Chart */}
                <motion.div 
                  key={`${activeTabCalls}-${chartViewCalls}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-72"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    {chartViewCalls === 'bar' ? (
                      <BarChart data={getCallVolumeData()}>
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
                          dataKey="entrants" 
                          fill="#3B82F6" 
                          name="Entrants"
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                        <Bar 
                          dataKey="sortants" 
                          fill="#F97316" 
                          name="Sortants"
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                      </BarChart>
                    ) : (
                      <AreaChart data={getCallVolumeData()}>
                        <defs>
                          <linearGradient id="colorEntrants" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSortants" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
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
                          dataKey="entrants"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorEntrants)"
                          name="Entrants"
                          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sortants"
                          stroke="#F97316"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorSortants)"
                          name="Sortants"
                          activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </motion.div>

                {/* Call summary stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiPhoneIncoming className="text-blue-600 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Total Entrants</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">1,245</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiPhoneOutgoing className="text-orange-600 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Total Sortants</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">983</p>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiBarChart2 className="text-purple-600 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Ratio E/S</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">1.27</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiTrendingUp className="text-green-600 w-4 h-4" />
                      <span className="text-sm font-medium text-gray-700">Croissance</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">+12.4%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
