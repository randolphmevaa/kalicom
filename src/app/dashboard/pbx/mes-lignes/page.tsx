'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiSearch,
  FiPlus,
  // FiSettings,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  // FiPieChart,
  // FiActivity,
  FiChevronDown,
  FiChevronUp,
  FiServer,
  // FiClock,
  FiHash,
  // FiSmartphone,
  FiX,
  FiDownload,
  FiFileText,
  FiHome,
  FiChevronRight,
  FiCalendar,
  FiToggleRight,
  FiToggleLeft,
  FiArrowLeft,
  FiUsers,
  FiMail,
  // FiList,
  FiMonitor
} from 'react-icons/fi';
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// Data interfaces
interface LineType {
  id: number;
  extension: string;
  number: string;
  displayNumber: string;
  name: string;
  user: string;
  voicemailEnabled: boolean;
  status: 'Active' | 'Inactive';
  description: string;
}

interface Device {
  id: number;
  macAddress: string;
  label: string;
  model: string;
  line: string;
  deviceUrl: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
}


// interface CallDistribution {
//   name: string;
//   value: number;
// }

interface UsageLine {
  extension: string;
  userName: string;
  aliasNumber: string;
  missed: number;
  unanswered: number;
  busy: number;
  aloc: string;
  incomingCalls: number;
  incomingDuration: number;
  outgoingCalls: number;
  outgoingFailed: number;
  outgoingMissed: number;
  outgoingDuration: number;
  description: string;
}

// Define a type for exportable data
type ExportableData = LineType | UsageLine | Device;

// Sample Data
const lines: LineType[] = [
  { id: 1, extension: '101', number: '+33 1 23 45 67 89', displayNumber: '+33 1 23 45 67 89', name: 'Accueil', user: 'Thomas Martin', voicemailEnabled: true, status: 'Active', description: 'Ligne principale pour l\'accueil' },
  { id: 2, extension: '102', number: '+33 1 98 76 54 32', displayNumber: '+33 1 98 76 54 32', name: 'Support', user: 'Sophie Dubois', voicemailEnabled: false, status: 'Inactive', description: 'Ligne pour le service support client' },
  { id: 3, extension: '103', number: '+33 1 11 22 33 44', displayNumber: '+33 1 11 22 33 44', name: 'Commercial', user: 'Pierre Leroy', voicemailEnabled: true, status: 'Active', description: 'Ligne du département commercial' },
];

const devices: Device[] = [
  { id: 1, macAddress: '00:1A:2B:3C:4D:5E', label: 'Téléphone Accueil', model: 'Aastra 6731i', line: '101', deviceUrl: 'http://192.168.1.101', status: 'Online', lastSeen: '2023-10-01 12:00' },
  { id: 2, macAddress: 'A1:B2:C3:D4:E5:F6', label: 'Softphone Support', model: 'Atcom A20', line: '102', deviceUrl: 'http://192.168.1.102', status: 'Offline', lastSeen: '2023-09-30 10:00' },
  { id: 3, macAddress: '6F:7E:8D:9C:0B:1A', label: 'Téléphone Commercial', model: 'Grandstream GXP2170', line: '103', deviceUrl: 'http://192.168.1.103', status: 'Online', lastSeen: '2023-10-01 14:00' },
];

const usageLines: UsageLine[] = [
  { extension: '101', userName: 'Thomas Martin', aliasNumber: '+33 1 23 45 67 89', missed: 5, unanswered: 3, busy: 2, aloc: '4m12s', incomingCalls: 45, incomingDuration: 180, outgoingCalls: 28, outgoingFailed: 2, outgoingMissed: 1, outgoingDuration: 120, description: 'Ligne principale pour l\'accueil' },
  { extension: '102', userName: 'Sophie Dubois', aliasNumber: '+33 1 98 76 54 32', missed: 2, unanswered: 1, busy: 0, aloc: '3m45s', incomingCalls: 32, incomingDuration: 145, outgoingCalls: 19, outgoingFailed: 1, outgoingMissed: 0, outgoingDuration: 95, description: 'Ligne pour le service support client' },
  { extension: '103', userName: 'Pierre Leroy', aliasNumber: '+33 1 11 22 33 44', missed: 3, unanswered: 2, busy: 1, aloc: '5m23s', incomingCalls: 38, incomingDuration: 210, outgoingCalls: 25, outgoingFailed: 3, outgoingMissed: 2, outgoingDuration: 130, description: 'Ligne du département commercial' },
];

// const generateCallData = (): CallData[] => {
//   const data: CallData[] = [];
//   for (let i = 23; i >= 0; i--) {
//     const time = new Date();
//     time.setHours(time.getHours() - i);
//     const hour = time.getHours().toString().padStart(2, '0');
//     data.push({
//       time: `${hour}:00`,
//       calls: Math.floor(Math.random() * 50) + 10,
//       duration: parseFloat((Math.random() * 5 + 1).toFixed(1)),
//     });
//   }
//   return data;
// };

// const callData = generateCallData();
// const callDistribution: CallDistribution[] = [
//   { name: 'Entrants', value: 65 },
//   { name: 'Sortants', value: 35 },
// ];
// const totalCalls = callData.reduce((sum, item) => sum + item.calls, 0);
// const totalDuration = callData.reduce((sum, item) => sum + (item.duration * item.calls), 0);
// const averageDuration = (totalDuration / totalCalls).toFixed(1);
// const peakCallTime = callData.reduce((max, item) => (item.calls > max.calls ? item : max), callData[0]).time;

// const COLORS = ['#004AC8', '#4BB2F6'];

// Helper functions for export
const exportToCSV = <T extends ExportableData>(data: T[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  const csv = [headers, ...rows].join('\n');
  
  // Create a blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = (elementId: string, filename: string) => {
  // In a real implementation, this would use a library like jsPDF or html2pdf.js
  // For this example, we'll just show an alert
  alert(`Le PDF ${filename} a été généré et téléchargé.`);
  
  // In a real implementation:
  /*
  import html2pdf from 'html2pdf.js';
  const element = document.getElementById(elementId);
  html2pdf()
    .from(element)
    .save(`${filename}.pdf`);
  */
};

// Breadcrumbs Component
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

// Line Details Component
const LineDetails = ({ line, onClose }: { line: LineType; onClose: () => void }) => {
  const [formData, setFormData] = useState({ ...line });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ligne mise à jour avec succès!');
    onClose();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors">
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Mes lignes', `Extension ${formData.extension}`]} />
        </div>
        
        {/* Line Details Form */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-[#1B0353] mb-6">Détails de la ligne</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extension (read-only)</label>
                <input
                  type="text"
                  name="extension"
                  value={formData.extension}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigner à un utilisateur</label>
                <div className="relative">
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="Thomas Martin">Thomas Martin</option>
                    <option value="Sophie Dubois">Sophie Dubois</option>
                    <option value="Pierre Leroy">Pierre Leroy</option>
                    <option value="Marie Petit">Marie Petit</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro sortant</label>
                <div className="relative">
                  <select
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="+33 1 23 45 67 89">+33 1 23 45 67 89</option>
                    <option value="+33 1 98 76 54 32">+33 1 98 76 54 32</option>
                    <option value="+33 1 11 22 33 44">+33 1 11 22 33 44</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du numéro</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification d&apos;appel manqué</label>
                <div className="relative">
                  <select
                    name="missedCallNotification"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="none">Aucune</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéros</label>
                <div className="relative">
                  <select
                    name="displayNumber"
                    value={formData.displayNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="+33 1 23 45 67 89">+33 1 23 45 67 89</option>
                    <option value="+33 1 98 76 54 32">+33 1 98 76 54 32</option>
                    <option value="+33 1 11 22 33 44">+33 1 11 22 33 44</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Musique d&apos;attente</label>
                <div className="relative">
                  <select
                    name="holdMusic"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="default">Musique par défaut</option>
                    <option value="classical">Classique</option>
                    <option value="jazz">Jazz</option>
                    <option value="none">Aucune</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setFormData({ ...line })}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

// Device Add/Edit Component
const DeviceForm = ({ device, onClose }: { device?: Device; onClose: () => void }) => {
  const isEditing = !!device;
  const [formData, setFormData] = useState(
    device || {
      id: 0,
      macAddress: '',
      label: '',
      model: '',
      line: '',
      deviceUrl: '',
      status: 'Offline' as const,
      lastSeen: new Date().toISOString(),
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appareil ${isEditing ? 'modifié' : 'créé'} avec succès!`);
    onClose();
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors">
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Devices', isEditing ? 'Modifier' : 'Ajouter']} />
        </div>
        
        {/* Device Form */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-[#1B0353] mb-6">{isEditing ? 'Modifier' : 'Ajouter'} un appareil</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes lignes</label>
              <div className="relative">
                <select
                  name="line"
                  value={formData.line}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                >
                  <option value="101">101 - Accueil</option>
                  <option value="102">102 - Support</option>
                  <option value="103">103 - Commercial</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-[#1B0353] pt-4">Device data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Mac *</label>
                <input
                  type="text"
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleChange}
                  placeholder="00:1A:2B:3C:4D:5E"
                  pattern="[A-Fa-f0-9:]{17}"
                  required
                  title="The MAC address must be exactly 12 characters long and contain only numbers and letters (A-F)"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
                <p className="text-xs text-gray-500 mt-1">The MAC address must be exactly 12 characters long and contain only numbers and letters (A-F).</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                <div className="relative">
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="">Sélectionner un modèle</option>
                    <option value="Aastra 6731i">Aastra 6731i</option>
                    <option value="Aastra 6739i">Aastra 6739i</option>
                    <option value="Algo 8180">Algo 8180</option>
                    <option value="Atcom A20">Atcom A20</option>
                    <option value="Grandstream GXP2130">Grandstream GXP2130</option>
                    <option value="Grandstream GXP2170">Grandstream GXP2170</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device enabled</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status === 'Online' ? 'True' : 'False'}
                    onChange={(e) => setFormData({...formData, status: e.target.value === 'True' ? 'Online' : 'Offline'})}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  >
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-[#1B0353] pt-4">Lines</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Line</label>
                  <div className="relative">
                    <select
                      name="lineNumber"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      {Array.from({ length: 99 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Server Address</label>
                  <input
                    type="text"
                    name="serverAddress"
                    placeholder="sip.example.com"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Nom à afficher"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    name="userId"
                    placeholder="user123"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auth ID</label>
                  <input
                    type="text"
                    name="authId"
                    placeholder="auth123"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                  <input
                    type="number"
                    name="port"
                    placeholder="5060"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
                  <div className="relative">
                    <select
                      name="transport"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="TLS">TLS</option>
                      <option value="DNS SRV">DNS SRV</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Register Expires</label>
                  <input
                    type="number"
                    name="registerExpires"
                    placeholder="3600"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shared Line</label>
                  <div className="relative">
                    <select
                      name="sharedLine"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activé</label>
                  <div className="relative">
                    <select
                      name="enabled"
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
                    >
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setFormData(device || {
                  id: 0,
                  macAddress: '',
                  label: '',
                  model: '',
                  line: '',
                  deviceUrl: '',
                  status: 'Offline',
                  lastSeen: new Date().toISOString(),
                })}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function PBXMesLignes() {
  const [activeTab, setActiveTab] = useState('mes-lignes');
  const [selectedLine, setSelectedLine] = useState<LineType | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);
  
  // If a line or device is selected, show the appropriate form
  if (selectedLine) {
    return <LineDetails line={selectedLine} onClose={() => setSelectedLine(null)} />;
  }
  
  if (selectedDevice || addingDevice) {
    return <DeviceForm 
      device={selectedDevice || undefined} 
      onClose={() => {
        setSelectedDevice(null);
        setAddingDevice(false);
      }} 
    />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', activeTab === 'mes-lignes' ? 'Mes lignes' : activeTab === "résumé-d'utilisation" ? "Résumé d'utilisation" : 'Devices']} />
        
        {/* Header */}
        <div className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1B0353]">Gestion des Lignes</h1>
              <p className="text-sm text-gray-500 mt-1">Contrôlez et surveillez vos lignes téléphoniques</p>
            </div>
            <div className="flex space-x-4">
              {/* Export Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    if (activeTab === 'mes-lignes') exportToCSV(lines, 'mes-lignes');
                    else if (activeTab === "résumé-d'utilisation") exportToCSV(usageLines, 'resume-utilisation');
                    else exportToCSV(devices, 'devices');
                  }}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en CSV"
                >
                  <FiDownload className="mr-2" />
                  CSV
                </button>
                <button 
                  onClick={() => {
                    if (activeTab === 'mes-lignes') exportToPDF('mes-lignes-table', 'mes-lignes');
                    else if (activeTab === "résumé-d'utilisation") exportToPDF('resume-utilisation-table', 'resume-utilisation');
                    else exportToPDF('devices-table', 'devices');
                  }}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en PDF"
                >
                  <FiFileText className="mr-2" />
                  PDF
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="relative mb-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#004AC8]/20 to-transparent" />
          
          <div className="flex gap-6 px-2">
            {[
              { id: 'mes-lignes', label: 'Mes lignes', icon: FiPhone },
              { id: "résumé-d'utilisation", label: "Résumé d'utilisation", icon: FiBarChart2 },
              { id: 'devices', label: 'Devices', icon: FiServer }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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
                    <tab.icon className={`w-5 h-5 ${isActive ? 'text-[#004AC8]' : 'text-gray-600'}`} />
                    <span className={`text-sm font-semibold transition-colors ${
                      isActive 
                        ? 'text-[#004AC8] bg-clip-text bg-gradient-to-r from-[#004AC8] to-[#4BB2F6]' 
                        : 'text-gray-600 hover:text-[#1B0353]'
                    }`}>
                      {tab.label}
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
          {activeTab === 'mes-lignes' && <MesLignesTab lines={lines} onSelectLine={setSelectedLine} />}
          {activeTab === "résumé-d'utilisation" && <UsageSummaryTab usageLines={usageLines} />}
          {activeTab === 'devices' && <DevicesTab 
            devices={devices} 
            onSelectDevice={setSelectedDevice} 
            onAddDevice={() => setAddingDevice(true)} 
          />}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Mes Lignes Tab
function MesLignesTab({ lines, onSelectLine }: { lines: LineType[]; onSelectLine: (line: LineType) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [sortConfig, setSortConfig] = useState<{ key: keyof LineType | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [ , setSelectedLine] = useState<LineType | null>(null);
  const [showDescription, setShowDescription] = useState<number | null>(null);

  // Use a typed record for status mapping
  const statusMap: Record<string, string | null> = { Tous: null, Actifs: 'Active', Inactifs: 'Inactive' };

  const filteredLines = lines
    .filter(
      (line: LineType) =>
        (line.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        line.user.toLowerCase().includes(searchQuery.toLowerCase())) &&
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

  const handleLineClick = (line: LineType) => {
    setSelectedLine(line);
    onSelectLine(line);
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFilter('Tous');
    setSortConfig({ key: null, direction: 'asc' });
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
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
              <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par extension, numéro, nom ou utilisateur..."
              className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => {/* Apply filter logic */}}
              className="px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
            >
              Appliquer le filtre
            </button>
          </div>
        </div>

        {/* Enhanced Table */}
        <div id="mes-lignes-table" className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                {['Extension', 'Numéro à l\'affichage', 'Nom du numéro', 'Utilisateur', 'Messagerie vocale activée', 'Statut', 'Actions'].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 6 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {['Extension', 'Numéro à l\'affichage', 'Nom du numéro', 'Utilisateur', 'Statut'].includes(header) && (
                        <button
                          onClick={() => handleSort(
                            header === 'Extension' ? 'extension' : 
                            header === 'Numéro à l\'affichage' ? 'displayNumber' : 
                            header === 'Nom du numéro' ? 'name' : 
                            header === 'Utilisateur' ? 'user' : 'status' as keyof LineType
                          )}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {sortConfig.key === (
                            header === 'Extension' ? 'extension' : 
                            header === 'Numéro à l\'affichage' ? 'displayNumber' : 
                            header === 'Nom du numéro' ? 'name' : 
                            header === 'Utilisateur' ? 'user' : 'status'
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
              {filteredLines.map((line) => (
                <motion.tr
                  key={line.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors relative"
                  onMouseEnter={() => setShowDescription(line.id)}
                  onMouseLeave={() => setShowDescription(null)}
                >
                  {/* Extension Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiHash className="w-5 h-5 text-[#004AC8]/80 shrink-0" />
                      <span className="font-medium text-gray-900">{line.extension}</span>
                    </div>
                  </td>

                  {/* Display Number Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-5 h-5 text-[#004AC8]/80 shrink-0" />
                      <span className="font-medium text-gray-900">{line.displayNumber}</span>
                    </div>
                  </td>
                  
                  {/* Name Column */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{line.name}</span>
                  </td>
                  
                  {/* User Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{line.user}</span>
                    </div>
                  </td>
                  
                  {/* Voicemail Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {line.voicemailEnabled ? (
                        <FiMail className="w-5 h-5 text-green-500" />
                      ) : (
                        <FiX className="w-5 h-5 text-red-500" />
                      )}
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
                        onClick={() => handleLineClick(line)}
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
                  
                  {/* Description tooltip */}
                  {showDescription === line.id && (
                    <div className="absolute z-10 left-0 mt-2 -bottom-20 ml-6 px-4 py-3 bg-gray-800 text-white text-sm rounded-xl shadow-xl max-w-md">
                      <div className="font-medium mb-1">Description:</div>
                      <div>{line.description}</div>
                    </div>
                  )}
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
function UsageSummaryTab({ usageLines }: { usageLines: UsageLine[] }) {
  // const [timeRange, setTimeRange] = useState('24h');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Tous');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeInternal, setIncludeInternal] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UsageLine | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  const filteredLines = usageLines
    .filter((line) => {
      // Apply search filter
      if (searchQuery && searchType !== 'Tous') {
        const field = searchType.toLowerCase() as keyof UsageLine;
        return line[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchQuery) {
        return (
          line.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
          line.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          line.aliasNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const isAsc = sortConfig.direction === 'asc';
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isAsc ? aValue - bValue : bValue - aValue;
      }
      
      return isAsc
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    
  const handleSort = (key: keyof UsageLine) => {
    setSortConfig({ key, direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc' });
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setSearchType('Tous');
    setStartDate('');
    setEndDate('');
    setIncludeInternal(false);
  };

  return (
    <div>
      {/* Enhanced Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche rapide</label>
            <div className="relative">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="text-gray-400 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              >
                <option value="Tous">Tous les champs</option>
                <option value="extension">Extension</option>
                <option value="userName">Utilisateur</option>
                <option value="aliasNumber">Numéro alias</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiCalendar className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiCalendar className="w-5 h-5 text-gray-600" />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-400 w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-end">
            <label className="block text-sm font-medium text-gray-700 mb-1">Inclure appels internes</label>
            <button
              onClick={() => setIncludeInternal(!includeInternal)}
              className="text-gray-400 flex items-center px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8]"
            >
              {includeInternal ? (
                <FiToggleRight className="w-6 h-6 text-[#004AC8] mr-2" />
              ) : (
                <FiToggleLeft className="w-6 h-6 text-gray-400 mr-2" />
              )}
              {includeInternal ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => {/* Apply filter logic */}}
            className="px-4 py-2 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
          >
            Appliquer le filtre
          </button>
        </div>
      </div>

      {/* Usage Summary Table */}
      <div id="resume-utilisation-table" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
              <tr>
                {[
                  'Extension', 'Nom de l\'utilisateur', 'Numéro alias', 'Manqué', 'Non répondu', 'Occupé', 
                  'ALOC', 'Appels entrants', 'Durée entrants', 'Appels sortants', 'Échec de l\'appel sortant', 
                  'Appel sortant manqué', 'Durée sortants', 'Description'
                ].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-4 py-3 text-left text-sm font-semibold text-[#1B0353] ${
                      idx === 0 ? 'rounded-tl-xl' : idx === 13 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="whitespace-nowrap">{header}</span>
                      <button
                        onClick={() => handleSort(
                          header === 'Extension' ? 'extension' : 
                          header === 'Nom de l\'utilisateur' ? 'userName' : 
                          header === 'Numéro alias' ? 'aliasNumber' : 
                          header === 'Manqué' ? 'missed' :
                          header === 'Non répondu' ? 'unanswered' :
                          header === 'Occupé' ? 'busy' :
                          header === 'ALOC' ? 'aloc' :
                          header === 'Appels entrants' ? 'incomingCalls' :
                          header === 'Durée entrants' ? 'incomingDuration' :
                          header === 'Appels sortants' ? 'outgoingCalls' :
                          header === 'Échec de l\'appel sortant' ? 'outgoingFailed' :
                          header === 'Appel sortant manqué' ? 'outgoingMissed' :
                          header === 'Durée sortants' ? 'outgoingDuration' : 'description' as keyof UsageLine
                        )}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {sortConfig.key === (
                          header === 'Extension' ? 'extension' : 
                          header === 'Nom de l\'utilisateur' ? 'userName' : 
                          header === 'Numéro alias' ? 'aliasNumber' : 
                          header === 'Manqué' ? 'missed' :
                          header === 'Non répondu' ? 'unanswered' :
                          header === 'Occupé' ? 'busy' :
                          header === 'ALOC' ? 'aloc' :
                          header === 'Appels entrants' ? 'incomingCalls' :
                          header === 'Durée entrants' ? 'incomingDuration' :
                          header === 'Appels sortants' ? 'outgoingCalls' :
                          header === 'Échec de l\'appel sortant' ? 'outgoingFailed' :
                          header === 'Appel sortant manqué' ? 'outgoingMissed' :
                          header === 'Durée sortants' ? 'outgoingDuration' : 'description'
                        ) ? (
                          sortConfig.direction === 'asc' ? (
                            <FiChevronUp className="w-3 h-3 text-[#004AC8]" />
                          ) : (
                            <FiChevronDown className="w-3 h-3 text-[#004AC8]" />
                          )
                        ) : (
                          <FiChevronDown className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/80">
              {filteredLines.map((line, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="group transition-colors"
                >
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap">{line.extension}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap">{line.userName}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap">{line.aliasNumber}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.missed}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.unanswered}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.busy}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.aloc}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.incomingCalls}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.incomingDuration} min</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.outgoingCalls}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.outgoingFailed}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.outgoingMissed}</td>
                  <td className="text-gray-400 px-4 py-3 whitespace-nowrap text-center">{line.outgoingDuration} min</td>
                  <td className="text-gray-400 px-4 py-3 max-w-xs truncate">{line.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredLines.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mx-auto mb-4 text-[#004AC8]/50">
                <FiBarChart2 className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 font-medium">
                Aucune donnée trouvée
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

// Devices Tab
function DevicesTab({ devices, onSelectDevice, onAddDevice }: { devices: Device[]; onSelectDevice: (device: Device) => void; onAddDevice: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Device | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  // const [showDescription, setShowDescription] = useState<number | null>(null);

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

  return (
    <div>
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
      <div id="devices-table" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
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
      </div>
    </div>
  );
}
