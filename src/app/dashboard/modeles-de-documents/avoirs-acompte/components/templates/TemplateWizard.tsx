// File: components/templates/TemplateWizard.tsx
import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import WizardHeader from './WizardHeader';
import WizardProgressBar from './WizardProgressBar';
import LoadingSpinner from './ui/LoadingSpinner';
import { WizardData } from '../../types/templates';

// Lazy-loaded step components
const HeaderStyleStep = lazy(() => import('./steps/HeaderStyleStep'));
const HeaderDataStep = lazy(() => import('./steps/HeaderDataStep'));
const InvoiceReferenceStep = lazy(() => import('./steps/InvoiceReferenceStep'));
const BodyFooterStep = lazy(() => import('./steps/BodyFooterStep'));
const FormattingStep = lazy(() => import('./steps/FormattingStep'));

interface TemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: WizardData;
  onComplete: (data: WizardData) => void;
}

export default function TemplateWizard({
  isOpen,
  onClose,
  initialData,
  onComplete
}: TemplateWizardProps) {
  // State for wizard steps
  const [wizardStep, setWizardStep] = useState(1);
  const totalSteps = 5;
  
  // Wizard form data
  const [wizardData, setWizardData] = useState<WizardData>(initialData);
  
  // Go to next step in wizard
  const goToNextStep = () => {
    if (wizardStep < totalSteps) {
      setWizardStep(wizardStep + 1);
    } else {
      // On the last step, finalize creation
      onComplete(wizardData);
    }
  };
  
  // Go to previous step in wizard
  const goToPreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  // Helper function to update credit options
  const updateCreditOptions = (updates: Partial<typeof wizardData.creditOptions>) => {
    setWizardData({
      ...wizardData,
      creditOptions: {
        ...wizardData.creditOptions,
        ...updates
      }
    });
  };

  if (!isOpen) return null;

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
        <WizardHeader 
          onClose={onClose}
          currentStep={wizardStep}
          totalSteps={totalSteps}
        />
        
        {/* Progress Bar */}
        <WizardProgressBar
          currentStep={wizardStep}
          totalSteps={totalSteps}
        />
        
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
              <Suspense fallback={<LoadingSpinner />}>
                {wizardStep === 1 && (
                  <HeaderStyleStep 
                    wizardData={wizardData} 
                    setWizardData={setWizardData} 
                  />
                )}
                
                {wizardStep === 2 && (
                  <HeaderDataStep 
                    wizardData={wizardData} 
                    setWizardData={setWizardData} 
                  />
                )}
                
                {wizardStep === 3 && (
                  <InvoiceReferenceStep 
                    wizardData={wizardData} 
                    updateCreditOptions={updateCreditOptions} 
                  />
                )}
                
                {wizardStep === 4 && (
                  <BodyFooterStep 
                    wizardData={wizardData} 
                    setWizardData={setWizardData} 
                  />
                )}
                
                {wizardStep === 5 && (
                  <FormattingStep 
                    wizardData={wizardData} 
                    setWizardData={setWizardData} 
                  />
                )}
              </Suspense>
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
              className="px-6 py-2 bg-[#E05D5D] text-white rounded-lg hover:bg-[#D04D4D] transition flex items-center shadow-sm"
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
}