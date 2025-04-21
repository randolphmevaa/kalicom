// File: components/templates/steps/BodyFooterStep.tsx
import { memo } from 'react';
import { WizardData } from '../../../types/templates';
import { COLUMN_OPTIONS, AMOUNT_OPTIONS, FOOTER_ELEMENTS } from '../../../constants/wizardConstants';
import Checkbox from '../ui/Checkbox';

interface BodyFooterStepProps {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

function BodyFooterStep({ wizardData, setWizardData }: BodyFooterStepProps) {
  // Helper function to update body elements
  const updateBodyElements = (elementId: string, checked: boolean) => {
    const updatedElements = checked 
      ? [...wizardData.bodyElements, elementId]
      : wizardData.bodyElements.filter(el => el !== elementId);
    
    setWizardData({...wizardData, bodyElements: updatedElements});
  };

  // Helper function to update footer elements
  const updateFooterElements = (elementId: string, checked: boolean) => {
    const updatedElements = checked 
      ? [...wizardData.footerElements, elementId]
      : wizardData.footerElements.filter(el => el !== elementId);
    
    setWizardData({...wizardData, footerElements: updatedElements});
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Corps et pied du document</h3>
      <p className="text-gray-600 mb-6">Choisir les éléments à afficher dans le corps et le pied de l&apos;avoir d&apos;acompte</p>
      
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
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {COLUMN_OPTIONS.map((column, index) => {
                const columnId = column.toLowerCase().replace(/\s+/g, '_');
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      label={column}
                      checked={wizardData.bodyElements.includes(columnId)}
                      onChange={(checked) => updateBodyElements(columnId, checked)} 
                      className="flex-grow"
                    />
                    
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
                );
              })}
            </div>
          </div>
          
          {/* Montant Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Montant
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {AMOUNT_OPTIONS.map((item, index) => {
                const itemId = item.toLowerCase().replace(/[\s']/g, '_');
                return (
                  <Checkbox 
                    key={index}
                    label={item} 
                    checked={wizardData.bodyElements.includes(itemId)}
                    onChange={(checked) => updateBodyElements(itemId, checked)}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Récap. TVA Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              Récap. TVA et mentions légales
            </h4>
            
            <div className="space-x-4 flex items-center mb-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="recap_tva" 
                  value="always" 
                  defaultChecked
                  className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                />
                <span className="text-gray-700">Toujours</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="recap_tva" 
                  value="multiple_rates" 
                  className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                />
                <span className="text-gray-700">Seulement si plus d&apos;un taux</span>
              </label>
            </div>
            
            <div className="space-y-3">
              {FOOTER_ELEMENTS.map((item) => (
                <Checkbox 
                  key={item.id}
                  label={item.label} 
                  checked={wizardData.footerElements.includes(item.id)}
                  onChange={(checked) => updateFooterElements(item.id, checked)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu du document
          </div>
          
          <div className="bg-white border rounded-lg p-4 overflow-y-auto shadow-sm h-96">
            {/* Table preview */}
            <table className="w-full text-xs mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-1 text-gray-600">Description</th>
                  <th className="py-2 px-1 text-center text-gray-600">Qté</th>
                  <th className="py-2 px-1 text-right text-gray-600">P.U. HT</th>
                  <th className="py-2 px-1 text-right text-gray-600">Total HT</th>
                  <th className="py-2 px-1 text-right text-gray-600">TVA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-1 px-1">Acompte sur développement site web</td>
                  <td className="py-1 px-1 text-center">1</td>
                  <td className="py-1 px-1 text-right">-750,00 €</td>
                  <td className="py-1 px-1 text-right">-750,00 €</td>
                  <td className="py-1 px-1 text-right">20%</td>
                </tr>
              </tbody>
            </table>
            
            {/* Reference to original invoice */}
            <div className="p-2 bg-gray-50 rounded-lg mb-4 text-xs">
              <div className="font-medium text-gray-700">Facture d&apos;acompte d&apos;origine</div>
              <div className="flex justify-between">
                <span className="text-gray-600">Référence:</span>
                <span className="text-gray-700">FA-2025-A0042 du 10/03/2025</span>
              </div>
            </div>
            
            {/* Totals */}
            <div className="border-t pt-2 mb-4">
              <div className="flex justify-end">
                <table className="text-xs w-48">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600">Total HT</td>
                      <td className="py-1 text-right">-750,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">TVA (20%)</td>
                      <td className="py-1 text-right">-150,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600 font-medium">Total TTC</td>
                      <td className="py-1 text-right font-medium">-900,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Credit Amount (highlighted) */}
            <div className="bg-[#E05D5D]/5 border border-[#E05D5D]/20 rounded-lg p-3 mb-4">
              <div className="text-xs font-medium text-[#E05D5D] mb-1">MONTANT À REMBOURSER</div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Remboursement par virement bancaire
                </div>
                <div className="text-lg font-bold text-[#E05D5D]">
                  900,00 €
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <div className="border-t pt-3 text-xs">
              <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires pour remboursement</div>
              <div className="text-gray-600">
                <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                <div>BIC: BNPAFRPPXXX</div>
              </div>
              
              <div className="mt-2 text-xs text-gray-600">
                <div className="font-medium mb-1">Motif de l&apos;avoir</div>
                <div>Annulation de commande suite à la demande du client le 20/03/2025</div>
              </div>
              
              <div className="mt-3 text-center text-[10px] text-gray-500">
                <div>Ce document est un avoir d&apos;acompte en référence à la facture FA-2025-A0042 du 10/03/2025.</div>
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

export default memo(BodyFooterStep);