import React from 'react';
import { WizardFormData } from '../../types';
import { headerStyleOptions } from '../../data';

interface WizardHeaderStepProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

const WizardHeaderStep: React.FC<WizardHeaderStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: choix du style</h3>
      <p className="text-gray-600 mb-6">Choisir dans la liste ci-dessous, le style d&apos;entête du modèle d&apos;impression</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {headerStyleOptions.map((style, index) => (
          <div 
            key={index}
            onClick={() => onUpdate({headerStyle: style.name.toLowerCase()})}
            className={`border rounded-xl p-4 cursor-pointer transition-all
              ${data.headerStyle === style.name.toLowerCase() 
                ? 'border-[#009B72] bg-[#009B72]/5 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-800">{style.name}</h4>
              {data.headerStyle === style.name.toLowerCase() && (
                <div className="w-5 h-5 bg-[#009B72] rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-500 mb-3">{style.desc}</p>
            
            {/* Header style preview */}
            <div className="h-24 bg-white border rounded-lg overflow-hidden shadow-sm">
              {style.name === 'Standard' && (
                <div className="w-full h-full p-2 flex justify-between">
                  <div className="w-16 h-10 bg-[#009B72]/10 rounded flex items-center justify-center text-[#009B72] text-xs font-bold">LOGO</div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">DEVIS</div>
                    <div className="text-xs text-gray-500 mt-1">N° DE-2025-0068</div>
                    <div className="text-xs text-gray-500">Date: 23/03/2025</div>
                  </div>
                </div>
              )}
              
              {style.name === 'Moderne' && (
                <div className="w-full h-full flex flex-col">
                  <div className="h-8 bg-[#009B72]/80 w-full p-2 flex justify-between items-center">
                    <div className="text-xs font-bold text-white">DEVIS N° DE-2025-0068</div>
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
              )}
              
              {style.name === 'Classique' && (
                <div className="w-full h-full p-2 flex flex-col items-center">
                  <div className="w-16 h-8 bg-gray-100 rounded mb-1"></div>
                  <div className="text-center">
                    <div className="text-sm font-bold">DEVIS</div>
                    <div className="text-xs text-gray-500">N° DE-2025-0068 • 23/03/2025</div>
                  </div>
                </div>
              )}
              
              {style.name === 'Minimaliste' && (
                <div className="w-full h-full p-3">
                  <div className="text-sm font-medium">DEVIS #DE-2025-0068</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">23/03/2025</div>
                    <div className="w-10 h-6 bg-gray-100 rounded"></div>
                  </div>
                </div>
              )}
              
              {style.name === 'Élégant' && (
                <div className="w-full h-full border-b-2 border-[#009B72]">
                  <div className="flex justify-between items-center h-full p-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full mr-2"></div>
                      <div>
                        <div className="text-xs font-medium">Votre Entreprise</div>
                        <div className="text-[10px] text-gray-500">Paris, France</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-serif font-medium text-[#009B72]">Devis</div>
                      <div className="text-xs text-gray-600">#DE-2025-0068</div>
                    </div>
                  </div>
                </div>
              )}
              
              {style.name === 'Professionnel' && (
                <div className="w-full h-full flex flex-col">
                  <div className="flex justify-between bg-gray-50 p-2 border-b">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div className="text-xs text-gray-500 text-right">
                      <div>Tél: 01 23 45 67 89</div>
                      <div>contact@entreprise.fr</div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-bold text-gray-800">DEVIS N° DE-2025-0068</div>
                    <div className="text-xs text-gray-500">Émis le 23/03/2025</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardHeaderStep;