import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const stepTitles = [
    "Entête: style",
    "Entête: données",
    "Corps: données",
    "Pied: données",
    "Mise en forme"
  ];
  
  return (
    <div className="relative">
      {/* Bar background */}
      <div className="h-2 bg-gray-200 rounded-full">
        {/* Progress fill */}
        <motion.div 
          className="absolute top-0 left-0 h-2 bg-[#004AC8] rounded-full"
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
                  ? 'bg-[#004AC8] text-white' 
                  : index + 1 === currentStep 
                    ? 'bg-white border-2 border-[#004AC8] text-[#004AC8]' 
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${
              index + 1 === currentStep ? 'text-[#004AC8] font-medium' : 'text-gray-500'
            }`}>
              {stepTitles[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;