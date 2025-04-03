'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiRefreshCw, FiClock, FiHeadphones, FiUserPlus, FiPhoneCall, FiClipboard } from 'react-icons/fi';
import { CircleStat } from '@/app/components/dashboard/CircleStat';
import { AnimatedCard } from '@/app/components/ui/AnimatedCard';

// Import the ActivityData interface from your data file
import { ActivityData } from '@/app/data/dashboardData';

interface ActivityFeedSectionProps {
  darkMode: boolean;
  activitiesData: ActivityData[];
}

// Activity Item component
const ActivityItem = ({ activity, darkMode }: { activity: ActivityData, darkMode: boolean }) => {
  let color, bgColor, icon;
  
  switch(activity.type) {
    case 'ticket':
      color = darkMode ? 'text-purple-400' : 'text-purple-600';
      bgColor = darkMode ? 'bg-purple-900/20' : 'bg-purple-100';
      icon = <FiHeadphones className="w-3.5 h-3.5" />;
      break;
    case 'prospect':
      color = darkMode ? 'text-indigo-400' : 'text-indigo-600';
      bgColor = darkMode ? 'bg-indigo-900/20' : 'bg-indigo-100';
      icon = <FiUserPlus className="w-3.5 h-3.5" />;
      break;
    case 'call':
      color = darkMode ? 'text-blue-400' : 'text-blue-600';
      bgColor = darkMode ? 'bg-blue-900/20' : 'bg-blue-100';
      icon = <FiPhoneCall className="w-3.5 h-3.5" />;
      break;
    case 'task':
      color = darkMode ? 'text-amber-400' : 'text-amber-600';
      bgColor = darkMode ? 'bg-amber-900/20' : 'bg-amber-100';
      icon = <FiClipboard className="w-3.5 h-3.5" />;
      break;
    default:
      color = darkMode ? 'text-gray-400' : 'text-gray-600';
      bgColor = darkMode ? 'bg-gray-900/20' : 'bg-gray-100';
      icon = <FiActivity className="w-3.5 h-3.5" />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
        darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`p-2 ${bgColor} rounded-full flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-1 mb-0.5">
          <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activity.user}
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {activity.action}
          </span>
          <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {activity.target}
          </span>
          {activity.duration && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1 flex items-center gap-1`}>
              <FiClock className="w-3 h-3" /> {activity.duration}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <FiClock className="w-3 h-3" />
          <span>il y a {activity.time}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const ActivityFeedSection = memo(function ActivityFeedSection({
  darkMode,
  activitiesData
}: ActivityFeedSectionProps) {
  return (
    <AnimatedCard className="flex flex-col flex-1" delay={0.2}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiActivity />} 
            color={darkMode ? "#3B82F6" : "#004AC8"} 
            size="sm" 
            pulse={true}
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Activité Récente
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Dernières actions de l&apos;équipe
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          className={`p-2 rounded-full ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          } transition-colors`}
        >
          <FiRefreshCw className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.button>
      </div>
      
      {/* Activity timeline */}
      <div className="px-4 py-2 flex-1 overflow-y-auto" style={{ maxHeight: '220px' }}>
        <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Aujourd&apos;hui
        </div>
        <div className="space-y-1">
          {activitiesData.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} darkMode={darkMode} />
          ))}
        </div>
      </div>
      
      <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-center`}>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}
        >
          Voir toutes les activités
        </motion.button>
      </div>
    </AnimatedCard>
  );
});

export default ActivityFeedSection;