'use client';

import { useState, ReactNode, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaEuroSign } from 'react-icons/fa6';
import { QuickActionCard } from '@/app/components/dashboard/QuickActionCard';
import { CircleStat } from '@/app/components/dashboard/CircleStat';
const WeatherWidget = React.lazy(() => import('@/app/components/dashboard/WeatherWidget').then(module => ({ default: module.WeatherWidget })));
import { TicketsSAVSection } from '@/app/components/dashboard/TicketsSAVSection';
const KalicomChatWidget = React.lazy(() => import('@/app/components/dashboard/KalicomChatWidget').then(module => ({ default: module.KalicomChatWidget })));

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
  FiChevronRight,
  FiMessageSquare,
  FiUserPlus,
  FiClipboard,
  FiClock,
  FiFileText,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCheckCircle,
  FiHeadphones,
  FiServer,
  FiTrendingUp,
  FiCpu,
  FiWifi,
  FiEye,
  FiGrid,
} from 'react-icons/fi';
import React from 'react';
import EventsSection from '@/app/components/dashboard/EventsSection';
import ChatSection from '@/app/components/dashboard/ChatSection';
const DashboardHeader = React.lazy(() => import('@/app/components/dashboard/DashboardHeader'));

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

const chatMessages: ChatMessage[] = [
  { id: 1, user: 'Emma Blanc', avatar: '/api/placeholder/30/30', message: 'Bonjour, pouvez-vous vérifier le statut du ticket TK-4868?', time: '09:32', unread: false, isOnline: true },
  { id: 2, user: 'Marc Dubois', avatar: '/api/placeholder/30/30', message: 'La démo pour Nexus Tech est confirmée pour 15h', time: '09:47', unread: true, isOnline: true },
  { id: 3, user: 'Sophie Martin', avatar: '/api/placeholder/30/30', message: 'J\'ai besoin d\'aide sur le déploiement chez Zenith', time: '10:15', unread: true, isOnline: false },
  { id: 4, user: 'Thomas Bernard', avatar: '/api/placeholder/30/30', message: 'Rapport mensuel terminé, en attente de validation', time: '10:28', unread: false, isOnline: false },
  { id: 5, user: 'Support Kalicom', avatar: '/api/placeholder/30/30', message: 'Bonjour, comment puis-je vous aider aujourd\'hui ?', time: '10:42', unread: true, isOnline: true },
];

// Activities timeline for global feed
const activitiesData: ActivityData[] = [
  { id: 1, user: 'Marc Dubois', action: 'a résolu le ticket', target: 'TK-4868', time: '10:42', type: 'ticket' },
  { id: 2, user: 'Emma Blanc', action: 'a ajouté un nouveau prospect', target: 'Gamma Solutions', time: '10:15', type: 'prospect' },
  { id: 3, user: 'Léa Martin', action: 'a terminé l\'appel avec', target: 'Acme Corp', time: '09:50', type: 'call', duration: '12:35' },
  { id: 4, user: 'Sophie Leroy', action: 'a créé une nouvelle tâche', target: 'Déploiement Zenith', time: '09:30', type: 'task' },
];

// Weather data for the location widget
const weatherData = {
  location: 'Paris',
  temperature: 18,
  condition: 'Partiellement nuageux',
  high: 21,
  low: 12
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

// Main component
export default function AccueilDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [darkMode, setDarkMode] = useState(false);
  
  // Calculate summary statistics
  const totalCalls = callData.reduce((sum, item) => sum + item.appels, 0);
  const totalTickets = ticketData.length;
  const openTickets = ticketData.filter(t => t.status !== 'Résolu').length;
  // const totalTasks = taskData.length;
  // const pendingTasks = taskData.filter(t => t.status !== 'Terminée').length;
  const totalProspects = prospectData.reduce((acc, item) => acc + item.prospects, 0);
  const unreadMessages = chatMessages.filter(m => m.unread).length;
  // const unreadNotifications = notifications.filter(n => !n.read).length;

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
            <DashboardHeader 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              totalProspects={totalProspects}
              totalTickets={totalTickets}
              openTickets={openTickets}
              chatMessagesCount={chatMessages.length}
              unreadMessages={unreadMessages}
              lastClientCount={prospectData[prospectData.length-1].clients}
            />

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
              <div className="w-full max-w-sm">
              <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
                <WeatherWidget 
                  data={weatherData} 
                  darkMode={false} 
                  onRefresh={() => console.log('Refreshing weather data')}
                />
                </Suspense>
              </div>

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
           <TicketsSAVSection 
              darkMode={darkMode}
              ticketData={ticketData}
              totalTickets={totalTickets}
              openTickets={openTickets}
            />

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
        <EventsSection />

        {/* Enhanced Chat Section with Animations */}
        <ChatSection />

    </div>
    </div>
    {/* Add Kalicom Chat Widget */}
    <Suspense fallback={<div className="skeleton-loader">Loading...</div>}>
      <KalicomChatWidget />
    </Suspense>
    </motion.div>
    );
}
