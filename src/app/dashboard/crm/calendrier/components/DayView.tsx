import React from 'react';
import { motion } from 'framer-motion';
import { 
  DayViewProps, 
  TimeSlotType, 
  EventType 
} from '../CalendarInterfaces';
import { getEventStyle, formatTime, isSameDay, calculateEventPosition } from '../components/UIComponents';
import { eventCategories } from '../data/calendarData';

// Get time slots for the day
const getTimeSlots = (): TimeSlotType[] => {
  return Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // 8:00 to 21:00
    return {
      hour,
      time: `${hour}:00`
    };
  });
};

// Function to get events for the current day
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

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
  nowIndicatorPosition,
  timeGridRef
}) => {
  const timeSlots = getTimeSlots();
  const dayEvents = getEventsForDay(events, currentDate);

  return (
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
        <div className="grid grid-cols-2 relative divide-x divide-gray-100" ref={timeGridRef}>
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
            {/* Now indicator (red line showing current time) */}
            {isSameDay(currentDate, new Date()) && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-red-500 z-30 pointer-events-none" 
                style={{ top: `${nowIndicatorPosition}%` }}
              >
                <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-red-500"></div>
              </div>
            )}
            
            {/* All-day events */}
            {dayEvents.filter(e => e.allDay).length > 0 && (
              <div className="absolute top-0 left-0 right-0 px-1 py-1 bg-indigo-50/80 border-b border-indigo-100 z-10">
                {dayEvents.filter(e => e.allDay).map((event, eventIndex) => (
                  <div
                    key={`allday-${eventIndex}-${event.id}`}
                    className="text-xs px-2 py-1 mb-1 rounded-md cursor-pointer transition-all hover:shadow-md bg-white"
                    style={getEventStyle(event, eventCategories)}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-semibold flex items-center gap-1 text-[10px]" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eventCategories[event.category]?.color }}></span>
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
                  onClick={() => onSlotClick({ 
                    date: currentDate,
                    start: slotTime,
                    end: slotEndTime
                  })}
                ></div>
              );
            })}
            
            {/* Events */}
            {dayEvents.filter(e => !e.allDay).map((event, eventIndex) => {
              const { top, height } = calculateEventPosition(
                event, 
                new Date(currentDate).setHours(8, 0, 0, 0), 
                new Date(currentDate).setHours(21, 0, 0, 0)
              );
              
              return (
                <motion.div
                  key={`event-${eventIndex}-${event.id}`}
                  id={`event-${event.id}`}
                  className="absolute left-0 right-0 mx-1 rounded-md px-2 py-1 overflow-hidden shadow-sm hover:shadow-md cursor-pointer z-20"
                  style={{
                    ...getEventStyle(event, eventCategories),
                    top: `${top}%`,
                    height: `${height}%`,
                    maxHeight: `${height}%`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  whileHover={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    scale: 1.01
                  }}
                >
                  {/* Resize handles */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-transparent cursor-ns-resize hover:bg-indigo-200/50"></div>
                  
                  <div className="text-xs font-semibold" style={{ color: eventCategories[event.category]?.color || '#4F46E5' }}>
                    {formatTime(new Date(event.start))} - {formatTime(new Date(event.end))}
                  </div>
                  <div className="text-xs font-medium text-gray-800 truncate">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {event.location}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;