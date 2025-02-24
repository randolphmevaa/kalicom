'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface WidgetProps {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ReactNode;
  color: string;
  chart: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, value, change, icon, color, chart }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center"
    >
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`${color} p-2 rounded-lg`}>{icon}</div>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {change && (
          <span className={`text-sm ${
            change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {change} vs last month
          </span>
        )}
      </div>
      <div className="ml-4">{chart}</div>
    </motion.div>
  );
};

export default Widget;
