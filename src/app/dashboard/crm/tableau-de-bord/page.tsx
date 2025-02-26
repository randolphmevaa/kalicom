'use client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { FiUser, FiTrendingUp } from 'react-icons/fi';

const data = [
  { name: 'Jan', prospects: 30 },
  { name: 'Feb', prospects: 45 },
  { name: 'Mar', prospects: 60 },
  { name: 'Apr', prospects: 80 },
  { name: 'May', prospects: 75 },
  { name: 'Jun', prospects: 90 },
];

export default function CRMTableauDeBord() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
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
              Tableau de Bord CRM
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Visualisez la performance de vos prospects et surveillez vos indicateurs clés.
            </p>
          </div>
          <button className="p-2 hover:bg-gray-200 rounded-xl transition">
            <FiTrendingUp className="text-gray-600 w-6 h-6" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-xl transition hover:shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiUser className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Nouveaux Prospects</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">45</div>
              </div>
              <span className="text-sm text-emerald-600 font-bold flex items-center">
                <FiTrendingUp className="mr-1" /> 15%
              </span>
            </div>
            <div className="h-20 mt-4">
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="prospects" fill="#8884d8" barSize={30} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl shadow-xl transition hover:shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiUser className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Taux de Conversion</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">10%</div>
              </div>
              <span className="text-sm text-emerald-600 font-bold flex items-center">
                <FiTrendingUp className="mr-1" /> 10%
              </span>
            </div>
            <div className="h-20 mt-4">
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={data}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="name" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="prospects" stroke="#82ca9d" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
