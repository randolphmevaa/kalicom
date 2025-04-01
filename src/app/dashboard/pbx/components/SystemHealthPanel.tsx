'use client';

import { motion } from 'framer-motion';
import { 
  FiServer, 
  FiActivity, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiCalendar, 
  FiShield, 
  FiWifi, 
  FiCpu 
} from 'react-icons/fi';
import SystemHealthIndicator from './SystemHealthIndicator';

const SystemHealthPanel = () => {
  return (
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
            icon={<FiWifi className="w-5 h-5 text-white" />}
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
        
        {/* System security status */}
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
  );
};

export default SystemHealthPanel;