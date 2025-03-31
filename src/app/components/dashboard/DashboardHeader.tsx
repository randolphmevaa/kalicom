'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiSun,
  FiMoon,
  FiRefreshCw,
  FiBell,
  FiSettings,
  FiDownload,
  FiPlus,
  FiUsers,
  FiUserPlus,
  FiTarget,
  FiHeadphones,
  FiCalendar,
  FiMessageSquare,
  FiSearch
} from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa6';

// Define TypeScript interfaces for our data
interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bgClass: string;
  hoverClass: string;
  textClass: string;
  badge?: number | null;
  badgeColor?: string;
}

interface NotificationData {
  id: number;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: string;
}

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: number) => void;
}

interface AnimatedValueProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

// NotificationItem component
const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  // Notification type icon and styling logic
  let color, bgColor, icon;
  
  switch(notification.type) {
    case 'critical':
      color = 'text-red-600';
      bgColor = 'bg-red-100';
      icon = <FiAlertCircle className="w-4 h-4" />;
      break;
    case 'reminder':
      color = 'text-amber-600';
      bgColor = 'bg-amber-100';
      icon = <FiClock className="w-4 h-4" />;
      break;
    case 'success':
      color = 'text-green-600';
      bgColor = 'bg-green-100';
      icon = <FiCheckCircle className="w-4 h-4" />;
      break;
    case 'info':
    default:
      color = 'text-blue-600';
      bgColor = 'bg-blue-100';
      icon = <FiInfo className="w-4 h-4" />;
      break;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 border-b border-gray-100 flex items-start gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
    >
      <div className={`p-2 ${bgColor} rounded-full flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-sm text-gray-800">{notification.title}</h4>
          {!notification.read && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 bg-blue-100 text-blue-600 rounded-full"
            >
              <FiCheck className="w-3 h-3" />
            </motion.button>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-1">{notification.content}</p>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <FiClock className="w-3 h-3" /> Il y a {notification.time}
        </div>
      </div>
    </motion.div>
  );
};

// AnimatedValue component
const AnimatedValue: React.FC<AnimatedValueProps> = ({ 
    value, 
    suffix = '', 
    prefix = '', 
    duration = 2 
  }) => {
    const counterRef = useRef<HTMLSpanElement>(null);
    
    useEffect(() => {
      const start = 0;
      const end = parseInt(value.toString());
      
      // If it's not a number, just display it directly
      if (isNaN(end)) {
        if (counterRef.current) {
          counterRef.current.innerText = `${prefix}${value}${suffix}`;
        }
        return;
      }
      
      const stepTime = Math.abs(Math.floor(duration * 1000 / end));
      
      if (counterRef.current) {
        let current = start;
        const timer = setInterval(() => {
          current += 1;
          if (counterRef.current) {
            counterRef.current.innerText = `${prefix}${current}${suffix}`;
          }
          if (current >= end) {
            clearInterval(timer);
            if (counterRef.current) {
              counterRef.current.innerText = `${prefix}${value}${suffix}`;
            }
          }
        }, stepTime);
        
        return () => clearInterval(timer);
      }
    }, [value, duration, prefix, suffix]);
    
    return <span ref={counterRef}>{prefix}{0}{suffix}</span>;
  };

// FiInfo icon component (custom)
const FiInfo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// FiAlertCircle and FiCheckCircle components
const FiAlertCircle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const FiCheckCircle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const FiCheck: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FiClock: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

interface DashboardHeaderProps {
  darkMode: boolean;
  setDarkMode: (state: boolean) => void;
  totalProspects: number;
  totalTickets: number;
  openTickets: number;
  chatMessagesCount: number;
  unreadMessages: number;
  lastClientCount?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  darkMode,
  setDarkMode,
  totalProspects,
  totalTickets,
  openTickets,
  chatMessagesCount,
  unreadMessages,
  lastClientCount = 45
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Sample notification data
  const [notifications, setNotifications] = useState<NotificationData[]>([
    { id: 1, title: 'Ticket critique non assigné', content: 'TK-4871 - Nexus Technologies attend une réponse', time: '15 min', read: false, type: 'critical' },
    { id: 2, title: 'Rappel de réunion', content: 'Démo produit à 15h00', time: '30 min', read: false, type: 'reminder' },
    { id: 3, title: 'Nouvel utilisateur', content: 'Julien Petit a rejoint l\'équipe', time: '2h', read: true, type: 'info' },
    { id: 4, title: 'Mise à jour système', content: 'Version 2.5 déployée avec succès', time: '5h', read: true, type: 'success' },
  ]);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Header gradient based on theme
  const headerGradient = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-indigo-600/10 via-[#004AC8]/10 to-purple-600/10';
  
  // Handle refresh with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };
  
  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };
  
  // Stats data
  const statsData: StatItem[] = [
    { 
      icon: <FiUsers />, 
      label: "Prospects", 
      value: totalProspects, 
      color: "#4F46E5",
      bgClass: "from-indigo-100 to-indigo-50",
      hoverClass: "hover:border-indigo-200",
      textClass: "group-hover:text-indigo-600"
    },
    { 
      icon: <FiUserPlus />, 
      label: "Clients", 
      value: lastClientCount, 
      color: "#10B981",
      bgClass: "from-green-100 to-green-50",
      hoverClass: "hover:border-green-200",
      textClass: "group-hover:text-green-600"
    },
    { 
      icon: <FiTarget />, 
      label: "Conversion", 
      value: "32%", 
      color: "#8B5CF6",
      bgClass: "from-purple-100 to-purple-50",
      hoverClass: "hover:border-purple-200",
      textClass: "group-hover:text-purple-600"
    },
    { 
      icon: <FiHeadphones />, 
      label: "Tickets", 
      value: totalTickets, 
      color: "#F59E0B",
      bgClass: "from-amber-100 to-amber-50",
      hoverClass: "hover:border-amber-200",
      textClass: "group-hover:text-amber-600",
      badge: openTickets > 0 ? openTickets : null,
      badgeColor: "#F59E0B"
    },
    { 
      icon: <FiCalendar />, 
      label: "Événement", 
      value: "5", 
      color: "#6366F1",
      bgClass: "from-indigo-100 to-indigo-50",
      hoverClass: "hover:border-indigo-200",
      textClass: "group-hover:text-indigo-600"
    },
    { 
      icon: <FiMessageSquare />, 
      label: "Messages", 
      value: chatMessagesCount, 
      color: "#EF4444",
      bgClass: "from-rose-100 to-rose-50",
      hoverClass: "hover:border-rose-200",
      textClass: "group-hover:text-rose-600",
      badge: unreadMessages > 0 ? unreadMessages : null,
      badgeColor: "#EF4444"
    },
    { 
      icon: <FaEuroSign />, 
      label: "CA mensuel", 
      value: "45K€", 
      color: "#0EA5E9",
      bgClass: "from-blue-100 to-blue-50",
      hoverClass: "hover:border-blue-200",
      textClass: "group-hover:text-blue-600"
    },
  ];

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className={`relative overflow-hidden rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-100'
      }`}
    >
      {/* Background gradient with enhanced effects */}
      <div className={`absolute inset-0 ${headerGradient} pointer-events-none`}></div>
      
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4BB2F6]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
      
      {/* Subtle pattern overlay with animation */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(#4F46E5 0.5px, transparent 0.5px), radial-gradient(#004AC8 0.5px, transparent 0.5px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}
      ></div>
      
      <div className="relative p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <motion.div 
              className="flex items-center gap-3 mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <motion.div 
                className={`p-3 rounded-xl shadow-md overflow-hidden ${
                  darkMode ? 'bg-gradient-to-br from-indigo-600/30 to-[#004AC8]/20' : 
                  'bg-gradient-to-br from-indigo-600/20 to-[#004AC8]/20'
                }`}
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <FiHome className={`w-7 h-7 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </motion.div>
              <div>
                <motion.h1 
                  className={`text-3xl font-bold drop-shadow-sm ${
                    darkMode ? 'text-white' : 'text-indigo-900'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Bienvenue sur votre Tableau de Bord
                </motion.h1>
                <motion.p 
                  className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }).charAt(0).toUpperCase() + 
                  new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }).slice(1)} | Dernière connexion: il y a 2 heures
                </motion.p>
              </div>
            </motion.div>
            <motion.p 
              className={`text-sm mt-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Votre espace unifié pour gérer vos prospects, suivre les performances téléphoniques, 
              résoudre les tickets support et organiser vos tâches quotidiennes.
            </motion.p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-sm ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-800/30 to-[#004AC8]/30 border-indigo-700/30' 
                  : 'bg-gradient-to-r from-indigo-500/10 to-[#004AC8]/10 border-indigo-500/20'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse"></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tous les systèmes opérationnels
              </span>
            </motion.div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all shadow-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95, rotate: 30 }}
                onClick={handleRefresh}
                className={`p-3 rounded-xl transition-all shadow-md ${
                  isRefreshing 
                    ? darkMode 
                      ? 'bg-blue-700 text-blue-300 shadow-blue-900/50' 
                      : 'bg-blue-100 text-blue-700 shadow-blue-200'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                disabled={isRefreshing}
              >
                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3 rounded-xl transition-all shadow-md ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${unreadNotifications > 0 ? 'relative' : ''}`}
                >
                  <FiBell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </motion.button>
                
                <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl z-50 overflow-hidden ${
                      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                    }`}
                  >
                    <div className={`p-3 font-medium flex justify-between items-center border-b ${
                      darkMode ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        <FiBell className="w-4 h-4" />
                        <span>Notifications</span>
                        {unreadNotifications > 0 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {unreadNotifications} nouvelles
                          </span>
                        )}
                      </div>
                      <button className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Tout marquer comme lu
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markNotificationAsRead}
                        />
                      ))}
                    </div>
                    <div className={`p-3 text-center ${
                      darkMode ? 'border-t border-gray-700' : 'border-t border-gray-100'
                    }`}>
                      <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/dashboard/reglages'}
                className={`p-3 rounded-xl transition-all shadow-md ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiSettings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Highlights with enhanced animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 mt-8">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)' }}
              className={`${darkMode 
                ? 'bg-gray-800/90 border-gray-700 group hover:border-gray-600' 
                : `bg-white/90 backdrop-blur-sm border border-gray-100 ${stat.hoverClass}`
              } p-4 rounded-xl shadow-md flex items-center gap-4 group transition-all duration-300 relative`}
            >
              <div className={`p-3 bg-gradient-to-br ${
                darkMode ? 'from-gray-700 to-gray-800' : stat.bgClass
              } rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}>
                <div className={`w-5 h-5 ${darkMode ? 'text-gray-300' : `text-${stat.color}`} ${stat.textClass}`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${stat.textClass} transition-colors`}>
                  {stat.label}
                </div>
                <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <AnimatedValue value={stat.value} />
                </div>
              </div>
              {stat.badge && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse"
                  style={{ backgroundColor: stat.badgeColor }}>
                  {stat.badge}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Global Search & Quick Links */}
        <div className="flex flex-wrap justify-between items-center mt-8 gap-y-4">
          <div className="relative">
            <div className="flex items-center">
              <div className={`relative ${isSearchActive ? 'w-64' : 'w-48'} transition-all duration-300`}>
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className={`w-full text-sm rounded-lg pl-10 pr-4 py-2 ${
                    darkMode 
                      ? 'bg-gray-700/80 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-indigo-500' 
                      : 'bg-white/90 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500'
                  } transition-all`}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                />
                <FiSearch className={`absolute left-3 top-2.5 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            
            <AnimatePresence>
              {isSearchActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scaleY: 0.8 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: 10, scaleY: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full left-0 mt-2 w-full rounded-xl shadow-xl z-50 p-3 ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recherches récentes
                  </div>
                  <div className="space-y-2">
                    {['Nexus Technologies', 'Ticket TK-4871', 'Rapport mensuel', 'Configuration PBX'].map((item, i) => (
                      <div 
                        key={i} 
                        className={`text-sm p-2 rounded-lg cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border shadow-sm hover:shadow transition-all ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' 
                    : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white hover:text-indigo-600'
                }`}
              >
                <FiDownload className="w-3.5 h-3.5" />
                Exporter les données
              </motion.button>
              
              {exportDropdownOpen && (
                <div 
                  className={`fixed mt-2 w-40 rounded-md ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } shadow-lg focus:outline-none z-50`}
                  style={{
                    top: 'auto',
                    left: 'auto',
                    transform: 'translateY(0)',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        // Create and download PDF
                        const dummyLink = document.createElement('a');
                        dummyLink.href = 'data:application/pdf;charset=utf-8,';
                        dummyLink.download = `tableau-de-bord_${new Date().toISOString().split('T')[0]}.pdf`;
                        document.body.appendChild(dummyLink);
                        dummyLink.click();
                        document.body.removeChild(dummyLink);
                        setExportDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Exporter en PDF
                    </button>
                    <button
                      onClick={() => {
                        // Create and download CSV
                        const dummyLink = document.createElement('a');
                        dummyLink.href = 'data:text/csv;charset=utf-8,';
                        dummyLink.download = `tableau-de-bord_${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(dummyLink);
                        dummyLink.click();
                        document.body.removeChild(dummyLink);
                        setExportDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Exporter en CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                  darkMode 
                    ? 'bg-gradient-to-r from-indigo-700 to-[#004AC8]' 
                    : 'bg-gradient-to-r from-indigo-600 to-[#004AC8]'
                }`}
              >
                <FiPlus className="w-3.5 h-3.5" />
                Nouvelle action
              </motion.button>
              
              {actionDropdownOpen && (
                <div 
                  className={`fixed mt-2 w-56 rounded-md ${
                    darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  } shadow-lg focus:outline-none z-50`}
                  style={{
                    top: 'auto',
                    left: 'auto',
                    transform: 'translateY(0)',
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}
                >
                  <div className="py-1">
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard/crm/prospects';
                        setActionDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Nouveau prospect
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard/clients';
                        setActionDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Nouveau client
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard/support-tickets';
                        setActionDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Nouveau ticket
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard/crm/calendrier';
                        setActionDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      Nouvel événement
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;