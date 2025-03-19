'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiHome,
  FiChevronRight,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  // FiFilter,
  // FiRefreshCw,
  FiCheck,
  FiX,
  FiArrowLeft,
  // FiCalendar,
  FiHash,
  FiGlobe,
  FiList,
  FiToggleRight,
  FiSave,
  // FiAlertCircle,
  FiInfo,
  FiClipboard,
  FiChevronDown
} from 'react-icons/fi';

// Types
interface TimeCondition {
  id: number;
  name: string;
  number: string;
  domain: string;
  order: number;
  enabled: boolean;
  description: string;
  outOfHoursAction: string;
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  id: number;
  action: string;
  daysAvailable: string[];
  startTime: string;
  endTime: string;
}

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

// Sample time conditions data
const SAMPLE_TIME_CONDITIONS: TimeCondition[] = [
  {
    id: 1,
    name: "Heures d'ouverture",
    number: "TC-001",
    domain: "Global",
    order: 1,
    enabled: true,
    description: "Heures d'ouverture standard de l'entreprise",
    outOfHoursAction: "voicemail",
    timeSlots: [
      {
        id: 1,
        action: "ring-group-sales",
        daysAvailable: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        startTime: "08:00",
        endTime: "18:00"
      }
    ]
  },
  {
    id: 2,
    name: "Heures du week-end",
    number: "TC-002",
    domain: "Commercial",
    order: 2,
    enabled: false,
    description: "Heures d'ouverture du week-end",
    outOfHoursAction: "ivr-menu",
    timeSlots: [
      {
        id: 1,
        action: "ring-group-support",
        daysAvailable: ["Samedi"],
        startTime: "10:00",
        endTime: "16:00"
      }
    ]
  },
  {
    id: 3,
    name: "Pause déjeuner",
    number: "TC-003",
    domain: "Global",
    order: 3,
    enabled: true,
    description: "Redirection pendant la pause déjeuner",
    outOfHoursAction: "announcement",
    timeSlots: [
      {
        id: 1,
        action: "announcement-lunch",
        daysAvailable: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        startTime: "12:00",
        endTime: "14:00"
      }
    ]
  },
  {
    id: 4,
    name: "Horaires d'été",
    number: "TC-004",
    domain: "Support",
    order: 4,
    enabled: true,
    description: "Horaires spéciaux pour la période estivale",
    outOfHoursAction: "voicemail",
    timeSlots: [
      {
        id: 1,
        action: "ring-group-support",
        daysAvailable: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
        startTime: "09:00",
        endTime: "17:00"
      }
    ]
  },
];

// Sample options for dropdowns
const ACTION_OPTIONS = [
  { value: "voicemail", label: "Messagerie vocale" },
  { value: "announcement", label: "Annonce vocale" },
  { value: "ivr-menu", label: "Menu IVR" },
  { value: "ring-group-sales", label: "Groupe Sonnerie - Commercial" },
  { value: "ring-group-support", label: "Groupe Sonnerie - Support" },
  { value: "announcement-lunch", label: "Annonce - Pause déjeuner" },
  { value: "hangup", label: "Raccrocher" }
];

const DAYS_OF_WEEK = [
  "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"
];

/**
 * Time Conditions Component
 */
export default function TimeConditions() {
  const [timeConditions, setTimeConditions] = useState<TimeCondition[]>(SAMPLE_TIME_CONDITIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentItem, setCurrentItem] = useState<TimeCondition | null>(null);
  
  // Default form state
  const defaultTimeCondition: Omit<TimeCondition, 'id'> = {
    name: '',
    number: `TC-${String(timeConditions.length + 1).padStart(3, '0')}`,
    domain: 'Global',
    order: timeConditions.length + 1,
    enabled: true,
    description: '',
    outOfHoursAction: '',
    timeSlots: [
      {
        id: 1,
        action: '',
        daysAvailable: [],
        startTime: '09:00',
        endTime: '17:00'
      }
    ]
  };
  
  const [formData, setFormData] = useState<Omit<TimeCondition, 'id'>>(defaultTimeCondition);
  
  // Filter the data based on search term
  const filteredTimeConditions = timeConditions.filter(condition => 
    condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    condition.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Reset search filter
  const resetFilters = () => {
    setSearchTerm('');
  };
  
  // Handle edit time condition
  const handleEdit = (item: TimeCondition) => {
    setCurrentItem(item);
    setFormData({...item});
    setCurrentView('edit');
    window.scrollTo(0, 0);
  };
  
  // Handle delete time condition
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette condition de temps?')) {
      setTimeConditions(timeConditions.filter(condition => condition.id !== id));
    }
  };
  
  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle time slot changes
const handleTimeSlotChange = (index: number, field: string, value: string) => {
  const updatedTimeSlots = [...formData.timeSlots];
  updatedTimeSlots[index] = {
    ...updatedTimeSlots[index],
    [field]: value,
  };

  setFormData({
    ...formData,
    timeSlots: updatedTimeSlots,
  });
};

// Handle day selection toggle
const handleDayToggle = (slotIndex: number, day: string) => {
  const updatedTimeSlots = [...formData.timeSlots];
  const currentSlot = updatedTimeSlots[slotIndex];

  if (currentSlot.daysAvailable.includes(day)) {
    // Remove day if already selected
    currentSlot.daysAvailable = currentSlot.daysAvailable.filter((d: string) => d !== day);
  } else {
    // Add day if not selected
    currentSlot.daysAvailable = [...currentSlot.daysAvailable, day];
  }

  setFormData({
    ...formData,
    timeSlots: updatedTimeSlots,
  });
};

  
  // Add a new time slot
  const addTimeSlot = () => {
    const newId = Math.max(0, ...formData.timeSlots.map((slot) => slot.id)) + 1;
    const newTimeSlot: TimeSlot = {
      id: newId,
      action: '',
      daysAvailable: [],
      startTime: '09:00',
      endTime: '17:00'
    };
    
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, newTimeSlot]
    });
  };
  
  // Remove a time slot
  const removeTimeSlot = (slotId: number) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((slot) => slot.id !== slotId)
    });
  };
  
  // Reset form to defaults or current item
  const resetForm = () => {
    setFormData(currentItem || defaultTimeCondition);
  };
  
  // Handle save
  const handleSave = () => {
    if (currentView === 'edit' && currentItem) {
      // Update existing time condition
      setTimeConditions(
        timeConditions.map(condition => 
          condition.id === currentItem.id ? { ...formData, id: currentItem.id } : condition
        )
      );
    } else {
      // Add new time condition
      const newId = Math.max(0, ...timeConditions.map(condition => condition.id)) + 1;
      setTimeConditions([
        ...timeConditions,
        { ...formData, id: newId }
      ]);
    }
    
    // Return to list view
    setCurrentView('list');
    setCurrentItem(null);
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
  
  // Format days list for display
  // const formatDaysList = (days: string[]) => {
  //   if (days.length === DAYS_OF_WEEK.length) return "Tous les jours";
  //   if (days.length === 0) return "-";
  //   if (days.length <= 3) return days.join(", ");
  //   return `${days.length} jours`;
  // };
  
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
        <Breadcrumbs items={['PBX', 'Applications', 'Time Conditions']} />
        
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#FFA000]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <FiClock className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Time Conditions</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ajouter, modifier, supprimer des conditions horaires pour les appels entrants
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentView('add');
                setFormData(defaultTimeCondition);
              }}
              className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <FiPlus className="mr-2" />
              Ajouter une nouvelle condition de temps
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, numéro, description ou domaine..."
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
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#FFA000]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiClipboard className="w-4 h-4 text-[#004AC8]" />
                      Nom
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiHash className="w-4 h-4 text-[#004AC8]" />
                      Numéro
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiGlobe className="w-4 h-4 text-[#004AC8]" />
                      Domaine
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiList className="w-4 h-4 text-[#004AC8]" />
                      Ordre
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
                {filteredTimeConditions.length > 0 ? (
                  filteredTimeConditions.map((condition) => (
                    <motion.tr
                      key={condition.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="group transition-colors"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                            <FiClock className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{condition.name}</span>
                        </div>
                      </td>
                      
                      {/* Number */}
                      <td className="px-6 py-4 text-sm text-gray-700">{condition.number}</td>
                      
                      {/* Domain */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {condition.domain}
                        </span>
                      </td>
                      
                      {/* Order */}
                      <td className="px-6 py-4 text-sm text-gray-700">{condition.order}</td>
                      
                      {/* Enabled */}
                      <td className="px-6 py-4">
                        {condition.enabled ? (
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
                      <td className="px-6 py-4 text-sm text-gray-700">{condition.description}</td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(condition)}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(condition.id)}
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
                          Aucune condition de temps trouvée
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
      <div className="max-w-4xl mx-auto px-4 md:px-0">
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
          <Breadcrumbs items={['PBX', 'Applications', 'Time Conditions', currentView === 'edit' ? 'Modifier' : 'Ajouter']} />
          
          <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#FFA000]/10 rounded-3xl pointer-events-none" />
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                {currentView === 'edit' ? <FiEdit className="text-[#004AC8]" /> : <FiPlus className="text-[#004AC8]" />}
                {currentView === 'edit' ? "Modifier une condition de temps" : "Ajouter une nouvelle condition de temps"}
              </h2>
            </div>
          </div>
        </div>
        
        {/* Basic Parameters Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Paramètres de base</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                  placeholder="Nom de la condition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action en dehors des plages horaires
                </label>
                <div className="relative">
                  <select
                    value={formData.outOfHoursAction}
                    onChange={(e) => handleChange('outOfHoursAction', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                  >
                    <option value="">Sélectionner une action</option>
                    {ACTION_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                  rows={3}
                  placeholder="Description détaillée des conditions de temps"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Time Slots Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Créneaux horaires</h3>
          
          {formData.timeSlots.map((slot: TimeSlot, index: number) => (
            <div key={slot.id} className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-800">Créneau {index + 1}</h4>
                {formData.timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(slot.id)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <div className="relative">
                    <select
                      value={slot.action}
                      onChange={(e) => handleTimeSlotChange(index, 'action', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                    >
                      <option value="">Sélectionner une action</option>
                      {ACTION_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Du</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">À</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Disponible le</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(index, day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        slot.daysAvailable.includes(day)
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addTimeSlot}
            className="mt-2 flex items-center text-[#004AC8] hover:text-[#003BB0] font-medium"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Ajouter un emplacement
          </button>
        </div>
        
        {/* Advanced options notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6">
          <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-blue-700">
            <span className="font-medium text-blue-800">Astuce :</span>{' '}
            Vous pouvez définir plusieurs créneaux horaires avec des actions différentes pour chaque période.
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Réinitialiser
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            {currentView === 'edit' ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Render the appropriate view based on the current state
  return (
    <AnimatePresence mode="wait">
      {currentView === 'list' ? <ListView key="list" /> : <FormView key="form" />}
    </AnimatePresence>
  );
}