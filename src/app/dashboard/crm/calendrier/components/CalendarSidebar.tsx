import React from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiTag,
  FiAlertCircle,
  FiClock,
  FiChevronRight,
  FiPlusCircle,
  FiCalendar
} from 'react-icons/fi';
import {
  CalendarSidebarProps,
  EventType,
  // SlotData
} from '../CalendarInterfaces';
import { formatTime, isSameDay } from '../components/UIComponents';
import { eventCategories, priorities } from '../data/calendarData';

// Get upcoming events (next 7 days)
const getUpcomingEvents = (events: EventType[]): EventType[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return events
    .filter(event => {
      const eventStart = new Date(event.start);
      return eventStart >= today && eventStart < nextWeek;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
};

// Get display time for event
const getDisplayTimeForEvent = (event: EventType): string => {
  if (event.allDay) {
    return "Journée entière";
  }
  
  const start = new Date(event.start);
  const end = new Date(event.end);
  
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  filter,
  onFilterChange,
  onCategoryToggle,
  onPriorityToggle,
  events,
  onEventClick,
  onCreateEvent
}) => {
  const upcomingEvents = getUpcomingEvents(events);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-1/4 ml-6 space-y-6"
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
            onChange={(e) => onFilterChange('search', e.target.value)}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5`}
                style={{
                  backgroundColor: filter.categories.includes(id) ? `${category.color}15` : '#f3f4f6',
                  color: filter.categories.includes(id) ? category.color : '#6b7280'
                }}
                onClick={() => onCategoryToggle(id)}
              >
                {React.cloneElement(
                category.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                { className: 'w-3.5 h-3.5', style: { color: category.color } }
                )}

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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium`}
                style={{
                  backgroundColor: filter.priority.includes(priority.id) ? `${priority.color}15` : '#f3f4f6',
                  color: filter.priority.includes(priority.id) ? priority.color : '#6b7280'
                }}
                onClick={() => onPriorityToggle(priority.id)}
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
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded" style={{ backgroundColor: `${eventCategories[event.category].color}15` }}>
                      {React.cloneElement(
                        eventCategories[event.category].icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                        { className: 'w-4 h-4', style: { color: eventCategories[event.category].color } }
                        )}
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
              onClick={() => onCreateEvent('create', null, { 
                date: new Date(),
                defaultCategory: id
              })}
            >
              <div className="p-1.5 rounded-md" style={{ backgroundColor: `${category.color}20` }}>
              {React.cloneElement(
                category.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
                { className: 'w-3.5 h-3.5', style: { color: category.color } }
                )}

              </div>
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarSidebar;