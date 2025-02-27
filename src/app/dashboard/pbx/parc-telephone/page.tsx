'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // FiRefreshCw,
  // FiEye,
  FiChevronDown,
  // FiChevronUp,
  FiSmartphone,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

/** Device interface */
interface PhoneDevice {
  id: number;
  userGroup: string;
  deviceName: string;
  extension: string;
  status: 'Online' | 'Offline';
  line: string;
  lastSeen: string;
}

// Sample user groups
const userGroups = [
  { value: '', label: 'Tous les groupes' },
  { value: 'Support', label: 'Support' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Technique', label: 'Technique' },
];

// Sample Data
const sampleDevices: PhoneDevice[] = [
  {
    id: 1,
    userGroup: 'Support',
    deviceName: 'IP Phone - Alice',
    extension: '101',
    status: 'Online',
    line: '+33 1 23 45 67 89',
    lastSeen: '2023-10-10 09:30:15',
  },
  {
    id: 2,
    userGroup: 'Commercial',
    deviceName: 'Softphone - Bob',
    extension: '102',
    status: 'Offline',
    line: '+33 1 98 76 54 32',
    lastSeen: '2023-10-09 18:00:00',
  },
  {
    id: 3,
    userGroup: 'Technique',
    deviceName: 'Desk Phone - Charly',
    extension: '103',
    status: 'Online',
    line: '+33 6 11 22 33 44',
    lastSeen: '2023-10-10 10:15:00',
  },
  {
    id: 4,
    userGroup: 'Commercial',
    deviceName: 'IP Phone - David',
    extension: '104',
    status: 'Offline',
    line: '+44 20 1234 5678',
    lastSeen: '2023-10-08 16:45:00',
  },
];

export default function ParcTelephonique() {
  // ------------------ States ------------------
  const [devices] = useState<PhoneDevice[]>(sampleDevices);

  // Filter states
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // ------------------ Filtering Logic Example ------------------
  const filteredDevices = devices.filter((device) => {
    // Filter by group
    const groupMatch = selectedGroup === '' || device.userGroup === selectedGroup;
    // If not showAll, you could choose to hide offline devices, etc.
    // For demonstration, we won't hide anything if showAll is false
    return groupMatch;
  });

  // Handlers
  const handleApplyFilter = () => {
    console.log('Applying filter for group:', selectedGroup);
    // Possibly re-fetch or apply further logic
  };

  const handleResetFilter = () => {
    setSelectedGroup('');
    setShowAll(true);
    setAutoRefresh(false);
  };

  // ------------------ Toggle Components ------------------
  /**
   * A specialized toggle with a gradient track when active
   * and a smooth, animated knob using Framer Motion.
   */
  function GradientToggle({
    enabled,
    onToggle,
    label,
    // color = 'bg-gray-300',
  }: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    color?: string;
  }) {
    return (
      <div className="flex items-center gap-2">
        <div className="select-none text-sm text-gray-700">{label}</div>
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="relative w-12 h-6 cursor-pointer"
        >
          {/* Track */}
          <motion.div
            className={`absolute inset-0 rounded-full transition-colors ${
              enabled
                ? 'bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] shadow-md shadow-[#4BB2F6]/40'
                : 'bg-gray-300'
            }`}
          />
          {/* Knob */}
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow"
            animate={{ x: enabled ? 24 : 0 }}
          />
        </motion.div>
      </div>
    );
  }

  // ------------------ Render ------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-0">
        {/* ========== Header ========== */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100 p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B0353]">
                Parc téléphonique
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-lg">
                Gérez et suivez l’ensemble des téléphones et softphones de votre parc.
              </p>
            </div>
          </div>
        </div>

        {/* ========== Filter Panel ========== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 space-y-4">
          {/* Toggles + Group Dropdown */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Toggle Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <GradientToggle
                enabled={autoRefresh}
                onToggle={() => setAutoRefresh(!autoRefresh)}
                label="Actualiser"
              />
              <GradientToggle
                enabled={showAll}
                onToggle={() => setShowAll(!showAll)}
                label="Tout afficher"
              />
            </div>

            {/* Groupe d'utilisateurs */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="groupeUtilisateurs"
                className="text-sm text-gray-700 whitespace-nowrap"
              >
                Groupe d’utilisateurs
              </label>
              <div className="relative">
                <select
                  id="groupeUtilisateurs"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 text-gray-800"
                >
                  {userGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyFilter}
              className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-semibold hover:bg-[#003DA8] transition-colors"
            >
              Appliquer le filtre
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetFilter}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Réinitialiser
            </motion.button>
          </div>
        </div>

        {/* ========== Table Section ========== */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  {[
                    'Appareil',
                    'Extension',
                    'Ligne',
                    'Statut',
                    'Dernière activité',
                    'Groupe d’utilisateurs',
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-sm font-semibold text-[#1B0353] first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/80 text-sm">
                <AnimatePresence>
                  {filteredDevices.map((device) => (
                    <motion.tr
                      key={device.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      {/* Device Name */}
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-3">
                          <FiSmartphone className="w-5 h-5 text-[#004AC8]/70" />
                          <span className="font-medium">{device.deviceName}</span>
                        </div>
                      </td>

                      {/* Extension */}
                      <td className="px-6 py-4 text-gray-700">{device.extension}</td>

                      {/* Line */}
                      <td className="px-6 py-4 text-gray-700">{device.line}</td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {device.status === 'Online' ? (
                          <div className="inline-flex items-center gap-2 text-green-600">
                            <FiCheckCircle className="w-4 h-4" />
                            <span className="font-medium">En ligne</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-red-500">
                            <FiXCircle className="w-4 h-4" />
                            <span className="font-medium">Hors ligne</span>
                          </div>
                        )}
                      </td>

                      {/* Last Seen */}
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(device.lastSeen).toLocaleString('fr-FR')}
                      </td>

                      {/* User Group */}
                      <td className="px-6 py-4 text-gray-700">{device.userGroup}</td>
                    </motion.tr>
                  ))}

                  {/* Empty State */}
                  {filteredDevices.length === 0 && (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group transition-colors"
                    >
                      <td
                        colSpan={6}
                        className="py-8 text-center text-gray-600 font-medium"
                      >
                        Aucun appareil trouvé.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
