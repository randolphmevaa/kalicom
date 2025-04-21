'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft, 
  FiCheck, 
  FiChevronRight, 
  FiLayout,
  FiType,
  FiFileText,
  FiGrid,
  FiPaperclip,
  FiAlignLeft,
  FiInfo,
  FiAlignCenter,
  FiAlignRight,
  FiUpload,
  FiEye,
  FiSettings,
  FiCheckCircle,
  FiPlusCircle,
//   FiX,
  FiDollarSign,
//   FiSlash,
  FiEdit,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiCalendar,
//   FiCreditCard,
  FiHash,
  FiUsers,
//   FiUser,
  FiBriefcase
} from 'react-icons/fi';

// Define wizard data interface
interface WizardData {
  headerStyle: string;
  headerElements: string[];
  bodyElements: string[];
  footerElements: string[];
  formatting: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    fontSize: string;
    paperSize: string;
  };
  templateName: string;
}

interface TemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  totalSteps: number;
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
}

export const TemplateWizard: React.FC<TemplateWizardProps> = ({
  isOpen,
  onClose,
  step,
  totalSteps,
  wizardData,
  setWizardData,
  onNextStep,
  onPreviousStep
}) => {
  // Modal and animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut", delay: 0.1 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  // Function to get step icon
//   const getStepIcon = (stepNumber: number) => {
//     switch(stepNumber) {
//       case 1: return <FiLayout className="w-5 h-5" />;
//       case 2: return <FiFileText className="w-5 h-5" />;
//       case 3: return <FiGrid className="w-5 h-5" />;
//       case 4: return <FiDollarSign className="w-5 h-5" />;
//       case 5: return <FiSettings className="w-5 h-5" />;
//       default: return <FiFileText className="w-5 h-5" />;
//     }
//   };

  // Function to get step title
  const getStepTitle = (stepNumber: number) => {
    switch(stepNumber) {
      case 1: return "Style d'entête";
      case 2: return "Données d'entête";
      case 3: return "Corps du document";
      case 4: return "Pied de page";
      case 5: return "Mise en forme";
      default: return "Étape";
    }
  };

  // Function to handle checkbox change for multiple selection
  const handleCheckboxChange = (section: 'headerElements' | 'bodyElements' | 'footerElements', item: string) => {
    const currentItems = [...wizardData[section]];
    
    if (currentItems.includes(item)) {
      // Remove item if it's already selected
      setWizardData({
        ...wizardData,
        [section]: currentItems.filter(el => el !== item)
      });
    } else {
      // Add item if it's not selected
      setWizardData({
        ...wizardData,
        [section]: [...currentItems, item]
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Wizard Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
                <div className="flex items-center">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg mr-3 text-gray-500 transition-colors"
                    aria-label="Fermer"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiPlusCircle className="mr-2 text-[#6C5DD3]" />
                    Nouveau modèle d&apos;avoir
                  </h2>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <span className="font-medium text-[#6C5DD3] mr-1">{step}</span>
                  <span>/</span>
                  <span className="ml-1">{totalSteps}</span>
                </div>
              </div>
              
              {/* Progress Bar and Steps */}
              <div className="px-8 py-4 bg-gray-50 border-b">
                <div className="relative mb-6">
                  {/* Bar background */}
                  <div className="h-2 bg-gray-200 rounded-full">
                    {/* Progress fill */}
                    <motion.div 
                      className="absolute top-0 left-0 h-2 bg-[#6C5DD3] rounded-full"
                      initial={{ width: `${((step-1) / totalSteps) * 100}%` }}
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                
                {/* Step indicators */}
                <div className="flex justify-between">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center relative">
                      {/* Step connector */}
                      {index < totalSteps - 1 && (
                        <div 
                          className={`absolute top-3 left-[50%] w-full h-[2px] -z-10 ${
                            index < step - 1 ? 'bg-[#6C5DD3]' : 'bg-gray-200'
                          }`}
                          style={{ transform: 'translateX(50%)' }}
                        />
                      )}
                      
                      {/* Step circle */}
                      <div 
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mb-2
                          ${index + 1 < step 
                            ? 'bg-[#6C5DD3] text-white shadow-sm' 
                            : index + 1 === step 
                              ? 'bg-white border-2 border-[#6C5DD3] text-[#6C5DD3] shadow-sm' 
                              : 'bg-white border border-gray-300 text-gray-400'
                          }`}
                      >
                        {index + 1 < step ? <FiCheck className="w-4 h-4" /> : index + 1}
                      </div>
                      
                      {/* Step label */}
                      <div className={`flex flex-col items-center ${
                        index + 1 === step ? 'text-[#6C5DD3]' : 'text-gray-500'
                      }`}>
                        <span className={`text-xs font-medium whitespace-nowrap ${
                          index + 1 === step ? 'text-[#6C5DD3]' : 'text-gray-500'
                        }`}>
                          {getStepTitle(index + 1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Wizard Content */}
              <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full"
                  >
                    {/* Step 1: Header Style */}
                    {step === 1 && (
                      <HeaderStyleStep 
                        wizardData={wizardData} 
                        setWizardData={setWizardData} 
                      />
                    )}
                    
                    {/* Step 2: Header Data */}
                    {step === 2 && (
                      <HeaderDataStep 
                        wizardData={wizardData} 
                        setWizardData={setWizardData}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    )}
                    
                    {/* Step 3: Body Data */}
                    {step === 3 && (
                      <BodyDataStep 
                        wizardData={wizardData} 
                        setWizardData={setWizardData}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    )}
                    
                    {/* Step 4: Footer Data */}
                    {step === 4 && (
                      <FooterDataStep 
                        wizardData={wizardData} 
                        setWizardData={setWizardData}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    )}
                    
                    {/* Step 5: Template Formatting */}
                    {step === 5 && (
                      <FormattingStep 
                        wizardData={wizardData} 
                        setWizardData={setWizardData} 
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Wizard Footer */}
              <div className="p-6 border-t bg-white flex justify-between">
                <div>
                  {step > 1 && (
                    <button
                      onClick={onPreviousStep}
                      className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center text-gray-700"
                    >
                      <FiArrowLeft className="mr-2" />
                      Précédent
                    </button>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 text-gray-700 rounded-xl hover:bg-gray-100 transition"
                  >
                    Annuler
                  </button>
                  
                  <button
                    onClick={onNextStep}
                    className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-xl hover:bg-[#5C4DC3] transition flex items-center shadow-sm"
                  >
                    {step === totalSteps ? (
                      <>
                        <FiCheck className="mr-2" />
                        Terminer
                      </>
                    ) : (
                      <>
                        Suivant
                        <FiChevronRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Wizard step components
const HeaderStyleStep: React.FC<{
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
}> = ({ wizardData, setWizardData }) => {
  // Header style options
  const headerStyles = [
    { 
      name: 'Standard', 
      desc: 'Logo à gauche, informations à droite',
      preview: (
        <div className="w-full h-full p-2 flex justify-between">
          <div className="w-16 h-10 bg-[#6C5DD3]/10 rounded flex items-center justify-center text-[#6C5DD3] text-xs font-bold">LOGO</div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-800">AVOIR</div>
            <div className="text-xs text-gray-500 mt-1">N° AV-2025-0042</div>
            <div className="text-xs text-gray-500">Date: 23/03/2025</div>
          </div>
        </div>
      )
    },
    { 
      name: 'Moderne', 
      desc: 'Design épuré avec entête colorée',
      preview: (
        <div className="w-full h-full flex flex-col">
          <div className="h-8 bg-[#6C5DD3]/80 w-full p-2 flex justify-between items-center">
            <div className="text-xs font-bold text-white">AVOIR N° AV-2025-0042</div>
            <div className="text-xs text-white">23/03/2025</div>
          </div>
          <div className="flex justify-between p-2">
            <div className="w-12 h-8 bg-gray-100 rounded"></div>
            <div className="text-xs text-right text-gray-600">
              <div>Votre Entreprise</div>
              <div>contact@entreprise.fr</div>
            </div>
          </div>
        </div>
      )
    },
    { 
      name: 'Classique', 
      desc: 'Présentation traditionnelle centrée',
      preview: (
        <div className="w-full h-full p-2 flex flex-col items-center">
          <div className="w-16 h-8 bg-gray-100 rounded mb-1"></div>
          <div className="text-center">
            <div className="text-sm font-bold">AVOIR</div>
            <div className="text-xs text-gray-500">N° AV-2025-0042 • 23/03/2025</div>
          </div>
        </div>
      )
    },
    { 
      name: 'Minimaliste', 
      desc: 'Style simple sans fioritures',
      preview: (
        <div className="w-full h-full p-3">
          <div className="text-sm font-medium">AVOIR #AV-2025-0042</div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">23/03/2025</div>
            <div className="w-10 h-6 bg-gray-100 rounded"></div>
          </div>
        </div>
      )
    },
    { 
      name: 'Élégant', 
      desc: 'Mise en page sophistiquée',
      preview: (
        <div className="w-full h-full border-b-2 border-[#6C5DD3]">
          <div className="flex justify-between items-center h-full p-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full mr-2"></div>
              <div>
                <div className="text-xs font-medium">Votre Entreprise</div>
                <div className="text-[10px] text-gray-500">Paris, France</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-serif font-medium text-[#6C5DD3]">Avoir</div>
              <div className="text-xs text-gray-600">#AV-2025-0042</div>
            </div>
          </div>
        </div>
      )
    },
    { 
      name: 'Professionnel', 
      desc: 'Présentation business formelle',
      preview: (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between bg-gray-50 p-2 border-b">
            <div className="w-12 h-8 bg-gray-200 rounded"></div>
            <div className="text-xs text-gray-500 text-right">
              <div>Tél: 01 23 45 67 89</div>
              <div>contact@entreprise.fr</div>
            </div>
          </div>
          <div className="p-2">
            <div className="text-sm font-bold text-gray-800">AVOIR N° AV-2025-0042</div>
            <div className="text-xs text-gray-500">Émis le 23/03/2025</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiLayout className="mr-2 text-[#6C5DD3]" />
          <h3 className="text-lg font-semibold text-gray-800">Style d&apos;entête du document</h3>
        </div>
        <p className="text-gray-600">
          Choisissez le style qui convient le mieux à l&apos;image de votre entreprise. 
          Ces modèles sont entièrement personnalisables par la suite.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {headerStyles.map((style, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(108, 93, 211, 0.15)" }}
              transition={{ duration: 0.2 }}
              onClick={() => setWizardData({...wizardData, headerStyle: style.name.toLowerCase()})}
              className={`border rounded-xl p-4 cursor-pointer transition-all bg-white
                ${wizardData.headerStyle === style.name.toLowerCase() 
                  ? 'border-[#6C5DD3] ring-2 ring-[#6C5DD3]/20 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{style.name}</h4>
                {wizardData.headerStyle === style.name.toLowerCase() && (
                  <div className="w-5 h-5 bg-[#6C5DD3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mb-3">{style.desc}</p>
              
              {/* Header style preview */}
              <div className="h-24 bg-white border rounded-lg overflow-hidden shadow-sm">
                {style.preview}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template name input */}
        <div className="mt-12 bg-white border rounded-xl p-6 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <FiEdit className="mr-2 text-[#6C5DD3]" />
            Nommer votre modèle
          </h4>
          
          <p className="text-sm text-gray-600 mb-4">
            Donnez un nom à votre modèle pour le retrouver facilement dans votre liste de modèles.
          </p>
          
          <div className="flex text-gray-800">
            <input
              type="text"
              value={wizardData.templateName}
              onChange={(e) => setWizardData({...wizardData, templateName: e.target.value})}
              placeholder="Exemple: Avoir clients particuliers"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50 focus:border-[#6C5DD3]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HeaderDataStep: React.FC<{
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
  handleCheckboxChange: (section: 'headerElements' | 'bodyElements' | 'footerElements', item: string) => void;
}> = ({ wizardData, handleCheckboxChange }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiFileText className="mr-2 text-[#6C5DD3]" />
          <h3 className="text-lg font-semibold text-gray-800">Données d&apos;entête du document</h3>
        </div>
        <p className="text-gray-600">
          Sélectionnez les informations à inclure dans l&apos;entête de votre avoir.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          {/* Logo Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiPaperclip className="mr-2 text-[#6C5DD3]" />
              Logo
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="show_logo"
                  checked={wizardData.headerElements.includes('logo')}
                  onChange={() => handleCheckboxChange('headerElements', 'logo')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="show_logo" className="text-gray-700">Afficher le logo</label>
              </div>
              
              <div className="flex items-center">
                <button className="px-4 py-2 text-sm bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg hover:bg-[#6C5DD3]/20 transition flex items-center">
                  <FiUpload className="mr-1.5" />
                  Modifier le logo...
                </button>
                <span className="text-xs text-gray-500 ml-3">Aucun logo sélectionné</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="adjust_logo"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="adjust_logo" className="text-gray-700">Ajuster automatiquement la taille du logo</label>
              </div>
            </div>
          </motion.div>
          
          {/* Coordonnées de la société Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiBriefcase className="mr-2 text-[#6C5DD3]" />
              Coordonnées de la société
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'company_name', label: 'Nom de l\'entreprise', icon: <FiBriefcase className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'company' },
                { id: 'address', label: 'Adresse', icon: <FiMapPin className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'address' },
                { id: 'phone', label: 'Téléphone', icon: <FiPhone className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'phone' },
                { id: 'mobile', label: 'Tél portable', icon: <FiPhone className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'mobile' },
                { id: 'email', label: 'Email', icon: <FiMail className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'email' },
                { id: 'website', label: 'Site web', icon: <FiGlobe className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'website' },
                { id: 'siret', label: 'N° SIRET', icon: <FiHash className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'siret' },
                { id: 'vat', label: 'N° TVA', icon: <FiHash className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'vat' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={item.id} 
                    checked={wizardData.headerElements.includes(item.element)}
                    onChange={() => handleCheckboxChange('headerElements', item.element)}
                    className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                  />
                  <label htmlFor={item.id} className="text-gray-700 flex items-center">
                    {item.icon}
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hide_company_info"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="hide_company_info" className="text-gray-700">Masquer les coordonnées de la société</label>
              </div>
            </div>
          </motion.div>
          
          {/* Facture d'origine Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiFileText className="mr-2 text-[#6C5DD3]" />
              Facture d&apos;origine
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'invoice_number', label: 'Numéro de facture', icon: <FiHash className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'invoiceNumber' },
                { id: 'invoice_date', label: 'Date de facture', icon: <FiCalendar className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'invoiceDate' },
                { id: 'refund_reason', label: 'Motif de l\'avoir', icon: <FiInfo className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'refundReason' },
                { id: 'order_ref', label: 'Référence commande', icon: <FiHash className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'orderRef' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={item.id}
                    checked={wizardData.headerElements.includes(item.element)}
                    onChange={() => handleCheckboxChange('headerElements', item.element)}
                    className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                  />
                  <label htmlFor={item.id} className="text-gray-700 flex items-center">
                    {item.icon}
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Coordonnées du client Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiUsers className="mr-2 text-[#6C5DD3]" />
              Coordonnées du client
            </h4>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { id: 'client_ref', label: 'Référence client', icon: <FiHash className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'clientRef' },
                { id: 'client_phone', label: 'Téléphone', icon: <FiPhone className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'clientPhone' },
                { id: 'client_email', label: 'Email', icon: <FiMail className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'clientEmail' },
                { id: 'client_address', label: 'Adresse complète', icon: <FiMapPin className="w-4 h-4 mr-1.5 text-gray-400" />, element: 'clientAddress' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={item.id}
                    checked={wizardData.headerElements.includes(item.element)}
                    onChange={() => handleCheckboxChange('headerElements', item.element)}
                    className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                  />
                  <label htmlFor={item.id} className="text-gray-700 flex items-center">
                    {item.icon}
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hide_contact"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="hide_contact" className="text-gray-700">Masquer le contact principal</label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hide_vat"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="hide_vat" className="text-gray-700">Masquer le numéro de TVA du client</label>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="bg-white border rounded-xl p-5 shadow-sm h-fit sticky top-4">
            <div className="font-medium text-gray-700 mb-4 flex items-center">
              <FiEye className="mr-2 text-[#6C5DD3]" />
              Aperçu de l&apos;entête
            </div>
            
            <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
              <div className="flex justify-between mb-4">
                <div className="w-24 h-12 bg-[#6C5DD3]/20 rounded-lg flex items-center justify-center text-[#6C5DD3] font-bold">LOGO</div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">AVOIR</div>
                  <div className="text-sm text-gray-600">N° AV-2025-0042</div>
                  <div className="text-sm text-gray-600">Date: 23/03/2025</div>
                  <div className="text-sm text-gray-600">Facture d&apos;origine: FA-2025-0127</div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">Votre Entreprise SARL</div>
                  <div>123 Avenue des Affaires</div>
                  <div>75001 Paris, France</div>
                  <div>Tél: 01 23 45 67 89</div>
                  <div>Email: contact@entreprise.fr</div>
                </div>
                
                <div className="border p-3 bg-gray-50 rounded text-sm w-52">
                  <div className="font-medium mb-1">CLIENT</div>
                  <div>Client Exemple Inc.</div>
                  <div>42 Rue du Commerce</div>
                  <div>69002 Lyon</div>
                  <div>Réf: CLI2025-042</div>
                  <div>Tél: 04 78 12 34 56</div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
                <span className="text-sm font-medium text-amber-800">À savoir</span>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600">
                  Les éléments affichés dans l&apos;entête peuvent varier en fonction de votre style et de vos sélections.
                  Vous pourrez toujours modifier ces choix ultérieurement.
                </p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
              <FiInfo className="h-4 w-4 mr-1 text-amber-500" />
              Cet aperçu est une représentation simplifiée. L&apos;apparence réelle peut varier.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BodyDataStep: React.FC<{
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
  handleCheckboxChange: (section: 'headerElements' | 'bodyElements' | 'footerElements', item: string) => void;
}> = ({ wizardData, handleCheckboxChange }) => {
  const [selectedColumn, setSelectedColumn] = useState('description');
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiGrid className="mr-2 text-[#6C5DD3]" />
          <h3 className="text-lg font-semibold text-gray-800">Corps du document: données</h3>
        </div>
        <p className="text-gray-600">
          Sélectionnez et configurez les colonnes et éléments qui apparaîtront dans le corps de votre avoir.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Colonnes Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiGrid className="mr-2 text-[#6C5DD3]" />
              Colonnes
            </h4>
            
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-2 mb-6">
              {[
                { id: 'reference', label: 'Référence', element: 'reference' },
                { id: 'description', label: 'Description', element: 'description' },
                { id: 'unit_label', label: 'Unité (Libellé)', element: 'unitLabel' },
                { id: 'unit_code', label: 'Unité (Code)', element: 'unitCode' },
                { id: 'quantity', label: 'Quantité', element: 'quantity' },
                { id: 'price_ttc', label: 'P.U. TTC', element: 'priceTTC' },
                { id: 'price_ht', label: 'P.U. HT', element: 'priceHT' },
                { id: 'discount', label: '% Remise', element: 'discount' },
                { id: 'total_ttc', label: 'Montant TTC', element: 'totalTTC' },
                { id: 'total_ht', label: 'Montant HT', element: 'totalHT' },
                { id: 'vat', label: 'TVA', element: 'vat' }
              ].map((column ) => (
                <div 
                  key={column.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer
                    ${selectedColumn === column.element ? 'border-[#6C5DD3] bg-[#6C5DD3]/5' : 'border-gray-200'}
                  `}
                  onClick={() => setSelectedColumn(column.element)}
                >
                  <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                    <input 
                      type="checkbox" 
                      checked={wizardData.bodyElements.includes(column.element)}
                      onChange={() => handleCheckboxChange('bodyElements', column.element)}
                      className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                    />
                    <span className="text-gray-700">{column.label}</span>
                  </label>
                  
                  <div className="flex items-center space-x-1.5">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la gauche">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la droite">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-sm text-gray-700 mb-3">Personnalisation de la colonne</h5>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Largeur</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      min="1"
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50"
                      defaultValue="100"
                    />
                    <span className="inline-flex items-center px-3 py-1.5 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                      px
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button className="p-1.5 bg-[#6C5DD3] text-white">
                      <FiAlignLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 border-l border-r border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                      <FiAlignCenter className="w-5 h-5" />
                    </button>
                    <button className="p-1.5 bg-white text-gray-700 hover:bg-gray-50">
                      <FiAlignRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Origine des articles Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiFileText className="mr-2 text-[#6C5DD3]" />
              Origine des articles
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="show_invoice_ref"
                  checked={wizardData.bodyElements.includes('showInvoiceRef')}
                  onChange={() => handleCheckboxChange('bodyElements', 'showInvoiceRef')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="show_invoice_ref" className="text-gray-700">Afficher la référence facture sur chaque ligne</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="negative_lines"
                  checked={wizardData.bodyElements.includes('negativeLines')}
                  onChange={() => handleCheckboxChange('bodyElements', 'negativeLines')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="negative_lines" className="text-gray-700">Afficher les lignes en négatif (remboursement)</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="reason_column"
                  checked={wizardData.bodyElements.includes('reasonColumn')}
                  onChange={() => handleCheckboxChange('bodyElements', 'reasonColumn')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="reason_column" className="text-gray-700">Ajouter une colonne de motif</label>
              </div>
            </div>
          </motion.div>
          
          {/* Police Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiType className="mr-2 text-[#6C5DD3]" />
              Police
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Police</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
                  <option value="helvetica">Helvetica</option>
                  <option value="arial">Arial</option>
                  <option value="openSans">Open Sans</option>
                  <option value="roboto">Roboto</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Taille</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50">
                  <option value="9">9px</option>
                  <option value="10">10px</option>
                  <option value="11">11px</option>
                  <option value="12" selected>12px</option>
                  <option value="14">14px</option>
                  <option value="16">16px</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center">
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Gras">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Italique">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M10 4H16M14 20H4" />
                  <line x1="15" y1="4" x2="9" y2="20" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Souligné">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 7L9 14M15 7L15 14M6 20H18" />
                </svg>
              </button>
              
              <div className="ml-2 flex items-center">
                <label className="text-sm text-gray-700 mr-2">Couleur:</label>
                <input 
                  type="color" 
                  defaultValue="#333333"
                  className="w-8 h-8 p-1 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="bg-white border rounded-xl p-5 shadow-sm h-fit sticky top-4">
            <div className="font-medium text-gray-700 mb-4 flex items-center">
              <FiEye className="mr-2 text-[#6C5DD3]" />
              Aperçu du corps
            </div>
            
            <div className="bg-white border rounded-lg p-3 shadow-sm mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-1 text-xs text-gray-600">Réf.</th>
                    <th className="py-2 px-1 text-xs text-gray-600">Description</th>
                    <th className="py-2 px-1 text-xs text-gray-600 text-center">Qté</th>
                    <th className="py-2 px-1 text-xs text-gray-600 text-right">P.U. HT</th>
                    <th className="py-2 px-1 text-xs text-gray-600 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-1 px-1 text-xs">PRO-001</td>
                    <td className="py-1 px-1 text-xs">Service de consultation <span className="text-xs text-gray-500">(FA-2025-0127)</span></td>
                    <td className="py-1 px-1 text-xs text-center">-1</td>
                    <td className="py-1 px-1 text-xs text-right">650,00 €</td>
                    <td className="py-1 px-1 text-xs text-right">-650,00 €</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1 text-xs">PRO-003</td>
                    <td className="py-1 px-1 text-xs">Maintenance mensuelle <span className="text-xs text-gray-500">(FA-2025-0127)</span></td>
                    <td className="py-1 px-1 text-xs text-center">-1</td>
                    <td className="py-1 px-1 text-xs text-right">225,00 €</td>
                    <td className="py-1 px-1 text-xs text-right">-225,00 €</td>
                  </tr>
                </tbody>
              </table>
              
              <div className="flex justify-end mt-3">
                <div className="w-40 text-xs">
                  <div className="flex justify-between py-1">
                    <span>Total HT</span>
                    <span>-875,00 €</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
                <span className="text-sm font-medium text-amber-800">À savoir</span>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600">
                  Pour les avoirs, il est recommandé d&apos;afficher les montants en négatif afin
                  de clairement indiquer qu&apos;il s&apos;agit d&apos;un remboursement.
                </p>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
              <FiInfo className="h-4 w-4 mr-1 text-amber-500" />
              Cet aperçu est une représentation simplifiée. L&apos;apparence réelle peut varier.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FooterDataStep: React.FC<{
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
  handleCheckboxChange: (section: 'headerElements' | 'bodyElements' | 'footerElements', item: string) => void;
}> = ({ wizardData, setWizardData, handleCheckboxChange }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiDollarSign className="mr-2 text-[#6C5DD3]" />
          <h3 className="text-lg font-semibold text-gray-800">Pied du document: données</h3>
        </div>
        <p className="text-gray-600">
          Configurez les informations affichées dans le pied de page de votre avoir.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Montant Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiDollarSign className="mr-2 text-[#6C5DD3]" />
              Montant
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { id: 'total_ht', label: 'Total HT', element: 'totalHT' },
                { id: 'total_vat', label: 'Total TVA', element: 'totalVAT' },
                { id: 'total_ttc', label: 'Total TTC', element: 'totalTTC' },
                { id: 'total_text', label: 'Total TTC en lettres', element: 'totalText' },
                { id: 'refund_amount', label: 'Montant remboursé', element: 'refundAmount' },
                { id: 'credit_amount', label: 'Montant avoir', element: 'creditAmount' },
                { id: 'refund_method', label: 'Méthode de remboursement', element: 'refundMethod' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={item.id}
                    checked={wizardData.footerElements.includes(item.element)}
                    onChange={() => handleCheckboxChange('footerElements', item.element)}
                    className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                  />
                  <label htmlFor={item.id} className="text-gray-700">{item.label}</label>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="negative_amounts"
                  checked={wizardData.footerElements.includes('negativeAmounts')}
                  onChange={() => handleCheckboxChange('footerElements', 'negativeAmounts')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="negative_amounts" className="text-gray-700">Afficher montants en négatif</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="show_refund_date"
                  checked={wizardData.footerElements.includes('showRefundDate')}
                  onChange={() => handleCheckboxChange('footerElements', 'showRefundDate')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="show_refund_date" className="text-gray-700">Afficher date du remboursement</label>
              </div>
            </div>
          </motion.div>
          
          {/* Mentions légales Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiFileText className="mr-2 text-[#6C5DD3]" />
              Récapitulatif TVA et mentions légales
            </h4>
            
            <div className="space-y-2 mb-4">
              <div className="font-medium text-sm text-gray-700 mb-2">Récapitulatif TVA</div>
              
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="recap_tva" 
                    value="always"
                    checked={wizardData.footerElements.includes('vatSummaryAlways')}
                    onChange={() => {
                      // Remove the other option if present
                      const newElements = wizardData.footerElements.filter(
                        el => el !== 'vatSummaryMultiple'
                      );
                      // Add this option
                      if (!newElements.includes('vatSummaryAlways')) {
                        newElements.push('vatSummaryAlways');
                      }
                      setWizardData({...wizardData, footerElements: newElements});
                    }}
                    className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3]" 
                  />
                  <span className="text-gray-700">Toujours afficher</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    name="recap_tva" 
                    value="multiple_rates"
                    checked={wizardData.footerElements.includes('vatSummaryMultiple')}
                    onChange={() => {
                      // Remove the other option if present
                      const newElements = wizardData.footerElements.filter(
                        el => el !== 'vatSummaryAlways'
                      );
                      // Add this option
                      if (!newElements.includes('vatSummaryMultiple')) {
                        newElements.push('vatSummaryMultiple');
                      }
                      setWizardData({...wizardData, footerElements: newElements});
                    }}
                    className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3]" 
                  />
                  <span className="text-gray-700">Seulement si plusieurs taux</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="legal_terms_credit"
                  checked={wizardData.footerElements.includes('legalTermsCredit')}
                  onChange={() => handleCheckboxChange('footerElements', 'legalTermsCredit')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="legal_terms_credit" className="text-gray-700">Mentions légales d&apos;avoir</label>
              </div>
              
              <div className="ml-6">
                <button className="inline-flex items-center px-3 py-1.5 text-sm bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg hover:bg-[#6C5DD3]/20 transition">
                  <FiEdit className="mr-1.5" />
                  Modifier les mentions légales...
                </button>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="credit_reason"
                  checked={wizardData.footerElements.includes('creditReason')}
                  onChange={() => handleCheckboxChange('footerElements', 'creditReason')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="credit_reason" className="text-gray-700">Motif de l&apos;avoir</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="banking_details"
                  checked={wizardData.footerElements.includes('bankingDetails')}
                  onChange={() => handleCheckboxChange('footerElements', 'bankingDetails')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="banking_details" className="text-gray-700">Coordonnées bancaires de la société</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="page_number"
                  checked={wizardData.footerElements.includes('pageNumber')}
                  onChange={() => handleCheckboxChange('footerElements', 'pageNumber')}
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="page_number" className="text-gray-700">Numéro de page</label>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-white border rounded-xl p-5 shadow-sm h-fit sticky top-4">
            <div className="font-medium text-gray-700 mb-4 flex items-center">
              <FiEye className="mr-2 text-[#6C5DD3]" />
              Aperçu du pied de page
            </div>
            
            <div className="bg-white border rounded-lg p-4 shadow-sm mb-4 h-[400px] overflow-y-auto">
              {/* Total Section */}
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-end">
                  <table className="text-sm w-48">
                    <tbody>
                      <tr>
                        <td className="py-1 text-gray-600">Total HT</td>
                        <td className="py-1 text-gray-800 text-right">-875,00 €</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-gray-600">Total TVA</td>
                        <td className="py-1 text-gray-800 text-right">-175,00 €</td>
                      </tr>
                      <tr className="font-medium">
                        <td className="py-1 text-gray-700">Total TTC</td>
                        <td className="py-1 text-gray-800 text-right">-1.050,00 €</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Remboursement Section */}
              <div className="mb-4 border-t pt-4">
                <div className="text-xs text-gray-600 mb-2">
                  <div className="font-medium text-gray-700">Modalités de remboursement</div>
                  <div>Le montant sera remboursé par virement bancaire sous 15 jours.</div>
                </div>
                
                <div className="text-xs text-gray-600 mt-3">
                  <div className="font-medium text-gray-700">Motif de l&apos;avoir</div>
                  <div>Annulation partielle de la commande suite à une erreur de facturation.</div>
                </div>
              </div>
              
              {/* TVA Summary */}
              <div className="mb-4 border rounded p-2 bg-gray-50">
                <div className="text-xs font-medium text-gray-700 mb-1">Récapitulatif TVA</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-1 text-left text-gray-600">Taux</th>
                      <th className="py-1 text-right text-gray-600">Base HT</th>
                      <th className="py-1 text-right text-gray-600">Montant TVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-700">20,00%</td>
                      <td className="py-1 text-gray-700 text-right">-875,00 €</td>
                      <td className="py-1 text-gray-700 text-right">-175,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Company Info */}
              <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-1">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires</div>
                    <div>Banque: BNP Paribas</div>
                    <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                    <div>BIC: BNPAFRPPXXX</div>
                  </div>
                </div>
                
                <div className="text-center text-[10px] text-gray-500 mt-4">
                  <div>Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789</div>
                  <div>Pour tout renseignement complémentaire, veuillez nous contacter au 01 23 45 67 89</div>
                </div>
                
                <div className="text-right mt-2 text-[10px] text-gray-500">
                  Page 1/1
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
                <span className="text-sm font-medium text-amber-800">À savoir</span>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600">
                  Pour les avoirs, il est important d&apos;inclure le motif et la méthode de remboursement
                  pour une meilleure clarté.
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-500 flex items-center">
              <FiInfo className="h-4 w-4 mr-1 text-amber-500" />
              Cet aperçu est une représentation simplifiée. L&apos;apparence réelle peut varier.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FormattingStep: React.FC<{
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
}> = ({ wizardData, setWizardData }) => {
  // State for tracking active color picker
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  
  // Function to update formatting
  const updateFormatting = (key: string, value: string) => {
    setWizardData({
      ...wizardData,
      formatting: {
        ...wizardData.formatting,
        [key]: value
      }
    });
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FiSettings className="mr-2 text-[#6C5DD3]" />
          <h3 className="text-lg font-semibold text-gray-800">Mise en forme du modèle</h3>
        </div>
        <p className="text-gray-600">
          Personnalisez l&apos;apparence visuelle de votre modèle d&apos;avoir.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Couleurs Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiSettings className="mr-2 text-[#6C5DD3]" />
              Couleurs
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { id: 'frame_color', label: 'Cadre', key: 'primaryColor', color: wizardData.formatting.primaryColor },
                { id: 'label_text_color', label: 'Texte des intitulés', key: 'textColor', color: '#FFFFFF' },
                { id: 'label_bg_color', label: 'Fond des intitulés', key: 'primaryColor', color: wizardData.formatting.primaryColor },
                { id: 'other_text_color', label: 'Autres textes', key: 'textColor', color: '#333333' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <label className="flex items-center w-full">
                    <span className="text-gray-700 flex-grow">{item.label}</span>
                    <div className="flex">
                      <div 
                        className="w-10 h-8 border border-gray-300 rounded-l-lg cursor-pointer flex items-center justify-center"
                        style={{ backgroundColor: item.color }}
                        onClick={() => setActiveColorPicker(activeColorPicker === item.id ? null : item.id)}
                      >
                        {activeColorPicker === item.id && (
                          <div className="absolute mt-10 z-10 bg-white border rounded-lg shadow-lg p-2">
                            <input 
                              type="color" 
                              value={item.color}
                              onChange={(e) => updateFormatting(item.key, e.target.value)}
                              className="w-32 h-32"
                            />
                          </div>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={item.color}
                        onChange={(e) => updateFormatting(item.key, e.target.value)}
                        className="w-24 px-2 py-1 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#6C5DD3]"
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm flex items-start">
              <FiInfo className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                Les couleurs seront appliquées à tous les éléments correspondants dans le document.
                Choisissez des couleurs qui reflètent l&apos;identité visuelle de votre entreprise.
              </p>
            </div>
          </motion.div>
          
          {/* Police des intitulés Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiType className="mr-2 text-[#6C5DD3]" />
              Police des intitulés
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Police</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50"
                  value={wizardData.formatting.font}
                  onChange={(e) => updateFormatting('font', e.target.value)}
                >
                  <option value="Helvetica">Helvetica</option>
                  <option value="Arial">Arial</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Taille</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50"
                  value={wizardData.formatting.fontSize}
                  onChange={(e) => updateFormatting('fontSize', e.target.value)}
                >
                  <option value="small">Petite (9px)</option>
                  <option value="medium">Moyenne (12px)</option>
                  <option value="large">Grande (14px)</option>
                  <option value="xlarge">Très grande (16px)</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-2 items-center">
              <button className="p-2 border rounded-lg bg-[#6C5DD3] text-white" title="Gras">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Italique">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M10 4H16M14 20H4" />
                  <line x1="15" y1="4" x2="9" y2="20" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Souligné">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 7L9 14M15 7L15 14M6 20H18" />
                </svg>
              </button>
            </div>
          </motion.div>
          
          {/* Cadres et entêtes Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiGrid className="mr-2 text-[#6C5DD3]" />
              Cadres et entêtes
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hide_frames"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="hide_frames" className="text-gray-700">Masquer les cadres</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hide_headers"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                />
                <label htmlFor="hide_headers" className="text-gray-700">Masquer les entêtes</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="rounded_corners"
                  className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
                  defaultChecked={true}
                />
                <label htmlFor="rounded_corners" className="text-gray-700">Coins arrondis</label>
              </div>
            </div>
          </motion.div>
          
          {/* Format et orientation du papier */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiFileText className="mr-2 text-[#6C5DD3]" />
              Format et orientation
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Format de papier</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/50"
                  value={wizardData.formatting.paperSize}
                  onChange={(e) => updateFormatting('paperSize', e.target.value)}
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="A5">A5 (148 × 210 mm)</option>
                  <option value="Letter">Lettre (216 × 279 mm)</option>
                  <option value="Legal">Legal (216 × 356 mm)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Orientation</label>
                <div className="flex space-x-3">
                  <label className="flex items-center border rounded-lg p-3 cursor-pointer bg-[#6C5DD3]/5 border-[#6C5DD3]">
                    <input 
                      type="radio" 
                      name="orientation" 
                      value="portrait" 
                      className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] mr-2" 
                      defaultChecked 
                    />
                    <span className="text-gray-700">Portrait</span>
                  </label>
                  
                  <label className="flex items-center border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="orientation" 
                      value="landscape"
                      className="w-4 h-4 text-[#6C5DD3] focus:ring-[#6C5DD3] mr-2" 
                    />
                    <span className="text-gray-700">Paysage</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Fond de page Section */}
          <motion.div 
            className="border rounded-xl p-5 bg-white shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <FiPaperclip className="mr-2 text-[#6C5DD3]" />
              Fond de page
            </h4>
            
            <div className="mb-4">
            <button className="flex items-center px-4 py-2 bg-[#6C5DD3]/10 text-[#6C5DD3] rounded-lg hover:bg-[#6C5DD3]/20 transition">
  <FiUpload className="mr-2" />
  Modifier le fond de page...
</button>

<div className="mt-3 text-sm text-gray-500">
  Aucun fond de page sélectionné
</div>
</div>

<div className="border-t pt-4 mt-4">
  <div className="flex items-center space-x-2">
    <input 
      type="checkbox" 
      id="watermark"
      className="w-4 h-4 text-[#6C5DD3] rounded focus:ring-[#6C5DD3]" 
    />
    <label htmlFor="watermark" className="text-gray-700">Ajouter le filigrane &quot;AVOIR&quot;</label>
  </div>
  
  <p className="text-xs text-gray-500 mt-2 ml-6">
    Un filigrane discret apparaîtra en arrière-plan du document.
  </p>
</div>
</motion.div>
</div>

<motion.div 
  className="md:col-span-1"
  initial={{ opacity: 0, x: 10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, delay: 0.6 }}
>
  <div className="bg-white border rounded-xl p-5 shadow-sm h-fit sticky top-4">
    <div className="font-medium text-gray-700 mb-4 flex items-center">
      <FiEye className="mr-2 text-[#6C5DD3]" />
      Aperçu du style
    </div>
    
    <div className={`bg-white border border-[${wizardData.formatting.primaryColor}] rounded-lg p-3 overflow-hidden shadow-sm mb-4`}>
      {/* Header with selected styles */}
      <div className="flex justify-between mb-3 pb-2 border-b" style={{ borderColor: wizardData.formatting.primaryColor }}>
        <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0"></div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-800">AVOIR</div>
          <div className="text-xs text-gray-600">N° AV-2025-0042</div>
        </div>
      </div>
      
      {/* Table with selected styles */}
      <table className="w-full text-xs mb-3">
        <thead>
          <tr>
            <th className="py-1 px-1 text-white text-left rounded-tl-md" style={{ backgroundColor: wizardData.formatting.primaryColor }}>Description</th>
            <th className="py-1 px-1 text-white text-center" style={{ backgroundColor: wizardData.formatting.primaryColor }}>Qté</th>
            <th className="py-1 px-1 text-white text-right rounded-tr-md" style={{ backgroundColor: wizardData.formatting.primaryColor }}>Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-1 px-1">Prestation de service</td>
            <td className="py-1 px-1 text-center">-1</td>
            <td className="py-1 px-1 text-right">-650,00 €</td>
          </tr>
        </tbody>
      </table>
      
      {/* Total section with selected styles */}
      <div className="flex justify-end mb-2">
        <div className="w-32">
          <div className="flex justify-between text-xs">
            <span>Total HT:</span>
            <span>-650,00 €</span>
          </div>
          <div className="flex justify-between text-xs mt-1 pb-1 border-b border-gray-200">
            <span>TVA 20%:</span>
            <span>-130,00 €</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-1">
            <span>Total TTC:</span>
            <span>-780,00 €</span>
          </div>
        </div>
      </div>
      
      {/* Footer with selected styles */}
      <div className="text-[9px] text-gray-600 border-t pt-2" style={{ borderColor: wizardData.formatting.primaryColor }}>
        <div className="flex justify-between items-end">
          <div>Référence facture: FA-2025-0127</div>
          <div className="text-right">SIRET: 123 456 789 00012</div>
        </div>
      </div>
    </div>
    
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="bg-amber-50 px-4 py-2 border-b border-amber-100">
        <span className="text-sm font-medium text-amber-800">Conseils</span>
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-600">
          Pour plus de lisibilité, utilisez des couleurs contrastées. Les textes clairs sur fond foncé sont plus faciles à lire.
        </p>
      </div>
    </div>
    
    <div className="flex items-start bg-[#6C5DD3]/5 p-3 rounded-lg">
      <div className="flex-shrink-0 mt-0.5">
        <FiCheckCircle className="h-5 w-5 text-[#6C5DD3]" />
      </div>
      <div className="ml-2.5 text-xs text-gray-600">
        <span className="text-sm font-medium text-gray-800 block mb-1">Modèle presque terminé !</span>
        Cliquez sur &quot;Terminer&quot; pour enregistrer votre modèle d&apos;avoir personnalisé.
      </div>
    </div>
  </div>
</motion.div>
</div>
</div>
  )
};
