'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  FiDollarSign,
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
} from 'react-icons/fi';

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
}

// Enhanced Quick Action Card with fancy animations
const QuickActionCard = ({ icon, title, color, description, onClick, pulse = false }: QuickActionCardProps) => {
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

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        boxShadow: `0 20px 30px -10px ${color}20`,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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
interface WeatherWidgetProps {
  data: WeatherData;
}

// Weather component
const WeatherWidget = ({ data }: WeatherWidgetProps) => (
  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600">
        <FiSun className="w-5 h-5" />
      </div>
      <div>
        <div className="font-medium text-gray-800">{data.location}</div>
        <div className="text-xs text-gray-500">{data.condition}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-2xl font-bold text-gray-800">{data.temperature}°C</div>
      <div className="text-xs text-gray-500">
        {data.high}° / {data.low}°
      </div>
    </div>
  </div>
);

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
  
  // Calculate summary statistics
  const totalCalls = callData.reduce((sum, item) => sum + item.appels, 0);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status !== 'Résolu').length;
  const totalTasks = taskData.length;
  const pendingTasks = taskData.filter(t => t.status !== 'Terminée').length;
  const totalProspects = prospectData.reduce((acc, item) => acc + item.prospects, 0);
  const unreadMessages = chatMessages.filter(m => m.unread).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Refresh handler with improved animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    
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
                        Dimanche, 23 Mars 2025 | Dernière connexion: il y a 2 heures
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-8">
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
                    icon: <FiPhoneCall />, 
                    label: "Appels", 
                    value: totalCalls, 
                    color: "#004AC8",
                    bgClass: "from-blue-100 to-blue-50",
                    hoverClass: "hover:border-blue-200",
                    textClass: "group-hover:text-blue-600"
                    },
                    { 
                    icon: <FiHeadphones />, 
                    label: "Tickets", 
                    value: totalTickets, 
                    color: "#8B5CF6",
                    bgClass: "from-purple-100 to-purple-50",
                    hoverClass: "hover:border-purple-200",
                    textClass: "group-hover:text-purple-600",
                    badge: openTickets > 0 ? openTickets : null,
                    badgeColor: "#EF4444"
                    },
                    { 
                    icon: <FiClipboard />, 
                    label: "Tâches", 
                    value: totalTasks, 
                    color: "#F59E0B",
                    bgClass: "from-amber-100 to-amber-50",
                    hoverClass: "hover:border-amber-200",
                    textClass: "group-hover:text-amber-600",
                    badge: pendingTasks > 0 ? pendingTasks : null,
                    badgeColor: "#F59E0B"
                    },
                    { 
                    icon: <FiTarget />, 
                    label: "Conversion", 
                    value: "32%", 
                    color: "#10B981",
                    bgClass: "from-green-100 to-green-50",
                    hoverClass: "hover:border-green-200",
                    textClass: "group-hover:text-green-600"
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
                    <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border shadow-sm hover:shadow transition-all ${
                        darkMode 
                        ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700' 
                        : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white hover:text-indigo-600'
                    }`}
                    >
                    <FiDownload className="w-3.5 h-3.5" />
                    Exporter les données
                    </motion.button>
                    
                    <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-lg shadow-sm hover:shadow-md transition-all ${
                        darkMode 
                        ? 'bg-gradient-to-r from-indigo-700 to-[#004AC8]' 
                        : 'bg-gradient-to-r from-indigo-600 to-[#004AC8]'
                    }`}
                    >
                    <FiPlus className="w-3.5 h-3.5" />
                    Nouvelle action
                    </motion.button>
                </div>
                </div>
            </div>
            </motion.div>

            {/* Quick Actions Grid with Enhanced Design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            <QuickActionCard
                icon={<FiUserPlus className="w-6 h-6" />}
                title="Nouveau Prospect"
                description="Ajouter un contact"
                color="#4F46E5"
                onClick={() => console.log('New Prospect')}
                pulse={true}
            />
            <QuickActionCard
                icon={<FiPhoneCall className="w-6 h-6" />}
                title="Passer un Appel"
                description="Contacter un client"
                color="#004AC8"
                onClick={() => console.log('Make Call')}
            />
            <QuickActionCard
                icon={<FiHeadphones className="w-6 h-6" />}
                title="Nouveau Ticket"
                description="Support client"
                color="#8B5CF6"
                onClick={() => console.log('New Ticket')}
                pulse={openTickets > 5}
            />
            <QuickActionCard
                icon={<FiClipboard className="w-6 h-6" />}
                title="Créer Tâche"
                description="Ajouter une tâche"
                color="#F59E0B"
                onClick={() => console.log('Create Task')}
            />
            <QuickActionCard
                icon={<FiCalendar className="w-6 h-6" />}
                title="Planifier"
                description="Gérer le calendrier"
                color="#10B981"
                onClick={() => console.log('Schedule')}
            />
            <QuickActionCard
                icon={<FiMessageSquare className="w-6 h-6" />}
                title="Envoyer Message"
                description="Communiquer"
                color="#EF4444"
                onClick={() => console.log('Send Message')}
                pulse={unreadMessages > 0}
            />
            <QuickActionCard
                icon={<FiFileText className="w-6 h-6" />}
                title="Rapport"
                description="Analyser les données"
                color="#6366F1"
                onClick={() => console.log('Report')}
            />
            <QuickActionCard
                icon={<FiSettings className="w-6 h-6" />}
                title="Paramètres"
                description="Configurer"
                color="#475569"
                onClick={() => console.log('Settings')}
            />
            </div>

            {/* Top Row: Performance & Global Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Unified Performance Analytics */}
            <AnimatedCard className="lg:col-span-2 p-6" delay={0.1}>
                <div className="flex items-center justify-between mb-6">
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
                    <div className={`p-1 rounded-xl flex ${darkMode ? 'bg-gray-700' : 'bg-gray-100/80'}`}>
                    {['today', 'week', 'month'].map((period) => (
                        <motion.button
                        key={period}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTimeRange(period)}
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
                        {period === 'today' ? 'Aujourd\'hui' : period === 'week' ? 'Semaine' : 'Mois'}
                        </motion.button>
                    ))}
                    </div>
                </div>
                </div>
                
                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { 
                    label: 'Nouveaux Prospects', 
                    value: prospectData[prospectData.length-1].prospects,
                    trend: '+12.5%',
                    trendUp: true,
                    color: 'indigo',
                    icon: <FiUserPlus className="w-4 h-4" />
                    },
                    { 
                    label: 'Total Appels', 
                    value: totalCalls,
                    trend: '+8.2%',
                    trendUp: true,
                    color: 'blue',
                    icon: <FiPhoneCall className="w-4 h-4" />
                    },
                    { 
                    label: 'Taux de Conversion', 
                    value: '32%',
                    trend: '+5.4%',
                    trendUp: true,
                    color: 'green',
                    icon: <FiTarget className="w-4 h-4" />
                    },
                    { 
                    label: 'CA Potentiel', 
                    value: '132K€',
                    trend: '+15.8%',
                    trendUp: true,
                    color: 'amber',
                    icon: <FiDollarSign className="w-4 h-4" />
                    }
                ].map((stat, index) => (
                    <motion.div
                    key={index}
                    whileHover={{ y: -5, boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)' }}
                    className={`${darkMode 
                        ? `bg-gradient-to-br from-${stat.color}-900/30 to-${stat.color}-800/20 border border-${stat.color}-700/30` 
                        : `bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`
                    } p-4 rounded-xl transition-all duration-300`}
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
                
                {/* Enhanced interactive chart */}
                <div className="h-64 mt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={prospectData}
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
                    Vos taux de conversion augmentent de 15% par rapport au mois précédent, avec une efficacité prospect-client en hausse.
                    </p>
                </div>
                </div>
                
                {/* View details button */}
                <div className={`mt-4 pt-3 border-t flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
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
            
            {/* Global Activity Feed */}
            <AnimatedCard className="flex flex-col" delay={0.2}>
                <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CircleStat 
                    icon={<FiActivity />} 
                    color={darkMode ? "#3B82F6" : "#004AC8"} 
                    size="sm" 
                    pulse={true}
                    />
                    <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Activité Globale
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
                
                {/* Weather widget */}
                <div className="px-6 py-4">
                <WeatherWidget data={weatherData} />
                </div>
                
                {/* Activity timeline */}
                <div className="px-6 py-2 flex-1 overflow-y-auto max-h-96">
                <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Aujourd&apos;hui
                </div>
                <div className="space-y-1">
                    {activitiesData.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
                
                <div className={`text-sm font-medium mt-4 mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hier
                </div>
                <div className="space-y-1">
                    {[
                    { id: 5, user: 'Thomas Bernard', action: 'a importé', target: '150 nouveaux contacts', time: '16:42', type: 'prospect' },
                    { id: 6, user: 'Julie Robert', action: 'a modifié le ticket', target: 'TK-4865', time: '14:15', type: 'ticket' },
                    ].map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
                </div>
                
                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-center`}>
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

            {/* Middle Row: Support Tickets and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Tickets SAV Section */}
            <AnimatedCard className="lg:col-span-2 p-6" delay={0.3}>
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
                
                {/* Priority Tickets with enhanced design */}
    <div></div>
                <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    <FiAlertCircle className="w-4 h-4 text-red-500" />
                    Tickets prioritaires
                </h4>
                
                <div className="space-y-4">
                    {priorityTickets.map((ticket, index) => (
                    <motion.div
                        key={ticket.id}
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
                            style={{ width: `${ticket.progress}%` }}>
                        </div>
                        
                        <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                            darkMode 
                                ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                            {ticket.id}
                            </span>
                            <StatusBadge status={ticket.status} />
                        </div>
                        <PriorityBadge priority={ticket.priority} />
                        </div>
                        
                        <h4 className={`font-medium text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {ticket.subject}
                        </h4>
                        
                        <div className="flex justify-between items-center text-xs mb-3">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Client: <span className="font-medium">{ticket.client}</span>
                        </span>
                        <span className={`flex items-center gap-1 ${
                            ticket.priority === 'Critique' || ticket.priority === 'Haute' 
                            ? 'text-red-500' 
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <FiClock className="w-3 h-3" />
                            SLA: {ticket.sla}
                        </span>
                        </div>
                        
                        <div className={`flex justify-between items-center pt-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {ticket.agent === 'Non assigné' ? (
                            <span className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
                                Non assigné
                            </span>
                            ) : (
                            <>
                                <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700 font-bold">
    {ticket.agent.charAt(0)}
    </div>
    <span className="ml-1">{ticket.agent}</span>
    </>
    )}
    </span>

    <div className="flex gap-1.5">
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
            ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
        <FiAlertCircle className="w-3.5 h-3.5" />
    </motion.button>
    </div>
    </div>
    </motion.div>
    ))}
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
    className="relative overflow-hidden p-0" 
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

    <div className="relative p-6 text-white">
    <div className="flex justify-between items-center mb-6">
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
    
    {/* Event timeline */}
    <div className="mt-6 pt-4 border-t border-white/20">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <FiActivity className="w-4 h-4" />
        Derniers événements système
        </h4>
        <div className="space-y-3">
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
    <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold">Performance mensuelle</h4>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Mars 2025</span>
        </div>
        
        <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={callData}>
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
    
    {/* Call to action */}
    <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
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
    {/* Enhanced Tasks Section with Drag-and-Drop */}
    <AnimatedCard 
    className={`lg:col-span-2 p-6 ${
        expandedCard === 'tasks' ? 'lg:col-span-3 order-first' : ''
    }`} 
    delay={0.5}
    >
    <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
        <CircleStat 
        icon={<FiClipboard />} 
        color="#F59E0B" 
        size="sm" 
        pulse={pendingTasks > 3} 
        />
        <div>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Tâches
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
        Nouvelle
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
                }`}>Tâche</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Échéance</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Assigné à</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Statut</th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Priorité</th>
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
                    <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-4 text-sm">
                    <PriorityBadge priority={task.priority} />
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
            {['À faire', 'En cours', 'Terminées'].map((column ) => (
            <div 
                key={column} 
                className={`rounded-xl border ${
                darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}
            >
                <div className="p-3 border-b flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                    {column}
                </h4>
                <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${column === 'À faire' 
                    ? darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700' 
                    : column === 'En cours' 
                    ? darkMode ? 'bg-amber-800/30 text-amber-400' : 'bg-amber-200 text-amber-700' 
                    : darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-200 text-green-700'
                    }
                `}>
                    {taskData.filter(t => 
                    column === 'À faire' 
                        ? t.status === 'À faire' 
                        : column === 'En cours' 
                        ? t.status === 'En cours' 
                        : t.status === 'Terminée'
                    ).length}
                </span>
                </div>
                
                <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
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
                        className={`p-4 rounded-xl shadow-sm border transition-all cursor-grab active:cursor-grabbing ${
                        darkMode 
                            ? 'bg-gray-900 border-gray-700 hover:border-gray-600' 
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-2">
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
                        <PriorityBadge priority={task.priority} />
                        </div>
                        
                        <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                        {task.title}
                        </h4>
                        
                        {task.notes && (
                        <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.notes}
                        </p>
                        )}
                        
                        <div className="flex justify-between items-center text-xs">
                        <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FiClock className="w-3 h-3" />
                            {new Date(task.due).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                            })}
                        </span>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.assignee.split(' ')[0]}
                        </span>
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
                >
                    <FiPlus className="w-3.5 h-3.5" />
                    Ajouter une tâche
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
        Affichage de {urgentTasks.length} tâches sur {taskData.length}
    </div>
    <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ x: -2 }}
        className={`text-xs font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity ${
        darkMode ? 'text-amber-400' : 'text-amber-600'
        }`}
    >
        Voir toutes les tâches <FiChevronRight className="w-3 h-3" />
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
    </motion.div>
    );
}