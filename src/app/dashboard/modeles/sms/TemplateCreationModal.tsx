import React, { useState,  JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiCheck,
  FiPlus,
  FiSave,
//   FiTrash2,
  FiEye,
  FiEdit,
//   FiSmile,
  FiHelpCircle,
  FiAlertCircle,
  FiArrowLeft,
//   FiTag
} from 'react-icons/fi';

// Define proper interfaces for our component state
interface TemplateData {
    id: string;
    nom: string;
    description: string;
    dateCreation: string;
    derniereMaj: string;
    isDefault: boolean;
    category: string;
    content: string;
    variables: string[];
    maxLength: number;
    emojis: boolean;
    usageCount: number;
    color: string;
  }
  
  interface FormErrors {
    nom?: string;
    description?: string;
    content?: string;
    [key: string]: string | undefined;
  }

  export default function TemplateCreationModal(): JSX.Element {
    // State to control modal visibility
    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    // State for the new template
    const [newTemplate, setNewTemplate] = useState<TemplateData>({
      id: '',
      nom: '',
      description: '',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false,
      category: 'Rendez-vous',
      content: '',
      variables: [],
      maxLength: 160,
      emojis: true,
      usageCount: 0,
      color: '#4F46E5' // Default color
    });
    
    // State for form validation
    const [errors, setErrors] = useState<FormErrors>({});
    
    // State for UI components
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [showVariableInput, setShowVariableInput] = useState<boolean>(false);
    const [newVariable, setNewVariable] = useState<string>('');
    
    // All available categories
    const categories: string[] = [
      'Rendez-vous',
      'Marketing',
      'Logistique',
      'Sécurité',
      'Service client',
      'Autre'
    ];

  // Colors to choose from
  const colorOptions: string[] = [
    '#4F46E5', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#0EA5E9', // Sky blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#6B7280'  // Gray
  ];
  
  // Emoji options for quick selection
  const emojiOptions: string[] = ['😊', '🎉', '📅', '⚠️', '📦', '💼', '🚀', '✅', '❤️', '📱', '📢', '🔐'];
  
  // Primary accent color
  const primaryColor: string = '#1B0353';
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!newTemplate.nom.trim()) {
      newErrors.nom = "Le nom du modèle est requis";
    }
    
    if (!newTemplate.description.trim()) {
      newErrors.description = "La description est requise";
    }
    
    if (!newTemplate.content.trim()) {
      newErrors.content = "Le contenu du modèle est requis";
    } else if (newTemplate.content.length > newTemplate.maxLength) {
      newErrors.content = `Le contenu dépasse la limite de ${newTemplate.maxLength} caractères`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Generate a unique ID for the template
  const generateTemplateId = (): string => {
    // In a real app, you'd want to ensure this is unique against existing IDs
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `TPL-S${randomNum}`;
  };
  
  // Handle opening the modal
  const handleOpenModal = (): void => {
    // Reset the form and open the modal
    setNewTemplate({
      id: generateTemplateId(),
      nom: '',
      description: '',
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false,
      category: 'Rendez-vous',
      content: '',
      variables: [],
      maxLength: 160,
      emojis: true,
      usageCount: 0,
      color: '#4F46E5'
    });
    setCurrentStep(1);
    setErrors({});
    setIsOpen(true);
  };
  
  // Handle closing the modal
  const handleCloseModal = (): void => {
    setIsOpen(false);
  };
  
  // Handle saving the template
  const handleSaveTemplate = (): void => {
    if (validateForm()) {
      // In a real implementation, you would add the template to your state
      // const updatedTemplates = [...templatesData, newTemplate];
      // setTemplatesData(updatedTemplates);
      
      // Mock successful save notification
      // displayNotification("Modèle créé avec succès", "success");
      
      handleCloseModal();
    }
  };
  
  // Handle adding a variable
  const handleAddVariable = (): void => {
    if (newVariable.trim() && !newTemplate.variables.includes(newVariable.trim())) {
      setNewTemplate({
        ...newTemplate,
        variables: [...newTemplate.variables, newVariable.trim()]
      });
      setNewVariable('');
      setShowVariableInput(false);
    }
  };
  
  // Handle removing a variable
  const handleRemoveVariable = (variable: string): void => {
    setNewTemplate({
      ...newTemplate,
      variables: newTemplate.variables.filter(v => v !== variable)
    });
  };
  
  // Handle adding an emoji to the content
  const handleAddEmoji = (emoji: string): void => {
    setNewTemplate({
      ...newTemplate,
      content: newTemplate.content + emoji
    });
  };
  
  // Move to the next step
  const handleNextStep = (): void => {
    if (currentStep === 1) {
      if (newTemplate.nom.trim() && newTemplate.description.trim()) {
        setCurrentStep(2);
      } else {
        validateForm();
      }
    }
  };
  
  // Move to the previous step
  const handlePreviousStep = (): void => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  // Preview of SMS content with variables highlighted
  const renderContentPreview = (): JSX.Element => {
    let content = newTemplate.content;
    
    // Highlight variables in the content
    newTemplate.variables.forEach(variable => {
      const regex = new RegExp(`\\[${variable}\\]`, 'g');
      content = content.replace(regex, `<span class="bg-blue-100 text-blue-800 px-1 rounded">[${variable}]</span>`);
    });
    
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };
  
  // Calculate character count and SMS count
  const charCount = newTemplate.content.length;
  const smsCount = Math.ceil(charCount / 160) || 1;
  
  return (
    <div>
      {/* Button to open the modal */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-1 px-3 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
        style={{ background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)` }}
        onClick={handleOpenModal}
      >
        <FiPlus />
        <span>Créer un modèle</span>
      </motion.button>
      
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <FiEdit className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {currentStep === 1 ? "Créer un nouveau modèle" : "Configurer le contenu du modèle"}
                  </h2>
                </div>
                <button 
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                  onClick={handleCloseModal}
                >
                  <FiX size={20} />
                </button>
              </div>
              
              {/* Progress indicator */}
              <div className="px-6 pt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: currentStep === 1 ? '50%' : '100%',
                      background: `linear-gradient(to right, ${primaryColor}, #4F0F9F)`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span className={currentStep >= 1 ? 'font-medium text-indigo-700' : ''}>Informations de base</span>
                  <span className={currentStep >= 2 ? 'font-medium text-indigo-700' : ''}>Contenu du modèle</span>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du modèle <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:border-transparent focus:ring-indigo-500`}
                        placeholder="Ex: Confirmation de rendez-vous"
                        value={newTemplate.nom}
                        onChange={(e) => setNewTemplate({...newTemplate, nom: e.target.value})}
                      />
                      {errors.nom && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="mr-1" size={14} />
                          {errors.nom}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:border-transparent focus:ring-indigo-500 min-h-20`}
                        placeholder="Décrivez l'utilité de ce modèle..."
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="mr-1" size={14} />
                          {errors.description}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent focus:ring-indigo-500"
                        value={newTemplate.category}
                        onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur du modèle
                      </label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {colorOptions.map((color) => (
                          <div 
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${newTemplate.color === color ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                            style={{ 
                              backgroundColor: color,
                            //   ringColor: color
                            }}
                            onClick={() => setNewTemplate({...newTemplate, color: color})}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4">
                      <input 
                        type="checkbox" 
                        id="allow-emojis"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={newTemplate.emojis}
                        onChange={(e) => setNewTemplate({...newTemplate, emojis: e.target.checked})}
                      />
                      <label htmlFor="allow-emojis" className="ml-2 block text-sm text-gray-700">
                        Autoriser les emojis dans ce modèle
                      </label>
                    </div>
                    
                    <div className="flex items-center mt-2">
                      <input 
                        type="checkbox" 
                        id="is-default"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={newTemplate.isDefault}
                        onChange={(e) => setNewTemplate({...newTemplate, isDefault: e.target.checked})}
                      />
                      <label htmlFor="is-default" className="ml-2 block text-sm text-gray-700">
                        Définir comme modèle par défaut
                      </label>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 2: Template Content */}
                {currentStep === 2 && (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Contenu du modèle <span className="text-red-500">*</span>
                        </label>
                        <span className={`text-xs ${charCount > newTemplate.maxLength ? 'text-red-500' : 'text-gray-500'}`}>
                          {charCount}/{newTemplate.maxLength} caractères · {smsCount} SMS
                        </span>
                      </div>
                      <textarea 
                        className={`w-full p-3 border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:border-transparent focus:ring-indigo-500 min-h-32`}
                        placeholder="Rédigez votre message ici... Utilisez [VARIABLE] pour insérer des variables."
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="mr-1" size={14} />
                          {errors.content}
                        </p>
                      )}
                      
                      {/* Emojis row */}
                      {newTemplate.emojis && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {emojiOptions.map(emoji => (
                            <button 
                              key={emoji}
                              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 transition"
                              onClick={() => handleAddEmoji(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Variables disponibles
                        </label>
                        <button 
                          className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                          onClick={() => setShowVariableInput(!showVariableInput)}
                        >
                          <FiPlus size={14} className="mr-1" />
                          Ajouter une variable
                        </button>
                      </div>
                      
                      {/* Variable input */}
                      <AnimatePresence>
                        {showVariableInput && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-2 overflow-hidden"
                          >
                            <div className="flex">
                              <input 
                                type="text" 
                                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:border-transparent focus:ring-indigo-500"
                                placeholder="NOM_VARIABLE"
                                value={newVariable}
                                onChange={(e) => setNewVariable(e.target.value.toUpperCase().replace(/\s+/g, '_'))}
                              />
                              <button 
                                className="px-3 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700"
                                onClick={handleAddVariable}
                              >
                                <FiCheck size={18} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Utilisez des noms courts et descriptifs sans espaces. Ex: NOM_CLIENT
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Variable tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTemplate.variables.length > 0 ? (
                          newTemplate.variables.map((variable) => (
                            <div 
                              key={variable}
                              className="flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm"
                            >
                              <span className="mr-1">[{variable}]</span>
                              <button 
                                className="text-indigo-600 hover:text-indigo-800"
                                onClick={() => handleRemoveVariable(variable)}
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            Aucune variable définie. Ajoutez des variables pour personnaliser vos messages.
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Template preview */}
                    <div>
                      <button 
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <FiEye size={16} className="mr-1" />
                        {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
                      </button>
                      
                      <AnimatePresence>
                        {showPreview && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 p-4 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <h4 className="font-medium text-gray-900 mb-2">Aperçu du message</h4>
                            <div className="text-gray-700">
                              {renderContentPreview()}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Help tip */}
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg text-blue-800 text-sm">
                      <FiHelpCircle className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Astuce pour les variables</p>
                        <p>
                          Utilisez le format [NOM_VARIABLE] dans votre texte. Lors de l&apos;envoi, ces variables 
                          seront remplacées par les données spécifiques à chaque destinataire.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                {currentStep === 1 ? (
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center"
                    onClick={handleCloseModal}
                  >
                    <FiX className="mr-2" />
                    Annuler
                  </button>
                ) : (
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex items-center"
                    onClick={handlePreviousStep}
                  >
                    <FiArrowLeft className="mr-2" />
                    Précédent
                  </button>
                )}
                
                {currentStep === 1 ? (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                    onClick={handleNextStep}
                  >
                    Suivant
                  </motion.button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
                    onClick={handleSaveTemplate}
                  >
                    <FiSave className="mr-2" />
                    Enregistrer le modèle
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
