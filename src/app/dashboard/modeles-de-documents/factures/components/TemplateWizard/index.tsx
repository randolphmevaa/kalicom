import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { TemplateWizardProps, WizardFormData } from '../../types';

// Import wizard steps
import Step1HeaderStyle from './Step1HeaderStyle';
import Step2HeaderData from './Step2HeaderData';
import Step3BodyData from './Step3BodyData';
import Step4FooterData from './Step4FooterData';
import Step5Formatting from './Step5Formatting';
import ProgressBar from './ProgressBar';

const TemplateWizard = ({ onClose, onComplete, initialData }: TemplateWizardProps) => {
  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const totalSteps = 5;
  
  // Create a default data object
const defaultData: WizardFormData = {
    headerStyle: 'standard',
    headerElements: ['logo', 'company', 'invoiceNumber', 'invoiceDate'],
    bodyElements: ['clientInfo', 'items', 'subtotal', 'taxes', 'total'],
    footerElements: ['paymentTerms', 'contact', 'legalInfo'],
    formatting: {
      primaryColor: '#004AC8',
      secondaryColor: '#f3f4f6',
      font: 'Helvetica',
      fontSize: 'medium',
      paperSize: 'A4'
    },
    templateName: 'Nouveau modèle de facture'
  };
  
  // Use spread operator to merge initialData with defaultData
  const [wizardData, setWizardData] = useState<WizardFormData>(
    initialData ? { ...defaultData, ...initialData } : defaultData
  );
  
  // Update wizard data
  const updateWizardData = (data: Partial<WizardFormData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };
  
  // Go to next step
  const goToNextStep = () => {
    if (wizardStep < totalSteps) {
      setWizardStep(wizardStep + 1);
    } else {
      // On the last step, finalize creation
      onComplete(wizardData);
    }
  };
  
  // Go to previous step
  const goToPreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
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
            <h2 className="text-xl font-bold text-gray-800">Nouveau modèle de facture</h2>
          </div>
          
          <div className="text-sm text-gray-500">
            Étape {wizardStep} sur {totalSteps}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <ProgressBar currentStep={wizardStep} totalSteps={totalSteps} />
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
                <Step1HeaderStyle 
                  wizardData={wizardData} 
                  updateWizardData={updateWizardData} 
                />
              )}
              
              {/* Step 2: Header Data */}
              {wizardStep === 2 && (
                <Step2HeaderData 
                  wizardData={wizardData} 
                  updateWizardData={updateWizardData} 
                />
              )}
              
              {/* Step 3: Body Data */}
              {wizardStep === 3 && (
                <Step3BodyData 
                  wizardData={wizardData} 
                  updateWizardData={updateWizardData} 
                />
              )}
              
              {/* Step 4: Footer Data */}
              {wizardStep === 4 && (
                <Step4FooterData 
                  wizardData={wizardData} 
                  updateWizardData={updateWizardData} 
                />
              )}
              
              {/* Step 5: Template Formatting */}
              {wizardStep === 5 && (
                <Step5Formatting 
                  wizardData={wizardData} 
                  updateWizardData={updateWizardData} 
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
              className="px-6 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003AA0] transition flex items-center shadow-sm"
            >
              {wizardStep === totalSteps ? (
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