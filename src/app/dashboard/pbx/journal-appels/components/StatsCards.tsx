import { motion, Variants } from 'framer-motion';
import {
  FiPhone,
  FiCornerUpRight,
  FiBarChart2,
  FiPieChart,
  FiBell,
  FiPercent
} from 'react-icons/fi';

// Define interfaces for our props and stats
interface StatsData {
  totalCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
  internalCalls: number;
  answeredCalls: number;
  failedCalls: number;
  missedCalls: number;
  totalDuration: number;
  totalCost: number;
  avgCallDuration: number;
  avgAnswerTime: number;
}

interface StatsCardsProps {
  stats: StatsData;
  itemVariants: Variants;
}

// Format time from seconds to human-readable form (mm:ss)
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * custom,
      duration: 0.4
    }
  })
};

const StatsCards = ({ stats, itemVariants }: StatsCardsProps) => {
  const {
    totalCalls,
    incomingCalls,
    outgoingCalls,
    internalCalls,
    answeredCalls,
    failedCalls,
    missedCalls,
    // totalDuration,
    totalCost,
    avgCallDuration,
    avgAnswerTime
  } = stats;

  return (
    <motion.div
      variants={itemVariants}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
    >
      {/* Card 1: Call Overview */}
      <motion.div
        custom={0}
        variants={cardVariants}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
        className="bg-gradient-to-br from-[#1B0353] to-[#004AC8] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-0)" />
          </svg>
        </div>
        
        <div className="flex items-center relative z-10">
          <FiPhone className="w-10 h-10 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Appels</p>
            <p className="text-3xl font-extrabold">{totalCalls}</p>
            <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
              <FiBell className="w-3 h-3" />
              <span>Dernier: Aujourd&apos;hui</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Direction Status */}
      <motion.div
        custom={1}
        variants={cardVariants}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
        className="bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-1" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-1)" />
          </svg>
        </div>
        
        <div className="flex items-center relative z-10">
          <FiCornerUpRight className="w-10 h-10 mr-4" />
          <div>
            <p className="text-sm font-medium">Direction</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{incomingCalls}</span>
                <span className="text-xs">Entrants</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{outgoingCalls}</span>
                <span className="text-xs">Sortants</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{internalCalls}</span>
                <span className="text-xs">Internes</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Call Results */}
      <motion.div
        custom={2}
        variants={cardVariants}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
        className="bg-gradient-to-br from-[#4BB2F6] to-[#1B0353] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-2" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-2)" />
          </svg>
        </div>
        
        <div className="flex items-center relative z-10">
          <FiBarChart2 className="w-10 h-10 mr-4" />
          <div>
            <p className="text-sm font-medium">Statut</p>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{answeredCalls}</span>
                <span className="text-xs">Répondus</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{failedCalls}</span>
                <span className="text-xs">Échoués</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{missedCalls}</span>
                <span className="text-xs">Manqués</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80 mt-2">
              <FiPercent className="w-3 h-3" />
              <span>Taux de réponse: {Math.round((answeredCalls / totalCalls) * 100)}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card 4: Call Metrics */}
      <motion.div
        custom={3}
        variants={cardVariants}
        whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
        className="bg-gradient-to-br from-[#6B46C1] to-[#9F7AEA] p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid-3" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-3)" />
          </svg>
        </div>
        
        <div className="flex items-center relative z-10">
          <FiPieChart className="w-10 h-10 mr-4" />
          <div>
            <p className="text-sm font-medium">Métriques</p>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <div className="flex justify-between">
                <span className="text-xs">Durée moyenne:</span>
                <span className="font-bold">{formatTime(avgCallDuration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Temps de réponse:</span>
                <span className="font-bold">{Math.round(avgAnswerTime)} sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Coût total:</span>
                <span className="font-bold">{totalCost.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsCards;