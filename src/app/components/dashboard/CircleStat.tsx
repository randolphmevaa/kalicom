import { motion } from "framer-motion";
import { ReactNode } from "react";

// Interface for CircleStat component
interface CircleStatProps {
  icon: ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
  label?: string;
  value?: string | number;
}

// Enhanced Circle Stat component with more sophisticated animations
export const CircleStat = ({ icon, color, size = 'md', pulse = false, onClick, label, value }: CircleStatProps) => {
  // CircleStat implementation...
  const sizeClasses = {
    sm: { container: 'w-12 h-12', icon: 'w-5 h-5', label: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'w-6 h-6', label: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8', label: 'text-base' },
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative ${sizeClasses[size].container} rounded-full flex items-center justify-center ${
          onClick ? 'cursor-pointer' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${color}25 0%, ${color}05 100%)`,
          boxShadow: `0 10px 15px -3px ${color}15, 0 4px 6px -2px ${color}10, 0 0 0 1px ${color}20 inset`,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Blurred background circles for depth */}
        <div className="absolute w-full h-full rounded-full opacity-40 blur-xl" style={{ 
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          top: '10%',
          left: '10%',
        }}></div>
        
        <div className={`${sizeClasses[size].icon} flex items-center justify-center relative z-10`} style={{ color }}>
          {icon}
        </div>
        
        {/* Gloss effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[100%] opacity-10 bg-gradient-to-br from-white to-transparent"></div>
        </div>
        
        {/* Subtle border */}
        <div className="absolute inset-0 rounded-full border border-white/20"></div>
        
        {pulse && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-30 duration-1000"
              style={{ backgroundColor: color, animationDuration: '3s' }}
            ></span>
            <span
              className="absolute inset-0 rounded-full animate-pulse opacity-20 duration-700"
              style={{ 
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, 
                animationDuration: '2s' 
              }}
            ></span>
          </>
        )}
      </motion.div>
      
      {label && value !== undefined && (
        <div className="mt-2 text-center">
          <div className={`font-medium text-gray-800 ${sizeClasses[size].label}`}>{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      )}
    </div>
  );
};

