'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiClock, 
  FiPlus, 
  FiTrash2, 
  FiEdit, 
  FiChevronLeft, 
  FiChevronRight, 
  FiList,
  FiSearch,
  FiRefreshCw,
  FiSettings,
  FiChevronDown,
  FiX,
  FiCheck,
  FiUsers,
  FiTag,
  FiAlertCircle,
  FiPlusCircle,
  FiDownload,
  // FiEye,
  // FiBriefcase,
  FiPhoneCall,
  FiFileText,
  FiClipboard,
  FiUserPlus,
  FiInfo,
  FiRepeat,
  FiArrowRight,
  FiCopy,
  FiLink,
  FiShare2,
  FiHash,
  FiCalendar,
  FiBell,
  FiSun,
  FiCloudSnow,
  FiCloudRain,
  FiCloud,
  FiBold,
  FiMapPin,
  FiNavigation,
  FiCommand
} from 'react-icons/fi';

// Define a proper type for attachments
export interface AttachmentType {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  addedAt: Date;
}

// Define a proper type for attendees with attendance status
export interface AttendeeType {
  id: number;
  name: string;
  email: string;
  status: 'accepted' | 'pending' | 'declined';
  avatar?: string;
}

// Define a FilterValueType to replace 'any' in filter functions
export type FilterValueType = string | string[] | boolean;

// Event types
export interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: string;
  contact: number;
  priority: string;
  description: string;
  location: string;
  allDay: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  reminderTime?: string;
  notes?: string;
  attachments?: AttachmentType[];
  attendees?: AttendeeType[];
}

// Event category definitions
export interface EventCategoryType {
  name: string;
  color: string;
  icon: React.ReactElement; // Change from ReactNode to ReactElement
}

export interface EventCategoriesType {
  [key: string]: EventCategoryType;
}

// Priority definitions
export interface PriorityType {
  id: string;
  name: string;
  color: string;
}

// Contact definition
export interface ContactType {
  id: number;
  name: string;
  company: string;
  avatar: string;
}

// Filter types
export interface FilterType {
  categories: string[];
  priority: string[];
  search: string;
  dateRange: string;
  showCompleted: boolean;
}

// Calendar day data
export interface CalendarDayType {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isPrevMonth?: boolean;
  isToday?: boolean;
}

// Component props interfaces
export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface WeatherIndicatorProps {
  condition?: 'clear' | 'cloudy' | 'rain' | 'snow';
  temperature?: number;
}

export interface CircleStatProps {
  icon: React.ReactNode;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  onClick?: () => void;
}

export interface EventModalProps {
  event: EventType | null;
  isOpen: boolean;
  onClose: (nextMode?: string) => void;
  onSave: (eventData: EventType) => void;
  onDelete: (eventId: string) => void;
  mode?: 'view' | 'edit' | 'create';
}

// Form data interface
export interface EventFormData extends EventType {
  isRecurring: boolean;
  recurrencePattern: string;
  reminderTime: string;
  notes: string;
  attachments: AttachmentType[];
  attendees: AttendeeType[];
}

// Slot data for creating new events
export interface SlotData {
  date: Date;
  start?: Date;
  end?: Date;
  defaultCategory?: string;
}

// Position data for drag and drop operations
export interface PositionData {
  x: number;
  y: number;
}

export interface SelectionBoxType {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CreationAreaType {
  date: Date;
  top: number;
  height: number;
}

export interface DropTargetIndicatorType {
  x: number;
  y: number;
}

// Status colors mapping
export interface StatusColorType {
  bg: string;
  text: string;
  icon: React.ReactNode;
}

export interface StatusColorsType {
  [key: string]: StatusColorType;
}

// Size classes mapping
export interface SizeClassesType {
  [key: string]: string;
}

export interface CircleSizeClassesType {
  [key: string]: {
    container: string;
    icon: string;
  };
}

// Weather icons mapping
export interface WeatherIconsType {
  [key: string]: React.ReactNode;
}

// Event style return type
export interface EventStyleType {
  backgroundColor: string;
  borderLeft: string;
  opacity: string;
}

// Event position calculation return type
export interface EventPositionType {
  top: number;
  height: number;
}

// Time slot type
export interface TimeSlotType {
  hour: number;
  time: string;
}

// Données d'exemple
const eventCategories: EventCategoriesType = {
  "meeting": { name: "Rendez-vous", color: "#4F46E5", icon: <FiUsers /> },
  "call": { name: "Appel", color: "#10B981", icon: <FiPhoneCall /> },
  "task": { name: "Tâche", color: "#F59E0B", icon: <FiClipboard /> },
  "deadline": { name: "Échéance", color: "#EF4444", icon: <FiClock /> },
  "prospect": { name: "Prospection", color: "#8B5CF6", icon: <FiUserPlus /> },
  "note": { name: "Note", color: "#EC4899", icon: <FiFileText /> }
};

const priorities: PriorityType[] = [
  { id: "high", name: "Haute", color: "#EF4444" },
  { id: "medium", name: "Moyenne", color: "#F59E0B" },
  { id: "low", name: "Basse", color: "#10B981" }
];

const sampleContacts: ContactType[] = [
  { id: 1, name: "Marie Dupont", company: "Acme Corp", avatar: "/api/placeholder/40/40" },
  { id: 2, name: "Jean Martin", company: "Globex Inc", avatar: "/api/placeholder/40/40" },
  { id: 3, name: "Sophie Leclerc", company: "Umbrella LLC", avatar: "/api/placeholder/40/40" },
  { id: 4, name: "Thomas Bernard", company: "Stark Industries", avatar: "/api/placeholder/40/40" },
  { id: 5, name: "Émilie Rousseau", company: "Wayne Enterprises", avatar: "/api/placeholder/40/40" },
  { id: 6, name: "Alexandre Dubois", company: "LexCorp", avatar: "/api/placeholder/40/40" },
  { id: 7, name: "Laura Girard", company: "Cyberdyne Systems", avatar: "/api/placeholder/40/40" },
  { id: 8, name: "Nicolas Petit", company: "Weyland-Yutani", avatar: "/api/placeholder/40/40" }
];

// Generate three months of events from the current month
const generateEvents = (): EventType[] => {
  const events: EventType[] = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Generate for current month and next two months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const month = (currentMonth + monthOffset) % 12;
    const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate 25-35 events per month
    const eventsCount = 25 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < eventsCount; i++) {
      const day = 1 + Math.floor(Math.random() * daysInMonth);
      const startHour = 8 + Math.floor(Math.random() * 9); // 8 AM to 5 PM
      const duration = [30, 60, 90, 120][Math.floor(Math.random() * 4)]; // 30min, 1h, 1h30, 2h
      
      const startDate = new Date(year, month, day, startHour);
      const endDate = new Date(year, month, day, startHour + Math.floor(duration / 60), duration % 60);
      
      // Skip if weekend
      if (startDate.getDay() === 0 || startDate.getDay() === 6) {
        continue;
      }
      
      const categoryKeys = Object.keys(eventCategories);
      const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const contact = sampleContacts[Math.floor(Math.random() * sampleContacts.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      
      const titles: Record<string, string[]> = {
        "meeting": ["Réunion avec", "Présentation pour", "Discussion avec", "Rencontre avec"],
        "call": ["Appel avec", "Suivi téléphonique avec", "Conférence téléphonique avec"],
        "task": ["Préparer proposition pour", "Envoyer devis à", "Rédiger rapport pour"],
        "deadline": ["Date limite pour", "Échéance pour", "Fin de contrat avec"],
        "prospect": ["Prospection chez", "Démonstration pour", "Visite commerciale chez"],
        "note": ["Note sur", "Mémo concernant", "Rappel pour"]
      };
      
      // Use type assertion to tell TypeScript that category is a valid key
      const titleOptions = titles[category as keyof typeof titles] || titles["meeting"];
      const titlePrefix = titleOptions[Math.floor(Math.random() * titleOptions.length)];
      const title = `${titlePrefix} ${contact.name}`;
      
      events.push({
        id: `event-${year}-${month}-${day}-${i}`,
        title,
        start: startDate,
        end: endDate,
        category,
        contact: contact.id,
        priority: priority.id,
        description: `Événement avec ${contact.name} de ${contact.company}. Prévoir les documents nécessaires.`,
        location: Math.random() > 0.5 ? "Bureau" : `${contact.company} - Paris`,
        allDay: Math.random() > 0.9
      });
    }
  }
  
  return events;
};

const sampleEvents = generateEvents();

// Utility Components

// Enhanced tooltip component
const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group">
      {children}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        className={`absolute ${positionClasses[position]} z-50 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none`}
      >
        {content}
        <div className={`absolute ${
          position === 'top' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45' :
          position === 'bottom' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45' :
          position === 'left' ? 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45' :
          'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45'
        } w-2 h-2 bg-gray-800`}></div>
      </motion.div>
    </div>
  );
};

// Status badge component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const statusColors: StatusColorsType = {
    success: { bg: 'bg-green-100', text: 'text-green-700', icon: <FiCheck className="w-3 h-3" /> },
    warning: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FiAlertCircle className="w-3 h-3" /> },
    error: { bg: 'bg-red-100', text: 'text-red-700', icon: <FiX className="w-3 h-3" /> },
    info: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiInfo className="w-3 h-3" /> },
    pending: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <FiClock className="w-3 h-3" /> },
  };

  const sizeClasses: SizeClassesType = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  const statusStyle = statusColors[status] || statusColors.info;

  return (
    <span className={`${sizeClasses[size]} rounded-full font-medium inline-flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
      {statusStyle.icon}
      {text}
    </span>
  );
};

// Weather indicator component (visual only for demo)
const WeatherIndicator: React.FC<WeatherIndicatorProps> = ({ condition = 'clear', temperature = 22 }) => {
  const weatherIcons: WeatherIconsType = {
    clear: <FiSun className="text-amber-500" />,
    cloudy: <FiCloud className="text-gray-500" />,
    rain: <FiCloudRain className="text-blue-500" />,
    snow: <FiCloudSnow className="text-blue-200" />,
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      {weatherIcons[condition]}
      <span>{temperature}°C</span>
    </div>
  );
};

// Enhanced CircleStat component with improved visuals
// const CircleStat: React.FC<CircleStatProps> = ({ icon, color, size = 'md', pulse = false, onClick }) => {
//   const sizeClasses: CircleSizeClassesType = {
//     sm: { container: 'w-12 h-12', icon: 'w-5 h-5' },
//     md: { container: 'w-16 h-16', icon: 'w-6 h-6' },
//     lg: { container: 'w-20 h-20', icon: 'w-8 h-8' },
//   };

//   return (
//     <motion.div
//       whileHover={{ scale: 1.08, rotate: 3 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={onClick}
//       className={`relative ${sizeClasses[size].container} rounded-full flex items-center justify-center ${
//         onClick ? 'cursor-pointer' : ''
//       }`}
//       style={{
//         backgroundColor: `${color}15`,
//         border: `2px solid ${color}50`,
//         boxShadow: `0 4px 12px ${color}25`,
//         transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//       }}
//     >
//       <div 
//         className={`${sizeClasses[size].icon} flex items-center justify-center relative z-10`} 
//         style={{ color }}
//       >
//         {icon}
//       </div>
      
//       {/* Enhanced visual effects */}
//       <div 
//         className="absolute inset-0 rounded-full opacity-20" 
//         style={{ 
//           background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` 
//         }}
//       ></div>
      
//       {pulse && (
//         <span
//           className="absolute inset-0 rounded-full animate-ping opacity-30 duration-1000"
//           style={{ backgroundColor: color, animationDuration: '3s' }}
//         ></span>
//       )}
//     </motion.div>
//   );
// };

// Enhanced Event Modal with premium UI/UX features
const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onSave, onDelete, mode = 'view' }) => {
  // Extended event data with more options
  const [formData, setFormData] = useState<EventFormData>(() => {
    if (event) {
      return {
        ...event,
        isRecurring: event.isRecurring ?? false,
        recurrencePattern: event.recurrencePattern ?? 'none',
        reminderTime: event.reminderTime ?? '15',
        notes: event.notes ?? '',
        attachments: event.attachments ?? [],
        attendees: event.attendees ?? [],
      };
    }
    
    return {
      id: '', // Add empty id for new events
      title: '',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      category: 'meeting',
      contact: 1,
      priority: 'medium',
      description: '',
      location: 'Bureau',
      allDay: false,
      isRecurring: false,
      recurrencePattern: 'none', // none, daily, weekly, monthly, yearly
      reminderTime: '15', // minutes before
      notes: '',
      attachments: [],
      attendees: [],
    };
  });
  
  // UI state management
  const [activeTab, setActiveTab] = useState<string>('details');
  // const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  // const dragGhostRef = useRef<HTMLDivElement>(null);
  // const selectionBoxRef = useRef<HTMLDivElement>(null);
  const [animateColor, setAnimateColor] = useState<boolean>(false);
  // const [contextMenuPosition, setContextMenuPosition] = useState<PositionData | null>(null);
  // const [contextMenuEvent, setContextMenuEvent] = useState<EventType | null>(null);
  // const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        isRecurring: event.isRecurring || false,
        recurrencePattern: event.recurrencePattern || 'none',
        reminderTime: event.reminderTime || '15',
        notes: event.notes || '',
        attachments: event.attachments || [],
        attendees: event.attendees || [],
      });
    }
  }, [event]);

  useEffect(() => {
    // Add color animation when category changes
    if (formData.category) {
      setAnimateColor(true);
      const timer = setTimeout(() => setAnimateColor(false), 800);
      return () => clearTimeout(timer);
    }
  }, [formData.category]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    
    // Add escape key listener for closing
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure we have an ID for the event
    const eventToSave: EventType = {
      ...formData,
      id: formData.id || `event-${Date.now()}`
    };
    
    onSave(eventToSave);
  };

  // Generate recurrence text for display
  const getRecurrenceText = (): string => {
    if (!formData.isRecurring) return 'Pas de récurrence';
    
    switch(formData.recurrencePattern) {
      case 'daily': return 'Tous les jours';
      case 'weekly': return 'Toutes les semaines';
      case 'biweekly': return 'Toutes les deux semaines';
      case 'monthly': return 'Tous les mois';
      case 'yearly': return 'Tous les ans';
      default: return 'Personnalisé';
    }
  };

  const isEditMode = mode === 'edit' || mode === 'create';
  const categoryColor = formData.category ? eventCategories[formData.category]?.color ?? '#4F46E5' : '#4F46E5';

  // Keyboard shortcut help data
  // const keyboardShortcuts = [
  //   { key: 'Esc', action: 'Fermer' },
  //   { key: 'Ctrl+S', action: 'Enregistrer' },
  //   { key: 'Ctrl+E', action: 'Modifier' },
  //   { key: 'Ctrl+D', action: 'Supprimer' },
  //   { key: 'Tab', action: 'Naviguer entre les champs' },
  // ];

  // Template suggestions
  const templateSuggestions = [
    { name: 'Appel prospect', category: 'call', duration: 30 },
    { name: 'Réunion d\'équipe', category: 'meeting', duration: 60 },
    { name: 'Suivi client', category: 'call', duration: 20 },
    { name: 'Déjeuner d\'affaires', category: 'meeting', duration: 90 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-black/70 backdrop-blur-sm"
        onClick={() => onClose()}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300 
          }}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10"
          ref={modalRef}
        >
          {/* Enhanced decorative header with animated gradient */}
          <motion.div 
            initial={{ opacity: 0.7 }}
            animate={{ 
              opacity: animateColor ? [0.7, 1, 0.7] : 0.9,
              background: `linear-gradient(90deg, ${categoryColor}90 0%, ${categoryColor}70 35%, ${categoryColor}90 100%)`
            }}
            transition={{ duration: 1.5, repeat: animateColor ? 3 : 0 }}
            className="absolute inset-x-0 top-0 h-1.5"
          />
          
          {/* Pattern overlay for visual richness */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-5" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Side color decoration */}
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: categoryColor }}></div>
          
          {/* Modal header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center relative">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg shadow-sm" style={{ 
                backgroundColor: `${categoryColor}15`,
                boxShadow: `0 2px 10px ${categoryColor}20`
              }}>
                <motion.div 
                  animate={{ rotate: animateColor ? [0, 15, 0, -15, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ color: categoryColor }}
                >
                  {formData.category && eventCategories[formData.category]?.icon ? eventCategories[formData.category].icon : null}
                </motion.div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {mode === 'create' ? 'Nouvel événement' : mode === 'edit' ? 'Modifier l\'événement' : 'Détails de l\'événement'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {formData.category && eventCategories[formData.category].name}
                  </span>
                  {formData.isRecurring && (
                    <StatusBadge 
                      status="info" 
                      text={getRecurrenceText()} 
                      size="sm" 
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Header actions */}
            <div className="flex items-center gap-2">
              {mode !== 'create' && (
                <Tooltip content="Dupliquer (Ctrl+D)" position="bottom">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  >
                    <FiCopy className="w-4 h-4" />
                  </motion.button>
                </Tooltip>
              )}
              
              <Tooltip content="Raccourcis clavier" position="bottom">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show keyboard shortcuts (implementation would go here)
                  }}
                >
                  <FiCommand className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onClose()}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-100">
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'details' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('details')}
            >
              Détails
              {activeTab === 'details' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'schedule' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('schedule')}
            >
              Planification
              {activeTab === 'schedule' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'attendees' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('attendees')}
            >
              Participants
              {activeTab === 'attendees' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`px-4 py-3 text-sm font-medium relative ${activeTab === 'notes' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
              {activeTab === 'notes' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </motion.button>
          </div>
          
          {/* Modal body with animated transitions between tabs */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Title with smart suggestions */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Titre
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                            required
                            placeholder="Titre de l'événement"
                          />
                          {isEditMode && (
                            <Tooltip content="Modèles d'événement" position="left">
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                              >
                                <FiHash className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                        
                        {/* Template suggestions - only show when editing and title field is empty */}
                        {isEditMode && !formData.title && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {templateSuggestions.map((template, idx) => (
                              <motion.button
                                key={idx}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-full text-gray-700 flex items-center gap-1"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    title: template.name,
                                    category: template.category,
                                    end: new Date(new Date(formData.start).getTime() + template.duration * 60000)
                                  });
                                }}
                              >
                                <span>{template.name}</span>
                                <FiArrowRight className="w-3 h-3" />
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Category and priority */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Type d&apos;événement
                          </label>
                          <div className="relative">
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                              style={{
                                background: isEditMode ? 'white' : `linear-gradient(90deg, ${categoryColor}05 0%, white 50%)`
                              }}
                            >
                              {Object.entries(eventCategories).map(([id, category]) => (
                                <option key={id} value={id}>{category.name}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <FiChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Priorité
                          </label>
                          <div className="relative">
                            <select
                              id="priority"
                              name="priority"
                              value={formData.priority}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                            >
                              {priorities.map((priority) => (
                                <option key={priority.id} value={priority.id}>{priority.name}</option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <FiChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact with avatar */}
                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact principal
                        </label>
                        <div className="relative">
                          <select
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-12 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                          >
                            {sampleContacts.map((contact) => (
                              <option key={contact.id} value={contact.id}>{contact.name} - {contact.company}</option>
                            ))}
                          </select>
                          <div className="absolute left-2 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {sampleContacts.find(c => c.id === Number(formData.contact))?.name.charAt(0) || '?'}
                            </div>
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FiChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Location with map icon */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          Lieu
                          {formData.location && !isEditMode && (
                            <Tooltip content="Voir sur la carte" position="right">
                              <button
                                type="button"
                                className="p-1 text-indigo-600 rounded-full hover:bg-indigo-50"
                              >
                                <FiNavigation className="w-3 h-3" />
                              </button>
                            </Tooltip>
                          )}
                        </label>
                        <div className="relative">
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                            placeholder="Adresse ou lieu de l'événement"
                          />
                        </div>
                      </div>
                      
                      {/* Description with rich text controls */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        {isEditMode && (
                          <div className="flex items-center gap-1 mb-2 border-b border-gray-100 pb-2">
                            <Tooltip content="Gras" position="top">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiBold className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Liste" position="top">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiList className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Lien" position="top">
                              <button
                                type="button"
                                className="p-1.5 rounded hover:bg-gray-100 text-gray-700"
                              >
                                <FiLink className="w-3.5 h-3.5" />
                              </button>
                            </Tooltip>
                          </div>
                        )}
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                          placeholder="Description détaillée de l'événement"
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {/* Schedule Tab */}
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      {/* Date and time with improved UI */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                            Début
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="datetime-local"
                              id="start"
                              name="start"
                              value={formatDateForInput(formData.start)}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                            Fin
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="datetime-local"
                              id="end"
                              name="end"
                              value={formatDateForInput(formData.end)}
                              onChange={handleInputChange}
                              disabled={!isEditMode || formData.allDay}
                              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Duration indicator */}
                      {!formData.allDay && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <FiClock className="text-indigo-400" />
                          <span>
                            Durée : {Math.round((new Date(formData.end).getTime() - new Date(formData.start).getTime()) / (1000 * 60))} minutes
                          </span>
                        </div>
                      )}
                      
                      {/* All day switch with better styling */}
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <label htmlFor="allDay" className="text-sm font-medium text-gray-700 block">
                            Journée entière
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">
                            L&apos;événement durera toute la journée
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            id="allDay"
                            name="allDay"
                            checked={formData.allDay}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${formData.allDay ? 'bg-indigo-600' : 'bg-gray-200'} ${!isEditMode ? 'opacity-60' : ''}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.allDay ? 'translate-x-7' : 'translate-x-1'}`}></div>
                          </div>
                        </label>
                      </div>
                      
                      {/* Recurrence options */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 block">
                              Récurrence
                            </label>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Répéter l&apos;événement selon un schéma
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              id="isRecurring"
                              name="isRecurring"
                              checked={formData.isRecurring}
                              onChange={handleInputChange}
                              disabled={!isEditMode}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full transition-colors ${formData.isRecurring ? 'bg-indigo-600' : 'bg-gray-200'} ${!isEditMode ? 'opacity-60' : ''}`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${formData.isRecurring ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </div>
                          </label>
                        </div>
                        
                        {/* Show recurrence options when recurring is enabled */}
                        {formData.isRecurring && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 border-l-2 border-indigo-200"
                            >
                              <div className="space-y-3 pt-2">
                                <div>
                                  <label htmlFor="recurrencePattern" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fréquence
                                  </label>
                                  <div className="relative">
                                    <FiRepeat className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                      id="recurrencePattern"
                                      name="recurrencePattern"
                                      value={formData.recurrencePattern}
                                      onChange={handleInputChange}
                                      disabled={!isEditMode}
                                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                                    >
                                      <option value="daily">Quotidienne</option>
                                      <option value="weekly">Hebdomadaire</option>
                                      <option value="biweekly">Toutes les deux semaines</option>
                                      <option value="monthly">Mensuelle</option>
                                      <option value="yearly">Annuelle</option>
                                      <option value="custom">Personnalisée</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                      <FiChevronDown className="w-4 h-4" />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Visual recurrence summary */}
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                  <div className="text-xs text-indigo-700 font-medium">
                                    <div className="flex items-center gap-2">
                                      <FiInfo className="w-4 h-4" />
                                      <span>Résumé de la récurrence</span>
                                    </div>
                                    <div className="mt-1 pl-6">
                                      {getRecurrenceText()}
                                      {formData.recurrencePattern !== 'none' && `, à partir du ${new Date(formData.start).toLocaleDateString('fr-FR')}`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        )}
                      </div>
                      
                      {/* Reminder settings */}
                      <div>
                        <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                          Rappel
                        </label>
                        <div className="relative">
                          <FiBell className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select
                            id="reminderTime"
                            name="reminderTime"
                            value={formData.reminderTime}
                            onChange={handleInputChange}
                            disabled={!isEditMode}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500 appearance-none"
                          >
                            <option value="0">Pas de rappel</option>
                            <option value="5">5 minutes avant</option>
                            <option value="15">15 minutes avant</option>
                            <option value="30">30 minutes avant</option>
                            <option value="60">1 heure avant</option>
                            <option value="120">2 heures avant</option>
                            <option value="1440">1 jour avant</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FiChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Attendees Tab */}
                  {activeTab === 'attendees' && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-6 text-center px-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                          <FiUsers className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Gestion des participants</h3>
                        <p className="text-xs text-gray-500 mb-4 max-w-md">
                          Invitez des contacts à cet événement, suivez leur réponse et envoyez des rappels
                        </p>
                        {isEditMode && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 font-medium text-sm flex items-center gap-2"
                          >
                            <FiUserPlus className="w-4 h-4" />
                            Ajouter des participants
                          </motion.button>
                        )}
                      </div>
                      
                      {/* Sample attendees UI */}
                      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                              M
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Marie Dupont</div>
                              <div className="text-xs text-gray-500">marie.dupont@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="success" text="Accepté" />
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-medium">
                              J
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Jean Martin</div>
                              <div className="text-xs text-gray-500">jean.martin@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="pending" text="En attente" />
                        </div>
                        
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                              S
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Sophie Leclerc</div>
                              <div className="text-xs text-gray-500">sophie.leclerc@example.com</div>
                            </div>
                          </div>
                          <StatusBadge status="error" text="Refusé" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes personnelles
                        </label>
                        <p className="text-xs text-gray-500">
                          Ces notes ne sont visibles que par vous et ne sont pas partagées avec les participants
                        </p>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          disabled={!isEditMode}
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 text-gray-500"
                          placeholder="Ajoutez vos notes personnelles ici..."
                        ></textarea>
                      </div>
                      
                      {/* Attachments section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">
                            Pièces jointes
                          </label>
                          {isEditMode && (
                            <button 
                              type="button"
                              className="text-xs text-indigo-600 font-medium flex items-center gap-1"
                            >
                              <FiPlusCircle className="w-3.5 h-3.5" />
                              Ajouter un fichier
                            </button>
                          )}
                        </div>
                        
                        {/* Sample attachment */}
                        <div className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded">
                              <FiFileText className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">Présentation.pdf</div>
                              <div className="text-xs text-gray-500">2.4 MB - Ajouté le 24/03/2025</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                            >
                              <FiDownload className="w-4 h-4" />
                            </button>
                            {isEditMode && (
                              <button 
                                type="button"
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Modal footer with enhanced action buttons */}
            <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                {formData.id && mode !== 'create' && (
                  <Tooltip content="Supprimer cet événement">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => onDelete(formData.id)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition-all shadow-sm"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Supprimer
                    </motion.button>
                  </Tooltip>
                )}
                
                {mode !== 'create' && (
                  <Tooltip content="Partager cet événement">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <FiShare2 className="w-4 h-4" />
                    </motion.button>
                  </Tooltip>
                )}
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onClose()}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all shadow-sm"
                >
                  Annuler
                </motion.button>
                
                {isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 transition-all shadow-md"
                  >
                    <FiCheck className="w-4 h-4" />
                    Enregistrer
                  </motion.button>
                )}
                
                {!isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(79, 70, 229, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onClose('edit')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 transition-all shadow-md"
                  >
                    <FiEdit className="w-4 h-4" />
                    Modifier
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Calendar = () => {
  // Calendar state management
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month'); 
  const [events, setEvents] = useState<EventType[]>(sampleEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [ , setSelectedSlot] = useState<SlotData | null>(null);
  
  // Advanced drag and drop states
  const [draggedEvent, setDraggedEvent] = useState<EventType | null>(null);
  const [draggedOver, setDraggedOver] = useState<Date | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  // const [dragVisualElement, setDragVisualElement] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dropTargetIndicator, setDropTargetIndicator] = useState<DropTargetIndicatorType | null>(null);
  
  // Event resizing states
  const [resizingEvent, setResizingEvent] = useState<EventType | null>(null);
  const [resizeType, setResizeType] = useState<'start' | 'end' | null>(null);
  const [resizeInitialTime, setResizeInitialTime] = useState<Date | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  
  // Event creation states
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);
  const [creationStart, setCreationStart] = useState<Date | null>(null);
  const [creationEnd, setCreationEnd] = useState<Date | null>(null);
  const [creationArea, setCreationArea] = useState<CreationAreaType | null>(null);
  
  // Multi-select and batch operations
  const [multiselectEnabled, setMultiselectEnabled] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [ , setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<SelectionBoxType | null>(null);
  
  // UI interaction states
  // const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // const [showWeather, setShowWeather] = useState<boolean>(true);
  // const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<PositionData | null>(null);
  const [ , setContextMenuEvent] = useState<EventType | null>(null);
  const [nowIndicatorPosition, setNowIndicatorPosition] = useState<number>(0);
  
  // Filtering and display options
  const [filter, setFilter] = useState<FilterType>({
    categories: Object.keys(eventCategories),
    priority: priorities.map(p => p.id),
    search: '',
    dateRange: 'all', // 'all', 'today', 'week', 'month'
    showCompleted: true
  });
  
  // Refs for DOM elements
  const calendarRef = useRef<HTMLDivElement>(null);
  const weekTimeGridRef = useRef<HTMLDivElement>(null);
  const dayTimeGridRef = useRef<HTMLDivElement>(null);
  const dragGhostRef = useRef<HTMLDivElement>(null);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  
  // Screen size detection
  const [ , setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Now indicator for day/week views
  useEffect(() => {
    // Update the "now" indicator position
    const updateNowIndicator = () => {
      const now = new Date();
      const dayStart = new Date(now);
      dayStart.setHours(8, 0, 0, 0);
      const dayEnd = new Date(now);
      dayEnd.setHours(21, 0, 0, 0);

      if (now >= dayStart && now <= dayEnd) {
        const totalMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60);
        const minutesSinceStart = (now.getTime() - dayStart.getTime()) / (1000 * 60);
        const position = (minutesSinceStart / totalMinutes) * 100;
        setNowIndicatorPosition(position);
      }
    };

    updateNowIndicator();
    const intervalId = setInterval(updateNowIndicator, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Multiselect with Shift key
      if (e.shiftKey) {
        setMultiselectEnabled(true);
      }
      
      // Keyboard navigation and shortcuts
      switch (e.key) {
        case 'ArrowLeft':
          if (e.ctrlKey || e.metaKey) goToPrev();
          break;
        case 'ArrowRight':
          if (e.ctrlKey || e.metaKey) goToNext();
          break;
        case 't':
          if (e.ctrlKey || e.metaKey) goToToday();
          break;
        case 'm':
          if (e.ctrlKey || e.metaKey) setCurrentView('month');
          break;
        case 'w':
          if (e.ctrlKey || e.metaKey) setCurrentView('week');
          break;
        case 'd':
          if (e.ctrlKey || e.metaKey) setCurrentView('day');
          break;
        case 'n':
          if (e.ctrlKey || e.metaKey) openModal('create', null, { date: new Date() });
          break;
        case 'Delete':
        case 'Backspace':
          if (selectedEvents.length > 0) {
            // Batch delete selected events
            setEvents(events.filter(event => !selectedEvents.includes(event.id)));
            setSelectedEvents([]);
          }
          break;
        case 'Escape':
          setSelectedEvents([]);
          setMultiselectEnabled(false);
          setSelectionBox(null);
          if (contextMenuPosition) setContextMenuPosition(null);
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setMultiselectEnabled(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [events, selectedEvents, contextMenuPosition])
  
  // Setup drag and drop functionality
  useEffect(() => {
    if (dragGhostRef.current && draggedEvent) {
      const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && dragGhostRef.current) {
          // Update the position of the drag ghost
          dragGhostRef.current.style.left = `${e.clientX - dragOffset.x}px`;
          dragGhostRef.current.style.top = `${e.clientY - dragOffset.y}px`;
          
          // Find drop target based on mouse position
          if (calendarRef.current) {
            const calendarRect = calendarRef.current.getBoundingClientRect();
            const cellWidth = calendarRect.width / 7; // For month view
            const cellHeight = 20; // Approximate height for time slots in day/week view
            
            if (currentView === 'month') {
              const x = Math.floor((e.clientX - calendarRect.left) / cellWidth);
              const y = Math.floor((e.clientY - calendarRect.top) / cellHeight);
              // Set drop target indicator based on x, y coordinates
              // This would be used to highlight the target cell
              setDropTargetIndicator({ x, y });
            } else {
              // Similar logic for week/day views
              // ...
            }
          }
        }
      };
      
      const handleMouseUp = () => {
        if (isDragging) {
          // Finalize the drop
          handleDragEnd();
          setIsDragging(false);
          setDraggedEvent(null);
          setDragOffset({ x: 0, y: 0 });
          if (dragGhostRef.current) {
            dragGhostRef.current.style.display = 'none';
          }
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedEvent, isDragging, dragOffset, currentView]);
  
  // Setup multi-select drag functionality
  useEffect(() => {
    if (selectionBoxRef.current && selectionBox) {
      const handleMouseMove = (e: MouseEvent) => {
        if (selectionStart) {
          const currentBox = {
            left: Math.min(selectionStart.x, e.clientX),
            top: Math.min(selectionStart.y, e.clientY),
            width: Math.abs(e.clientX - selectionStart.x),
            height: Math.abs(e.clientY - selectionStart.y)
          };
          
          setSelectionBox(currentBox);
          
          // Update the selection box element
          const boxElem = selectionBoxRef.current;
          if (boxElem) {
            boxElem.style.left = `${currentBox.left}px`;
            boxElem.style.top = `${currentBox.top}px`;
            boxElem.style.width = `${currentBox.width}px`;
            boxElem.style.height = `${currentBox.height}px`;
            boxElem.style.display = 'block';
          }
          
          // Calculate which events are inside the selection box
          // This would involve checking each event element against the box coordinates
          // For now, we'll just simulate it:
          if (calendarRef.current) {
            // const calendarRect = calendarRef.current.getBoundingClientRect();
            const selectedEventsInBox = events.filter(() => {
              // In a real implementation, you would check if the event's DOM element
              // intersects with the selection box
              return Math.random() > 0.5; // Placeholder logic
            }).map(event => event.id);
            
            setSelectedEvents(selectedEventsInBox);
          }
        }
      };
      
      const handleMouseUp = () => {
        setSelectionStart(null);
        setSelectionEnd(null);
        
        // Keep the selected events, but hide the selection box
        if (selectionBoxRef.current) {
          selectionBoxRef.current.style.display = 'none';
        }
        setSelectionBox(null);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [selectionBox, selectionStart, events]);
  
  // Gestion du calendrier
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };
  
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const firstDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday as first day
    
    const totalDays = daysInMonth + firstDayOffset;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    const monthData = [];
    
    let dayCounter = 1;
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekDays = [];
      
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < firstDayOffset) || dayCounter > daysInMonth) {
          // Previous month or next month
          // const prevMonth = new Date(year, month, 0);
          // const nextMonth = new Date(year, month + 1, 1);
          let date;
          let isPrevMonth = false;
          
          if (week === 0 && day < firstDayOffset) {
            // Previous month
            date = new Date(year, month, 1 - (firstDayOffset - day));
            isPrevMonth = true;
          } else {
            // Next month
            date = new Date(year, month + 1, dayCounter - daysInMonth);
          }
          
          weekDays.push({
            date,
            dayOfMonth: date.getDate(),
            isCurrentMonth: false,
            isPrevMonth
          });
        } else {
          const date = new Date(year, month, dayCounter);
          
          weekDays.push({
            date,
            dayOfMonth: dayCounter,
            isCurrentMonth: true,
            isToday: isSameDay(date, new Date())
          });
          
          dayCounter++;
        }
      }
      
      monthData.push(weekDays);
    }
    
    return monthData;
  };
  
  const getWeekData = () => {
    const currentDay = currentDate.getDay() || 7; // 1-7 (Monday-Sunday)
    const mondayOffset = currentDay - 1;
    
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - mondayOffset);
    
    const weekData = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      
      weekData.push({
        date,
        dayOfMonth: date.getDate(),
        isToday: isSameDay(date, new Date())
      });
    }
    
    return weekData;
  };
  
  // Times for day and week view
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // 8:00 to 21:00
    return {
      hour,
      time: `${hour}:00`
    };
  });
  
  // Helpers
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  
  const formatTime = (date: Date): string => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const isEventInDay = (event: EventType, date: Date): boolean => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    if (event.allDay) {
      return isSameDay(eventStart, date);
    }
    
    // Check if any part of the event is on this day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return eventStart <= dayEnd && eventEnd >= dayStart;
  };
  
  const getEventsForDay = (date: Date): EventType[] => {
    return filteredEvents.filter(event => isEventInDay(event, date));
  };
  
  const getDisplayTimeForEvent = (event: EventType): string => {
    if (event.allDay) {
      return "Journée entière";
    }
    
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
  
  const getEventStyle = (event: EventType): EventStyleType => {
    const category = eventCategories[event.category];
    const color = category ? category.color : '#4F46E5';
    
    const isPast = new Date(event.end) < new Date();
    const opacity = isPast ? '0.6' : '1';
    
    return {
      backgroundColor: `${color}15`,
      borderLeft: `3px solid ${color}`,
      opacity
    };
  };
  
  const calculateEventPosition = (event: EventType, dayStart: number | Date, dayEnd: number | Date): EventPositionType => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    
    let top = 0;
    let height = 0;
    
    // Ensure dayStart and dayEnd are Date objects
    const dayStartDate = typeof dayStart === 'number' ? new Date(dayStart) : dayStart;
    const dayEndDate = typeof dayEnd === 'number' ? new Date(dayEnd) : dayEnd;
    
    // Calculate display time (clipped to day if needed)
    const displayStart = eventStart < dayStartDate ? dayStartDate : eventStart;
    const displayEnd = eventEnd > dayEndDate ? dayEndDate : eventEnd;
    
    // Calculate top position and height in percent
    const dayMinutes = (dayEndDate.getTime() - dayStartDate.getTime()) / (1000 * 60);
    const startMinutes = (displayStart.getTime() - dayStartDate.getTime()) / (1000 * 60);
    const endMinutes = (displayEnd.getTime() - dayStartDate.getTime()) / (1000 * 60);
    
    top = (startMinutes / dayMinutes) * 100;
    height = ((endMinutes - startMinutes) / dayMinutes) * 100;
    
    // Minimum height for visibility
    height = Math.max(height, 1.5);
    
    return { top, height };
  };
  
  // Navigation
  const goToPrev = (): void => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToNext = (): void => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  const goToToday = (): void => {
    setCurrentDate(new Date());
  };
  
  // Modal handlers
  const openModal = (mode: 'view' | 'edit' | 'create', event: EventType | null = null, slot: SlotData | null = null): void => {
    setModalMode(mode);
    
    if (event) {
      setSelectedEvent(event);
    } else if (slot) {
      setSelectedSlot(slot);
      
      // Create a new event draft
      const eventDraft: EventType = {
        id: `draft-${Date.now()}`, // Temporary ID
        title: '',
        start: slot.start || slot.date,
        end: slot.end || new Date(new Date(slot.date).setHours(new Date(slot.date).getHours() + 1)),
        category: slot.defaultCategory || 'meeting',
        contact: 1,
        priority: 'medium',
        description: '',
        location: 'Bureau',
        allDay: false
      };
      
      setSelectedEvent(eventDraft);
    }
    
    setIsModalOpen(true);
  };
  
  const closeModal = (nextMode?: string): void => {
    if (nextMode === 'edit') {
      setModalMode('edit');
    } else {
      setIsModalOpen(false);
      setSelectedEvent(null);
      setSelectedSlot(null);
      setModalMode('view');
    }
  };
  
  // Event handlers
  const handleEventClick = (event: EventType): void => {
    setSelectedEvent(event);
    openModal('view', event);
  };
  
  const handleSlotClick = (slot: SlotData): void => {
    setSelectedSlot(slot);
    openModal('create', null, slot);
  };

  const handleSaveEvent = (eventData: EventType): void => {
    if (eventData.id && events.some(e => e.id === eventData.id)) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === eventData.id ? eventData : event
      ));
    } else {
      // Create new event (ensure it has a proper ID)
      const newEvent: EventType = {
        ...eventData,
        id: eventData.id || `event-${Date.now()}`
      };
      
      setEvents([...events, newEvent]);
    }
    
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };
  
  const handleDeleteEvent = (eventId: string): void => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };
  
  // Enhanced drag and drop handling
  const handleDragStart = (event: EventType, e: React.MouseEvent): void => {
    e.stopPropagation();
    
    // Calculate drag offset from mouse position to event element corner
    const eventElement = e.currentTarget as HTMLElement;
    const rect = eventElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedEvent(event);
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    
    // Create visual ghost element for dragging
    if (dragGhostRef.current) {
      const ghost = dragGhostRef.current;
      ghost.innerHTML = `
        <div class="px-2 py-1 bg-white shadow-lg rounded-md border border-indigo-300" style="width: ${rect.width}px">
          <div class="text-xs font-semibold" style="color: ${eventCategories[event.category]?.color}">
            ${formatTime(event.start)} - ${formatTime(event.end)}
          </div>
          <div class="text-xs font-medium text-gray-800 truncate">
            ${event.title}
          </div>
        </div>
      `;
      ghost.style.position = 'fixed';
      ghost.style.zIndex = '9999';
      ghost.style.pointerEvents = 'none';
      ghost.style.left = `${e.clientX - offsetX}px`;
      ghost.style.top = `${e.clientY - offsetY}px`;
      ghost.style.opacity = '0.8';
      ghost.style.transform = 'rotate(2deg) scale(1.05)';
      ghost.style.display = 'block';
    }
    
    // Apply a visual effect to the original event to show it's being dragged
    eventElement.style.opacity = '0.5';
    eventElement.style.boxShadow = 'none';
  };
  
  const handleDragEnter = (date: Date, element: HTMLElement): void => {
    setDraggedOver(date);
    
    // Visual feedback for the drop target
    if (element) {
      element.classList.add('bg-indigo-100');
      element.style.transition = 'all 0.2s ease';
    }
  };
  
  const handleDragEnd = (): void => {
    if (draggedEvent && draggedOver) {
      const originalStart = new Date(draggedEvent.start);
      const originalEnd = new Date(draggedEvent.end);
      const targetDate = new Date(draggedOver);
      
      // Calculate the difference in days
      const diffTime = targetDate.getTime() - originalStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      // For time-based drag in week/day view
      let diffHours = 0;
      if (dropTargetIndicator && currentView !== 'month') {
        diffHours = Math.round(dropTargetIndicator.y / 4); // Approximate hours based on position
      }
      
      const newStart = new Date(originalStart);
      newStart.setDate(newStart.getDate() + diffDays);
      newStart.setHours(newStart.getHours() + diffHours);
      
      const duration = originalEnd.getTime() - originalStart.getTime();
      
      const newEnd = new Date(newStart.getTime() + duration);
      
      const updatedEvent = {
        ...draggedEvent,
        start: newStart,
        end: newEnd
      };
      
      // Smoothly update the events array with animation
      setEvents(prev => prev.map(e => 
        e.id === draggedEvent.id ? updatedEvent : e
      ));
      
      // Clear drag-related visual effects from all potential drop targets
      document.querySelectorAll('.calendar-cell').forEach(cell => {
        cell.classList.remove('bg-indigo-100');
      });
    }
    
    // Reset drag state
    setDraggedEvent(null);
    setDraggedOver(null);
    setDropTargetIndicator(null);
    setIsDragging(false);
    
    // Hide ghost element
    if (dragGhostRef.current) {
      dragGhostRef.current.style.display = 'none';
    }
  };
  
  // Event resizing functionality
  const handleResizeStart = (event: EventType, type: 'start' | 'end', e: React.MouseEvent) => {
    e.stopPropagation();
    
    setResizingEvent(event);
    setResizeType(type); // 'start' or 'end'
    setResizeInitialTime(type === 'start' ? event.start : event.end);
    setIsResizing(true);
    
    // Store initial mouse position
    const initialY = e.clientY;
    document.body.style.cursor = 'ns-resize';
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isResizing && resizingEvent && resizeInitialTime) {
        const deltaY = moveEvent.clientY - initialY;
        const deltaMinutes = Math.round(deltaY / 2); // Each pixel is about 2 minutes
        
        // Apply resize
        const updatedEvent = { ...resizingEvent };
        if (resizeType === 'start') {
          const newStart = new Date(resizeInitialTime);
          newStart.setMinutes(newStart.getMinutes() + deltaMinutes);
          
          // Ensure start time doesn't go past end time
          if (newStart < new Date(resizingEvent.end)) {
            updatedEvent.start = newStart;
          }
        } else {
          const newEnd = new Date(resizeInitialTime);
          newEnd.setMinutes(newEnd.getMinutes() + deltaMinutes);
          
          // Ensure end time doesn't go before start time
          if (newEnd > new Date(resizingEvent.start)) {
            updatedEvent.end = newEnd;
          }
        }
        
        // Visual feedback during resize
        const eventElement = document.getElementById(`event-${resizingEvent.id}`);
        if (eventElement) {
          const { top, height } = calculateEventPosition(
            updatedEvent,
            new Date(new Date().setHours(8, 0, 0, 0)),
            new Date(new Date().setHours(21, 0, 0, 0))
          );
          
          eventElement.style.top = `${top}%`;
          eventElement.style.height = `${height}%`;
          eventElement.style.transition = 'none'; // Disable transitions during resize
        }
      }
    };
    
    const handleMouseUp = () => {
      if (isResizing && resizingEvent) {
        // Finalize the resize
        const updatedEvent = { ...resizingEvent };
        
        // Apply the final time changes
        if (resizeType === 'start') {
          const newStart = new Date(updatedEvent.start);
          updatedEvent.start = newStart;
        } else {
          const newEnd = new Date(updatedEvent.end);
          updatedEvent.end = newEnd;
        }
        
        // Update the event in the events array
        setEvents(events.map(e => 
          e.id === resizingEvent.id ? updatedEvent : e
        ));
        
        // Reset resize state
        setResizingEvent(null);
        setResizeType(null);
        setResizeInitialTime(null);
        setIsResizing(false);
        document.body.style.cursor = 'default';
        
        // Re-enable transitions
        const eventElement = document.getElementById(`event-${resizingEvent.id}`);
        if (eventElement) {
          eventElement.style.transition = 'all 0.2s ease';
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  };
  
  // Event creation by drag-selecting time slots
  const handleCreationStart = (date: Date, hour: number, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only proceed with left mouse button
    
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    
    setCreationStart(startTime);
    setCreationEnd(startTime);
    setIsCreatingEvent(true);
    
    // Create visual area for the new event
    setCreationArea({
      date,
      top: hour * 60, // minutes from start of day
      height: 60 // initial height (1 hour)
    });
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isCreatingEvent && creationStart && dayTimeGridRef.current) {
        // Calculate the time at current mouse position
        const calendarRect = currentView === 'day' && dayTimeGridRef.current ? 
          dayTimeGridRef.current.getBoundingClientRect() : 
          weekTimeGridRef.current ? weekTimeGridRef.current.getBoundingClientRect() : null;
        
        if (calendarRect) {
          const relativeY = moveEvent.clientY - calendarRect.top;
          const totalHeight = calendarRect.height;
          const totalMinutes = 13 * 60; // 8:00 - 21:00 = 13 hours
          
          const minutesFromTop = Math.max(0, Math.min(totalMinutes, Math.round((relativeY / totalHeight) * totalMinutes)));
          const hoursFromTop = Math.floor(minutesFromTop / 60) + 8; // +8 because day starts at 8:00
          const minutesRemainder = minutesFromTop % 60;
          
          const currentEnd = new Date(creationStart);
          currentEnd.setHours(hoursFromTop, minutesRemainder, 0, 0);
          
          // Ensure end time is after start time
          if (currentEnd > creationStart) {
            setCreationEnd(currentEnd);
            
            // Update visual area
            const newHeight = (currentEnd.getTime() - creationStart.getTime()) / (1000 * 60); // height in minutes
            setCreationArea(prev => (prev ? {
              ...prev,
              height: newHeight
            } : null));
          }
        }
      }
    };
    
    const handleMouseUp = () => {
      if (isCreatingEvent && creationStart && creationEnd) {
        // Finalize the event creation
        openModal('create', null, {
          date: creationStart,
          start: creationStart,
          end: creationEnd
        });
        
        // Reset creation state
        setIsCreatingEvent(false);
        setCreationStart(null);
        setCreationEnd(null);
        setCreationArea(null);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  };
  
  // Multi-select events
  const handleMultiSelectStart = (e: React.MouseEvent): void => {
    if (!multiselectEnabled) return;
    
    // Start a selection box from current mouse position
    setSelectionStart({ x: e.clientX, y: e.clientY });
    setSelectionBox({
      left: e.clientX,
      top: e.clientY,
      width: 0,
      height: 0
    });
    
    // Clear any existing selection
    if (!e.shiftKey) {
      setSelectedEvents([]);
    }
  };
  
  // Handle clicking on an event with multi-select
  const handleEventSelection = (event: EventType, e: React.MouseEvent): void => {
    e.stopPropagation();
    
    if (multiselectEnabled) {
      setSelectedEvents(prev => {
        if (prev.includes(event.id)) {
          return prev.filter(id => id !== event.id);
        } else {
          return [...prev, event.id];
        }
      });
    } else {
      // Regular event click behavior
      handleEventClick(event);
    }
  };
  
  // Context menu for events
  const handleContextMenu = (event: EventType, e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenuEvent(event);
    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Filter
  const handleFilterChange = (key: string, value: FilterValueType): void => {
    setFilter({
      ...filter,
      [key]: value
    });
  };
  
  const handleCategoryToggle = (category: string): void => {
    const categories = [...filter.categories];
    const index = categories.indexOf(category);
    
    if (index > -1) {
      categories.splice(index, 1);
    } else {
      categories.push(category);
    }
    
    setFilter({
      ...filter,
      categories
    });
  };
  
  const handlePriorityToggle = (priority: string): void => {
    const priorities = [...filter.priority];
    const index = priorities.indexOf(priority);
    
    if (index > -1) {
      priorities.splice(index, 1);
    } else {
      priorities.push(priority);
    }
    
    setFilter({
      ...filter,
      priority: priorities
    });
  };
  
  // Get filtered events
  const filteredEvents = events.filter(event => {
    // Filter by category
    if (!filter.categories.includes(event.category)) {
      return false;
    }
    
    // Filter by priority
    if (!filter.priority.includes(event.priority)) {
      return false;
    }
    
    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const matchTitle = event.title.toLowerCase().includes(searchTerm);
      const matchDescription = event.description.toLowerCase().includes(searchTerm);
      const matchLocation = event.location.toLowerCase().includes(searchTerm);
      
      const contact = sampleContacts.find(c => c.id === event.contact);
      const matchContact = contact && (
        contact.name.toLowerCase().includes(searchTerm) || 
        contact.company.toLowerCase().includes(searchTerm)
      );
      
      if (!(matchTitle || matchDescription || matchLocation || matchContact)) {
        return false;
      }
    }
    
    return true;
  });
  
  // Get upcoming events (next 7 days)
  const getUpcomingEvents = (): EventType[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return filteredEvents
      .filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= today && eventStart < nextWeek;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  };
  
  const upcomingEvents = getUpcomingEvents();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen pb-10 bg-gray-50/50"
    >
      <div className="max-w-7xl mx-auto space-y-8 px-4 md:px-6">
        {/* Enhanced Header with more premium visuals */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          {/* Enhanced background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-blue-400/10 pointer-events-none"></div>
          
          {/* Animated decorative elements */}
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10,
              ease: "easeInOut"  
            }}
            className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
          ></motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 12,
              ease: "easeInOut",
              delay: 1  
            }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
          ></motion.div>
          
          {/* Enhanced particle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(#4F46E5 0.5px, transparent 0.5px), radial-gradient(#A855F7 0.5px, transparent 0.5px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px'
            }}
          ></div>
          
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 1.828 17.272 14.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544v-2.26zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97l-1.414 1.415L0 36.485v-2.83zm0 5.657L8.485 47.8l-1.414 1.414L0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.414 1.415L60 36.485v-2.83zm0 5.657L51.515 47.8l1.414 1.414L60 42.143v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 11.8l7.07 7.414z' fill='%234338ca' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0'
            }}
          ></div>
          
          <div className="relative p-8 z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-lg">
                <motion.div 
                  className="flex items-center gap-3 mb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <motion.div 
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                    className="p-3 bg-gradient-to-br from-indigo-600/20 to-indigo-600/10 rounded-xl shadow-md"
                    style={{
                      boxShadow: '0 8px 20px rgba(79, 70, 229, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  >
                    <FiCalendar className="w-7 h-7 text-indigo-600" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-indigo-900 drop-shadow-sm">
                      Calendrier
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <WeatherIndicator condition="clear" temperature={22} />
                      <span className="text-xs text-gray-500 border-l border-gray-300 pl-2">
                        Paris, FR
                      </span>
                    </div>
                  </div>
                </motion.div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Gérez vos rendez-vous, appels, tâches et suivez votre emploi du temps professionnel avec une interface premium.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Tooltip content="État de synchronisation" position="bottom">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 shadow-sm"
                    style={{
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)'
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"
                    ></motion.div>
                    <span className="text-sm font-medium text-gray-700">Synchronisation active</span>
                  </motion.div>
                </Tooltip>
                
                <div className="flex items-center gap-2">
                  <Tooltip content="Aujourd'hui" position="bottom">
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: 15 }}
                      whileTap={{ scale: 0.95, rotate: 30 }}
                      className="p-3 rounded-xl transition-all shadow-md bg-white text-gray-700 hover:bg-gray-50"
                      onClick={goToToday}
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <FiRefreshCw className="w-5 h-5" />
                    </motion.button>
                  </Tooltip>
                                    
                  <Tooltip content="Paramètres" position="bottom">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-md"
                      style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      <FiSettings className="w-5 h-5" />
                    </motion.button>
                  </Tooltip>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-indigo-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiCalendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">Total événements</div>
                  <div className="text-xl font-bold text-gray-800">{events.length}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-green-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiPhoneCall className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">Appels</div>
                  <div className="text-xl font-bold text-gray-800">{events.filter(e => e.category === 'call').length}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-purple-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiUsers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors">Rendez-vous</div>
                  <div className="text-xl font-bold text-gray-800">{events.filter(e => e.category === 'meeting').length}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-amber-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiClipboard className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-amber-600 transition-colors">Tâches</div>
                  <div className="text-xl font-bold text-gray-800">{events.filter(e => e.category === 'task').length}</div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-md flex items-center gap-4 group hover:border-rose-200 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <FiUserPlus className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 group-hover:text-rose-600 transition-colors">Prospects</div>
                  <div className="text-xl font-bold text-gray-800">{events.filter(e => e.category === 'prospect').length}</div>
                </div>
              </motion.div>
            </div>

            {/* Calendar Actions */}
            <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goToPrev}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {currentView === 'month' && (
                      new Date(currentDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
                    )}
                    {currentView === 'week' && (
                      `Semaine ${getWeekNumber(currentDate)} - ${new Date(currentDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`
                    )}
                    {currentView === 'day' && (
                      formatDate(currentDate)
                    )}
                  </h2>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goToNext}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiChevronRight className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToToday}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium transition-colors"
                >
                  Aujourd&apos;hui
                </motion.button>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex p-1 bg-indigo-50 rounded-lg shadow-sm">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('month')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      currentView === 'month' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                  >
                    Mois
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('week')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      currentView === 'week' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                  >
                    Semaine
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView('day')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      currentView === 'day' ? 'bg-white text-indigo-700 shadow-sm' : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                  >
                    Jour
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal('create', null, { date: new Date() })}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Nouvel événement
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            ref={calendarRef}
          >
            {/* Month View with enhanced drag-and-drop and multi-select */}
            {currentView === 'month' && (
              <div className="h-[800px] flex flex-col">
                <div className="grid grid-cols-7 border-b border-gray-100">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                    <div 
                      key={day} 
                      className={`py-4 text-center text-sm font-medium ${
                        index >= 5 ? 'text-indigo-400' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 grid grid-rows-6 min-h-0">
                  {getMonthData().map((week, weekIndex) => (
                    <div key={`week-${weekIndex}`} className="grid grid-cols-7 border-b border-gray-100 h-full">
                      {week.map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(day.date);
                        const isWeekend = dayIndex >= 5;
                        
                        return (
                          <div 
                            key={`day-${day.dayOfMonth}-${dayIndex}`}
                            className={`border-r border-gray-100 p-1 relative min-h-[100px] ${
                              isWeekend ? 'bg-gray-50/30' : ''
                            } ${
                              !day.isCurrentMonth ? 'opacity-40' : ''
                            } ${
                              day.isToday ? 'bg-indigo-50/50' : ''
                            } hover:bg-indigo-50/30 transition-colors group calendar-cell ${
                              draggedOver && isSameDay(new Date(draggedOver), day.date) ? 'bg-indigo-100/70' : ''
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              handleDragEnter(day.date, e.currentTarget);
                            }}
                            onDrop={() => handleDragEnd()}
                            onClick={() => handleSlotClick({ date: day.date })}
                            onMouseDown={(e) => handleMultiSelectStart(e)}
                          >
                            <div className="flex justify-between items-start px-1 py-1">
                              <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                                day.isToday ? 'bg-indigo-600 text-white' : 
                                day.isCurrentMonth ? (isWeekend ? 'text-indigo-400' : 'text-gray-700') : 
                                'text-gray-400'
                              }`}>
                                {day.dayOfMonth}
                              </span>
                              
                              <motion.button
                                initial={{ opacity: 0, scale: 0 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                style={{ boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSlotClick({ date: day.date });
                                }}
                              >
                                <FiPlus className="w-3 h-3" />
                              </motion.button>
                            </div>
                            
                            <div className="mt-1 overflow-y-auto max-h-[80px] space-y-1 px-1">
                              {dayEvents.length > 0 && dayEvents.slice(0, 3).map((event, eventIndex) => (
                                <motion.div
                                  key={`event-${eventIndex}-${event.id}`}
                                  id={`event-${event.id}`}
                                  className={`text-xs px-2 py-1 rounded-md truncate cursor-pointer transition-all hover:shadow-md ${
                                    selectedEvents.includes(event.id) ? 'ring-2 ring-indigo-500' : ''
                                  }`}
                                  style={{
                                    ...getEventStyle(event),
                                    boxShadow: selectedEvents.includes(event.id) ? '0 4px 12px rgba(79, 70, 229, 0.3)' : ''
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventSelection(event, e);
                                  }}
                                  onMouseDown={(e) => {
                                    if (e.button === 0) { // Left mouse button
                                      e.stopPropagation();
                                      handleDragStart(event, e);
                                    }
                                  }}
                                  onContextMenu={(e) => handleContextMenu(event, e)}
                                  whileHover={{ y: -2, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  draggable="true"
                                >
                                  <div className="flex items-center justify-between">
                                    {event.allDay && (
                                      <div className="font-semibold flex items-center gap-1 text-[10px] text-indigo-600">
                                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                        Journée
                                      </div>
                                    )}
                                    <div className="flex items-center text-[10px] text-gray-500">
                                      {!event.allDay && (
                                        <span>{formatTime(event.start)}</span>
                                      )}
                                      {eventCategories[event.category].icon && (
                                        <span className="ml-1" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                                          {React.isValidElement(eventCategories[event.category]?.icon) 
                                            ? React.cloneElement(eventCategories[event.category].icon as React.ReactElement<{className?: string}>, { className: 'w-2.5 h-2.5' }) 
                                            : eventCategories[event.category]?.icon}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="font-medium text-gray-800 truncate">
                                    {event.title}
                                  </div>
                                </motion.div>
                              ))}
                              
                              {dayEvents.length > 3 && (
                                <motion.div 
                                  className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600 font-medium cursor-pointer text-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Set the currentDate to this day and switch to day view
                                    setCurrentDate(day.date);
                                    setCurrentView('day');
                                  }}
                                  whileHover={{ y: -2, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  + {dayEvents.length - 3} autres
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Week View with enhanced time grid and resize handles */}
            {currentView === 'week' && (
              <div className="h-[800px] flex flex-col">
                <div className="grid grid-cols-8 border-b border-gray-100">
                  <div className="py-4 text-center text-sm font-medium text-gray-600 border-r border-gray-100">
                    Heures
                  </div>
                  {getWeekData().map((day, index) => (
                    <div 
                      key={`weekday-${index}`} 
                      className={`py-4 text-center ${
                        index >= 5 ? 'text-indigo-400' : 'text-gray-600'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                      </div>
                      <div className={`text-xl mt-1 font-semibold ${
                        day.isToday ? 'text-indigo-600' : (index >= 5 ? 'text-indigo-400' : 'text-gray-700')
                      }`}>
                        {day.dayOfMonth}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="grid grid-cols-8 relative divide-x divide-gray-100" ref={weekTimeGridRef}>
                    {/* Time labels */}
                    <div className="bg-gray-50/80 divide-y divide-gray-100">
                      {timeSlots.map((slot) => (
                        <div key={slot.hour} className="h-20 pr-2 text-right">
                          <span className="text-xs font-medium text-gray-500 relative -top-2">
                            {slot.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Now indicator (red line showing current time) */}
                    {getWeekData().some(day => day.isToday) && (
                      <div 
                        className="absolute left-0 right-0 h-0.5 bg-red-500 z-30 pointer-events-none" 
                        style={{ top: `${nowIndicatorPosition}%` }}
                      >
                        <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-red-500"></div>
                      </div>
                    )}
                    
                    {/* Days */}
                    {getWeekData().map((day, dayIndex) => {
                      const dayStart = new Date(day.date);
                      dayStart.setHours(8, 0, 0, 0);
                      
                      const dayEnd = new Date(day.date);
                      dayEnd.setHours(21, 0, 0, 0);
                      
                      const dayEvents = getEventsForDay(day.date);
                      
                      return (
                        <div 
                          key={`weekday-col-${dayIndex}`} 
                          className={`relative divide-y divide-gray-100 ${
                            dayIndex >= 5 ? 'bg-gray-50/30' : ''
                          } ${
                            day.isToday ? 'bg-indigo-50/30' : ''
                          } ${
                            draggedOver && isSameDay(new Date(draggedOver), day.date) ? 'bg-indigo-100/70' : ''
                          } calendar-cell`}
                          onDragOver={(e) => e.preventDefault()}
                          onDragEnter={(e) => handleDragEnter(day.date, e.currentTarget)}
                          onDrop={handleDragEnd}
                        >
                          {/* All-day events */}
                          {dayEvents.filter(e => e.allDay).length > 0 && (
                            <div className="absolute top-0 left-0 right-0 px-1 py-1 bg-indigo-50/50 border-b border-indigo-100 z-10">
                              {dayEvents.filter(e => e.allDay).map((event, eventIndex) => (
                                <motion.div
                                  key={`allday-${eventIndex}-${event.id}`}
                                  id={`event-${event.id}`}
                                  className={`text-xs px-2 py-1 mb-1 rounded-md truncate cursor-pointer transition-all hover:shadow-md bg-white ${
                                    selectedEvents.includes(event.id) ? 'ring-2 ring-indigo-500' : ''
                                  }`}
                                  style={getEventStyle(event)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventSelection(event, e);
                                  }}
                                  whileHover={{ y: -2, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onMouseDown={(e) => {
                                    if (e.button === 0) {
                                      e.stopPropagation();
                                      handleDragStart(event, e);
                                    }
                                  }}
                                  onContextMenu={(e) => handleContextMenu(event, e)}
                                  draggable="true"
                                >
                                  <div className="font-semibold flex items-center gap-1 text-[10px]" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventCategories[event.category].color }}></span>
                                    Journée
                                  </div>
                                  <div className="font-medium text-gray-800">{event.title}</div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          
                          {/* Time slots */}
                          {timeSlots.map((slot) => {
                            const slotTime = new Date(day.date);
                            slotTime.setHours(slot.hour, 0, 0, 0);
                            
                            const slotEndTime = new Date(day.date);
                            slotEndTime.setHours(slot.hour + 1, 0, 0, 0);
                            
                            return (
                              <div 
                                key={`timeslot-${dayIndex}-${slot.hour}`} 
                                className="h-20 relative hover:bg-indigo-50/30 transition-colors cursor-pointer time-slot"
                                onClick={() => handleSlotClick({ 
                                  date: day.date,
                                  start: slotTime,
                                  end: slotEndTime
                                })}
                                onMouseDown={(e) => handleCreationStart(day.date, slot.hour, e)}
                              ></div>
                            );
                          })}
                          
                          {/* Events */}
                          {dayEvents.filter(e => !e.allDay).map((event, eventIndex) => {
                            const category = eventCategories[event.category];
  
                            // Skip rendering if no category found
                            if (!category) return null;
                            const { top, height } = calculateEventPosition(
                              event, 
                              new Date(day.date).setHours(8, 0, 0, 0), 
                              new Date(day.date).setHours(21, 0, 0, 0)
                            );
                            
                            return (
                              <motion.div
                                key={`event-${eventIndex}-${event.id}`}
                                id={`event-${event.id}`}
                                className={`absolute left-0 right-0 mx-1 rounded-md px-2 py-1 overflow-hidden shadow-sm hover:shadow-md cursor-pointer z-20 ${
                                  selectedEvents.includes(event.id) ? 'ring-2 ring-indigo-500' : ''
                                }`}
                                style={{
                                  ...getEventStyle(event),
                                  top: `${top}%`,
                                  height: `${height}%`,
                                  maxHeight: `${height}%`,
                                  boxShadow: selectedEvents.includes(event.id) ? '0 4px 12px rgba(79, 70, 229, 0.3)' : ''
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventSelection(event, e);
                                }}
                                onMouseDown={(e) => {
                                  if (e.button === 0) {
                                    // Only middle area for drag
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const relativeY = e.clientY - rect.top;
                                    const percentage = relativeY / rect.height * 100;
                                    
                                    if (percentage < 15) {
                                      // Top area - resize start time
                                      handleResizeStart(event, 'start', e);
                                    } else if (percentage > 85) {
                                      // Bottom area - resize end time
                                      handleResizeStart(event, 'end', e);
                                    } else {
                                      // Middle area - drag the whole event
                                      e.stopPropagation();
                                      handleDragStart(event, e);
                                    }
                                  }
                                }}
                                onContextMenu={(e) => handleContextMenu(event, e)}
                                draggable="true"
                                whileHover={{
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                  scale: 1.01
                                }}
                              >
                                {/* Resize handles */}
                                <div className="absolute top-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                                
                                <div className="text-xs font-semibold" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                                  {formatTime(event.start)} - {formatTime(event.end)}
                                </div>
                                <div className="text-xs font-medium text-gray-800 truncate">
                                  {event.title}
                                </div>
                              </motion.div>
                            );
                          })}
                          
                          {/* Active event creation area */}
                          {isCreatingEvent && creationArea && isSameDay(new Date(creationArea.date), day.date) && (
                            <div 
                              className="absolute left-0 right-0 mx-1 bg-indigo-300/50 border border-indigo-400 rounded-md z-10"
                              style={{
                                top: `${(creationArea.top - 480) / (13 * 60) * 100}%`, // Adjust to grid
                                height: `${creationArea.height / (13 * 60) * 100}%`, // 13 hours (8AM-9PM) * 60 min
                              }}
                            ></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {/* Day View */}
            {currentView === 'day' && (
              <div className="h-[800px] flex flex-col">
                <div className="grid grid-cols-2 border-b border-gray-100">
                  <div className="py-4 text-center text-sm font-medium text-gray-600 border-r border-gray-100">
                    Heures
                  </div>
                  <div className="py-4 text-center">
                    <div className="text-sm font-medium text-gray-600">
                      {new Date(currentDate).toLocaleString('fr-FR', { weekday: 'long' })}
                    </div>
                    <div className="text-xl mt-1 font-semibold text-indigo-600">
                      {currentDate.getDate()}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="grid grid-cols-2 relative divide-x divide-gray-100">
                    {/* Time labels */}
                    <div className="bg-gray-50/80 divide-y divide-gray-100">
                      {timeSlots.map((slot) => (
                        <div key={slot.hour} className="h-20 pr-2 text-right">
                          <span className="text-xs font-medium text-gray-500 relative -top-2">
                            {slot.time}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Day column */}
                    <div className="relative divide-y divide-gray-100 bg-indigo-50/30">
                      {/* All-day events */}
                      {getEventsForDay(currentDate).filter(e => e.allDay).length > 0 && (
                        <div className="absolute top-0 left-0 right-0 px-1 py-1 bg-indigo-50/80 border-b border-indigo-100 z-10">
                          {getEventsForDay(currentDate).filter(e => e.allDay).map((event, eventIndex) => (
                            <div
                              key={`allday-${eventIndex}-${event.id}`}
                              className="text-xs px-2 py-1 mb-1 rounded-md cursor-pointer transition-all hover:shadow-md bg-white"
                              style={getEventStyle(event)}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="font-semibold flex items-center gap-1 text-[10px]" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventCategories[event.category].color }}></span>
                                Journée
                              </div>
                              <div className="font-medium text-gray-800">{event.title}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Time slots */}
                      {timeSlots.map((slot) => {
                        const slotTime = new Date(currentDate);
                        slotTime.setHours(slot.hour, 0, 0, 0);
                        
                        const slotEndTime = new Date(currentDate);
                        slotEndTime.setHours(slot.hour + 1, 0, 0, 0);
                        
                        return (
                          <div 
                            key={`timeslot-${slot.hour}`} 
                            className="h-20 relative hover:bg-indigo-50/50 transition-colors cursor-pointer"
                            onClick={() => handleSlotClick({ 
                              date: currentDate,
                              start: slotTime,
                              end: slotEndTime
                            })}
                          ></div>
                        );
                      })}
                      
                      {/* Events */}
                      {getEventsForDay(currentDate).filter(e => !e.allDay).map((event, eventIndex) => {
                        const { top, height } = calculateEventPosition(
                          event, 
                          new Date(currentDate).setHours(8, 0, 0, 0), 
                          new Date(currentDate).setHours(21, 0, 0, 0)
                        );
                        
                        return (
                          <div
                            key={`event-${eventIndex}-${event.id}`}
                            className="absolute left-0 right-0 mx-1 rounded-md px-2 py-1 overflow-hidden shadow-sm hover:shadow-md cursor-pointer z-20"
                            style={{
                              ...getEventStyle(event),
                              top: `${top}%`,
                              height: `${height}%`,
                              maxHeight: `${height}%`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <div className="text-xs font-semibold" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {event.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {event.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Search and filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={filter.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FiTag className="text-indigo-500" />
                  Types d&apos;événements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(eventCategories).map(([id, category]) => (
                    <button
                      key={id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                        filter.categories.includes(id) 
                          ? `bg-${id === 'call' ? 'green' : id === 'meeting' ? 'indigo' : id === 'task' ? 'amber' : 'purple'}-100 text-${id === 'call' ? 'green' : id === 'meeting' ? 'indigo' : id === 'task' ? 'amber' : 'purple'}-700` 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      style={{
                        backgroundColor: filter.categories.includes(id) ? `${category.color}15` : '',
                        color: filter.categories.includes(id) ? category.color : ''
                      }}
                      onClick={() => handleCategoryToggle(id)}
                    >
                      {category.icon}
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FiAlertCircle className="text-indigo-500" />
                  Priorité
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        filter.priority.includes(priority.id) 
                          ? `bg-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'green'}-100 text-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'green'}-700` 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                      style={{
                        backgroundColor: filter.priority.includes(priority.id) ? `${priority.color}15` : '',
                        color: filter.priority.includes(priority.id) ? priority.color : ''
                      }}
                      onClick={() => handlePriorityToggle(priority.id)}
                    >
                      {priority.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Upcoming events */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiClock className="text-indigo-500" />
                  Événements à venir
                </h3>
                <span className="text-xs text-gray-500">7 prochains jours</span>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                      <FiCalendar className="w-8 h-8 text-indigo-300" />
                    </div>
                    <p className="text-sm text-gray-500">Aucun événement à venir</p>
                  </div>
                ) : (
                  upcomingEvents.map((event, index) => {
                    const eventDay = new Date(event.start).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
                    const isToday = isSameDay(new Date(event.start), new Date());
                    
                    return (
                      <motion.div 
                        key={`upcoming-${index}-${event.id}`}
                        whileHover={{ x: 5 }}
                        className="p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded" style={{ backgroundColor: `${eventCategories[event.category].color}15` }}>
                              {eventCategories[event.category].icon}
                            </div>
                            <span className="text-xs font-semibold" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                              {eventCategories[event.category].name}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isToday ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isToday ? "Aujourd'hui" : eventDay}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">
                          {event.title}
                        </h4>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{getDisplayTimeForEvent(event)}</span>
                          <span className={`px-1.5 py-0.5 rounded-full ${
                            event.priority === 'high' ? 'bg-red-100 text-red-700' : 
                            event.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {priorities.find(p => p.id === event.priority)?.name || 'Normal'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              
              {upcomingEvents.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ x: -2 }}
                    className="text-xs text-indigo-600 font-medium flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    Voir tous les événements <FiChevronRight className="w-3 h-3" />
                  </motion.button>
                </div>
              )}
            </div>
            
            {/* Quick Add */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FiPlusCircle className="text-indigo-200" />
                Créer rapidement
              </h3>
              
              <div className="space-y-2">
                {Object.entries(eventCategories).map(([id, category]) => (
                  <motion.button
                    key={`quick-${id}`}
                    whileHover={{ x: 5 }}
                    whileTap={{ x: -2 }}
                    className="w-full p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center gap-2 text-sm"
                    onClick={() => openModal('create', null, { 
                      date: new Date(),
                      defaultCategory: id
                    })}
                  >
                    <div className="p-1.5 rounded-md" style={{ backgroundColor: `${category.color}20` }}>
                      {category.icon}
                    </div>
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Event Modal */}
        <EventModal 
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          mode={modalMode}
        />
      </div>
    </motion.div>
  );
};

export default Calendar;