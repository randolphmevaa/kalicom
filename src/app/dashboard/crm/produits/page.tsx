'use client';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function UnderConstruction() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-white flex items-center justify-center px-4"
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <FiAlertCircle className="w-20 h-20 text-gray-400 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-900">
          Désolé, page en construction
        </h1>
        <p className="text-lg text-gray-600">
          Nous peaufinons chaque détail pour vous offrir une expérience digne d’Apple. Restez à l’écoute – des fonctionnalités innovantes et une interface minimaliste arrivent très bientôt.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Retour à l’accueil
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
