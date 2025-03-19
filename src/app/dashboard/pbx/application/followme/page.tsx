'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiHome,
  FiChevronRight,
  FiCheck,
  FiX,
  FiPhone,
  FiArrowLeft,
  FiShuffle,
  FiUser,
  FiCornerUpRight,
  FiClock,
  FiInfo,
  FiExternalLink,
  FiHash,
  FiBellOff,
  FiSave,
  FiPlus
} from 'react-icons/fi';

// Types
interface CallForwarding {
  id: number;
  extension: string;
  callTransferTo: string;
  callTransferEnabled: boolean;
  busyEnabled: boolean;
  noAnswerEnabled: boolean;
  unregisteredEnabled: boolean;
  doNotDisturbEnabled: boolean;
  callForwardingEnabled: boolean;
  callForwarding: {
    ignoreBusy: boolean;
    destination: string;
    delay: number;
    timeout: number;
  };
  description: string;
}

// Define types for toggle fields and forwarding fields
type ToggleableField = keyof Pick<CallForwarding, 
  'callTransferEnabled' | 'busyEnabled' | 'noAnswerEnabled' | 
  'unregisteredEnabled' | 'doNotDisturbEnabled' | 'callForwardingEnabled'
>;

type ForwardingField = keyof CallForwarding['callForwarding'];

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
const SAMPLE_DATA: CallForwarding[] = [
  {
    id: 1,
    extension: "101",
    callTransferTo: "+33 1 23 45 67 89",
    callTransferEnabled: true,
    busyEnabled: true,
    noAnswerEnabled: true,
    unregisteredEnabled: false,
    doNotDisturbEnabled: false,
    callForwardingEnabled: false,
    callForwarding: {
      ignoreBusy: false,
      destination: "",
      delay: 15,
      timeout: 30
    },
    description: "Transfert d'appel pour Thomas Martin"
  },
  {
    id: 2,
    extension: "102",
    callTransferTo: "",
    callTransferEnabled: false,
    busyEnabled: false,
    noAnswerEnabled: false,
    unregisteredEnabled: false,
    doNotDisturbEnabled: true,
    callForwardingEnabled: false,
    callForwarding: {
      ignoreBusy: false,
      destination: "",
      delay: 0,
      timeout: 0
    },
    description: "Mode ne pas déranger pour Sophie Dubois"
  },
  {
    id: 3,
    extension: "103",
    callTransferTo: "",
    callTransferEnabled: false,
    busyEnabled: false,
    noAnswerEnabled: false,
    unregisteredEnabled: false,
    doNotDisturbEnabled: false,
    callForwardingEnabled: true,
    callForwarding: {
      ignoreBusy: true,
      destination: "+33 6 12 34 56 78",
      delay: 10,
      timeout: 60
    },
    description: "Redirection d'appel pour Pierre Leroy"
  }
];

/**
 * Main Call Forwarding Component
 */
export default function CallForwarding() {
  const [forwardingList, setForwardingList] = useState<CallForwarding[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [currentItem, setCurrentItem] = useState<CallForwarding | null>(null);
  const [formData, setFormData] = useState<CallForwarding | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Filter the data based on search query
  const filteredData = forwardingList.filter(item => 
    item.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle edit item
  const handleEdit = (item: CallForwarding) => {
    setCurrentItem(item);
    setFormData({...item});
    setCurrentView('edit');
    window.scrollTo(0, 0);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
  };
  
  // Handle form field changes - prevent immediate submission
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };
  
  // Handle toggle changes with exclusivity - prevent immediate submission
  const handleToggle = (e: React.MouseEvent, field: ToggleableField) => {
    // Prevent default to avoid page refresh
    e.preventDefault();
    e.stopPropagation();
    
    if (!formData) return;
    
    // Create a copy of current form data
    const updatedData = {...formData};
    
    // Toggle the specified field
    updatedData[field] = !updatedData[field];
    
    // Apply mutual exclusivity rules only for the three main toggles
    if ((field === 'callTransferEnabled' || field === 'doNotDisturbEnabled' || field === 'callForwardingEnabled') && updatedData[field] === true) {
      // If one is enabled, disable the other two
      if (field === 'callTransferEnabled') {
        updatedData.doNotDisturbEnabled = false;
        updatedData.callForwardingEnabled = false;
      } 
      else if (field === 'doNotDisturbEnabled') {
        updatedData.callTransferEnabled = false;
        updatedData.callForwardingEnabled = false;
      } 
      else if (field === 'callForwardingEnabled') {
        updatedData.callTransferEnabled = false;
        updatedData.doNotDisturbEnabled = false;
      }
    }
    
    setFormData(updatedData);
  };
  
  // Handle nested forwarding field changes - prevent immediate submission
  const handleForwardingChange = (e: React.MouseEvent | null, field: ForwardingField, value: boolean | string | number) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!formData) return;
    
    setFormData({
      ...formData,
      callForwarding: {
        ...formData.callForwarding,
        [field]: value
      }
    });
  };
  
  // Reset form to initial state
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (currentItem) {
      setFormData({...currentItem});
      setErrors({});
    }
  };
  
  // Validate form
  const validateForm = () => {
    if (!formData) return false;
    
    const newErrors: {[key: string]: string} = {};
    
    // If call transfer is enabled, make sure there's a destination
    if (formData.callTransferEnabled && !formData.callTransferTo) {
      newErrors.callTransferTo = "Veuillez entrer un numéro de transfert";
    }
    
    // If call forwarding is enabled, make sure there's a destination
    if (formData.callForwardingEnabled && !formData.callForwarding.destination) {
      newErrors.destination = "Veuillez entrer une destination";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save/update
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData || !currentItem) return;
    
    if (validateForm()) {
      setForwardingList(
        forwardingList.map(item => 
          item.id === currentItem.id ? formData : item
        )
      );
      
      setCurrentView('list');
      setCurrentItem(null);
      setFormData(null);
    }
  };

  // Handle creating new item
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    if (validateForm()) {
      const newId = Math.max(0, ...forwardingList.map(item => item.id)) + 1;
      
      setForwardingList([
        ...forwardingList,
        { ...formData, id: newId }
      ]);
      
      setCurrentView('list');
      setCurrentItem(null);
      setFormData(null);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
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
        <Breadcrumbs items={['PBX', 'Applications', 'Redirection d\'appel']} />
        
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#00C853]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <FiShuffle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Redirection d&apos;appel</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez les transferts et redirections d&apos;appels entrants vers différentes destinations
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newItem: CallForwarding = {
                  id: forwardingList.length + 1,
                  extension: "",
                  callTransferTo: "",
                  callTransferEnabled: false,
                  busyEnabled: false,
                  noAnswerEnabled: false,
                  unregisteredEnabled: false,
                  doNotDisturbEnabled: false,
                  callForwardingEnabled: false,
                  callForwarding: {
                    ignoreBusy: false,
                    destination: "",
                    delay: 15,
                    timeout: 30
                  },
                  description: ""
                };
                setCurrentItem(newItem);
                setFormData(newItem);
                setCurrentView('edit');
              }}
              className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <FiPlus className="mr-2" />
              Ajouter une redirection
            </motion.button>
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
                placeholder="Rechercher par extension ou description..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#004AC8] focus:ring-2 focus:ring-[#004AC8]/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                className="px-5 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                Appliquer le filtre
              </button>
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
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#00C853]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-[#004AC8]" />
                      Extension
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiExternalLink className="w-4 h-4 text-[#004AC8]" />
                      Transfert d&apos;appel vers
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiCornerUpRight className="w-4 h-4 text-[#004AC8]" />
                      Redirection d&apos;appel
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiBellOff className="w-4 h-4 text-[#004AC8]" />
                      Ne pas déranger
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
                      {/* Extension */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <FiHash className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{item.extension}</span>
                        </div>
                      </td>
                      
                      {/* Call Transfer To */}
                      <td className="px-6 py-4">
                        {item.callTransferEnabled ? (
                          <div className="inline-flex items-center px-2.5 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                            <FiCheck className="w-3.5 h-3.5 mr-1" />
                            {item.callTransferTo}
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            <FiX className="w-3.5 h-3.5 mr-1" />
                            Désactivé
                          </div>
                        )}
                      </td>
                      
                      {/* Call Forwarding */}
                      <td className="px-6 py-4">
                        {item.callForwardingEnabled ? (
                          <div className="inline-flex items-center px-2.5 py-1 bg-green-100 rounded-full text-sm text-green-700">
                            <FiCheck className="w-3.5 h-3.5 mr-1" />
                            Activé
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            <FiX className="w-3.5 h-3.5 mr-1" />
                            Désactivé
                          </div>
                        )}
                      </td>
                      
                      {/* Do Not Disturb */}
                      <td className="px-6 py-4">
                        {item.doNotDisturbEnabled ? (
                          <div className="inline-flex items-center px-2.5 py-1 bg-red-100 rounded-full text-sm text-red-700">
                            <FiCheck className="w-3.5 h-3.5 mr-1" />
                            Activé
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            <FiX className="w-3.5 h-3.5 mr-1" />
                            Désactivé
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
                            onClick={() => {
                              if (confirm('Êtes-vous sûr de vouloir supprimer cette redirection?')) {
                                setForwardingList(forwardingList.filter(fw => fw.id !== item.id));
                              }
                            }}
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
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucune redirection trouvée
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
  const FormView = () => {
    if (!formData) return null;
    
    const isNewItem = !currentItem?.id;
    
    return (
      <motion.div
        initial="hidden"
        animate="show"
        exit="exit"
        variants={pageVariants}
        className="pt-20 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => {
                  setCurrentView('list');
                  setCurrentItem(null);
                  setFormData(null);
                }} 
                className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Retour
              </button>
            </div>
            <Breadcrumbs items={['PBX', 'Applications', 'Redirection d\'appel', isNewItem ? 'Ajouter' : 'Modifier']} />
            
            <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#00C853]/10 rounded-3xl pointer-events-none" />
              <div className="relative p-8">
                <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                  {isNewItem ? <FiPlus className="text-[#004AC8]" /> : <FiEdit className="text-[#004AC8]" />}
                  {isNewItem 
                    ? "Ajouter une nouvelle redirection" 
                    : `Modifier la redirection pour l'extension ${formData.extension}`}
                </h2>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
            <form 
              onSubmit={isNewItem ? handleCreate : handleSave} 
              className="space-y-8"
            >
              {/* Basic Details */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-[#1B0353] flex items-center mb-6">
                  <FiUser className="mr-2 text-[#004AC8]" />
                  Informations de base
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extension <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <FiHash className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="extension"
                        value={formData.extension}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        placeholder="Ex: 101"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <FiInfo className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        placeholder="Description de la redirection"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transfert d'appel vers */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1B0353] flex items-center">
                      <FiExternalLink className="mr-2 text-[#004AC8]" />
                      Transfert d&apos;appel vers
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Transférer les appels entrants vers un autre numéro
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3 text-gray-700">
                      {formData.callTransferEnabled ? 'Activé' : 'Désactivé'}
                    </span>
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => handleToggle(e, 'callTransferEnabled')}
                    >
                      <div className={`w-12 h-6 transition-colors rounded-full ${formData.callTransferEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div 
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.callTransferEnabled ? 'transform translate-x-6' : ''}`}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {formData.callTransferEnabled && (
                  <div className="mb-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                        <FiPhone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="callTransferTo"
                        name="callTransferTo"
                        value={formData.callTransferTo}
                        onChange={handleChange}
                        placeholder="Numéro de téléphone"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.callTransferTo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#004AC8] focus:border-[#004AC8]'} rounded-xl focus:outline-none focus:ring-2 transition-all`}
                      />
                    </div>
                    {errors.callTransferTo && (
                      <p className="mt-1 text-sm text-red-600">{errors.callTransferTo}</p>
                    )}
                  </div>
                )}
                
                {/* Sub options - always visible */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Si occupé */}
                  <div className="border border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">Si occupé</div>
                        <p className="text-xs text-gray-500 mt-1">Transférer si la ligne est occupée</p>
                      </div>
                      <div 
                        className="relative cursor-pointer"
                        onClick={(e) => handleToggle(e, 'busyEnabled')}
                      >
                        <div className={`w-10 h-5 transition-colors rounded-full ${formData.busyEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div 
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.busyEnabled ? 'transform translate-x-5' : ''}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Non répondu */}
                  <div className="border border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">Non répondu</div>
                        <p className="text-xs text-gray-500 mt-1">Transférer si pas de réponse</p>
                      </div>
                      <div 
                        className="relative cursor-pointer"
                        onClick={(e) => handleToggle(e, 'noAnswerEnabled')}
                      >
                        <div className={`w-10 h-5 transition-colors rounded-full ${formData.noAnswerEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div 
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.noAnswerEnabled ? 'transform translate-x-5' : ''}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Non enregistré */}
                  <div className="border border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">Non enregistré</div>
                        <p className="text-xs text-gray-500 mt-1">Transférer si appareil non enregistré</p>
                      </div>
                      <div 
                        className="relative cursor-pointer"
                        onClick={(e) => handleToggle(e, 'unregisteredEnabled')}
                      >
                        <div className={`w-10 h-5 transition-colors rounded-full ${formData.unregisteredEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div 
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.unregisteredEnabled ? 'transform translate-x-5' : ''}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ne pas déranger */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1B0353] flex items-center">
                      <FiBellOff className="mr-2 text-[#004AC8]" />
                      Ne pas déranger
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Bloquer tous les appels entrants
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3 text-gray-700">
                      {formData.doNotDisturbEnabled ? 'Activé' : 'Désactivé'}
                    </span>
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => handleToggle(e, 'doNotDisturbEnabled')}
                    >
                      <div className={`w-12 h-6 transition-colors rounded-full ${formData.doNotDisturbEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div 
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.doNotDisturbEnabled ? 'transform translate-x-6' : ''}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Redirection d'appel */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1B0353] flex items-center">
                      <FiCornerUpRight className="mr-2 text-[#004AC8]" />
                      Redirection d&apos;appel
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Rediriger automatiquement les appels entrants vers une autre destination
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3 text-gray-700">
                      {formData.callForwardingEnabled ? 'Activé' : 'Désactivé'}
                    </span>
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => handleToggle(e, 'callForwardingEnabled')}
                    >
                      <div className={`w-12 h-6 transition-colors rounded-full ${formData.callForwardingEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div 
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.callForwardingEnabled ? 'transform translate-x-6' : ''}`}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {formData.callForwardingEnabled && (
                  <div className="space-y-6">
                    {/* Ignorer occupé */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-800">Ignorer occupé</div>
                          <p className="text-xs text-gray-500 mt-1">Rediriger même si la ligne est occupée</p>
                        </div>
                        <div 
                          className="relative cursor-pointer"
                          onClick={(e) => handleForwardingChange(e, 'ignoreBusy', !formData.callForwarding.ignoreBusy)}
                        >
                          <div className={`w-10 h-5 transition-colors rounded-full ${formData.callForwarding.ignoreBusy ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div 
                            className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.callForwarding.ignoreBusy ? 'transform translate-x-5' : ''}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Destination
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <FiPhone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.callForwarding.destination}
                          onChange={(e) => handleForwardingChange(null, 'destination', e.target.value)}
                          placeholder="Numéro de téléphone"
                          className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.destination ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#004AC8] focus:border-[#004AC8]'} rounded-xl focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      {errors.destination && (
                        <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Délai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Délai
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <FiClock className="w-5 h-5 text-gray-400" />
                          </div>
                          <select
                            value={formData.callForwarding.delay}
                            onChange={(e) => handleForwardingChange(null, 'delay', parseInt(e.target.value))}
                            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                          >
                            {Array.from({ length: 101 }, (_, i) => i).map((value) => (
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
                            value={formData.callForwarding.timeout}
                            onChange={(e) => handleForwardingChange(null, 'timeout', parseInt(e.target.value))}
                            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                          >
                            {Array.from({ length: 101 }, (_, i) => i).map((value) => (
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
                )}
              </div>
              
              {/* Info notice */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-800">Info :</span>{' '}
                  <span className="text-blue-700">
                    Un seul mode peut être activé à la fois. L&apos;activation d&apos;un mode désactivera automatiquement les autres.
                  </span>
                </div>
              </div>
              
              {/* Form Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {isNewItem ? 'Créer' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render the appropriate view based on the current state
  return (
    <AnimatePresence mode="wait">
      {currentView === 'list' ? <ListView key="list" /> : <FormView key="form" />}
    </AnimatePresence>
  );
}