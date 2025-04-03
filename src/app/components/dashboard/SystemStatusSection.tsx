'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiWifi, FiCpu, FiActivity, FiTrendingUp, FiCalendar, FiEye, FiCheckCircle } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SystemHealthIndicator } from '@/app/components/ui/SystemHealthIndicator';

// Import the CallDataItem interface from your data file
import { CallDataItem } from '@/app/data/dashboardData';

interface SystemStatusSectionProps {
  darkMode: boolean;
  callData: CallDataItem[];
}

export const SystemStatusSection = memo(function SystemStatusSection({
  darkMode,
  callData
}: SystemStatusSectionProps) {
  return (
    <motion.div 
      className="relative overflow-hidden p-0 flex flex-col h-full rounded-xl shadow-md" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      style={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 30%, #312E81 70%, #4338CA 100%)' 
          : 'linear-gradient(135deg, #004AC8 0%, #1B0353 50%, #4BB2F6 100%)'
      }}
    >
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

      <div className="relative p-5 text-white flex flex-col h-full justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-lg">
                <FiServer className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold">État du Système</h3>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg shadow-black/10"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Tous les services actifs</span>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <SystemHealthIndicator
              label="Qualité VoIP"
              value={98.7}
              suffix="%"
              color="#4BB2F6"
              icon={<FiWifi className="w-5 h-5 text-white" />}
              showProgress={true}
              progress={98.7}
            />
            <SystemHealthIndicator
              label="Charge Serveurs"
              value={32}
              suffix="%"
              color="#ffffff"
              icon={<FiCpu className="w-5 h-5 text-white" />}
              showProgress={true}
              progress={32}
            />
          </div>
        </div>
        
        {/* Event timeline */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FiActivity className="w-4 h-4" />
            Derniers événements système
          </h4>
          <div className="space-y-2">
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
        
        {/* Monthly summary */}
        <div className="mt-4 pt-3 border-t border-white/20 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Performance mensuelle</h4>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Mars 2025</span>
          </div>
          
          <div className="flex-grow min-h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="appels" 
                  stroke="#fff" 
                  strokeWidth={2}
                  fill="url(#areaGradient)" 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center">
          <span className="text-xs opacity-80">
            Dernière vérification: il y a 5 minutes
          </span>
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
          >
            <FiEye className="w-3.5 h-3.5" />
            Tableau détaillé
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default SystemStatusSection;