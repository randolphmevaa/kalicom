'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  FiBarChart2,
  FiPhoneIncoming,
  FiGlobe,
  FiActivity,
  FiEye,
  FiUser,
  FiArrowRight,
  FiHome,
  FiChevronRight,
  FiInfo,
  // FiLayers,
  FiPieChart,
  FiFileText,
  FiDownload
} from 'react-icons/fi';
import { IconType } from 'react-icons';

// Define types for Theme and Stats Card
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

interface CardStats {
  total?: string;
  period?: string;
  countries?: string;
  popular?: string;
  lines?: string;
  active?: string;
  now?: string;
  day?: string;
  calls?: string;
  duration?: string;
}

interface StatsCard {
  title: string;
  description: string;
  icon: IconType;
  theme: string;
  stats: CardStats;
  route: string;
}

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

export default function Statistiques() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // No stats highlights for header

  // Our "cards" data with enhanced properties
  const statsCards: StatsCard[] = [
    {
      title: 'Statistiques par numéro',
      description: 'Consulter les statistiques des appels reçus sur vos numéros',
      icon: FiPhoneIncoming,
      theme: 'blue',
      stats: { total: '1,247', period: 'Ce mois' },
      route: '/dashboard/pbx/statistique/statistics'
    },
    {
      title: "Statistiques d'appel",
      description: 'Consulter les graphiques des statistiques d\'appel',
      icon: FiBarChart2,
      theme: 'purple',
      stats: { total: '6,523', period: 'Cette année' },
      route: '/dashboard/pbx/statistique/call-stats'
    },
    {
      title: 'Statistiques par pays',
      description: 'Consulter les statistiques des pays appelés',
      icon: FiGlobe,
      theme: 'green',
      stats: { countries: '34', popular: 'France' },
      route: '/dashboard/pbx/statistique/location-stats'
    },
    {
      title: 'Statistiques des lignes',
      description: 'Consulter les statistiques détaillées des lignes',
      icon: FiActivity,
      theme: 'orange',
      stats: { lines: '12', active: '9' },
      route: '/dashboard/pbx/statistique/extension-stats'
    },
    {
      title: 'Statistiques en direct',
      description: "Voir l'activité des lignes en direct",
      icon: FiEye,
      theme: 'red',
      stats: { now: '7', day: '89' },
      route: '/dashboard/pbx/statistique/live-stats'
    },
    {
      title: 'Mes statistiques',
      description: 'Consulter les statistiques de votre ligne',
      icon: FiUser,
      theme: 'teal',
      stats: { calls: '142', duration: '14h 23m' },
      route: '/dashboard/pbx/statistique/my-stats'
    },
  ];
  
  /**
   * Get theme-based styles for cards
   */
  const getThemeStyles = (theme: string): ThemeStyles => {
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
   * Render stats based on card type
   */
  const renderStats = (card: StatsCard) => {
    const styles = getThemeStyles(card.theme);
    
    if (card.stats.total && card.stats.period) {
      return (
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
            <span className="font-semibold">{card.stats.total}</span> appels
          </div>
          <div className="text-gray-500">
            <span className="font-medium">{card.stats.period}</span>
          </div>
        </div>
      );
    }
    
    if (card.stats.countries && card.stats.popular) {
      return (
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
            <span className="font-semibold">{card.stats.countries}</span> pays
          </div>
          <div className="text-gray-500">
            Top: <span className="font-medium">{card.stats.popular}</span>
          </div>
        </div>
      );
    }
    
    if (card.stats.lines && card.stats.active) {
      return (
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
            <span className="font-semibold">{card.stats.lines}</span> lignes
          </div>
          <div className="text-gray-500">
            <span className="font-medium">{card.stats.active}</span> actives
          </div>
        </div>
      );
    }
    
    if (card.stats.now && card.stats.day) {
      return (
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
            <span className="font-semibold">{card.stats.now}</span> en cours
          </div>
          <div className="text-gray-500">
            <span className="font-medium">{card.stats.day}</span> aujourd&apos;hui
          </div>
        </div>
      );
    }
    
    if (card.stats.calls && card.stats.duration) {
      return (
        <div className="flex items-center justify-between text-xs">
          <div className={`px-2 py-1 rounded-full ${styles.bgLight} ${styles.text}`}>
            <span className="font-semibold">{card.stats.calls}</span> appels
          </div>
          <div className="text-gray-500">
            Total: <span className="font-medium">{card.stats.duration}</span>
          </div>
        </div>
      );
    }
    
    return null;
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
  // No stat variants needed

  const exportToCSV = () => {
    console.log('Exporting to CSV');
    // Implement CSV export functionality
    alert('Le CSV statistiques.csv a été généré et téléchargé.');
  };
  
  const exportToPDF = () => {
    console.log('Exporting to PDF');
    // Implement PDF export functionality
    alert('Le PDF statistiques.pdf a été généré et téléchargé.');
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className=" "
    >
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Statistiques']} />

        {/* ---------- HEADER / HERO SECTION ---------- */}
        <motion.div
          variants={headerVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
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

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiPieChart className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Statistiques
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {statsCards.length} rapports
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Visualisez et analysez toutes vos données d&apos;appels. Supervisez le trafic, 
                  identifiez les tendances et optimisez votre système téléphonique.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Export Buttons */}
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en CSV"
                  >
                    <FiDownload className="mr-2" />
                    CSV
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToPDF}
                    className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                    title="Exporter en PDF"
                  >
                    <FiFileText className="mr-2" />
                    PDF
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Utilisez les filtres dans chaque rapport pour affiner vos données. Exportez vos rapports au format CSV ou PDF pour les partager.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- STATISTICS CARDS GRID ---------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {statsCards.map((card, index) => {
            const styles = getThemeStyles(card.theme);
            const isHovered = hoveredCard === index;
            
            return (
              <Link href={card.route} key={index} className="block">
                <motion.div
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`group relative p-6 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${styles.border}`}
                  style={{
                    boxShadow: isHovered 
                      ? '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.1)' 
                      : '0 10px 30px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
                    background: 'white'
                  }}
                >
                  {/* Background hover effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top right, ${
                        card.theme === 'blue' ? 'rgba(59, 130, 246, 0.05)' :
                        card.theme === 'purple' ? 'rgba(139, 92, 246, 0.05)' :
                        card.theme === 'green' ? 'rgba(16, 185, 129, 0.05)' :
                        card.theme === 'orange' ? 'rgba(249, 115, 22, 0.05)' :
                        card.theme === 'red' ? 'rgba(239, 68, 68, 0.05)' :
                        card.theme === 'teal' ? 'rgba(20, 184, 166, 0.05)' : 
                        'rgba(245, 158, 11, 0.05)'
                      }, transparent)`
                    }}
                  />

                  {/* Icon with gradient circle behind it */}
                  <div className="relative z-10 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                      <card.icon className={`w-7 h-7 ${styles.iconColor}`} />
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
                      {card.title}
                    </h2>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                    
                    {/* Stats section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {renderStats(card)}
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
