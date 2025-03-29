'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiPaperclip,
  FiSmile,
  FiMic,
  FiSend,
  FiChevronLeft,
  FiChevronDown,
  FiImage,
  FiFileText,
  FiCamera,
  FiUser,
  // FiUsers,
  FiSettings,
  FiFilter,
  FiMoon,
  FiSun,
  FiInfo,
  FiCheck,
  FiEdit,
  FiArrowRightCircle,
  FiPlus,
  FiMessageSquare,
  FiX,
  FiClock,
  FiAlertCircle,
  FiGlobe,
  FiStar,
  // FiLock,
  // FiVolume2,
  FiArchive,
  FiCopy,
  FiTrash2,
  // FiRotateCcw,
  FiFlag,
  // FiLink,
  // FiEye,
  // FiEyeOff,
  FiGift,
  FiRefreshCw,
  // FiPieChart,
  // FiTrendingUp,
  FiBarChart2,
  // FiDollarSign,
  FiUserPlus,
  FiCheckCircle,
  // FiArrowUp,
  // FiArrowDown,
  // FiSliders,
  // FiGrid,
  // FiList,
  FiTag,
  FiClipboard,
  FiBriefcase,
  // FiHash,
  // FiTarget,
  // FiDownload,
  // FiUpload,
  // FiServer,
  // FiBox,
  // FiAward,
  // FiBell
} from 'react-icons/fi';

// Message type definitions
interface IMessage {
  id: string;
  content: string;
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  sender: string;
  isIncoming: boolean;
  attachments?: IAttachment[];
}

interface IAttachment {
  type: "image" | "document" | "audio" | "video";
  url: string;
  name?: string;
  size?: number;
  thumbnail?: string;
}

// Contact type
interface IContact {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  email?: string;
  company?: string;
  isBusinessAccount?: boolean;
  lastActivity?: string;
}

// Conversation type
interface IConversation {
  id: string;
  contact: IContact;
  lastMessage: IMessage;
  unreadCount: number;
  whatsappNumber: string;
  tags?: string[];
  status: "active" | "archived" | "pending";
  assignedTo?: string;
}

// WhatsApp account type
interface IWhatsAppAccount {
  id: string;
  phoneNumber: string;
  name: string;
  status: "connected" | "disconnecting" | "disconnected";
  businessName?: string;
  profileImage?: string;
  messagesPerDay: number;
  messagesTotal: number;
}

// Template message type
interface ITemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: "marketing" | "customer_service" | "utility";
  status: "approved" | "pending" | "rejected";
  language: string;
}

// Tag colors for styling
const tagColors = {
  "lead": { bg: "#bfddf9", text: "#213f5b" },
  "client": { bg: "#d2fcb2", text: "#213f5b" },
  "urgent": { bg: "#ff9f9f", text: "#213f5b" },
  "follow-up": { bg: "#ffd89f", text: "#213f5b" },
  "support": { bg: "#e9c8ff", text: "#213f5b" },
};

// Template categories
const templateCategories = {
  "marketing": { color: "#bfddf9", gradient: "from-blue-500 to-blue-600" },
  "customer_service": { color: "#d2fcb2", gradient: "from-green-500 to-green-600" },
  "utility": { color: "#89c4f7", gradient: "from-cyan-500 to-cyan-600" },
};

// Elegant animated loading dots for "typing" indicator
const TypingIndicator = () => (
  <div className="flex space-x-1 items-center">
    <motion.div
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ repeat: Infinity, duration: 0.7, repeatType: "reverse" }}
      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
    />
    <motion.div
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ repeat: Infinity, duration: 0.7, delay: 0.2, repeatType: "reverse" }}
      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
    />
    <motion.div
      initial={{ opacity: 0.3, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ repeat: Infinity, duration: 0.7, delay: 0.4, repeatType: "reverse" }}
      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
    />
  </div>
);

// Chat Bubble Component
interface ChatBubbleProps {
  message: IMessage;
  isUser: boolean;
  showStatus?: boolean;
  accentColor: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, showStatus = true, accentColor }) => {
  const [showOptions ] = useState(false);
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <FiCheck className="w-3.5 h-3.5 text-gray-400" />;
      case 'delivered':
        return <div className="flex"><FiCheck className="w-3.5 h-3.5 text-gray-400" /><FiCheck className="w-3.5 h-3.5 text-gray-400 -ml-2" /></div>;
      case 'read':
        return <div className="flex"><FiCheck className="w-3.5 h-3.5 text-blue-500" /><FiCheck className="w-3.5 h-3.5 text-blue-500 -ml-2" /></div>;
      case 'failed':
        return <FiAlertCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <FiClock className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} relative group`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl py-2.5 px-4 my-1 shadow-sm relative
        ${isUser 
          ? `bg-gradient-to-br from-${accentColor}-500 to-${accentColor}-600 text-white` 
          : 'bg-white border border-gray-100 text-gray-800'}`}
      >
        {message.attachments && message.attachments.map((attachment, index) => (
          <div key={index} className={`p-3 rounded-lg mb-2 flex items-center gap-3 ${isUser ? 'bg-white/10' : 'bg-gray-50'}`}>
            <div className={`p-2 rounded-full ${isUser ? 'bg-white/20' : 'bg-gray-100'}`}>
              {attachment.type === 'image' ? (
                <FiImage className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              ) : attachment.type === 'document' ? (
                <FiFileText className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              ) : attachment.type === 'audio' ? (
                <FiMic className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              ) : attachment.type === 'video' ? (
                <FiVideo className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              ) : (
                <FiPaperclip className={`w-5 h-5 ${isUser ? 'text-white' : 'text-blue-500'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${isUser ? 'text-white' : 'text-gray-800'}`}>
                {attachment.name || `${attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)} file`}
              </div>
              <div className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ''}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full ${isUser ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <FiArrowRightCircle className={`w-4 h-4 ${isUser ? 'text-white' : 'text-blue-500'}`} />
            </motion.button>
          </div>
        ))}
        
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        
        <div className={`flex items-center justify-end text-xs mt-1 space-x-1 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isUser && showStatus && getStatusIcon()}
        </div>

        {/* Message options on hover */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`absolute ${isUser ? 'left-0 -translate-x-full -translate-y-1/4' : 'right-0 translate-x-full -translate-y-1/4'} 
              p-1 rounded-lg shadow-lg flex space-x-1 z-10 bg-white border border-gray-100`}
            >
              {[
                { icon: FiCopy, tooltip: "Copier" },
                { icon: FiStar, tooltip: "Marquer" },
                { icon: FiReply, tooltip: "Répondre" },
                { icon: FiTrash2, tooltip: "Supprimer" }
              ].map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-700 relative group"
                >
                  <option.icon className="w-4 h-4" />
                  <div className="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {option.tooltip}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Online Indicator
const OnlineIndicator = ({ isOnline, isTyping, size = "md" }: { isOnline: boolean, isTyping: boolean, size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3"
  };
  
  if (!isOnline && !isTyping) return null;
  
  return (
    <div className="relative">
      {isOnline && (
        <motion.div
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 5px rgba(16, 185, 129, 0)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute bottom-0 right-0 ${sizeClasses[size]} rounded-full bg-green-500 border-2 border-white`}
        />
      )}
      {isTyping && (
        <motion.div
          animate={{ 
            boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 5px rgba(59, 130, 246, 0)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute bottom-0 right-0 ${sizeClasses[size]} rounded-full bg-blue-500 border-2 border-white flex items-center justify-center p-2`}
        >
          <TypingIndicator />
        </motion.div>
      )}
    </div>
  );
};

// Emoji Picker Panel
const EmojiPicker: React.FC<{ onSelectEmoji: (emoji: string) => void; accentColor: string; onClose: () => void; }> = ({ onSelectEmoji, accentColor, onClose }) => {
  const emojis = ['😊', '👍', '❤️', '😂', '🎉', '🙏', '👌', '🤔', '😎', '🔥', '😍', '🤝', '👏', '💯', '⭐', '✅', '🚀', '💪', '🤓', '🌟', '👋', '🥳', '💖', '✨', '🤗', '👀', '🙂', '🤷‍♂️', '🤦‍♀️', '😉'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-xl shadow-lg border border-gray-100 w-64"
    >
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-xs font-medium text-gray-700">Emojis récents</h3>
        <div className="flex items-center gap-2">
          <button className={`text-xs text-${accentColor}-500 hover:underline`}>Tous les emojis</button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {emojis.map((emoji, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelectEmoji(emoji)}
            className="h-8 w-8 flex items-center justify-center text-lg rounded-lg hover:bg-gray-100"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <button className={`w-full text-xs text-center text-${accentColor}-500 hover:underline`}>
          + Ajouter des emojis personnalisés
        </button>
      </div>
    </motion.div>
  );
};

// Attachment Panel
const AttachmentPanel: React.FC<{ onClose: () => void; accentColor: string }> = ({ onClose }) => {
  const attachmentOptions = [
    { icon: FiImage, label: 'Photos & Vidéos', color: 'indigo' },
    { icon: FiCamera, label: 'Appareil photo', color: 'blue' },
    { icon: FiFileText, label: 'Document', color: 'emerald' },
    { icon: FiUser, label: 'Contact', color: 'orange' },
    { icon: FiGift, label: 'Sticker', color: 'pink' },
    { icon: FiMic, label: 'Audio', color: 'red' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-full left-0 mb-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100 w-72"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Pièces jointes</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {attachmentOptions.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ y: 0, boxShadow: 'none' }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${option.color}-100`}>
              <option.icon className={`w-5 h-5 text-${option.color}-600`} />
            </div>
            <span className="text-xs text-gray-700">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Template Selection Panel
interface TemplatePanelProps {
  templates: ITemplate[];
  onSelectTemplate: (template: ITemplate) => void;
  onClose: () => void;
  accentColor: string;
}

const TemplatePanel: React.FC<TemplatePanelProps> = ({ templates, onSelectTemplate, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-t border-gray-200 bg-white overflow-hidden"
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700">Messages rapides</h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
          {templates.map(template => (
            <motion.div
              key={template.id}
              className="p-2 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start gap-2">
                <div className="rounded-md p-1.5"
                  style={{ 
                    backgroundColor: templateCategories[template.category]?.color || '#eaeaea'
                  }}
                >
                  <FiClipboard className="w-3.5 h-3.5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-medium text-gray-700 truncate">{template.name}</h5>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${
                      template.status === 'approved' ? 'bg-green-500' : 
                      template.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                    {template.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Contact Profile Panel
const ContactProfile: React.FC<{ contact: IContact; conversation: IConversation; onClose: () => void; accentColor: string; }> = ({ contact, conversation, onClose, accentColor }) => {
  const [showMediaSection, setShowMediaSection] = useState(true);
  
  // Sample media shared in conversation
  const sharedMedia = [
    { type: 'image', url: '/api/placeholder/80/80', date: 'Aujourd\'hui' },
    { type: 'document', name: 'Notes_Reunion_Mars2025.pdf', size: '2.4 MB', date: 'Aujourd\'hui' },
    { type: 'image', url: '/api/placeholder/80/80', date: 'Hier' },
    { type: 'image', url: '/api/placeholder/80/80', date: 'Hier' },
    { type: 'document', name: 'Projet_Nexus_Plan.docx', size: '1.8 MB', date: '22/03/2025' },
    { type: 'image', url: '/api/placeholder/80/80', date: '20/03/2025' }
  ];
  
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="absolute inset-0 bg-white shadow-lg flex flex-col z-20"
    >
      <div className={`flex items-center p-4 bg-${accentColor}-500 text-white`}>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="ml-2 text-lg font-semibold">Profil de contact</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Contact header */}
        <div className="flex flex-col items-center py-8 px-4 bg-gray-50 border-b border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-4 border-2 border-white shadow-md">
              {contact.profilePicture ? (
                <img src={contact.profilePicture} alt={contact.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <OnlineIndicator isOnline={true} isTyping={false} size="lg" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">{contact.name}</h1>
          <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
          
          {/* Business indicator */}
          {contact.isBusinessAccount && (
            <div className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mt-2 flex items-center">
              <FiBriefcase className="w-3 h-3 mr-1" />
              Compte professionnel
            </div>
          )}
          
          {/* Tags */}
          {conversation.tags && conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 justify-center">
              {conversation.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-0.5 rounded-full font-medium truncate"
                  style={{ 
                    backgroundColor: tagColors[tag as keyof typeof tagColors]?.bg || '#eaeaea',
                    color: tagColors[tag as keyof typeof tagColors]?.text || '#213f5b'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex mt-6 gap-4">
            {[
              { icon: FiPhone, label: 'Appel' },
              { icon: FiVideo, label: 'Vidéo' },
              { icon: FiSearch, label: 'Rechercher' },
              { icon: FiTag, label: 'Étiquettes' }
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
                className={`flex flex-col items-center`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${accentColor}-100 mb-1`}>
                  <action.icon className={`w-5 h-5 text-${accentColor}-600`} />
                </div>
                <span className="text-xs text-gray-700">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Info sections */}
        <div className="p-4">
          {/* Company info */}
          {contact.company && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Entreprise</h3>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                  <FiBriefcase className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{contact.company}</p>
                  <p className="text-xs text-gray-500">Compte professionnel</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Customer info */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Informations client</h3>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">ID client:</span>
                <span className="text-gray-800 font-medium">CRM-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Statut:</span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Client actif</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Première interaction:</span>
                <span className="text-gray-800">12/01/2025</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Valeur client:</span>
                <span className="text-gray-800 font-medium">€2,450.00</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Informations de contact</h3>
            <div className="space-y-3">
              {[
                { icon: FiPhone, label: contact.phoneNumber, action: 'Appeler' },
                { icon: FiMail, label: contact.email || 'Email non renseigné', action: 'Email' },
                { icon: FiGlobe, label: 'WhatsApp Business', action: 'Voir' }
              ].map((info, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${accentColor}-100 mr-3`}>
                      <info.icon className={`w-4 h-4 text-${accentColor}-600`} />
                    </div>
                    <span className="text-sm text-gray-800">{info.label}</span>
                  </div>
                  <button className={`text-xs text-${accentColor}-600`}>{info.action}</button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Media section with toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-800">Médias partagés</h3>
              <motion.button
                onClick={() => setShowMediaSection(!showMediaSection)}
                animate={{ rotate: showMediaSection ? 180 : 0 }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <FiChevronDown className="w-4 h-4 text-gray-500" />
              </motion.button>
            </div>
            
            <AnimatePresence>
              {showMediaSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {sharedMedia
                      .filter(media => media.type === 'image')
                      .slice(0, 6)
                      .map((media, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img src={media.url} alt="" className="w-full h-full object-cover" />
                        </motion.div>
                      ))}
                  </div>
                  
                  <div className="space-y-2">
                    {sharedMedia
                      .filter(media => media.type === 'document')
                      .map((doc, index) => (
                        <div key={index} className="flex items-center p-2.5 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-gray-100 rounded-lg mr-3">
                            <FiFileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.size} • {doc.date}</div>
                          </div>
                          <button className="p-1.5 rounded-full hover:bg-gray-200">
                            <FiArrowRightCircle className="w-4 h-4 text-blue-500" />
                          </button>
                        </div>
                      ))}
                  </div>
                  
                  <button className={`mt-3 w-full py-2 text-center text-sm text-${accentColor}-600 bg-${accentColor}-50 rounded-lg hover:bg-${accentColor}-100`}>
                    Voir tous les médias
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* CRM Actions section */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-2">Actions CRM</h3>
            <div className="space-y-2">
              {[
                { icon: FiEdit, label: 'Modifier le contact', color: 'blue' },
                { icon: FiUserPlus, label: 'Assigner à un agent', color: 'indigo' },
                { icon: FiTag, label: 'Gérer les étiquettes', color: 'purple' },
                { icon: FiClipboard, label: 'Créer une tâche', color: 'amber' },
                { icon: FiFileText, label: 'Créer une note', color: 'emerald' },
                { icon: FiFlag, label: 'Signaler un problème', color: 'red' },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 3, backgroundColor: '#f9fafb' }}
                  className="w-full flex items-center p-3 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${action.color}-100 mr-3`}>
                    <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                  </div>
                  <span className="text-sm text-gray-800">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Danger zone */}
      <div className="p-4 border-t border-gray-100">
        <motion.button
          whileHover={{ backgroundColor: '#fee2e2' }}
          className="w-full flex items-center justify-center p-3 rounded-lg text-red-600"
        >
          <FiArchive className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Archiver la conversation</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Add WhatsApp Account Modal
interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountAdded: (newAccount: IWhatsAppAccount) => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onAccountAdded }) => {
  const [accountName, setAccountName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [step, setStep] = useState(1);
  const [qrReady, setQrReady] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const resetForm = () => {
    setAccountName('');
    setPhoneNumber('');
    setBusinessName('');
    setStep(1);
    setQrReady(false);
  };
  
  const handleSubmit = () => {
    if (step === 1) {
      setStep(2);
      setTimeout(() => {
        setQrReady(true);
      }, 1500);
    } else {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const newAccount = {
          id: `acc_${Date.now()}`,
          phoneNumber,
          name: accountName,
          businessName,
          status: "connected" as const,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName)}&background=213f5b&color=fff`,
          messagesPerDay: 0,
          messagesTotal: 0
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
          <h2 className="text-lg font-semibold">Ajouter un compte WhatsApp</h2>
          <button onClick={() => { onClose(); resetForm(); }} className="p-1 rounded-full hover:bg-white/20">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Configurez votre compte WhatsApp Business pour l&apos;intégrer à votre CRM.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du compte</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Ex: Support Client"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+33612345678"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d&apos;entreprise (optionnel)</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Votre entreprise"
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
                  disabled={!accountName || !phoneNumber}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    accountName && phoneNumber
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
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Connectez votre WhatsApp</h3>
                  <p className="text-gray-600 text-sm">Scannez ce code QR avec WhatsApp sur votre téléphone</p>
                </div>
                
                <div className="flex justify-center mb-4">
                  {qrReady ? (
                    <div className="border-2 border-indigo-500 rounded-lg p-2 bg-white">
                      <img src="/api/placeholder/200/200" alt="QR Code" className="w-48 h-48 object-cover" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-blue-100">
                      <FiInfo className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Comment connecter</h4>
                      <ol className="text-xs text-blue-700 mt-1 space-y-1">
                        <li>1. Ouvrez WhatsApp sur votre téléphone</li>
                        <li>2. Allez dans Paramètres &gt; Appareils connectés</li>
                        <li>3. Appuyez sur &quot;Connecter un appareil&quot;</li>
                        <li>4. Scannez le code QR affiché</li>
                      </ol>
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
                  disabled={loading || !qrReady}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                    loading 
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
                    "Finaliser"
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

// Add Contact Modal
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactAdded: (newContact: IContact, accountId: string) => void;
  accounts: IWhatsAppAccount[];
}

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onContactAdded, accounts }) => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountId, setAccountId] = useState('');
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = () => {
    if (!contactName || !phoneNumber || !accountId) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newContact = {
        id: `contact_${Date.now()}`,
        name: contactName,
        phoneNumber,
        isBusinessAccount,
        company: isBusinessAccount ? company : undefined,
        profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
      
      onContactAdded(newContact, accountId);
      setLoading(false);
      resetForm();
      onClose();
    }, 1000);
  };
  
  const resetForm = () => {
    setContactName('');
    setPhoneNumber('');
    setAccountId(accounts.length > 0 ? accounts[0].id : '');
    setIsBusinessAccount(false);
    setCompany('');
  };
  
  useEffect(() => {
    if (isOpen && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [isOpen, accounts]);
  
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
        <div className="bg-emerald-500 p-4 flex items-center justify-between text-white">
          <h2 className="text-lg font-semibold">Ajouter un contact</h2>
          <button onClick={() => { onClose(); resetForm(); }} className="p-1 rounded-full hover:bg-white/20">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du contact</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+33612345678"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compte WhatsApp à utiliser</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.phoneNumber})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBusinessAccount"
                checked={isBusinessAccount}
                onChange={(e) => setIsBusinessAccount(e.target.checked)}
                className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="isBusinessAccount" className="ml-2 block text-sm text-gray-700">
                Contact professionnel
              </label>
            </div>
            
            {isBusinessAccount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nom de l'entreprise"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            )}
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
              disabled={loading || !contactName || !phoneNumber || !accountId}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                loading || !contactName || !phoneNumber || !accountId
                  ? 'bg-emerald-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Ajout en cours...
                </div>
              ) : (
                "Ajouter contact"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Create Template Modal
interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (newTemplate: ITemplate) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onTemplateCreated }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [category, setCategory] = useState('utility');
  const [language, setLanguage] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  
  const handleSubmit = () => {
    if (!templateName || !templateContent) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newTemplate = {
        id: `template_${Date.now()}`,
        name: templateName,
        content: templateContent,
        variables,
        category: category as "utility" | "marketing" | "customer_service",
        status: "pending" as const,
        language
      };
      
      onTemplateCreated(newTemplate);
      setLoading(false);
      resetForm();
      onClose();
    }, 1000);
  };
  
  const resetForm = () => {
    setTemplateName('');
    setTemplateContent('');
    setCategory('utility');
    setLanguage('fr');
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
    const cursorPosition = (document.getElementById('templateContent') as HTMLTextAreaElement).selectionStart;
    const textBefore = templateContent.substring(0, cursorPosition);
    const textAfter = templateContent.substring(cursorPosition);
    
    const varIndex = variables.indexOf(variable) + 1;
    const textToInsert = `{{${varIndex}}}`;
    
    setTemplateContent(textBefore + textToInsert + textAfter);
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
          <h2 className="text-lg font-semibold">Créer un template WhatsApp</h2>
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as "utility" | "marketing" | "customer_service")}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="utility">Utilitaire</option>
                  <option value="marketing">Marketing</option>
                  <option value="customer_service">Service client</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
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
                id="templateContent"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Ex: Bonjour {{1}}, votre commande #{{2}} a été confirmée."
                rows={5}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Utilisez  etc. pour insérer des variables dans votre template.
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-blue-100">
                  <FiInfo className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">À propos des templates WhatsApp</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Les templates doivent être approuvés par WhatsApp avant utilisation. Le processus d&apos;approbation prend généralement 24 à 48 heures.
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
              disabled={loading || !templateName || !templateContent}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                loading || !templateName || !templateContent
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

// Tag Badge Component
const TagBadge: React.FC<{ tag: string; removable?: boolean; onRemove?: (tag: string) => void }> = ({ tag, removable = false, onRemove }) => {
  return (
    <div 
      className="flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ 
        backgroundColor: tagColors[tag as keyof typeof tagColors]?.bg || '#eaeaea',
        color: tagColors[tag as keyof typeof tagColors]?.text || '#213f5b'
      }}
    >
      <span className="max-w-[100px] truncate">{tag}</span>
      {removable && (
        <button 
          onClick={() => onRemove?.(tag)}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10"
        >
          <FiX className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// Format time helper
const formatTime = (dateString: string) => {
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

// Define the FiMail component since it's not imported from react-icons
// interface FiMailProps extends React.SVGProps<SVGSVGElement> {}

const FiMail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24" 
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

// Define the FiReply component since it's not imported from react-icons
// interface FiReplyProps extends React.SVGProps<SVGSVGElement> {}

const FiReply: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <polyline points="9 10 4 15 9 20"></polyline>
    <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
  </svg>
);

// Main WhatsApp Business Interface
const WhatsAppBusinessInterface = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState<keyof typeof colorHexMap>('indigo');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  
  // States for WhatsApp business functionality
  const [whatsappAccounts, setWhatsappAccounts] = useState<IWhatsAppAccount[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [isTemplateVisible, setIsTemplateVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  
  // Stats data
  const [stats, setStats] = useState({
    totalMessages: 0,
    todayMessages: 0,
    responseRate: 0,
    avgResponseTime: 0
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Available colors
  const colors = [
    'indigo', 'blue', 'emerald', 'purple', 'pink', 'amber', 'rose'
  ] as const;
  
  // Mock data initialization
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        
        // Mock WhatsApp accounts
        const mockAccounts: IWhatsAppAccount[] = [
          {
            id: "1",
            phoneNumber: "+33123456789",
            name: "Support Principal",
            status: "connected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Support&background=213f5b&color=fff",
            messagesPerDay: 128,
            messagesTotal: 3240
          },
          {
            id: "2",
            phoneNumber: "+33987654321",
            name: "Service Commercial",
            status: "connected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Commercial&background=2cb67d&color=fff",
            messagesPerDay: 85,
            messagesTotal: 1870
          },
          {
            id: "3",
            phoneNumber: "+33678901234",
            name: "Service Technique",
            status: "disconnected",
            businessName: "Votre Entreprise",
            profileImage: "https://ui-avatars.com/api/?name=Technique&background=7f5af0&color=fff",
            messagesPerDay: 0,
            messagesTotal: 960
          }
        ];
        
        // Mock conversations
        const mockContacts: IContact[] = Array.from({ length: 20 }, (_, i) => ({
          id: `contact_${i}`,
          name: `Contact ${i + 1}`,
          phoneNumber: `+336789012${i.toString().padStart(2, '0')}`,
          profilePicture: `https://i.pravatar.cc/150?img=${i + 10}`,
          isBusinessAccount: Math.random() > 0.7,
          company: Math.random() > 0.7 ? `Entreprise ${i + 1}` : undefined,
          lastActivity: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        }));
        
        const mockConversations: IConversation[] = mockContacts.map((contact, i) => {
          const tags = ["lead", "client", "urgent", "follow-up", "support"];
          const randomTags: string[] = [];
          const tagCount = Math.floor(Math.random() * 3);
          
          for (let j = 0; j < tagCount; j++) {
            const tag = tags[Math.floor(Math.random() * tags.length)];
            if (!randomTags.includes(tag)) {
              randomTags.push(tag);
            }
          }
          
          const account = mockAccounts[Math.floor(Math.random() * mockAccounts.length)];
          
          return {
            id: `conv_${i}`,
            contact,
            lastMessage: {
              id: `msg_last_${i}`,
              content: `Dernier message de la conversation ${i + 1}. ${Math.random() > 0.5 ? "Bonjour, j'ai une question concernant votre service..." : "Merci pour votre réponse rapide !"}`,
              timestamp: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
              status: ["sent", "delivered", "read"][Math.floor(Math.random() * 3)] as "sending" | "sent" | "delivered" | "read" | "failed",
              sender: Math.random() > 0.5 ? `contact_${i}` : "me",
              isIncoming: Math.random() > 0.5,
            },
            unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
            whatsappNumber: account.phoneNumber,
            tags: randomTags,
            status: ["active", "archived", "pending"][Math.floor(Math.random() * 3)] as "active" | "archived" | "pending"
          };
        });
        
        // Mock templates
        const mockTemplates: ITemplate[] = [
          {
            id: "template_1",
            name: "Accueil client",
            content: "Bonjour {{1}}, merci de nous avoir contacté ! Un conseiller vous répondra dans les plus brefs délais.",
            variables: ["nom_client"],
            category: "customer_service",
            status: "approved",
            language: "fr"
          },
          {
            id: "template_2",
            name: "Confirmation commande",
            content: "Votre commande #{{1}} d'un montant de {{2}}€ a été confirmée. Livraison prévue le {{3}}.",
            variables: ["numero_commande", "montant", "date_livraison"],
            category: "utility",
            status: "approved",
            language: "fr"
          },
          {
            id: "template_3",
            name: "Promotion mensuelle",
            content: "Offre exclusive pour vous, {{1}} ! Bénéficiez de {{2}}% de réduction sur notre gamme {{3}} jusqu'au {{4}}.",
            variables: ["nom_client", "pourcentage", "gamme_produit", "date_fin"],
            category: "marketing",
            status: "approved",
            language: "fr"
          }
        ];
        
        // Mock stats
        const mockStats = {
          totalMessages: 5120,
          todayMessages: 423,
          responseRate: 92,
          avgResponseTime: 8
        };
        
        // Sort conversations by last message timestamp
        mockConversations.sort((a, b) => 
          new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
        
        setWhatsappAccounts(mockAccounts);
        setConversations(mockConversations);
        setTemplates(mockTemplates);
        setStats(mockStats);
        
        if (mockAccounts.length > 0) {
          setSelectedAccount(mockAccounts[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };
    
    initData();
  }, []);
  
  // Generate messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Generate mock messages
      const mockMessages: IMessage[] = Array.from({ length: 15 }, (_, i) => {
        const isIncoming = Math.random() > 0.4;
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 24));
        date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
        
        return {
          id: `msg_${i}`,
          content: getMessageContent(i, isIncoming),
          timestamp: date.toISOString(),
          status: isIncoming ? "read" : ["sent", "delivered", "read"][Math.floor(Math.random() * 3)] as "sending" | "sent" | "delivered" | "read" | "failed",
          sender: isIncoming ? selectedConversation.contact.id : "me",
          isIncoming,
          attachments: Math.random() > 0.8 ? getRandomAttachments() : undefined
        };
      });
      
      // Sort messages by timestamp
      mockMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setMessages(mockMessages);
      
      // Mark conversation as read when selected
      setConversations(prev => 
        prev.map(c => 
          c.id === selectedConversation.id ? {...c, unreadCount: 0} : c
        )
      );
    }
  }, [selectedConversation]);

  // Auto scroll to bottom of message list when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to generate random message content
  function getMessageContent(index: number, isIncoming: boolean) {
    const incomingMessages = [
      "Bonjour, je souhaiterais avoir des informations sur vos services.",
      "Est-ce que vous proposez des devis gratuits ?",
      "Quel est le délai de livraison pour une commande passée aujourd'hui ?",
      "Merci beaucoup pour ces précisions !",
      "Avez-vous un catalogue que je pourrais consulter ?",
      "Je voudrais prendre rendez-vous avec un de vos conseillers.",
      "Quelle est votre adresse exacte ?",
      "Vos prix sont-ils négociables pour les commandes en grande quantité ?",
      "Parfait, je vous remercie pour votre aide."
    ];
    
    const outgoingMessages = [
      "Bonjour ! Bien sûr, je serais ravi de vous renseigner. Que souhaitez-vous savoir exactement ?",
      "Absolument, nous proposons des devis personnalisés et gratuits sans engagement.",
      "Pour une commande passée aujourd'hui, le délai de livraison est de 3 à 5 jours ouvrés.",
      "Je vous en prie, n'hésitez pas si vous avez d'autres questions !",
      "Oui, je peux vous envoyer notre catalogue par email. Pouvez-vous me communiquer votre adresse email ?",
      "Bien sûr, quand seriez-vous disponible ? Nous avons des créneaux lundi et mardi prochain.",
      "Notre adresse est 123 Avenue de la République, 75011 Paris.",
      "Tout à fait, nous offrons des remises à partir de 10 unités. Je peux vous faire une simulation si vous le souhaitez.",
      "C'est avec plaisir ! Nous restons à votre disposition pour toute information complémentaire."
    ];
    
    // Make conversation flow more natural
    if (index < 2) {
      return isIncoming ? incomingMessages[0] : outgoingMessages[0];
    }
    
    return isIncoming 
      ? incomingMessages[index % incomingMessages.length] 
      : outgoingMessages[index % outgoingMessages.length];
  }

  // Helper function to generate random attachments
  function getRandomAttachments(): IAttachment[] {
    const types = ["image", "document", "audio", "video"];
    const randomType = types[Math.floor(Math.random() * types.length)] as "image" | "document" | "audio" | "video";
    
    const attachments: IAttachment[] = [{
      type: randomType,
      url: "#",
      name: randomType === "document" ? "document_" + Math.floor(Math.random() * 1000) + ".pdf" : undefined,
      size: Math.floor(Math.random() * 5000000),
      thumbnail: randomType === "image" ? `/api/placeholder/${Math.floor(Math.random() * 100) + 100}/${Math.floor(Math.random() * 100) + 100}` : undefined
    }];
    
    return attachments;
  }

  // Send a new message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg: IMessage = {
      id: `msg_new_${Date.now()}`,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: "sending",
      sender: "me",
      isIncoming: false
    };
    
    // Add message to the messages array
    setMessages(prev => [...prev, newMsg]);
    
    // Clear the input
    setNewMessage("");
    setShowEmojiPicker(false);
    setShowAttachments(false);
    setIsTemplateVisible(false);
    
    // Update conversation with new last message
    setConversations(prev => 
      prev.map(c => 
        c.id === selectedConversation.id 
          ? {
              ...c, 
              lastMessage: newMsg
            } 
          : c
      )
    );
    
    // Simulate message being sent (status changes)
    setTimeout(() => {
      setMessages(prev => 
        prev.map(m => 
          m.id === newMsg.id ? {...m, status: "sent"} : m
        )
      );
      
      setConversations(prev => 
        prev.map(c => 
          c.id === selectedConversation.id && c.lastMessage.id === newMsg.id
            ? {
                ...c, 
                lastMessage: {...c.lastMessage, status: "sent"}
              } 
            : c
        )
      );
      
      // Simulate delivered status after 2 seconds
      setTimeout(() => {
        setMessages(prev => 
          prev.map(m => 
            m.id === newMsg.id ? {...m, status: "delivered"} : m
          )
        );
        
        setConversations(prev => 
          prev.map(c => 
            c.id === selectedConversation.id && c.lastMessage.id === newMsg.id
              ? {
                  ...c, 
                  lastMessage: {...c.lastMessage, status: "delivered"}
                } 
              : c
          )
        );
        
        // Simulate read status after 4 seconds
        setTimeout(() => {
          setMessages(prev => 
            prev.map(m => 
              m.id === newMsg.id ? {...m, status: "read"} : m
            )
          );
          
          setConversations(prev => 
            prev.map(c => 
              c.id === selectedConversation.id && c.lastMessage.id === newMsg.id
                ? {
                    ...c, 
                    lastMessage: {...c.lastMessage, status: "read"}
                  } 
                : c
            )
          );
          
          // Simulate reply after 6 seconds
          setTimeout(() => {
            const replyMsg: IMessage = {
              id: `msg_reply_${Date.now()}`,
              content: "Merci pour votre message ! Je reviendrai vers vous dès que possible.",
              timestamp: new Date().toISOString(),
              status: "delivered",
              sender: selectedConversation.contact.id,
              isIncoming: true
            };
            
            setMessages(prev => [...prev, replyMsg]);
            
            setConversations(prev => 
              prev.map(c => 
                c.id === selectedConversation.id 
                  ? {
                      ...c, 
                      lastMessage: replyMsg
                    } 
                  : c
              )
            );
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1000);
  };

  // Handle template selection
  const handleSelectTemplate = (template: ITemplate) => {
    const contentWithVariables = template.content.replace(/{{(\d+)}}/g, '___');
    setNewMessage(contentWithVariables);
    setIsTemplateVisible(false);
  };

  // Filter conversations based on search, account, and filter selections
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        conversation.contact.phoneNumber.includes(searchTerm) ||
                        conversation.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAccount = !selectedAccount || conversation.whatsappNumber === whatsappAccounts.find(a => a.id === selectedAccount)?.phoneNumber;
    
    const matchesStatus = !statusFilter || conversation.status === statusFilter;
    
    const matchesTag = !tagFilter || (conversation.tags && conversation.tags.includes(tagFilter));
    
    return matchesSearch && matchesAccount && matchesStatus && matchesTag;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTagFilter("");
  };

  // Main layout
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`h-screen flex flex-col overflow-hidden pt-16 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-[#f8fafc] to-[#f0f7ff] text-gray-800'}`}
    >
      {/* Dashboard Header with Stats */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700 mb-1 pl-2">WhatsApp Business</h1>
            <p className="text-gray-500 pl-2">Gérez vos conversations WhatsApp depuis votre CRM</p>
          </div>
          
          <div className="flex items-center gap-3 self-end">
            <button
              onClick={() => setIsCreateTemplateModalOpen(true)}
              className="border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors rounded-lg px-3 py-1.5 text-sm flex items-center shadow-sm hover:shadow"
            >
              <FiClipboard className="w-4 h-4 mr-2" />
              Créer un template
            </button>
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-all rounded-lg px-3 py-1.5 text-sm flex items-center shadow-md hover:shadow-lg"
            >
              <FiUserPlus className="w-4 h-4 mr-2" />
              Ajouter un compte
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600 font-medium">Total messages</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.totalMessages.toLocaleString()}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">sur tous les comptes</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg shadow-indigo-100">
                <FiMessageSquare className="h-5 w-5 text-white" />
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
                <p className="text-sm text-gray-600 font-medium">Messages aujourd&apos;hui</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.todayMessages}</p>
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">+12%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">depuis hier</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-100">
                <FiBarChart2 className="h-5 w-5 text-white" />
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
                <p className="text-sm text-gray-600 font-medium">Taux de réponse</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.responseRate}%</p>
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Excellent</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">messages clients traités</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-100">
                <FiCheckCircle className="h-5 w-5 text-white" />
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="absolute -z-10 right-0 bottom-0 w-32 h-32 bg-amber-100 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Temps de réponse</p>
                <div className="flex items-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.avgResponseTime} <span className="text-lg font-medium">min</span></p>
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Moyen</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">temps moyen</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-100">
                <FiClock className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Conversation list */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '30%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`h-full flex flex-col border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
              style={{ minWidth: '320px', maxWidth: '400px' }}
            >
              {/* Header with account selection */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <select
                    value={selectedAccount || ""}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className={`flex-1 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  >
                    {whatsappAccounts.map(account => (
                      <option key={account.id} value={account.id} disabled={account.status === "disconnected"}>
                        {account.name} ({account.phoneNumber}) 
                        {account.status === "disconnected" ? " - Déconnecté" : ""}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setIsAddContactModalOpen(true)}
                    className={`p-2 rounded-full ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiUserPlus className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher une conversation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-10 py-2.5 w-full rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                    } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Filters */}
                <div className="flex items-center mt-3 gap-2">
                  <button 
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className={`flex items-center gap-1 text-xs rounded-lg py-1.5 px-3 ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiFilter className="w-3.5 h-3.5" />
                    <span>Filtres</span>
                    {(statusFilter || tagFilter) && (
                      <span className={`flex items-center justify-center h-4 w-4 text-xs font-medium rounded-full ml-1 ${
                        darkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {(statusFilter ? 1 : 0) + (tagFilter ? 1 : 0)}
                      </span>
                    )}
                  </button>
                  
                  {/* Quick filters */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    <button
                      onClick={() => setStatusFilter(statusFilter === "active" ? "" : "active")}
                      className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                        statusFilter === "active" 
                          ? 'bg-indigo-600 text-white' 
                          : darkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Actives
                    </button>
                    <button
                      onClick={() => setStatusFilter(statusFilter === "pending" ? "" : "pending")}
                      className={`text-xs rounded-lg py-1.5 px-3 whitespace-nowrap ${
                        statusFilter === "pending" 
                          ? 'bg-indigo-600 text-white' 
                          : darkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Non lues
                    </button>
                  </div>
                </div>
                
                {/* Expanded Filters */}
                <AnimatePresence>
                  {isFiltersVisible && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className={`pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Étiquettes
                            </label>
                            <select
                              value={tagFilter}
                              onChange={(e) => setTagFilter(e.target.value)}
                              className={`w-full rounded-lg text-sm ${
                                darkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white' 
                                  : 'bg-gray-50 border-gray-200 text-gray-800'
                              } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            >
                              <option value="">Toutes les étiquettes</option>
                              {Object.keys(tagColors).map((tag) => (
                                <option key={tag} value={tag}>
                                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        {(statusFilter || tagFilter) && (
                          <button 
                            onClick={clearFilters}
                            className={`mt-2 text-xs ${
                              darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
                            }`}
                          >
                            Effacer les filtres
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Conversations list */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col justify-center items-center p-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full blur opacity-30 animate-pulse"></div>
                      <div className="relative animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} animate-pulse`}>
                      Chargement des conversations...
                    </p>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                      <FiAlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                      className={`mt-2 text-sm py-2 px-4 rounded-lg ${
                        darkMode
                          ? 'bg-red-700 hover:bg-red-800 text-white'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                      onClick={() => window.location.reload()}
                    >
                      Rafraîchir
                    </button>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="relative mx-auto mb-6 w-20 h-20">
                      <div className="absolute inset-0 bg-indigo-400 opacity-20 rounded-full animate-pulse"></div>
                      <FiMessageSquare className="w-20 h-20 text-indigo-400" />
                    </div>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                      Aucune conversation
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      Aucune conversation ne correspond à vos critères de recherche.
                    </p>
                    <button 
                      onClick={clearFilters}
                      className={`py-2 px-4 rounded-lg text-sm ${
                        darkMode
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <FiX className="w-4 h-4 inline-block mr-2" />
                      Effacer les filtres
                    </button>
                  </div>
                ) : (
                  <div className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {filteredConversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id 
                            ? darkMode 
                              ? 'bg-gray-800' 
                              : 'bg-indigo-50' 
                            : darkMode 
                              ? 'hover:bg-gray-800' 
                              : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          setShowLeftPanel(window.innerWidth > 768);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden ${
                              conversation.unreadCount > 0 
                                ? 'ring-2 ring-indigo-500' 
                                : darkMode 
                                  ? 'ring-1 ring-gray-700' 
                                  : 'ring-1 ring-gray-200'
                            }`}>
                              {conversation.contact.profilePicture ? (
                                <img 
                                  src={conversation.contact.profilePicture} 
                                  alt={conversation.contact.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className={`h-full w-full flex items-center justify-center text-white font-bold text-lg ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-500'
                                }`}>
                                  {conversation.contact.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            {conversation.contact.isBusinessAccount && (
                              <div className={`absolute -right-1 -bottom-1 rounded-full p-1 ${
                                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                <FiBriefcase className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className={`font-semibold truncate pr-2 ${
                                darkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                                {conversation.contact.name}
                              </h3>
                              <span className={`text-xs whitespace-nowrap font-medium ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-0.5">
                              {!conversation.lastMessage.isIncoming && (
                                <span className="text-gray-400">
                                  {conversation.lastMessage.status === 'sent' ? (
                                    <FiCheck className="w-3 h-3" />
                                  ) : conversation.lastMessage.status === 'delivered' ? (
                                    <div className="flex">
                                      <FiCheck className="w-3 h-3" /><FiCheck className="w-3 h-3 -ml-1" />
                                    </div>
                                  ) : conversation.lastMessage.status === 'read' ? (
                                    <div className="flex text-blue-500">
                                      <FiCheck className="w-3 h-3" /><FiCheck className="w-3 h-3 -ml-1" />
                                    </div>
                                  ) : (
                                    <FiClock className="w-3 h-3" />
                                  )}
                                </span>
                              )}
                              <p className={`text-sm truncate ${
                                darkMode
                                  ? conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'
                                  : conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}>
                                {!conversation.lastMessage.isIncoming && "Vous: "}
                                {conversation.lastMessage.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex gap-1 flex-wrap max-w-[170px]">
                                {conversation.tags && conversation.tags.map(tag => (
                                  <TagBadge 
                                    key={tag}
                                    tag={tag}
                                    removable={false}
                                    onRemove={() => {}}
                                  />
                                ))}
                              </div>
                              
                              {conversation.unreadCount > 0 && (
                                <span className={`flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full ${
                                  darkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Bottom actions */}
              <div className={`p-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-full ${
                      darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                      <FiArchive className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-full ${
                      darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                    }`}>
                      <FiSettings className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs ${
                      darkMode 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                    }`}>
                      <FiRefreshCw className="w-4 h-4 inline-block mr-1" />
                      Synchroniser
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Right panel - Chat view */}
        <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center justify-between ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  {!showLeftPanel && (
                    <button 
                      onClick={() => setShowLeftPanel(true)}
                      className={`p-2 rounded-full ${
                        darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setShowProfilePanel(true)}
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {selectedConversation.contact.profilePicture ? (
                          <img 
                            src={selectedConversation.contact.profilePicture} 
                            alt={selectedConversation.contact.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`h-full w-full flex items-center justify-center text-white font-bold ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-600'
                          }`}>
                            {selectedConversation.contact.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <OnlineIndicator isOnline={true} isTyping={false} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {selectedConversation.contact.name}
                        </h3>
                        {selectedConversation.contact.isBusinessAccount && (
                          <span className={`text-xs rounded-full px-2 py-0.5 ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            Business
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedConversation.contact.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <FiPhone className="w-5 h-5" />
                  </button>
                  <button className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <FiSearch className="w-5 h-5" />
                  </button>
                  <button className={`p-2 rounded-full ${
                    darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}>
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 md:p-6"
                style={{ 
                  backgroundImage: darkMode 
                    ? 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23374151\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                    : 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
                }}
              >
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isUser={!message.isIncoming}
                    accentColor={accentColor}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Template Messages Panel */}
              <AnimatePresence>
                {isTemplateVisible && (
                  <TemplatePanel 
                    templates={templates} 
                    onSelectTemplate={handleSelectTemplate}
                    onClose={() => setIsTemplateVisible(false)}
                    accentColor={accentColor}
                  />
                )}
              </AnimatePresence>
              
              {/* Input Area */}
              <div className={`border-t p-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-end gap-2">
                  <div className="flex gap-2">
                    <div className="relative">
                      <button
                        onClick={() => {
                          setShowAttachments(!showAttachments);
                          setShowEmojiPicker(false);
                        }}
                        className={`p-2.5 rounded-full ${
                          darkMode 
                            ? showAttachments ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700' 
                            : showAttachments ? 'bg-gray-200 text-gray-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FiPaperclip className="w-5 h-5" />
                      </button>
                      
                      <AnimatePresence>
                        {showAttachments && (
                          <AttachmentPanel 
                            onClose={() => setShowAttachments(false)}
                            accentColor={accentColor}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsTemplateVisible(!isTemplateVisible);
                        setShowEmojiPicker(false);
                        setShowAttachments(false);
                      }}
                      className={`p-2.5 rounded-full ${
                        darkMode 
                          ? isTemplateVisible ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700' 
                          : isTemplateVisible ? 'bg-gray-200 text-gray-800' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiClipboard className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez un message..."
                      className={`w-full rounded-2xl border-none min-h-[44px] max-h-[120px] py-2.5 px-4 resize-none focus:ring-2 ${
                        darkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500' 
                        : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-indigo-500'
                      }`}
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowAttachments(false);
                      }}
                      className={`p-2.5 rounded-full ${
                        darkMode 
                          ? showEmojiPicker ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700' 
                          : showEmojiPicker ? 'bg-gray-200 text-gray-800' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiSmile className="w-5 h-5" />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <EmojiPicker 
                          onSelectEmoji={(emoji) => {
                            setNewMessage(prev => prev + emoji);
                          }}
                          onClose={() => setShowEmojiPicker(false)}
                          accentColor={accentColor}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {newMessage.trim() ? (
                    <button
                      onClick={sendMessage}
                      className={`p-2.5 rounded-full bg-${accentColor}-500 text-white`}
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      className={`p-2.5 rounded-full ${
                        darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FiMic className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Contact profile panel */}
              <AnimatePresence>
                {showProfilePanel && (
                  <ContactProfile
                    contact={selectedConversation.contact}
                    conversation={selectedConversation}
                    onClose={() => setShowProfilePanel(false)}
                    accentColor={accentColor}
                  />
                )}
              </AnimatePresence>
            </>
          ) : (
            // Empty state when no conversation is selected
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 mb-6">
                <div className={`absolute inset-0 bg-${accentColor}-100 opacity-50 rounded-full animate-pulse`}></div>
                <FiMessageSquare className={`w-32 h-32 text-${accentColor}-400`} />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                WhatsApp Business
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md text-center mb-6`}>
                Sélectionnez une conversation pour commencer à échanger des messages avec vos contacts directement depuis votre CRM.
              </p>
              <button
                onClick={() => setIsAddContactModalOpen(true)}
                className={`px-4 py-2 rounded-lg bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white flex items-center`}
              >
                <FiUserPlus className="w-4 h-4 mr-2" />
                Nouvelle conversation
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Theme and accent color picker */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-xl p-1.5 flex items-center gap-2"
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
        
        <div className="h-6 w-px bg-gray-200"></div>
        
        <div className="flex items-center gap-1 px-2">
          {colors.map((color: keyof typeof colorHexMap) => (
            <motion.button
              key={color}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              onClick={() => setAccentColor(color)}
              className={`w-6 h-6 rounded-full ${accentColor === color ? 'ring-2 ring-gray-300' : ''}`}
              style={{ backgroundColor: getColorHex(color) }}
            >
              {accentColor === color && (
                <FiCheck className="w-4 h-4 text-white m-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
      
      {/* Modals */}
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAccountAdded={(newAccount) => {
          setWhatsappAccounts(prev => [...prev, newAccount]);
          setSelectedAccount(newAccount.id);
        }}
      />
      
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        accounts={whatsappAccounts.filter(acc => acc.status === "connected")}
        onContactAdded={(newContact, accountId) => {
          const account = whatsappAccounts.find(a => a.id === accountId);
          if (account) {
            const newConversation: IConversation = {
              id: `conv_new_${Date.now()}`,
              contact: newContact,
              lastMessage: {
                id: `msg_welcome_${Date.now()}`,
                content: "Bienvenue ! Comment puis-je vous aider ?",
                timestamp: new Date().toISOString(),
                status: "sent",
                sender: "me",
                isIncoming: false,
              },
              unreadCount: 0,
              whatsappNumber: account.phoneNumber,
              tags: ["lead"],
              status: "active",
            };
            
            setConversations(prev => [newConversation, ...prev]);
            setSelectedConversation(newConversation);
          }
        }}
      />
      
      <CreateTemplateModal
        isOpen={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onTemplateCreated={(newTemplate) => {
          setTemplates(prev => [...prev, newTemplate]);
        }}
      />
    </motion.div>
  );
};

// Helper to get hex color code from color name
const colorHexMap: Record<'indigo' | 'blue' | 'emerald' | 'purple' | 'pink' | 'amber' | 'rose', string> = {
  'indigo': '#6366F1',
  'blue': '#3B82F6',
  'emerald': '#10B981',
  'purple': '#8B5CF6',
  'pink': '#EC4899',
  'amber': '#F59E0B',
  'rose': '#F43F5E'
};

const getColorHex = (color: keyof typeof colorHexMap): string => {
  return colorHexMap[color] || colorHexMap['indigo'];
};

export default WhatsAppBusinessInterface;