'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FiMenu,
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
  FiSave,
  FiArrowRight,
  FiSettings,
  FiInfo,
  FiHash,
  FiPhone,
  FiFileText
} from 'react-icons/fi';

// Types
interface SVI {
  id: number;
  nom: string;
  extension: string;
  annonceAccueil: string;
  actionSortie: string;
  options: SVIOption[];
  timeout: string;
  sonDestination: string;
  prefixeNumero: string;
  description: string;
  active: boolean;
  ligneDirecte: boolean;
  annonceInvalide: string;
  annonceSortie: string;
  confirmerMacro: string;
  toucheConfirmation: string;
  ttsEngine: string;
  ttsVoice: string;
  tentativesMax: string;
  delaiMaxTouches: string;
  echecsMax: string;
  echecsMaxDelai: string;
  longueurMaxCommandes: string;
}

interface SVIOption {
  option: string;
  destination: string;
  ordre: string;
  description: string;
}

// Type for form data without the id field
type SVIFormData = Omit<SVI, 'id'>;

// Type for SVIOption fields
type SVIOptionField = keyof SVIOption;

// Type for SVI fields
type SVIField = keyof SVIFormData;

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

/**
 * Toggle Switch Component
 */
// const ToggleSwitch = ({ enabled, onChange, label }: { enabled: boolean; onChange: () => void; label?: string }) => (
//   <div className="flex items-center">
//     <button
//       type="button"
//       onClick={onChange}
//       className={`${
//         enabled ? 'bg-[#004AC8]' : 'bg-gray-200'
//       } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:ring-offset-2`}
//     >
//       <span
//         className={`${
//           enabled ? 'translate-x-5' : 'translate-x-0'
//         } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
//       />
//     </button>
//     {label && <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>}
//   </div>
// );

// Sample SVI data
const SAMPLE_DATA: SVI[] = [
  {
    id: 1,
    nom: 'Accueil Principal',
    extension: '800',
    annonceAccueil: 'welcome-message',
    actionSortie: 'hangup',
    options: [
      { option: '1', destination: 'service-commercial', ordre: '100', description: 'Service Commercial' },
      { option: '2', destination: 'support-technique', ordre: '200', description: 'Support Technique' }
    ],
    timeout: '10',
    sonDestination: 'us-ring',
    prefixeNumero: '',
    description: 'SVI principal pour tous les appels entrants',
    active: true,
    ligneDirecte: true,
    annonceInvalide: 'invalid-option',
    annonceSortie: 'goodbye-message',
    confirmerMacro: '',
    toucheConfirmation: '',
    ttsEngine: '',
    ttsVoice: '',
    tentativesMax: '3',
    delaiMaxTouches: '3000',
    echecsMax: '3',
    echecsMaxDelai: '3',
    longueurMaxCommandes: '4'
  },
  {
    id: 2,
    nom: 'Service Commercial',
    extension: '801',
    annonceAccueil: 'welcome-message',
    actionSortie: 'hangup',
    options: [
      { option: '1', destination: 'equipe-vente', ordre: '100', description: 'Équipe Vente' },
      { option: '2', destination: 'service-client', ordre: '200', description: 'Service Client' }
    ],
    timeout: '15',
    sonDestination: 'us-ring',
    prefixeNumero: '',
    description: 'Options pour le département commercial',
    active: true,
    ligneDirecte: true,
    annonceInvalide: 'invalid-option',
    annonceSortie: 'goodbye-message',
    confirmerMacro: '',
    toucheConfirmation: '',
    ttsEngine: '',
    ttsVoice: '',
    tentativesMax: '3',
    delaiMaxTouches: '3000',
    echecsMax: '3',
    echecsMaxDelai: '3',
    longueurMaxCommandes: '4'
  },
  {
    id: 3,
    nom: 'Support Technique',
    extension: '802',
    annonceAccueil: 'welcome-message',
    actionSortie: 'hangup',
    options: [
      { option: '1', destination: 'support-niveau1', ordre: '100', description: 'Support Niveau 1' },
      { option: '2', destination: 'support-niveau2', ordre: '200', description: 'Support Niveau 2' }
    ],
    timeout: '10',
    sonDestination: 'us-ring',
    prefixeNumero: '',
    description: 'Assistance technique et dépannage',
    active: true,
    ligneDirecte: false,
    annonceInvalide: 'invalid-option',
    annonceSortie: 'goodbye-message',
    confirmerMacro: '',
    toucheConfirmation: '',
    ttsEngine: '',
    ttsVoice: '',
    tentativesMax: '3',
    delaiMaxTouches: '3000',
    echecsMax: '3',
    echecsMaxDelai: '3',
    longueurMaxCommandes: '4'
  },
  {
    id: 4,
    nom: 'Comptabilité',
    extension: '803',
    annonceAccueil: 'welcome-message',
    actionSortie: 'hangup',
    options: [
      { option: '1', destination: 'facturation', ordre: '100', description: 'Facturation' }
    ],
    timeout: '10',
    sonDestination: 'us-ring',
    prefixeNumero: '',
    description: 'Service de facturation et comptabilité',
    active: false,
    ligneDirecte: true,
    annonceInvalide: 'invalid-option',
    annonceSortie: 'goodbye-message',
    confirmerMacro: '',
    toucheConfirmation: '',
    ttsEngine: '',
    ttsVoice: '',
    tentativesMax: '3',
    delaiMaxTouches: '3000',
    echecsMax: '3',
    echecsMaxDelai: '3',
    longueurMaxCommandes: '4'
  }
];

// Sound option and destination option interfaces
interface OptionItem {
  value: string;
  label: string;
}

/**
 * Main SVI Component
 */
export default function ServeurVocalInteractif() {
  const [sviList, setSviList] = useState<SVI[]>(SAMPLE_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentItem, setCurrentItem] = useState<SVI | null>(null);
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Filter the data based on search
  const filteredData = sviList.filter(item => 
    item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.extension.includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form data state
  const defaultSVI: SVIFormData = {
    nom: '',
    extension: '',
    annonceAccueil: '',
    actionSortie: '',
    options: [],
    timeout: '',
    sonDestination: 'default',
    prefixeNumero: '',
    description: '',
    active: true,
    ligneDirecte: false,
    annonceInvalide: '',
    annonceSortie: '',
    confirmerMacro: '',
    toucheConfirmation: '',
    ttsEngine: '',
    ttsVoice: '',
    tentativesMax: '3',
    delaiMaxTouches: '3000',
    echecsMax: '3',
    echecsMaxDelai: '3',
    longueurMaxCommandes: '4'
  };

  const [formData, setFormData] = useState<SVIFormData>(defaultSVI);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
  };

  // Handle edit SVI
  const handleEdit = (item: SVI) => {
    setCurrentItem(item);
    setFormData(item);
    setCurrentView('edit');
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  // Handle delete SVI
  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce SVI?')) {
      setSviList(prev => prev.filter(item => item.id !== id));
    }
  };

  // Handle form field changes
  const handleChange = (field: SVIField, value: string | boolean | SVIOption[]) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Add a new option
  const addOption = () => {
    const newOptions = [...formData.options, { option: '', destination: '', ordre: '', description: '' }];
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  // Remove an option
  const removeOption = (index: number) => {
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  // Update an option field
  const handleOptionChange = (index: number, field: SVIOptionField, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index][field] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  // Reset the form
  const resetForm = () => {
    setFormData(currentItem || defaultSVI);
  };

  // Handle save/create
  const handleSave = () => {
    if (currentView === 'edit' && currentItem) {
      // Update existing item
      setSviList(prev => prev.map(item => 
        item.id === currentItem.id ? { ...formData, id: currentItem.id } : item
      ));
    } else {
      // Add new item
      const newId = Math.max(...sviList.map(item => item.id), 0) + 1;
      setSviList([...sviList, { ...formData, id: newId }]);
    }
    setCurrentView('list');
    setCurrentItem(null);
    setFormData(defaultSVI);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

  // Mock sound options for dropdowns
  const soundOptions: OptionItem[] = [
    { value: 'default', label: 'Default' },
    { value: 'us-ring', label: 'US Ring' },
    { value: 'fr-ring', label: 'FR Ring' },
    { value: 'uk-ring', label: 'UK Ring' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'welcome-message', label: 'Message de bienvenue' },
    { value: 'goodbye-message', label: 'Message de fin' },
    { value: 'invalid-option', label: 'Option invalide' }
  ];

  // Mock destination options
  const destinationOptions: OptionItem[] = [
    { value: 'service-commercial', label: 'Service Commercial' },
    { value: 'support-technique', label: 'Support Technique' },
    { value: 'comptabilite', label: 'Comptabilité' },
    { value: 'direction', label: 'Direction' },
    { value: 'hangup', label: 'Raccrocher' },
    { value: 'equipe-vente', label: 'Équipe Vente' },
    { value: 'service-client', label: 'Service Client' },
    { value: 'support-niveau1', label: 'Support Niveau 1' },
    { value: 'support-niveau2', label: 'Support Niveau 2' },
    { value: 'facturation', label: 'Facturation' }
  ];

  // List View Component
  const ListView = () => (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-0">
        {/* Breadcrumbs */}
        <Breadcrumbs items={['PBX', 'Applications', 'Serveur Vocal Interactif (SVI)']} />

        {/* Header Section */}
        <motion.div variants={itemVariants} className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#FF5722]/10 rounded-3xl pointer-events-none" />
          <div className="relative flex justify-between items-center p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                <FiMenu className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1B0353]">Serveur Vocal Interactif (SVI)</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Le SVI est un système automatisé gérant les appels entrants avec un menu vocal personnalisable.
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentView('add');
                setFormData(defaultSVI);
                setCurrentStep(1);
              }}
              className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl font-medium hover:bg-[#003DA8] transition-colors"
            >
              <FiPlus className="mr-2" />
              Ajouter un SVI
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <FiSearch className="w-5 h-5 text-[#1B0353]/80" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, extension ou description..."
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

        {/* Table Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#004AC8]/5 to-[#FF5722]/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiMenu className="w-4 h-4 text-[#004AC8]" />
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
                      <FiPhone className="w-4 h-4 text-[#004AC8]" />
                      Ligne directe
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiSettings className="w-4 h-4 text-[#004AC8]" />
                      Activé
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1B0353]">
                    <div className="flex items-center gap-2">
                      <FiFileText className="w-4 h-4 text-[#004AC8]" />
                      Description
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#1B0353]">Actions</th>
                </tr>
              </thead>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                            <FiMenu className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-900">{item.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.extension}</td>
                      <td className="px-6 py-4">
                        {item.ligneDirecte ? (
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
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 mr-2 rounded-full ${item.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm ${item.active ? 'text-green-700' : 'text-red-700'}`}>
                            {item.active ? 'Oui' : 'Non'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.description}</td>
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
                          Aucun SVI trouvé
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
      <div className="max-w-5xl mx-auto px-4 md:px-0">
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
          <Breadcrumbs items={['PBX', 'Applications', 'Serveur Vocal Interactif (SVI)', currentView === 'edit' ? 'Modifier' : 'Ajouter']} />
          
          <div className="mt-6 relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-[#004AC8]/10 to-[#FF5722]/10 rounded-3xl pointer-events-none" />
            <div className="relative p-8">
              <h2 className="text-2xl font-bold text-[#1B0353] flex items-center gap-3">
                {currentView === 'edit' ? <FiEdit className="text-[#004AC8]" /> : <FiPlus className="text-[#004AC8]" />}
                {currentView === 'edit' ? "Modifier un SVI" : "Ajouter un SVI"}
              </h2>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center">
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 1 ? 'bg-[#004AC8] text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              1
            </div>
            <div className={`flex-grow h-1 mx-2 ${currentStep === 1 ? 'bg-gray-200' : 'bg-[#004AC8]'}`}></div>
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep === 2 ? 'bg-[#004AC8] text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className={`text-sm font-medium ${currentStep === 1 ? 'text-[#004AC8]' : 'text-gray-500'}`}>
              Serveur Vocal Interactif (SVI)
            </span>
            <span className={`text-sm font-medium ${currentStep === 2 ? 'text-[#004AC8]' : 'text-gray-500'}`}>
              Avancé
            </span>
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div 
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-5">Serveur Vocal Interactif (SVI)</h2>
              
              {/* Basic SVI Information */}
              <div className="space-y-6 mb-8">
                <h3 className="text-md font-medium text-gray-700 pb-2 border-b border-gray-200">Informations de base</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleChange('nom', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      placeholder="Nom du SVI"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extension <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.extension}
                      onChange={(e) => handleChange('extension', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      placeholder="Ex: 800"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annonce d&apos;accueil <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.annonceAccueil}
                      onChange={(e) => handleChange('annonceAccueil', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    >
                      <option value="">Sélectionnez une annonce</option>
                      {soundOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action de sortie
                    </label>
                    <select
                      value={formData.actionSortie}
                      onChange={(e) => handleChange('actionSortie', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    >
                      <option value="">Sélectionnez une action</option>
                      {destinationOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Options Section */}
              <div className="space-y-5 mb-8">
                <h3 className="text-md font-medium text-gray-700 pb-2 border-b border-gray-200">Options</h3>
                
                {formData.options.map((option, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Option {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center text-sm"
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" />
                        Retirer
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Option</label>
                        <input
                          type="text"
                          value={option.option}
                          onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                          placeholder="Ex: 1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <select
                          value={option.destination}
                          onChange={(e) => handleOptionChange(index, 'destination', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                        >
                          <option value="">Sélectionnez une destination</option>
                          {destinationOptions.map(dest => (
                            <option key={dest.value} value={dest.value}>{dest.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                        <input
                          type="text"
                          value={option.ordre}
                          onChange={(e) => handleOptionChange(index, 'ordre', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                          placeholder="Ex: 100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={option.description}
                          onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                          placeholder="Description de l'option"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addOption}
                  className="inline-flex items-center gap-1 text-[#004AC8] hover:text-[#003BB0] font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  Ajouter une option
                </button>
              </div>
              
              {/* Additional Settings */}
              <div className="space-y-6 mb-8">
                <h3 className="text-md font-medium text-gray-700 pb-2 border-b border-gray-200">Paramètres additionnels</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.timeout}
                      onChange={(e) => handleChange('timeout', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      placeholder="Ex: 10"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Son de destination
                    </label>
                    <select
                      value={formData.sonDestination}
                      onChange={(e) => handleChange('sonDestination', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    >
                      {soundOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Préfixe du numéro
                    </label>
                    <input
                      type="text"
                      value={formData.prefixeNumero}
                      onChange={(e) => handleChange('prefixeNumero', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      placeholder="Préfixe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      placeholder="Description"
                    />
                  </div>
                  
                  <div className="col-span-2 grid grid-cols-2 gap-6">
                    <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800">Activé</div>
                        <p className="text-sm text-gray-500 mt-1">Activer ou désactiver ce SVI</p>
                      </div>
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => handleChange('active', !formData.active)}
                      >
                        <div className={`w-12 h-6 transition-colors rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.active ? 'transform translate-x-6' : ''}`}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800">Ligne directe</div>
                        <p className="text-sm text-gray-500 mt-1">Activer/désactiver la ligne directe</p>
                      </div>
                      <div 
                        className="relative cursor-pointer"
                        onClick={() => handleChange('ligneDirecte', !formData.ligneDirecte)}
                      >
                        <div className={`w-12 h-6 transition-colors rounded-full ${formData.ligneDirecte ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.ligneDirecte ? 'transform translate-x-6' : ''}`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
                
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                >
                  Étape suivante
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-5">Avancé</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annonce si invalide
                    </label>
                    <select
                      value={formData.annonceInvalide}
                      onChange={(e) => handleChange('annonceInvalide', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    >
                      <option value="">Sélectionnez une annonce</option>
                      {soundOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Diffusée quand une option non valide est choisi.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annonce de sortie
                    </label>
                    <select
                      value={formData.annonceSortie}
                      onChange={(e) => handleChange('annonceSortie', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    >
                      <option value="">Sélectionnez une annonce</option>
                      {soundOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Diffusée en quittant le menu SVI.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer la Macro
                    </label>
                    <input
                      type="text"
                      value={formData.confirmerMacro}
                      onChange={(e) => handleChange('confirmerMacro', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">Entrez la macro de confirmation.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Touche de confirmation
                    </label>
                    <input
                      type="text"
                      value={formData.toucheConfirmation}
                      onChange={(e) => handleChange('toucheConfirmation', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">Entrez la clé de confirmation.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TTS Engine
                    </label>
                    <input
                      type="text"
                      value={formData.ttsEngine}
                      onChange={(e) => handleChange('ttsEngine', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">Moteur de synthèse vocale.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TTS Voice
                    </label>
                    <input
                      type="text"
                      value={formData.ttsVoice}
                      onChange={(e) => handleChange('ttsVoice', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">Text to speech voice.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tentatives maximum <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tentativesMax}
                      onChange={(e) => handleChange('tentativesMax', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Nombre maximum de tentatives autorisées.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Délai maximum entre les touches <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.delaiMaxTouches}
                      onChange={(e) => handleChange('delaiMaxTouches', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Temps en milisecondes entre les chiffres pour la commande.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Echecs maximum <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.echecsMax}
                      onChange={(e) => handleChange('echecsMax', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Nombre maximum de tentatives avant la sortie.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Echecs maximum pour délai expiré <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.echecsMaxDelai}
                      onChange={(e) => handleChange('echecsMaxDelai', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Nombre maximum de délais expirés avant la sortie.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longueur max des commandes <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.longueurMaxCommandes}
                      onChange={(e) => handleChange('longueurMaxCommandes', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-[#004AC8] transition-all"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Nombre de chiffres autorisés.</p>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Retour
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003DA8] transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {currentView === 'edit' ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tip Section */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
          <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-amber-800">Astuce :</span>{' '}
            <span className="text-amber-700">
              Les champs marqués d&apos;un <span className="text-red-500">*</span> sont obligatoires. Pour les options, assurez-vous que l&apos;ordre est défini de manière séquentielle pour maintenir une navigation cohérente.
            </span>
          </div>
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
