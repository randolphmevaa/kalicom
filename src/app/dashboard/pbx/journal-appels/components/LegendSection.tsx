import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FiInfo,
  FiCornerUpRight,
  FiArrowUpRight,
  FiArrowDownRight,
  FiUser,
  FiPhoneMissed
} from 'react-icons/fi';

// Define interface for component props
interface LegendSectionProps {
  itemVariants: Variants;
}

const LegendSection: React.FC<LegendSectionProps> = ({ itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-800">
        {/* Status Legend */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <FiInfo className="w-4 h-4 text-[#004AC8]" />
            Légende Statuts
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-900">Répondu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-900">Échoué</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-gray-900">Annulé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <span className="text-gray-900">Messagerie vocale</span>
            </div>
          </div>
        </div>

        {/* Direction Legend */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-gray-900 flex items-center gap-2">
            <FiCornerUpRight className="w-4 h-4 text-[#004AC8]" />
            Légende Directions
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />
              <span className="text-gray-900">Appels sortants</span>
            </div>
            <div className="flex items-center gap-2">
              <FiArrowDownRight className="w-4 h-4 text-green-600" />
              <span className="text-gray-900">Appels entrants</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4 text-purple-600" />
              <span className="text-gray-900">Internes</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhoneMissed className="w-4 h-4 rotate-90 text-orange-500" />
              <span className="text-gray-900">Enregistrements</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LegendSection;