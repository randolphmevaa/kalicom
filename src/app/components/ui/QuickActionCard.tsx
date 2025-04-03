'use client';

import React, { memo, ReactNode } from 'react';
import { motion } from 'framer-motion';

// ===== Quick Action Card Component =====
interface QuickActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    color: string;
    onClick?: () => void;
    pulse?: boolean;
    href?: string;
  }
  
  export const QuickActionCard = memo(function QuickActionCard({ 
    icon, 
    title, 
    description, 
    color, 
    onClick, 
    pulse = false, 
    href 
  }: QuickActionCardProps) {
    const CardWrapper = ({ children }: { children: ReactNode }) => {
      return href ? (
        <a href={href} className="block h-full">{children}</a>
      ) : (
        <div onClick={onClick} className="h-full cursor-pointer">{children}</div>
      );
    };
  
    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        whileTap={{ y: 0, boxShadow: '0 5px 15px -5px rgba(0, 0, 0, 0.1)' }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full"
      >
        <CardWrapper>
          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
            <div className="relative">
              {pulse && (
                <span 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: color }}
                ></span>
              )}
              <div 
                className="p-3 rounded-lg mb-2 relative z-10" 
                style={{ backgroundColor: `${color}20`, color }}
              >
                {icon}
              </div>
            </div>
            <h3 className="text-sm font-semibold mb-1 text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </CardWrapper>
      </motion.div>
    );
  });

