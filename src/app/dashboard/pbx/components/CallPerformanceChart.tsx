'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line 
} from 'recharts';
import { motion } from 'framer-motion';
import { FiActivity, FiArrowRight, FiClock, FiFilter, FiMousePointer } from 'react-icons/fi';

export interface CallData {
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

export interface TimePeriod {
  id: string;
  label: string;
}

interface ChartClickData {
  activePayload?: { payload: CallData }[];
}

interface CallPerformanceChartProps {
  data: CallData[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  onDataPointClick: (data: ChartClickData) => void;
  timePeriods: TimePeriod[];
}

const CallPerformanceChart: React.FC<CallPerformanceChartProps> = ({
  data,
  selectedPeriod,
  onPeriodChange,
  onDataPointClick,
  timePeriods
}) => {
  return (
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
                onClick={() => onPeriodChange(period.id)}
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
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            onClick={onDataPointClick}
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
  );
};

export default CallPerformanceChart;