'use client';

import React, { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';


// ===== System Health Indicator Component =====
interface SystemHealthIndicatorProps {
    label: string;
    value: number | string;
    color: string;
    icon: ReactNode;
    suffix?: string;
    showProgress?: boolean;
    progress?: number;
  }
  
  export const SystemHealthIndicator = memo(function SystemHealthIndicator({ 
    label, 
    value, 
    color, 
    icon, 
    suffix = '', 
    showProgress = false, 
    progress = 0 
  }: SystemHealthIndicatorProps) {
    return (
      <motion.div 
        className="flex items-center bg-white/15 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300"
        whileHover={{ y: -3, x: 2, boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="relative">
          <div className="p-3 rounded-full shadow-lg" style={{ 
            backgroundColor: `${color}40`,
            boxShadow: `0 0 20px 0 ${color}30`
          }}>
            {icon}
          </div>
          
          {showProgress && (
            <svg className="absolute -inset-1.5 rotate-[-90deg]" width="calc(100% + 12px)" height="calc(100% + 12px)" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`${color}30`}
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeDasharray={`${progress * 2.827} 282.7`}
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium opacity-90">{label}</div>
          <div className="flex items-baseline">
            <span className="text-lg font-bold">{value}</span>
            <span className="text-sm opacity-80 ml-0.5">{suffix}</span>
          </div>
        </div>
      </motion.div>
    );
  });

  