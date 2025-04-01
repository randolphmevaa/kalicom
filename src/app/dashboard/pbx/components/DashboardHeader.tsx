'use client';

import { motion } from 'framer-motion';
import { 
  FiMonitor, 
  FiRefreshCw, 
  FiSettings, 
  FiDownload, 
  FiPhoneCall, 
  FiPhoneIncoming, 
  FiClock, 
  FiActivity 
} from 'react-icons/fi';

interface DashboardHeaderProps {
  title: string;
  description: string;
  stats: {
    totalCalls: number;
    responseRate: number;
    avgTime: string;
    activity: string;
  };
  isRefreshing: boolean;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  stats,
  isRefreshing,
  onRefresh
}) => {
  return (
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
                {title}
              </h1>
            </motion.div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {description}
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
                onClick={onRefresh}
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
              <div className="text-xl font-bold text-gray-800">{stats.totalCalls}</div>
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
                {stats.responseRate}%
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
              <div className="text-xl font-bold text-gray-800">{stats.avgTime}</div>
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
                  stats.activity
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
  );
};

export default DashboardHeader;