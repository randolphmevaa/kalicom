import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiEdit3, FiEye, FiEyeOff, FiTrash2, FiFileText, FiDownload, FiPrinter, FiPlus, FiStar } from 'react-icons/fi';
import { TemplatePreviewProps } from '../../types';

const TemplatePreview = memo(({
  currentTemplate,
  onEdit,
  onToggleVisibility,
  onDelete,
  onExpand,
  onPrint,
  onDownload,
//   onSetDefault,
  onCreateNew
}: TemplatePreviewProps) => {
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
          {currentTemplate?.isDefault && (
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center">
              <FiStar className="w-3 h-3 mr-1" />
              Modèle par défaut
            </span>
          )}
        </div>
        
        {currentTemplate && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center px-3 py-1.5 text-sm bg-[#004AC8]/10 text-[#004AC8] rounded-lg hover:bg-[#004AC8]/20 transition"
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
              {currentTemplate?.isHidden ? (
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
        )}
      </div>
      
      {/* Preview Area */}
      <div className="flex-grow p-8 flex items-center justify-center bg-gray-50 overflow-auto">
        {currentTemplate ? (
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
              onClick={onExpand}
            >
              {/* This would be the actual invoice template preview */}
              <div className="w-[650px] h-[900px] bg-white p-10 relative">
                {/* Header section with logo and info */}
                <div className="flex justify-between mb-10">
                  <div>
                    <div className="w-24 h-12 bg-[#004AC8]/20 rounded-lg flex items-center justify-center text-[#004AC8] font-bold">LOGO</div>
                    <div className="mt-2 text-gray-800 text-sm">
                      <div>Votre Entreprise SARL</div>
                      <div>123 Avenue des Affaires</div>
                      <div>75001 Paris, France</div>
                      <div>contact@votreentreprise.fr</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 mb-2">FACTURE</div>
                    <div className="text-gray-600 text-sm">
                      <div>N° FA-2025-0042</div>
                      <div>Date: 23/03/2025</div>
                      <div>Échéance: 23/04/2025</div>
                      {currentTemplate.id === 'template1' && (
                        <div className="mt-2 w-28 h-10 ml-auto bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">CODE BARRE</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Client info */}
                <div className="border rounded-lg p-4 bg-gray-50 mb-8">
                  <div className="text-sm font-semibold text-gray-500 mb-1">FACTURÉ À</div>
                  <div className="text-gray-800">
                    <div className="font-semibold">Client Exemple Inc.</div>
                    <div>42 Rue du Commerce</div>
                    <div>69002 Lyon, France</div>
                    <div>client@exemple.fr</div>
                  </div>
                </div>
                
                {/* Invoice items */}
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
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Service de consultation</td>
                      <td className="py-3 px-2 text-center text-gray-600">2</td>
                      <td className="py-3 px-2 text-right text-gray-600">450,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">900,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Développement web</td>
                      <td className="py-3 px-2 text-center text-gray-600">1</td>
                      <td className="py-3 px-2 text-right text-gray-600">1.200,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">1.200,00 €</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-gray-800">Maintenance mensuelle</td>
                      <td className="py-3 px-2 text-center text-gray-600">3</td>
                      <td className="py-3 px-2 text-right text-gray-600">75,00 €</td>
                      <td className="py-3 px-2 text-right text-gray-800">225,00 €</td>
                    </tr>
                  </tbody>
                </table>
                
                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-gray-600 flex justify-between">
                      <span>Sous-total</span>
                      <span>2.325,00 €</span>
                    </div>
                    
                    {currentTemplate.id !== 'template2' && (
                      <div className="bg-white px-4 py-2 text-gray-600 flex justify-between border-t border-gray-100">
                        <span>TVA (20%)</span>
                        <span>465,00 €</span>
                      </div>
                    )}
                    
                    <div className="bg-[#004AC8]/10 px-4 py-3 text-[#004AC8] font-semibold flex justify-between border-t border-gray-100">
                      <span>Total {currentTemplate.id === 'template2' ? 'HT' : ''}</span>
                      <span>{currentTemplate.id === 'template2' ? '2.325,00 €' : '2.790,00 €'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="border-t pt-6 text-sm text-gray-500">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Modalités de paiement</div>
                      <div>Virement bancaire sous 30 jours</div>
                      <div>IBAN: FR76 1234 5678 9123 4567 8912 345</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-700 mb-1">Contact</div>
                      <div>service.client@votreentreprise.fr</div>
                      <div>+33 (0)1 23 45 67 89</div>
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
              onClick={onCreateNew}
              className="mt-6 px-4 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003AA0] transition"
            >
              <FiPlus className="inline-block mr-2" />
              Nouveau modèle
            </button>
          </div>
        )}
      </div>
      
      {/* Template Info Footer */}
      {currentTemplate && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Format: A4 (210 × 297 mm)
          </div>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="flex items-center px-4 py-2 bg-[#004AC8]/10 text-[#004AC8] rounded-lg hover:bg-[#004AC8]/20 transition"
              title="Télécharger en PDF"
            >
              <FiDownload className="mr-2" />
              Télécharger
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPrint}
              className="flex items-center px-4 py-2 bg-[#004AC8] text-white rounded-lg hover:bg-[#003AA0] transition shadow-sm"
              title="Imprimer le modèle"
            >
              <FiPrinter className="mr-2" />
              Imprimer
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;