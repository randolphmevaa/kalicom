'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSave,
  // FiTrash2,
  FiEdit,
  FiX,
  FiInfo,
  FiBriefcase,
  // FiPlus,
  FiTrendingUp
} from 'react-icons/fi';

// Define types for form data
interface FormDataType {
  siret: string;
  codeNafApe: string;
  msa: string;
  numeroRcs: string;
  numeroRm: string;
  capital: string;
}

export default function InformationsAdministratives() {
  // Pre-filled form state with company information
  const [formData, setFormData] = useState<FormDataType>({
    siret: '12345678901234',
    codeNafApe: '6201Z',
    msa: 'MSA-123456',
    numeroRcs: 'RCS PARIS B 123 456 789',
    numeroRm: 'RM 75123456789',
    capital: '100 000 €'
  });

  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    alert('Informations mises à jour avec succès!');
    setEditMode(false);
  };

  // Handle form reset
  const handleReset = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler les modifications?')) {
      // Reset to original data (you would fetch this from your backend in a real app)
      setFormData({
        siret: '12345678901234',
        codeNafApe: '6201Z',
        msa: 'MSA-123456',
        numeroRcs: 'RCS PARIS B 123 456 789',
        numeroRm: 'RM 75123456789',
        capital: '100 000 €'
      });
      setEditMode(false);
    }
  };

  // Input field styling based on edit mode
  const getInputClass = (): string => {
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
              Informations administratives
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Informations administratives de votre entreprise
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
              <FiFileText className="w-6 h-6 text-indigo-600" />
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
              <span>Mode édition activé. Vous pouvez modifier vos informations.</span>
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
                  <FiBriefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Identifiants de l&apos;entreprise</h2>
              </div>
              <p className="text-gray-500 text-sm mt-2 ml-11">
                Vous pouvez spécifier toutes les informations administratives de votre société
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SIRET
                  </label>
                  <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: 12345678901234"
                  />
                  <p className="mt-1 text-xs text-gray-500">Numéro unique d&apos;identification de 14 chiffres</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code NAF/APE
                  </label>
                  <input
                    type="text"
                    name="codeNafApe"
                    value={formData.codeNafApe}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: 6201Z"
                  />
                  <p className="mt-1 text-xs text-gray-500">Code à 4 chiffres + 1 lettre indiquant l&apos;activité principale</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MSA
                  </label>
                  <input
                    type="text"
                    name="msa"
                    value={formData.msa}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: MSA-123456"
                  />
                  <p className="mt-1 text-xs text-gray-500">Numéro de Mutuelle Sociale Agricole (si applicable)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capital
                  </label>
                  <input
                    type="text"
                    name="capital"
                    value={formData.capital}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: 10 000 €"
                  />
                  <p className="mt-1 text-xs text-gray-500">Capital social de l&apos;entreprise</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Identification RCS
                  </label>
                  <input
                    type="text"
                    name="numeroRcs"
                    value={formData.numeroRcs}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: RCS PARIS B 123 456 789"
                  />
                  <p className="mt-1 text-xs text-gray-500">Numéro d&apos;immatriculation au Registre du Commerce et des Sociétés</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Identification RM
                  </label>
                  <input
                    type="text"
                    name="numeroRm"
                    value={formData.numeroRm}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                    placeholder="Ex: RM 75123456789"
                  />
                  <p className="mt-1 text-xs text-gray-500">Numéro d&apos;immatriculation au Répertoire des Métiers</p>
                </div>
              </div>
              
              {/* Secondary Information Card */}
              <div className="bg-indigo-50 p-4 rounded-xl mt-6">
                <div className="flex items-center mb-2">
                  <div className="p-1.5 bg-indigo-100 rounded-lg mr-3">
                    <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-medium text-indigo-800">
                    Informations complémentaires
                  </h3>
                </div>
                <p className="text-xs text-indigo-700 pl-9">
                  Ces informations sont essentielles pour la facturation et les déclarations administratives. 
                  Assurez-vous qu&apos;elles sont correctes et à jour.
                </p>
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
