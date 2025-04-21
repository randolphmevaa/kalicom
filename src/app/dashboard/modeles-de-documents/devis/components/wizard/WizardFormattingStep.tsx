import React from 'react';
import { WizardFormData } from '../../types';

interface WizardFormattingStepProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

const WizardFormattingStep: React.FC<WizardFormattingStepProps> = ({ data, onUpdate }) => {
  // Helper to update formatting options
  const updateFormatting = (key: string, value: string) => {
    onUpdate({
      formatting: {
        ...data.formatting,
        [key]: value
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Mise en forme du modèle</h3>
      <p className="text-gray-600 mb-6">Paramétrer la mise en forme du modèle (couleurs, police, etc.)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Couleurs Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              Couleurs
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { id: 'primaryColor', label: 'Couleur principale', color: data.formatting.primaryColor },
                { id: 'secondaryColor', label: 'Couleur secondaire', color: data.formatting.secondaryColor },
                { id: 'labelTextColor', label: 'Text des intitulés', color: '#FFFFFF' },
                { id: 'otherTextColor', label: 'Autres textes', color: '#333333' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <label className="flex items-center w-full">
                    <span className="text-gray-700 flex-grow">{item.label}</span>
                    <div className="flex">
                      <input 
                        type="color" 
                        value={item.color}
                        onChange={(e) => updateFormatting(item.id, e.target.value)}
                        className="w-10 h-8 p-1 border border-gray-300 rounded-l-lg"
                      />
                      <input 
                        type="text" 
                        value={item.color}
                        onChange={(e) => updateFormatting(item.id, e.target.value)}
                        className="w-24 px-2 py-1 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-[#009B72]"
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Les couleurs seront appliquées à tous les éléments correspondants dans le document.</span>
              </div>
            </div>
          </div>
          
          {/* Police des intitulés Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Police des intitulés
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B72]/50"
                  value={data.formatting.font}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009B72]/50"
                  value={data.formatting.fontSize}
                  onChange={(e) => updateFormatting('fontSize', e.target.value)}
                >
                  <option value="small">9px</option>
                  <option value="small">10px</option>
                  <option value="small">11px</option>
                  <option value="medium">12px</option>
                  <option value="large">14px</option>
                  <option value="large">16px</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center">
              <button className="p-2 border rounded-lg bg-[#009B72] text-white" title="Gras">
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
          </div>
          
          {/* Cadres et entêtes Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cadres et entêtes
            </h4>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]" 
                />
                <span className="text-gray-700">Masquer les cadres</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]" 
                />
                <span className="text-gray-700">Masquer les entêtes</span>
              </label>
            </div>
          </div>
          
          {/* Fond de page Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Fond de page
            </h4>
            
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Modifier le fond de page...
            </button>
            
            <div className="mt-3 text-sm text-gray-500">
              Aucun fond de page sélectionné
            </div>
          </div>
        </div>
        
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu du style
          </div>
          
          <div className="bg-white border border-[#009B72] rounded-lg p-3 overflow-hidden shadow-sm">
            {/* Header with selected styles */}
            <div className="flex justify-between mb-3 pb-2 border-b border-[#009B72]">
              <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0"></div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">DEVIS</div>
                <div className="text-xs text-gray-600">N° DE-2025-0068</div>
              </div>
            </div>
            
            {/* Table with selected styles */}
            <table className="w-full text-xs mb-3">
              <thead>
                <tr>
                  <th className="py-1 px-1 bg-[#009B72] text-white text-left rounded-tl-md">Description</th>
                  <th className="py-1 px-1 bg-[#009B72] text-white text-center">Qté</th>
                  <th className="py-1 px-1 bg-[#009B72] text-white text-right rounded-tr-md">Prix</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1 px-1">Prestation de service</td>
                  <td className="py-1 px-1 text-center">1</td>
                  <td className="py-1 px-1 text-right">1.200,00 €</td>
                </tr>
              </tbody>
            </table>
            
            {/* Total section with selected styles */}
            <div className="flex justify-end mb-2">
              <div className="w-32">
                <div className="flex justify-between text-xs">
                  <span>Total HT:</span>
                  <span>1.200,00 €</span>
                </div>
                <div className="flex justify-between text-xs mt-1 pb-1 border-b border-gray-200">
                  <span>TVA 20%:</span>
                  <span>240,00 €</span>
                </div>
                <div className="flex justify-between text-xs font-bold mt-1">
                  <span>Total TTC:</span>
                  <span>1.440,00 €</span>
                </div>
              </div>
            </div>
            
            {/* Footer with selected styles */}
            <div className="text-[9px] text-gray-600 border-t border-[#009B72] pt-2">
              <div className="flex justify-between items-end">
                <div>Coordonnées bancaires</div>
                <div className="text-right">SIRET: 123 456 789 00012</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Cet aperçu reflète les couleurs et styles sélectionnés
            </div>
            <div className="mt-2 text-center">
              <button className="text-[#009B72] text-xs hover:underline">
                Voir l&apos;aperçu complet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardFormattingStep;