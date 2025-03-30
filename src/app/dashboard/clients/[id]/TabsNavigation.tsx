import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiCreditCard,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiChevronRight,
  FiChevronLeft,
  FiCheck
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';

// Tab interface
interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  completed?: boolean;
  disabled?: boolean;
}

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => {
  // Define all available tabs
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Identification',
      icon: <FiHome className="w-5 h-5" />,
      completed: true
    },
    {
      id: 'facturation',
      label: 'Facturation',
      icon: <FaEuroSign className="w-5 h-5" />,
      completed: true
    },
    {
      id: 'reglements',
      label: 'Règlements/Solvabilité',
      icon: <FiCreditCard className="w-5 h-5" />
    },
    {
      id: 'comptabilite',
      label: 'Comptabilité',
      icon: <FiBriefcase className="w-5 h-5" />
    },
    {
      id: 'facture-electronique',
      label: 'Facture électronique',
      icon: <FiFileText className="w-5 h-5" />
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      icon: <FiSettings className="w-5 h-5" />
    }
  ];

  // For horizontal scroll in mobile
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollAmount = 200;

  const scrollLeft = () => {
    const container = document.getElementById('tabs-container');
    if (container) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      setScrollPosition(newPosition);
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('tabs-container');
    if (container) {
      const newPosition = Math.min(
        container.scrollWidth - container.clientWidth,
        scrollPosition + scrollAmount
      );
      setScrollPosition(newPosition);
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  // Update scroll button visibility based on scroll position
  useEffect(() => {
    const container = document.getElementById('tabs-container');
    if (container) {
      const checkScrollButtons = () => {
        setShowLeftArrow(container.scrollLeft > 10);
        setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
      };

      checkScrollButtons();

      container.addEventListener('scroll', checkScrollButtons);
      
      // Check when tab changes to ensure the active tab is visible
      const activeTabElement = document.getElementById(`tab-${activeTab}`);
      if (activeTabElement) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTabElement.getBoundingClientRect();

        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }

      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [activeTab]);

  return (
    <div className="relative mb-12">
      {/* Decorative top bar with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1B0353] to-[#004AC8] rounded-t-lg" />

      {/* Main container with glass effect */}
      <div className="relative rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-gray-100 pt-1">
        {/* Scroll buttons */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md p-2 text-gray-700 hover:text-[#004AC8] hover:shadow-lg transition-all duration-200 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            >
              <FiChevronLeft className="w-5 h-5" />
            </motion.button>
          )}

          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={scrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md p-2 text-gray-700 hover:text-[#004AC8] hover:shadow-lg transition-all duration-200 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
              style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            >
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Tabs container with scrolling */}
        <div 
          id="tabs-container"
          className="flex items-center overflow-x-auto no-scrollbar px-4 py-2 md:px-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex space-x-2 md:space-x-4">
            {tabs.map((tab) => (
              <motion.button
                id={`tab-${tab.id}`}
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tab.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
                whileHover={activeTab !== tab.id && !tab.disabled ? { scale: 1.03 } : {}}
                whileTap={activeTab !== tab.id && !tab.disabled ? { scale: 0.97 } : {}}
              >
                {/* Active tab background with gradient */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#1B0353] to-[#004AC8]"
                    style={{
                      boxShadow: '0 5px 15px rgba(0, 74, 200, 0.25)',
                    }}
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}

                {/* Inactive tab hover effect */}
                {activeTab !== tab.id && !tab.disabled && (
                  <div className="absolute inset-0 rounded-lg bg-gray-100 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                )}
                
                {/* Tab content */}
                <div className={`relative flex items-center z-10 ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>
                  <div className="mr-2 relative">
                    {tab.icon}
                    
                    {/* Completion indicator */}
                    {tab.completed && activeTab !== tab.id && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                        <FiCheck className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  
                  {/* Badge if needed */}
                  {tab.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Animated indicator line */}
        <div className="relative h-1 overflow-hidden bg-gray-100">
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#1B0353] to-[#004AC8]"
            style={{ 
              width: `${100 / tabs.length}%`,
              boxShadow: '0 0 8px rgba(0, 74, 200, 0.5)'
            }}
            animate={{
              x: `${tabs.findIndex(tab => tab.id === activeTab) * 100}%`
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          />
        </div>
      </div>
      
      {/* Path breadcrumb */}
      <div className="flex items-center mt-4 text-sm text-gray-600 ml-4">
        <span className="text-gray-500">Fiche client</span>
        <FiChevronRight className="mx-2 text-gray-400 w-4 h-4" />
        <span className="font-medium text-[#004AC8]">
          {tabs.find(tab => tab.id === activeTab)?.label || ''}
        </span>
      </div>
    </div>
  );
};

export default TabsNavigation;