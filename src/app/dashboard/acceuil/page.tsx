'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaEuroSign } from 'react-icons/fa6';
import {
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FiUsers,
  FiPhoneCall,
  FiTarget,
  FiCalendar,

  FiRefreshCw,
  FiSettings,
  FiDownload,
  FiChevronRight,
  FiBell,
  FiMessageSquare,
  FiUserPlus,
  FiClipboard,
  FiClock,
  FiFileText,
  FiPlusCircle,
  FiCheck,
  FiAlertCircle,
  FiActivity,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPlus,
  FiFilter,
  FiCheckCircle,
  FiHeadphones,
  FiServer,
  FiHelpCircle,
  FiTrendingUp,
  FiCpu,
  FiWifi,
  FiEye,
  FiHome,
  FiArrowRight,
  FiGrid,
  FiList,
  FiMoon,
  FiSun,
  FiMaximize2,
  FiMinimize2,
  FiTriangle,
  FiMoreHorizontal,
  FiMapPin,
  FiCheckSquare,
  FiEdit,
  FiPhone,
  FiPlay,
  FiRotateCcw,
  FiUser,
  FiMinimize,
  FiX,
  FiSend,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for our data
interface ProspectDataItem {
  name: string;
  prospects: number;
  leads: number;
  clients: number;
}

interface CallDataItem {
  date: string;
  heure: string;
  appels: number;
  duree: number;
  taux: number;
  entrants: number;
  sortants: number;
  internes: number;
  manques: number;
}

interface TicketData {
  id: string;
  client: string;
  subject: string;
  status: string;
  priority: string;
  created: string;
  updated: string;
  agent: string;
  sla: string;
  progress: number;
}

interface TaskData {
  id: string;
  title: string;
  due: string;
  assignee: string;
  status: string;
  priority: string;
  type: string;
  notes: string;
}

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
  isOnline: boolean;
}

interface KalicomChatMessage {
  id: number;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
}

interface ActivityData {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: string;
  duration?: string;
}

interface NotificationData {
  id: number;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
}

// Sample data imports from both dashboards
const prospectData: ProspectDataItem[] = [
  { name: 'Jan', prospects: 30, leads: 20, clients: 10 },
  { name: 'Feb', prospects: 45, leads: 28, clients: 15 },
  { name: 'Mar', prospects: 60, leads: 35, clients: 22 },
  { name: 'Apr', prospects: 80, leads: 42, clients: 30 },
  { name: 'May', prospects: 75, leads: 50, clients: 35 },
  { name: 'Jun', prospects: 90, leads: 60, clients: 45 },
];

const callData: CallDataItem[] = [
  { 
    date: '2025-02-20', 
    heure: '08:00', 
    appels: 45, 
    duree: 4.2, 
    taux: 92,
    entrants: 22,
    sortants: 15,
    internes: 5,
    manques: 3
  },
  { 
    date: '2025-02-20', 
    heure: '10:00', 
    appels: 78, 
    duree: 3.8, 
    taux: 89,
    entrants: 35,
    sortants: 28,
    internes: 10,
    manques: 5
  },
  { 
    date: '2025-02-20', 
    heure: '12:00', 
    appels: 62, 
    duree: 4.5, 
    taux: 91,
    entrants: 28,
    sortants: 24,
    internes: 7,
    manques: 3
  },
  { 
    date: '2025-02-20', 
    heure: '14:00', 
    appels: 85, 
    duree: 3.9, 
    taux: 94,
    entrants: 40,
    sortants: 32,
    internes: 9,
    manques: 4
  },
  { 
    date: '2025-02-20', 
    heure: '16:00', 
    appels: 93, 
    duree: 4.8, 
    taux: 90,
    entrants: 45,
    sortants: 35,
    internes: 8,
    manques: 5
  },
  { 
    date: '2025-02-20', 
    heure: '18:00', 
    appels: 55, 
    duree: 4.1, 
    taux: 88,
    entrants: 25,
    sortants: 20,
    internes: 6,
    manques: 4
  },
];

// New data for SAV tickets, tasks and chat
const ticketData: TicketData[] = [
  { id: 'TK-4872', client: 'Acme Corp', subject: 'Problème de configuration PBX', status: 'En cours', priority: 'Haute', created: '2025-03-21', updated: '2025-03-22', agent: 'Marc Dubois', sla: '4h', progress: 65 },
  { id: 'TK-4871', client: 'Nexus Technologies', subject: 'Intégration CRM échouée', status: 'Nouveau', priority: 'Critique', created: '2025-03-22', updated: '2025-03-22', agent: 'Non assigné', sla: '2h', progress: 10 },
  { id: 'TK-4870', client: 'Zenith Industries', subject: 'Mise à jour logicielle', status: 'En attente', priority: 'Moyenne', created: '2025-03-20', updated: '2025-03-21', agent: 'Sophie Martin', sla: '8h', progress: 40 },
  { id: 'TK-4869', client: 'Global Systems', subject: 'Formation utilisateur requise', status: 'Planifié', priority: 'Basse', created: '2025-03-19', updated: '2025-03-21', agent: 'Julien Petit', sla: '24h', progress: 30 },
  { id: 'TK-4868', client: 'Stellar Communications', subject: 'Problème de qualité d\'appel', status: 'Résolu', priority: 'Haute', created: '2025-03-18', updated: '2025-03-20', agent: 'Emma Blanc', sla: '4h', progress: 100 },
];

const taskData: TaskData[] = [
  { id: 'T-1035', title: 'Appel de suivi client Acme Corp', due: '2025-03-23 14:30', assignee: 'Léa Martin', status: 'À faire', priority: 'Haute', type: 'Appel', notes: 'Discuter des nouveaux besoins en téléphonie' },
  { id: 'T-1034', title: 'Préparation démo produit', due: '2025-03-23 16:00', assignee: 'Marc Dubois', status: 'En cours', priority: 'Haute', type: 'Réunion', notes: 'Présentation solution CRM/PBX intégrée' },
  { id: 'T-1033', title: 'Mise à jour documentation API', due: '2025-03-24 12:00', assignee: 'Julie Robert', status: 'À faire', priority: 'Moyenne', type: 'Document', notes: 'Ajouter les nouvelles fonctionnalités' },
  { id: 'T-1032', title: 'Vérification rapport mensuel', due: '2025-03-25 09:00', assignee: 'Thomas Bernard', status: 'À faire', priority: 'Basse', type: 'Admin', notes: 'Valider les chiffres avant envoi à la direction' },
  { id: 'T-1031', title: 'Configuration serveur test', due: '2025-03-23 11:00', assignee: 'Sophie Leroy', status: 'Terminée', priority: 'Critique', type: 'Technique', notes: 'Environnement de test pour la version 2.5' },
];

const chatMessages: ChatMessage[] = [
  { id: 1, user: 'Emma Blanc', avatar: '/api/placeholder/30/30', message: 'Bonjour, pouvez-vous vérifier le statut du ticket TK-4868?', time: '09:32', unread: false, isOnline: true },
  { id: 2, user: 'Marc Dubois', avatar: '/api/placeholder/30/30', message: 'La démo pour Nexus Tech est confirmée pour 15h', time: '09:47', unread: true, isOnline: true },
  { id: 3, user: 'Sophie Martin', avatar: '/api/placeholder/30/30', message: 'J\'ai besoin d\'aide sur le déploiement chez Zenith', time: '10:15', unread: true, isOnline: false },
  { id: 4, user: 'Thomas Bernard', avatar: '/api/placeholder/30/30', message: 'Rapport mensuel terminé, en attente de validation', time: '10:28', unread: false, isOnline: false },
  { id: 5, user: 'Support Kalicom', avatar: '/api/placeholder/30/30', message: 'Bonjour, comment puis-je vous aider aujourd\'hui ?', time: '10:42', unread: true, isOnline: true },
];

// Sample Kalicom chat messages for the widget
const kalicomChatMessages: KalicomChatMessage[] = [
  { id: 1, sender: 'support', message: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?', timestamp: '10:30' },
  { id: 2, sender: 'user', message: 'Bonjour, j\'ai un problème avec la configuration de mon PBX.', timestamp: '10:31' },
  { id: 3, sender: 'support', message: 'Je comprends. Pouvez-vous me donner plus de détails sur le problème que vous rencontrez ?', timestamp: '10:32' },
  { id: 4, sender: 'user', message: 'Les appels ne sont pas correctement transférés entre les services.', timestamp: '10:33' },
];

// Activities timeline for global feed
const activitiesData: ActivityData[] = [
  { id: 1, user: 'Marc Dubois', action: 'a résolu le ticket', target: 'TK-4868', time: '10:42', type: 'ticket' },
  { id: 2, user: 'Emma Blanc', action: 'a ajouté un nouveau prospect', target: 'Gamma Solutions', time: '10:15', type: 'prospect' },
  { id: 3, user: 'Léa Martin', action: 'a terminé l\'appel avec', target: 'Acme Corp', time: '09:50', type: 'call', duration: '12:35' },
  { id: 4, user: 'Sophie Leroy', action: 'a créé une nouvelle tâche', target: 'Déploiement Zenith', time: '09:30', type: 'task' },
];

// Notification data
const notificationsData: NotificationData[] = [
  { id: 1, title: 'Ticket critique non assigné', content: 'TK-4871 - Nexus Technologies attend une réponse', time: '15 min', read: false, type: 'critical' },
  { id: 2, title: 'Rappel de réunion', content: 'Démo produit à 15h00', time: '30 min', read: false, type: 'reminder' },
  { id: 3, title: 'Nouvel utilisateur', content: 'Julien Petit a rejoint l\'équipe', time: '2h', read: true, type: 'info' },
  { id: 4, title: 'Mise à jour système', content: 'Version 2.5 déployée avec succès', time: '5h', read: true, type: 'success' },
];

// Weather data for the location widget
const weatherData: WeatherData = {
  location: 'Paris',
  temperature: 18,
  condition: 'Partiellement nuageux',
  high: 21,
  low: 12
};

// Define interfaces for component props
interface QuickActionCardProps {
  icon: ReactNode;
  title: string;
  color: string;
  description?: string;
  onClick?: () => void;
  pulse?: boolean;
  href: string;
}

// Enhanced Quick Action Card with fancy animations
const QuickActionCard = ({ icon, title, color, description, onClick, pulse = false, href }: QuickActionCardProps) => {
  const router = useRouter();
  const controls = useAnimation();

  const pulseAnimation = async () => {
    if (pulse) {
      while (true) {
        await controls.start({
          boxShadow: `0 0 0 2px ${color}25, 0 8px 16px -2px ${color}20`,
          scale: 1.02,
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        await controls.start({
          boxShadow: `0 0 0 0px ${color}10, 0 4px 8px -2px ${color}10`,
          scale: 1,
          transition: { duration: 1.5, ease: "easeInOut" }
        });
      }
    }
  };

  useEffect(() => {
    if (pulse) {
      pulseAnimation();
    }
  }, [pulse]);

  // Add a new handler that combines the original onClick with navigation
  const handleClick = () => {
    // Execute the original onClick if provided
    if (onClick) onClick();
    
    // Navigate to the href
    router.push(href);
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        boxShadow: `0 20px 30px -10px ${color}20`,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick} // Use the new handler instead of just onClick
      animate={controls}
      className="bg-white p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl"
      style={{ 
        boxShadow: `0 5px 15px -3px ${color}10`,
        border: `1px solid ${color}15`,
      }}
    >
      <div className="relative mb-3">
        <div className={`p-3.5 rounded-xl w-14 h-14 flex items-center justify-center mb-3 bg-gradient-to-br`} style={{ 
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
        }}>
          <div className="text-xl" style={{ color }}>{icon}</div>
        </div>
        {pulse && (
          <span 
            className="absolute top-0 right-0 w-3 h-3 rounded-full animate-ping" 
            style={{ background: color, animationDuration: '3s' }}
          ></span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </motion.div>
  );
};

// Interface for CircleStat component
interface CircleStatProps {
  icon: ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
  label?: string;
  value?: string | number;
}

// Enhanced Circle Stat component with more sophisticated animations
const CircleStat = ({ icon, color, size = 'md', pulse = false, onClick, label, value }: CircleStatProps) => {
  // CircleStat implementation...
  const sizeClasses = {
    sm: { container: 'w-12 h-12', icon: 'w-5 h-5', label: 'text-xs' },
    md: { container: 'w-16 h-16', icon: 'w-6 h-6', label: 'text-sm' },
    lg: { container: 'w-20 h-20', icon: 'w-8 h-8', label: 'text-base' },
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative ${sizeClasses[size].container} rounded-full flex items-center justify-center ${
          onClick ? 'cursor-pointer' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, ${color}25 0%, ${color}05 100%)`,
          boxShadow: `0 10px 15px -3px ${color}15, 0 4px 6px -2px ${color}10, 0 0 0 1px ${color}20 inset`,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Blurred background circles for depth */}
        <div className="absolute w-full h-full rounded-full opacity-40 blur-xl" style={{ 
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          top: '10%',
          left: '10%',
        }}></div>
        
        <div className={`${sizeClasses[size].icon} flex items-center justify-center relative z-10`} style={{ color }}>
          {icon}
        </div>
        
        {/* Gloss effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[100%] opacity-10 bg-gradient-to-br from-white to-transparent"></div>
        </div>
        
        {/* Subtle border */}
        <div className="absolute inset-0 rounded-full border border-white/20"></div>
        
        {pulse && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-30 duration-1000"
              style={{ backgroundColor: color, animationDuration: '3s' }}
            ></span>
            <span
              className="absolute inset-0 rounded-full animate-pulse opacity-20 duration-700"
              style={{ 
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, 
                animationDuration: '2s' 
              }}
            ></span>
          </>
        )}
      </motion.div>
      
      {label && value !== undefined && (
        <div className="mt-2 text-center">
          <div className={`font-medium text-gray-800 ${sizeClasses[size].label}`}>{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      )}
    </div>
  );
};

// Interface for SystemHealthIndicator component
interface SystemHealthIndicatorProps {
  label: string;
  value: number | string;
  color: string;
  icon: ReactNode;
  suffix?: string;
  showProgress?: boolean;
  progress?: number;
}

// System Health Indicator with enhanced visuals
const SystemHealthIndicator = ({ label, value, color, icon, suffix = '', showProgress = false, progress = 0 }: SystemHealthIndicatorProps) => (
  <motion.div 
    className="flex items-center bg-white/15 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300"
    whileHover={{ y: -3, x: 2, boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.1)' }}
  >
    <div className="relative">
      <div className="p-3 rounded-full shadow-lg" style={{ 
        backgroundColor: `${color}40`,
        boxShadow: `0 0 20px 0 ${color}30`
      }}>
        {icon}
      </div>
      
      {showProgress && (
        <svg className="absolute -inset-1.5 rotate-[-90deg]" width="calc(100% + 12px)" height="calc(100% + 12px)" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`${color}30`}
            strokeWidth="5"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${progress * 2.827} 282.7`}
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
    <div className="ml-4">
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="flex items-baseline">
        <span className="text-lg font-bold">{value}</span>
        <span className="text-sm opacity-80 ml-0.5">{suffix}</span>
      </div>
    </div>
  </motion.div>
);

// Interface for StatusBadge component
interface StatusBadgeProps {
  status: string;
}

// New component: Status Badge with enhanced visuals
const StatusBadge = ({ status }: StatusBadgeProps) => {
  let color, bgColor, icon, borderColor;
  
  switch(status.toLowerCase()) {
    case 'nouveau':
    case 'à faire':
      color = 'text-blue-700';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
      icon = <FiAlertCircle className="w-3 h-3" />;
      break;
    case 'en cours':
      color = 'text-amber-700';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      icon = <FiActivity className="w-3 h-3" />;
      break;
    case 'en attente':
    case 'planifié':
      color = 'text-purple-700';
      bgColor = 'bg-purple-50';
      borderColor = 'border-purple-200';
      icon = <FiClock className="w-3 h-3" />;
      break;
    case 'résolu':
    case 'terminée':
      color = 'text-green-700';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      icon = <FiCheckCircle className="w-3 h-3" />;
      break;
    default:
      color = 'text-gray-700';
      bgColor = 'bg-gray-50';
      borderColor = 'border-gray-200';
      icon = <FiHelpCircle className="w-3 h-3" />;
  }
  
  return (
    <motion.span 
      whileHover={{ y: -1, x: 0 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${color} ${bgColor} border ${borderColor}`}
    >
      {icon} {status}
    </motion.span>
  );
};

// Interface for PriorityBadge component
interface PriorityBadgeProps {
  priority: string;
}

// Priority Badge with enhanced visuals
const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  let color, bgColor, borderColor, icon;
  
  switch(priority.toLowerCase()) {
    case 'critique':
      color = 'text-red-700';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
      icon = <FiTriangle className="w-3 h-3" />;
      break;
    case 'haute':
      color = 'text-orange-700';
      bgColor = 'bg-orange-50';
      borderColor = 'border-orange-200';
      icon = <FiArrowUpRight className="w-3 h-3" />;
      break;
    case 'moyenne':
      color = 'text-amber-700';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
      icon = <FiActivity className="w-3 h-3" />;
      break;
    case 'basse':
      color = 'text-green-700';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
      icon = <FiArrowDownRight className="w-3 h-3" />;
      break;
    default:
      color = 'text-gray-700';
      bgColor = 'bg-gray-50';
      borderColor = 'border-gray-200';
      icon = <FiHelpCircle className="w-3 h-3" />;
  }
  
  return (
    <motion.span 
      whileHover={{ y: -1, x: 0 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${color} ${bgColor} border ${borderColor}`}
    >
      {icon} {priority}
    </motion.span>
  );
};

// Interface for MessagePreview component
interface MessagePreviewProps {
  message: ChatMessage;
  onClick: () => void;
}

// Enhanced Message Preview with animations and status indicators
const MessagePreview = ({ message, onClick }: MessagePreviewProps) => {
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

// Interface for ActivityItem component
interface ActivityItemProps {
  activity: ActivityData;
}

// New component: Activity Item for feed
const ActivityItem = ({ activity }: ActivityItemProps) => {
  let color, bgColor, icon;
  
  switch(activity.type) {
    case 'ticket':
      color = 'text-purple-600';
      bgColor = 'bg-purple-100';
      icon = <FiHeadphones className="w-3.5 h-3.5" />;
      break;
    case 'prospect':
      color = 'text-indigo-600';
      bgColor = 'bg-indigo-100';
      icon = <FiUserPlus className="w-3.5 h-3.5" />;
      break;
    case 'call':
      color = 'text-blue-600';
      bgColor = 'bg-blue-100';
      icon = <FiPhoneCall className="w-3.5 h-3.5" />;
      break;
    case 'task':
      color = 'text-amber-600';
      bgColor = 'bg-amber-100';
      icon = <FiClipboard className="w-3.5 h-3.5" />;
      break;
    default:
      color = 'text-gray-600';
      bgColor = 'bg-gray-100';
      icon = <FiActivity className="w-3.5 h-3.5" />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <div className={`p-2 ${bgColor} rounded-full flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-1 mb-0.5">
          <span className="font-medium text-sm text-gray-900">{activity.user}</span>
          <span className="text-xs text-gray-500">{activity.action}</span>
          <span className="font-medium text-sm text-gray-900">{activity.target}</span>
          {activity.duration && (
            <span className="text-xs text-gray-500 ml-1 flex items-center gap-1">
              <FiClock className="w-3 h-3" /> {activity.duration}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FiClock className="w-3 h-3" />
          <span>il y a {activity.time}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Interface for NotificationItem component
interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: number) => void;
}

// New component: Notification Item
const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  let color, bgColor, icon;
  
  switch(notification.type) {
    case 'critical':
      color = 'text-red-600';
      bgColor = 'bg-red-100';
      icon = <FiAlertCircle className="w-4 h-4" />;
      break;
    case 'reminder':
      color = 'text-amber-600';
      bgColor = 'bg-amber-100';
      icon = <FiClock className="w-4 h-4" />;
      break;
    case 'success':
      color = 'text-green-600';
      bgColor = 'bg-green-100';
      icon = <FiCheckCircle className="w-4 h-4" />;
      break;
    case 'info':
    default:
      color = 'text-blue-600';
      bgColor = 'bg-blue-100';
      icon = <FiInfo className="w-4 h-4" />;
      break;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 border-b border-gray-100 flex items-start gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
    >
      <div className={`p-2 ${bgColor} rounded-full flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-sm text-gray-800">{notification.title}</h4>
          {!notification.read && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 bg-blue-100 text-blue-600 rounded-full"
            >
              <FiCheck className="w-3 h-3" />
            </motion.button>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-1">{notification.content}</p>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <FiClock className="w-3 h-3" /> Il y a {notification.time}
        </div>
      </div>
    </motion.div>
  );
};

// Interface for AnimatedCard component
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

// New component: Card with fancy animations
const AnimatedCard = ({ children, className = "", delay = 0, ...props }: AnimatedCardProps) => {
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

// Interface for AnimatedValue component
interface AnimatedValueProps {
  value: string | number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

// New component: Animated Stat Value with counter
const AnimatedValue = ({ value, suffix = '', prefix = '', duration = 2 }: AnimatedValueProps) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const start = 0;
    const end = parseInt(value.toString());
    const stepTime = Math.abs(Math.floor(duration * 1000 / end));
    
    if (counterRef.current) {
      let current = start;
      const timer = setInterval(() => {
        current += 1;
        if (counterRef.current) {
          counterRef.current.innerText = `${prefix}${current}${suffix}`;
        }
        if (current >= end) {
          clearInterval(timer);
          if (counterRef.current) {
            counterRef.current.innerText = `${prefix}${value}${suffix}`;
          }
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [value, duration, prefix, suffix]);
  
  return <span ref={counterRef}>{prefix}{0}{suffix}</span>;
};

// New component: FiInfo icon (not in the imported list)
interface FiInfoProps {
  className?: string;
}

const FiInfo = ({ className = "" }: FiInfoProps) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// Interface for WeatherWidget component
// interface WeatherWidgetProps {
//   data: WeatherData;
// }

// Weather component
// const WeatherWidget = ({ data }: WeatherWidgetProps) => (
//   <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
//     <div className="flex items-center gap-3">
//       <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600">
//         <FiSun className="w-5 h-5" />
//       </div>
//       <div>
//         <div className="font-medium text-gray-800">{data.location}</div>
//         <div className="text-xs text-gray-500">{data.condition}</div>
//       </div>
//     </div>
//     <div className="text-right">
//       <div className="text-2xl font-bold text-gray-800">{data.temperature}°C</div>
//       <div className="text-xs text-gray-500">
//         {data.high}° / {data.low}°
//       </div>
//     </div>
//   </div>
// );

// Kalicom Support Status Component
// const KalicomSupportStatus = () => {
//   const [isOnline, setIsOnline] = useState(false);
  
//   useEffect(() => {
//     // Check if current time is between 9 AM and 8 PM
//     const checkBusinessHours = () => {
//       const now = new Date();
//       const hours = now.getHours();
//       setIsOnline(hours >= 9 && hours < 20);
//     };
    
//     // Initial check
//     checkBusinessHours();
    
//     // Update every minute
//     const interval = setInterval(checkBusinessHours, 60000);
    
//     return () => clearInterval(interval);
//   }, []);
  
//   return (
//     <motion.div 
//       whileHover={{ y: -5, x: 0 }}
//       className="flex items-center justify-between p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300"
//     >
//       <div className="flex items-center gap-3">
//         <div className="relative">
//           <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
//             <FiHeadphones className="w-4 h-4" />
//           </div>
//           <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></div>
//         </div>
//         <div>
//           <div className="text-sm font-semibold text-gray-800">Support Technique Kalicom</div>
//           <div className="text-xs text-gray-500 flex items-center gap-1">
//             <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
//             {isOnline ? 'En ligne (9H-20H)' : 'Hors ligne'}
//           </div>
//         </div>
//       </div>
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
//       >
//         Contacter
//       </motion.button>
//     </motion.div>
//   );
// };


// Improved Kalicom Chat Widget Component
const KalicomChatWidget = () => {
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

// Main component
export default function AccueilDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [taskView, setTaskView] = useState('board'); // 'list' or 'board'
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications ] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isSearchActive ] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  
  // Calculate summary statistics
  const totalCalls = callData.reduce((sum, item) => sum + item.appels, 0);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status !== 'Résolu').length;
  // const totalTasks = taskData.length;
  const pendingTasks = taskData.filter(t => t.status !== 'Terminée').length;
  const totalProspects = prospectData.reduce((acc, item) => acc + item.prospects, 0);
  const unreadMessages = chatMessages.filter(m => m.unread).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Refresh handler with improved animation
  // Refresh handler with improved animation
const handleRefresh = () => {
  setIsRefreshing(true);
  
  // Refresh the stats data (update the values)
  // For this example, we'll use random increments
  // const refreshedProspects = totalProspects + Math.floor(Math.random() * 10);
  const refreshedClients = prospectData[prospectData.length-1].clients + Math.floor(Math.random() * 5);
  // const refreshedTickets = Math.max(5, totalTickets + Math.floor(Math.random() * 7) - 3);
  // const refreshedMessages = Math.max(3, chatMessages.length + Math.floor(Math.random() * 5) - 2);
  
  // Update the stats (you would need to modify your state here)
  // This is a simplified example
  const updatedProspectData = [...prospectData];
  updatedProspectData[updatedProspectData.length-1].clients = refreshedClients;
  
  // Update your state variables (adjust these to match your actual state variables)
  // setProspectData(updatedProspectData);
  // Update other stats as needed
  
  // Simulate refresh delay
  setTimeout(() => {
    setIsRefreshing(false);
  }, 1200);
};

  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  // Prioritize tickets for attention
  const priorityTickets = [...ticketData]
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { 'Critique': 0, 'Haute': 1, 'Moyenne': 2, 'Basse': 3 };
      const aValue = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 999;
      const bValue = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 999;
      return aValue - bValue;
    })
    .slice(0, 3);

  // Prioritize tasks due soon
  const urgentTasks = [...taskData]
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 3);

  // Toggle expanded card
  const toggleCardExpand = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  // Create fancy gradient for the header background
  const headerGradient = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-indigo-600/10 via-[#004AC8]/10 to-purple-600/10';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`pt-20 min-h-screen pb-10 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50/50 text-gray-800'
      }`}
    >
        <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6">
            {/* Premium Header with Blur Effects */}
            <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className={`relative overflow-hidden rounded-2xl shadow-xl ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-100'
            }`}
            >
            {/* Background gradient with enhanced effects */}
            <div className={`absolute inset-0 ${headerGradient} pointer-events-none`}></div>
            
            {/* Animated background blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4BB2F6]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
            
            {/* Subtle pattern overlay with animation */}
            <div 
                className="absolute inset-0 opacity-10" 
                style={{ 
                backgroundImage: 'radial-gradient(#4F46E5 0.5px, transparent 0.5px), radial-gradient(#004AC8 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px'
                }}
            ></div>
            
            <div className="relative p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                    <motion.div 
                    className="flex items-center gap-3 mb-2"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    >
                    <motion.div 
                        className={`p-3 rounded-xl shadow-md overflow-hidden ${
                        darkMode ? 'bg-gradient-to-br from-indigo-600/30 to-[#004AC8]/20' : 
                        'bg-gradient-to-br from-indigo-600/20 to-[#004AC8]/20'
                        }`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                        <FiHome className={`w-7 h-7 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </motion.div>
                    <div>
                        <motion.h1 
                        className={`text-3xl font-bold drop-shadow-sm ${
                            darkMode ? 'text-white' : 'text-indigo-900'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        >
                        Bienvenue sur votre Tableau de Bord
                        </motion.h1>
                        <motion.p 
                          className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          >
                          {new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }).charAt(0).toUpperCase() + 
                          new Date().toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }).slice(1)} | Dernière connexion: il y a 2 heures
                        </motion.p>
                    </div>
                    </motion.div>
                    <motion.p 
                    className={`text-sm mt-2 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    >
                    Votre espace unifié pour gérer vos prospects, suivre les performances téléphoniques, 
                    résoudre les tickets support et organiser vos tâches quotidiennes.
                    </motion.p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-sm ${
                        darkMode 
                        ? 'bg-gradient-to-r from-indigo-800/30 to-[#004AC8]/30 border-indigo-700/30' 
                        : 'bg-gradient-to-r from-indigo-500/10 to-[#004AC8]/10 border-indigo-500/20'
                    }`}
                    >
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse"></div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tous les systèmes opérationnels
                    </span>
                    </motion.div>
                    
                    <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDarkMode(!darkMode)}
                        className={`p-3 rounded-xl transition-all shadow-md ${
                        darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 15 }}
                        whileTap={{ scale: 0.95, rotate: 30 }}
                        onClick={handleRefresh}
                        className={`p-3 rounded-xl transition-all shadow-md ${
                        isRefreshing 
                            ? darkMode 
                            ? 'bg-blue-700 text-blue-300 shadow-blue-900/50' 
                            : 'bg-blue-100 text-blue-700 shadow-blue-200'
                            : darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        disabled={isRefreshing}
                    >
                        <FiRefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </motion.button>
                    
                    <div className="relative">

                        
                        <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl z-50 overflow-hidden ${
                                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                            }`}
                            >
                            <div className={`p-3 font-medium flex justify-between items-center border-b ${
                                darkMode ? 'border-gray-700 text-white' : 'border-gray-100 text-gray-800'
                            }`}>
                                <div className="flex items-center gap-2">
                                <FiBell className="w-4 h-4" />
                                <span>Notifications</span>
                                {unreadNotifications > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {unreadNotifications} nouvelles
                                    </span>
                                )}
                                </div>
                                <button className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Tout marquer comme lu
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map(notification => (
                                <NotificationItem 
                                    key={notification.id} 
                                    notification={notification} 
                                    onMarkAsRead={markNotificationAsRead}
                                />
                                ))}
                            </div>
                            <div className={`p-3 text-center ${
                                darkMode ? 'border-t border-gray-700' : 'border-t border-gray-100'
                            }`}>
                                <button className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                Voir toutes les notifications
                                </button>
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/dashboard/reglages'}
                        className={`p-3 rounded-xl transition-all shadow-md ${
                        darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FiSettings className="w-5 h-5" />
                    </motion.button>
                    </div>
                </div>
                </div>
                
                {/* Quick Stats Highlights with enhanced animations */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 mt-8">
                {[
                    { 
                      icon: <FiUsers />, 
                      label: "Prospects", 
                      value: totalProspects, 
                      color: "#4F46E5",
                      bgClass: "from-indigo-100 to-indigo-50",
                      hoverClass: "hover:border-indigo-200",
                      textClass: "group-hover:text-indigo-600"
                    },
                    { 
                      icon: <FiUserPlus />, 
                      label: "Clients", 
                      value: prospectData[prospectData.length-1].clients, 
                      color: "#10B981",
                      bgClass: "from-green-100 to-green-50",
                      hoverClass: "hover:border-green-200",
                      textClass: "group-hover:text-green-600"
                    },
                    { 
                      icon: <FiTarget />, 
                      label: "Conversion", 
                      value: "32%", 
                      color: "#8B5CF6",
                      bgClass: "from-purple-100 to-purple-50",
                      hoverClass: "hover:border-purple-200",
                      textClass: "group-hover:text-purple-600"
                    },
                    { 
                      icon: <FiHeadphones />, 
                      label: "Tickets", 
                      value: totalTickets, 
                      color: "#F59E0B",
                      bgClass: "from-amber-100 to-amber-50",
                      hoverClass: "hover:border-amber-200",
                      textClass: "group-hover:text-amber-600",
                      badge: openTickets > 0 ? openTickets : null,
                      badgeColor: "#F59E0B"
                    },
                    { 
                      icon: <FiCalendar />, 
                      label: "Événement", 
                      value: "5", 
                      color: "#6366F1",
                      bgClass: "from-indigo-100 to-indigo-50",
                      hoverClass: "hover:border-indigo-200",
                      textClass: "group-hover:text-indigo-600"
                    },
                    { 
                      icon: <FiMessageSquare />, 
                      label: "Messages", 
                      value: chatMessages.length, 
                      color: "#EF4444",
                      bgClass: "from-rose-100 to-rose-50",
                      hoverClass: "hover:border-rose-200",
                      textClass: "group-hover:text-rose-600",
                      badge: unreadMessages > 0 ? unreadMessages : null,
                      badgeColor: "#EF4444"
                    },
                    { 
                      icon: <FaEuroSign />, 
                      label: "CA mensuel", 
                      value: "45K€", 
                      color: "#0EA5E9",
                      bgClass: "from-blue-100 to-blue-50",
                      hoverClass: "hover:border-blue-200",
                      textClass: "group-hover:text-blue-600"
                    },
                ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                      whileHover={{ y: -8, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)' }}
                      className={`${darkMode 
                        ? 'bg-gray-800/90 border-gray-700 group hover:border-gray-600' 
                        : `bg-white/90 backdrop-blur-sm border border-gray-100 ${stat.hoverClass}`
                      } p-4 rounded-xl shadow-md flex items-center gap-4 group transition-all duration-300 relative`}
                    >
                      <div className={`p-3 bg-gradient-to-br ${
                        darkMode ? 'from-gray-700 to-gray-800' : stat.bgClass
                      } rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300`}>
                        <div className={`w-5 h-5 ${darkMode ? 'text-gray-300' : `text-${stat.color}`} ${stat.textClass}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} ${stat.textClass} transition-colors`}>
                          {stat.label}
                        </div>
                        <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          <AnimatedValue value={stat.value} />
                        </div>
                      </div>
                      {stat.badge && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse"
                          style={{ backgroundColor: stat.badgeColor }}>
                          {stat.badge}
                        </div>
                      )}
                    </motion.div>
                ))}
                </div>

                {/* Global Search & Quick Links */}
                <div className="flex flex-wrap justify-between items-center mt-8 gap-y-4">
                <div className="relative">
                    
                    <AnimatePresence>
                    {isSearchActive && (
                        <motion.div
                        initial={{ opacity: 0, y: 10, scaleY: 0.8 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 10, scaleY: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full left-0 mt-2 w-full rounded-xl shadow-xl z-50 p-3 ${
                            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                        }`}
                        >
                        <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Recherches récentes
                        </div>
                        <div className="space-y-2">
                            {['Nexus Technologies', 'Ticket TK-4871', 'Rapport mensuel', 'Configuration PBX'].map((item, i) => (
                            <div 
                                key={i} 
                                className={`text-sm p-2 rounded-lg cursor-pointer ${
                                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                {item}
                            </div>
                            ))}
                        </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                
                <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border shadow-sm hover:shadow transition-all ${
                      darkMode 
                      ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' 
                      : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white hover:text-indigo-600'
                    }`}
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    Exporter les données
                  </motion.button>
                  
                  {exportDropdownOpen && (
                    <div 
                      className={`fixed mt-2 w-40 rounded-md ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      } shadow-lg focus:outline-none z-50`}
                      style={{
                        top: 'auto',
                        left: 'auto',
                        transform: 'translateY(0)',
                        maxHeight: '300px',
                        overflow: 'auto'
                      }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            // Create and download PDF
                            const dummyLink = document.createElement('a');
                            dummyLink.href = 'data:application/pdf;charset=utf-8,';
                            dummyLink.download = `tableau-de-bord_${new Date().toISOString().split('T')[0]}.pdf`;
                            document.body.appendChild(dummyLink);
                            dummyLink.click();
                            document.body.removeChild(dummyLink);
                            setExportDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Exporter en PDF
                        </button>
                        <button
                          onClick={() => {
                            // Create and download CSV
                            const dummyLink = document.createElement('a');
                            dummyLink.href = 'data:text/csv;charset=utf-8,';
                            dummyLink.download = `tableau-de-bord_${new Date().toISOString().split('T')[0]}.csv`;
                            document.body.appendChild(dummyLink);
                            dummyLink.click();
                            document.body.removeChild(dummyLink);
                            setExportDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Exporter en CSV
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                    
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                      darkMode 
                      ? 'bg-gradient-to-r from-indigo-700 to-[#004AC8]' 
                      : 'bg-gradient-to-r from-indigo-600 to-[#004AC8]'
                    }`}
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    Nouvelle action
                  </motion.button>
                  
                  {actionDropdownOpen && (
                    <div 
                      className={`fixed mt-2 w-56 rounded-md ${
                        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      } shadow-lg focus:outline-none z-50`}
                      style={{
                        top: 'auto',
                        left: 'auto',
                        transform: 'translateY(0)',
                        maxHeight: '300px',
                        overflow: 'auto'
                      }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            window.location.href = '/dashboard/crm/prospects';
                            setActionDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Nouveau prospect
                        </button>
                        <button
                          onClick={() => {
                            window.location.href = '/dashboard/clients';
                            setActionDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Nouveau client
                        </button>
                        <button
                          onClick={() => {
                            window.location.href = '/dashboard/support-tickets';
                            setActionDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Nouveau ticket
                        </button>
                        <button
                          onClick={() => {
                            window.location.href = '/dashboard/crm/calendrier';
                            setActionDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          Nouvel événement
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
                </div>
            </div>
            </motion.div>

            {/* Action rapide */}
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
              <FiGrid className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Action Rapide
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
              <QuickActionCard
                icon={<FiUserPlus className="w-6 h-6" />}
                title="Nouveau prospect"
                description="Ajouter un prospect"
                color="#4F46E5"
                onClick={() => console.log('New Prospect')}
                pulse={true}
                href="/dashboard/crm/prospects"
              />
              <QuickActionCard
                icon={<FiUsers className="w-6 h-6" />}
                title="Nouveau client"
                description="Ajouter un client"
                color="#10B981"
                onClick={() => console.log('New Client')}
                href="/dashboard/clients"
              />
              <QuickActionCard
                icon={<FiPhoneCall className="w-6 h-6" />}
                title="Passer un appel"
                description="Contacter un contact"
                color="#004AC8"
                onClick={() => console.log('Make Call')}
                href="/dashboard/pbx/poste-de-travail"
              />
              <QuickActionCard
                icon={<FiHeadphones className="w-6 h-6" />}
                title="Nouveau ticket"
                description="Support client"
                color="#8B5CF6"
                onClick={() => console.log('New Ticket')}
                pulse={openTickets > 5}
                href="/dashboard/support-tickets"
              />
              <QuickActionCard
                icon={<FiCalendar className="w-6 h-6" />}
                title="Planifier"
                description="Gérer le calendrier"
                color="#F59E0B"
                onClick={() => console.log('Schedule')}
                href="/dashboard/crm/calendrier"
              />
              <QuickActionCard
                icon={<FiMessageSquare className="w-6 h-6" />}
                title="Envoyer un message"
                description="Communiquer"
                color="#EF4444"
                onClick={() => console.log('Send Message')}
                pulse={unreadMessages > 0}
                href="/dashboard/crm/chat"
              />
              <QuickActionCard
                icon={<FiFileText className="w-6 h-6" />}
                title="Créer facture"
                description="Facturation client"
                color="#6366F1"
                onClick={() => console.log('Create Invoice')}
                href="/dashboard/document-ventes/factures"
              />
              <QuickActionCard
                icon={<FaEuroSign className="w-6 h-6" />}
                title="Créer devis"
                description="Proposer une offre"
                color="#475569"
                onClick={() => console.log('Create Quote')}
                href="/dashboard/document-ventes/devis"
              />
            </div>

            {/* Top Row: Performance & Global Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unified Performance Analytics with Improved Space Utilization */}
            <AnimatedCard className="lg:col-span-2 p-6 flex flex-col h-full" delay={0.1}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CircleStat 
                    icon={<FiActivity />} 
                    color="#4F46E5" 
                    size="sm" 
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Performance Globale
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Prospection et Communication
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className={`p-1 rounded-xl flex flex-wrap ${darkMode ? 'bg-gray-700' : 'bg-gray-100/80'}`}>
                    {['today', 'week', 'month', 'custom'].map((period) => (
                      <motion.button
                        key={period}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setTimeRange(period);
                          // Add custom date range modal trigger for 'custom' option
                          if (period === 'custom') {
                            // This would typically open a date picker or modal
                            console.log('Opening custom date range selector');
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          timeRange === period
                            ? darkMode 
                              ? 'bg-indigo-600 text-white shadow-lg' 
                              : 'bg-indigo-100 text-indigo-700 shadow-lg'
                            : darkMode 
                              ? 'text-gray-300 hover:bg-gray-600' 
                              : 'text-gray-600 hover:bg-gray-200/50'
                        }`}
                      >
                        {period === 'today' ? 'Aujourd\'hui' : 
                        period === 'week' ? 'Semaine' : 
                        period === 'month' ? 'Mois' : 'Personnaliser'}
                      </motion.button>
                    ))}
                  </div>
                  
                  {timeRange === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-16 right-6 z-20 p-4 rounded-xl shadow-xl backdrop-blur-sm border border-gray-200"
                      style={{
                        background: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="text-sm font-medium mb-1">Sélectionner une période</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Début</label>
                            <input 
                              type="date" 
                              className={`p-2 text-xs rounded-lg w-full ${
                                darkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-200 text-gray-800'
                              } border`}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 mb-1 block">Fin</label>
                            <input 
                              type="date" 
                              className={`p-2 text-xs rounded-lg w-full ${
                                darkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-200 text-gray-800'
                              } border`}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTimeRange('today')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Annuler
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                              darkMode 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            Appliquer
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Stats Grid with better sizing and dynamic data based on time range */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { 
                    label: 'Nouveaux Prospects', 
                    value: timeRange === 'today' ? 18 : 
                          timeRange === 'week' ? 45 : 
                          timeRange === 'month' ? prospectData[prospectData.length-1].prospects : 
                          23, // custom range value
                    trend: timeRange === 'today' ? '+5.2%' : 
                          timeRange === 'week' ? '+8.7%' : 
                          timeRange === 'month' ? '+12.5%' :
                          '+7.3%', // custom range value
                    trendUp: true,
                    color: 'indigo',
                    icon: <FiUserPlus className="w-4 h-4" />
                  },
                  { 
                    label: 'Total Appels', 
                    value: timeRange === 'today' ? 35 : 
                          timeRange === 'week' ? 143 : 
                          timeRange === 'month' ? totalCalls : 
                          86, // custom range value
                    trend: timeRange === 'today' ? '+3.1%' : 
                          timeRange === 'week' ? '+6.4%' : 
                          timeRange === 'month' ? '+8.2%' :
                          '+5.7%', // custom range value
                    trendUp: true,
                    color: 'blue',
                    icon: <FiPhoneCall className="w-4 h-4" />
                  },
                  { 
                    label: 'Taux de Conversion', 
                    value: timeRange === 'today' ? '29%' : 
                          timeRange === 'week' ? '31%' : 
                          timeRange === 'month' ? '32%' : 
                          '30%', // custom range value
                    trend: timeRange === 'today' ? '+2.8%' : 
                          timeRange === 'week' ? '+4.2%' : 
                          timeRange === 'month' ? '+5.4%' :
                          '+3.9%', // custom range value
                    trendUp: true,
                    color: 'green',
                    icon: <FiTarget className="w-4 h-4" />
                  },
                  { 
                    label: 'CA Potentiel', 
                    value: timeRange === 'today' ? '28K€' : 
                          timeRange === 'week' ? '76K€' : 
                          timeRange === 'month' ? '132K€' : 
                          '54K€', // custom range value
                    trend: timeRange === 'today' ? '+4.7%' : 
                          timeRange === 'week' ? '+9.3%' : 
                          timeRange === 'month' ? '+15.8%' :
                          '+8.1%', // custom range value
                    trendUp: true,
                    color: 'amber',
                    icon: <FaEuroSign className="w-4 h-4" />
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)' }}
                    className={`${darkMode 
                      ? `bg-gradient-to-br from-${stat.color}-900/30 to-${stat.color}-800/20 border border-${stat.color}-700/30` 
                      : `bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`
                    } p-3 rounded-xl transition-all duration-300`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-lg ${darkMode ? `bg-${stat.color}-800/50 text-${stat.color}-400` : `bg-${stat.color}-200/80 text-${stat.color}-700`}`}>
                        {stat.icon}
                      </div>
                      <div className={`text-xs ${darkMode ? `text-${stat.color}-400` : `text-${stat.color}-700`}`}>
                        {stat.label}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${darkMode ? 'text-white' : `text-${stat.color}-800`}`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs flex items-center gap-1 mt-1 ${
                      stat.trendUp 
                        ? darkMode ? `text-${stat.color}-400` : `text-${stat.color}-600` 
                        : darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {stat.trendUp 
                        ? <FiArrowUpRight className="w-3 h-3" /> 
                        : <FiArrowDownRight className="w-3 h-3" />
                      }
                      {stat.trend}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Chart with flex-grow to fill available space */}
              <div className="flex-grow relative min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      timeRange === 'today' 
                        ? [
                            { name: '9h', prospects: 5, leads: 3, clients: 2 },
                            { name: '12h', prospects: 4, leads: 3, clients: 1 },
                            { name: '15h', prospects: 6, leads: 4, clients: 3 },
                            { name: '18h', prospects: 3, leads: 2, clients: 1 }
                          ] 
                        : timeRange === 'week'
                        ? [
                            { name: 'Lun', prospects: 12, leads: 8, clients: 5 },
                            { name: 'Mar', prospects: 10, leads: 6, clients: 4 },
                            { name: 'Mer', prospects: 8, leads: 5, clients: 3 },
                            { name: 'Jeu', prospects: 15, leads: 9, clients: 5 },
                            { name: 'Ven', prospects: 18, leads: 11, clients: 7 }
                          ]
                        : timeRange === 'custom'
                        ? [
                            { name: '01/03', prospects: 15, leads: 9, clients: 6 },
                            { name: '02/03', prospects: 12, leads: 7, clients: 5 },
                            { name: '03/03', prospects: 14, leads: 8, clients: 6 },
                            { name: '04/03', prospects: 10, leads: 6, clients: 4 },
                            { name: '05/03', prospects: 16, leads: 10, clients: 7 }
                          ]
                        : prospectData // month data (default)
                    }
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorProspects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={darkMode ? "#6366F1" : "#4F46E5"} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={darkMode ? "#6366F1" : "#4F46E5"} stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={darkMode ? "#3B82F6" : "#004AC8"} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={darkMode ? "#3B82F6" : "#004AC8"} stopOpacity={0.2}/>
                      </linearGradient>
                      <linearGradient id="colorClients" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor={darkMode ? "#F59E0B" : "#F59E0B"} stopOpacity={1}/>
                        <stop offset="95%" stopColor={darkMode ? "#FBBF24" : "#F59E0B"} stopOpacity={1}/>
                      </linearGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
                      </filter>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      vertical={false} 
                      opacity={0.2} 
                      stroke={darkMode ? "#6B7280" : "#E2E8F0"} 
                    />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
                      tickLine={false}
                      axisLine={{ stroke: darkMode ? "#4B5563" : "#E2E8F0" }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 10, fill: darkMode ? "#9CA3AF" : "#64748B" }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: darkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)' }}
                      contentStyle={{ 
                        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: 'none',
                        padding: '8px',
                        color: darkMode ? '#E5E7EB' : '#1F2937'
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle" 
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: darkMode ? '#D1D5DB' : '#4B5563', fontSize: '12px' }}>
                          {value}
                        </span>
                      )}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="prospects" 
                      fill="url(#colorProspects)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={16} 
                      name="Prospects" 
                      filter="url(#shadow)"
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="leads" 
                      fill="url(#colorLeads)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={16} 
                      name="Suivis" 
                      filter="url(#shadow)"
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="clients" 
                      stroke="url(#colorClients)" 
                      strokeWidth={3} 
                      dot={{ 
                        r: 4, 
                        strokeWidth: 2, 
                        fill: darkMode ? '#1F2937' : '#FFFFFF',
                        stroke: darkMode ? '#F59E0B' : '#F59E0B' 
                      }} 
                      activeDot={{ 
                        r: 6, 
                        strokeWidth: 2,
                        fill: darkMode ? '#1F2937' : '#FFFFFF',
                        stroke: darkMode ? '#F59E0B' : '#F59E0B',
                        strokeOpacity: 0.8
                      }} 
                      name="Clients" 
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Floating insight card */}
                <div className={`absolute top-0 right-0 p-3 rounded-lg shadow-lg max-w-xs ${
                  darkMode ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' : 'bg-white/90 backdrop-blur-sm border border-gray-100'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1 rounded ${darkMode ? 'bg-indigo-800/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                      <FiTrendingUp className="w-3 h-3" />
                    </div>
                    <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Insight
                    </div>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {timeRange === 'today' 
                      ? "Aujourd'hui, votre taux de conversion est supérieur de 2.8% à la moyenne journalière."
                      : timeRange === 'week'
                      ? "Cette semaine, le taux de clôture des prospects s'est amélioré de 4.2% par rapport à la semaine dernière."
                      : timeRange === 'custom'
                      ? "Sur la période sélectionnée, vos performances sont 7% au-dessus des objectifs fixés."
                      : "Vos taux de conversion augmentent de 15% par rapport au mois précédent, avec une efficacité prospect-client en hausse."
                    }
                  </p>
                </div>
              </div>
              
              {/* View details button - now sticks to bottom */}
              <div className={`mt-3 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dernière mise à jour: il y a 5 minutes
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ x: -2 }}
                  className={`text-xs font-medium flex items-center gap-1 transition-opacity ${
                    darkMode ? 'text-indigo-400 opacity-70 hover:opacity-100' : 'text-indigo-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  Voir les performances détaillées <FiChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </AnimatedCard>
            
            {/* Split into 2 cards: Weather and Activity Feed */}
            <div className="flex flex-col gap-6">
              {/* Enhanced iOS-inspired Weather Widget Card */}
              <AnimatedCard 
                className="flex flex-col overflow-hidden relative"
                delay={0.15}
                style={{
                  borderRadius: '1.2rem',
                  background: darkMode 
                    ? 'linear-gradient(135deg, #1a1f35 0%, #2c3e67 100%)' 
                    : 'linear-gradient(135deg, #b1d8f8 0%, #e2f1fd 100%)',
                  boxShadow: darkMode 
                    ? '0 12px 24px -8px rgba(0, 0, 0, 0.3)' 
                    : '0 12px 24px -8px rgba(37, 99, 235, 0.15)',
                  border: darkMode 
                    ? '1px solid rgba(59, 130, 246, 0.2)' 
                    : '1px solid rgba(219, 234, 254, 0.8)'
                }}
              >
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-10" 
                  style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 5v1H0V0h5z\'/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '6px 6px'
                  }} 
                />

                {/* Animated blur circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-2xl bg-blue-400 animate-pulse-slow"></div>
                <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full opacity-20 blur-3xl bg-sky-300 animate-pulse-slow animation-delay-1000"></div>

                {/* Header with redesigned style */}
                <div className="p-4 flex justify-between items-center z-10">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      whileHover={{ rotateZ: 30, scale: 1.1 }}
                      className={`p-2 rounded-full backdrop-blur-md ${
                        darkMode ? 'bg-white/10' : 'bg-white/60'
                      }`}
                    >
                      <FiSun className={`w-5 h-5 ${
                        darkMode ? 'text-yellow-300' : 'text-yellow-500'
                      }`} />
                    </motion.div>
                    <h3 className={`font-medium ${
                      darkMode ? 'text-white/90' : 'text-gray-800'
                    }`}>
                      Météo
                    </h3>
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-white/10 text-white/80' : 'bg-white/70 text-gray-700'
                  } backdrop-blur-md`}>
                    Maintenant
                  </div>
                </div>
                
                {/* iOS-inspired weather display */}
                <div className="px-5 pb-5 pt-2 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-1">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative"
                      >
                        <h2 className={`text-4xl font-extralight ${
                          darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                          {weatherData.temperature}°
                          <span className={`text-sm font-medium align-top ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>C</span>
                        </h2>
                        <div className={`text-xs ${
                          darkMode ? 'text-blue-300' : 'text-blue-600'
                        }`}>
                          {weatherData.high}° / {weatherData.low}°
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={`mt-1 text-sm ${
                          darkMode ? 'text-white/80' : 'text-gray-700'
                        }`}
                      >
                        {weatherData.condition}
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      className="flex-1 flex justify-end items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <div className="relative">
                        {weatherData.condition.toLowerCase().includes('nuag') ? (
                          <div className="relative">
                            <motion.div 
                              animate={{ y: [0, -2, 0] }} 
                              transition={{ repeat: Infinity, duration: 3 }}
                              className="absolute -top-1 -left-8 text-5xl"
                            >
                              ☁️
                            </motion.div>
                            <motion.div 
                              animate={{ y: [0, -3, 0] }} 
                              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                              className="text-6xl"
                            >
                              ⛅
                            </motion.div>
                          </div>
                        ) : weatherData.condition.toLowerCase().includes('pluie') ? (
                          <div className="relative">
                            <div className="text-6xl">🌧️</div>
                            <motion.div 
                              animate={{ 
                                y: [0, 20], 
                                opacity: [1, 0]
                              }} 
                              transition={{ 
                                repeat: Infinity, 
                                duration: 1.5,
                                staggerChildren: 0.2
                              }}
                              className="absolute top-8 left-4 text-blue-500 font-bold"
                            >
                              💧
                            </motion.div>
                          </div>
                        ) : (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="text-6xl"
                          >
                            ☀️
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Location bar with iOS-style */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`
                      mt-2 flex items-center justify-between p-3 rounded-xl backdrop-blur-md
                      ${darkMode ? 'bg-white/10' : 'bg-white/60'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`
                        p-1.5 rounded-full
                        ${darkMode ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-100 text-blue-600'}
                      `}>
                        <FiMapPin className="w-3 h-3" />
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white/90' : 'text-gray-700'}`}>
                        {weatherData.location}
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          p-1.5 rounded-full cursor-pointer
                          ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-white/80 hover:bg-white text-gray-600'}
                          transition-colors
                        `}
                      >
                        <FiRefreshCw className="w-3 h-3" />
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          p-1.5 rounded-full cursor-pointer
                          ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white/80' : 'bg-white/80 hover:bg-white text-gray-600'}
                          transition-colors
                        `}
                      >
                        <FiMoreHorizontal className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Forecast bar */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`
                      mt-3 rounded-xl overflow-hidden backdrop-blur-md
                      ${darkMode ? 'bg-white/10' : 'bg-white/60'}
                    `}
                  >
                    <div className="grid grid-cols-5 divide-x divide-opacity-20 divide-gray-400">
                      {['8h', '12h', '16h', '20h', '00h'].map((time, index) => (
                        <div key={index} className="p-2 text-center relative">
                          <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            {time}
                          </div>
                          <div className="text-lg mb-1">
                            {index === 0 ? '☀️' : 
                            index === 1 ? '⛅' : 
                            index === 2 ? '☁️' : 
                            index === 3 ? '🌥️' : '🌙️'}
                          </div>
                          <div className={`text-xs font-medium ${darkMode ? 'text-white/90' : 'text-gray-700'}`}>
                            {Math.round(weatherData.temperature - 2 + index * 2)}°
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Glass reflection effect */}
                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
              </AnimatedCard>

              {/* Activity Feed Card */}
              <AnimatedCard className="flex flex-col flex-1" delay={0.2}>
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <CircleStat 
                      icon={<FiActivity />} 
                      color={darkMode ? "#3B82F6" : "#004AC8"} 
                      size="sm" 
                      pulse={true}
                    />
                    <div>
                      <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Activité Récente
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Dernières actions de l&apos;équipe
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    className={`p-2 rounded-full ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors`}
                  >
                    <FiRefreshCw className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </motion.button>
                </div>
                
                {/* Activity timeline */}
                <div className="px-4 py-2 flex-1 overflow-y-auto" style={{ maxHeight: '220px' }}>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Aujourd&apos;hui
                  </div>
                  <div className="space-y-1">
                    {activitiesData.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                </div>
                
                <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-center`}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}
                  >
                    Voir toutes les activités
                  </motion.button>
                </div>
              </AnimatedCard>
            </div>
            </div>

            {/* Middle Row: Support Tickets and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Enhanced Tickets SAV Section with Fixed Type Errors */}
            <AnimatedCard className="lg:col-span-2 p-6 flex flex-col h-full" delay={0.3}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <CircleStat 
                    icon={<FiHeadphones />} 
                    color="#8B5CF6" 
                    size="sm" 
                    pulse={openTickets > 0} 
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Tickets SAV
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Support clients et résolution d&apos;incidents
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 text-xs font-medium flex items-center gap-1.5 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <FiFilter className="w-3.5 h-3.5" />
                    Filtrer
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 text-xs font-medium flex items-center gap-1.5 rounded-lg text-white transition-colors ${
                      darkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    <FiPlusCircle className="w-3.5 h-3.5" />
                    Nouveau
                  </motion.button>
                </div>
              </div>
              
              {/* Ticket Status Summary with progress bars */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Nouveaux', count: ticketData.filter(t => t.status === 'Nouveau').length, color: 'blue' },
                  { label: 'En cours', count: ticketData.filter(t => t.status === 'En cours').length, color: 'amber' },
                  { label: 'En attente', count: ticketData.filter(t => t.status === 'En attente' || t.status === 'Planifié').length, color: 'purple' },
                  { label: 'Résolus', count: ticketData.filter(t => t.status === 'Résolu').length, color: 'green' }
                ].map((status, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -3 }}
                    className={`p-3 rounded-xl ${
                      darkMode 
                        ? `bg-${status.color}-900/20 border border-${status.color}-800/30` 
                        : `bg-${status.color}-50 border border-${status.color}-100`
                    }`}
                  >
                    <div className={`flex items-center gap-2 mb-1.5`}>
                      <div className={`w-2 h-2 rounded-full bg-${status.color}-${darkMode ? '400' : '500'}`}></div>
                      <div className={`text-xs font-medium ${darkMode ? `text-${status.color}-400` : `text-${status.color}-700`}`}>
                        {status.label}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${darkMode ? 'text-white' : `text-${status.color}-700`}`}>
                      {status.count}
                    </div>
                    <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${
                      darkMode ? `bg-${status.color}-900/30` : `bg-${status.color}-100`
                    }`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(status.count / totalTickets) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full bg-${status.color}-${darkMode ? '400' : '500'}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Enhanced Priority Tickets with more details */}
              <div className="flex-grow">
                <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  Tickets prioritaires
                </h4>
                
                <div className="space-y-4">
                  {priorityTickets
                    .filter(ticket => ticket.status !== 'Résolu') // Filter out resolved tickets
                    .map((ticket, index) => {
                      // Calculate days until SLA deadline
                      const slaHours = parseInt(ticket.sla);
                      const createdDate = new Date(ticket.created);
                      const deadlineDate = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
                      const currentDate = new Date();
                      const timeDifferenceMs = deadlineDate.getTime() - currentDate.getTime();
                      const hoursRemaining = Math.max(0, Math.floor(timeDifferenceMs / (1000 * 60 * 60)));
                      
                      // Expand ticket data with more details
                      const expandedTicket = {
                        ...ticket,
                        company: ticket.client,
                        fullName: ticket.client === 'Acme Corp' ? 'Jean Dupont' : 
                                  ticket.client === 'Nexus Technologies' ? 'Marie Laurent' : 
                                  ticket.client === 'Zenith Industries' ? 'Alexandre Martin' : 
                                  ticket.client === 'Global Systems' ? 'Sophie Bernard' : 'Thomas Petit',
                        phoneNumber: ticket.client === 'Acme Corp' ? '01 23 45 67 89' : 
                                      ticket.client === 'Nexus Technologies' ? '01 98 76 54 32' : 
                                      ticket.client === 'Zenith Industries' ? '06 12 34 56 78' : 
                                      ticket.client === 'Global Systems' ? '07 65 43 21 09' : '01 45 67 89 01',
                        address: ticket.client === 'Acme Corp' ? '123 Avenue des Champs-Élysées, 75008 Paris' : 
                                  ticket.client === 'Nexus Technologies' ? '45 Rue de la République, 69002 Lyon' : 
                                  ticket.client === 'Zenith Industries' ? '78 Boulevard Haussmann, 75009 Paris' : 
                                  ticket.client === 'Global Systems' ? '15 Rue du Commerce, 33000 Bordeaux' : '67 Rue de la Paix, 44000 Nantes',
                        description: ticket.subject === 'Problème de configuration PBX' ? 'Le client signale que la configuration du PBX ne permet pas de transférer les appels entre les différents services. Les règles de routage semblent incorrectes.' : 
                                      ticket.subject === 'Intégration CRM échouée' ? 'L\'intégration entre le système téléphonique et le CRM du client a échoué. Les appels ne sont pas enregistrés dans l\'historique des contacts.' : 
                                      ticket.subject === 'Mise à jour logicielle' ? 'Le client souhaite mettre à jour son système vers la dernière version disponible, mais rencontre des erreurs lors de la procédure de mise à jour.' : 
                                      ticket.subject === 'Formation utilisateur requise' ? 'Nouvelle équipe recrutée nécessitant une formation complète sur l\'utilisation du système de téléphonie. 15 personnes à former.' : 
                                      'Les appels présentent des problèmes de qualité audio (écho, coupures) qui perturbent les communications avec les clients.'
                      };
                      
                      // Create unique IDs for the elements we need to manipulate
                      const cardId = `ticket-card-${expandedTicket.id}`;
                      const statusBadgeId = `status-badge-${expandedTicket.id}`;
                      const inProgressBtnId = `in-progress-btn-${expandedTicket.id}`;
                      const resolveBtnId = `resolve-btn-${expandedTicket.id}`;
                      const onHoldBtnId = `on-hold-btn-${expandedTicket.id}`;
                      
                      return (
                        <motion.div
                          id={cardId}
                          key={expandedTicket.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ 
                            x: 3, 
                            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                          }}
                          className={`p-4 rounded-xl cursor-pointer transition-all relative overflow-hidden ${
                            darkMode 
                              ? 'bg-gray-800 border border-gray-700 hover:border-gray-600' 
                              : 'bg-white border border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {/* Progress bar at top */}
                          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                              style={{ width: `${Number(ticket.progress) || 0}%` }}>
                          </div>
                          
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                                darkMode 
                                  ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {expandedTicket.id}
                              </span>
                              <span 
                                id={statusBadgeId}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                                  expandedTicket.status === 'Nouveau' 
                                    ? darkMode ? 'text-blue-700 bg-blue-50/30 border border-blue-200/30' : 'text-blue-700 bg-blue-50 border border-blue-200'
                                    : expandedTicket.status === 'En cours' 
                                    ? darkMode ? 'text-amber-700 bg-amber-50/30 border border-amber-200/30' : 'text-amber-700 bg-amber-50 border border-amber-200'
                                    : expandedTicket.status === 'En attente' || expandedTicket.status === 'Planifié'
                                    ? darkMode ? 'text-purple-700 bg-purple-50/30 border border-purple-200/30' : 'text-purple-700 bg-purple-50 border border-purple-200'
                                    : darkMode ? 'text-green-700 bg-green-50/30 border border-green-200/30' : 'text-green-700 bg-green-50 border border-green-200'
                                }`}
                              >
                                {expandedTicket.status === 'Nouveau' ? (
                                  <><FiAlertCircle className="w-3 h-3" /> {expandedTicket.status}</>
                                ) : expandedTicket.status === 'En cours' ? (
                                  <><FiActivity className="w-3 h-3" /> {expandedTicket.status}</>
                                ) : expandedTicket.status === 'En attente' || expandedTicket.status === 'Planifié' ? (
                                  <><FiClock className="w-3 h-3" /> {expandedTicket.status}</>
                                ) : (
                                  <><FiCheckCircle className="w-3 h-3" /> {expandedTicket.status}</>
                                )}
                              </span>
                            </div>
                            <PriorityBadge priority={expandedTicket.priority} />
                          </div>
                          
                          <h4 className={`font-medium text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {expandedTicket.subject}
                          </h4>
                          
                          {/* Description section */}
                          <div className={`text-xs mb-3 p-2 rounded-lg ${
                            darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                          }`} style={{ maxHeight: '60px', overflow: 'auto' }}>
                            {expandedTicket.description}
                          </div>
                          
                          {/* Client details grid */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                            <div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Entreprise
                              </div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {expandedTicket.company}
                              </div>
                            </div>
                            
                            <div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Contact
                              </div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {expandedTicket.fullName}
                              </div>
                            </div>
                            
                            <div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Téléphone
                              </div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {expandedTicket.phoneNumber}
                              </div>
                            </div>
                            
                            <div>
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Créé le
                              </div>
                              <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {new Date(expandedTicket.created).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Address */}
                          <div className="mb-3">
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Adresse
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'} truncate`} title={expandedTicket.address}>
                              {expandedTicket.address}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs mb-3">
                            <span className={`flex items-center gap-1 p-1.5 rounded ${
                              hoursRemaining < 3 
                                ? darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700' 
                                : hoursRemaining < 12 
                                ? darkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-700'
                                : darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-700'
                            }`}>
                              <FiClock className="w-3 h-3" />
                              {hoursRemaining <= 0 
                                ? 'SLA dépassé' 
                                : `Résolution avant: ${hoursRemaining}h`}
                            </span>
                            <span className={`flex items-center gap-1 ${
                              expandedTicket.priority === 'Critique' || expandedTicket.priority === 'Haute' 
                                ? darkMode ? 'text-red-400' : 'text-red-700' 
                                : darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Mis à jour: {new Date(expandedTicket.updated).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                          <div className={`flex justify-between items-center pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {expandedTicket.agent === 'Non assigné' ? (
                                <span className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
                                  Non assigné
                                </span>
                              ) : (
                                <>
                                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700 font-bold">
                                    {expandedTicket.agent.charAt(0)}
                                  </div>
                                  <span className="ml-1">{expandedTicket.agent}</span>
                                </>
                              )}
                            </span>

                            <div className="flex gap-1.5">
                              {expandedTicket.status !== 'En cours' && (
                                <motion.button
                                  id={inProgressBtnId}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className={`p-1.5 rounded transition-colors ${
                                    darkMode 
                                      ? 'bg-amber-800/30 text-amber-400 hover:bg-amber-800/50' 
                                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                  }`}
                                  onClick={() => {
                                    // Set ticket to "En cours" status
                                    // 1. Update the status badge
                                    const statusBadge = document.getElementById(statusBadgeId);
                                    if (statusBadge) {
                                      // Update appearance
                                      statusBadge.className = darkMode 
                                        ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-amber-700 bg-amber-50/30 border border-amber-200/30'
                                        : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-amber-700 bg-amber-50 border border-amber-200';
                                        
                                      // Update content
                                      statusBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> En cours';
                                    }
                                    
                                    // 2. Add visual feedback to button
                                    const button = document.getElementById(inProgressBtnId);
                                    if (button) {
                                      // Flash the button
                                      button.classList.add('animate-pulse');
                                      setTimeout(() => {
                                        button.classList.remove('animate-pulse');
                                      }, 1000);
                                    }
                                    
                                    // 3. In a real app, this would update the ticket in state/database
                                    console.log(`Ticket ${expandedTicket.id} set to En cours`);
                                  }}
                                >
                                  <FiActivity className="w-3.5 h-3.5" />
                                </motion.button>
                              )}
                              
                              <motion.button
                                id={resolveBtnId}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded transition-colors ${
                                  darkMode 
                                    ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                onClick={() => {
                                  // Mark as resolved with animation
                                  // 1. Get the DOM elements
                                  const button = document.getElementById(resolveBtnId);
                                  const card = document.getElementById(cardId);
                                  
                                  if (button && card) {
                                    // 2. Update button appearance
                                    button.innerHTML = '✓';
                                    button.classList.add(darkMode ? 'bg-green-600/50' : 'bg-green-500/30');
                                    
                                    // 3. Animate the card
                                    // Add transition
                                    card.style.transition = 'all 0.5s ease-out';
                                    // Add a green border glow
                                    card.style.borderColor = darkMode ? 'rgba(134, 239, 172, 0.5)' : 'rgba(34, 197, 94, 0.5)';
                                    card.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.3)';
                                    
                                    // Fade out and slide away
                                    setTimeout(() => {
                                      card.style.opacity = '0';
                                      card.style.transform = 'translateX(50px)';
                                      
                                      // Collapse the card
                                      setTimeout(() => {
                                        card.style.maxHeight = '0';
                                        card.style.margin = '0';
                                        card.style.padding = '0';
                                        card.style.overflow = 'hidden';
                                        
                                        // 4. In a real app, this would update the ticket in state/database
                                        console.log(`Ticket ${expandedTicket.id} marked as resolved`);
                                      }, 300);
                                    }, 300);
                                  }
                                }}
                              >
                                <FiCheck className="w-3.5 h-3.5" />
                              </motion.button>
                              
                              {expandedTicket.status !== 'En attente' && (
                                <motion.button
                                  id={onHoldBtnId}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className={`p-1.5 rounded transition-colors ${
                                    darkMode 
                                      ? 'bg-purple-800/30 text-purple-400 hover:bg-purple-800/50' 
                                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                  }`}
                                  onClick={() => {
                                    // Set ticket to "En attente" status
                                    // 1. Update the status badge
                                    const statusBadge = document.getElementById(statusBadgeId);
                                    if (statusBadge) {
                                      // Update appearance
                                      statusBadge.className = darkMode 
                                        ? 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-purple-700 bg-purple-50/30 border border-purple-200/30'
                                        : 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm text-purple-700 bg-purple-50 border border-purple-200';
                                        
                                      // Update content
                                      statusBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> En attente';
                                    }
                                    
                                    // 2. Add visual feedback to button
                                    const button = document.getElementById(onHoldBtnId);
                                    if (button) {
                                      // Flash the button
                                      button.classList.add('animate-pulse');
                                      setTimeout(() => {
                                        button.classList.remove('animate-pulse');
                                      }, 1000);
                                    }
                                    
                                    // 3. In a real app, this would update the ticket in state/database
                                    console.log(`Ticket ${expandedTicket.id} set to En attente`);
                                  }}
                                >
                                  <FiClock className="w-3.5 h-3.5" />
                                </motion.button>
                              )}
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <FiAlertCircle className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>

              {/* View all tickets button */}
              <div className={`mt-4 pt-3 border-t flex justify-end ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ x: -2 }}
                  className={`text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  Voir tous les tickets <FiChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </AnimatedCard>

            {/* System Status & Health Section with Glass Morphism */}
            <AnimatedCard 
              className="relative overflow-hidden p-0 flex flex-col h-full" 
              delay={0.4}
              style={{ 
                background: darkMode 
                  ? 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 30%, #312E81 70%, #4338CA 100%)' 
                  : 'linear-gradient(135deg, #004AC8 0%, #1B0353 50%, #4BB2F6 100%)'
              }}
            >
              {/* Enhanced background effects */}
              <div
                className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)]"
                style={{ backgroundSize: '20px 20px' }}
              />

              <div className="absolute inset-0 overflow-hidden">
                <svg width="100%" height="100%" className="absolute opacity-5">
                  <defs>
                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#smallGrid)" />
                </svg>
              </div>

              <div className="relative p-5 text-white flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/10 rounded-lg">
                        <FiServer className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold">État du Système</h3>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg shadow-black/10"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span>Tous les services actifs</span>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <SystemHealthIndicator
                      label="Qualité VoIP"
                      value={98.7}
                      suffix="%"
                      color="#4BB2F6"
                      icon={<FiWifi className="w-5 h-5 text-white" />}
                      showProgress={true}
                      progress={98.7}
                    />
                    <SystemHealthIndicator
                      label="Charge Serveurs"
                      value={32}
                      suffix="%"
                      color="#ffffff"
                      icon={<FiCpu className="w-5 h-5 text-white" />}
                      showProgress={true}
                      progress={32}
                    />
                  </div>
                </div>
                
                {/* Event timeline */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FiActivity className="w-4 h-4" />
                    Derniers événements système
                  </h4>
                  <div className="space-y-2">
                    {[
                      { time: '10:45', event: 'Mise à jour système réussie', icon: FiCheckCircle, color: 'bg-green-400' },
                      { time: '09:12', event: 'Pic de trafic détecté', icon: FiTrendingUp, color: 'bg-blue-400' },
                      { time: '08:30', event: 'Maintenance programmée', icon: FiCalendar, color: 'bg-amber-400' }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ x: 3 }}
                        className="flex items-start gap-3 group"
                      >
                        <div className={`${item.color} p-2 rounded-full shrink-0 mt-0.5 shadow-lg shadow-black/10 group-hover:shadow-xl transition-all duration-300`}>
                          <item.icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-white/70">{item.time}</div>
                          <div className="text-sm font-medium">{item.event}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Monthly summary */}
                <div className="mt-4 pt-3 border-t border-white/20 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold">Performance mensuelle</h4>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Mars 2025</span>
                  </div>
                  
                  <div className="flex-grow min-h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={callData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="appels" 
                          stroke="#fff" 
                          strokeWidth={2}
                          fill="url(#areaGradient)" 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '12px'
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Call to action - now properly at the bottom */}
                <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center">
                  <span className="text-xs opacity-80">
                    Dernière vérification: il y a 5 minutes
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white backdrop-blur-sm rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    Tableau détaillé
                  </motion.button>
                </div>
              </div>
            </AnimatedCard>
    </div>

    {/* Bottom Row: Tasks and Chat */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Enhanced Events Section with Improved Drag-and-Drop and Clearer Event Types */}
    <AnimatedCard 
      className={`lg:col-span-2 p-6 ${
        expandedCard === 'tasks' ? 'lg:col-span-3 order-first' : ''
      }`} 
      delay={0.5}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <CircleStat 
            icon={<FiCalendar />} 
            color="#F59E0B" 
            size="sm" 
            pulse={pendingTasks > 3} 
          />
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Événements
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Organisation et suivi de vos activités
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTaskView('list')}
              className={`p-2 rounded-lg text-sm ${
                taskView === 'list' 
                  ? darkMode
                    ? 'bg-gray-800 text-amber-400 shadow-sm'
                    : 'bg-white text-amber-700 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiList className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTaskView('board')}
              className={`p-2 rounded-lg text-sm ${
                taskView === 'board' 
                  ? darkMode
                    ? 'bg-gray-800 text-amber-400 shadow-sm'
                    : 'bg-white text-amber-700 shadow-sm'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <FiFilter className="w-3.5 h-3.5" />
            Filtrer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 text-white transition-colors ${
              darkMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <FiPlusCircle className="w-3.5 h-3.5" />
            Nouveau
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleCardExpand('tasks')}
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {expandedCard === 'tasks' ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Tasks Container with Animation */}
      <div className="mt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {taskView === 'list' ? (
            <motion.div
              key="listView"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`border rounded-xl overflow-hidden shadow-sm ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Événement</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Type</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Échéance</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Assigné à</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Priorité</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Statut</th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'bg-gray-900 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {urgentTasks.map((task) => (
                    <motion.tr 
                      key={task.id}
                      whileHover={{ backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.7)' }}
                      className="transition-colors"
                    >
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-start gap-3">
                          <div className={`
                            p-2 rounded-lg
                            ${task.type === 'Appel' 
                              ? darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                              : task.type === 'Réunion' 
                              ? darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' 
                              : task.type === 'Document' 
                              ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' 
                              : task.type === 'Admin' 
                              ? darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600' 
                              : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
                          `}>
                            {task.type === 'Appel' ? (
                              <FiPhoneCall className="w-4 h-4" />
                            ) : task.type === 'Réunion' ? (
                              <FiUsers className="w-4 h-4" />
                            ) : task.type === 'Document' ? (
                              <FiFileText className="w-4 h-4" />
                            ) : task.type === 'Admin' ? (
                              <FiSettings className="w-4 h-4" />
                            ) : (
                              <FiServer className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{task.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.type === 'Appel' 
                            ? darkMode ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/30' : 'bg-indigo-100 text-indigo-600 border border-indigo-200'
                            : task.type === 'Réunion' 
                            ? darkMode ? 'bg-amber-900/30 text-amber-400 border border-amber-800/30' : 'bg-amber-100 text-amber-600 border border-amber-200'
                            : darkMode ? 'bg-green-900/30 text-green-400 border border-green-800/30' : 'bg-green-100 text-green-600 border border-green-200'
                        }`}>
                          {task.type === 'Appel' ? 'Rappel' : 
                          task.type === 'Réunion' ? 'Rendez-vous' : 'Tâche'}
                        </span>
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(task.due).toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{task.assignee}</td>
                      <td className="px-4 py-4 text-sm">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-4 text-right text-sm">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded transition-colors ${
                              darkMode 
                                ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-1.5 rounded transition-colors ${
                              darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <FiArrowRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div
              key="boardView"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Changed column names to 'À faire', 'En cours', 'Terminé' */}
              {['À faire', 'En cours', 'Terminé'].map((column) => (
                <div 
                  key={column} 
                  className={`rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  data-column={column}
                >
                  <div className="p-3 border-b flex items-center justify-between">
                    <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                      {column}
                    </h4>
                    <span className={`
                      text-xs font-medium px-2 py-1 rounded-full
                      ${column === 'À faire' 
                        ? darkMode ? 'bg-blue-800/30 text-blue-400' : 'bg-blue-100 text-blue-700' 
                        : column === 'En cours' 
                        ? darkMode ? 'bg-amber-800/30 text-amber-400' : 'bg-amber-100 text-amber-700' 
                        : darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {/* Filter tasks by their status to match the column */}
                      {taskData.filter(t => 
                        column === 'À faire' 
                          ? t.status === 'À faire'
                          : column === 'En cours' 
                          ? t.status === 'En cours'
                          : t.status === 'Terminée'
                      ).length}
                    </span>
                  </div>
                  
                  <div className="p-3 space-y-3 max-h-96 overflow-y-auto" data-column={column}>
                    {taskData
                      .filter(t => 
                        column === 'À faire' 
                          ? t.status === 'À faire'
                          : column === 'En cours' 
                          ? t.status === 'En cours'
                          : t.status === 'Terminée'
                      )
                      .map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                          drag
                          dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => {
                            // Handle drag end - in a real implementation, this would update the task's status
                            // Based on which column it was dropped into
                            
                            // Use info.point.x and info.point.y instead of e.clientX and e.clientY
                            // This avoids TypeScript errors since framer-motion provides these coordinates
                            const targetColumn = document.elementsFromPoint(info.point.x, info.point.y)
                              .find(el => el.getAttribute('data-column'));
                            
                            if (targetColumn) {
                              const newStatus = targetColumn.getAttribute('data-column');
                              console.log(`Moving task ${task.id} to status: ${newStatus}`);
                              // In a real implementation you would update the task status here
                            }
                          }}
                          className={`relative p-4 rounded-xl shadow-sm border transition-all cursor-grab active:cursor-grabbing ${
                            darkMode 
                              ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                              : 'bg-white border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {/* Distinctive top ribbon to clearly indicate task type */}
                          <div className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${
                            task.type === 'Appel' 
                              ? 'bg-indigo-500' 
                              : task.type === 'Réunion' 
                              ? 'bg-amber-500' 
                              : 'bg-green-500'
                          }`}></div>
                          
                          {/* Task Type Badge - Positioned at top-right */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              task.type === 'Appel' 
                                ? darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700' : 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : task.type === 'Réunion' 
                                ? darkMode ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-amber-100 text-amber-700 border border-amber-200' 
                                : darkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              {task.type === 'Appel' ? 'Rappel' : 
                              task.type === 'Réunion' ? 'Rendez-vous' : 'Tâche'}
                            </span>
                          </div>
                          
                          {/* Enhanced card header with badge and priority */}
                          <div className="flex items-start mb-3 mt-3 pr-20">
                            <div className="flex items-center gap-2">
                              <div className={`
                                p-1.5 rounded
                                ${task.type === 'Appel' 
                                  ? darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600' 
                                  : task.type === 'Réunion' 
                                  ? darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' 
                                  : task.type === 'Document' 
                                  ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' 
                                  : task.type === 'Admin' 
                                  ? darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600' 
                                  : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}
                              `}>
                                {task.type === 'Appel' ? (
                                  <FiPhoneCall className="w-3 h-3" />
                                ) : task.type === 'Réunion' ? (
                                  <FiUsers className="w-3 h-3" />
                                ) : task.type === 'Document' ? (
                                  <FiFileText className="w-3 h-3" />
                                ) : task.type === 'Admin' ? (
                                  <FiSettings className="w-3 h-3" />
                                ) : (
                                  <FiServer className="w-3 h-3" />
                                )}
                              </div>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {task.id}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {task.title}
                            </h4>
                            <PriorityBadge priority={task.priority} />
                          </div>
                          
                          {/* Enhanced task details based on type */}
                          <div className={`mb-3 p-2 rounded-lg text-xs ${
                            darkMode ? 'bg-gray-800/70 text-gray-300' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {/* Show different details based on task type */}
                            {task.type === 'Réunion' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-amber-500" />
                                    <span>Date:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-amber-500" />
                                    <span>Horaire:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiMapPin className="w-3 h-3 text-amber-500" />
                                    <span>Lieu:</span>
                                  </div>
                                  <span className="font-medium">Salle Conférence A</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiUsers className="w-3 h-3 text-amber-500" />
                                    <span>Participants:</span>
                                  </div>
                                  <span className="font-medium">4</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiBell className="w-3 h-3 text-amber-500" />
                                    <span>Rappel:</span>
                                  </div>
                                  <span className="font-medium">15 min avant</span>
                                </div>
                              </div>
                            )}
                            
                            {task.type === 'Appel' && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-indigo-500" />
                                    <span>Date:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-indigo-500" />
                                    <span>Heure:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiPhone className="w-3 h-3 text-indigo-500" />
                                    <span>Numéro:</span>
                                  </div>
                                  <span className="font-medium">+33 1 45 67 89 10</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiUser className="w-3 h-3 text-indigo-500" />
                                    <span>Contact:</span>
                                  </div>
                                  <span className="font-medium">{
                                    task.title.includes('Acme') ? 'Jean Dupont' : 
                                    task.title.includes('Nexus') ? 'Marie Laurent' : 'Thomas Bernard'
                                  }</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiClock className="w-3 h-3 text-indigo-500" />
                                    <span>Durée estimée:</span>
                                  </div>
                                  <span className="font-medium">20 min</span>
                                </div>
                              </div>
                            )}
                            
                            {(task.type === 'Document' || task.type === 'Admin' || task.type === 'Technique') && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCalendar className="w-3 h-3 text-green-500" />
                                    <span>Date limite:</span>
                                  </div>
                                  <span className="font-medium">{new Date(task.due).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiFileText className="w-3 h-3 text-green-500" />
                                    <span>Projet:</span>
                                  </div>
                                  <span className="font-medium">{
                                    task.title.includes('documentation') ? 'API v2.5' : 
                                    task.title.includes('rapport') ? 'Commercial Q1' : 'Infrastructure'
                                  }</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <FiCheckSquare className="w-3 h-3 text-green-500" />
                                    <span>Progression:</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500 rounded-full" style={{ 
                                        width: `${task.status === 'À faire' ? 0 : task.status === 'En cours' ? 65 : 100}%` 
                                      }}></div>
                                    </div>
                                    <span className="ml-1 font-medium">{
                                      task.status === 'À faire' ? '0%' : 
                                      task.status === 'En cours' ? '65%' : '100%'
                                    }</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {task.notes && (
                            <p className={`text-xs mb-3 italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {task.notes}
                            </p>
                          )}
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className={`flex items-center gap-1 ${
                              new Date(task.due) < new Date() && task.status !== 'Terminée' 
                                ? darkMode ? 'text-red-400' : 'text-red-600' 
                                : darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <FiClock className="w-3 h-3" />
                              {new Date(task.due).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[8px] font-bold">
                                {task.assignee.charAt(0)}
                              </div>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {task.assignee.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className={`mt-3 pt-2 border-t flex justify-end gap-1 ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            {column !== 'Terminé' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <FiEdit className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'À faire' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-amber-800/30 text-amber-400 hover:bg-amber-800/50' 
                                    : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                }`}
                              >
                                <FiPlay className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'En cours' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-green-800/30 text-green-400 hover:bg-green-800/50' 
                                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                                }`}
                              >
                                <FiCheck className="w-3 h-3" />
                              </motion.button>
                            )}
                            
                            {column === 'Terminé' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1.5 rounded-full ${
                                  darkMode 
                                    ? 'bg-blue-800/30 text-blue-400 hover:bg-blue-800/50' 
                                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                }`}
                              >
                                <FiRotateCcw className="w-3 h-3" />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                    {/* Add task button at the end of each column */}
                    <motion.button
                      whileHover={{ opacity: 1 }}
                      className={`w-full p-3 rounded-lg mt-2 flex items-center justify-center gap-1 text-xs font-medium opacity-60 transition-opacity ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      data-column={column}
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                      Ajouter {column === 'À faire' ? 'une nouvelle tâche' : column === 'En cours' ? 'un événement en cours' : 'une tâche terminée'}
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all tasks button */}
      <div className={`mt-4 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Affichage de {urgentTasks.length} événements sur {taskData.length}
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ x: -2 }}
          className={`text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity ${
            darkMode ? 'text-amber-400' : 'text-amber-600'
          }`}
        >
          Voir tous les événements <FiChevronRight className="w-3 h-3" />
        </motion.button>
      </div>
    </AnimatedCard>

    {/* Enhanced Chat Section with Animations */}
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
                <MessagePreview key={message.id} message={message} onClick={() => console.log('Open chat', message.id)} />
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

    
    </div>
    </div>
    {/* Add Kalicom Chat Widget */}
    <KalicomChatWidget />
    </motion.div>
    );
}
