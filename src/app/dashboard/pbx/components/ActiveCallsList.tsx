'use client';

import { motion } from 'framer-motion';
import { 
  FiPhoneCall, 
  FiMaximize, 
  FiRefreshCw, 
  FiPhoneIncoming, 
  FiPhoneOutgoing, 
  FiPhone, 
  FiUserCheck, 
  FiArrowRight, 
  FiDownload 
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface ActiveCall {
  id: number;
  number: string;
  duration: string;
  status: 'answered' | 'ringing' | 'onHold' | 'internal' | string;
  location: string;
  staff: string;
  direction: 'incoming' | 'outgoing' | 'internal';
}

interface ActiveCallsListProps {
  calls: ActiveCall[];
  onRefresh: () => void;
}

const ActiveCallsList: React.FC<ActiveCallsListProps> = ({ calls, onRefresh }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FiPhoneCall className="w-5 h-5 text-[#004AC8]" />
            </div>
            Appels en cours
          </h3>
          <p className="text-sm text-gray-500 mt-1 ml-9">Liste des appels actifs sur votre système</p>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors shadow-sm"
          >
            <FiMaximize className="w-4 h-4" />
            <span>Plein écran</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95, rotate: 30 }}
            onClick={onRefresh}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Direction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localisation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personnel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {calls.map((call) => (
              <motion.tr 
                key={call.id} 
                className="hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * call.id }}
                whileHover={{ backgroundColor: '#f8fafc', scale: 1.005 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{call.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{call.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{call.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full shadow-sm ${
                      call.status === 'answered'
                        ? 'bg-green-100 text-green-800'
                        : call.status === 'ringing'
                        ? 'bg-blue-100 text-blue-800'
                        : call.status === 'onHold'
                        ? 'bg-amber-100 text-amber-800'
                        : call.status === 'internal'
                        ? 'bg-purple-100 text-purple-800'
                        : ''
                    }`}
                  >
                    {call.status === 'answered'
                      ? 'Répondu'
                      : call.status === 'ringing'
                      ? 'Sonnerie'
                      : call.status === 'onHold'
                      ? 'En attente'
                      : call.status === 'internal'
                      ? 'Interne'
                      : call.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full shadow-sm ${
                      call.direction === 'incoming'
                        ? 'bg-blue-50 text-blue-700'
                        : call.direction === 'outgoing'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {call.direction === 'incoming' ? (
                      <><FiPhoneIncoming className="w-3 h-3" /> Entrant</>
                    ) : call.direction === 'outgoing' ? (
                      <><FiPhoneOutgoing className="w-3 h-3" /> Sortant</>
                    ) : (
                      <><FiPhone className="w-3 h-3" /> Interne</>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {call.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUserCheck className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                    {call.staff}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <motion.button
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2 text-[#004AC8] hover:text-[#4BB2F6] font-medium text-sm"
                    onClick={() => router.push(`/dashboard/pbx/call/${call.id}`)}
                  >
                    Détails
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Export button */}
      <div className="flex justify-end mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white/80 rounded-lg border border-gray-200 shadow-sm hover:bg-white hover:text-[#004AC8] transition-all"
        >
          <FiDownload className="w-3.5 h-3.5" />
          Exporter la liste
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActiveCallsList;