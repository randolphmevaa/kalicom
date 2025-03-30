import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import {
  // FiMail,
  // FiSend,
  // FiEdit,
  // FiTrash2,
  // FiEye,
  // FiSearch,
  // FiFilter,
  FiPlus,
  // FiCopy,
  FiX,
  // FiClock,
  // FiList,
  // FiGrid,
  // FiFileText,
  FiPaperclip,
  // FiUser,
  // FiUsers,
  // FiTag,
  // FiChevronDown
} from 'react-icons/fi';

// TypeScript interfaces
interface Recipient {
  email: string;
  name: string;
}

interface TemplateSection {
  id: string;
  name: string;
  content: string;
}

interface Template {
  id: string;
  nom: string;
  description: string;
  category: string;
  subject: string;
  sections: TemplateSection[];
  variables: string[];
  color: string;
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview: string;
}

interface NotificationData {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

// Add interface for component props
interface EmailComposeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
  }

const EmailComposeDrawer: React.FC<EmailComposeDrawerProps> = ({ isOpen, onClose }) => {
  // State for drawer
//   const [drawerOpen, setDrawerOpen] = useState(true);
  const [composeMode ] = useState(true);

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>([{ email: '', name: '' }]);
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Variable selector state
  const [showVariableSelector, setShowVariableSelector] = useState<boolean>(false);
  const [variableSearchTerm, setVariableSearchTerm] = useState<string>('');
  
  // Primary color for styling
  const primaryColor = '#1B0353';

  // Templates data (simplified from your original data)
  const templatesData: Template[] = [
    {
      id: 'TPL-E001',
      nom: 'Email Devis',
      description: "Template d'email pour l'envoi de devis",
      category: 'Commercial',
      subject: 'Votre devis [REF_DEVIS]',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Suite à notre échange, veuillez trouver ci-joint votre devis [REF_DEVIS].' },
        { id: 'details', name: 'Détails', content: 'Ce devis comprend [DESCRIPTION_PROJET] pour un montant total de [MONTANT] €.' },
        { id: 'instructions', name: 'Instructions', content: 'Pour accepter ce devis, veuillez [INSTRUCTIONS_ACCEPTATION].' },
        { id: 'validity', name: 'Validité', content: 'Ce devis est valable jusqu\'au [DATE_VALIDITE].' },
        { id: 'closing', name: 'Conclusion', content: 'N\'hésitez pas à nous contacter pour toute question.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_DEVIS', 'DESCRIPTION_PROJET', 'MONTANT', 'INSTRUCTIONS_ACCEPTATION', 'DATE_VALIDITE', 'EXPEDITEUR_NOM'
      ],
      color: '#4F46E5'
    },
    {
      id: 'TPL-E002',
      nom: 'Email Facture',
      description: "Template d'email pour l'envoi de factures",
      category: 'Comptabilité',
      subject: 'Votre facture [REF_FACTURE]',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: 'Veuillez trouver ci-joint votre facture [REF_FACTURE].' },
        { id: 'details', name: 'Détails', content: 'Cette facture concerne [DESCRIPTION_SERVICE] pour un montant de [MONTANT] €.' },
        { id: 'payment', name: 'Paiement', content: 'Nous vous remercions de bien vouloir régler cette facture avant le [DATE_ECHEANCE].' },
        { id: 'methods', name: 'Moyens de paiement', content: 'Vous pouvez effectuer votre règlement par [MOYENS_PAIEMENT].' },
        { id: 'closing', name: 'Conclusion', content: 'Nous vous remercions de votre confiance.' },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_FACTURE', 'DESCRIPTION_SERVICE', 'MONTANT', 'DATE_ECHEANCE', 'MOYENS_PAIEMENT', 'EXPEDITEUR_NOM'
      ],
      color: '#F59E0B'
    },
    {
      id: 'TPL-E003',
      nom: 'Email Relance',
      description: "Template d'email pour relance de paiement",
      category: 'Comptabilité',
      subject: 'Rappel : Facture [REF_FACTURE] échue',
      sections: [
        { id: 'salutation', name: 'Salutation', content: 'Cher [CLIENT_NOM],' },
        { id: 'intro', name: 'Introduction', content: "Nous nous permettons de vous rappeler que la facture [REF_FACTURE] d'un montant de [MONTANT] € est échue depuis le [DATE_ECHEANCE]." },
        { id: 'details', name: 'Détails', content: 'Cette facture concerne [DESCRIPTION_SERVICE] et devait être réglée il y a [JOURS_RETARD] jours.' },
        { id: 'action', name: 'Action', content: 'Nous vous prions de bien vouloir procéder au règlement dans les plus brefs délais.' },
        { id: 'closing', name: 'Conclusion', content: "Si votre paiement a été effectué entre-temps, nous vous prions d'ignorer ce message." },
        { id: 'signature', name: 'Signature', content: 'Cordialement, [EXPEDITEUR_NOM]' }
      ],
      variables: [
        'CLIENT_NOM', 'REF_FACTURE', 'MONTANT', 'DATE_ECHEANCE', 'DESCRIPTION_SERVICE', 'JOURS_RETARD', 'EXPEDITEUR_NOM'
      ],
      color: '#EF4444'
    }
  ];

  // Functions
  const getVariablesForTemplate = (templateId: string): string[] => {
    const template = templatesData.find(t => t.id === templateId);
    return template ? template.variables : [];
  };

  const getAllTemplateVariables = (): string[] => {
    const allVariables = new Set<string>();
    templatesData.forEach(template => {
      template.variables.forEach(variable => {
        allVariables.add(variable);
      });
    });
    return Array.from(allVariables);
  };

  const getFilteredVariables = (): string[] => {
    const variables = selectedTemplate 
      ? getVariablesForTemplate(selectedTemplate) 
      : getAllTemplateVariables();
    
    if (!variableSearchTerm) return variables;
    
    return variables.filter(v => 
      v.toLowerCase().includes(variableSearchTerm.toLowerCase())
    );
  };

  const handleTemplateChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (!templateId) {
      // If clearing template, don't modify content
      return;
    }
    
    const template = templatesData.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      
      // Combine all sections into content
      const newContent = template.sections
        .map(section => section.content)
        .join('\n\n');
      
      setContent(newContent);
    }
  };

  const handleAddRecipient = (): void => {
    setRecipients([...recipients, { email: '', name: '' }]);
  };

  const handleRemoveRecipient = (index: number): void => {
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
  };

  const handleRecipientChange = (index: number, field: keyof Recipient, value: string): void => {
    const newRecipients = [...recipients];
    newRecipients[index] = { ...newRecipients[index], [field]: value };
    setRecipients(newRecipients);
  };

  const insertVariable = (variable: string): void => {
    setContent(prev => {
      const textarea = document.getElementById('email-content') as HTMLTextAreaElement | null;
      if (!textarea) return prev;
      
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      
      const newContent = prev.substring(0, start) + 
        `[${variable}]` + 
        prev.substring(end);
      
      // After state update, reset cursor position correctly
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          const newPosition = start + variable.length + 2; // +2 for [ and ]
          textarea.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
      
      return newContent;
    });
    
    setShowVariableSelector(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList): void => {
    const newFiles: FileAttachment[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      // In a real app, you'd handle file content differently
      // Here we're just creating preview URLs for display
      preview: URL.createObjectURL(file)
    }));
    
    setAttachments([...attachments, ...newFiles]);
    
    // Show notification
    displayNotification(`${newFiles.length} fichier(s) ajouté(s)`, "success");
  };

  const removeAttachment = (index: number): void => {
    const newAttachments = [...attachments];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newAttachments[index].preview);
    
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const displayNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info'): void => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Update all closeDrawer calls to use the prop
  const closeDrawer = () => {
    onClose(); // Use the provided onClose function
  };

  const handleScheduleToggle = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsScheduled(e.target.checked);
    if (e.target.checked && !scheduledDate) {
      // Set default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      // Format for datetime-local input
      const formattedDate = tomorrow.toISOString().slice(0, 16);
      setScheduledDate(formattedDate);
    }
  };

  const sendEmail = (): void => {
    // Validation
    if (recipients.length === 0 || recipients.some(r => !r.email)) {
      displayNotification("Veuillez spécifier au moins un destinataire", "error");
      return;
    }
    
    if (!subject) {
      displayNotification("Veuillez spécifier un objet", "error");
      return;
    }
    
    if (!content) {
      displayNotification("Veuillez saisir le contenu de l'email", "error");
      return;
    }
    
    if (isScheduled && !scheduledDate) {
      displayNotification("Veuillez spécifier une date d'envoi", "error");
      return;
    }
    
    // In a real application, you would send the email data to your backend
    console.log({
      recipients,
      subject,
      content,
      attachments,
      isScheduled,
      scheduledDate,
      selectedTemplate
    });
    
    // Show success message
    displayNotification(
      isScheduled ? "Email programmé avec succès" : "Email envoyé avec succès", 
      "success"
    );
    
    // Close drawer after sending
    closeDrawer();
  };

  const saveAsDraft = (): void => {
    // In a real application, you would save the draft to your backend
    console.log({
      recipients,
      subject,
      content,
      attachments,
      isScheduled,
      scheduledDate,
      selectedTemplate,
      status: 'draft'
    });
    
    displayNotification("Email enregistré comme brouillon", "success");
    closeDrawer();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end ${!isOpen ? 'hidden' : ''}`}
      onClick={closeDrawer}
    >
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white shadow-2xl h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="text-gray-600 p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {composeMode ? 'Composer un email' : 'Modifier l\'email'}
            </h3>
            <button 
              onClick={closeDrawer}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <FiX />
            </button>
          </div>
          
          <div className="text-gray-600 p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                >
                  <option value="">Sélectionner un modèle</option>
                  {templatesData.map(template => (
                    <option key={template.id} value={template.id}>{template.nom}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataires</label>
                <div className="space-y-2">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <input 
                          type="email"
                          placeholder="email@exemple.com"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                          value={recipient.email}
                          onChange={(e) => handleRecipientChange(index, 'email', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <input 
                          type="text"
                          placeholder="Nom (optionnel)"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                          value={recipient.name}
                          onChange={(e) => handleRecipientChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => recipients.length > 1 ? handleRemoveRecipient(index) : null}
                        className={`p-2 rounded-lg ${recipients.length > 1 ? 'text-red-600 hover:bg-red-50' : 'text-gray-300'}`}
                        disabled={recipients.length <= 1}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddRecipient}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <FiPlus className="mr-1" />
                    Ajouter un destinataire
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                <input 
                  type="text"
                  placeholder="Objet de l'email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea 
                  id="email-content"
                  placeholder="Contenu de l'email..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {selectedTemplate && getVariablesForTemplate(selectedTemplate).slice(0, 5).map((variable) => (
                    <span 
                      key={variable}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded-lg text-sm cursor-pointer hover:bg-gray-300"
                      onClick={() => insertVariable(variable)}
                    >
                      [{variable}]
                    </span>
                  ))}
                  
                  <button 
                    className="px-2 py-1 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => setShowVariableSelector(!showVariableSelector)}
                  >
                    + Ajouter une variable
                  </button>
                </div>
                
                {showVariableSelector && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Rechercher une variable..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        value={variableSearchTerm}
                        onChange={(e) => setVariableSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto p-1">
                      {getFilteredVariables().map((variable) => (
                        <div
                          key={variable}
                          className="p-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
                          onClick={() => insertVariable(variable)}
                        >
                          [{variable}]
                        </div>
                      ))}
                      {getFilteredVariables().length === 0 && (
                        <div className="p-2 text-gray-500 text-sm">
                          Aucune variable trouvée
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pièces jointes</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FiPaperclip className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-sm text-gray-500">Glissez-déposez des fichiers ici ou</p>
                  <button 
                    className="mt-2 px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Parcourir vos fichiers
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
                
                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Fichiers attachés:</p>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FiPaperclip className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeAttachment(index)}
                          className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planification</label>
                <div className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id="schedule" 
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                    checked={isScheduled}
                    onChange={handleScheduleToggle}
                  />
                  <label htmlFor="schedule" className="ml-2 text-sm text-gray-700">
                    Planifier l&apos;envoi
                  </label>
                </div>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-gray-700"
                  disabled={!isScheduled}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t flex justify-end space-x-2">
            <button 
              onClick={closeDrawer}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button 
              className="px-4 py-2 border text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
              onClick={saveAsDraft}
            >
              Enregistrer comme brouillon
            </button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white rounded-lg shadow-sm hover:shadow transition"
              style={{ backgroundColor: primaryColor }}
              onClick={sendEmail}
            >
              {isScheduled ? 'Programmer l\'envoi' : 'Envoyer maintenant'}
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            notification.type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {notification.type === 'success' && <FiCheck className="text-green-500" />}
            {notification.type === 'warning' && <FiAlertTriangle className="text-amber-500" />}
            {notification.type === 'error' && <FiX className="text-red-500" />}
            {notification.type === 'info' && <FiInfo className="text-blue-500" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Helper components
interface IconProps {
  className?: string;
}

const FiCheck: React.FC<IconProps> = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const FiAlertTriangle: React.FC<IconProps> = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const FiInfo: React.FC<IconProps> = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default EmailComposeDrawer;