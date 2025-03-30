'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSave,
  FiX,
  FiInfo,
  FiPercent,
  FiDollarSign,
  FiGlobe,
  FiSettings,
  FiAlertCircle,
  FiCheck
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
  disabled?: boolean;
}

export default function InformationsTVA() {
  // Enhanced options for dropdowns
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
    { value: '2.1', label: '2,1% (Taux particulier)' },
    { value: '0', label: '0% (Exonéré)' }
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

  // State for showing confirmation
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Track if the form has been modified
  const [isFormModified, setIsFormModified] = useState<boolean>(false);

  // State for field disabling based on selections
  const [isTauxTvaDisabled, setIsTauxTvaDisabled] = useState<boolean>(false);

  // Effects for interdependent fields
  useEffect(() => {
    // When "Exonéré de TVA" is selected
    if (formData.paiementTva === 'exonere') {
      setFormData(prev => ({
        ...prev,
        tauxTva: '0'
      }));
      setIsTauxTvaDisabled(true);
    } else {
      setIsTauxTvaDisabled(false);
    }
  }, [formData.paiementTva]);

  // Effect for "Hors Union Européenne" territoriality
  useEffect(() => {
    // Add special logic for non-EU territories if needed
    if (formData.territorialiteTva === 'hors-ue') {
      // You could add additional logic here for international VAT rules
    }
  }, [formData.territorialiteTva]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsFormModified(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    // Show confirmation message
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
    
    setIsFormModified(false);
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
      setIsFormModified(false);
    }
  };

  // Input field styling
  const getInputClass = (disabled: boolean = false): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black ${
      disabled ? 'bg-gray-100 cursor-not-allowed' : ''
    }`;
  };

  // Select field styling
  const getSelectClass = (disabled: boolean = false): string => {
    return `w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black ${
      disabled ? 'bg-gray-100 cursor-not-allowed' : ''
    }`;
  };

  // Animation variants for header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Animation variants for confirmation toast
  const toastVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header with gradient styling */}
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
                    <FiPercent className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Informations TVA
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Paramètres de TVA de votre entreprise. Configurez vos numéros d&apos;identification et règles de TVA.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Certains champs s&apos;adaptent automatiquement en fonction de vos sélections. Par exemple, si vous choisissez &quot;Exonéré de TVA&quot;, le taux de TVA sera automatiquement fixé à 0%.
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
                  className={getInputClass(formData.paiementTva === 'exonere' && formData.territorialiteTva === 'hors-ue')}
                  placeholder="Ex: FR12345678901"
                  disabled={formData.paiementTva === 'exonere' && formData.territorialiteTva === 'hors-ue'}
                />
                {formData.paiementTva === 'exonere' && formData.territorialiteTva === 'hors-ue' && (
                  <p className="mt-1 text-xs text-amber-600">
                    Pour les entités hors UE exonérées de TVA, le numéro de TVA n&apos;est pas obligatoire
                  </p>
                )}
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
                      className={`pl-10 ${getSelectClass(isTauxTvaDisabled)}`}
                      disabled={isTauxTvaDisabled}
                    >
                      {tauxTvaOptions.map(option => (
                        <option 
                          key={option.value} 
                          value={option.value}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isTauxTvaDisabled && (
                    <p className="mt-1 text-xs text-amber-600">
                      Le taux est automatiquement fixé à 0% car vous êtes exonéré de TVA
                    </p>
                  )}
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
              
              {/* Dynamic information box based on selection */}
              {formData.paiementTva === 'exonere' ? (
                <div className="bg-amber-50 p-4 rounded-xl mt-6">
                  <div className="flex items-start">
                    <div className="p-1.5 bg-amber-100 rounded-lg mr-3 mt-0.5">
                      <FiAlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-800 mb-1">
                        Exonération de TVA
                      </h3>
                      <p className="text-xs text-amber-700">
                        En tant qu&apos;entité exonérée de TVA, vous n&apos;êtes pas tenu de collecter la TVA sur vos ventes, 
                        mais vous ne pouvez pas non plus récupérer la TVA sur vos achats. Vos factures doivent 
                        mentionner la base légale de votre exonération (par exemple : article 293B du CGI pour 
                        les micro-entreprises en France).
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
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
              className={`px-6 py-3 ${isFormModified ? 'bg-indigo-600' : 'bg-indigo-400'} text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2`}
              disabled={!isFormModified}
            >
              <FiSave className="w-5 h-5" />
              <span>Enregistrer les modifications</span>
            </button>
          </motion.div>
        </form>
        
        {/* Success toast */}
        {showConfirmation && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg flex items-center"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FiCheck className="mr-2" />
            Informations TVA mises à jour avec succès
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}