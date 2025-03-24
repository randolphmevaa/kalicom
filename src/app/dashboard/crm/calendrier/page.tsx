'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  Clock,
  Users,
  User,
  FileText,
  Phone,
  CheckSquare,
  Search,
  X,
  Tag,
  MapPin,
  Copy,
  Repeat,
  Trash,
  Edit,
  Move,
  MoreHorizontal,
  Zap,
  Share,
  Bell,
  AlertCircle,
  Paperclip,
  CheckCircle,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Save,
  Keyboard,
  Printer
} from 'lucide-react';

// Event type definition
type Event = {
  id: number;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: 'appel' | 'reunion' | 'demo' | 'tache' | 'formation';
  assignedTo: string;
  group: string;
  color?: string;
  location?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  notes?: string;
  attachments?: number;
  attendees?: string[];
  reminders?: {time: number; unit: 'minute' | 'hour' | 'day'}[];
  weather?: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
    temperature: number;
  };
  tags?: number[];
  status?: 'confirmed' | 'tentative' | 'cancelled';
};

// Filter type definition
type FilterType = {
  group: string;
  assignee: string;
  eventType: string;
  searchQuery: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  priority: string;
  showCompleted: boolean;
  tags: number[];
  status?: 'all' | 'confirmed' | 'tentative' | 'cancelled';
  periodStart?: Date;
  periodEnd?: Date;
};

// Initial setup for a draggable event
interface DragInfo {
  event: Event | null;
  isDragging: boolean;
  startPosition: {x: number; y: number} | null;
}

export default function Calendrier() {
  // State for calendar
  const [currentView, setCurrentView] = useState('mois');
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [dragInfo, setDragInfo] = useState<DragInfo>({
    event: null,
    isDragging: false,
    startPosition: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<string[]>([]);
  
  // References
  const dragRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Effect for simulating loading state for demo purposes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currentView, currentDate]);

  // Effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch(e.key) {
        case 't':
        case 'T':
          goToToday();
          break;
        case 'j':
        case 'J':
          setCurrentView('jour');
          break;
        case 's':
        case 'S':
          setCurrentView('semaine');
          break;
        case 'm':
        case 'M':
          setCurrentView('mois');
          break;
        case 'a':
        case 'A':
          setCurrentView('agenda');
          break;
        case 'p':
        case 'P':
          setCurrentView('planning');
          break;
        case 'c':
        case 'C':
          setShowQuickAdd(true);
          break;
        case 'f':
        case 'F':
          setShowFilters(prev => !prev);
          break;
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) {
            previousPeriod();
          }
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) {
            nextPeriod();
          }
          break;
        case 'Escape':
          if (showEventModal) {
            setShowEventModal(false);
          } else if (showFilters) {
            setShowFilters(false);
          } else if (showQuickAdd) {
            setShowQuickAdd(false);
          } else if (showKeyboardShortcuts) {
            setShowKeyboardShortcuts(false);
          }
          break;
        case 'k':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowKeyboardShortcuts(prev => !prev);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEventModal, showFilters, showQuickAdd, showKeyboardShortcuts]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (calendarRef.current?.requestFullscreen) {
        calendarRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle hiding elements
  const toggleElementVisibility = (element: string) => {
    setHiddenElements(prev => 
      prev.includes(element) 
        ? prev.filter(el => el !== element) 
        : [...prev, element]
    );
  };

  // Month names in French
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  // Day names in French
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  // Current month and year
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'mois') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'semaine') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'jour') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === 'planning' || currentView === 'agenda') {
      newDate.setDate(newDate.getDate() - 14);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'mois') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'semaine') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'jour') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === 'planning' || currentView === 'agenda') {
      newDate.setDate(newDate.getDate() + 14);
    }
    setCurrentDate(newDate);
  };

  // Calendar generation helpers
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthCalendar = (targetDate = currentDate) => {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Adjust for Sunday as first day (0) to Monday as first day (1)
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    
    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = 0; i < firstDay; i++) {
      days.push({
        day: daysInPrevMonth - firstDay + i + 1,
        currentMonth: false,
        date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - firstDay + i + 1)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days to fill out the calendar grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(nextMonthYear, nextMonth, i)
      });
    }
    
    return days;
  };

  // Function to generate week days
  const generateWeekDays = () => {
    const startDate = new Date(currentDate);
    // Set to Monday of the current week
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDays.push({
        day: date.getDate(),
        date: date,
        dayName: dayNames[i]
      });
    }
    
    return weekDays;
  };

  // Sample tags data
  const tags = [
    { id: 1, name: 'Important', color: '#ef4444' },
    { id: 2, name: 'Personnel', color: '#3b82f6' },
    { id: 3, name: 'Client', color: '#10b981' },
    { id: 4, name: 'Projet Alpha', color: '#8b5cf6' },
    { id: 5, name: 'Finance', color: '#f59e0b' },
    { id: 6, name: 'Réunion d\'équipe', color: '#0ea5e9' },
    { id: 7, name: 'Démo', color: '#ec4899' },
    { id: 8, name: 'Formation', color: '#14b8a6' },
  ];

  // Sample events data with more details
  const events: Event[] = [
    { 
      id: 1, 
      title: 'Appel avec Marie Dupont',
      description: 'Discuter des nouveaux besoins pour le projet Alpha',
      date: new Date(2025, 2, 10, 14, 30), 
      endDate: new Date(2025, 2, 10, 15, 0),
      type: 'appel',
      assignedTo: 'Jean Martin',
      group: 'Ventes',
      location: 'Zoom',
      priority: 'high',
      attendees: ['Marie Dupont', 'Jean Martin', 'Thomas Bernard'],
      notes: 'Préparer la démo de la nouvelle interface',
      reminders: [{ time: 15, unit: 'minute' }],
      weather: { condition: 'sunny', temperature: 22 },
      tags: [1, 3, 4],
      status: 'confirmed'
    },
    { 
      id: 2, 
      title: 'Réunion équipe marketing',
      description: 'Planification de la campagne Q2',
      date: new Date(2025, 2, 12, 10, 0), 
      endDate: new Date(2025, 2, 12, 11, 30),
      type: 'reunion',
      assignedTo: 'Sophie Leclerc',
      group: 'Marketing',
      location: 'Salle Bleue',
      isRecurring: true,
      recurringPattern: 'Chaque mardi',
      priority: 'medium',
      attendees: ['Sophie Leclerc', 'Marc Dubois', 'Emilie Laurent'],
      reminders: [{ time: 1, unit: 'hour' }, { time: 15, unit: 'minute' }],
      attachments: 2,
      weather: { condition: 'cloudy', temperature: 18 },
      tags: [6],
      status: 'confirmed'
    },
    { 
      id: 3, 
      title: 'Démo produit pour Nexus Tech',
      description: 'Présentation des nouvelles fonctionnalités de la version 2.0',
      date: new Date(2025, 2, 15, 11, 30), 
      endDate: new Date(2025, 2, 15, 12, 30),
      type: 'demo',
      assignedTo: 'Thomas Bernard',
      group: 'Produit',
      location: 'Microsoft Teams',
      priority: 'high',
      attendees: ['Thomas Bernard', 'Julien Petit', 'Client Nexus Tech'],
      reminders: [{ time: 1, unit: 'day' }, { time: 1, unit: 'hour' }],
      attachments: 3,
      weather: { condition: 'rainy', temperature: 15 },
      tags: [1, 3, 7],
      status: 'confirmed'
    },
    { 
      id: 4, 
      title: 'Suivre proposition Zenith SA',
      description: 'Vérifier le statut et relancer si nécessaire',
      date: new Date(2025, 2, 8, 9, 0), 
      type: 'tache',
      assignedTo: 'Sophie Leclerc',
      group: 'Ventes',
      priority: 'medium',
      completed: true,
      notes: 'Contrat signé le 7 mars',
      weather: { condition: 'cloudy', temperature: 17 },
      tags: [3],
      status: 'confirmed'
    },
    { 
      id: 5, 
      title: 'Formation CRM nouveaux collaborateurs',
      description: 'Session d\'onboarding pour les nouveaux employés',
      date: new Date(2025, 2, 20, 14, 0), 
      endDate: new Date(2025, 2, 20, 17, 0),
      type: 'formation',
      assignedTo: 'Jean Martin',
      group: 'RH',
      location: 'Salle de formation',
      priority: 'low',
      attendees: ['Jean Martin', 'Nouveaux employés (5)'],
      attachments: 1,
      notes: 'Préparer documentation et exercices pratiques',
      reminders: [{ time: 1, unit: 'day' }],
      weather: { condition: 'sunny', temperature: 23 },
      tags: [8],
      status: 'confirmed'
    },
    { 
      id: 6, 
      title: 'Révision du contrat GlobalTech',
      description: 'Passer en revue les conditions avec l\'équipe juridique',
      date: new Date(2025, 2, 18, 11, 0), 
      endDate: new Date(2025, 2, 18, 12, 0),
      type: 'reunion',
      assignedTo: 'Jean Martin',
      group: 'Ventes',
      location: 'Salle Rouge',
      priority: 'high',
      attendees: ['Jean Martin', 'Marie Dupont', 'Conseiller juridique'],
      attachments: 4,
      weather: { condition: 'stormy', temperature: 14 },
      tags: [1, 3],
      status: 'confirmed'
    },
    { 
      id: 7, 
      title: 'Présentation des résultats trimestriels',
      description: 'Bilan des performances Q1 2025',
      date: new Date(2025, 2, 22, 9, 0), 
      endDate: new Date(2025, 2, 22, 10, 30),
      type: 'reunion',
      assignedTo: 'Thomas Bernard',
      group: 'Direction',
      location: 'Auditorium',
      priority: 'high',
      isRecurring: true,
      recurringPattern: 'Chaque trimestre',
      attendees: ['Thomas Bernard', 'Équipe de direction', 'Managers'],
      attachments: 5,
      reminders: [{ time: 1, unit: 'day' }, { time: 30, unit: 'minute' }],
      weather: { condition: 'sunny', temperature: 21 },
      tags: [1, 6],
      status: 'confirmed'
    },
    { 
      id: 8, 
      title: 'Appel de suivi client Optima',
      description: 'Point mensuel sur l\'implémentation',
      date: new Date(2025, 2, 16, 15, 0), 
      endDate: new Date(2025, 2, 16, 15, 30),
      type: 'appel',
      assignedTo: 'Sophie Leclerc',
      group: 'Support',
      location: 'Google Meet',
      isRecurring: true,
      recurringPattern: 'Mensuel',
      priority: 'medium',
      attendees: ['Sophie Leclerc', 'Client Optima'],
      notes: 'Revoir les points en suspens du dernier appel',
      reminders: [{ time: 15, unit: 'minute' }],
      weather: { condition: 'cloudy', temperature: 19 },
      tags: [3],
      status: 'confirmed'
    },
    { 
      id: 9, 
      title: 'Webinaire sur les nouvelles fonctionnalités',
      description: 'Présentation publique des nouveautés du trimestre',
      date: new Date(2025, 2, 25, 16, 0), 
      endDate: new Date(2025, 2, 25, 17, 30),
      type: 'formation',
      assignedTo: 'Thomas Bernard',
      group: 'Marketing',
      location: 'Zoom Webinar',
      priority: 'high',
      attendees: ['Thomas Bernard', 'Sophie Leclerc', 'Clients (150+)'],
      attachments: 2,
      reminders: [{ time: 1, unit: 'day' }, { time: 1, unit: 'hour' }],
      weather: { condition: 'sunny', temperature: 20 },
      tags: [1, 7, 8],
      status: 'confirmed'
    },
    { 
      id: 10, 
      title: 'Interview candidat développeur',
      description: 'Entretien technique pour le poste de développeur fullstack',
      date: new Date(2025, 2, 17, 13, 30), 
      endDate: new Date(2025, 2, 17, 15, 0),
      type: 'reunion',
      assignedTo: 'Jean Martin',
      group: 'RH',
      location: 'Salle d\'entretien',
      priority: 'medium',
      attendees: ['Jean Martin', 'Candidat', 'Lead Developer'],
      reminders: [{ time: 30, unit: 'minute' }],
      weather: { condition: 'cloudy', temperature: 17 },
      tags: [2],
      status: 'confirmed'
    },
    { 
      id: 11, 
      title: 'Réunion avec l\'équipe de développement',
      description: 'Sprint planning et revue des tâches en cours',
      date: new Date(2025, 2, 11, 9, 30), 
      endDate: new Date(2025, 2, 11, 11, 0),
      type: 'reunion',
      assignedTo: 'Thomas Bernard',
      group: 'Produit',
      location: 'Salle de conférence',
      priority: 'medium',
      isRecurring: true,
      recurringPattern: 'Chaque semaine',
      attendees: ['Thomas Bernard', 'Équipe dev (8)'],
      reminders: [{ time: 15, unit: 'minute' }],
      weather: { condition: 'sunny', temperature: 19 },
      tags: [6],
      status: 'confirmed'
    },
    { 
      id: 12, 
      title: 'Déjeuner d\'équipe',
      description: 'Réunion informelle pour consolider la cohésion',
      date: new Date(2025, 2, 19, 12, 0), 
      endDate: new Date(2025, 2, 19, 14, 0),
      type: 'reunion',
      assignedTo: 'Sophie Leclerc',
      group: 'RH',
      location: 'Restaurant Le Central',
      priority: 'low',
      attendees: ['Toute l\'équipe'],
      reminders: [{ time: 1, unit: 'hour' }],
      weather: { condition: 'sunny', temperature: 22 },
      tags: [2, 6],
      status: 'confirmed'
    },
    { 
      id: 13, 
      title: 'Mise à jour du système CRM',
      description: 'Maintenance planifiée - système indisponible',
      date: new Date(2025, 2, 23, 22, 0), 
      endDate: new Date(2025, 2, 24, 2, 0),
      type: 'tache',
      assignedTo: 'Thomas Bernard',
      group: 'IT',
      location: 'En ligne',
      priority: 'high',
      notes: 'Informer tous les utilisateurs à l\'avance',
      reminders: [{ time: 1, unit: 'day' }],
      weather: { condition: 'cloudy', temperature: 15 },
      status: 'confirmed'
    },
    { 
      id: 14, 
      title: 'Rendez-vous dentiste',
      description: 'Contrôle annuel',
      date: new Date(2025, 2, 26, 17, 0),
      endDate: new Date(2025, 2, 26, 18, 0),
      type: 'reunion',
      assignedTo: 'Jean Martin',
      group: 'Personnel',
      location: 'Cabinet Dr. Blanc',
      priority: 'medium',
      reminders: [{ time: 1, unit: 'day' }, { time: 1, unit: 'hour' }],
      weather: { condition: 'cloudy', temperature: 18 },
      tags: [2],
      status: 'confirmed'
    },
    { 
      id: 15, 
      title: 'Appel prospect EcoSolutions',
      description: 'Présentation initiale des services',
      date: new Date(2025, 2, 9, 10, 0),
      endDate: new Date(2025, 2, 9, 10, 30),
      type: 'appel',
      assignedTo: 'Sophie Leclerc',
      group: 'Ventes',
      location: 'Téléphone',
      priority: 'high',
      attendees: ['Sophie Leclerc', 'Directeur EcoSolutions'],
      reminders: [{ time: 30, unit: 'minute' }],
      weather: { condition: 'sunny', temperature: 20 },
      tags: [1, 3],
      status: 'tentative'
    },
  ];
  
  // Enhanced filter options
  const groupOptions = ['Tous', 'Ventes', 'Marketing', 'Produit', 'RH', 'Support', 'Direction', 'IT', 'Personnel'];
  const assigneeOptions = ['Tous', 'Jean Martin', 'Sophie Leclerc', 'Thomas Bernard', 'Marie Dupont'];
  const eventTypeOptions = ['Tous', 'Appel', 'Réunion', 'Démo', 'Tâche', 'Formation'];
  const priorityOptions = ['Tous', 'Haute', 'Moyenne', 'Basse'];
  // const statusOptions = ['Tous', 'Confirmé', 'Provisoire', 'Annulé'];
  
  // Enhanced filter state
  const [filters, setFilters] = useState<FilterType>({
    group: 'Tous',
    assignee: 'Tous',
    eventType: 'Tous',
    searchQuery: '',
    dateRange: {
      from: null,
      to: null
    },
    priority: 'Tous',
    showCompleted: true,
    tags: [],
    status: 'all'
  });
  
  // Handler for filter changes
  const handleFilterChange = <K extends keyof FilterType>(field: K, value: FilterType[K]): void => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      group: 'Tous',
      assignee: 'Tous',
      eventType: 'Tous',
      searchQuery: '',
      dateRange: {
        from: null,
        to: null
      },
      priority: 'Tous',
      showCompleted: true,
      tags: [],
      status: 'all'
    });
  };

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Basic filters
      const groupMatch = filters.group === 'Tous' || event.group === filters.group;
      const assigneeMatch = filters.assignee === 'Tous' || event.assignedTo === filters.assignee;
      const typeMatch = filters.eventType === 'Tous' || event.type === filters.eventType.toLowerCase();
      const completedMatch = filters.showCompleted || !event.completed;
      
      // Priority filter
      let priorityMatch = true;
      if (filters.priority !== 'Tous') {
        const priorityMap: Record<string, 'high' | 'medium' | 'low'> = {
          'Haute': 'high',
          'Moyenne': 'medium',
          'Basse': 'low'
        };
        priorityMatch = event.priority === priorityMap[filters.priority];
      }
      
      // Status filter
      let statusMatch = true;
      if (filters.status !== 'all') {
        statusMatch = event.status === filters.status;
      }
      
      // Tags filter
      let tagsMatch = true;
      if (filters.tags.length > 0) {
        tagsMatch = event.tags ? filters.tags.some(tagId => event.tags?.includes(tagId)) : false;
      }
      
      // Search query filter
      let searchMatch = true;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        searchMatch = 
          event.title.toLowerCase().includes(query) ||
          (event.description?.toLowerCase().includes(query) ?? false) ||
          event.assignedTo.toLowerCase().includes(query) ||
          event.group.toLowerCase().includes(query) ||
          (event.location?.toLowerCase().includes(query) ?? false) ||
          (event.notes?.toLowerCase().includes(query) ?? false);
      }
      
      // Date range filter
      let dateMatch = true;
      if (filters.dateRange.from || filters.dateRange.to) {
        if (filters.dateRange.from && !filters.dateRange.to) {
          dateMatch = event.date >= filters.dateRange.from;
        } else if (!filters.dateRange.from && filters.dateRange.to) {
          dateMatch = event.date <= filters.dateRange.to;
        } else if (filters.dateRange.from && filters.dateRange.to) {
          dateMatch = event.date >= filters.dateRange.from && event.date <= filters.dateRange.to;
        }
      }
      
      return groupMatch && assigneeMatch && typeMatch && completedMatch && priorityMatch && 
             searchMatch && dateMatch && statusMatch && tagsMatch;
    });
  }, [events, filters]);

  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'appel':
        return <Phone className="h-4 w-4 text-emerald-500" />;
      case 'reunion':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'demo':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'tache':
        return <CheckSquare className="h-4 w-4 text-amber-500" />;
      case 'formation':
        return <User className="h-4 w-4 text-indigo-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get event status icon
  const getEventStatusIcon = (status?: 'confirmed' | 'tentative' | 'cancelled') => {
    switch(status) {
      case 'confirmed':
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
      case 'tentative':
        return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
      case 'cancelled':
        return <X className="h-3.5 w-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get weather icon
  const getWeatherIcon = (condition?: 'sunny' | 'cloudy' | 'rainy' | 'stormy') => {
    switch(condition) {
      case 'sunny':
        return <div className="text-amber-500">☀️</div>;
      case 'cloudy':
        return <div className="text-gray-500">☁️</div>;
      case 'rainy':
        return <div className="text-blue-500">🌧️</div>;
      case 'stormy':
        return <div className="text-purple-500">⛈️</div>;
      default:
        return null;
    }
  };

  // Format temperature
  const formatTemperature = (temp?: number) => {
    if (temp === undefined) return '';
    return `${temp}°C`;
  };

  // Get event color class based on priority and status
  const getEventColorClass = (priority?: 'high' | 'medium' | 'low', completed?: boolean, status?: 'confirmed' | 'tentative' | 'cancelled') => {
    if (status === 'cancelled') return 'bg-gray-100 text-gray-500 border-gray-200 line-through';
    if (completed) return 'bg-gray-100 text-gray-500 border-gray-200';
    
    // For tentative events, use a striped background
    const tentativeClass = status === 'tentative' ? '!bg-stripes-gray ' : '';
    
    switch(priority) {
      case 'high':
        return `${tentativeClass}bg-gradient-to-r from-rose-50 to-red-50 text-red-700 border-red-200`;
      case 'medium':
        return `${tentativeClass}bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200`;
      case 'low':
        return `${tentativeClass}bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border-sky-200`;
      default:
        return `${tentativeClass}bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border-indigo-200`;
    }
  };

  // Get tag color styles
  const getTagStyles = (tagId: number) => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return {};
    
    return {
      backgroundColor: `${tag.color}20`, // 20% opacity
      color: tag.color,
      borderColor: `${tag.color}40` // 40% opacity
    };
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Format date short
  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setIsEditingEvent(false);
  };

  // Open edit event modal
  const openEditEventModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setIsEditingEvent(true);
  };

  // Close event modal
  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setIsEditingEvent(false);
  };

  // Drag event handlers
  const handleDragStart = (event: Event, e: React.MouseEvent) => {
    setDragInfo({
      event,
      isDragging: true,
      startPosition: { x: e.clientX, y: e.clientY }
    });
  };


  // Quick add event
  const handleQuickAdd = () => {
    if (newEventTitle.trim()) {
      // Smart parsing for quick add
      const smartParse = (text: string) => {
        // Simple example of detecting date/time in text
        // In a real app, this would be much more sophisticated
        const today = new Date();
        const withTime = text.match(/à (\d{1,2})[h:](\d{2})/i);
        
        if (withTime) {
          const hours = parseInt(withTime[1]);
          const minutes = parseInt(withTime[2]);
          today.setHours(hours, minutes);
        }
        
        return today;
      };
      
      const eventDate = smartParse(newEventTitle);
      
      // Logic to add a new event would go here
      // In a real app, you'd add the event to your events array
      
      // Show success message
      alert(`Événement ajouté: ${newEventTitle} le ${formatDate(eventDate)} à ${formatTime(eventDate)}`);
      
      setNewEventTitle('');
      setShowQuickAdd(false);
    }
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Function to get today's events
  const getTodayEvents = () => {
    const today = new Date();
    return getEventsForDate(today);
  };

  // Function to get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return filteredEvents.filter(event => 
      event.date >= today && 
      event.date <= nextWeek
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  // Get keyboard shortcut help
  const keyboardShortcuts = [
    { key: 'T', description: 'Aller à aujourd\'hui' },
    { key: 'J', description: 'Vue Jour' },
    { key: 'S', description: 'Vue Semaine' },
    { key: 'M', description: 'Vue Mois' },
    { key: 'A', description: 'Vue Agenda' },
    { key: 'P', description: 'Vue Planning' },
    { key: 'C', description: 'Créer un événement' },
    { key: 'F', description: 'Ouvrir/fermer les filtres' },
    { key: 'Ctrl+←/→', description: 'Naviguer entre les périodes' },
    { key: 'Esc', description: 'Fermer les dialogues ouverts' },
    { key: 'Ctrl+K', description: 'Afficher tous les raccourcis clavier' },
  ];

  // Function to render different calendar views
  const renderCalendarView = () => {
    switch(currentView) {
      case 'mois':
        return renderMonthView();
      case 'semaine':
        return renderWeekView();
      case 'jour':
        return renderDayView();
      case 'planning':
        return renderPlanningView();
      case 'agent':
        return renderAgentView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  // Month view rendering
  const renderMonthView = () => {
    const days = generateMonthCalendar();
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          {dayNames.map((day, index) => (
            <div key={index} className="py-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-white">
          {days.map((day, index) => {
            // Get events for this day
            const dayEvents = day.currentMonth ? getEventsForDate(day.date) : [];
            
            // Check if this day is today
            const isToday = 
              new Date().getDate() === day.date.getDate() && 
              new Date().getMonth() === day.date.getMonth() && 
              new Date().getFullYear() === day.date.getFullYear();
            
            // Get weather for this day
            const dayWeather = dayEvents.length > 0 ? dayEvents[0].weather : undefined;
            
            return (
              <div 
                key={index} 
                className={`min-h-28 border-b border-r relative group ${
                  day.currentMonth ? 'bg-white' : 'bg-gray-50/50'
                } border-gray-200 ${isToday ? 'bg-blue-50/40' : ''}`}
              >
                <div 
                  className={`
                    flex justify-between p-2 
                    ${isToday 
                      ? 'font-bold text-blue-600'
                      : day.currentMonth ? 'text-gray-700' : 'text-gray-400'
                    }
                  `}
                >
                  <span className={`
                    flex justify-center items-center ${isToday ? 'w-7 h-7 rounded-full bg-blue-100 text-blue-700' : ''}
                  `}>
                    {day.day}
                  </span>
                  {day.currentMonth && dayWeather && (
                    <div className="flex items-center space-x-1 text-xs">
                      {getWeatherIcon(dayWeather.condition)}
                      <span className="text-gray-500">{formatTemperature(dayWeather.temperature)}</span>
                    </div>
                  )}
                </div>
                
                {/* Quick add button (visible on hover) */}
                {day.currentMonth && (
                  <button 
                    className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setCurrentDate(day.date);
                      setShowQuickAdd(true);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
                
                <div className="space-y-1 px-1.5 pb-1.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button 
                      key={event.id} 
                      onClick={() => handleEventClick(event)}
                      onMouseDown={(e) => {
                        if (e.button === 0) { // Left click
                          handleDragStart(event, e);
                        }
                      }}
                      className={`flex items-center p-1.5 text-xs rounded-md border w-full text-left truncate
                        ${getEventColorClass(event.priority, event.completed, event.status)}
                        hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative
                        ${event.status === 'tentative' ? 'border-dashed' : ''}
                      `}
                    >
                      <span className="mr-1.5 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                      <span className="truncate font-medium">{event.title}</span>
                      {event.isRecurring && (
                        <span className="ml-1 flex-shrink-0">
                          <Repeat className="h-3 w-3 opacity-70" />
                        </span>
                      )}
                      {event.status && event.status !== 'confirmed' && (
                        <span className="absolute right-1 top-1">
                          {getEventStatusIcon(event.status)}
                        </span>
                      )}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <button 
                      onClick={() => {
                        setCurrentDate(day.date);
                        setCurrentView('jour');
                      }}
                      className="text-xs text-center w-full rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-all duration-150"
                    >
                      +{dayEvents.length - 3} autres
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week view rendering with time slots
  const renderWeekView = () => {
    const weekDays = generateWeekDays();
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        {/* Day headers */}
        <div className="grid grid-cols-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="py-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200">
            Heure
          </div>
          {weekDays.map((day, index) => {
            const isToday = 
              new Date().getDate() === day.date.getDate() && 
              new Date().getMonth() === day.date.getMonth() && 
              new Date().getFullYear() === day.date.getFullYear();
            
            // Get events for this day to show weather
            const dayEvents = getEventsForDate(day.date);
            const dayWeather = dayEvents.length > 0 ? dayEvents[0].weather : undefined;
            
            return (
              <div 
                key={index} 
                className="py-2 text-center border-r border-gray-200 relative group"
              >
                <div className="text-sm font-medium text-gray-600">
                  {day.dayName}
                </div>
                <div className={`text-lg ${isToday ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                  {day.day}
                </div>
                {dayWeather && (
                  <div className="flex justify-center items-center space-x-1 text-xs mt-1">
                    {getWeatherIcon(dayWeather.condition)}
                    <span className="text-gray-500">{formatTemperature(dayWeather.temperature)}</span>
                  </div>
                )}
                
                {/* Quick add button (visible on hover) */}
                <button 
                  className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setCurrentDate(day.date);
                    setShowQuickAdd(true);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Time grid */}
        <div className="overflow-y-auto max-h-[70vh]">
          {/* Current time indicator */}
          {(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Only show if current time is in the visible range
            if (currentHour >= 7 && currentHour < 21) {
              const top = ((currentHour - 7) * 100) + ((currentMinute / 60) * 100);
              
              return (
                <div 
                  className="absolute left-0 right-0 z-10 border-t-2 border-red-500"
                  style={{ top: `${top}px`, marginTop: '1px' }}
                >
                  <div className="absolute -top-1.5 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              );
            }
            return null;
          })()}
          
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-gray-200 min-h-24 relative">
              <div className="py-2 px-2 text-right text-sm text-gray-500 border-r border-gray-200">
                <span className="sticky left-0">{hour}:00</span>
              </div>
              
              {weekDays.map((day, dayIndex) => {
                // Events that start at this hour on this day
                const hourEvents = filteredEvents.filter(event => 
                  event.date.getDate() === day.date.getDate() && 
                  event.date.getMonth() === day.date.getMonth() && 
                  event.date.getFullYear() === day.date.getFullYear() &&
                  event.date.getHours() === hour
                );
                
                return (
                  <div 
                    key={dayIndex} 
                    className="relative p-1 border-r border-gray-200 group"
                    onClick={() => {
                      // Create new event at this time slot if double-clicked
                      // (In a real app, this would open a new event form)
                      console.log(`Create event at ${hour}:00 on ${formatDate(day.date)}`);
                    }}
                  >
                    {/* Quick add indicator (on hover) */}
                    <div className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>
                    
                    {hourEvents.map((event) => {
                      const durationHours = event.endDate 
                        ? Math.max(1, Math.ceil((event.endDate.getTime() - event.date.getTime()) / (1000 * 60 * 60)))
                        : 1;
                      
                      return (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          onMouseDown={(e) => {
                            if (e.button === 0) { // Left click
                              e.stopPropagation();
                              handleDragStart(event, e);
                            }
                          }}
                          className={`absolute left-1 right-1 p-1.5 rounded-md text-xs z-10
                            ${getEventColorClass(event.priority, event.completed, event.status)}
                            border overflow-hidden hover:shadow-lg transition-all duration-200
                            hover:-translate-y-0.5 group/event ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                          style={{ 
                            top: `${(event.date.getMinutes() / 60) * 100}%`,
                            height: `${durationHours * 100}%`,
                            maxHeight: '100%' 
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="mr-1.5 flex-shrink-0">
                                {getEventTypeIcon(event.type)}
                              </span>
                              <span className="font-medium truncate">{event.title}</span>
                            </div>
                            <div className="flex space-x-1">
                              {event.isRecurring && <Repeat className="h-3 w-3 opacity-70" />}
                              {event.status && getEventStatusIcon(event.status)}
                            </div>
                          </div>
                          {event.location && (
                            <div className="text-xs opacity-70 truncate mt-0.5 flex items-center">
                              <MapPin className="h-3 w-3 mr-0.5" />
                              {event.location}
                            </div>
                          )}
                          {event.tags && event.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {event.tags.slice(0, 2).map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                  <span 
                                    key={tagId}
                                    className="px-1.5 py-0.5 rounded-full text-xs border"
                                    style={getTagStyles(tagId)}
                                  >
                                    {tag.name}
                                  </span>
                                );
                              })}
                              {event.tags.length > 2 && (
                                <span className="text-xs text-gray-500">+{event.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                          <div className="absolute top-1 right-1 hidden group-hover/event:flex space-x-1">
                            <button 
                              className="p-0.5 bg-white/80 rounded hover:bg-white text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditEventModal(event);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Day view rendering
  const renderDayView = () => {
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
    const dayEvents = filteredEvents.filter(event => 
      event.date.getDate() === currentDate.getDate() && 
      event.date.getMonth() === currentDate.getMonth() && 
      event.date.getFullYear() === currentDate.getFullYear()
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Get weather for this day
    const dayWeather = dayEvents.length > 0 ? dayEvents[0].weather : undefined;
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        {/* Day header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {formatDate(currentDate)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {dayEvents.length} événements
              </div>
            </div>
            {dayWeather && (
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-100">
                <div className="text-2xl">{getWeatherIcon(dayWeather.condition)}</div>
                <div className="text-lg font-medium text-gray-700">{formatTemperature(dayWeather.temperature)}</div>
              </div>
            )}
            
            {/* Day navigation */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setCurrentDate(newDate);
                }}
                className="p-1.5 rounded-full shadow-sm bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              >
                Aujourd&apos;hui
              </button>
              <button 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setCurrentDate(newDate);
                }}
                className="p-1.5 rounded-full shadow-sm bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Time slots */}
          <div className="flex-grow overflow-y-auto relative">
            {/* Current time indicator */}
            {(() => {
              const now = new Date();
              const currentHour = now.getHours();
              const currentMinute = now.getMinutes();
              
              // Only show if current time is in the visible range and it's today
              if (currentHour >= 7 && currentHour < 21 && 
                  now.getDate() === currentDate.getDate() && 
                  now.getMonth() === currentDate.getMonth() && 
                  now.getFullYear() === currentDate.getFullYear()) {
                const top = ((currentHour - 7) * 100) + ((currentMinute / 60) * 100);
                
                return (
                  <div 
                    className="absolute left-0 right-0 z-10 border-t-2 border-red-500"
                    style={{ top: `${top}px`, marginTop: '1px' }}
                  >
                    <div className="absolute -top-1.5 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="absolute -top-2.5 left-4 text-xs font-bold text-red-500">
                      {formatTime(now)}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            
            {hours.map((hour) => {
              // Events that start at this hour
              const hourEvents = dayEvents.filter(event => event.date.getHours() === hour);
              
              return (
                <div key={hour} className="relative border-b border-gray-200 min-h-28 group">
                  <div className="absolute left-0 top-0 p-2 text-sm font-medium text-gray-500 z-20">
                    {hour}:00
                  </div>
                  
                  {/* Quick add indicator (on hover) */}
                  <div 
                    className="absolute inset-0 bg-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"
                    onClick={() => {
                      // Handle click on time slot
                      const newEventDate = new Date(currentDate);
                      newEventDate.setHours(hour, 0, 0, 0);
                      
                      // In a real app, you'd open a form to create an event at this time
                      setNewEventTitle(`Nouvel événement le ${formatDate(newEventDate)} à ${hour}:00`);
                      setShowQuickAdd(true);
                    }}
                  ></div>
                  
                  <div className="ml-16 p-1 relative min-h-28">
                    {hourEvents.map((event) => {
                      const durationHours = event.endDate 
                        ? Math.max(1, Math.ceil((event.endDate.getTime() - event.date.getTime()) / (1000 * 60 * 60)))
                        : 1;
                      
                      return (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          onMouseDown={(e) => {
                            if (e.button === 0) { // Left click
                              handleDragStart(event, e);
                            }
                          }}
                          className={`absolute left-1 right-1 p-3 rounded-md z-10
                            ${getEventColorClass(event.priority, event.completed, event.status)}
                            border overflow-hidden hover:shadow-lg transition-all duration-200
                            hover:-translate-y-0.5 group/event ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                          style={{ 
                            top: `${(event.date.getMinutes() / 60) * 100}%`,
                            height: `${durationHours * 100}%`,
                            maxHeight: '100%' 
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="mr-2 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                              <span className="font-medium">{event.title}</span>
                              {event.status && event.status !== 'confirmed' && (
                                <span className="ml-2">{getEventStatusIcon(event.status)}</span>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              {event.isRecurring && <Repeat className="h-4 w-4 opacity-70" />}
                              {event.attendees && event.attendees.length > 0 && <Users className="h-4 w-4 opacity-70" />}
                              {event.attachments && event.attachments > 0 && <Paperclip className="h-4 w-4 opacity-70" />}
                            </div>
                          </div>
                          {event.location && (
                            <div className="text-sm flex items-center mt-2 text-gray-600">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.description && (
                            <div className="text-sm mt-2 text-gray-600 line-clamp-2">
                              {event.description}
                            </div>
                          )}
                          {event.tags && event.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {event.tags.map(tagId => {
                                const tag = tags.find(t => t.id === tagId);
                                if (!tag) return null;
                                return (
                                  <span 
                                    key={tagId}
                                    className="px-2 py-0.5 rounded-full text-xs border"
                                    style={getTagStyles(tagId)}
                                  >
                                    {tag.name}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 hidden group-hover/event:flex space-x-1">
                            <button 
                              className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditEventModal(event);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Delete event (in a real app)
                                console.log("Delete event:", event.id);
                              }}
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Side panel with agenda and mini calendar */}
          <div className="w-72 border-l p-4 overflow-y-auto bg-gray-50/50 border-gray-200">
            <h3 className="font-medium mb-3 text-gray-700 flex items-center">
              <span className="flex-grow">Agenda du jour</span>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </h3>
            {dayEvents.length === 0 ? (
              <div className="text-sm text-gray-500 bg-white rounded-md p-4 border border-gray-100 text-center">
                Aucun événement prévu
                <div className="mt-2">
                  <button 
                    onClick={() => setShowQuickAdd(true)}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Ajouter un événement
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`p-3 rounded-md text-sm 
                      ${getEventColorClass(event.priority, event.completed, event.status)}
                      border w-full text-left hover:shadow-md transition-all duration-200
                      hover:-translate-y-0.5 ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                  >
                    <div className="font-medium text-gray-700">{formatTime(event.date)}</div>
                    <div className="flex items-center mt-1.5">
                      <span className="mr-1.5 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                      <span className="truncate font-medium">{event.title}</span>
                      {event.status && event.status !== 'confirmed' && (
                        <span className="ml-1.5">{getEventStatusIcon(event.status)}</span>
                      )}
                    </div>
                    {event.location && (
                      <div className="text-xs opacity-80 truncate mt-1.5 flex items-center">
                        <MapPin className="h-3 w-3 mr-0.5" />
                        {event.location}
                      </div>
                    )}
                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {event.tags.slice(0, 2).map(tagId => {
                          const tag = tags.find(t => t.id === tagId);
                          if (!tag) return null;
                          return (
                            <span 
                              key={tagId}
                              className="px-1.5 py-0.5 rounded-full text-xs border"
                              style={getTagStyles(tagId)}
                            >
                              {tag.name}
                            </span>
                          );
                        })}
                        {event.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{event.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Mini calendar */}
            <div className="mt-6 bg-white rounded-md border border-gray-100 p-3 shadow-sm">
              <div className="text-sm font-medium text-gray-700 mb-2">Calendrier</div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {dayNames.map((day, idx) => (
                  <div key={`header-${idx}`} className="text-gray-500">{day.charAt(0)}</div>
                ))}
                
                {generateMonthCalendar().slice(0, 35).map((day, idx) => {
                  const hasEvents = getEventsForDate(day.date).length > 0;
                  const isSelectedDay = 
                    currentDate.getDate() === day.date.getDate() && 
                    currentDate.getMonth() === day.date.getMonth() && 
                    currentDate.getFullYear() === day.date.getFullYear();
                  
                  return (
                    <button 
                      key={`mini-${idx}`}
                      onClick={() => setCurrentDate(new Date(day.date))}
                      className={`w-6 h-6 rounded-full flex items-center justify-center
                        ${day.currentMonth ? 'text-gray-700' : 'text-gray-400'}
                        ${isSelectedDay ? 'bg-blue-500 text-white' : ''}
                        ${hasEvents && !isSelectedDay ? 
                          day.currentMonth ? 'bg-blue-50' : 'bg-gray-100' : 
                          ''
                        }
                        hover:bg-gray-100
                      `}
                    >
                      {day.day}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Upcoming events */}
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-gray-700">À venir</h3>
              <div className="space-y-2">
                {getUpcomingEvents().slice(0, 3).map(event => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setCurrentDate(event.date);
                      handleEventClick(event);
                    }}
                    className="flex items-center p-2 bg-white rounded-md border border-gray-100 w-full text-left hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className={`p-2 rounded-md mr-3 ${
                      event.priority === 'high' ? 'bg-red-50 text-red-500' :
                      event.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 truncate">{event.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatDateShort(event.date)} · {formatTime(event.date)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Planning view rendering
  const renderPlanningView = () => {
    // Group events by assignee
    const eventsByAssignee: Record<string, Event[]> = {};
    
    // Initialize with all assignees
    assigneeOptions.forEach(assignee => {
      if (assignee !== 'Tous') {
        eventsByAssignee[assignee] = [];
      }
    });
    
    // Add events to their assignees
    filteredEvents.forEach(event => {
      if (!eventsByAssignee[event.assignedTo]) {
        eventsByAssignee[event.assignedTo] = [];
      }
      eventsByAssignee[event.assignedTo].push(event);
    });
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div className="text-xl font-medium text-gray-800">
              Planning de l&apos;équipe
            </div>
            <div className="flex items-center space-x-2">
              <select
                className="p-2 rounded-md border border-gray-300 text-sm text-gray-700 bg-white"
                onChange={(e) => {
                  // Filter by period
                  const value = e.target.value;
                  // const today = new Date();
                  const periodStart = new Date();
                  const periodEnd = new Date();

                  switch(value) {
                    case 'week':
                      periodEnd.setDate(periodEnd.getDate() + 7);
                      break;
                    case 'month':
                      periodEnd.setMonth(periodEnd.getMonth() + 1);
                      break;
                    case 'quarter':
                      periodEnd.setMonth(periodEnd.getMonth() + 3);
                      break;
                  }
                  setFilters(prev => ({
                    ...prev,
                    periodStart,
                    periodEnd
                  }));
                }}
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
              <button
                className="p-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // Export planning (in a real app)
                  console.log("Export planning");
                }}
              >
                <Share className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
          {Object.keys(eventsByAssignee).map((assignee) => {
            const assigneeEvents = eventsByAssignee[assignee];
            
            return (
              <div 
                key={assignee}
                className="p-4 border-b border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-lg">{assignee}</h3>
                  
                  {/* Workload indicator */}
                  {assigneeEvents.length > 0 && (
                    <div className="ml-4 flex items-center">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            assigneeEvents.length > 10 ? 'bg-red-500' :
                            assigneeEvents.length > 5 ? 'bg-amber-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (assigneeEvents.length / 15) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {assigneeEvents.length} événements
                      </span>
                    </div>
                  )}
                </div>
                
                {assigneeEvents.length === 0 ? (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 border border-gray-200 inline-block">
                    Aucun événement prévu
                  </div>
                ) : (
                  <div className="space-y-2 pl-2">
                    {assigneeEvents
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map(event => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`p-3 rounded-md text-sm 
                            ${getEventColorClass(event.priority, event.completed, event.status)}
                            border w-full text-left hover:shadow-md transition-all duration-200
                            hover:-translate-y-0.5 group/event relative ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <span className="mr-2 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                              <span className="font-medium">{event.title}</span>
                              {event.isRecurring && (
                                <span className="ml-1.5 flex-shrink-0">
                                  <Repeat className="h-3.5 w-3.5 opacity-70" />
                                </span>
                              )}
                              {event.status && event.status !== 'confirmed' && (
                                <span className="ml-1.5">{getEventStatusIcon(event.status)}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                              {formatDate(event.date)} à {formatTime(event.date)}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <div>
                              {event.description && (
                                <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                                  {event.description}
                                </div>
                              )}
                              {event.location && (
                                <div className="text-xs text-gray-600 mt-1 flex items-center">
                                  <MapPin className="h-3 w-3 mr-0.5" />
                                  {event.location}
                                </div>
                              )}
                              {event.tags && event.tags.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {event.tags.slice(0, 3).map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    if (!tag) return null;
                                    return (
                                      <span 
                                        key={tagId}
                                        className="px-1.5 py-0.5 rounded-full text-xs border"
                                        style={getTagStyles(tagId)}
                                      >
                                        {tag.name}
                                      </span>
                                    );
                                  })}
                                  {event.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{event.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="hidden group-hover/event:flex space-x-1 absolute top-3 right-3">
                              <button 
                                className="p-1 bg-white rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditEventModal(event);
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                className="p-1 bg-white rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // In a real app, this would handle event reassignment
                                  console.log("Reassign event:", event.id);
                                }}
                              >
                                <Move className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Agent view rendering
  const renderAgentView = () => {
    // Group events by date and then by assignee
    const eventsByDate: Record<string, Record<string, Event[]>> = {};
    
    // Process all events within a date range (today + next 7 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d);
      eventsByDate[dateStr] = {};
      
      assigneeOptions.forEach(assignee => {
        if (assignee !== 'Tous') {
          eventsByDate[dateStr][assignee] = [];
        }
      });
    }
    
    // Populate events
    filteredEvents.forEach(event => {
      const dateStr = formatDate(event.date);
      if (eventsByDate[dateStr]) {
        if (!eventsByDate[dateStr][event.assignedTo]) {
          eventsByDate[dateStr][event.assignedTo] = [];
        }
        eventsByDate[dateStr][event.assignedTo].push(event);
      }
    });
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div className="text-xl font-medium text-gray-800">
              Vue par agent
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // In a real app, export this view
                  console.log("Export agent view");
                }}
              >
                <Share className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // In a real app, print this view
                  console.log("Print agent view");
                }}
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto min-w-max text-gray-700">
            <thead className="bg-gradient-to-r from-gray-50 to-white">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold border-b border-r border-gray-200 sticky left-0 bg-gray-50 z-10">Agent</th>
                {Object.keys(eventsByDate).map(date => (
                  <th key={date} className="px-4 py-3 text-center border-b border-r border-gray-200">
                    <div className="font-semibold">{date.split(' ')[0]}</div>
                    <div className="text-xs text-gray-500">
                      {date.split(' ')[1]} {date.split(' ')[2]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assigneeOptions.filter(a => a !== 'Tous').map(assignee => (
                <tr key={assignee} className="border-b border-gray-200 hover:bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800 border-r border-gray-200 sticky left-0 bg-white z-10">
                    <div className="flex items-center">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full mr-2.5">
                        <User className="h-4 w-4" />
                      </div>
                      {assignee}
                    </div>
                  </td>
                  
                  {Object.keys(eventsByDate).map(date => {
                    const events = eventsByDate[date][assignee] || [];
                    const eventCount = events.length;
                    
                    // Get weather for this day and agent's events
                    const dayWeather = events.length > 0 ? events[0].weather : undefined;
                    
                    return (
                      <td key={`${assignee}-${date}`} className="p-2 border-r border-gray-200 min-w-40 max-w-48">
                        {dayWeather && (
                          <div className="flex justify-center items-center space-x-1 text-xs mb-1.5 text-gray-500">
                            {getWeatherIcon(dayWeather.condition)}
                            <span>{formatTemperature(dayWeather.temperature)}</span>
                          </div>
                        )}
                        
                        {eventCount > 0 ? (
                          <div className="flex flex-col space-y-1.5">
                            {events
                              .sort((a, b) => a.date.getTime() - b.date.getTime())
                              .map(event => (
                                <button
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className={`px-2 py-1.5 rounded-md text-xs 
                                    ${getEventColorClass(event.priority, event.completed, event.status)}
                                    border text-left flex items-center justify-between hover:shadow-md transition-all duration-200
                                    hover:-translate-y-0.5 group/event ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                                >
                                  <div className="flex items-center truncate">
                                    <span className="mr-1.5 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                                    <span className="truncate">{formatTime(event.date)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {event.isRecurring && <Repeat className="h-3 w-3 opacity-70" />}
                                    {event.status && event.status !== 'confirmed' && getEventStatusIcon(event.status)}
                                    <div className="hidden group-hover/event:block">
                                      <button 
                                        className="p-0.5 bg-white rounded-full hover:bg-gray-50 text-gray-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditEventModal(event);
                                        }}
                                      >
                                        <Edit className="h-2.5 w-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        ) : (
                          <div className="text-xs text-center text-gray-400 py-2">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Agenda view rendering
  const renderAgendaView = () => {
    // Group events by day
    interface GroupedEvents {
      [date: string]: Event[];
    }
    
    const eventsByDay: GroupedEvents = {};
    
    // Group events by date
    filteredEvents.forEach(event => {
      const dateKey = formatDate(event.date);
      if (!eventsByDay[dateKey]) {
        eventsByDay[dateKey] = [];
      }
      eventsByDay[dateKey].push(event);
    });
    
    // Sort dates
    const sortedDates = Object.keys(eventsByDay).sort((a, b) => {
      const dateA = new Date(a.split(' ')[0] + ' ' + a.split(' ')[1] + ' ' + a.split(' ')[2]);
      const dateB = new Date(b.split(' ')[0] + ' ' + b.split(' ')[1] + ' ' + b.split(' ')[2]);
      return dateA.getTime() - dateB.getTime();
    });
    
    return (
      <div className="rounded-xl shadow-xl overflow-hidden bg-white border border-gray-100">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div className="text-xl font-medium text-gray-800">
              Agenda
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="py-1.5 px-4 pl-9 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-2" />
              </div>
              <select
                className="py-1.5 px-3 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                {priorityOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              <button
                className="p-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => {
                  // In a real app, print the agenda
                  window.print();
                }}
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden p-6">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-500 mb-4">Ajustez vos filtres ou créez un nouvel événement</p>
              <button 
                onClick={() => setShowQuickAdd(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:shadow-md transition-all duration-200"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Nouvel événement
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map(date => {
                const events = eventsByDay[date];
                const dateObj = new Date(date.split(' ')[0] + ' ' + date.split(' ')[1] + ' ' + date.split(' ')[2]);
                
                // Get day of week
                const dayOfWeek = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
                
                // Check if this is today
                const isToday = 
                  new Date().getDate() === dateObj.getDate() && 
                  new Date().getMonth() === dateObj.getMonth() && 
                  new Date().getFullYear() === dateObj.getFullYear();
                
                // Get weather for this day
                const dayWeather = events.length > 0 ? events[0].weather : undefined;
                
                return (
                  <div key={date} className="relative">
                    <div className="flex items-start mb-4">
                      <div className="bg-white shadow-md rounded-lg border border-gray-100 p-3 text-center mr-6 sticky top-0">
                        <div className="text-xs uppercase text-gray-500 font-medium">{dayOfWeek}</div>
                        <div className={`text-2xl font-bold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                          {date.split(' ')[0]}
                        </div>
                        <div className="text-sm text-gray-500">{date.split(' ')[1]}</div>
                        {dayWeather && (
                          <div className="mt-2 flex justify-center">
                            <div className="flex items-center space-x-1 text-xs">
                              <div className="text-lg">{getWeatherIcon(dayWeather.condition)}</div>
                              <span>{formatTemperature(dayWeather.temperature)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        {events
                          .sort((a, b) => a.date.getTime() - b.date.getTime())
                          .map(event => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`p-4 rounded-lg text-sm ${getEventColorClass(event.priority, event.completed, event.status)}
                                border w-full text-left hover:shadow-lg transition-all duration-200
                                hover:-translate-y-0.5 relative group/event ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                            >
                              <div className="absolute top-3 right-3 hidden group-hover/event:flex space-x-1">
                                <button 
                                  className="p-1 bg-white rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditEventModal(event);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  className="p-1 bg-white rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // In a real app, share event
                                    console.log("Share event:", event.id);
                                  }}
                                >
                                  <Share className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  className="p-1 bg-white rounded-full hover:bg-gray-50 text-gray-600 shadow-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // In a real app, show more options
                                    console.log("More options for event:", event.id);
                                  }}
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              
                              <div className="flex items-center">
                                <div className="bg-white p-1.5 rounded-full mr-3 shadow-sm border border-gray-100">
                                  {getEventTypeIcon(event.type)}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                                    {event.isRecurring && (
                                      <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs flex items-center">
                                        <Repeat className="h-3 w-3 mr-0.5" />
                                        {event.recurringPattern || 'Récurrent'}
                                      </span>
                                    )}
                                    {event.priority === 'high' && (
                                      <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-xs flex items-center">
                                        <Zap className="h-3 w-3 mr-0.5" />
                                        Priorité haute
                                      </span>
                                    )}
                                    {event.status && event.status !== 'confirmed' && (
                                      <span className={`px-1.5 py-0.5 rounded text-xs flex items-center ${
                                        event.status === 'tentative' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                      }`}>
                                        {getEventStatusIcon(event.status)}
                                        <span className="ml-0.5">
                                          {event.status === 'tentative' ? 'Provisoire' : 'Annulé'}
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {formatTime(event.date)}
                                    {event.endDate && ` - ${formatTime(event.endDate)}`}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 pl-10 space-y-2">
                                {event.location && (
                                  <div className="text-sm flex items-center text-gray-600">
                                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                    {event.location}
                                  </div>
                                )}
                                {event.description && (
                                  <div className="text-sm text-gray-600">
                                    {event.description}
                                  </div>
                                )}
                                {event.attendees && event.attendees.length > 0 && (
                                  <div className="text-sm flex items-center text-gray-600">
                                    <Users className="h-3.5 w-3.5 mr-1.5" />
                                    {event.attendees.length} participants
                                  </div>
                                )}
                                {event.reminders && event.reminders.length > 0 && (
                                  <div className="text-sm flex items-center text-gray-600">
                                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                                    {event.reminders.length} rappel{event.reminders.length > 1 ? 's' : ''}
                                  </div>
                                )}
                                {event.tags && event.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {event.tags.map(tagId => {
                                      const tag = tags.find(t => t.id === tagId);
                                      if (!tag) return null;
                                      return (
                                        <span 
                                          key={tagId}
                                          className="px-2 py-0.5 rounded-full text-xs border"
                                          style={getTagStyles(tagId)}
                                        >
                                          {tag.name}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render event detail modal
  const renderEventModal = () => {
    if (!selectedEvent) return null;
    
    return (
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden bg-white"
            >
              {/* Modal header with gradient based on priority */}
              <div 
                className={`p-6 ${
                  selectedEvent.priority === 'high' ? 'bg-gradient-to-r from-rose-500 to-red-500' :
                  selectedEvent.priority === 'medium' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                  'bg-gradient-to-r from-blue-500 to-indigo-500'
                } text-white relative`}
              >
                {/* Close button */}
                <button 
                  onClick={closeEventModal}
                  className="absolute right-4 top-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </button>
                
                {/* Status badge */}
                {selectedEvent.status && selectedEvent.status !== 'confirmed' && (
                  <div className="absolute left-6 top-6 px-2 py-0.5 rounded text-xs bg-white/20 font-medium">
                    {selectedEvent.status === 'tentative' ? 'Provisoire' : 'Annulé'}
                  </div>
                )}
                
                <div className="flex items-start pt-4">
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    {getEventTypeIcon(selectedEvent.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedEvent.title}
                    </h2>
                    {selectedEvent.isRecurring && (
                      <div className="text-sm flex items-center mt-1 text-white/90">
                        <Repeat className="h-4 w-4 mr-1" />
                        {selectedEvent.recurringPattern || 'Événement récurrent'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Modal content */}
              <div className={`p-6 ${isEditingEvent ? 'hidden' : 'block'}`}>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-3 bg-blue-50 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {formatDate(selectedEvent.date)}
                      </div>
                      <div className="text-gray-600">
                        {formatTime(selectedEvent.date)}
                        {selectedEvent.endDate && ` - ${formatTime(selectedEvent.endDate)}`}
                      </div>
                      
                      {selectedEvent.weather && (
                        <div className="flex items-center mt-2 text-sm text-gray-600 bg-gray-50 rounded-md px-2 py-1 inline-block">
                          {getWeatherIcon(selectedEvent.weather.condition)}
                          <span className="ml-1">{formatTemperature(selectedEvent.weather.temperature)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex">
                      <div className="mr-3 bg-green-50 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="text-gray-800">
                        {selectedEvent.location}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex">
                    <div className="mr-3 bg-purple-50 p-2 rounded-full">
                      <User className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-gray-800">
                      Assigné à {selectedEvent.assignedTo}
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-3 bg-amber-50 p-2 rounded-full">
                      <Tag className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-gray-800">
                      Groupe: {selectedEvent.group}
                    </div>
                  </div>
                  
                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div className="flex">
                      <div className="mr-3 bg-indigo-50 p-2 rounded-full">
                        <Users className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Participants</div>
                        <div className="mt-1">
                          {selectedEvent.attendees.map((attendee, index) => (
                            <div key={index} className="text-gray-600 text-sm py-0.5">
                              {attendee}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                    <div className="flex">
                      <div className="mr-3 bg-teal-50 p-2 rounded-full">
                        <Tag className="h-5 w-5 text-teal-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Tags</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedEvent.tags.map(tagId => {
                            const tag = tags.find(t => t.id === tagId);
                            if (!tag) return null;
                            return (
                              <span 
                                key={tagId}
                                className="px-2 py-0.5 rounded-full text-xs border"
                                style={getTagStyles(tagId)}
                              >
                                {tag.name}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.reminders && selectedEvent.reminders.length > 0 && (
                    <div className="flex">
                      <div className="mr-3 bg-rose-50 p-2 rounded-full">
                        <Bell className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Rappels</div>
                        <div className="mt-1">
                          {selectedEvent.reminders.map((reminder, index) => (
                            <div key={index} className="text-gray-600 text-sm py-0.5">
                              {reminder.time} {
                                reminder.unit === 'minute' ? 'minute' + (reminder.time > 1 ? 's' : '') : 
                                reminder.unit === 'hour' ? 'heure' + (reminder.time > 1 ? 's' : '') : 
                                'jour' + (reminder.time > 1 ? 's' : '')
                              } avant
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.description && (
                    <div className="flex">
                      <div className="mr-3 bg-sky-50 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-sky-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Description</div>
                        <div className="mt-1 text-gray-600">
                          {selectedEvent.description}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.notes && (
                    <div className="flex">
                      <div className="mr-3 bg-gray-50 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Notes</div>
                        <div className="mt-1 text-gray-600">
                          {selectedEvent.notes}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedEvent.attachments && selectedEvent.attachments > 0 && (
                    <div className="flex">
                      <div className="mr-3 bg-orange-50 p-2 rounded-full">
                        <Paperclip className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Pièces jointes</div>
                        <div className="mt-1 text-gray-600">
                          {selectedEvent.attachments} fichier{selectedEvent.attachments > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Edit event form (simplified, would be more complex in real app) */}
              <div className={`p-6 ${isEditingEvent ? 'block' : 'hidden'}`}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      value={selectedEvent.title}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input 
                        type="date" 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                        value={selectedEvent.date.toISOString().split('T')[0]}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                      <input 
                        type="time" 
                        className="w-full p-2 border border-gray-300 rounded-md" 
                        value={`${selectedEvent.date.getHours().toString().padStart(2, '0')}:${selectedEvent.date.getMinutes().toString().padStart(2, '0')}`}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      rows={3}
                      value={selectedEvent.description || ''}
                      readOnly
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md" 
                      value={selectedEvent.location || ''}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="high" selected={selectedEvent.priority === 'high'}>Haute</option>
                        <option value="medium" selected={selectedEvent.priority === 'medium'}>Moyenne</option>
                        <option value="low" selected={selectedEvent.priority === 'low'}>Basse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="confirmed" selected={selectedEvent.status === 'confirmed'}>Confirmé</option>
                        <option value="tentative" selected={selectedEvent.status === 'tentative'}>Provisoire</option>
                        <option value="cancelled" selected={selectedEvent.status === 'cancelled'}>Annulé</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal actions */}
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  {!isEditingEvent ? (
                    <button 
                      className="text-red-600 hover:text-red-700 flex items-center text-sm"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Supprimer
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditingEvent(false)}
                      className="text-gray-600 hover:text-gray-700 flex items-center text-sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {!isEditingEvent ? (
                    <>
                      <button 
                        className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Dupliquer
                      </button>
                      <button 
                        onClick={() => setIsEditingEvent(true)}
                        className="flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md transition-all duration-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditingEvent(false)}
                      className="flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md transition-all duration-200"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Enregistrer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Render keyboard shortcuts modal
  const renderKeyboardShortcutsModal = () => {
    return (
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden bg-white"
            >
              <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">Raccourcis clavier</h2>
                  <button 
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {keyboardShortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-700">{shortcut.description}</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-800 border border-gray-300 shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Appuyez sur <kbd className="px-1 py-0.5 bg-white rounded font-mono text-gray-800 border border-gray-300 shadow-sm">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-white rounded font-mono text-gray-800 border border-gray-300 shadow-sm">K</kbd> pour afficher ce menu à tout moment
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Render event drag preview
  const renderDragPreview = () => {
    if (!dragInfo.isDragging || !dragInfo.event) return null;
    
    return (
      <div 
        ref={dragRef}
        className={`fixed z-50 p-2 rounded-md border shadow-lg pointer-events-none
          ${getEventColorClass(dragInfo.event.priority, dragInfo.event.completed, dragInfo.event.status)}
        `}
        style={{ 
          left: dragInfo.startPosition ? dragInfo.startPosition.x + 10 : 0,
          top: dragInfo.startPosition ? dragInfo.startPosition.y + 10 : 0,
          width: '200px'
        }}
      >
        <div className="flex items-center">
          <span className="mr-1.5 flex-shrink-0">{getEventTypeIcon(dragInfo.event.type)}</span>
          <span className="truncate font-medium">{dragInfo.event.title}</span>
        </div>
      </div>
    );
  };

  // Render loading screen
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <div className="mt-4 text-lg font-medium text-gray-800">Chargement...</div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen text-gray-900 relative"
      ref={calendarRef}
    >
      {renderDragPreview()}
      {renderLoading()}
      {renderKeyboardShortcutsModal()}
      
      <div className="max-w-7xl mx-auto space-y-6 px-4 pb-20 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 rounded-2xl shadow-xl bg-white border border-gray-100">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-gray-800"
              style={{ color: "#1B0353" }}
            >
              Calendrier
            </motion.h1>
            <p className="text-sm mt-1 text-gray-500">
              Gérez vos événements et vos rendez-vous
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-sm border border-indigo-50">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            
            <div className="flex space-x-1">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                onClick={() => setShowKeyboardShortcuts(true)}
                title="Raccourcis clavier (Ctrl+K)"
              >
                <Keyboard className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                onClick={() => toggleElementVisibility('weather')}
                title="Afficher/masquer la météo"
              >
                {hiddenElements.includes('weather') ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Today's events quick view */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Aujourd&apos;hui</h2>
            <button 
              onClick={() => {
                setCurrentDate(new Date());
                setCurrentView('jour');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Voir tout
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-2 space-x-3">
            {getTodayEvents().length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 w-full text-center">
                <p className="text-gray-500">Aucun événement prévu aujourd&apos;hui</p>
                <button 
                  onClick={() => setShowQuickAdd(true)}
                  className="mt-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Ajouter un événement
                </button>
              </div>
            ) : (
              getTodayEvents().map(event => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={`p-4 rounded-lg border min-w-60 ${getEventColorClass(event.priority, event.completed, event.status)}
                    hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-left flex-shrink-0
                    ${event.status === 'tentative' ? 'border-dashed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-white/50 rounded text-xs">{formatTime(event.date)}</span>
                    {event.status && event.status !== 'confirmed' && getEventStatusIcon(event.status)}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="mr-2 flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  {event.location && (
                    <div className="text-xs mt-2 flex items-center opacity-75">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Quick add form */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-grow">
                    <input
                      type="text"
                      placeholder="Ajouter un événement (ex: Appel client à 14h30)"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full p-3 rounded-l-lg border-t border-l border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 mt-1 pl-2">
                      Pro tip: Tapez &quot;Réunion équipe à 14h30&quot; et nous détecterons l&apos;heure automatiquement
                    </div>
                  </div>
                  <button
                    onClick={handleQuickAdd}
                    className="p-3 h-11 px-6 rounded-r-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white border border-blue-600 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar controls */}
        <div className="rounded-2xl shadow-lg p-4 bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Date navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={previousPeriod}
                  className="p-2 rounded-full shadow-sm bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                  {currentMonth} <span className="text-gray-500">{currentYear}</span>
                </div>
                <button 
                  onClick={nextPeriod}
                  className="p-2 rounded-full shadow-sm bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button 
                onClick={goToToday}
                className="px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium transition-all duration-150"
              >
                Aujourd&apos;hui
              </button>
            </div>

            {/* Actions and views */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button 
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>{showQuickAdd ? 'Annuler' : 'Créer événement'}</span>
              </button>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg border transition-all duration-150 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
              </button>
              
              <div className="hidden md:flex items-center rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white divide-x">
                <button 
                  onClick={() => setCurrentView('mois')}
                  className={`px-4 py-2 ${
                    currentView === 'mois' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-all duration-150`}
                >
                  Mois
                </button>
                <button 
                  onClick={() => setCurrentView('semaine')}
                  className={`px-4 py-2 ${
                    currentView === 'semaine' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-all duration-150`}
                >
                  Semaine
                </button>
                <button 
                  onClick={() => setCurrentView('jour')}
                  className={`px-4 py-2 ${
                    currentView === 'jour' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-all duration-150`}
                >
                  Jour
                </button>
                <button 
                  onClick={() => setCurrentView('planning')}
                  className={`px-4 py-2 ${
                    currentView === 'planning' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-all duration-150`}
                >
                  Planning
                </button>
                <button 
                  onClick={() => setCurrentView('agenda')}
                  className={`px-4 py-2 ${
                    currentView === 'agenda' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-all duration-150`}
                >
                  Agenda
                </button>
              </div>
              
              {/* Mobile view selector */}
              <select 
                className="md:hidden rounded-lg px-3 py-2 bg-white border border-gray-300 text-gray-700 shadow-sm"
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
              >
                <option value="mois">Mois</option>
                <option value="semaine">Semaine</option>
                <option value="jour">Jour</option>
                <option value="planning">Planning</option>
                <option value="agenda">Agenda</option>
              </select>
            </div>
          </div>

          {/* Enhanced filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 border-t border-gray-200 overflow-hidden"
              >
                {/* Search bar */}
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher dans les événements..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Basic filters */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Filtrer par Groupe
                    </label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.group}
                      onChange={(e) => handleFilterChange('group', e.target.value)}
                    >
                      {groupOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Assigné à
                    </label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.assignee}
                      onChange={(e) => handleFilterChange('assignee', e.target.value)}
                    >
                      {assigneeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Type d&apos;événement
                    </label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.eventType}
                      onChange={(e) => handleFilterChange('eventType', e.target.value)}
                    >
                      {eventTypeOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Advanced filters */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Priorité
                    </label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      {priorityOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Statut
                    </label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value as 'all' | 'confirmed' | 'tentative' | 'cancelled')}
                    >
                      <option value="all">Tous</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="tentative">Provisoire</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          className={`flex items-center px-3 py-1.5 rounded-full text-sm border hover:shadow-sm transition-all duration-150 ${
                            filters.tags.includes(tag.id) 
                              ? 'bg-white shadow-sm' 
                              : 'bg-gray-50 border-gray-200 opacity-70'
                          }`}
                          style={{ 
                            borderLeftColor: tag.color, 
                            borderLeftWidth: '3px',
                            color: filters.tags.includes(tag.id) ? tag.color : 'inherit',
                          }}
                          onClick={() => {
                            const newTags = filters.tags.includes(tag.id)
                              ? filters.tags.filter(id => id !== tag.id)
                              : [...filters.tags, tag.id];
                              
                            handleFilterChange('tags', newTags);
                          }}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="showCompleted"
                    checked={filters.showCompleted}
                    onChange={(e) => handleFilterChange('showCompleted', e.target.checked)}
                    className="h-4 w-4 rounded focus:outline-none focus:ring-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor="showCompleted" 
                    className="ml-2 text-sm text-gray-700"
                  >
                    Afficher les événements terminés
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-lg transition-all duration-150 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                  >
                    Réinitialiser
                  </button>
                  <button 
                    className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Appliquer ({filteredEvents.length} résultats)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Calendar view */}
        <div className="relative">
          {renderCalendarView()}
        </div>
        
        {/* Event detail modal */}
        {renderEventModal()}
        
        {/* Quick action buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
          <button 
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="p-3 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-6 w-6" />
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all duration-200"
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
