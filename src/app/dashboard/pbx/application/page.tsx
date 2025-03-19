'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiShield,
  FiUsers,
  FiShuffle,
  FiVoicemail,
  FiMenu,
  FiMusic,
  FiClock,
  FiArrowRight,
  FiHome,
  FiChevronRight,
  // FiSettings,
  // FiStar,
  // FiCheck,
  FiInfo,
  FiLayers
} from 'react-icons/fi';

// Breadcrumbs component
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </div>
);

// Interface for the theme styles
interface ThemeStyles {
  gradient: string;
  bgLight: string;
  bgMedium: string;
  text: string;
  border: string;
  iconBg: string;
  iconColor: string;
  hoverBg: string;
}

// Interface for app stats
interface AppStats {
  blocked?: number;
  lastUpdated?: string;
  groups?: number;
  devices?: number;
  redirects?: number;
  active?: number;
  unread?: number;
  storage?: string;
  menus?: number;
  options?: number;
  files?: number;
  conditions?: number;
  [key: string]: string | number | undefined; // Keep the index signature for flexibility
}

// Interface for app object
interface AppInfo {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  stats: AppStats;
  theme: string;
  status: string; // Changed from 'active' | 'attention' | 'inactive' to string to match usage
}

/**
 * Enhanced Applications Page with Premium UI
 */
export default function Applications() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Application config with routes
  const apps = [
    {
      title: 'Liste noire',
      description:
        'Bloquez ou redirigez les appels entrants provenants des numéros indiqués.',
      icon: FiShield,
      route: '/dashboard/pbx/application/callblock',
      stats: { blocked: 47, lastUpdated: '2 jours' },
      theme: 'blue',
      status: 'active'
    },
    {
      title: 'Groupes de Sonnerie',
      description:
        "Un groupe de sonneries vous permet lors d'un appel de faire sonner plusieurs téléphones simultanément ou dans un ordre défini.",
      icon: FiUsers,
      route: '/dashboard/pbx/application/ringgroup',
      stats: { groups: 5, devices: 12 },
      theme: 'purple',
      status: 'active'
    },
    {
      title: "Redirection d'appel",
      description:
        'Rediriger les appels entrants vers une ou plusieurs destinations',
      icon: FiShuffle,
      route: '/dashboard/pbx/application/followme',
      stats: { redirects: 8, active: 6 },
      theme: 'green',
      status: 'active'
    },
    {
      title: 'Messagerie vocale',
      description:
        'Paramétrage et personnalisation des messageries vocales et écoute des messages vocaux',
      icon: FiVoicemail,
      route: '/dashboard/pbx/application/voicemail',
      stats: { unread: 3, storage: '80%' },
      theme: 'orange',
      status: 'attention'
    },
    {
      title: 'Serveur Vocal Interactif (SVI)',
      description:
        'Le SVI est un système automatisé gérant les appels entrants avec un menu vocal personnalisable. Exemple: Tapez 1 -> Service commercial, Tapez 2 -> Technique...',
      icon: FiMenu,
      route: '/dashboard/pbx/application/ivrmenu',
      stats: { menus: 2, options: 8 },
      theme: 'red',
      status: 'active'
    },
    {
      title: 'Enregistrements',
      description:
        "Importer vos fichiers audios (WAV 16 bits, 8khz/16khz mono) à utiliser comme musiques d'attente, annonces, etc. Ou créez un son depuis votre poste en composant *732",
      icon: FiMusic,
      route: '/dashboard/pbx/application/record',
      stats: { files: 12, storage: '45%' },
      theme: 'teal',
      status: 'active'
    },
    {
      title: 'Time Conditions',
      description:
        'Ajouter, modifier, supprimer des conditions horaires pour les appels entrants',
      icon: FiClock,
      route: '/dashboard/pbx/application/timecondition',
      stats: { conditions: 6, active: 4 },
      theme: 'amber',
      status: 'active'
    },
  ];

  /**
   * Get theme-based styles for cards
   */
  const getThemeStyles = (theme: string) => {
    const themeMap: Record<string, ThemeStyles> = {
      blue: {
        gradient: 'from-blue-500 to-indigo-600',
        bgLight: 'bg-blue-50',
        bgMedium: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        hoverBg: 'hover:bg-blue-700',
      },
      purple: {
        gradient: 'from-purple-500 to-indigo-600',
        bgLight: 'bg-purple-50',
        bgMedium: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        hoverBg: 'hover:bg-purple-700',
      },
      green: {
        gradient: 'from-emerald-500 to-teal-600',
        bgLight: 'bg-emerald-50',
        bgMedium: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        hoverBg: 'hover:bg-emerald-700',
      },
      orange: {
        gradient: 'from-orange-500 to-amber-600',
        bgLight: 'bg-orange-50',
        bgMedium: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        hoverBg: 'hover:bg-orange-700',
      },
      red: {
        gradient: 'from-red-500 to-rose-600',
        bgLight: 'bg-red-50',
        bgMedium: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        hoverBg: 'hover:bg-red-700',
      },
      teal: {
        gradient: 'from-teal-500 to-cyan-600',
        bgLight: 'bg-teal-50',
        bgMedium: 'bg-teal-100',
        text: 'text-teal-700',
        border: 'border-teal-200',
        iconBg: 'bg-teal-100',
        iconColor: 'text-teal-600',
        hoverBg: 'hover:bg-teal-700',
      },
      amber: {
        gradient: 'from-amber-500 to-yellow-600',
        bgLight: 'bg-amber-50',
        bgMedium: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        hoverBg: 'hover:bg-amber-700',
      },
    };
    
    return themeMap[theme] || themeMap.blue;
  };

  /**
   * Render stats based on app type
   */
  const renderStats = (app: AppInfo) => {
    const styles = getThemeStyles(app.theme);
    
    switch (app.title) {
      case 'Liste noire':
        return (
          <div className="flex items-center justify-between text-xs">
            <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
              <span className="font-semibold">{app.stats.blocked}</span> numéros bloqués
            </div>
            <div className="text-gray-500">
              Mis à jour il y a {app.stats.lastUpdated}
            </div>
          </div>
        );
      case 'Groupes de Sonnerie':
        return (
          <div className="flex items-center justify-between text-xs">
            <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
              <span className="font-semibold">{app.stats.groups}</span> groupes
            </div>
            <div className="text-gray-500">
              <span className="font-semibold">{app.stats.devices}</span> appareils associés
            </div>
          </div>
        );
        case 'Messagerie vocale':
          return (
            <div className="flex items-center justify-between text-xs">
              <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text} ${Number(app.stats.unread) > 0 ? 'animate-pulse' : ''}`}>
                <span className="font-semibold">{app.stats.unread}</span> non lus
              </div>
              <div className="text-gray-500">
                Stockage: <span className="font-semibold">{app.stats.storage}</span>
              </div>
            </div>
          );
      default:
        // Generic stats rendering
        const statKeys = Object.keys(app.stats);
        if (statKeys.length >= 2) {
          return (
            <div className="flex items-center justify-between text-xs">
              <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
                <span className="font-semibold">{app.stats[statKeys[0]]}</span> {statKeys[0]}
              </div>
              <div className="text-gray-500">
                <span className="font-semibold">{app.stats[statKeys[1]]}</span> {statKeys[1]}
              </div>
            </div>
          );
        }
        return null;
    }
  };

  /**
   * Framer Motion Variants
   */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.5 },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications']} />

        {/* ---------- HEADER / HERO SECTION ---------- */}
        <motion.div
          variants={headerVariants}
          className="relative mb-8 overflow-hidden bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.08)] border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-10 z-10">
            <div className="max-w-2xl">
              {/* Title with decorative elements */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                  <FiLayers className="w-6 h-6 text-[#004AC8]" />
                </div>
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                  Applications
                </h1>
                <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                  {apps.length} services
                </span>
              </div>
              
              <p className="text-base text-gray-600 leading-relaxed">
                Accédez à toutes vos fonctionnalités PBX avancées, regroupées
                au même endroit pour une gestion simple et performante. Chaque application 
                est conçue pour répondre à un besoin spécifique de votre système téléphonique.
              </p>
              
              {/* Quick tip */}
              <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
                <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-amber-700">Astuce :</span>{' '}
                  <span className="text-amber-700">
                    Cliquez sur une application pour accéder à sa page de configuration complète.
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ---------- APPLICATION CARDS GRID ---------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {apps.map((app) => {
            const styles = getThemeStyles(app.theme);
            const isHovered = hoveredCard === app.title;
            
            return (
              <Link href={app.route} key={app.title}>
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredCard(app.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`group relative p-6 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${styles.border}`}
                  style={{
                    boxShadow: isHovered 
                      ? '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)' 
                      : '0 10px 30px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
                    background: 'white'
                  }}
                >
                  {/* Subtle app status indicator */}
                  <div className="absolute top-3 right-3">
                    {app.status === 'active' && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full text-xs font-medium text-green-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Actif
                      </div>
                    )}
                    {app.status === 'attention' && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded-full text-xs font-medium text-orange-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        Attention
                      </div>
                    )}
                  </div>

                  {/* Background hover effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top right, ${
                        app.theme === 'blue' ? 'rgba(59, 130, 246, 0.05)' :
                        app.theme === 'purple' ? 'rgba(139, 92, 246, 0.05)' :
                        app.theme === 'green' ? 'rgba(16, 185, 129, 0.05)' :
                        app.theme === 'orange' ? 'rgba(249, 115, 22, 0.05)' :
                        app.theme === 'red' ? 'rgba(239, 68, 68, 0.05)' :
                        app.theme === 'teal' ? 'rgba(20, 184, 166, 0.05)' : 
                        'rgba(245, 158, 11, 0.05)'
                      }, transparent)`
                    }}
                  />

                  {/* Icon with gradient circle behind it */}
                  <div className="relative z-10 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                      <app.icon className={`w-7 h-7 ${styles.iconColor}`} />
                    </div>
                    
                    {/* Decorative gradient dots */}
                    <div className="absolute w-6 h-1.5 -right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${styles.iconBg} opacity-30`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${styles.iconBg} opacity-60`}></div>
                      <div className={`w-1.5 h-1.5 rounded-full ${styles.iconBg} opacity-90`}></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-3">
                    <h2 className={`text-xl font-bold ${styles.text} group-hover:translate-x-1 transition-transform`}>
                      {app.title}
                    </h2>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {app.description}
                    </p>
                    
                    {/* Stats section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {renderStats(app)}
                    </div>
                  </div>

                  {/* Floating action button */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-4 right-4 z-20"
                      >
                        <div className={`p-2 rounded-full bg-gradient-to-r ${styles.gradient} text-white shadow-lg`}>
                          <FiArrowRight className="w-5 h-5" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Bottom indicator */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${styles.gradient}`}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
