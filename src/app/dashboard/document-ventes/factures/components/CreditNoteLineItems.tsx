import React, { ChangeEvent, memo } from 'react';
import { FiInfo, FiPlus, FiTrash2, FiChevronsRight } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { LineItem } from '../types/creditNote';

interface CreditNoteLineItemsProps {
  lineItems: LineItem[];
  onLineItemChange: (id: number, field: keyof LineItem, value: string | number) => void;
  onRemoveLineItem: (id: number) => void;
  onAddLineItem: () => void;
  onOpenArticleSelection: (id: number) => void;
}

const CreditNoteLineItems: React.FC<CreditNoteLineItemsProps> = ({
  lineItems,
  onLineItemChange,
  onRemoveLineItem,
  onAddLineItem,
  onOpenArticleSelection
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Détails des articles à rembourser</h3>
        <div className="flex items-center text-xs text-gray-500">
          <FiInfo className="mr-1" />
          Cliquez sur Code article pour sélectionner un article
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code article
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code unité
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PV HT
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % remise
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant Net HT
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TVA
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lineItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <input
                      type="text"
                      value={item.codeArticle}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800 cursor-pointer"
                      onClick={() => onOpenArticleSelection(item.id)}
                      readOnly
                      placeholder="Sélectionner..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <FiChevronsRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onLineItemChange(item.id, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                    placeholder="Description"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    value={item.quantite}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onLineItemChange(item.id, 'quantite', parseInt(e.target.value) || 0)}
                    className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                    min="1"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <select
                    value={item.codeUnite}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onLineItemChange(item.id, 'codeUnite', e.target.value)}
                    className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                  >
                    <option value="h">h</option>
                    <option value="jour">jour</option>
                    <option value="forfait">forfait</option>
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="m2">m²</option>
                  </select>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FaEuroSign className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="text"
                      value={item.pvHT}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onLineItemChange(item.id, 'pvHT', e.target.value)}
                      className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FiInfo className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="text"
                      value={item.remise}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onLineItemChange(item.id, 'remise', e.target.value)}
                      className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
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
                      value={item.montantNetHT}
                      readOnly
                      className="w-24 p-2 pl-6 border border-gray-200 rounded bg-gray-50 text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <FiInfo className="text-gray-400" size={12} />
                    </div>
                    <input
                      type="text"
                      value={item.tva}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onLineItemChange(item.id, 'tva', e.target.value)}
                      className="w-24 p-2 pl-6 border border-gray-300 rounded focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button
                    onClick={() => onRemoveLineItem(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    disabled={lineItems.length === 1}
                    title="Supprimer la ligne"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3">
        <button
          onClick={onAddLineItem}
          className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded transition-colors font-medium"
        >
          <FiPlus className="mr-1" />
          Ajouter une ligne
        </button>
      </div>
    </div>
  );
};

export default memo(CreditNoteLineItems);