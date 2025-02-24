// app/components/Sidebar.tsx
'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiSettings,
  FiHome,
  FiPhoneOutgoing,
  FiSmartphone,
  FiBookOpen,
  FiPhoneCall,
  FiBarChart,
  FiMonitor,
  FiUsers,
  FiActivity,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number; // <-- Added prop here
};

type MenuSection = {
  title: string;
  items: MenuItem[];
  icon: JSX.Element;
};

type MenuItem = {
  name: string;
  href: string;
  icon?: JSX.Element;
};

const sections: Record<string, MenuSection> = {
  pbx: {
    title: 'Système PBX',
    icon: <FiPhoneCall size={20} />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard', icon: <FiHome size={20} /> },
      { name: 'Mes lignes', href: '/dashboard/pbx/mes-lignes', icon: <FiPhoneOutgoing size={20} /> },
      { name: 'Mes numéros', href: '/dashboard/pbx/mes-numeros', icon: <FiSmartphone size={20} /> },
      { name: 'Application', href: '/dashboard/pbx/application', icon: <FiBookOpen size={20} /> },
      { name: 'Journal d’appels', href: '/dashboard/pbx/journal-appels', icon: <FiPhoneCall size={20} /> },
      { name: 'Statistiques', href: '/dashboard/pbx/statistique', icon: <FiBarChart size={20} /> },
      { name: 'Parc téléphonique', href: '/dashboard/pbx/parc-telephone', icon: <FiMonitor size={20} /> },
      { name: 'Statut système', href: '/dashboard/pbx/statut', icon: <FiActivity size={20} /> },
      { name: 'Postes de travail', href: '/dashboard/pbx/poste-de-travail', icon: <FiUsers size={20} /> },
    ],
  },
  crm: {
    title: 'Suite CRM',
    icon: <FiUsers size={20} />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard/crm/tableau-de-bord', icon: <FiHome size={20} /> },
      { name: 'Prospects', href: '/dashboard/crm/prospects', icon: <FiPhoneOutgoing size={20} /> },
      { name: 'Importer prospects', href: '/dashboard/crm/importer-prospects', icon: <FiSmartphone size={20} /> },
      { name: 'Calendrier', href: '/dashboard/crm/calendrier', icon: <FiBookOpen size={20} /> },
      { name: 'Clients', href: '/dashboard/crm/clients', icon: <FiUsers size={20} /> },
      { name: 'Produits', href: '/dashboard/crm/produits', icon: <FiBarChart size={20} /> },
      { name: 'Documents de vente', href: '/dashboard/crm/document-ventes', icon: <FiMonitor size={20} /> },
      { name: 'Comptabilité', href: '/dashboard/crm/reglements-comptabilite', icon: <FiActivity size={20} /> },
      { name: 'Paramètres société', href: '/dashboard/crm/parametre-societe', icon: <FiSettings size={20} /> },
    ],
  },
};

export default function Sidebar({ isOpen, toggleSidebar, sidebarWidth }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Handle auto-open on hover:
  const handleMouseEnter = () => {
    if (!isOpen) {
      toggleSidebar();
    }
  };
  const handleMouseLeave = () => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  return (
    <>
      <motion.aside
        initial={{ width: isOpen ? sidebarWidth : 80 }}
        animate={{ width: isOpen ? sidebarWidth : 80 }}
        className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl fixed z-50 top-0 left-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 border-b border-white/10">
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="text-2xl font-bold"
            >
              {isOpen ? (
                <Image
                  src="/Artboard 1.svg"
                  alt="Full Logo"
                  width={120}
                  height={40}
                />
              ) : (
                <Image
                  src="/Artboard 4.svg"
                  alt="Collapsed Logo"
                  width={40}
                  height={40}
                />
              )}
            </motion.div>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
            >
              {isOpen ? (
                <FiChevronsLeft size={24} className="text-gray-800" />
              ) : (
                <FiChevronsRight size={24} className="text-gray-800" />
              )}
            </button>
          </div>

          {/* Main menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {Object.entries(sections).map(([key, section]) => (
              <motion.div key={key} whileHover={{ scale: 1.02 }} className="relative">
                <button
                  onClick={() => setActiveSection(activeSection === key ? null : key)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all ${
                    activeSection === key
                      ? 'bg-emerald-500/20 border-l-4 border-emerald-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span className="text-emerald-400">{section.icon}</span>
                  {isOpen && <span className="ml-3 text-sm font-medium">{section.title}</span>}
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-white/10">
            <Link
              href="/dashboard/reglages"
              className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <FiSettings className="text-emerald-400" />
              {isOpen && <span className="ml-3 text-sm font-medium">Paramètres</span>}
            </Link>
          </div>
        </div>
      </motion.aside>

      {/* Contextual Submenu */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ left: sidebarWidth }}
            className="fixed z-40 h-screen w-64 bg-gray-800 shadow-2xl top-0"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                {sections[activeSection].title}
              </h3>
            </div>
            <nav className="p-4 space-y-2">
              {sections[activeSection].items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-white/5 text-sm font-medium transition-colors"
                >
                  <span className="text-emerald-400 mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
