// app/components/Header.tsx
'use client';

import { useState } from 'react';
import {
  FiPhone,
  FiHome,
  FiMonitor,
  FiPlusCircle,
  FiSearch,
  FiMail,
  // FiGlobe,
  // FiUser,
  FiBell,
} from 'react-icons/fi';
import { motion } from 'framer-motion';

type HeaderProps = {
  sidebarWidth: number;
};

export default function Header({ sidebarWidth }: HeaderProps) {
  const [search, setSearch] = useState('');

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

              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <div className="text-sm text-gray-600 group-hover:text-blue-600">
                  <div className="font-medium">Jean Dupont</div>
                  <div className="text-xs">Administrateur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
