'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiChevronDown,
  FiHome,
  FiChevronRight,
  FiCheck,
  FiX,
  FiPhone,
  FiArrowLeft,
  FiUsers,
  FiChevronLeft,
  FiClock,
  FiVolume2,
  FiMail,
  FiHash,
  FiArrowRight,
  FiList,
  FiToggleRight,
  FiShare2,
  FiCornerUpRight,
  FiInfo,
  FiSave,
  FiRefreshCw,
  FiFilter,
  FiFileText,
  FiDownload
} from 'react-icons/fi';

// Types
interface Destination {
  line: string;
  delay: number;
  timeout: number;
}

interface RingGroup {
  id: number;
  name: string;
  extension: string;
  distribution: string;
  transfer: boolean;
  active: boolean;
  description: string;
  destinations: Destination[];
  ringSound: string;
  missedCallNotification: string;
  prefix: string;
  noAnswerRedirect: string;
  transferNumber: string;
}

// Form data type (omitting id which is generated)
type RingGroupFormData = Omit<RingGroup, 'id'>;

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

// Sample data
const SAMPLE_DATA: RingGroup[] = [
  {
    id: 1,
    name: "Accueil",
    extension: "100",
    distribution: "Simultané",
    transfer: true,
    active: true,
    description: "Groupe pour le service d'accueil",
    destinations: [
      { line: "+33 1 23 45 67 89", delay: 0, timeout: 30 },
      { line: "+33 1 98 76 54 32", delay: 5, timeout: 25 }
    ],
    ringSound: "default",
    missedCallNotification: "Email",
    prefix: "Accueil-",
    noAnswerRedirect: "Messagerie vocale",
    transferNumber: "+33 7 00 11 22 33"
  },
  {
    id: 2,
    name: "Support",
    extension: "200",
    distribution: "Ordre défini",
    transfer: false,
    active: true,
    description: "Groupe pour le service support technique",
    destinations: [
      { line: "+33 6 12 34 56 78", delay: 0, timeout: 20 },
      { line: "+33 6 98 76 54 32", delay: 20, timeout: 20 }
    ],
    ringSound: "au-ring",
    missedCallNotification: "Rien",
    prefix: "Support-",
    noAnswerRedirect: "IVR principal",
    transferNumber: ""
  },
  {
    id: 3,
    name: "Commercial",
    extension: "300",
    distribution: "Aléatoire",
    transfer: true,
    active: false,
    description: "Groupe pour le service commercial",
    destinations: [
      { line: "+33 1 11 22 33 44", delay: 0, timeout: 15 }
    ],
    ringSound: "be-ring",
    missedCallNotification: "Email",
    prefix: "Com-",
    noAnswerRedirect: "Réception",
    transferNumber: "+33 6 11 22 33 44"
  }
];

// Sample lines for destinations
const SAMPLE_LINES: string[] = [
  "+33 1 23 45 67 89",
  "+33 1 98 76 54 32",
  "+33 6 12 34 56 78",
  "+33 6 98 76 54 32",
  "+33 1 11 22 33 44",
  "+33 7 00 11 22 33"
];

// Sample ring sounds
const RING_SOUNDS: string[] = [
  "default",
  "au-ring",
  "be-ring",
  "bong-ring",
  "caring",
  "classic-pbx",
  "fr-ring",
  "it-ring",
  "uk-ring",
  "us-ring"
];

// Sample redirect options
const REDIRECT_OPTIONS: string[] = [
  "Messagerie vocale",
  "IVR principal",
  "Réception",
  "Attente",
  "Raccrocher"
];

// Distribution options
const DISTRIBUTION_OPTIONS: string[] = [
  "Simultané",
  "Ordre défini",
  "Aléatoire",
  "Mémoire",
  "Least Recent"
];

/**
 * Main Ring Groups Component
 */
export default function RingGroupsPage() {
  const [ringGroups, setRingGroups] = useState<RingGroup[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentItem, setCurrentItem] = useState<RingGroup | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Default form state
  const defaultRingGroup: RingGroupFormData = {
    name: '',
    extension: '',
    distribution: 'Simultané',
    transfer: false,
    active: true,
    description: '',
    destinations: [{ line: SAMPLE_LINES[0], delay: 0, timeout: 30 }],
    ringSound: 'default',
    missedCallNotification: 'Rien',
    prefix: '',
    noAnswerRedirect: 'Messagerie vocale',
    transferNumber: ''
  };
  
  const [formData, setFormData] = useState<RingGroupFormData>(defaultRingGroup);
  
  // Filter the data based on search query
  const filteredData = ringGroups.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle edit item
  const handleEdit = (item: RingGroup) => {
    setCurrentItem(item);
    setFormData({...item});
    setCurrentView('edit');
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };
  
  // Handle add new item
  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({...defaultRingGroup});
    setCurrentView('add');
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };
  
  // Handle delete item
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe de sonnerie?')) {
      setRingGroups(prev => prev.filter(item => item.id !== id));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'transferNumber' && !formData.transfer) {
      return; // Don't update transferNumber if transfer is disabled
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };
  
  // Handle toggle changes
  const handleToggle = (field: keyof RingGroupFormData) => {
    if (typeof formData[field] === 'boolean') {
      setFormData({
        ...formData,
        [field]: !formData[field]
      });
    }
  };
  
  // Handle destinations changes
  const handleDestinationChange = (index: number, field: keyof Destination, value: string | number) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      destinations: updatedDestinations
    });
  };
  
  // Add a new destination
  const addDestination = () => {
    setFormData({
      ...formData,
      destinations: [
        ...formData.destinations,
        { line: SAMPLE_LINES[0], delay: 0, timeout: 30 }
      ]
    });
  };
  
  // Remove a destination
  const removeDestination = (index: number) => {
    if (formData.destinations.length <= 1) {
      return; // Keep at least one destination
    }
    
    const updatedDestinations = [...formData.destinations];
    updatedDestinations.splice(index, 1);
    
    setFormData({
      ...formData,
      destinations: updatedDestinations
    });
  };
  
  // Reset form to defaults
  const handleResetForm = () => {
    if (currentView === 'edit' && currentItem) {
      setFormData({...currentItem});
    } else {
      setFormData({...defaultRingGroup});
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (currentView === 'edit' && currentItem) {
      setRingGroups(
        ringGroups.map(item => 
          item.id === currentItem.id ? { ...formData, id: currentItem.id } : item
        )
      );
    } else {
      const newId = Math.max(0, ...ringGroups.map(item => item.id)) + 1;
      setRingGroups([...ringGroups, { ...formData, id: newId }]);
    }
    
    setCurrentView('list');
    setCurrentItem(null);
    setCurrentStep(1);
  };
  
  // Go to next step
  const goToNextStep = () => {
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };
  
  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Extension', 'Distribution', 'Transfer', 'Active', 'Description'];
    const data = ringGroups.map(item => [
      item.name, 
      item.extension, 
      item.distribution, 
      item.transfer ? 'Oui' : 'Non',
      item.active ? 'Oui' : 'Non',
      item.description
    ]);
    
    const csv = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'groupes-de-sonnerie.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Export to PDF
  const exportToPDF = () => {
    alert('Le PDF groupes-de-sonnerie.pdf a été généré et téléchargé.');
  };
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const pageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const stepVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }
  };
  
  // List View Component
  const ListView = () => (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Groupes de Sonnerie']} />
        
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#9C27B0]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Groupes de Sonnerie</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Créez des groupes pour faire sonner plusieurs téléphones simultanément ou dans un ordre défini
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              {/* Export Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en CSV"
                >
                  <FiDownload className="mr-2" />
                  CSV
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToPDF}
                  className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-xl hover:bg-[#004AC8]/20 transition"
                  title="Exporter en PDF"
                >
                  <FiFileText className="mr-2" />
                  PDF
                </motion.button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
              >
                <FiPlus className="mr-2" />
                Ajouter un groupe de sonnerie
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Filter section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, extension ou description..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FiRefreshCw className="w-4 h-4" />
                  Réinitialiser
                </span>
              </button>
              <button
                className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  Appliquer le filtre
                </span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Stats section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiUsers className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium text-purple-900">Total</h3>
              </div>
              <p className="text-2xl font-bold text-purple-800">{ringGroups.length}</p>
              <p className="text-sm text-purple-700 mt-1">groupes de sonnerie</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Actifs</h3>
              </div>
              <p className="text-2xl font-bold text-green-800">
                {ringGroups.filter(item => item.active).length}
              </p>
              <p className="text-sm text-green-700 mt-1">groupes actifs</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPhone className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Destinations</h3>
              </div>
              <p className="text-2xl font-bold text-blue-800">
                {ringGroups.reduce((sum, group) => sum + group.destinations.length, 0)}
              </p>
              <p className="text-sm text-blue-700 mt-1">numéros associés</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiList className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Distribution</h3>
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {ringGroups.filter(item => item.distribution === 'Simultané').length} Simultané
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {ringGroups.filter(item => item.distribution === 'Ordre défini').length} Ordre défini
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {ringGroups.filter(item => item.distribution === 'Aléatoire').length} Aléatoire
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Table section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#9C27B0]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 text-[#004AC8]" />
                      Nom
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-[#004AC8]" />
                      Extension
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiList className="w-4 h-4 text-[#004AC8]" />
                      Distribution des appels
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiShare2 className="w-4 h-4 text-[#004AC8]" />
                      Transférer
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiToggleRight className="w-4 h-4 text-[#004AC8]" />
                      Activé
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiInfo className="w-4 h-4 text-[#004AC8]" />
                      Description
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#1B0353]">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200/80">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                            <FiUsers className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      
                      {/* Extension */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 rounded-full text-sm text-blue-700">
                          <FiHash className="w-3.5 h-3.5 mr-1.5" />
                          {item.extension}
                        </div>
                      </td>
                      
                      {/* Distribution */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
                          item.distribution === 'Simultané' ? 'bg-purple-100 text-purple-700' :
                          item.distribution === 'Ordre défini' ? 'bg-blue-100 text-blue-700' :
                          item.distribution === 'Aléatoire' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <FiList className="w-3.5 h-3.5 mr-1.5" />
                          {item.distribution}
                        </div>
                      </td>
                      
                      {/* Transfer */}
                      <td className="px-6 py-4">
                        {item.transfer ? (
                          <div className="inline-flex items-center px-2.5 py-1 bg-green-100 rounded-full text-sm text-green-700">
                            <FiCheck className="w-3.5 h-3.5 mr-1" />
                            Oui
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            <FiX className="w-3.5 h-3.5 mr-1" />
                            Non
                          </div>
                        )}
                      </td>
                      
                      {/* Active */}
                      <td className="px-6 py-4">
                        {item.active ? (
                          <div className="inline-flex items-center px-2.5 py-1 bg-green-100 rounded-full text-sm text-green-700">
                            <FiCheck className="w-3.5 h-3.5 mr-1" />
                            Oui
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            <FiX className="w-3.5 h-3.5 mr-1" />
                            Non
                          </div>
                        )}
                      </td>
                      
                      {/* Description */}
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {item.description}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(item)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucun groupe de sonnerie trouvé
                        </p>
                        <p className="text-sm text-gray-500">
                          Aucun résultat ne correspond à votre recherche
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
  
  // Form View Component
  const FormView = () => (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={pageVariants}
      className="pt-20 min-h-screen pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => {
                setCurrentView('list');
                setCurrentItem(null);
              }}
              className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Applications', 'Groupes de Sonnerie', currentView === 'edit' ? 'Modifier' : 'Ajouter']} />
          
          <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#9C27B0]/10 rounded-3xl pointer-events-none" />
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                {currentView === 'edit' ? <FiEdit className="text-[#004AC8]" /> : <FiPlus className="text-[#004AC8]" />}
                {currentView === 'edit' ? "Modifier un groupe de sonnerie" : "Ajouter un groupe de sonnerie"}
              </h2>
              
              {/* Step Indicator */}
              <div className="flex items-center mt-6">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${currentStep === 1 ? 'bg-[#004AC8] text-white' : 'bg-gray-200 text-gray-600'} font-medium text-sm`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${currentStep === 2 ? 'bg-[#004AC8]' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${currentStep === 2 ? 'bg-[#004AC8] text-white' : 'bg-gray-200 text-gray-600'} font-medium text-sm`}>
                  2
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-sm">
                <div className={`font-medium ${currentStep === 1 ? 'text-[#004AC8]' : 'text-gray-500'}`}>
                  Groupe de Sonnerie
                </div>
                <div className={`font-medium ${currentStep === 2 ? 'text-[#004AC8]' : 'text-gray-500'}`}>
                  Avancé
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10"
            >
              <form onSubmit={(e) => {e.preventDefault(); goToNextStep();}}>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#1B0353] mb-4">Informations de base</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiUsers className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nom du groupe de sonnerie"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Extension */}
                    <div>
                      <label htmlFor="extension" className="block text-sm font-medium text-gray-700 mb-1">
                        Extension <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiHash className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="extension"
                          name="extension"
                          value={formData.extension}
                          onChange={handleChange}
                          placeholder="Ex: 100"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Destinations Section */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#1B0353]">Destinations</h3>
                      <button 
                        type="button"
                        onClick={addDestination}
                        className="flex items-center text-sm font-medium text-[#004AC8] hover:text-[#003DA8]"
                      >
                        <FiPlus className="mr-1" />
                        Ajouter une destination
                      </button>
                    </div>
                    
                    {formData.destinations.map((dest: Destination, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700">Destination {index + 1}</h4>
                          <button 
                            type="button"
                            onClick={() => removeDestination(index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={formData.destinations.length <= 1}
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Destination Line */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Destination
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <FiPhone className="w-5 h-5 text-gray-400" />
                              </div>
                              <select
                                value={dest.line}
                                onChange={(e) => handleDestinationChange(index, 'line', e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                              >
                                {SAMPLE_LINES.map((line) => (
                                  <option key={line} value={line}>{line}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                                <FiChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Delay */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Délai
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <FiClock className="w-5 h-5 text-gray-400" />
                              </div>
                              <select
                                value={dest.delay}
                                onChange={(e) => handleDestinationChange(index, 'delay', parseInt(e.target.value))}
                                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                              >
                                {Array.from({ length: 31 }, (_, i) => i).map((value) => (
                                  <option key={value} value={value}>{value} sec</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                                <FiChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Timeout */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Timeout
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                                <FiClock className="w-5 h-5 text-gray-400" />
                              </div>
                              <select
                                value={dest.timeout}
                                onChange={(e) => handleDestinationChange(index, 'timeout', parseInt(e.target.value))}
                                className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                              >
                                {Array.from({ length: 31 }, (_, i) => (i + 1) * 5).map((value) => (
                                  <option key={value} value={value}>{value} sec</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                                <FiChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Info box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-6">
                    <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-blue-800">Info :</span>{' '}
                      <span className="text-blue-700">
                        Vous pouvez ajouter plusieurs destinations qui sonneront selon le mode de distribution choisi à l&apos;étape suivante.
                      </span>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Réinitialiser
                    </button>
                    
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                    >
                      Étape suivante
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10"
            >
              <form onSubmit={(e) => {e.preventDefault(); handleSave();}}>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#1B0353] mb-4">Options avancées</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {/* Distribution Type */}
                    <div>
                      <label htmlFor="distribution" className="block text-sm font-medium text-gray-700 mb-1">
                        Distribution des appels
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiList className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="distribution"
                          name="distribution"
                          value={formData.distribution}
                          onChange={handleChange}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                        >
                          {DISTRIBUTION_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Sélectionnez le mode de distribution des appels.</p>
                    </div>
                    
                    {/* Ring Sound */}
                    <div>
                      <label htmlFor="ringSound" className="block text-sm font-medium text-gray-700 mb-1">
                        Son de destination
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiVolume2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="ringSound"
                          name="ringSound"
                          value={formData.ringSound}
                          onChange={handleChange}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                        >
                          {RING_SOUNDS.map((sound) => (
                            <option key={sound} value={sound}>{sound}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Définir une annonce à diffuser pendant l&apos;appel de la destination.</p>
                    </div>
                    
                    {/* Missed Call Notification */}
                    <div>
                      <label htmlFor="missedCallNotification" className="block text-sm font-medium text-gray-700 mb-1">
                        Notification d&apos;appel manqué
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiMail className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="missedCallNotification"
                          name="missedCallNotification"
                          value={formData.missedCallNotification}
                          onChange={handleChange}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                        >
                          <option value="Rien">Rien de sélectionné</option>
                          <option value="Email">Email</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Sélectionnez le type de notification et renseignez l&apos;email.</p>
                    </div>
                    
                    {/* Prefix */}
                    <div>
                      <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 mb-1">
                        Préfixe
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiHash className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="prefix"
                          name="prefix"
                          value={formData.prefix}
                          onChange={handleChange}
                          placeholder="Préfixe"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Définissez un préfixe à afficher devant le numéro de l&apos;appelant.</p>
                    </div>
                    
                    {/* No Answer Redirect */}
                    <div>
                      <label htmlFor="noAnswerRedirect" className="block text-sm font-medium text-gray-700 mb-1">
                        Redirection si pas de réponse
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiCornerUpRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <select
                          id="noAnswerRedirect"
                          name="noAnswerRedirect"
                          value={formData.noAnswerRedirect}
                          onChange={handleChange}
                          className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                        >
                          {REDIRECT_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Sélectionnez la destination de fin du délai d&apos;attente pour ce groupe de sonneries.</p>
                    </div>
                    
                    {/* Transfer Toggle */}
                    <div className="col-span-2">
                      <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-800">Transférer</div>
                          <p className="text-sm text-gray-500 mt-1">Activer le transfert des appels vers un autre numéro</p>
                        </div>
                        <div 
                          className="relative cursor-pointer"
                          onClick={() => handleToggle('transfer')}
                        >
                          <div className={`w-12 h-6 transition-colors rounded-full ${formData.transfer ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div 
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.transfer ? 'transform translate-x-6' : ''}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transfer Number (conditionally shown) */}
                    {formData.transfer && (
                      <div className="col-span-2">
                        <label htmlFor="transferNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de transfert
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <FiPhone className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="transferNumber"
                            name="transferNumber"
                            value={formData.transferNumber}
                            onChange={handleChange}
                            placeholder="Numéro de transfert"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Renvoyer les appels entrants vers une autre destination.</p>
                      </div>
                    )}
                    
                    {/* Description */}
                    <div className="col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 top-3 flex items-start pl-3.5">
                          <FiInfo className="w-5 h-5 text-gray-400" />
                        </div>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Description du groupe de sonnerie"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        ></textarea>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Entrez une description optionnelle pour ce groupe.</p>
                    </div>
                    
                    {/* Active Toggle */}
                    <div className="col-span-2">
                      <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                        <div>
                          <div className="font-medium text-gray-800">Activé</div>
                          <p className="text-sm text-gray-500 mt-1">Activer ou désactiver ce groupe de sonnerie</p>
                        </div>
                        <div 
                          className="relative cursor-pointer"
                          onClick={() => handleToggle('active')}
                        >
                          <div className={`w-12 h-6 transition-colors rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div 
                            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.active ? 'transform translate-x-6' : ''}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Retour
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Réinitialiser
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                    >
                      <FiSave className="w-4 h-4" />
                      {currentView === 'edit' ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  // Render the appropriate view based on current state
  return (
    <AnimatePresence mode="wait">
      {currentView === 'list' ? <ListView key="list" /> : <FormView key="form" />}
    </AnimatePresence>
  );
}
