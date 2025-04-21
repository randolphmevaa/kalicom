// File: components/templates/WizardHeader.jsx
import { FiArrowLeft } from 'react-icons/fi';
import { memo } from 'react';

interface WizardHeaderProps {
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
}

function WizardHeader({ onClose, currentStep, totalSteps }: WizardHeaderProps) {
  return (
    <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg mr-3 text-gray-500"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Nouveau modèle d&apos;avoir d&apos;acompte</h2>
      </div>
      
      <div className="text-sm text-gray-500">
        Étape {currentStep} sur {totalSteps}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(WizardHeader);