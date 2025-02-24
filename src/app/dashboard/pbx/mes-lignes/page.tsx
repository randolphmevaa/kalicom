'use client';
import { motion } from 'framer-motion';
import { FiPhone } from 'react-icons/fi';

const lines = [
  { id: 1, number: '+33 1 23 45 67 89', status: 'Active' },
  { id: 2, number: '+33 1 98 76 54 32', status: 'Inactive' },
  { id: 3, number: '+33 1 11 22 33 44', status: 'Active' },
];

export default function PBXMesLignes() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-2xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Mes Lignes
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez et surveillez l&apos;état de vos lignes téléphoniques en temps réel.
            </p>
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-xl transition">
            <FiPhone className="text-gray-600 w-6 h-6" />
          </button>
        </div>

        {/* Search and List */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <FiPhone className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une ligne..."
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="divide-y">
            {lines.map((line) => (
              <motion.div
                key={line.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center justify-between transition"
              >
                <div className="text-lg font-medium text-gray-900">{line.number}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    line.status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {line.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
