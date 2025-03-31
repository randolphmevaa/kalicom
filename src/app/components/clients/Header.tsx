// Header.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBarChart2, FiPlus } from 'react-icons/fi';
import { Stats } from './types';
import { formatValue } from './utils';

interface HeaderProps {
  stats: Stats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-2xl p-8 shadow-2xl mb-6 relative overflow-hidden backdrop-blur-sm"
      style={{ 
        background: "linear-gradient(135deg, rgba(75, 178, 246, 0.95) 0%, rgba(0, 74, 200, 0.95) 60%, rgba(27, 3, 83, 0.95) 100%)",
        boxShadow: "0 10px 25px -5px rgba(27, 3, 83, 0.3), 0 8px 10px -6px rgba(27, 3, 83, 0.2)"
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        {/* Background pattern */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </svg>
      </div>
      
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white bg-opacity-20 p-2 rounded-lg"
            >
              <FiUsers className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
          </div>
          <p className="text-white text-opacity-90 mt-2 max-w-lg">
            Gérez votre base clients, consultez l&apos;historique des interactions et des transactions, et développez vos relations commerciales.
          </p>
          
          {/* Stats Bar */}
          <div className="mt-6 flex space-x-6">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <div className="text-white text-opacity-80 text-sm">Total</div>
              <div className="text-white font-bold text-xl">{stats.totalClients}</div>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <div className="text-white text-opacity-80 text-sm">Actifs</div>
              <div className="text-white font-bold text-xl">{stats.activeClients}</div>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <div className="text-white text-opacity-80 text-sm">Valeur totale</div>
              <div className="text-white font-bold text-xl">{formatValue(stats.totalValue)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white text-indigo-900 px-5 py-3 rounded-lg shadow-lg font-medium"
          >
            <FiBarChart2 />
            <span>Statistiques</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-lg shadow-lg font-medium"
          >
            <FiPlus />
            <span>Ajouter un client</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;