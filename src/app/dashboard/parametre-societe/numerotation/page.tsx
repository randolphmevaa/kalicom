'use client';
import {useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHash, 
  // FiSettings, 
  FiRefreshCw, 
  FiEdit,
  // FiSave,
  FiCheck,
  FiX,
  FiClock,
  // FiAlertTriangle,
  FiHelpCircle,
  FiFileText,
  FiClipboard,
  // FiArchive,
  FiLayers,
  // FiRepeat,
  // FiRotateCw,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  // FiMessageSquare,
  // FiSend,
  // FiAlertCircle,
  FiPlus,
  // FiMinus,
  // FiTrash2
} from 'react-icons/fi';

// Define an interface for the counter object
interface Counter {
  value: number;
  padding: number;
  resetPeriod: string;
  lastReset: string;
}

// Define an interface for a numbering sequence item
interface NumerotationSequence {
  id: string;
  documentType: string;
  prefix: string;
  suffix: string;
  separator: string;
  dateFormat: string;
  counter: Counter;
  format: string;
  example: string;
  isActive: boolean;
  notes: string;
}

export default function Numerotation() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('sequences');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  
  // Sample numbering data for different document types
  const [numerotationData, setNumerotationData] = useState([
    {
      id: 'NUM-001',
      documentType: 'Facture',
      prefix: 'FACT-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 42,
        padding: 4,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'FACT-2025-0042',
      isActive: true,
      notes: 'Format standard pour factures'
    },
    {
      id: 'NUM-002',
      documentType: 'Devis',
      prefix: 'DEV-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 28,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'DEV-2025-028',
      isActive: true,
      notes: 'Format standard pour devis'
    },
    {
      id: 'NUM-003',
      documentType: 'Commande',
      prefix: 'CMD-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 35,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'CMD-2025-035',
      isActive: true,
      notes: 'Format standard pour bons de commande'
    },
    {
      id: 'NUM-004',
      documentType: 'Avoir',
      prefix: 'AV-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 8,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'AV-2025-008',
      isActive: true,
      notes: 'Format standard pour avoirs'
    },
    {
      id: 'NUM-005',
      documentType: 'Facture d\'acompte',
      prefix: 'ACPT-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 12,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'ACPT-2025-012',
      isActive: true,
      notes: 'Format pour factures d\'acompte'
    },
    {
      id: 'NUM-006',
      documentType: 'BL',
      prefix: 'BL-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 21,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'BL-2025-021',
      isActive: true,
      notes: 'Format pour bons de livraison'
    },
    {
      id: 'NUM-007',
      documentType: 'Note de frais',
      prefix: 'NF-',
      suffix: '',
      separator: '-',
      dateFormat: 'YYYY',
      counter: {
        value: 14,
        padding: 3,
        resetPeriod: 'Annuel',
        lastReset: '01/01/2025'
      },
      format: '{prefix}{dateFormat}{separator}{counter}',
      example: 'NF-2025-014',
      isActive: true,
      notes: 'Format pour notes de frais'
    }
  ]);

  // Sample history of numbering changes
  const historyData = [
    {
      id: 'HIST-001',
      date: '15/01/2025',
      documentType: 'Facture',
      action: 'Changement de format',
      oldValue: 'F-YYYY-{counter}',
      newValue: 'FACT-YYYY-{counter}',
      user: 'Jean Martin'
    },
    {
      id: 'HIST-002',
      date: '01/01/2025',
      documentType: 'Facture',
      action: 'Réinitialisation compteur',
      oldValue: '132',
      newValue: '1',
      user: 'Système (automatique)'
    },
    {
      id: 'HIST-003',
      date: '01/01/2025',
      documentType: 'Devis',
      action: 'Réinitialisation compteur',
      oldValue: '91',
      newValue: '1',
      user: 'Système (automatique)'
    },
    {
      id: 'HIST-004',
      date: '01/01/2025',
      documentType: 'Commande',
      action: 'Réinitialisation compteur',
      oldValue: '76',
      newValue: '1',
      user: 'Système (automatique)'
    },
    {
      id: 'HIST-005',
      date: '16/11/2024',
      documentType: 'Devis',
      action: 'Modification padding',
      oldValue: '2',
      newValue: '3',
      user: 'Sophie Dupont'
    },
    {
      id: 'HIST-006',
      date: '10/09/2024',
      documentType: 'Note de frais',
      action: 'Création séquence',
      oldValue: '-',
      newValue: 'NF-YYYY-{counter}',
      user: 'Jean Martin'
    }
  ];

  // Sample settings data
  const [settingsData, setSettingsData] = useState({
    defaultPadding: 3,
    defaultResetPeriod: 'Annuel',
    defaultDateFormat: 'YYYY',
    defaultSeparator: '-',
    autoResetCounters: true,
    allowManualOverride: true,
    validateUniqueNumbers: true,
    notifyBeforeReset: true
  });

  // Format options
  const resetPeriodOptions = ['Jamais', 'Annuel', 'Mensuel', 'Trimestriel'];
  const dateFormatOptions = ['YYYY', 'YY', 'YYYYMM', 'YYMM', 'YYYYMMDD', 'YYMMDD'];
  const separatorOptions = ['-', '/', '_', '.', ''];

  // Statistics
  const statistics = [
    { title: "Séquences actives", value: numerotationData.filter(item => item.isActive).length, icon: <FiLayers className="text-green-500" /> },
    { title: "Prochaine réinitialisation", value: "01/01/2026", icon: <FiClock className="text-blue-500" /> },
    { title: "Dernière facture", value: "FACT-2025-0042", icon: <FiFileText className="text-indigo-500" /> },
    { title: "Dernier devis", value: "DEV-2025-028", icon: <FiClipboard className="text-amber-500" /> }
  ];

  // Toggle expanded item
  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Start editing item
  const startEditing = (id: string) => {
    setEditingItem(id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
  };

  // Save changes (stub)
  const saveChanges = () => {
    // Handle saving the edited item here
    setEditingItem(null);
  };

  // Handle toggling active status
  const toggleActive = (id: string) => {
    setNumerotationData(
      numerotationData.map(item => 
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Use the interface in your generateExample function
const generateExample = (item: NumerotationSequence): string => {
  const paddedCounter = String(item.counter.value).padStart(item.counter.padding, '0');
  let result = item.format;
  result = result.replace('{prefix}', item.prefix);
  result = result.replace('{dateFormat}', item.dateFormat);
  result = result.replace('{separator}', item.separator);
  result = result.replace('{counter}', paddedCounter);
  result = result.replace('{suffix}', item.suffix);
  return result;
};

  // Get text color based on active status
  const getStatusTextColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  // Get background color based on active status
  const getStatusBgColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100' : 'bg-red-100';
  };

  // Update settings
  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettingsData({
      ...settingsData,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Numérotation
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez les séquences de numérotation de vos documents
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiHash className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'sequences' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('sequences')}
            >
              Séquences
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Historique
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Paramètres
            </button>
          </div>

          {/* Sequences Tab */}
          {activeTab === 'sequences' && (
            <>
              {/* Statistics */}
              <div className="p-6 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {statistics.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Box */}
              {showHelp && (
                <div className="mx-6 my-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiInfo className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Guide de numérotation</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Les numéros de documents sont générés selon un format personnalisable avec ces éléments :
                          </p>
                          <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li><strong>{'{prefix}'}</strong> : Texte au début du numéro (ex: FACT)</li>
                            <li><strong>{'{dateFormat}'}</strong> : Format de date (ex: YYYY pour l&apos;année)</li>
                            <li><strong>{'{separator}'}</strong> : Caractère de séparation (ex: -)</li>
                            <li><strong>{'{counter}'}</strong> : Compteur incrémenté automatiquement</li>
                            <li><strong>{'{suffix}'}</strong> : Texte à la fin du numéro (optionnel)</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          onClick={() => setShowHelp(false)}
                          className="inline-flex rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="px-6 pt-4 pb-2 flex justify-between items-center">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center">
                  <FiPlus className="mr-2" />
                  <span>Ajouter une séquence</span>
                </button>
                
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition flex items-center"
                >
                  <FiHelpCircle className="mr-2" />
                  <span>{showHelp ? 'Masquer l\'aide' : 'Afficher l\'aide'}</span>
                </button>
              </div>

              {/* Numbering Sequences List */}
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  {numerotationData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Header */}
                      <div 
                        className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                          expandedItem === item.id ? 'bg-indigo-50 border-b border-gray-200' : ''
                        }`}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-2">
                            <FiFileText className={`h-5 w-5 ${item.isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{item.documentType}</h3>
                            <p className="text-xs text-gray-500">Format: {item.format}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right mr-2">
                            <span className="text-sm font-semibold">Exemple: {item.example}</span>
                            <div className="flex items-center justify-end">
                              <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                getStatusBgColor(item.isActive)} ${getStatusTextColor(item.isActive)}`}
                              >
                                {item.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {expandedItem === item.id ? (
                              <FiChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <FiChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedItem === item.id && (
                        <div className="p-4 border-t border-gray-200 bg-white">
                          {editingItem === item.id ? (
                            /* Edit Form */
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Préfixe
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={item.prefix}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Format de date
                                  </label>
                                  <select
                                    defaultValue={item.dateFormat}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    {dateFormatOptions.map((option, index) => (
                                      <option key={index} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Séparateur
                                  </label>
                                  <select
                                    defaultValue={item.separator}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    {separatorOptions.map((option, index) => (
                                      <option key={index} value={option}>{option === '' ? 'Aucun' : option}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valeur du compteur
                                  </label>
                                  <input
                                    type="number"
                                    defaultValue={item.counter.value}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Padding (zéros)
                                  </label>
                                  <select
                                    defaultValue={item.counter.padding}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    {[1, 2, 3, 4, 5].map((option) => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Réinitialisation
                                  </label>
                                  <select
                                    defaultValue={item.counter.resetPeriod}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  >
                                    {resetPeriodOptions.map((option, index) => (
                                      <option key={index} value={option}>{option}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Suffixe
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={item.suffix}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                                
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Format
                                  </label>
                                  <input
                                    type="text"
                                    defaultValue={item.format}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end space-x-2 pt-4">
                                <button
                                  onClick={cancelEditing}
                                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                                >
                                  Annuler
                                </button>
                                <button
                                  onClick={saveChanges}
                                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Details View */
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Détails de la séquence</h4>
                                  <dl className="grid grid-cols-2 gap-2">
                                    <dt className="text-xs text-gray-500">Préfixe:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.prefix}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Format date:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.dateFormat}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Séparateur:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.separator === '' ? '(Aucun)' : item.separator}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Suffixe:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.suffix || '(Aucun)'}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Format complet:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.format}</dd>
                                  </dl>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Paramètres du compteur</h4>
                                  <dl className="grid grid-cols-2 gap-2">
                                    <dt className="text-xs text-gray-500">Valeur actuelle:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.counter.value}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Padding (zéros):</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.counter.padding}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Réinitialisation:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.counter.resetPeriod}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Dernière réinitialisation:</dt>
                                    <dd className="text-xs font-medium text-gray-900">{item.counter.lastReset}</dd>
                                    
                                    <dt className="text-xs text-gray-500">Prochain numéro:</dt>
                                    <dd className="text-xs font-medium text-gray-900">
                                      {generateExample({
                                        ...item, 
                                        counter: { ...item.counter, value: item.counter.value + 1 }
                                      })}
                                    </dd>
                                  </dl>
                                </div>
                              </div>
                              
                              {item.notes && (
                                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                  <span className="font-medium">Notes:</span> {item.notes}
                                </div>
                              )}
                              
                              <div className="flex justify-end space-x-2 pt-3">
                                <button
                                  onClick={() => toggleActive(item.id)}
                                  className={`px-3 py-1.5 text-xs rounded flex items-center space-x-1 ${
                                    item.isActive 
                                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                >
                                  {item.isActive ? <FiX /> : <FiCheck />}
                                  <span>{item.isActive ? 'Désactiver' : 'Activer'}</span>
                                </button>
                                
                                <button
                                  onClick={() => startEditing(item.id)}
                                  className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 flex items-center space-x-1"
                                >
                                  <FiEdit />
                                  <span>Modifier</span>
                                </button>
                                
                                <button
                                  className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 flex items-center space-x-1"
                                  onClick={() => {
                                    // Stub: refresh logic can go here
                                    console.log('Refresh action for', item.id);
                                  }}
                                >
                                  <FiRefreshCw />
                                  <span>Rafraîchir</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Historique</h2>
              {historyData.map(entry => (
                <div key={entry.id} className="mb-4 p-4 border border-gray-200 rounded">
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Type de document:</strong> {entry.documentType}</p>
                  <p><strong>Action:</strong> {entry.action}</p>
                  <p><strong>Ancienne valeur:</strong> {entry.oldValue}</p>
                  <p><strong>Nouvelle valeur:</strong> {entry.newValue}</p>
                  <p><strong>Utilisateur:</strong> {entry.user}</p>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Paramètres</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Padding par défaut
                  </label>
                  <input 
                    type="number"
                    value={settingsData.defaultPadding}
                    onChange={(e) => updateSetting('defaultPadding', parseInt(e.target.value))}
                    className="mt-1 p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Période de réinitialisation par défaut
                  </label>
                  <select 
                    value={settingsData.defaultResetPeriod}
                    onChange={(e) => updateSetting('defaultResetPeriod', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded"
                  >
                    {resetPeriodOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Format de date par défaut
                  </label>
                  <select 
                    value={settingsData.defaultDateFormat}
                    onChange={(e) => updateSetting('defaultDateFormat', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded"
                  >
                    {dateFormatOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Séparateur par défaut
                  </label>
                  <select 
                    value={settingsData.defaultSeparator}
                    onChange={(e) => updateSetting('defaultSeparator', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded"
                  >
                    {separatorOptions.map((option, index) => (
                      <option key={index} value={option}>{option === '' ? 'Aucun' : option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settingsData.autoResetCounters}
                    onChange={(e) => updateSetting('autoResetCounters', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Réinitialisation automatique des compteurs</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settingsData.allowManualOverride}
                    onChange={(e) => updateSetting('allowManualOverride', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Autoriser la modification manuelle</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settingsData.validateUniqueNumbers}
                    onChange={(e) => updateSetting('validateUniqueNumbers', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Valider l&apos;unicité des numéros</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={settingsData.notifyBeforeReset}
                    onChange={(e) => updateSetting('notifyBeforeReset', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Notifier avant réinitialisation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
