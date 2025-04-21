// File: components/templates/steps/HeaderStyleStep.tsx
import { memo } from 'react';
import { WizardData } from '../../../types/templates';
import { HEADER_STYLES } from '../../../constants/wizardConstants';

interface HeaderStyleStepProps {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

function HeaderStyleStep({ wizardData, setWizardData }: HeaderStyleStepProps) {
  // Render header style preview based on style name
  const renderHeaderPreview = (styleName: string) => {
    switch(styleName) {
      case 'Standard':
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <div className="w-16 h-10 bg-[#E05D5D]/10 rounded flex items-center justify-center text-[#E05D5D] text-xs font-bold">LOGO</div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
              <div className="text-xs text-gray-500 mt-1">N° AV-2025-A0042</div>
              <div className="text-xs text-gray-500">Date: 23/03/2025</div>
            </div>
          </div>
        );
      case 'Moderne':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="h-8 bg-[#E05D5D]/80 w-full p-2 flex justify-between items-center">
              <div className="text-xs font-bold text-white">AVOIR D&apos;ACOMPTE N° AV-2025-A0042</div>
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
        );
      case 'Classique':
        return (
          <div className="w-full h-full p-2 flex flex-col items-center">
            <div className="w-16 h-8 bg-gray-100 rounded mb-1"></div>
            <div className="text-center">
              <div className="text-sm font-bold">AVOIR D&apos;ACOMPTE</div>
              <div className="text-xs text-gray-500">N° AV-2025-A0042 • 23/03/2025</div>
            </div>
          </div>
        );
      case 'Minimaliste':
        return (
          <div className="w-full h-full p-3">
            <div className="text-sm font-medium">AVOIR #AV-2025-A0042</div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">23/03/2025</div>
              <div className="w-10 h-6 bg-gray-100 rounded"></div>
            </div>
          </div>
        );
      case 'Élégant':
        return (
          <div className="w-full h-full border-b-2 border-[#E05D5D]">
            <div className="flex justify-between items-center h-full p-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full mr-2"></div>
                <div>
                  <div className="text-xs font-medium">Votre Entreprise</div>
                  <div className="text-[10px] text-gray-500">Paris, France</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-serif font-medium text-[#E05D5D]">Avoir</div>
                <div className="text-xs text-gray-600">#AV-2025-A0042</div>
              </div>
            </div>
          </div>
        );
      case 'Professionnel':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="flex justify-between bg-gray-50 p-2 border-b">
              <div className="w-12 h-8 bg-gray-200 rounded"></div>
              <div className="text-xs text-gray-500 text-right">
                <div>Tél: 01 23 45 67 89</div>
                <div>contact@entreprise.fr</div>
              </div>
            </div>
            <div className="p-2">
              <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE N° AV-2025-A0042</div>
              <div className="text-xs text-gray-500">Émis le 23/03/2025</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: choix du style</h3>
      <p className="text-gray-600 mb-6">Choisir dans la liste ci-dessous, le style d&apos;entête du modèle d&apos;impression</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {HEADER_STYLES.map((style, index) => (
          <div 
            key={index}
            onClick={() => setWizardData({...wizardData, headerStyle: style.name.toLowerCase()})}
            className={`border rounded-xl p-4 cursor-pointer transition-all
              ${wizardData.headerStyle === style.name.toLowerCase() 
                ? 'border-[#E05D5D] bg-[#E05D5D]/5 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{style.name}</h4>
              {wizardData.headerStyle === style.name.toLowerCase() && (
                <div className="w-5 h-5 bg-[#E05D5D] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-3">{style.desc}</p>
            
            {/* Header style preview */}
            <div className="h-24 bg-white border rounded-lg overflow-hidden shadow-sm">
              {renderHeaderPreview(style.name)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(HeaderStyleStep);