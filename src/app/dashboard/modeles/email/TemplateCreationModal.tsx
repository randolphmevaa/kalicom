import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiPlus } from 'react-icons/fi';

// Define types for the component props
interface TemplateCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
  primaryColor: string;
}

// Template section structure
interface TemplateSection {
  id: string;
  name: string;
  content: string;
}

// Template data structure
interface TemplateData {
  nom: string;
  description: string;
  subject: string;
  category: string;
  sections: TemplateSection[];
  variables: string[];
  color: string;
}

// Complete email template structure
interface EmailTemplate extends TemplateData {
  id: string;
  dateCreation: string;
  derniereMaj: string;
  isDefault: boolean;
  usageCount: number;
  htmlContent: string;
}

// Define type for CSS properties with custom variables
interface CustomCSSProperties extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

// Template Creation Modal Component
const TemplateCreationModal: React.FC<TemplateCreationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  primaryColor 
}) => {
  const [templateData, setTemplateData] = React.useState<TemplateData>({
    nom: '',
    description: '',
    subject: '',
    category: 'Commercial',
    sections: [
      { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
      { id: 'intro', name: 'Introduction', content: 'Suite à notre échange...' },
      { id: 'details', name: 'Détails', content: 'Ce message concerne...' },
      { id: 'closing', name: 'Conclusion', content: 'N\'hésitez pas à nous contacter pour toute question.' },
      { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
    ],
    variables: ['CLIENT_NOM', 'EXPEDITEUR_NOM'],
    color: '#4F46E5'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemplateData({
      ...templateData,
      [name]: value
    });
  };

  const handleSectionChange = (id: string, value: string) => {
    setTemplateData({
      ...templateData,
      sections: templateData.sections.map(section => 
        section.id === id ? { ...section, content: value } : section
      )
    });
  };

  const handleAddSection = () => {
    const newSection: TemplateSection = { 
      id: `section-${Date.now()}`, 
      name: 'Nouvelle Section', 
      content: 'Contenu de la section...' 
    };
    setTemplateData({
      ...templateData,
      sections: [...templateData.sections, newSection]
    });
  };

  const handleRemoveSection = (id: string) => {
    setTemplateData({
      ...templateData,
      sections: templateData.sections.filter(section => section.id !== id)
    });
  };

  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    const variableInput = document.getElementById('new-variable') as HTMLInputElement | null;
    
    if (variableInput) {
      const newVariable = variableInput.value.trim().toUpperCase();
      
      if (newVariable && !templateData.variables.includes(newVariable)) {
        setTemplateData({
          ...templateData,
          variables: [...templateData.variables, newVariable]
        });
        variableInput.value = '';
      }
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setTemplateData({
      ...templateData,
      variables: templateData.variables.filter(v => v !== variable)
    });
  };

  const handleSave = () => {
    // Create a new template with a unique ID and initial values
    const newTemplate: EmailTemplate = {
      ...templateData,
      id: `TPL-E${Math.floor(Math.random() * 9000) + 1000}`,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      derniereMaj: new Date().toLocaleDateString('fr-FR'),
      isDefault: false,
      usageCount: 0,
      htmlContent: '<div class="template">Contenu HTML généré...</div>',
    };
    
    onSave(newTemplate);
  };

  const categoryOptions = ['Commercial', 'Comptabilité', 'Marketing', 'Support', 'Autre'];
  const colorOptions = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Bleu', value: '#0EA5E9' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Créer un nouveau modèle</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <FiX />
              </button>
            </div>

            {/* Content */}
            <div className="text-gray-700 p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom du modèle*
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={templateData.nom}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                      placeholder="Ex: Email de bienvenue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={templateData.description}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                      rows={2}
                      placeholder="Décrivez l'usage de ce modèle..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objet de l&apos;email*
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={templateData.subject}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                      placeholder="Ex: Bienvenue chez [ENTREPRISE_NOM]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={templateData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                      >
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Couleur
                      </label>
                      <div className="flex space-x-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`w-6 h-6 rounded-full border-2 ${
                              templateData.color === color.value
                                ? 'border-gray-800'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() =>
                              setTemplateData({ ...templateData, color: color.value })
                            }
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variables
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg mb-2 min-h-[80px]">
                      {templateData.variables.map((variable) => (
                        <div
                          key={variable}
                          className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm group"
                        >
                          <span>[{variable}]</span>
                          <button
                            type="button"
                            className="ml-1 text-gray-400 invisible group-hover:visible hover:text-red-500"
                            onClick={() => handleRemoveVariable(variable)}
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id="new-variable"
                        placeholder="Nouvelle variable"
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200"
                        onClick={handleAddVariable}
                      >
                        Ajouter
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez des variables entre crochets comme [CLIENT_NOM] dans le contenu de votre modèle.
                    </p>
                  </div>
                </div>

                {/* Right Column - Template Content */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Sections du modèle
                      </label>
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                        onClick={handleAddSection}
                      >
                        <FiPlus size={12} className="mr-1" />
                        Ajouter une section
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {templateData.sections.map((section) => (
                        <div key={section.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">
                              {section.name}
                            </label>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveSection(section.id)}
                              disabled={templateData.sections.length <= 2}
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                          <textarea
                            value={section.content}
                            onChange={(e) => handleSectionChange(section.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': `${primaryColor}40` } as CustomCSSProperties}
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h4>
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg">
                        <span className="font-medium">Objet: </span>
                        {templateData.subject || "Pas d'objet défini"}
                      </div>
                      <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg max-h-[200px] overflow-y-auto">
                        {templateData.sections.map((section, index) => (
                          <div key={section.id} className="mb-2">
                            {section.content}
                            {index < templateData.sections.length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-4 py-2 flex items-center space-x-1 text-white rounded-lg transition"
                style={{ backgroundColor: primaryColor }}
                disabled={!templateData.nom || !templateData.description || !templateData.subject}
              >
                <FiSave className="mr-1" />
                <span>Enregistrer</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateCreationModal;