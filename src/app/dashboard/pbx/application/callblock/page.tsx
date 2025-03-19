'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiShield,
  FiFilter,
  FiUser,
  FiBriefcase,
  FiLayers,
  FiToggleRight,
  // FiToggleLeft,
  FiDownload,
  FiFileText,
  FiSave,
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';

// Types
interface BlockedNumber {
  id: number;
  number: string;
  name: string;
  account: string;
  action: string;
  active: boolean;
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

// Sample data
const SAMPLE_DATA: BlockedNumber[] = [
  { id: 1, number: '+33 6 12 34 56 78', name: 'Démarcheur 1', account: 'Support', action: 'Rejeter', active: true },
  { id: 2, number: '+33 6 98 76 54 32', name: 'Spam connu', account: 'Service Commercial', action: 'Occupe', active: true },
  { id: 3, number: '+33 1 23 45 67 89', name: 'Numéro bloqué', account: 'Direction', action: 'Attente', active: false },
  { id: 4, number: '+33 7 00 11 22 33', name: 'Concurrent', account: 'Tous', action: 'Messagerie vocal', active: true },
  { id: 5, number: '+44 20 1234 5678', name: 'International suspect', account: 'Accueil', action: 'Rejeter', active: true },
];

/**
 * Main Call Block Component (Liste Noire)
 */
export default function CallBlock() {
  const [blockedNumbers, setBlockedNumbers] = useState<BlockedNumber[]>(SAMPLE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentItem, setCurrentItem] = useState<BlockedNumber | null>(null);
  
  // Default form state
  const defaultBlockedNumber: Omit<BlockedNumber, 'id'> = {
    number: '',
    name: '',
    account: 'Tous',
    action: 'Rejeter',
    active: true
  };
  
  const [formData, setFormData] = useState<Omit<BlockedNumber, 'id'>>(defaultBlockedNumber);
  
  // Filter the data based on search query
  const filteredData = blockedNumbers.filter(item => 
    item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.account.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle edit item
  const handleEdit = (item: BlockedNumber) => {
    setCurrentItem(item);
    setFormData({...item});
    setCurrentView('edit');
    window.scrollTo(0, 0);
  };
  
  // Handle add new item
  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({...defaultBlockedNumber});
    setCurrentView('add');
    window.scrollTo(0, 0);
  };
  
  // Handle delete item
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce numéro?')) {
      setBlockedNumbers(prev => prev.filter(item => item.id !== id));
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle toggle change
  const handleToggle = (field: keyof Omit<BlockedNumber, "id">) => {
    // We need to ensure we're only toggling boolean fields
    if (typeof formData[field] === 'boolean') {
      setFormData({
        ...formData,
        [field]: !formData[field]
      });
    }
  };
  
  // Reset form to defaults
  const handleResetForm = () => {
    if (currentView === 'edit' && currentItem) {
      setFormData({...currentItem});
    } else {
      setFormData({...defaultBlockedNumber});
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (currentView === 'edit' && currentItem) {
      setBlockedNumbers(
        blockedNumbers.map(item => 
          item.id === currentItem.id ? { ...formData, id: currentItem.id } : item
        )
      );
    } else {
      const newId = Math.max(0, ...blockedNumbers.map(item => item.id)) + 1;
      setBlockedNumbers([...blockedNumbers, { ...formData, id: newId }]);
    }
    
    setCurrentView('list');
    setCurrentItem(null);
  };
  
  // Export functions
  const exportToCSV = () => {
    // Simple implementation - would be more robust in production
    const headers = ['Numéro', 'Nom', 'Compte', 'Action', 'Activé'];
    const data = blockedNumbers.map(item => [
      item.number, 
      item.name, 
      item.account, 
      item.action, 
      item.active ? 'Oui' : 'Non'
    ]);
    
    const csv = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'liste-noire.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToPDF = () => {
    alert('Le PDF liste-noire.pdf a été généré et téléchargé.');
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
        <Breadcrumbs items={['PBX', 'Applications', 'Liste noire']} />
        
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4682B4]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <FiShield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Liste noire</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Bloquez ou redirigez les appels entrants provenant des numéros indésirables
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
                Ajouter un numéro à bloquer
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
                placeholder="Rechercher par numéro, nom ou compte..."
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
        
        {/* Stats box */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiShield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Total</h3>
              </div>
              <p className="text-2xl font-bold text-blue-800">{blockedNumbers.length}</p>
              <p className="text-sm text-blue-700 mt-1">numéros bloqués</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheck className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Actifs</h3>
              </div>
              <p className="text-2xl font-bold text-green-800">
                {blockedNumbers.filter(item => item.active).length}
              </p>
              <p className="text-sm text-green-700 mt-1">numéros actifs</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiX className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-medium text-red-900">Inactifs</h3>
              </div>
              <p className="text-2xl font-bold text-red-800">
                {blockedNumbers.filter(item => !item.active).length}
              </p>
              <p className="text-sm text-red-700 mt-1">numéros inactifs</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiLayers className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900">Actions</h3>
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                  {blockedNumbers.filter(item => item.action === 'Rejeter').length} Rejeter
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {blockedNumbers.filter(item => item.action === 'Occupe').length} Occupe
                </span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {blockedNumbers.filter(item => item.action === 'Attente').length} Attente
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
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#4682B4]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-[#004AC8]" />
                      Numéro
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-[#004AC8]" />
                      Nom
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="w-4 h-4 text-[#004AC8]" />
                      Compte
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiLayers className="w-4 h-4 text-[#004AC8]" />
                      Action
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiToggleRight className="w-4 h-4 text-[#004AC8]" />
                      Activé
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
                      {/* Number */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <FiPhone className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{item.number}</span>
                        </div>
                      </td>
                      
                      {/* Name */}
                      <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                      
                      {/* Account */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {item.account}
                        </div>
                      </td>
                      
                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm ${
                          item.action === 'Rejeter' ? 'bg-red-100 text-red-700' :
                          item.action === 'Occupe' ? 'bg-orange-100 text-orange-700' :
                          item.action === 'Attente' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.action}
                        </div>
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
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <FiSearch className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-600 font-medium mb-1">
                          Aucun numéro trouvé
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
      className="pt-20 min-h-screen"
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
          <Breadcrumbs items={['PBX', 'Applications', 'Liste noire', currentView === 'edit' ? 'Modifier' : 'Ajouter']} />
          
          <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#4682B4]/10 rounded-3xl pointer-events-none" />
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                {currentView === 'edit' ? <FiEdit className="text-[#004AC8]" /> : <FiPlus className="text-[#004AC8]" />}
                {currentView === 'edit' ? "Modifier un numéro bloqué" : "Ajouter un numéro à bloquer"}
              </h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
          <form onSubmit={(e) => {e.preventDefault(); handleSave();}} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Numéro */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                  />
                </div>
              </div>
              
              {/* Nom */}
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiUser className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nom du contact à bloquer"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                  />
                </div>
              </div>
              
              {/* Compte */}
              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                  Compte
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiBriefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="account"
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                  >
                    <option value="Tous">Tous</option>
                    <option value="Accueil">Accueil</option>
                    <option value="Support">Support</option>
                    <option value="Service Commercial">Service Commercial</option>
                    <option value="Direction">Direction</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Action */}
              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <FiLayers className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    id="action"
                    name="action"
                    value={formData.action}
                    onChange={handleChange}
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all appearance-none"
                  >
                    <option value="Rejeter">Rejeter</option>
                    <option value="Occupe">Occupe</option>
                    <option value="Attente">Attente</option>
                    <option value="Messagerie vocal">Messagerie vocal</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Activé */}
              <div className="col-span-2">
                <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-800">Activé</div>
                    <p className="text-sm text-gray-500 mt-1">Activer ou désactiver le blocage de ce numéro</p>
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
            
            {/* Info box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mt-6">
              <FiInfo className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-blue-800">Info :</span>{' '}
                <span className="text-blue-700">
                  Les numéros bloqués ne pourront plus vous joindre selon l&apos;action choisie. Vous pouvez à tout moment modifier ou supprimer un numéro de la liste noire.
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
                <FiSave className="w-4 h-4" />
                {currentView === 'edit' ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
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
