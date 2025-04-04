// StatisticsCards.tsx
'use client';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface Statistic {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

interface StatisticsCardsProps {
  statistics: Statistic[];
  itemVariants: Variants;
  statCardVariants: Variants;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  statistics,
  itemVariants,
  statCardVariants,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {statistics.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 md:p-7 rounded-2xl shadow-md transition-all duration-300 flex flex-col"
          whileHover="hover"
          variants={statCardVariants}
        >
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: 'rgba(27, 3, 83, 0.1)' }}
              >
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-gray-500">
                {stat.title}
              </span>
            </div>
            <div
              className={`text-xs font-medium flex items-center ${
                stat.trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stat.trendUp ? (
                <FiArrowUp size={14} className="mr-1" />
              ) : (
                <FiArrowDown size={14} className="mr-1" />
              )}
              {stat.trend}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {stat.value}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatisticsCards;