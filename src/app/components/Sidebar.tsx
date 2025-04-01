// app/components/Sidebar.tsx
'use client';

import { JSX, useState, useRef, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
// import dynamic from 'next/dynamic';

// Import common icons statically
import { 
  FiChevronsLeft, 
  FiChevronsRight, 
  FiChevronDown,
  // FiHome,
  FiSettings
} from 'react-icons/fi';

// Dynamically import the rest of the icons to reduce initial bundle size
// const IconsModule = dynamic(() => import('./IconsModule'), { 
//   ssr: false,
//   loading: () => <div className="w-5 h-5 bg-white/30 rounded-full animate-pulse" />
// });

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;
};

export type MenuItem = {
  name: string;
  href: string;
  icon?: JSX.Element;
  subItems?: MenuItem[];
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
  icon: JSX.Element;
};

// Define just the section structure here - the full data will be loaded from IconsModule
const sectionStructure = [
  'accueil',
  'pbx',
  'crm',
  'agenda',
  'clients',
  'produits',
  'applications',
  'documents_ventes',
  'reglements_comptabilite',
  'parametre_societe',
  'modeles_de_documents',
  'modeles',
  'utilisateurs',
  'support'
];

// Memoized ContextMenuItem component to prevent unnecessary re-renders
const ContextMenuItem = memo(({ item }: { item: MenuItem }) => {
  const [open, setOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <>
      <div
        onClick={() => hasSubItems && setOpen(!open)}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors cursor-pointer"
      >
        <div className="flex items-center">
          {item.icon && <span className="mr-3">{item.icon}</span>}
          <span>{item.name}</span>
        </div>
        {hasSubItems && (
          <motion.span
            className="p-1 bg-white/20 rounded-full"
            animate={{ rotate: open ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronDown size={16} className="text-white" />
          </motion.span>
        )}
      </div>
      <AnimatePresence>
        {hasSubItems && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-6 overflow-hidden"
          >
            {item.subItems?.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="flex items-center block p-2 rounded hover:bg-white/10 text-xs transition-colors"
              >
                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                {subItem.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

ContextMenuItem.displayName = 'ContextMenuItem';

export default function Sidebar({ isOpen, toggleSidebar, sidebarWidth }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, MenuSection>>({});
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Load sections data after component mounts
  useEffect(() => {
    // We'll get the icons module and set up the sections
    import('./IconsModule').then(module => {
      setSections(module.default);
      setIconsLoaded(true);
    });
  }, []);

  // Memoize sidebar style to prevent recalculation
  const sidebarStyle = useMemo(() => ({
    background: 'linear-gradient(to bottom,#004AC8, #1B0353)',
    width: isOpen ? sidebarWidth : 80,
    willChange: 'width' // Hardware acceleration hint
  }), [isOpen, sidebarWidth]);

  // Memoize submenu style
  const submenuStyle = useMemo(() => ({
    left: sidebarWidth,
    background: 'linear-gradient(to bottom,#004AC8, #1B0353)',
    willChange: 'opacity, transform' // Hardware acceleration hint
  }), [sidebarWidth]);

  // Close contextual submenu if clicking outside it.
  useEffect(() => {
    if (!activeSection) return;

    function handleClickOutside(event: MouseEvent) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setActiveSection(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeSection]);

  // If icons aren't loaded yet, show a simple skeleton loader
  if (!iconsLoaded) {
    return (
      <aside 
        style={sidebarStyle}
        className="h-screen text-white shadow-2xl fixed z-50 top-0 left-0 flex flex-col"
      >
        <div className="animate-pulse p-6 bg-white">
          <div className="h-8 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="p-4 space-y-2">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="h-10 bg-white/10 rounded animate-pulse"></div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? sidebarWidth : 80 }}
        style={{ background: 'linear-gradient(to bottom,#004AC8, #1B0353)' }}
        className="h-screen text-white shadow-2xl fixed z-50 top-0 left-0 flex flex-col"
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 border-b border-white/10">
            <motion.div animate={{ opacity: isOpen ? 1 : 0 }} className="text-2xl font-bold">
              {isOpen ? (
                <Image 
                  src="/Artboard 1.svg" 
                  alt="Full Logo" 
                  width={120} 
                  height={40} 
                  priority 
                />
              ) : (
                <Image 
                  src="/Artboard 4.svg" 
                  alt="Collapsed Logo" 
                  width={40} 
                  height={40} 
                  priority 
                />
              )}
            </motion.div>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
            >
              {isOpen ? (
                <FiChevronsLeft size={24} className="text-[#004AC8]" />
              ) : (
                <FiChevronsRight size={24} className="text-[#004AC8]" />
              )}
            </button>
          </div>

          {/* Main menu - virtualized for better performance */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sectionStructure.map((key) => {
              if (!sections[key]) return null;
              const section = sections[key];
              
              // A section is expandable if it has more than one item or any nested subItems.
              const hasSubmenu = section.items.length > 1 || section.items.some(item => item.subItems);
              
              return hasSubmenu ? (
                <motion.div 
                  key={key} 
                  whileHover={{ scale: 1.02 }} 
                  className="relative"
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <button
                    onClick={() => setActiveSection(activeSection === key ? null : key)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${
                      activeSection === key
                        ? 'bg-white/20 border-l-4 border-white'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span>{section.icon}</span>
                    {isOpen && <span className="ml-3 text-sm font-medium">{section.title}</span>}
                    {isOpen && (
                      <motion.span
                        className="ml-auto p-1 bg-white/20 rounded-full"
                        animate={{ rotate: activeSection === key ? -90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown size={16} className="text-white" />
                      </motion.span>
                    )}
                  </button>
                </motion.div>
              ) : (
                <Link
                  key={key}
                  href={section.items[0].href}
                  className="flex items-center p-3 rounded-xl transition-all hover:bg-white/10"
                >
                  <span>{section.icon}</span>
                  {isOpen && <span className="ml-3 text-sm font-medium">{section.title}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Fixed Reglages Button at Bottom */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard/reglages"
            className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            <FiSettings size={20} className="text-white" />
            {isOpen && <span className="ml-3 text-sm font-medium">Reglages</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Contextual Submenu */}
      <AnimatePresence>
        {activeSection && sections[activeSection] && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={submenuStyle}
            className="fixed z-40 h-screen w-64 shadow-2xl top-0 text-white"
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {sections[activeSection].title}
              </h3>
            </div>
            <nav className="p-4 space-y-2 pt-8 overflow-y-auto">
              {sections[activeSection].items.map((item) =>
                item.subItems ? (
                  <ContextMenuItem key={item.href} item={item} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center p-3 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors"
                  >
                    {item.icon && <span className="mr-3">{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
