import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit3, FiTrash2, FiEyeOff, FiEye, FiStar, FiFileText, FiDownload, FiPrinter, FiPlus } from 'react-icons/fi';
import { QuoteTemplate } from '../types';

interface TemplatePreviewProps {
  template: QuoteTemplate | null;
  isDefault?: boolean;
  isHidden?: boolean;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onExpandPreview: () => void;
  onDownload: () => void;
  onPrint: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isDefault,
  isHidden,
  onEdit,
  onToggleVisibility,
  onDelete,
  onExpandPreview,
  onDownload,
  onPrint
}) => {
  return (
    <motion.div 
      className="md:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Template Actions Header */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between gap-2">
        <div className="flex items-center">
          <h2 className="font-semibold text-gray-800">Aperçu du modèle</h2>
          {isDefault && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center">
              <FiStar className="w-3 h-3 mr-1" />
              Modèle par défaut
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex items-center px-3 py-1.5 text-sm bg-[#009B72]/10 text-[#009B72] rounded-lg hover:bg-[#009B72]/20 transition"
          >
            <FiEdit3 className="mr-1" />
            Modifier
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleVisibility}
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {isHidden ? (
              <>
                <FiEye className="mr-1" />
                Afficher
              </>
            ) : (
              <>
                <FiEyeOff className="mr-1" />
                Masquer
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <FiTrash2 className="mr-1" />
            Supprimer
          </motion.button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div className="flex-grow p-8 flex items-center justify-center bg-gray-50 overflow-auto">
        {template ? (
          <div className="relative group">
            {/* Specimen watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-9xl font-black text-gray-100 transform -rotate-45 opacity-20">
                SPECIMEN
              </div>
            </div>
            
            {/* Preview image/placeholder - In a real app, this would be a PDF viewer */}
            <div 
              className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 group-hover:scale-[1.01] border border-gray-200"
              onClick={onExpandPreview}
            >
              {/* This would be the actual devis template preview */}
              <div className="w-[650px] h-[900px] bg-white p-10 relative">
                {/* Header section with logo and info */}
                <div className="flex justify-between mb-10">
                  <div>
                    <div className="w-24 h-12 bg-[#009B72]/20 rounded-lg flex items-center justify-center text-[#009B72] font-bold">LOGO</div>
                    <div className="mt-2 text-gray-800 text-sm">
                      <div>Votre Entreprise SARL</div>
                      <div>123 Avenue des Affaires</div>
                      <div>75001 Paris, France</div>
                      <div>contact@votreentreprise.fr</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 mb-2">DEVIS</div>
                    <div className="text-gray-600 text-sm">
                      <div>N° DE-2025-0068</div>
                      <div>Date: 23/03/2025</div>
                      <div>Validité: 30 jours</div>
                      {template.id === 'template1' && (
                        <div className="mt-2 text-xs bg-gray-100 rounded p-1 inline-block">Réf. client: CLI2025-042</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Client info */}
                <div className="border rounded-lg p-4 bg-gray-50 mb-8">
                  <div className="text-sm font-semibold text-gray-500 mb-1">DESTINATAIRE</div>
                  <div className="text-gray-800">
                    <div className="font-semibold">Client Exemple Inc.</div>
                    <div>42 Rue du Commerce</div>
                    <div>69002 Lyon, France</div>
                    <div>client@exemple.fr</div>
                  </div>
                </div>
                
                {/* Quote items */}
                <table className="w-full mb-8">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-2 rounded-tl-lg text-sm text-gray-600">Description</th>
                      <th className="py-2 px-2 text-sm text-gray-600 text-center">Quantité</th>
                      <th className="py-2 px-2 text-sm text-gray-600 text-right">Prix unitaire</th>
                      <th className="py-2 px-2 rounded-tr-lg text-sm text-gray-600 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {template.id === 'template2' && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="py-2 px-2 font-medium text-sm">Prestation de conseil</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Service de consultation</td>
                      <td className="py-3 px-2 text-center text-gray-600">2</td>
                      <td className="py-3 px-2 text-right text-gray-600">650,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">1.300,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Analyse des besoins</td>
                      <td className="py-3 px-2 text-center text-gray-600">1</td>
                      <td className="py-3 px-2 text-right text-gray-600">450,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">450,00 €</td>
                    </tr>
                    {template.id === 'template2' && (
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="py-2 px-2 font-medium text-sm">Développement</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Développement web</td>
                      <td className="py-3 px-2 text-center text-gray-600">1</td>
                      <td className="py-3 px-2 text-right text-gray-600">1.200,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">1.200,00 €</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-gray-600 flex justify-between">
                      <span>Total HT</span>
                      <span>2.950,00 €</span>
                    </div>
                    
                    <div className="bg-white px-4 py-2 text-gray-600 flex justify-between border-t border-gray-100">
                      <span>TVA (20%)</span>
                      <span>590,00 €</span>
                    </div>
                    
                    <div className="bg-[#009B72]/10 px-4 py-3 text-[#009B72] font-semibold flex justify-between border-t border-gray-100">
                      <span>Total TTC</span>
                      <span>3.540,00 €</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="border-t pt-6 text-sm text-gray-500">
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Bon pour accord</div>
                      <div>Date:</div>
                      <div className="mt-1">Signature client:</div>
                      <div className="h-16 border border-dashed border-gray-300 w-full mt-1"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Conditions</div>
                      <div>Validité de l&apos;offre: 30 jours</div>
                      <div>Modalités de paiement: 30% à la commande</div>
                      <div>Délai de réalisation: 3 semaines</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-gray-400">
                    Votre Entreprise SARL - SIRET: 123 456 789 00012 - TVA: FR12 123 456 789
                    <div>www.votreentreprise.fr</div>
                  </div>
                </div>
                
                {/* Expand button overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm flex items-center">
                    <FiEye className="mr-2" />
                    Agrandir l&apos;aperçu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucun modèle sélectionné</p>
            <p className="text-sm mt-2">Sélectionnez un modèle dans la liste ou créez-en un nouveau</p>
            <button
              onClick={onEdit}
              className="mt-6 px-4 py-2 bg-[#009B72] text-white rounded-lg hover:bg-[#008A65] transition"
            >
              <FiPlus className="inline-block mr-2" />
              Nouveau modèle
            </button>
          </div>
        )}
      </div>
      
      {/* Template Info Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Format: A4 (210 × 297 mm)
        </div>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="flex items-center px-4 py-2 bg-[#009B72]/10 text-[#009B72] rounded-lg hover:bg-[#009B72]/20 transition"
            title="Télécharger en PDF"
            disabled={!template}
          >
            <FiDownload className="mr-2" />
            Télécharger
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrint}
            className="flex items-center px-4 py-2 bg-[#009B72] text-white rounded-lg hover:bg-[#008A65] transition shadow-sm"
            title="Imprimer le modèle"
            disabled={!template}
          >
            <FiPrinter className="mr-2" />
            Imprimer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplatePreview;