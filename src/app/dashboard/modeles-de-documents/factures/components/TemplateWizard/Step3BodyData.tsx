import { WizardStepProps } from '../../types';

const Step3BodyData = ({ wizardData, updateWizardData }: WizardStepProps) => {
  const handleBodyElementChange = (element: string, checked: boolean) => {
    const updatedElements = checked
      ? [...wizardData.bodyElements, element]
      : wizardData.bodyElements.filter(e => e !== element);
    
    updateWizardData({ bodyElements: updatedElements });
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Corps du document: données</h3>
      <p className="text-gray-600 mb-6">Choisir les données affichées dans le corps du document</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Colonnes Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Colonnes
            </h4>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {[
                'Code article', 'Description', 'Montant HT prévu', 'Unité (Libellé)', 
                'Unité (Code)', 'Quantité', 'P.U. TTC', 'P.U. HT', '% Rem', 
                'Montant TTC', 'Montant HT', 'TVA'
              ].map((column, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <label className="flex items-center space-x-3 cursor-pointer flex-grow">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                      checked={wizardData.bodyElements.includes(column.toLowerCase().replace(/\s+/g, '_'))}
                      onChange={(e) => handleBodyElementChange(column.toLowerCase().replace(/\s+/g, '_'), e.target.checked)}
                    />
                    <span className="text-gray-700">{column}</span>
                  </label>
                  
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la gauche">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Déplacer vers la droite">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center space-x-4">
                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Largeur</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      min="1"
                      className="w-20 px-3 py-1.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8]/50"
                      defaultValue="100"
                    />
                    <span className="inline-flex items-center px-3 py-1.5 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                      px
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alignement</label>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button className="p-1.5 bg-[#004AC8] text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
                      </svg>
                    </button>
                    <button className="p-1.5 border-l border-r border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M9 12h6M11 18h2" />
                      </svg>
                    </button>
                    <button className="p-1.5 bg-white text-gray-700 hover:bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M14 18h6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Police Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Police
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8]/50"
                  value={wizardData.formatting.font}
                  onChange={(e) => updateWizardData({ 
                    formatting: { ...wizardData.formatting, font: e.target.value } 
                  })}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8]/50"
                  value={wizardData.formatting.fontSize}
                  onChange={(e) => updateWizardData({ 
                    formatting: { ...wizardData.formatting, fontSize: e.target.value } 
                  })}
                >
                  <option value="small">9px</option>
                  <option value="small-medium">10px</option>
                  <option value="medium-small">11px</option>
                  <option value="medium">12px</option>
                  <option value="medium-large">14px</option>
                  <option value="large">16px</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center">
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Gras">
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
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Couleur">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Service à la personne checkbox */}
          <div className="border rounded-xl p-4 bg-white">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                checked={wizardData.bodyElements.includes('service_personne')}
                onChange={(e) => handleBodyElementChange('service_personne', e.target.checked)}
              />
              <span className="text-gray-700 font-medium">Intervenants Service à la personne</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">Affiche des informations spécifiques pour les services à la personne</p>
          </div>
        </div>
        
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu du corps
          </div>
          
          <div className="bg-white border rounded-lg p-3 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-1 text-xs text-gray-600">Code</th>
                  <th className="py-2 px-1 text-xs text-gray-600">Description</th>
                  <th className="py-2 px-1 text-xs text-gray-600 text-center">Qté</th>
                  <th className="py-2 px-1 text-xs text-gray-600 text-right">P.U. HT</th>
                  <th className="py-2 px-1 text-xs text-gray-600 text-right">Total HT</th>
                  <th className="py-2 px-1 text-xs text-gray-600 text-right">TVA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-1 px-1 text-xs">SRV-001</td>
                  <td className="py-1 px-1 text-xs">Service de consultation</td>
                  <td className="py-1 px-1 text-xs text-center">2</td>
                  <td className="py-1 px-1 text-xs text-right">450,00 €</td>
                  <td className="py-1 px-1 text-xs text-right">900,00 €</td>
                  <td className="py-1 px-1 text-xs text-right">20%</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 text-xs">DEV-101</td>
                  <td className="py-1 px-1 text-xs">Développement web</td>
                  <td className="py-1 px-1 text-xs text-center">1</td>
                  <td className="py-1 px-1 text-xs text-right">1.200,00 €</td>
                  <td className="py-1 px-1 text-xs text-right">1.200,00 €</td>
                  <td className="py-1 px-1 text-xs text-right">20%</td>
                </tr>
              </tbody>
            </table>
            
            <div className="flex justify-end mt-3">
              <div className="w-40 text-xs">
                <div className="flex justify-between py-1">
                  <span>Sous-total</span>
                  <span>2.100,00 €</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>TVA (20%)</span>
                  <span>420,00 €</span>
                </div>
                <div className="flex justify-between py-1 font-medium">
                  <span>Total TTC</span>
                  <span>2.520,00 €</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Cet aperçu représente la mise en page des colonnes sélectionnées
            </div>
            <div className="mt-2 text-center">
              <button className="text-[#004AC8] text-xs hover:underline">
                Voir l&apos;aperçu complet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3BodyData;