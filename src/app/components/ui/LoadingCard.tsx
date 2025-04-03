'use client';

import React, { memo } from 'react';
// import { motion } from 'framer-motion';


// ===== Loading Card Component =====
interface LoadingCardProps {
    height?: string;
    hasHeader?: boolean;
  }
  
  export const LoadingCard = memo(function LoadingCard({ 
    height = "h-64", 
    hasHeader = true 
  }: LoadingCardProps) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
        {hasHeader && (
          <div className="p-4 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        )}
        <div className={`${height} p-4`}>
          <div className="h-full flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  });

  