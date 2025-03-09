'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiPlus, 
  FiFilter, 
  FiChevronLeft, 
  FiChevronRight, 
  // FiClock,
  FiUsers,
  FiUser,
  FiClipboard,
  FiPhone,
  FiList,
  // FiCheck,
  // FiX
} from 'react-icons/fi';

type FilterType = {
  group: string;
  assignee: string;
  eventType: string;
};


export default function Calendrier() {
  // State for calendar view and filters
  const [currentView, setCurrentView] = useState('mois');
  const [showFilters, setShowFilters] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current month and year
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Function to go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Functions to navigate between periods
  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'mois') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'semaine') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'jour') {
      newDate.setDate(newDate.getDate() - 1);
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
    }
    setCurrentDate(newDate);
  };

  // Generate calendar days for the month view
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const generateMonthCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    // Adjust for Sunday as first day (0) to Monday as first day (1)
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  // Sample events data
  const events = [
    { 
      id: 1, 
      title: 'Appel avec Marie Dupont', 
      date: new Date(2025, 2, 10, 14, 30), 
      type: 'appel',
      assignedTo: 'Jean Martin',
      group: 'Ventes' 
    },
    { 
      id: 2, 
      title: 'Réunion équipe marketing', 
      date: new Date(2025, 2, 12, 10, 0), 
      type: 'reunion',
      assignedTo: 'Sophie Leclerc',
      group: 'Marketing' 
    },
    { 
      id: 3, 
      title: 'Démo produit pour Nexus Tech', 
      date: new Date(2025, 2, 15, 11, 30), 
      type: 'demo',
      assignedTo: 'Thomas Bernard',
      group: 'Produit' 
    },
    { 
      id: 4, 
      title: 'Suivre proposition Zenith SA', 
      date: new Date(2025, 2, 8, 9, 0), 
      type: 'tache',
      assignedTo: 'Sophie Leclerc',
      group: 'Ventes' 
    },
    { 
      id: 5, 
      title: 'Formation CRM nouveaux collaborateurs', 
      date: new Date(2025, 2, 20, 14, 0), 
      type: 'formation',
      assignedTo: 'Jean Martin',
      group: 'RH' 
    },
  ];
  
  // Filter options
  const groupOptions = ['Tous', 'Ventes', 'Marketing', 'Produit', 'RH', 'Support'];
  const assigneeOptions = ['Tous', 'Jean Martin', 'Sophie Leclerc', 'Thomas Bernard', 'Marie Dupont'];
  const eventTypeOptions = ['Tous', 'Appel', 'Réunion', 'Démo', 'Tâche', 'Formation'];
  
  // Filter state
  const [filters, setFilters] = useState<FilterType>({
    group: 'Tous',
    assignee: 'Tous',
    eventType: 'Tous'
  });
  
  // Handler for filter changes
  const handleFilterChange = (field: keyof FilterType, value: string): void => {
    setFilters({
      ...filters,
      [field]: value
    });
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      group: 'Tous',
      assignee: 'Tous',
      eventType: 'Tous'
    });
  };

  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch(type) {
      case 'appel':
        return <FiPhone className="text-green-500" />;
      case 'reunion':
        return <FiUsers className="text-blue-500" />;
      case 'demo':
        return <FiClipboard className="text-purple-500" />;
      case 'tache':
        return <FiList className="text-amber-500" />;
      case 'formation':
        return <FiUser className="text-indigo-500" />;
      default:
        return <FiCalendar className="text-gray-500" />;
    }
  };

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
      default:
        return renderMonthView();
    }
  };

  // Month view rendering
  const renderMonthView = () => {
    const days = generateMonthCalendar();
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {dayNames.map((day, index) => (
            <div key={index} className="py-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => {
            // Get events for this day
            const dayEvents = day ? events.filter(event => {
              const eventDate = event.date;
              return eventDate.getDate() === day && 
                     eventDate.getMonth() === currentDate.getMonth() && 
                     eventDate.getFullYear() === currentDate.getFullYear();
            }) : [];
            
            // Filter events based on current filters
            const filteredEvents = dayEvents.filter(event => {
              return (filters.group === 'Tous' || event.group === filters.group) &&
                     (filters.assignee === 'Tous' || event.assignedTo === filters.assignee) &&
                     (filters.eventType === 'Tous' || event.type === filters.eventType.toLowerCase());
            });
            
            // Check if this day is today
            const isToday = day && 
              new Date().getDate() === day && 
              new Date().getMonth() === currentDate.getMonth() && 
              new Date().getFullYear() === currentDate.getFullYear();
            
            return (
              <div 
                key={index} 
                className={`min-h-24 border-b border-r p-1 ${day ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'bg-blue-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-right p-1 ${isToday ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                      {day}
                    </div>
                    <div className="space-y-1 mt-1">
                      {filteredEvents.slice(0, 3).map((event) => (
                        <div 
                          key={event.id} 
                          className="flex items-center p-1 text-xs rounded bg-indigo-50 text-indigo-700 truncate"
                        >
                          <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                          <span className="truncate">{event.title}</span>
                        </div>
                      ))}
                      {filteredEvents.length > 3 && (
                        <div className="text-xs text-center text-gray-500">
                          +{filteredEvents.length - 3} autres
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Week view rendering (simplified for now)
  const renderWeekView = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl text-center text-gray-600">Vue semaine</h3>
        <p className="text-center text-gray-500 mt-4">Affichage détaillé de la semaine en cours...</p>
      </div>
    );
  };

  // Day view rendering (simplified for now)
  const renderDayView = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl text-center text-gray-600">Vue jour</h3>
        <p className="text-center text-gray-500 mt-4">Affichage détaillé de la journée en cours...</p>
      </div>
    );
  };

  // Planning view rendering (simplified for now)
  const renderPlanningView = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl text-center text-gray-600">Vue planning</h3>
        <p className="text-center text-gray-500 mt-4">Vue planning des événements...</p>
      </div>
    );
  };

  // Agent view rendering (simplified for now)
  const renderAgentView = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl text-center text-gray-600">Vue agent</h3>
        <p className="text-center text-gray-500 mt-4">Calendrier par agent...</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white rounded-2xl shadow-xl">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-indigo-700 drop-shadow-md"
            >
              Calendrier
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez vos événements et vos rendez-vous
            </p>
          </div>
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiCalendar className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Calendar controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Date navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={previousPeriod}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  <FiChevronLeft className="text-gray-600" />
                </button>
                <div className="text-lg font-medium text-gray-800">
                  {currentMonth} {currentYear}
                </div>
                <button 
                  onClick={nextPeriod}
                  className="p-2 hover:bg-gray-100 rounded transition"
                >
                  <FiChevronRight className="text-gray-600" />
                </button>
              </div>
              <button 
                onClick={goToToday}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
              >
                Aujourd&apos;hui
              </button>
            </div>

            {/* Actions and views */}
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                <FiPlus />
                <span>Créer événement</span>
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
              >
                <FiFilter />
                <span>{showFilters ? 'Masquer filtres' : 'Afficher filtres'}</span>
              </button>
              
              <div className="hidden md:flex items-center border border-gray-300 rounded divide-x">
                <button 
                  onClick={() => setCurrentView('mois')}
                  className={`px-3 py-1 ${currentView === 'mois' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Mois
                </button>
                <button 
                  onClick={() => setCurrentView('semaine')}
                  className={`px-3 py-1 ${currentView === 'semaine' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Semaine
                </button>
                <button 
                  onClick={() => setCurrentView('jour')}
                  className={`px-3 py-1 ${currentView === 'jour' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Jour
                </button>
                <button 
                  onClick={() => setCurrentView('planning')}
                  className={`px-3 py-1 ${currentView === 'planning' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Planning
                </button>
                <button 
                  onClick={() => setCurrentView('agent')}
                  className={`px-3 py-1 ${currentView === 'agent' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} transition`}
                >
                  Agent
                </button>
              </div>
              
              {/* Mobile view selector */}
              <select 
                className="md:hidden border border-gray-300 rounded px-2 py-1 text-gray-700"
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
              >
                <option value="mois">Mois</option>
                <option value="semaine">Semaine</option>
                <option value="jour">Jour</option>
                <option value="planning">Planning</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-4 border-t overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filtrer par Groupe
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.group}
                    onChange={(e) => handleFilterChange('group', e.target.value)}
                  >
                    {groupOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigné à
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.assignee}
                    onChange={(e) => handleFilterChange('assignee', e.target.value)}
                  >
                    {assigneeOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d&apos;événement
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.eventType}
                    onChange={(e) => handleFilterChange('eventType', e.target.value)}
                  >
                    {eventTypeOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Appliquer le filtre
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Calendar view */}
        {renderCalendarView()}
      </div>
    </motion.div>
  );
}