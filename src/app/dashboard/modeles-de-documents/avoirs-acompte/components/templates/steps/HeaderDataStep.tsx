// File: components/templates/steps/HeaderDataStep.tsx
import { memo } from 'react';
import { WizardData } from '../../../types/templates';
import { HEADER_ELEMENTS } from '../../../constants/wizardConstants';
import Checkbox from '../ui/Checkbox';

interface HeaderDataStepProps {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

function HeaderDataStep({ wizardData, setWizardData }: HeaderDataStepProps) {
  const updateHeaderElements = (elementId: string, checked: boolean) => {
    const updatedElements = checked 
      ? [...wizardData.headerElements, elementId]
      : wizardData.headerElements.filter(el => el !== elementId);
    
    setWizardData({...wizardData, headerElements: updatedElements});
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Entête du document: données</h3>
      <p className="text-gray-600 mb-6">Choisir les données affichées en entête de document</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          {/* Logo Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Logo
            </h4>
            <div className="space-y-3">
              <Checkbox 
                label="Afficher" 
                checked={wizardData.headerElements.includes('logo')}
                onChange={(checked) => updateHeaderElements('logo', checked)}
              />
              
              <div className="flex items-center">
                <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Modifier le logo...
                </button>
                <span className="text-xs text-gray-500 ml-3">Aucun logo sélectionné</span>
              </div>
              
              <Checkbox 
                label="Ajuster la taille de l'image" 
                checked={wizardData.headerElements.includes('adjust_logo_size')}
                onChange={(checked) => updateHeaderElements('adjust_logo_size', checked)}
              />
            </div>
          </div>
          
          {/* Coordonnées de la société Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Coordonnées de la société
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {HEADER_ELEMENTS.company.map(item => (
                <Checkbox 
                  key={item.id}
                  label={item.label} 
                  checked={wizardData.headerElements.includes(item.id)}
                  onChange={(checked) => updateHeaderElements(item.id, checked)}
                />
              ))}
            </div>
            
            <Checkbox 
              className="border-t pt-3"
              label="Masquer les coordonnées de la société" 
              checked={wizardData.headerElements.includes('hide_company_info')}
              onChange={(checked) => updateHeaderElements('hide_company_info', checked)}
            />
          </div>
          
          {/* Coordonnées du client Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Coordonnées du client
            </h4>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {HEADER_ELEMENTS.client.map(item => (
                <Checkbox 
                  key={item.id}
                  label={item.label} 
                  checked={wizardData.headerElements.includes(item.id)}
                  onChange={(checked) => updateHeaderElements(item.id, checked)}
                />
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              {HEADER_ELEMENTS.additional.map(item => (
                <Checkbox 
                  key={item.id}
                  label={item.label} 
                  checked={wizardData.headerElements.includes(item.id)}
                  onChange={(checked) => updateHeaderElements(item.id, checked)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="md:col-span-2 border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu de l&apos;entête
          </div>
          
          <div className="bg-white border rounded-lg p-4 h-64 shadow-sm">
            <div className="flex justify-between mb-3">
              <div className="w-24 h-12 bg-[#E05D5D]/20 rounded-lg flex items-center justify-center text-[#E05D5D] font-bold">LOGO</div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
                <div className="text-sm text-gray-600">N° AV-2025-A0042</div>
                <div className="text-sm text-gray-600">Date: 23/03/2025</div>
                <div className="text-sm text-gray-600">Réf. facture: FA-2025-A0042</div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
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
                <div>Tél: 04 78 12 34 56</div>
                <div>Email: contact@client.fr</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Les éléments affichés dépendent des options sélectionnées
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HeaderDataStep);