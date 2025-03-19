'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiGlobe,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiFilter,
  FiClock,
  FiPhone,
  FiBarChart2,
  FiRefreshCw,
  FiDownload,
  FiChevronDown,
  FiInfo,
  FiTrendingUp,
  FiSliders,
  FiFileText,
  FiZap,
  FiMaximize,
  FiMinimize,
  FiMap,
  FiPieChart,
  FiCheckCircle
} from 'react-icons/fi';
import {
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Define types for data structures
interface CountryData {
  name: string;
  value: number;
  id: string;
}

interface CountryDurationData {
  name: string;
  value: number;
  average: number;
  calls: number;
}

interface CallScatterData {
  name: string;
  x: number;
  y: number;
  z: number;
}

interface DateRangeItem {
  label: string;
  value: string;
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
        className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 transition-colors"
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
                className={`px-4 py-2 cursor-pointer flex items-center ${selectedRange === range.value ? 'bg-green-50 text-green-700' : ''}`}
                onClick={() => {
                  setSelectedRange(range.value);
                  setIsDropdownOpen(false);
                }}
              >
                <range.icon className="w-4 h-4 mr-2 text-gray-500" />
                {range.label}
                {selectedRange === range.value && (
                  <FiCheckCircle className="w-4 h-4 ml-auto text-green-600" />
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

export default function StatistiquesParPays() {
  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('last7days');
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [chartViewCountries, setChartViewCountries] = useState<'bar' | 'pie' | 'map'>('map');
  const [chartViewDuration, setChartViewDuration] = useState<'bar' | 'scatter'>('bar');
  
  // Sample data for countries called
  const countriesCalledData: CountryData[] = [
    { name: 'France', value: 124, id: 'FR' },
    { name: 'Allemagne', value: 87, id: 'DE' },
    { name: 'Espagne', value: 42, id: 'ES' },
    { name: 'Royaume-Uni', value: 35, id: 'GB' },
    { name: 'Italie', value: 28, id: 'IT' },
    { name: 'Belgique', value: 22, id: 'BE' },
    { name: 'Suisse', value: 18, id: 'CH' },
    { name: 'Pays-Bas', value: 15, id: 'NL' },
    { name: 'Portugal', value: 12, id: 'PT' },
    { name: 'Suède', value: 9, id: 'SE' },
  ];
  
  // Sample data for call duration by country
  const durationByCountryData: CountryDurationData[] = [
    { name: 'France', value: 245, average: 3.5, calls: 124 },
    { name: 'Allemagne', value: 187, average: 2.8, calls: 87 },
    { name: 'Espagne', value: 105, average: 2.5, calls: 42 },
    { name: 'Royaume-Uni', value: 98, average: 2.8, calls: 35 },
    { name: 'Italie', value: 78, average: 2.1, calls: 28 },
    { name: 'Belgique', value: 64, average: 2.9, calls: 22 },
    { name: 'Suisse', value: 55, average: 3.1, calls: 18 },
    { name: 'Pays-Bas', value: 42, average: 2.8, calls: 15 },
    { name: 'Portugal', value: 30, average: 2.5, calls: 12 },
    { name: 'Suède', value: 23, average: 2.6, calls: 9 },
  ];
  
  // Sample data for call scatter plot (for volume vs duration)
  const callScatterData: CallScatterData[] = durationByCountryData.map(country => ({
    name: country.name,
    x: country.calls,  // number of calls
    y: country.average,  // average duration
    z: country.value,  // total duration
  }));
  
  // Colors for charts
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
  
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

  // Handle export functions
  const handleExportPDF = () => {
    alert('Export en PDF initié');
  };

  const handleExportCSV = () => {
    alert('Export en CSV initié');
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
        <Breadcrumbs items={['PBX', 'Statistiques', 'Statistiques par pays']} />

        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 via-white/70 to-[#34D399]/10 rounded-3xl pointer-events-none" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#34D399]/10 rounded-full blur-3xl pointer-events-none"></div>
          
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
                    className="p-2.5 bg-[#10B981]/15 rounded-xl shadow-inner"
                  >
                    <FiGlobe className="w-6 h-6 text-[#10B981]" />
                  </motion.div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#059669] to-[#34D399]">
                    Statistiques par pays
                  </h1>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="px-2.5 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full shadow-sm border border-green-200"
                  >
                    {countriesCalledData.length} pays
                  </motion.div>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Consultez les statistiques d&apos;appels par pays. Analysez la répartition géographique du trafic
                  et identifiez les tendances par pays.
                </p>
              </div>
              
              <div className="flex space-x-3">
                {/* Export Button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition shadow-sm"
                >
                  <FiDownload className="mr-2" />
                  Exporter
                </motion.button>
                
                {/* Refresh Button with enhanced style */}
                <motion.button
                  whileHover={{ scale: 1.03, rotate: 30 }}
                  whileTap={{ scale: 0.97, rotate: 60 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition shadow-sm"
                >
                  <FiRefreshCw className="w-5 h-5" />
                </motion.button>
                
                {/* Settings Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-green-600 hover:border-green-200 transition shadow-sm"
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
              className="mt-6 flex items-start gap-3 p-4 bg-green-50/70 border border-green-100 rounded-xl text-sm backdrop-blur-sm shadow-inner"
            >
              <div className="p-1.5 bg-green-100 rounded-lg">
                <FiInfo className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <span className="font-medium text-green-800">Astuce :</span>{' '}
                <span className="text-green-700">
                  Utilisez les filtres pour affiner vos données par période ou par ligne. Les graphiques vous permettent d&apos;analyser la répartition des appels et des durées par pays.
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
              <Shimmer className="h-16 w-full rounded-xl" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Shimmer className="h-72 rounded-xl" />
                <Shimmer className="h-72 rounded-xl" />
              </div>
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
                    <div className="p-1.5 mr-2 bg-green-100 rounded-lg">
                      <FiFilter className="w-4 h-4 text-green-600" />
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
                              className="w-full appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-green-300 transition-colors shadow-sm"
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
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-xl transition-all flex items-center justify-center shadow-md hover:from-[#047857] hover:to-[#059669]"
                      >
                        <FiZap className="mr-2" />
                        Appliquer le filtre
                        <span className="ml-3 text-xs bg-white/20 px-2 py-0.5 rounded-md">
                          {countriesCalledData.reduce((acc, country) => acc + country.value, 0)} appels
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-500/5 rounded-full blur-xl pointer-events-none"></div>
              </motion.div>

              {/* Two Column Grid for Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Countries Called Chart */}
                <motion.div
                  variants={chartContainerVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-green-100 rounded-lg">
                        <FiGlobe className="w-4 h-4 text-green-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Pays appelés</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Chart view toggle */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewCountries('bar')}
                          className={`p-1.5 rounded-lg ${chartViewCountries === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiBarChart2 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewCountries('pie')}
                          className={`p-1.5 rounded-lg ${chartViewCountries === 'pie' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiPieChart className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewCountries('map')}
                          className={`p-1.5 rounded-lg ${chartViewCountries === 'map' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiMap className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <motion.div 
                    key={chartViewCountries}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-72"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartViewCountries === 'bar' ? (
                        <BarChart 
                          data={countriesCalledData.sort((a, b) => b.value - a.value)} 
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
                            fill="#10B981" 
                            radius={[0, 4, 4, 0]}
                            name="Appels"
                          />
                        </BarChart>
                      ) : chartViewCountries === 'pie' ? (
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
                      ) : (
                        <Treemap
                          data={countriesCalledData}
                          dataKey="value"
                          nameKey="name"
                          aspectRatio={4 / 3}
                          stroke="#fff"
                          fill="#10B981"
                        >
                          {
                            countriesCalledData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                          <Tooltip content={<CustomTooltip />} />
                        </Treemap>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                  
                  {/* Export buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <div className="text-sm text-gray-600">
                      {countriesCalledData.length} pays, {countriesCalledData.reduce((acc, country) => acc + country.value, 0)} appels
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExportPDF}
                        className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        <FiFileText className="mr-1.5 w-3.5 h-3.5" />
                        PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExportCSV}
                        className="flex items-center px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        <FiDownload className="mr-1.5 w-3.5 h-3.5" />
                        CSV
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Call Duration by Country Chart */}
                <motion.div
                  variants={chartContainerVariants}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 mr-2 bg-green-100 rounded-lg">
                        <FiClock className="w-4 h-4 text-green-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">Durée d&apos;appel par pays</h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Chart view toggle */}
                      <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewDuration('bar')}
                          className={`p-1.5 rounded-lg ${chartViewDuration === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiBarChart2 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setChartViewDuration('scatter')}
                          className={`p-1.5 rounded-lg ${chartViewDuration === 'scatter' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                        >
                          <FiTrendingUp className="w-3.5 h-3.5" />
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
                    className="h-72"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartViewDuration === 'bar' ? (
                        <BarChart 
                          data={durationByCountryData.sort((a, b) => b.value - a.value).slice(0, 7)} 
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
                            fill="#3B82F6" 
                            radius={[0, 4, 4, 0]}
                            name="Min. totales"
                          />
                        </BarChart>
                      ) : (
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Nombre d'appels" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Durée moy. (min)" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                          />
                          <ZAxis 
                            type="number" 
                            dataKey="z" 
                            range={[50, 400]} 
                            name="Durée totale" 
                          />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Scatter 
                            name="Pays" 
                            data={callScatterData} 
                            fill="#10B981" 
                            shape="circle"
                          >
                            {callScatterData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                  
                  {/* Legend/info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600 flex items-start">
                      <FiInfo className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                      <p>
                        {chartViewDuration === 'bar' 
                          ? 'Ce graphique montre la durée totale des appels par pays, en minutes.' 
                          : 'Ce graphique montre la relation entre le nombre d\'appels (axe X) et la durée moyenne (axe Y). La taille des cercles représente la durée totale.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
