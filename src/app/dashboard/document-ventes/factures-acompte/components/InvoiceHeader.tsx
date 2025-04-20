// components/InvoiceHeader.tsx
import React from 'react';
import { FiFileText, FiX, FiInfo } from 'react-icons/fi';

interface InvoiceHeaderProps {
  onClose: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ onClose }) => {
  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle Facture d&apos;acompte</h2>
          <span className="px-2 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-full border border-indigo-200">
            Acompte
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
          <h3 className="text-sm font-medium text-blue-800">À propos des factures d&apos;acompte</h3>
          <p className="mt-1 text-sm text-blue-700">
            Une facture d&apos;acompte est un document qui permet de demander un paiement partiel avant la réalisation complète 
            d&apos;un projet. Ce montant sera déduit de la facture finale. Sélectionnez un projet existant 
            ou définissez un pourcentage sur le montant total.
          </p>
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;