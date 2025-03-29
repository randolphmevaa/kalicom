'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiSave,
  FiX,
  FiInfo,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiRefreshCw
} from 'react-icons/fi';

export default function MentionsLegalesSurDevis() {
  // State for legal text
  const [legalText, setLegalText] = useState<string>(
    "Devis gratuit. Les prix TTC sont établis sur la base des taux de TVA en vigueur à la date de remise de l'offre. Toute variation de ces taux sera répercutée sur les prix."
  );
  
  // Reference to the editor div
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = legalText;
    }
  }, [legalText]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (editorRef.current) {
      // Save the edited content
      setLegalText(editorRef.current.innerHTML);
    }
    
    // Show success message
    alert('Mentions légales mises à jour avec succès!');
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
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Animation variants for header
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen bg-gray-50"
    >
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pb-16">
        {/* New Header with gradient styling */}
        <motion.div
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-white/70 to-indigo-400/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <FiFileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-500">
                    Mentions légales sur devis
                  </h1>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Personnalisez les mentions légales de vos documents commerciaux. Ces mentions apparaîtront sur tous vos devis.
                </p>
              </div>
            </div>
            
            {/* Quick tip */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
              <FiInfo className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-amber-700">Astuce :</span>{' '}
                <span className="text-amber-700">
                  Utilisez les outils de mise en forme pour personnaliser l&apos;apparence de vos mentions légales. N&apos;oubliez pas d&apos;enregistrer vos modifications.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

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
                  
                  {/* Text Formatting Toolbar - Always visible now */}
                  <div className="text-gray-700 flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
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
                  
                  {/* Text Editor - Always editable now */}
                  <div className="p-4 border border-gray-300 rounded-b-lg min-h-[150px]">
                    <div
                      ref={editorRef}
                      contentEditable={true}
                      className="outline-none prose max-w-none text-black"
                      dangerouslySetInnerHTML={{ __html: legalText }}
                    />
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
            
            {/* Form Actions - Always visible now */}
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
          </div>
        </form>
      </div>
    </motion.div>
  );
}
