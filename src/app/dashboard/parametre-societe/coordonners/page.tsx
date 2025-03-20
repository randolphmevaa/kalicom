'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiSave,
  // FiTrash2,
  FiPhone,
  FiMail,
  FiUser,
  // FiCheck,
  FiX,
  FiGlobe,
  // FiHome,
  FiInfo,
  FiEdit,
  FiBriefcase,
  // FiFileText,
  FiPlus
} from 'react-icons/fi';

// Define types for form data
interface FormDataType {
  // Section 1 - Identification
  formeJuridique: string;
  raisonSociale: string;
  civiliteContact: string;
  nomContact: string;
  qualitePersonne: string;
  
  // Section 2 - Adresse
  adresse1: string;
  adresse2: string;
  adresse3: string;
  adresse4: string;
  codePostal: string;
  ville: string;
  departement: string;
  pays: string;
  memeAdresseSiege: boolean;
  
  // Section 3 - Autres informations
  telephoneFixe: string;
  telephoneFax: string;
  telephonePortable: string;
  email: string;
  siteWeb: string;
}

// Define types for expanded sections
interface ExpandedSectionsType {
  identification: boolean;
  adresse: boolean;
  autresInfo: boolean;
}

export default function Coordonnees() {
  // Pre-filled form state with company information
  const [formData, setFormData] = useState<FormDataType>({
    // Section 1 - Identification
    formeJuridique: 'SARL',
    raisonSociale: 'Tech Innovate',
    civiliteContact: 'M',
    nomContact: 'Alexandre Martin',
    qualitePersonne: 'Directeur',
    
    // Section 2 - Adresse
    adresse1: '3 Rue des Startups',
    adresse2: 'Bâtiment A',
    adresse3: 'Zone Technologique',
    adresse4: '',
    codePostal: '44000',
    ville: 'Nantes',
    departement: 'Loire-Atlantique',
    pays: 'France',
    memeAdresseSiege: true,
    
    // Section 3 - Autres informations
    telephoneFixe: '+33 1 67 89 01 23',
    telephoneFax: '+33 1 67 89 01 24',
    telephonePortable: '+33 6 45 78 90 12',
    email: 'hello@techinnovate.io',
    siteWeb: 'www.techinnovate.io'
  });

  // State for form section expansion
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsType>({
    identification: true,
    adresse: true,
    autresInfo: true
  });

  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Toggle section expansion
  const toggleSection = (section: keyof ExpandedSectionsType): void => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
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
        formeJuridique: 'SARL',
        raisonSociale: 'Tech Innovate',
        civiliteContact: 'M',
        nomContact: 'Alexandre Martin',
        qualitePersonne: 'Directeur',
        adresse1: '3 Rue des Startups',
        adresse2: 'Bâtiment A',
        adresse3: 'Zone Technologique',
        adresse4: '',
        codePostal: '44000',
        ville: 'Nantes',
        departement: 'Loire-Atlantique',
        pays: 'France',
        memeAdresseSiege: true,
        telephoneFixe: '+33 1 67 89 01 23',
        telephoneFax: '+33 1 67 89 01 24',
        telephonePortable: '+33 6 45 78 90 12',
        email: 'hello@techinnovate.io',
        siteWeb: 'www.techinnovate.io'
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
              Coordonnées
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Informations de votre entreprise
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
              <FiBriefcase className="w-6 h-6 text-indigo-600" />
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
          {/* Section 1 - Identification */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer border-b"
              onClick={() => toggleSection('identification')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FiUser className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Identification</h2>
              </div>
              <div>
                {expandedSections.identification ? (
                  <FiX className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiPlus className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections.identification && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forme juridique ou civilité
                    </label>
                    <select
                      name="formeJuridique"
                      value={formData.formeJuridique}
                      onChange={handleInputChange}
                      className={getSelectClass()}
                      disabled={!editMode}
                    >
                      <option value="">Sélectionnez une option</option>
                      <option value="SA">SA</option>
                      <option value="SARL">SARL</option>
                      <option value="SAS">SAS</option>
                      <option value="EURL">EURL</option>
                      <option value="EI">Entreprise Individuelle</option>
                      <option value="M">Monsieur</option>
                      <option value="Mme">Madame</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom - Raison sociale
                    </label>
                    <input
                      type="text"
                      name="raisonSociale"
                      value={formData.raisonSociale}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Civilité du contact
                    </label>
                    <select
                      name="civiliteContact"
                      value={formData.civiliteContact}
                      onChange={handleInputChange}
                      className={getSelectClass()}
                      disabled={!editMode}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="M">Monsieur</option>
                      <option value="Mme">Madame</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      name="nomContact"
                      value={formData.nomContact}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualité de la personne
                    </label>
                    <input
                      type="text"
                      name="qualitePersonne"
                      value={formData.qualitePersonne}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                      placeholder="Ex: Directeur, Gérant..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Section 2 - Adresse de la société */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer border-b"
              onClick={() => toggleSection('adresse')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FiMapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Adresse de la société</h2>
              </div>
              <div>
                {expandedSections.adresse ? (
                  <FiX className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiPlus className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections.adresse && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse1"
                    value={formData.adresse1}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse (suite)
                  </label>
                  <input
                    type="text"
                    name="adresse2"
                    value={formData.adresse2}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse (suite)
                  </label>
                  <input
                    type="text"
                    name="adresse3"
                    value={formData.adresse3}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse (fin)
                  </label>
                  <input
                    type="text"
                    name="adresse4"
                    value={formData.adresse4}
                    onChange={handleInputChange}
                    className={getInputClass()}
                    disabled={!editMode}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Département
                    </label>
                    <input
                      type="text"
                      name="departement"
                      value={formData.departement}
                      onChange={handleInputChange}
                      className={getInputClass()}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pays
                    </label>
                    <select
                      name="pays"
                      value={formData.pays}
                      onChange={handleInputChange}
                      className={getSelectClass()}
                      disabled={!editMode}
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Luxembourg">Luxembourg</option>
                      <option value="Canada">Canada</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="memeAdresseSiege"
                      name="memeAdresseSiege"
                      checked={formData.memeAdresseSiege}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={!editMode}
                    />
                    <label htmlFor="memeAdresseSiege" className="ml-2 block text-sm text-gray-700">
                      Les informations du siège social sont identiques
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Section 3 - Autres informations */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer border-b"
              onClick={() => toggleSection('autresInfo')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FiInfo className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Autres informations</h2>
              </div>
              <div>
                {expandedSections.autresInfo ? (
                  <FiX className="w-5 h-5 text-gray-500" />
                ) : (
                  <FiPlus className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections.autresInfo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="p-6 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone fixe
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                        <FiPhone className="h-5 w-5" />
                      </span>
                      <input
                        type="tel"
                        name="telephoneFixe"
                        value={formData.telephoneFixe}
                        onChange={handleInputChange}
                        className={`flex-1 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone/Fax
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                        <FiPhone className="h-5 w-5" />
                      </span>
                      <input
                        type="tel"
                        name="telephoneFax"
                        value={formData.telephoneFax}
                        onChange={handleInputChange}
                        className={`flex-1 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone portable
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                        <FiPhone className="h-5 w-5" />
                      </span>
                      <input
                        type="tel"
                        name="telephonePortable"
                        value={formData.telephonePortable}
                        onChange={handleInputChange}
                        className={`flex-1 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                        <FiMail className="h-5 w-5" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`flex-1 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                      <FiGlobe className="h-5 w-5" />
                    </span>
                    <input
                      type="url"
                      name="siteWeb"
                      value={formData.siteWeb}
                      onChange={handleInputChange}
                      className={`flex-1 p-3 border ${editMode ? 'border-gray-300' : 'border-gray-100 bg-gray-50'} rounded-r-lg ${editMode ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : ''} text-black`}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </motion.div>
            )}
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
