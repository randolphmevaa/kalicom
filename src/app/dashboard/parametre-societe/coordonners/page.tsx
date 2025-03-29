'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiSave,
  FiPhone,
  FiMail,
  FiUser,
  FiX,
  FiGlobe,
  FiInfo,
  FiBriefcase,
  FiPlus,
  // FiFileText
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
    }
  };

  // Input field styling - always editable now
  const getInputClass = (): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`;
  };

  // Select field styling - always editable now
  const getSelectClass = (): string => {
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
        {/* New Header inspired by the second file */}
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
                    <FiBriefcase className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Coordonnées
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Informations de votre entreprise. Modifiez vos coordonnées professionnelles et vos informations de contact.
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
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
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
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
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
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
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
                        className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
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
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Actions - Now always visible */}
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