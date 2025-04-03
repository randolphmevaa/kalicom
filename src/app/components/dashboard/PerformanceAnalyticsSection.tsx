'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiUserPlus, FiPhoneCall, FiTarget, FiChevronRight, FiTrendingUp, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { CircleStat } from '@/app/components/dashboard/CircleStat';
import { AnimatedCard } from '@/app/components/ui/AnimatedCard';

// Interfaces - could be imported from a types file
interface PerformanceProps {
  darkMode: boolean;
  timeRange: string;
  setTimeRange: (range: string) => void;
  prospectData: { name: string; prospects: number; leads: number; clients: number }[];
  totalCalls: number;
}

export const PerformanceAnalyticsSection = memo(function PerformanceAnalyticsSection({
  darkMode,
  timeRange,
  setTimeRange,
  prospectData,
  totalCalls
}: PerformanceProps) {
  // These calculations could be moved to a custom hook for better organization
  const getTimeRangeData = () => {
    switch(timeRange) {
      case 'today':
        return {
          chartData: [
            { name: '9h', prospects: 5, leads: 3, clients: 2 },
            { name: '12h', prospects: 4, leads: 3, clients: 1 },
            { name: '15h', prospects: 6, leads: 4, clients: 3 },
            { name: '18h', prospects: 3, leads: 2, clients: 1 }
          ],
          insightText: "Aujourd'hui, votre taux de conversion est supérieur de 2.8% à la moyenne journalière.",
          stats: {
            prospects: 18,
            trend: '+5.2%',
            calls: 35,
            callsTrend: '+3.1%',
            conversion: '29%',
            conversionTrend: '+2.8%',
            revenue: '28K€',
            revenueTrend: '+4.7%'
          }
        };
      case 'week':
        return {
          chartData: [
            { name: 'Lun', prospects: 12, leads: 8, clients: 5 },
            { name: 'Mar', prospects: 10, leads: 6, clients: 4 },
            { name: 'Mer', prospects: 8, leads: 5, clients: 3 },
            { name: 'Jeu', prospects: 15, leads: 9, clients: 5 },
            { name: 'Ven', prospects: 18, leads: 11, clients: 7 }
          ],
          insightText: "Cette semaine, le taux de clôture des prospects s'est amélioré de 4.2% par rapport à la semaine dernière.",
          stats: {
            prospects: 45,
            trend: '+8.7%',
            calls: 143,
            callsTrend: '+6.4%',
            conversion: '31%',
            conversionTrend: '+4.2%',
            revenue: '76K€',
            revenueTrend: '+9.3%'
          }
        };
      case 'custom':
        return {
          chartData: [
            { name: '01/03', prospects: 15, leads: 9, clients: 6 },
            { name: '02/03', prospects: 12, leads: 7, clients: 5 },
            { name: '03/03', prospects: 14, leads: 8, clients: 6 },
            { name: '04/03', prospects: 10, leads: 6, clients: 4 },
            { name: '05/03', prospects: 16, leads: 10, clients: 7 }
          ],
          insightText: "Sur la période sélectionnée, vos performances sont 7% au-dessus des objectifs fixés.",
          stats: {
            prospects: 23,
            trend: '+7.3%',
            calls: 86,
            callsTrend: '+5.7%',
            conversion: '30%',
            conversionTrend: '+3.9%',
            revenue: '54K€',
            revenueTrend: '+8.1%'
          }
        };
      case 'month':
      default:
        return {
          chartData: prospectData,
          insightText: "Vos taux de conversion augmentent de 15% par rapport au mois précédent, avec une efficacité prospect-client en hausse.",
          stats: {
            prospects: prospectData[prospectData.length-1].prospects,
            trend: '+12.5%',
            calls: totalCalls,
            callsTrend: '+8.2%',
            conversion: '32%',
            conversionTrend: '+5.4%',
            revenue: '132K€',
            revenueTrend: '+15.8%'
          }
        };
    }
  };

  const { chartData, insightText, stats } = getTimeRangeData();

  return (
    <AnimatedCard className="p-6 flex flex-col h-full" delay={0.1}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiActivity />} 
            color="#4F46E5" 
            size="sm" 
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Performance Globale
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Prospection et Communication
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className={`p-1 rounded-xl flex flex-wrap ${darkMode ? 'bg-gray-700' : 'bg-gray-100/80'}`}>
            {['today', 'week', 'month', 'custom'].map((period) => (
              <motion.button
                key={period}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTimeRange(period);
                  // Add custom date range modal trigger for 'custom' option
                  if (period === 'custom') {
                    // This would typically open a date picker or modal
                    console.log('Opening custom date range selector');
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeRange === period
                    ? darkMode 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-indigo-100 text-indigo-700 shadow-lg'
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-600' 
                      : 'text-gray-600 hover:bg-gray-200/50'
                }`}
              >
                {period === 'today' ? 'Aujourd\'hui' : 
                period === 'week' ? 'Semaine' : 
                period === 'month' ? 'Mois' : 'Personnaliser'}
              </motion.button>
            ))}
          </div>
          
          {timeRange === 'custom' && (
            <CustomDateRangePicker darkMode={darkMode} setTimeRange={setTimeRange} />
          )}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard 
          label="Nouveaux Prospects"
          value={stats.prospects}
          trend={stats.trend}
          trendUp={true}
          color="indigo"
          icon={<FiUserPlus className="w-4 h-4" />}
          darkMode={darkMode}
        />
        <StatCard 
          label="Total Appels"
          value={stats.calls}
          trend={stats.callsTrend}
          trendUp={true}
          color="blue"
          icon={<FiPhoneCall className="w-4 h-4" />}
          darkMode={darkMode}
        />
        <StatCard 
          label="Taux de Conversion"
          value={stats.conversion}
          trend={stats.conversionTrend}
          trendUp={true}
          color="green"
          icon={<FiTarget className="w-4 h-4" />}
          darkMode={darkMode}
        />
        <StatCard 
          label="CA Potentiel"
          value={stats.revenue}
          trend={stats.revenueTrend}
          trendUp={true}
          color="amber"
          icon={<FaEuroSign className="w-4 h-4" />}
          darkMode={darkMode}
        />
      </div>
      
      {/* Chart with flex-grow to fill available space */}
      <div className="flex-grow relative min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProspects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={darkMode ? "#6366F1" : "#4F46E5"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={darkMode ? "#6366F1" : "#4F46E5"} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={darkMode ? "#3B82F6" : "#004AC8"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={darkMode ? "#3B82F6" : "#004AC8"} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorClients" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor={darkMode ? "#F59E0B" : "#F59E0B"} stopOpacity={1}/>
                <stop offset="95%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} stopOpacity={1}/>
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
              </filter>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              opacity={0.2} 
              stroke={darkMode ? "#6B7280" : "#E2E8F0"} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
              tickLine={false}
              axisLine={{ stroke: darkMode ? "#4B5563" : "#E2E8F0" }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              cursor={{ fill: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
              contentStyle={{ 
                backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: 'none',
                padding: '8px',
                color: darkMode ? '#E5E7EB' : '#1F2937'
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: darkMode ? '#D1D5DB' : '#4B5563', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
            <Bar 
              yAxisId="left" 
              dataKey="prospects" 
              fill="url(#colorProspects)" 
              radius={[4, 4, 0, 0]} 
              barSize={16} 
              name="Prospects" 
              filter="url(#shadow)"
            />
            <Bar 
              yAxisId="left" 
              dataKey="leads" 
              fill="url(#colorLeads)" 
              radius={[4, 4, 0, 0]} 
              barSize={16} 
              name="Suivis" 
              filter="url(#shadow)"
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="clients" 
              stroke="url(#colorClients)" 
              strokeWidth={3} 
              dot={{ 
                r: 4, 
                strokeWidth: 2, 
                fill: darkMode ? '#1F2937' : '#FFFFFF',
                stroke: darkMode ? '#F59E0B' : '#F59E0B' 
              }} 
              activeDot={{ 
                r: 6, 
                strokeWidth: 2,
                fill: darkMode ? '#1F2937' : '#FFFFFF',
                stroke: darkMode ? '#F59E0B' : '#F59E0B',
                strokeOpacity: 0.8
              }} 
              name="Clients" 
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Floating insight card */}
        <div className={`absolute top-0 right-0 p-3 rounded-lg shadow-lg max-w-xs ${
          darkMode ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/90 backdrop-blur-sm border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1 rounded ${darkMode ? 'bg-indigo-800/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
              <FiTrendingUp className="w-3 h-3" />
            </div>
            <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Insight
            </div>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {insightText}
          </p>
        </div>
      </div>
      
      {/* View details button */}
      <div className={`mt-3 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Dernière mise à jour: il y a 5 minutes
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className={`text-xs font-medium flex items-center gap-1 transition-opacity ${
            darkMode ? 'text-indigo-400 opacity-70 hover:opacity-100' : 'text-indigo-600 opacity-70 hover:opacity-100'
          }`}
        >
          Voir les performances détaillées <FiChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </AnimatedCard>
  );
});

// Helper components
interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  color: string;
  icon: React.ReactNode;
  darkMode: boolean;
}

const StatCard = memo(function StatCard({
  label, value, trend, trendUp, color, icon, darkMode
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)' }}
      className={`${darkMode 
        ? `bg-gradient-to-br from-${color}-900/30 to-${color}-800/20 border border-${color}-700/30` 
        : `bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200`
      } p-3 rounded-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-1.5 rounded-lg ${darkMode ? `bg-${color}-800/50 text-${color}-400` : `bg-${color}-200/80 text-${color}-700`}`}>
          {icon}
        </div>
        <div className={`text-xs ${darkMode ? `text-${color}-400` : `text-${color}-700`}`}>
          {label}
        </div>
      </div>
      <div className={`text-xl font-bold ${darkMode ? 'text-white' : `text-${color}-800`}`}>
        {value}
      </div>
      <div className={`text-xs flex items-center gap-1 mt-1 ${
        trendUp 
          ? darkMode ? `text-${color}-400` : `text-${color}-600` 
          : darkMode ? 'text-red-400' : 'text-red-600'
      }`}>
        {trendUp 
          ? <FiArrowUpRight className="w-3 h-3" /> 
          : <FiArrowDownRight className="w-3 h-3" />
        }
        {trend}
      </div>
    </motion.div>
  );
});

interface CustomDateRangePickerProps {
  darkMode: boolean;
  setTimeRange: (range: string) => void;
}

const CustomDateRangePicker = memo(function CustomDateRangePicker({
  darkMode, setTimeRange
}: CustomDateRangePickerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-16 right-6 z-20 p-4 rounded-xl shadow-xl backdrop-blur-sm border border-gray-200"
      style={{
        background: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium mb-1">Sélectionner une période</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Début</label>
            <input 
              type="date" 
              className={`p-2 text-xs rounded-lg w-full ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
              } border`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fin</label>
            <input 
              type="date" 
              className={`p-2 text-xs rounded-lg w-full ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
              } border`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Annuler
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              darkMode 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Appliquer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default PerformanceAnalyticsSection;