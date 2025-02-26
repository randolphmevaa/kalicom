'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiSearch,
  FiPlus,
  FiSettings,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiServer,
  FiClock,
  FiHash,
  FiSmartphone,
  FiX,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Data interfaces
interface LineType {
  id: number;
  number: string;
  status: 'Active' | 'Inactive';
}

interface Device {
  id: number;
  name: string;
  type: string;
  line: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
}

interface CallData {
  time: string;
  calls: number;
  duration: number;
}

interface CallDistribution {
  name: string;
  value: number;
}

// Sample Data
const lines: LineType[] = [
  { id: 1, number: '+33 1 23 45 67 89', status: 'Active' },
  { id: 2, number: '+33 1 98 76 54 32', status: 'Inactive' },
  { id: 3, number: '+33 1 11 22 33 44', status: 'Active' },
];

const devices: Device[] = [
  { id: 1, name: 'Phone 1', type: 'IP Phone', line: '+33 1 23 45 67 89', status: 'Online', lastSeen: '2023-10-01 12:00' },
  { id: 2, name: 'Softphone 1', type: 'Softphone', line: '+33 1 98 76 54 32', status: 'Offline', lastSeen: '2023-09-30 10:00' },
  { id: 3, name: 'Phone 2', type: 'IP Phone', line: '+33 1 11 22 33 44', status: 'Online', lastSeen: '2023-10-01 14:00' },
];

const generateCallData = (): CallData[] => {
  const data: CallData[] = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    const hour = time.getHours().toString().padStart(2, '0');
    data.push({
      time: `${hour}:00`,
      calls: Math.floor(Math.random() * 50) + 10,
      duration: parseFloat((Math.random() * 5 + 1).toFixed(1)),
    });
  }
  return data;
};

const callData = generateCallData();
const callDistribution: CallDistribution[] = [
  { name: 'Entrants', value: 65 },
  { name: 'Sortants', value: 35 },
];
const totalCalls = callData.reduce((sum, item) => sum + item.calls, 0);
const totalDuration = callData.reduce((sum, item) => sum + (item.duration * item.calls), 0);
const averageDuration = (totalDuration / totalCalls).toFixed(1);
const peakCallTime = callData.reduce((max, item) => (item.calls > max.calls ? item : max), callData[0]).time;

const COLORS = ['#004AC8', '#4BB2F6'];

// Main Component
export default function PBXMesLignes() {
  const [activeTab, setActiveTab] = useState('mes-lignes');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1B0353]">Gestion des Lignes</h1>
              <p className="text-sm text-gray-500 mt-1">Contrôlez et surveillez vos lignes téléphoniques</p>
            </div>
            <div className="flex space-x-4">
              <button className="p-2 hover:bg-gray-200 rounded-xl transition" title="Ajouter une ligne">
                <FiPlus className="text-[#1B0353] w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-xl transition" title="Paramètres">
                <FiSettings className="text-[#1B0353] w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="relative mb-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent" />
          
          <div className="flex gap-6 px-2">
            {['Mes lignes', "Résumé d'utilisation", 'Devices'].map((tab) => {
              const isActive = activeTab === tab.toLowerCase().replace(' ', '-');
              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                  className="relative py-4"
                >
                  {/* Animated background */}
                  {isActive && (
                    <motion.div
                      layoutId="tabHighlight"
                      className="absolute inset-0 bg-gradient-to-b from-[#004AC8]/10 to-transparent rounded-t-2xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Tab Content */}
                  <div className="relative flex items-center gap-2 px-4">
                    <span className={`text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'text-[#004AC8] bg-clip-text bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]' 
                        : 'text-gray-600 hover:text-[#1B0353]'
                    }`}>
                      {tab}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 bg-[#4BB2F6] rounded-full"
                      />
                    )}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    initial={false}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.1 }
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                      isActive ? 'bg-[#004AC8]' : 'bg-transparent'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Animated underline */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-[#004AC8]"
            animate={{
              width: 'var(--underline-width)',
              left: 'var(--underline-left)',
            }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
          />
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'mes-lignes' && <MesLignesTab lines={lines} />}
          {activeTab === "résumé-d'utilisation" && <UsageSummaryTab callData={callData} callDistribution={callDistribution} />}
          {activeTab === 'devices' && <DevicesTab devices={devices} />}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Mes Lignes Tab
function MesLignesTab({ lines }: { lines: LineType[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [sortConfig, setSortConfig] = useState<{ key: keyof LineType | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  // Use a typed record for status mapping
  const statusMap: Record<string, string | null> = { Tous: null, Actifs: 'Active', Inactifs: 'Inactive' };

  const filteredLines = lines
    .filter(
      (line: LineType) =>
        line.number.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedFilter === 'Tous' || line.status === statusMap[selectedFilter])
    )
    .sort((a: LineType, b: LineType) => {
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      return isAsc
        ? a[sortConfig.key]!.toString().localeCompare(b[sortConfig.key]!.toString())
        : b[sortConfig.key]!.toString().localeCompare(a[sortConfig.key]!.toString());
    });

  const totalLines = lines.length;
  const activeLines = lines.filter((line: LineType) => line.status === 'Active').length;
  const inactiveLines = lines.filter((line: LineType) => line.status === 'Inactive').length;

  const handleSort = (key: keyof LineType) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const cardStyles = [
    { label: 'Total Lignes', value: totalLines, icon: FiPhone, color: 'from-[#1B0353] to-[#004AC8]' },
    { label: 'Lignes Actives', value: activeLines, icon: FiCheckCircle, color: 'from-[#004AC8] to-[#4BB2F6]' },
    { label: 'Lignes Inactives', value: inactiveLines, icon: FiXCircle, color: 'from-[#4BB2F6] to-[#1B0353]' },
  ];

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cardStyles.map((card, index: number) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className={`bg-gradient-to-br ${card.color} p-6 rounded-3xl shadow-lg backdrop-blur-md text-white`}
          >
            <div className="flex items-center">
              <card.icon className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-extrabold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Table Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Enhanced Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
            <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par numéro de ligne..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
          />
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="relative pl-4 pr-10 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800 appearance-none transition-all duration-200"
          >
            <option className="bg-white">Tous</option>
            <option className="bg-white">Actifs</option>
            <option className="bg-white">Inactifs</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                {['Numéro', 'Statut', 'Actions'].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 2 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {['Numéro', 'Statut'].includes(header) && (
                        <button
                          onClick={() => handleSort(header.toLowerCase() as keyof LineType)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {sortConfig.key === header.toLowerCase() ? (
                            sortConfig.direction === 'asc' ? (
                              <FiChevronUp className="w-4 h-4 text-[#004AC8]" />
                            ) : (
                              <FiChevronDown className="w-4 h-4 text-[#004AC8]" />
                            )
                          ) : (
                            <FiChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200/80">
              {filteredLines.map((line) => (
                <motion.tr
                  key={line.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors"
                >
                  {/* Number Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-5 h-5 text-[#004AC8]/80 shrink-0" />
                      <span className="font-medium text-gray-900">{line.number}</span>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          line.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span
                        className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                          line.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {line.status === 'Active' ? 'Actif' : 'Inactif'}
                      </span>
                    </motion.div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-blue-100 rounded-lg text-[#004AC8] transition-colors"
                        title="Modifier"
                      >
                        <FiEdit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Enhanced Empty State */}
          {filteredLines.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 text-[#004AC8]/50">
                <FiSearch className="w-12 h-12" />
              </div>
              <p className="text-gray-600 font-medium">
                Aucune ligne trouvée avec ces critères de recherche
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez d&apos;ajuster votre recherche ou vos filtres
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Usage Summary Tab
function UsageSummaryTab({ callData, callDistribution }: { callData: CallData[]; callDistribution: CallDistribution[] }) {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#004AC8] text-gray-800"
          >
            <option value="24h">Dernières 24 heures</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="custom">Personnalisé</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Appels Totaux', value: totalCalls, icon: FiBarChart2, color: 'from-[#1B0353] to-[#004AC8]' },
          { label: 'Durée Totale (min)', value: totalDuration.toFixed(1), icon: FiActivity, color: 'from-[#004AC8] to-[#4BB2F6]' },
          { label: 'Durée Moyenne (min)', value: averageDuration, icon: FiActivity, color: 'from-[#4BB2F6] to-[#1B0353]' },
          { label: 'Heure de Pointe', value: peakCallTime, icon: FiPieChart, color: 'from-[#1B0353] to-[#004AC8]' },
        ].map((metric, index: number) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className={`bg-gradient-to-br ${metric.color} p-6 rounded-3xl shadow-lg backdrop-blur-md text-white`}
          >
            <div className="flex items-center">
              <metric.icon className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">{metric.label}</p>
                <p className="text-3xl font-extrabold">{metric.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Volume d’appels</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={callData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', color: '#1f2937' }} />
              <Legend />
              <Line type="monotone" dataKey="calls" stroke="#004AC8" strokeWidth={2} dot={{ r: 4 }} name="Appels" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Durée moyenne des appels</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={callData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#4b5563" />
              <YAxis stroke="#4b5563" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', color: '#1f2937' }} />
              <Legend />
              <Bar dataKey="duration" fill="#4BB2F6" name="Durée (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Distribution des appels</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={callDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                {callDistribution.map((entry: CallDistribution, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', color: '#1f2937' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Devices Tab
function DevicesTab({ devices }: { devices: Device[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Device | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  // Use a typed record for status mapping
  const statusMap: Record<string, string | null> = { Tous: null, 'En ligne': 'Online', 'Hors ligne': 'Offline' };

  const filteredDevices = devices
    .filter(
      (device: Device) =>
        (device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.line.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedFilter === 'Tous' || device.status === statusMap[selectedFilter])
    )
    .sort((a: Device, b: Device) => {
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      return isAsc
        ? a[sortConfig.key]!.toString().localeCompare(b[sortConfig.key]!.toString())
        : b[sortConfig.key]!.toString().localeCompare(a[sortConfig.key]!.toString());
    });

  const handleSort = (key: keyof Device) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };

  const toggleDeviceSelection = (id: number) => {
    setSelectedDevices((prev: number[]) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`${action} on devices:`, selectedDevices);
    setSelectedDevices([]);
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 mb-8">
        <div className="flex items-center justify-between">
          <div className="relative w-1/3 mr-6">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1B0353]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un appareil ou une ligne..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#004AC8] text-gray-800"
            />
          </div>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#004AC8] text-gray-800"
            >
              <option>Tous</option>
              <option>En ligne</option>
              <option>Hors ligne</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        {selectedDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex space-x-4 bg-gray-100 p-4 rounded-xl"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBulkAction('restart')}
              className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#004AC8] transition"
            >
              Redémarrer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBulkAction('remove')}
              className="px-6 py-2 bg-[#4BB2F6] text-white rounded-xl hover:bg-[#4BB2F6] transition"
            >
              Supprimer
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Enhanced Devices Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {/* Bulk Actions Bar */}
        {selectedDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#f8fafc] rounded-xl flex items-center justify-between shadow-sm border border-[#004AC8]/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#1B0353]">
                {selectedDevices.length} sélectionné{selectedDevices.length > 1 ? 's' : ''}
              </span>
              <div className="h-5 w-px bg-gray-200" />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#004AC8] text-white rounded-lg flex items-center gap-2 hover:bg-[#003DA8] transition-colors"
                  onClick={() => handleBulkAction('restart')}
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Redémarrer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
                  onClick={() => handleBulkAction('remove')}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Supprimer
                </motion.button>
              </div>
            </div>
            <button
              onClick={() => setSelectedDevices([])}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    onChange={(e) => setSelectedDevices(e.target.checked ? filteredDevices.map(d => d.id) : [])}
                    checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                    className="w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                  />
                </th>
                {['Nom', 'Type', 'Ligne', 'Statut', 'Dernière Activité', 'Actions'].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 5 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {['Nom', 'Type', 'Ligne', 'Statut'].includes(header) && (
                        <button
                          onClick={() => handleSort(header.toLowerCase() as keyof Device)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {sortConfig.key === header.toLowerCase() ? (
                            sortConfig.direction === 'asc' ? (
                              <FiChevronUp className="w-4 h-4 text-[#004AC8]" />
                            ) : (
                              <FiChevronDown className="w-4 h-4 text-[#004AC8]" />
                            )
                          ) : (
                            <FiChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200/80">
              {filteredDevices.map((device) => (
                <motion.tr
                  key={device.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={() => toggleDeviceSelection(device.id)}
                      className="w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                    />
                  </td>

                  {/* Device Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                        {device.type === 'IP Phone' ? (
                          <FiPhone className="w-5 h-5 text-[#004AC8]" />
                        ) : (
                          <FiSmartphone className="w-5 h-5 text-[#4BB2F6]" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{device.name}</span>
                    </div>
                  </td>

                  {/* Device Type */}
                  <td className="px-6 py-4 text-sm text-gray-600">{device.type}</td>

                  {/* Line Number */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-gray-400" />
                      {device.line}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          device.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span
                        className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                          device.status === 'Online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {device.status === 'Online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </motion.div>
                  </td>

                  {/* Last Activity */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      {new Date(device.lastSeen).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-blue-100 rounded-lg text-[#004AC8] transition-colors"
                        title="Configurer"
                      >
                        <FiEdit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                        title="Redémarrer"
                      >
                        <FiRefreshCw className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Enhanced Empty State */}
          {filteredDevices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 text-[#004AC8]/50">
                <FiServer className="w-12 h-12" />
              </div>
              <p className="text-gray-600 font-medium">
                Aucun appareil trouvé
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez d&apos;ajuster vos filtres de recherche
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
