import { WizardStepProps } from '../../types';
import { useState } from 'react';

const Step4FooterData = ({ wizardData, updateWizardData }: WizardStepProps) => {
  const [recapTvaMode, setRecapTvaMode] = useState('always');
  
  const handleFooterElementChange = (element: string, checked: boolean) => {
    const updatedElements = checked
      ? [...wizardData.footerElements, element]
      : wizardData.footerElements.filter(e => e !== element);
    
    updateWizardData({ footerElements: updatedElements });
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Pied du document: données</h3>
      <p className="text-gray-600 mb-6">Choisir les données affichées dans le pied du document</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
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
              {[
                'Total HT', 'Remise', 'Total HT remisé', 'Port HT', 
                'Total HT Net', 'Total TVA', 'Total TTC', 'Acomptes', 
                'Ecart TTC', 'Solde TVA', 'Solde dû'
              ].map((item, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                    defaultChecked={['Total HT', 'Total TVA', 'Total TTC', 'Solde dû'].includes(item)}
                    onChange={(e) => handleFooterElementChange(item.toLowerCase().replace(/\s+/g, '_'), e.target.checked)}
                  />
                  <span className="text-gray-700">{item}</span>
                </label>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                  checked={wizardData.footerElements.includes('echeances')}
                  onChange={(e) => handleFooterElementChange('echeances', e.target.checked)}
                />
                <span className="text-gray-700">Afficher les échéances</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                  checked={wizardData.footerElements.includes('recap_reglements_sap')}
                  onChange={(e) => handleFooterElementChange('recap_reglements_sap', e.target.checked)}
                />
                <span className="text-gray-700">Récap. des règlements Service à la personne</span>
              </label>
            </div>
          </div>
          
          {/* Récap. TVA Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              Récap. TVA
            </h4>
            
            <div className="space-x-4 flex items-center mb-4">
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="recap_tva" 
                  value="always" 
                  checked={recapTvaMode === 'always'}
                  onChange={() => {
                    setRecapTvaMode('always');
                    handleFooterElementChange('recap_tva_always', true);
                    handleFooterElementChange('recap_tva_multiple', false);
                  }}
                  className="w-4 h-4 text-[#004AC8] focus:ring-[#004AC8]" 
                />
                <span className="text-gray-700">Toujours</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="recap_tva" 
                  value="multiple_rates" 
                  checked={recapTvaMode === 'multiple_rates'}
                  onChange={() => {
                    setRecapTvaMode('multiple_rates');
                    handleFooterElementChange('recap_tva_always', false);
                    handleFooterElementChange('recap_tva_multiple', true);
                  }}
                  className="w-4 h-4 text-[#004AC8] focus:ring-[#004AC8]" 
                />
                <span className="text-gray-700">Seulement si plus d&apos;un taux</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]" 
                  defaultChecked
                  checked={wizardData.footerElements.includes('company_info')}
                  onChange={(e) => handleFooterElementChange('company_info', e.target.checked)}
                />
                <span className="text-gray-700">Informations société</span>
              </label>
              
              <div className="flex items-center ml-6">
                <a href="/dashboard/parametre-societe/mentions-factures" className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier les mentions légales...
                </a>
              </div>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                  checked={wizardData.footerElements.includes('payment_slip')}
                  onChange={(e) => handleFooterElementChange('payment_slip', e.target.checked)}
                />
                <span className="text-gray-700">Bordereau de paiement</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]"
                  checked={wizardData.footerElements.includes('countervalue')}
                  onChange={(e) => handleFooterElementChange('countervalue', e.target.checked)}
                />
                <span className="text-gray-700">Contrevaleur</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]" 
                  defaultChecked
                  checked={wizardData.footerElements.includes('bank_details')}
                  onChange={(e) => handleFooterElementChange('bank_details', e.target.checked)}
                />
                <span className="text-gray-700">Coordonnées bancaires de la société</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#004AC8] rounded focus:ring-[#004AC8]" 
                  defaultChecked
                  checked={wizardData.footerElements.includes('page_number')}
                  onChange={(e) => handleFooterElementChange('page_number', e.target.checked)}
                />
                <span className="text-gray-700">Numéro de page</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu du pied de page
          </div>
          
          <div className="bg-white border rounded-lg p-4 h-80 overflow-y-auto shadow-sm">
            {/* Total Section */}
            <div className="border-t border-gray-200 pt-3 mb-4">
              <div className="flex justify-end">
                <table className="text-sm w-48">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-600">Total HT</td>
                      <td className="py-1 text-gray-800 text-right">2.100,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Total TVA</td>
                      <td className="py-1 text-gray-800 text-right">420,00 €</td>
                    </tr>
                    <tr className="font-medium">
                      <td className="py-1 text-gray-700">Total TTC</td>
                      <td className="py-1 text-gray-800 text-right">2.520,00 €</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-1 text-gray-700 font-medium">Solde dû</td>
                      <td className="py-1 text-gray-800 text-right font-medium">2.520,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* TVA Summary */}
            <div className="mb-4 border rounded p-2 bg-gray-50">
              <div className="text-xs font-medium text-gray-700 mb-1">Récapitulatif TVA</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-1 text-left text-gray-600">Taux</th>
                    <th className="py-1 text-right text-gray-600">Base HT</th>
                    <th className="py-1 text-right text-gray-600">Montant TVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-700">20,00%</td>
                    <td className="py-1 text-gray-700 text-right">2.100,00 €</td>
                    <td className="py-1 text-gray-700 text-right">420,00 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Company & Bank Info */}
            <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
              <div className="flex justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires</div>
                  <div>Banque: BNP Paribas</div>
                  <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                  <div>BIC: BNPAFRPPXXX</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-700 mb-1">Informations légales</div>
                  <div>SARL au capital de 10 000€</div>
                  <div>SIRET: 123 456 789 00012</div>
                  <div>TVA Intracom: FR12 123 456 789</div>
                </div>
              </div>
              
              <div className="text-center text-[10px] text-gray-500 mt-2">
                <div>En cas de retard de paiement, une pénalité de 3 fois le taux d&apos;intérêt légal sera appliquée.</div>
                <div>Une indemnité forfaitaire de 40€ pour frais de recouvrement sera due.</div>
              </div>
              
              <div className="text-right mt-2 text-[10px] text-gray-500">
                Page 1/1
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
};

export default Step4FooterData;