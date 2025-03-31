'use client';

import { motion } from 'framer-motion';
import { FiSun, FiMapPin, FiRefreshCw, FiMoreHorizontal } from 'react-icons/fi';
// import { ReactNode } from 'react';

// Define the WeatherData interface
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
}

// Define props for the component
interface WeatherWidgetProps {
  data: WeatherData;
  darkMode?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const WeatherWidget = ({ 
  data, 
  darkMode = false, 
  onRefresh,
  className = '' 
}: WeatherWidgetProps) => {
  return (
    <div 
      className={`flex flex-col overflow-hidden relative ${className}`}
      style={{
        borderRadius: '1.2rem',
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1f35 0%, #2c3e67 100%)' 
          : 'linear-gradient(135deg, #b1d8f8 0%, #e2f1fd 100%)',
        boxShadow: darkMode 
          ? '0 12px 24px -8px rgba(0, 0, 0, 0.3)' 
          : '0 12px 24px -8px rgba(37, 99, 235, 0.15)',
        border: darkMode 
          ? '1px solid rgba(59, 130, 246, 0.2)' 
          : '1px solid rgba(219, 234, 254, 0.8)'
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '6px 6px'
        }} 
      />

      {/* Animated blur circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-2xl bg-blue-400 animate-pulse-slow"></div>
      <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full opacity-20 blur-3xl bg-sky-300 animate-pulse-slow animation-delay-1000"></div>

      {/* Header with redesigned style */}
      <div className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotateZ: 30, scale: 1.1 }}
            className={`p-2 rounded-full backdrop-blur-md ${
              darkMode ? 'bg-white/10' : 'bg-white/60'
            }`}
          >
            <FiSun className={`w-5 h-5 ${
              darkMode ? 'text-yellow-300' : 'text-yellow-500'
            }`} />
          </motion.div>
          <h3 className={`font-medium ${
            darkMode ? 'text-white/90' : 'text-gray-800'
          }`}>
            Météo
          </h3>
        </div>
        
        <div className={`text-xs px-2 py-1 rounded-full ${
          darkMode ? 'bg-white/10 text-white/80' : 'bg-white/70 text-gray-700'
        } backdrop-blur-md`}>
          Maintenant
        </div>
      </div>
      
      {/* iOS-inspired weather display */}
      <div className="px-5 pb-5 pt-2 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <h2 className={`text-4xl font-extralight ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {data.temperature}°
                <span className={`text-sm font-medium align-top ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>C</span>
              </h2>
              <div className={`text-xs ${
                darkMode ? 'text-blue-300' : 'text-blue-600'
              }`}>
                {data.high}° / {data.low}°
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`mt-1 text-sm ${
                darkMode ? 'text-white/80' : 'text-gray-700'
              }`}
            >
              {data.condition}
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1 flex justify-end items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="relative">
              {data.condition.toLowerCase().includes('nuag') ? (
                <div className="relative">
                  <motion.div 
                    animate={{ y: [0, -2, 0] }} 
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-1 -left-8 text-5xl"
                  >
                    ☁️
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, -3, 0] }} 
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                    className="text-6xl"
                  >
                    ⛅
                  </motion.div>
                </div>
              ) : data.condition.toLowerCase().includes('pluie') ? (
                <div className="relative">
                  <div className="text-6xl">🌧️</div>
                  <motion.div 
                    animate={{ 
                      y: [0, 20], 
                      opacity: [1, 0]
                    }} 
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      staggerChildren: 0.2
                    }}
                    className="absolute top-8 left-4 text-blue-500 font-bold"
                  >
                    💧
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="text-6xl"
                >
                  ☀️
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Location bar with iOS-style */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`
            mt-2 flex items-center justify-between p-3 rounded-xl backdrop-blur-md
            ${darkMode ? 'bg-white/10' : 'bg-white/60'}
          `}
        >
          <div className="flex items-center gap-2">
            <div className={`
              p-1.5 rounded-full
              ${darkMode ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-100 text-blue-600'}
            `}>
              <FiMapPin className="w-3 h-3" />
            </div>
            <span className={`text-sm font-medium ${darkMode ? 'text-white/90' : 'text-gray-700'}`}>
              {data.location}
            </span>
          </div>
          
          <div className="flex gap-1">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRefresh}
              className={`
                p-1.5 rounded-full cursor-pointer
                ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-white/80 hover:bg-white text-gray-600'}
                transition-colors
              `}
            >
              <FiRefreshCw className="w-3 h-3" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-1.5 rounded-full cursor-pointer
                ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-white/80 hover:bg-white text-gray-600'}
                transition-colors
              `}
            >
              <FiMoreHorizontal className="w-3 h-3" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Forecast bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`
            mt-3 rounded-xl overflow-hidden backdrop-blur-md
            ${darkMode ? 'bg-white/10' : 'bg-white/60'}
          `}
        >
          <div className="grid grid-cols-5 divide-x divide-opacity-20 divide-gray-400">
            {['8h', '12h', '16h', '20h', '00h'].map((time, index) => (
              <div key={index} className="p-2 text-center relative">
                <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                  {time}
                </div>
                <div className="text-lg mb-1">
                  {index === 0 ? '☀️' : 
                  index === 1 ? '⛅' : 
                  index === 2 ? '☁️' : 
                  index === 3 ? '🌥️' : '🌙️'}
                </div>
                <div className={`text-xs font-medium ${darkMode ? 'text-white/90' : 'text-gray-700'}`}>
                  {Math.round(data.temperature - 2 + index * 2)}°
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Glass reflection effect */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};