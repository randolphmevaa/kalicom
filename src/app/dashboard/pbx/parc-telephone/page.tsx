'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronDown,
  FiSmartphone,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiEye,
  FiEyeOff,
  FiPlusCircle,
  FiDownload,
  // FiUpload,
  FiSettings,
  FiEdit3,
  FiMoreVertical,
  FiInfo,
  // FiAlertTriangle,
  FiPhone,
  FiPhoneCall,
  FiPhoneOff,
  FiClock,
  FiUsers,
  FiLayers,
  FiMinimize2,
  FiMaximize2,
  FiHelpCircle,
  FiChevronsUp,
  FiChevronsDown,
  FiList,
  FiHome,
  FiChevronRight,
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
  model?: string;
  ipAddress?: string;
}

// Sample user groups
const userGroups = [
  { value: '', label: 'Tous les groupes' },
  { value: 'Support', label: 'Support' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Technique', label: 'Technique' },
  { value: 'Direction', label: 'Direction' },
  { value: 'Administratif', label: 'Administratif' },
];

// Phone models
const phoneModels = [
  { value: '', label: 'Tous les modèles' },
  { value: 'Cisco IP Phone 8800', label: 'Cisco IP Phone 8800' },
  { value: 'Softphone Bria', label: 'Softphone Bria' },
  { value: 'Polycom VVX 450', label: 'Polycom VVX 450' },
  { value: 'iPhone Mobile', label: 'iPhone Mobile' },
  { value: 'Android Mobile', label: 'Android Mobile' },
];

// Enhanced Sample Data
const sampleDevices: PhoneDevice[] = [
  {
    id: 1,
    userGroup: 'Support',
    deviceName: 'IP Phone - Alice Martin',
    extension: '101',
    status: 'Online',
    line: '+33 1 23 45 67 89',
    lastSeen: '2023-10-10 09:30:15',
    model: 'Cisco IP Phone 8800',
    ipAddress: '192.168.1.101',
  },
  {
    id: 2,
    userGroup: 'Commercial',
    deviceName: 'Softphone - Bob Dupont',
    extension: '102',
    status: 'Offline',
    line: '+33 1 98 76 54 32',
    lastSeen: '2023-10-09 18:00:00',
    model: 'Softphone Bria',
    ipAddress: '192.168.1.102',
  },
  {
    id: 3,
    userGroup: 'Technique',
    deviceName: 'Desk Phone - Charly Durand',
    extension: '103',
    status: 'Online',
    line: '+33 6 11 22 33 44',
    lastSeen: '2023-10-10 10:15:00',
    model: 'Polycom VVX 450',
    ipAddress: '192.168.1.103',
  },
  {
    id: 4,
    userGroup: 'Commercial',
    deviceName: 'IP Phone - David Bernard',
    extension: '104',
    status: 'Offline',
    line: '+44 20 1234 5678',
    lastSeen: '2023-10-08 16:45:00',
    model: 'Cisco IP Phone 8800',
    ipAddress: '192.168.1.104',
  },
  {
    id: 5,
    userGroup: 'Direction',
    deviceName: 'Mobile - Emma Laurent',
    extension: '105',
    status: 'Online',
    line: '+33 6 87 65 43 21',
    lastSeen: '2023-10-10 11:30:00',
    model: 'iPhone Mobile',
    ipAddress: '192.168.1.105',
  },
  {
    id: 6,
    userGroup: 'Administratif',
    deviceName: 'Desk Phone - François Petit',
    extension: '106',
    status: 'Online',
    line: '+33 1 45 67 89 01',
    lastSeen: '2023-10-10 09:00:00',
    model: 'Polycom VVX 450',
    ipAddress: '192.168.1.106',
  },
  {
    id: 7,
    userGroup: 'Support',
    deviceName: 'Softphone - Gaelle Moreau',
    extension: '107',
    status: 'Offline',
    line: '+33 1 23 45 67 90',
    lastSeen: '2023-10-09 17:30:00',
    model: 'Softphone Bria',
    ipAddress: '192.168.1.107',
  },
  {
    id: 8,
    userGroup: 'Technique',
    deviceName: 'Mobile - Henri Dubois',
    extension: '108',
    status: 'Online',
    line: '+33 6 12 34 56 78',
    lastSeen: '2023-10-10 10:45:00',
    model: 'Android Mobile',
    ipAddress: '192.168.1.108',
  },
];

// Define a type for the possible property values in PhoneDevice
type PhoneDevicePropertyValue = string | number | boolean | undefined;

// Device icon based on model
const getDeviceIcon = (model?: string) => {
  if (!model) return FiPhone;
  
  if (model.includes('Mobile')) return FiSmartphone;
  if (model.includes('Softphone')) return FiLayers;
  return FiPhone;
};

// Breadcrumbs component
const Breadcrumbs = ({ items }: { items: string[] }) => (
  <div className="flex items-center text-sm text-gray-600 mb-6">
    <FiHome className="mr-2 text-gray-500" />
    {items.map((item, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <FiChevronRight className="mx-2 text-gray-400" />}
        <span className={index === items.length - 1 ? "text-[#004AC8] font-medium" : ""}>{item}</span>
      </div>
    ))}
  </div>
);


export default function ParcTelephonique() {
  // ------------------ States ------------------
  const [devices] = useState<PhoneDevice[]>(sampleDevices);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDevice, setSelectedDevice] = useState<PhoneDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Statistics
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'Online').length;
  const offlineDevices = devices.filter(d => d.status === 'Offline').length;

  // Simulate loading on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate auto-refresh
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  // ------------------ Sorting Logic ------------------
  const sortedDevices = [...devices].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: PhoneDevicePropertyValue = a[sortField as keyof PhoneDevice];
    let bValue: PhoneDevicePropertyValue = b[sortField as keyof PhoneDevice];
    
    if (sortField === 'lastSeen') {
      aValue = aValue ? new Date(aValue.toString()).getTime() : 0;
      bValue = bValue ? new Date(bValue.toString()).getTime() : 0;
    }
    
    if (aValue === undefined) aValue = "";
    if (bValue === undefined) bValue = "";

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // ------------------ Filtering Logic ------------------
  const filteredDevices = sortedDevices.filter((device) => {
    // Filter by group
    const groupMatch = selectedGroup === '' || device.userGroup === selectedGroup;
    
    // Filter by model
    const modelMatch = selectedModel === '' || device.model === selectedModel;
    
    // Filter by status
    const statusMatch = showAll || device.status === 'Online';
    
    // Filter by search term
    const searchMatch = 
      searchTerm === '' || 
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.extension.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.line.toLowerCase().includes(searchTerm.toLowerCase());
    
    return groupMatch && modelMatch && statusMatch && searchMatch;
  });

  // ------------------ Handlers ------------------
  const handleApplyFilter = () => {
    console.log('Applying filters');
    // Possibly re-fetch with new filters
  };

  const handleResetFilter = () => {
    setSelectedGroup('');
    setSelectedModel('');
    setShowAll(true);
    setAutoRefresh(false);
    setSearchTerm('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeviceClick = (device: PhoneDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
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
    icon: Icon,
  }: {
    enabled: boolean;
    onToggle: () => void;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) {
    return (
      <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-1.5 select-none text-sm text-gray-700">
          <Icon className="w-4 h-4 text-gray-500" />
          {label}
        </div>
      </div>
    );
  }

  // ------------------ Card Component ------------------
  const DeviceCard = ({ device }: { device: PhoneDevice }) => {
    const DeviceIcon = getDeviceIcon(device.model);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: '0 12px 25px rgba(0, 0, 0, 0.07)' }}
        onClick={() => handleDeviceClick(device)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
      >
        {/* Card header with status indicator */}
        <div className={`p-3 flex justify-between items-center ${device.status === 'Online' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2">
            <DeviceIcon className={`w-5 h-5 ${device.status === 'Online' ? 'text-green-600' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${device.status === 'Online' ? 'text-green-700' : 'text-red-600'}`}>
              {device.status === 'Online' ? 'En ligne' : 'Hors ligne'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {device.model}
          </span>
        </div>
        
        {/* Card body */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">{device.deviceName}</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Extension</span>
              <span className="font-medium text-gray-800">{device.extension}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ligne</span>
              <span className="font-medium text-gray-800">{device.line}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Groupe</span>
              <span className="font-medium text-gray-800">{device.userGroup}</span>
            </div>
          </div>
        </div>
        
        {/* Card footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5" />
            <span>
              {new Date(device.lastSeen).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <div className="flex gap-1">
            <button className="p-1 hover:bg-gray-200 rounded-full">
              <FiEdit3 className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded-full">
              <FiMoreVertical className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ------------------ Device Details Modal ------------------
  const DeviceDetailsModal = () => {
    if (!selectedDevice) return null;
    
    const DeviceIcon = getDeviceIcon(selectedDevice.model);
    
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg m-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`p-6 ${selectedDevice.status === 'Online' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <DeviceIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedDevice.deviceName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium opacity-90">
                          {selectedDevice.model}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                        <span className="text-sm opacity-90">Extension {selectedDevice.extension}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex mt-6 -mb-3 gap-2">
                  <div className="px-3 py-1.5 bg-white/20 rounded-t-lg text-sm font-medium">Détails</div>
                  <div className="px-3 py-1.5 text-sm opacity-70">Historique</div>
                  <div className="px-3 py-1.5 text-sm opacity-70">Configuration</div>
                </div>
              </div>
              
              {/* Modal body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="flex items-center gap-2">
                      {selectedDevice.status === 'Online' ? (
                        <><FiCheckCircle className="text-green-600 w-4 h-4" /><span className="font-medium text-green-700">En ligne</span></>
                      ) : (
                        <><FiXCircle className="text-red-500 w-4 h-4" /><span className="font-medium text-red-600">Hors ligne</span></>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Ligne</div>
                    <div className="font-medium text-gray-800">{selectedDevice.line}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Groupe d&apos;utilisateurs</div>
                    <div className="font-medium text-gray-800">{selectedDevice.userGroup}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Adresse IP</div>
                    <div className="font-medium text-gray-800">{selectedDevice.ipAddress}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Dernière activité</div>
                    <div className="font-medium text-gray-800">
                      {new Date(selectedDevice.lastSeen).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Modèle</div>
                    <div className="font-medium text-gray-800">{selectedDevice.model}</div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Actions rapides</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiRefreshCw className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-gray-700">Actualiser</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiEdit3 className="w-5 h-5 text-amber-600" />
                      <span className="text-xs text-gray-700">Modifier</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiSettings className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-700">Configurer</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Modal footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003DA8] transition-colors text-sm font-medium">
                  Voir les détails complets
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ------------------ FiX Icon (not imported in the example code) ------------------
  const FiX = ({ className = "" }: { className?: string }) => (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  // ------------------ Render ------------------
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen pb-12"
    >
      <div className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Statistiques']} />
        {/* ========== Header with Statistics ========== */}
        <div className="relative mb-8 overflow-hidden bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4BB2F6]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-[#004AC8]/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#004AC8]/10 rounded-xl">
                    <FiSmartphone className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#1B0353]">
                    Parc téléphonique
                  </h1>
                </div>
                <p className="text-sm text-gray-600 mt-1 max-w-lg">
                  Gérez et suivez l&apos;ensemble des téléphones et softphones de votre parc. Consultez les informations détaillées de chaque appareil.
                </p>
              </div>
              
              {/* Statistics */}
              <div className="flex flex-wrap gap-4">
                {/* Total Devices */}
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-gray-100 min-w-[100px] flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-500 font-medium">Total Appareils</div>
                    <FiPhone className="w-4 h-4 text-[#004AC8]" />
                  </div>
                  <div className="text-xl font-bold text-[#1B0353]">{totalDevices}</div>
                </div>
                
                {/* Online Devices */}
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-gray-100 min-w-[100px] flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-500 font-medium">En ligne</div>
                    <FiPhoneCall className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-green-600">{onlineDevices}</div>
                </div>
                
                {/* Offline Devices */}
                <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-gray-100 min-w-[100px] flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-500 font-medium">Hors ligne</div>
                    <FiPhoneOff className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="text-xl font-bold text-red-500">{offlineDevices}</div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors flex items-center gap-2"
              >
                <FiPlusCircle className="w-5 h-5" />
                Ajouter un appareil
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRefresh}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 border border-gray-200"
                disabled={isRefreshing}
              >
                <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 border border-gray-200"
              >
                <FiDownload className="w-5 h-5" />
                Exporter
              </motion.button>
              
              <div className="flex ml-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-l-lg flex items-center justify-center transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-[#004AC8] text-white' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-r-lg flex items-center justify-center transition-colors ${
                    viewMode === 'cards' 
                      ? 'bg-[#004AC8] text-white' 
                      : 'bg-white text-gray-700 border-l-0 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FiLayers className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========== Enhanced Filter Panel ========== */}
        <motion.div
          layout
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#004AC8]/10 rounded-lg">
                <FiFilter className="w-4 h-4 text-[#004AC8]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
            </div>
            
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isFilterExpanded ? <FiMinimize2 className="w-5 h-5 text-gray-500" /> : <FiMaximize2 className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search + Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Search Field */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un appareil..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 text-gray-700"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* User Group Dropdown */}
                  <div className="relative">
                    <select
                      id="groupeUtilisateurs"
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full appearance-none pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 text-gray-700"
                    >
                      {userGroups.map((group) => (
                        <option key={group.value} value={group.value}>
                          {group.label}
                        </option>
                      ))}
                    </select>
                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                  
                  {/* Phone Model Dropdown */}
                  <div className="relative">
                    <select
                      id="phoneModel"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full appearance-none pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 text-gray-700"
                    >
                      {phoneModels.map((model) => (
                        <option key={model.value} value={model.value}>
                          {model.label}
                        </option>
                      ))}
                    </select>
                    <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                
                {/* Toggle Buttons + Filter Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {/* Toggle Buttons */}
                  <div className="flex flex-wrap items-center gap-6">
                    <GradientToggle
                      enabled={autoRefresh}
                      onToggle={() => setAutoRefresh(!autoRefresh)}
                      label="Auto-actualisation"
                      icon={FiRefreshCw}
                    />
                    <GradientToggle
                      enabled={showAll}
                      onToggle={() => setShowAll(!showAll)}
                      label="Inclure hors ligne"
                      icon={showAll ? FiEye : FiEyeOff}
                    />
                  </div>
                  
                  {/* Filter Action Buttons */}
                  <div className="flex gap-3 self-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleApplyFilter}
                      className="px-4 py-2 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                    >
                      <FiFilter className="w-4 h-4" />
                      Appliquer le filtre
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleResetFilter}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Réinitialiser
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ========== Content Section ========== */}
        {isLoading ? (
          // Loading State
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#004AC8] border-t-transparent animate-spin"></div>
                <p className="text-gray-500 text-sm font-medium">Chargement des appareils...</p>
              </div>
            </div>
          </div>
        ) : filteredDevices.length === 0 ? (
          // Empty State
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiSmartphone className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun appareil trouvé</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Aucun appareil ne correspond à vos critères de recherche. Essayez d&apos;ajuster vos filtres.
              </p>
              <button
                onClick={handleResetFilter}
                className="px-4 py-2 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors flex items-center gap-2"
              >
                <FiFilter className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          // Card View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Results summary */}
            <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiInfo className="w-4 h-4 text-[#004AC8]" />
                <span>
                  {filteredDevices.length} {filteredDevices.length === 1 ? 'appareil trouvé' : 'appareils trouvés'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiClock className="w-3.5 h-3.5" />
                <span>Dernière actualisation : {new Date().toLocaleTimeString('fr-FR')}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-b-xl">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                    {[
                      { key: 'deviceName', label: 'Appareil' },
                      { key: 'extension', label: 'Extension' },
                      { key: 'line', label: 'Ligne' },
                      { key: 'status', label: 'Statut' },
                      { key: 'lastSeen', label: 'Dernière activité' },
                      { key: 'userGroup', label: 'Groupe dutilisateurs' },
                      { key: 'actions', label: 'Actions' }
                    ].map((header) => (
                      <th
                        key={header.key}
                        className={`px-6 py-3 text-left text-sm font-semibold text-[#1B0353] transition-colors ${header.key !== 'actions' ? 'cursor-pointer hover:bg-[#004AC8]/10' : ''}`}
                        onClick={() => header.key !== 'actions' && handleSort(header.key)}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.label}
                          {sortField === header.key && (
                            <span>
                              {sortDirection === 'asc' ? (
                                <FiChevronsUp className="w-4 h-4" />
                              ) : (
                                <FiChevronsDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/80 text-sm">
                  <AnimatePresence>
                    {filteredDevices.map((device) => {
                      const DeviceIcon = getDeviceIcon(device.model);
                      
                      return (
                        <motion.tr
                          key={device.id}
                          initial={{ opacity: 0, backgroundColor: '#f0f9ff' }}
                          animate={{ opacity: 1, backgroundColor: '#ffffff' }}
                          exit={{ opacity: 0 }}
                          whileHover={{ backgroundColor: '#f8fafc' }}
                          className="group transition-colors"
                        >
                          {/* Device Name */}
                          <td className="px-6 py-4 text-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-[#004AC8]/10 rounded-lg group-hover:bg-[#004AC8]/20 transition-colors">
                                <DeviceIcon className="w-5 h-5 text-[#004AC8]/70" />
                              </div>
                              <div>
                                <div className="font-medium group-hover:text-[#004AC8] transition-colors">
                                  {device.deviceName}
                                </div>
                                <div className="text-xs text-gray-500">{device.model}</div>
                              </div>
                            </div>
                          </td>

                          {/* Extension */}
                          <td className="px-6 py-4 text-gray-700 font-medium">{device.extension}</td>

                          {/* Line */}
                          <td className="px-6 py-4 text-gray-700">{device.line}</td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            {device.status === 'Online' ? (
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-green-50 text-green-700 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-xs">En ligne</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-50 text-red-600 rounded-full">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="font-medium text-xs">Hors ligne</span>
                              </div>
                            )}
                          </td>

                          {/* Last Seen */}
                          <td className="px-6 py-4 text-gray-700">
                            <div className="flex items-center gap-1.5">
                              <FiClock className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(device.lastSeen).toLocaleString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </td>

                          {/* User Group */}
                          <td className="px-6 py-4">
                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {device.userGroup}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleDeviceClick(device)}
                                className="p-1.5 text-gray-600 hover:text-[#004AC8] hover:bg-[#004AC8]/10 rounded-lg transition-colors"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiMoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Help Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5 p-4 rounded-xl border border-[#004AC8]/10 flex items-start gap-3"
        >
          <div className="p-1.5 bg-[#004AC8]/10 rounded-lg shrink-0">
            <FiHelpCircle className="w-5 h-5 text-[#004AC8]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#004AC8] mb-1">Besoin d&apos;aide ?</h3>
            <p className="text-xs text-gray-600">
              Consultez notre <a href="#" className="text-[#004AC8] font-medium underline">guide d&apos;utilisation</a> pour en savoir plus sur la gestion de votre parc téléphonique ou <a href="#" className="text-[#004AC8] font-medium underline">contactez le support</a> si vous avez des questions.
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Device Details Modal */}
      <DeviceDetailsModal />
    </motion.div>
  );
}