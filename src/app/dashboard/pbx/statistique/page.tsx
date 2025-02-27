'use client';

import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiPhoneIncoming,
  FiGlobe,
  FiActivity,
  FiEye,
  FiUser,
  FiArrowRight,
} from 'react-icons/fi';

export default function Statistiques() {
  // Our “cards” data
  const statsCards = [
    {
      title: 'Statistiques par numéro',
      description: 'Consulter les statistiques des appels reçus sur vos numéros',
      icon: FiPhoneIncoming,
    },
    {
      title: "Statistiques d'appel",
      description: 'Consulter les graphiques des statistiques d’appel',
      icon: FiBarChart2,
    },
    {
      title: 'Statistiques par pays',
      description: 'Consulter les statistiques des pays appelés',
      icon: FiGlobe,
    },
    {
      title: 'Statistiques des lignes',
      description: 'Consulter les statistiques détaillées des lignes',
      icon: FiActivity,
    },
    {
      title: 'Statistiques en direct',
      description: "Voir l'activité des lignes en direct",
      icon: FiEye,
    },
    {
      title: 'Mes statistiques',
      description: 'Consulter les statistiques de votre ligne',
      icon: FiUser,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-12 px-4 md:px-0">
        {/* ---------- HEADER / HERO SECTION ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B0353]">Statistiques</h1>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Accédez rapidement à toutes vos statistiques et analyses d’appels.
              </p>
            </div>
          </div>
        </div>

        {/* ---------- STATISTIQUES CARDS GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, idx) => (
            <motion.div
              key={idx}
              // 3D tilt effect on hover
              whileHover={{
                scale: 1.03,
                rotateX: 3,
                rotateY: -3,
                boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)',
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Subtle pattern background inside the card */}
              <div
                className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none rounded-2xl"
                style={{
                  backgroundImage:
                    "url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')",
                }}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Icon + Title */}
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-[#004AC8]/10 text-[#004AC8] rounded-xl">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
                  {stat.title}
                </h2>
              </div>

              {/* Description */}
              <p className="relative text-sm text-gray-600 mt-4 leading-relaxed">
                {stat.description}
              </p>

              {/* “View” Button slides up on hover */}
              <motion.div
                className="absolute bottom-4 right-6 flex items-center gap-2 bg-[#004AC8] text-white px-4 py-2 rounded-xl font-semibold shadow-lg cursor-pointer hover:bg-[#003C9C]"
                initial={{ y: 20, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm">Voir</span>
                <FiArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
