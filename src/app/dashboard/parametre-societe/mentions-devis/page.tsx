'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiEdit,
  FiSave,
  FiX,
  FiInfo,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  // FiLink,
  FiList,
  FiRefreshCw
} from 'react-icons/fi';

export default function MentionsLegalesSurDevis() {
  // State for edit mode
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // State for legal text
  const [legalText, setLegalText] = useState<string>(
    "Devis gratuit. Les prix TTC sont établis sur la base des taux de TVA en vigueur à la date de remise de l'offre. Toute variation de ces taux sera répercutée sur les prix."
  );
  
  // Reference to the editor div
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Update editor content when switching to edit mode
  useEffect(() => {
    if (editorRef.current && editMode) {
      editorRef.current.innerHTML = legalText;
    }
  }, [editMode, legalText]);
  
  // Toggle edit mode
  const toggleEditMode = (): void => {
    if (editMode && editorRef.current) {
      // Save content when exiting edit mode
      setLegalText(editorRef.current.innerHTML);
    }
    setEditMode(!editMode);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (editorRef.current) {
      // Save the edited content
      setLegalText(editorRef.current.innerHTML);
    }
    
    // Show success message and exit edit mode
    alert('Mentions légales mises à jour avec succès!');
    setEditMode(false);
  };
  
  // Handle form reset
  const handleReset = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler les modifications?')) {
      // Reset to original text
      if (editorRef.current) {
        editorRef.current.innerHTML = legalText;
      }
    }
  };
  
  // Reset to default text
  const handleResetToDefault = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le texte par défaut?')) {
      const defaultText = "Devis gratuit. Les prix TTC sont établis sur la base des taux de TVA en vigueur à la date de remise de l'offre. Toute variation de ces taux sera répercutée sur les prix.";
      
      if (editorRef.current) {
        editorRef.current.innerHTML = defaultText;
      }
    }
  };
  
  // Text formatting functions
  const formatText = (command: string, value: string = ''): void => {
    if (!editMode) return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Mentions légales sur devis
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Personnalisez les mentions légales de vos documents commerciaux
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button 
                onClick={toggleEditMode}
                className="p-2 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors duration-200"
              >
                <FiEdit className="w-6 h-6 text-indigo-600" />
              </button>
            ) : (
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiEdit className="w-6 h-6 text-amber-600" />
              </div>
            )}
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg text-amber-800 flex justify-between items-center"
          >
            <div className="flex items-center">
              <FiInfo className="h-5 w-5 mr-2" />
              <span>Mode édition activé. Vous pouvez modifier les mentions légales.</span>
            </div>
          </motion.div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                  <FiFileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Mentions légales</h2>
              </div>
              <p className="text-gray-500 text-sm mt-2 ml-11">
                Vous pouvez personnaliser les mentions obligatoires de vos devis
              </p>
            </div>
            
            <div className="p-6">
              {/* Text Editor Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentions obligatoires de bas de page
                  </label>
                  
                  {/* Text Formatting Toolbar - Only visible in edit mode */}
                  {editMode && (
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
                      <button 
                        type="button"
                        onClick={() => formatText('bold')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Gras"
                      >
                        <FiBold className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => formatText('italic')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Italique"
                      >
                        <FiItalic className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => formatText('underline')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Souligné"
                      >
                        <FiUnderline className="w-4 h-4" />
                      </button>
                      <span className="mx-2 h-6 border-l border-gray-300"></span>
                      <button 
                        type="button"
                        onClick={() => formatText('justifyLeft')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Aligner à gauche"
                      >
                        <FiAlignLeft className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => formatText('justifyCenter')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Centrer"
                      >
                        <FiAlignCenter className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => formatText('justifyRight')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Aligner à droite"
                      >
                        <FiAlignRight className="w-4 h-4" />
                      </button>
                      <span className="mx-2 h-6 border-l border-gray-300"></span>
                      <button 
                        type="button"
                        onClick={() => formatText('insertUnorderedList')}
                        className="p-2 hover:bg-gray-200 rounded"
                        title="Liste à puces"
                      >
                        <FiList className="w-4 h-4" />
                      </button>
                      <div className="flex-grow"></div>
                      <button 
                        type="button"
                        onClick={handleResetToDefault}
                        className="p-2 hover:bg-gray-200 rounded flex items-center text-xs text-gray-700"
                        title="Réinitialiser au texte par défaut"
                      >
                        <FiRefreshCw className="w-3 h-3 mr-1" />
                        <span>Réinitialiser</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Text Editor / Display */}
                  <div 
                    className={`p-4 border rounded-b-lg ${editMode ? 'border-gray-300 min-h-[150px]' : 'border-gray-100 bg-gray-50'} ${editMode ? 'rounded-t-none' : 'rounded-t-lg'}`}
                  >
                    {editMode ? (
                      <div
                        ref={editorRef}
                        contentEditable={true}
                        className="outline-none prose max-w-none text-black"
                        dangerouslySetInnerHTML={{ __html: legalText }}
                      />
                    ) : (
                      <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: legalText }} />
                    )}
                  </div>
                </div>
                
                {/* Extra Info */}
                <div className="mt-6 bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start">
                    <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                      <FiInfo className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        À propos des mentions légales
                      </h3>
                      <p className="text-xs text-blue-700">
                        Les mentions légales sur vos devis sont obligatoires et servent à informer vos clients 
                        des conditions applicables. Elles doivent inclure, entre autres, les informations sur la TVA, 
                        la durée de validité du devis, et les conditions de paiement. Ces mentions peuvent varier selon 
                        votre secteur d&apos;activité et la législation en vigueur.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Template Suggestions */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Suggestions de mentions complémentaires
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs text-gray-700">
                      <p className="font-medium mb-1">Conditions de paiement</p>
                      <p>Acompte de 30% à la commande, solde à la livraison. Pénalités de retard : 3 fois le taux d&apos;intérêt légal.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs text-gray-700">
                      <p className="font-medium mb-1">Durée de validité</p>
                      <p>Le présent devis est valable 30 jours à compter de sa date d&apos;émission.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            {editMode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-gray-200"
              >
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Annuler</span>
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
                >
                  <FiSave className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </button>
              </motion.div>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}