'use client';
import { motion } from 'framer-motion';
import { FiSearch, FiUserPlus } from 'react-icons/fi';

const prospects = [
  { id: 1, name: 'Alice Dupont', email: 'alice@example.com', status: 'Nouveau' },
  { id: 2, name: 'Bob Martin', email: 'bob@example.com', status: 'Contacté' },
  { id: 3, name: 'Charlie Bernard', email: 'charlie@example.com', status: 'En discussion' },
];

export default function CRMProspects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <FiUserPlus className="mr-2" />
            Ajouter Prospect
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-2 mb-4">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un prospect..."
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="divide-y">
            {prospects.map((prospect) => (
              <motion.div
                key={prospect.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center justify-between transition"
              >
                <div>
                  <div className="text-lg font-medium text-gray-900">{prospect.name}</div>
                  <div className="text-sm text-gray-500">{prospect.email}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                  {prospect.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
