import React, { ChangeEvent, memo } from 'react';
import { Totals } from '../types';

interface InvoiceTotalsProps {
  totals: Totals;
  onUpdateTotalField: (field: keyof Totals, value: string) => void;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  totals,
  onUpdateTotalField
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Notes */}
        <div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white h-full shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Conditions</label>
            <textarea
              className="w-full h-40 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-gray-800"
              placeholder="Saisissez vos notes ou conditions particulières ici..."
            ></textarea>
          </div>
        </div>
        
        {/* Right Column - Totals */}
        <div className="space-y-2">
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateTotalField('pourcentageRemise', e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateTotalField('portHT', e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateTotalField('tvaPort', e.target.value)}
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
          
          <div className="flex justify-between items-center p-3">
            <span className="text-sm text-gray-600">Soit</span>
            <span className="font-medium text-xs text-gray-500 italic">
              {parseFloat(totals.totalNetHT) > 0 ? "montant en lettres" : ""}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">% Acompte</span>
              <input
                type="text"
                name="pourcentageAcompte"
                value={totals.pourcentageAcompte}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onUpdateTotalField('pourcentageAcompte', e.target.value)}
                className="w-16 p-1 border border-gray-300 rounded text-gray-800"
              />
            </div>
            <span className="font-medium">
              {(parseFloat(totals.totalTTC) * parseFloat(totals.pourcentageAcompte) / 100).toFixed(2)} €
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-[#1B0353]/5 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">Total TTC</span>
            <span className="font-bold text-lg">{totals.totalTTC} €</span>
          </div>
          
          <div className="flex justify-between items-center p-3">
            <span className="text-sm text-gray-600">Soit</span>
            <span className="font-medium text-xs text-gray-500 italic">
              {parseFloat(totals.totalTTC) > 0 ? "montant en lettres" : ""}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-[#1B0353]/10 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">Net à payer</span>
            <span className="font-bold text-lg text-[#1B0353]">{totals.netAPayer} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(InvoiceTotals);