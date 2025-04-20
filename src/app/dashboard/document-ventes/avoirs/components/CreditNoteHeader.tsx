// components/CreditNoteHeader.tsx
import React from 'react';
import { FiFileText, FiX, FiInfo } from 'react-icons/fi';
import { CreditNoteHeaderProps } from '../types';

const CreditNoteHeader: React.FC<CreditNoteHeaderProps> = ({ onClose }) => {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvel Avoir</h2>
          <span className="px-2 py-1 text-xs text-red-600 bg-red-50 rounded-full border border-red-200">
            Remboursement
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiX className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Info Alert */}
      <div className="mb-6 flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex-shrink-0 pt-0.5">
          <FiInfo className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-800">À propos des avoirs</h3>
          <p className="mt-1 text-sm text-blue-700">
            Un avoir est un document émis pour annuler partiellement ou totalement une facture. 
            Sélectionnez la facture concernée, indiquez les articles à rembourser et le montant sera calculé automatiquement.
          </p>
        </div>
      </div>
    </>
  );
};

export default CreditNoteHeader;