'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiClock, FiInfo, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';
import { Statistic } from '../types';

// Animation variants for containers and items
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//     },
//   },
// };

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
};

const statCardVariants = {
  hover: {
    y: -5,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const StatisticsCards: React.FC = () => {
  // Sample statistics data
  const statistics: Statistic[] = [
    {
      title: 'Total facturé',
      value: '72 530,00 €',
      icon: <FaEuroSign className="text-green-500" />,
      trend: '+12.4%',
      trendUp: true,
    },
    {
      title: 'En attente',
      value: '12 790,00 €',
      icon: <FiClock className="text-amber-500" />,
      trend: '-3.8%',
      trendUp: false,
    },
    {
      title: 'En retard',
      value: '12 440,00 €',
      icon: <FiInfo className="text-red-500" />,
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: 'Payées',
      value: '47 300,00 €',
      icon: <FiCheck className="text-blue-500" />,
      trend: '+8.7%',
      trendUp: true,
    },
  ];

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