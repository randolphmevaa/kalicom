// app/components/Sidebar.tsx
'use client';

import { JSX, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronDown,
  FiHome,
  FiPhoneOutgoing,
  FiSmartphone,
  FiPhoneCall,
  FiBarChart,
  FiMonitor,
  FiUsers,
  FiActivity,
  FiMail,
  FiBox,
  FiFileText,
  // FiDollarSign,
  FiTool,
  FiFile,
  FiUpload,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiInfo,
  FiImage,
  FiHash,
  FiPercent,
  FiCreditCard,
  FiClipboard,
  FiMessageSquare,
  FiSettings,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaEuroSign } from 'react-icons/fa';

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

const sections: Record<string, MenuSection> = {
  pbx: {
    title: 'PBX',
    icon: <FiPhoneCall size={20} className="text-white" />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard', icon: <FiHome size={20} className="text-white" /> },
      { name: 'Mes lignes', href: '/dashboard/pbx/mes-lignes', icon: <FiPhoneOutgoing size={20} className="text-white" /> },
      { name: 'Mes numéros', href: '/dashboard/pbx/mes-numeros', icon: <FiSmartphone size={20} className="text-white" /> },
      { name: 'Applications', href: '/dashboard/pbx/application', icon: <FiMail size={20} className="text-white" /> },
      { name: 'Journal d’appels & Enregistrements', href: '/dashboard/pbx/journal-appels', icon: <FiPhoneCall size={20} className="text-white" /> },
      { name: 'Statistiques', href: '/dashboard/pbx/statistique', icon: <FiBarChart size={20} className="text-white" /> },
      { name: 'Parc téléphonique', href: '/dashboard/pbx/parc-telephone', icon: <FiMonitor size={20} className="text-white" /> },
      { name: 'Statut système', href: '/dashboard/pbx/statut', icon: <FiActivity size={20} className="text-white" /> },
      { name: 'Postes de travail', href: '/dashboard/pbx/poste-de-travail', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
  crm: {
    title: 'CRM',
    icon: <FiMail size={20} className="text-white" />,
    items: [
      { name: 'Tableau de bord', href: '/dashboard/crm/tableau-de-bord', icon: <FiHome size={20} className="text-white" /> },
      { name: 'Prospects', href: '/dashboard/crm/prospects', icon: <FiUser size={20} className="text-white" /> },
      { name: 'Importer prospects', href: '/dashboard/crm/importer-prospects', icon: <FiUpload size={20} className="text-white" /> },
      { name: 'Calendrier', href: '/dashboard/crm/calendrier', icon: <FiCalendar size={20} className="text-white" /> },
    ],
  },
  clients: {
    title: 'Clients',
    icon: <FiUsers size={20} className="text-white" />,
    items: [
      { name: 'Clients', href: '/dashboard/clients', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
  produits: {
    title: 'Produits',
    icon: <FiBox size={20} className="text-white" />,
    items: [
      { name: 'Produits', href: '/dashboard/produits', icon: <FiBox size={20} className="text-white" /> },
    ],
  },
  documents_ventes: {
    title: 'Documents de ventes',
    icon: <FiFileText size={20} className="text-white" />,
    items: [
      { name: 'Devis', href: '/dashboard/document-ventes/devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Factures', href: '/dashboard/document-ventes/factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Avoirs', href: '/dashboard/document-ventes/avoirs', icon: <FiClipboard size={20} className="text-white" /> },
      { name: 'Factures d’acompte', href: '/dashboard/document-ventes/factures-acompte', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoir d’acompte', href: '/dashboard/document-ventes/avoirs-acompte', icon: <FiFile size={20} className="text-white" /> },
    ],
  },
  reglements_comptabilite: {
    title: 'Reglements/Comptabilite',
    icon: <FaEuroSign size={20} className="text-white" />,
    items: [
      { name: 'Reglements/Comptabilite', href: '/dashboard/reglements-comptabilite', icon: <FaEuroSign size={20} className="text-white" /> },
    ],
  },
  parametre_societe: {
    title: 'Paramètre societe',
    icon: <FiTool size={20} className="text-white" />,
    items: [
      { name: 'Coordonners', href: '/dashboard/parametre-societe/coordonners', icon: <FiMapPin size={20} className="text-white" /> },
      { 
        name: 'Identification', 
        href: '/dashboard/parametre-societe/identification',
        icon: <FiUser size={20} className="text-white" />,
        subItems: [
          { name: 'Informations administratives', href: '/dashboard/parametre-societe/identification/infos-administratives', icon: <FiInfo size={16} className="text-white" /> },
          { name: 'Informations TVA', href: '/dashboard/parametre-societe/identification/informations-tva', icon: <FiPercent size={16} className="text-white" /> },
        ],
      },
      { name: 'Logo', href: '/dashboard/parametre-societe/logo', icon: <FiImage size={20} className="text-white" /> },
      { name: 'Numerotation', href: '/dashboard/parametre-societe/numerotation', icon: <FiHash size={20} className="text-white" /> },
      { name: 'Mentions legales des devis', href: '/dashboard/parametre-societe/mentions-devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Mentions legales des factures', href: '/dashboard/parametre-societe/mentions-factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Taxes', href: '/dashboard/parametre-societe/taxes', icon: <FiPercent size={20} className="text-white" /> },
      { name: 'Banque', href: '/dashboard/parametre-societe/banque', icon: <FiCreditCard size={20} className="text-white" /> },
    ],
  },
  modeles_de_documents: {
    title: 'Modèles de documents',
    icon: <FiFile size={20} className="text-white" />,
    items: [
      { name: 'Factures', href: '/dashboard/modeles-de-documents/factures', icon: <FiFile size={20} className="text-white" /> },
      { name: 'Devis', href: '/dashboard/modeles-de-documents/devis', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoirs', href: '/dashboard/modeles-de-documents/avoirs', icon: <FiClipboard size={20} className="text-white" /> },
      { name: 'Factures d’acompte', href: '/dashboard/modeles-de-documents/factures-acompte', icon: <FiFileText size={20} className="text-white" /> },
      { name: 'Avoir d’acompte', href: '/dashboard/modeles-de-documents/avoirs-acompte', icon: <FiFile size={20} className="text-white" /> },
    ],
  },
  modeles: {
    title: 'Modèles',
    icon: <FiMessageSquare size={20} className="text-white" />,
    items: [
      { name: 'Email', href: '/dashboard/modeles/email', icon: <FiMail size={20} className="text-white" /> },
      { name: 'SMS', href: '/dashboard/modeles/sms', icon: <FiMessageSquare size={20} className="text-white" /> },
    ],
  },
  utilisateurs: {
    title: 'Utilisateurs',
    icon: <FiUsers size={20} className="text-white" />,
    items: [
      { name: 'Utilisateurs', href: '/dashboard/utilisateurs', icon: <FiUsers size={20} className="text-white" /> },
    ],
  },
};

// A dedicated component to render items that may have nested subItems.
function ContextMenuItem({ item }: { item: MenuItem }) {
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
}

export default function Sidebar({ isOpen, toggleSidebar, sidebarWidth }: SidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <motion.aside
        initial={{ width: isOpen ? sidebarWidth : 80 }}
        animate={{ width: isOpen ? sidebarWidth : 80 }}
        style={{ background: 'linear-gradient(to bottom,#004AC8, #1B0353)' }}
        className="h-screen text-white shadow-2xl fixed z-50 top-0 left-0 flex flex-col"
      >
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center justify-between bg-white p-6 border-b border-white/10">
            <motion.div animate={{ opacity: isOpen ? 1 : 0 }} className="text-2xl font-bold">
              {isOpen ? (
                <Image src="/Artboard 1.svg" alt="Full Logo" width={120} height={40} />
              ) : (
                <Image src="/Artboard 4.svg" alt="Collapsed Logo" width={40} height={40} />
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

          {/* Main menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {Object.entries(sections).map(([key, section]) => {
              // A section is expandable if it has more than one item or any nested subItems.
              const hasSubmenu = section.items.length > 1 || section.items.some(item => item.subItems);
              return hasSubmenu ? (
                <motion.div key={key} whileHover={{ scale: 1.02 }} className="relative">
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
        {activeSection && (
          <motion.div
            ref={contextMenuRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ left: sidebarWidth, background: 'linear-gradient(to bottom,#004AC8, #1B0353)' }}
            className="fixed z-40 h-screen w-64 shadow-2xl top-0 text-white"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {sections[activeSection].title}
              </h3>
            </div>
            <nav className="p-4 space-y-2 pt-8">
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
