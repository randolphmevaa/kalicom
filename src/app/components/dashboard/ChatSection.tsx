'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FiMessageSquare,
  FiSearch,
  FiMaximize2,
  FiMinimize2,
  FiArrowRight,
} from 'react-icons/fi';
import { CircleStat } from '@/app/components/dashboard/CircleStat';

// Define TypeScript interfaces for our data
interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
}

interface MessagePreviewProps {
  message: ChatMessage;
  onClick: () => void;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

// Animated Card Component
const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0, 
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
      className={`bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Message Preview with animations and status indicators
const MessagePreview: React.FC<MessagePreviewProps> = ({ message, onClick }) => {
  return (
    <motion.div
      whileHover={{ x: 3, backgroundColor: '#f8fafc' }}
      whileTap={{ backgroundColor: '#f1f5f9' }}
      onClick={onClick}
      className="p-3 border-b border-gray-100 cursor-pointer flex items-start gap-3"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-inner border border-gray-200">
          <img src={message.avatar} alt={message.user} className="w-full h-full object-cover" />
        </div>
        {message.unread && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-md"
          />
        )}
        {message.isOnline && (
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 5px rgba(16, 185, 129, 0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-sm text-gray-800 truncate">{message.user}</h4>
          <span className="text-xs text-gray-500">{message.time}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{message.message}</p>
      </div>
    </motion.div>
  );
};

interface ChatSectionProps {
  darkMode?: boolean;
  expandedCard?: string | null;
  toggleCardExpand?: (cardId: string) => void;
}

// Sample chat data
const chatMessages: ChatMessage[] = [
  { id: 1, user: 'Emma Blanc', avatar: '/api/placeholder/30/30', message: 'Bonjour, pouvez-vous vérifier le statut du ticket TK-4868?', time: '09:32', unread: false, isOnline: true },
  { id: 2, user: 'Marc Dubois', avatar: '/api/placeholder/30/30', message: 'La démo pour Nexus Tech est confirmée pour 15h', time: '09:47', unread: true, isOnline: true },
  { id: 3, user: 'Sophie Martin', avatar: '/api/placeholder/30/30', message: 'J\'ai besoin d\'aide sur le déploiement chez Zenith', time: '10:15', unread: true, isOnline: false },
  { id: 4, user: 'Thomas Bernard', avatar: '/api/placeholder/30/30', message: 'Rapport mensuel terminé, en attente de validation', time: '10:28', unread: false, isOnline: false },
  { id: 5, user: 'Support Kalicom', avatar: '/api/placeholder/30/30', message: 'Bonjour, comment puis-je vous aider aujourd\'hui ?', time: '10:42', unread: true, isOnline: true },
];

const ChatSection: React.FC<ChatSectionProps> = ({ 
  darkMode = false, 
  expandedCard = null, 
  toggleCardExpand = (cardId) => console.log(`Toggle ${cardId}`) 
}) => {
  const unreadMessages = chatMessages.filter(m => m.unread).length;

  return (
    <AnimatedCard 
      className={`flex flex-col ${expandedCard === 'chat' ? 'lg:col-span-3' : ''}`} 
      delay={0.6}
    >
      <div className={`p-5 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiMessageSquare />} 
            color="#EF4444" 
            size="sm" 
            pulse={unreadMessages > 0} 
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Messages
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Communication interne
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className={`text-xs rounded-lg px-8 py-2 w-32 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-rose-500' 
                  : 'bg-gray-100 border-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:bg-white'
              } transition-all`}
            />
            <FiSearch className={`absolute left-2.5 top-2.5 w-3.5 h-3.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCardExpand('chat')}
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {expandedCard === 'chat' ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {chatMessages.map((message) => (
            <MessagePreview 
              key={message.id} 
              message={message} 
              onClick={() => console.log('Open chat', message.id)} 
            />
          ))}
        </div>
      </div>

      <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tapez un message..." 
            className={`w-full rounded-full px-4 py-2 pr-10 text-sm ${
              darkMode 
                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-rose-500' 
                : 'bg-white border border-gray-200 text-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent'
            } transition-all`}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-1.5 p-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          >
            <FiArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ChatSection;