'use client';

import { useState } from 'react';
// import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiHome,
  FiChevronRight,
  FiCheck,
  FiX,
  // FiPhone,
  FiArrowLeft,
  FiVoicemail,
  // FiFilter,
  // FiUser,
  // FiBriefcase,
  // FiLayers,
  // FiToggleRight,
  // FiToggleLeft,
  // FiShare2,
  // FiCornerUpRight,
  // FiMoreHorizontal,
  // FiClock,
  FiKey,
  // FiInfo,
  FiMail,
  // FiHash,
  // FiBell,
  // FiClipboard,
  FiPlus,
  // FiFileText,
  FiVolume2,
  FiTool,
  // FiSettings,
  FiPaperclip
} from 'react-icons/fi';

// Types
interface Voicemail {
  id: number;
  mailboxId: string;
  password: string;
  announcement: string;
  notificationSentTo: string;
  attachMessage: boolean;
  sendNotificationTo: string;
  tools: string;
  active: boolean;
  description: string;
}

// Type for form data (matches Voicemail but without id for new items)
type VoicemailFormData = Omit<Voicemail, 'id'>;

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
const SAMPLE_DATA: Voicemail[] = [
  {
    id: 1,
    mailboxId: "101",
    password: "4321",
    announcement: "message-accueil-1.wav",
    notificationSentTo: "thomas@example.com",
    attachMessage: true,
    sendNotificationTo: "thomas@example.com",
    tools: "Disponible",
    active: true,
    description: "Messagerie vocale pour Thomas Martin"
  },
  {
    id: 2,
    mailboxId: "102",
    password: "1234",
    announcement: "message-accueil-2.wav",
    notificationSentTo: "sophie@example.com",
    attachMessage: false,
    sendNotificationTo: "",
    tools: "Disponible",
    active: true,
    description: "Messagerie vocale pour Sophie Dubois"
  },
  {
    id: 3,
    mailboxId: "103",
    password: "5678",
    announcement: "message-accueil-default.wav",
    notificationSentTo: "",
    attachMessage: true,
    sendNotificationTo: "pierre@example.com",
    tools: "Disponible",
    active: false,
    description: "Messagerie vocale pour Pierre Leroy"
  }
];

// Sample announcement options
const ANNOUNCEMENT_OPTIONS = [
  "message-accueil-default.wav",
  "message-accueil-1.wav",
  "message-accueil-2.wav",
  "message-accueil-3.wav",
  "message-absence.wav",
  "message-vacances.wav"
];

// Main Component
export default function Voicemail() {
  const [voicemails, setVoicemails] = useState<Voicemail[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentItem, setCurrentItem] = useState<Voicemail | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Filter the data based on search query
  const filteredData = voicemails.filter(item => 
    item.mailboxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.notificationSentTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle edit item
  const handleEdit = (item: Voicemail) => {
    setCurrentItem(item);
    setCurrentView('edit');
    window.scrollTo(0, 0);
  };
  
  // Handle delete item
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette messagerie vocale?')) {
      setVoicemails(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  // Handle select item
  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
  };
  
  // Handle adding new voicemail
  const handleAddNewVoicemail = (newItem: VoicemailFormData) => {
    setVoicemails([...voicemails, { ...newItem, id: voicemails.length + 1 }]);
    setCurrentView('list');
  };
  
  // Handle updating item
  const handleUpdateVoicemail = (updatedItem: Voicemail) => {
    setVoicemails(voicemails.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setCurrentView('list');
  };

  // Conditional rendering based on current view
  if (currentView === 'add') {
    return (
      <VoicemailForm 
        onCancel={() => setCurrentView('list')} 
        onSave={handleAddNewVoicemail} 
        isEdit={false}
      />
    );
  }
  
  if (currentView === 'edit' && currentItem) {
    return (
      <VoicemailForm 
        item={currentItem}
        onCancel={() => {
          setCurrentView('list');
          setCurrentItem(null);
        }}
        onSave={(item) => {
          // We know this has to be a Voicemail with an ID in the edit case
          handleUpdateVoicemail(item as Voicemail);
        }}
        isEdit={true}
      />
    );
  }

  // List view (default)
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Messagerie vocale']} />
        
        {/* Header section */}
        <div className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-700 rounded-xl">
                <FiVoicemail className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Messagerie vocale</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Paramétrage et personnalisation des messageries vocales et écoute des messages vocaux
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('add')}
              className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <FiPlus className="mr-2" />
              Ajouter une messagerie vocale
            </motion.button>
          </div>
        </div>
        
        {/* Filter section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par identifiant, notification ou description..."
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
        </div>
        
        {/* Table section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4BB2F6]/5">
                <tr>
                  <th className="px-4 py-4 rounded-tl-xl w-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiVoicemail className="w-4 h-4 text-[#004AC8]" />
                      Identifiant de la messagerie
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-[#004AC8]" />
                      Notification envoyée à
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiPaperclip className="w-4 h-4 text-[#004AC8]" />
                      Message joint
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-[#004AC8]" />
                      Envoyer mail de notification à
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiTool className="w-4 h-4 text-[#004AC8]" />
                      Outils
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">Activé</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353] rounded-tr-xl">Actions</th>
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
                      {/* Checkbox */}
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                          className="w-4 h-4 text-[#004AC8] border-gray-300 rounded focus:ring-[#004AC8]"
                        />
                      </td>
                      
                      {/* Mailbox ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg">
                            <FiVoicemail className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{item.mailboxId}</span>
                        </div>
                      </td>
                      
                      {/* Notification Sent To */}
                      <td className="px-6 py-4">
                        {item.notificationSentTo ? (
                          <span className="text-sm text-gray-700">{item.notificationSentTo}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Attach Message */}
                      <td className="px-6 py-4">
                        {item.attachMessage ? (
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
                      
                      {/* Send Notification To */}
                      <td className="px-6 py-4">
                        {item.sendNotificationTo ? (
                          <span className="text-sm text-gray-700">{item.sendNotificationTo}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      
                      {/* Tools */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 bg-blue-100 rounded-full text-sm text-blue-700">
                          {item.tools}
                        </div>
                      </td>
                      
                      {/* Active */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 mr-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm ${item.active ? 'text-green-700' : 'text-red-700'}`}>
                            {item.active ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
                    <td colSpan={8} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucune messagerie vocale trouvée
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
        </div>
      </div>
    </div>
  );
}

// Interface for form props
interface VoicemailFormProps {
  item?: Voicemail;
  onCancel: () => void;
  onSave: (item: Voicemail | VoicemailFormData) => void;
  isEdit: boolean;
}

// Voicemail Form Component
function VoicemailForm({ item, onCancel, onSave, isEdit }: VoicemailFormProps) {
  // Default empty form or use the provided item for editing
  const defaultForm: VoicemailFormData = {
    mailboxId: '',
    password: '',
    announcement: 'message-accueil-default.wav',
    notificationSentTo: '',
    attachMessage: false,
    sendNotificationTo: '',
    tools: 'Disponible',
    active: true,
    description: ''
  };
  
  const [formData, setFormData] = useState<VoicemailFormData>(item || defaultForm);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };
  
  // Handle toggle changes
  const handleToggle = (field: keyof VoicemailFormData) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };
  
  // Reset form to initial state
  const handleReset = () => {
    setFormData(item || defaultForm);
    setErrors({});
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.mailboxId) {
      newErrors.mailboxId = "L'identifiant de la messagerie est requis";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEdit && item) {
        onSave({ ...formData, id: item.id });
      } else {
        onSave(formData);
      }
    }
  };
  
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={onCancel} 
              className="flex items-center text-[#004AC8] hover:text-[#1B0353] transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Retour
            </button>
          </div>
          <Breadcrumbs items={['PBX', 'Applications', 'Messagerie vocale', isEdit ? 'Modifier' : 'Ajouter']} />
          
          <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                {isEdit ? <FiEdit className="text-[#004AC8]" /> : <FiPlus className="text-[#004AC8]" />}
                {isEdit ? "Modifier une messagerie vocale" : "Ajouter une messagerie vocale"}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mailbox ID */}
              <div>
                <label htmlFor="mailboxId" className="block text-sm font-medium text-gray-700 mb-1">
                  Identifiant de la messagerie <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiVoicemail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="mailboxId"
                    name="mailboxId"
                    value={formData.mailboxId}
                    onChange={handleChange}
                    placeholder="Ex: 101"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.mailboxId ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#004AC8] focus:border-[#004AC8]'} rounded-xl focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.mailboxId && (
                  <p className="mt-1 text-sm text-red-600">{errors.mailboxId}</p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiKey className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#004AC8] focus:border-[#004AC8]'} rounded-xl focus:outline-none focus:ring-2 transition-all`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Announcement */}
              <div>
                <label htmlFor="announcement" className="block text-sm font-medium text-gray-700 mb-1">
                  Annonce vocale
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiVolume2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="announcement"
                    name="announcement"
                    value={formData.announcement}
                    onChange={handleChange}
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                  >
                    {ANNOUNCEMENT_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Notification Sent To */}
              <div>
                <label htmlFor="notificationSentTo" className="block text-sm font-medium text-gray-700 mb-1">
                  Notification envoyée à
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="notificationSentTo"
                    name="notificationSentTo"
                    value={formData.notificationSentTo}
                    onChange={handleChange}
                    placeholder="exemple@domaine.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description de la messagerie vocale"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                ></textarea>
              </div>
              
              {/* Active Toggle */}
              <div className="col-span-2">
                <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800">Activé</div>
                    <p className="text-sm text-gray-500 mt-1">Activer ou désactiver cette messagerie vocale</p>
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
            
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors"
              >
                {isEdit ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
