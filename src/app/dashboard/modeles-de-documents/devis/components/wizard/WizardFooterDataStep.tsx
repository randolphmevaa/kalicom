import React from 'react';
import { WizardFormData } from '../../types';

interface WizardFooterDataStepProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

const WizardFooterDataStep: React.FC<WizardFooterDataStepProps> = ({ data, onUpdate }) => {
  // Helper to update footer elements
  const toggleFooterElement = (element: string) => {
    const newElements = data.footerElements.includes(element)
      ? data.footerElements.filter(el => el !== element)
      : [...data.footerElements, element];
    
    onUpdate({ footerElements: newElements });
  };
  
  const [recapTvaMode, setRecapTvaMode] = React.useState('always');
  
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
                'total_ht', 'remise', 'total_ht_remise', 'frais_supplementaires', 
                'total_ht_net', 'total_tva', 'total_ttc', 'total_ttc_lettres',
                'acompte_demande'
              ].map((item, index) => {
                // Convert to display format
                const displayName = item
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
                  .replace('Ht', 'HT')
                  .replace('Tva', 'TVA')
                  .replace('Ttc', 'TTC');
                
                return (
                  <label key={index} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                      checked={data.footerElements.includes(item)}
                      onChange={() => toggleFooterElement(item)}
                      defaultChecked={['total_ht', 'total_tva', 'total_ttc'].includes(item)}
                    />
                    <span className="text-gray-700">{displayName}</span>
                  </label>
                );
              })}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('validite')}
                  onChange={() => toggleFooterElement('validite')}
                  defaultChecked 
                />
                <span className="text-gray-700">Afficher la durée de validité</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('modalites_reglement')}
                  onChange={() => toggleFooterElement('modalites_reglement')}
                />
                <span className="text-gray-700">Afficher modalités de règlement</span>
              </label>
            </div>
          </div>
          
          {/* Récap. TVA Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
              Conditions et mentions
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
                    if (!data.footerElements.includes('recap_tva')) {
                      toggleFooterElement('recap_tva');
                    }
                  }}
                  className="w-4 h-4 text-[#009B72] focus:ring-[#009B72]" 
                />
                <span className="text-gray-700">Afficher récap. TVA</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="recap_tva" 
                  value="multiple_rates" 
                  checked={recapTvaMode === 'multiple_rates'}
                  onChange={() => {
                    setRecapTvaMode('multiple_rates');
                    toggleFooterElement('recap_tva_seulement_multiple');
                    // Remove standard recap_tva if it exists
                    if (data.footerElements.includes('recap_tva')) {
                      toggleFooterElement('recap_tva');
                    }
                  }}
                  className="w-4 h-4 text-[#009B72] focus:ring-[#009B72]" 
                />
                <span className="text-gray-700">Seulement si plus d&apos;un taux</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('cgv')}
                  onChange={() => toggleFooterElement('cgv')}
                  defaultChecked 
                />
                <span className="text-gray-700">Conditions générales de vente</span>
              </label>
              
              <div className="flex items-center ml-6">
                <a href="/dashboard/parametre-societe/mentions-devis" className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Modifier les mentions légales...
                </a>
              </div>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('signature_client')}
                  onChange={() => toggleFooterElement('signature_client')}
                  defaultChecked 
                />
                <span className="text-gray-700">Signature client</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('bon_pour_accord')}
                  onChange={() => toggleFooterElement('bon_pour_accord')}
                  defaultChecked 
                />
                <span className="text-gray-700">Bon pour accord</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('coordonnees_bancaires')}
                  onChange={() => toggleFooterElement('coordonnees_bancaires')}
                  defaultChecked 
                />
                <span className="text-gray-700">Coordonnées bancaires de la société</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#009B72] rounded focus:ring-[#009B72]"
                  checked={data.footerElements.includes('numero_page')}
                  onChange={() => toggleFooterElement('numero_page')}
                  defaultChecked 
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
                      <td className="py-1 text-gray-800 text-right">2.750,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-600">Total TVA</td>
                      <td className="py-1 text-gray-800 text-right">550,00 €</td>
                    </tr>
                    <tr className="font-medium">
                      <td className="py-1 text-gray-700">Total TTC</td>
                      <td className="py-1 text-gray-800 text-right">3.300,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Conditions Section */}
            <div className="mb-4 border-t pt-4">
              <div className="text-xs text-gray-600 mb-2">
                <div className="font-medium text-gray-700">Conditions de validité</div>
                <div>Ce devis est valable 30 jours à compter de la date d&apos;émission.</div>
              </div>
              
              <div className="text-xs text-gray-600 mt-3">
                <div className="font-medium text-gray-700">Conditions de règlement</div>
                <div>Acompte de 30% à la commande, solde à la livraison.</div>
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
                    <td className="py-1 text-gray-700 text-right">2.750,00 €</td>
                    <td className="py-1 text-gray-700 text-right">550,00 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Signature & Acceptance */}
            <div className="grid grid-cols-2 gap-4 mb-4 border-t pt-4">
              <div className="text-xs text-gray-600">
                <div className="font-medium text-gray-700 mb-1">Bon pour accord</div>
                <div>Date:</div>
                <div>Nom et qualité:</div>
                <div className="h-16 border border-dashed border-gray-300 rounded mt-1 flex items-center justify-center text-gray-400">
                  Signature client
                </div>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="font-medium text-gray-700 mb-1">Votre contact</div>
                <div>Jean Dupont</div>
                <div>Responsable commercial</div>
                <div>jean.dupont@entreprise.fr</div>
                <div>01 23 45 67 89</div>
              </div>
            </div>
            
            {/* Company Info */}
            <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
              <div className="flex justify-between mb-1">
                <div>
                  <div className="font-medium text-gray-700 mb-1">Coordonnées bancaires</div>
                  <div>Banque: BNP Paribas</div>
                  <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                  <div>BIC: BNPAFRPPXXX</div>
                </div>
              </div>
              
              <div className="text-center text-[10px] text-gray-500 mt-2">
                <div>Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789</div>
                <div>Pour tout renseignement complémentaire, veuillez nous contacter au 01 23 45 67 89</div>
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

export default WizardFooterDataStep;