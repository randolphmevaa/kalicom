'use client';

import { motion, Variants } from 'framer-motion';
import {
  FiShield,
  FiUsers,
  FiShuffle,
  FiVoicemail,
  FiMenu,
  FiMusic,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';

/**
 * Enhanced Applications Page
 */
export default function Applications() {
  // Application config
  const apps = [
    {
      title: 'Liste noire',
      description:
        'Bloquez ou redirigez les appels entrants provenants des numéros indiqués.',
      icon: FiShield,
    },
    {
      title: 'Groupes de Sonnerie',
      description:
        "Un groupe de sonneries vous permet lors d'un appel de faire sonner plusieurs téléphones simultanément ou dans un ordre défini.",
      icon: FiUsers,
    },
    {
      title: "Redirection d'appel",
      description:
        'Rediriger les appels entrants vers une ou plusieurs destinations',
      icon: FiShuffle,
    },
    {
      title: 'Messagerie vocale',
      description:
        'Paramétrage et personnalisation des messageries vocales et écoute des messages vocaux',
      icon: FiVoicemail,
    },
    {
      title: 'Serveur Vocal Interactif (SVI)',
      description:
        'Le SVI est un système automatisé gérant les appels entrants avec un menu vocal personnalisable. Exemple: Tapez 1 -> Service commercial, Tapez 2 -> Technique...',
      icon: FiMenu,
    },
    {
      title: 'Enregistrements',
      description:
        "Importer vos fichiers audios (WAV 16 bits, 8khz/16khz mono) à utiliser comme musiques d'attente, annonces, etc. Ou créez un son depuis votre poste en composant *732",
      icon: FiMusic,
    },
    {
      title: 'Time Conditions',
      description:
        'Ajouter, modifier, supprimer des conditions horaires pour les appels entrants',
      icon: FiClock,
    },
  ];

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

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-12 px-4 md:px-0">
        {/* ---------- HEADER / HERO SECTION ---------- */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          {/* Subtle pattern behind gradient */}
          <div
            className="absolute inset-0 opacity-10 bg-center bg-cover pointer-events-none"
            style={{
              backgroundImage:
                "url('https://www.toptal.com/designers/subtlepatterns/patterns/double-bubble-outline.png')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center p-8">
            <div>
              {/* Gradient text for the title */}
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                Applications
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-lg">
                Accédez à toutes vos fonctionnalités PBX avancées, regroupées
                au même endroit pour une gestion simple et performante.
              </p>
            </div>
          </div>
        </div>

        {/* ---------- APPLICATION CARDS GRID ---------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {apps.map((app ) => (
            <motion.div
              key={app.title}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Icon + Title */}
              <div className="relative flex items-center gap-4">
                <div className="p-3 bg-[#004AC8]/10 text-[#004AC8] rounded-xl">
                  <app.icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-[#1B0353] group-hover:text-[#004AC8] transition-colors">
                  {app.title}
                </h2>
              </div>

              {/* Description */}
              <p className="relative text-sm text-gray-600 mt-4 leading-relaxed">
                {app.description}
              </p>

              {/* CTA Button - Slides up on hover */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 right-6 group-hover:flex hidden"
              >
                <button className="inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-lg bg-[#004AC8] text-white hover:bg-[#003BA8] transition-colors">
                  Découvrir
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
