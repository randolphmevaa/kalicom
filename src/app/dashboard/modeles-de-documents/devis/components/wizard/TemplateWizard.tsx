import React, { useState, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { initialWizardData, TOTAL_WIZARD_STEPS } from '../../data';
import { WizardFormData } from '../../types';

// Lazy‑loaded icons
const FiArrowLeft = lazy(() =>
    import('react-icons/fi').then((m) => ({ default: m.FiArrowLeft }))
  );
  const FiCheck = lazy(() =>
    import('react-icons/fi').then((m) => ({ default: m.FiCheck }))
  );
  
  // Lazy‑loaded step components
  const WizardHeaderStep = lazy(() => import('./WizardHeader'));
  const WizardHeaderDataStep = lazy(() => import('./WizardHeaderDataStep'));
  const WizardBodyDataStep = lazy(() => import('./WizardBodyDataStep'));
  const WizardFooterDataStep = lazy(() => import('./WizardFooterDataStep'));
  const WizardFormattingStep = lazy(() => import('./WizardFormattingStep'));

interface TemplateWizardProps {
  onClose: () => void;
  onComplete: (message: string) => void;
}

const TemplateWizard: React.FC<TemplateWizardProps> = ({ onClose, onComplete }) => {
  // State for wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardFormData>(initialWizardData);
  
  // Update wizard data
  const updateWizardData = (data: Partial<WizardFormData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  // Navigate between steps
  const goToNextStep = () => {
    if (wizardStep < TOTAL_WIZARD_STEPS) {
      setWizardStep(wizardStep + 1);
    } else {
      // On the last step, finalize creation
      finishTemplateCreation();
    }
  };
  
  const goToPreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };
  
  // Save template and close wizard
  const finishTemplateCreation = () => {
    // In a real app, this would send the data to your backend
    console.log('Creating template with data:', wizardData);
    onComplete('Modèle créé avec succès');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-[95vw] h-[90vh] max-w-6xl flex flex-col"
      >
        {/* Wizard Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg mr-3 text-gray-500"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">Nouveau modèle de devis</h2>
          </div>
          
          <div className="text-sm text-gray-500">
            Étape {wizardStep} sur {TOTAL_WIZARD_STEPS}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="relative">
            {/* Bar background */}
            <div className="h-2 bg-gray-200 rounded-full">
              {/* Progress fill */}
              <motion.div 
                className="absolute top-0 left-0 h-2 bg-[#009B72] rounded-full"
                initial={{ width: `${((wizardStep-1) / TOTAL_WIZARD_STEPS) * 100}%` }}
                animate={{ width: `${(wizardStep / TOTAL_WIZARD_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Step indicators */}
            <div className="flex justify-between mt-2">
              {Array.from({ length: TOTAL_WIZARD_STEPS }).map((_, index) => (
                <div key={index} className="flex flex-col items-center mt-1">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1
                      ${index + 1 < wizardStep 
                        ? 'bg-[#009B72] text-white' 
                        : index + 1 === wizardStep 
                          ? 'bg-white border-2 border-[#009B72] text-[#009B72]' 
                          : 'bg-white border border-gray-300 text-gray-400'
                      }`}
                  >
                    {index + 1 < wizardStep ? '✓' : index + 1}
                  </div>
                  <span className={`text-xs whitespace-nowrap ${
                    index + 1 === wizardStep ? 'text-[#009B72] font-medium' : 'text-gray-500'
                  }`}>
                    {index === 0 && "Entête: style"}
                    {index === 1 && "Entête: données"}
                    {index === 2 && "Corps: données"}
                    {index === 3 && "Pied: données"}
                    {index === 4 && "Mise en forme"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wizard Content */}
        <div className="flex-grow p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={wizardStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* Step 1: Header Style */}
              {wizardStep === 1 && (
                <WizardHeaderStep
                  data={wizardData}
                  onUpdate={updateWizardData}
                />
              )}
              
              {/* Step 2: Header Data */}
              {wizardStep === 2 && (
                <WizardHeaderDataStep
                  data={wizardData}
                  onUpdate={updateWizardData}
                />
              )}
              
              {/* Step 3: Body Data */}
              {wizardStep === 3 && (
                <WizardBodyDataStep
                  data={wizardData}
                  onUpdate={updateWizardData}
                />
              )}
              
              {/* Step 4: Footer Data */}
              {wizardStep === 4 && (
                <WizardFooterDataStep
                  data={wizardData}
                  onUpdate={updateWizardData}
                />
              )}
              
              {/* Step 5: Template Formatting */}
              {wizardStep === 5 && (
                <WizardFormattingStep
                  data={wizardData}
                  onUpdate={updateWizardData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Wizard Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <div>
            {wizardStep > 1 && (
              <button
                onClick={goToPreviousStep}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Précédent
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            
            <button
              onClick={goToNextStep}
              className="px-6 py-2 bg-[#009B72] text-white rounded-lg hover:bg-[#008A65] transition flex items-center shadow-sm"
            >
              {wizardStep === TOTAL_WIZARD_STEPS ? (
                <>
                  <FiCheck className="mr-2" />
                  Terminer
                </>
              ) : (
                <>
                  Suivant
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateWizard;

// Create stub components for each step (in a real project, these would be separate files)
// const WizardHeaderStep = ({ data, onUpdate }) => (
//   <div className="h-full flex flex-col">
//     <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: choix du style</h3>
//     <p className="text-gray-600 mb-6">Choisir dans la liste ci-dessous, le style d&apos;entête du modèle d&apos;impression</p>
    
//     {/* Placeholder content - in a real app this would be a full component */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//       {/* Header style options would go here */}
//       <div className="border rounded-xl p-4 cursor-pointer bg-[#009B72]/5 border-[#009B72] shadow-md">
//         <div className="flex justify-between items-start mb-2">
//           <h4 className="font-medium text-gray-800">Standard</h4>
//           <div className="w-5 h-5 bg-[#009B72] rounded-full flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//         </div>
//         <p className="text-xs text-gray-500 mb-3">Logo à gauche, informations à droite</p>
//         {/* Preview placeholder */}
//         <div className="h-24 bg-white border rounded-lg overflow-hidden shadow-sm"></div>
//       </div>
//     </div>
//   </div>
// );

// // Stub components for other wizard steps
// const WizardHeaderDataStep = ({ data, onUpdate }) => (
//   <div className="h-full flex flex-col">
//     <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: données</h3>
//     <p className="text-gray-600 mb-6">Choisir les données affichées en entête de document</p>
//     {/* Placeholder content */}
//     <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
//       Configuration des données d&apos;entête (implémentation complète dans un projet réel)
//     </div>
//   </div>
// );

// // const WizardBodyDataStep = ({ data, onUpdate }) => (
// //   <div className="h-full flex flex-col">
// //     <h3 className="text-lg font-semibold text-gray-800 mb-2">Corps du document: données</h3>
// //     <p className="text-gray-600 mb-6">Choisir les données affichées dans le corps du document</p>
// //     {/* Placeholder content */}
// //     <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
// //       Configuration des données du corps (implémentation complète dans un projet réel)
// //     </div>
// //   </div>
// // );

// const WizardFooterDataStep = ({ data, onUpdate }) => (
//   <div className="h-full flex flex-col">
//     <h3 className="text-lg font-semibold text-gray-800 mb-2">Pied du document: données</h3>
//     <p className="text-gray-600 mb-6">Choisir les données affichées dans le pied du document</p>
//     {/* Placeholder content */}
//     <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
//       Configuration des données de pied de page (implémentation complète dans un projet réel)
//     </div>
//   </div>
// );

// const WizardFormattingStep = ({ data, onUpdate }) => (
//   <div className="h-full flex flex-col">
//     <h3 className="text-lg font-semibold text-gray-800 mb-2">Mise en forme du modèle</h3>
//     <p className="text-gray-600 mb-6">Paramétrer la mise en forme du modèle (couleurs, police, etc.)</p>
//     {/* Placeholder content */}
//     <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
//       Configuration de la mise en forme (implémentation complète dans un projet réel)
//     </div>
//   </div>
// );