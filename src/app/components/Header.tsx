// app/components/Header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiPhone,
  FiHome,
  FiMonitor,
  FiPlusCircle,
  FiSearch,
  FiMail,
  FiBell,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Define proper types for user information
interface UserData {
  name?: string;
  role?: string;
  company?: string;
}

interface UserInfo {
  email?: string;
  isLoggedIn?: boolean;
  timestamp?: number;
  user?: UserData;
}

type HeaderProps = {
  sidebarWidth: number;
};

export default function Header({ sidebarWidth }: HeaderProps) {
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Fetch user info from localStorage
  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const proInfo = localStorage.getItem('proInfo');
        if (proInfo) {
          const userData = JSON.parse(proInfo) as UserInfo;
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserInfo();
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('proInfo');
    
    // Redirect to login page
    router.push('/');
  };
  
  // Get user initials
  const getUserInitials = () => {
    if (userInfo?.user?.name) {
      const nameParts = userInfo.user.name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    return 'JD'; // Default fallback
  };
  
  // Get user display name
  const getUserName = () => {
    return userInfo?.user?.name || 'Jean Dupont';
  };
  
  // Get user role
  const getUserRole = () => {
    return userInfo?.user?.role || 'Administrateur';
  };

  return (
    <header
      className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 fixed top-0 z-40"
      style={{
        left: sidebarWidth, // starts after the sidebar
        width: `calc(100% - ${sidebarWidth}px)`, // adjusts width based on sidebar
      }}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center group cursor-pointer">
              <FiPhone className="w-6 h-6 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors" />
              <span className="text-xs font-medium mt-1 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors">
                Webphone
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center group cursor-pointer">
              <FiHome className="w-6 h-6 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors" />
              <span className="text-xs font-medium mt-1 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors">
                Tableau de bord
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center group cursor-pointer">
              <FiMonitor className="w-6 h-6 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors" />
              <span className="text-xs font-medium mt-1 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors">
                Parc téléphonique
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center group cursor-pointer">
              <FiPlusCircle className="w-6 h-6 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors" />
              <span className="text-xs font-medium mt-1 text-[#004AC8] group-hover:text-[#4BB2F6] transition-colors">
                Commander
              </span>
            </motion.div>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <motion.div
                initial={{ width: 240 }}
                animate={{ width: 240 }}
                className="bg-gray-50 rounded-xl px-4 py-2 flex items-center space-x-3 shadow-inner"
              >
                <FiSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher appels, contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full placeholder-gray-400 text-sm"
                />
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 relative"
              >
                <FiMail className="w-5 h-5" />
                <div className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
                  <div className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 relative"
              >
                <FiBell className="w-5 h-5" />
                <div className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-blue-500 flex">
                  <div className="absolute inline-flex w-full h-full bg-blue-500 rounded-full opacity-75 animate-ping"></div>
                </div>
              </motion.button>

              {/* User profile with dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.div 
                  className="flex items-center space-x-2 cursor-pointer py-1 px-0.5"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', borderRadius: '0.5rem' }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-medium flex items-center">
                      {getUserName()}
                      <FiChevronDown className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} size={14} />
                    </div>
                    <div className="text-xs">{getUserRole()}</div>
                  </div>
                </motion.div>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User info section */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium">
                            {getUserInitials()}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-800">{getUserName()}</div>
                            <div className="text-xs text-gray-500">{userInfo?.email || 'jean.dupont@example.com'}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-2">
                        <motion.a 
                          href="#" 
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004AC8]"
                          whileHover={{ x: 5 }}
                        >
                          <FiUser className="mr-3 text-gray-400" />
                          Mon profil
                        </motion.a>
                        
                        <motion.a 
                          href="#" 
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004AC8]"
                          whileHover={{ x: 5 }}
                        >
                          <FiSettings className="mr-3 text-gray-400" />
                          Paramètres
                        </motion.a>
                        
                        <motion.a 
                          href="#" 
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#004AC8]"
                          whileHover={{ x: 5 }}
                        >
                          <FiHelpCircle className="mr-3 text-gray-400" />
                          Aide et support
                        </motion.a>
                      </div>
                      
                      {/* Logout section */}
                      <div className="py-2 border-t border-gray-100">
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          whileHover={{ x: 5 }}
                        >
                          <FiLogOut className="mr-3" />
                          Se déconnecter
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
