'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiActivity, FiClock, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color, bgColor, icon, borderColor;
  
  switch(status.toLowerCase()) {
    case 'nouveau':
    case 'à faire':
      color = 'text-blue-700';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      icon = <FiAlertCircle className="w-3 h-3" />;
      break;
    case 'en cours':
      color = 'text-amber-700';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      icon = <FiActivity className="w-3 h-3" />;
      break;
    case 'en attente':
    case 'planifié':
      color = 'text-purple-700';
      bgColor = 'bg-purple-50';
      borderColor = 'border-purple-200';
      icon = <FiClock className="w-3 h-3" />;
      break;
    case 'résolu':
    case 'terminée':
      color = 'text-green-700';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      icon = <FiCheckCircle className="w-3 h-3" />;
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
      {icon} {status}
    </motion.span>
  );
};

export default StatusBadge;