'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  // FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiSend,
  FiChevronLeft,
  // FiChevronDown,
  FiImage,
  FiFileText,
  FiUser,
  FiUsers,
  // FiSettings,
  FiFilter,
  FiMoon,
  FiSun,
  FiInfo,
  // FiCheck,
  FiEdit,
  FiArrowRightCircle,
  FiPlus,
  FiX,
  FiClock,
  FiAlertCircle,
  // FiGlobe,
  FiStar,
  FiArchive,
  FiTrash2,
  // FiRotateCcw,
  // FiFlag,
  FiMail,
  FiRefreshCw,
  // FiPieChart,
  // FiTrendingUp,
  // FiBarChart2,
  // FiDollarSign,
  FiUserPlus,
  // FiCheckCircle,
  // FiArrowUp,
  // FiArrowDown,
  // FiSliders,
  // FiGrid,
  // FiList,
  FiTag,
  FiClipboard,
  // FiBriefcase,
  // FiHash,
  // FiTarget,
  FiDownload,
  // FiUpload,
  // FiServer,
  // FiBox,
  // FiAward,
  // FiBell,
  FiInbox,
  FiSend as FiPaperAirplane,
  // FiBookmark,
  FiEdit3,
  FiMenu,
  FiPlay
} from 'react-icons/fi';

// Email type definitions
interface IEmail {
  id: string;
  subject: string;
  sender: ISender;
  recipients: IRecipient[];
  cc?: IRecipient[];
  bcc?: IRecipient[];
  body: string;
  snippet: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labels: string[];
  folder: "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived";
  attachments?: IAttachment[];
  threadId: string;
  accountId: string;
}

interface ISender {
  name: string;
  email: string;
  avatar?: string;
}

interface IRecipient {
  name: string;
  email: string;
  avatar?: string;
}

interface IAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "document" | "spreadsheet" | "presentation" | "other";
  size: number;
  url?: string;
  thumbnail?: string;
}

// Gmail account type
interface IGmailAccount {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  status: "connected" | "disconnected" | "connecting";
  unreadCount: number;
  lastChecked: string;
  signature?: string;
  isDefault: boolean;
  quota: {
    used: number;
    total: number;
  }
}

// Email template type
interface IEmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: "sales" | "marketing" | "support" | "general";
  isSystem: boolean;
  lastUsed?: string;
}

// Email label colors
const labelColors = {
  "inbox": { bg: "#f0f7ff", text: "#213f5b", icon: FiInbox },
  "sent": { bg: "#f0fff5", text: "#0f766e", icon: FiPaperAirplane },
  "drafts": { bg: "#f9fafb", text: "#6b7280", icon: FiEdit },
  "starred": { bg: "#fffbeb", text: "#b45309", icon: FiStar },
  "important": { bg: "#fef2f2", text: "#b91c1c", icon: FiAlertCircle },
  "spam": { bg: "#fff5f5", text: "#e53e3e", icon: FiAlertCircle },
  "trash": { bg: "#f3f4f6", text: "#4b5563", icon: FiTrash2 },
  "archived": { bg: "#f5f3ff", text: "#6d28d9", icon: FiArchive },
  "social": { bg: "#eef2ff", text: "#4338ca", icon: FiUsers },
  "updates": { bg: "#ecfeff", text: "#0e7490", icon: FiRefreshCw },
  "promotions": { bg: "#f0f9ff", text: "#0369a1", icon: FiTag },
  "forums": { bg: "#fff7ed", text: "#c2410c", icon: FiUser },
  "work": { bg: "#f8fafc", text: "#0f172a", icon: FiFileText },
  "personal": { bg: "#fffbeb", text: "#b45309", icon: FiUser },
  "scheduled": { bg: "#f5f3ff", text: "#7e22ce", icon: FiClock },
};

// Template category colors
const templateCategories = {
  "sales": { color: "#bfddf9", gradient: "from-blue-500 to-blue-600" },
  "marketing": { color: "#d2fcb2", gradient: "from-green-500 to-green-600" },
  "support": { color: "#89c4f7", gradient: "from-cyan-500 to-cyan-600" },
  "general": { color: "#d1d5db", gradient: "from-gray-400 to-gray-500" },
};

// Add Account Modal
const AddAccountModal = ({ isOpen, onClose, onAccountAdded }: { isOpen: boolean; onClose: () => void; onAccountAdded: (account: IGmailAccount) => void; }) => {
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authCode, setAuthCode] = useState('');
  
  const resetForm = () => {
    setAccountName('');
    setEmail('');
    setStep(1);
    setAuthCode('');
  };
  
  const handleSubmit = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const newAccount: IGmailAccount = {
          id: `acc_${Date.now()}`,
          email,
          name: accountName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName)}&background=213f5b&color=fff`,
          status: "connected",
          unreadCount: 0,
          lastChecked: new Date().toISOString(),
          signature: `<p>Cordialement,<br>${accountName}</p>`,
          isDefault: false,
          quota: {
            used: 0,
            total: 15 * 1024 * 1024 * 1024 // 15 GB
          }
        };
        
        onAccountAdded(newAccount);
        setLoading(false);
        onClose();
        resetForm();
      }, 2000);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-indigo-500 p-4 flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Ajouter un compte Gmail</h2>
          <button onClick={() => { onClose(); resetForm(); }} className="p-1 rounded-full hover:bg-white/20">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Connectez votre compte Gmail pour l&apos;intégrer à votre CRM.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du compte</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Ex: Gmail Professionnel"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votremail@gmail.com"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { onClose(); resetForm(); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accountName || !email}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    accountName && email
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                >
                  Continuer
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Autoriser l&apos;accès à Gmail</h3>
                  <p className="text-gray-600 text-sm">Entrez le code de vérification envoyé à votre adresse email</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code de vérification</label>
                    <input
                      type="text"
                      value={authCode}
                      onChange={(e) => setAuthCode(e.target.value)}
                      placeholder="Entrez le code à 6 chiffres"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-center text-xl tracking-widest"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100">
                      <FiInfo className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Comment ça marche</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Un code a été envoyé à l&apos;adresse {email}. Entrez ce code pour autoriser l&apos;accès à votre compte Gmail.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || authCode.length < 6}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    loading || authCode.length < 6
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    "Valider"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Email Template Modal
interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: IEmailTemplate) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onTemplateCreated }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [category, setCategory] = useState<"general" | "sales" | "marketing" | "support">('general');
  const [loading, setLoading] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  
  const handleSubmit = () => {
    if (!templateName || !templateSubject || !templateBody) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newTemplate = {
        id: `template_${Date.now()}`,
        name: templateName,
        subject: templateSubject,
        body: templateBody,
        variables,
        category,
        isSystem: false,
        lastUsed: new Date().toISOString()
      };
      
      onTemplateCreated(newTemplate);
      setLoading(false);
      resetForm();
      onClose();
    }, 1000);
  };
  
  const resetForm = () => {
    setTemplateName('');
    setTemplateSubject('');
    setTemplateBody('');
    setCategory('general');
    setVariables([]);
    setNewVariable('');
  };
  
  const addVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables([...variables, newVariable.trim()]);
      setNewVariable('');
    }
  };
  
  const removeVariable = (varToRemove: string) => {
    setVariables(variables.filter(v => v !== varToRemove));
  };
  
  const insertVariableIntoContent = (variable: string) => {
    const textArea = document.getElementById('templateBody') as HTMLTextAreaElement;
    const cursorPosition = textArea?.selectionStart || 0;
    const textBefore = templateBody.substring(0, cursorPosition);
    const textAfter = templateBody.substring(cursorPosition);
    
    const varIndex = variables.indexOf(variable) + 1;
    const textToInsert = `{{${varIndex}}}`;
    
    setTemplateBody(textBefore + textToInsert + textAfter);
    
    // After inserting, set focus back to the textarea and place cursor after the inserted variable
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = textArea.selectionEnd = cursorPosition + textToInsert.length;
    }, 0);
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="bg-blue-500 p-4 flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Créer un template d&apos;email</h2>
          <button onClick={() => { onClose(); resetForm(); }} className="p-1 rounded-full hover:bg-white/20">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du template</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Ex: Confirmation de commande"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                placeholder="Ex: Votre commande #{{1}} a été confirmée"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as "general" | "sales" | "marketing" | "support")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="general">Général</option>
                  <option value="sales">Vente</option>
                  <option value="marketing">Marketing</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  placeholder="Nom de la variable"
                  className="w-full rounded-l-lg border-r-0 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addVariable();
                    }
                  }}
                />
                <button
                  onClick={addVariable}
                  disabled={!newVariable.trim()}
                  className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {variables.map((variable, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    <span 
                      className="cursor-pointer hover:underline"
                      onClick={() => insertVariableIntoContent(variable)}
                    >
                      {variable}
                    </span>
                    <button 
                      onClick={() => removeVariable(variable)}
                      className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {variables.length > 0 && (
                <p className="text-xs text-gray-500 mb-2">
                  Cliquez sur une variable pour l&apos;insérer à la position du curseur
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu du template</label>
              <textarea
                id="templateBody"
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                placeholder="Ex: Bonjour {{1}}, votre commande #{{2}} a été confirmée."
                rows={5}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Utilisez   etc. pour insérer des variables dans votre template.
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-100">
                  <FiInfo className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">À propos des templates d&apos;email</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Les templates vous permettent de gagner du temps en réutilisant des messages types que vous envoyez fréquemment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { onClose(); resetForm(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !templateName || !templateSubject || !templateBody}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                loading || !templateName || !templateSubject || !templateBody
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Création...
                </div>
              ) : (
                "Créer template"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Email Compose Modal
interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (email: IEmail) => void;
  editingEmail: IEmail | null;
  accounts: IGmailAccount[];
  selectedAccount: string;
}

const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose, onEmailSent, editingEmail, accounts, selectedAccount }) => {
  const [subject, setSubject] = useState('');
  const [recipients, setRecipients] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [bcc, setBcc] = useState<string>('');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(selectedAccount || '');
  
  useEffect(() => {
    if (editingEmail) {
      setSubject(editingEmail.subject || '');
      setRecipients(editingEmail.recipients?.map(r => r.email).join(', ') || '');
      setCc(editingEmail.cc?.map(r => r.email).join(', ') || '');
      setBcc(editingEmail.bcc?.map(r => r.email).join(', ') || '');
      setBody(editingEmail.body || '');
      setAccountId(editingEmail.accountId || selectedAccount || '');
      if (editingEmail.cc?.length) setShowCc(true);
      if (editingEmail.bcc?.length) setShowBcc(true);
    } else {
      resetForm();
    }
  }, [editingEmail, selectedAccount]);
  
  const resetForm = () => {
    setSubject('');
    setRecipients('');
    setCc('');
    setBcc('');
    setBody('');
    setShowCc(false);
    setShowBcc(false);
    setAccountId(selectedAccount || '');
  };
  
  const handleSend = () => {
    if (!subject || !recipients || !body || !accountId) return;
    
    setLoading(true);
    
    // Create recipients arrays
    const recipientsArray = recipients.split(',').map(email => ({
      name: email.trim(),
      email: email.trim()
    }));
    
    const ccArray = cc.split(',').filter(email => email.trim()).map(email => ({
      name: email.trim(),
      email: email.trim()
    }));
    
    const bccArray = bcc.split(',').filter(email => email.trim()).map(email => ({
      name: email.trim(),
      email: email.trim()
    }));
    
    // Get sender info from selected account
    const account = accounts.find(a => a.id === accountId);
    const sender = {
      name: account?.name || '',
      email: account?.email || '',
      avatar: account?.avatar
    };
    
    // Create email object
    const email: IEmail = {
      id: editingEmail?.id || `email_${Date.now()}`,
      subject,
      sender,
      recipients: recipientsArray,
      cc: ccArray.length > 0 ? ccArray : undefined,
      bcc: bccArray.length > 0 ? bccArray : undefined,
      body,
      snippet: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      labels: [],
      folder: 'sent',
      threadId: editingEmail?.threadId || `thread_${Date.now()}`,
      accountId
    };
    
    // Simulate sending delay
    setTimeout(() => {
      onEmailSent(email);
      setLoading(false);
      resetForm();
      onClose();
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden mx-4 max-h-[90vh] flex flex-col"
      >
        <div className="bg-indigo-500 p-3 flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">{editingEmail ? 'Modifier l\'email' : 'Nouveau message'}</h2>
          <button onClick={() => { onClose(); resetForm(); }} className="p-1 rounded-full hover:bg-white/20">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Account selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.email})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">À</label>
              <div className="flex">
                <input
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="email@exemple.com, autre@exemple.com"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={loading}
                />
                <div className="flex items-center ml-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setShowCc(!showCc)}
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Cc
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBcc(!showBcc)}
                    className="text-sm text-gray-500 hover:text-indigo-600"
                  >
                    Cci
                  </button>
                </div>
              </div>
            </div>
            
            {/* CC */}
            {showCc && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cc</label>
                <input
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="email@exemple.com, autre@exemple.com"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
            )}
            
            {/* BCC */}
            {showBcc && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cci</label>
                <input
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="email@exemple.com, autre@exemple.com"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>
            )}
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de l'email"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            
            {/* Body */}
            <div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Rédigez votre message ici..."
                rows={10}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={loading}
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-700"
              disabled={loading}
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-700"
              disabled={loading}
            >
              <FiSmile className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); resetForm(); }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !subject || !recipients || !body || !accountId}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                loading || !subject || !recipients || !body || !accountId
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Envoi...
                </div>
              ) : (
                <div className="flex items-center">
                  <FiSend className="w-4 h-4 mr-2" />
                  Envoyer
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Label Badge Component
interface LabelBadgeProps {
  label: string;
  removable?: boolean;
  onRemove?: (label: string) => void;
}

const LabelBadge = ({ label, removable = false, onRemove }: LabelBadgeProps) => {
  const labelInfo = labelColors[label as keyof typeof labelColors] || { bg: "#f3f4f6", text: "#4b5563" };
  
  return (
    <div 
      className="flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ 
        backgroundColor: labelInfo.bg,
        color: labelInfo.text
      }}
    >
      <span className="max-w-[100px] truncate">{label}</span>
      {removable && (
        <button 
          onClick={() => onRemove && onRemove(label)}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10"
        >
          <FiX className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Helper Functions
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (dayDiff === 1) {
    return "Hier";
  } else if (dayDiff < 7) {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
  }
};

// Main Gmail Interface Component
const GmailInterface = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('indigo');
  
  // States for Gmail business functionality
  const [gmailAccounts, setGmailAccounts] = useState<IGmailAccount[]>([]);
  const [emails, setEmails] = useState<IEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<IEmail | null>(null);
  const [emailThreads, setEmailThreads] = useState<IEmail[]>([]);
  const [templates, setTemplates] = useState<IEmailTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ , setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>("inbox");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  
  // Modal states
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState<boolean>(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [editingEmail, setEditingEmail] = useState<IEmail | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    sentToday: 0,
    avgResponseTime: 0
  });
  
  const emailContentRef = useRef<null | HTMLDivElement>(null);
  
  // Navigation options
  const navigationOptions = [
    { key: "inbox", label: "Boîte de réception", icon: FiInbox, color: "#213f5b" },
    { key: "starred", label: "Suivis", icon: FiStar, color: "#f59e0b" },
    { key: "important", label: "Importants", icon: FiAlertCircle, color: "#ef4444" },
    { key: "sent", label: "Envoyés", icon: FiPaperAirplane, color: "#10b981" },
    { key: "drafts", label: "Brouillons", icon: FiEdit, color: "#6b7280" },
    { key: "scheduled", label: "Programmés", icon: FiClock, color: "#8b5cf6" },
    { key: "archived", label: "Archivés", icon: FiArchive, color: "#6366f1" },
    { key: "spam", label: "Spam", icon: FiAlertCircle, color: "#ef4444" },
    { key: "trash", label: "Corbeille", icon: FiTrash2, color: "#6b7280" },
  ];
  
  // Label options
  const labelOptions = [
    { key: "social", label: "Social", color: "#4338ca" },
    { key: "updates", label: "Mises à jour", color: "#0e7490" },
    { key: "promotions", label: "Promotions", color: "#0369a1" },
    { key: "forums", label: "Forums", color: "#c2410c" },
    { key: "work", label: "Travail", color: "#0f172a" },
    { key: "personal", label: "Personnel", color: "#b45309" },
  ];
  
  // Available colors for theme customization
  const colors = [
    'indigo', 'blue', 'emerald', 'purple', 'pink', 'amber', 'rose'
  ];
  
  // Mock data initialization
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        
        // Mock Gmail accounts
        const mockAccounts: IGmailAccount[] = [
          {
            id: "1",
            email: "contact@votreentreprise.com",
            name: "Contact",
            avatar: "https://ui-avatars.com/api/?name=Contact&background=213f5b&color=fff",
            status: "connected",
            unreadCount: 14,
            lastChecked: new Date().toISOString(),
            signature: "<p>Cordialement,<br>L'équipe Support</p>",
            isDefault: true,
            quota: {
              used: 5.2 * 1024 * 1024 * 1024, // 5.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          },
          {
            id: "2",
            email: "support@votreentreprise.com",
            name: "Support Technique",
            avatar: "https://ui-avatars.com/api/?name=Support&background=2cb67d&color=fff",
            status: "connected",
            unreadCount: 7,
            lastChecked: new Date().toISOString(),
            signature: "<p>À votre service,<br>L'équipe Support Technique</p>",
            isDefault: false,
            quota: {
              used: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          },
          {
            id: "3",
            email: "marketing@votreentreprise.com",
            name: "Marketing",
            avatar: "https://ui-avatars.com/api/?name=Marketing&background=7f5af0&color=fff",
            status: "disconnected",
            unreadCount: 0,
            lastChecked: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            signature: "<p>Bien à vous,<br>L'équipe Marketing</p>",
            isDefault: false,
            quota: {
              used: 3.2 * 1024 * 1024 * 1024, // 3.2 GB
              total: 15 * 1024 * 1024 * 1024  // 15 GB
            }
          }
        ];
        
        // Generate sample emails
        const mockEmails: IEmail[] = Array.from({ length: 25 }, (_, i) => {
          const folders = ["inbox", "sent", "drafts", "spam", "trash", "archived"];
          const folderDistribution = [15, 5, 2, 1, 1, 1]; // Weight for random distribution
          const randomFolder = () => {
            const total = folderDistribution.reduce((a, b) => a + b);
            const rand = Math.random() * total;
            let sum = 0;
            for (let j = 0; j < folderDistribution.length; j++) {
              sum += folderDistribution[j];
              if (rand < sum) return folders[j];
            }
            return folders[0];
          };
          
          // Determine if this email is related to a previous one (thread)
          const isThread = i > 0 && i % 5 !== 0;
          const threadId = isThread ? `thread_${Math.floor(i / 5)}` : `thread_${i}`;
          
          // Generate random labels
          const labelKeys = Object.keys(labelColors);
          const randomLabels = Array.from({ length: Math.floor(Math.random() * 3) }, () =>
            labelKeys[Math.floor(Math.random() * labelKeys.length)]
          ).filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
          
          // Decide which account this email belongs to
          const account = mockAccounts[Math.floor(Math.random() * mockAccounts.filter(a => a.status === "connected").length)];
          const folder = randomFolder() as "inbox" | "sent" | "drafts" | "trash" | "spam" | "archived";
          
          // Create sender/recipient
          const sender = folder === "sent" || folder === "drafts" 
            ? {
                name: account.name,
                email: account.email,
                avatar: account.avatar
              }
            : {
                name: ['Jean Dupont', 'Marie Lefevre', 'Thomas Bernard', 'Sophie Martin'][Math.floor(Math.random() * 4)],
                email: ['jean.dupont@example.com', 'marie.lefevre@example.com', 't.bernard@example.com', 's.martin@example.com'][Math.floor(Math.random() * 4)],
                avatar: `https://i.pravatar.cc/150?img=${i + 10}`
              };
              
          const recipients = folder === "sent" || folder === "drafts"
            ? [{ 
                name: ['Pierre Moreau', 'Léa Petit', 'Marc Dubois', 'Julie Lambert'][Math.floor(Math.random() * 4)],
                email: ['p.moreau@example.com', 'lea.petit@example.com', 'm.dubois@example.com', 'julie@example.com'][Math.floor(Math.random() * 4)]
              }]
            : [{ 
                name: account.name, 
                email: account.email,
                avatar: account.avatar
              }];
          
          // Create email content
          return {
            id: `email_${i}`,
            subject: getRandomSubject(i, isThread, threadId),
            sender,
            recipients,
            cc: Math.random() > 0.7 ? [getRandomContact()] : undefined,
            bcc: Math.random() > 0.8 ? [getRandomContact()] : undefined,
            body: getRandomEmailBody(i, isThread),
            snippet: getRandomEmailSnippet(i, isThread),
            timestamp: new Date(Date.now() - Math.random() * 604800000).toISOString(), // Within the last week
            isRead: Math.random() > 0.4 || folder !== "inbox",
            isStarred: Math.random() > 0.8,
            isImportant: Math.random() > 0.7,
            labels: randomLabels,
            folder: folder,
            attachments: Math.random() > 0.7 ? getRandomAttachments() : undefined,
            threadId: threadId,
            accountId: account.id
          };
        });
        
        // Mock templates
        const mockTemplates: IEmailTemplate[] = [
          {
            id: "template_1",
            name: "Réponse au client",
            subject: "Re: {{sujet}}",
            body: "<p>Bonjour {{nom_client}},</p><p>Merci de nous avoir contacté. Votre demande a bien été prise en compte.</p><p>{{message_personnalisé}}</p><p>N'hésitez pas à me contacter pour toute information complémentaire.</p>",
            variables: ["sujet", "nom_client", "message_personnalisé"],
            category: "support",
            isSystem: true,
            lastUsed: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: "template_2",
            name: "Proposition commerciale",
            subject: "Proposition commerciale - {{entreprise}}",
            body: "<p>Bonjour {{prénom}},</p><p>Suite à notre échange, je vous prie de trouver ci-joint notre proposition commerciale pour {{service}}.</p><p>Cette offre est valable jusqu'au {{date_validité}}.</p><p>Je reste à votre disposition pour toute information complémentaire.</p>",
            variables: ["entreprise", "prénom", "service", "date_validité"],
            category: "sales",
            isSystem: true,
            lastUsed: new Date(Date.now() - 432000000).toISOString()
          },
          {
            id: "template_3",
            name: "Newsletter mensuelle",
            subject: "{{mois}} - Les actualités de {{entreprise}}",
            body: "<p>Chers clients,</p><p>Voici les dernières actualités de {{entreprise}} pour ce mois de {{mois}}.</p><p>{{contenu}}</p><p>Pour vous désabonner, cliquez <a href='#'>ici</a>.</p>",
            variables: ["mois", "entreprise", "contenu"],
            category: "marketing",
            isSystem: true,
            lastUsed: new Date(Date.now() - 2592000000).toISOString()
          }
        ];
        
        // Calculate stats
        const inboxEmails = mockEmails.filter(e => e.folder === "inbox");
        const unreadEmails = inboxEmails.filter(e => !e.isRead).length;
        const sentToday = mockEmails.filter(e => {
          const emailDate = new Date(e.timestamp);
          const today = new Date();
          return e.folder === "sent" && 
            emailDate.getDate() === today.getDate() &&
            emailDate.getMonth() === today.getMonth() &&
            emailDate.getFullYear() === today.getFullYear();
        }).length;
        
        const mockStats = {
          totalEmails: mockEmails.length,
          unreadEmails: unreadEmails,
          sentToday: sentToday,
          avgResponseTime: 45 // minutes
        };
        
        // Sort emails by timestamp, newest first
        mockEmails.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setGmailAccounts(mockAccounts);
        setEmails(mockEmails);
        setTemplates(mockTemplates);
        setStats(mockStats);
        
        if (mockAccounts.length > 0) {
          setSelectedAccount(mockAccounts.find(a => a.isDefault)?.id || mockAccounts[0].id);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  // Get thread emails when an email is selected
  useEffect(() => {
    if (selectedEmail) {
      // In a real application, this would be an API call to get the thread
      const threadEmails = emails.filter(e => e.threadId === selectedEmail.threadId);
      
      // Sort by timestamp, oldest first to show conversation flow
      threadEmails.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setEmailThreads(threadEmails);
      
      // Mark selected email as read if it wasn't already
      if (!selectedEmail.isRead) {
        setEmails(prev => 
          prev.map(e => 
            e.id === selectedEmail.id ? {...e, isRead: true} : e
          )
        );
        
        // Update unread count in stats
        setStats(prev => ({
          ...prev,
          unreadEmails: prev.unreadEmails - 1
        }));
      }
      
      // Scroll to top of email content
      emailContentRef.current?.scrollTo(0, 0);
    } else {
      setEmailThreads([]);
    }
  }, [selectedEmail, emails]);
  
  // Filter emails based on search, account, folder, and label selections
  const filteredEmails = emails.filter((email) => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        email.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = !selectedAccount || email.accountId === selectedAccount;
    
    const matchesFolder = currentFolder === email.folder || 
                         (currentFolder === "starred" && email.isStarred) ||
                         (currentFolder === "important" && email.isImportant);
    
    const matchesLabels = selectedLabels.length === 0 || 
                         selectedLabels.some(label => email.labels.includes(label));
    
    return matchesSearch && matchesAccount && matchesFolder && matchesLabels;
  });
  
  // Send a reply email
  const sendReply = () => {
    if (!replyContent.trim() || !selectedEmail) return;
    
    const account = gmailAccounts.find(a => a.id === selectedAccount);
    if (!account) return;
    
    // Create a new reply email
    const newReply: IEmail = {
      id: `email_reply_${Date.now()}`,
      subject: selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      sender: {
        name: account.name,
        email: account.email,
        avatar: account.avatar
      },
      recipients: [selectedEmail.sender],
      body: `<p>${replyContent}</p>${account.signature ? account.signature : ""}`,
      snippet: replyContent.substring(0, 100) + "...",
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      labels: [],
      folder: "sent",
      threadId: selectedEmail.threadId,
      accountId: account.id
    };
    
    // Add the new email to the emails array
    setEmails(prev => [newReply, ...prev]);
    
    // Add to the current thread
    setEmailThreads(prev => [...prev, newReply]);
    
    // Clear the reply input
    setReplyContent("");
    setIsReplyOpen(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      sentToday: prev.sentToday + 1
    }));
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLabels([]);
  };
  
  // Toggle email star status
  const toggleStarred = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? {...email, isStarred: !email.isStarred}
          : email
      )
    );
  };
  
  // Toggle email important status
  const toggleImportant = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? {...email, isImportant: !email.isImportant}
          : email
      )
    );
  };
  
  // Archive email
  const archiveEmail = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? {...email, folder: "archived"}
          : email
      )
    );
    
    // If the archived email is the selected one, deselect it
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };
  
  // Delete email (move to trash)
  const deleteEmail = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    setEmails(prev => 
      prev.map(email => 
        email.id === emailId 
          ? {...email, folder: "trash"}
          : email
      )
    );
    
    // If the deleted email is the selected one, deselect it
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail(null);
    }
  };
  
  // Helper function to get a random subject
  function getRandomSubject(index: number, isThread: boolean, threadId: string): string {
    const subjects = [
      "Proposition de partenariat",
      "Demande d'information sur vos services",
      "Confirmation de votre commande #12345",
      "Votre facture pour le mois de mars",
      "Invitation à notre webinaire sur la transformation digitale",
      "Problème avec mon compte client",
      "Demande de devis pour projet",
      "Mise à jour de nos conditions générales",
      "Nouvelle version de notre application disponible",
      "Confirmation de votre rendez-vous"
    ];
    
    if (isThread) {
      // For thread emails, use the base subject with Re: prefix
      const baseSubjectIndex = parseInt(threadId.split('_')[1]);
      const subject = subjects[baseSubjectIndex % subjects.length];
      return `Re: ${subject}`;
    }
    
    return subjects[index % subjects.length];
  }
  
  // Helper function to get a random contact
  function getRandomContact(): IRecipient {
    const contacts = [
      { name: "Pierre Moreau", email: "p.moreau@example.com", avatar: "https://i.pravatar.cc/150?img=7" },
      { name: "Léa Petit", email: "lea.petit@example.com", avatar: "https://i.pravatar.cc/150?img=20" },
      { name: "Marc Dubois", email: "m.dubois@example.com", avatar: "https://i.pravatar.cc/150?img=12" },
      { name: "Julie Lambert", email: "julie@example.com", avatar: "https://i.pravatar.cc/150?img=29" }
    ];
    
    return contacts[Math.floor(Math.random() * contacts.length)];
  }
  
  // Helper function to get random email body
  function getRandomEmailBody(index: number, isThread: boolean): string {
    const salutations = ["Bonjour", "Cher client", "Cher partenaire", "Madame, Monsieur", "Bonjour à tous"];
    const closings = ["Cordialement", "Bien à vous", "Sincères salutations", "Merci d'avance", "À bientôt"];
    
    const bodyParts = [
      "Nous vous confirmons la bonne réception de votre demande. Notre équipe l'examinera dans les plus brefs délais.",
      "Votre commande a bien été prise en compte et sera expédiée dans les 48 heures.",
      "Nous sommes ravis de vous inviter à notre prochain webinaire qui aura lieu le 15 juin à 14h.",
      "Suite à notre conversation téléphonique, je vous fais parvenir les informations demandées concernant nos services.",
      "Nous avons mis à jour notre politique de confidentialité. Veuillez en prendre connaissance.",
      "Nous avons le plaisir de vous annoncer le lancement de notre nouvelle gamme de produits.",
      "Nous vous remercions pour votre fidélité et vous offrons une remise de 10% sur votre prochaine commande.",
      "Nous sommes désolés de vous informer que votre demande ne peut être traitée en l'état. Merci de bien vouloir nous fournir plus d'informations."
    ];
    
    // For thread emails, create a reply context
    if (isThread) {
      const salutation = salutations[Math.floor(Math.random() * salutations.length)];
      const replyContent = "Merci pour votre message. " + 
        bodyParts[(index + 2) % bodyParts.length] + " " +
        "N'hésitez pas à me contacter pour toute information complémentaire.";
      const closing = closings[Math.floor(Math.random() * closings.length)];
      
      return `<p>${salutation},</p><p>${replyContent}</p><p>${closing},</p><p><strong>John Doe</strong><br>Responsable Commercial</p>`;
    }
    
    // For regular emails
    const salutation = salutations[index % salutations.length];
    const body = bodyParts[index % bodyParts.length];
    const closing = closings[index % closings.length];
    
    return `<p>${salutation},</p><p>${body}</p><p>${closing},</p><p><strong>John Doe</strong><br>Responsable Commercial</p>`;
  }
  
  // Helper function to get a random email snippet
  function getRandomEmailSnippet(index: number, isThread: boolean): string {
    const snippets = [
      "Nous vous confirmons la bonne réception de votre demande. Notre équipe l'examinera dans les plus brefs délais...",
      "Votre commande a bien été prise en compte et sera expédiée dans les 48 heures...",
      "Nous sommes ravis de vous inviter à notre prochain webinaire qui aura lieu le 15 juin à 14h...",
      "Suite à notre conversation téléphonique, je vous fais parvenir les informations demandées...",
      "Nous avons mis à jour notre politique de confidentialité. Veuillez en prendre connaissance..."
    ];
    
    if (isThread) {
      return "Merci pour votre message. " + snippets[(index + 2) % snippets.length];
    }
    
    return snippets[index % snippets.length];
  }
  
  // Helper function to generate random attachments
  function getRandomAttachments(): IAttachment[] {
    const types = ["pdf", "image", "document", "spreadsheet", "presentation", "other"];
    const attachmentCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 attachments
    
    return Array.from({ length: attachmentCount }, (_, i) => {
      const randomType = types[Math.floor(Math.random() * types.length)] as "pdf" | "image" | "document" | "spreadsheet" | "presentation" | "other";
      const fileNames = {
        "pdf": ["rapport.pdf", "facture.pdf", "contrat.pdf", "documentation.pdf"],
        "image": ["photo.jpg", "capture.png", "image.jpg", "logo.png"],
        "document": ["document.docx", "compte-rendu.doc", "proposition.docx"],
        "spreadsheet": ["données.xlsx", "statistiques.xlsx", "budget.xls"],
        "presentation": ["présentation.pptx", "slides.ppt", "conférence.pptx"],
        "other": ["fichier.zip", "archive.rar", "data.json", "config.xml"]
      };
      
      const randomFileName = fileNames[randomType][Math.floor(Math.random() * fileNames[randomType].length)];
      
      return {
        id: `attachment_${i}`,
        name: randomFileName,
        type: randomType,
        size: Math.floor(Math.random() * 5000000) + 100000, // Between 100KB and 5MB
        url: "#",
        thumbnail: randomType === "image" ? `/api/placeholder/${Math.floor(Math.random() * 100) + 100}/${Math.floor(Math.random() * 100) + 100}` : undefined
      };
    });
  }
  
  // Get attachment icon based on type
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FiFileText className="h-5 w-5 text-red-500" />;
      case "image":
        return <FiImage className="h-5 w-5 text-blue-500" />;
      case "document":
        return <FiFileText className="h-5 w-5 text-blue-700" />;
      case "spreadsheet":
        return <FiFileText className="h-5 w-5 text-green-600" />;
      case "presentation":
        return <FiPlay className="h-5 w-5 text-orange-500" />;
      default:
        return <FiPaperclip className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper to get hex color code from color name
interface ColorMap {
    [key: string]: string;
}

const getColorHex = (color: string): string => {
    const colorMap: ColorMap = {
        'indigo': '#6366F1',
        'blue': '#3B82F6',
        'emerald': '#10B981',
        'purple': '#8B5CF6',
        'pink': '#EC4899',
        'amber': '#F59E0B',
        'rose': '#F43F5E'
    };

    return colorMap[color] || colorMap['indigo'];
};
  
  // Main layout
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-screen flex flex-col pt-16 overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff] text-gray-800'}`}
    >
      {/* Dashboard Header with Stats */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="relative">

            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700 mb-1 pl-2">Gmail</h1>
            <p className="text-[#213f5b] opacity-75 pl-2">Gérez vos emails directement depuis votre CRM</p>
            <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-[#bfddf9] opacity-10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex items-center gap-3 self-end">
            <button
              onClick={() => setIsCreateTemplateModalOpen(true)}
              className="border border-[#bfddf9] text-[#213f5b] hover:bg-[#bfddf9] transition-colors rounded-lg px-4 py-2 flex items-center shadow-sm hover:shadow text-sm font-medium"
            >
              <FiClipboard className="h-4 w-4 mr-2" />
              Créer un template
            </button>
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-all rounded-lg px-3 py-1.5 text-sm flex items-center shadow-md hover:shadow-lg"
            >
              <FiUserPlus className="h-4 w-4 mr-2" />
              Ajouter un compte
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white backdrop-filter backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition-colors overflow-hidden relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-indigo-100 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total emails</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.totalEmails.toLocaleString()}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">sur tous les comptes</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-100">
                <FiMail className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white backdrop-filter backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition-colors overflow-hidden relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-blue-100 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Non lus</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.unreadEmails}</p>
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">À traiter</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">emails en attente</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-100">
                <FiInbox className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white backdrop-filter backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition-colors overflow-hidden relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-emerald-100 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Envoyés aujourd&apos;hui</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.sentToday}</p>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+3</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">messages envoyés</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-100">
                <FiSend className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white backdrop-filter backdrop-blur-sm bg-opacity-90 rounded-xl shadow-sm p-4 border border-gray-100 hover:border-indigo-200 transition-colors overflow-hidden relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-purple-100 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Temps de réponse</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.avgResponseTime}</p>
                  <span className="text-sm ml-1 self-end mb-1 text-gray-600">min</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">en moyenne</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-100">
                <FiClock className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-64 flex-shrink-0 overflow-y-auto hidden md:block`}>
          <div className="p-4">
            <button
              onClick={() => setIsComposeModalOpen(true)}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg shadow-sm text-white font-medium ${
                getColorHex(accentColor) === '#F43F5E' 
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700'
                  : `bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-600 hover:from-${accentColor}-600 hover:to-${accentColor}-700`
              }`}
            >
              <FiEdit className="h-5 w-5" />
              <span>Nouveau message</span>
            </button>
          </div>
          
          {/* Gmail Accounts */}
          <div className="px-4 mb-4">
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wider">Comptes Gmail</h3>
            <div className="space-y-2">
              {gmailAccounts.map(account => (
                <div 
                  key={account.id}
                  onClick={() => setSelectedAccount(prevValue => prevValue === account.id ? null : account.id)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    selectedAccount === account.id 
                      ? `bg-${accentColor}-50 text-${accentColor}-600` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={account.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=random`} 
                      alt={account.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      account.status === 'connected' ? 'bg-green-500' : 
                      account.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="ml-3 flex-1 truncate">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{account.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{account.email}</p>
                  </div>
                  <div className={`${account.unreadCount > 0 ? 'block' : 'hidden'} bg-${accentColor}-100 text-${accentColor}-600 text-xs font-medium px-2 py-0.5 rounded-full`}>
                    {account.unreadCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="px-4 mb-4">
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wider">Navigation</h3>
            <div className="space-y-1">
              {navigationOptions.map(option => (
                <div 
                  key={option.key}
                  onClick={() => setCurrentFolder(option.key)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    currentFolder === option.key 
                      ? `bg-${accentColor}-50 text-${accentColor}-600` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <option.icon className="h-5 w-5 mr-3" style={{ color: currentFolder === option.key ? getColorHex(accentColor) : option.color }} />
                  <span className="text-sm font-medium flex-1">{option.label}</span>
                  {option.key === "inbox" && stats.unreadEmails > 0 && (
                    <span className={`bg-${accentColor}-100 text-${accentColor}-600 text-xs font-medium px-2 py-0.5 rounded-full`}>
                      {stats.unreadEmails}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Labels */}
          <div className="px-4 mb-4">
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wider">Étiquettes</h3>
            <div className="space-y-1">
              {labelOptions.map(option => (
                <div 
                  key={option.key}
                  onClick={() => {
                    setSelectedLabels(prev => 
                      prev.includes(option.key) 
                        ? prev.filter(l => l !== option.key)
                        : [...prev, option.key]
                    );
                  }}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    selectedLabels.includes(option.key) 
                      ? `bg-${accentColor}-50 text-${accentColor}-600` 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div 
                    className="h-3 w-3 rounded-full mr-3"
                    style={{ backgroundColor: option.color }}
                  ></div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Settings */}
          <div className="px-4 pt-4 pb-6 mt-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Mode sombre</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                >
                  {darkMode ? (
                    <FiSun className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <FiMoon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600 mb-2 block">Couleur d&apos;accent</span>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`h-6 w-6 rounded-full ${accentColor === color ? 'ring-2 ring-offset-2' : ''}`}
                      style={{ 
                        backgroundColor: getColorHex(color)
                      }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Email List and Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Email List */}
          <div className={`${!selectedEmail ? 'flex-1' : 'w-1/3 border-r'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden flex flex-col ${selectedEmail ? 'hidden md:flex' : ''}`}>
            {/* Search and filters */}
            <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <div className={`flex items-center flex-1 p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                  <FiSearch className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ml-2 flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  className={`ml-2 p-2 rounded-lg ${isFiltersVisible ? `bg-${accentColor}-500 text-white` : `${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}`}
                >
                  <FiFilter className="h-5 w-5" />
                </button>
              </div>
              
              {/* Filters */}
              {isFiltersVisible && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Filtres</h3>
                    <button 
                      onClick={clearFilters}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Effacer tous les filtres
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedLabels.map(label => (
                      <LabelBadge 
                        key={label} 
                        label={label} 
                        removable={true}
                        onRemove={(l) => setSelectedLabels(prev => prev.filter(item => item !== l))}
                      />
                    ))}
                    {selectedAccount && (
                      <div className="flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        <span className="max-w-[100px] truncate">
                          {gmailAccounts.find(a => a.id === selectedAccount)?.name || selectedAccount}
                        </span>
                        <button 
                          onClick={() => setSelectedAccount(null)}
                          className="ml-1 p-0.5 rounded-full hover:bg-blue-100"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {searchTerm && (
                      <div className="flex items-center text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                        <span className="max-w-[100px] truncate">
                          Recherche: {searchTerm}
                        </span>
                        <button 
                          onClick={() => setSearchTerm("")}
                          className="ml-1 p-0.5 rounded-full hover:bg-gray-200"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Email list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <FiInbox className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-1">Aucun email</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm || selectedLabels.length > 0 || selectedAccount 
                      ? "Essayez de modifier vos filtres" 
                      : "Votre boîte de réception est vide"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`flex p-3 hover:bg-gray-50 cursor-pointer transition-colors ${!email.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <img
                          src={email.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.sender.name)}&background=random`}
                          alt={email.sender.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {email.sender.name}
                          </p>
                          <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(email.timestamp)}
                          </p>
                        </div>
                        <p className={`text-sm truncate ${!email.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{email.snippet}</p>
                        
                        <div className="flex items-center mt-1.5 space-x-1">
                          {email.labels.map(label => (
                            <LabelBadge key={label} label={label} removable={false} onRemove={() => {}} />
                          ))}
                          {email.attachments && (
                            <div className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              <FiPaperclip className="w-3 h-3 mr-0.5" />
                              <span>{email.attachments.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 justify-between items-center ml-2">
                        <button
                          onClick={(e) => toggleStarred(e, email.id)}
                          className="p-1 text-gray-400 hover:text-amber-500"
                        >
                          <FiStar className={`h-4 w-4 ${email.isStarred ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => toggleImportant(e, email.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <FiAlertCircle className={`h-4 w-4 ${email.isImportant ? 'text-red-500 fill-red-100' : ''}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Email Content */}
          <div className={`${selectedEmail ? 'flex-1' : 'hidden'} ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden flex flex-col`}>
            {selectedEmail ? (
              <>
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                  <div className="flex items-center">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className={`mr-2 p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {selectedEmail.subject}
                    </h2>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => archiveEmail(e, selectedEmail.id)}
                      className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} mr-1`}
                      title="Archiver"
                    >
                      <FiArchive className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => deleteEmail(e, selectedEmail.id)}
                      className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} mr-1`}
                      title="Supprimer"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsComposeModalOpen(true);
                        setEditingEmail({
                          ...selectedEmail,
                          subject: selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
                          recipients: [selectedEmail.sender],
                          body: ""
                        });
                      }}
                      className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                      title="Répondre"
                    >
                      <FiArrowRightCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div ref={emailContentRef} className="flex-1 overflow-y-auto p-4">
                  {/* Email thread */}
                  <div className="space-y-6">
                    {emailThreads.map((email ) => (
                      <div key={email.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-start">
                          <img
                            src={email.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email.sender.name)}&background=random`}
                            alt={email.sender.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{email.sender.name}</span>
                                <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>&lt;{email.sender.email}&gt;</span>
                              </div>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(email.timestamp).toLocaleDateString()} {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-sm mb-2">
                              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>À : </span>
                              {email.recipients.map((recipient, i) => (
                                <span key={i} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {recipient.name} &lt;{recipient.email}&gt;
                                  {i < email.recipients.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                            {email.cc && email.cc.length > 0 && (
                              <div className="text-sm mb-2">
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cc : </span>
                                {email.cc.map((recipient, i) => (
                                  <span key={i} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {recipient.name} &lt;{recipient.email}&gt;
                                    {i < ((email.cc?.length ?? 0) - 1) ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className={`mt-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} dangerouslySetInnerHTML={{__html: email.body}}></div>
                            
                            {email.attachments && email.attachments.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <div className="text-sm font-medium mb-2 text-gray-700">
                                  Pièces jointes ({email.attachments.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {email.attachments.map(attachment => (
                                    <div 
                                      key={attachment.id}
                                      className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-50 hover:bg-gray-100'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer group`}
                                    >
                                      {attachment.type === 'image' && attachment.thumbnail ? (
                                        <img 
                                          src={attachment.thumbnail} 
                                          alt={attachment.name}
                                          className="h-10 w-10 rounded object-cover mr-2"
                                        />
                                      ) : (
                                        <div className="mr-2">
                                          {getAttachmentIcon(attachment.type)}
                                        </div>
                                      )}
                                      <div>
                                        <div className="text-sm font-medium truncate max-w-[150px]">
                                          {attachment.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {formatFileSize(attachment.size)}
                                        </div>
                                      </div>
                                      <button className="ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-indigo-600 hover:bg-white">
                                        <FiDownload className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reply box */}
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {isReplyOpen ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Rédigez votre réponse..."
                        rows={4}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm resize-none"
                      ></textarea>
                      <div className="flex justify-between items-center">
                        <div>
                          <button
                            onClick={() => setIsTemplateVisible(!isTemplateVisible)}
                            className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <FiClipboard className="h-5 w-5" />
                          </button>
                          <button
                            className="p-2 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          >
                            <FiPaperclip className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsReplyOpen(false);
                              setReplyContent("");
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={sendReply}
                            disabled={!replyContent.trim()}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                              !replyContent.trim()
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                          >
                            <div className="flex items-center">
                              <FiSend className="w-4 h-4 mr-2" />
                              Envoyer
                            </div>
                          </button>
                        </div>
                      </div>
                      
                      {/* Templates dropdown */}
                      {isTemplateVisible && (
                        <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-white shadow-lg">
                          <h3 className="text-sm font-semibold mb-2">Templates</h3>
                          <div className="divide-y divide-gray-200 max-h-48 overflow-y-auto">
                            {templates.map(template => (
                              <div 
                                key={template.id}
                                onClick={() => {
                                  setReplyContent(template.body.replace(/<[^>]*>/g, ''));
                                  setIsTemplateVisible(false);
                                }}
                                className="py-2 px-1 hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 bg-${templateCategories[template.category].color}`}></div>
                                  <span className="font-medium text-sm">{template.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 ml-4 line-clamp-1">{template.body.replace(/<[^>]*>/g, '')}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      onClick={() => setIsReplyOpen(true)}
                      className={`p-3 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg cursor-text text-gray-500`}
                    >
                      <div className="flex items-center text-sm">
                        <FiEdit3 className="h-4 w-4 mr-2" />
                        Cliquez ici pour répondre...
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FiMail className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Sélectionnez un email</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md text-center mt-2`}>
                  Cliquez sur un email dans la liste pour afficher son contenu ici.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around p-2 z-10">
        <button 
          onClick={() => setCurrentFolder("inbox")}
          className={`p-2 rounded-full ${currentFolder === "inbox" ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <FiInbox className="h-6 w-6" />
        </button>
        <button 
          onClick={() => setCurrentFolder("starred")}
          className={`p-2 rounded-full ${currentFolder === "starred" ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <FiStar className="h-6 w-6" />
        </button>
        <div className="-mt-6 bg-indigo-600 rounded-full p-3 shadow-lg">
          <button 
            onClick={() => setIsComposeModalOpen(true)}
            className="text-white"
          >
            <FiEdit className="h-6 w-6" />
          </button>
        </div>
        <button 
          onClick={() => setCurrentFolder("sent")}
          className={`p-2 rounded-full ${currentFolder === "sent" ? 'text-indigo-600' : 'text-gray-600'}`}
        >
          <FiSend className="h-6 w-6" />
        </button>
        <button 
          onClick={() => {
            // Open a menu with more options
          }}
          className="p-2 rounded-full text-gray-600"
        >
          <FiMenu className="h-6 w-6" />
        </button>
      </div>
      
      {/* Modals */}
      <AddAccountModal 
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAccountAdded={(newAccount: IGmailAccount) => setGmailAccounts(prev => [...prev, newAccount])}
      />
      
      <CreateTemplateModal
        isOpen={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onTemplateCreated={(newTemplate) => setTemplates(prev => [...prev, newTemplate])}
      />
      
      <ComposeModal
        isOpen={isComposeModalOpen}
        onClose={() => {
          setIsComposeModalOpen(false);
          setEditingEmail(null);
        }}
        onEmailSent={(newEmail: IEmail) => {
          setEmails(prev => [newEmail, ...prev]);
          setStats(prev => ({
            ...prev,
            sentToday: prev.sentToday + 1
          }));
        }}
        editingEmail={editingEmail}
        accounts={gmailAccounts}
        selectedAccount={selectedAccount ?? ''}
      />
    </motion.div>
  );
};

export default GmailInterface;