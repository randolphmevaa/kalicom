"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiSend,
  // FiChevronDown,
  FiChevronLeft,
  FiRefreshCw,
  FiMoreVertical,
  FiMessageSquare,
  FiUser,
  FiUsers,
  FiMail,
  FiPhone,
  // FiMapPin,
  FiFile,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiX,
  FiInfo,
  FiStar,
  FiMic,
  FiCheck,
  FiCheckCircle,
  FiBriefcase,
  // FiArrowRight,
  FiSettings,
  FiCalendar,
  FiClock,
  // FiFilter,
  FiVideo,
  // FiArrowUp,
  FiPhoneOutgoing,
  FiPhoneIncoming,
  FiPhoneMissed,
  FiCornerUpRight,
  FiMessageCircle,
  // FiGlobe,
  // FiHelpCircle,
  FiHash
} from "react-icons/fi";

/** -----------------------------
 *  Define TypeScript interfaces
 *  -----------------------------
 */
interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  type: "staff" | "client";
  role?: string;
  status: "online" | "offline" | "away" | "busy";
  lastActive: string;
  department?: string;
  company?: string;
  unreadCount?: number;
  isStarred?: boolean;
  isMuted?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
  attachments?: Attachment[];
  reactions?: Reaction[];
  isForwarded?: boolean;
  replyTo?: string;
  messageType: "text" | "image" | "file" | "voice" | "video" | "system";
  callDuration?: number;
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "document" | "audio" | "video";
  url: string;
  size: string;
  thumbnail?: string;
}

interface Reaction {
  userId: string;
  emoji: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: ChatMessage;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  unreadCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

/** -----------------------------
 *  Sample Data
 *  -----------------------------
 */
const users: ChatUser[] = [
  {
    id: "u-001",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@company.com",
    phoneNumber: "+33 6 12 34 56 78",
    type: "staff",
    role: "Support Manager",
    status: "online",
    lastActive: "à l'instant",
    department: "Support Client",
    unreadCount: 0
  },
  {
    id: "u-002",
    firstName: "Lucas",
    lastName: "Dubois",
    email: "lucas.dubois@company.com",
    phoneNumber: "+33 6 23 45 67 89",
    type: "staff",
    role: "Sales Representative",
    status: "away",
    lastActive: "il y a 15 minutes",
    department: "Ventes",
    unreadCount: 2,
    isStarred: true
  },
  {
    id: "u-003",
    firstName: "Emma",
    lastName: "Leroy",
    email: "emma.leroy@company.com",
    phoneNumber: "+33 6 34 56 78 90",
    type: "staff",
    role: "Product Specialist",
    status: "busy",
    lastActive: "il y a 1 heure",
    department: "Produit",
    unreadCount: 0
  },
  {
    id: "u-004",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@globalsolutions.fr",
    phoneNumber: "+33 6 45 67 89 01",
    type: "client",
    status: "offline",
    lastActive: "il y a 2 jours",
    company: "Global Solutions",
    unreadCount: 0
  },
  {
    id: "u-005",
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@nexustech.fr",
    phoneNumber: "+33 6 56 78 90 12",
    type: "client",
    status: "online",
    lastActive: "il y a 5 minutes",
    company: "Nexus Tech",
    unreadCount: 5,
    isStarred: true
  },
  {
    id: "u-006",
    firstName: "Pierre",
    lastName: "Moreau",
    email: "pierre.moreau@ecohabitat.fr",
    phoneNumber: "+33 6 67 89 01 23",
    type: "client",
    status: "offline",
    lastActive: "il y a 3 jours",
    company: "Eco Habitat",
    unreadCount: 0
  },
  {
    id: "u-007",
    firstName: "Isabelle",
    lastName: "Petit",
    email: "isabelle.petit@marketingplus.fr",
    phoneNumber: "+33 6 78 90 12 34",
    type: "client",
    status: "online",
    lastActive: "il y a 30 minutes",
    company: "Marketing Plus",
    unreadCount: 1
  },
  {
    id: "u-008",
    firstName: "Romain",
    lastName: "Garcia",
    email: "romain.garcia@techpro.com",
    phoneNumber: "+33 6 89 01 23 45",
    type: "client",
    status: "offline",
    lastActive: "il y a 5 jours",
    company: "Tech Pro",
    unreadCount: 0
  }
];

const conversations: Conversation[] = [
  {
    id: "c-001",
    participants: ["u-001", "u-005"],
    lastMessage: {
      id: "m-001-5",
      sender: "u-005",
      recipient: "u-001",
      content: "Merci pour votre réponse rapide ! Je vais tester cette solution dès aujourd'hui.",
      timestamp: "2023-10-25T10:30:00",
      isRead: false,
      isDelivered: true,
      messageType: "text"
    },
    isGroup: false,
    unreadCount: 1,
    isPinned: true,
    createdAt: "2023-10-20T09:00:00",
    updatedAt: "2023-10-25T10:30:00"
  },
  {
    id: "c-002",
    participants: ["u-002", "u-004"],
    lastMessage: {
      id: "m-002-8",
      sender: "u-002",
      recipient: "u-004",
      content: "Je vous ai envoyé le devis par email. N'hésitez pas si vous avez des questions.",
      timestamp: "2023-10-24T16:45:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    isGroup: false,
    unreadCount: 0,
    isPinned: false,
    createdAt: "2023-10-18T11:20:00",
    updatedAt: "2023-10-24T16:45:00"
  },
  {
    id: "c-003",
    participants: ["u-001", "u-002", "u-003"],
    lastMessage: {
      id: "m-003-12",
      sender: "u-003",
      recipient: "",
      content: "La nouvelle mise à jour du produit sera disponible lundi prochain.",
      timestamp: "2023-10-25T09:15:00",
      isRead: false,
      isDelivered: true,
      messageType: "text"
    },
    isGroup: true,
    groupName: "Équipe Support & Ventes",
    unreadCount: 2,
    isPinned: true,
    createdAt: "2023-09-15T08:00:00",
    updatedAt: "2023-10-25T09:15:00"
  },
  {
    id: "c-004",
    participants: ["u-001", "u-006"],
    lastMessage: {
      id: "m-004-3",
      sender: "u-001",
      recipient: "u-006",
      content: "Voici le guide d'installation que vous avez demandé.",
      timestamp: "2023-10-23T14:20:00",
      isRead: true,
      isDelivered: true,
      attachments: [
        {
          id: "a-001",
          name: "guide_installation_v2.pdf",
          type: "document",
          url: "#",
          size: "2.4 MB"
        }
      ],
      messageType: "file"
    },
    isGroup: false,
    unreadCount: 0,
    isPinned: false,
    createdAt: "2023-10-23T13:10:00",
    updatedAt: "2023-10-23T14:20:00"
  },
  {
    id: "c-005",
    participants: ["u-002", "u-007"],
    lastMessage: {
      id: "m-005-7",
      sender: "u-007",
      recipient: "u-002",
      content: "Est-ce qu'on peut prévoir un appel pour discuter de notre campagne marketing ?",
      timestamp: "2023-10-25T08:05:00",
      isRead: false,
      isDelivered: true,
      messageType: "text"
    },
    isGroup: false,
    unreadCount: 1,
    isPinned: false,
    createdAt: "2023-10-10T10:30:00",
    updatedAt: "2023-10-25T08:05:00"
  },
  {
    id: "c-006",
    participants: ["u-001", "u-002", "u-003", "u-004", "u-005", "u-006", "u-007", "u-008"],
    lastMessage: {
      id: "m-006-15",
      sender: "u-001",
      recipient: "",
      content: "Nous sommes heureux de vous annoncer le lancement de notre nouvelle plateforme client !",
      timestamp: "2023-10-24T11:00:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    isGroup: true,
    groupName: "Annonces Officielles",
    unreadCount: 0,
    isPinned: false,
    createdAt: "2023-09-01T09:00:00",
    updatedAt: "2023-10-24T11:00:00"
  }
];

// Sample messages for a conversation
const sampleMessages: { [key: string]: ChatMessage[] } = {
  "c-001": [
    {
      id: "m-001-1",
      sender: "u-001",
      recipient: "u-005",
      content: "Bonjour Marie, comment puis-je vous aider aujourd'hui ?",
      timestamp: "2023-10-25T09:00:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-001-2",
      sender: "u-005",
      recipient: "u-001",
      content: "Bonjour Sophie, j'ai une question concernant l'intégration de votre API avec notre système.",
      timestamp: "2023-10-25T09:05:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-001-3",
      sender: "u-001",
      recipient: "u-005",
      content: "Bien sûr, pouvez-vous me donner plus de détails sur les difficultés que vous rencontrez ?",
      timestamp: "2023-10-25T09:10:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-001-4",
      sender: "u-005",
      recipient: "u-001",
      content: "Nous avons des problèmes lors de l'authentification OAuth. Voici les logs d'erreur que nous obtenons.",
      timestamp: "2023-10-25T09:20:00",
      isRead: true,
      isDelivered: true,
      attachments: [
        {
          id: "a-002",
          name: "error_logs.txt",
          type: "document",
          url: "#",
          size: "156 KB"
        }
      ],
      messageType: "file"
    },
    {
      id: "m-001-5",
      sender: "u-001",
      recipient: "u-005",
      content: "Merci pour ces logs. J'ai identifié le problème : vous utilisez une ancienne version du client API. Essayez de mettre à jour votre package vers la version 2.3.0 ou supérieure.",
      timestamp: "2023-10-25T10:15:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-001-6",
      sender: "u-005",
      recipient: "u-001",
      content: "Merci pour votre réponse rapide ! Je vais tester cette solution dès aujourd'hui.",
      timestamp: "2023-10-25T10:30:00",
      isRead: false,
      isDelivered: true,
      messageType: "text"
    }
  ]
};

// Helper functions
const getUser = (userId: string): ChatUser | undefined => {
  return users.find(user => user.id === userId);
};

const getConversationName = (conversation: Conversation, currentUserId: string): string => {
  if (conversation.isGroup) {
    return conversation.groupName || "Groupe sans nom";
  }
  
  const otherParticipant = conversation.participants.find(id => id !== currentUserId);
  if (otherParticipant) {
    const user = getUser(otherParticipant);
    return user ? `${user.firstName} ${user.lastName}` : "Utilisateur inconnu";
  }
  
  return "Conversation";
};

// const getConversationAvatar = (conversation: Conversation, currentUserId: string): string => {
//   if (conversation.isGroup) {
//     return conversation.groupAvatar || "";
//   }
  
//   const otherParticipant = conversation.participants.find(id => id !== currentUserId);
//   if (otherParticipant) {
//     const user = getUser(otherParticipant);
//     return user?.avatar || "";
//   }
  
//   return "";
// };

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }
};

export default function ChatPage() {
  // Current user (for demo purposes, we'll use the first staff member)
  const currentUser = users[0];
  
  // States
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [messageInput, setMessageInput] = useState<string>("");
  const [conversationFilter, setConversationFilter] = useState<"all" | "unread" | "staff" | "clients" | "starred">("all");
  const [isCreatingNewChat, setIsCreatingNewChat] = useState<boolean>(false);
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"all" | "staff" | "clients">("all");
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Effects
  useEffect(() => {
    // Simulate loading messages when a conversation is selected
    if (selectedConversation) {
      const conversationMessages = sampleMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (selectedConversation.unreadCount > 0) {
        // const updatedConversations = conversations.map(conv => 
        //   conv.id === selectedConversation.id ? { ...conv, unreadCount: 0 } : conv
        // );
        // In a real app, you would update the state here
      }
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    scrollToBottom();
  }, [messages]);
  
  // Handlers
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Find the other participant (for 1:1 conversations)
    if (!conversation.isGroup) {
      const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
      if (otherParticipantId) {
        const user = getUser(otherParticipantId);
        setSelectedUser(user || null);
      }
    } else {
      setSelectedUser(null);
    }
    
    setShowUserInfo(false);
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    const newMessage: ChatMessage = {
      id: `m-new-${Date.now()}`,
      sender: currentUser.id,
      recipient: selectedConversation.isGroup ? "" : selectedConversation.participants.find(id => id !== currentUser.id) || "",
      content: messageInput,
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true,
      messageType: "text"
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // In a real app, you would send the message to the server here
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // Find the handleFileSelected function and update it like this:
const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate file upload
      setIsUploadingFile(true);
      setTimeout(() => {
        setIsUploadingFile(false);
        
        // Create a new message with the attachment
        if (selectedConversation) {
          const file = files[0];
          const fileType: "image" | "document" | "audio" | "video" = 
            file.type.startsWith("image/") ? "image" : 
            file.type.startsWith("audio/") ? "audio" : 
            file.type.startsWith("video/") ? "video" : "document";
          
          // Map attachment type to message type
          const messageType: "text" | "image" | "file" | "voice" | "video" | "system" = 
            fileType === "image" ? "image" : 
            fileType === "audio" ? "voice" : 
            fileType === "video" ? "video" : "file";
          
          const newMessage: ChatMessage = {
            id: `m-new-${Date.now()}`,
            sender: currentUser.id,
            recipient: selectedConversation.isGroup ? "" : selectedConversation.participants.find(id => id !== currentUser.id) || "",
            content: `A envoyé un ${fileType === "image" ? "une image" : fileType === "audio" ? "un audio" : fileType === "video" ? "une vidéo" : "un fichier"}`,
            timestamp: new Date().toISOString(),
            isRead: false,
            isDelivered: true,
            attachments: [
              {
                id: `a-new-${Date.now()}`,
                name: file.name,
                type: fileType,
                url: "#",
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
              }
            ],
            messageType: messageType
          };
          
          setMessages([...messages, newMessage]);
        }
      }, 1500);
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulate sending voice message after stopping recording
      setTimeout(() => {
        if (selectedConversation) {
          const newVoiceMessage: ChatMessage = {
            id: `m-new-${Date.now()}`,
            sender: currentUser.id,
            recipient: selectedConversation.isGroup ? "" : selectedConversation.participants.find(id => id !== currentUser.id) || "",
            content: "Message vocal",
            timestamp: new Date().toISOString(),
            isRead: false,
            isDelivered: true,
            attachments: [
              {
                id: `a-new-${Date.now()}`,
                name: "voice_message.m4a",
                type: "audio",
                url: "#",
                size: "0.8 MB"
              }
            ],
            messageType: "voice"
          };
          
          setMessages([...messages, newVoiceMessage]);
        }
      }, 500);
    }
  };
  
  const filteredConversations = conversations.filter(conversation => {
    if (searchTerm) {
      const conversationName = getConversationName(conversation, currentUser.id).toLowerCase();
      return conversationName.includes(searchTerm.toLowerCase());
    }
    
    if (conversationFilter === "unread") {
      return conversation.unreadCount > 0;
    }
    
    if (conversationFilter === "staff") {
      return !conversation.isGroup && conversation.participants.some(id => {
        const user = getUser(id);
        return user && user.type === "staff" && id !== currentUser.id;
      });
    }
    
    if (conversationFilter === "clients") {
      return !conversation.isGroup && conversation.participants.some(id => {
        const user = getUser(id);
        return user && user.type === "client";
      });
    }
    
    if (conversationFilter === "starred") {
      const otherParticipantId = !conversation.isGroup ? 
        conversation.participants.find(id => id !== currentUser.id) : null;
      
      if (otherParticipantId) {
        const user = getUser(otherParticipantId);
        return user?.isStarred;
      }
      return false;
    }
    
    return true;
  });
  
  // For simple user filtering in "New Chat" mode
  const filteredUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    
    if (searchTerm) {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
    
    if (viewMode === "staff") return user.type === "staff";
    if (viewMode === "clients") return user.type === "client";
    
    return true;
  });
  
  // UI Elements
  // const statusColor = (status: string) => {
  //   switch (status) {
  //     case "online": return "#10B981";
  //     case "away": return "#F59E0B";
  //     case "busy": return "#EF4444";
  //     case "offline": return "#9CA3AF";
  //     default: return "#9CA3AF";
  //   }
  // };
  
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  // Animation variants 
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    hover: { scale: 1.02, x: 5, transition: { type: "spring", stiffness: 400, damping: 25 } }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };
  
  const statusIndicator = (status: string) => (
    <div className="relative">
      <div 
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          status === "online" ? "bg-green-500" : 
          status === "away" ? "bg-yellow-500" : 
          status === "busy" ? "bg-red-500" : "bg-gray-400"
        }`}
      />
      {status === "online" && (
        <div 
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-50"
          style={{ animationDuration: "2s" }}
        />
      )}
    </div>
  );
  
  // Return the chat component
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <div className="max-w-8xl mx-auto h-screen flex flex-col pt-16">
        {/* Main Chat Container */}
        <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-100 shadow-xl bg-white">
          {/* Sidebar - Conversations List */}
          <motion.div 
            className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out`}
            animate={{ width: isSidebarCollapsed ? 72 : 320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              {!isSidebarCollapsed && (
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold text-[#1B0353]"
                >
                  Messages
                </motion.h2>
              )}
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingNewChat(!isCreatingNewChat)}
                  className={`p-2 rounded-full ${isSidebarCollapsed ? 'bg-[#4BB2F6] text-white' : 'bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]'}`}
                  title="Nouvelle conversation"
                >
                  <FiPlus className="w-5 h-5" />
                </motion.button>
                
                {!isSidebarCollapsed && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("all")}
                    className={`p-2 rounded-full ${conversationFilter === "all" ? 'bg-[#1B0353] text-white' : 'bg-[#1B0353] bg-opacity-10 text-[#1B0353]'}`}
                    title="Toutes les conversations"
                  >
                    <FiMessageSquare className="w-5 h-5" />
                  </motion.button>
                )}
                
                {!isSidebarCollapsed && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("unread")}
                    className={`p-2 rounded-full ${conversationFilter === "unread" ? 'bg-[#1B0353] text-white' : 'bg-[#1B0353] bg-opacity-10 text-[#1B0353]'}`}
                    title="Messages non lus"
                  >
                    <div className="relative">
                      <FiMessageCircle className="w-5 h-5" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600"
                  title={isSidebarCollapsed ? "Déplier" : "Replier"}
                >
                  <FiChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
                </motion.button>
              </div>
            </div>
            
            {/* Search */}
            {!isSidebarCollapsed && (
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {!isCreatingNewChat && (
                  <div className="flex mt-3 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConversationFilter("all")}
                      className={`py-1 px-3 text-xs rounded-full ${
                        conversationFilter === "all" 
                          ? "bg-[#1B0353] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConversationFilter("staff")}
                      className={`py-1 px-3 text-xs rounded-full ${
                        conversationFilter === "staff" 
                          ? "bg-[#004AC8] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Équipe
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConversationFilter("clients")}
                      className={`py-1 px-3 text-xs rounded-full ${
                        conversationFilter === "clients" 
                          ? "bg-[#4BB2F6] text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Clients
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setConversationFilter("starred")}
                      className={`py-1 px-3 text-xs rounded-full ${
                        conversationFilter === "starred" 
                          ? "bg-yellow-500 text-white" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <FiStar className="w-3 h-3" />
                    </motion.button>
                  </div>
                )}
                
                {isCreatingNewChat && (
                  <div className="flex justify-between mt-3">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode("all")}
                        className={`py-1 px-3 text-xs rounded-full ${
                          viewMode === "all" 
                            ? "bg-[#1B0353] text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Tous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode("staff")}
                        className={`py-1 px-3 text-xs rounded-full ${
                          viewMode === "staff" 
                            ? "bg-[#004AC8] text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Équipe
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode("clients")}
                        className={`py-1 px-3 text-xs rounded-full ${
                          viewMode === "clients" 
                            ? "bg-[#4BB2F6] text-white" 
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Clients
                      </motion.button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreatingNewChat(false)}
                      className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <FiX className="w-3 h-3" />
                    </motion.button>
                  </div>
                )}
              </div>
            )}
            
            {/* Collapsed sidebar search button */}
            {isSidebarCollapsed && (
              <div className="p-4 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-gray-100 text-gray-600"
                >
                  <FiSearch className="w-5 h-5" />
                </motion.button>
              </div>
            )}
            
            {/* Conversations List or Users List for New Chat */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {!isCreatingNewChat ? (
                // Conversations List
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  {filteredConversations.map(conversation => {
                    const otherParticipantId = !conversation.isGroup ? 
                      conversation.participants.find(id => id !== currentUser.id) : null;
                    
                    const otherUser = otherParticipantId ? getUser(otherParticipantId) : null;
                    const isSelected = selectedConversation?.id === conversation.id;
                    
                    return (
                      <motion.div 
                        key={conversation.id}
                        variants={listItemVariants}
                        whileHover="hover"
                        className={`p-3 cursor-pointer ${isSelected ? 'bg-[#4BB2F6] bg-opacity-10' : 'hover:bg-gray-50'}`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                          {/* Avatar */}
                          <div className="relative">
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-semibold ${
                                conversation.isGroup ? 'bg-[#1B0353]' : (otherUser?.type === "staff" ? 'bg-[#004AC8]' : 'bg-[#4BB2F6]')
                              }`}
                              style={{ 
                                background: conversation.isGroup 
                                  ? "linear-gradient(135deg, #1B0353, #004AC8)" 
                                  : (otherUser?.type === "staff" 
                                    ? "linear-gradient(135deg, #004AC8, #4BB2F6)" 
                                    : "linear-gradient(135deg, #4BB2F6, #004AC8)") 
                              }}
                            >
                              {conversation.isGroup ? (
                                <FiUsers className="w-6 h-6" />
                              ) : (
                                otherUser && getInitials(otherUser.firstName, otherUser.lastName)
                              )}
                            </div>
                            
                            {!conversation.isGroup && otherUser && (
                              <div className="absolute bottom-0 right-0">
                                {statusIndicator(otherUser.status)}
                              </div>
                            )}
                            
                            {conversation.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {conversation.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          {!isSidebarCollapsed && (
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.isGroup ? conversation.groupName : `${otherUser?.firstName} ${otherUser?.lastName}`}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {formatMessageTime(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              
                              <div className="flex items-center mt-1">
                                <p className={`text-xs truncate mr-1 ${
                                  conversation.unreadCount > 0 ? 'font-semibold text-[#1B0353]' : 'text-gray-500'
                                }`}>
                                  {conversation.lastMessage.sender === currentUser.id ? (
                                    <span className="flex items-center">
                                      <FiCornerUpRight className="w-3 h-3 mr-1 inline" />
                                      {conversation.lastMessage.content}
                                    </span>
                                  ) : (
                                    conversation.lastMessage.content
                                  )}
                                </p>
                                
                                {/* Message status indicators */}
                                {conversation.lastMessage.sender === currentUser.id && (
                                  <div className="ml-auto">
                                    {conversation.lastMessage.isRead ? (
                                      <FiCheckCircle className="w-3 h-3 text-[#4BB2F6]" />
                                    ) : conversation.lastMessage.isDelivered ? (
                                      <FiCheck className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <FiClock className="w-3 h-3 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {/* Tags for user type or group */}
                              <div className="flex mt-1">
                                {conversation.isGroup ? (
                                  <span className="text-xs px-2 py-0.5 bg-[#1B0353] bg-opacity-10 text-[#1B0353] rounded-full">
                                    Groupe
                                  </span>
                                ) : otherUser?.type === "staff" ? (
                                  <span className="text-xs px-2 py-0.5 bg-[#004AC8] bg-opacity-10 text-[#004AC8] rounded-full">
                                    {otherUser.department || "Équipe"}
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-[#4BB2F6] bg-opacity-10 text-[#4BB2F6] rounded-full">
                                    {otherUser?.company || "Client"}
                                  </span>
                                )}
                                
                                {otherUser?.isStarred && (
                                  <span className="ml-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full flex items-center">
                                    <FiStar className="w-3 h-3 mr-1" />
                                    VIP
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // Users List for New Chat
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-100"
                >
                  {!isSidebarCollapsed && <h3 className="px-4 pt-2 pb-1 text-sm font-medium text-gray-500">Sélectionner un contact</h3>}
                  
                  {filteredUsers.map(user => (
                    <motion.div 
                      key={user.id}
                      variants={listItemVariants}
                      whileHover="hover"
                      className="p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        // Find or create conversation with this user
                        const existingConv = conversations.find(c => 
                          !c.isGroup && c.participants.includes(user.id) && c.participants.includes(currentUser.id)
                        );
                        
                        if (existingConv) {
                          handleSelectConversation(existingConv);
                        } else {
                          // In a real app, you would create a new conversation
                          alert(`Nouvelle conversation avec ${user.firstName} ${user.lastName} serait créée ici`);
                        }
                        
                        setIsCreatingNewChat(false);
                      }}
                    >
                      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative">
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-semibold ${
                              user.type === "staff" ? 'bg-[#004AC8]' : 'bg-[#4BB2F6]'
                            }`}
                            style={{ 
                              background: user.type === "staff" 
                                ? "linear-gradient(135deg, #004AC8, #4BB2F6)" 
                                : "linear-gradient(135deg, #4BB2F6, #004AC8)" 
                            }}
                          >
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          
                          <div className="absolute bottom-0 right-0">
                            {statusIndicator(user.status)}
                          </div>
                        </div>
                        
                        {!isSidebarCollapsed && (
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-gray-500 truncate">
                                {user.type === "staff" ? user.role : user.company}
                              </p>
                            </div>
                            
                            <div className="mt-1">
                              {user.type === "staff" ? (
                                <span className="text-xs px-2 py-0.5 bg-[#004AC8] bg-opacity-10 text-[#004AC8] rounded-full">
                                  {user.department || "Équipe"}
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 bg-[#4BB2F6] bg-opacity-10 text-[#4BB2F6] rounded-full">
                                  Client
                                </span>
                              )}
                              
                              {user.isStarred && (
                                <span className="ml-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full flex items-center">
                                  <FiStar className="w-3 h-3 mr-1" />
                                  VIP
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B0353] to-[#004AC8] flex items-center justify-center text-white shadow-md"
                  >
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser.role}</p>
                  </div>
                  
                  <div className="ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                    >
                      <FiSettings className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            
            {isSidebarCollapsed && (
              <div className="p-4 border-t border-gray-100 flex justify-center">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B0353] to-[#004AC8] flex items-center justify-center text-white shadow-md"
                >
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-semibold ${
                          selectedConversation.isGroup ? 'bg-[#1B0353]' : (selectedUser?.type === "staff" ? 'bg-[#004AC8]' : 'bg-[#4BB2F6]')
                        }`}
                        style={{ 
                          background: selectedConversation.isGroup 
                            ? "linear-gradient(135deg, #1B0353, #004AC8)" 
                            : (selectedUser?.type === "staff" 
                              ? "linear-gradient(135deg, #004AC8, #4BB2F6)" 
                              : "linear-gradient(135deg, #4BB2F6, #004AC8)") 
                        }}
                      >
                        {selectedConversation.isGroup ? (
                          <FiUsers className="w-5 h-5" />
                        ) : (
                          selectedUser && getInitials(selectedUser.firstName, selectedUser.lastName)
                        )}
                      </div>
                      
                      {!selectedConversation.isGroup && selectedUser && (
                        <div className="absolute bottom-0 right-0">
                          {statusIndicator(selectedUser.status)}
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3">
                      <h2 className="text-base font-semibold text-gray-900">
                        {selectedConversation.isGroup 
                          ? selectedConversation.groupName 
                          : `${selectedUser?.firstName} ${selectedUser?.lastName}`}
                      </h2>
                      <div className="flex items-center text-xs text-gray-500">
                        {selectedConversation.isGroup ? (
                          <span>{selectedConversation.participants.length} participants</span>
                        ) : (
                          <>
                            {selectedUser?.status === "online" && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                                En ligne
                              </span>
                            )}
                            {selectedUser?.status === "away" && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                                Absent
                              </span>
                            )}
                            {selectedUser?.status === "busy" && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                                Occupé
                              </span>
                            )}
                            {selectedUser?.status === "offline" && (
                              <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                                {selectedUser.lastActive}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Appel audio"
                    >
                      <FiPhone className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Appel vidéo"
                    >
                      <FiVideo className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      onClick={() => setShowSearchResults(!showSearchResults)}
                      title="Rechercher"
                    >
                      <FiSearch className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-full ${showUserInfo ? 'bg-[#1B0353] text-white' : 'bg-[#1B0353] bg-opacity-10 text-[#1B0353]'}`}
                      onClick={() => setShowUserInfo(!showUserInfo)}
                      title="Informations"
                    >
                      <FiInfo className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Main Conversation Area */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.sender === currentUser.id;
                    const sender = getUser(message.sender);
                    const showDateSeparator = index === 0 || 
                      formatDate(messages[index-1].timestamp) !== formatDate(message.timestamp);
                    
                    return (
                      <div key={message.id}>
                        {showDateSeparator && (
                          <div className="flex justify-center my-4">
                            <div className="px-4 py-1 rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        )}
                        
                        <motion.div 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          variants={bubbleVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="flex max-w-xs md:max-w-md">
                            {!isCurrentUser && !selectedConversation.isGroup && (
                              <div className="flex-shrink-0 mr-2 mt-1">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                  style={{ 
                                    background: sender?.type === "staff" 
                                      ? "linear-gradient(135deg, #004AC8, #4BB2F6)" 
                                      : "linear-gradient(135deg, #4BB2F6, #004AC8)" 
                                  }}
                                >
                                  {sender && getInitials(sender.firstName, sender.lastName)}
                                </div>
                              </div>
                            )}
                            
                            <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                              {selectedConversation.isGroup && !isCurrentUser && (
                                <div className="ml-1 mb-1 text-xs font-medium text-gray-500">
                                  {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'}
                                </div>
                              )}
                              
                              <div 
                                className={`p-3 rounded-2xl shadow-sm ${
                                  isCurrentUser 
                                    ? 'bg-gradient-to-br from-[#1B0353] to-[#004AC8] text-white' 
                                    : 'bg-white border border-gray-100 text-gray-800'
                                }`}
                                style={isCurrentUser ? { borderBottomRightRadius: '0.25rem' } : { borderBottomLeftRadius: '0.25rem' }}
                              >
                                {/* If message has attachments */}
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mb-2">
                                    {message.attachments.map(attachment => (
                                      <div 
                                        key={attachment.id}
                                        className={`p-3 rounded-lg mb-2 flex items-center ${
                                          isCurrentUser 
                                            ? 'bg-white bg-opacity-10' 
                                            : 'bg-gray-50'
                                        }`}
                                      >
                                        <div 
                                          className={`p-2 rounded-lg mr-3 ${
                                            isCurrentUser 
                                              ? 'bg-white bg-opacity-20' 
                                              : 'bg-[#4BB2F6] bg-opacity-10'
                                          }`}
                                        >
                                          {attachment.type === 'image' ? (
                                            <FiImage className={`w-6 h-6 ${isCurrentUser ? 'text-white' : 'text-[#004AC8]'}`} />
                                          ) : attachment.type === 'audio' ? (
                                            <FiMic className={`w-6 h-6 ${isCurrentUser ? 'text-white' : 'text-[#004AC8]'}`} />
                                          ) : attachment.type === 'video' ? (
                                            <FiVideo className={`w-6 h-6 ${isCurrentUser ? 'text-white' : 'text-[#004AC8]'}`} />
                                          ) : (
                                            <FiFile className={`w-6 h-6 ${isCurrentUser ? 'text-white' : 'text-[#004AC8]'}`} />
                                          )}
                                        </div>
                                        
                                        <div>
                                          <div className={`text-sm font-medium ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                                            {attachment.name}
                                          </div>
                                          <div className={`text-xs ${isCurrentUser ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                                            {attachment.size}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Regular text message */}
                                {(message.messageType === 'text' || message.content) && (
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                )}
                              </div>
                              
                              <div className={`flex items-center mt-1 text-xs text-gray-500 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <span>{formatMessageTime(message.timestamp)}</span>
                                
                                {isCurrentUser && (
                                  <div className="ml-1 flex items-center">
                                    {message.isRead ? (
                                      <div className="flex items-center">
                                        <FiCheckCircle className="text-[#4BB2F6] w-3 h-3 ml-1" title="Lu" />
                                      </div>
                                    ) : message.isDelivered ? (
                                      <FiCheck className="text-gray-400 w-3 h-3 ml-1" title="Délivré" />
                                    ) : (
                                      <FiClock className="text-gray-400 w-3 h-3 ml-1" title="Envoi en cours" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                  {isUploadingFile && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
                      <FiRefreshCw className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-700">Envoi du fichier en cours...</div>
                        <div className="w-full bg-blue-200 h-1.5 mt-1 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-2/3 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 ml-2">
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="flex space-x-2 mr-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <FiSmile className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                        onClick={handleFileUpload}
                      >
                        <FiPaperclip className="w-5 h-5" />
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileSelected}
                        />
                      </motion.button>
                    </div>
                    
                    <input
                      type="text"
                      className="flex-1 py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent"
                      placeholder="Tapez votre message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    
                    <div className="flex space-x-2 ml-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-full ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                        onClick={toggleRecording}
                      >
                        <FiMic className="w-5 h-5" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className={`p-3 rounded-full ${
                          messageInput.trim() 
                            ? 'bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white shadow-md' 
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <FiSend className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Empty state when no conversation is selected
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-[#4BB2F6] to-[#004AC8] text-white shadow-lg"
                >
                  <FiMessageSquare className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Messagerie</h2>
                <p className="text-gray-500 max-w-md mb-6">
                  Sélectionnez une conversation existante ou créez une nouvelle conversation pour commencer à discuter.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreatingNewChat(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white rounded-lg shadow-md"
                >
                  <FiPlus className="mr-2" />
                  <span>Nouvelle conversation</span>
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Contact Info Sidebar */}
          <AnimatePresence>
            {showUserInfo && selectedUser && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-80 bg-white border-l border-gray-100 flex flex-col relative overflow-hidden"
              >
                <button 
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={() => setShowUserInfo(false)}
                >
                  <FiX className="w-5 h-5" />
                </button>
                
                <div className="p-6 text-center border-b border-gray-100">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-24 h-24 mx-auto mb-4"
                  >
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ 
                        background: selectedUser.type === "staff" 
                          ? "linear-gradient(135deg, #004AC8, #4BB2F6)" 
                          : "linear-gradient(135deg, #4BB2F6, #004AC8)" 
                      }}
                    >
                      {getInitials(selectedUser.firstName, selectedUser.lastName)}
                    </div>
                    
                    <div className="absolute bottom-0 right-0">
                      {statusIndicator(selectedUser.status)}
                    </div>
                  </motion.div>
                  
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedUser.type === "staff" ? selectedUser.role : selectedUser.company}
                  </p>
                  
                  <div className="flex justify-center mt-2 space-x-1">
                    {selectedUser.type === "staff" ? (
                      <span className="text-xs px-3 py-1 bg-[#004AC8] bg-opacity-10 text-[#004AC8] rounded-full">
                        {selectedUser.department || "Équipe"}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 bg-[#4BB2F6] bg-opacity-10 text-[#4BB2F6] rounded-full">
                        Client
                      </span>
                    )}
                    
                    {selectedUser.isStarred && (
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full flex items-center">
                        <FiStar className="w-3 h-3 mr-1" />
                        VIP
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-center mt-4 space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Appel audio"
                    >
                      <FiPhone className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Appel vidéo"
                    >
                      <FiVideo className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Email"
                    >
                      <FiMail className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-full bg-[#4BB2F6] bg-opacity-10 text-[#004AC8]"
                      title="Plus d'options"
                    >
                      <FiMoreVertical className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-[#004AC8]" />
                        Coordonnées
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#4BB2F6] bg-opacity-10 flex items-center justify-center mr-3">
                            <FiMail className="w-4 h-4 text-[#004AC8]" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Email</div>
                            <div className="text-sm font-medium text-gray-900">{selectedUser.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#4BB2F6] bg-opacity-10 flex items-center justify-center mr-3">
                            <FiPhone className="w-4 h-4 text-[#004AC8]" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Téléphone</div>
                            <div className="text-sm font-medium text-gray-900">{selectedUser.phoneNumber}</div>
                          </div>
                        </div>
                        
                        {selectedUser.type === "client" && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#4BB2F6] bg-opacity-10 flex items-center justify-center mr-3">
                              <FiBriefcase className="w-4 h-4 text-[#004AC8]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Entreprise</div>
                              <div className="text-sm font-medium text-gray-900">{selectedUser.company}</div>
                            </div>
                          </div>
                        )}
                        
                        {selectedUser.type === "staff" && (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#4BB2F6] bg-opacity-10 flex items-center justify-center mr-3">
                              <FiHash className="w-4 h-4 text-[#004AC8]" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Département</div>
                              <div className="text-sm font-medium text-gray-900">{selectedUser.department}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-[#004AC8]" />
                        Activité
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">Statut</div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              selectedUser.status === "online" ? "bg-green-500" :
                              selectedUser.status === "away" ? "bg-yellow-500" :
                              selectedUser.status === "busy" ? "bg-red-500" : "bg-gray-400"
                            }`}></div>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedUser.status === "online" ? "En ligne" :
                               selectedUser.status === "away" ? "Absent" :
                               selectedUser.status === "busy" ? "Occupé" : "Hors ligne"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">Dernière activité</div>
                          <div className="text-sm font-medium text-gray-900">{selectedUser.lastActive}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FiMessageCircle className="w-4 h-4 mr-2 text-[#004AC8]" />
                        Historique des conversations
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#4BB2F6] flex items-center justify-center text-white mr-3">
                              <FiPhoneOutgoing className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Appel sortant</div>
                              <div className="text-xs text-gray-500">15 min, il y a 2 jours</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#1B0353] flex items-center justify-center text-white mr-3">
                              <FiPhoneIncoming className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Appel entrant</div>
                              <div className="text-xs text-gray-500">8 min, il y a 5 jours</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mr-3">
                              <FiPhoneMissed className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Appel manqué</div>
                              <div className="text-xs text-gray-500">Il y a 1 semaine</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-[#004AC8]" />
                        Rendez-vous
                      </h3>
                      
                      <div className="text-center py-4">
                        <div className="text-sm text-gray-500 mb-2">Aucun rendez-vous planifié</div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 text-xs bg-[#4BB2F6] bg-opacity-10 text-[#004AC8] rounded-full"
                        >
                          + Planifier
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <FiSettings className="w-4 h-4 mr-2 text-[#004AC8]" />
                        Options
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">Marquer comme VIP</div>
                          <div 
                            className={`w-10 h-5 ${selectedUser.isStarred ? 'bg-yellow-500' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors duration-300`}
                            onClick={() => {
                              // In a real app, you would update the user's starred status
                              alert(`${selectedUser.isStarred ? 'Supprimer' : 'Ajouter'} ${selectedUser.firstName} ${selectedUser.lastName} ${selectedUser.isStarred ? 'des' : 'aux'} VIP`);
                            }}
                          >
                            <div 
                              className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 ${
                                selectedUser.isStarred ? 'left-5' : 'left-0.5'
                              }`} 
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">Désactiver les notifications</div>
                          <div 
                            className={`w-10 h-5 ${selectedUser.isMuted ? 'bg-gray-500' : 'bg-gray-200'} rounded-full relative cursor-pointer transition-colors duration-300`}
                            onClick={() => {
                              // In a real app, you would update the user's muted status
                              alert(`${selectedUser.isMuted ? 'Activer' : 'Désactiver'} les notifications pour ${selectedUser.firstName} ${selectedUser.lastName}`);
                            }}
                          >
                            <div 
                              className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 ${
                                selectedUser.isMuted ? 'left-5' : 'left-0.5'
                              }`} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Custom CSS for the scrollbar
// const scrollbarCSS = `
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 6px;
//     height: 6px;
//   }
  
//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: transparent;
//   }
  
//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background: rgba(0, 74, 200, 0.2);
//     border-radius: 3px;
//   }
  
//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background: rgba(0, 74, 200, 0.4);
//   }
// `;

// You would need to add this CSS to your global stylesheet