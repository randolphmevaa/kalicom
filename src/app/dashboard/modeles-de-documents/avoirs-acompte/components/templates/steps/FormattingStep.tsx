// File: components/templates/steps/FormattingStep.tsx
import { memo } from 'react';
import { WizardData } from '../../../types/templates';
import { FONT_OPTIONS, FONT_SIZE_OPTIONS, DEFAULT_COLORS } from '../../../constants/wizardConstants';
import ColorPicker from '../ui/ColorPicker';
import Checkbox from '../ui/Checkbox';

interface FormattingStepProps {
  wizardData: WizardData;
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>;
}

function FormattingStep({ wizardData, setWizardData }: FormattingStepProps) {
  // Helper function to update formatting options
  const updateFormatting = (updates: Partial<typeof wizardData.formatting>) => {
    setWizardData({
      ...wizardData,
      formatting: {
        ...wizardData.formatting,
        ...updates
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Mise en forme du modèle</h3>
      <p className="text-gray-600 mb-6">Paramétrer la mise en forme du modèle (couleurs, police, etc.)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Couleurs Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              Couleurs
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { id: 'primaryColor', label: 'Couleur principale', color: wizardData.formatting.primaryColor || DEFAULT_COLORS.frameColor },
                { id: 'labelTextColor', label: 'Texte des intitulés', color: DEFAULT_COLORS.labelTextColor },
                { id: 'labelBgColor', label: 'Fond des intitulés', color: DEFAULT_COLORS.labelBgColor },
                { id: 'creditHighlightColor', label: 'Mise en avant du montant', color: DEFAULT_COLORS.creditHighlightColor },
                { id: 'otherTextColor', label: 'Autres textes', color: DEFAULT_COLORS.otherTextColor }
              ].map(item => (
                <ColorPicker
                  key={item.id}
                  label={item.label}
                  value={item.id === 'primaryColor' ? wizardData.formatting.primaryColor || item.color : item.color}
                  onChange={(value) => {
                    if (item.id === 'primaryColor') {
                      updateFormatting({ primaryColor: value });
                    }
                  }}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Il est recommandé d&apos;utiliser une couleur différente de vos factures pour faciliter l&apos;identification des avoirs.</span>
              </div>
            </div>
          </div>
          
          {/* Police des intitulés Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Police et typographie
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Police</label>
                <select 
                  value={wizardData.formatting.font}
                  onChange={(e) => updateFormatting({ font: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <select 
                  value={wizardData.formatting.fontSize}
                  onChange={(e) => updateFormatting({ fontSize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E05D5D]/50"
                >
                  {FONT_SIZE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center">
              <button className="p-2 border rounded-lg bg-[#E05D5D] text-white" title="Gras">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Italique">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M10 4H16M14 20H4" />
                  <line x1="15" y1="4" x2="9" y2="20" />
                </svg>
              </button>
              
              <button className="p-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" title="Souligné">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 7L9 14M15 7L15 14M6 20H18" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Cadres et entêtes Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cadres et entêtes
            </h4>
            
            <div className="space-y-3">
              <Checkbox
                label="Masquer les cadres"
                checked={wizardData.formatting.hideBorders || false}
                onChange={(checked) => updateFormatting({ hideBorders: checked })}
              />
              
              <Checkbox
                label="Masquer les entêtes"
                checked={wizardData.formatting.hideHeaders || false}
                onChange={(checked) => updateFormatting({ hideHeaders: checked })}
              />
              
              <Checkbox
                label="Encadrer le bloc de remboursement"
                checked={!!wizardData.formatting.frameBorderColor}
                onChange={(checked) => updateFormatting({ 
                  frameBorderColor: checked ? wizardData.formatting.primaryColor : undefined 
                })}
              />

              <Checkbox
                label='Afficher "AVOIR" en grand'
                checked={wizardData.formatting.showWatermark !== false}
                onChange={(checked) => updateFormatting({ showWatermark: checked })}
              />
            </div>
          </div>
          
          {/* Fond de page Section */}
          <div className="border rounded-xl p-4 bg-white">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Fond de page
            </h4>
            
            <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Modifier le fond de page...
            </button>
            
            <div className="mt-3 text-sm text-gray-500">
              Aucun fond de page sélectionné
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="border rounded-xl p-4 bg-gray-50 h-fit sticky top-4">
          <div className="font-medium text-gray-700 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Aperçu du style
          </div>
          
          <div 
            className="bg-white border rounded-lg p-3 overflow-hidden shadow-sm"
            style={{ borderColor: wizardData.formatting.primaryColor }}
          >
            {/* Header with selected styles */}
            <div 
              className="flex justify-between mb-3 pb-2 border-b" 
              style={{ borderColor: wizardData.formatting.primaryColor }}
            >
              <div className="w-16 h-10 bg-gray-100 rounded flex-shrink-0"></div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-800">AVOIR D&apos;ACOMPTE</div>
                <div className="text-xs text-gray-600">N° AV-2025-A0042</div>
              </div>
            </div>
            
            {/* Table with selected styles */}
            <table className="w-full text-xs mb-3">
              <thead>
                <tr>
                  <th 
                    className="py-1 px-1 text-white text-left rounded-tl-md"
                    style={{ backgroundColor: wizardData.formatting.primaryColor }}
                  >
                    Description
                  </th>
                  <th 
                    className="py-1 px-1 text-white text-center"
                    style={{ backgroundColor: wizardData.formatting.primaryColor }}
                  >
                    Qté
                  </th>
                  <th 
                    className="py-1 px-1 text-white text-right rounded-tr-md"
                    style={{ backgroundColor: wizardData.formatting.primaryColor }}
                  >
                    Prix
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1 px-1">Acompte sur commande</td>
                  <td className="py-1 px-1 text-center">1</td>
                  <td className="py-1 px-1 text-right">-900,00 €</td>
                </tr>
              </tbody>
            </table>
            
            {/* Credit section with selected styles */}
            <div 
              className="p-2 rounded-lg mb-3 border-l-4"
              style={{ 
                backgroundColor: `${wizardData.formatting.primaryColor}05`, 
                borderColor: wizardData.formatting.primaryColor 
              }}
            >
              <div className="flex justify-between text-xs">
                <span 
                  className="font-medium"
                  style={{ color: wizardData.formatting.primaryColor }}
                >
                  À rembourser
                </span>
                <span 
                  className="font-bold"
                  style={{ color: wizardData.formatting.primaryColor }}
                >
                  900,00 €
                </span>
              </div>
            </div>
            
            {/* Footer with selected styles */}
            <div 
              className="text-[9px] text-gray-600 border-t pt-2"
              style={{ borderColor: wizardData.formatting.primaryColor }}
            >
              <div className="flex justify-between items-end">
                <div>Coordonnées bancaires</div>
                <div className="text-right">SIRET: 123 456 789 00012</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Cet aperçu reflète les couleurs et styles sélectionnés
            </div>
            <div className="mt-2 text-center">
              <button 
                className="text-xs hover:underline"
                style={{ color: wizardData.formatting.primaryColor }}
              >
                Voir l&apos;aperçu complet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(FormattingStep);