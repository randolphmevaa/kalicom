'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSave,
  // FiEdit,
  FiX,
  FiInfo,
  FiBriefcase,
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

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Show success message
    alert('Informations mises à jour avec succès!');
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
    }
  };

  // Input field styling - always editable now
  const getInputClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };

  // Animation variants for header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* New Header with gradient styling */}
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-white/70 to-indigo-400/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiFileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Informations administratives
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Informations administratives de votre entreprise. Modifiez les identifiants de votre société.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Tous les champs sont directement modifiables. N&apos;oubliez pas d&apos;enregistrer vos modifications en cliquant sur le bouton &quot;Enregistrer les modifications&quot;.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

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

          {/* Form Actions - now always visible */}
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
        </form>
      </div>
    </motion.div>
  );
}
