'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiMoreVertical, FiSearch, FiSend } from 'react-icons/fi';
import { AnimatedCard } from '@/app/components/ui/AnimatedCard';
import { CircleStat } from '@/app/components/dashboard/CircleStat';

// Import the ChatMessage interface from your data file
import { ChatMessage } from '@/app/data/dashboardData';

export interface ChatSectionProps {
  darkMode: boolean;
  chatMessages: ChatMessage[];
}

const ChatMessageItem = ({ message, darkMode }: { message: ChatMessage, darkMode: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <div className="relative flex-shrink-0">
        <img 
          src={message.avatar} 
          alt={message.user} 
          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {message.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {message.user}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {message.time}
            </span>
          </div>
          {message.unread && (
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          )}
        </div>
        <p className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {message.message}
        </p>
      </div>
    </motion.div>
  );
};

export const ChatSection = memo(function ChatSection({
  darkMode,
  chatMessages
}: ChatSectionProps) {
  return (
    <AnimatedCard className="flex flex-col h-full overflow-hidden" delay={0.3}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiMessageSquare />} 
            color={darkMode ? "#EF4444" : "#EF4444"} 
            size="sm" 
            pulse={chatMessages.some(m => m.unread)}
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Conversations
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {chatMessages.filter(m => m.unread).length} nouveaux messages
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FiSearch className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <FiMoreVertical className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2" style={{ maxHeight: '320px' }}>
        {chatMessages.map((message) => (
          <ChatMessageItem 
            key={message.id} 
            message={message} 
            darkMode={darkMode} 
          />
        ))}
      </div>
      
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className={`flex items-center gap-2 p-2 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <input 
            type="text" 
            placeholder="Tapez votre message..." 
            className={`flex-1 bg-transparent outline-none text-sm ${
              darkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-700 placeholder:text-gray-500'
            }`}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full ${
              darkMode 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FiSend className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </AnimatedCard>
  );
});

export default ChatSection;