// components/CreditNoteTotals.tsx
import React, { ChangeEvent } from 'react';
import { FiCornerDownRight } from 'react-icons/fi';
import { CreditNoteTotalsProps } from '../types';

const CreditNoteTotals: React.FC<CreditNoteTotalsProps> = ({ 
  totals, 
  setTotals, 
  formData 
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Notes */}
        <div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white h-full shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires / Motif détaillé</label>
            <textarea
              className="w-full h-40 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all text-gray-800"
              placeholder="Saisissez les détails du motif de l'avoir ou des commentaires supplémentaires..."
            ></textarea>
          </div>
        </div>
        
        {/* Right Column - Totals */}
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-start">
              <FiCornerDownRight className="text-blue-500 mt-0.5 mr-2" />
              <div>
                <span className="text-sm font-medium text-blue-700">Facture d&apos;origine : </span>
                <span className="text-sm text-blue-600">{formData.factureLiee || "Non sélectionnée"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3">
            <span className="text-sm text-gray-600">Total brut HT</span>
            <span className="font-medium">{totals.totalBrutHT} €</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">% Remise</span>
              <input
                type="text"
                name="pourcentageRemise"
                value={totals.pourcentageRemise}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, pourcentageRemise: e.target.value})}
                className="w-16 p-1 border border-gray-300 rounded text-gray-800"
              />
            </div>
            <span className="font-medium">
              {(parseFloat(totals.totalBrutHT) * parseFloat(totals.pourcentageRemise) / 100).toFixed(2)} €
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Port HT</span>
              <input
                type="text"
                name="portHT"
                value={totals.portHT}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, portHT: e.target.value})}
                className="w-16 p-1 border border-gray-300 rounded text-gray-800"
              />
            </div>
            <span className="font-medium">{totals.portHT} €</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">TVA Port</span>
              <input
                type="text"
                name="tvaPort"
                value={totals.tvaPort}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTotals({...totals, tvaPort: e.target.value})}
                className="w-16 p-1 border border-gray-300 rounded text-gray-800"
              />
              <span className="ml-1">%</span>
            </div>
            <span className="font-medium">
              {(parseFloat(totals.portHT) * parseFloat(totals.tvaPort) / 100).toFixed(2)} €
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3">
            <span className="text-sm text-gray-600">Total Net HT</span>
            <span className="font-medium">{totals.totalNetHT} €</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
            <span className="font-medium text-gray-700">TVA</span>
            <span className="font-medium">
              {(parseFloat(totals.totalNetHT) * 0.2).toFixed(2)} €
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">Total TTC à rembourser</span>
            <span className="font-bold text-lg text-red-700">{totals.totalTTC} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditNoteTotals;