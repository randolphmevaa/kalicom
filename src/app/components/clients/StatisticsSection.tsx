// StatisticsSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiAward, FiCalendar, FiActivity } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { Stats } from './types';
import { formatValue } from './utils';

interface StatisticsSectionProps {
  stats: Stats;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Clients */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Clients</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</h3>
          </div>
          <div className="p-3 bg-indigo-100 rounded-lg">
            <FiUsers className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs font-medium text-gray-500">
              <span className="text-green-500 font-bold">+{stats.lastMonthNewClients}</span> nouveaux ce mois
            </div>
            <div className="text-xs font-medium text-gray-500">
              <FiCalendar className="inline mr-1" size={12} /> Mise à jour: aujourd&apos;hui
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active/Inactive Clients */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Clients Actifs</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.activeClients}</h3>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <FiUserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(stats.activeClients / stats.totalClients) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs font-medium text-gray-500">
              {Math.round((stats.activeClients / stats.totalClients) * 100)}% du total
            </div>
            <div className="text-xs font-medium text-gray-500">
              <span className="text-red-500 font-bold">{stats.inactiveClients}</span> inactifs
            </div>
          </div>
        </div>
      </motion.div>

      {/* VIP Clients */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Clients VIP</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.vipClients}</h3>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <FiAward className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${(stats.vipClients / stats.totalClients) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs font-medium text-gray-500">
              {Math.round((stats.vipClients / stats.totalClients) * 100)}% du total
            </div>
            <div className="text-xs font-medium text-gray-500">
              <span className="text-amber-500 font-bold">{stats.pendingClients}</span> en attente
            </div>
          </div>
        </div>
      </motion.div>

      {/* Total Value */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">Valeur Totale</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatValue(stats.totalValue)}</h3>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <FaEuroSign className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs font-medium text-gray-500">
              <span className="text-green-500 font-bold">+12%</span> vs dernier trimestre
            </div>
            <div className="text-xs font-medium text-gray-500">
              <FiActivity className="inline mr-1" size={12} /> Croissance stable
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsSection;