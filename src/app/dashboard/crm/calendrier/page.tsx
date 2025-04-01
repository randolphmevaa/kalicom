'use client';
import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
// import _ from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // FiClock, 
  FiPlus, 
  // FiTrash2, 
  // FiEdit, 
  FiChevronLeft, 
  FiChevronRight,
  FiCalendar,
  // FiSearch,
  FiRefreshCw,
  FiSettings,
  FiMenu,
  FiArrowLeft
} from 'react-icons/fi';

// Import interfaces
import {
  EventType,
  SlotData,
  FilterType,
  FilterValueType,
  // EventCategoriesType,
  // CalendarDayType,
  DropTargetIndicatorType,
  PositionData,
  SelectionBoxType,
  // TooltipProps,
  // StatusBadgeProps,
  // WeatherIndicatorProps
} from './CalendarInterfaces';

// Lazy load components
const EventModal = lazy(() => import('./components/EventModal'));
const MonthView = lazy(() => import('./components/MonthView'));
const WeekView = lazy(() => import('./components/WeekView'));
const DayView = lazy(() => import('./components/DayView'));
const CalendarSidebar = lazy(() => import('./components/CalendarSidebar'));

// Utility components - still importing directly as they're small
import { Tooltip, WeatherIndicator } from './components/UIComponents';

// Import calendar data (this could also be moved to a context or fetched from an API)
import { eventCategories, priorities, sampleContacts, generateEvents } from './data/calendarData';

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-indigo-600 font-medium">Chargement en cours...</p>
    </div>
  </div>
);

// Main Calendar component
const Calendar = () => {
  // Calendar state management
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<EventType[]>(generateEvents());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [ , setSelectedSlot] = useState<SlotData | null>(null);
  
  // Advanced drag and drop states
  const [draggedEvent, setDraggedEvent] = useState<EventType | null>(null);
  const [draggedOver, setDraggedOver] = useState<Date | null>(null);
  const [ , setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ , setIsDragging] = useState<boolean>(false);
  const [dropTargetIndicator, setDropTargetIndicator] = useState<DropTargetIndicatorType | null>(null);

  // Multi-select and batch operations
  const [ , setMultiselectEnabled] = useState<boolean>(false);
  // const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  // const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [ , setSelectionBox] = useState<SelectionBoxType | null>(null);
  
  // UI interaction states
  const [contextMenuPosition, setContextMenuPosition] = useState<PositionData | null>(null);
  // const [contextMenuEvent, setContextMenuEvent] = useState<EventType | null>(null);
  const [nowIndicatorPosition, setNowIndicatorPosition] = useState<number>(0);
  
  // Filtering and display options
  const [filter, setFilter] = useState<FilterType>({
    categories: Object.keys(eventCategories),
    priority: priorities.map(p => p.id),
    search: '',
    dateRange: 'all',
    showCompleted: true
  });
  
  // Refs for DOM elements
  const calendarRef = useRef<HTMLDivElement>(null);
  const weekTimeGridRef = useRef<HTMLDivElement>(null);
  const dayTimeGridRef = useRef<HTMLDivElement>(null);
  const dragGhostRef = useRef<HTMLDivElement>(null);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Calendar helpers
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // const isSameDay = (date1: Date, date2: Date): boolean => {
  //   return (
  //     date1.getFullYear() === date2.getFullYear() &&
  //     date1.getMonth() === date2.getMonth() &&
  //     date1.getDate() === date2.getDate()
  //   );
  // };

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
        location: '',
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

  // Handle drag operations
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

  // Time helpers
  const formatTime = (date: Date): string => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Filter handlers
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
  }, [events, selectedEvents, contextMenuPosition]);

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
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
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
                {/* Sidebar toggle button */}
                <Tooltip content={sidebarVisible ? "Masquer le panneau" : "Afficher le panneau"} position="bottom">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="p-3 rounded-xl transition-all shadow-md bg-white text-gray-700 hover:bg-gray-50"
                    style={{
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  >
                    {sidebarVisible ? <FiArrowLeft className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                  </motion.button>
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
        <div className="flex relative">
          {/* Calendar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${sidebarVisible ? 'w-3/4' : 'w-full'}`}
            style={{ transition: 'width 0.3s ease-in-out' }}
            ref={calendarRef}
          >
            {/* Render views based on currentView state with Suspense for lazy loading */}
            <Suspense fallback={<LoadingComponent />}>
              {currentView === 'month' && (
                <MonthView 
                  currentDate={currentDate}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  selectedEvents={selectedEvents}
                  draggedOver={draggedOver}
                />
              )}
              
              {currentView === 'week' && (
                <WeekView 
                  currentDate={currentDate}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                  nowIndicatorPosition={nowIndicatorPosition}
                  timeGridRef={weekTimeGridRef}
                  selectedEvents={selectedEvents}
                  draggedOver={draggedOver}
                />
              )}
              
              {currentView === 'day' && (
                <DayView 
                  currentDate={currentDate}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  onSlotClick={handleSlotClick}
                  nowIndicatorPosition={nowIndicatorPosition}
                  timeGridRef={dayTimeGridRef}
                />
              )}
            </Suspense>
          </motion.div>
          
          {/* Sidebar with Suspense */}
          <AnimatePresence>
            {sidebarVisible && (
              <Suspense fallback={<LoadingComponent />}>
                <CalendarSidebar 
                  filter={filter}
                  onFilterChange={handleFilterChange}
                  onCategoryToggle={handleCategoryToggle}
                  onPriorityToggle={handlePriorityToggle}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  onCreateEvent={openModal}
                />
              </Suspense>
            )}
          </AnimatePresence>
        </div>
        
        {/* Event Modal with Suspense */}
        <Suspense fallback={null}>
          {isModalOpen && (
            <EventModal 
              event={selectedEvent}
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveEvent}
              onDelete={handleDeleteEvent}
              mode={modalMode}
            />
          )}
        </Suspense>

        {/* Drag ghost (for drag & drop) */}
        <div ref={dragGhostRef} style={{ display: 'none' }} />
        
        {/* Selection box (for multi-select) */}
        <div 
          ref={selectionBoxRef} 
          style={{ 
            display: 'none',
            position: 'fixed',
            border: '2px dashed rgba(79, 70, 229, 0.4)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            zIndex: 20,
            pointerEvents: 'none'
          }} 
        />
      </div>
    </motion.div>
  );
};

export default Calendar;