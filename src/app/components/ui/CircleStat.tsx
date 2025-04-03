'use client';

import React, { memo, ReactNode } from 'react';
// import { motion } from 'framer-motion';

// ===== CircleStat Component =====
interface CircleStatProps {
    icon: ReactNode;
    color: string;
    size?: 'sm' | 'md' | 'lg';
    pulse?: boolean;
  }
  
  export const CircleStat = memo(function CircleStat({ 
    icon, 
    color, 
    size = 'md', 
    pulse = false 
  }: CircleStatProps) {
    // Size mapping for different dimensions
    const sizeMap = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };
    
    const iconSizeMap = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    
    return (
      <div 
        className={`${sizeMap[size]} relative flex items-center justify-center rounded-full`}
        style={{ backgroundColor: `${color}20` }}
      >
        {pulse && (
          <span 
            className="absolute inset-0 rounded-full animate-ping opacity-75" 
            style={{ backgroundColor: `${color}30` }}
          ></span>
        )}
        <div 
          className={`${iconSizeMap[size]} flex items-center justify-center`} 
          style={{ color }}
        >
          {icon}
        </div>
      </div>
    );
  });

