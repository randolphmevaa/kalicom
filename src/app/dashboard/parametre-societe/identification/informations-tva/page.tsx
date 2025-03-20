'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  // FiFileText, 
  FiSave,
  // FiTrash2,
  FiEdit,
  FiX,
  FiInfo,
  FiPercent,
  // FiPlus,
  FiDollarSign,
  FiGlobe,
  FiSettings
} from 'react-icons/fi';

// Define types for form data
interface FormDataType {
  numeroTva: string;
  territorialiteTva: string;
  tauxTva: string;
  paiementTva: string;
}

// Define types for dropdown options
interface DropdownOptionType {
  value: string;
  label: string;
}

export default function InformationsTVA() {
  // Options for dropdowns
  const territorialiteOptions: DropdownOptionType[] = [
    { value: 'france', label: 'France métropolitaine' },
    { value: 'dom-tom', label: 'DOM-TOM' },
    { value: 'ue', label: 'Union Européenne' },
    { value: 'hors-ue', label: 'Hors Union Européenne' }
  ];

  const tauxTvaOptions: DropdownOptionType[] = [
    { value: '20', label: '20% (Taux normal)' },
    { value: '10', label: '10% (Taux intermédiaire)' },
    { value: '5.5', label: '5,5% (Taux réduit)' },
    { value: '2.1', label: '2,1% (Taux particulier)' }
  ];

  const paiementTvaOptions: DropdownOptionType[] = [
    { value: 'debits', label: 'Sur les débits' },
    { value: 'encaissements', label: 'Sur les encaissements' },
    { value: 'mixte', label: 'Mixte' },
    { value: 'exonere', label: 'Exonéré de TVA' }
  ];

  // Pre-filled form state with company information
  const [formData, setFormData] = useState<FormDataType>({
    numeroTva: 'FR12345678901',
    territorialiteTva: 'france',
    tauxTva: '20',
    paiementTva: 'debits'
  });

  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Toggle edit mode
  const toggleEditMode = (): void => {
    setEditMode(!editMode);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Show success message and exit edit mode
    alert('Informations TVA mises à jour avec succès!');
    setEditMode(false);
  };

  // Handle form reset
  const handleReset = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler les modifications?')) {
      // Reset to original data (you would fetch this from your backend in a real app)
      setFormData({
        numeroTva: 'FR12345678901',
        territorialiteTva: 'france',
        tauxTva: '20',
        paiementTva: 'debits'
      });
      setEditMode(false);
    }
  };

  // Input field styling based on edit mode
  const getInputClass = (): string => {
    return `w-full p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };

  // Select field styling based on edit mode
  const getSelectClass = (): string => {
    return `w-full p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Informations TVA
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Paramètres de TVA de votre entreprise
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button 
                onClick={toggleEditMode}
                className="p-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
              >
                <FiEdit className="w-6 h-6 text-indigo-600" />
              </button>
            ) : (
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiEdit className="w-6 h-6 text-amber-600" />
              </div>
            )}
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FiPercent className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg text-amber-800 flex justify-between items-center"
          >
            <div className="flex items-center">
              <FiInfo className="h-5 w-5 mr-2" />
              <span>Mode édition activé. Vous pouvez modifier vos informations de TVA.</span>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Main Information Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FiDollarSign className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Paramètres de TVA</h2>
              </div>
              <p className="text-gray-500 text-sm mt-2 ml-11">
                Vous pouvez spécifier les informations de TVA pour votre entreprise
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° de TVA intracommunautaire
                </label>
                <input
                  type="text"
                  name="numeroTva"
                  value={formData.numeroTva}
                  onChange={handleInputChange}
                  className={getInputClass()}
                  disabled={!editMode}
                  placeholder="Ex: FR12345678901"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Numéro d&apos;identification à la TVA pour les échanges intracommunautaires
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Territorialité de TVA
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="territorialiteTva"
                      value={formData.territorialiteTva}
                      onChange={handleInputChange}
                      className={`pl-10 ${getSelectClass()}`}
                      disabled={!editMode}
                    >
                      {territorialiteOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Zone géographique d&apos;application de la TVA
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux de TVA principal
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPercent className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="tauxTva"
                      value={formData.tauxTva}
                      onChange={handleInputChange}
                      className={`pl-10 ${getSelectClass()}`}
                      disabled={!editMode}
                    >
                      {tauxTvaOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Taux de TVA utilisé par défaut dans vos documents
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paiement de la TVA
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSettings className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="paiementTva"
                    value={formData.paiementTva}
                    onChange={handleInputChange}
                    className={`pl-10 ${getSelectClass()}`}
                    disabled={!editMode}
                  >
                    {paiementTvaOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Méthode de comptabilisation de la TVA (débit ou encaissement)
                </p>
              </div>
              
              {/* Information Box */}
              <div className="bg-blue-50 p-4 rounded-xl mt-6">
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                    <FiInfo className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Information sur la TVA
                    </h3>
                    <p className="text-xs text-blue-700">
                      Le régime de TVA détermine la façon dont vous collectez et déclarez la TVA. 
                      En France, les taux principaux sont 20% (taux normal), 10% et 5,5% (taux réduits), 
                      et 2,1% (taux particulier). La méthode de paiement &quot;Sur les débits&quot; signifie que la 
                      TVA est due dès l&apos;émission de la facture, tandis que &quot;Sur les encaissements&quot; signifie 
                      que la TVA est due uniquement lorsque le paiement est reçu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {editMode && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end space-x-4"
            >
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
              >
                <FiX className="w-5 h-5" />
                <span>Annuler</span>
              </button>
              
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
              >
                <FiSave className="w-5 h-5" />
                <span>Enregistrer les modifications</span>
              </button>
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
