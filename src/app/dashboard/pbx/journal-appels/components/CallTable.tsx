import React, { JSX } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
  FiUser,
  FiPhoneMissed,
  FiClock,
  FiHash,
  FiPhoneCall,
  FiPhoneOff,
  FiX,
  FiMail
} from 'react-icons/fi';

// Define the structure of a call log
interface CallLog {
  id: number;
  direction: 'Entrant' | 'Sortant' | 'Interne';
  extensionUser: string;
  callerName: string;
  debut: string;
  fin: string;
  monNumero: string;
  numeroDuContact: string;
  dureeAppel: number;
  tta: number;
  enregistrement: boolean;
  du: string;
  vers: string;
  cost: number;
  statut: 'Répondu' | 'Échoué' | 'Annulé' | 'Messagerie vocale';
}

// Define the props for the CallTable component
interface CallTableProps {
  paginatedLogs: CallLog[];
  filteredLogs: CallLog[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  pageCount: number;
  formatTime: (seconds: number) => string;
  itemVariants: Variants;
}

// Define status colors map
type StatusColorMap = {
  [key in CallLog['statut']]: string;
};

// Define direction icons map
type DirectionIconMap = {
  [key in CallLog['direction']]: JSX.Element;
};

const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

const CallTable: React.FC<CallTableProps> = ({ 
  paginatedLogs, 
  filteredLogs, 
  currentPage, 
  setCurrentPage, 
  itemsPerPage, 
  pageCount,
  formatTime,
  itemVariants 
}) => {
  // Status color based on status
  const statusColors: StatusColorMap = {
    'Répondu': 'bg-green-100 text-green-700',
    'Échoué': 'bg-red-100 text-red-700',
    'Annulé': 'bg-orange-100 text-orange-700',
    'Messagerie vocale': 'bg-purple-100 text-purple-700'
  };
  
  // Direction icon based on direction
  const directionIcons: DirectionIconMap = {
    'Sortant': <FiArrowUpRight className="w-4 h-4 text-[#004AC8]" />,
    'Entrant': <FiArrowDownRight className="w-4 h-4 text-green-600" />,
    'Interne': <FiUser className="w-4 h-4 text-purple-600" />
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
    >
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5 text-gray-900">
            <tr>
              {[
                'Direction',
                'Extension',
                'Contact',
                'Début',
                'Durée',
                'Mon numéro',
                'Numéro du contact',
                'TTA',
                'Enregistrement',
                'Statut',
                'Coût',
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-sm font-semibold first:rounded-tl-xl last:rounded-tr-xl"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80 text-sm">
            {paginatedLogs.map((log) => {
              // Get status color and direction icon for current log
              const statusColor = statusColors[log.statut];
              const directionIcon = directionIcons[log.direction];
              
              return (
                <motion.tr
                  key={log.id}
                  variants={tableRowVariants}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors"
                >
                  {/* Direction */}
                  <td className="px-4 py-3 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      {directionIcon}
                      <span>{log.direction}</span>
                    </div>
                  </td>
                  
                  {/* Extension (Utilisateur) */}
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      <FiHash className="w-3.5 h-3.5 mr-1.5" />
                      {log.extensionUser}
                    </div>
                  </td>
                  
                  {/* Caller name */}
                  <td className="px-4 py-3 font-medium text-gray-800">{log.callerName}</td>
                  
                  {/* Début */}
                  <td className="px-4 py-3 text-gray-700">{log.debut}</td>
                  
                  {/* Durée de l'appel */}
                  <td className="px-4 py-3 text-gray-700">
                    <div className="inline-flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5 text-gray-500" />
                      {formatTime(log.dureeAppel)}
                    </div>
                  </td>
                  
                  {/* Mon numéro */}
                  <td className="px-4 py-3 text-gray-700">{log.monNumero}</td>
                  
                  {/* Numéro du contact */}
                  <td className="px-4 py-3 text-gray-700">
                    {log.numeroDuContact}
                  </td>
                  
                  {/* TTA */}
                  <td className="px-4 py-3 text-gray-700">{log.tta} sec</td>
                  
                  {/* Enregistrement */}
                  <td className="px-4 py-3 text-gray-700">
                    {log.enregistrement ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-full text-blue-700">
                        <FiPhoneMissed className="w-3.5 h-3.5 rotate-90" />
                        <span className="text-xs font-medium">Oui</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">Non</span>
                    )}
                  </td>
                  
                  {/* Statut */}
                  <td className="px-4 py-3">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {log.statut === 'Répondu' && <FiPhoneCall className="w-3 h-3 mr-1" />}
                      {log.statut === 'Échoué' && <FiPhoneOff className="w-3 h-3 mr-1" />}
                      {log.statut === 'Annulé' && <FiX className="w-3 h-3 mr-1" />}
                      {log.statut === 'Messagerie vocale' && <FiMail className="w-3 h-3 mr-1" />}
                      {log.statut}
                    </div>
                  </td>
                  
                  {/* Cost */}
                  <td className="px-4 py-3 font-medium">
                    {log.cost > 0 ? (
                      <span className="text-[#004AC8]">{log.cost.toFixed(2)} €</span>
                    ) : (
                      <span className="text-gray-400">0.00 €</span>
                    )}
                  </td>
                </motion.tr>
              );
            })}

            {/* If no logs found */}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={11} className="py-20 text-center text-gray-600">
                  <div className="flex flex-col items-center">
                    <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-600 font-medium mb-1">
                      Aucun appel trouvé
                    </p>
                    <p className="text-sm text-gray-500">
                      Essayez de modifier vos filtres ou de réinitialiser la recherche
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </span>{' '}
            sur <span className="font-medium">{filteredLogs.length}</span> appels
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#004AC8] hover:bg-[#004AC8]/10'
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </motion.button>
            
            {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
              // Show current page and 2 pages before/after
              const pageNum = currentPage <= 3
                ? i + 1
                : currentPage >= pageCount - 2
                  ? pageCount - 4 + i
                  : currentPage - 2 + i;
              
              if (pageNum <= 0 || pageNum > pageCount) return null;
              
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-lg font-medium text-sm ${
                    currentPage === pageNum
                      ? 'bg-[#004AC8] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((prev: number) => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount || pageCount === 0}
              className={`p-2 rounded-lg ${
                currentPage === pageCount || pageCount === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#004AC8] hover:bg-[#004AC8]/10'
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CallTable;