"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiSend,
  FiChevronLeft,
  FiRefreshCw,
  FiMoreVertical,
  FiMessageSquare,
  FiUser,
  FiUsers,
  FiMail,
  FiPhone,
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
  FiSettings,
  FiCalendar,
  FiClock,
  FiVideo,
  FiPhoneOutgoing,
  FiPhoneIncoming,
  FiPhoneMissed,
  FiCornerUpRight,
  FiMessageCircle,
  FiHash,
  FiMoon,
  FiSun,
  // FiLifeBuoy,
  FiChevronRight,
  FiGithub,
  // FiCommand,
  FiZap,
  FiMaximize,
  FiMinimize,
  // FiTablet,
  FiBell,
  FiGrid,
  FiCoffee,
  FiTrendingUp
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
  type: "staff" | "client" | "bot";
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
  messageType: "text" | "image" | "file" | "voice" | "video" | "system" | "suggestions";
  callDuration?: number;
  suggestions?: string[]; // For chatbot suggested replies
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
  category?: "human" | "bot"; // Added to differentiate between human and bot conversations
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
  },
  {
    id: "bot-001",
    firstName: "AI",
    lastName: "Assistant",
    email: "ai.assistant@company.com",
    phoneNumber: "",
    type: "bot",
    role: "Assistant IA",
    status: "online",
    lastActive: "toujours actif",
    department: "Support automatisé",
    unreadCount: 0
  }
];

// Add chatbot conversations
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
    updatedAt: "2023-10-25T10:30:00",
    category: "human"
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
    updatedAt: "2023-10-24T16:45:00",
    category: "human"
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
    updatedAt: "2023-10-25T09:15:00",
    category: "human"
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
    updatedAt: "2023-10-23T14:20:00",
    category: "human"
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
    updatedAt: "2023-10-25T08:05:00",
    category: "human"
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
    updatedAt: "2023-10-24T11:00:00",
    category: "human"
  },
  // New ChatBot conversations
  {
    id: "c-007",
    participants: ["u-001", "bot-001"],
    lastMessage: {
      id: "m-007-10",
      sender: "bot-001",
      recipient: "u-001",
      content: "Voici les informations que vous avez demandées sur les nouveaux forfaits. Puis-je vous aider avec autre chose ?",
      timestamp: "2023-10-25T14:20:00",
      isRead: true,
      isDelivered: true,
      messageType: "text",
      suggestions: ["Voir les tarifs", "Comparer les forfaits", "Parler à un conseiller"]
    },
    isGroup: false,
    unreadCount: 0,
    isPinned: true,
    createdAt: "2023-10-20T14:00:00",
    updatedAt: "2023-10-25T14:20:00",
    category: "bot"
  },
  {
    id: "c-008",
    participants: ["u-002", "bot-001"],
    lastMessage: {
      id: "m-008-5",
      sender: "bot-001",
      recipient: "u-002",
      content: "J'ai généré un rapport sur les performances de vente du dernier trimestre. Souhaitez-vous le consulter ?",
      timestamp: "2023-10-24T09:45:00",
      isRead: false,
      isDelivered: true,
      messageType: "text",
      suggestions: ["Voir le rapport", "Analyser par région", "Comparer avec Q2"]
    },
    isGroup: false,
    unreadCount: 1,
    isPinned: false,
    createdAt: "2023-10-15T11:30:00",
    updatedAt: "2023-10-24T09:45:00",
    category: "bot"
  }
];

// Sample messages for conversations
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
  ],
  // ChatBot conversation sample
  "c-007": [
    {
      id: "m-007-1",
      sender: "u-001",
      recipient: "bot-001",
      content: "Bonjour, j'aimerais des informations sur les nouveaux forfaits.",
      timestamp: "2023-10-25T14:00:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-2",
      sender: "bot-001",
      recipient: "u-001",
      content: "Bonjour Sophie ! Je serais ravi de vous aider avec les informations sur nos nouveaux forfaits. Que souhaitez-vous savoir spécifiquement ?",
      timestamp: "2023-10-25T14:00:05",
      isRead: true,
      isDelivered: true,
      messageType: "suggestions",
      suggestions: ["Prix des forfaits", "Fonctionnalités incluses", "Différences avec anciens forfaits", "Options entreprise"]
    },
    {
      id: "m-007-3",
      sender: "u-001",
      recipient: "bot-001",
      content: "Je voudrais connaître les prix et les fonctionnalités incluses.",
      timestamp: "2023-10-25T14:02:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-4",
      sender: "bot-001",
      recipient: "u-001",
      content: "Bien sûr ! Voici nos nouveaux forfaits :\n\n**Forfait Standard**: 29,99€/mois\n- Jusqu'à 10 utilisateurs\n- 50 Go de stockage\n- Support par email\n- Fonctionnalités de base\n\n**Forfait Premium**: 59,99€/mois\n- Jusqu'à 50 utilisateurs\n- 200 Go de stockage\n- Support prioritaire 24/7\n- Toutes les fonctionnalités\n- Analytics avancés\n\n**Forfait Entreprise**: 99,99€/mois\n- Utilisateurs illimités\n- 1 To de stockage\n- Support dédié\n- Fonctionnalités personnalisées\n- Intégration API complète",
      timestamp: "2023-10-25T14:02:10",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-5",
      sender: "u-001",
      recipient: "bot-001",
      content: "Est-ce qu'il y a une période d'essai ?",
      timestamp: "2023-10-25T14:05:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-6",
      sender: "bot-001",
      recipient: "u-001",
      content: "Oui ! Tous nos forfaits incluent une période d'essai gratuite de 14 jours. Aucune carte de crédit n'est requise pour commencer l'essai.",
      timestamp: "2023-10-25T14:05:05",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-7",
      sender: "u-001",
      recipient: "bot-001",
      content: "Et si je souhaite passer au forfait supérieur après avoir commencé ?",
      timestamp: "2023-10-25T14:08:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-8",
      sender: "bot-001",
      recipient: "u-001",
      content: "Vous pouvez changer de forfait à tout moment ! Si vous passez à un forfait supérieur, nous calculons la différence au prorata pour le reste du mois. Si vous passez à un forfait inférieur, le changement prendra effet au début de votre prochain cycle de facturation.",
      timestamp: "2023-10-25T14:08:10",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-9",
      sender: "u-001",
      recipient: "bot-001",
      content: "Merci pour ces informations précises !",
      timestamp: "2023-10-25T14:15:00",
      isRead: true,
      isDelivered: true,
      messageType: "text"
    },
    {
      id: "m-007-10",
      sender: "bot-001",
      recipient: "u-001",
      content: "Voici les informations que vous avez demandées sur les nouveaux forfaits. Puis-je vous aider avec autre chose ?",
      timestamp: "2023-10-25T14:20:00",
      isRead: true,
      isDelivered: true,
      messageType: "suggestions",
      suggestions: ["Voir les tarifs", "Comparer les forfaits", "Parler à un conseiller"]
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

// Main Component
export default function ChatPage() {
  // Current user (for demo purposes, we'll use the first staff member)
  const currentUser = users[0];
  
  // States
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [messageInput, setMessageInput] = useState<string>("");
  const [conversationFilter, setConversationFilter] = useState<"all" | "unread" | "staff" | "clients" | "starred" | "bots">("all");
  // const [isCreatingNewChat, setIsCreatingNewChat] = useState<boolean>(false);
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"all" | "staff" | "clients" | "bots">("all");
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"messages" | "bots">("messages");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Effects
  useEffect(() => {
    // Simulate loading messages when a conversation is selected
    if (selectedConversation) {
      const conversationMessages = sampleMessages[selectedConversation.id] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (selectedConversation.unreadCount > 0) {
        // In a real app, you would update the state here
      }
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    // Handle clicks outside the modal
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowNewChatModal(false);
      }
    }

    // Add event listener when modal is shown
    if (showNewChatModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNewChatModal]);
  
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
    setShowNewChatModal(false);
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
    
    // For bot conversations, simulate a response
    if (selectedConversation.category === "bot") {
      setTimeout(() => {
        const botId = selectedConversation.participants.find(id => id.includes("bot")) || "";
        const botMessage: ChatMessage = {
          id: `m-bot-${Date.now()}`,
          sender: botId,
          recipient: currentUser.id,
          content: "Je vous remercie pour votre message. Comment puis-je vous aider davantage ?",
          timestamp: new Date().toISOString(),
          isRead: true,
          isDelivered: true,
          messageType: "suggestions",
          suggestions: ["Plus d'information", "Support technique", "Rendez-vous", "Fin de conversation"]
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
    
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
          const messageType: "text" | "image" | "file" | "voice" | "video" | "system" | "suggestions" = 
            fileType === "image" ? "image" : 
            fileType === "audio" ? "voice" : 
            fileType === "video" ? "video" : "file";
          
          const newMessage: ChatMessage = {
            id: `m-new-${Date.now()}`,
            sender: currentUser.id,
            recipient: selectedConversation.isGroup ? "" : selectedConversation.participants.find(id => id !== currentUser.id) || "",
            content: `A envoyé ${fileType === "image" ? "une image" : fileType === "audio" ? "un audio" : fileType === "video" ? "une vidéo" : "un fichier"}`,
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
    // First filter by active tab (messages vs bots)
    if (activeTab === "messages" && conversation.category === "bot") {
      return false;
    }
    
    if (activeTab === "bots" && conversation.category !== "bot") {
      return false;
    }
    
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
    
    if (conversationFilter === "bots") {
      return !conversation.isGroup && conversation.participants.some(id => {
        const user = getUser(id);
        return user && user.type === "bot";
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
  
  // For simple user filtering in "New Chat" modal
  const filteredUsers = users.filter(user => {
    if (user.id === currentUser.id) return false;
    
    if (searchTerm) {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }
    
    if (viewMode === "staff") return user.type === "staff";
    if (viewMode === "clients") return user.type === "client";
    if (viewMode === "bots") return user.type === "bot";
    
    return true;
  });
  
  // UI Elements and helpers
  const statusIndicator = (status: string) => (
    <div className="relative">
      <div 
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'} ${
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  // Get user type color
  // const getUserTypeColor = (type: string) => {
  //   switch(type) {
  //     case "staff": return "from-blue-600 to-indigo-700";
  //     case "client": return "from-teal-500 to-cyan-600";
  //     case "bot": return "from-purple-600 to-pink-600";
  //     default: return "from-gray-600 to-gray-700";
  //   }
  // };
  
  // const getUserTypeTextColor = (type: string) => {
  //   switch(type) {
  //     case "staff": return "text-blue-600";
  //     case "client": return "text-teal-600";
  //     case "bot": return "text-purple-600";
  //     default: return "text-gray-600";
  //   }
  // };
  
  // const getUserTypeBgColor = (type: string) => {
  //   switch(type) {
  //     case "staff": return "bg-blue-100 text-blue-600";
  //     case "client": return "bg-teal-100 text-teal-600";
  //     case "bot": return "bg-purple-100 text-purple-600";
  //     default: return "bg-gray-100 text-gray-600";
  //   }
  // };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setMessageInput(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would also update the document class
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Return the enhanced chat component
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      <div className={`max-w-8xl mx-auto h-screen flex flex-col pt-16 ${darkMode ? 'dark' : ''}`}>
        {/* Top Navigation Bar */}
        <div className={`fixed top-0 left-0 right-0 h-14 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b z-10 px-4 flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="flex items-center font-bold text-xl mr-8">
              <span className={`w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white mr-2`}>
                <FiMessageSquare className="w-5 h-5" />
              </span>
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>MessagePro</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <button className={`flex items-center space-x-1 font-medium ${activeTab === 'messages' ? (darkMode ? 'text-white' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} onClick={() => setActiveTab('messages')}>
                <FiMessageCircle className="w-4 h-4" />
                <span>Messages</span>
              </button>
              <button className={`flex items-center space-x-1 font-medium ${activeTab === 'bots' ? (darkMode ? 'text-white' : 'text-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} onClick={() => setActiveTab('bots')}>
                <FiZap className="w-4 h-4" />
                <span>Assistants IA</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="relative">
                <FiBell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`}
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 py-1 px-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white">
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </div>
                <div className="hidden md:block">
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentUser.role}
                  </div>
                </div>
                <FiChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Main Chat Container */}
        <div className={`flex flex-1 overflow-hidden rounded-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-xl mt-2`}>
          {/* Sidebar - Conversations List */}
          <motion.div 
            className={`${isSidebarCollapsed ? 'w-20' : 'w-80'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-r flex flex-col transition-all duration-300 ease-in-out`}
            animate={{ width: isSidebarCollapsed ? 72 : 320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sidebar Header */}
            <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex items-center justify-between`}>
              {!isSidebarCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-900'}`}>
                    {activeTab === 'messages' ? 'Messages' : 'Assistants IA'}
                  </h2>
                  
                  <div className={`px-2 py-0.5 rounded-md text-xs font-medium ${darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                    {filteredConversations.length}
                  </div>
                </motion.div>
              )}
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChatModal(true)}
                  className={`p-2 rounded-full ${darkMode 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}
                  title="Nouvelle conversation"
                >
                  <FiPlus className="w-5 h-5" />
                </motion.button>
                
                {!isSidebarCollapsed && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("all")}
                    className={`p-2 rounded-full ${
                      conversationFilter === "all" 
                        ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white') 
                        : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-600')
                    }`}
                    title="Toutes les conversations"
                  >
                    <FiGrid className="w-5 h-5" />
                  </motion.button>
                )}
                
                {!isSidebarCollapsed && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("unread")}
                    className={`p-2 rounded-full ${
                      conversationFilter === "unread" 
                        ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-indigo-100 text-indigo-600')
                    }`}
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
                  className={`p-2 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
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
                    <FiSearch className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    type="text"
                    className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-transparent placeholder-gray-400'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex mt-3 space-x-2 overflow-x-auto custom-scrollbar py-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("all")}
                    className={`py-1 px-3 text-xs rounded-full ${
                      conversationFilter === "all" 
                        ? (darkMode ? 'bg-indigo-700 text-white' : 'bg-indigo-600 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
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
                        ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
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
                        ? (darkMode ? 'bg-teal-700 text-white' : 'bg-teal-500 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                  >
                    Clients
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("bots")}
                    className={`py-1 px-3 text-xs rounded-full ${
                      conversationFilter === "bots" 
                        ? (darkMode ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                  >
                    Assistants
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConversationFilter("starred")}
                    className={`py-1 px-3 text-xs rounded-full ${
                      conversationFilter === "starred" 
                        ? (darkMode ? 'bg-yellow-600 text-white' : 'bg-yellow-500 text-white')
                        : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                  >
                    <FiStar className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            )}
            
            {/* Collapsed sidebar search button */}
            {isSidebarCollapsed && (
              <div className="p-4 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setIsSidebarCollapsed(false)}
                >
                  <FiSearch className="w-5 h-5" />
                </motion.button>
              </div>
            )}
            
            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}
              >
                {filteredConversations.map(conversation => {
                  const otherParticipantId = !conversation.isGroup ? 
                    conversation.participants.find(id => id !== currentUser.id) : null;
                  
                  const otherUser = otherParticipantId ? getUser(otherParticipantId) : null;
                  const isSelected = selectedConversation?.id === conversation.id;
                  
                  // Determine if this is a bot conversation
                  const isBot = otherUser?.type === "bot";
                  
                  return (
                    <motion.div 
                      key={conversation.id}
                      variants={listItemVariants}
                      whileHover="hover"
                      className={`p-3 cursor-pointer ${
                        isSelected 
                          ? (darkMode ? 'bg-indigo-900 bg-opacity-30' : 'bg-indigo-50')
                          : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                        {/* Avatar */}
                        <div className="relative">
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-semibold`}
                            style={{ 
                              background: conversation.isGroup 
                                ? "linear-gradient(135deg, #6366f1, #8b5cf6)" 
                                : (isBot
                                  ? "linear-gradient(135deg, #9333ea, #ec4899)"
                                  : (otherUser?.type === "staff" 
                                    ? "linear-gradient(135deg, #2563eb, #4f46e5)" 
                                    : "linear-gradient(135deg, #0d9488, #0891b2)"))
                            }}
                          >
                            {conversation.isGroup ? (
                              <FiUsers className="w-6 h-6" />
                            ) : isBot ? (
                              <FiZap className="w-6 h-6" />
                            ) : (
                              otherUser && getInitials(otherUser.firstName, otherUser.lastName)
                            )}
                          </div>
                          
                          {!conversation.isGroup && otherUser && !isBot && (
                            <div className="absolute bottom-0 right-0">
                              {statusIndicator(otherUser.status)}
                            </div>
                          )}
                          
                          {/* Bot indicator */}
                          {isBot && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center">
                              <FiZap className="w-2 h-2 text-white" />
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
                              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                {conversation.isGroup 
                                  ? conversation.groupName 
                                  : `${otherUser?.firstName} ${otherUser?.lastName}`}
                              </h3>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatMessageTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>
                            
                            <div className="flex items-center mt-1">
                              <p className={`text-xs truncate mr-1 ${
                                conversation.unreadCount > 0 
                                  ? (darkMode ? 'font-medium text-white' : 'font-semibold text-gray-900')
                                  : (darkMode ? 'text-gray-400' : 'text-gray-500')
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
                                    <FiCheckCircle className={`w-3 h-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                  ) : conversation.lastMessage.isDelivered ? (
                                    <FiCheck className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                  ) : (
                                    <FiClock className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Tags for user type or group */}
                            <div className="flex mt-1">
                              {conversation.isGroup ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                                  Groupe
                                </span>
                              ) : isBot ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                                  Assistant IA
                                </span>
                              ) : otherUser?.type === "staff" ? (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                  {otherUser.department || "Équipe"}
                                </span>
                              ) : (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-teal-900 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
                                  {otherUser?.company || "Client"}
                                </span>
                              )}
                              
                              {otherUser?.isStarred && (
                                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full flex items-center ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
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
            </div>
            
            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md"
                  >
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentUser.role}</p>
                  </div>
                  
                  <div className="ml-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <FiSettings className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            
            {isSidebarCollapsed && (
              <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t flex justify-center`}>
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md"
                >
                  {getInitials(currentUser.firstName, currentUser.lastName)}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-b flex items-center justify-between`}>
                  <div className="flex items-center">
                    <div className="relative">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-semibold`}
                        style={{ 
                          background: selectedConversation.isGroup 
                            ? "linear-gradient(135deg, #6366f1, #8b5cf6)" 
                            : (selectedUser?.type === "bot"
                              ? "linear-gradient(135deg, #9333ea, #ec4899)"
                              : (selectedUser?.type === "staff" 
                                ? "linear-gradient(135deg, #2563eb, #4f46e5)" 
                                : "linear-gradient(135deg, #0d9488, #0891b2)"))
                        }}
                      >
                        {selectedConversation.isGroup ? (
                          <FiUsers className="w-5 h-5" />
                        ) : selectedUser?.type === "bot" ? (
                          <FiZap className="w-5 h-5" />
                        ) : (
                          selectedUser && getInitials(selectedUser.firstName, selectedUser.lastName)
                        )}
                      </div>
                      
                      {!selectedConversation.isGroup && selectedUser && selectedUser.type !== "bot" && (
                        <div className="absolute bottom-0 right-0">
                          {statusIndicator(selectedUser.status)}
                        </div>
                      )}
                      
                      {/* Bot indicator */}
                      {selectedUser?.type === "bot" && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center">
                          <FiZap className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedConversation.isGroup 
                          ? selectedConversation.groupName 
                          : `${selectedUser?.firstName} ${selectedUser?.lastName}`}
                      </h2>
                      
                      <div className={`flex items-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedConversation.isGroup ? (
                          <span>{selectedConversation.participants.length} participants</span>
                        ) : selectedUser?.type === "bot" ? (
                          <span className="flex items-center">
                            <span className={`w-2 h-2 rounded-full bg-purple-500 mr-1`}></span>
                            Assistant IA
                          </span>
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
                    {selectedUser?.type !== "bot" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-full ${
                            darkMode 
                              ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
                              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                          }`}
                          title="Appel audio"
                        >
                          <FiPhone className="w-5 h-5" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-2 rounded-full ${
                            darkMode 
                              ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
                              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                          }`}
                          title="Appel vidéo"
                        >
                          <FiVideo className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                    
                    <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`p-2 rounded-full ${
    darkMode 
      ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
      : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
  }`}
  onClick={() => setShowSearchResults(!showSearchResults)}
  title="Rechercher"
>
  <FiSearch className="w-5 h-5" />
</motion.button>

<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`p-2 rounded-full ${
    showUserInfo 
      ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white') 
      : (darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-200' : 'bg-indigo-100 text-indigo-600')
  }`}
  onClick={() => setShowUserInfo(!showUserInfo)}
  title="Informations"
>
  <FiInfo className="w-5 h-5" />
</motion.button>
</div>
</div>

{/* Main Conversation Area */}
<div className={`flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
{messages.map((message, index) => {
  const isCurrentUser = message.sender === currentUser.id;
  const sender = getUser(message.sender);
  const isBot = sender?.type === "bot";
  const showDateSeparator = index === 0 || 
    formatDate(messages[index-1].timestamp) !== formatDate(message.timestamp);
  
  return (
    <div key={message.id}>
      {showDateSeparator && (
        <div className="flex justify-center my-4">
          <div className={`px-4 py-1 rounded-full text-xs font-medium ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
          }`}>
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
        <div className="flex max-w-xs md:max-w-md lg:max-w-lg">
          {!isCurrentUser && !selectedConversation.isGroup && (
            <div className="flex-shrink-0 mr-2 mt-1">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ 
                  background: isBot 
                    ? "linear-gradient(135deg, #9333ea, #ec4899)" 
                    : (sender?.type === "staff" 
                      ? "linear-gradient(135deg, #2563eb, #4f46e5)" 
                      : "linear-gradient(135deg, #0d9488, #0891b2)") 
                }}
              >
                {isBot ? (
                  <FiZap className="w-4 h-4" />
                ) : (
                  sender && getInitials(sender.firstName, sender.lastName)
                )}
              </div>
            </div>
          )}
          
          <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            {selectedConversation.isGroup && !isCurrentUser && (
              <div className={`ml-1 mb-1 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'}
              </div>
            )}
            
            <div 
              className={`p-3 rounded-2xl shadow-sm ${
                isCurrentUser 
                  ? (darkMode ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-600 to-purple-600') 
                  : (isBot
                    ? (darkMode ? 'bg-purple-900 border border-purple-800' : 'bg-white border border-purple-200')
                    : (darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'))
              } ${isCurrentUser ? 'text-white' : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}
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
                          : (darkMode ? 'bg-gray-700' : 'bg-gray-50')
                      }`}
                    >
                      <div 
                        className={`p-2 rounded-lg mr-3 ${
                          isCurrentUser 
                            ? 'bg-white bg-opacity-20' 
                            : (darkMode ? 'bg-gray-600' : 'bg-indigo-100')
                        }`}
                      >
                        {attachment.type === 'image' ? (
                          <FiImage className={`w-6 h-6 ${isCurrentUser ? 'text-white' : (darkMode ? 'text-purple-300' : 'text-indigo-600')}`} />
                        ) : attachment.type === 'audio' ? (
                          <FiMic className={`w-6 h-6 ${isCurrentUser ? 'text-white' : (darkMode ? 'text-purple-300' : 'text-indigo-600')}`} />
                        ) : attachment.type === 'video' ? (
                          <FiVideo className={`w-6 h-6 ${isCurrentUser ? 'text-white' : (darkMode ? 'text-purple-300' : 'text-indigo-600')}`} />
                        ) : (
                          <FiFile className={`w-6 h-6 ${isCurrentUser ? 'text-white' : (darkMode ? 'text-purple-300' : 'text-indigo-600')}`} />
                        )}
                      </div>
                      
                      <div>
                        <div className={`text-sm font-medium ${isCurrentUser ? 'text-white' : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}>
                          {attachment.name}
                        </div>
                        <div className={`text-xs ${isCurrentUser ? 'text-white text-opacity-80' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
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
            
            {/* Suggested replies for bot messages */}
            {!isCurrentUser && isBot && message.suggestions && message.suggestions.length > 0 && showSuggestions && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.suggestions.map((suggestion, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 text-xs rounded-full ${
                      darkMode 
                        ? 'bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-700' 
                        : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            )}
            
            <div className={`flex items-center mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <span>{formatMessageTime(message.timestamp)}</span>
              
              {isCurrentUser && (
                <div className="ml-1 flex items-center">
                  {message.isRead ? (
                    <div className="flex items-center">
                      <FiCheckCircle className={`w-3 h-3 ml-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} title="Lu" />
                    </div>
                  ) : message.isDelivered ? (
                    <FiCheck className={`w-3 h-3 ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} title="Délivré" />
                  ) : (
                    <FiClock className={`w-3 h-3 ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} title="Envoi en cours" />
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
<div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t`}>
{isUploadingFile && (
  <div className={`mb-4 p-3 rounded-lg flex items-center ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}>
    <FiRefreshCw className={`w-5 h-5 mr-3 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
    <div className="flex-1">
      <div className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Envoi du fichier en cours...</div>
      <div className={`w-full h-1.5 mt-1 rounded-full overflow-hidden ${darkMode ? 'bg-blue-900' : 'bg-blue-200'}`}>
        <div className={`h-full rounded-full animate-pulse w-2/3 ${darkMode ? 'bg-blue-500' : 'bg-blue-500'}`}></div>
      </div>
    </div>
    <button className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} ml-2`}>
      <FiX className="w-5 h-5" />
    </button>
  </div>
)}

<div className="flex items-center">
  <div className="flex space-x-2 mr-3">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    >
      <FiSmile className="w-5 h-5" />
    </motion.button>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
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
    className={`flex-1 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 ${
      darkMode
        ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 placeholder-gray-400'
        : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-indigo-500 focus:border-transparent'
    }`}
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
          : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')
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
          ? (darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700')
          : (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')
      } text-white shadow-md`}
    >
      <FiSend className="w-5 h-5" />
    </motion.button>
  </div>
</div>
</div>
</>
) : (
// Empty state when no conversation is selected
<div className={`flex-1 flex flex-col items-center justify-center p-6 text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
<div 
  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
>
  <FiMessageSquare className="w-12 h-12" />
</div>
<h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Messagerie</h2>
<p className={`max-w-md mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
  Sélectionnez une conversation existante ou créez une nouvelle conversation pour commencer à discuter.
</p>
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setShowNewChatModal(true)}
  className={`flex items-center px-4 py-2 rounded-lg shadow-md ${
    darkMode 
      ? 'bg-indigo-600 hover:bg-indigo-700' 
      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
  } text-white`}
>
  <FiPlus className="mr-2" />
  <span>Nouvelle conversation</span>
</motion.button>

<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex flex-col items-center text-center`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
      <FiUsers className="w-6 h-6" />
    </div>
    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Conversations humaines</h3>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      Discutez avec les membres de l&apos;équipe ou vos clients en temps réel.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { setActiveTab('messages'); setShowNewChatModal(true); }}
      className={`text-sm px-3 py-1 rounded-md ${
        darkMode 
          ? 'bg-blue-900 hover:bg-blue-800 text-blue-100' 
          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
      }`}
    >
      Démarrer une conversation
    </motion.button>
  </div>
  
  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex flex-col items-center text-center`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
      <FiZap className="w-6 h-6" />
    </div>
    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Assistants IA</h3>
    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      Obtenez de l&apos;aide instantanée avec nos assistants virtuels intelligents.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => { setActiveTab('bots'); setConversationFilter('bots'); }}
      className={`text-sm px-3 py-1 rounded-md ${
        darkMode 
          ? 'bg-purple-900 hover:bg-purple-800 text-purple-100' 
          : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
      }`}
    >
      Consulter un assistant
    </motion.button>
  </div>
</div>
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
    className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-l flex flex-col relative overflow-hidden`}
  >
    <button 
      className={`absolute top-4 right-4 p-1 rounded-full ${
        darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
      }`}
      onClick={() => setShowUserInfo(false)}
    >
      <FiX className="w-5 h-5" />
    </button>
    
    <div className={`p-6 text-center ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-24 h-24 mx-auto mb-4"
      >
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
          style={{ 
            background: selectedUser.type === "bot"
              ? "linear-gradient(135deg, #9333ea, #ec4899)"
              : (selectedUser.type === "staff" 
                ? "linear-gradient(135deg, #2563eb, #4f46e5)" 
                : "linear-gradient(135deg, #0d9488, #0891b2)") 
          }}
        >
          {selectedUser.type === "bot" ? (
            <FiZap className="w-10 h-10" />
          ) : (
            getInitials(selectedUser.firstName, selectedUser.lastName)
          )}
        </div>
        
        {selectedUser.type !== "bot" && (
          <div className="absolute bottom-0 right-0">
            {statusIndicator(selectedUser.status)}
          </div>
        )}
        
        {selectedUser.type === "bot" && (
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center">
            <FiZap className="w-3 h-3 text-white" />
          </div>
        )}
      </motion.div>
      
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {selectedUser.firstName} {selectedUser.lastName}
      </h2>
      
      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {selectedUser.type === "bot" ? "Assistant IA" : (selectedUser.type === "staff" ? selectedUser.role : selectedUser.company)}
      </p>
      
      <div className="flex justify-center mt-2 space-x-1">
        {selectedUser.type === "bot" ? (
          <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
            Assistant IA
          </span>
        ) : selectedUser.type === "staff" ? (
          <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
            {selectedUser.department || "Équipe"}
          </span>
        ) : (
          <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-teal-900 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
            Client
          </span>
        )}
        
        {selectedUser.isStarred && (
          <span className={`text-xs px-3 py-1 rounded-full flex items-center ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
            <FiStar className="w-3 h-3 mr-1" />
            VIP
          </span>
        )}
      </div>
      
      <div className="flex justify-center mt-4 space-x-2">
        {selectedUser.type !== "bot" && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${
                darkMode 
                  ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
              title="Appel audio"
            >
              <FiPhone className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${
                darkMode 
                  ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
              title="Appel vidéo"
            >
              <FiVideo className="w-5 h-5" />
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full ${
            darkMode 
              ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
          title="Email"
        >
          <FiMail className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-full ${
            darkMode 
              ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
          title="Plus d'options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
    
    <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="space-y-4">
        {selectedUser.type !== "bot" && (
          <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FiUser className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Coordonnées
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <FiMail className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.email}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  <FiPhone className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Téléphone</div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.phoneNumber}</div>
                </div>
              </div>
              
              {selectedUser.type === "client" && (
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <FiBriefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Entreprise</div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.company}</div>
                  </div>
                </div>
              )}
              
              {selectedUser.type === "staff" && (
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-indigo-900 bg-opacity-50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    <FiHash className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Département</div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.department}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {selectedUser.type === "bot" ? (
          <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FiZap className={`w-4 h-4 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              Capacités
            </h3>
            
            <div className="space-y-3">
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
                }`}>
                  <FiMessageCircle className="w-4 h-4" />
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Réponses intelligentes</div>
              </div>
              
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
                }`}>
                  <FiGithub className="w-4 h-4" />
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Assistance technique</div>
              </div>
              
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
                }`}>
                  <FiCoffee className="w-4 h-4" />
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Réservation de rendez-vous</div>
              </div>
              
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'
                }`}>
                  <FiTrendingUp className="w-4 h-4" />
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Analyses et rapports</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FiClock className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Activité
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Statut</div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    selectedUser.status === "online" ? "bg-green-500" :
                    selectedUser.status === "away" ? "bg-yellow-500" :
                    selectedUser.status === "busy" ? "bg-red-500" : "bg-gray-400"
                  }`}></div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedUser.status === "online" ? "En ligne" :
                     selectedUser.status === "away" ? "Absent" :
                     selectedUser.status === "busy" ? "Occupé" : "Hors ligne"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dernière activité</div>
                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.lastActive}</div>
              </div>
            </div>
          </div>
        )}
        
        {selectedUser.type !== "bot" && (
          <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <FiMessageCircle className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Historique des conversations
            </h3>
            
            <div className="space-y-2">
              <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                    <FiPhoneOutgoing className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Appel sortant</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>15 min, il y a 2 jours</div>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                    <FiPhoneIncoming className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Appel entrant</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>8 min, il y a 5 jours</div>
                  </div>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mr-3">
                    <FiPhoneMissed className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Appel manqué</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Il y a 1 semaine</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
          <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiCalendar className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            Rendez-vous
          </h3>
          
          <div className="text-center py-4">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aucun rendez-vous planifié</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 text-xs rounded-full ${
                darkMode 
                  ? 'bg-indigo-900 bg-opacity-50 text-indigo-200 hover:bg-opacity-70' 
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              + Planifier
            </motion.button>
          </div>
        </div>
        
        <div className={`rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm p-4`}>
          <h3 className={`text-sm font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FiSettings className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            Options
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Marquer comme VIP</div>
              <div 
                className={`w-10 h-5 ${selectedUser.isStarred ? 'bg-yellow-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')} rounded-full relative cursor-pointer transition-colors duration-300`}
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
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Désactiver les notifications</div>
              <div 
                className={`w-10 h-5 ${selectedUser.isMuted ? (darkMode ? 'bg-gray-500' : 'bg-gray-500') : (darkMode ? 'bg-gray-600' : 'bg-gray-200')} rounded-full relative cursor-pointer transition-colors duration-300`}
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
            
            {selectedUser.type === "bot" && (
              <div className="flex items-center justify-between">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Afficher les suggestions</div>
                <div 
                  className={`w-10 h-5 ${showSuggestions ? 'bg-purple-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-200')} rounded-full relative cursor-pointer transition-colors duration-300`}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <div 
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all duration-300 ${
                      showSuggestions ? 'left-5' : 'left-0.5'
                    }`} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
)}
</AnimatePresence>
</div>
</div>

{/* New Chat Modal */}
<AnimatePresence>
{showNewChatModal && (
  <>
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
    >
      <motion.div 
        className={`relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        variants={modalVariants}
        ref={modalRef}
      >
        <div className={`p-5 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex justify-between items-center`}>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nouvelle conversation</h3>
          <button
            className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setShowNewChatModal(false)}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <input
                type="text"
                className={`w-full py-3 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-transparent placeholder-gray-400'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400'
                }`}
                placeholder="Rechercher par nom ou département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex mb-4 p-1 rounded-lg gap-2 overflow-x-auto ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}">
            <button
              className={`py-2 px-4 text-sm rounded-md flex-1 ${
                viewMode === "all"
                  ? (darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm') 
                  : (darkMode ? 'text-gray-300' : 'text-gray-700')
              }`}
              onClick={() => setViewMode("all")}
            >
              Tous
            </button>
            <button
              className={`py-2 px-4 text-sm rounded-md flex-1 ${
                viewMode === "staff"
                  ? (darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm') 
                  : (darkMode ? 'text-gray-300' : 'text-gray-700')
              }`}
              onClick={() => setViewMode("staff")}
            >
              Équipe
            </button>
            <button
              className={`py-2 px-4 text-sm rounded-md flex-1 ${
                viewMode === "clients"
                  ? (darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm') 
                  : (darkMode ? 'text-gray-300' : 'text-gray-700')
              }`}
              onClick={() => setViewMode("clients")}
            >
              Clients
            </button>
            <button
              className={`py-2 px-4 text-sm rounded-md flex-1 ${
                viewMode === "bots"
                  ? (darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900 shadow-sm') 
                  : (darkMode ? 'text-gray-300' : 'text-gray-700')
              }`}
              onClick={() => setViewMode("bots")}
            >
              IA
            </button>
          </div>
          
          <div className={`max-h-80 overflow-y-auto custom-scrollbar ${darkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-y`}>
            {filteredUsers.map(user => (
              <motion.div 
                key={user.id}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-3 cursor-pointer rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
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
                  
                  setShowNewChatModal(false);
                }}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-semibold`}
                      style={{ 
                        background: user.type === "bot"
                          ? "linear-gradient(135deg, #9333ea, #ec4899)"
                          : (user.type === "staff" 
                            ? "linear-gradient(135deg, #2563eb, #4f46e5)" 
                            : "linear-gradient(135deg, #0d9488, #0891b2)") 
                      }}
                    >
                      {user.type === "bot" ? (
                        <FiZap className="w-6 h-6" />
                      ) : (
                        getInitials(user.firstName, user.lastName)
                      )}
                    </div>
                    
                    {user.type !== "bot" && (
                      <div className="absolute bottom-0 right-0">
                        {statusIndicator(user.status)}
                      </div>
                    )}
                    
                    {user.type === "bot" && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center">
                        <FiZap className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.firstName} {user.lastName}
                    </h3>
                    
                    <div className="flex items-center mt-1">
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                        {user.type === "bot" ? "Assistant IA" : (user.type === "staff" ? user.role : user.company)}
                      </p>
                    </div>
                    
                    <div className="mt-1">
                      {user.type === "bot" ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                          Assistant IA
                        </span>
                      ) : user.type === "staff" ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                          {user.department || "Équipe"}
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-teal-900 text-teal-200' : 'bg-teal-100 text-teal-800'}`}>
                          Client
                        </span>
                      )}
                      
                      {user.isStarred && (
                        <span className={`ml-1 text-xs px-2 py-0.5 rounded-full flex items-center ${darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                          <FiStar className="w-3 h-3 mr-1" />
                          VIP
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                    <FiChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className={`mt-5 pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t flex justify-end`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} mr-2`}
              onClick={() => setShowNewChatModal(false)}
            >
              Annuler
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              } text-white shadow-md`}
              onClick={() => {
                alert("Création d'un nouveau groupe de discussion");
                setShowNewChatModal(false);
              }}
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                <span>Créer un groupe</span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </>
)}
</AnimatePresence>
</motion.div>
);
}