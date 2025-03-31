import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiMaximize2, FiMessageSquare, FiMinimize, FiSend, FiUser, FiX } from "react-icons/fi";
// import { useRouter } from 'next/navigation';

interface KalicomChatMessage {
    id: number;
    sender: 'user' | 'support';
    message: string;
    timestamp: string;
  }

// Sample Kalicom chat messages for the widget
const kalicomChatMessages: KalicomChatMessage[] = [
    { id: 1, sender: 'support', message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', timestamp: '10:30' },
    { id: 2, sender: 'user', message: 'Bonjour, j\'ai un problème avec la configuration de mon PBX.', timestamp: '10:31' },
    { id: 3, sender: 'support', message: 'Je comprends. Pouvez-vous me donner plus de détails sur le problème que vous rencontrez ?', timestamp: '10:32' },
    { id: 4, sender: 'user', message: 'Les appels ne sont pas correctement transférés entre les services.', timestamp: '10:33' },
  ];

// Improved Kalicom Chat Widget Component
export const KalicomChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<KalicomChatMessage[]>(kalicomChatMessages);
  const [isOnline, setIsOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if current time is within business hours (9H to 20H)
  const checkBusinessHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 20;
  };
  
  // Set initial online status and update it every minute
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(checkBusinessHours());
    };
    
    // Initial check
    updateOnlineStatus();
    
    // Set up interval to check status every minute
    const interval = setInterval(updateOnlineStatus, 60000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg: KalicomChatMessage = {
      id: messages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate response after a delay - different responses based on time
    setTimeout(() => {
      const responseMessage = isOnline 
        ? "Merci pour votre message. Un technicien va vous répondre dans quelques instants."
        : "Nous sommes actuellement fermés (heures d'ouverture: 9H-20H). Votre message sera traité dès l'ouverture de nos bureaux.";
        
      const responseMsg: KalicomChatMessage = {
        id: messages.length + 2,
        sender: 'support',
        message: responseMessage,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, responseMsg]);
    }, 1000);
  };
  
  // Elegant entry animation for the chat button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: { scale: 0.95 }
  };
  
  // Window animations
  const windowVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <>
      {/* Enhanced Chat button with pulsing effect when online */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap="tap"
            onClick={() => setIsOpen(true)}
            className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center relative"
          >
            <FiMessageSquare className="w-6 h-6" />
            
            {/* Pulsing online indicator */}
            {isOnline && (
              <motion.span 
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 5px rgba(16, 185, 129, 0)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
          

        </motion.div>
      )}
      
      {/* Enhanced Chat window with better animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col border border-gray-200"
            style={{
              height: isMinimized ? '80px' : '500px',
              width: isMinimized ? '300px' : '350px',
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={windowVariants}
          >
            {/* Header with dynamic online status */}
            <div className={`p-4 text-white flex items-center justify-between ${isOnline ? 'bg-blue-600' : 'bg-gray-600'}`}>
              <div className="flex items-center gap-3">
                {/* Kalicom Logo - Import or reference your SVG */}
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center overflow-hidden">
                  {/* When you have the actual SVG file imported, use: */}
                  {/* <img src="/path/to/Artboard 4.svg" alt="Kalicom" className="w-6 h-6" /> */}
                  
                  {/* For now, we'll use a fallback: */}
                  <div className="text-blue-600 font-bold text-lg">K</div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Support Kalicom</h3>
                  <div className="text-xs flex items-center gap-1">
                    <span className={`w-2 h-2 ${isOnline ? 'bg-green-400' : 'bg-gray-400'} rounded-full`}></span>
                    {isOnline ? 'En ligne (9H-20H)' : 'Hors ligne'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize className="w-4 h-4" />}
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)} 
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            {/* Body with improved UI for messages */}
            {!isMinimized && (
              <>
                {/* Messages with enhanced styling */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className={`p-3 rounded-full ${isOnline ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'} mb-3`}>
                        <FiMessageSquare className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 mb-1">
                        {isOnline ? 'Comment pouvons-nous vous aider?' : 'Support fermé'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {isOnline 
                          ? 'Notre équipe technique est disponible pour répondre à vos questions.' 
                          : 'Heures d\'ouverture: 9H-20H. Laissez un message et nous vous répondrons dès que possible.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <motion.div 
                          key={msg.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender === 'support' && (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mr-2 self-end mb-2">
                              K
                            </div>
                          )}
                          
                          <div 
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              msg.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : isOnline ? 'bg-gray-200 text-gray-800 rounded-tl-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} text-right`}>
                              {msg.timestamp}
                            </div>
                          </div>
                          
                          {msg.sender === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs ml-2 self-end mb-2">
                              <FiUser className="w-3 h-3" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Input with enhanced styling and animations */}
                <div className="p-3 border-t bg-white">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={isOnline ? "Écrivez votre message..." : "Laissez un message..."}
                      className={`flex-1 py-2 px-4 border rounded-full text-sm focus:ring-2 focus:border-transparent ${
                        isOnline 
                          ? 'border-gray-300 focus:ring-blue-500' 
                          : 'border-gray-300 focus:ring-gray-500'
                      }`}
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95, rotate: 0 }}
                      onClick={handleSendMessage}
                      className={`p-2.5 text-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all ${
                        isOnline ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <FiSend className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  {/* Business hours notice */}
                  <div className="mt-2 text-center text-xs text-gray-500">
                    {isOnline 
                      ? "Support disponible 9H-20H, 7j/7" 
                      : "Heures d'ouverture: 9H-20H, 7j/7"}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
