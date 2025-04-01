import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { 
  MonthViewProps, 
  // CalendarDayType, 
  EventType 
} from '../CalendarInterfaces';
import { getEventStyle, formatTime, isSameDay } from '../components/UIComponents';
import { eventCategories } from '../data/calendarData';

// Extracted calendar helper functions
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const getMonthData = (currentDate: Date) => {
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

// Get events that occur on a given date
const getEventsForDay = (events: EventType[], date: Date): EventType[] => {
  return events.filter(event => {
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
  });
};

const MonthView: React.FC<MonthViewProps> = ({ 
  currentDate,
  events,
  onEventClick,
  onSlotClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
  selectedEvents,
  draggedOver
}) => {
  const monthData = getMonthData(currentDate);

  return (
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
        {monthData.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 border-b border-gray-100 h-full">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(events, day.date);
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
                    onDragEnter(day.date, e.currentTarget);
                  }}
                  onDrop={() => onDragEnd()}
                  onClick={() => onSlotClick({ date: day.date })}
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
                        onSlotClick({ date: day.date });
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
                          ...getEventStyle(event, eventCategories),
                          boxShadow: selectedEvents.includes(event.id) ? '0 4px 12px rgba(79, 70, 229, 0.3)' : ''
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        onMouseDown={(e) => {
                          if (e.button === 0) { // Left mouse button
                            e.stopPropagation();
                            onDragStart(event, e);
                          }
                        }}
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
                              <span>{formatTime(new Date(event.start))}</span>
                            )}
                            {eventCategories[event.category]?.icon && (
                              <span className="ml-1" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                                {React.isValidElement(eventCategories[event.category]?.icon) 
                                  ? React.cloneElement(eventCategories[event.category].icon as React.ReactElement) 
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
                          // Could switch to day view here
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
  );
};

export default MonthView;