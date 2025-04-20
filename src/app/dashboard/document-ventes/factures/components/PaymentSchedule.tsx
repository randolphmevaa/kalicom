import React, { ChangeEvent, memo } from 'react';
import { FiInfo, FiPlus, FiTrash2, FiCheck, FiCalendar } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { PaymentSchedule, moyensPaiement } from '../types';

interface PaymentScheduleComponentProps {
  paymentSchedule: PaymentSchedule[];
  onPaymentScheduleChange: (id: number, field: keyof PaymentSchedule, value: string | boolean | number) => void;
  onRemovePaymentSchedule: (id: number) => void;
  onAddPaymentSchedule: () => void;
  onMarkPaymentComplete: (id: number) => void;
  paymentScheduleTotal: string;
  invoiceTotal: string;
  difference: string;
  isBalanced: boolean;
}

const PaymentScheduleComponent: React.FC<PaymentScheduleComponentProps> = ({
  paymentSchedule,
  onPaymentScheduleChange,
  onRemovePaymentSchedule,
  onAddPaymentSchedule,
  onMarkPaymentComplete,
  paymentScheduleTotal,
  invoiceTotal,
  difference,
  isBalanced
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Échéances de paiement</h3>
        <div className="flex items-center text-xs text-gray-500">
          <FiInfo className="mr-1" />
          Les échéances sont automatiquement ajustées en fonction du montant total
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date échéance
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moyen de paiement
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solde dû
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentSchedule.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" size={14} />
                    </div>
                    <input
                      type="date"
                      value={item.dateEcheance}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        onPaymentScheduleChange(item.id, 'dateEcheance', e.target.value)
                      }
                      className="w-full p-2 pl-8 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="text"
                      value={item.montant}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        onPaymentScheduleChange(item.id, 'montant', e.target.value)
                      }
                      className="w-full p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <select
                    value={item.moyenPaiement}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                      onPaymentScheduleChange(item.id, 'moyenPaiement', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                  >
                    {moyensPaiement.map((moyen, index) => (
                      <option key={index} value={moyen}>{moyen}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="text"
                      value={item.soldeDu}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => 
                        onPaymentScheduleChange(item.id, 'soldeDu', e.target.value)
                      }
                      className="w-full p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs rounded-full inline-flex items-center ${
                    item.estRegle
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {item.estRegle ? 'Réglé' : 'En attente'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {!item.estRegle && (
                      <button
                        onClick={() => onMarkPaymentComplete(item.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Générer le règlement"
                      >
                        <FiCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => onRemovePaymentSchedule(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      disabled={paymentSchedule.length === 1}
                      title="Supprimer l'échéance"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3">
        <button
          onClick={onAddPaymentSchedule}
          className="flex items-center text-[#1B0353] hover:bg-[#1B0353]/5 px-3 py-2 rounded transition-colors font-medium"
        >
          <FiPlus className="mr-1" />
          Ajouter une échéance
        </button>
      </div>
      
      {/* Payment Schedule Info */}
      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-2">
          <FiInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Information :</span> Le total des échéances doit correspondre au montant total TTC de la facture.
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm mr-2">Total échéances :</span>
                <span className="font-medium">{paymentScheduleTotal} €</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">Total facture :</span>
                <span className="font-medium">{invoiceTotal} €</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">Différence :</span>
                <span className={`font-medium ${
                  !isBalanced ? 'text-red-600' : 'text-green-600'
                }`}>
                  {difference} €
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentScheduleComponent);