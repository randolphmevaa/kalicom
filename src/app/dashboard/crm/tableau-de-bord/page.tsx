'use client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { FiUser, FiTrendingUp, FiCalendar, FiPhoneCall, FiClipboard, FiClock, FiUserPlus, FiAward, FiFileText } from 'react-icons/fi';

const prospectData = [
  { name: 'Jan', prospects: 30 },
  { name: 'Feb', prospects: 45 },
  { name: 'Mar', prospects: 60 },
  { name: 'Apr', prospects: 80 },
  { name: 'May', prospects: 75 },
  { name: 'Jun', prospects: 90 },
];

const eventsData = [
  { type: 'Appel', time: '09:30', contact: 'Marie Dupont', status: 'À venir' },
  { type: 'Tâche', time: '11:00', contact: 'Jean Martin', status: 'À venir' },
  { type: 'Rendez-vous', time: '14:30', contact: 'Sophie Leclerc', status: 'À venir' },
  { type: 'Appel', time: '16:00', contact: 'Thomas Bernard', status: 'À venir' },
];

const notesData = [
  { time: '08:45', text: 'Suivi nécessaire avec client Acme Corp', author: 'Léa' },
  { time: '10:20', text: 'Préparation démo produit pour Nexus Tech', author: 'Marc' },
  { time: '13:15', text: 'Relancer proposition commerciale Zenith SA', author: 'Julie' },
];

const topSalesData = [
  { name: 'Emma', prospects: 25, color: '#8884d8' },
  { name: 'Lucas', prospects: 18, color: '#82ca9d' },
  { name: 'Léa', prospects: 15, color: '#ffc658' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const eventTypeData = [
  { name: 'Appel', value: 12 },
  { name: 'Tâche', value: 8 },
  { name: 'Rendez-vous', value: 5 },
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
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold drop-shadow-md"
              style={{ color: "#1B0353" }}
            >
              Tableau de Bord CRM
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Visualisez la performance de vos prospects et surveillez vos indicateurs clés.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">Aujourd&apos;hui</span>
            <button className="p-2 hover:bg-gray-200 rounded-xl transition">
              <FiTrendingUp className="text-gray-600 w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statistiques Prospects */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Statistiques Prospects</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">458</div>
            <p className="text-xs text-gray-500 mb-4">Total prospects ajoutés</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prospectData}>
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="prospects" fill="#8884d8" barSize={25} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Événements du Calendrier */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCalendar className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Événements du Calendrier</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">12</div>
            <p className="text-xs text-gray-500 mb-4">Prochains événements programmés</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Total des derniers prospects */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUser className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Total des derniers prospects</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">45</div>
            <p className="text-xs text-gray-500 mb-4">Prochains événements programmés</p>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prospectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis stroke="#8884d8" fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="prospects"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meilleures ventes */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiAward className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Meilleures ventes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">58</div>
            <p className="text-xs text-gray-500 mb-3">Total des derniers prospects ajoutés par le meilleur vendeur</p>
            
            <div className="space-y-4 mt-4">
              {topSalesData.map((seller, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{seller.name}</span>
                      <span className="text-xs font-medium text-gray-700">{seller.prospects} prospects</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(seller.prospects / topSalesData[0].prospects) * 100}%`,
                          backgroundColor: seller.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Événements du jour */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiClock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Événements du jour</span>
            </div>
            
            <div className="mt-4 space-y-3">
              {eventsData.map((event, index) => (
                <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className={`p-2 rounded-lg mr-3 ${
                    event.type === 'Appel' ? 'bg-green-100' : 
                    event.type === 'Tâche' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {event.type === 'Appel' ? (
                      <FiPhoneCall className="w-4 h-4 text-green-600" />
                    ) : event.type === 'Tâche' ? (
                      <FiClipboard className="w-4 h-4 text-amber-600" />
                    ) : (
                      <FiCalendar className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">{event.type}</span>
                      <span className="text-xs text-gray-500">{event.time}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{event.contact}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Third row */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Les notes d'aujourd'hui */}
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-white p-6 rounded-2xl shadow-lg transition hover:shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FiFileText className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Les notes d&apos;aujourd&apos;hui</span>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {notesData.map((note, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-indigo-600">{note.author}</span>
                    <span className="text-xs text-gray-500">{note.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{note.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
