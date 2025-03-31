'use client';

import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation"; // Changed from next/router
import { ReactNode, useEffect } from "react";

// Define interfaces for component props
interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  color: string;
  description?: string;
  onClick?: () => void;
  pulse?: boolean;
  href: string;
}

// Enhanced Quick Action Card with fancy animations
export const QuickActionCard = ({ icon, title, color, description, onClick, pulse = false, href }: QuickActionCardProps) => {
  const router = useRouter();
  const controls = useAnimation();

  const pulseAnimation = async () => {
    if (pulse) {
      while (true) {
        await controls.start({
          boxShadow: `0 0 0 2px ${color}25, 0 8px 16px -2px ${color}20`,
          scale: 1.02,
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        await controls.start({
          boxShadow: `0 0 0 0px ${color}10, 0 4px 8px -2px ${color}10`,
          scale: 1,
          transition: { duration: 1.5, ease: "easeInOut" }
        });
      }
    }
  };

  useEffect(() => {
    if (pulse) {
      pulseAnimation();
    }
  }, [pulse, controls]); // Added controls to dependency array

  // Add a new handler that combines the original onClick with navigation
  const handleClick = () => {
    // Execute the original onClick if provided
    if (onClick) onClick();
    
    // Navigate to the href
    router.push(href);
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        boxShadow: `0 20px 30px -10px ${color}20`,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} // Use the new handler instead of just onClick
      animate={controls}
      className="bg-white p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl"
      style={{ 
        boxShadow: `0 5px 15px -3px ${color}10`,
        border: `1px solid ${color}15`,
      }}
    >
      <div className="relative mb-3">
        <div className={`p-3.5 rounded-xl w-14 h-14 flex items-center justify-center mb-3 bg-gradient-to-br`} style={{ 
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
        }}>
          <div className="text-xl" style={{ color }}>{icon}</div>
        </div>
        {pulse && (
          <span 
            className="absolute top-0 right-0 w-3 h-3 rounded-full animate-ping" 
            style={{ background: color, animationDuration: '3s' }}
          ></span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </motion.div>
  );
};
