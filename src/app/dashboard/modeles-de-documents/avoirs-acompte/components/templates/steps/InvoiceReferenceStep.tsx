// File: components/templates/steps/InvoiceReferenceStep.jsx
import { memo } from 'react';
import { FiRefreshCw, FiInfo, FiPercent, FiFileText } from 'react-icons/fi';
import { WizardData, CreditOptions } from '../../../types/templates';

interface InvoiceReferenceStepProps {
    wizardData: WizardData;
    updateCreditOptions: (updates: Partial<CreditOptions>) => void;
  }

function InvoiceReferenceStep({ wizardData, updateCreditOptions }: InvoiceReferenceStepProps) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Facture de référence</h3>
      <p className="text-gray-600 mb-6">Définir la référence à la facture d&apos;acompte d&apos;origine</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Référence facture Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FiRefreshCw className="mr-2 text-gray-500" />
              Facture d&apos;acompte associée
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de la facture d&apos;acompte
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={wizardData.creditOptions.referencedInvoice}
                    onChange={(e) => updateCreditOptions({ referencedInvoice: e.target.value })}
                    placeholder="FA-2025-A0042"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                  />
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition">
                    Rechercher
                  </button>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700 mb-2 flex items-center">
                  <FiInfo className="mr-2 text-amber-500" />
                  Informations importantes
                </div>
                <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
                  <li>L&apos;avoir d&apos;acompte doit toujours référencer la facture d&apos;acompte d&apos;origine</li>
                  <li>Les montants et taux de TVA doivent correspondre à la facture d&apos;origine</li>
                  <li>La législation oblige à mentionner clairement le motif de l&apos;avoir</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Type d'avoir Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FiPercent className="mr-2 text-gray-500" />
              Type d&apos;avoir
            </h4>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="credit_type"
                  checked={wizardData.creditOptions.type === 'full'}
                  onChange={() => updateCreditOptions({ type: 'full' })}
                  className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                />
                <span className="text-gray-700">Avoir total (100% de l&apos;acompte)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="credit_type"
                  checked={wizardData.creditOptions.type === 'percentage'}
                  onChange={() => updateCreditOptions({ type: 'percentage' })}
                  className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                />
                <span className="text-gray-700">Avoir partiel (pourcentage de l&apos;acompte)</span>
              </label>
              
              {wizardData.creditOptions.type === 'percentage' && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm text-gray-700 mb-1">Pourcentage de l&apos;avoir</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="1" 
                      max="99"
                      value={wizardData.creditOptions.percentage}
                      onChange={(e) => updateCreditOptions({ 
                        percentage: parseInt(e.target.value) || 0 
                      })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                    />
                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                      %
                    </span>
                  </div>
                </div>
              )}
              
              <label className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  name="credit_type"
                  checked={wizardData.creditOptions.type === 'fixed'}
                  onChange={() => updateCreditOptions({ type: 'fixed' })}
                  className="w-4 h-4 text-[#E05D5D] focus:ring-[#E05D5D]" 
                />
                <span className="text-gray-700">Avoir à montant fixe</span>
              </label>
              
              {wizardData.creditOptions.type === 'fixed' && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm text-gray-700 mb-1">Montant de l&apos;avoir</label>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      min="0"
                      value={wizardData.creditOptions.fixedAmount}
                      onChange={(e) => updateCreditOptions({ 
                        fixedAmount: parseFloat(e.target.value) || 0 
                      })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                    />
                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-lg">
                      €
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Motif de l'avoir */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FiFileText className="mr-2 text-gray-500" />
              Motif de l&apos;avoir
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50">
                  <option>Annulation de commande</option>
                  <option>Erreur de facturation</option>
                  <option>Remboursement partiel</option>
                  <option>Résiliation de contrat</option>
                  <option>Autre (à préciser)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire
                </label>
                <textarea 
                  rows={3}
                  placeholder="Précisez le motif de l'avoir..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu de l&apos;avoir
          </div>
          
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="mb-2 text-sm font-medium text-gray-800">Simulation d&apos;avoir</div>
            
            <div className="p-3 bg-gray-50 rounded-lg mb-4 text-sm">
              <div className="font-medium text-gray-700 mb-1">Facture d&apos;acompte d&apos;origine</div>
              <div className="flex justify-between text-gray-600">
                <span>N° Facture:</span>
                <span>{wizardData.creditOptions.referencedInvoice || 'FA-2025-A0042'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Montant:</span>
                <span>900,00 €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Date:</span>
                <span>10/03/2025</span>
              </div>
            </div>

            <table className="w-full text-sm mb-6">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 text-gray-700">Montant HT</td>
                  <td className="py-2 text-right text-gray-700">750,00 €</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">TVA (20%)</td>
                  <td className="py-2 text-right text-gray-700">150,00 €</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700 font-medium">Montant TTC</td>
                  <td className="py-2 text-right text-gray-700 font-medium">900,00 €</td>
                </tr>
              </tbody>
            </table>

            {/* Credit amount calculation */}
            <div className="bg-[#E05D5D]/5 p-3 rounded-lg border-l-4 border-[#E05D5D] mb-4">
              <div className="flex justify-between font-medium text-[#E05D5D]">
                <span>
                  {wizardData.creditOptions.type === 'full'
                    ? 'Montant de l\'avoir (100%)'
                    : wizardData.creditOptions.type === 'percentage'
                      ? `Montant de l'avoir (${wizardData.creditOptions.percentage}%)`
                      : 'Montant de l\'avoir (fixe)'}
                </span>
                <span>
                  {wizardData.creditOptions.type === 'full'
                    ? '900,00 €'
                    : wizardData.creditOptions.type === 'percentage'
                      ? `${(900 * wizardData.creditOptions.percentage / 100).toFixed(2).replace('.', ',')} €`
                      : `${wizardData.creditOptions.fixedAmount.toFixed(2).replace('.', ',')} €`}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <div className="font-medium mb-1">Modalité de remboursement</div>
              <select 
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#E05D5D]"
                value={wizardData.creditOptions.refundMethod}
                onChange={(e) => updateCreditOptions({ refundMethod: e.target.value })}
              >
                <option value="bank_transfer">Virement bancaire</option>
                <option value="next_invoice">Avoir sur prochaine facture</option>
                <option value="check">Chèque</option>
                <option value="card_refund">Remboursement carte bancaire</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
            <div className="flex items-start">
              <FiInfo className="mr-2 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium">Important :</span>{' '}
                Un avoir d&apos;acompte doit clairement mentionner le numéro de la facture d&apos;acompte à laquelle il se rapporte, ainsi que le motif de l&apos;avoir.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(InvoiceReferenceStep);