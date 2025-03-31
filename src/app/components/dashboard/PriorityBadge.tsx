'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiTriangle, FiArrowUpRight, FiActivity, FiArrowDownRight, FiHelpCircle } from 'react-icons/fi';

interface PriorityBadgeProps {
  priority: string;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  let color, bgColor, borderColor, icon;
  
  switch(priority.toLowerCase()) {
    case 'critique':
      color = 'text-red-700';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      icon = <FiTriangle className="w-3 h-3" />;
      break;
    case 'haute':
      color = 'text-orange-700';
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
      icon = <FiArrowUpRight className="w-3 h-3" />;
      break;
    case 'moyenne':
      color = 'text-amber-700';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      icon = <FiActivity className="w-3 h-3" />;
      break;
    case 'basse':
      color = 'text-green-700';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      icon = <FiArrowDownRight className="w-3 h-3" />;
      break;
    default:
      color = 'text-gray-700';
      bgColor = 'bg-gray-50';
      borderColor = 'border-gray-200';
      icon = <FiHelpCircle className="w-3 h-3" />;
  }
  
  return (
    <motion.span 
      whileHover={{ y: -1, x: 0 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${color} ${bgColor} border ${borderColor}`}
    >
      {icon} {priority}
    </motion.span>
  );
};

export default PriorityBadge;