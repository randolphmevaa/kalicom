"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiArrowDown,
  // FiArrowRight,
  FiArrowUp,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiCheck,
  // FiCheckCircle,
  FiChevronDown,
  // FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFile,
  FiFilter,
  FiFlag,
  FiHelpCircle,
  FiImage,
  FiInfo,
  FiList,
  FiMessageCircle,
  FiMoreVertical,
  FiPaperclip,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  // FiSettings,
  FiTag,
  // FiTrash2,
  FiUser,
  // FiUsers,
  FiVideo,
  FiX
} from "react-icons/fi";

/** -----------------------------
 *  Define TypeScript interfaces
 *  -----------------------------
 */
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  type: "staff" | "client" | "admin";
  role?: string;
  department?: string;
  company?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: "image" | "document" | "audio" | "video";
  url: string;
  size: string;
  thumbnail?: string;
}

interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: Attachment[];
}

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: "new" | "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  scheduledTime?: string;
  assignedToId?: string;
  clientId: string;
  attachments?: Attachment[];
  comments: TicketComment[];
  tags: string[];
  sla?: {
    responseTime: number; // in minutes
    resolutionTime: number; // in minutes
    isBreached: boolean;
  };
}

/** -----------------------------
 *  Sample Data
 *  -----------------------------
 */
const users: User[] = [
  {
    id: "u-001",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@company.com",
    type: "admin",
    role: "Responsable Support",
    department: "Support Client"
  },
  {
    id: "u-002",
    firstName: "Lucas",
    lastName: "Dubois",
    email: "lucas.dubois@company.com",
    type: "staff",
    role: "Spécialiste Support",
    department: "Support Client"
  },
  {
    id: "u-003",
    firstName: "Emma",
    lastName: "Leroy",
    email: "emma.leroy@company.com",
    type: "staff",
    role: "Support Technique",
    department: "Support Client"
  },
  {
    id: "u-004",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@globalsolutions.fr",
    type: "client",
    company: "Global Solutions"
  },
  {
    id: "u-005",
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@nexustech.fr",
    type: "client",
    company: "Nexus Tech"
  },
  {
    id: "u-006",
    firstName: "Pierre",
    lastName: "Moreau",
    email: "pierre.moreau@ecohabitat.fr",
    type: "client",
    company: "Eco Habitat"
  }
];

const categories = [
  "Problème Technique",
  "Question de Facturation",
  "Gestion de Compte",
  "Demande d'Information Produit",
  "Demande de Fonctionnalité",
  "Signalement de Bug",
  "Interruption de Service",
  "Aide à l'Installation",
  "Problème de Connexion",
  "Autre"
];

const sampleTickets: Ticket[] = [
  {
    id: "t-001",
    ticketNumber: "TIK-2023-001",
    title: "Impossible d'accéder au tableau de bord administrateur",
    description: "Quand j'essaie de me connecter au tableau de bord administrateur, je reçois un message d'erreur indiquant 'Accès non autorisé'.",
    status: "open",
    priority: "high",
    category: "Problème Technique",
    createdAt: "2023-10-26T08:30:00",
    updatedAt: "2023-10-26T09:15:00",
    dueDate: "2023-10-27T17:00:00",
    assignedToId: "u-002",
    clientId: "u-004",
    comments: [
      {
        id: "c-001",
        ticketId: "t-001",
        authorId: "u-004",
        content: "J'ai essayé de vider le cache et les cookies, mais j'ai toujours le même problème.",
        timestamp: "2023-10-26T08:45:00",
        isInternal: false
      },
      {
        id: "c-002",
        ticketId: "t-001",
        authorId: "u-002",
        content: "Je vais vérifier les permissions de votre compte. Pouvez-vous me fournir votre nom d'utilisateur ?",
        timestamp: "2023-10-26T09:15:00",
        isInternal: false
      }
    ],
    tags: ["connexion", "tableau de bord", "accès"],
    sla: {
      responseTime: 30,
      resolutionTime: 240,
      isBreached: false
    }
  },
  {
    id: "t-002",
    ticketNumber: "TIK-2023-002",
    title: "Écart de facturation sur la dernière facture",
    description: "La facture #INV-2023-5678 indique des frais pour des services que nous n'avons pas utilisés. Merci de vérifier et d'ajuster.",
    status: "in_progress",
    priority: "medium",
    category: "Question de Facturation",
    createdAt: "2023-10-25T14:20:00",
    updatedAt: "2023-10-26T10:30:00",
    dueDate: "2023-10-27T14:20:00",
    scheduledTime: "2023-10-26T15:00:00",
    assignedToId: "u-003",
    clientId: "u-005",
    comments: [
      {
        id: "c-003",
        ticketId: "t-002",
        authorId: "u-005",
        content: "J'ai joint une copie de la facture avec les éléments contestés surlignés.",
        timestamp: "2023-10-25T14:30:00",
        isInternal: false,
        attachments: [
          {
            id: "a-001",
            name: "facture_surlignee.pdf",
            type: "document",
            url: "#",
            size: "1.2 MB"
          }
        ]
      },
      {
        id: "c-004",
        ticketId: "t-002",
        authorId: "u-003",
        content: "Notre service de facturation examine la facture. Nous reviendrons vers vous rapidement.",
        timestamp: "2023-10-25T16:15:00",
        isInternal: false
      },
      {
        id: "c-005",
        ticketId: "t-002",
        authorId: "u-003",
        content: "J'ai parlé avec le service facturation, ils ont confirmé une erreur de notre part. Procédons à un remboursement.",
        timestamp: "2023-10-26T10:30:00",
        isInternal: true
      }
    ],
    tags: ["facturation", "facture", "remboursement"],
    sla: {
      responseTime: 60,
      resolutionTime: 480,
      isBreached: false
    }
  },
  {
    id: "t-003",
    ticketNumber: "TIK-2023-003",
    title: "Besoin d'aide pour configurer de nouveaux comptes utilisateurs",
    description: "Nous devons configurer 5 nouveaux comptes utilisateurs pour les membres de notre équipe qui viennent de rejoindre notre entreprise.",
    status: "new",
    priority: "low",
    category: "Gestion de Compte",
    createdAt: "2023-10-26T11:45:00",
    updatedAt: "2023-10-26T11:45:00",
    clientId: "u-006",
    comments: [],
    tags: ["comptes", "nouveaux utilisateurs", "configuration"],
    sla: {
      responseTime: 120,
      resolutionTime: 720,
      isBreached: false
    }
  },
  {
    id: "t-004",
    ticketNumber: "TIK-2023-004",
    title: "Demande de fonctionnalité : Exporter des données vers Excel",
    description: "Nous aimerions avoir la possibilité d'exporter les données des rapports au format Excel. Actuellement, nous ne pouvons exporter qu'en CSV, ce qui nécessite un formatage supplémentaire.",
    status: "open",
    priority: "medium",
    category: "Demande de Fonctionnalité",
    createdAt: "2023-10-24T09:20:00",
    updatedAt: "2023-10-25T14:10:00",
    assignedToId: "u-001",
    clientId: "u-004",
    comments: [
      {
        id: "c-006",
        ticketId: "t-004",
        authorId: "u-001",
        content: "Merci pour votre suggestion. Nous l'avons ajoutée à notre feuille de route produit et nous vous tiendrons informé dès que nous aurons un calendrier de déploiement.",
        timestamp: "2023-10-25T14:10:00",
        isInternal: false
      }
    ],
    tags: ["fonctionnalité", "excel", "export"],
    sla: {
      responseTime: 240,
      resolutionTime: 1440,
      isBreached: false
    }
  },
  {
    id: "t-005",
    ticketNumber: "TIK-2023-005",
    title: "Panne système - Impossible de traiter les commandes",
    description: "Toute notre équipe est dans l'impossibilité de traiter les nouvelles commandes. Le système affiche une erreur 500 lorsque nous essayons de soumettre un formulaire de commande.",
    status: "resolved",
    priority: "urgent",
    category: "Interruption de Service",
    createdAt: "2023-10-25T08:05:00",
    updatedAt: "2023-10-25T11:30:00",
    assignedToId: "u-002",
    clientId: "u-005",
    comments: [
      {
        id: "c-007",
        ticketId: "t-005",
        authorId: "u-002",
        content: "Nous sommes conscients du problème et notre équipe technique y travaille. Nous vous tiendrons informés dès que possible.",
        timestamp: "2023-10-25T08:15:00",
        isInternal: false
      },
      {
        id: "c-008",
        ticketId: "t-005",
        authorId: "u-002",
        content: "Le problème a été résolu. Il s'agissait d'un problème de connexion à la base de données qui a maintenant été corrigé. Veuillez essayer de traiter à nouveau les commandes et nous informer si vous rencontrez d'autres problèmes.",
        timestamp: "2023-10-25T11:30:00",
        isInternal: false
      }
    ],
    tags: ["panne", "critique", "commandes"],
    sla: {
      responseTime: 15,
      resolutionTime: 120,
      isBreached: false
    }
  },
  {
    id: "t-006",
    ticketNumber: "TIK-2023-006",
    title: "Demande de formation sur le produit",
    description: "Nous avons récemment passé à la version premium et nous aimerions planifier une session de formation pour notre équipe.",
    status: "closed",
    priority: "medium",
    category: "Autre",
    createdAt: "2023-10-20T13:40:00",
    updatedAt: "2023-10-23T16:20:00",
    dueDate: "2023-10-23T16:00:00",
    scheduledTime: "2023-10-23T14:00:00",
    assignedToId: "u-003",
    clientId: "u-006",
    comments: [
      {
        id: "c-009",
        ticketId: "t-006",
        authorId: "u-003",
        content: "Je serais ravi de planifier une session de formation. Pourriez-vous me préciser sur quelles fonctionnalités spécifiques vous souhaiteriez vous concentrer et quand votre équipe serait disponible ?",
        timestamp: "2023-10-20T14:30:00",
        isInternal: false
      },
      {
        id: "c-010",
        ticketId: "t-006",
        authorId: "u-006",
        content: "Nous aimerions nous concentrer sur les fonctionnalités de reporting et les capacités d'intégration. Notre équipe est disponible lundi prochain après-midi.",
        timestamp: "2023-10-21T09:15:00",
        isInternal: false
      },
      {
        id: "c-011",
        ticketId: "t-006",
        authorId: "u-003",
        content: "Parfait ! J'ai prévu une session de formation pour lundi 23 octobre à 14h00. Vous recevrez une invitation avec les détails de la réunion sous peu.",
        timestamp: "2023-10-21T10:20:00",
        isInternal: false
      },
      {
        id: "c-012",
        ticketId: "t-006",
        authorId: "u-003",
        content: "La session de formation s'est déroulée avec succès. Le client avait des questions sur les rapports avancés auxquelles j'ai répondu. Ils sont satisfaits de la formation.",
        timestamp: "2023-10-23T16:20:00",
        isInternal: true
      }
    ],
    tags: ["formation", "premium", "programmé"],
    sla: {
      responseTime: 120,
      resolutionTime: 2880,
      isBreached: false
    }
  },
  {
    id: "t-007",
    ticketNumber: "TIK-2023-007",
    title: "L'intégration avec le CRM tiers ne fonctionne plus",
    description: "Après la dernière mise à jour, notre intégration Salesforce a cessé de fonctionner. Nous ne pouvons plus synchroniser les données clients.",
    status: "in_progress",
    priority: "high",
    category: "Problème Technique",
    createdAt: "2023-10-26T07:50:00",
    updatedAt: "2023-10-26T09:30:00",
    assignedToId: "u-002",
    clientId: "u-004",
    comments: [
      {
        id: "c-013",
        ticketId: "t-007",
        authorId: "u-004",
        content: "Cela cause une perturbation importante du flux de travail de notre équipe commerciale. Pouvez-vous traiter ce problème en priorité ?",
        timestamp: "2023-10-26T08:00:00",
        isInternal: false
      },
      {
        id: "c-014",
        ticketId: "t-007",
        authorId: "u-002",
        content: "Je comprends l'urgence. J'examine cela immédiatement et vous tiendrai informé de notre progression.",
        timestamp: "2023-10-26T08:10:00",
        isInternal: false
      },
      {
        id: "c-015",
        ticketId: "t-007",
        authorId: "u-002",
        content: "L'enquête initiale montre que Salesforce a modifié certains points d'accès API. Nous mettons à jour notre intégration pour correspondre aux nouvelles exigences.",
        timestamp: "2023-10-26T09:30:00",
        isInternal: false
      }
    ],
    tags: ["intégration", "salesforce", "api", "urgent"],
    sla: {
      responseTime: 30,
      resolutionTime: 240,
      isBreached: false
    }
  },
  {
    id: "t-008",
    ticketNumber: "TIK-2023-008",
    title: "Besoin de changer l'adresse de l'entreprise dans le profil de facturation",
    description: "Nous avons récemment déménagé nos bureaux et nous devons mettre à jour notre adresse dans le profil de facturation pour garantir que les factures comportent les bonnes informations.",
    status: "new",
    priority: "low",
    category: "Gestion de Compte",
    createdAt: "2023-10-26T10:25:00",
    updatedAt: "2023-10-26T10:25:00",
    clientId: "u-005",
    comments: [],
    tags: ["facturation", "mise à jour adresse", "compte"],
    sla: {
      responseTime: 120,
      resolutionTime: 480,
      isBreached: false
    }
  },
  {
    id: "t-009",
    ticketNumber: "TIK-2023-009",
    title: "Erreur lors de la génération de rapports mensuels",
    description: "Depuis la dernière mise à jour, nos rapports mensuels affichent des données incohérentes. Les totaux ne correspondent pas aux détails des transactions.",
    status: "open",
    priority: "high",
    category: "Bug",
    createdAt: "2023-10-27T09:15:00",
    updatedAt: "2023-10-27T09:15:00",
    clientId: "u-004",
    comments: [],
    tags: ["rapports", "données", "bug"],
    sla: {
      responseTime: 60,
      resolutionTime: 480,
      isBreached: false
    }
  },
  {
    id: "t-010",
    ticketNumber: "TIK-2023-010",
    title: "Demande d'accès API pour développement",
    description: "Notre équipe technique souhaite intégrer votre API dans notre système interne. Nous avons besoin d'une clé d'API pour l'environnement de développement.",
    status: "new",
    priority: "medium",
    category: "Demande d'accès",
    createdAt: "2023-10-28T10:30:00",
    updatedAt: "2023-10-28T10:30:00",
    clientId: "u-006",
    comments: [],
    tags: ["api", "développement", "intégration"],
    sla: {
      responseTime: 120,
      resolutionTime: 720,
      isBreached: false
    }
  }
];

// Helper functions
const getUser = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const formatDateTime = (dateStr: string): string => {
  return `${formatDate(dateStr)} à ${formatTime(dateStr)}`;
};

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return "à l'instant";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
};

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "new": return "bg-blue-500";
    case "open": return "bg-yellow-500";
    case "in_progress": return "bg-purple-500";
    case "resolved": return "bg-green-500";
    case "closed": return "bg-gray-500";
    default: return "bg-gray-400";
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "new": return "Nouveau";
    case "open": return "Ouvert";
    case "in_progress": return "En cours";
    case "resolved": return "Résolu";
    case "closed": return "Fermé";
    default: return status;
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "low": return "bg-green-100 text-green-800";
    case "medium": return "bg-blue-100 text-blue-800";
    case "high": return "bg-orange-100 text-orange-800";
    case "urgent": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "low":
      return <FiFlag className="w-4 h-4 text-green-600" />;
    case "medium":
      return <FiFlag className="w-4 h-4 text-blue-600" />;
    case "high":
      return <FiFlag className="w-4 h-4 text-orange-600" />;
    case "urgent":
      return <FiFlag className="w-4 h-4 text-red-600" />;
    default:
      return <FiFlag className="w-4 h-4 text-gray-600" />;
  }
};

const getPriorityText = (priority: string): string => {
  switch (priority) {
    case "low": return "Faible";
    case "medium": return "Moyenne";
    case "high": return "Élevée";
    case "urgent": return "Urgente";
    default: return priority;
  }
};

const calculateSLAStatus = (ticket: Ticket): { status: "ok" | "warning" | "breached"; timeLeft?: string } => {
  if (!ticket.sla) return { status: "ok" };
  
  if (ticket.sla.isBreached) return { status: "breached" };
  
  const now = new Date();
  const created = new Date(ticket.createdAt);
  // const updated = new Date(ticket.updatedAt);
  
  // For new tickets, check response time
  if (ticket.status === "new") {
    const responseDeadline = new Date(created.getTime() + ticket.sla.responseTime * 60000);
    const timeLeftMs = responseDeadline.getTime() - now.getTime();
    
    if (timeLeftMs < 0) {
      return { status: "breached" };
    } else if (timeLeftMs < 30 * 60000) { // less than 30 mins
      const minsLeft = Math.ceil(timeLeftMs / 60000);
      return { 
        status: "warning", 
        timeLeft: `${minsLeft} min${minsLeft > 1 ? 's' : ''}` 
      };
    } else {
      const hoursLeft = Math.ceil(timeLeftMs / 3600000);
      return { 
        status: "ok", 
        timeLeft: `${hoursLeft} h${hoursLeft > 1 ? 's' : ''}` 
      };
    }
  }
  
  // For other statuses, check resolution time
  if (["open", "in_progress"].includes(ticket.status)) {
    const resolutionDeadline = new Date(created.getTime() + ticket.sla.resolutionTime * 60000);
    const timeLeftMs = resolutionDeadline.getTime() - now.getTime();
    
    if (timeLeftMs < 0) {
      return { status: "breached" };
    } else if (timeLeftMs < 60 * 60000) { // less than 1 hour
      const minsLeft = Math.ceil(timeLeftMs / 60000);
      return { 
        status: "warning", 
        timeLeft: `${minsLeft} min${minsLeft > 1 ? 's' : ''}` 
      };
    } else {
      const hoursLeft = Math.ceil(timeLeftMs / 3600000);
      return { 
        status: "ok", 
        timeLeft: `${hoursLeft} h${hoursLeft > 1 ? 's' : ''}` 
      };
    }
  }
  
  return { status: "ok" };
};

export default function SupportTicketsPage() {
  // Current user (for demo purposes, we'll use the first admin)
  const currentUser = users[0];
  
  // States
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter ] = useState<string>("all");
  const [assigneeFilter ] = useState<string>("all");
  const [showCreateTicketModal, setShowCreateTicketModal] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState<boolean>(true);
  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    title: "",
    description: "",
    status: "new",
    priority: "medium",
    category: categories[0],
    clientId: users.find(u => u.type === "client")?.id || "",
    tags: []
  });
  const [newComment, setNewComment] = useState<string>("");
  const [isInternalComment, setIsInternalComment] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<{ field: string; direction: "asc" | "desc" }>({ field: "createdAt", direction: "desc" });
  
  // Calculate ticket statistics
  const ticketStats = useMemo(() => {
    return {
      total: tickets.length,
      new: tickets.filter(t => t.status === "new").length,
      open: tickets.filter(t => t.status === "open").length,
      inProgress: tickets.filter(t => t.status === "in_progress").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
      closed: tickets.filter(t => t.status === "closed").length,
      urgent: tickets.filter(t => t.priority === "urgent").length,
      high: tickets.filter(t => t.priority === "high").length,
      breachedSLA: tickets.filter(t => t.sla?.isBreached).length,
      unassigned: tickets.filter(t => !t.assignedToId).length
    };
  }, [tickets]);
  
  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Apply search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.ticketNumber.toLowerCase().includes(searchLower) ||
          ticket.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Apply status filter
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }
      
      // Apply priority filter
      if (priorityFilter !== "all" && ticket.priority !== priorityFilter) {
        return false;
      }
      
      // Apply category filter
      if (categoryFilter !== "all" && ticket.category !== categoryFilter) {
        return false;
      }
      
      // Apply assignee filter
      if (assigneeFilter !== "all") {
        if (assigneeFilter === "unassigned" && ticket.assignedToId) {
          return false;
        } else if (assigneeFilter !== "unassigned" && ticket.assignedToId !== assigneeFilter) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      const fieldA = a[sortBy.field as keyof Ticket] as string;
      const fieldB = b[sortBy.field as keyof Ticket] as string;
      
      if (sortBy.direction === "asc") {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter, assigneeFilter, sortBy]);
  
  // Effects
  useEffect(() => {
    // If no ticket is selected and we have filtered tickets, select the first one
    if (!selectedTicket && filteredTickets.length > 0) {
      setSelectedTicket(filteredTickets[0]);
    }
  }, [selectedTicket, filteredTickets]);
  
  // Handlers
  const handleCreateTicket = () => {
    // Generate a new ticket ID and number
    const newId = `t-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicketNumber = `TIK-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, '0')}`;
    
    const timestamp = new Date().toISOString();
    
    // Create the new ticket
    const ticketToAdd: Ticket = {
      id: newId,
      ticketNumber: newTicketNumber,
      title: newTicket.title || "Nouveau Ticket",
      description: newTicket.description || "",
      status: newTicket.status as "new" | "open" | "in_progress" | "resolved" | "closed",
      priority: newTicket.priority as "low" | "medium" | "high" | "urgent",
      category: newTicket.category || categories[0],
      createdAt: timestamp,
      updatedAt: timestamp,
      dueDate: newTicket.dueDate,
      scheduledTime: newTicket.scheduledTime,
      assignedToId: newTicket.assignedToId,
      clientId: newTicket.clientId || users.find(u => u.type === "client")?.id || "",
      comments: [],
      tags: newTicket.tags || [],
      sla: {
        responseTime: newTicket.priority === "urgent" ? 30 : 
                      newTicket.priority === "high" ? 60 : 
                      newTicket.priority === "medium" ? 120 : 240,
        resolutionTime: newTicket.priority === "urgent" ? 240 : 
                        newTicket.priority === "high" ? 480 : 
                        newTicket.priority === "medium" ? 720 : 1440,
        isBreached: false
      }
    };
    
    // Add the new ticket to the list
    setTickets([ticketToAdd, ...tickets]);
    setSelectedTicket(ticketToAdd);
    
    // Reset the new ticket form
    setNewTicket({
      title: "",
      description: "",
      status: "new",
      priority: "medium",
      category: categories[0],
      clientId: users.find(u => u.type === "client")?.id || "",
      tags: []
    });
    
    // Close the modal
    setShowCreateTicketModal(false);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTicket) return;
    
    const timestamp = new Date().toISOString();
    
    // Create new comment
    const comment: TicketComment = {
      id: `c-${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: currentUser.id,
      content: newComment,
      timestamp: timestamp,
      isInternal: isInternalComment
    };
    
    // Update the selected ticket with the new comment
    const updatedTicket: Ticket = {
      ...selectedTicket,
      comments: [...selectedTicket.comments, comment],
      updatedAt: timestamp
    };
    
    // Update the tickets list
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
    setNewComment("");
    setIsInternalComment(false);
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim() || !selectedTicket) return;
    
    if (!selectedTicket.tags.includes(tagInput.trim())) {
      // Update the selected ticket with the new tag
      const updatedTicket: Ticket = {
        ...selectedTicket,
        tags: [...selectedTicket.tags, tagInput.trim()],
        updatedAt: new Date().toISOString()
      };
      
      // Update the tickets list
      const updatedTickets = tickets.map(t => 
        t.id === selectedTicket.id ? updatedTicket : t
      );
      
      setTickets(updatedTickets);
      setSelectedTicket(updatedTicket);
    }
    
    setTagInput("");
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    if (!selectedTicket) return;
    
    // Update the selected ticket by removing the tag
    const updatedTicket: Ticket = {
      ...selectedTicket,
      tags: selectedTicket.tags.filter(tag => tag !== tagToRemove),
      updatedAt: new Date().toISOString()
    };
    
    // Update the tickets list
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
  };
  
  const handleUpdateTicketStatus = (newStatus: "new" | "open" | "in_progress" | "resolved" | "closed") => {
    if (!selectedTicket) return;
    
    // Update the selected ticket with the new status
    const updatedTicket: Ticket = {
      ...selectedTicket,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    
    // Update the tickets list
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
  };
  
  const handleUpdateTicketPriority = (newPriority: "low" | "medium" | "high" | "urgent") => {
    if (!selectedTicket) return;
    
    // Update the selected ticket with the new priority
    const updatedTicket: Ticket = {
      ...selectedTicket,
      priority: newPriority,
      updatedAt: new Date().toISOString(),
      sla: {
        ...selectedTicket.sla!,
        responseTime: newPriority === "urgent" ? 30 : 
                      newPriority === "high" ? 60 : 
                      newPriority === "medium" ? 120 : 240,
        resolutionTime: newPriority === "urgent" ? 240 : 
                        newPriority === "high" ? 480 : 
                        newPriority === "medium" ? 720 : 1440
      }
    };
    
    // Update the tickets list
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
  };
  
  const handleAssignTicket = (userId: string) => {
    if (!selectedTicket) return;
    
    // Update the selected ticket with the new assignee
    const updatedTicket: Ticket = {
      ...selectedTicket,
      assignedToId: userId,
      updatedAt: new Date().toISOString()
    };
    
    // Update the tickets list
    const updatedTickets = tickets.map(t => 
      t.id === selectedTicket.id ? updatedTicket : t
    );
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTicket);
    setShowAssignModal(false);
  };
  
  const handleSort = (field: string) => {
    if (sortBy.field === field) {
      // Toggle direction if same field
      setSortBy({
        field,
        direction: sortBy.direction === "asc" ? "desc" : "asc"
      });
    } else {
      // Default to desc for new field
      setSortBy({
        field,
        direction: "desc"
      });
    }
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const slideIn = {
    hidden: { x: 30, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };
  
  // Ticket sorting options
  const sortOptions = [
    { field: "createdAt", label: "Date de création" },
    { field: "updatedAt", label: "Dernière mise à jour" },
    { field: "priority", label: "Priorité" },
    { field: "status", label: "Statut" }
  ];
  
  // Status dropdown options
  const statusOptions = [
    { value: "new", label: "Nouveau" },
    { value: "open", label: "Ouvert" },
    { value: "in_progress", label: "En cours" },
    { value: "resolved", label: "Résolu" },
    { value: "closed", label: "Fermé" }
  ];
  
  // Priority dropdown options
  const priorityOptions = [
    { value: "low", label: "Faible" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Élevée" },
    { value: "urgent", label: "Urgente" }
  ];
  
  return (
    <div className="min-h-screen">
      <div className="max-w-8xl mx-auto h-screen flex flex-col pt-16">
        {/* Page Header */}
        <div className="bg-white px-6 py-5 shadow-sm border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestion des Tickets Support</h1>
              <p className="text-gray-500 text-sm">Gérez et suivez tous vos tickets de support client</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateTicketModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white rounded-lg shadow-md flex items-center font-medium transition duration-200 ease-in-out hover:shadow-lg"
              >
                <FiPlus className="mr-2" />
                <span>Créer un ticket</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200 ease-in-out"
              >
                <FiRefreshCw className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200 ease-in-out relative"
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </motion.button>

            </div>
          </div>
        </div>
        
        {/* Dashboard & Stats */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="grid grid-cols-5 gap-5">
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total tickets</p>
                  <h3 className="text-2xl font-bold text-gray-900">{ticketStats.total}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiList className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nouveaux</p>
                  <h3 className="text-2xl font-bold text-blue-600">{ticketStats.new}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiPaperclip className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">En cours</p>
                  <h3 className="text-2xl font-bold text-purple-600">{ticketStats.inProgress}</h3>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiRefreshCw className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Urgents</p>
                  <h3 className="text-2xl font-bold text-red-600">{ticketStats.urgent}</h3>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Non assignés</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{ticketStats.unassigned}</h3>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FiHelpCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-6 py-4 flex overflow-hidden">
          {/* Left Panel - Tickets List */}
          <div className={`${showDetailsPanel ? 'w-1/2' : 'w-full'} bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col transition-all duration-300`}>
            {/* List Header & Controls */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg ${viewMode === "list" ? 'bg-[#1B0353] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <FiList className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("kanban")}
                    className={`p-2.5 rounded-lg ${viewMode === "kanban" ? 'bg-[#1B0353] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <FiBarChart2 className="w-5 h-5" />
                  </motion.button>
                  
                  <h2 className="text-lg font-semibold text-gray-900 ml-2">
                    {filteredTickets.length} Ticket{filteredTickets.length !== 1 ? 's' : ''}
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <select
                      value={sortBy.field}
                      onChange={(e) => handleSort(e.target.value)}
                      className="appearance-none pl-3 pr-9 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] transition-all duration-200"
                    >
                      {sortOptions.map(option => (
                        <option key={option.field} value={option.field}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      {sortBy.direction === "asc" ? (
                        <FiArrowUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                    placeholder="Rechercher un ticket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                  title="Filtres avancés"
                >
                  <FiFilter className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="flex mt-3 space-x-2 overflow-x-auto py-1 custom-scrollbar">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "all" 
                      ? "bg-[#1B0353] text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tous les statuts
                </button>
                
                <button
                  onClick={() => setStatusFilter("new")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "new" 
                      ? "bg-blue-500 text-white shadow-sm" 
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  Nouveaux
                </button>
                
                <button
                  onClick={() => setStatusFilter("open")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "open" 
                      ? "bg-yellow-500 text-white shadow-sm" 
                      : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                  }`}
                >
                  Ouverts
                </button>
                
                <button
                  onClick={() => setStatusFilter("in_progress")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "in_progress" 
                      ? "bg-purple-500 text-white shadow-sm" 
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  En cours
                </button>
                
                <button
                  onClick={() => setStatusFilter("resolved")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "resolved" 
                      ? "bg-green-500 text-white shadow-sm" 
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  Résolus
                </button>
                
                <button
                  onClick={() => setStatusFilter("closed")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    statusFilter === "closed" 
                      ? "bg-gray-500 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Fermés
                </button>
                
                <div className="h-6 border-r border-gray-200 mx-1"></div>
                
                <button
                  onClick={() => setPriorityFilter("all")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    priorityFilter === "all" 
                      ? "bg-[#1B0353] text-white shadow-sm" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Toutes les priorités
                </button>
                
                <button
                  onClick={() => setPriorityFilter("urgent")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    priorityFilter === "urgent" 
                      ? "bg-red-500 text-white shadow-sm" 
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  Urgent
                </button>
                
                <button
                  onClick={() => setPriorityFilter("high")}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all duration-200 ${
                    priorityFilter === "high" 
                      ? "bg-orange-500 text-white shadow-sm" 
                      : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                  }`}
                >
                  Élevé
                </button>
              </div>
            </div>
            
            {/* Tickets List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {viewMode === "list" ? (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="divide-y divide-gray-100"
                >
                  {filteredTickets.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiSearch className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Aucun ticket trouvé</h3>
                      <p className="text-gray-500 max-w-md mx-auto mt-2">
                        Aucun ticket ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                      </p>
                    </div>
                  ) : (
                    filteredTickets.map((ticket) => {
                      const isSelected = selectedTicket?.id === ticket.id;
                      const client = getUser(ticket.clientId);
                      const assignee = ticket.assignedToId ? getUser(ticket.assignedToId) : null;
                      const slaStatus = calculateSLAStatus(ticket);
                      
                      return (
                        <motion.div 
                          key={ticket.id}
                          variants={listItemVariants}
                          whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
                          className={`p-4 cursor-pointer transition-all duration-200 ${isSelected ? 'bg-[#004AC8] bg-opacity-5 border-l-4 border-[#004AC8]' : 'border-l-4 border-transparent'}`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className={`w-14 h-14 rounded-lg ${getStatusColor(ticket.status)} flex items-center justify-center text-white shadow-sm`}>
                                  <span className="text-lg font-bold">{ticket.ticketNumber.split('-').pop()}</span>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1 hover:text-indigo-700 transition-colors duration-200">{ticket.title}</h3>
                                
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} bg-opacity-10 text-${getStatusColor(ticket.status).replace('bg-', '')}`}>
                                    {getStatusText(ticket.status)}
                                  </span>
                                  
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                    <span className="mr-1">{getPriorityIcon(ticket.priority)}</span>
                                    {getPriorityText(ticket.priority)}
                                  </span>
                                  
                                  {slaStatus.status === "warning" && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <FiClock className="w-3 h-3 mr-1" />
                                      {slaStatus.timeLeft}
                                    </span>
                                  )}
                                  
                                  {slaStatus.status === "breached" && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <FiAlertCircle className="w-3 h-3 mr-1" />
                                      SLA dépassé
                                    </span>
                                  )}
                                </div>
                                
                                <div className="mt-2 text-sm text-gray-500 line-clamp-1">{ticket.description}</div>
                                
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <span className="mr-2 font-medium">#{ticket.ticketNumber}</span>
                                  <span className="mr-2">•</span>
                                  <span>Créé {formatTimeAgo(ticket.createdAt)}</span>
                                  
                                  {ticket.dueDate && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <FiCalendar className="w-3 h-3 mr-1" />
                                      <span>Dû le {formatDate(ticket.dueDate)}</span>
                                    </>
                                  )}
                                  
                                  {ticket.scheduledTime && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <FiClock className="w-3 h-3 mr-1" />
                                      <span>Prévu le {formatDateTime(ticket.scheduledTime)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <div className="flex">
                                {/* Client avatar */}
                                <div className="relative group" title={client ? `Client: ${client.firstName} ${client.lastName}` : 'Client inconnu'}>
                                  <div 
                                    className="w-9 h-9 rounded-full bg-[#4BB2F6] flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                                  >
                                    {client ? getInitials(client.firstName, client.lastName) : '?'}
                                  </div>
                                  <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                </div>
                                
                                {/* Assignee avatar */}
                                {assignee && (
                                  <div 
                                    className="w-9 h-9 rounded-full bg-[#1B0353] flex items-center justify-center text-white text-xs font-semibold -ml-2 shadow-sm group relative"
                                    title={`Assigné à: ${assignee.firstName} ${assignee.lastName}`}
                                  >
                                    {getInitials(assignee.firstName, assignee.lastName)}
                                    <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                  </div>
                                )}
                                
                                {!assignee && (
                                  <div 
                                    className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold -ml-2 shadow-sm group relative"
                                    title="Non assigné"
                                  >
                                    <FiUser className="w-4 h-4" />
                                    <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                                  </div>
                                )}
                              </div>
                              
                              {ticket.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap justify-end max-w-[150px]">
                                  {ticket.tags.slice(0, 2).map((tag) => (
                                    <span 
                                      key={tag} 
                                      className="m-0.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors duration-200"
                                    >
                                      <FiTag className="w-3 h-3 mr-1" />
                                      {tag}
                                    </span>
                                  ))}
                                  {ticket.tags.length > 2 && (
                                    <span className="m-0.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors duration-200">
                                      +{ticket.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {ticket.comments.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500 flex items-center">
                                  <FiMessageCircle className="w-3 h-3 mr-1" />
                                  {ticket.comments.length} commentaire{ticket.comments.length > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              ) : (
                // Vue Kanban améliorée
                <div className="p-6 h-full">
                  <div className="grid grid-cols-5 gap-4 h-full">
                    {["new", "open", "in_progress", "resolved", "closed"].map((status) => (
                      <div key={status} className="flex flex-col h-full">
                        <div className={`flex items-center justify-between p-2 mb-2 rounded-t-lg ${getStatusColor(status)} bg-opacity-20`}>
                          <h3 className="text-sm font-semibold">{getStatusText(status)}</h3>
                          <span className="text-xs font-medium px-2 py-0.5 bg-white bg-opacity-50 rounded-full">
                            {tickets.filter(t => t.status === status).length}
                          </span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-2 overflow-y-auto space-y-2">
                          {tickets.filter(t => t.status === status).map(ticket => (
                            <motion.div
                              key={ticket.id}
                              whileHover={{ scale: 1.02 }}
                              className="bg-white p-3 rounded-lg shadow-sm cursor-pointer border-l-2 border-solid"
                              style={{ borderLeftColor: getStatusColor(ticket.status).replace('bg-', '') }}
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <h4 className="text-sm font-medium mb-1 line-clamp-1">{ticket.title}</h4>
                              <div className="flex justify-between items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                                  {getPriorityText(ticket.priority)}
                                </span>
                                <span className="text-xs text-gray-500">#{ticket.ticketNumber.split('-').pop()}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Panel - Ticket Details */}
          <AnimatePresence>
            {showDetailsPanel && selectedTicket && (
              <motion.div 
                variants={slideIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-1/2 bg-white rounded-lg shadow-sm border border-gray-100 ml-4 flex flex-col overflow-hidden"
              >
                {/* Ticket Header */}
                <div className="p-4 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(selectedTicket.status)} mr-2`}></span>
                      <h2 className="text-lg font-semibold text-gray-900 truncate mr-2">
                        {selectedTicket.title}
                      </h2>
                    </div>
                    
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span className="font-medium">#{selectedTicket.ticketNumber}</span>
                      <span className="mx-2">•</span>
                      <span>Créé le {formatDateTime(selectedTicket.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDetailsPanel(false)}
                      className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                      title="Fermer les détails"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                
                {/* Ticket Actions */}
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative group">
                        <button
                          className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${getStatusColor(selectedTicket.status)} text-white shadow-sm group-hover:shadow-md transition-all duration-200`}
                        >
                          {getStatusText(selectedTicket.status)}
                          <FiChevronDown className="ml-1 w-4 h-4" />
                        </button>
                        
                        {/* Status dropdown */}
                        <div className="absolute left-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                          <div className="py-1">
                            {statusOptions.map(option => (
                              <button
                                key={option.value}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${selectedTicket.status === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateTicketStatus(option.value as "new" | "open" | "in_progress" | "resolved" | "closed");
}}
                              >
                                <span className={`w-2 h-2 rounded-full ${getStatusColor(option.value)} mr-2`}></span>
                                {option.label}
                                {selectedTicket.status === option.value && (
                                  <FiCheck className="ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative group">
                        <button
                          className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                            getPriorityColor(selectedTicket.priority)
                          } shadow-sm group-hover:shadow-md transition-all duration-200`}
                        >
                          {getPriorityIcon(selectedTicket.priority)}
                          <span className="ml-1">{getPriorityText(selectedTicket.priority)}</span>
                          <FiChevronDown className="ml-1 w-4 h-4" />
                        </button>
                        
                        {/* Priority dropdown */}
                        <div className="absolute left-0 mt-2 w-40 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                          <div className="py-1">
                            {priorityOptions.map(option => (
                              <button
                                key={option.value}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left ${selectedTicket.priority === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateTicketPriority(option.value as "low" | "medium" | "high" | "urgent");
                                }}
                              >
                                {getPriorityIcon(option.value)}
                                <span className="ml-2">{option.label}</span>
                                {selectedTicket.priority === option.value && (
                                  <FiCheck className="ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAssignModal(true)}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium flex items-center text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-200"
                      >
                        <FiUser className="mr-1 w-4 h-4" />
                        {selectedTicket.assignedToId ? 'Réassigner' : 'Assigner'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm transition-all duration-200"
                      >
                        <FiMoreVertical className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Ticket Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="w-3/4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <FiInfo className="w-4 h-4 mr-1 text-[#004AC8]" />
                          Détails du ticket
                        </h3>
                        <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start">
                            <div className="w-28 text-sm text-gray-500">Client:</div>
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {(() => {
                                const client = getUser(selectedTicket.clientId);
                                if (client) {
                                  return (
                                    <div className="flex items-center">
                                      <div 
                                        className="w-5 h-5 rounded-full bg-[#4BB2F6] flex items-center justify-center text-white text-xs font-semibold mr-2"
                                      >
                                        {getInitials(client.firstName, client.lastName)}
                                      </div>
                                      <span>{client.firstName} {client.lastName}</span>
                                      {client.company && (
                                        <span className="ml-1 text-xs text-gray-500">({client.company})</span>
                                      )}
                                    </div>
                                  );
                                }
                                return "Client inconnu";
                              })()}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-28 text-sm text-gray-500">Assigné à:</div>
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {(() => {
                                if (selectedTicket.assignedToId) {
                                  const assignee = getUser(selectedTicket.assignedToId);
                                  if (assignee) {
                                    return (
                                      <div className="flex items-center">
                                        <div 
                                          className="w-5 h-5 rounded-full bg-[#1B0353] flex items-center justify-center text-white text-xs font-semibold mr-2"
                                        >
                                          {getInitials(assignee.firstName, assignee.lastName)}
                                        </div>
                                        <span>{assignee.firstName} {assignee.lastName}</span>
                                        {assignee.role && (
                                          <span className="ml-1 text-xs text-gray-500">({assignee.role})</span>
                                        )}
                                      </div>
                                    );
                                  }
                                  return "Agent inconnu";
                                }
                                return (
                                  <span className="text-gray-500 italic">Non assigné</span>
                                );
                              })()}
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-28 text-sm text-gray-500">Catégorie:</div>
                            <div className="text-sm font-medium text-gray-900">{selectedTicket.category}</div>
                          </div>
                          {selectedTicket.dueDate && (
                            <div className="flex items-start">
                              <div className="w-28 text-sm text-gray-500">Échéance:</div>
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                <FiCalendar className="w-4 h-4 mr-1 text-gray-400" />
                                {formatDateTime(selectedTicket.dueDate)}
                              </div>
                            </div>
                          )}
                          {selectedTicket.scheduledTime && (
                            <div className="flex items-start">
                              <div className="w-28 text-sm text-gray-500">Programmé:</div>
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                <FiClock className="w-4 h-4 mr-1 text-gray-400" />
                                {formatDateTime(selectedTicket.scheduledTime)}
                              </div>
                            </div>
                          )}
                          {selectedTicket.tags.length > 0 && (
                            <div className="flex items-start">
                              <div className="w-28 text-sm text-gray-500">Tags:</div>
                              <div className="flex flex-wrap flex-1">
                                {selectedTicket.tags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="m-0.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors duration-200"
                                  >
                                    <FiTag className="w-3 h-3 mr-1" />
                                    {tag}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveTag(tag);
                                      }}
                                      className="ml-1 text-gray-400 hover:text-gray-600"
                                    >
                                      <FiX className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                                <div className="relative m-0.5">
                                  <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddTag();
                                      }
                                    }}
                                    placeholder="+ Ajouter"
                                    className="px-2.5 py-0.5 bg-white border border-gray-200 text-xs rounded-full focus:outline-none focus:ring-1 focus:ring-[#004AC8] w-24 transition-all duration-200"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-1/4 pl-4">
                        {selectedTicket.sla && (
                          <div className={`px-4 py-3 rounded-lg text-sm ${
                            selectedTicket.sla.isBreached ? 'bg-red-100 text-red-800' :
                            calculateSLAStatus(selectedTicket).status === "warning" ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          } shadow-sm`}>
                            <div className="font-medium flex items-center">
                              <FiClock className="w-4 h-4 mr-1" />
                              SLA
                            </div>
                            <div className="text-xs mt-2">
                              {selectedTicket.status === "new" ? (
                                <>
                                  <div>Réponse sous {selectedTicket.sla.responseTime} min</div>
                                  {calculateSLAStatus(selectedTicket).timeLeft && (
                                    <div className="mt-1 font-medium">
                                      {calculateSLAStatus(selectedTicket).status === "breached" ? (
                                        <span className="flex items-center">
                                          <FiAlertCircle className="w-3 h-3 mr-1" />
                                          SLA dépassé
                                        </span>
                                      ) : (
                                        <span className="flex items-center">
                                          <FiClock className="w-3 h-3 mr-1" />
                                          Temps restant: {calculateSLAStatus(selectedTicket).timeLeft}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div>Résolution sous {Math.round(selectedTicket.sla.resolutionTime / 60)} h</div>
                                  {calculateSLAStatus(selectedTicket).timeLeft && (
                                    <div className="mt-1 font-medium">
                                      {calculateSLAStatus(selectedTicket).status === "breached" ? (
                                        <span className="flex items-center">
                                          <FiAlertCircle className="w-3 h-3 mr-1" />
                                          SLA dépassé
                                        </span>
                                      ) : (
                                        <span className="flex items-center">
                                          <FiClock className="w-3 h-3 mr-1" />
                                          Temps restant: {calculateSLAStatus(selectedTicket).timeLeft}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <FiMessageCircle className="w-4 h-4 mr-1 text-[#004AC8]" />
                        Description
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-gray-100">
                        {selectedTicket.description || "Aucune description fournie."}
                      </div>
                    </div>
                    
                    {/* Comments Section */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                          <FiMessageCircle className="w-4 h-4 mr-1 text-[#004AC8]" />
                          Commentaires ({selectedTicket.comments.length})
                        </h3>
                        <button className="text-xs text-[#004AC8] font-medium hover:underline transition-all duration-200">
                          Voir l&apos;historique complet
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedTicket.comments.map((comment) => {
                          const author = getUser(comment.authorId);
                          return (
                            <motion.div 
                              key={comment.id} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`p-4 rounded-lg shadow-sm ${comment.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-white border border-gray-100'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div 
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2 ${
                                        author?.type === "client" ? 'bg-[#4BB2F6]' : 'bg-[#1B0353]'
                                    }`}
                                  >
                                    {author ? getInitials(author.firstName, author.lastName) : '?'}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {author ? `${author.firstName} ${author.lastName}` : 'Utilisateur inconnu'}
                                    </span>
                                    {author?.role && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        ({author.role})
                                      </span>
                                    )}
                                    {comment.isInternal && (
                                      <span className="ml-2 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">
                                        Note interne
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTimeAgo(comment.timestamp)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comment.content}
                              </div>
                              
                              {comment.attachments && comment.attachments.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-gray-200">
                                  {comment.attachments.map((attachment) => (
                                    <div 
                                      key={attachment.id}
                                      className="flex items-center p-2 bg-white rounded-lg border border-gray-200 mt-1 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                      <div className="p-2 bg-gray-100 rounded mr-2">
                                        {attachment.type === 'image' ? (
                                          <FiImage className="w-4 h-4 text-gray-600" />
                                        ) : attachment.type === 'audio' ? (
                                          <FiMessageCircle className="w-4 h-4 text-gray-600" />
                                        ) : attachment.type === 'video' ? (
                                          <FiVideo className="w-4 h-4 text-gray-600" />
                                        ) : (
                                          <FiFile className="w-4 h-4 text-gray-600" />
                                        )}
                                      </div>
                                      <div className="flex-1 truncate">
                                        <div className="text-xs font-medium text-gray-900 truncate">
                                          {attachment.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {attachment.size}
                                        </div>
                                      </div>
                                      <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-200">
                                        <FiArrowDown className="w-4 h-4 text-gray-500" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                        
                        {/* Comment input */}
                        <div className="mt-4">
                          <div className="flex items-center mb-2">
                            <div className="flex-1">
                              <label htmlFor="comment" className="text-sm font-medium text-gray-900">
                                Ajouter un commentaire
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="internalComment" 
                                checked={isInternalComment}
                                onChange={(e) => setIsInternalComment(e.target.checked)}
                                className="w-4 h-4 text-[#004AC8] rounded border-gray-300 focus:ring-[#004AC8]"
                              />
                              <label htmlFor="internalComment" className="ml-2 text-xs text-gray-600">
                                Note interne uniquement
                              </label>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <textarea
                              id="comment"
                              rows={3}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Écrivez votre commentaire ici..."
                              className={`w-full p-3 bg-white border ${isInternalComment ? 'border-yellow-300' : 'border-gray-200'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200`}
                            />
                            
                            <div className="absolute bottom-2 right-2 flex space-x-2">
                              <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
                                <FiPaperclip className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className={`p-1.5 rounded-full transition-all duration-200 ${
                                  newComment.trim() ? 'text-[#004AC8] hover:bg-[#004AC8] hover:bg-opacity-10' : 'text-gray-300 cursor-not-allowed'
                                }`}
                              >
                                <FiSend className="w-4 h-4" />
                              </button>
                            </div>
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
      
      {/* Create Ticket Modal */}
      <AnimatePresence>
        {showCreateTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Créer un nouveau ticket</h2>
                  <button
                    onClick={() => setShowCreateTicketModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ticket-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du ticket *
                    </label>
                    <input
                      type="text"
                      id="ticket-title"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                      placeholder="Saisissez un titre clair et concis"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="ticket-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="ticket-description"
                      rows={4}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                      placeholder="Décrivez le problème ou la demande en détail"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ticket-client" className="block text-sm font-medium text-gray-700 mb-1">
                        Client *
                      </label>
                      <select
                        id="ticket-client"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.clientId}
                        onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                        required
                      >
                        <option value="" disabled>Sélectionnez un client</option>
                        {users.filter(u => u.type === "client").map(client => (
                          <option key={client.id} value={client.id}>
                            {client.firstName} {client.lastName} - {client.company || "N/A"}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="ticket-category" className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie *
                      </label>
                      <select
                        id="ticket-category"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        required
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ticket-priority" className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité *
                      </label>
                      <select
                        id="ticket-priority"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ 
                          ...newTicket, 
                          priority: e.target.value as "low" | "medium" | "high" | "urgent" 
                        })}
                        required
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="ticket-assignee" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigné à (optionnel)
                      </label>
                      <select
                        id="ticket-assignee"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.assignedToId || ""}
                        onChange={(e) => setNewTicket({ ...newTicket, assignedToId: e.target.value || undefined })}
                      >
                        <option value="">Non assigné</option>
                        {users.filter(u => u.type === "staff" || u.type === "admin").map(staff => (
                          <option key={staff.id} value={staff.id}>
                            {staff.firstName} {staff.lastName} - {staff.role || "N/A"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ticket-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date d&apos;échéance (optionnel)
                      </label>
                      <input
                        type="date"
                        id="ticket-due-date"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.dueDate ? new Date(newTicket.dueDate).toISOString().slice(0, 10) : ""}
                        onChange={(e) => setNewTicket({ 
                          ...newTicket, 
                          dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                        })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ticket-scheduled-time" className="block text-sm font-medium text-gray-700 mb-1">
                        Heure prévue (optionnel)
                      </label>
                      <input
                        type="time"
                        id="ticket-scheduled-time"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004AC8] focus:border-transparent transition-all duration-200"
                        value={newTicket.scheduledTime ? new Date(newTicket.scheduledTime).toTimeString().slice(0, 5) : ""}
                        onChange={(e) => {
                          if (e.target.value && newTicket.dueDate) {
                            const [hours, minutes] = e.target.value.split(':');
                            const dateTime = new Date(newTicket.dueDate);
                            dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                            setNewTicket({
                              ...newTicket,
                              scheduledTime: dateTime.toISOString()
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (optionnel)
                    </label>
                    <div className="flex flex-wrap p-2 bg-gray-50 border border-gray-200 rounded-lg">
                      {newTicket.tags?.map((tag) => (
                        <span 
                          key={tag} 
                          className="m-0.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center hover:bg-gray-200 transition-colors duration-200"
                        >
                          <FiTag className="w-3 h-3 mr-1" />
                          {tag}
                          <button 
                            onClick={() => {
                              setNewTicket({
                                ...newTicket,
                                tags: newTicket.tags?.filter(t => t !== tag)
                              });
                            }}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            setNewTicket({
                              ...newTicket,
                              tags: [...(newTicket.tags || []), newTag.trim()]
                            });
                            setNewTag("");
                          }
                        }}
                        placeholder="Ajouter un tag..."
                        className="flex-1 min-w-[100px] p-0.5 m-0.5 bg-transparent border-none text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Annuler
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title || !newTicket.description || !newTicket.clientId}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    !newTicket.title || !newTicket.description || !newTicket.clientId
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#1B0353] to-[#004AC8] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  Créer le ticket
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Assign Ticket Modal */}
      <AnimatePresence>
        {showAssignModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Assigner le ticket</h2>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Sélectionnez un membre de l&apos;équipe pour assigner le ticket #{selectedTicket.ticketNumber}
                  </p>
                  <h3 className="text-base font-medium text-gray-900">{selectedTicket.title}</h3>
                </div>
                
                <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar">
                  <div
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center transition-colors duration-200"
                    onClick={() => handleAssignTicket("")}
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">Non assigné</h4>
                      <p className="text-xs text-gray-500">Retirer l&apos;assignation actuelle</p>
                    </div>
                  </div>
                  
                  {users.filter(u => u.type === "staff" || u.type === "admin").map(user => (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center transition-all duration-200 ${
                        selectedTicket.assignedToId === user.id 
                          ? 'border-2 border-[#004AC8] bg-[#004AC8] bg-opacity-5 shadow-sm' 
                          : 'border border-gray-200'
                      }`}
                      onClick={() => handleAssignTicket(user.id)}
                    >
                      <div 
                        className="w-9 h-9 rounded-full bg-[#1B0353] flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</h4>
                        <p className="text-xs text-gray-500">{user.role} • {user.department}</p>
                      </div>
                      {selectedTicket.assignedToId === user.id && (
                        <div className="ml-auto">
                          <div className="w-6 h-6 rounded-full bg-[#004AC8] flex items-center justify-center text-white">
                            <FiCheck className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Annuler
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 74, 200, 0.2);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 74, 200, 0.4);
        }
        
        .shadow-blue {
          box-shadow: 0 4px 14px 0 rgba(0, 74, 200, 0.1);
        }
        
        @keyframes pulse-blue {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 74, 200, 0.4);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(0, 74, 200, 0.2);
          }
        }
        
        .pulse-blue {
          animation: pulse-blue 2s infinite;
        }
      `}</style>
    </div>
  );
}