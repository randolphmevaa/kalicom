// app/dashboard/pbx/components/DashboardCard.tsx
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowUp, FiArrowDown, FiActivity, FiArrowRight } from 'react-icons/fi';
import CircleStat, { CircleItem } from './CircleStat';

export interface DashboardCardProps {
  title: string;
  description: string;
  value: number | string;
  icon: ReactNode;
  trend: string;
  chart?: ReactNode;
  circles?: CircleItem[];
  type?: 'calls' | 'duration' | 'direct';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description,
  value, 
  icon, 
  trend, 
  chart,
  circles,
  type
}) => {
  const router = useRouter();
  
  // Function to handle click on actionable circles (for Nombre d'appels)
  const handleCircleClick = (label: string) => {
    if (type === 'calls') {
      // Redirect to journal-appels with filter parameter
      router.push(`/dashboard/pbx/journal-appels?filter=${label.toLowerCase()}`);
    }
  };

  // Render circles layout based on the type of card
  const renderCircles = () => {
    if (!circles) return null;
    
    // For the "calls" type, use a 2x2 grid layout
    if (type === 'calls') {
      return (
        <div className="relative pt-8 pb-6">
          <div className="grid grid-cols-2 gap-5">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat 
                  item={circle} 
                  onClick={() => circle.isActionable ? handleCircleClick(circle.label) : null}
                />
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added decorative element */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gray-100 opacity-60"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-px bg-gray-100 opacity-60"></div>
        </div>
      );
    }
    
    // For "duration" type, use a 2x1 grid layout
    if (type === 'duration') {
      return (
        <div className="pt-8 pb-2">
          <div className="flex items-center justify-around">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat item={circle} />
                <div className="mt-3 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added decorative vertical line */}
          <div className="my-2 w-full h-px bg-gray-100"></div>
        </div>
      );
    }
    
    // For "direct" type, use a 2x2 grid layout
    if (type === 'direct') {
      return (
        <div className="relative pt-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {circles.map((circle, index) => (
              <div key={index} className="flex flex-col items-center">
                <CircleStat item={circle} size="sm" />
                <div className="mt-2 flex flex-col items-center">
                  <span className="text-xs font-medium text-gray-500">{circle.label}</span>
                  <span className="text-lg font-bold" style={{ color: `${circle.color}` }}>{circle.value}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Added light grid background */}
          <div className="absolute inset-0 bg-gray-50 bg-opacity-30 rounded-lg -z-10"></div>
        </div>
      );
    }
    
    // Default fallback
    return (
      <div className="flex flex-wrap justify-center gap-5 py-4">
        {circles.map((circle, index) => (
          <div key={index} className="flex flex-col items-center">
            <CircleStat item={circle} />
            <div className="mt-3 text-xs font-medium text-gray-500">{circle.label}: <span className="font-bold">{circle.value}</span></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10"></div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg shadow-sm" style={{ 
              background: `linear-gradient(135deg, ${icon ? '#004AC815' : '#f8fafc'}, ${icon ? '#004AC805' : '#f8fafc'})` 
            }}>
              {icon}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-800">{title}</h4>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-800 tracking-tight">{value}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
              trend.startsWith('+') 
                ? 'bg-green-100 text-green-700' 
                : trend === 'Stable' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-red-100 text-red-700'
            }`}>
              {trend.startsWith('+') ? <FiArrowUp className="w-3 h-3" /> : 
               trend === 'Stable' ? <FiActivity className="w-3 h-3" /> : 
               <FiArrowDown className="w-3 h-3" />}
              {trend}
            </span>
          </div>
        </div>
      </div>
      
      {/* Chart or circles with improved spacing */}
      <div className={`${circles ? 'mt-2' : 'mt-6'}`}>
        {circles ? renderCircles() : chart}
      </div>
      
      {/* Add subtle divider */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className="text-xs text-[#004AC8] font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          Plus de détails <FiArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardCard;