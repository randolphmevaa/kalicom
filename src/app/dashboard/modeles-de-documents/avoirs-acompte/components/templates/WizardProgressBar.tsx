// File: components/templates/WizardProgressBar.jsx
import { motion } from 'framer-motion';
import { memo } from 'react';

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function WizardProgressBar({ currentStep, totalSteps }: WizardProgressBarProps) {
  // Step labels - could be moved to a constant or prop if needed
  const stepLabels = [
    "Entête: style",
    "Entête: données",
    "Facture de référence",
    "Corps & Pied",
    "Mise en forme"
  ];
  
  return (
    <div className="px-6 py-4 bg-gray-50 border-b">
      <div className="relative">
        {/* Bar background */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Progress fill */}
          <motion.div 
            className="absolute top-0 left-0 h-2 bg-[#E05D5D] rounded-full"
            initial={{ width: `${((currentStep-1) / totalSteps) * 100}%` }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex flex-col items-center mt-1">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1
                  ${index + 1 < currentStep 
                    ? 'bg-[#E05D5D] text-white' 
                    : index + 1 === currentStep 
                      ? 'bg-white border-2 border-[#E05D5D] text-[#E05D5D]' 
                      : 'bg-white border border-gray-300 text-gray-400'
                  }`}
              >
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${
                index + 1 === currentStep ? 'text-[#E05D5D] font-medium' : 'text-gray-500'
              }`}>
                {stepLabels[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WizardProgressBar);