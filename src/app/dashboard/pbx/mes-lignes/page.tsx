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

const COLORS = ['#6366f1', '#10b981'];

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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1B0353]">Gestion des Lignes</h1>
              <p className="text-sm text-gray-500 mt-1">Contrôlez et surveillez vos lignes téléphoniques</p>
            </div>
            <div className="flex space-x-4">
              <button className="p-2 hover:bg-gray-200 rounded-xl transition" title="Ajouter une ligne">
                <FiPlus className="text-gray-600 w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-xl transition" title="Paramètres">
                <FiSettings className="text-gray-600 w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-10 border-b-2 border-gray-300">
          {['Mes lignes', "Résumé d'utilisation", 'Devices'].map((tab: string) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              whileHover={{ y: -2 }}
              className={`pb-3 px-2 font-semibold text-md transition-colors ${
                activeTab === tab.toLowerCase().replace(' ', '-') ? 'text-[#1B0353] border-b-4 border-indigo-700' : 'text-gray-700 hover:text-[#a0c8f0]'
              }`}
            >
              {tab}
            </motion.button>
          ))}
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

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Lignes', value: totalLines, icon: FiPhone, color: 'from-indigo-500 to-blue-600' },
          { label: 'Lignes Actives', value: activeLines, icon: FiCheckCircle, color: 'from-green-500 to-emerald-600' },
          { label: 'Lignes Inactives', value: inactiveLines, icon: FiXCircle, color: 'from-red-500 to-rose-600' },
        ].map((card, index: number) => (
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

      {/* Search and Table */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par numéro..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
            />
          </div>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
            >
              <option>Tous</option>
              <option>Actifs</option>
              <option>Inactifs</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort('number')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Numéro {sortConfig.key === 'number' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Statut {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLines.map((line: LineType, index: number) => (
                <motion.tr
                  key={line.id}
                  whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{line.number}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`px-4 py-2 inline-flex text-xs font-semibold rounded-full ${
                        line.status === 'Active' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {line.status === 'Active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <motion.button whileHover={{ scale: 1.2 }} className="text-[#1B0353] hover:text-indigo-800 mr-4">
                      <FiEdit />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }} className="text-red-600 hover:text-red-800">
                      <FiTrash2 />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredLines.length === 0 && (
            <div className="text-center py-6 text-gray-600">Aucune ligne trouvée.</div>
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
            className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
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
          { label: 'Appels Totaux', value: totalCalls, icon: FiBarChart2, color: 'from-indigo-500 to-blue-600' },
          { label: 'Durée Totale (min)', value: totalDuration.toFixed(1), icon: FiActivity, color: 'from-green-500 to-emerald-600' },
          { label: 'Durée Moyenne (min)', value: averageDuration, icon: FiActivity, color: 'from-purple-500 to-pink-600' },
          { label: 'Heure de Pointe', value: peakCallTime, icon: FiPieChart, color: 'from-yellow-500 to-orange-600' },
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
              <Line type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Appels" />
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
              <Bar dataKey="duration" fill="#10b981" name="Durée (min)" />
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
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un appareil ou une ligne..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
            />
          </div>
          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Redémarrer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBulkAction('remove')}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Supprimer
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Devices Table */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedDevices(
                        e.target.checked ? filteredDevices.map((d: Device) => d.id) : []
                      )
                    }
                    checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                    className="w-4 h-4 text-[#1B0353] border-gray-300 rounded focus:ring-indigo-500"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Nom {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('line')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Ligne {sortConfig.key === 'line' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-indigo-700 transition"
                >
                  Statut {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dernière Activité</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDevices.map((device: Device, index: number) => (
                <motion.tr
                  key={device.id}
                  whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={() => toggleDeviceSelection(device.id)}
                      className="w-4 h-4 text-[#1B0353] border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{device.name}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{device.type}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{device.line}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span
                      className={`px-4 py-2 inline-flex text-xs font-semibold rounded-full ${
                        device.status === 'Online' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {device.status === 'Online' ? 'En ligne' : 'Hors ligne'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{device.lastSeen}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <motion.button whileHover={{ scale: 1.2 }} className="text-[#1B0353] hover:text-indigo-800 mr-4" title="Configurer">
                      <FiEdit />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }} className="text-blue-600 hover:text-blue-800 mr-4" title="Redémarrer">
                      <FiRefreshCw />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.2 }} className="text-red-600 hover:text-red-800" title="Supprimer">
                      <FiTrash2 />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredDevices.length === 0 && (
            <div className="text-center py-6 text-gray-600">Aucun appareil trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
}
