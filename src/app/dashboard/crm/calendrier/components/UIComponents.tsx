import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiAlertCircle, 
  FiX, 
  FiInfo, 
  FiClock,
  FiSun,
  FiCloud,
  FiCloudRain,
  FiCloudSnow
} from 'react-icons/fi';
import {
  TooltipProps,
  StatusBadgeProps,
  WeatherIndicatorProps,
  StatusColorsType,
  SizeClassesType,
  WeatherIconsType,
  EventType,
  EventCategoriesType,
  EventStyleType
} from '../CalendarInterfaces';

// Enhanced tooltip component
export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className={`absolute ${positionClasses[position]} z-50 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none`}
      >
        {content}
        <div className={`absolute ${
          position === 'top' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45' :
          position === 'bottom' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45' :
          position === 'left' ? 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45' :
          'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45'
        } w-2 h-2 bg-gray-800`}></div>
      </motion.div>
    </div>
  );
};

// Status badge component
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const statusColors: StatusColorsType = {
    success: { bg: 'bg-green-100', text: 'text-green-700', icon: <FiCheck className="w-3 h-3" /> },
    warning: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FiAlertCircle className="w-3 h-3" /> },
    error: { bg: 'bg-red-100', text: 'text-red-700', icon: <FiX className="w-3 h-3" /> },
    info: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiInfo className="w-3 h-3" /> },
    pending: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <FiClock className="w-3 h-3" /> },
  };

  const sizeClasses: SizeClassesType = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  const statusStyle = statusColors[status] || statusColors.info;

  return (
    <span className={`${sizeClasses[size]} rounded-full font-medium inline-flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
      {statusStyle.icon}
      {text}
    </span>
  );
};

// Weather indicator component (visual only for demo)
export const WeatherIndicator: React.FC<WeatherIndicatorProps> = ({ condition = 'clear', temperature = 22 }) => {
  const weatherIcons: WeatherIconsType = {
    clear: <FiSun className="text-amber-500" />,
    cloudy: <FiCloud className="text-gray-500" />,
    rain: <FiCloudRain className="text-blue-500" />,
    snow: <FiCloudSnow className="text-blue-200" />,
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      {weatherIcons[condition]}
      <span>{temperature}°C</span>
    </div>
  );
};

// Utility function to calculate event styles
export const getEventStyle = (event: EventType, eventCategories: EventCategoriesType): EventStyleType => {
  const category = eventCategories[event.category];
  const color = category ? category.color : '#4F46E5';
  
  const isPast = new Date(event.end) < new Date();
  const opacity = isPast ? '0.6' : '1';
  
  return {
    backgroundColor: `${color}15`,
    borderLeft: `3px solid ${color}`,
    opacity
  };
};

// Helper for formatting time
export const formatTime = (date: Date): string => {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Function to check if two dates are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Calculate event position (for week/day views)
export const calculateEventPosition = (
  event: EventType, 
  dayStart: number | Date, 
  dayEnd: number | Date
): { top: number; height: number } => {
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  
  let top = 0;
  let height = 0;
  
  // Ensure dayStart and dayEnd are Date objects
  const dayStartDate = typeof dayStart === 'number' ? new Date(dayStart) : dayStart;
  const dayEndDate = typeof dayEnd === 'number' ? new Date(dayEnd) : dayEnd;
  
  // Calculate display time (clipped to day if needed)
  const displayStart = eventStart < dayStartDate ? dayStartDate : eventStart;
  const displayEnd = eventEnd > dayEndDate ? dayEndDate : eventEnd;
  
  // Calculate top position and height in percent
  const dayMinutes = (dayEndDate.getTime() - dayStartDate.getTime()) / (1000 * 60);
  const startMinutes = (displayStart.getTime() - dayStartDate.getTime()) / (1000 * 60);
  const endMinutes = (displayEnd.getTime() - dayStartDate.getTime()) / (1000 * 60);
  
  top = (startMinutes / dayMinutes) * 100;
  height = ((endMinutes - startMinutes) / dayMinutes) * 100;
  
  // Minimum height for visibility
  height = Math.max(height, 1.5);
  
  return { top, height };
};