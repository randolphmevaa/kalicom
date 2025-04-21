'use client';

import { useState } from 'react';
// import Link from 'next/link';
import { 
  motion, 
  Variants, 
  AnimatePresence 
} from 'framer-motion';
import {
  FiBarChart2,
  // FiPhoneIncoming,
  // FiGlobe,
  FiActivity,
  // FiEye,
  FiUser,
  FiArrowRight,
  // FiHome,
  FiChevronRight,
  FiInfo,
  // FiPieChart,
  FiFileText,
  FiDownload,
  FiList,
  FiGrid,
  FiCalendar,
  FiPlus,
  FiFilter,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  // FiServer,
  FiUserPlus,
  FiSearch,
  FiX,
  FiTag,
  FiMessageSquare,
  // FiChevronDown,
  // FiTrash,
  FiSave,
  FiEdit
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import Image from 'next/image';

// Define types for tickets and related entities
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Nouveau' | 'En cours' | 'En attente' | 'Résolu' | 'Fermé' | 'Planifié';
  priority: 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';
  client: string;
  assignedTo?: string;
  createdAt: string;
  dueDate?: string;
  tags: string[];
  lastUpdate?: string;
}

interface Technician {
  id: string;
  name: string;
  avatar: string;
  department: string;
  ticketsAssigned: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  ticketId: string;
  status: string;
  priority: string;
}


// Status Badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, { bg: string, text: string, icon: IconType }> = {
    'Nouveau': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiAlertCircle },
    'En cours': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiActivity },
    'En attente': { bg: 'bg-purple-100', text: 'text-purple-800', icon: FiClock },
    'Planifié': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: FiCalendar },
    'Résolu': { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
    'Fermé': { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiX }
  };

  const style = statusStyles[status] || statusStyles['Nouveau'];
  const Icon = style.icon;

  return (
    <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      <Icon className="mr-1 w-3 h-3" />
      {status}
    </div>
  );
};

// Priority Badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityStyles: Record<string, { bg: string, text: string }> = {
    'Basse': { bg: 'bg-gray-100', text: 'text-gray-800' },
    'Moyenne': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Haute': { bg: 'bg-orange-100', text: 'text-orange-800' },
    'Urgente': { bg: 'bg-red-100', text: 'text-red-800' }
  };

  const style = priorityStyles[priority] || priorityStyles['Moyenne'];

  return (
    <div className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
      {priority}
    </div>
  );
};

export default function GestionTickets() {
  // State for ticket and event detail modals
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // State hooks
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month' | 'list'>('week');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ , setHoveredCard] = useState<string | null>(null);
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    client: '',
    status: 'Nouveau',
    priority: 'Moyenne',
    assignedTo: '',
    dueDate: '',
    dueTime: '10:00',
    tags: [] as string[]
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      title: 'Problème de connexion VoIP',
      description: 'Le client ne peut pas recevoir d\'appels sur son téléphone IP depuis ce matin.',
      status: 'En cours',
      priority: 'Haute',
      client: 'Société ABC',
      assignedTo: 'tech1',
      createdAt: '2025-03-28T08:30:00',
      dueDate: '2025-03-30T16:00:00',
      tags: ['VoIP', 'Connexion'],
      lastUpdate: '2025-03-29T11:45:00'
    },
    {
      id: 'TKT-002',
      title: 'Installation nouveaux postes',
      description: 'Installation et configuration de 5 nouveaux postes téléphoniques pour le service comptabilité.',
      status: 'Planifié',
      priority: 'Moyenne',
      client: 'Entreprise XYZ',
      assignedTo: 'tech2',
      createdAt: '2025-03-27T14:20:00',
      dueDate: '2025-04-02T09:00:00',
      tags: ['Installation', 'Matériel'],
      lastUpdate: '2025-03-28T16:30:00'
    },
    {
      id: 'TKT-003',
      title: 'Formation utilisateur standard téléphonique',
      description: 'Formation des nouveaux employés sur l\'utilisation du standard téléphonique et fonctionnalités avancées.',
      status: 'Nouveau',
      priority: 'Basse',
      client: 'Conseil Départemental',
      createdAt: '2025-03-29T09:15:00',
      dueDate: '2025-04-05T14:00:00',
      tags: ['Formation', 'Utilisateur'],
    },
    {
      id: 'TKT-004',
      title: 'Coupure réseau intermittente',
      description: 'Le client signale des coupures intermittentes du réseau téléphonique, principalement en début d\'après-midi.',
      status: 'En attente',
      priority: 'Urgente',
      client: 'Clinique Santé Plus',
      assignedTo: 'tech3',
      createdAt: '2025-03-26T11:05:00',
      dueDate: '2025-03-30T18:00:00',
      tags: ['Réseau', 'Diagnostic'],
      lastUpdate: '2025-03-28T15:10:00'
    },
    {
      id: 'TKT-005',
      title: 'Mise à jour firmware téléphones',
      description: 'Planification de la mise à jour du firmware sur l\'ensemble du parc téléphonique (42 appareils).',
      status: 'Résolu',
      priority: 'Moyenne',
      client: 'Mairie de Saint-Cloud',
      assignedTo: 'tech1',
      createdAt: '2025-03-25T13:45:00',
      dueDate: '2025-03-27T17:00:00',
      tags: ['Maintenance', 'Mise à jour'],
      lastUpdate: '2025-03-27T16:30:00'
    },
    {
      id: 'TKT-006',
      title: 'Problème de qualité audio',
      description: 'Le client signale une mauvaise qualité audio lors des appels entrants depuis une semaine.',
      status: 'Nouveau',
      priority: 'Haute',
      client: 'Restaurant Le Gourmet',
      createdAt: '2025-03-29T10:30:00',
      tags: ['Audio', 'Qualité'],
    },
    {
      id: 'TKT-007',
      title: 'Migration système téléphonique',
      description: 'Préparation et planification de la migration du système téléphonique vers la nouvelle plateforme.',
      status: 'En cours',
      priority: 'Haute',
      client: 'Cabinet Juridique Dumas',
      assignedTo: 'tech2',
      createdAt: '2025-03-24T09:00:00',
      dueDate: '2025-04-10T18:00:00',
      tags: ['Migration', 'Projet'],
      lastUpdate: '2025-03-28T11:20:00'
    }
  ]);
  
  // Sample data - Technicians
  const technicians: Technician[] = [
    {
      id: 'tech1',
      name: 'Thomas Dubois',
      avatar: '/api/placeholder/32/32',
      department: 'Support Niveau 2',
      ticketsAssigned: 2
    },
    {
      id: 'tech2',
      name: 'Sophie Martin',
      avatar: '/api/placeholder/32/32',
      department: 'Support Niveau 1',
      ticketsAssigned: 2
    },
    {
      id: 'tech3',
      name: 'Alexandre Petit',
      avatar: '/api/placeholder/32/32',
      department: 'Support Niveau 3',
      ticketsAssigned: 1
    },
    {
      id: 'tech4',
      name: 'Émilie Laurent',
      avatar: '/api/placeholder/32/32',
      department: 'Support Niveau 2',
      ticketsAssigned: 0
    }
  ];
  
  // Generate calendar events from tickets
  const calendarEvents: CalendarEvent[] = tickets
    .filter(ticket => ticket.dueDate)
    .map(ticket => ({
      id: `event-${ticket.id}`,
      title: ticket.title,
      start: new Date(ticket.dueDate || ''),
      end: new Date(new Date(ticket.dueDate || '').getTime() + 2 * 60 * 60 * 1000), // +2 hours
      ticketId: ticket.id,
      status: ticket.status,
      priority: ticket.priority
    }));

  // Filter tickets based on status and search query
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = !filterStatus || ticket.status === filterStatus;
    const matchesSearch = !searchQuery || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Group tickets by status for Kanban view
  const ticketsByStatus = {
    'Nouveau': filteredTickets.filter(t => t.status === 'Nouveau'),
    'En cours': filteredTickets.filter(t => t.status === 'En cours'),
    'En attente': filteredTickets.filter(t => t.status === 'En attente'),
    'Planifié': filteredTickets.filter(t => t.status === 'Planifié'),
    'Résolu': filteredTickets.filter(t => t.status === 'Résolu'),
    'Fermé': filteredTickets.filter(t => t.status === 'Fermé')
  };

  // Get monthly statistics for chart
  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    return Array.from({ length: 6 }, (_, i) => {
      const monthIdx = (currentMonth - i + 12) % 12;
      return {
        month: monthNames[monthIdx],
        nouveaux: 5 + Math.floor(Math.random() * 10),
        résolus: 4 + Math.floor(Math.random() * 8),
        enAttente: 1 + Math.floor(Math.random() * 5)
      };
    }).reverse();
  };
  
  const monthlyStats = getMonthlyStats();
  
  // Handler for creating a new ticket
  const handleCreateTicket = () => {
    // Generate new ticket ID
    const newId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    
    // Format due date with time
    const dueDateTime = newTicket.dueDate 
      ? `${newTicket.dueDate}T${newTicket.dueTime}:00` 
      : undefined;
    
    const ticketToAdd: Ticket = {
      id: newId,
      title: newTicket.title,
      description: newTicket.description,
      status: 'Nouveau' as const,
      priority: newTicket.priority as 'Basse' | 'Moyenne' | 'Haute' | 'Urgente',
      client: newTicket.client,
      assignedTo: newTicket.assignedTo || undefined,
      createdAt: new Date().toISOString(),
      dueDate: dueDateTime,
      tags: newTicket.tags
    };
    
    // Add to tickets
    setTickets([ticketToAdd, ...tickets]);
    
    // Reset form and close modal
    setNewTicket({
      title: '',
      description: '',
      client: '',
      status: 'Nouveau',
      priority: 'Moyenne',
      assignedTo: '',
      dueDate: '',
      dueTime: '10:00',
      tags: []
    });
    
    setIsCreateModalOpen(false);
  };
  
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.4 }
    }
  };
  
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: 'easeOut', duration: 0.6 }
    }
  };

  // Function to open ticket details
  const openTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };
  
  // Function to open event details
  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className=""
    >
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pb-12">
        {/* Breadcrumbs */}
        {/* <Breadcrumbs items={['PBX', 'Gestion des Tickets Support']} /> */}

        {/* ---------- HEADER / HERO SECTION ---------- */}
        <motion.div
          variants={headerVariants}
          className="relative mb-8 overflow-hidden backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-gray-100"
        >
          {/* Background gradient with pattern */}
          <div 
            className="absolute inset-0 opacity-5 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#004AC8]/10 via-white/70 to-[#4BB2F6]/10 rounded-3xl pointer-events-none" />

          {/* Blurred circles for decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#004AC8]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4BB2F6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative p-8 z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="max-w-2xl">
                {/* Title with decorative elements */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#004AC8]/10 rounded-lg">
                    <FiMessageSquare className="w-6 h-6 text-[#004AC8]" />
                  </div>
                  <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                    Gestion des Tickets Support
                  </h1>
                  <span className="px-2 py-1 text-xs font-medium text-[#004AC8] bg-[#004AC8]/10 rounded-full">
                    {tickets.length} tickets
                  </span>
                </div>
                
                <p className="text-base text-gray-600 leading-relaxed">
                  Gérez les demandes d&apos;assistance technique, suivez l&apos;avancement des interventions et consultez 
                  les performances du service après-vente.
                </p>
              </div>
              
              <div className="flex space-x-4">
                {/* Create Ticket Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center px-5 py-2.5 bg-[#004AC8] text-white rounded-xl hover:bg-[#003BA0] transition shadow-md shadow-blue-500/20"
                >
                  <FiPlus className="mr-2" />
                  Créer un ticket
                </motion.button>
              </div>
            </div>
            
            {/* Filter and search section */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
                <button 
                  onClick={() => setFilterStatus(null)} 
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${!filterStatus ? 'bg-[#004AC8] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Tous
                </button>
                {['Nouveau', 'En cours', 'En attente', 'Planifié', 'Résolu', 'Fermé'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition whitespace-nowrap ${filterStatus === status ? 'bg-[#004AC8] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-3 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004AC8]/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-1 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                    title="Vue liste"
                  >
                    <FiList size={20} className={viewMode === 'list' ? 'text-[#004AC8]' : 'text-gray-500'} />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 ${viewMode === 'kanban' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
                    title="Vue kanban"
                  >
                    <FiGrid size={20} className={viewMode === 'kanban' ? 'text-[#004AC8]' : 'text-gray-500'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <div className="text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tickets List / Kanban */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-[600px] transition-all duration-300 hover:shadow-xl">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 mr-2">
                    <FiMessageSquare size={18} />
                  </span>
                  Tickets SAV
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="text-gray-500 text-sm bg-gray-100 py-1 px-2.5 rounded-full font-medium">
                    {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                  </div>
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <FiFilter size={16} />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                      <div className="p-2 text-xs text-gray-500">Options de filtrage avancées</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(600px-57px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* List View */}
                {viewMode === 'list' && (
                  <motion.div 
                    variants={containerVariants}
                    className="divide-y divide-gray-100"
                  >
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <motion.div
                          key={ticket.id}
                          variants={cardVariants}
                          whileHover={{ backgroundColor: '#f9fafb', y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className="p-4 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-l-blue-500 hover:shadow-md"
                          onHoverStart={() => setHoveredCard(ticket.id)}
                          onHoverEnd={() => setHoveredCard(null)}
                          onClick={() => openTicketDetails(ticket)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div 
                                className={`w-2 h-10 rounded-full ${
                                  ticket.priority === 'Urgente' ? 'bg-red-500' :
                                  ticket.priority === 'Haute' ? 'bg-orange-500' :
                                  ticket.priority === 'Moyenne' ? 'bg-blue-500' :
                                  'bg-gray-300'
                                }`}
                              />
                              <div>
                                <div className="flex items-center">
                                  <span className="text-xs font-medium text-gray-500 mr-2">{ticket.id}</span>
                                  <h3 className="font-medium text-gray-900 truncate max-w-xs">{ticket.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate max-w-sm">{ticket.description}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <StatusBadge status={ticket.status} />
                                  <PriorityBadge priority={ticket.priority} />
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FiUser className="mr-1" size={12} />
                                    {ticket.client}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end text-xs text-gray-500">
                              <div className="mb-2">
                                {ticket.assignedTo ? (
                                  <div className="flex items-center">
                                    <Image
                                      src={technicians.find(t => t.id === ticket.assignedTo)?.avatar || '/api/placeholder/24/24'} 
                                      alt="Avatar" 
                                      className="w-6 h-6 rounded-full mr-1"
                                    />
                                    <span>{technicians.find(t => t.id === ticket.assignedTo)?.name}</span>
                                  </div>
                                ) : (
                                  <span className="italic">Non assigné</span>
                                )}
                              </div>
                              <div>
                                {ticket.dueDate && (
                                  <span className="flex items-center">
                                    <FiClock size={12} className="mr-1" />
                                    {new Date(ticket.dueDate).toLocaleDateString('fr-FR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-gray-500">
                        <FiInfo className="mx-auto mb-2" size={24} />
                        <p>Aucun ticket ne correspond à vos critères</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Kanban View */}
                {viewMode === 'kanban' && (
                  <div className="flex overflow-x-auto p-3 min-h-[520px] pb-4">
                    {Object.entries(ticketsByStatus).map(([status, statusTickets]) => (
                      <div key={status} className="flex-shrink-0 w-80 mx-2 first:ml-0 last:mr-0">
                        <div className="bg-gray-50 rounded-xl p-3 h-full">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-700 flex items-center">
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                status === 'Nouveau' ? 'bg-blue-500' :
                                status === 'En cours' ? 'bg-yellow-500' :
                                status === 'En attente' ? 'bg-purple-500' :
                                status === 'Résolu' ? 'bg-green-500' :
                                'bg-gray-500'
                              }`}></span>
                              {status}
                            </h3>
                            <span className="text-xs font-medium bg-white text-gray-500 px-2 py-1 rounded-full">
                              {statusTickets.length}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <AnimatePresence>
                              {statusTickets.map((ticket) => (
                                <motion.div
                                  key={ticket.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  whileHover={{ y: -3, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)' }}
                                  whileTap={{ scale: 0.98 }}
                                  className="bg-white p-3 rounded-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:border-blue-200"
                                  drag
                                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                  dragElastic={0.1}
                                  onClick={() => openTicketDetails(ticket)}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="text-xs font-medium text-gray-500">{ticket.id}</span>
                                    <PriorityBadge priority={ticket.priority} />
                                  </div>
                                  <h4 className="font-medium text-gray-900 text-sm mt-1">{ticket.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{ticket.description}</p>
                                  
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                                    <div className="flex items-center">
                                      {ticket.assignedTo ? (
                                        <Image
                                          src={technicians.find(t => t.id === ticket.assignedTo)?.avatar || '/api/placeholder/24/24'} 
                                          alt="Avatar" 
                                          className="w-5 h-5 rounded-full"
                                          title={technicians.find(t => t.id === ticket.assignedTo)?.name}
                                        />
                                      ) : (
                                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                          <FiUser size={10} className="text-gray-500" />
                                        </span>
                                      )}
                                    </div>
                                    {ticket.dueDate && (
                                      <span className="text-xs text-gray-500 flex items-center">
                                        <FiClock size={10} className="mr-1" />
                                        {new Date(ticket.dueDate).toLocaleDateString('fr-FR')}
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-[600px] transition-all duration-300 hover:shadow-xl">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 mr-2">
                    <FiCalendar size={18} />
                  </span>
                  Calendrier
                </h2>
                <div className="flex space-x-1 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => setCalendarView('day')}
                    className={`p-1.5 text-xs ${calendarView === 'day' ? 'bg-[#004AC8] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                  >
                    Jour
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`p-1.5 text-xs ${calendarView === 'week' ? 'bg-[#004AC8] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`p-1.5 text-xs ${calendarView === 'month' ? 'bg-[#004AC8] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => setCalendarView('list')}
                    className={`p-1.5 text-xs ${calendarView === 'list' ? 'bg-[#004AC8] text-white' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                  >
                    Liste
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(600px-57px)]">
                {/* Sample Calendar UI */}
                {calendarView === 'day' && (
                  <div className="p-4">
                    <div className="text-center mb-4 relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3 px-6 rounded-xl inline-block shadow-sm border border-blue-100"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">30 Mars 2025</h3>
                        <p className="text-sm text-gray-500">Dimanche</p>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-8 h-1 bg-blue-500 rounded-full"></div>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      {calendarEvents
                        .filter(e => e.start.toDateString() === new Date().toDateString())
                        .map(event => (
                          <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                            className={`p-3 rounded-lg border-l-4 shadow-sm transition-all duration-200 ${
                              event.priority === 'Urgente' ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-white' :
                              event.priority === 'Haute' ? 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-white' :
                              event.priority === 'Moyenne' ? 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white' :
                              'border-l-gray-500 bg-gradient-to-r from-gray-50 to-white'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{event.ticketId}</p>
                              </div>
                              <StatusBadge status={event.status} />
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <FiClock className="mr-1" size={14} />
                              {event.start.getHours().toString().padStart(2, '0')}:
                              {event.start.getMinutes().toString().padStart(2, '0')} - 
                              {event.end.getHours().toString().padStart(2, '0')}:
                              {event.end.getMinutes().toString().padStart(2, '0')}
                            </div>
                          </motion.div>
                        ))}
                        
                        {calendarEvents.filter(e => e.start.toDateString() === new Date().toDateString()).length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            Aucun ticket programmé aujourd&apos;hui
                          </div>
                        )}
                    </div>
                  </div>
                )}
                
                {calendarView === 'week' && (
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Semaine du 24 - 30 Mars 2025</h3>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - date.getDay() + i + 1);
                        const isToday = date.toDateString() === new Date().toDateString();
                        
                        return (
                          <div 
                            key={i}
                            className={`text-center py-1 ${isToday ? 'bg-blue-100 text-blue-800 rounded-full' : ''}`}
                          >
                            <span className="text-sm">{date.getDate()}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="space-y-3">
                      {calendarEvents
                        .filter(e => {
                          const now = new Date();
                          const weekStart = new Date(now);
                          weekStart.setDate(now.getDate() - now.getDay() + 1);
                          const weekEnd = new Date(now);
                          weekEnd.setDate(now.getDate() - now.getDay() + 7);
                          
                          return e.start >= weekStart && e.start <= weekEnd;
                        })
                        .map(event => (
                          <div 
                            key={event.id}
                            className={`p-3 rounded-lg border-l-4 ${
                              event.priority === 'Urgente' ? 'border-l-red-500 bg-red-50' :
                              event.priority === 'Haute' ? 'border-l-orange-500 bg-orange-50' :
                              event.priority === 'Moyenne' ? 'border-l-blue-500 bg-blue-50' :
                              'border-l-gray-500 bg-gray-50'
                            }`}
                            onClick={() => openEventDetails(event)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full mr-2">
                                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][event.start.getDay()]}
                                  </span>
                                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.ticketId}</p>
                              </div>
                              <StatusBadge status={event.status} />
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                              <FiClock className="mr-1" size={14} />
                              {event.start.getHours().toString().padStart(2, '0')}:
                              {event.start.getMinutes().toString().padStart(2, '0')}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                {calendarView === 'month' && (
                  <div className="p-4">
                    <div className="text-center mb-6 relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 py-3 px-6 rounded-xl inline-block shadow-sm border border-blue-100"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">Mars 2025</h3>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-8 h-1 bg-blue-500 rounded-full"></div>
                      </motion.div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 py-1 border-b border-gray-100">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {Array.from({ length: 31 }, (_, i) => {
                        const date = new Date(2025, 2, i + 1); // March 2025
                        const isToday = date.getDate() === 30; // Current day is 30th
                        const hasEvents = calendarEvents.some(
                          e => e.start.getDate() === date.getDate() && 
                          e.start.getMonth() === date.getMonth()
                        );
                        
                        if (date.getMonth() !== 2) return <div key={i} className="py-4"></div>; // Skip days not in March
                        
                        const matchingEvents = calendarEvents.filter(
                          e => e.start.getDate() === date.getDate() && 
                          e.start.getMonth() === date.getMonth()
                        );
                        
                        return (
                          <motion.div
                            key={i}
                            whileHover={hasEvents ? { scale: 1.05, backgroundColor: '#f0f9ff' } : {}}
                            className={`
                              text-center py-3 px-1 relative cursor-pointer rounded-lg border transition-all duration-200
                              ${isToday ? 'bg-blue-100 text-blue-800 font-medium border-blue-300 shadow-sm' : 'border-gray-100 hover:border-blue-200'}
                              ${hasEvents ? 'hover:shadow-md' : ''}
                            `}
                            onClick={() => matchingEvents.length > 0 && openEventDetails(matchingEvents[0])}
                          >
                            <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>{date.getDate()}</span>
                            {hasEvents && (
                              <div className="flex justify-center mt-1 space-x-1">
                                {matchingEvents.slice(0, 3).map((event, index) => (
                                  <div 
                                    key={index} 
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      event.priority === 'Urgente' ? 'bg-red-500' :
                                      event.priority === 'Haute' ? 'bg-orange-500' :
                                      event.priority === 'Moyenne' ? 'bg-blue-500' :
                                      'bg-gray-400'
                                    }`}
                                  ></div>
                                ))}
                                {matchingEvents.length > 3 && (
                                  <div className="text-xs text-blue-500 font-medium">+{matchingEvents.length - 3}</div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3 mt-5">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-800">Prochains tickets</h4>
                        <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                          Voir tout <FiChevronRight size={14} />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-24 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                        {calendarEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="text-sm flex items-start gap-2 py-1">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${
                              event.priority === 'Urgente' ? 'bg-red-500' :
                              event.priority === 'Haute' ? 'bg-orange-500' :
                              event.priority === 'Moyenne' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }`}></div>
                            <div>
                                                              <div className="font-medium">{event.title}</div>
                              <div className="text-xs text-gray-500">
                                {event.start.toLocaleDateString('fr-FR')} à {event.start.getHours().toString().padStart(2, '0')}:
                                {event.start.getMinutes().toString().padStart(2, '0')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {calendarView === 'list' && (
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Tickets à venir</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Group by date */}
                      {Array.from(new Set(calendarEvents.map(e => e.start.toDateString()))).map(dateString => {
                        const date = new Date(dateString);
                        const events = calendarEvents.filter(e => e.start.toDateString() === dateString);
                        
                        return (
                          <div key={dateString}>
                            <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                              <h4 className="font-medium text-gray-700">
                                {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                              </h4>
                            </div>
                            <div className="space-y-2 mt-2">
                              {events.map(event => (
                                <div 
                                  key={event.id}
                                  className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                                >
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                                    <StatusBadge status={event.status} />
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">{event.ticketId}</div>
                                  <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <FiClock className="mr-1" size={14} />
                                    {event.start.getHours().toString().padStart(2, '0')}:
                                    {event.start.getMinutes().toString().padStart(2, '0')} - 
                                    {event.end.getHours().toString().padStart(2, '0')}:
                                    {event.end.getMinutes().toString().padStart(2, '0')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* ---------- STATISTICS SECTION ---------- */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -3 }}
        >
          <div className="text-gray-500 p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 text-green-600 mr-2">
                <FiBarChart2 size={18} />
              </span>
              Statistiques SAV
            </h2>
            <div className="flex items-center space-x-4">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#004AC8]/40">
                <option>6 derniers mois</option>
                <option>3 derniers mois</option>
                <option>12 derniers mois</option>
              </select>
              <button className="text-sm text-[#004AC8] hover:text-[#003BA0] flex items-center">
                <FiDownload className="mr-1" /> Exporter
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.15)' }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-md border border-blue-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-blue-500/10 w-20 h-20 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 bg-blue-500/10 w-16 h-16 rounded-full -ml-8 -mb-8"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-blue-600 font-medium mb-1">Tickets totaux</div>
                    <div className="text-3xl font-bold text-gray-900">64</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiBarChart2 className="text-blue-500" size={20} />
                  </div>
                </div>
                <div className="text-sm text-blue-700 mt-3 flex items-center font-medium">
                  <FiArrowRight className="mr-1" size={14} /> +12% vs mois précédent
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)' }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-md border border-green-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-green-500/10 w-20 h-20 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 bg-green-500/10 w-16 h-16 rounded-full -ml-8 -mb-8"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-green-600 font-medium mb-1">Tickets résolus</div>
                    <div className="text-3xl font-bold text-gray-900">42</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiCheckCircle className="text-green-500" size={20} />
                  </div>
                </div>
                <div className="text-sm text-green-700 mt-3 flex items-center font-medium">
                  <FiArrowRight className="mr-1" size={14} /> 65% taux de résolution
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(245, 158, 11, 0.15)' }}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 shadow-md border border-yellow-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-yellow-500/10 w-20 h-20 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 bg-yellow-500/10 w-16 h-16 rounded-full -ml-8 -mb-8"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-yellow-600 font-medium mb-1">Temps moyen</div>
                    <div className="text-3xl font-bold text-gray-900">2,3 j</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiClock className="text-yellow-500" size={20} />
                  </div>
                </div>
                <div className="text-sm text-yellow-700 mt-3 flex items-center font-medium">
                  <FiArrowRight className="mr-1" size={14} /> -0,5 jour vs mois précédent
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(139, 92, 246, 0.15)' }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-md border border-purple-200 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-purple-500/10 w-20 h-20 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 bg-purple-500/10 w-16 h-16 rounded-full -ml-8 -mb-8"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-purple-600 font-medium mb-1">Satisfaction</div>
                    <div className="text-3xl font-bold text-gray-900">4,7/5</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FiUser className="text-purple-500" size={20} />
                  </div>
                </div>
                <div className="text-sm text-purple-700 mt-3 flex items-center font-medium">
                  <FiArrowRight className="mr-1" size={14} /> Basé sur 38 évaluations
                </div>
              </motion.div>
            </div>
            
            {/* Chart */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 relative h-96 shadow-md">
              {/* Decorative elements */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <div className="absolute left-0 bottom-0 w-24 h-24 bg-green-500/5 rounded-full -ml-5 -mb-5 blur-xl"></div>
              
              <div className="absolute top-6 left-6">
                <h3 className="text-base font-bold text-gray-800">Evolution des tickets sur 6 mois</h3>
                <p className="text-sm text-gray-500">Tendances de résolution et création</p>
              </div>
              
              {/* This is a placeholder for the chart - in a real implementation you'd use a library like Chart.js or Recharts */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full h-full pt-12">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <div>Nombre de tickets</div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                        <span>Nouveaux</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>Résolus</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                        <span>En attente</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative h-64 mt-6">
                    {/* Y-axis */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-500">
                      <div>25</div>
                      <div>20</div>
                      <div>15</div>
                      <div>10</div>
                      <div>5</div>
                      <div>0</div>
                    </div>
                    
                    {/* Chart content */}
                    <div className="absolute left-12 right-0 top-0 bottom-0">
                      <div className="h-full flex items-end">
                        {monthlyStats.map((month, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                            {/* Bars */}
                            <div className="w-14 relative h-56 group">
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 whitespace-nowrap">
                                <div className="flex items-center mb-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                  <span>Nouveaux: {month.nouveaux}</span>
                                </div>
                                <div className="flex items-center mb-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  <span>Résolus: {month.résolus}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                  <span>En attente: {month.enAttente}</span>
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45"></div>
                              </div>
                            
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(month.nouveaux / 25) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="absolute bottom-0 left-0 w-3 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-lg overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-white opacity-20 w-full h-1/3 blur-md"></div>
                              </motion.div>
                              
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(month.résolus / 25) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                                className="absolute bottom-0 left-5 w-3 bg-gradient-to-t from-green-600 to-green-400 rounded-t shadow-lg overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-white opacity-20 w-full h-1/3 blur-md"></div>
                              </motion.div>
                              
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(month.enAttente / 25) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 + 0.4 }}
                                className="absolute bottom-0 left-10 w-3 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t shadow-lg overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-white opacity-20 w-full h-1/3 blur-md"></div>
                              </motion.div>
                            </div>
                            
                            {/* X-axis labels */}
                            <div className="text-xs font-medium text-gray-500">
                              {month.month}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Horizontal grid lines */}
                      <div className="absolute left-0 right-0 top-0 h-full">
                        {[0, 1, 2, 3, 4, 5].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute left-0 right-0 border-t border-gray-200"
                            style={{ top: `${i * 20}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---------- TICKET DETAILS MODAL ---------- */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 1), rgba(249, 250, 251, 0.8))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-blue-100 to-indigo-50 rounded-full opacity-70 blur-3xl -mr-20 -mt-20 z-0"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-blue-50 to-indigo-50 rounded-full opacity-70 blur-3xl -ml-20 -mb-20 z-0"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div 
                      className={`w-3 h-16 rounded-full ${
                        selectedTicket.priority === 'Urgente' ? 'bg-gradient-to-b from-red-400 to-red-600' :
                        selectedTicket.priority === 'Haute' ? 'bg-gradient-to-b from-orange-400 to-orange-600' :
                        selectedTicket.priority === 'Moyenne' ? 'bg-gradient-to-b from-blue-400 to-blue-600' :
                        'bg-gradient-to-b from-gray-400 to-gray-600'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1 flex-wrap">
                        <span className="text-sm font-medium text-gray-500 mr-2 bg-gray-100 px-2 py-0.5 rounded-lg">
                          {selectedTicket.id}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 mr-3">{selectedTicket.title}</h2>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={selectedTicket.status} />
                          <PriorityBadge priority={selectedTicket.priority} />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mt-2">{selectedTicket.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedTicket.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            <FiTag className="mr-1" size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ rotate: 90, backgroundColor: '#EEF2FF' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-b border-gray-100 bg-gray-50/80 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <FiUser className="mr-1.5 text-gray-400" size={14} /> Client
                    </h3>
                    <p className="text-gray-900 font-medium">{selectedTicket.client}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <FiUserPlus className="mr-1.5 text-gray-400" size={14} /> Assigné à
                    </h3>
                    {selectedTicket.assignedTo ? (
                      <div className="flex items-center">
                        <Image
                          src={technicians.find(t => t.id === selectedTicket.assignedTo)?.avatar || '/api/placeholder/24/24'} 
                          alt="Avatar" 
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span className="text-gray-900 font-medium">
                          {technicians.find(t => t.id === selectedTicket.assignedTo)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Non assigné</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <FiClock className="mr-1.5 text-gray-400" size={14} /> Dates
                    </h3>
                    <div className="flex flex-col text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Créé:</span>
                        <span className="text-gray-900">{new Date(selectedTicket.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {selectedTicket.dueDate && (
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Échéance:</span>
                          <span className="text-gray-900">{new Date(selectedTicket.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {selectedTicket.lastUpdate && (
                        <div className="flex justify-between mt-1">
                          <span className="text-gray-600">Dernière mise à jour:</span>
                          <span className="text-gray-900">{new Date(selectedTicket.lastUpdate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FiMessageSquare className="mr-2 text-blue-500" size={18} /> 
                    Commentaires
                  </h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <FiPlus className="mr-1" size={14} /> Ajouter commentaire
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Sample comments - in a real app these would come from the database */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img src="/api/placeholder/32/32" alt="Avatar" className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">Alexandre Petit</div>
                          <div className="text-xs text-gray-500">Support Niveau 3</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">
                      J&apos;ai effectué un premier diagnostic du problème. Il semble que ce soit lié à une configuration réseau incorrecte. Je prévois d&apos;effectuer des tests supplémentaires demain.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <FiX className="mr-1.5" size={16} /> Fermer
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 4px 8px rgba(0, 74, 200, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-1.5" size={16} /> Modifier ticket
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ---------- CALENDAR EVENT DETAILS MODAL ---------- */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
              style={{
                background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 1), rgba(249, 250, 251, 0.8))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Decorative elements */}
              <div 
                className={`absolute top-0 left-0 right-0 h-24 ${
                  selectedEvent.priority === 'Urgente' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                  selectedEvent.priority === 'Haute' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                  selectedEvent.priority === 'Moyenne' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  'bg-gradient-to-r from-gray-500 to-slate-500'
                } opacity-90`}
              >
                <div className="absolute inset-0 mix-blend-overlay opacity-20" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>
              
              <div className="pt-16 px-6 pb-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-lg px-3 py-1.5 text-sm font-medium inline-block mb-3">
                      {new Date(selectedEvent.start).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <h2 className="text-gray-500 text-xl font-bold drop-shadow-md">{selectedEvent.title}</h2>
                    <div className="flex items-center mt-2 space-x-3">
                      <StatusBadge status={selectedEvent.status} />
                      <span className="text-gray-500 flex items-center text-sm">
                        <FiClock className="mr-1" size={14} />
                        {new Date(selectedEvent.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(selectedEvent.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-full text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-white relative z-10">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <FiFileText className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Détails du ticket</h3>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.ticketId}
                    </p>
                  </div>
                </div>
                
                {/* Ticket info from linked ticket */}
                {tickets.find(ticket => ticket.id === selectedEvent.ticketId) && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">
                          {tickets.find(ticket => ticket.id === selectedEvent.ticketId)?.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tickets.find(ticket => ticket.id === selectedEvent.ticketId)?.description}
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Afficher
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Technicien assigné</h3>
                  {tickets.find(ticket => ticket.id === selectedEvent.ticketId)?.assignedTo ? (
                    <div className="flex items-center">
                      <img 
                        src={technicians.find(t => t.id === tickets.find(ticket => ticket.id === selectedEvent.ticketId)?.assignedTo)?.avatar || '/api/placeholder/32/32'} 
                        alt="Avatar" 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-gray-900">
                        {technicians.find(t => t.id === tickets.find(ticket => ticket.id === selectedEvent.ticketId)?.assignedTo)?.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">Non assigné</span>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center"
                    onClick={() => {
                      setSelectedEvent(null);
                      const ticket = tickets.find(ticket => ticket.id === selectedEvent.ticketId);
                      if (ticket) setSelectedTicket(ticket);
                    }}
                  >
                    <FiEdit className="mr-1.5" size={16} /> Modifier ticket
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Fermer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="text-gray-500 p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <FiPlus className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-[#1B0353] to-[#4BB2F6]">
                      Créer un nouveau ticket
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du ticket
                    </label>
                    <input
                      type="text"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Problème de connexion téléphonique"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Décrivez le problème en détail..."
                    ></textarea>
                  </div>
                  
                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <input
                      type="text"
                      value={newTicket.client}
                      onChange={(e) => setNewTicket({...newTicket, client: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du client ou entreprise"
                    />
                  </div>
                  
                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date d&apos;échéance
                      </label>
                      <input
                        type="date"
                        value={newTicket.dueDate}
                        onChange={(e) => setNewTicket({...newTicket, dueDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heure
                      </label>
                      <input
                        type="time"
                        value={newTicket.dueTime}
                        onChange={(e) => setNewTicket({...newTicket, dueTime: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Priority & Assigned To */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité
                      </label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Basse">Basse</option>
                        <option value="Moyenne">Moyenne</option>
                        <option value="Haute">Haute</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigné à
                      </label>
                      <select
                        value={newTicket.assignedTo}
                        onChange={(e) => setNewTicket({...newTicket, assignedTo: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Non assigné</option>
                        {technicians.map(tech => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} ({tech.department})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: téléphonie, voip, configuration"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setNewTicket({
                        ...newTicket, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                    />
                    {newTicket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTicket.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            <FiTag className="mr-1" size={10} />
                            {tag}
                            <button 
                              className="ml-1 text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                const newTags = [...newTicket.tags];
                                newTags.splice(index, 1);
                                setNewTicket({...newTicket, tags: newTags});
                              }}
                            >
                              <FiX size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition shadow-sm"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0, 74, 200, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateTicket}
                  className={`px-5 py-2.5 bg-gradient-to-r from-[#004AC8] to-[#4BB2F6] text-white rounded-xl transition flex items-center shadow-md ${
                    (!newTicket.title || !newTicket.client) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#003BA0]'
                  }`}
                  disabled={!newTicket.title || !newTicket.client}
                >
                  <FiSave className="mr-2" />
                  Enregistrer le ticket
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}