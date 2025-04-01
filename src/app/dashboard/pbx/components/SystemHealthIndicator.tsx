'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface SystemHealthIndicatorProps {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
  suffix?: string;
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({
  label,
  value,
  color,
  icon,
  suffix = '',
}) => (
  <motion.div 
    className="flex items-center bg-white/10 backdrop-blur-sm p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
    whileHover={{ y: -3, x: 2 }}
  >
    <div className="p-3 rounded-full shadow-lg" style={{ backgroundColor: `${color}30` }}>
      {icon}
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="text-lg font-bold">
        {value}
        {suffix}
      </div>
    </div>
  </motion.div>
);

export default SystemHealthIndicator;