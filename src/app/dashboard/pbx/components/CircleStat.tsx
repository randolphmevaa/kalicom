'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface CircleItem {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
  isActionable?: boolean;
  percentage?: number;
}

interface CircleStatProps {
  item: CircleItem;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showLabel?: boolean;
}

const CircleStat: React.FC<CircleStatProps> = ({ 
  item, 
  size = 'md', 
  onClick, 
  showLabel = false 
}) => {
  // Size classes based on the size prop
  const sizeClasses = {
    sm: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    md: { container: 'w-20 h-20', icon: 'w-8 h-8' },
    lg: { container: 'w-24 h-24', icon: 'w-10 h-10' },
  };

  return (
    <motion.div
      whileHover={item.isActionable ? { scale: 1.08, rotate: 3 } : { scale: 1.05 }}
      whileTap={item.isActionable ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`relative ${sizeClasses[size].container} rounded-full flex flex-col items-center justify-center ${
        item.isActionable ? 'cursor-pointer shadow-md hover:shadow-xl' : 'shadow-sm'
      }`}
      style={{ 
        backgroundColor: `${item.color}15`, 
        border: `2px solid ${item.color}50`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* Progress circle if percentage is provided */}
      {item.percentage !== undefined && (
        <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={`gradient-${item.label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={`${item.color}`} />
              <stop offset="100%" stopColor={`${item.color}90`} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`${item.color}20`}
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={`url(#gradient-${item.label})`}
            strokeWidth="6"
            strokeDasharray={`${item.percentage * 2.89} 289`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
      )}
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`${sizeClasses[size].icon} text-gray-700 flex items-center justify-center`} style={{ color: item.color }}>
          {item.icon}
        </div>
        
        {showLabel && (
          <div className="absolute -bottom-8 text-xs font-medium text-gray-600 whitespace-nowrap">
            {item.label}: <span className="font-bold">{item.value}</span>
          </div>
        )}
      </div>
      
      {/* Glowing effect for actionable items */}
      {item.isActionable && (
        <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-all duration-300"></span>
      )}

      {/* Pulse animation for important metrics */}
      {item.label === 'Manqué' && item.percentage && item.percentage > 30 && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20 duration-1000" style={{ animationDuration: '3s' }}></span>
      )}
    </motion.div>
  );
};

export default CircleStat;