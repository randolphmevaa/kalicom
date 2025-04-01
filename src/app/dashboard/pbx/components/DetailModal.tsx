'use client';

import { motion } from 'framer-motion';
import { FiX, FiActivity, FiDownload, FiPieChart } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface CallData {
  date: string;
  heure: string;
  appels: number;
  duree: number;
  taux: number;
  entrants?: number;
  sortants?: number;
  internes?: number;
  manques?: number;
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  callData: CallData | null;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, callData }) => {
  if (!isOpen || !callData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiActivity className="w-5 h-5 text-[#004AC8]" />
              </div>
              Détails des appels - {callData.heure}
            </h3>
            <p className="text-gray-500 ml-9">Date: {callData.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm"
          >
            <div className="text-sm font-medium text-blue-700">
              Nombre d&apos;appels
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1 flex items-baseline gap-1">
              {callData.appels}
              <span className="text-xs font-normal text-blue-500">appels</span>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm"
          >
            <div className="text-sm font-medium text-purple-700">
              Durée moyenne
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-1 flex items-baseline gap-1">
              {callData.duree}
              <span className="text-xs font-normal text-purple-500">min</span>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm"
          >
            <div className="text-sm font-medium text-green-700">
              Taux de réponse
            </div>
            <div className="text-2xl font-bold text-green-700 mt-1 flex items-baseline gap-1">
              {callData.taux}
              <span className="text-xs font-normal text-green-500">%</span>
            </div>
          </motion.div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiPieChart className="w-4 h-4 text-[#004AC8]" />
            Répartition des appels
          </h4>
          <div className="h-64 border border-gray-200 rounded-lg p-4 bg-gray-50/50 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feFlood floodColor="#00000010" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                  </filter>
                </defs>
                <Pie
                  data={[
                    { name: 'Entrants', value: callData.entrants || 0, color: '#3B82F6' },
                    { name: 'Sortants', value: callData.sortants || 0, color: '#10B981' },
                    { name: 'Internes', value: callData.internes || 0, color: '#8B5CF6' },
                    { name: 'Manqués', value: callData.manques || 0, color: '#EF4444' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  filter="url(#glow)"
                  dataKey="value"
                >
                  {[
                    { name: 'Entrants', value: callData.entrants || 0, color: '#3B82F6' },
                    { name: 'Sortants', value: callData.sortants || 0, color: '#10B981' },
                    { name: 'Internes', value: callData.internes || 0, color: '#8B5CF6' },
                    { name: 'Manqués', value: callData.manques || 0, color: '#EF4444' },
                  ].map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [
                    <span key="value" className="font-bold">{value} appels</span>, 
                    <span key="name" className="text-gray-600">{name}</span>
                  ]} 
                  itemStyle={{ padding: '4px 8px' }}
                  contentStyle={{ 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e2e8f0',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#004AC8] bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
          >
            <FiDownload className="w-4 h-4" />
            Télécharger le rapport
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Fermer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailModal;