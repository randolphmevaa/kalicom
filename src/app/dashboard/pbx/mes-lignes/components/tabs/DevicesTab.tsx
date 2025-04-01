// app/dashboard/pbx/mes-lignes/components/tabs/DevicesTab.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiServer, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch, 
  FiRefreshCw, 
  // FiFilter, 
  FiChevronDown, 
  FiPlus, 
  FiHash, 
  FiPhone, 
  FiSettings, 
  FiMonitor, 
  FiEdit, 
  FiTrash2, 
  FiChevronUp 
} from 'react-icons/fi';
import { Device } from '../../models/types';
import { tableVariants, rowVariants, cardVariants } from '../../utils/animations';

interface DevicesTabProps {
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
}

const DevicesTab: React.FC<DevicesTabProps> = ({ devices, onSelectDevice, onAddDevice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Device | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  // Use a typed record for status mapping
  const statusMap: Record<string, string | null> = { Tous: null, 'En ligne': 'Online', 'Hors ligne': 'Offline' };

  const filteredDevices = devices
    .filter(
      (device: Device) =>
        (device.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Calculate totals for statistics
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(device => device.status === 'Online').length;
  const offlineDevices = devices.filter(device => device.status === 'Offline').length;

  return (
    <div>
      {/* Summary Cards */}
      <motion.div 
        variants={tableVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        {[
          { label: 'Total Appareils', value: totalDevices, icon: FiServer, color: 'from-[#1B0353] to-[#004AC8]' },
          { label: 'En ligne', value: onlineDevices, icon: FiCheckCircle, color: 'from-[#004AC8] to-[#4BB2F6]' },
          { label: 'Hors ligne', value: offlineDevices, icon: FiXCircle, color: 'from-[#4BB2F6] to-[#1B0353]' },
        ].map((card, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={cardVariants}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
            className={`bg-gradient-to-br ${card.color} p-6 rounded-3xl shadow-lg backdrop-blur-md text-white relative overflow-hidden`}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id={`device-grid-${index}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="white" strokeWidth="1" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#device-grid-${index})`} />
              </svg>
            </div>
            
            <div className="flex items-center relative z-10">
              <card.icon className="w-10 h-10 mr-4" />
              <div>
                <p className="text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-extrabold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Device Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#1B0353]">Appareils connectés</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddDevice}
          className="flex items-center px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
        >
          <FiPlus className="mr-2" />
          Ajouter un appareil
        </motion.button>
      </div>
      
      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 mb-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-1/3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1B0353]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un appareil ou une ligne..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#004AC8] text-gray-800"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('Tous');
              }}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Réinitialiser
            </motion.button>
          </div>
        </div>
        {selectedDevices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-200"
          >
            <div className="text-sm text-gray-600 flex items-center">
              <FiSettings className="mr-2" /> 
              {selectedDevices.length} appareil{selectedDevices.length > 1 ? 's' : ''} sélectionné{selectedDevices.length > 1 ? 's' : ''}
            </div>
            <div className="flex-1"></div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBulkAction('restart')}
              className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition flex items-center"
            >
              <FiRefreshCw className="mr-2" />
              Redémarrer
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleBulkAction('remove')}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Supprimer
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Devices Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        id="devices-table" 
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
      >
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
                {['Adresse Mac', 'Label', 'Modèle', 'Line', 'Device Url', 'Status', 'Actions'].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {['Adresse Mac', 'Label', 'Modèle', 'Line', 'Device Url', 'Status'].includes(header) && (
                        <button
                          onClick={() => handleSort(
                            header === 'Adresse Mac' ? 'macAddress' : 
                            header === 'Label' ? 'label' : 
                            header === 'Modèle' ? 'model' : 
                            header === 'Line' ? 'line' :
                            header === 'Device Url' ? 'deviceUrl' : 'status' as keyof Device
                          )}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {sortConfig.key === (
                            header === 'Adresse Mac' ? 'macAddress' : 
                            header === 'Label' ? 'label' : 
                            header === 'Modèle' ? 'model' : 
                            header === 'Line' ? 'line' :
                            header === 'Device Url' ? 'deviceUrl' : 'status'
                          ) ? (
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
                  variants={rowVariants}
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

                  {/* MAC Address */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-[#004AC8]/10 rounded-lg">
                        <FiHash className="w-4 h-4 text-[#004AC8]" />
                      </div>
                      <span className="font-medium text-gray-900">{device.macAddress}</span>
                    </div>
                  </td>

                  {/* Label */}
                  <td className="px-6 py-4 text-gray-700">{device.label}</td>

                  {/* Model */}
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <FiMonitor className="w-4 h-4 text-gray-400" />
                      {device.model}
                    </div>
                  </td>

                  {/* Line */}
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      {device.line}
                    </div>
                  </td>

                  {/* Device URL */}
                  <td className="px-6 py-4">
                    <a 
                      href={device.deviceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#004AC8] hover:underline"
                    >
                      {device.deviceUrl}
                    </a>
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

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectDevice(device)}
                        className="p-2 hover:bg-blue-100 rounded-lg text-[#004AC8] transition-colors"
                        title="Modifier"
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
                <FiServer className="w-12 h-12 mx-auto" />
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
      </motion.div>
    </div>
  );
};

export default DevicesTab;